'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts'

interface OHLCData {
  time: number
  open: number
  high: number
  low: number
  close: number
}

interface PriceChartProps {
  pair: string
  tf: string
}

export default function PriceChart({ pair, tf }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<any>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1f2937' },
        textColor: '#ffffff',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: '#374151',
      },
      timeScale: {
        borderColor: '#374151',
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    })

    // Add candlestick series
    const candlestickSeries = chart.addSeries('Candlestick' as any, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    } as any)

    chartRef.current = chart
    candlestickSeriesRef.current = candlestickSeries

    // Fetch historical data
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ohlc?pair=${pair}&tf=${tf}`, { cache: 'no-store' })
        const data: OHLCData[] = await response.json()
        
        if (data.length > 0) {
          candlestickSeries.setData(data as any)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch historical data:', error)
        setIsLoading(false)
      }
    }

    fetchHistory()

    // Setup EventSource for live updates
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/live`)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'ohlc' && data.pair === pair && data.tf === tf) {
          const ohlcData: OHLCData = {
            time: data.time,
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close
          }

          // Update with new candle data
          candlestickSeries.update(ohlcData as any)
        }
      } catch (error) {
        console.error('Error parsing live data:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error)
      setIsConnected(false)
    }

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (chartRef.current) {
        chartRef.current.remove()
      }
    }
  }, [pair, tf])

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">{pair}</h3>
        <div className="flex items-center">
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-xs text-gray-400">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <div ref={chartContainerRef} className="w-full" style={{ display: isLoading ? 'none' : 'block' }} />
    </div>
  )
}



