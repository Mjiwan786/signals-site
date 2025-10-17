"use client";
import { useEffect, useState, useRef } from "react";
import type { SignalDTO } from "@/lib/api";
import { API_BASE } from "@/lib/env";
import { motion, AnimatePresence } from "framer-motion";

interface SignalsTickerProps {
  mode?: "paper" | "live";
}

export default function SignalsTicker({ mode = "paper" }: SignalsTickerProps) {
  const [lastSignal, setLastSignal] = useState<SignalDTO | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [showGlow, setShowGlow] = useState(false);

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
          setLastSignal(signal);

          // Trigger glow effect
          setShowGlow(true);
          setTimeout(() => setShowGlow(false), 2000);
        } catch (e) {
          console.error('Failed to parse SSE message:', e);
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE error:', err);
        setIsConnected(false);
        setError('Connection lost. Attempting to reconnect...');

        // EventSource will automatically reconnect, but we'll close and recreate after delay
        eventSource.close();
        setTimeout(() => {
          if (eventSourceRef.current === eventSource) {
            // Reconnect after 5 seconds
            eventSourceRef.current = null;
          }
        }, 5000);
      };

    } catch (e) {
      console.error('Failed to create EventSource:', e);
      setError('Failed to establish SSE connection');
    }

    // Cleanup on unmount or mode change
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [mode]);

  // Don't render if no signal and not connected (to avoid empty space)
  if (!lastSignal && !isConnected && !error) {
    return null;
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {lastSignal && (
          <motion.div
            key={lastSignal.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className={`relative p-4 rounded-lg border transition-all duration-500 ${
              showGlow
                ? 'bg-accent/10 border-accent shadow-glow'
                : 'bg-surface border-border'
            }`}
          >
            {/* Connection Status Indicator */}
            <div className="absolute top-2 right-2 flex items-center gap-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  isConnected ? 'bg-success animate-pulse' : 'bg-danger'
                }`}
              />
              <span className="text-xs text-dim">
                {isConnected ? 'Live' : 'Disconnected'}
              </span>
            </div>

            {/* Signal Content */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Left: Pair and Side */}
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xs text-dim mb-1">Latest Signal</div>
                  <div className="text-lg font-bold text-text">{lastSignal.pair}</div>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    lastSignal.side?.toLowerCase() === 'buy'
                      ? 'bg-success/20 text-success'
                      : 'bg-danger/20 text-danger'
                  }`}
                >
                  {lastSignal.side?.toUpperCase()}
                </span>
              </div>

              {/* Middle: Entry, SL, TP */}
              <div className="flex gap-4 text-sm">
                <div>
                  <div className="text-xs text-dim">Entry</div>
                  <div className="text-text font-mono font-medium">
                    {lastSignal.entry?.toFixed?.(4) ?? '-'}
                  </div>
                </div>
                {lastSignal.sl && (
                  <div>
                    <div className="text-xs text-dim">SL</div>
                    <div className="text-text2 font-mono">
                      {lastSignal.sl.toFixed(4)}
                    </div>
                  </div>
                )}
                {lastSignal.tp && (
                  <div>
                    <div className="text-xs text-dim">TP</div>
                    <div className="text-text2 font-mono">
                      {lastSignal.tp.toFixed(4)}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Confidence and Time */}
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-xs text-dim">Confidence</div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                      (lastSignal.confidence || 0) >= 0.8
                        ? 'bg-success/20 text-success'
                        : (lastSignal.confidence || 0) >= 0.6
                        ? 'bg-accent/20 text-accent'
                        : 'bg-danger/20 text-danger'
                    }`}
                  >
                    {lastSignal.confidence
                      ? (lastSignal.confidence * 100).toFixed(1)
                      : '-'}%
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-dim">Time</div>
                  <div className="text-text2 text-sm">
                    {lastSignal.ts
                      ? new Date(lastSignal.ts * 1000).toLocaleTimeString()
                      : '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Strategy */}
            {lastSignal.strategy && (
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-xs text-dim">Strategy:</span>{' '}
                <span className="text-xs text-text2">{lastSignal.strategy}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && !lastSignal && (
        <div className="p-3 rounded-lg bg-danger/10 border border-danger/50 text-danger text-sm">
          {error}
        </div>
      )}

      {/* Connecting State */}
      {!isConnected && !error && !lastSignal && (
        <div className="p-3 rounded-lg bg-surface border border-border text-text2 text-sm flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
          Connecting to live signal stream...
        </div>
      )}
    </div>
  );
}
