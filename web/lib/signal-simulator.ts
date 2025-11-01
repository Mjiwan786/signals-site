/**
 * Signal Simulator for Testing Flood Controls
 * PRD B3.2: Simulate 100 signals/min to verify UI doesn't freeze
 *
 * Usage:
 * 1. Start simulator in browser console:
 *    import { startSimulator } from './lib/signal-simulator'
 *    startSimulator(100) // 100 signals per minute
 *
 * 2. Or use the test page:
 *    http://localhost:3000/test/flood-control
 */

import type { SignalDTO } from './types';

/**
 * Generate a random signal for testing
 */
export function generateRandomSignal(index: number): SignalDTO {
  const pairs = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'AVAX/USD', 'MATIC/USD'];
  const strategies = ['momentum', 'meanrev', 'breakout', 'scalp'];
  const side = Math.random() > 0.5 ? 'buy' : 'sell';
  const entry = Math.random() * 10000 + 1000;
  const slOffset = entry * (0.01 + Math.random() * 0.02); // 1-3% SL
  const tpOffset = entry * (0.02 + Math.random() * 0.04); // 2-6% TP

  return {
    id: `sim-${Date.now()}-${index}`,
    ts: Math.floor(Date.now() / 1000),
    pair: pairs[Math.floor(Math.random() * pairs.length)],
    side: side as 'buy' | 'sell',
    entry: parseFloat(entry.toFixed(2)),
    sl: parseFloat((side === 'buy' ? entry - slOffset : entry + slOffset).toFixed(2)),
    tp: parseFloat((side === 'buy' ? entry + tpOffset : entry - tpOffset).toFixed(2)),
    strategy: strategies[Math.floor(Math.random() * strategies.length)],
    confidence: 0.5 + Math.random() * 0.5, // 0.5 - 1.0
    mode: 'paper' as const,
  };
}

/**
 * Signal simulator class
 */
export class SignalSimulator {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;
  private signalCount = 0;
  private startTime = 0;
  private onSignal: (signal: SignalDTO) => void;

  constructor(onSignal: (signal: SignalDTO) => void) {
    this.onSignal = onSignal;
  }

  /**
   * Start simulating signals
   * @param signalsPerMinute - Number of signals to generate per minute
   */
  start(signalsPerMinute: number = 100): void {
    if (this.isRunning) {
      console.warn('[SignalSimulator] Already running');
      return;
    }

    this.isRunning = true;
    this.signalCount = 0;
    this.startTime = Date.now();

    // Calculate interval in milliseconds
    const intervalMs = (60 * 1000) / signalsPerMinute;

    console.log(
      `[SignalSimulator] Starting at ${signalsPerMinute} signals/min (${intervalMs.toFixed(2)}ms interval)`
    );

    this.intervalId = setInterval(() => {
      const signal = generateRandomSignal(this.signalCount++);
      this.onSignal(signal);

      // Log stats every 10 signals
      if (this.signalCount % 10 === 0) {
        this.logStats();
      }
    }, intervalMs);
  }

  /**
   * Stop simulating signals
   */
  stop(): void {
    if (!this.isRunning) {
      console.warn('[SignalSimulator] Not running');
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    this.logStats();
    console.log('[SignalSimulator] Stopped');
  }

  /**
   * Log simulator statistics
   */
  private logStats(): void {
    const elapsedMs = Date.now() - this.startTime;
    const elapsedMin = elapsedMs / (60 * 1000);
    const actualRate = elapsedMin > 0 ? this.signalCount / elapsedMin : 0;

    console.log('[SignalSimulator]', {
      count: this.signalCount,
      elapsed: `${elapsedMin.toFixed(2)}m`,
      rate: `${actualRate.toFixed(1)} signals/min`,
    });
  }

  /**
   * Get current statistics
   */
  getStats(): {
    count: number;
    elapsedMs: number;
    ratePerMin: number;
    isRunning: boolean;
  } {
    const elapsedMs = Date.now() - this.startTime;
    const elapsedMin = elapsedMs / (60 * 1000);
    const ratePerMin = elapsedMin > 0 ? this.signalCount / elapsedMin : 0;

    return {
      count: this.signalCount,
      elapsedMs,
      ratePerMin,
      isRunning: this.isRunning,
    };
  }

  /**
   * Burst mode: Send multiple signals immediately
   */
  burst(count: number = 50): void {
    console.log(`[SignalSimulator] Bursting ${count} signals`);
    for (let i = 0; i < count; i++) {
      const signal = generateRandomSignal(this.signalCount++);
      this.onSignal(signal);
    }
    this.logStats();
  }
}

/**
 * Create and start a simulator (for browser console)
 */
export function startSimulator(
  signalsPerMinute: number = 100
): SignalSimulator {
  // This assumes the hook is available in a global context
  // For actual testing, use the test page component
  console.warn(
    '[SignalSimulator] Use /test/flood-control page for proper testing'
  );

  const simulator = new SignalSimulator((signal) => {
    console.log('[Signal]', signal);
  });

  simulator.start(signalsPerMinute);
  return simulator;
}

/**
 * Presets for common test scenarios
 */
export const TEST_PRESETS = {
  // PRD B3.2 requirement: 100 signals/min
  NORMAL: 100,

  // Light load
  LIGHT: 30,

  // Heavy load
  HEAVY: 200,

  // Extreme load (stress test)
  EXTREME: 500,

  // Burst test (many signals at once)
  BURST: 1000,
} as const;

/**
 * Mock SSE server for testing
 * Creates a fake EventSource that emits signals at a controlled rate
 */
export class MockSSEServer {
  private simulator: SignalSimulator | null = null;
  private listeners: Array<(signal: SignalDTO) => void> = [];

  /**
   * Connect to mock SSE server
   */
  connect(signalsPerMinute: number = 100): void {
    this.simulator = new SignalSimulator((signal) => {
      // Notify all listeners
      this.listeners.forEach((listener) => listener(signal));
    });

    this.simulator.start(signalsPerMinute);
  }

  /**
   * Disconnect from mock SSE server
   */
  disconnect(): void {
    if (this.simulator) {
      this.simulator.stop();
      this.simulator = null;
    }
  }

  /**
   * Subscribe to signals
   */
  onSignal(callback: (signal: SignalDTO) => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Trigger a burst of signals
   */
  burst(count: number = 50): void {
    if (this.simulator) {
      this.simulator.burst(count);
    }
  }

  /**
   * Get server statistics
   */
  getStats() {
    return this.simulator?.getStats() || null;
  }
}

/**
 * Browser performance test
 * Measures FPS and memory during signal flood
 */
export async function runPerformanceTest(
  signalsPerMinute: number = 100,
  durationSeconds: number = 60
): Promise<{
  avgFps: number;
  minFps: number;
  maxFps: number;
  droppedFrames: number;
  memoryIncrease: number;
}> {
  console.log(
    `[PerformanceTest] Starting ${signalsPerMinute} signals/min for ${durationSeconds}s`
  );

  const fpsReadings: number[] = [];
  let droppedFrames = 0;
  let lastTime = performance.now();
  let frameCount = 0;

  const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

  // FPS measurement loop
  const measureFPS = () => {
    frameCount++;
    const now = performance.now();
    const delta = now - lastTime;

    if (delta >= 1000) {
      const fps = Math.round((frameCount * 1000) / delta);
      fpsReadings.push(fps);

      if (fps < 55) {
        droppedFrames++;
      }

      frameCount = 0;
      lastTime = now;
    }

    requestAnimationFrame(measureFPS);
  };

  const rafId = requestAnimationFrame(measureFPS);

  // Wait for duration
  await new Promise((resolve) => setTimeout(resolve, durationSeconds * 1000));

  // Stop measurement
  cancelAnimationFrame(rafId);

  const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
  const memoryIncrease = finalMemory - initialMemory;

  const avgFps = fpsReadings.reduce((a, b) => a + b, 0) / fpsReadings.length;
  const minFps = Math.min(...fpsReadings);
  const maxFps = Math.max(...fpsReadings);

  const results = {
    avgFps: Math.round(avgFps),
    minFps,
    maxFps,
    droppedFrames,
    memoryIncrease: Math.round(memoryIncrease / 1024 / 1024), // MB
  };

  console.log('[PerformanceTest] Results:', results);
  return results;
}
