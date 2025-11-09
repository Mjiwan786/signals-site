/**
 * Additional streaming hooks for PnL and enhanced LIVE status
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { PnLPoint, PnLPointSchema, safeParse } from './types';
import { API_BASE } from './env';

/**
 * Hook for PnL streaming via SSE
 * Manages connection and provides LIVE indicator status
 */
export function usePnLStream(enabled: boolean = true) {
  const [points, setPoints] = useState<PnLPoint[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 10;
  const MAX_POINTS = 500;

  const connect = useCallback(() => {
    if (!enabled || eventSourceRef.current) return;

    try {
      const url = `${API_BASE}/v1/pnl/stream`;
      const es = new EventSource(url);

      es.onopen = () => {
        console.log('PnL SSE connection established');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const point = safeParse(PnLPointSchema, data);

          if (point) {
            setPoints((prev) => {
              const updated = [...prev, point];
              // Keep only last MAX_POINTS
              return updated.slice(-MAX_POINTS);
            });
          } else {
            console.error('Invalid PnL point received:', data);
          }
        } catch (err) {
          console.error('Failed to parse PnL SSE message:', err);
        }
      };

      es.onerror = () => {
        console.error('PnL SSE connection error');
        setIsConnected(false);
        
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }

        // Attempt reconnect with exponential backoff
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current - 1), 10000);
          
          console.log(`Reconnecting PnL stream in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
          
          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          setError(new Error('Max reconnect attempts reached for PnL stream'));
        }
      };

      eventSourceRef.current = es;
    } catch (err) {
      console.error('Failed to create PnL EventSource:', err);
      setError(err instanceof Error ? err : new Error('Connection failed'));
      setIsConnected(false);
    }
  }, [enabled]);

  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    points,
    isConnected,
    error,
    disconnect,
    reconnect: connect,
  };
}

/**
 * Combined LIVE status hook
 * Monitors both signals and PnL streams
 */
export function useLiveStatus() {
  const [signalsConnected, setSignalsConnected] = useState(false);
  const [pnlConnected, setPnlConnected] = useState(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Track overall connection status
  const isLive = signalsConnected || pnlConnected;
  const isFullyConnected = signalsConnected && pnlConnected;

  return {
    isLive,
    isFullyConnected,
    signalsConnected,
    pnlConnected,
    lastActivity,
    setSignalsConnected,
    setPnlConnected,
    updateActivity: () => setLastActivity(Date.now()),
  };
}

/**
 * Hook for Signals streaming via SSE
 * Uses the new unified SSE endpoint
 */
export function useSignalsStream(mode: 'paper' | 'live' = 'paper', enabled: boolean = true) {
  const [signals, setSignals] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 10;
  const MAX_SIGNALS = 100;

  const connect = useCallback(() => {
    if (!enabled || eventSourceRef.current) return;

    try {
      const url = `${API_BASE}/streams/sse?type=signals&mode=${mode}`;
      const es = new EventSource(url);

      es.addEventListener('connected', () => {
        console.log('Signals SSE connection established');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      });

      es.addEventListener('signal', (event) => {
        try {
          const data = JSON.parse(event.data);

          setSignals((prev) => {
            const updated = [data, ...prev];
            return updated.slice(0, MAX_SIGNALS);
          });
        } catch (err) {
          console.error('Failed to parse signal SSE message:', err);
        }
      });

      es.onerror = () => {
        console.error('Signals SSE connection error');
        setIsConnected(false);

        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }

        // Attempt reconnect with exponential backoff
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current - 1), 10000);

          console.log(`Reconnecting signals stream in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);

          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          setError(new Error('Max reconnect attempts reached for signals stream'));
        }
      };

      eventSourceRef.current = es;
    } catch (err) {
      console.error('Failed to create signals EventSource:', err);
      setError(err instanceof Error ? err : new Error('Connection failed'));
      setIsConnected(false);
    }
  }, [enabled, mode]);

  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, mode, connect, disconnect]);

  return {
    signals,
    isConnected,
    error,
    disconnect,
    reconnect: connect,
  };
}

/**
 * Hook for Health Metrics streaming via SSE
 * Streams system health, Kraken metrics, and heartbeat
 */
export function useHealthStream(enabled: boolean = true) {
  const [metrics, setMetrics] = useState<Record<string, any>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 10;

  const connect = useCallback(() => {
    if (!enabled || eventSourceRef.current) return;

    try {
      const url = `${API_BASE}/streams/sse/health`;
      const es = new EventSource(url);

      es.addEventListener('connected', () => {
        console.log('Health SSE connection established');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      });

      es.addEventListener('health', (event) => {
        try {
          const data = JSON.parse(event.data);
          const { stream, data: streamData } = data;

          setMetrics((prev) => ({
            ...prev,
            [stream]: streamData
          }));
        } catch (err) {
          console.error('Failed to parse health SSE message:', err);
        }
      });

      es.onerror = () => {
        console.error('Health SSE connection error');
        setIsConnected(false);

        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }

        // Attempt reconnect with exponential backoff
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current - 1), 10000);

          console.log(`Reconnecting health stream in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);

          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          setError(new Error('Max reconnect attempts reached for health stream'));
        }
      };

      eventSourceRef.current = es;
    } catch (err) {
      console.error('Failed to create health EventSource:', err);
      setError(err instanceof Error ? err : new Error('Connection failed'));
      setIsConnected(false);
    }
  }, [enabled]);

  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    metrics,
    isConnected,
    error,
    disconnect,
    reconnect: connect,
  };
}
