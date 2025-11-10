'use client';

import { useSignalsStream } from '@/lib/hooks';
import LiveIndicator from '@/components/LiveIndicator';

export default function LiveSignalsStreaming() {
  const { signals, isConnected, isLoadingHistory, error } = useSignalsStream({ mode: 'paper', limit: 50 }, true);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-400';
    if (conf >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoadingHistory) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-900 rounded-lg p-6 text-center">
        <p className="text-red-400">Failed to load signals: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* LIVE Banner with new component */}
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <LiveIndicator isConnected={isConnected} size="lg" />
          <div>
            <h3 className="text-lg font-semibold text-white">Real-Time Trading Signals</h3>
            <p className="text-xs text-gray-400">
              {isConnected ? 'Streaming via SSE' : 'Attempting to reconnect...'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Active Signals</p>
          <p className="text-2xl font-bold text-white">{signals.length}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pair</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Side</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Entry</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">SL</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">TP</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Confidence</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Strategy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {signals.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  Waiting for signals...
                </td>
              </tr>
            ) : (
              signals.slice(0, 20).map((signal) => (
                <tr key={signal.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {formatTime(signal.ts)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                    {signal.pair}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={"inline-flex px-2 py-1 text-xs font-semibold rounded-full " + (signal.side === 'buy' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300')}>
                      {signal.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {signal.entry.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {signal.sl?.toFixed(2) || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {signal.tp?.toFixed(2) || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={"inline-flex px-2 py-1 text-xs font-semibold rounded " + getConfidenceColor(signal.confidence)}>
                      {(signal.confidence * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                    {signal.strategy}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
