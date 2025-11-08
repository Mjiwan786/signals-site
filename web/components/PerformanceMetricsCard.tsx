/**
 * PerformanceMetricsCard - Live Performance Metrics Display
 *
 * Displays real-time trading performance metrics:
 * - Aggressive Mode Score: Risk-adjusted performance
 * - Velocity to Target: Progress percentage
 * - Days Remaining: Time to reach goal
 *
 * Features:
 * - Live SSE updates
 * - Sparkline charts
 * - Color-coded status indicators
 * - Interpretation text
 * - Smooth animations
 */

'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Clock, Award, LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MetricData {
  value: number;
  interpretation?: string;
  description?: string;
  history?: number[]; // For sparkline
}

interface PerformanceMetricsCardProps {
  metric: 'aggressive' | 'velocity' | 'days_remaining';
  label: string;
  value: number | null;
  interpretation?: string;
  description?: string;
  history?: number[];
  className?: string;
}

export default function PerformanceMetricsCard({
  metric,
  label,
  value,
  interpretation,
  description,
  history = [],
  className = '',
}: PerformanceMetricsCardProps) {
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');

  // Determine trend from history
  useEffect(() => {
    if (history.length >= 2) {
      const recent = history[history.length - 1];
      const previous = history[history.length - 2];

      if (metric === 'days_remaining') {
        // For days remaining, down is good
        setTrend(recent < previous ? 'up' : recent > previous ? 'down' : 'neutral');
      } else {
        // For aggressive score and velocity, up is good
        setTrend(recent > previous ? 'up' : recent < previous ? 'down' : 'neutral');
      }
    }
  }, [history, metric]);

  // Icon and color based on metric type
  const getMetricConfig = () => {
    switch (metric) {
      case 'aggressive':
        return {
          icon: Award,
          color: getAggressiveScoreColor(value ?? 0),
          glow: getAggressiveScoreGlow(value ?? 0),
        };
      case 'velocity':
        return {
          icon: Target,
          color: getVelocityColor(value ?? 0),
          glow: getVelocityGlow(value ?? 0),
        };
      case 'days_remaining':
        return {
          icon: Clock,
          color: getDaysRemainingColor(value ?? Infinity),
          glow: getDaysRemainingGlow(value ?? Infinity),
        };
      default:
        return {
          icon: TrendingUp,
          color: 'text-text',
          glow: '',
        };
    }
  };

  const config = getMetricConfig();
  const Icon = config.icon;

  // Format value based on metric
  const formatValue = (val: number | null): string => {
    if (val === null) return 'N/A';

    switch (metric) {
      case 'aggressive':
        return val.toFixed(2);
      case 'velocity':
        return `${(val * 100).toFixed(1)}%`;
      case 'days_remaining':
        return val === Infinity || val > 999 ? '∞' : `${Math.round(val)}d`;
      default:
        return val.toString();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-sm
        ${config.color === 'text-success' ? 'bg-success/5 border-success/20' : ''}
        ${config.color === 'text-warning' ? 'bg-warning/5 border-warning/20' : ''}
        ${config.color === 'text-danger' ? 'bg-danger/5 border-danger/20' : ''}
        ${config.color === 'text-text' ? 'bg-surface/50 border-accent/10' : ''}
        ${config.glow}
        transition-all duration-300
        ${className}
      `}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="relative p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${config.color === 'text-success' ? 'bg-success/10' : config.color === 'text-warning' ? 'bg-warning/10' : config.color === 'text-danger' ? 'bg-danger/10' : 'bg-accent/10'}`}>
              <Icon className={`w-4 h-4 ${config.color}`} />
            </div>
            <h3 className="text-sm font-medium text-dim">{label}</h3>
          </div>

          {/* Trend indicator */}
          {trend !== 'neutral' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                ${trend === 'up' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}
              `}
            >
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
            </motion.div>
          )}
        </div>

        {/* Value */}
        <motion.div
          key={value}
          initial={{ scale: 0.95, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-2"
        >
          <div className={`text-3xl sm:text-4xl font-bold ${config.color}`}>
            {formatValue(value)}
          </div>
        </motion.div>

        {/* Interpretation */}
        {interpretation && (
          <p className="text-xs text-dim mb-3">{interpretation}</p>
        )}

        {/* Description */}
        {description && (
          <p className="text-xs text-dim/70">{description}</p>
        )}

        {/* Sparkline */}
        {history.length > 0 && (
          <div className="mt-4 h-8">
            <Sparkline data={history} color={config.color} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Sparkline Chart Component
 */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // Avoid division by zero

  // Generate SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;

  // Determine stroke color
  const strokeColor =
    color === 'text-success' ? 'rgb(16, 185, 129)' :
    color === 'text-warning' ? 'rgb(245, 158, 11)' :
    color === 'text-danger' ? 'rgb(239, 68, 68)' :
    'rgb(139, 92, 246)';

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      {/* Area fill */}
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: strokeColor, stopOpacity: 0.2 }} />
          <stop offset="100%" style={{ stopColor: strokeColor, stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      <path
        d={`${pathD} L 100,100 L 0,100 Z`}
        fill={`url(#gradient-${color})`}
      />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * Helper Functions - Color based on value
 */

function getAggressiveScoreColor(score: number): string {
  if (score >= 2.0) return 'text-success';
  if (score >= 1.5) return 'text-success';
  if (score >= 1.0) return 'text-warning';
  return 'text-danger';
}

function getAggressiveScoreGlow(score: number): string {
  if (score >= 2.0) return 'hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]';
  if (score >= 1.5) return 'hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]';
  if (score >= 1.0) return 'hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]';
  return 'hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]';
}

function getVelocityColor(velocity: number): string {
  if (velocity >= 0.8) return 'text-success';
  if (velocity >= 0.5) return 'text-success';
  if (velocity >= 0.2) return 'text-warning';
  return 'text-text';
}

function getVelocityGlow(velocity: number): string {
  if (velocity >= 0.5) return 'hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]';
  if (velocity >= 0.2) return 'hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]';
  return 'hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]';
}

function getDaysRemainingColor(days: number): string {
  if (days === Infinity || days > 999) return 'text-dim';
  if (days < 7) return 'text-success';
  if (days < 30) return 'text-success';
  if (days < 90) return 'text-warning';
  return 'text-text';
}

function getDaysRemainingGlow(days: number): string {
  if (days < 7) return 'hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]';
  if (days < 30) return 'hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]';
  if (days < 90) return 'hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]';
  return 'hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]';
}
