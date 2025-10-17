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
    // Fetch initial active signals
    const fetchActiveSignals = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signals/active`, { cache: 'no-store' })
        const data: Signal[] = await response.json()
        setSignals(data.slice(0, 100)) // Cap at 100
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch active signals:', error)
        setIsLoading(false)
      }
    }

    fetchActiveSignals()

    // Setup EventSource for live updates
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/live`)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'signal') {
          const newSignal: Signal = {
            id: data.id,
            time: data.time,
            pair: data.pair,
            side: data.side,
            entry: data.entry,
            sl: data.sl,
            tp: data.tp,
            conf: data.conf,
            strat: data.strat
          }
          
          setSignals(prev => {
            const updated = [newSignal, ...prev].slice(0, 100) // Cap at 100
            return updated
          })
        }
      } catch (error) {
        console.error('Error parsing live signal:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error)
      setIsConnected(false)
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

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
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Live Signals</h3>
          <div className="flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-xs text-gray-400">
              {isConnected ? 'Live' : 'Disconnected'}
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



