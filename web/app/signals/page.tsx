/**
 * Signals Page - Live Feed + PnL Chart
 * Features: SSE streaming, Recharts visualization, animated cards
 * PRD: <1s render, 60 FPS, ARIA live regions
 * Step 11: Prefetch PnL data
 * Step 12: Error boundary protection
 */

'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Zap } from 'lucide-react';
import { DEFAULT_MODE } from '@/lib/env';
import PnLChart from '@/components/PnLChart';
import LiveFeed from '@/components/LiveFeed';
import { fadeInUp, staggerContainer } from '@/lib/motion-variants';
import { prefetchPnL } from '@/lib/hooks';
import PageErrorBoundary from '@/components/PageErrorBoundary';
import { performanceMark } from '@/components/WebVitals';
import { markFMPStart, measureFMP } from '@/lib/performance-monitor';

function SignalsPageContent() {
  const mode = (DEFAULT_MODE as 'paper' | 'live') || 'paper';

  // PRD Step 11: Prefetch PnL data for all timeframes
  // PRD B3.2: Measure FMP ≤1s
  useEffect(() => {
    performanceMark('signals:mount');
    markFMPStart('signals');

    prefetchPnL(50); // 1D
    prefetchPnL(200); // 1W
    prefetchPnL(500); // 1M (default)
    prefetchPnL(1500); // 3M
    prefetchPnL(5000); // ALL

    performanceMark('signals:data-prefetch-complete');

    // Measure FMP when content is visible
    setTimeout(() => {
      const fmp = measureFMP('signals');
      if (fmp && fmp <= 1000) {
        console.log('✅ FMP requirement met:', fmp, 'ms ≤ 1000ms');
      } else if (fmp) {
        console.warn('⚠️ FMP threshold exceeded:', fmp, 'ms > 1000ms');
      }
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-sm opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accentA/10 border border-accentA/30 rounded-full mb-4">
            <Activity className="w-4 h-4 text-accentA animate-pulse" />
            <span className="text-sm font-medium text-accentA">Real-Time Data</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-text mb-3">
            Live Trading Signals
          </h1>
          <p className="text-lg text-text2 max-w-2xl">
            AI-powered signals with transparent performance tracking. All data streamed in real-time via
            secure Redis TLS connection.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          className="space-y-12"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* PnL Chart Section */}
          <motion.section variants={fadeInUp} className="scroll-mt-24" id="pnl-chart">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <h2 className="text-2xl font-bold text-text">Performance Overview</h2>
              </div>
              <p className="text-dim">
                Track cumulative equity curve with timeframe controls and drawdown overlay
              </p>
            </div>
            <PnLChart initialN={500} />
          </motion.section>

          {/* Live Feed Section */}
          <motion.section variants={fadeInUp} className="scroll-mt-24" id="live-feed">
            <LiveFeed mode={mode} maxSignals={50} />
          </motion.section>

          {/* Info Section */}
          <motion.section variants={fadeInUp}>
            <div className="glass-card rounded-2xl p-8 border-accent/20">
              <h3 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-highlight" />
                Understanding Signals
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Confidence Levels */}
                <div>
                  <h4 className="font-semibold text-text2 mb-4">Confidence Levels</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                        <span className="text-success font-bold">H</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text">High (80%+)</div>
                        <div className="text-xs text-dim">Strong signal confidence</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accentA/20 flex items-center justify-center">
                        <span className="text-accentA font-bold">M</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text">Medium (60-79%)</div>
                        <div className="text-xs text-dim">Moderate signal confidence</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-highlight/20 flex items-center justify-center">
                        <span className="text-highlight font-bold">L</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text">Low (&lt;60%)</div>
                        <div className="text-xs text-dim">Weak signal confidence</div>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Signal Types */}
                <div>
                  <h4 className="font-semibold text-text2 mb-4">Signal Types</h4>
                  <ul className="space-y-3">
                    <li>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-success/20 text-success rounded-lg mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold">BUY</span>
                      </div>
                      <p className="text-sm text-dim">
                        Long position recommendation. AI predicts price will increase.
                      </p>
                    </li>
                    <li className="mt-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-danger/20 text-danger rounded-lg mb-2">
                        <TrendingUp className="w-4 h-4 rotate-180" />
                        <span className="font-semibold">SELL</span>
                      </div>
                      <p className="text-sm text-dim">
                        Short position recommendation. AI predicts price will decrease.
                      </p>
                    </li>
                  </ul>
                </div>

                {/* Risk Management */}
                <div>
                  <h4 className="font-semibold text-text2 mb-4">Risk Management</h4>
                  <ul className="space-y-3">
                    <li>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded bg-danger/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-danger text-xs font-bold">SL</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text mb-1">Stop Loss</div>
                          <p className="text-xs text-dim">
                            Exit level if price moves against your position. Limits potential losses.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="mt-4">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-success text-xs font-bold">TP</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text mb-1">Take Profit</div>
                          <p className="text-xs text-dim">
                            Target price to close position and lock in gains. Secures profits.
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <p className="text-xs text-dim text-center max-w-3xl mx-auto">
                  <strong className="text-text2">Risk Disclaimer:</strong> Trading cryptocurrencies
                  carries substantial risk. Past performance is not indicative of future results. All
                  signals are for educational purposes only. Always conduct your own research and
                  consult with financial advisors before making investment decisions.
                </p>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignalsPage() {
  return (
    <PageErrorBoundary pageName="Signals" fallbackType="signals">
      <SignalsPageContent />
    </PageErrorBoundary>
  );
}
