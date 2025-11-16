/**
 * TradesTable Component
 * TradingView-style table displaying backtest trades with sortable columns
 * Features: Entry/exit details, P&L, cumulative stats, exit reasons
 */

'use client';

import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpDown, AlertCircle } from 'lucide-react';
import type { BacktestTrade } from '@/lib/types';

interface TradesTableProps {
  trades: BacktestTrade[];
  symbol?: string;
  isLoading?: boolean;
}

type SortField = 'id' | 'ts_entry' | 'ts_exit' | 'side' | 'entry_price' | 'exit_price' | 'net_pnl';
type SortDirection = 'asc' | 'desc';

export default function TradesTable({ trades, symbol, isLoading = false }: TradesTableProps) {
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Sort trades
  const sortedTrades = useMemo(() => {
    const sorted = [...trades];
    sorted.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle date fields
      if (sortField === 'ts_entry' || sortField === 'ts_exit') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [trades, sortField, sortDirection]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const winning = trades.filter(t => t.net_pnl > 0);
    const losing = trades.filter(t => t.net_pnl < 0);
    const totalPnL = trades.reduce((sum, t) => sum + t.net_pnl, 0);
    const avgWin = winning.length > 0 ? winning.reduce((sum, t) => sum + t.net_pnl, 0) / winning.length : 0;
    const avgLoss = losing.length > 0 ? losing.reduce((sum, t) => sum + t.net_pnl, 0) / losing.length : 0;
    const winRate = trades.length > 0 ? (winning.length / trades.length) * 100 : 0;

    return {
      total: trades.length,
      winning: winning.length,
      losing: losing.length,
      totalPnL,
      avgWin,
      avgLoss,
      winRate,
    };
  }, [trades]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-dim uppercase tracking-wider cursor-pointer hover:text-text transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown className="w-3 h-3" />
      </div>
    </th>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (entryTs: string, exitTs: string) => {
    const duration = new Date(exitTs).getTime() - new Date(entryTs).getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="w-full glass-card rounded-2xl p-6 border-accent/30">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-elev/50 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-elev/50 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="w-full glass-card rounded-2xl p-8 border-accent/30">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-dim mb-4" />
          <h3 className="text-lg font-semibold text-text mb-2">No Trades Available</h3>
          <p className="text-dim">
            {symbol ? `No trades recorded for ${symbol}.` : 'No trades to display.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Summary Stats */}
      <div className="glass-card rounded-2xl p-6 border-accent/30">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="text-center">
            <div className="text-xs text-dim mb-1">Total Trades</div>
            <div className="text-lg font-bold text-text">{stats.total}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-dim mb-1">Winning</div>
            <div className="text-lg font-bold text-success">{stats.winning}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-dim mb-1">Losing</div>
            <div className="text-lg font-bold text-danger">{stats.losing}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-dim mb-1">Win Rate</div>
            <div className="text-lg font-bold text-text">{stats.winRate.toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-dim mb-1">Total P&L</div>
            <div className={`text-lg font-bold ${stats.totalPnL >= 0 ? 'text-success' : 'text-danger'}`}>
              {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-dim mb-1">Avg Win</div>
            <div className="text-lg font-bold text-success">+${stats.avgWin.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-dim mb-1">Avg Loss</div>
            <div className="text-lg font-bold text-danger">${stats.avgLoss.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Trades Table */}
      <div className="glass-card rounded-2xl border-accent/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-elev/50 border-b border-border/50">
              <tr>
                <SortableHeader field="id">#</SortableHeader>
                <SortableHeader field="ts_entry">Entry Time</SortableHeader>
                <SortableHeader field="ts_exit">Exit Time</SortableHeader>
                <th className="px-4 py-3 text-left text-xs font-semibold text-dim uppercase tracking-wider">
                  Duration
                </th>
                <SortableHeader field="side">Side</SortableHeader>
                <SortableHeader field="entry_price">Entry Price</SortableHeader>
                <SortableHeader field="exit_price">Exit Price</SortableHeader>
                <th className="px-4 py-3 text-left text-xs font-semibold text-dim uppercase tracking-wider">
                  Size
                </th>
                <SortableHeader field="net_pnl">Net P&L</SortableHeader>
                <th className="px-4 py-3 text-left text-xs font-semibold text-dim uppercase tracking-wider">
                  Exit Reason
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {sortedTrades.map((trade) => (
                <tr
                  key={trade.id}
                  className="hover:bg-elev/30 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-text2">{trade.id}</td>
                  <td className="px-4 py-3 text-sm text-text2">{formatDate(trade.ts_entry)}</td>
                  <td className="px-4 py-3 text-sm text-text2">{formatDate(trade.ts_exit)}</td>
                  <td className="px-4 py-3 text-sm text-dim">
                    {formatDuration(trade.ts_entry, trade.ts_exit)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {trade.side === 'long' ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-success" />
                          <span className="text-sm font-semibold text-success uppercase">LONG</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 text-danger" />
                          <span className="text-sm font-semibold text-danger uppercase">SHORT</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-text">
                    ${trade.entry_price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-text">
                    ${trade.exit_price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-text2">
                    {trade.size.toFixed(4)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${trade.net_pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                        {trade.net_pnl >= 0 ? '+' : ''}${trade.net_pnl.toFixed(2)}
                      </span>
                      {trade.cumulative_pnl !== undefined && (
                        <span className="text-xs text-dim">
                          Cum: ${trade.cumulative_pnl.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {trade.exit_reason && (
                      <span className="text-xs px-2 py-1 rounded-full bg-elev/50 text-text2">
                        {trade.exit_reason.replace(/_/g, ' ')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-elev/30 border-t border-border/50 px-6 py-3">
          <div className="text-xs text-dim text-center">
            Showing {sortedTrades.length} trade{sortedTrades.length !== 1 ? 's' : ''}
            {symbol && ` for ${symbol}`}
          </div>
        </div>
      </div>
    </div>
  );
}
