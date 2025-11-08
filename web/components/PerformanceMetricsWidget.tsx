/**
 * PerformanceMetricsWidget - Live Performance Metrics Dashboard
 *
 * Displays real-time trading performance metrics with SSE updates:
 * - Aggressive Mode Score
 * - Velocity to Target
 * - Days Remaining Estimate
 *
 * Features:
 * - Real-time SSE updates
 * - History tracking for sparklines
 * - Error handling and reconnection
 * - Loading states
 * - Responsive grid layout
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import PerformanceMetricsCard from './PerformanceMetricsCard';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface PerformanceMetrics {
  aggressive_mode_score: number;
  velocity_to_target: number;
  days_remaining_estimate: number | null;
  win_rate: number;
  current_equity_usd: number;
  target_equity_usd: number;
  total_trades: number;
  timestamp: number;
}

interface MetricHistory {
  aggressive: number[];
  velocity: number[];
  days_remaining: number[];
}

const MAX_HISTORY = 20; // Keep last 20 data points for sparkline

export default function PerformanceMetricsWidget() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [history, setHistory] = useState<MetricHistory>({
    aggressive: [],
    velocity: [],
    days_remaining: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Get API base URL from environment
  const getApiBaseUrl = () => {
    if (typeof window === 'undefined') return '';
    return process.env.NEXT_PUBLIC_API_BASE_URL || '';
  };

  // Fetch initial data
  const fetchInitialData = async () => {
    try {
      const apiBase = getApiBaseUrl();
      const response = await fetch(`${apiBase}/metrics/performance`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No metrics available yet. Waiting for trades...');
        }
        throw new Error(`Failed to fetch metrics: ${response.statusText}`);
      }

      const data = await response.json();
      setMetrics(data);

      // Initialize history with first data point
      setHistory({
        aggressive: [data.aggressive_mode_score],
        velocity: [data.velocity_to_target],
        days_remaining: data.days_remaining_estimate !== null ? [data.days_remaining_estimate] : [],
      });

      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching initial metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      setLoading(false);
    }
  };

  // Connect to SSE stream
  const connectSSE = () => {
    const apiBase = getApiBaseUrl();
    if (!apiBase) {
      setError('API URL not configured');
      return;
    }

    const eventSource = new EventSource(`${apiBase}/metrics/performance/stream?heartbeat=30`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('Performance metrics SSE connected');
      setConnected(true);
      setError(null);
    };

    // Handle complete performance snapshot
    eventSource.addEventListener('performance', (e) => {
      try {
        const eventData = JSON.parse(e.data);
        const data = eventData.data;

        // Parse numeric values
        const parsed: PerformanceMetrics = {
          aggressive_mode_score: parseFloat(data.aggressive_mode_score),
          velocity_to_target: parseFloat(data.velocity_to_target),
          days_remaining_estimate: data.days_remaining_estimate !== null && data.days_remaining_estimate !== 'None'
            ? parseFloat(data.days_remaining_estimate)
            : null,
          win_rate: parseFloat(data.win_rate),
          current_equity_usd: parseFloat(data.current_equity_usd),
          target_equity_usd: parseFloat(data.target_equity_usd),
          total_trades: parseInt(data.total_trades),
          timestamp: parseFloat(data.timestamp),
        };

        setMetrics(parsed);

        // Update history
        setHistory(prev => ({
          aggressive: [...prev.aggressive, parsed.aggressive_mode_score].slice(-MAX_HISTORY),
          velocity: [...prev.velocity, parsed.velocity_to_target].slice(-MAX_HISTORY),
          days_remaining: parsed.days_remaining_estimate !== null
            ? [...prev.days_remaining, parsed.days_remaining_estimate].slice(-MAX_HISTORY)
            : prev.days_remaining,
        }));

        setLoading(false);
      } catch (err) {
        console.error('Error parsing performance event:', err);
      }
    });

    // Handle individual metric updates
    eventSource.addEventListener('aggressive_mode_score', (e) => {
      try {
        const eventData = JSON.parse(e.data);
        const value = parseFloat(eventData.data.value);

        setMetrics(prev => prev ? { ...prev, aggressive_mode_score: value } : null);
        setHistory(prev => ({
          ...prev,
          aggressive: [...prev.aggressive, value].slice(-MAX_HISTORY),
        }));
      } catch (err) {
        console.error('Error parsing aggressive mode score event:', err);
      }
    });

    eventSource.addEventListener('velocity_to_target', (e) => {
      try {
        const eventData = JSON.parse(e.data);
        const value = parseFloat(eventData.data.value);

        setMetrics(prev => prev ? { ...prev, velocity_to_target: value } : null);
        setHistory(prev => ({
          ...prev,
          velocity: [...prev.velocity, value].slice(-MAX_HISTORY),
        }));
      } catch (err) {
        console.error('Error parsing velocity event:', err);
      }
    });

    eventSource.addEventListener('days_remaining', (e) => {
      try {
        const eventData = JSON.parse(e.data);
        const value = eventData.data.value !== null && eventData.data.value !== 'None'
          ? parseFloat(eventData.data.value)
          : null;

        setMetrics(prev => prev ? { ...prev, days_remaining_estimate: value } : null);
        if (value !== null) {
          setHistory(prev => ({
            ...prev,
            days_remaining: [...prev.days_remaining, value].slice(-MAX_HISTORY),
          }));
        }
      } catch (err) {
        console.error('Error parsing days remaining event:', err);
      }
    });

    eventSource.addEventListener('heartbeat', (e) => {
      console.log('Heartbeat received:', JSON.parse(e.data).timestamp);
    });

    eventSource.addEventListener('error', (e: any) => {
      const errorData = e.data ? JSON.parse(e.data) : {};
      console.error('SSE error event:', errorData);
      setError(`Stream error: ${errorData.message || 'Unknown error'}`);
    });

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err);
      setConnected(false);

      if (eventSource.readyState === EventSource.CLOSED) {
        setError('Connection lost. Reconnecting...');
        setTimeout(() => {
          connectSSE();
        }, 5000); // Reconnect after 5 seconds
      }
    };
  };

  // Initialize on mount
  useEffect(() => {
    fetchInitialData().then(() => {
      connectSSE();
    });

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  // Manual retry
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    fetchInitialData().then(() => {
      connectSSE();
    });
  };

  // Get interpretations
  const getAggressiveInterpretation = (score: number): string => {
    if (score >= 2.0) return 'Excellent - Strong risk-adjusted returns';
    if (score >= 1.5) return 'Very Good - Positive risk profile';
    if (score >= 1.0) return 'Good - Balanced performance';
    if (score >= 0.5) return 'Fair - Room for improvement';
    return 'Poor - Review strategy';
  };

  const getDaysRemainingInterpretation = (days: number | null): string => {
    if (days === null || days === Infinity) return 'Insufficient data';
    if (days < 7) return `Target within ${Math.round(days)} days!`;
    if (days < 30) return `On track - ${Math.round(days)} days to target`;
    if (days < 90) return `Moderate pace - ${Math.round(days)} days remaining`;
    return `Slow progress - ${Math.round(days)} days at current rate`;
  };

  // Error state
  if (error && !metrics) {
    return (
      <div className="p-6 rounded-xl bg-danger/5 border border-danger/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-danger mb-1">Unable to Load Metrics</h3>
            <p className="text-sm text-dim mb-3">{error}</p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-danger/10 hover:bg-danger/20
                         text-danger rounded-lg transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 rounded-xl bg-surface/50 border border-accent/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Connection indicator */}
      {!connected && !error && (
        <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 border border-warning/20 rounded-lg text-sm">
          <RefreshCw className="w-4 h-4 text-warning animate-spin" />
          <span className="text-warning">Reconnecting to live updates...</span>
        </div>
      )}

      {/* Error banner (when we have data but connection lost) */}
      {error && metrics && (
        <div className="flex items-center justify-between px-4 py-2 bg-warning/10 border border-warning/20 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning" />
            <span className="text-warning">{error}</span>
          </div>
          <button
            onClick={handleRetry}
            className="px-3 py-1 bg-warning/20 hover:bg-warning/30 text-warning rounded transition-colors text-xs font-medium"
          >
            Reconnect
          </button>
        </div>
      )}

      {/* Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <PerformanceMetricsCard
          metric="aggressive"
          label="Aggressive Mode Score"
          value={metrics.aggressive_mode_score}
          interpretation={getAggressiveInterpretation(metrics.aggressive_mode_score)}
          description="Risk-adjusted performance measure"
          history={history.aggressive}
        />

        <PerformanceMetricsCard
          metric="velocity"
          label="Velocity to Target"
          value={metrics.velocity_to_target}
          description={`Progress: $${metrics.current_equity_usd.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })} / $${metrics.target_equity_usd.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`}
          history={history.velocity}
        />

        <PerformanceMetricsCard
          metric="days_remaining"
          label="Days Remaining"
          value={metrics.days_remaining_estimate}
          interpretation={getDaysRemainingInterpretation(metrics.days_remaining_estimate)}
          description="Projected time to reach target"
          history={history.days_remaining}
        />
      </div>

      {/* Additional stats */}
      <div className="flex items-center justify-between text-xs text-dim px-2">
        <div>
          {metrics.total_trades} trades · {(metrics.win_rate * 100).toFixed(1)}% win rate
        </div>
        <div className="flex items-center gap-2">
          {connected && <div className="w-2 h-2 rounded-full bg-success animate-pulse" />}
          <span>Live updates</span>
        </div>
      </div>
    </div>
  );
}
