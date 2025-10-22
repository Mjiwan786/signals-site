/**
 * How It Works Component
 * Three-card explainer with animations
 * PRD: AI Signals → Risk Guardrails → Portfolio PnL
 */

'use client'

import { motion } from 'framer-motion'
import { Brain, Shield, TrendingUp, ArrowRight } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/motion-variants'

interface Step {
  number: string
  title: string
  description: string
  icon: typeof Brain
  color: 'cyan' | 'violet' | 'orange'
}

const steps: Step[] = [
  {
    number: '01',
    title: 'AI Signals',
    description:
      'Advanced neural networks analyze market data from 15+ exchanges in real-time, generating high-confidence trading signals with entry/exit prices and risk parameters.',
    icon: Brain,
    color: 'cyan',
  },
  {
    number: '02',
    title: 'Risk Guardrails',
    description:
      'Built-in safety controls including position sizing, stop-loss automation, max drawdown limits, and correlation checks to protect your portfolio from excessive risk.',
    icon: Shield,
    color: 'violet',
  },
  {
    number: '03',
    title: 'Portfolio PnL',
    description:
      'Track transparent performance metrics with live equity curves, daily returns, drawdown analysis, and per-strategy attribution—all updated in real-time.',
    icon: TrendingUp,
    color: 'orange',
  },
]

const colorClasses = {
  cyan: {
    icon: 'text-accentA',
    bg: 'bg-accentA/10',
    border: 'border-accentA/20',
    glow: 'group-hover:shadow-glow',
    gradient: 'from-accentA/5 to-transparent',
  },
  violet: {
    icon: 'text-accentB',
    bg: 'bg-accentB/10',
    border: 'border-accentB/20',
    glow: 'group-hover:shadow-glow-violet',
    gradient: 'from-accentB/5 to-transparent',
  },
  orange: {
    icon: 'text-highlight',
    bg: 'bg-highlight/10',
    border: 'border-highlight/20',
    glow: 'group-hover:shadow-glow-highlight',
    gradient: 'from-highlight/5 to-transparent',
  },
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const colors = colorClasses[step.color]
  const Icon = step.icon

  return (
    <motion.div
      variants={fadeInUp}
      className="relative group h-full"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className={`glass-card-hover rounded-2xl p-8 h-full transition-all duration-300 ${colors.glow}`}>
        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none`}
          aria-hidden="true"
        />

        {/* Grid overlay (reveals on hover) */}
        <div
          className="absolute inset-0 bg-grid-sm opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10">
          {/* Step number */}
          <div className="absolute top-0 right-0 text-6xl font-display font-bold text-border/30 select-none">
            {step.number}
          </div>

          {/* Icon */}
          <div className={`inline-flex p-4 ${colors.bg} rounded-xl mb-6`}>
            <Icon className={`w-8 h-8 ${colors.icon}`} />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-display font-bold text-text mb-4">
            {step.title}
          </h3>

          {/* Description */}
          <p className="text-text2 leading-relaxed mb-6">
            {step.description}
          </p>

          {/* Learn more link */}
          <button className="inline-flex items-center gap-2 text-sm font-medium text-text2 hover:text-accent transition-colors group/link">
            <span>Learn more</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Connecting arrow (except for last card) */}
      {index < steps.length - 1 && (
        <div className="hidden lg:block absolute top-1/2 -right-6 -translate-y-1/2 z-20">
          <ArrowRight className="w-8 h-8 text-accent/50" />
        </div>
      )}
    </motion.div>
  )
}

export default function HowItWorks() {
  return (
    <section className="relative w-full bg-elev py-20 overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-sm opacity-30 pointer-events-none" aria-hidden="true" />

      {/* Gradient fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 0%, rgba(26, 26, 36, 0.8) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text mb-4">
            How It Works in{' '}
            <span className="text-gradient">30 Seconds</span>
          </h2>
          <p className="text-lg text-text2 max-w-2xl mx-auto">
            From signal generation to portfolio tracking—everything you need to trade smarter
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative"
        >
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-dim">
            All signals are backtested on 5+ years of historical data with transparent metrics
          </p>
        </motion.div>
      </div>
    </section>
  )
}
