'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp } from 'lucide-react';
import PnLChart from './PnLChart';
import { fadeInUp } from '@/lib/motion';

// Dynamic import for 3D component to avoid SSR issues
const PnLGrid3D = dynamic(() => import('./PnLGrid3D'), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

type Timeframe = {
  label: string;
  value: '7d' | '30d' | '12m' | 'all';
  days: number;
  description: string;
};

const timeframes: Timeframe[] = [
  { label: '7D', value: '7d', days: 50, description: 'Last 7 days' },
  { label: '30D', value: '30d', days: 200, description: 'Last 30 days' },
  { label: '12M', value: '12m', days: 500, description: 'Last 12 months' },
  { label: 'ALL', value: 'all', days: 1000, description: 'All time' },
];

export default function PnLSection() {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>(timeframes[2]); // Default to 12M

  return (
    <section className="relative w-full bg-elev py-20 overflow-hidden" id="pnl-chart">
      {/* 3D Grid Background - Temporarily disabled due to build issues */}
      {/* <div className="absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true">
        <PnLGrid3D />
      </div> */}

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 80% at 50% 20%, transparent 0%, rgba(26, 26, 36, 0.6) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accentA/10 border border-accentA/30 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-accentA" />
            <span className="text-sm font-medium text-accentA">Live Performance</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text mb-4">
            Cumulative Performance
          </h2>
          <p className="text-lg text-dim max-w-2xl mx-auto">
            Track our AI's real-time equity curve with transparent, verifiable results
          </p>
        </motion.div>

        {/* Timeframe Selector */}
        <motion.div
          className="flex justify-center mb-8"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 p-1.5 bg-surface/80 backdrop-blur-sm border border-accent/20 rounded-xl shadow-soft">
            <Calendar className="w-4 h-4 text-dim ml-2" aria-hidden="true" />

            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setActiveTimeframe(tf)}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface
                  ${
                    activeTimeframe.value === tf.value
                      ? 'text-white bg-gradient-brand shadow-glow'
                      : 'text-dim hover:text-text hover:bg-surface/50'
                  }
                `}
                aria-label={tf.description}
                aria-pressed={activeTimeframe.value === tf.value}
              >
                {/* Glow effect for active state */}
                {activeTimeframe.value === tf.value && (
                  <div className="absolute inset-0 bg-gradient-brand blur-lg opacity-50 rounded-lg -z-10" aria-hidden="true" />
                )}
                <span className="relative z-10">{tf.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Chart Container */}
        <motion.div
          className="flex justify-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-full max-w-5xl">
            {/* Glass container for chart */}
            <div className="relative p-8 glass-card rounded-2xl border-accent/30">
              {/* Inner subtle grid */}
              <div className="absolute inset-0 bg-grid-sm opacity-5 rounded-2xl pointer-events-none" aria-hidden="true" />

              {/* Chart */}
              <div className="relative z-10">
                <PnLChart initialN={activeTimeframe.days} key={activeTimeframe.value} />
              </div>

              {/* Stats row below chart */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-accent/20">
                <StatCard label="Timeframe" value={activeTimeframe.description} />
                <StatCard label="Data Points" value={`~${activeTimeframe.days}`} />
                <StatCard label="Update Freq" value="Real-time" color="success" />
                <StatCard label="Source" value="Redis TLS" color="accentB" />
              </div>
            </div>

            {/* Disclaimer */}
            <motion.p
              className="text-xs text-dim text-center mt-6 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Past performance is not indicative of future results. All signals are provided for educational purposes.
              Trading cryptocurrencies involves substantial risk of loss.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  color = 'text',
}: {
  label: string;
  value: string;
  color?: 'text' | 'success' | 'accentA' | 'accentB';
}) {
  const colorClass = color === 'text' ? 'text-text' : color === 'success' ? 'text-success' : color === 'accentA' ? 'text-accentA' : 'text-accentB';

  return (
    <div className="text-center">
      <div className="text-xs text-dim mb-1">{label}</div>
      <div className={`text-sm font-semibold ${colorClass}`}>{value}</div>
    </div>
  );
}
