'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Target, TrendingDown, Users, Info } from 'lucide-react';
import { useCountUp } from '@/lib/useCountUp';
import { scaleIn, staggerContainer, hoverGlow } from '@/lib/motion-variants';

interface KpiData {
  label: string;
  value: number;
  suffix: string;
  prefix: string;
  decimals: number;
  tooltip: string;
  icon: React.ReactNode;
  color: 'cyan' | 'violet' | 'orange' | 'green';
  trend?: 'up' | 'down';
}

// REAL BACKTEST DATA - Updated 2025-11-08
// Source: 12-month conservative simulation with validated fee/slippage model
// See: crypto-ai-bot/out/acquire_annual_snapshot.csv
// Methodology: crypto-ai-bot/ANNUAL_SNAPSHOT_RESULTS_SUMMARY.md
const kpis: KpiData[] = [
  {
    label: 'ROI (12-Month)',
    value: 7.54,
    suffix: '%',
    prefix: '+',
    decimals: 2,
    tooltip: 'Total return from 12-month backtest simulation (Nov 2024 - Nov 2025). Conservative estimate with no leverage, spot trading only.',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'green',
    trend: 'up',
  },
  {
    label: 'Win Rate',
    value: 54.5,
    suffix: '%',
    prefix: '',
    decimals: 1,
    tooltip: 'Percentage of profitable trades in 12-month backtest (442 total trades). Industry standard for systematic quant strategies.',
    icon: <Target className="w-6 h-6" />,
    color: 'cyan',
  },
  {
    label: 'Max Drawdown',
    value: 38.8,
    suffix: '%',
    prefix: '-',
    decimals: 1,
    tooltip: 'Maximum peak-to-trough decline over 12-month backtest period. High but realistic for crypto volatility without leverage.',
    icon: <TrendingDown className="w-6 h-6" />,
    color: 'orange',
    trend: 'down',
  },
  {
    label: 'Sharpe Ratio',
    value: 0.76,
    suffix: '',
    prefix: '',
    decimals: 2,
    tooltip: 'Risk-adjusted return measure from 12-month backtest. 0.5-2.0 is typical for crypto strategies. Higher is better.',
    icon: <Users className="w-6 h-6" />,
    color: 'violet',
  },
];

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
    glow: 'group-hover:shadow-glow',
  },
};

export default function KpiStrip() {
  return (
    <section id="live-pnl" className="relative w-full bg-bg py-12 overflow-hidden" aria-label="Key performance indicators">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid-sm opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-text mb-2">
            12-Month Backtest Performance
          </h2>
          <p className="text-dim text-sm md:text-base max-w-3xl mx-auto">
            Verified results from conservative 12-month simulation (Nov 2024 - Nov 2025).
            Includes realistic Kraken fees (5 bps) and slippage (2 bps).
          </p>
          <p className="text-xs text-dim/70 mt-2 italic">
            Backtested performance. Past results do not guarantee future returns. See methodology documentation for full details.
          </p>
        </motion.div>

        {/* Grid: 2×2 on mobile, 4×1 on desktop */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {kpis.map((kpi, index) => (
            <KpiCard key={index} kpi={kpi} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function KpiCard({ kpi }: { kpi: KpiData }) {
  const { count, elementRef } = useCountUp({
    end: kpi.value,
    duration: 2.5,
    decimals: kpi.decimals,
    suffix: kpi.suffix,
    prefix: kpi.prefix,
    triggerOnView: true,
  });

  const colors = colorClasses[kpi.color];

  return (
    <motion.div
      ref={elementRef as any}
      className={`group relative glass-card-hover rounded-xl p-6 transition-all duration-300 ${colors.glow}`}
      variants={scaleIn}
    >
      {/* Background grid overlay */}
      <div className="absolute inset-0 bg-grid-sm opacity-0 group-hover:opacity-10 transition-opacity rounded-xl pointer-events-none" aria-hidden="true" />

      {/* Icon */}
      <div className={`inline-flex p-3 ${colors.bg} ${colors.border} border rounded-lg mb-4 ${colors.icon}`}>
        {kpi.icon}
      </div>

      {/* KPI Value with animated count */}
      <div className="flex items-baseline gap-2 mb-2">
        <div className="text-3xl md:text-4xl font-bold text-text tabular-nums">
          {count}
        </div>
        {kpi.trend && (
          <div className={`text-sm ${kpi.trend === 'up' ? 'text-success' : 'text-dim'}`}>
            {kpi.trend === 'up' ? '↑' : '↓'}
          </div>
        )}
      </div>

      {/* KPI Label with Tooltip */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-dim font-medium">{kpi.label}</span>

        {/* Tooltip Trigger */}
        <div className="relative group/tooltip inline-flex">
          <Info
            className="w-4 h-4 text-dim hover:text-accentA transition-colors cursor-help"
            aria-label={kpi.tooltip}
          />

          {/* Tooltip Content */}
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-elev border border-accent/30 rounded-lg text-xs text-text2 w-48 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto transition-opacity duration-200 z-20 shadow-glow"
            role="tooltip"
          >
            <p className="text-center">{kpi.tooltip}</p>
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px" aria-hidden="true">
              <div className="border-4 border-transparent border-t-elev" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-${kpi.color === 'cyan' ? 'accentA' : kpi.color === 'violet' ? 'accentB' : kpi.color === 'orange' ? 'highlight' : 'success'}/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} aria-hidden="true" />
    </motion.div>
  );
}
