/**
 * PnL Aggregation & Computation Library
 * PRD Step 11: PnL plumbing & fallbacks
 *
 * Features:
 * - Fee-aware cumulative PnL calculation from signals
 * - Daily returns computation
 * - Maximum drawdown calculation
 * - API-first with client-side fallback
 * - Stable results across refresh
 */

import type { SignalDTO, PnLPoint } from './types';

/**
 * Configuration for PnL calculations
 */
export interface PnLConfig {
  /** Trading fee percentage (e.g., 0.001 = 0.1%) */
  tradingFee: number;
  /** Initial equity/balance */
  initialEquity: number;
  /** Position size as fraction of equity (e.g., 0.1 = 10%) */
  positionSizeFraction: number;
}

/**
 * Default PnL configuration
 * PRD: Conservative defaults for realistic simulation
 */
export const DEFAULT_PNL_CONFIG: PnLConfig = {
  tradingFee: 0.001, // 0.1% per trade (entry + exit = 0.2% total)
  initialEquity: 10000, // $10,000 starting capital
  positionSizeFraction: 0.1, // 10% position sizing
};

/**
 * Result of a single trade calculation
 */
interface TradeResult {
  signal: SignalDTO;
  entryPrice: number;
  exitPrice: number;
  positionSize: number;
  grossPnL: number;
  fees: number;
  netPnL: number;
  timestamp: number;
}

/**
 * Aggregated PnL statistics
 */
export interface PnLStats {
  totalPnL: number;
  totalPnLPercent: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  sharpeRatio: number;
  currentEquity: number;
}

/**
 * Calculate exit price for a signal
 * Uses take-profit if available and profitable, otherwise stop-loss, or entry as fallback
 */
function calculateExitPrice(signal: SignalDTO): number {
  // If we have a take-profit and it's in the right direction, use it
  if (signal.tp) {
    const tpProfitable = signal.side === 'buy' ? signal.tp > signal.entry : signal.tp < signal.entry;
    if (tpProfitable) {
      return signal.tp;
    }
  }

  // If we have a stop-loss, use it
  if (signal.sl) {
    return signal.sl;
  }

  // Fallback to entry (neutral trade)
  return signal.entry;
}

/**
 * Calculate PnL for a single trade with fees
 */
function calculateTradePnL(
  signal: SignalDTO,
  equity: number,
  config: PnLConfig
): TradeResult {
  const entryPrice = signal.entry;
  const exitPrice = calculateExitPrice(signal);

  // Position size in quote currency
  const positionSize = equity * config.positionSizeFraction;

  // Calculate gross PnL based on side
  let grossPnL: number;
  if (signal.side === 'buy') {
    // Long: profit if exit > entry
    grossPnL = (exitPrice - entryPrice) / entryPrice * positionSize;
  } else {
    // Short: profit if exit < entry
    grossPnL = (entryPrice - exitPrice) / entryPrice * positionSize;
  }

  // Calculate fees (charged on entry and exit)
  const entryFee = positionSize * config.tradingFee;
  const exitFee = positionSize * config.tradingFee;
  const totalFees = entryFee + exitFee;

  // Net PnL after fees
  const netPnL = grossPnL - totalFees;

  return {
    signal,
    entryPrice,
    exitPrice,
    positionSize,
    grossPnL,
    fees: totalFees,
    netPnL,
    timestamp: signal.ts,
  };
}

/**
 * Aggregate signals into cumulative PnL series
 * Fee-aware calculation with realistic position sizing
 */
export function aggregateSignalsToPnL(
  signals: SignalDTO[],
  config: PnLConfig = DEFAULT_PNL_CONFIG
): PnLPoint[] {
  if (signals.length === 0) {
    return [];
  }

  // Sort signals by timestamp (oldest first)
  const sortedSignals = [...signals].sort((a, b) => a.ts - b.ts);

  let currentEquity = config.initialEquity;
  const pnlPoints: PnLPoint[] = [];

  // Add initial point
  pnlPoints.push({
    ts: sortedSignals[0].ts,
    equity: currentEquity,
    daily_pnl: 0,
  });

  // Process each signal
  for (const signal of sortedSignals) {
    const trade = calculateTradePnL(signal, currentEquity, config);
    currentEquity += trade.netPnL;

    pnlPoints.push({
      ts: signal.ts,
      equity: currentEquity,
      daily_pnl: trade.netPnL,
    });
  }

  return pnlPoints;
}

/**
 * Calculate maximum drawdown from PnL series
 * Returns both absolute and percentage values
 */
export function calculateMaxDrawdown(
  pnlPoints: PnLPoint[]
): { absolute: number; percent: number } {
  if (pnlPoints.length === 0) {
    return { absolute: 0, percent: 0 };
  }

  let runningMax = pnlPoints[0].equity;
  let maxDrawdown = 0;
  let maxDrawdownPercent = 0;

  for (const point of pnlPoints) {
    runningMax = Math.max(runningMax, point.equity);
    const drawdown = runningMax - point.equity;
    const drawdownPercent = runningMax > 0 ? (drawdown / runningMax) * 100 : 0;

    maxDrawdown = Math.max(maxDrawdown, drawdown);
    maxDrawdownPercent = Math.max(maxDrawdownPercent, drawdownPercent);
  }

  return {
    absolute: maxDrawdown,
    percent: maxDrawdownPercent,
  };
}

/**
 * Calculate daily returns from PnL series
 * Groups by day and sums daily_pnl
 */
export function calculateDailyReturns(pnlPoints: PnLPoint[]): PnLPoint[] {
  if (pnlPoints.length === 0) {
    return [];
  }

  // Group by day (UTC)
  const dailyMap = new Map<string, { equity: number; daily_pnl: number; ts: number }>();

  for (const point of pnlPoints) {
    const date = new Date(point.ts * 1000);
    const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

    if (!dailyMap.has(dayKey)) {
      dailyMap.set(dayKey, {
        equity: point.equity,
        daily_pnl: point.daily_pnl,
        ts: point.ts,
      });
    } else {
      const existing = dailyMap.get(dayKey)!;
      existing.equity = point.equity; // Use latest equity for the day
      existing.daily_pnl += point.daily_pnl; // Sum daily PnL
    }
  }

  // Convert back to array and sort by timestamp
  return Array.from(dailyMap.values())
    .sort((a, b) => a.ts - b.ts);
}

/**
 * Calculate comprehensive PnL statistics
 */
export function calculatePnLStats(
  signals: SignalDTO[],
  config: PnLConfig = DEFAULT_PNL_CONFIG
): PnLStats {
  if (signals.length === 0) {
    return {
      totalPnL: 0,
      totalPnLPercent: 0,
      maxDrawdown: 0,
      maxDrawdownPercent: 0,
      winRate: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      averageWin: 0,
      averageLoss: 0,
      profitFactor: 0,
      sharpeRatio: 0,
      currentEquity: config.initialEquity,
    };
  }

  const pnlPoints = aggregateSignalsToPnL(signals, config);
  const drawdown = calculateMaxDrawdown(pnlPoints);

  // Calculate trade statistics
  let currentEquity = config.initialEquity;
  let winningTrades = 0;
  let losingTrades = 0;
  let totalWinAmount = 0;
  let totalLossAmount = 0;
  const returns: number[] = [];

  for (const signal of signals) {
    const trade = calculateTradePnL(signal, currentEquity, config);
    currentEquity += trade.netPnL;

    if (trade.netPnL > 0) {
      winningTrades++;
      totalWinAmount += trade.netPnL;
    } else if (trade.netPnL < 0) {
      losingTrades++;
      totalLossAmount += Math.abs(trade.netPnL);
    }

    // Calculate return for Sharpe ratio
    const returnPercent = (trade.netPnL / (currentEquity - trade.netPnL)) * 100;
    returns.push(returnPercent);
  }

  const totalTrades = signals.length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const averageWin = winningTrades > 0 ? totalWinAmount / winningTrades : 0;
  const averageLoss = losingTrades > 0 ? totalLossAmount / losingTrades : 0;
  const profitFactor = totalLossAmount > 0 ? totalWinAmount / totalLossAmount : 0;

  // Calculate Sharpe ratio (assuming risk-free rate = 0 for simplicity)
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  const sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;

  const totalPnL = currentEquity - config.initialEquity;
  const totalPnLPercent = (totalPnL / config.initialEquity) * 100;

  return {
    totalPnL,
    totalPnLPercent,
    maxDrawdown: drawdown.absolute,
    maxDrawdownPercent: drawdown.percent,
    winRate,
    totalTrades,
    winningTrades,
    losingTrades,
    averageWin,
    averageLoss,
    profitFactor,
    sharpeRatio,
    currentEquity,
  };
}

/**
 * Add drawdown series to PnL points
 * Useful for charting overlays
 */
export function addDrawdownSeries(pnlPoints: PnLPoint[]): Array<PnLPoint & { drawdown: number }> {
  if (pnlPoints.length === 0) {
    return [];
  }

  let runningMax = pnlPoints[0].equity;

  return pnlPoints.map((point) => {
    runningMax = Math.max(runningMax, point.equity);
    const drawdown = runningMax > 0 ? ((point.equity - runningMax) / runningMax) * 100 : 0;

    return {
      ...point,
      drawdown,
    };
  });
}

/**
 * Resample PnL points to a specific number of points
 * Useful for reducing chart data while preserving shape
 */
export function resamplePnLPoints(pnlPoints: PnLPoint[], targetCount: number): PnLPoint[] {
  if (pnlPoints.length <= targetCount || targetCount <= 0) {
    return pnlPoints;
  }

  const step = pnlPoints.length / targetCount;
  const resampled: PnLPoint[] = [];

  for (let i = 0; i < targetCount; i++) {
    const index = Math.floor(i * step);
    resampled.push(pnlPoints[index]);
  }

  // Always include the last point
  if (resampled[resampled.length - 1] !== pnlPoints[pnlPoints.length - 1]) {
    resampled.push(pnlPoints[pnlPoints.length - 1]);
  }

  return resampled;
}
