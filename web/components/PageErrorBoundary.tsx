/**
 * Enhanced Page Error Boundary
 * PRD Step 12: Error boundaries for /signals and /pricing
 *
 * Features:
 * - Graceful fallback UI
 * - Retry functionality
 * - Error logging with context
 * - Different styles per page type
 */

'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logErrorMetric } from './WebVitals';
import Link from 'next/link';

interface PageErrorBoundaryProps {
  children: ReactNode;
  pageName?: string;
  fallbackType?: 'signals' | 'pricing' | 'default';
}

interface PageErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  resetAttempts: number;
}

/**
 * Page-level Error Boundary with retry logic
 */
export default class PageErrorBoundary extends Component<
  PageErrorBoundaryProps,
  PageErrorBoundaryState
> {
  constructor(props: PageErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      resetAttempts: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<PageErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console in development
    logErrorMetric(error, errorInfo);

    this.setState({ errorInfo });

    // In production, you could send to error tracking service
    // e.g., Sentry, LogRocket, Datadog
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service
      console.error(`[${this.props.pageName}] Error caught:`, error);
    }
  }

  handleReset = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      resetAttempts: prevState.resetAttempts + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      const { pageName = 'Page', fallbackType = 'default' } = this.props;
      const { error, resetAttempts } = this.state;

      return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-6">
          {/* Background Effects */}
          <div className="fixed inset-0 bg-grid-sm opacity-20 pointer-events-none" aria-hidden="true" />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-danger/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl w-full">
            {/* Error Card */}
            <div className="glass-card p-8 md:p-12 rounded-2xl border-danger/30 shadow-glow">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-danger/20 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-danger" aria-hidden="true" />
                </div>
              </div>

              {/* Heading */}
              <h1 className="text-3xl font-bold text-text text-center mb-4">
                {fallbackType === 'signals' && 'Signals Feed Unavailable'}
                {fallbackType === 'pricing' && 'Pricing Information Unavailable'}
                {fallbackType === 'default' && `${pageName} Error`}
              </h1>

              {/* Description */}
              <p className="text-lg text-text2 text-center mb-8">
                {fallbackType === 'signals' &&
                  'We encountered an issue loading the live signals feed. This could be due to a network issue or temporary service disruption.'}
                {fallbackType === 'pricing' &&
                  'We encountered an issue loading the pricing information. Please try refreshing the page.'}
                {fallbackType === 'default' &&
                  'Something went wrong while loading this page. Our team has been notified and is working to fix the issue.'}
              </p>

              {/* Error Details (Dev Only) */}
              {process.env.NODE_ENV === 'development' && error && (
                <div className="mb-6 p-4 bg-surface border border-danger/30 rounded-lg">
                  <p className="text-sm font-mono text-danger break-all">
                    {error.toString()}
                  </p>
                </div>
              )}

              {/* Reset Attempts Warning */}
              {resetAttempts >= 2 && (
                <div className="mb-6 p-4 bg-highlight/10 border border-highlight/30 rounded-lg">
                  <p className="text-sm text-highlight text-center">
                    Multiple retry attempts detected. If the issue persists, please try again later or contact support.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-brand text-white font-semibold rounded-lg shadow-soft hover:shadow-glow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
                >
                  <RefreshCw className="w-5 h-5" aria-hidden="true" />
                  Try Again
                </button>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface text-text border-2 border-border font-semibold rounded-lg hover:border-accent hover:bg-elev transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
                >
                  <Home className="w-5 h-5" aria-hidden="true" />
                  Go Home
                </Link>
              </div>

              {/* Help Text */}
              <p className="text-sm text-dim text-center mt-8">
                If the problem continues, please{' '}
                <a
                  href="https://discord.gg/your-server"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accentB underline"
                >
                  contact support
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
