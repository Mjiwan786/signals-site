/**
 * SignalCard Component
 * Animated signal card with buy/sell color coding, connection status, and P&L
 * ReactBits-inspired motion and styling
 */

'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Zap,
  Clock,
  Wifi,
  WifiOff,
  Radio,
} from 'lucide-react';
import type { SignalDTO } from '@/lib/types';

interface SignalCardProps {
  signal: SignalDTO;
  index?: number;
  connectionStatus?: 'connected' | 'reconnecting' | 'idle';
}

export default function SignalCard({ signal, index = 0, connectionStatus = 'idle' }: SignalCardProps) {
  const isBuy = signal.side === 'buy';
  const confidencePercent = (signal.confidence * 100).toFixed(0);

  // Confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-accentA';
    return 'text-highlight';
  };

  const confidenceColor = getConfidenceColor(signal.confidence);

  // Calculate potential P&L change
  const calculatePnLChange = () => {
    if (!signal.tp) return null;

    let pnlPercent: number;
    if (isBuy) {
      // For buy: profit when price goes up to TP
      pnlPercent = ((signal.tp - signal.entry) / signal.entry) * 100;
    } else {
      // For sell: profit when price goes down to TP
      pnlPercent = ((signal.entry - signal.tp) / signal.entry) * 100;
    }

    return pnlPercent;
  };

  const pnlChange = calculatePnLChange();

  // Format timestamp
  const formatTime = (ts: number) => {
    const date = new Date(ts * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  // Connection status badge config
  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: Radio,
          label: 'Connected',
          bg: 'bg-success/20',
          textColor: 'text-success',
          border: 'border-success/30',
        };
      case 'reconnecting':
        return {
          icon: WifiOff,
          label: 'Reconnecting',
          bg: 'bg-danger/20',
          textColor: 'text-danger',
          border: 'border-danger/30',
        };
      case 'idle':
      default:
        return {
          icon: Wifi,
          label: 'Idle',
          bg: 'bg-dim/20',
          textColor: 'text-dim',
          border: 'border-dim/30',
        };
    }
  };

  const connectionBadge = getConnectionBadge();

  const ConnectionIcon = connectionBadge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      whileHover={{
        y: -6,
        scale: 1.02,
        transition: { duration: 0.2, type: "spring", stiffness: 300 }
      }}
      className="group relative"
    >
      <div
        className={`
          glass-card-hover rounded-xl p-4 border
          ${
            isBuy
              ? 'border-success/30 hover:border-success/50'
              : 'border-danger/30 hover:border-danger/50'
          }
          transition-all duration-300
        `}
      >
        {/* Background gradient on hover */}
        <div
          className={`
            absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
            ${
              isBuy
                ? 'bg-gradient-to-br from-success/5 to-transparent'
                : 'bg-gradient-to-br from-danger/5 to-transparent'
            }
          `}
        />

        {/* Connection Status Badge (Top Right) */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 + 0.1 }}
          className="absolute top-3 right-3 z-20"
        >
          <div
            className={`
              inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold border
              ${connectionBadge.bg} ${connectionBadge.textColor} ${connectionBadge.border}
              transition-all duration-300
            `}
          >
            <ConnectionIcon className="w-3 h-3" />
            {connectionBadge.label}
          </div>
        </motion.div>

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between mb-3 pr-24">
          <div className="flex items-center gap-3">
            {/* Side Indicator */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 + 0.15, type: "spring" }}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm
                ${
                  isBuy
                    ? 'bg-success/20 text-success'
                    : 'bg-danger/20 text-danger'
                }
              `}
            >
              {isBuy ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {signal.side.toUpperCase()}
            </motion.div>

            {/* Pair */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 + 0.2 }}
              className="text-lg font-bold text-text"
            >
              {signal.pair}
            </motion.div>
          </div>

          {/* Confidence Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 + 0.25, type: "spring" }}
            className={`
              inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
              ${confidenceColor} bg-current/10
            `}
          >
            <Zap className="w-3 h-3" />
            {confidencePercent}%
          </motion.div>
        </div>

        {/* P&L Change Badge (if available) */}
        {pnlChange !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.3 }}
            className="relative z-10 mb-3"
          >
            <div
              className={`
                inline-flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm
                ${
                  pnlChange > 0
                    ? 'bg-success/10 text-success border border-success/30'
                    : 'bg-danger/10 text-danger border border-danger/30'
                }
              `}
            >
              <TrendingUp className={`w-4 h-4 ${pnlChange < 0 ? 'rotate-180' : ''}`} />
              <span>Target P&L: {pnlChange > 0 ? '+' : ''}{pnlChange.toFixed(2)}%</span>
            </div>
          </motion.div>
        )}

        {/* Price Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.35 }}
          className="relative z-10 grid grid-cols-3 gap-3 mb-3"
        >
          <div>
            <div className="text-xs text-dim mb-1">Entry</div>
            <div className="text-sm font-semibold text-text">
              ${signal.entry.toFixed(4)}
            </div>
          </div>
          {signal.sl && (
            <div>
              <div className="text-xs text-dim mb-1 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                SL
              </div>
              <div className="text-sm font-semibold text-danger">
                ${signal.sl.toFixed(4)}
              </div>
            </div>
          )}
          {signal.tp && (
            <div>
              <div className="text-xs text-dim mb-1 flex items-center gap-1">
                <Target className="w-3 h-3" />
                TP
              </div>
              <div className="text-sm font-semibold text-success">
                ${signal.tp.toFixed(4)}
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.4 }}
          className="relative z-10 flex items-center justify-between pt-3 border-t border-border/50"
        >
          <div className="flex items-center gap-2 text-xs text-dim">
            <Clock className="w-3 h-3" />
            {formatTime(signal.ts)}
          </div>

          <div className="flex items-center gap-2">
            {/* Strategy Badge */}
            <div className="px-2 py-0.5 bg-elev rounded text-xs text-text2 font-mono">
              {signal.strategy}
            </div>

            {/* Mode Badge */}
            <div
              className={`
                px-2 py-0.5 rounded text-xs font-medium
                ${
                  signal.mode === 'live'
                    ? 'bg-success/20 text-success'
                    : 'bg-accentB/20 text-accentB'
                }
              `}
            >
              {signal.mode}
            </div>
          </div>
        </motion.div>

        {/* Glow effect on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.25 }}
          transition={{ duration: 0.3 }}
          className={`
            absolute inset-0 rounded-xl blur-xl pointer-events-none
            ${isBuy ? 'bg-success' : 'bg-danger'}
          `}
        />
      </div>
    </motion.div>
  );
}
