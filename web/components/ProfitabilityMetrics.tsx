'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProfitabilityData {
  monthly_roi_pct: number;
  monthly_roi_target_min: number;
  monthly_roi_target_max: number;
  profit_factor: number;
  sharpe_ratio: number;
  max_drawdown_pct: number;
  regime: string;
  win_rate_pct: number;
  total_trades: number;
  current_equity: number;
  cagr_pct: number;
  last_updated: string | null;
  status: string;
}

export default function ProfitabilityMetrics() {
  const [data, setData] = useState<ProfitabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://crypto-signals-api.fly.dev';

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${API_BASE}/metrics/profitability`);
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
        const metricsData = await response.json();
        setData(metricsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch profitability metrics:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [API_BASE]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-800 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-800 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
        <p className="text-red-400">Failed to load profitability metrics</p>
        {error && <p className="text-sm text-gray-400 mt-2">{error}</p>}
      </div>
    );
  }

  const getRegimeColor = (regime: string) => {
    const colors: Record<string, string> = {
      bull: 'text-green-400',
      hyper_bull: 'text-green-300',
      bear: 'text-red-400',
      sideways: 'text-yellow-400',
      extreme_vol: 'text-orange-400',
      unknown: 'text-gray-400',
    };
    return colors[regime] || 'text-gray-400';
  };

  const getRegimeIcon = (regime: string) => {
    if (regime.includes('bull')) {
      return '📈';
    } else if (regime === 'bear') {
      return '📉';
    } else if (regime === 'sideways') {
      return '↔️';
    } else if (regime === 'extreme_vol') {
      return '⚡';
    }
    return '❓';
  };

  const isRoiOnTarget =
    data.monthly_roi_pct >= data.monthly_roi_target_min &&
    data.monthly_roi_pct <= data.monthly_roi_target_max;

  return (
    <div className="space-y-6">
      {/* Monthly ROI Gauge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700 p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-1">Monthly ROI</h3>
            <p className="text-sm text-gray-500">
              Target: {data.monthly_roi_target_min}% - {data.monthly_roi_target_max}%
            </p>
          </div>
          <div
            className={`text-4xl font-bold ${isRoiOnTarget ? 'text-green-400' : 'text-yellow-400'}`}
          >
            {data.monthly_roi_pct.toFixed(2)}%
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
          <div className="absolute inset-0 flex">
            {/* Target range visualization */}
            <div
              className="h-full bg-green-500/20"
              style={{
                marginLeft: `${data.monthly_roi_target_min * 5}%`,
                width: `${(data.monthly_roi_target_max - data.monthly_roi_target_min) * 5}%`,
              }}
            />
          </div>
          {/* Current ROI indicator */}
          <div
            className={`absolute top-0 bottom-0 w-1 ${isRoiOnTarget ? 'bg-green-400' : 'bg-yellow-400'} shadow-glow`}
            style={{
              left: `${Math.min(Math.max(data.monthly_roi_pct * 5, 0), 100)}%`,
            }}
          />
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Profit Factor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
        >
          <h4 className="text-sm font-medium text-gray-400 mb-2">Profit Factor</h4>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold ${data.profit_factor >= 1.4 ? 'text-green-400' : data.profit_factor >= 1.0 ? 'text-yellow-400' : 'text-red-400'}`}
            >
              {data.profit_factor.toFixed(2)}
            </span>
            {data.profit_factor >= 1.4 && <span className="text-green-400">✓</span>}
          </div>
          <p className="text-xs text-gray-500 mt-2">Target: ≥1.4</p>
        </motion.div>

        {/* Sharpe Ratio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
        >
          <h4 className="text-sm font-medium text-gray-400 mb-2">Sharpe Ratio</h4>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold ${data.sharpe_ratio >= 1.3 ? 'text-green-400' : data.sharpe_ratio >= 1.0 ? 'text-yellow-400' : 'text-red-400'}`}
            >
              {data.sharpe_ratio.toFixed(2)}
            </span>
            {data.sharpe_ratio >= 1.3 && <span className="text-green-400">✓</span>}
          </div>
          <p className="text-xs text-gray-500 mt-2">Target: ≥1.3</p>
        </motion.div>

        {/* Max Drawdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
        >
          <h4 className="text-sm font-medium text-gray-400 mb-2">Max Drawdown</h4>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold ${data.max_drawdown_pct <= 10 ? 'text-green-400' : data.max_drawdown_pct <= 15 ? 'text-yellow-400' : 'text-red-400'}`}
            >
              {data.max_drawdown_pct.toFixed(2)}%
            </span>
            {data.max_drawdown_pct <= 10 && <span className="text-green-400">✓</span>}
          </div>
          <p className="text-xs text-gray-500 mt-2">Target: ≤10%</p>
        </motion.div>

        {/* Market Regime */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
        >
          <h4 className="text-sm font-medium text-gray-400 mb-2">Market Regime</h4>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getRegimeIcon(data.regime)}</span>
            <span className={`text-2xl font-bold capitalize ${getRegimeColor(data.regime)}`}>
              {data.regime.replace('_', ' ')}
            </span>
          </div>
        </motion.div>

        {/* CAGR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
        >
          <h4 className="text-sm font-medium text-gray-400 mb-2">CAGR</h4>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold ${data.cagr_pct >= 120 ? 'text-green-400' : data.cagr_pct >= 80 ? 'text-yellow-400' : 'text-red-400'}`}
            >
              {data.cagr_pct.toFixed(1)}%
            </span>
            {data.cagr_pct >= 120 && <span className="text-green-400">✓</span>}
          </div>
          <p className="text-xs text-gray-500 mt-2">Target: ≥120%</p>
        </motion.div>

        {/* Win Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
        >
          <h4 className="text-sm font-medium text-gray-400 mb-2">Win Rate</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-400">
              {data.win_rate_pct.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Profitable trades</p>
        </motion.div>

        {/* Total Trades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
        >
          <h4 className="text-sm font-medium text-gray-400 mb-2">Total Trades</h4>
          <span className="text-3xl font-bold text-purple-400">{data.total_trades}</span>
        </motion.div>

        {/* Current Equity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
        >
          <h4 className="text-sm font-medium text-gray-400 mb-2">Current Equity</h4>
          <span className="text-3xl font-bold text-green-400">
            ${data.current_equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </motion.div>
      </div>

      {/* Status Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${data.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}
          />
          <span>Status: {data.status}</span>
        </div>
        {data.last_updated && (
          <span>Last updated: {new Date(data.last_updated).toLocaleString()}</span>
        )}
      </div>
    </div>
  );
}
