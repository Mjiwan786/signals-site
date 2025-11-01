/**
 * Performance Monitoring Utility
 * PRD B3.2: Measure FMP ≤1s on desktop, track UI performance
 *
 * Metrics tracked:
 * - First Meaningful Paint (FMP)
 * - Time to Interactive (TTI)
 * - Component render times
 * - API response times
 * - SSE latency
 */

import { logPerformanceIssue } from './error-logger';

// Performance thresholds (PRD B3.2)
export const PERFORMANCE_THRESHOLDS = {
  FMP: 1000, // 1s
  TTI: 3000, // 3s
  API_RESPONSE: 500, // 500ms
  COMPONENT_RENDER: 100, // 100ms
  SSE_LATENCY: 200, // 200ms
} as const;

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  threshold?: number;
  exceededThreshold?: boolean;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private marks: Map<string, number> = new Map();

  /**
   * Mark the start of a performance measurement
   */
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * Measure time since mark and record metric
   */
  measure(
    name: string,
    threshold?: number
  ): number | null {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`[PerformanceMonitor] No mark found for: ${name}`);
      return null;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(name);

    // Record metric
    this.recordMetric(name, duration, threshold);

    // Check threshold
    if (threshold && duration > threshold) {
      console.warn(
        `[PerformanceMonitor] Threshold exceeded: ${name} (${duration.toFixed(2)}ms > ${threshold}ms)`
      );
      logPerformanceIssue(name, duration, threshold);
    }

    return duration;
  }

  /**
   * Record a performance metric
   */
  recordMetric(name: string, value: number, threshold?: number): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      threshold,
      exceededThreshold: threshold ? value > threshold : false,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metrics = this.metrics.get(name)!;
    metrics.push(metric);

    // Keep only last 100 measurements per metric
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  /**
   * Get average value for a metric
   */
  getAverage(name: string): number | null {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) return null;

    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  /**
   * Get 95th percentile for a metric
   */
  getP95(name: string): number | null {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) return null;

    const sorted = [...metrics].sort((a, b) => a.value - b.value);
    const index = Math.floor(sorted.length * 0.95);
    return sorted[index].value;
  }

  /**
   * Get all metrics as a summary
   */
  getSummary(): Record<string, { avg: number; p95: number; count: number }> {
    const summary: Record<string, { avg: number; p95: number; count: number }> = {};

    this.metrics.forEach((metrics, name) => {
      const avg = this.getAverage(name);
      const p95 = this.getP95(name);
      summary[name] = {
        avg: avg || 0,
        p95: p95 || 0,
        count: metrics.length,
      };
    });

    return summary;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    this.marks.clear();
  }

  /**
   * Log performance summary to console
   */
  logSummary(): void {
    const summary = this.getSummary();
    console.table(summary);
  }
}

// Global singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Measure First Meaningful Paint (FMP)
 * Call this when the page's main content is visible
 */
export function measureFMP(pageName: string): number | null {
  const fmp = performanceMonitor.measure(
    `fmp:${pageName}`,
    PERFORMANCE_THRESHOLDS.FMP
  );

  if (fmp !== null) {
    console.log(`[FMP] ${pageName}: ${fmp.toFixed(2)}ms`);
  }

  return fmp;
}

/**
 * Mark FMP start (call in page component mount)
 */
export function markFMPStart(pageName: string): void {
  performanceMonitor.mark(`fmp:${pageName}`);
}

/**
 * Measure component render time
 */
export function measureComponentRender(componentName: string): number | null {
  return performanceMonitor.measure(
    `render:${componentName}`,
    PERFORMANCE_THRESHOLDS.COMPONENT_RENDER
  );
}

/**
 * Mark component render start
 */
export function markRenderStart(componentName: string): void {
  performanceMonitor.mark(`render:${componentName}`);
}

/**
 * Measure API request time
 */
export function measureAPIRequest(endpoint: string): number | null {
  return performanceMonitor.measure(
    `api:${endpoint}`,
    PERFORMANCE_THRESHOLDS.API_RESPONSE
  );
}

/**
 * Mark API request start
 */
export function markAPIStart(endpoint: string): void {
  performanceMonitor.mark(`api:${endpoint}`);
}

/**
 * Measure SSE message latency
 * @param signalTimestamp - Timestamp from the signal (in seconds)
 */
export function measureSSELatency(signalTimestamp: number): number {
  const now = Date.now();
  const signalTime = signalTimestamp * 1000; // Convert to ms
  const latency = now - signalTime;

  performanceMonitor.recordMetric(
    'sse:latency',
    latency,
    PERFORMANCE_THRESHOLDS.SSE_LATENCY
  );

  if (latency > PERFORMANCE_THRESHOLDS.SSE_LATENCY) {
    console.warn(`[SSE] High latency detected: ${latency.toFixed(2)}ms`);
  }

  return latency;
}

/**
 * React hook for measuring component lifecycle
 */
export function usePerformanceMeasure(componentName: string) {
  // Mark start on mount
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    markRenderStart(componentName);

    return () => {
      measureComponentRender(componentName);
    };
  }, [componentName]);
}

/**
 * Get Web Vitals using Next.js built-in reportWebVitals
 * Usage: Add to app/layout.tsx
 *
 * export function reportWebVitals(metric: NextWebVitalsMetric) {
 *   handleWebVital(metric);
 * }
 */
export function handleWebVital(metric: {
  id: string;
  name: string;
  label: string;
  value: number;
  startTime?: number;
}): void {
  const { name, value } = metric;

  // Record metric
  performanceMonitor.recordMetric(`webvital:${name}`, value);

  // Check thresholds
  const thresholds: Record<string, number> = {
    FCP: 1800, // First Contentful Paint
    LCP: 2500, // Largest Contentful Paint
    FID: 100, // First Input Delay
    CLS: 0.1, // Cumulative Layout Shift
    TTFB: 800, // Time to First Byte
    INP: 200, // Interaction to Next Paint
  };

  const threshold = thresholds[name];
  if (threshold && value > threshold) {
    console.warn(`[WebVital] ${name} exceeded threshold: ${value} > ${threshold}`);
    logPerformanceIssue(`webvital:${name}`, value, threshold);
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[WebVital] ${name}:`, value);
  }
}

/**
 * Track render rate (FPS approximation)
 */
export class RenderRateTracker {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private rafId: number | null = null;

  start(): void {
    const measure = () => {
      this.frameCount++;
      const now = performance.now();
      const delta = now - this.lastTime;

      if (delta >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / delta);
        this.frameCount = 0;
        this.lastTime = now;

        // Warn if FPS drops below 30
        if (this.fps < 30) {
          console.warn(`[RenderRate] Low FPS detected: ${this.fps}`);
          logPerformanceIssue('fps', this.fps, 30);
        }
      }

      this.rafId = requestAnimationFrame(measure);
    };

    this.rafId = requestAnimationFrame(measure);
  }

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  getFPS(): number {
    return this.fps;
  }
}

/**
 * Export performance summary for debugging
 */
export function exportPerformanceReport(): string {
  const summary = performanceMonitor.getSummary();
  return JSON.stringify(summary, null, 2);
}

// Import React for usePerformanceMeasure hook
import React from 'react';
