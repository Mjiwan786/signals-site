'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://crypto-signals-api.fly.dev';

interface Signal {
  id: string;
  ts: number;
  pair: string;
  side: string;
  entry: number;
  sl?: number;
  tp?: number;
  confidence: number;
  strategy?: string;
  mode?: string;
}

const MAX_SIGNALS = 250;
const RECONNECT_DELAYS = [1000, 2000, 5000, 10000, 30000]; // Exponential backoff

export default function SignalsPanel() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSignals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/signals?mode=paper&limit=${MAX_SIGNALS}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: Signal[] = await response.json();
      setSignals(data.reverse()); // Reverse to show newest first
      setIsConnected(true);
      setError(null);
      setReconnectAttempt(0);
    } catch (err) {
      console.error('Failed to fetch signals:', err);
      setIsConnected(false);
      setError('Connection error');

      // Retry with backoff
      const delay = RECONNECT_DELAYS[Math.min(reconnectAttempt, RECONNECT_DELAYS.length - 1)];
      setReconnectAttempt((prev) => prev + 1);

      reconnectTimeoutRef.current = setTimeout(() => {
        fetchSignals();
      }, delay);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchSignals();

    // Poll every 10 seconds
    const interval = setInterval(fetchSignals, 10000);

    return () => {
      clearInterval(interval);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const getSideColor = (side: string) => {
    const normalizedSide = side.toLowerCase();
    if (normalizedSide === 'buy' || normalizedSide === 'long') {
      return 'text-green-400 bg-green-500/10';
    }
    return 'text-red-400 bg-red-500/10';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/80">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">Live Trading Signals</h3>
            <p className="text-xs text-gray-400 mt-1">
              Real-time signals • Last {Math.min(signals.length, MAX_SIGNALS)} signals
            </p>
          </div>

          {/* Connection status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              } ${isConnected ? 'animate-pulse' : ''}`}
            />
            <span className="text-xs text-gray-400">
              {isConnected ? 'Live • Updates every 10s' : error || 'Loading...'}
            </span>
          </div>
        </div>
      </div>

      {/* Signals table */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
        {signals.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-800/50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Pair
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Side
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Entry
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Strategy
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <AnimatePresence initial={false}>
                {signals.map((signal) => (
                  <motion.tr
                    key={signal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                      {formatTime(signal.ts)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-white">
                      {signal.pair}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${getSideColor(
                          signal.side
                        )}`}
                      >
                        {signal.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono text-white">
                      ${formatPrice(signal.entry)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className={`text-sm font-semibold ${getConfidenceColor(signal.confidence)}`}>
                        {(signal.confidence * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                      {signal.strategy || 'N/A'}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-300 mb-2">
              {isConnected ? 'Waiting for signals' : 'Connecting to stream...'}
            </h4>
            <p className="text-sm text-gray-500 text-center max-w-md">
              {isConnected
                ? 'Real-time trading signals will appear here as they are generated by the AI engine.'
                : 'Establishing connection to the signals stream...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
