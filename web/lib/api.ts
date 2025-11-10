/**
 * API Client for Signals-Site
 * Handles all backend communication with Zod validation
 * PRD: cache:"no-store", runtime errors surface non-blocking banners
 * PRD B3.2: Error logging with Sentry placeholder
 */

import { API_BASE, USE_STAGING_SIGNALS } from './env';
import {
  SignalDTO,
  SignalDTOSchema,
  SignalDTOArraySchema,
  PnLPoint,
  PnLPointArraySchema,
  HealthCheck,
  HealthCheckSchema,
  SignalsQuery,
  SignalsQuerySchema,
  PnLQuery,
  PnLQuerySchema,
  safeParse,
} from './types';
import { logApiError } from './error-logger';

/**
 * API Error class for better error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchJSON<T>(
  url: string,
  schema: { parse: (data: unknown) => T },
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const apiError = new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response
      );
      logApiError(apiError, url);
      throw apiError;
    }

    const data = await response.json();
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    const apiError = new ApiError(
      error instanceof Error ? error.message : 'Unknown error',
      undefined,
      undefined
    );
    logApiError(apiError, url);
    throw apiError;
  }
}

/**
 * Get PnL data points with fallback hierarchy:
 * 1. Static backtest data (for transparent 12-month performance)
 * 2. Live API endpoint
 * 3. Client-side computation from signals
 *
 * @param n - Number of data points to fetch (default: 500)
 * @returns Array of PnL points with timestamp, equity, and daily_pnl
 */
export async function getPnL(n: number = 500): Promise<PnLPoint[]> {
  const query = PnLQuerySchema.parse({ n });

  // FIRST: Try loading static backtest data
  // This provides the verified 12-month backtest results shown in KPIs
  try {
    const response = await fetch('/data/backtest-pnl.json');
    if (response.ok) {
      const backtestData = await response.json();
      console.log('Loaded static backtest PnL data:', backtestData.metadata);

      // Use all data or resample to requested size
      const data = backtestData.data || [];
      if (data.length <= n || n >= 365) {
        return data;
      }

      // Resample if needed
      const { resamplePnLPoints } = await import('./pnl');
      return resamplePnLPoints(data, n);
    }
  } catch (error) {
    console.warn('Static backtest data not available:', error);
  }

  // SECOND: Try live API endpoint
  try {
    return await fetchJSON(
      `${API_BASE}/v1/pnl?n=${query.n}`,
      PnLPointArraySchema
    );
  } catch (error) {
    console.warn('PnL API endpoint unavailable:', error);
  }

  // THIRD: Fallback to client-side computation from signals
  try {
    const { aggregateSignalsToPnL, DEFAULT_PNL_CONFIG, resamplePnLPoints } = await import('./pnl');

    // Fetch recent signals
    const signals = await getSignals({ limit: Math.min(n * 2, 1000), mode: 'paper' });

    if (signals.length === 0) {
      return [];
    }

    // Aggregate signals into PnL points
    let pnlPoints = aggregateSignalsToPnL(signals, DEFAULT_PNL_CONFIG);

    // Resample if we have more points than requested
    if (pnlPoints.length > n) {
      pnlPoints = resamplePnLPoints(pnlPoints, n);
    }

    return pnlPoints;
  } catch (error) {
    console.error('All PnL data sources failed:', error);
    return [];
  }
}

/**
 * Get signals from API
 * @param opts - Query options (mode, pair, limit)
 * @returns Array of signals
 */
export async function getSignals(
  opts: Partial<SignalsQuery> = {}
): Promise<SignalDTO[]> {
  const query = SignalsQuerySchema.parse(opts);
  const params = new URLSearchParams({
    limit: query.limit.toString(),
  });

  // C1: Feature flag - use staging endpoint for multi-pair testing
  const endpoint = USE_STAGING_SIGNALS
    ? '/v1/signals/staging'
    : '/v1/signals';

  // Only add mode param for non-staging endpoint
  if (!USE_STAGING_SIGNALS) {
    params.set('mode', query.mode);
  }

  if (query.pair) {
    params.set('pair', query.pair);
  }

  return fetchJSON(
    `${API_BASE}${endpoint}?${params.toString()}`,
    SignalDTOArraySchema
  );
}

/**
 * Health check for API status
 * @returns Health status object
 */
export async function getHealth(): Promise<HealthCheck> {
  return fetchJSON(`${API_BASE}/v1/status/health`, HealthCheckSchema);
}

/**
 * SSE Connection Manager for real-time signals
 * Features:
 * - Exponential backoff reconnection (1s → 5s → 15s)
 * - Heartbeat detection (30s timeout)
 * - Automatic cleanup on disconnect
 */
export class SignalsStreamManager {
  private eventSource: EventSource | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelays = [1000, 5000, 15000, 15000, 15000]; // 1s, 5s, 15s, 15s, 15s
  private heartbeatTimeout = 30000; // 30 seconds
  private lastMessageTime = 0;

  constructor(
    private onMessage: (signal: SignalDTO) => void,
    private onError?: (error: Error) => void,
    private onConnect?: () => void,
    private onDisconnect?: () => void
  ) {}

  /**
   * Connect to SSE stream
   */
  connect(opts: Partial<SignalsQuery> = {}): void {
    if (this.eventSource) {
      console.warn('Already connected to SSE stream');
      return;
    }

    const query = SignalsQuerySchema.parse(opts);
    const params = new URLSearchParams({ mode: query.mode });
    const url = `${API_BASE}/v1/signals/stream?${params.toString()}`;

    try {
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        console.log('SSE connection established');
        this.reconnectAttempts = 0;
        this.lastMessageTime = Date.now();
        this.startHeartbeatMonitor();
        this.onConnect?.();
      };

      this.eventSource.onmessage = (event) => {
        try {
          // Update last message time (includes heartbeat comments)
          this.lastMessageTime = Date.now();
          this.resetHeartbeatMonitor();

          const data = JSON.parse(event.data);
          const signal = safeParse(SignalDTOSchema, data);

          if (signal) {
            this.onMessage(signal);
          } else {
            console.error('Invalid signal data received:', data);
          }
        } catch (error) {
          console.error('Failed to parse SSE message:', error);
          this.onError?.(
            error instanceof Error ? error : new Error('Parse error')
          );
        }
      };

      this.eventSource.onerror = (event) => {
        console.error('SSE connection error:', event);
        const { logSSEError } = require('./error-logger');
        logSSEError(new Error('SSE connection failed'), this.reconnectAttempts);
        this.handleDisconnect();
      };
    } catch (error) {
      console.error('Failed to create EventSource:', error);
      this.onError?.(
        error instanceof Error ? error : new Error('Connection failed')
      );
      this.handleDisconnect();
    }
  }

  /**
   * Start heartbeat monitor
   * If no message received in 30 seconds, reconnect
   */
  private startHeartbeatMonitor(): void {
    this.stopHeartbeatMonitor();
    this.heartbeatTimer = setTimeout(() => {
      const timeSinceLastMessage = Date.now() - this.lastMessageTime;
      if (timeSinceLastMessage >= this.heartbeatTimeout) {
        console.warn(`No heartbeat for ${timeSinceLastMessage}ms, reconnecting...`);
        this.handleDisconnect();
      }
    }, this.heartbeatTimeout);
  }

  /**
   * Reset heartbeat monitor
   */
  private resetHeartbeatMonitor(): void {
    this.startHeartbeatMonitor();
  }

  /**
   * Stop heartbeat monitor
   */
  private stopHeartbeatMonitor(): void {
    if (this.heartbeatTimer) {
      clearTimeout(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Disconnect from SSE stream
   */
  disconnect(): void {
    this.stopHeartbeatMonitor();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('SSE connection closed');
      this.onDisconnect?.();
    }
  }

  /**
   * Handle disconnection with exponential backoff reconnect
   * Backoff schedule: 1s → 5s → 15s → 15s → 15s
   */
  private handleDisconnect(): void {
    this.disconnect();

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.reconnectDelays[this.reconnectAttempts] || 15000;
      this.reconnectAttempts++;

      console.log(
        `Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      this.reconnectTimer = setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.onError?.(new Error('Failed to reconnect after multiple attempts'));
    }
  }

  /**
   * Check if currently connected
   */
  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}

/**
 * Legacy exports for backward compatibility
 */
export type { PnLPoint, SignalDTO } from './types';
