'use client';

import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { TrendingUp, Zap, Shield, ArrowRight, MessageCircle } from 'lucide-react';
import { fadeInUp, staggerContainer, hoverGlow } from '@/lib/motion-variants';

// Dynamic import with SSR disabled for 3D component
const Hero3D = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-64 h-64 rounded-full bg-gradient-radial opacity-30 blur-3xl" />
    </div>
  ),
});

// Smooth scroll to element
const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const discordInvite = process.env.NEXT_PUBLIC_DISCORD_INVITE || 'https://discord.gg/your-server';

  return (
    <div className="relative overflow-hidden bg-bg">
      {/* Grid overlay - ChainGPT style */}
      <div className="absolute inset-0 bg-grid pointer-events-none" aria-hidden="true" />

      {/* Radial gradient mask for grid (fades at edges) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 120% 100% at 50% 0%, transparent 0%, rgba(11, 11, 15, 0.3) 50%, rgba(11, 11, 15, 0.9) 100%)',
        }}
        aria-hidden="true"
      />

      {/* 3D Canvas Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-60">
          <Hero3D />
        </div>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-transparent" />
      </div>

      {/* Accent glow spots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Top left glow */}
        <div
          className="absolute -top-40 -left-40 w-80 h-80 bg-accentA/10 rounded-full blur-3xl"
          style={{ opacity: shouldReduceMotion ? 0.3 : 0.5 }}
        />
        {/* Bottom right glow */}
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-accentB/10 rounded-full blur-3xl"
          style={{ opacity: shouldReduceMotion ? 0.3 : 0.5 }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 lg:py-40">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface/50 border border-accent/30 rounded-full mb-8 backdrop-blur-sm"
          >
            <Zap className="w-4 h-4 text-accentA" />
            <span className="text-sm font-medium text-text2">
              Live Trading Signals • <span className="text-accentA">&lt;500ms Latency</span>
            </span>
          </motion.div>

          {/* Main Heading - Staggered animation */}
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight leading-[1.1] mb-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="overflow-hidden">
              <span className="inline-block text-gradient-neural">
                AI-Powered Signals
              </span>
            </motion.div>
            <motion.div variants={fadeInUp} className="overflow-hidden">
              <span className="inline-block text-text text-glow">
                for Crypto
              </span>
            </motion.div>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-xl md:text-2xl text-dim max-w-2xl leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Real-time AI predictions with{' '}
            <span className="text-text font-semibold">transparent P&L</span>,{' '}
            <span className="text-text font-semibold">live performance tracking</span>, and
            institutional-grade signals delivered at lightning speed.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Primary CTA - View Live PnL */}
            <button
              onClick={() => scrollToElement('live-pnl')}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-brand rounded-xl shadow-glow hover:shadow-glow-violet hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent/50 overflow-hidden"
              aria-label="Scroll to live PnL chart"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-accentA via-accentB to-highlight opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />

              {/* Button content */}
              <TrendingUp className="w-5 h-5 relative z-10" aria-hidden="true" />
              <span className="relative z-10">View Live PnL</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" aria-hidden="true" />

              {/* Glow effect */}
              <div className="absolute inset-0 blur-xl bg-gradient-brand opacity-50 group-hover:opacity-75 transition-opacity" aria-hidden="true" />
            </button>

            {/* Secondary CTA - Join Discord */}
            <a
              href={discordInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-text bg-surface/50 border-2 border-accent/30 rounded-xl hover:border-accent hover:bg-surface hover:shadow-soft backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent/50"
              aria-label="Join our Discord community (opens in new tab)"
            >
              <MessageCircle className="w-5 h-5 text-accentB" aria-hidden="true" />
              <span>Join Discord</span>
              <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" aria-hidden="true" />
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="flex flex-wrap items-center gap-6 mt-10 text-sm text-dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span>Live & Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accentB" />
              <span>Redis TLS Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-highlight" />
              <span>99.5% Uptime</span>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
