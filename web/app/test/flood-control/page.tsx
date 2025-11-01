/**
 * Flood Control Test Page
 * PRD B3.2: Test UI with 100 signals/min simulation
 *
 * Access: http://localhost:3000/test/flood-control
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Zap, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { SignalSimulator, TEST_PRESETS, runPerformanceTest } from '@/lib/signal-simulator';
import { performanceMonitor, RenderRateTracker } from '@/lib/performance-monitor';
import type { SignalDTO } from '@/lib/types';
import SignalCard from '@/components/SignalCard';

export default function FloodControlTestPage() {
  const [signals, setSignals] = useState<SignalDTO[]>([]);
  const [simulator, setSimulator] = useState<SignalSimulator | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [rate, setRate] = useState<number>(TEST_PRESETS.NORMAL);
  const [stats, setStats] = useState({ count: 0, ratePerMin: 0 });
  const [fps, setFps] = useState(60);
  const [fpsTracker] = useState(() => new RenderRateTracker());

  // Handle signal from simulator
  const handleSignal = useCallback((signal: SignalDTO) => {
    setSignals((prev) => [signal, ...prev].slice(0, 200));
  }, []);

  // Start simulator
  const start = useCallback(() => {
    if (simulator) {
      simulator.stop();
    }

    const sim = new SignalSimulator(handleSignal);
    sim.start(rate);
    setSimulator(sim);
    setIsRunning(true);

    // Start FPS tracking
    fpsTracker.start();
  }, [rate, handleSignal, fpsTracker, simulator]);

  // Stop simulator
  const stop = useCallback(() => {
    if (simulator) {
      simulator.stop();
      setIsRunning(false);
      fpsTracker.stop();
    }
  }, [simulator, fpsTracker]);

  // Burst test
  const burst = useCallback(() => {
    if (simulator) {
      simulator.burst(50);
    }
  }, [simulator]);

  // Clear signals
  const clear = useCallback(() => {
    setSignals([]);
  }, []);

  // Update stats every second
  useEffect(() => {
    if (!isRunning || !simulator) return;

    const interval = setInterval(() => {
      const simStats = simulator.getStats();
      setStats({
        count: simStats.count,
        ratePerMin: Math.round(simStats.ratePerMin),
      });
      setFps(fpsTracker.getFPS());
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, simulator, fpsTracker]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simulator) {
        simulator.stop();
      }
      fpsTracker.stop();
    };
  }, [simulator, fpsTracker]);

  // Run performance test
  const runTest = useCallback(async () => {
    stop();
    clear();

    const results = await runPerformanceTest(TEST_PRESETS.NORMAL, 60);
    alert(`Performance Test Results:\n${JSON.stringify(results, null, 2)}`);
  }, [stop, clear]);

  return (
    <div className="min-h-screen bg-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">
            Flood Control Test
          </h1>
          <p className="text-dim">
            PRD B3.2: Test UI with high-frequency signal updates (100 signals/min)
          </p>
        </div>

        {/* Controls */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rate Control */}
            <div>
              <label className="block text-sm font-medium text-text2 mb-2">
                Signals per Minute
              </label>
              <div className="flex gap-2">
                {Object.entries(TEST_PRESETS).map(([name, value]) => (
                  <button
                    key={name}
                    onClick={() => setRate(value)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        rate === value
                          ? 'bg-accentA text-white'
                          : 'bg-surface text-text2 hover:bg-elev'
                      }
                    `}
                    disabled={isRunning}
                  >
                    {name}
                    <br />
                    <span className="text-xs opacity-70">{value}/min</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <label className="block text-sm font-medium text-text2 mb-2">
                Actions
              </label>
              <div className="flex gap-2">
                {!isRunning ? (
                  <button
                    onClick={start}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/80 transition-all"
                  >
                    <Play className="w-4 h-4" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={stop}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/80 transition-all"
                  >
                    <Pause className="w-4 h-4" />
                    Stop
                  </button>
                )}

                <button
                  onClick={burst}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-highlight text-white rounded-lg hover:bg-highlight/80 transition-all"
                  disabled={!isRunning}
                >
                  <Zap className="w-4 h-4" />
                  Burst (50)
                </button>

                <button
                  onClick={clear}
                  className="px-4 py-2 bg-surface text-text2 rounded-lg hover:bg-elev transition-all"
                >
                  Clear
                </button>

                <button
                  onClick={runTest}
                  className="px-4 py-2 bg-accentB text-white rounded-lg hover:bg-accentB/80 transition-all"
                >
                  Run 60s Test
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-accentA" />
              <div className="text-xs text-dim">Status</div>
            </div>
            <div className="text-2xl font-bold text-text">
              {isRunning ? 'Running' : 'Stopped'}
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <div className="text-xs text-dim">Signals Generated</div>
            </div>
            <div className="text-2xl font-bold text-text">{stats.count}</div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-highlight" />
              <div className="text-xs text-dim">Current Rate</div>
            </div>
            <div className="text-2xl font-bold text-text">
              {stats.ratePerMin}/min
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle
                className={`w-4 h-4 ${fps >= 55 ? 'text-success' : 'text-danger'}`}
              />
              <div className="text-xs text-dim">FPS</div>
            </div>
            <div
              className={`text-2xl font-bold ${
                fps >= 55 ? 'text-success' : 'text-danger'
              }`}
            >
              {fps}
            </div>
            <div className="text-xs text-dim mt-1">
              {fps >= 55 ? 'Smooth' : 'Degraded'}
            </div>
          </div>
        </div>

        {/* Signal Feed */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-text mb-4">
            Signal Feed ({signals.length} signals)
          </h2>

          <div className="max-h-[600px] overflow-y-auto space-y-4">
            {signals.length === 0 ? (
              <div className="text-center text-dim py-12">
                No signals yet. Click Start to begin simulation.
              </div>
            ) : (
              signals.map((signal, index) => (
                <SignalCard key={signal.id} signal={signal} index={index} />
              ))
            )}
          </div>
        </div>

        {/* Performance Monitor */}
        <div className="glass-card rounded-xl p-6 mt-6">
          <h2 className="text-xl font-bold text-text mb-4">Performance Metrics</h2>
          <button
            onClick={() => performanceMonitor.logSummary()}
            className="px-4 py-2 bg-accentA text-white rounded-lg hover:bg-accentA/80 transition-all mb-4"
          >
            Log Summary to Console
          </button>

          <div className="text-xs text-dim">
            <p>• Open browser DevTools console to see detailed metrics</p>
            <p>• PRD Requirement: 100 signals/min without UI freeze</p>
            <p>• Target: FPS ≥ 30 (smooth ≥ 55)</p>
            <p>• Batching: Updates throttled to 500ms intervals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
