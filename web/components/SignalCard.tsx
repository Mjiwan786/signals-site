/**
 * SignalCard Component
 * Animated signal card with buy/sell color coding
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
} from 'lucide-react';
import type { SignalDTO } from '@/lib/types';

interface SignalCardProps {
  signal: SignalDTO;
  index?: number;
}

export default function SignalCard({ signal, index = 0 }: SignalCardProps) {
  const isBuy = signal.side === 'buy';
  const confidencePercent = (signal.confidence * 100).toFixed(0);

  // Confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-accentA';
    return 'text-highlight';
  };

  const confidenceColor = getConfidenceColor(signal.confidence);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
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

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Side Indicator */}
            <div
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
            </div>

            {/* Pair */}
            <div className="text-lg font-bold text-text">{signal.pair}</div>
          </div>

          {/* Confidence Badge */}
          <div
            className={`
              inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
              ${confidenceColor} bg-current/10
            `}
          >
            <Zap className="w-3 h-3" />
            {confidencePercent}%
          </div>
        </div>

        {/* Price Info */}
        <div className="relative z-10 grid grid-cols-3 gap-3 mb-3">
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
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between pt-3 border-t border-border/50">
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
        </div>

        {/* Glow effect on hover */}
        <div
          className={`
            absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none
            ${isBuy ? 'bg-success' : 'bg-danger'}
          `}
        />
      </div>
    </motion.div>
  );
}
