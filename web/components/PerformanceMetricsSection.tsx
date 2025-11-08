/**
 * PerformanceMetricsSection - Real-time Performance Metrics Dashboard
 *
 * Displays live trading performance metrics with SSE streaming:
 * - Aggressive Mode Score
 * - Velocity to Target (progress %)
 * - Days Remaining Estimate
 *
 * Features:
 * - SSE streaming from signals-api
 * - Sparkline charts for each metric
 * - Auto-reconnection with exponential backoff
 * - Connection status indicator
 * - Metric history tracking (last 50 data points)
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import PerformanceMetricsCard from './PerformanceMetricsCard';
import { useSSE } from '@/lib/useSSE';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface PerformanceMetrics {
  aggressive_mode_score?: number;
  velocity_to_target?: number;
  days_remaining_estimate?: number | null;
  win_rate?: number;
  total_trades?: number;
  current_equity_usd?: number;
  timestamp?: number;
}

interface MetricEvent {
  metric: string;
  data: Record<string, string>;
  stream: string;
}

const MAX_HISTORY = 50;

export default function PerformanceMetricsSection() {
  // State for each metric
  const [aggressiveScore, setAggressiveScore] = useState<number | null>(null);
  const [velocityToTarget, setVelocityToTarget] = useState<number | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  // History for sparklines
  const [aggressiveHistory, setAggressiveHistory] = useState<number[]>([]);
  const [velocityHistory, setVelocityHistory] = useState<number[]>([]);
  const [daysHistory, setDaysHistory] = useState<number[]>([]);

  // Additional stats
  const [winRate, setWinRate] = useState<number | null>(null);
  const [totalTrades, setTotalTrades] = useState<number>(0);
  const [currentEquity, setCurrentEquity] = useState<number>(10000);

  // SSE connection for performance metrics stream
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://crypto-signals-api.fly.dev';

  const handleMetricUpdate = useCallback((event: MetricEvent) => {
    const { metric, data } = event;

    // Parse data fields
    const parseFloat =  (val: string | undefined): number | null => {
      if (!val || val === 'None' || val === 'null') return null;
      const parsed = Number(val);
      return isNaN(parsed) ? null : parsed;
    };

    // Handle different metric types
    if (metric === 'performance') {
      // Complete performance snapshot
      const aggressive = parseFloat(data.aggressive_mode_score);
      const velocity = parseFloat(data.velocity_to_target);
      const days = parseFloat(data.days_remaining_estimate);

      if (aggressive !== null) {
        setAggressiveScore(aggressive);
        setAggressiveHistory(prev => [...prev, aggressive].slice(-MAX_HISTORY));
      }

      if (velocity !== null) {
        setVelocityToTarget(velocity);
        setVelocityHistory(prev => [...prev, velocity].slice(-MAX_HISTORY));
      }

      if (days !== null) {
        setDaysRemaining(days);
        setDaysHistory(prev => [...prev, days].slice(-MAX_HISTORY));
      }

      // Update stats
      const wr = parseFloat(data.win_rate);
      if (wr !== null) setWinRate(wr);

      const trades = parseFloat(data.total_trades);
      if (trades !== null) setTotalTrades(Math.floor(trades));

      const equity = parseFloat(data.current_equity_usd);
      if (equity !== null) setCurrentEquity(equity);

    } else if (metric === 'aggressive_mode_score') {
      const value = parseFloat(data.value);
      if (value !== null) {
        setAggressiveScore(value);
        setAggressiveHistory(prev => [...prev, value].slice(-MAX_HISTORY));
      }
    } else if (metric === 'velocity_to_target') {
      const value = parseFloat(data.value);
      if (value !== null) {
        setVelocityToTarget(value);
        setVelocityHistory(prev => [...prev, value].slice(-MAX_HISTORY));
      }
    } else if (metric === 'days_remaining') {
      const value = parseFloat(data.value);
      if (value !== null) {
        setDaysRemaining(value);
        setDaysHistory(prev => [...prev, value].slice(-MAX_HISTORY));
      }
    }
  }, []);

  const { isConnected, error, reconnectAttempt } = useSSE<MetricEvent>({
    url: `${apiUrl}/metrics/performance/stream`,
    eventName: 'message', // Will handle all events generically
    onMessage: handleMetricUpdate,
    enabled: true,
  });

  // Initial load from REST API
  useEffect(() => {
    const loadInitialMetrics = async () => {
      try {
        const response = await fetch(`${apiUrl}/metrics/performance`);
        if (response.ok) {
          const data: PerformanceMetrics = await response.json();

          if (data.aggressive_mode_score !== undefined) {
            setAggressiveScore(data.aggressive_mode_score);
            setAggressiveHistory([data.aggressive_mode_score]);
          }

          if (data.velocity_to_target !== undefined) {
            setVelocityToTarget(data.velocity_to_target);
            setVelocityHistory([data.velocity_to_target]);
          }

          if (data.days_remaining_estimate !== undefined && data.days_remaining_estimate !== null) {
            setDaysRemaining(data.days_remaining_estimate);
            setDaysHistory([data.days_remaining_estimate]);
          }

          if (data.win_rate !== undefined) setWinRate(data.win_rate);
          if (data.total_trades !== undefined) setTotalTrades(data.total_trades);
          if (data.current_equity_usd !== undefined) setCurrentEquity(data.current_equity_usd);
        }
      } catch (err) {
        console.error('Failed to load initial metrics:', err);
      }
    };

    loadInitialMetrics();
  }, [apiUrl]);

  // Interpretations
  const getAggressiveInterpretation = (score: number | null): string => {
    if (score === null) return 'Waiting for data...';
    if (score >= 2.0) return 'Excellent - Strong risk-adjusted returns';
    if (score >= 1.5) return 'Very Good - Positive risk profile';
    if (score >= 1.0) return 'Good - Balanced performance';
    if (score >= 0.5) return 'Fair - Room for improvement';
    return 'Poor - Review strategy';
  };

  const getVelocityDescription = (velocity: number | null): string => {
    if (velocity === null) return 'Waiting for data...';
    return `$${currentEquity.toLocaleString()} / $20,000`;
  };

  const getDaysDescription = (days: number | null): string => {
    if (days === null || days === Infinity || days > 999) {
      return 'Insufficient data or negative daily rate';
    }
    if (days < 7) return 'Target within a week!';
    if (days < 30) return 'On track - less than a month';
    if (days < 90) return 'Moderate pace - under 3 months';
    return 'Slow progress at current rate';
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">Performance Metrics</h2>
          <p className="text-sm text-dim mt-1">
            Real-time P&L optimization progress tracking
          </p>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2 text-sm">
          {isConnected ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-dim">Live</span>
            </>
          ) : error ? (
            <>
              <AlertCircle className="w-4 h-4 text-danger" />
              <span className="text-danger">
                {reconnectAttempt > 0 ? `Reconnecting (${reconnectAttempt})...` : 'Disconnected'}
              </span>
            </>
          ) : (
            <>
              <Loader2 className="w-4 h-4 text-warning animate-spin" />
              <span className="text-warning">Connecting...</span>
            </>
          )}
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Aggressive Mode Score */}
        <PerformanceMetricsCard
          metric="aggressive"
          label="Aggressive Mode Score"
          value={aggressiveScore}
          interpretation={getAggressiveInterpretation(aggressiveScore)}
          description="Risk-adjusted performance metric"
          history={aggressiveHistory}
        />

        {/* Velocity to Target */}
        <PerformanceMetricsCard
          metric="velocity"
          label="Progress to $20k Target"
          value={velocityToTarget}
          description={getVelocityDescription(velocityToTarget)}
          history={velocityHistory}
        />

        {/* Days Remaining */}
        <PerformanceMetricsCard
          metric="days_remaining"
          label="Est. Days to Target"
          value={daysRemaining}
          interpretation={getDaysDescription(daysRemaining)}
          description={`Based on current daily rate`}
          history={daysHistory}
        />
      </div>

      {/* Additional Stats Row */}
      {totalTrades > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-surface/30 backdrop-blur-sm rounded-lg border border-accent/10">
          <div className="text-center">
            <p className="text-xs text-dim mb-1">Win Rate</p>
            <p className="text-lg font-bold text-text">
              {winRate !== null ? `${(winRate * 100).toFixed(1)}%` : 'N/A'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-dim mb-1">Total Trades</p>
            <p className="text-lg font-bold text-text">{totalTrades}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-dim mb-1">Current Equity</p>
            <p className="text-lg font-bold text-text">
              ${currentEquity.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isConnected && (
        <div className="p-4 bg-danger/5 border border-danger/20 rounded-lg">
          <div className="flex items-center gap-2 text-danger">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Connection Error</span>
          </div>
          <p className="text-sm text-dim mt-2">
            Unable to stream real-time metrics. Attempting to reconnect...
          </p>
        </div>
      )}
    </section>
  );
}
