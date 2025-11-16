/**
 * Methodology Page
 * Explains the AI trading signal generation process
 * PRD-003: Critical missing page causing 404
 */

'use client';

import { motion } from 'framer-motion';
import { Brain, TrendingUp, Shield, Zap, GitBranch, BarChart3, Clock, Target } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/motion-variants';
import { getPairDisplayNames } from '@/lib/trading-pairs';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-sm opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accentA/10 border border-accentA/30 rounded-full mb-6">
            <Brain className="w-4 h-4 text-accentA" />
            <span className="text-sm font-medium text-accentA">Algorithm Explanation</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Trading Signal Methodology
          </h1>
          <p className="text-lg text-text2 max-w-2xl mx-auto">
            Our AI-powered trading system combines technical analysis, machine learning, and risk management
            to generate high-confidence cryptocurrency trading signals.
          </p>
        </motion.div>

        {/* Core Strategy */}
        <motion.section
          className="glass-card rounded-2xl p-8 mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-accentA/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-accentA" />
            </div>
            <h2 className="text-2xl font-bold text-text">Bar Reaction Strategy</h2>
          </div>

          <p className="text-text2 mb-6">
            Our primary strategy is the **Bar Reaction 5M**, a momentum-based approach that identifies
            strong price movements and enters positions with defined risk parameters.
          </p>

          <div className="grid gap-4 mt-6">
            <div className="p-4 bg-surface/50 rounded-lg border border-border/50">
              <h3 className="font-semibold text-text mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accentA" />
                Timeframe
              </h3>
              <p className="text-text2 text-sm">
                Operates on 5-minute candles for precise entry timing while filtering out market noise.
              </p>
            </div>

            <div className="p-4 bg-surface/50 rounded-lg border border-border/50">
              <h3 className="font-semibold text-text mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-success" />
                Entry Criteria
              </h3>
              <p className="text-text2 text-sm">
                Signals are generated when price action confirms a strong directional move with volume validation.
                Each signal includes entry price, stop loss, and take profit levels.
              </p>
            </div>

            <div className="p-4 bg-surface/50 rounded-lg border border-border/50">
              <h3 className="font-semibold text-text mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-danger" />
                Risk Management
              </h3>
              <p className="text-text2 text-sm">
                Every signal includes automatic stop-loss placement (typically 2-3% from entry) and
                take-profit targets based on risk/reward ratios of 1:2 or better.
              </p>
            </div>
          </div>
        </motion.section>

        {/* AI Components */}
        <motion.section
          className="glass-card rounded-2xl p-8 mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-accentB/10 rounded-lg">
              <Brain className="w-6 h-6 text-accentB" />
            </div>
            <h2 className="text-2xl font-bold text-text">AI Enhancement Layer</h2>
          </div>

          <p className="text-text2 mb-6">
            Our signals are enhanced by multiple AI agents that analyze market conditions and
            filter low-quality setups:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-surface/50 rounded-lg border border-border/50">
              <GitBranch className="w-5 h-5 text-accentB mt-1" />
              <div>
                <h3 className="font-semibold text-text mb-1">Multi-Agent Architecture</h3>
                <p className="text-text2 text-sm">
                  Specialized agents for pattern recognition, sentiment analysis, and risk assessment
                  work in parallel to validate each signal.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-surface/50 rounded-lg border border-border/50">
              <BarChart3 className="w-5 h-5 text-accentA mt-1" />
              <div>
                <h3 className="font-semibold text-text mb-1">Confidence Scoring</h3>
                <p className="text-text2 text-sm">
                  Each signal receives a confidence score (0-100%) based on historical pattern success rates
                  and current market conditions. Only high-confidence signals (60%+) are published.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-surface/50 rounded-lg border border-border/50">
              <Zap className="w-5 h-5 text-highlight mt-1" />
              <div>
                <h3 className="font-semibold text-text mb-1">Real-Time Adaptation</h3>
                <p className="text-text2 text-sm">
                  The system continuously learns from executed trades and adjusts parameters
                  to maintain edge in changing market conditions.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Backtesting Results */}
        <motion.section
          className="glass-card rounded-2xl p-8 mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-success/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-text">Verified Performance</h2>
          </div>

          <p className="text-text2 mb-6">
            Our methodology has been rigorously backtested over 12 months of historical data
            across multiple market conditions:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-success/5 rounded-lg border border-success/20">
              <div className="text-3xl font-bold text-success mb-2">+177.9%</div>
              <div className="text-sm text-text2">Total Return (12-Month)</div>
            </div>

            <div className="p-4 bg-accentA/5 rounded-lg border border-accentA/20">
              <div className="text-3xl font-bold text-accentA mb-2">61.3%</div>
              <div className="text-sm text-text2">Win Rate</div>
            </div>

            <div className="p-4 bg-accentB/5 rounded-lg border border-accentB/20">
              <div className="text-3xl font-bold text-accentB mb-2">1.41</div>
              <div className="text-sm text-text2">Sharpe Ratio</div>
            </div>

            <div className="p-4 bg-highlight/5 rounded-lg border border-highlight/20">
              <div className="text-3xl font-bold text-highlight mb-2">-8.3%</div>
              <div className="text-sm text-text2">Max Drawdown</div>
            </div>
          </div>

          <p className="text-xs text-dim mt-6 italic">
            * Backtested results include realistic Kraken exchange fees (5 bps maker) and slippage (2 bps).
            Past performance does not guarantee future results.
          </p>
        </motion.section>

        {/* Trading Pairs */}
        <motion.section
          className="glass-card rounded-2xl p-8 mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-text mb-6">Supported Trading Pairs</h2>

          <p className="text-text2 mb-6">
            The strategy is optimized for highly liquid cryptocurrency pairs on Kraken:
          </p>

          <div className="flex flex-wrap gap-3">
            {getPairDisplayNames().map((pair) => (
              <div
                key={pair}
                className="px-4 py-2 bg-surface border border-accent/20 rounded-lg text-text font-mono text-sm"
              >
                {pair}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Disclaimer */}
        <div className="p-6 bg-elev border-2 border-border rounded-xl">
          <p className="text-sm text-dim leading-relaxed">
            <strong className="text-text2">Risk Disclosure:</strong> Trading cryptocurrencies
            carries substantial risk. Our signals are for informational purposes only and do not
            constitute financial advice. Always conduct your own research, understand the risks,
            and never invest more than you can afford to lose. Consult with licensed financial
            advisors before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
