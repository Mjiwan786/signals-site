'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://crypto-signals-api.fly.dev';

interface PnLData {
  ts: number;
  equity: number;
  daily_pnl: number;
}

const MAX_DATA_POINTS = 288; // 24 hours at 5-minute intervals
const RECONNECT_DELAYS = [1000, 2000, 5000, 10000, 30000]; // Exponential backoff

export default function PnLWidget() {
  const [pnlData, setPnLData] = useState<PnLData[]>([]);
  const [latestPnL, setLatestPnL] = useState<PnLData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial historical data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/v1/pnl?n=100`, {
          cache: 'no-store',
        });

        if (response.ok) {
          const data: PnLData[] = await response.json();
          setPnLData(data);
          if (data.length > 0) {
            setLatestPnL(data[data.length - 1]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch initial PnL data:', err);
      }
    };

    fetchInitialData();
  }, []);

  const connect = () => {
    // Clean up existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const url = `${API_BASE_URL}/v1/pnl/stream`;
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
        setReconnectAttempt(0);
      };

      eventSource.addEventListener('pnl', (event) => {
        try {
          const pnl: PnLData = JSON.parse(event.data);
          setLatestPnL(pnl);
          setPnLData((prev) => {
            const newData = [...prev, pnl];
            // Keep only last 24 hours of data (288 points at 5-min intervals)
            return newData.slice(-MAX_DATA_POINTS);
          });
        } catch (err) {
          console.error('Failed to parse PnL data:', err);
        }
      });

      eventSource.addEventListener('heartbeat', () => {
        // Heartbeat received, connection is alive
        setIsConnected(true);
      });

      eventSource.onerror = (err) => {
        console.error('EventSource error:', err);
        setIsConnected(false);
        setError('Connection lost');
        eventSource.close();

        // Attempt reconnection with backoff
        const delay = RECONNECT_DELAYS[Math.min(reconnectAttempt, RECONNECT_DELAYS.length - 1)];
        setReconnectAttempt((prev) => prev + 1);

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      };
    } catch (err) {
      console.error('Failed to create EventSource:', err);
      setError('Failed to connect');
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate performance metrics
  const calculateMetrics = () => {
    if (pnlData.length < 2) return null;

    const firstEquity = pnlData[0].equity;
    const currentEquity = latestPnL?.equity || pnlData[pnlData.length - 1].equity;
    const totalPnL = currentEquity - firstEquity;
    const percentChange = ((totalPnL / firstEquity) * 100);

    return {
      totalPnL,
      percentChange,
      isPositive: totalPnL >= 0,
    };
  };

  const metrics = calculateMetrics();

  // Prepare chart data
  const chartData = pnlData.map((point) => ({
    time: formatTime(point.ts),
    equity: point.equity,
  }));

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-xs text-gray-400 mb-1">{data.time}</p>
          <p className="text-sm font-semibold text-white">
            {formatCurrency(data.equity)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/80">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-white">Live P&L</h3>
            <p className="text-xs text-gray-400 mt-1">Rolling 24-hour equity curve</p>
          </div>

          {/* Connection status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              } ${isConnected ? 'animate-pulse' : ''}`}
            />
            <span className="text-xs text-gray-400">
              {isConnected ? 'Live' : error || 'Connecting...'}
            </span>
          </div>
        </div>

        {/* Current metrics */}
        {latestPnL && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Current Equity</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(latestPnL.equity)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Daily P&L</p>
              <div className="flex items-baseline gap-2">
                <p
                  className={`text-2xl font-bold ${
                    latestPnL.daily_pnl >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {latestPnL.daily_pnl >= 0 ? '+' : ''}
                  {formatCurrency(latestPnL.daily_pnl)}
                </p>
                {metrics && (
                  <span
                    className={`text-sm font-semibold ${
                      metrics.isPositive ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    ({metrics.percentChange >= 0 ? '+' : ''}
                    {metrics.percentChange.toFixed(2)}%)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="p-6">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="time"
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="equity"
                stroke={metrics && metrics.isPositive ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: metrics && metrics.isPositive ? '#10B981' : '#EF4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-[300px]">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-300 mb-2">
              {isConnected ? 'Waiting for P&L data' : 'Connecting to stream...'}
            </h4>
            <p className="text-sm text-gray-500 text-center max-w-md">
              {isConnected
                ? 'Real-time P&L updates will appear here as trading activity occurs.'
                : 'Establishing connection to the P&L stream...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
