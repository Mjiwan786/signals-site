/**
 * System Health Dashboard Component
 * Real-time monitoring via SSE of system metrics, Kraken WS health, and heartbeat
 */

'use client';

import { useHealthStream } from '@/lib/streaming-hooks';
import { Activity, Zap, Server, Wifi, AlertTriangle } from 'lucide-react';

export default function HealthDashboard() {
  const { metrics, isConnected, error } = useHealthStream(true);

  const systemMetrics = metrics['system:metrics'] || {};
  const krakenHealth = metrics['kraken:health'] || {};
  const heartbeat = metrics['ops:heartbeat'] || {};

  // Parse numeric values
  const redisLag = parseFloat(systemMetrics.redis_lag_ms) || 0;
  const lastSignal = parseFloat(systemMetrics.last_signal_seconds_ago) || 0;
  const agentsActive = parseInt(systemMetrics.agents_active) || 0;
  const totalTrades = parseInt(systemMetrics.total_trades) || 0;
  const systemHealth = systemMetrics.system_health || 'unknown';

  const krakenLatencyAvg = parseFloat(krakenHealth.latency_avg) || 0;
  const krakenLatencyP95 = parseFloat(krakenHealth.latency_p95) || 0;
  const circuitBreakerTrips = parseInt(krakenHealth.circuit_breaker_trips) || 0;
  const cbSpread = krakenHealth.cb_spread || '—';
  const cbLatency = krakenHealth.cb_latency || '—';

  const uptimeSeconds = parseInt(heartbeat.uptime_seconds) || 0;
  const heartbeatStatus = heartbeat.status || '—';

  // Calculate uptime in human-readable format
  const uptimeMinutes = Math.floor(uptimeSeconds / 60);
  const uptimeHours = Math.floor(uptimeMinutes / 60);
  const uptimeDays = Math.floor(uptimeHours / 24);
  const uptimeDisplay = uptimeDays > 0
    ? `${uptimeDays}d ${uptimeHours % 24}h`
    : uptimeHours > 0
    ? `${uptimeHours}h ${uptimeMinutes % 60}m`
    : `${uptimeMinutes}m`;

  // Health status indicators
  const getHealthColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'ok':
        return 'text-green-400';
      case 'degraded':
      case 'warning':
        return 'text-yellow-400';
      case 'unhealthy':
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getCircuitBreakerColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'closed':
        return 'text-green-400';
      case 'half_open':
        return 'text-yellow-400';
      case 'open':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-text">System Health</h2>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-dim">
            {isConnected ? 'Live' : error ? 'Disconnected' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* System Metrics Card */}
        <div className="glass-card rounded-xl p-6 border border-accent/20">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-text">System</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-dim">Health</span>
              <span className={`text-sm font-semibold ${getHealthColor(systemHealth)}`}>
                {systemHealth}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-dim">Redis Lag</span>
              <span
                className={`text-sm font-semibold ${
                  redisLag < 50 ? 'text-green-400' : redisLag < 200 ? 'text-yellow-400' : 'text-red-400'
                }`}
              >
                {redisLag.toFixed(1)}ms
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-dim">Last Signal</span>
              <span
                className={`text-sm font-semibold ${
                  lastSignal < 10 ? 'text-green-400' : lastSignal < 60 ? 'text-yellow-400' : 'text-red-400'
                }`}
              >
                {lastSignal.toFixed(1)}s ago
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-dim">Active Agents</span>
              <span className="text-sm font-semibold text-text">{agentsActive}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-dim">Total Trades</span>
              <span className="text-sm font-semibold text-text">{totalTrades}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-dim">Uptime</span>
              <span className="text-sm font-semibold text-text">{uptimeDisplay}</span>
            </div>
          </div>
        </div>

        {/* Kraken WebSocket Card */}
        <div className="glass-card rounded-xl p-6 border border-accent/20">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-text">Kraken WebSocket</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-dim">Avg Latency</span>
              <span
                className={`text-sm font-semibold ${
                  krakenLatencyAvg < 50 ? 'text-green-400' : krakenLatencyAvg < 100 ? 'text-yellow-400' : 'text-red-400'
                }`}
              >
                {krakenLatencyAvg.toFixed(1)}ms
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-dim">P95 Latency</span>
              <span
                className={`text-sm font-semibold ${
                  krakenLatencyP95 < 100 ? 'text-green-400' : krakenLatencyP95 < 200 ? 'text-yellow-400' : 'text-red-400'
                }`}
              >
                {krakenLatencyP95.toFixed(1)}ms
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-dim">CB Trips</span>
              <span
                className={`text-sm font-semibold ${
                  circuitBreakerTrips === 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {circuitBreakerTrips}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-dim">Spread CB</span>
              <span className={`text-sm font-semibold uppercase ${getCircuitBreakerColor(cbSpread)}`}>
                {cbSpread}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-dim">Latency CB</span>
              <span className={`text-sm font-semibold uppercase ${getCircuitBreakerColor(cbLatency)}`}>
                {cbLatency}
              </span>
            </div>
          </div>
        </div>

        {/* Heartbeat Card */}
        <div className="glass-card rounded-xl p-6 border border-accent/20">
          <div className="flex items-center gap-2 mb-4">
            <Wifi className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-text">Heartbeat</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-dim">Status</span>
              <span className={`text-sm font-semibold ${getHealthColor(heartbeatStatus)}`}>
                {heartbeatStatus}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-dim">Uptime</span>
              <span className="text-sm font-semibold text-text">{uptimeDisplay}</span>
            </div>
          </div>

          {/* Status Icon */}
          <div className="mt-6 flex items-center justify-center">
            {isConnected && systemHealth === 'healthy' ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-green-400" />
                </div>
                <span className="text-xs text-green-400 font-medium">System Operational</span>
              </div>
            ) : isConnected && systemHealth === 'degraded' ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-400" />
                </div>
                <span className="text-xs text-yellow-400 font-medium">Degraded Performance</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <span className="text-xs text-red-400 font-medium">Connection Lost</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-6 glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-sm text-red-400">{error.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
