/**
 * Data Contracts for Signals-Site
 * Zod schemas for runtime validation + TypeScript types
 * PRD: All API responses validated via zod before use
 */

import { z } from 'zod';

/**
 * SignalDTO Schema
 * Represents a single trading signal from the AI bot
 */
export const SignalDTOSchema = z.object({
  id: z.string().min(1, 'Signal ID required'),
  ts: z.number().int().positive('Timestamp must be positive'),
  pair: z.string().min(1, 'Trading pair required'),
  side: z.enum(['buy', 'sell'], {
    errorMap: () => ({ message: 'Side must be "buy" or "sell"' }),
  }),
  entry: z.number().positive('Entry price must be positive'),
  sl: z.number().positive('Stop loss must be positive').optional(),
  tp: z.number().positive('Take profit must be positive').optional(),
  strategy: z.string().min(1, 'Strategy name required'),
  confidence: z.number().min(0).max(1, 'Confidence must be between 0 and 1'),
  mode: z.enum(['paper', 'live'], {
    errorMap: () => ({ message: 'Mode must be "paper" or "live"' }),
  }),
});

/**
 * TypeScript type inferred from schema
 */
export type SignalDTO = z.infer<typeof SignalDTOSchema>;

/**
 * PnLPoint Schema
 * Represents a single point in the equity curve
 */
export const PnLPointSchema = z.object({
  ts: z.number().int().positive('Timestamp must be positive'),
  equity: z.number({ invalid_type_error: 'Equity must be a number' }),
  daily_pnl: z.number({ invalid_type_error: 'Daily PnL must be a number' }),
});

/**
 * TypeScript type inferred from schema
 */
export type PnLPoint = z.infer<typeof PnLPointSchema>;

/**
 * Array schemas for batch validation
 */
export const SignalDTOArraySchema = z.array(SignalDTOSchema);
export const PnLPointArraySchema = z.array(PnLPointSchema);

/**
 * API Health Check Schema
 */
export const HealthCheckSchema = z.object({
  status: z.enum(['healthy', 'degraded', 'down']),
  timestamp: z.number().int().positive(),
  version: z.string().optional(),
  services: z
    .object({
      redis: z.enum(['up', 'down']).optional(),
      api: z.enum(['up', 'down']).optional(),
    })
    .optional(),
});

export type HealthCheck = z.infer<typeof HealthCheckSchema>;

/**
 * API Error Response Schema
 */
export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  code: z.string().optional(),
  timestamp: z.number().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

/**
 * Query Parameters for Signals API
 */
export const SignalsQuerySchema = z.object({
  mode: z.enum(['paper', 'live', 'staging']).default('paper'),
  pair: z.string().optional(),
  limit: z.number().int().positive().max(1000).default(200),
});

export type SignalsQuery = z.infer<typeof SignalsQuerySchema>;

/**
 * Query Parameters for PnL API
 */
export const PnLQuerySchema = z.object({
  n: z.number().int().positive().max(10000).default(500),
});

export type PnLQuery = z.infer<typeof PnLQuerySchema>;

/**
 * Backtest Equity Point Schema
 * Single point on the equity curve from /api/backtest/{symbol_id}/equity
 */
export const BacktestEquityPointSchema = z.object({
  ts: z.string(), // ISO8601 UTC datetime
  equity: z.number(),
  balance: z.number().optional(),
  unrealized_pnl: z.number().optional(),
});

export type BacktestEquityPoint = z.infer<typeof BacktestEquityPointSchema>;

/**
 * Backtest Pairs List Response
 * Response from /api/backtest/pairs
 */
export const BacktestPairsResponseSchema = z.object({
  pairs: z.array(z.string()),
  total: z.number(),
});

export type BacktestPairsResponse = z.infer<typeof BacktestPairsResponseSchema>;

/**
 * Backtest Equity Curve Response
 * Response from /api/backtest/{symbol_id}/equity
 */
export const BacktestEquityCurveResponseSchema = z.object({
  symbol: z.string(),
  symbol_id: z.string(),
  timeframe: z.string(),
  points: z.array(BacktestEquityPointSchema),
  start_ts: z.string(),
  end_ts: z.string(),
  initial_capital: z.number(),
  final_equity: z.number(),
});

export type BacktestEquityCurveResponse = z.infer<typeof BacktestEquityCurveResponseSchema>;

/**
 * Backtest Trade Schema
 * Individual trade record from /api/backtest/{symbol_id}/trades
 */
export const BacktestTradeSchema = z.object({
  id: z.number(),
  ts_entry: z.string(),
  ts_exit: z.string(),
  side: z.enum(['long', 'short']),
  entry_price: z.number(),
  exit_price: z.number(),
  size: z.number(),
  net_pnl: z.number(),
  runup: z.number().optional(),
  drawdown: z.number().optional(),
  cumulative_pnl: z.number().optional(),
  signal: z.string().optional(),
  exit_reason: z.enum(['take_profit', 'stop_loss', 'time_exit', 'end_of_backtest', 'signal_flip']).optional(),
});

export type BacktestTrade = z.infer<typeof BacktestTradeSchema>;

/**
 * Backtest Trades Response
 * Response from /api/backtest/{symbol_id}/trades
 */
export const BacktestTradesResponseSchema = z.object({
  symbol: z.string(),
  symbol_id: z.string(),
  trades: z.array(BacktestTradeSchema),
  total_trades: z.number(),
  winning_trades: z.number(),
  losing_trades: z.number(),
  win_rate_pct: z.number(),
});

export type BacktestTradesResponse = z.infer<typeof BacktestTradesResponseSchema>;

/**
 * Backtest Summary Stats
 * Stats object from /api/backtest/{symbol_id}/summary
 */
export const BacktestStatsSchema = z.object({
  total_trades: z.number(),
  win_rate_pct: z.number(),
  profit_factor: z.number(),
  max_drawdown_pct: z.number(),
  sharpe_ratio: z.number(),
  total_return_pct: z.number(),
  initial_capital: z.number(),
  final_equity: z.number(),
});

export type BacktestStats = z.infer<typeof BacktestStatsSchema>;

/**
 * Backtest Summary Response
 * Response from /api/backtest/{symbol_id}/summary
 */
export const BacktestSummaryResponseSchema = z.object({
  symbol: z.string(),
  symbol_id: z.string(),
  timeframe: z.string(),
  start_ts: z.string(),
  end_ts: z.string(),
  stats: BacktestStatsSchema,
});

export type BacktestSummaryResponse = z.infer<typeof BacktestSummaryResponseSchema>;

/**
 * SSE Message Schema
 * For validating incoming SSE/WebSocket messages
 */
export const SSEMessageSchema = z.object({
  event: z.string().default('message'),
  data: SignalDTOSchema,
  id: z.string().optional(),
});

export type SSEMessage = z.infer<typeof SSEMessageSchema>;

/**
 * Helper function to safely parse with Zod
 * Returns parsed data or null on error
 */
export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  console.error('Zod validation failed:', result.error.flatten());
  return null;
}

/**
 * Helper function to parse or throw
 * Use when validation failure should be fatal
 */
export function parseOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}
