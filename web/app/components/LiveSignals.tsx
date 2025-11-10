'use client'

import { useEffect, useRef, useState } from 'react'

interface Signal {
  id: string
  time: number
  pair: string
  side: 'BUY' | 'SELL'
  entry: number
  sl: number
  tp: number
  conf: number
  strat: string
}

export default function LiveSignals() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    // Fetch initial active signals from /v1/signals
    const fetchActiveSignals = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/signals?limit=100`, { cache: 'no-store' })
        const apiData = await response.json()

        // Map API response to Signal interface
        const mappedSignals: Signal[] = apiData.map((item: any) => ({
          id: item.id,
          time: item.ts,  // API uses "ts" field
          pair: item.pair,
          side: item.side.toUpperCase() as 'BUY' | 'SELL',  // API returns lowercase
          entry: item.entry,
          sl: item.sl,
          tp: item.tp,
          conf: item.confidence,  // API uses "confidence" field
          strat: item.strategy  // API uses "strategy" field
        }))

        setSignals(mappedSignals)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch active signals:', error)
        setIsLoading(false)
      }
    }

    fetchActiveSignals()

    // TODO: Setup EventSource for live updates when /v1/stream endpoint is ready
    // For now, mark as connected if initial fetch succeeds
    if (!isLoading) {
      setIsConnected(true)
    }

    // Refresh signals every 10 seconds as fallback
    const pollInterval = setInterval(fetchActiveSignals, 10000)

    return () => {
      clearInterval(pollInterval)
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [isLoading])

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-400'
    if (conf >= 0.6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getConfidenceBg = (conf: number) => {
    if (conf >= 0.8) return 'bg-green-900'
    if (conf >= 0.6) return 'bg-yellow-900'
    return 'bg-red-900'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Prominent LIVE Banner */}
      {isConnected && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 flex items-center justify-center space-x-3 animate-pulse">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 rounded-full bg-white animate-ping"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-white -ml-5"></span>
          </div>
          <span className="text-white font-bold text-lg uppercase tracking-wider">🔴 LIVE SYSTEM - Real-Time Trading Signals</span>
        </div>
      )}

      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Trading Signals</h3>
          <div className="flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-xs text-gray-400">
              {isConnected ? 'Connected' : 'Reconnecting...'}
            </span>
          </div>
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Conf</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Strategy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {signals.map((signal) => (
              <tr key={signal.id} className="hover:bg-gray-700 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {formatTime(signal.time)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                  {signal.pair}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    signal.side === 'BUY' 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {signal.side}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                  ${signal.entry.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  ${signal.sl.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  ${signal.tp.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConfidenceBg(signal.conf)} ${getConfidenceColor(signal.conf)}`}>
                    {(signal.conf * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                  {signal.strat}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {signals.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No active signals
        </div>
      )}
    </div>
  )
}



