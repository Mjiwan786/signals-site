/**
 * Live Signals Feed with SSE
 * Real-time signal streaming from signals-api
 */

'use client';

import { useSignalsStream } from '@/lib/streaming-hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Zap } from 'lucide-react';

interface SignalsFeedProps {
  mode?: 'paper' | 'live' | 'staging';
  maxSignals?: number;
}

export default function SignalsFeedSSE({ mode = 'paper', maxSignals = 50 }: SignalsFeedProps) {
  const { signals, isConnected, error } = useSignalsStream(mode, true);

  const formatTime = (timestamp: number | string) => {
    const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    const date = new Date(ts * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatPrice = (price: number | string) => {
    const p = typeof price === 'string' ? parseFloat(price) : price;
    return p.toFixed(2);
  };

  const getSideColor = (side: string) => {
    const normalizedSide = side.toLowerCase();
    if (normalizedSide === 'buy' || normalizedSide === 'long') {
      return 'text-green-400 bg-green-500/10 border-green-500/30';
    }
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  const getConfidenceColor = (confidence: number | string) => {
    const conf = typeof confidence === 'string' ? parseFloat(confidence) : confidence;
    if (conf >= 0.8) return 'text-green-400';
    if (conf >= 0.6) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const displaySignals = signals.slice(0, maxSignals);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-text">Live Signals</h2>
          <span className="text-sm text-dim px-3 py-1 bg-surface/50 rounded-full">
            {mode === 'staging' ? 'Staging (New Pairs)' : mode === 'paper' ? 'Paper Trading' : 'Live Trading'}
          </span>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-dim">
            {isConnected ? `Live • ${signals.length} signals` : error ? 'Disconnected' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Signals Container */}
      <div className="glass-card rounded-xl border border-accent/20 overflow-hidden">
        {/* Table Header */}
        <div className="bg-surface/50 border-b border-accent/10 px-6 py-3">
          <div className="grid grid-cols-6 gap-4 text-xs font-medium text-dim uppercase tracking-wider">
            <div>Time</div>
            <div>Pair</div>
            <div>Side</div>
            <div className="text-right">Entry</div>
            <div className="text-right">Confidence</div>
            <div>Strategy</div>
          </div>
        </div>

        {/* Signals List */}
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          {displaySignals.length > 0 ? (
            <AnimatePresence initial={false}>
              {displaySignals.map((signal, index) => (
                <motion.div
                  key={signal.id || `signal-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-accent/5 last:border-0 hover:bg-accent/5 transition-colors"
                >
                  <div className="grid grid-cols-6 gap-4 px-6 py-4 items-center">
                    {/* Time */}
                    <div className="text-sm text-dim">
                      {formatTime(signal.ts || signal.timestamp)}
                    </div>

                    {/* Pair */}
                    <div className="text-sm font-medium text-text">
                      {signal.pair || signal.symbol}
                    </div>

                    {/* Side */}
                    <div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border ${getSideColor(
                          signal.side || signal.action
                        )}`}
                      >
                        {(signal.side || signal.action).toUpperCase()}
                      </span>
                    </div>

                    {/* Entry Price */}
                    <div className="text-sm font-mono text-right text-text">
                      ${formatPrice(signal.entry || signal.price)}
                    </div>

                    {/* Confidence */}
                    <div className="text-right">
                      <span
                        className={`text-sm font-semibold ${getConfidenceColor(
                          signal.confidence
                        )}`}
                      >
                        {(typeof signal.confidence === 'number' ? signal.confidence * 100 : parseFloat(signal.confidence) * 100).toFixed(0)}%
                      </span>
                    </div>

                    {/* Strategy */}
                    <div className="text-xs text-dim uppercase tracking-wider">
                      {signal.strategy || signal.mode || '—'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <TrendingUp className="w-12 h-12 text-dim mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">No Signals Yet</h3>
              <p className="text-dim text-center max-w-md">
                {isConnected
                  ? 'Waiting for trading signals from the AI engine...'
                  : 'Connecting to signal stream...'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 glass-card rounded-xl p-4 border border-red-500/30 bg-red-500/10">
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-400">{error.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
