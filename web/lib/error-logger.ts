/**
 * Client-side Error Logging Utility
 * PRD B3.2: Sentry placeholder for error tracking
 *
 * Setup Instructions:
 * 1. Install: npm install @sentry/nextjs
 * 2. Run: npx @sentry/wizard@latest -i nextjs
 * 3. Set SENTRY_DSN in .env.local
 * 4. Replace placeholders below with actual Sentry SDK calls
 */

import { ApiError } from './api';

// Environment flag to enable/disable Sentry
const SENTRY_ENABLED = process.env.NEXT_PUBLIC_SENTRY_DSN !== undefined;
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  Fatal = 'fatal',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Debug = 'debug',
}

/**
 * Error context for additional debugging info
 */
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  apiEndpoint?: string;
  statusCode?: number;
  extra?: Record<string, unknown>;
}

/**
 * Initialize Sentry (placeholder)
 * Call this in app/layout.tsx or _app.tsx
 */
export function initErrorLogger() {
  if (!SENTRY_ENABLED) {
    console.log('[ErrorLogger] Sentry disabled - using console fallback');
    return;
  }

  // TODO: Replace with actual Sentry initialization
  // import * as Sentry from '@sentry/nextjs';
  //
  // Sentry.init({
  //   dsn: SENTRY_DSN,
  //   environment: process.env.NODE_ENV,
  //   tracesSampleRate: 0.1, // 10% of transactions
  //   beforeSend(event, hint) {
  //     // Filter out noise (e.g., ad blockers, browser extensions)
  //     if (hint.originalException instanceof TypeError) {
  //       const message = hint.originalException.message;
  //       if (message.includes('script error') || message.includes('chrome-extension')) {
  //         return null;
  //       }
  //     }
  //     return event;
  //   },
  // });

  console.log('[ErrorLogger] Sentry initialized (placeholder)');
}

/**
 * Log an error to Sentry
 * @param error - Error object or string message
 * @param context - Additional context for debugging
 * @param severity - Error severity level
 */
export function logError(
  error: Error | string,
  context?: ErrorContext,
  severity: ErrorSeverity = ErrorSeverity.Error
): void {
  const errorObj = typeof error === 'string' ? new Error(error) : error;

  // Console fallback
  console.error('[ErrorLogger]', severity, errorObj.message, {
    context,
    stack: errorObj.stack,
  });

  if (!SENTRY_ENABLED) return;

  // TODO: Replace with actual Sentry call
  // import * as Sentry from '@sentry/nextjs';
  //
  // Sentry.withScope((scope) => {
  //   scope.setLevel(severity);
  //
  //   if (context?.component) {
  //     scope.setTag('component', context.component);
  //   }
  //
  //   if (context?.action) {
  //     scope.setTag('action', context.action);
  //   }
  //
  //   if (context?.apiEndpoint) {
  //     scope.setContext('api', {
  //       endpoint: context.apiEndpoint,
  //       statusCode: context.statusCode,
  //     });
  //   }
  //
  //   if (context?.userId) {
  //     scope.setUser({ id: context.userId });
  //   }
  //
  //   if (context?.extra) {
  //     scope.setExtras(context.extra);
  //   }
  //
  //   Sentry.captureException(errorObj);
  // });
}

/**
 * Log API errors with automatic context extraction
 */
export function logApiError(error: ApiError, endpoint: string): void {
  logError(error, {
    component: 'ApiClient',
    action: 'fetch',
    apiEndpoint: endpoint,
    statusCode: error.statusCode,
    extra: {
      url: error.response?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
    },
  });
}

/**
 * Log SSE connection errors
 */
export function logSSEError(error: Error, reconnectAttempt?: number): void {
  logError(error, {
    component: 'SignalsStreamManager',
    action: 'sse_connection',
    extra: {
      reconnectAttempt,
      timestamp: Date.now(),
    },
  }, ErrorSeverity.Warning);
}

/**
 * Log performance issues
 */
export function logPerformanceIssue(
  metric: string,
  value: number,
  threshold: number
): void {
  logError(`Performance threshold exceeded: ${metric}`, {
    component: 'PerformanceMonitor',
    action: 'metric_exceeded',
    extra: {
      metric,
      value,
      threshold,
      exceeded_by: value - threshold,
    },
  }, ErrorSeverity.Warning);
}

/**
 * Log UI flood events (too many updates)
 */
export function logFloodEvent(
  signalCount: number,
  timeWindowMs: number
): void {
  logError('UI flood detected', {
    component: 'useSignalsStream',
    action: 'flood_control',
    extra: {
      signalCount,
      timeWindowMs,
      rate: (signalCount / timeWindowMs) * 1000, // signals per second
    },
  }, ErrorSeverity.Info);
}

/**
 * Capture breadcrumb for debugging (placeholder)
 */
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, unknown>
): void {
  if (!SENTRY_ENABLED) {
    console.debug('[Breadcrumb]', category, message, data);
    return;
  }

  // TODO: Replace with actual Sentry call
  // import * as Sentry from '@sentry/nextjs';
  //
  // Sentry.addBreadcrumb({
  //   message,
  //   category,
  //   level: 'info',
  //   data,
  // });
}

/**
 * Set user context (placeholder)
 */
export function setUser(userId: string, email?: string): void {
  if (!SENTRY_ENABLED) return;

  // TODO: Replace with actual Sentry call
  // import * as Sentry from '@sentry/nextjs';
  //
  // Sentry.setUser({
  //   id: userId,
  //   email,
  // });
}

/**
 * Clear user context on logout
 */
export function clearUser(): void {
  if (!SENTRY_ENABLED) return;

  // TODO: Replace with actual Sentry call
  // import * as Sentry from '@sentry/nextjs';
  //
  // Sentry.setUser(null);
}

/**
 * Helper to wrap async functions with error logging
 */
export function withErrorLogging<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context: ErrorContext
): T {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(
        error instanceof Error ? error : new Error(String(error)),
        context
      );
      throw error; // Re-throw after logging
    }
  }) as T;
}

/**
 * React Error Boundary helper
 * Usage: Pass to ErrorBoundary fallbackRender prop
 */
export function logReactError(
  error: Error,
  errorInfo: { componentStack: string }
): void {
  logError(error, {
    component: 'ErrorBoundary',
    action: 'component_crash',
    extra: {
      componentStack: errorInfo.componentStack,
    },
  }, ErrorSeverity.Fatal);
}
