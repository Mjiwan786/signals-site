/**
 * PerformanceView Component
 * Tabbed interface for LIVE vs BACKTEST performance views
 * Features: Tab switching, conditional rendering, state management
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, FlaskConical, TrendingUp } from 'lucide-react';
import PnLChart from '@/components/PnLChart';
import BacktestChart from './BacktestChart';
import TradesTable from './TradesTable';
import PairSelector, { AVAILABLE_PAIRS } from './PairSelector';
import { useBacktestTrades } from '@/lib/hooks';

type ViewMode = 'live' | 'backtest';

interface PerformanceViewProps {
  initialMode?: ViewMode;
  showLiveFeed?: boolean; // Whether to show live feed in LIVE tab
}

export default function PerformanceView({
  initialMode = 'live',
  showLiveFeed = false
}: PerformanceViewProps) {
  const [mode, setMode] = useState<ViewMode>(initialMode);
  const [selectedPair, setSelectedPair] = useState(AVAILABLE_PAIRS[0].value);

  // Fetch trades for the selected pair (only when in backtest mode)
  const { trades, isLoading: tradesLoading } = useBacktestTrades(mode === 'backtest' ? selectedPair : null);

  return (
    <div className="w-full">
      {/* Tab Selector */}
      <div className="mb-8">
        <div className="flex items-center gap-2 p-1.5 bg-surface/80 backdrop-blur-sm border border-accent/20 rounded-xl w-fit">
          {/* LIVE Tab */}
          <button
            onClick={() => setMode('live')}
            className={`
              relative px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2
              ${
                mode === 'live'
                  ? 'text-white bg-gradient-brand shadow-glow'
                  : 'text-dim hover:text-text hover:bg-surface/50'
              }
            `}
          >
            {mode === 'live' && (
              <div className="absolute inset-0 bg-gradient-brand blur-lg opacity-50 rounded-lg -z-10" />
            )}
            <Activity className="w-4 h-4" />
            <span>LIVE</span>
            {mode === 'live' && (
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            )}
          </button>

          {/* BACKTEST Tab */}
          <button
            onClick={() => setMode('backtest')}
            className={`
              relative px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2
              ${
                mode === 'backtest'
                  ? 'text-white bg-gradient-brand shadow-glow'
                  : 'text-dim hover:text-text hover:bg-surface/50'
              }
            `}
          >
            {mode === 'backtest' && (
              <div className="absolute inset-0 bg-gradient-brand blur-lg opacity-50 rounded-lg -z-10" />
            )}
            <FlaskConical className="w-4 h-4" />
            <span>BACKTEST</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {mode === 'live' ? (
          // LIVE Performance View
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-full mb-4">
                <Activity className="w-4 h-4 text-success animate-pulse" />
                <span className="text-sm font-medium text-success">Live Performance</span>
              </div>
              <h2 className="text-3xl font-bold text-text mb-2">Real-Time Trading Results</h2>
              <p className="text-text2">
                Current performance from live trading signals. Updated in real-time via Redis TLS connection.
              </p>
            </div>

            {/* Live PnL Chart */}
            <PnLChart initialN={500} />

            {/* Additional live metrics can go here */}
          </div>
        ) : (
          // BACKTEST Performance View
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accentA/10 border border-accentA/30 rounded-full mb-4">
                  <FlaskConical className="w-4 h-4 text-accentA" />
                  <span className="text-sm font-medium text-accentA">Backtest Results</span>
                </div>
                <h2 className="text-3xl font-bold text-text mb-2">Historical Performance Analysis</h2>
                <p className="text-text2">
                  Backtested equity curves with trade-by-trade entry and exit markers.
                </p>
              </div>

              {/* Pair Selector */}
              <div className="sm:min-w-fit">
                <PairSelector value={selectedPair} onChange={setSelectedPair} />
              </div>
            </div>

            {/* Backtest Chart */}
            <BacktestChart symbol={selectedPair} />

            {/* Trades Table */}
            <TradesTable
              trades={trades}
              symbol={selectedPair}
              isLoading={tradesLoading}
            />

            {/* Info Card */}
            <div className="glass-card rounded-xl p-6 border-accent/20">
              <h3 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accentA" />
                About Backtest Data
              </h3>
              <div className="space-y-3 text-sm text-text2">
                <p>
                  Backtest results are generated from historical market data to validate strategy performance.
                  Each marker on the chart represents an actual trade entry or exit point.
                </p>
                <ul className="list-disc list-inside space-y-2 text-dim">
                  <li>
                    <span className="text-success font-medium">Green triangles</span> indicate trade entries (LONG or SHORT)
                  </li>
                  <li>
                    <span className="text-amber-500 font-medium">Yellow triangles</span> indicate trade exits
                  </li>
                  <li>Hover over markers to see trade details including entry/exit prices, P&L, and exit reasons</li>
                  <li>Results include realistic slippage and trading fees</li>
                  <li>The trades table below shows detailed statistics for each trade</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
