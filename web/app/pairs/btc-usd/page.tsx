/**
 * BTC/USD Trading Pair Page
 * Live signals filtered for BTC/USD only
 */

'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Zap, ArrowLeft } from 'lucide-react';
import { DEFAULT_MODE } from '@/lib/env';
import PnLChart from '@/components/PnLChart';
import LiveFeed from '@/components/LiveFeed';
import { fadeInUp, staggerContainer } from '@/lib/motion-variants';
import { prefetchPnL } from '@/lib/hooks';
import PageErrorBoundary from '@/components/PageErrorBoundary';
import { performanceMark } from '@/components/WebVitals';
import { markFMPStart, measureFMP } from '@/lib/performance-monitor';
import Link from 'next/link';

function BTCUSDPageContent() {
  const mode = (DEFAULT_MODE as 'paper' | 'live') || 'paper';
  const pair = 'BTC/USD';

  useEffect(() => {
    performanceMark('btc-usd:mount');
    markFMPStart('btc-usd');

    prefetchPnL(50);
    prefetchPnL(200);
    prefetchPnL(500);

    performanceMark('btc-usd:data-prefetch-complete');

    setTimeout(() => {
      const fmp = measureFMP('btc-usd');
      if (fmp && fmp <= 1000) {
        console.log('✅ FMP requirement met:', fmp, 'ms ≤ 1000ms');
      }
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-sm opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href="/signals"
          className="inline-flex items-center gap-2 text-text2 hover:text-text transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to All Signals</span>
        </Link>

        {/* Page Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full mb-4">
            <Activity className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="text-sm font-medium text-orange-400">Bitcoin • Live Data</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-text mb-3">
            BTC/USD Trading Signals
          </h1>
          <p className="text-lg text-text2 max-w-2xl">
            AI-powered trading signals exclusively for Bitcoin. Real-time data streamed via secure Redis connection.
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
                <h2 className="text-2xl font-bold text-text">BTC/USD Performance</h2>
              </div>
              <p className="text-dim">
                Track Bitcoin trading performance across all timeframes
              </p>
            </div>
            <PnLChart initialN={500} />
          </motion.section>

          {/* Live Feed Section - Filtered for BTC/USD */}
          <motion.section variants={fadeInUp} className="scroll-mt-24" id="live-feed">
            <LiveFeed mode={mode} maxSignals={50} pair={pair} />
          </motion.section>

          {/* Info Section */}
          <motion.section variants={fadeInUp}>
            <div className="glass-card rounded-2xl p-8 border-orange-500/20">
              <h3 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                About BTC/USD Signals
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-text2 mb-4">Why Bitcoin?</h4>
                  <p className="text-sm text-dim mb-4">
                    Bitcoin (BTC) is the largest and most liquid cryptocurrency, making it ideal for algorithmic trading strategies. Our AI models are specifically trained on Bitcoin's unique market dynamics.
                  </p>
                  <ul className="space-y-2 text-sm text-dim">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      Highest market capitalization
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      24/7 liquidity across all major exchanges
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      Established price discovery mechanisms
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-text2 mb-4">Trading Specifications</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-surface/50 rounded-lg">
                      <span className="text-sm text-text2">Exchange</span>
                      <span className="text-sm font-medium text-text">Kraken</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-surface/50 rounded-lg">
                      <span className="text-sm text-text2">Base Currency</span>
                      <span className="text-sm font-medium text-text">USD</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-surface/50 rounded-lg">
                      <span className="text-sm text-text2">Timeframes</span>
                      <span className="text-sm font-medium text-text">15s, 1m, 5m</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-surface/50 rounded-lg">
                      <span className="text-sm text-text2">Strategies</span>
                      <span className="text-sm font-medium text-text">Multi-agent</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <p className="text-xs text-dim text-center max-w-3xl mx-auto">
                  <strong className="text-text2">Risk Disclaimer:</strong> Trading cryptocurrencies
                  carries substantial risk. Past performance is not indicative of future results. All
                  signals are for educational purposes only.
                </p>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}

export default function BTCUSDPage() {
  return (
    <PageErrorBoundary pageName="BTC/USD Signals" fallbackType="signals">
      <BTCUSDPageContent />
    </PageErrorBoundary>
  );
}
