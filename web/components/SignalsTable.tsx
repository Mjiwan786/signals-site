'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Filter,
  Activity,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';
import type { SignalDTO } from '@/lib/api';
import { getSignals } from '@/lib/api';
import { DEFAULT_MODE } from '@/lib/env';

/**
 * SignalsTable - Enhanced signals feed with dark theme and animations
 *
 * Features:
 * - Zebra-striped rows with glass morphism
 * - Animated row entrance with stagger effect
 * - Color-coded buy/sell indicators
 * - Minimalistic icons from Lucide
 * - Responsive design with horizontal scroll
 * - Real-time refresh capability
 * - Mode toggle (paper/live) and pair filtering
 */

export default function SignalsTable() {
  const [mode, setMode] = useState<'paper' | 'live' | 'staging'>(DEFAULT_MODE as any);
  const [pair, setPair] = useState<string>('');
  const [rows, setRows] = useState<SignalDTO[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    setErr(null);
    getSignals({ mode, pair: pair || undefined, limit: 200 })
      .then((data) => {
        setRows(data);
        setErr(null);
      })
      .catch((e) => {
        setErr(String(e));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [mode]);

  const lastTs = useMemo(() => rows.at(-1)?.ts, [rows]);

  return (
    <div className="w-full">
      {/* Controls Panel */}
      <motion.div
        className="glass-card-hover rounded-xl p-6 mb-6 border border-accent/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-wrap items-end gap-4">
          {/* Mode Toggle */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-dim mb-2 flex items-center gap-2">
              <Activity className="w-3 h-3" />
              Trading Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="w-full bg-surface border border-accent/30 rounded-lg px-4 py-2.5 text-text text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accentA focus:border-accentA transition-all hover:border-accent/50"
            >
              <option value="paper">Paper Trading</option>
              <option value="live">Live Trading</option>
              <option value="staging">Staging (New Pairs)</option>
            </select>
          </div>

          {/* Pair Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-dim mb-2 flex items-center gap-2">
              <Filter className="w-3 h-3" />
              Trading Pair
            </label>
            <select
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              className="w-full bg-surface border border-accent/30 rounded-lg px-4 py-2.5 text-text text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accentA focus:border-accentA transition-all hover:border-accent/50"
            >
              <option value="">All Pairs</option>
              <option value="BTC/USD">BTC/USD - Bitcoin</option>
              <option value="ETH/USD">ETH/USD - Ethereum</option>
              <option value="SOL/USD">SOL/USD - Solana</option>
              <option value="ADA/USD">ADA/USD - Cardano</option>
              <option value="AVAX/USD">AVAX/USD - Avalanche</option>
            </select>
          </div>

          {/* Refresh Button */}
          <motion.button
            onClick={load}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 rounded-lg bg-gradient-brand text-white text-sm font-semibold flex items-center gap-2 shadow-glow hover:shadow-glow-violet transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </motion.button>

          {/* Status Info */}
          {lastTs && !loading && (
            <motion.div
              className="ml-auto text-xs text-dim flex items-center gap-2 px-3 py-2 bg-surface/50 rounded-lg border border-accent/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Last: {new Date(lastTs * 1000).toLocaleTimeString()}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {err && (
          <motion.div
            className="mb-4 p-4 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <strong>Error:</strong> {err}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Container */}
      <div className="relative overflow-hidden rounded-xl border border-accent/20 shadow-soft">
        {/* Background gradient accent */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-accentA/5 via-transparent to-accentB/5 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative overflow-x-auto">
          <table className="min-w-full text-sm">
            {/* Table Header */}
            <thead className="bg-surface/80 backdrop-blur-sm border-b-2 border-accent/30 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-bold text-text2 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-text2 uppercase tracking-wider">
                  Pair
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-text2 uppercase tracking-wider">
                  Side
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-text2 uppercase tracking-wider">
                  Entry
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-text2 uppercase tracking-wider">
                  Stop Loss
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-text2 uppercase tracking-wider">
                  Take Profit
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-text2 uppercase tracking-wider">
                  Strategy
                </th>
                <th className="px-4 py-4 text-right text-xs font-bold text-text2 uppercase tracking-wider">
                  Confidence
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-elev/30 backdrop-blur-sm">
              <AnimatePresence mode="popLayout">
                {rows.map((signal, index) => (
                  <SignalRow
                    key={signal.id || index}
                    signal={signal}
                    index={index}
                  />
                ))}
              </AnimatePresence>

              {/* Empty State */}
              {rows.length === 0 && !loading && (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <td
                    className="px-4 py-12 text-center text-dim"
                    colSpan={8}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Activity className="w-8 h-8 text-accent/50" />
                      <p>No signals found</p>
                      <p className="text-xs">
                        Try adjusting your filters or refresh the data
                      </p>
                    </div>
                  </td>
                </motion.tr>
              )}

              {/* Loading State */}
              {loading && rows.length === 0 && (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="px-4 py-12 text-center" colSpan={8}>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-accentA/30 border-t-accentA animate-spin" />
                      <span className="text-text2 font-medium">
                        Loading signals...
                      </span>
                    </div>
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      {rows.length > 0 && (
        <motion.div
          className="mt-4 text-xs text-dim text-center flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="px-3 py-1.5 bg-surface/50 rounded-lg border border-accent/20">
            Showing <strong className="text-text">{rows.length}</strong>{' '}
            signal{rows.length !== 1 ? 's' : ''}{' '}
            <span className="text-muted">(limit: 200)</span>
          </span>
        </motion.div>
      )}
    </div>
  );
}

// Individual animated row component
function SignalRow({
  signal,
  index,
}: {
  signal: SignalDTO;
  index: number;
}) {
  const isBuy = signal.side?.toLowerCase() === 'buy';
  const isZebra = index % 2 === 0;

  // Confidence level styling
  const confidenceLevel =
    (signal.confidence || 0) >= 0.8
      ? { bg: 'bg-success/20', text: 'text-success', label: 'High' }
      : (signal.confidence || 0) >= 0.6
      ? { bg: 'bg-accentA/20', text: 'text-accentA', label: 'Medium' }
      : { bg: 'bg-highlight/20', text: 'text-highlight', label: 'Low' };

  return (
    <motion.tr
      className={`
        group border-b border-accent/10 transition-colors cursor-pointer
        ${isZebra ? 'bg-surface/30' : 'bg-surface/10'}
        hover:bg-accentA/5
      `}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05, // Stagger effect
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      layout
    >
      {/* Time */}
      <td className="px-4 py-4 text-text2 font-medium whitespace-nowrap">
        {signal.ts
          ? new Date(signal.ts * 1000).toLocaleTimeString()
          : '-'}
      </td>

      {/* Pair */}
      <td className="px-4 py-4">
        <span className="text-text font-bold text-base">
          {signal.pair || '-'}
        </span>
      </td>

      {/* Side */}
      <td className="px-4 py-4">
        <motion.div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
            isBuy
              ? 'bg-success/20 text-success border border-success/30'
              : 'bg-danger/20 text-danger border border-danger/30'
          }`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {isBuy ? (
            <ArrowUpCircle className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownCircle className="w-3.5 h-3.5" />
          )}
          {signal.side?.toUpperCase() || '-'}
        </motion.div>
      </td>

      {/* Entry Price */}
      <td className="px-4 py-4 text-right">
        <span className="text-text font-mono font-semibold">
          ${signal.entry?.toFixed?.(4) ?? signal.entry ?? '-'}
        </span>
      </td>

      {/* Stop Loss */}
      <td className="px-4 py-4 text-right">
        <span className="text-dim font-mono">
          {signal.sl ? `$${signal.sl.toFixed(4)}` : '-'}
        </span>
      </td>

      {/* Take Profit */}
      <td className="px-4 py-4 text-right">
        <span className="text-dim font-mono">
          {signal.tp ? `$${signal.tp.toFixed(4)}` : '-'}
        </span>
      </td>

      {/* Strategy */}
      <td className="px-4 py-4">
        <span className="text-text2 font-medium text-xs uppercase tracking-wide">
          {signal.strategy || '-'}
        </span>
      </td>

      {/* Confidence */}
      <td className="px-4 py-4 text-right">
        <motion.div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${confidenceLevel.bg} ${confidenceLevel.text} border ${confidenceLevel.text.replace('text-', 'border-')}/30`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          {signal.confidence
            ? `${(signal.confidence * 100).toFixed(1)}%`
            : '-'}
        </motion.div>
      </td>
    </motion.tr>
  );
}
