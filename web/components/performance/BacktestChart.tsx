/**
 * BacktestChart Component
 * Displays backtest equity curve with buy/sell trade markers
 * Features: Recharts line chart + scatter markers, tooltip integration
 */

'use client';

import { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';
import { useBacktestEquity, useBacktestTrades } from '@/lib/hooks';
import { ChartSkeleton, ErrorFallback } from '@/components/Skeleton';
import type { BacktestEquityPoint, BacktestTrade } from '@/lib/types';

interface ChartDataPoint {
  ts: number; // Unix timestamp in milliseconds
  date: string; // Formatted date string
  equity: number;
  entryMarker?: number; // Y-value for entry markers (long or short)
  exitMarker?: number; // Y-value for exit markers
  entryTrade?: BacktestTrade; // Trade data for tooltip (entry)
  exitTrade?: BacktestTrade; // Trade data for tooltip (exit)
}

interface BacktestChartProps {
  symbol: string;
}

export default function BacktestChart({ symbol }: BacktestChartProps) {
  const { data: equityData, error: equityError, isLoading: equityLoading, refetch: refetchEquity } = useBacktestEquity(symbol);
  const { data: tradesData, error: tradesError, isLoading: tradesLoading, refetch: refetchTrades } = useBacktestTrades(symbol);

  // Merge equity and trades data for charting
  const chartData = useMemo<ChartDataPoint[]>(() => {
    if (!equityData || !equityData.points || equityData.points.length === 0) {
      return [];
    }

    // Convert equity points to chart data
    const points: ChartDataPoint[] = equityData.points.map((point: BacktestEquityPoint) => {
      const ts = new Date(point.ts).getTime();
      return {
        ts,
        date: new Date(point.ts).toLocaleDateString(),
        equity: point.equity,
      };
    });

    // If no trades data, return just the equity curve
    if (!tradesData || !tradesData.trades || tradesData.trades.length === 0) {
      return points;
    }

    // Map trades to the nearest equity point by timestamp (entry and exit)
    tradesData.trades.forEach((trade: BacktestTrade) => {
      const entryTs = new Date(trade.ts_entry).getTime();
      const exitTs = new Date(trade.ts_exit).getTime();

      // Find the closest point for entry
      let closestEntryPoint = points[0];
      let minEntryDiff = Math.abs(points[0].ts - entryTs);

      for (const point of points) {
        const diff = Math.abs(point.ts - entryTs);
        if (diff < minEntryDiff) {
          minEntryDiff = diff;
          closestEntryPoint = point;
        }
      }

      // Find the closest point for exit
      let closestExitPoint = points[0];
      let minExitDiff = Math.abs(points[0].ts - exitTs);

      for (const point of points) {
        const diff = Math.abs(point.ts - exitTs);
        if (diff < minExitDiff) {
          minExitDiff = diff;
          closestExitPoint = point;
        }
      }

      // Add entry marker (green for long, red for short)
      closestEntryPoint.entryMarker = closestEntryPoint.equity;
      closestEntryPoint.entryTrade = trade;

      // Add exit marker
      closestExitPoint.exitMarker = closestExitPoint.equity;
      closestExitPoint.exitTrade = trade;
    });

    return points;
  }, [equityData, tradesData]);

  // Calculate summary stats
  const stats = useMemo(() => {
    if (chartData.length === 0 || !tradesData) {
      return { startEquity: 0, endEquity: 0, totalPnL: 0, totalTrades: 0, isPositive: false };
    }

    const startEquity = chartData[0].equity;
    const endEquity = chartData[chartData.length - 1].equity;
    const totalPnL = endEquity - startEquity;
    const totalTrades = tradesData.trades.length;

    return {
      startEquity,
      endEquity,
      totalPnL,
      totalTrades,
      isPositive: totalPnL >= 0,
    };
  }, [chartData, tradesData]);

  // Custom tooltip renderer
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload as ChartDataPoint;

    return (
      <div className="bg-surface/95 backdrop-blur-sm border border-accent/30 rounded-lg p-4 shadow-lg">
        <div className="text-xs text-dim mb-2">{data.date}</div>
        <div className="text-sm font-semibold text-text mb-3">
          Equity: <span className="text-accent">${data.equity.toFixed(2)}</span>
        </div>

        {/* Entry trade info */}
        {data.entryTrade && (
          <div className="mb-2 pb-2 border-b border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={`w-3 h-3 ${data.entryTrade.side === 'long' ? 'text-success' : 'text-danger'}`} />
              <span className={`text-xs font-semibold ${data.entryTrade.side === 'long' ? 'text-success' : 'text-danger'}`}>
                ENTRY ({data.entryTrade.side.toUpperCase()})
              </span>
            </div>
            <div className="text-xs text-text2 space-y-0.5">
              <div>Entry: ${data.entryTrade.entry_price.toFixed(2)}</div>
              <div>Size: {data.entryTrade.size.toFixed(4)}</div>
              {data.entryTrade.signal && <div>Signal: {data.entryTrade.signal}</div>}
            </div>
          </div>
        )}

        {/* Exit trade info */}
        {data.exitTrade && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-3 h-3 text-text2" />
              <span className="text-xs font-semibold text-text2">EXIT</span>
            </div>
            <div className="text-xs text-text2 space-y-0.5">
              <div>Exit: ${data.exitTrade.exit_price.toFixed(2)}</div>
              <div className={data.exitTrade.net_pnl >= 0 ? 'text-success' : 'text-danger'}>
                P&L: {data.exitTrade.net_pnl >= 0 ? '+' : ''}${data.exitTrade.net_pnl.toFixed(2)}
              </div>
              {data.exitTrade.exit_reason && <div>Reason: {data.exitTrade.exit_reason}</div>}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Loading state
  if (equityLoading || tradesLoading) {
    return <ChartSkeleton />;
  }

  // Error state
  if (equityError || tradesError) {
    const error = equityError || tradesError;
    return (
      <ErrorFallback
        error={error}
        onRetry={() => {
          refetchEquity();
          refetchTrades();
        }}
        title="Failed to load backtest data"
      />
    );
  }

  // Empty state
  if (chartData.length === 0) {
    return (
      <div className="w-full glass-card rounded-2xl p-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-dim mb-4" />
          <h3 className="text-lg font-semibold text-text mb-2">No Backtest Data Available</h3>
          <p className="text-dim">No backtest results for {symbol}. Try selecting a different pair.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="glass-card rounded-2xl p-6 border-accent/30">
        {/* Header with Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-text mb-1">
              {symbol} Backtest Results
            </h3>
            <p className="text-sm text-dim">Historical equity curve with trade markers</p>
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
              <div className="text-xs text-dim mb-1">Total Trades</div>
              <div className="text-lg font-bold text-text">{stats.totalTrades}</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-[500px] bg-elev/50 rounded-xl p-4 border border-border/50">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="equityGradientBacktest" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={stats.isPositive ? '#10b981' : '#ef4444'}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor={stats.isPositive ? '#10b981' : '#ef4444'}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" opacity={0.3} />

              <XAxis
                dataKey="date"
                stroke="#9AA0AA"
                fontSize={12}
                tickLine={false}
              />

              <YAxis
                stroke="#9AA0AA"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
                formatter={(value) => (
                  <span style={{ color: '#E6E8EC', fontSize: '14px' }}>{value}</span>
                )}
              />

              {/* Equity Line */}
              <Line
                type="monotone"
                dataKey="equity"
                stroke={stats.isPositive ? '#10b981' : '#ef4444'}
                strokeWidth={3}
                dot={false}
                name="Equity"
                activeDot={{ r: 6, fill: stats.isPositive ? '#10b981' : '#ef4444' }}
              />

              {/* Entry Markers */}
              <Scatter
                dataKey="entryMarker"
                fill="#10b981"
                shape="triangle"
                name="Entry"
                legendType="circle"
              />

              {/* Exit Markers */}
              <Scatter
                dataKey="exitMarker"
                fill="#fbbf24"
                shape="triangle"
                name="Exit"
                legendType="circle"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
          <div className="text-center">
            <div className="text-xs text-dim mb-1">Start Equity</div>
            <div className="text-sm font-semibold text-text">${stats.startEquity.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-dim mb-1">End Equity</div>
            <div className="text-sm font-semibold text-text">${stats.endEquity.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-dim mb-1">Data Points</div>
            <div className="text-sm font-semibold text-text">{chartData.length}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-dim mb-1">Symbol</div>
            <div className="text-sm font-semibold text-accent">{equityData?.symbol || symbol}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
