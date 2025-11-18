/**
 * Enhanced PnL Chart with Recharts
 * Features: Timeframe toggles, drawdown overlay, responsive design
 * PRD: Themeable colors, resilient to sparse/flat data
 */

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { PnLPoint } from '@/lib/types';
import { usePnL } from '@/lib/hooks';
import { ChartSkeleton, ErrorFallback } from './Skeleton';

type Timeframe = {
  label: string;
  value: string;
  n: number;
};

const timeframes: Timeframe[] = [
  { label: '1D', value: '1d', n: 50 },
  { label: '1W', value: '1w', n: 200 },
  { label: '1M', value: '1m', n: 500 },
  { label: '3M', value: '3m', n: 1500 },
  { label: 'ALL', value: 'all', n: 5000 },
];

interface ChartData {
  ts: number;
  equity: number;
  daily_pnl: number;
  drawdown: number;
  date: string;
}

export default function PnLChart({ initialN = 500 }: { initialN?: number }) {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>(
    timeframes.find((t) => t.n === initialN) || timeframes[2]
  );
  const [showDrawdown, setShowDrawdown] = useState(false);

  const { data, error, isLoading, isEmpty, refetch } = usePnL(activeTimeframe.n);

  // Calculate drawdown: (current equity - running max) / running max * 100
  const chartData = useMemo<ChartData[]>(() => {
    if (!data || data.length === 0) return [];

    let runningMax = data[0].equity;
    return data.map((point) => {
      runningMax = Math.max(runningMax, point.equity);
      const drawdown = runningMax > 0 ? ((point.equity - runningMax) / runningMax) * 100 : 0;

      return {
        ts: point.ts,
        equity: point.equity,
        daily_pnl: point.daily_pnl,
        drawdown,
        date: new Date(point.ts * 1000).toLocaleDateString(),
      };
    });
  }, [data]);

  // Calculate stats
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return { totalPnL: 0, maxDrawdown: 0, isPositive: false };
    }

    const totalPnL = chartData[chartData.length - 1].equity - chartData[0].equity;
    const maxDrawdown = Math.min(...chartData.map((d) => d.drawdown));

    return {
      totalPnL,
      maxDrawdown,
      isPositive: totalPnL >= 0,
    };
  }, [chartData]);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (error) {
    return <ErrorFallback error={error} onRetry={refetch} title="Failed to load PnL data" />;
  }

  if (isEmpty) {
    return (
      <div className="w-full glass-card rounded-2xl p-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Activity className="w-12 h-12 text-dim mb-4" />
          <h3 className="text-lg font-semibold text-text mb-2">No PnL Data Available</h3>
          <p className="text-dim">Waiting for trading data to populate the chart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="glass-card rounded-2xl p-6 border-accent/30">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-text mb-1">Equity Curve</h3>
            <p className="text-sm text-dim">Cumulative portfolio performance over time</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-dim mb-1">Total P&L</div>
              <div
                className={`text-lg font-bold ${
                  stats.isPositive ? 'text-success' : 'text-danger'
                }`}
              >
                {stats.isPositive ? '+' : ''}${stats.totalPnL.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-dim mb-1">Max Drawdown</div>
              <div className="text-lg font-bold text-danger">
                {stats.maxDrawdown.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 p-1.5 bg-surface/80 backdrop-blur-sm border border-accent/20 rounded-xl">
            <Calendar className="w-4 h-4 text-dim ml-2" />
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setActiveTimeframe(tf)}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                  ${
                    activeTimeframe.value === tf.value
                      ? 'text-white bg-gradient-brand shadow-glow'
                      : 'text-dim hover:text-text hover:bg-surface/50'
                  }
                `}
              >
                {activeTimeframe.value === tf.value && (
                  <div className="absolute inset-0 bg-gradient-brand blur-lg opacity-50 rounded-lg -z-10" />
                )}
                {tf.label}
              </button>
            ))}
          </div>

          {/* Drawdown Toggle */}
          <button
            onClick={() => setShowDrawdown(!showDrawdown)}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
              ${
                showDrawdown
                  ? 'bg-danger/20 text-danger border border-danger/30'
                  : 'bg-surface/80 text-dim border border-border hover:border-accent/30'
              }
            `}
          >
            <TrendingDown className="w-4 h-4" />
            {showDrawdown ? 'Hide' : 'Show'} Drawdown
          </button>
        </div>

        {/* Chart - Responsive height for mobile */}
        <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] bg-elev/50 rounded-xl p-2 sm:p-4 border border-border/50" role="img" aria-label="Portfolio equity curve chart">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={stats.isPositive ? '#22C55E' : '#F87171'}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={stats.isPositive ? '#22C55E' : '#F87171'}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F87171" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" opacity={0.3} />

              <XAxis
                dataKey="date"
                stroke="#A8AEB8"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                aria-label="Date axis"
              />

              <YAxis
                yAxisId="left"
                stroke="#A8AEB8"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                aria-label="Equity axis"
              />

              {showDrawdown && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#F87171"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `${value.toFixed(0)}%`}
                  aria-label="Drawdown percentage axis"
                />
              )}

              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a24',
                  border: '1px solid #2a2a38',
                  borderRadius: '8px',
                  padding: '12px',
                }}
                labelStyle={{ color: '#F0F2F5', marginBottom: '8px' }}
                itemStyle={{ color: '#A8AEB8' }}
                formatter={(value: number, name: string) => {
                  if (name === 'Equity') return [`$${value.toFixed(2)}`, name];
                  if (name === 'Drawdown') return [`${value.toFixed(2)}%`, name];
                  return [value, name];
                }}
              />

              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
                formatter={(value) => (
                  <span style={{ color: '#F0F2F5', fontSize: '14px' }}>{value}</span>
                )}
              />

              {/* Equity Line with Area Fill */}
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="equity"
                stroke={stats.isPositive ? '#22C55E' : '#F87171'}
                strokeWidth={3}
                fill="url(#equityGradient)"
                name="Equity"
                dot={false}
                activeDot={{ r: 6, fill: stats.isPositive ? '#22C55E' : '#F87171' }}
              />

              {/* Drawdown Area */}
              {showDrawdown && (
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="drawdown"
                  stroke="#F87171"
                  strokeWidth={2}
                  fill="url(#drawdownGradient)"
                  name="Drawdown"
                  dot={false}
                  activeDot={{ r: 5, fill: '#F87171' }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
          <div className="text-center">
            <div className="text-xs text-dim mb-1">Data Points</div>
            <div className="text-sm font-semibold text-text">{chartData.length}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-dim mb-1">Timeframe</div>
            <div className="text-sm font-semibold text-text">{activeTimeframe.label}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-dim mb-1">Start Equity</div>
            <div className="text-sm font-semibold text-text">
              ${chartData[0].equity.toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-dim mb-1">Current Equity</div>
            <div className="text-sm font-semibold text-text">
              ${chartData[chartData.length - 1].equity.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
