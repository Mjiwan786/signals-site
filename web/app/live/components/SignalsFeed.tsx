'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Loader2, AlertCircle, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSSE } from '@/lib/useSSE';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'https://crypto-signals-api.fly.dev';

interface Signal {
  id: string;
  ts: number;
  pair: string;
  side: string;
  entry: number;
  sl: number;
  tp: number;
  confidence: number;
  strategy: string;
  mode: string;
}

interface SignalsFeedProps {
  pair: string;
}

export default function SignalsFeed({ pair }: SignalsFeedProps) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [lastSignalTime, setLastSignalTime] = useState<number | null>(null);
  const [lastCheckedTime, setLastCheckedTime] = useState<number>(Date.now());

  // Fetch initial signals
  useEffect(() => {
    const fetchInitialSignals = async () => {
      try {
        setLastCheckedTime(Date.now());
        const response = await fetch(`${API_BASE_URL}/v1/signals?limit=20`, {
          cache: 'no-store',
        });

        if (response.ok) {
          const data: Signal[] = await response.json();
          const filtered = data.filter((s) => s.pair === pair);
          setSignals(filtered);

          // Track last signal time
          if (filtered.length > 0) {
            setLastSignalTime(filtered[0].ts);
          }
        }
      } catch (err) {
        console.error('Failed to fetch initial signals:', err);
      } finally {
        setIsLoadingInitial(false);
      }
    };

    fetchInitialSignals();
  }, [pair]);

  // SSE connection for live updates
  const { isConnected, error, reconnectAttempt } = useSSE<Signal>({
    url: `${API_BASE_URL}/v1/signals/stream?mode=paper`,
    onMessage: (signal) => {
      // Only add if matches selected pair
      if (signal.pair === pair) {
        setLastSignalTime(signal.ts);
        setSignals((prev) => {
          // Check if signal already exists
          if (prev.some((s) => s.id === signal.id)) return prev;
          // Add to beginning and keep last 20
          return [signal, ...prev].slice(0, 20);
        });
      }
    },
    onError: (err) => {
      console.error('SSE connection error:', err);
    },
  });

  if (isLoadingInitial) {
    return (
      <div className="bg-elev border border-accent/30 rounded-xl p-6 h-[500px]">
        <div className="flex items-center justify-center gap-3 text-dim h-full">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading signals feed...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-elev border border-accent/30 rounded-xl h-[500px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-accent/20">
        <div className="flex items-center gap-2">
          <Radio className={`w-4 h-4 ${isConnected ? 'text-success animate-pulse' : 'text-dim'}`} />
          <span className="text-sm font-medium text-text">
            {pair} Signals
          </span>
        </div>
        <ConnectionStatus
          isConnected={isConnected}
          error={error}
          reconnectAttempt={reconnectAttempt}
        />
      </div>

      {/* Signals List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {signals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center px-4"
            >
              <AlertCircle className="w-12 h-12 mb-3 text-dim" />
              <p className="text-base font-semibold text-text mb-2">No current signals</p>
              <p className="text-sm text-dim mb-4">
                No {pair} signals have been generated recently.
                <br />
                The engine is monitoring market conditions.
              </p>
              <div className="space-y-1 text-xs">
                <p className="text-dim">
                  Last checked: <span className="text-text font-mono">{formatTimestamp(lastCheckedTime)}</span>
                </p>
                {lastSignalTime && (
                  <p className="text-dim">
                    Last signal: <span className="text-text font-mono">{formatTimeAgo(lastSignalTime)}</span>
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            signals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
  reconnectAttempt: number;
}

function ConnectionStatus({ isConnected, error, reconnectAttempt }: ConnectionStatusProps) {
  if (isConnected) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-success/10 border border-success/30">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-xs font-medium text-success">Live</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-danger/10 border border-danger/30">
        <div className="w-2 h-2 rounded-full bg-danger" />
        <span className="text-xs font-medium text-danger">
          Reconnecting{reconnectAttempt > 0 ? ` (${reconnectAttempt})` : ''}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-warning/10 border border-warning/30">
      <Loader2 className="w-3 h-3 animate-spin text-warning" />
      <span className="text-xs font-medium text-warning">Connecting...</span>
    </div>
  );
}

interface SignalCardProps {
  signal: Signal;
}

function SignalCard({ signal }: SignalCardProps) {
  const isBuy = signal.side.toLowerCase() === 'buy';
  const timeAgo = formatTimeAgo(signal.ts);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
      className={`p-4 rounded-lg border ${
        isBuy
          ? 'bg-success/5 border-success/30'
          : 'bg-danger/5 border-danger/30'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {isBuy ? (
            <TrendingUp className="w-5 h-5 text-success" />
          ) : (
            <TrendingDown className="w-5 h-5 text-danger" />
          )}
          <div>
            <p className={`font-bold ${isBuy ? 'text-success' : 'text-danger'}`}>
              {signal.side.toUpperCase()} {signal.pair}
            </p>
            <p className="text-xs text-dim">{timeAgo}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-dim">Confidence</p>
          <p className="text-sm font-bold text-text">{(signal.confidence * 100).toFixed(0)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-dim">Entry</p>
          <p className="font-mono font-semibold text-text">${signal.entry.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-dim">Stop Loss</p>
          <p className="font-mono font-semibold text-danger">${signal.sl.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-dim">Take Profit</p>
          <p className="font-mono font-semibold text-success">${signal.tp.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-accent/10">
        <p className="text-xs text-dim">
          Strategy: <span className="text-text font-mono">{signal.strategy}</span>
        </p>
      </div>
    </motion.div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  if (seconds > 0) return `${seconds}s ago`;
  return 'Just now';
}

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
