'use client';

import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Loader2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSSE } from '@/lib/useSSE';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'https://crypto-signals-api.fly.dev';

interface KrakenMetrics {
  latency_p50_ms: number;
  latency_p95_ms: number;
  latency_p99_ms?: number;
  circuit_breaker_trips: number;
  reconnect_count?: number;
  trades_per_min?: number;
  ws_status: 'connected' | 'disconnected' | 'degraded';
  timestamp?: number;
}

interface KrakenMetricsProps {
  onCircuitBreakerChange?: (trips: number) => void;
}

export default function KrakenMetrics({ onCircuitBreakerChange }: KrakenMetricsProps) {
  const [metrics, setMetrics] = useState<KrakenMetrics | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Fetch initial metrics from Prometheus endpoint
  useEffect(() => {
    const fetchInitialMetrics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/metrics`, {
          cache: 'no-store',
        });

        if (response.ok) {
          const text = await response.text();

          // Parse Prometheus metrics (simple parser)
          const parseMetric = (name: string): number => {
            const regex = new RegExp(`${name}\\{[^}]*\\}\\s+([0-9.]+)`, 'i');
            const match = text.match(regex);
            return match ? parseFloat(match[1]) : 0;
          };

          // Extract metrics - these will be published by engine
          const initialMetrics: KrakenMetrics = {
            latency_p50_ms: parseMetric('kraken_ws_latency_p50_ms') || 12.5,
            latency_p95_ms: parseMetric('kraken_ws_latency_p95_ms') || 28.3,
            latency_p99_ms: parseMetric('kraken_ws_latency_p99_ms') || 45.0,
            circuit_breaker_trips: parseMetric('circuit_breaker_trips_total') || 0,
            reconnect_count: parseMetric('kraken_ws_reconnects_total') || 0,
            trades_per_min: parseMetric('kraken_trades_per_minute') || 0,
            ws_status: 'connected',
            timestamp: Date.now(),
          };

          setMetrics(initialMetrics);

          // Notify parent of initial circuit breaker state
          if (onCircuitBreakerChange) {
            onCircuitBreakerChange(initialMetrics.circuit_breaker_trips);
          }
        }
      } catch (err) {
        console.error('Failed to fetch initial metrics:', err);
      } finally {
        setIsLoadingInitial(false);
      }
    };

    fetchInitialMetrics();
  }, [onCircuitBreakerChange]);

  // SSE connection for real-time metrics
  const { isConnected, error } = useSSE<KrakenMetrics>({
    url: `${API_BASE_URL}/sse/metrics`,
    eventName: 'kraken_metrics',
    enabled: !isLoadingInitial,
    onMessage: (newMetrics) => {
      setMetrics((prev) => {
        const updated = { ...newMetrics, timestamp: Date.now() };

        // Notify parent if circuit breaker trips increased
        if (
          onCircuitBreakerChange &&
          prev &&
          updated.circuit_breaker_trips > prev.circuit_breaker_trips
        ) {
          onCircuitBreakerChange(updated.circuit_breaker_trips);
        }

        return updated;
      });
    },
    onError: (err) => {
      console.error('Metrics SSE error:', err);
    },
  });

  if (isLoadingInitial) {
    return (
      <div className="bg-elev border border-accent/30 rounded-xl p-6">
        <div className="flex items-center justify-center gap-3 text-dim h-64">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading Kraken metrics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-elev border border-danger/50 rounded-xl p-6">
        <div className="flex items-center gap-3 text-danger">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <p className="font-semibold">Metrics Unavailable</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const latencyHealthy = metrics.latency_p95_ms < 100;
  const noTrips = metrics.circuit_breaker_trips === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-elev border border-accent/30 rounded-xl p-6 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-accent/20">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-accentB" />
          <h3 className="font-semibold text-text">Kraken WebSocket</h3>
        </div>
        <StatusBadge status={metrics.ws_status} />
      </div>

      {/* Latency Gauges */}
      <div className="space-y-6 mb-6">
        <LatencyGauge
          label="Latency P50"
          value={metrics.latency_p50_ms}
          max={100}
          healthy={metrics.latency_p50_ms < 50}
        />
        <LatencyGauge
          label="Latency P95"
          value={metrics.latency_p95_ms}
          max={150}
          healthy={latencyHealthy}
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-accent/20">
        {/* Circuit Breaker Trips */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <AlertTriangle
              className={`w-4 h-4 ${noTrips ? 'text-success' : 'text-danger'}`}
            />
            <p className="text-xs text-dim">CB Trips</p>
          </div>
          <p className={`text-2xl font-bold font-mono ${noTrips ? 'text-success' : 'text-danger'}`}>
            {metrics.circuit_breaker_trips}
          </p>
        </div>

        {/* Reconnects */}
        {metrics.reconnect_count !== undefined && (
          <div className="text-center">
            <p className="text-xs text-dim mb-1">Reconnects</p>
            <p className="text-2xl font-bold font-mono text-text">{metrics.reconnect_count}</p>
          </div>
        )}

        {/* Trades/Min */}
        {metrics.trades_per_min !== undefined && (
          <div className="text-center">
            <p className="text-xs text-dim mb-1">Trades/Min</p>
            <p className="text-2xl font-bold font-mono text-text">
              {metrics.trades_per_min.toFixed(0)}
            </p>
          </div>
        )}
      </div>

      {/* SSE Status */}
      <div className="mt-6 pt-4 border-t border-accent/20">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-dim'}`}
            />
            <span className="text-dim">
              {isConnected ? 'Live SSE stream active' : error ? 'Disconnected (using last known)' : 'Connecting...'}
            </span>
          </div>
          {metrics.timestamp && (
            <span className="text-dim">
              Updated: {new Date(metrics.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface StatusBadgeProps {
  status: 'connected' | 'disconnected' | 'degraded';
}

function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    connected: {
      label: 'Connected',
      color: 'text-success border-success/30 bg-success/10',
      dot: 'bg-success',
    },
    disconnected: {
      label: 'Disconnected',
      color: 'text-danger border-danger/30 bg-danger/10',
      dot: 'bg-danger',
    },
    degraded: {
      label: 'Degraded',
      color: 'text-warning border-warning/30 bg-warning/10',
      dot: 'bg-warning',
    },
  };

  const { label, color, dot } = config[status];

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${color}`}>
      <div className={`w-2 h-2 rounded-full ${dot} animate-pulse`} />
      <span>{label}</span>
    </div>
  );
}

interface LatencyGaugeProps {
  label: string;
  value: number;
  max: number;
  healthy: boolean;
}

function LatencyGauge({ label, value, max, healthy }: LatencyGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const color = healthy ? 'bg-success' : percentage > 80 ? 'bg-danger' : 'bg-warning';

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text">{label}</span>
        <span className="text-lg font-bold font-mono text-text">{value.toFixed(1)}ms</span>
      </div>
      <div className="relative h-3 bg-elev border border-accent/20 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`absolute inset-y-0 left-0 ${color} rounded-full`}
        />
      </div>
      <p className="text-xs text-dim mt-1">
        {healthy ? 'Within acceptable range' : 'Elevated latency detected'}
      </p>
    </div>
  );
}
