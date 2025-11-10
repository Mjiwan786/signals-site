'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock, Activity, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'https://crypto-signals-api.fly.dev';

interface HealthData {
  status: string;
  redis_ping_ms: number;
  stream_lag_ms: number;
  last_event_age_ms: number;
  uptime_s: number;
  timestamp: string;
}

export default function SystemHealth() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        cache: 'no-store',
      });

      if (response.ok) {
        const data: HealthData = await response.json();
        setHealth(data);
        setError(null);
        setLastUpdate(new Date());
      } else {
        setError(`API returned status ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchHealth();

    // Poll every 10 seconds
    const interval = setInterval(fetchHealth, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return 'Never';
    const secondsAgo = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
    if (secondsAgo < 10) return 'Just now';
    return `${secondsAgo}s ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-elev border border-accent/30 rounded-xl p-6">
        <div className="flex items-center justify-center gap-3 text-dim">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading system health...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-elev border border-danger/50 rounded-xl p-6">
        <div className="flex items-center gap-3 text-danger">
          <XCircle className="w-6 h-6" />
          <div>
            <p className="font-semibold">System Unreachable</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!health) return null;

  const isHealthy = health.status === 'ok';
  const redisHealthy = health.redis_ping_ms < 100;
  const streamHealthy = health.stream_lag_ms < 5000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-elev border border-accent/30 rounded-xl p-6"
    >
      {/* Overall Status */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-accent/20">
        <div className="flex items-center gap-3">
          {isHealthy ? (
            <>
              <div className="relative">
                <CheckCircle2 className="w-8 h-8 text-success" />
                <div className="absolute inset-0 blur-md bg-success opacity-50 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-success">All Systems Operational</h3>
                <p className="text-sm text-dim">Engine running smoothly</p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-8 h-8 text-warning" />
              <div>
                <h3 className="text-xl font-semibold text-warning">System Degraded</h3>
                <p className="text-sm text-dim">Some services experiencing issues</p>
              </div>
            </>
          )}
        </div>

        <div className="text-right">
          <p className="text-xs text-dim">Last updated</p>
          <p className="text-sm text-text font-mono">{formatLastUpdate()}</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Uptime */}
        <MetricCard
          icon={<Clock className="w-5 h-5" />}
          label="Uptime"
          value={formatUptime(health.uptime_s)}
          status="success"
        />

        {/* Redis */}
        <MetricCard
          icon={<Activity className="w-5 h-5" />}
          label="Redis Ping"
          value={`${health.redis_ping_ms.toFixed(2)}ms`}
          status={redisHealthy ? 'success' : 'warning'}
        />

        {/* Stream Lag */}
        <MetricCard
          icon={<Activity className="w-5 h-5" />}
          label="Stream Lag"
          value={`${health.stream_lag_ms}ms`}
          status={streamHealthy ? 'success' : 'warning'}
        />

        {/* Last Signal */}
        <MetricCard
          icon={<Activity className="w-5 h-5" />}
          label="Last Signal"
          value={`${(health.last_event_age_ms / 1000).toFixed(0)}s ago`}
          status={health.last_event_age_ms < 60000 ? 'success' : 'warning'}
        />
      </div>

      {/* Heartbeat Indicator */}
      <div className="mt-6 pt-6 border-t border-accent/20">
        <div className="flex items-center gap-2 text-xs text-dim">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>Engine Heartbeat: Active</span>
        </div>
      </div>
    </motion.div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: 'success' | 'warning' | 'danger';
}

function MetricCard({ icon, label, value, status }: MetricCardProps) {
  const statusColors = {
    success: 'text-success border-success/30 bg-success/5',
    warning: 'text-warning border-warning/30 bg-warning/5',
    danger: 'text-danger border-danger/30 bg-danger/5',
  };

  return (
    <div className={`border rounded-lg p-4 ${statusColors[status]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs font-medium opacity-70">{label}</p>
      </div>
      <p className="text-lg font-bold font-mono">{value}</p>
    </div>
  );
}
