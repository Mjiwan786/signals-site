'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Loader2, Radio, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useSSE } from '@/lib/useSSE';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'https://crypto-signals-api.fly.dev';

interface PnLData {
  ts: number;
  equity: number;
  daily_pnl: number;
}

const MAX_DATA_POINTS = 288; // 24 hours at 5-minute intervals

export default function PnLChart() {
  const [pnlData, setPnLData] = useState<PnLData[]>([]);
  const [latestPnL, setLatestPnL] = useState<PnLData | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

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
      } finally {
        setIsLoadingInitial(false);
      }
    };

    fetchInitialData();
  }, []);

  // SSE connection for live updates
  const { isConnected, error, reconnectAttempt } = useSSE<PnLData>({
    url: `${API_BASE_URL}/v1/pnl/stream`,
    eventName: 'pnl',
    onMessage: (pnl) => {
      setLatestPnL(pnl);
      setPnLData((prev) => {
        const newData = [...prev, pnl];
        // Keep only last 24 hours of data
        return newData.slice(-MAX_DATA_POINTS);
      });
    },
    onError: (err) => {
      console.error('PnL SSE error:', err);
    },
  });

  if (isLoadingInitial) {
    return (
      <div className="bg-elev border border-accent/30 rounded-xl p-6">
        <div className="flex items-center justify-center gap-3 text-dim h-96">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading P&L data...</span>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const chartData = pnlData.map((point) => ({
    time: formatDate(point.ts),
    equity: point.equity,
    pnl: point.daily_pnl,
  }));

  const totalPnL = latestPnL?.daily_pnl || 0;
  const equity = latestPnL?.equity || 10000;
  const pnlPercentage = ((totalPnL / (equity - totalPnL)) * 100).toFixed(2);
  const isPositive = totalPnL >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-elev border border-accent/30 rounded-xl p-6"
    >
      {/* Header with Stats */}
      <div className="flex items-start justify-between mb-6 pb-6 border-b border-accent/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <DollarSign className="w-8 h-8 text-success" />
            <div className="absolute inset-0 blur-md bg-success opacity-30" />
          </div>
          <div>
            <p className="text-sm text-dim">Current Equity</p>
            <p className="text-2xl font-bold text-text font-mono">{formatCurrency(equity)}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2 mb-2">
            <Radio className={`w-4 h-4 ${isConnected ? 'text-success animate-pulse' : 'text-dim'}`} />
            <span className="text-xs text-dim">
              {isConnected ? 'Live' : error ? `Reconnecting (${reconnectAttempt})` : 'Connecting'}
            </span>
          </div>
          <div className={`flex items-center gap-2 ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? (
              <TrendingUp className="w-6 h-6" />
            ) : (
              <TrendingDown className="w-6 h-6" />
            )}
            <div className="text-right">
              <p className="text-2xl font-bold font-mono">{formatCurrency(totalPnL)}</p>
              <p className="text-sm font-medium">
                {isPositive ? '+' : ''}{pnlPercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="time"
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
                tick={{ fill: 'rgba(255,255,255,0.5)' }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
                tick={{ fill: 'rgba(255,255,255,0.5)' }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'equity' ? 'Equity' : 'P&L',
                ]}
                labelStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
              />
              <Line
                type="monotone"
                dataKey="equity"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-dim">
            <div className="text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No P&L data available yet</p>
              <p className="text-xs mt-1">Data will appear once trading begins</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-accent/20">
        <StatCard
          label="Starting Balance"
          value={formatCurrency(equity - totalPnL)}
          color="text-text"
        />
        <StatCard
          label="Total P&L"
          value={formatCurrency(totalPnL)}
          color={isPositive ? 'text-success' : 'text-danger'}
        />
        <StatCard
          label="Win Rate"
          value="--"
          color="text-text"
          subtitle="Coming soon"
        />
      </div>
    </motion.div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  color: string;
  subtitle?: string;
}

function StatCard({ label, value, color, subtitle }: StatCardProps) {
  return (
    <div className="text-center">
      <p className="text-xs text-dim mb-1">{label}</p>
      <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
      {subtitle && <p className="text-xs text-dim italic mt-1">{subtitle}</p>}
    </div>
  );
}
