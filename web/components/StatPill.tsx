/**
 * StatPill - Metric Display Component
 * Small, stylized pills for displaying KPIs and statistics
 *
 * Features:
 * - Multiple variants (default, success, danger, info)
 * - Optional icon support
 * - Glow effects on hover
 * - Trend indicators (up/down arrows)
 * - Size variants
 */

'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';

interface StatPillProps {
  label: string;
  value: string | number;
  variant?: 'default' | 'success' | 'danger' | 'info' | 'warning';
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  className?: string;
  animate?: boolean;
}

export default function StatPill({
  label,
  value,
  variant = 'default',
  trend,
  icon: Icon,
  size = 'md',
  glow = false,
  className = '',
  animate = true,
}: StatPillProps) {
  const variantClasses = {
    default: {
      bg: 'bg-surface/80',
      border: 'border-accent/20',
      text: 'text-text',
      labelText: 'text-dim',
      glow: 'hover:shadow-glow',
    },
    success: {
      bg: 'bg-success/10',
      border: 'border-success/30',
      text: 'text-success',
      labelText: 'text-success/70',
      glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    },
    danger: {
      bg: 'bg-danger/10',
      border: 'border-danger/30',
      text: 'text-danger',
      labelText: 'text-danger/70',
      glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    },
    info: {
      bg: 'bg-accentA/10',
      border: 'border-accentA/30',
      text: 'text-accentA',
      labelText: 'text-accentA/70',
      glow: 'hover:shadow-glow',
    },
    warning: {
      bg: 'bg-highlight/10',
      border: 'border-highlight/30',
      text: 'text-highlight',
      labelText: 'text-highlight/70',
      glow: 'hover:shadow-glow-highlight',
    },
  };

  const sizeClasses = {
    sm: {
      container: 'px-3 py-1.5 gap-2',
      value: 'text-sm font-semibold',
      label: 'text-xs',
      icon: 'w-3 h-3',
    },
    md: {
      container: 'px-4 py-2 gap-2',
      value: 'text-base font-bold',
      label: 'text-sm',
      icon: 'w-4 h-4',
    },
    lg: {
      container: 'px-5 py-3 gap-3',
      value: 'text-lg font-bold',
      label: 'text-base',
      icon: 'w-5 h-5',
    },
  };

  const colors = variantClasses[variant];
  const sizes = sizeClasses[size];

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3, ease: 'easeOut' },
        whileHover: { scale: 1.05 },
      }
    : {};

  return (
    <Wrapper
      className={`
        inline-flex items-center
        ${sizes.container}
        ${colors.bg}
        border ${colors.border}
        backdrop-blur-sm
        rounded-full
        transition-all duration-300
        ${glow ? colors.glow : ''}
        ${className}
      `}
      {...wrapperProps}
    >
      {Icon && <Icon className={`${sizes.icon} ${colors.text} flex-shrink-0`} />}

      <div className="flex flex-col items-start min-w-0">
        <span className={`${sizes.label} ${colors.labelText} font-medium leading-tight`}>
          {label}
        </span>
        <div className="flex items-center gap-1">
          <span className={`${sizes.value} ${colors.text} leading-tight whitespace-nowrap`}>
            {value}
          </span>
          {TrendIcon && (
            <TrendIcon
              className={`
                ${sizes.icon}
                ${trend === 'up' ? 'text-success' : 'text-danger'}
              `}
            />
          )}
        </div>
      </div>
    </Wrapper>
  );
}

/**
 * Compact StatPill - Horizontal layout
 * Good for inline metrics in text or tight spaces
 */
export function CompactStatPill({
  label,
  value,
  variant = 'default',
  className = '',
}: {
  label: string;
  value: string | number;
  variant?: 'default' | 'success' | 'danger' | 'info';
  className?: string;
}) {
  const variantClasses = {
    default: 'bg-surface/60 text-text border-accent/20',
    success: 'bg-success/10 text-success border-success/30',
    danger: 'bg-danger/10 text-danger border-danger/30',
    info: 'bg-accentA/10 text-accentA border-accentA/30',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-2
        px-3 py-1
        border ${variantClasses[variant]}
        rounded-full
        text-sm font-medium
        backdrop-blur-sm
        ${className}
      `}
    >
      <span className="opacity-70">{label}:</span>
      <span className="font-bold">{value}</span>
    </span>
  );
}

/**
 * Animated Counter StatPill
 * Animates number changes
 */
export function AnimatedStatPill({
  label,
  value,
  variant = 'default',
  suffix = '',
  className = '',
}: {
  label: string;
  value: number;
  variant?: 'default' | 'success' | 'danger' | 'info';
  suffix?: string;
  className?: string;
}) {
  const formattedValue = `${value.toLocaleString()}${suffix}`;

  return (
    <motion.div
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StatPill
        label={label}
        value={formattedValue}
        variant={variant}
        animate={false}
        className={className}
      />
    </motion.div>
  );
}

/**
 * Stat Badge - Minimal pill for small metrics
 */
export function StatBadge({
  children,
  variant = 'default',
  pulse = false,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'info' | 'warning';
  pulse?: boolean;
}) {
  const variantClasses = {
    default: 'bg-surface/80 text-text border-accent/20',
    success: 'bg-success/10 text-success border-success/30',
    danger: 'bg-danger/10 text-danger border-danger/30',
    info: 'bg-accentA/10 text-accentA border-accentA/30',
    warning: 'bg-highlight/10 text-highlight border-highlight/30',
  };

  return (
    <span
      className={`
        inline-flex items-center
        px-2 py-0.5
        border ${variantClasses[variant]}
        rounded-full
        text-xs font-semibold
        backdrop-blur-sm
        ${pulse ? 'animate-pulse' : ''}
      `}
    >
      {children}
    </span>
  );
}

/**
 * Icon StatPill - Large icon with stat
 * Good for dashboard KPI cards
 */
export function IconStatPill({
  icon: Icon,
  label,
  value,
  trend,
  variant = 'default',
  className = '',
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: { value: string; direction: 'up' | 'down' };
  variant?: 'default' | 'success' | 'danger' | 'info';
  className?: string;
}) {
  const variantClasses = {
    default: {
      bg: 'bg-surface/80',
      iconBg: 'bg-accent/10',
      iconText: 'text-accent',
      border: 'border-accent/20',
      text: 'text-text',
    },
    success: {
      bg: 'bg-success/5',
      iconBg: 'bg-success/10',
      iconText: 'text-success',
      border: 'border-success/20',
      text: 'text-success',
    },
    danger: {
      bg: 'bg-danger/5',
      iconBg: 'bg-danger/10',
      iconText: 'text-danger',
      border: 'border-danger/20',
      text: 'text-danger',
    },
    info: {
      bg: 'bg-accentA/5',
      iconBg: 'bg-accentA/10',
      iconText: 'text-accentA',
      border: 'border-accentA/20',
      text: 'text-accentA',
    },
  };

  const colors = variantClasses[variant];

  return (
    <motion.div
      className={`
        flex items-center gap-4
        p-4
        ${colors.bg}
        border ${colors.border}
        backdrop-blur-sm
        rounded-xl
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`p-3 ${colors.iconBg} rounded-lg`}>
        <Icon className={`w-6 h-6 ${colors.iconText}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-dim font-medium mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
          {trend && (
            <span
              className={`
                text-sm font-medium flex items-center gap-1
                ${trend.direction === 'up' ? 'text-success' : 'text-danger'}
              `}
            >
              {trend.direction === 'up' ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
