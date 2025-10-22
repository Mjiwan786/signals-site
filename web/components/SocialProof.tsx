/**
 * Social Proof Component
 * Discord members, uptime, Lighthouse score, community stats
 * PRD: Investor snapshot trust indicators
 */

'use client'

import { motion } from 'framer-motion'
import { Users, Zap, Award, TrendingUp, MessageCircle, Shield } from 'lucide-react'
import { fadeInUp, staggerContainer, hoverGlow } from '@/lib/motion-variants'
import { useCountUp } from '@/lib/useCountUp'

interface SocialProofMetric {
  icon: typeof Users
  label: string
  value: number
  suffix: string
  prefix: string
  description: string
  color: 'cyan' | 'violet' | 'orange' | 'green'
}

const metrics: SocialProofMetric[] = [
  {
    icon: Users,
    label: 'Active Traders',
    value: 1247,
    suffix: '',
    prefix: '',
    description: 'Using our signals this month',
    color: 'cyan',
  },
  {
    icon: MessageCircle,
    label: 'Discord Members',
    value: 3420,
    suffix: '+',
    prefix: '',
    description: 'Vibrant trading community',
    color: 'violet',
  },
  {
    icon: Shield,
    label: 'Uptime',
    value: 99.8,
    suffix: '%',
    prefix: '',
    description: 'System reliability SLA',
    color: 'green',
  },
  {
    icon: Award,
    label: 'Lighthouse Score',
    value: 94,
    suffix: '/100',
    prefix: '',
    description: 'Performance & Accessibility',
    color: 'orange',
  },
  {
    icon: TrendingUp,
    label: 'Signals Delivered',
    value: 12500,
    suffix: '+',
    prefix: '',
    description: 'Since platform launch',
    color: 'cyan',
  },
  {
    icon: Zap,
    label: 'Avg Response Time',
    value: 320,
    suffix: 'ms',
    prefix: '<',
    description: 'API latency (p95)',
    color: 'violet',
  },
]

const colorClasses = {
  cyan: {
    icon: 'text-accentA',
    bg: 'bg-accentA/10',
    border: 'border-accentA/20',
    glow: 'group-hover:shadow-glow',
  },
  violet: {
    icon: 'text-accentB',
    bg: 'bg-accentB/10',
    border: 'border-accentB/20',
    glow: 'group-hover:shadow-glow-violet',
  },
  orange: {
    icon: 'text-highlight',
    bg: 'bg-highlight/10',
    border: 'border-highlight/20',
    glow: 'group-hover:shadow-glow-highlight',
  },
  green: {
    icon: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
    glow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]',
  },
}

function ProofCard({ metric }: { metric: SocialProofMetric }) {
  const { count } = useCountUp({
    end: metric.value,
    duration: 2,
    decimals: metric.suffix === '%' ? 1 : 0,
    suffix: metric.suffix,
    prefix: metric.prefix,
  })
  const colors = colorClasses[metric.color]
  const Icon = metric.icon

  return (
    <motion.div
      variants={fadeInUp}
      className={`group relative glass-card-hover rounded-xl p-6 transition-all duration-300 ${colors.glow} hover:scale-[1.02]`}
    >
      {/* Background gradient accent */}
      <div
        className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none`}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Icon */}
        <div className={`inline-flex p-3 ${colors.bg} rounded-lg mb-4`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>

        {/* Value */}
        <div className="mb-2">
          <div className="text-3xl font-display font-bold text-text">
            {metric.prefix}
            {count.toLocaleString()}
            {metric.suffix}
          </div>
        </div>

        {/* Label */}
        <div className="text-sm font-semibold text-text2 mb-1">{metric.label}</div>

        {/* Description */}
        <div className="text-xs text-dim">{metric.description}</div>
      </div>

      {/* Decorative corner accent */}
      <div
        className={`absolute top-0 right-0 w-20 h-20 ${colors.bg} opacity-20 blur-2xl rounded-full pointer-events-none`}
        aria-hidden="true"
      />
    </motion.div>
  )
}

export default function SocialProof() {
  return (
    <section className="relative w-full bg-bg py-20 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" aria-hidden="true" />

      {/* Gradient overlays */}
      <div
        className="absolute top-0 left-0 w-96 h-96 bg-accentA/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-accentB/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text mb-4">
            Trusted by{' '}
            <span className="text-gradient-neural">Thousands of Traders</span>
          </h2>
          <p className="text-lg text-text2 max-w-2xl mx-auto">
            Join a growing community of traders who trust our AI-powered signals for their crypto trading strategy
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {metrics.map((metric, index) => (
            <ProofCard key={index} metric={metric} />
          ))}
        </motion.div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-surface/50 border border-accent/30 rounded-full backdrop-blur-sm">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-sm text-text2">
              SOC 2 Type II Compliant • GDPR Ready • 24/7 Support
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
