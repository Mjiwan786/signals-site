'use client';

import { InfoCircledIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { scaleIn, staggerContainer } from '@/lib/motion';

interface KpiData {
  label: string;
  value: string;
  tooltip: string;
}

const kpis: KpiData[] = [
  {
    label: 'Win Rate',
    value: '68.4%',
    tooltip: 'Percentage of profitable signals over the last 30 days',
  },
  {
    label: 'Avg Profit',
    value: '+4.2%',
    tooltip: 'Average return per winning trade',
  },
  {
    label: 'Total Signals',
    value: '1,247',
    tooltip: 'AI signals published in the last 30 days',
  },
  {
    label: 'Uptime',
    value: '99.8%',
    tooltip: 'System availability and signal delivery reliability',
  },
];

export default function KpiStrip() {
  return (
    <section className="w-full bg-bg py-8" aria-label="Key performance indicators">
      <div className="max-w-6xl mx-auto px-6">
        {/* Grid: 2×2 on mobile, 4×1 on desktop */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
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
  return (
    <motion.div
      className="group relative bg-surface border border-border rounded-xl p-6 hover:border-accent/50 transition-all duration-300 shadow-soft hover:shadow-glow"
      style={{
        background: 'linear-gradient(135deg, rgba(19, 19, 26, 0.8), rgba(26, 26, 36, 0.6))',
        backdropFilter: 'blur(10px)',
      }}
      variants={scaleIn}
    >
      {/* KPI Value */}
      <div className="text-3xl md:text-4xl font-bold text-text mb-2 tabular-nums">
        {kpi.value}
      </div>

      {/* KPI Label with Tooltip */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-text2 font-medium">{kpi.label}</span>

        {/* Tooltip Trigger */}
        <div className="relative inline-flex">
          <InfoCircledIcon
            className="w-4 h-4 text-dim hover:text-accent transition-colors cursor-help"
            aria-label={kpi.tooltip}
          />

          {/* Tooltip Content */}
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-elev border border-border rounded-lg text-xs text-text2 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-10 shadow-soft"
            role="tooltip"
          >
            {kpi.tooltip}
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px" aria-hidden="true">
              <div className="border-4 border-transparent border-t-elev" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
