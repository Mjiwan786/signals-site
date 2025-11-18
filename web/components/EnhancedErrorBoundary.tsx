/**
 * Enhanced Error Boundary Component
 * WCAG AA compliant error handling with accessible UI
 * Provides graceful degradation for component failures
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Enhanced Error Boundary with WCAG AA compliant UI
 * Features:
 * - Accessible error messages with ARIA live regions
 * - Retry and navigation options
 * - High contrast error states
 * - Keyboard accessible controls
 */
export class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div
          className="min-h-[400px] flex items-center justify-center p-6 bg-bg"
          role="alert"
          aria-live="assertive"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-2xl p-8 max-w-2xl w-full border-danger/30"
          >
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-danger/10 rounded-full border border-danger/30">
                <AlertTriangle
                  className="w-12 h-12 text-danger"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Error Title */}
            <h2 className="text-2xl font-bold text-text text-center mb-4">
              Something Went Wrong
            </h2>

            {/* Error Description */}
            <p className="text-dim text-center mb-2">
              We encountered an unexpected error while loading this component.
            </p>
            <p className="text-muted text-sm text-center mb-8">
              This issue has been logged and we'll look into it.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-surface/80 rounded-lg border border-border">
                <p className="text-xs font-mono text-danger mb-2">
                  {this.state.error.name}
                </p>
                <p className="text-xs font-mono text-dim break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="
                  flex items-center justify-center gap-2 px-6 py-3
                  bg-gradient-brand text-white font-semibold rounded-lg
                  shadow-glow hover:shadow-glow-violet
                  transition-all duration-300
                  focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-accent
                "
                aria-label="Try again to load this component"
              >
                <RefreshCw className="w-5 h-5" aria-hidden="true" />
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                className="
                  flex items-center justify-center gap-2 px-6 py-3
                  bg-surface/80 text-text font-semibold rounded-lg
                  border border-accent/30 hover:border-accent/50
                  transition-all duration-300
                  focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-accent
                "
                aria-label="Reload the entire page"
              >
                <RefreshCw className="w-5 h-5" aria-hidden="true" />
                Reload Page
              </button>

              <button
                onClick={this.handleHome}
                className="
                  flex items-center justify-center gap-2 px-6 py-3
                  bg-surface/80 text-text font-semibold rounded-lg
                  border border-border hover:border-accent/30
                  transition-all duration-300
                  focus-visible:outline focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-accent
                "
                aria-label="Go back to the homepage"
              >
                <Home className="w-5 h-5" aria-hidden="true" />
                Go Home
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Inline Error Fallback for smaller component failures
 * Use this for non-critical component errors
 */
interface InlineErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export function InlineErrorFallback({
  error,
  onRetry,
  title = 'Error Loading Component',
  description = 'This component failed to load. Please try again.',
}: InlineErrorFallbackProps) {
  return (
    <div
      className="glass-card rounded-xl p-6 border-danger/30"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-danger/10 rounded-lg border border-danger/30 flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-danger" aria-hidden="true" />
        </div>

        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
          <p className="text-dim text-sm mb-4">{description}</p>

          {process.env.NODE_ENV === 'development' && error && (
            <p className="text-xs font-mono text-danger mb-4 break-all">
              {error.message}
            </p>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className="
                flex items-center gap-2 px-4 py-2 text-sm
                bg-surface/80 text-text font-medium rounded-lg
                border border-accent/30 hover:border-accent/50
                transition-all duration-300
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-accent
              "
              aria-label="Retry loading this component"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Metrics Unavailable State
 * Use this when API is unreachable or data is unavailable
 */
interface MetricsUnavailableProps {
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function MetricsUnavailable({
  onRetry,
  isRetrying = false,
}: MetricsUnavailableProps) {
  return (
    <div
      className="glass-card rounded-xl p-8 text-center border-info/30"
      role="status"
      aria-live="polite"
    >
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-info/10 rounded-full border border-info/30">
          <AlertTriangle className="w-10 h-10 text-info" aria-hidden="true" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-text mb-2">
        Metrics Unavailable
      </h3>

      <p className="text-dim mb-6 max-w-md mx-auto">
        The API is temporarily unavailable. Real-time metrics will appear here
        once the connection is restored.
      </p>

      {/* Reconnecting Indicator */}
      <div
        className="flex items-center justify-center gap-2 text-sm text-dim mb-6"
        aria-live="polite"
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isRetrying ? 'bg-warning animate-pulse' : 'bg-danger animate-pulse'
          }`}
          aria-hidden="true"
        />
        <span>
          {isRetrying ? 'Reconnecting...' : 'Attempting to reconnect...'}
        </span>
      </div>

      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="
            inline-flex items-center gap-2 px-6 py-3
            bg-gradient-brand text-white font-semibold rounded-lg
            shadow-glow hover:shadow-glow-violet
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-accent
          "
          aria-label="Retry connection to API"
        >
          <RefreshCw
            className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          {isRetrying ? 'Connecting...' : 'Retry Connection'}
        </button>
      )}

      {/* Help Text */}
      <p className="text-muted text-xs mt-6">
        If this issue persists, please contact support or check our{' '}
        <a
          href="/status"
          className="text-accent hover:text-accent-b underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          status page
        </a>
        .
      </p>
    </div>
  );
}

export default EnhancedErrorBoundary;
