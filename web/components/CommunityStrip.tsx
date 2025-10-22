/**
 * Community Strip Component
 * PRD Step 13: "As seen on / community" social proof strip
 *
 * Features:
 * - Discord community size
 * - Social media presence
 * - Trust indicators
 * - Responsive layout
 * - Animated entrance
 */

'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Users, TrendingUp, Award } from 'lucide-react';
import { fadeInUp } from '@/lib/motion-variants';
import { DISCORD_INVITE } from '@/lib/env';

interface CommunityMetric {
  icon: React.ElementType;
  label: string;
  value: string;
  link?: string;
}

const communityMetrics: CommunityMetric[] = [
  {
    icon: Users,
    label: 'Active Traders',
    value: '2,400+',
  },
  {
    icon: MessageCircle,
    label: 'Discord Members',
    value: '5,200+',
    link: DISCORD_INVITE,
  },
  {
    icon: TrendingUp,
    label: 'Signals Generated',
    value: '12,000+',
  },
  {
    icon: Award,
    label: 'Success Rate',
    value: '68%',
  },
];

export default function CommunityStrip() {
  return (
    <section className="relative w-full bg-surface/50 border-y border-border py-12 overflow-hidden" aria-labelledby="community-proof">
      {/* Background Effect */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-accentA/5 via-accentB/5 to-accent/5 opacity-50 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-8"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 id="community-proof" className="text-sm font-semibold text-text2 uppercase tracking-wider mb-2">
            Trusted by Traders Worldwide
          </h2>
          <p className="text-xs text-dim">
            Join thousands of traders making data-driven decisions with AI-powered signals
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {communityMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const content = (
              <div className="flex flex-col items-center gap-3 p-6 bg-bg/50 rounded-xl border border-border/50 hover:border-accent/30 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" aria-hidden="true" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-text mb-1">{metric.value}</div>
                  <div className="text-xs text-text2">{metric.label}</div>
                </div>
              </div>
            );

            return metric.link ? (
              <motion.a
                key={index}
                href={metric.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-xl"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {content}
              </motion.a>
            ) : (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {content}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-6"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-bg/30 border border-border/30 rounded-full">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden="true" />
            <span className="text-xs text-text2">Live 24/7</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-bg/30 border border-border/30 rounded-full">
            <span className="text-xs text-text2">🔒 SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-bg/30 border border-border/30 rounded-full">
            <span className="text-xs text-text2">📊 Real-time Data</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-bg/30 border border-border/30 rounded-full">
            <span className="text-xs text-text2">🚀 99.9% Uptime</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-8 text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] text-white rounded-xl font-semibold hover:bg-[#4752C4] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#5865F2]/50"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            Join Our Discord Community
          </a>
        </motion.div>
      </div>
    </section>
  );
}
