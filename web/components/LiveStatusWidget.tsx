'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, Zap, TrendingUp } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://crypto-signals-api.fly.dev';

interface SystemStatus {
  api_healthy: boolean;
  redis_latency_ms: number;
  last_signal_ts: string | null;
  signals_24h: number;
  uptime_s: number;
  timestamp: string;
}

export default function LiveStatusWidget() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/metrics/status`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) throw new Error('Failed to fetch status');

        const data = await response.json();
        setStatus(data);
        setError(false);
        setIsLoading(false);
      } catch (err) {
        console.error('Status fetch failed:', err);
        setError(true);
        setIsLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-gray-900/50 border border-gray-800">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-2 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-gray-800" />
            <div className="flex-1">
              <div className="h-3 bg-gray-800 rounded mb-1" />
              <div className="h-2 bg-gray-800 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
        <div className="flex items-center gap-2 text-red-400">
          <Activity className="w-4 h-4" />
          <span className="text-sm font-medium">Status unavailable</span>
        </div>
      </div>
    );
  }

  const getTimeSince = (ts: string | null) => {
    if (!ts) return 'No data';
    const diff = Date.now() - new Date(ts).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          status.api_healthy ? 'bg-green-500/10' : 'bg-red-500/10'
        }`}>
          <Activity className={`w-5 h-5 ${
            status.api_healthy ? 'text-green-400' : 'text-red-400'
          }`} />
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">API</p>
          <p className={`text-sm font-bold ${
            status.api_healthy ? 'text-green-400' : 'text-red-400'
          }`}>
            {status.api_healthy ? 'LIVE' : 'DOWN'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Database className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Redis</p>
          <p className="text-sm font-bold text-white">
            {status.redis_latency_ms > 0 ? `${status.redis_latency_ms}ms` : 'N/A'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <Zap className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Last Signal</p>
          <p className="text-sm font-bold text-white">
            {getTimeSince(status.last_signal_ts)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">24h Signals</p>
          <p className="text-sm font-bold text-white">
            {status.signals_24h.toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
