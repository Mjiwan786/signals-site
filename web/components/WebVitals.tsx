/**
 * Web Vitals Reporter
 * PRD Step 12: Log Web Vitals to console in dev
 *
 * Tracks Core Web Vitals:
 * - LCP (Largest Contentful Paint) - Target: < 2.5s
 * - FID (First Input Delay) - Target: < 100ms
 * - CLS (Cumulative Layout Shift) - Target: < 0.1
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint)
 */

'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

/**
 * Format metric value based on type
 */
function formatMetricValue(name: string, value: number): string {
  // Time-based metrics (ms)
  if (['FCP', 'LCP', 'FID', 'TTFB', 'INP'].includes(name)) {
    return `${value.toFixed(0)}ms`;
  }
  // CLS is unitless
  return value.toFixed(3);
}

/**
 * Get rating (good/needs-improvement/poor) based on thresholds
 */
function getMetricRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, [number, number]> = {
    LCP: [2500, 4000],
    FID: [100, 300],
    CLS: [0.1, 0.25],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
    INP: [200, 500],
  };

  const [good, poor] = thresholds[name] || [0, Infinity];

  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Get emoji for rating
 */
function getRatingEmoji(rating: 'good' | 'needs-improvement' | 'poor'): string {
  switch (rating) {
    case 'good':
      return '✅';
    case 'needs-improvement':
      return '⚠️';
    case 'poor':
      return '❌';
  }
}

/**
 * Get console style based on rating
 */
function getConsoleStyle(rating: 'good' | 'needs-improvement' | 'poor'): string {
  const baseStyle = 'padding: 2px 6px; border-radius: 3px; font-weight: bold;';
  switch (rating) {
    case 'good':
      return `${baseStyle} background: #10b981; color: white;`;
    case 'needs-improvement':
      return `${baseStyle} background: #f59e0b; color: white;`;
    case 'poor':
      return `${baseStyle} background: #ef4444; color: white;`;
  }
}

/**
 * Performance mark utility
 */
export function performanceMark(name: string): void {
  if (typeof window === 'undefined' || !window.performance?.mark) return;

  try {
    performance.mark(name);
  } catch (error) {
    // Silently fail if performance API unavailable
  }
}

/**
 * Performance measure utility
 */
export function performanceMeasure(name: string, startMark: string, endMark?: string): number | null {
  if (typeof window === 'undefined' || !window.performance?.measure) return null;

  try {
    const measure = performance.measure(name, startMark, endMark);
    return measure.duration;
  } catch (error) {
    // Silently fail if marks don't exist
    return null;
  }
}

/**
 * Web Vitals Reporter Component
 * Only logs in development mode
 */
export default function WebVitals() {
  useReportWebVitals((metric) => {
    // Only log in development
    if (process.env.NODE_ENV !== 'development') return;

    const { name, value, rating, id } = metric;
    const formattedValue = formatMetricValue(name, value);
    const metricRating = getMetricRating(name, value);
    const emoji = getRatingEmoji(metricRating);
    const style = getConsoleStyle(metricRating);

    // Log to console with color coding
    console.log(
      `%c${emoji} ${name}%c ${formattedValue} %c(${metricRating})`,
      style,
      'font-weight: bold; color: #6EE7FF;',
      'color: #9AA0AA; font-size: 0.9em;'
    );

    // Log full details for debugging (collapsed group)
    if (process.env.NODE_ENV === 'development') {
      console.groupCollapsed(`[Web Vitals] ${name} Details`);
      console.table({
        Metric: name,
        Value: formattedValue,
        Rating: metricRating,
        ID: id,
        Delta: metric.delta ? formatMetricValue(name, metric.delta) : 'N/A',
        NavigationType: metric.navigationType || 'N/A',
      });
      console.groupEnd();
    }
  });

  // Add performance marks for key app lifecycle events
  useEffect(() => {
    performanceMark('app:hydration-complete');

    // Measure time from navigation start to hydration
    const hydrationTime = performanceMeasure(
      'app:hydration-time',
      'navigationStart',
      'app:hydration-complete'
    );

    if (hydrationTime !== null && process.env.NODE_ENV === 'development') {
      console.log(
        `%c⚡ Hydration Time%c ${hydrationTime.toFixed(0)}ms`,
        'padding: 2px 6px; border-radius: 3px; font-weight: bold; background: #A78BFA; color: white;',
        'font-weight: bold; color: #6EE7FF;'
      );
    }
  }, []);

  return null; // No UI
}

/**
 * Enhanced Error Boundary with Web Vitals logging
 */
export function logErrorMetric(error: Error, errorInfo?: React.ErrorInfo): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      '%c❌ Error Boundary Triggered',
      'padding: 2px 6px; border-radius: 3px; font-weight: bold; background: #ef4444; color: white;',
      error
    );

    if (errorInfo) {
      console.groupCollapsed('[Error Details]');
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  // Mark error in performance timeline
  performanceMark(`error:${error.name}`);
}
