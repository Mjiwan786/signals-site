/**
 * Skeleton Components
 * Loading states and fallback UI for API errors
 * PRD: If API unreachable, components show skeleton/fallback
 */

'use client';

import { motion } from 'framer-motion';
import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';
import { shimmer } from '@/lib/motion-variants';

/**
 * Generic skeleton component with shimmer effect
 * Enhanced with gradient shimmer animation
 */
export function Skeleton({
  className = '',
  variant = 'default',
  style,
  shimmer = true,
}: {
  className?: string;
  variant?: 'default' | 'text' | 'circle' | 'button';
  style?: React.CSSProperties;
  shimmer?: boolean;
}) {
  const baseClasses = 'bg-elev/50 relative overflow-hidden';
  const variantClasses = {
    default: 'rounded-lg',
    text: 'rounded h-4',
    circle: 'rounded-full',
    button: 'rounded-xl',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    >
      {shimmer && (
        <motion.div
          className="absolute inset-0 -translate-x-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(110, 231, 255, 0.1) 50%, transparent 100%)',
          }}
          animate={{
            x: ['0%', '200%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
}

/**
 * Skeleton for signal cards in table/list
 */
export function SignalSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 glass-card rounded-xl">
      <Skeleton variant="circle" className="w-10 h-10 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-24" />
        <Skeleton variant="text" className="w-full max-w-xs" />
      </div>
      <Skeleton variant="button" className="w-20 h-8" />
    </div>
  );
}

/**
 * Skeleton for PnL chart
 */
export function ChartSkeleton() {
  return (
    <div className="w-full h-[400px] glass-card rounded-2xl p-8">
      <div className="space-y-4 mb-6">
        <Skeleton variant="text" className="w-32 h-6" />
        <Skeleton variant="text" className="w-48 h-4" />
      </div>
      <div className="relative h-[280px] flex items-end gap-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${Math.random() * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for KPI cards
 */
export function KpiSkeleton() {
  return (
    <div className="glass-card rounded-xl p-6">
      <Skeleton variant="circle" className="w-12 h-12 mb-4" />
      <Skeleton variant="text" className="w-20 h-8 mb-2" />
      <Skeleton variant="text" className="w-32 h-4" />
    </div>
  );
}

/**
 * Error fallback for API failures
 */
export function ErrorFallback({
  error,
  onRetry,
  title = 'Unable to load data',
  description,
}: {
  error?: Error;
  onRetry?: () => void;
  title?: string;
  description?: string;
}) {
  const defaultDescription =
    'We encountered an issue loading this data. Please check your connection and try again.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 glass-card rounded-2xl border-accent/30 text-center"
    >
      <div className="inline-flex p-4 bg-danger/10 border border-danger/20 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-danger" />
      </div>

      <h3 className="text-xl font-bold text-text mb-2">{title}</h3>
      <p className="text-dim mb-6 max-w-md">
        {description || defaultDescription}
      </p>

      {error && process.env.NODE_ENV === 'development' && (
        <details className="mb-6 text-xs text-dim">
          <summary className="cursor-pointer hover:text-text">
            Error details
          </summary>
          <pre className="mt-2 p-4 bg-elev rounded text-left overflow-auto max-w-lg">
            {error.message}
          </pre>
        </details>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 border border-accent/30 rounded-xl text-accent hover:bg-accent/20 hover:border-accent transition-all duration-300"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </motion.div>
  );
}

/**
 * Offline indicator banner
 */
export function OfflineBanner({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
    >
      <div className="flex items-center gap-3 p-4 bg-elev/95 backdrop-blur-sm border border-danger/30 rounded-xl shadow-glow">
        <WifiOff className="w-5 h-5 text-danger flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-text">Connection Lost</p>
          <p className="text-xs text-dim">
            Trying to reconnect automatically...
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-dim hover:text-text transition-colors"
            aria-label="Dismiss"
          >
            
          </button>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Empty state component
 */
export function EmptyState({
  title = 'No data available',
  description = 'There is no data to display at the moment.',
  icon: Icon = AlertCircle,
  action,
}: {
  title?: string;
  description?: string;
  icon?: typeof AlertCircle;
  action?: {
    label: string;
    onClick: () => void;
  };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="inline-flex p-4 bg-accent/10 border border-accent/20 rounded-full mb-4">
        <Icon className="w-8 h-8 text-accent" />
      </div>

      <h3 className="text-lg font-bold text-text mb-2">{title}</h3>
      <p className="text-dim mb-6 max-w-sm">{description}</p>

      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-brand rounded-xl text-white shadow-glow hover:shadow-glow-violet transition-all duration-300"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

/**
 * Loading spinner
 */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} border-2 border-accent/30 border-t-accent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

/**
 * API Status Indicator
 */
export function ApiStatusIndicator({
  status,
  className = '',
}: {
  status: 'healthy' | 'degraded' | 'down';
  className?: string;
}) {
  const statusConfig = {
    healthy: {
      color: 'bg-success',
      label: 'Operational',
      className: 'text-success',
    },
    degraded: {
      color: 'bg-highlight',
      label: 'Degraded',
      className: 'text-highlight',
    },
    down: {
      color: 'bg-danger',
      label: 'Down',
      className: 'text-danger',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${config.color} animate-pulse`} />
      <span className={`text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    </div>
  );
}
