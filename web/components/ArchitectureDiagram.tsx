'use client';

import { motion, Variants } from 'framer-motion';
import { Database, Brain, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import { useState } from 'react';

/**
 * ArchitectureDiagram - Interactive system architecture visualization
 *
 * Flow: Data Sources → AI Engine → Trade Execution → PnL Tracking
 *
 * Features:
 * - Sequential fade-in animations for each node
 * - Animated connection lines with gradient flow
 * - Interactive hover states with detailed descriptions
 * - Responsive layout with vertical mobile view
 * - Color-coded stages matching brand palette
 */

interface ArchitectureNode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: 'cyan' | 'violet' | 'orange' | 'green';
  metrics?: { label: string; value: string }[];
}

const nodes: ArchitectureNode[] = [
  {
    id: 'data-sources',
    title: 'Data Sources',
    subtitle: 'Multi-Exchange Aggregation',
    description:
      'Real-time market data from 15+ exchanges including Binance, Coinbase, Kraken. Order book depth, trade history, and on-chain metrics aggregated via WebSocket connections.',
    icon: <Database className="w-8 h-8" />,
    color: 'cyan',
    metrics: [
      { label: 'Exchanges', value: '15+' },
      { label: 'Latency', value: '<50ms' },
      { label: 'Data Points', value: '1M+/sec' },
    ],
  },
  {
    id: 'ai-engine',
    title: 'AI Engine',
    subtitle: 'Neural Pattern Recognition',
    description:
      'Ensemble of LSTM, Transformer, and CNN models trained on 5+ years of historical data. Generates signals with confidence scores, entry/exit prices, and risk parameters.',
    icon: <Brain className="w-8 h-8" />,
    color: 'violet',
    metrics: [
      { label: 'Models', value: '12' },
      { label: 'Accuracy', value: '68.4%' },
      { label: 'Inference', value: '<100ms' },
    ],
  },
  {
    id: 'execution',
    title: 'Trade Execution',
    subtitle: 'Lightning-Fast Delivery',
    description:
      'Signals delivered via Discord webhooks and WebSocket API in <500ms. Redis-backed queue ensures zero message loss with automatic retry logic and delivery confirmation.',
    icon: <Zap className="w-8 h-8" />,
    color: 'orange',
    metrics: [
      { label: 'Delivery', value: '<500ms' },
      { label: 'Uptime', value: '99.8%' },
      { label: 'Channels', value: 'Discord + API' },
    ],
  },
  {
    id: 'pnl-tracking',
    title: 'PnL Tracking',
    subtitle: 'Transparent Performance',
    description:
      'Real-time equity curve calculation with daily PnL snapshots stored in Redis Cloud. Historical performance data accessible via REST API for complete transparency.',
    icon: <TrendingUp className="w-8 h-8" />,
    color: 'green',
    metrics: [
      { label: 'ROI (12M)', value: '+247.8%' },
      { label: 'Max DD', value: '-12.3%' },
      { label: 'Storage', value: 'Redis TLS' },
    ],
  },
];

const colorClasses = {
  cyan: {
    icon: 'text-accentA',
    iconBg: 'bg-accentA/10',
    border: 'border-accentA/30',
    glow: 'shadow-glow',
    gradient: 'from-accentA/20 to-accentA/5',
  },
  violet: {
    icon: 'text-accentB',
    iconBg: 'bg-accentB/10',
    border: 'border-accentB/30',
    glow: 'shadow-glow-violet',
    gradient: 'from-accentB/20 to-accentB/5',
  },
  orange: {
    icon: 'text-highlight',
    iconBg: 'bg-highlight/10',
    border: 'border-highlight/30',
    glow: 'shadow-glow-highlight',
    gradient: 'from-highlight/20 to-highlight/5',
  },
  green: {
    icon: 'text-success',
    iconBg: 'bg-success/10',
    border: 'border-success/30',
    glow: 'shadow-[0_0_40px_rgba(34,197,94,0.3)]',
    gradient: 'from-success/20 to-success/5',
  },
};

// Sequential animation variants
const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.2,
    },
  },
};

const nodeVariant: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as any,
    },
  },
};

const connectionVariant: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.8, ease: 'easeInOut' as any },
      opacity: { duration: 0.3 },
    },
  },
};

export default function ArchitectureDiagram() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <section
      className="relative w-full bg-elev py-20 overflow-hidden"
      aria-label="System architecture"
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 bg-grid-sm opacity-20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 60% at 50% 40%, transparent 0%, rgba(26, 26, 36, 0.8) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text mb-4">
            System Architecture
          </h2>
          <p className="text-lg text-dim max-w-2xl mx-auto">
            End-to-end pipeline from data ingestion to transparent performance tracking
          </p>
        </motion.div>

        {/* Architecture Flow */}
        <motion.div
          className="relative"
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Desktop: Horizontal Flow */}
          <div className="hidden lg:block">
            <div className="relative flex items-center justify-between gap-4">
              {nodes.map((node, index) => (
                <div key={node.id} className="flex items-center flex-1">
                  {/* Node */}
                  <ArchitectureNodeCard
                    node={node}
                    isHovered={hoveredNode === node.id}
                    onHover={setHoveredNode}
                  />

                  {/* Connection Arrow (except for last node) */}
                  {index < nodes.length - 1 && (
                    <motion.div
                      className="flex-shrink-0 mx-4"
                      variants={nodeVariant}
                    >
                      <svg
                        width="60"
                        height="40"
                        viewBox="0 0 60 40"
                        fill="none"
                        className="overflow-visible"
                      >
                        {/* Animated line */}
                        <motion.path
                          d="M 5 20 L 55 20"
                          stroke="url(#gradient-flow)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          variants={connectionVariant}
                        />

                        {/* Arrow head */}
                        <motion.path
                          d="M 48 13 L 55 20 L 48 27"
                          stroke="url(#gradient-flow)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                          variants={connectionVariant}
                        />

                        {/* Gradient definition */}
                        <defs>
                          <linearGradient
                            id="gradient-flow"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#6EE7FF" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#FF7336" stopOpacity="0.3" />
                          </linearGradient>
                        </defs>

                        {/* Animated dot traveling along path */}
                        <motion.circle
                          r="3"
                          fill="#6EE7FF"
                          animate={{
                            cx: [5, 55],
                            opacity: [0, 1, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1,
                            ease: 'linear',
                          }}
                          cy="20"
                        />
                      </svg>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet: Vertical Flow */}
          <div className="lg:hidden space-y-6">
            {nodes.map((node, index) => (
              <div key={node.id} className="relative">
                {/* Node */}
                <ArchitectureNodeCard
                  node={node}
                  isHovered={hoveredNode === node.id}
                  onHover={setHoveredNode}
                />

                {/* Connection Arrow (except for last node) */}
                {index < nodes.length - 1 && (
                  <motion.div
                    className="flex justify-center my-4"
                    variants={nodeVariant}
                  >
                    <svg
                      width="40"
                      height="60"
                      viewBox="0 0 40 60"
                      fill="none"
                    >
                      <motion.path
                        d="M 20 5 L 20 55"
                        stroke="url(#gradient-flow-v)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        variants={connectionVariant}
                      />
                      <motion.path
                        d="M 13 48 L 20 55 L 27 48"
                        stroke="url(#gradient-flow-v)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        variants={connectionVariant}
                      />
                      <defs>
                        <linearGradient
                          id="gradient-flow-v"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#6EE7FF" stopOpacity="0.3" />
                          <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#FF7336" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>
                      <motion.circle
                        r="3"
                        fill="#6EE7FF"
                        animate={{
                          cy: [5, 55],
                          opacity: [0, 1, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                          ease: 'linear',
                        }}
                        cx="20"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Data Flow Legend */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <p className="text-sm text-dim">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accentA animate-pulse" />
              Live data flowing through the system in real-time
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ArchitectureNodeCard({
  node,
  isHovered,
  onHover,
}: {
  node: ArchitectureNode;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const colors = colorClasses[node.color];

  return (
    <motion.div
      className={`
        group relative glass-card-hover rounded-xl p-6 transition-all duration-300 flex-1
        ${isHovered ? `${colors.glow} scale-105` : 'hover:scale-[1.02]'}
      `}
      variants={nodeVariant}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Background gradient accent */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          className={`inline-flex p-3 ${colors.iconBg} ${colors.border} border-2 rounded-lg mb-4 ${colors.icon}`}
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.4 }}
        >
          {node.icon}
        </motion.div>

        {/* Title & Subtitle */}
        <h3 className="text-xl font-display font-bold text-text mb-1">
          {node.title}
        </h3>
        <p className="text-sm text-accentA font-medium mb-3">
          {node.subtitle}
        </p>

        {/* Description */}
        <p className="text-sm text-dim leading-relaxed mb-4">
          {node.description}
        </p>

        {/* Metrics */}
        {node.metrics && (
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-accent/20">
            {node.metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className={`text-base font-bold ${colors.icon}`}>
                  {metric.value}
                </div>
                <div className="text-xs text-dim">{metric.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Hover indicator */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} rounded-b-xl`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
}
