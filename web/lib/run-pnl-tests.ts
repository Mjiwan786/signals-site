/**
 * Standalone Test Runner for PnL Calculations
 * PRD Step 11: Validate drawdown calculations and aggregation logic
 *
 * Run with: npx tsx lib/run-pnl-tests.ts
 */

import type { SignalDTO, PnLPoint } from './types';
import {
  aggregateSignalsToPnL,
  calculateMaxDrawdown,
  calculateDailyReturns,
  calculatePnLStats,
  addDrawdownSeries,
  resamplePnLPoints,
  DEFAULT_PNL_CONFIG,
  type PnLConfig,
} from './pnl';

/**
 * Helper to create mock signals
 */
function createMockSignal(
  id: string,
  ts: number,
  side: 'buy' | 'sell',
  entry: number,
  tp?: number,
  sl?: number
): SignalDTO {
  return {
    id,
    ts,
    pair: 'BTC/USDT',
    side,
    entry,
    tp,
    sl,
    strategy: 'test-strategy',
    confidence: 0.8,
    mode: 'paper',
  };
}

console.log('🧪 Running PnL Calculation Tests...\n');

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   Error: ${error instanceof Error ? error.message : error}`);
    failed++;
  }
}

function assertEquals(actual: any, expected: any, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertClose(actual: number, expected: number, tolerance: number = 0.1, message?: string) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(message || `Expected ${expected} ± ${tolerance}, got ${actual}`);
  }
}

// Test 1: Empty signals
test('Empty signals returns empty PnL points', () => {
  const result = aggregateSignalsToPnL([]);
  assertEquals(result.length, 0, 'Should return empty array');
});

// Test 2: Single profitable long trade
test('Single profitable long trade calculates correctly', () => {
  const signal = createMockSignal('1', 1000, 'buy', 100, 110);
  const result = aggregateSignalsToPnL([signal], DEFAULT_PNL_CONFIG);

  assertEquals(result.length, 2, 'Should have 2 points (initial + trade)');
  assertEquals(result[0].equity, 10000, 'Initial equity should be 10000');

  // Position size = 10000 * 0.1 = 1000
  // Profit = (110 - 100) / 100 * 1000 = 100
  // Fees = 1000 * 0.001 * 2 = 2
  // Net = 100 - 2 = 98
  assertClose(result[1].equity, 10098, 1, 'Final equity should be ~10098');
});

// Test 3: Single losing short trade
test('Single losing short trade calculates correctly', () => {
  const signal = createMockSignal('1', 1000, 'sell', 100, undefined, 105);
  const result = aggregateSignalsToPnL([signal], DEFAULT_PNL_CONFIG);

  assertEquals(result.length, 2, 'Should have 2 points');

  // Short: entry 100, exit 105 (stop loss)
  // Loss = (100 - 105) / 100 * 1000 = -50
  // Fees = 2
  // Net = -50 - 2 = -52
  assertClose(result[1].equity, 9948, 1, 'Final equity should be ~9948');
});

// Test 4: Multiple trades aggregate
test('Multiple trades aggregate correctly', () => {
  const signals = [
    createMockSignal('1', 1000, 'buy', 100, 105),
    createMockSignal('2', 2000, 'sell', 200, 195),
    createMockSignal('3', 3000, 'buy', 150, undefined, 145),
  ];

  const result = aggregateSignalsToPnL(signals, DEFAULT_PNL_CONFIG);

  assertEquals(result.length, 4, 'Should have 4 points (initial + 3 trades)');
  assertEquals(result[0].equity, 10000, 'Initial equity should be 10000');

  // Verify timestamps are ordered
  for (let i = 1; i < result.length; i++) {
    if (result[i].ts < result[i - 1].ts) {
      throw new Error('Timestamps should be in ascending order');
    }
  }
});

// Test 5: Signals are sorted by timestamp
test('Signals are sorted by timestamp', () => {
  const signals = [
    createMockSignal('3', 3000, 'buy', 100, 105),
    createMockSignal('1', 1000, 'buy', 100, 105),
    createMockSignal('2', 2000, 'buy', 100, 105),
  ];

  const result = aggregateSignalsToPnL(signals, DEFAULT_PNL_CONFIG);

  for (let i = 1; i < result.length; i++) {
    if (result[i].ts < result[i - 1].ts) {
      throw new Error('Timestamps not sorted correctly');
    }
  }
});

// Test 6: Max drawdown - empty array
test('Empty PnL points returns zero drawdown', () => {
  const result = calculateMaxDrawdown([]);
  assertEquals(result.absolute, 0, 'Absolute drawdown should be 0');
  assertEquals(result.percent, 0, 'Percent drawdown should be 0');
});

// Test 7: Max drawdown - increasing equity
test('Always increasing equity has zero drawdown', () => {
  const pnlPoints: PnLPoint[] = [
    { ts: 1000, equity: 10000, daily_pnl: 0 },
    { ts: 2000, equity: 10500, daily_pnl: 500 },
    { ts: 3000, equity: 11000, daily_pnl: 500 },
  ];

  const result = calculateMaxDrawdown(pnlPoints);
  assertEquals(result.absolute, 0, 'Should have no drawdown');
  assertEquals(result.percent, 0, 'Should have no drawdown percent');
});

// Test 8: Max drawdown - real drawdown
test('Calculate drawdown correctly', () => {
  const pnlPoints: PnLPoint[] = [
    { ts: 1000, equity: 10000, daily_pnl: 0 },
    { ts: 2000, equity: 12000, daily_pnl: 2000 },
    { ts: 3000, equity: 10800, daily_pnl: -1200 },
    { ts: 4000, equity: 9600, daily_pnl: -1200 },
    { ts: 5000, equity: 11000, daily_pnl: 1400 },
  ];

  const result = calculateMaxDrawdown(pnlPoints);

  assertEquals(result.absolute, 2400, 'Max drawdown should be 2400');
  assertClose(result.percent, 20, 0.1, 'Max drawdown percent should be ~20%');
});

// Test 9: Daily returns - empty array
test('Empty daily returns returns empty array', () => {
  const result = calculateDailyReturns([]);
  assertEquals(result.length, 0, 'Should return empty array');
});

// Test 10: Daily returns - single day
test('Single day returns single point', () => {
  const pnlPoints: PnLPoint[] = [
    { ts: 1609459200, equity: 10000, daily_pnl: 0 }, // 2021-01-01
    { ts: 1609462800, equity: 10100, daily_pnl: 100 },
    { ts: 1609466400, equity: 10200, daily_pnl: 100 },
  ];

  const result = calculateDailyReturns(pnlPoints);

  assertEquals(result.length, 1, 'Should have 1 day');
  assertEquals(result[0].equity, 10200, 'Should use latest equity');
  assertEquals(result[0].daily_pnl, 200, 'Should sum daily PnL');
});

// Test 11: PnL stats - empty signals
test('Empty signals returns zero stats', () => {
  const stats = calculatePnLStats([]);

  assertEquals(stats.totalTrades, 0, 'Should have 0 trades');
  assertEquals(stats.winRate, 0, 'Should have 0 win rate');
  assertEquals(stats.totalPnL, 0, 'Should have 0 total PnL');
});

// Test 12: PnL stats - calculated correctly
test('PnL statistics calculated correctly', () => {
  const signals = [
    createMockSignal('1', 1000, 'buy', 100, 110), // Win
    createMockSignal('2', 2000, 'buy', 100, 110), // Win
    createMockSignal('3', 3000, 'buy', 100, undefined, 95), // Loss
  ];

  const stats = calculatePnLStats(signals, DEFAULT_PNL_CONFIG);

  assertEquals(stats.totalTrades, 3, 'Should have 3 trades');
  assertEquals(stats.winningTrades, 2, 'Should have 2 winning trades');
  assertEquals(stats.losingTrades, 1, 'Should have 1 losing trade');
  assertClose(stats.winRate, 66.67, 1, 'Win rate should be ~66.67%');

  if (stats.averageWin <= 0) {
    throw new Error('Average win should be positive');
  }
  if (stats.averageLoss <= 0) {
    throw new Error('Average loss should be positive');
  }
  if (stats.profitFactor <= 0) {
    throw new Error('Profit factor should be positive');
  }
});

// Test 13: Drawdown series
test('Add drawdown series to PnL points', () => {
  const pnlPoints: PnLPoint[] = [
    { ts: 1000, equity: 10000, daily_pnl: 0 },
    { ts: 2000, equity: 11000, daily_pnl: 1000 },
    { ts: 3000, equity: 10500, daily_pnl: -500 },
  ];

  const result = addDrawdownSeries(pnlPoints);

  assertEquals(result.length, 3, 'Should have 3 points');
  assertEquals(result[0].drawdown, 0, 'First point should have 0 drawdown');
  assertEquals(result[1].drawdown, 0, 'Peak should have 0 drawdown');
  assertClose(result[2].drawdown, -4.545, 0.1, 'Third point should have ~-4.545% drawdown');
});

// Test 14: Resampling
test('Resample reduces data points', () => {
  const pnlPoints: PnLPoint[] = Array.from({ length: 1000 }, (_, i) => ({
    ts: 1000 + i * 100,
    equity: 10000 + i * 10,
    daily_pnl: 10,
  }));

  const result = resamplePnLPoints(pnlPoints, 100);

  if (result.length > 101) {
    throw new Error(`Resampled length ${result.length} should be <= 101`);
  }

  // Verify first and last points are preserved
  assertEquals(result[0].ts, pnlPoints[0].ts, 'First point should be preserved');
  assertEquals(
    result[result.length - 1].ts,
    pnlPoints[pnlPoints.length - 1].ts,
    'Last point should be preserved'
  );
});

// Test 15: Stability test (same input, same output)
test('Results are stable across multiple runs', () => {
  const signals = [
    createMockSignal('1', 1000, 'buy', 100, 105),
    createMockSignal('2', 2000, 'sell', 200, 195),
  ];

  const result1 = aggregateSignalsToPnL(signals, DEFAULT_PNL_CONFIG);
  const result2 = aggregateSignalsToPnL(signals, DEFAULT_PNL_CONFIG);

  assertEquals(result1.length, result2.length, 'Results should have same length');

  for (let i = 0; i < result1.length; i++) {
    assertEquals(result1[i].ts, result2[i].ts, `Timestamp ${i} should match`);
    assertEquals(result1[i].equity, result2[i].equity, `Equity ${i} should match`);
    assertEquals(result1[i].daily_pnl, result2[i].daily_pnl, `Daily PnL ${i} should match`);
  }
});

// Summary
console.log(`\n${'='.repeat(50)}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📊 Total: ${passed + failed}`);
console.log(`${'='.repeat(50)}`);

if (failed > 0) {
  process.exit(1);
}

console.log('\n✨ All tests passed! PnL calculations are working correctly.');
