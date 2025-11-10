/**
 * LiveFeed Component
 * Real-time signal feed with SSE connection
 * Features: Auto-scroll, pause-on-hover, ARIA live region, <1s render
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Wifi, WifiOff, Pause, Play, Filter } from 'lucide-react';
import { useSignalsStream } from '@/lib/hooks';
import type { SignalsQuery } from '@/lib/types';
import SignalCard from './SignalCard';
import { EmptyState, LoadingSpinner } from './Skeleton';

interface LiveFeedProps {
  mode?: 'paper' | 'live';
  maxSignals?: number;
  pair?: string; // Filter signals by trading pair (e.g., "BTC/USD")
}

export default function LiveFeed({ mode = 'paper', maxSignals = 50, pair }: LiveFeedProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const [newSignalCount, setNewSignalCount] = useState(0);

  const { signals: allSignals, isConnected, isLoadingHistory, error, clearSignals } = useSignalsStream(
    { mode },
    true // enabled
  );

  // Filter signals by pair if specified
  const signals = pair
    ? allSignals.filter(signal => signal.pair === pair)
    : allSignals;

  // Auto-scroll to top when new signal arrives (unless paused or hovered)
  useEffect(() => {
    if (signals.length > 0 && !isPaused && !isHovered && feedRef.current) {
      feedRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Increment new signal counter when paused/hovered
    if ((isPaused || isHovered) && signals.length > 0) {
      setNewSignalCount((prev) => prev + 1);
    }
  }, [signals.length, isPaused, isHovered]);

  // Reset new signal counter when unpaused/unhovered
  useEffect(() => {
    if (!isPaused && !isHovered) {
      setNewSignalCount(0);
    }
  }, [isPaused, isHovered]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const displaySignals = signals.slice(0, maxSignals);
  const hasSignals = displaySignals.length > 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text mb-1">Live Signal Feed</h2>
          <p className="text-sm text-dim">Real-time AI-generated trading signals</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <div
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
              ${
                isConnected
                  ? 'bg-success/20 text-success'
                  : 'bg-danger/20 text-danger'
              }
            `}
          >
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 animate-pulse" />
                Connected
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                Disconnected
              </>
            )}
          </div>

          {/* Pause Button */}
          <button
            onClick={togglePause}
            className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300
              ${
                isPaused
                  ? 'bg-highlight/20 text-highlight'
                  : 'bg-surface text-text2 hover:bg-elev'
              }
            `}
            aria-label={isPaused ? 'Resume feed' : 'Pause feed'}
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            )}
          </button>

          {/* Clear Button */}
          {hasSignals && (
            <button
              onClick={clearSignals}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-surface text-text2 hover:bg-elev transition-all duration-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* New Signals Banner */}
      <AnimatePresence>
        {newSignalCount > 0 && (isPaused || isHovered) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 bg-accentA/20 border border-accentA/30 rounded-lg text-center"
          >
            <p className="text-sm text-accentA font-medium">
              {newSignalCount} new signal{newSignalCount > 1 ? 's' : ''} received
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed Container with ARIA Live Region */}
      <div
        ref={feedRef}
        className="relative max-h-[800px] overflow-y-auto space-y-4 p-4 bg-surface/50 rounded-xl border border-border"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
      >
        {/* Loading State - Historical Data */}
        {isLoadingHistory && (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="text-dim text-sm mt-4">Loading historical signals...</p>
          </div>
        )}

        {/* Loading State - Waiting for Live Signals */}
        {!hasSignals && !isLoadingHistory && isConnected && (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="text-dim text-sm mt-4">Waiting for signals...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <EmptyState
            title="Connection Error"
            description={error.message || 'Unable to connect to signal stream'}
            icon={WifiOff}
          />
        )}

        {/* Empty State (Disconnected) */}
        {!hasSignals && !isConnected && !error && (
          <EmptyState
            title="Not Connected"
            description="Attempting to establish connection to signal stream..."
            icon={Activity}
          />
        )}

        {/* Signal Cards */}
        <AnimatePresence mode="popLayout">
          {displaySignals.map((signal, index) => (
            <div key={signal.id} role="article" aria-label={`${signal.side} signal for ${signal.pair}`}>
              <SignalCard
                signal={signal}
                index={index}
                connectionStatus={isConnected ? 'connected' : error ? 'reconnecting' : 'idle'}
              />
            </div>
          ))}
        </AnimatePresence>

        {/* Pause Indicator Overlay */}
        {isPaused && hasSignals && (
          <div className="sticky bottom-4 left-0 right-0 flex justify-center pointer-events-none">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-highlight/90 backdrop-blur-sm rounded-full text-white text-sm font-medium shadow-glow">
              <Pause className="w-4 h-4" />
              Feed Paused
            </div>
          </div>
        )}

        {/* Hover Indicator */}
        {isHovered && !isPaused && hasSignals && (
          <div className="sticky bottom-4 left-0 right-0 flex justify-center pointer-events-none">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accentA/90 backdrop-blur-sm rounded-full text-white text-sm font-medium shadow-glow">
              Auto-scroll paused
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {hasSignals && (
        <div className="mt-4 flex items-center justify-between text-xs text-dim">
          <div>
            Showing {displaySignals.length} of {signals.length} signals
          </div>
          <div>
            Mode: <span className="text-text font-medium">{mode.toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
