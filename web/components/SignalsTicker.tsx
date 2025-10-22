'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Activity,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';
import type { SignalDTO } from '@/lib/api';
import { API_BASE } from '@/lib/env';

/**
 * SignalsTicker - Live streaming ticker bar with SSE connection
 *
 * Features:
 * - Real-time SSE connection to /v1/signals/stream
 * - Continuous horizontal marquee animation
 * - Glowing ticker bar with brand colors
 * - Multiple signal display with auto-scrolling
 * - Connection status indicator
 * - Pulse effect on new signals
 */

interface SignalsTickerProps {
  mode?: 'paper' | 'live';
}

export default function SignalsTicker({ mode = 'paper' }: SignalsTickerProps) {
  const [signals, setSignals] = useState<SignalDTO[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [newSignalId, setNewSignalId] = useState<string | null>(null);

  useEffect(() => {
    // Create SSE connection
    const streamUrl = `${API_BASE}/v1/signals/stream?mode=${mode}`;

    try {
      const eventSource = new EventSource(streamUrl);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log('SSE connection opened:', streamUrl);
      };

      eventSource.onmessage = (event) => {
        try {
          const signal: SignalDTO = JSON.parse(event.data);

          // Add new signal to the beginning
          setSignals((prev) => {
            const updated = [signal, ...prev].slice(0, 20); // Keep last 20 signals
            return updated;
          });

          // Trigger pulse effect
          setNewSignalId(signal.id);
          setTimeout(() => setNewSignalId(null), 2000);
        } catch (e) {
          console.error('Failed to parse SSE message:', e);
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE error:', err);
        setIsConnected(false);
        setError('Connection lost');

        // EventSource will automatically reconnect
        eventSource.close();
        setTimeout(() => {
          if (eventSourceRef.current === eventSource) {
            eventSourceRef.current = null;
          }
        }, 5000);
      };
    } catch (e) {
      console.error('Failed to create EventSource:', e);
      setError('Failed to establish connection');
    }

    // Cleanup on unmount or mode change
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [mode]);

  // Don't render if no signals yet
  if (signals.length === 0 && !error) {
    return null;
  }

  return (
    <div className="relative w-full bg-gradient-to-r from-surface via-elev to-surface border-y border-accent/20 overflow-hidden">
      {/* Glowing top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accentA to-transparent opacity-50" />

      {/* Glowing bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accentB to-transparent opacity-50" />

      {/* Background pulse effect */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-accentA/5 via-transparent to-accentB/5 animate-pulse opacity-30"
        aria-hidden="true"
      />

      <div className="relative flex items-center py-3 px-6">
        {/* Live Indicator */}
        <div className="flex items-center gap-2 pr-6 border-r border-accent/30 flex-shrink-0">
          <div className="relative">
            <Zap className="w-4 h-4 text-accentA" />
            {isConnected && (
              <div className="absolute inset-0 blur-sm bg-accentA opacity-50 animate-pulse" />
            )}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-text2">
            Live Signals
          </span>
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-success animate-pulse' : 'bg-danger'
            }`}
          />
        </div>

        {/* Error State */}
        {error && signals.length === 0 && (
          <div className="flex items-center gap-2 px-6 text-sm text-danger">
            <Activity className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Scrolling Ticker Container */}
        {signals.length > 0 && (
          <div className="flex-1 overflow-hidden ml-6">
            <motion.div
              className="flex gap-8"
              animate={{
                x: [0, -1000],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 40,
                  ease: 'linear',
                },
              }}
            >
              {/* Duplicate signals array for seamless loop */}
              {[...signals, ...signals].map((signal, index) => (
                <TickerItem
                  key={`${signal.id}-${index}`}
                  signal={signal}
                  isNew={signal.id === newSignalId && index < signals.length}
                />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

// Individual ticker item component
function TickerItem({
  signal,
  isNew,
}: {
  signal: SignalDTO;
  isNew: boolean;
}) {
  const isBuy = signal.side?.toLowerCase() === 'buy';

  return (
    <motion.div
      className={`flex items-center gap-3 px-4 py-1 rounded-lg border transition-all duration-500 flex-shrink-0 ${
        isNew
          ? 'bg-accentA/10 border-accentA/50 shadow-glow'
          : 'bg-surface/50 border-accent/20'
      }`}
      animate={
        isNew
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 0px rgba(110, 231, 255, 0)',
                '0 0 20px rgba(110, 231, 255, 0.5)',
                '0 0 0px rgba(110, 231, 255, 0)',
              ],
            }
          : {}
      }
      transition={{ duration: 2 }}
    >
      {/* Pair */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-text">{signal.pair}</span>
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-accent/30" />

      {/* Side Badge */}
      <div
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
          isBuy
            ? 'bg-success/20 text-success'
            : 'bg-danger/20 text-danger'
        }`}
      >
        {isBuy ? (
          <ArrowUpCircle className="w-3 h-3" />
        ) : (
          <ArrowDownCircle className="w-3 h-3" />
        )}
        {signal.side?.toUpperCase()}
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-accent/30" />

      {/* Entry Price */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-dim">@</span>
        <span className="text-sm font-mono font-semibold text-text">
          ${signal.entry?.toFixed?.(4) ?? '-'}
        </span>
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-accent/30" />

      {/* Confidence */}
      <div className="flex items-center gap-1">
        <TrendingUp className="w-3 h-3 text-accentA" />
        <span
          className={`text-xs font-bold ${
            (signal.confidence || 0) >= 0.8
              ? 'text-success'
              : (signal.confidence || 0) >= 0.6
              ? 'text-accentA'
              : 'text-highlight'
          }`}
        >
          {signal.confidence
            ? `${(signal.confidence * 100).toFixed(0)}%`
            : '-'}
        </span>
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-accent/30" />

      {/* Time */}
      <div className="flex items-center gap-1">
        <Activity className="w-3 h-3 text-dim" />
        <span className="text-xs text-dim">
          {signal.ts
            ? new Date(signal.ts * 1000).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-'}
        </span>
      </div>
    </motion.div>
  );
}
