/**
 * Trust Strip Component
 * Real-time trust indicators: exchange badges + <1s signal latency note
 * PRD: Rolling ticker of pairs we cover
 */

'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, TrendingUp, Activity } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/motion-variants'

const exchanges = [
  { name: 'Binance', logo: '🔶' },
  { name: 'Coinbase', logo: '🔷' },
  { name: 'Kraken', logo: '🐙' },
  { name: 'Bybit', logo: '🟡' },
  { name: 'OKX', logo: '⚫' },
]

const tradingPairs = [
  'BTC/USDT',
  'ETH/USDT',
  'SOL/USDT',
  'BNB/USDT',
  'XRP/USDT',
  'ADA/USDT',
  'AVAX/USDT',
  'MATIC/USDT',
  'DOT/USDT',
  'LINK/USDT',
]

const trustMetrics = [
  { icon: Zap, label: 'Signal Latency', value: '<500ms', color: 'cyan' },
  { icon: Shield, label: 'Uptime', value: '99.8%', color: 'green' },
  { icon: TrendingUp, label: 'Win Rate', value: '68.4%', color: 'violet' },
  { icon: Activity, label: 'Signals/Day', value: '120+', color: 'orange' },
]

const colorClasses = {
  cyan: 'text-accentA',
  green: 'text-success',
  violet: 'text-accentB',
  orange: 'text-highlight',
}

export default function TrustStrip() {
  return (
    <section className="relative w-full bg-surface/50 backdrop-blur-sm py-12 border-y border-border overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid-sm opacity-10 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Trust Metrics */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {trustMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex items-center gap-3 p-4 bg-surface/80 border border-border rounded-lg hover:border-accent/30 transition-all"
              >
                <Icon className={`w-5 h-5 ${colorClasses[metric.color as keyof typeof colorClasses]}`} />
                <div>
                  <div className="text-sm text-dim">{metric.label}</div>
                  <div className="text-lg font-bold text-text">{metric.value}</div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Exchange Badges */}
        <div className="text-center mb-8">
          <p className="text-sm text-dim mb-4">Connected to 15+ Top Exchanges</p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {exchanges.map((exchange, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-elev border border-border rounded-lg hover:border-accent/30 transition-all"
              >
                <span className="text-2xl">{exchange.logo}</span>
                <span className="text-sm font-medium text-text2">{exchange.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Rolling Ticker of Pairs */}
        <div className="relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <span className="text-xs text-dim uppercase tracking-wide">Covered Pairs</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          </div>

          <div className="relative h-10 overflow-hidden">
            <motion.div
              className="flex gap-4 absolute"
              animate={{
                x: [0, -1000],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {/* Double the array to create seamless loop */}
              {[...tradingPairs, ...tradingPairs].map((pair, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-4 py-2 bg-elev/50 border border-border/50 rounded text-sm font-mono text-text2"
                >
                  {pair}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
