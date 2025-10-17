'use client'

import { useEffect, useRef } from 'react'
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts'
import { ChartData } from '../actions/chart-data'

interface ChartProps {
  data: ChartData[]
  symbol: string
  change: number
  changePercent: number
}

export default function Chart({ data, symbol, change, changePercent }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<any>(null)

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
      height: 300,
    })

    // Add line series
    const lineSeries = chart.addSeries('Line' as any, {
      color: change >= 0 ? '#10b981' : '#ef4444',
      lineWidth: 2,
    } as any)

    // Set data
    lineSeries.setData(data as any)

    // Store references
    chartRef.current = chart
    seriesRef.current = lineSeries

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
      if (chartRef.current) {
        chartRef.current.remove()
      }
    }
  }, [data])

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">{symbol}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            ${data[data.length - 1]?.value.toFixed(2) || '0.00'}
          </div>
          <div className={`text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  )
}



