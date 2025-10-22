'use client';

import { motion, Variants } from 'framer-motion';
import { Cpu, Shield, Zap } from 'lucide-react';
import { staggerContainer } from '@/lib/motion-variants';

/**
 * FeatureGrid - Core features showcase with animated cards
 *
 * Features:
 * - Three-column grid: AI-Driven Signals, Adaptive Risk, Lightning Execution
 * - Scroll-triggered stagger animations
 * - Hover micro-interactions: icon rotation, card glow, scale
 * - Alternating slide-in directions (left, bottom, right)
 * - Glass morphism with gradient accents
 */

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'cyan' | 'violet' | 'orange';
  direction: 'left' | 'right' | 'bottom';
}

const features: Feature[] = [
  {
    title: 'AI-Driven Signal Generation',
    description:
      'Advanced machine learning models analyze market patterns in real-time, generating high-probability trading signals with confidence scores and entry/exit recommendations.',
    icon: <Cpu className="w-8 h-8" />,
    color: 'cyan',
    direction: 'left',
  },
  {
    title: 'Adaptive Risk Management',
    description:
      'Dynamic position sizing and stop-loss optimization based on market volatility, portfolio correlation, and your personal risk tolerance to protect capital.',
    icon: <Shield className="w-8 h-8" />,
    color: 'violet',
    direction: 'bottom',
  },
  {
    title: 'Lightning-Fast Execution',
    description:
      'Sub-500ms signal delivery via WebSocket and Discord integration, ensuring you never miss critical market opportunities with real-time notifications.',
    icon: <Zap className="w-8 h-8" />,
    color: 'orange',
    direction: 'right',
  },
];

const colorClasses = {
  cyan: {
    icon: 'text-accentA',
    iconBg: 'bg-accentA/10',
    border: 'border-accentA/20',
    glow: 'hover:shadow-glow',
    gradient: 'from-accentA/5 to-transparent',
  },
  violet: {
    icon: 'text-accentB',
    iconBg: 'bg-accentB/10',
    border: 'border-accentB/20',
    glow: 'hover:shadow-glow-violet',
    gradient: 'from-accentB/5 to-transparent',
  },
  orange: {
    icon: 'text-highlight',
    iconBg: 'bg-highlight/10',
    border: 'border-highlight/20',
    glow: 'hover:shadow-glow-highlight',
    gradient: 'from-highlight/5 to-transparent',
  },
};

// Animation variants for alternating directions
const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as any,
    },
  },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as any,
    },
  },
};

const slideInBottom: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as any,
    },
  },
};

const variantMap = {
  left: slideInLeft,
  right: slideInRight,
  bottom: slideInBottom,
};

export default function FeatureGrid() {
  return (
    <section
      className="relative w-full bg-bg py-20 overflow-hidden"
      aria-label="Core features"
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 bg-grid opacity-20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 60% at 50% 40%, transparent 0%, rgba(11, 11, 15, 0.8) 100%)',
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
            Core Features
          </h2>
          <p className="text-lg text-dim max-w-2xl mx-auto">
            Powered by cutting-edge AI and battle-tested architecture to deliver
            consistent, reliable trading signals
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const colors = colorClasses[feature.color];
  const variant = variantMap[feature.direction];

  return (
    <motion.div
      className={`group relative glass-card-hover rounded-2xl p-8 transition-all duration-300 ${colors.glow} hover:scale-[1.02]`}
      variants={variant}
    >
      {/* Background grid overlay (reveals on hover) */}
      <div
        className="absolute inset-0 bg-grid-sm opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Top gradient accent */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${colors.gradient} rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon container with rotation on hover */}
        <motion.div
          className={`inline-flex p-4 ${colors.iconBg} ${colors.border} border rounded-xl mb-6 ${colors.icon}`}
          whileHover={{ rotate: [0, -10, 10, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          {feature.icon}
        </motion.div>

        {/* Title */}
        <h3 className="text-2xl font-display font-bold text-text mb-4">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-dim leading-relaxed">{feature.description}</p>

        {/* Bottom accent line (appears on hover) */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${
            feature.color === 'cyan'
              ? 'accentA'
              : feature.color === 'violet'
              ? 'accentB'
              : 'highlight'
          } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
}
