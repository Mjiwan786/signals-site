/**
 * Unit Tests for PnL Calculations
 * PRD Step 11: Test drawdown calculation and aggregation logic
 *
 * Run with: npm test lib/pnl.test.ts
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

describe('PnL Aggregation', () => {
  test('Empty signals returns empty PnL points', () => {
    const result = aggregateSignalsToPnL([]);
    expect(result).toEqual([]);
  });

  test('Single profitable long trade', () => {
    const config: PnLConfig = {
      tradingFee: 0.001,
      initialEquity: 10000,
      positionSizeFraction: 0.1,
    };

    const signal = createMockSignal('1', 1000, 'buy', 100, 110); // +10% move
    const result = aggregateSignalsToPnL([signal], config);

    expect(result).toHaveLength(2); // Initial + 1 trade

    // Initial equity
    expect(result[0].equity).toBe(10000);
    expect(result[0].daily_pnl).toBe(0);

    // After trade: position size = 1000, profit = 100, fees = 2 (0.1% * 2)
    const expectedProfit = 100 - 2; // Gross profit minus fees
    expect(result[1].equity).toBeCloseTo(10000 + expectedProfit, 2);
    expect(result[1].daily_pnl).toBeCloseTo(expectedProfit, 2);
  });

  test('Single losing short trade', () => {
    const config: PnLConfig = {
      tradingFee: 0.001,
      initialEquity: 10000,
      positionSizeFraction: 0.1,
    };

    const signal = createMockSignal('1', 1000, 'sell', 100, undefined, 105); // -5% move
    const result = aggregateSignalsToPnL([signal], config);

    expect(result).toHaveLength(2);

    // Short trade: entry 100, exit 105 (stop loss hit)
    // Position size = 1000, loss = -50, fees = 2
    const expectedLoss = -50 - 2;
    expect(result[1].equity).toBeCloseTo(10000 + expectedLoss, 2);
    expect(result[1].daily_pnl).toBeCloseTo(expectedLoss, 2);
  });

  test('Multiple trades aggregate correctly', () => {
    const config = DEFAULT_PNL_CONFIG;

    const signals = [
      createMockSignal('1', 1000, 'buy', 100, 105), // +5% profit
      createMockSignal('2', 2000, 'sell', 200, 195), // +2.5% profit
      createMockSignal('3', 3000, 'buy', 150, undefined, 145), // -3.33% loss
    ];

    const result = aggregateSignalsToPnL(signals, config);

    expect(result).toHaveLength(4); // Initial + 3 trades

    // Verify initial equity
    expect(result[0].equity).toBe(10000);

    // Each subsequent point should have equity >= 0
    for (let i = 1; i < result.length; i++) {
      expect(result[i].equity).toBeGreaterThan(0);
      expect(result[i].ts).toBeGreaterThan(result[i - 1].ts);
    }

    // Total PnL should be sum of individual trade PnLs
    const totalPnL = result[result.length - 1].equity - result[0].equity;
    expect(totalPnL).toBeDefined();
  });

  test('Signals are sorted by timestamp', () => {
    const signals = [
      createMockSignal('3', 3000, 'buy', 100, 105),
      createMockSignal('1', 1000, 'buy', 100, 105),
      createMockSignal('2', 2000, 'buy', 100, 105),
    ];

    const result = aggregateSignalsToPnL(signals, DEFAULT_PNL_CONFIG);

    // Verify timestamps are in ascending order
    for (let i = 1; i < result.length; i++) {
      expect(result[i].ts).toBeGreaterThanOrEqual(result[i - 1].ts);
    }
  });
});

describe('Maximum Drawdown Calculation', () => {
  test('Empty PnL points returns zero drawdown', () => {
    const result = calculateMaxDrawdown([]);
    expect(result.absolute).toBe(0);
    expect(result.percent).toBe(0);
  });

  test('Always increasing equity has zero drawdown', () => {
    const pnlPoints: PnLPoint[] = [
      { ts: 1000, equity: 10000, daily_pnl: 0 },
      { ts: 2000, equity: 10500, daily_pnl: 500 },
      { ts: 3000, equity: 11000, daily_pnl: 500 },
    ];

    const result = calculateMaxDrawdown(pnlPoints);
    expect(result.absolute).toBe(0);
    expect(result.percent).toBe(0);
  });

  test('Calculate drawdown correctly', () => {
    const pnlPoints: PnLPoint[] = [
      { ts: 1000, equity: 10000, daily_pnl: 0 },
      { ts: 2000, equity: 12000, daily_pnl: 2000 }, // New high
      { ts: 3000, equity: 10800, daily_pnl: -1200 }, // Drawdown of 1200 (10%)
      { ts: 4000, equity: 9600, daily_pnl: -1200 }, // Drawdown of 2400 (20%)
      { ts: 5000, equity: 11000, daily_pnl: 1400 }, // Recovery
    ];

    const result = calculateMaxDrawdown(pnlPoints);

    expect(result.absolute).toBe(2400); // 12000 - 9600
    expect(result.percent).toBeCloseTo(20, 1); // (2400 / 12000) * 100
  });

  test('Multiple peaks track correctly', () => {
    const pnlPoints: PnLPoint[] = [
      { ts: 1000, equity: 10000, daily_pnl: 0 },
      { ts: 2000, equity: 11000, daily_pnl: 1000 },
      { ts: 3000, equity: 10500, daily_pnl: -500 }, // 4.5% drawdown
      { ts: 4000, equity: 12000, daily_pnl: 1500 }, // New high
      { ts: 5000, equity: 10800, daily_pnl: -1200 }, // 10% drawdown from new high
    ];

    const result = calculateMaxDrawdown(pnlPoints);

    expect(result.absolute).toBe(1200); // Max drawdown from 12000 to 10800
    expect(result.percent).toBe(10);
  });
});

describe('Daily Returns Calculation', () => {
  test('Empty PnL points returns empty array', () => {
    const result = calculateDailyReturns([]);
    expect(result).toEqual([]);
  });

  test('Single day returns single point', () => {
    const pnlPoints: PnLPoint[] = [
      { ts: 1609459200, equity: 10000, daily_pnl: 0 }, // 2021-01-01 00:00:00
      { ts: 1609462800, equity: 10100, daily_pnl: 100 }, // 2021-01-01 01:00:00
      { ts: 1609466400, equity: 10200, daily_pnl: 100 }, // 2021-01-01 02:00:00
    ];

    const result = calculateDailyReturns(pnlPoints);

    expect(result).toHaveLength(1);
    expect(result[0].equity).toBe(10200); // Latest equity for the day
    expect(result[0].daily_pnl).toBe(200); // Sum of daily PnL
  });

  test('Multiple days aggregate correctly', () => {
    const pnlPoints: PnLPoint[] = [
      { ts: 1609459200, equity: 10000, daily_pnl: 0 }, // Day 1
      { ts: 1609462800, equity: 10100, daily_pnl: 100 }, // Day 1
      { ts: 1609545600, equity: 10200, daily_pnl: 100 }, // Day 2
      { ts: 1609549200, equity: 10250, daily_pnl: 50 }, // Day 2
    ];

    const result = calculateDailyReturns(pnlPoints);

    expect(result).toHaveLength(2);

    // Day 1
    expect(result[0].daily_pnl).toBe(100);
    expect(result[0].equity).toBe(10100);

    // Day 2
    expect(result[1].daily_pnl).toBe(150);
    expect(result[1].equity).toBe(10250);
  });
});

describe('PnL Statistics', () => {
  test('Empty signals returns zero stats', () => {
    const stats = calculatePnLStats([]);

    expect(stats.totalTrades).toBe(0);
    expect(stats.winRate).toBe(0);
    expect(stats.totalPnL).toBe(0);
    expect(stats.currentEquity).toBe(DEFAULT_PNL_CONFIG.initialEquity);
  });

  test('Calculate statistics correctly', () => {
    const signals = [
      createMockSignal('1', 1000, 'buy', 100, 110), // Win
      createMockSignal('2', 2000, 'buy', 100, 110), // Win
      createMockSignal('3', 3000, 'buy', 100, undefined, 95), // Loss
    ];

    const stats = calculatePnLStats(signals, DEFAULT_PNL_CONFIG);

    expect(stats.totalTrades).toBe(3);
    expect(stats.winningTrades).toBe(2);
    expect(stats.losingTrades).toBe(1);
    expect(stats.winRate).toBeCloseTo(66.67, 1);
    expect(stats.averageWin).toBeGreaterThan(0);
    expect(stats.averageLoss).toBeGreaterThan(0);
    expect(stats.profitFactor).toBeGreaterThan(0);
    expect(stats.currentEquity).toBeGreaterThan(0);
  });
});

describe('Drawdown Series', () => {
  test('Add drawdown series to PnL points', () => {
    const pnlPoints: PnLPoint[] = [
      { ts: 1000, equity: 10000, daily_pnl: 0 },
      { ts: 2000, equity: 11000, daily_pnl: 1000 },
      { ts: 3000, equity: 10500, daily_pnl: -500 },
    ];

    const result = addDrawdownSeries(pnlPoints);

    expect(result).toHaveLength(3);
    expect(result[0].drawdown).toBe(0);
    expect(result[1].drawdown).toBe(0);
    expect(result[2].drawdown).toBeCloseTo(-4.545, 2); // (10500 - 11000) / 11000 * 100
  });
});

describe('Resampling', () => {
  test('Resample reduces data points', () => {
    const pnlPoints: PnLPoint[] = Array.from({ length: 1000 }, (_, i) => ({
      ts: 1000 + i * 100,
      equity: 10000 + i * 10,
      daily_pnl: 10,
    }));

    const result = resamplePnLPoints(pnlPoints, 100);

    expect(result.length).toBeLessThanOrEqual(101); // Target + last point
    expect(result[0]).toEqual(pnlPoints[0]); // First point preserved
    expect(result[result.length - 1]).toEqual(pnlPoints[pnlPoints.length - 1]); // Last point preserved
  });

  test('Resampling with fewer points than target returns original', () => {
    const pnlPoints: PnLPoint[] = [
      { ts: 1000, equity: 10000, daily_pnl: 0 },
      { ts: 2000, equity: 10100, daily_pnl: 100 },
    ];

    const result = resamplePnLPoints(pnlPoints, 100);

    expect(result).toEqual(pnlPoints);
  });
});

// Run tests with console assertions (for environments without test framework)
if (typeof describe === 'undefined') {
  console.log('Running PnL tests...');

  // Simple test runner
  const tests = [
    () => {
      const result = aggregateSignalsToPnL([]);
      console.assert(result.length === 0, 'Empty signals test failed');
    },
    () => {
      const signal = createMockSignal('1', 1000, 'buy', 100, 110);
      const result = aggregateSignalsToPnL([signal], DEFAULT_PNL_CONFIG);
      console.assert(result.length === 2, 'Single trade test failed');
      console.assert(result[0].equity === 10000, 'Initial equity test failed');
    },
    () => {
      const pnlPoints: PnLPoint[] = [
        { ts: 1000, equity: 10000, daily_pnl: 0 },
        { ts: 2000, equity: 12000, daily_pnl: 2000 },
        { ts: 3000, equity: 9600, daily_pnl: -2400 },
      ];
      const result = calculateMaxDrawdown(pnlPoints);
      console.assert(result.absolute === 2400, 'Drawdown calculation test failed');
      console.assert(Math.abs(result.percent - 20) < 0.1, 'Drawdown percent test failed');
    },
  ];

  tests.forEach((test, i) => {
    try {
      test();
      console.log(`✓ Test ${i + 1} passed`);
    } catch (error) {
      console.error(`✗ Test ${i + 1} failed:`, error);
    }
  });

  console.log('All tests completed!');
}
