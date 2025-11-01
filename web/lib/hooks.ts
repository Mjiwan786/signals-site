/**
 * React Hooks for Signals-Site API
 * Provides data fetching with error handling and fallbacks
 * PRD: If API unreachable, components show skeleton/fallback
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import useSWR from 'swr';
import { getSignals, getPnL, getHealth, SignalsStreamManager, ApiError } from './api';
import type { SignalDTO, PnLPoint, HealthCheck, SignalsQuery } from './types';

/**
 * Hook for fetching signals with SWR
 * Provides automatic revalidation and caching
 */
export function useSignals(opts: Partial<SignalsQuery> = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    ['signals', opts],
    () => getSignals(opts),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      onError: (err) => {
        console.error('useSignals error:', err);
      },
    }
  );

  return {
    signals: data ?? [],
    error: error as ApiError | undefined,
    isLoading,
    isEmpty: !isLoading && (!data || data.length === 0),
    refetch: mutate,
  };
}

/**
 * Hook for fetching PnL data with SWR
 * PRD Step 11: Cached with SWR, stable results across refresh
 */
export function usePnL(n: number = 500) {
  const { data, error, isLoading, mutate } = useSWR(
    ['pnl', n],
    () => getPnL(n),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // Dedupe requests within 10s
      keepPreviousData: true, // Keep previous data while revalidating
      onError: (err) => {
        console.error('usePnL error:', err);
      },
    }
  );

  return {
    data: data ?? [],
    error: error as ApiError | undefined,
    isLoading,
    isEmpty: !isLoading && (!data || data.length === 0),
    refetch: mutate,
  };
}

/**
 * Prefetch PnL data for faster navigation
 * PRD Step 11: Prefetch on / and /signals
 *
 * Usage: Call this in page components to warm the cache
 */
export function prefetchPnL(n: number = 500): Promise<PnLPoint[]> {
  return getPnL(n);
}

/**
 * Hook for API health checks
 */
export function useHealth() {
  const { data, error, isLoading, mutate } = useSWR(
    'health',
    () => getHealth(),
    {
      refreshInterval: 30000, // Check every 30s
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (err) => {
        console.error('useHealth error:', err);
      },
    }
  );

  return {
    health: data,
    error: error as ApiError | undefined,
    isLoading,
    isHealthy: data?.status === 'healthy',
    isDegraded: data?.status === 'degraded',
    isDown: data?.status === 'down' || !!error,
    refetch: mutate,
  };
}

/**
 * Hook for real-time signals streaming via SSE
 * Manages connection lifecycle and reconnection logic
 * PRD B3.1: Fetches historical signals on mount, then connects SSE for live updates
 * PRD B3.2: Flood controls with batched updates (100 signals/min, no UI freeze)
 */
export function useSignalsStream(
  opts: Partial<SignalsQuery> = {},
  enabled: boolean = true
) {
  const [signals, setSignals] = useState<SignalDTO[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const managerRef = useRef<SignalsStreamManager | null>(null);

  // Batch buffer for flood control (PRD B3.2: Handle 100 signals/min)
  const batchBufferRef = useRef<SignalDTO[]>([]);
  const batchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const BATCH_INTERVAL_MS = 500; // Update UI every 500ms max
  const MAX_SIGNALS = 200; // Max signals to keep in memory

  // Fetch historical signals on mount (PRD B3.1 requirement)
  useEffect(() => {
    if (!enabled) return;

    const fetchHistorical = async () => {
      try {
        setIsLoadingHistory(true);
        const historicalSignals = await getSignals({
          mode: opts.mode || 'paper',
          limit: opts.limit || 50,
        });
        setSignals(historicalSignals); // Populate with historical data
        setError(null);
      } catch (err) {
        console.error('Failed to fetch historical signals:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch historical signals'));
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistorical();
  }, [enabled, opts.mode, opts.limit]);

  // Flush batch buffer to state (throttled UI updates)
  const flushBatch = useCallback(() => {
    if (batchBufferRef.current.length === 0) return;

    const newSignals = [...batchBufferRef.current];
    batchBufferRef.current = [];

    setSignals((prev) => {
      // Prepend new signals, keep only MAX_SIGNALS
      const updated = [...newSignals.reverse(), ...prev].slice(0, MAX_SIGNALS);
      return updated;
    });
  }, []);

  // Callbacks for stream manager with batching
  const handleMessage = useCallback((signal: SignalDTO) => {
    // Add to batch buffer instead of immediate state update
    batchBufferRef.current.push(signal);

    // Schedule batch flush if not already scheduled
    if (!batchTimerRef.current) {
      batchTimerRef.current = setTimeout(() => {
        flushBatch();
        batchTimerRef.current = null;
      }, BATCH_INTERVAL_MS);
    }

    // Immediate flush if buffer is too large (safety)
    if (batchBufferRef.current.length >= 20) {
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
        batchTimerRef.current = null;
      }
      flushBatch();
    }
  }, [flushBatch]);

  const handleConnect = useCallback(() => {
    setIsConnected(true);
    setError(null);
  }, []);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
  }, []);

  const handleError = useCallback((err: Error) => {
    setError(err);
    setIsConnected(false);
  }, []);

  // Initialize stream manager for live updates
  useEffect(() => {
    if (!enabled) return;

    const manager = new SignalsStreamManager(
      handleMessage,
      handleError,
      handleConnect,
      handleDisconnect
    );

    managerRef.current = manager;
    manager.connect(opts);

    return () => {
      manager.disconnect();
      managerRef.current = null;

      // Clear batch timer on unmount
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
        batchTimerRef.current = null;
      }
    };
  }, [enabled, opts.mode, handleMessage, handleError, handleConnect, handleDisconnect]);

  const clearSignals = useCallback(() => {
    setSignals([]);
    batchBufferRef.current = [];
    if (batchTimerRef.current) {
      clearTimeout(batchTimerRef.current);
      batchTimerRef.current = null;
    }
  }, []);

  return {
    signals,
    isConnected,
    isLoadingHistory,
    error,
    clearSignals,
  };
}

/**
 * Hook for combined API status
 * Useful for displaying global error banners
 */
export function useApiStatus() {
  const { health, error: healthError, isLoading } = useHealth();
  const [lastError, setLastError] = useState<Error | null>(null);

  useEffect(() => {
    if (healthError) {
      setLastError(healthError);
    }
  }, [healthError]);

  return {
    isHealthy: health?.status === 'healthy',
    isDegraded: health?.status === 'degraded',
    isDown: health?.status === 'down' || !!healthError,
    isLoading,
    status: health?.status,
    lastError,
    redisUp: health?.services?.redis === 'up',
    apiUp: health?.services?.api === 'up',
  };
}

/**
 * Hook for handling API errors with user-friendly messages
 */
export function useApiErrorHandler() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const handleError = useCallback((error: Error | ApiError) => {
    let message = 'An unexpected error occurred';

    if (error instanceof ApiError) {
      if (error.statusCode === 404) {
        message = 'The requested data could not be found';
      } else if (error.statusCode === 500) {
        message = 'Server error. Please try again later';
      } else if (error.statusCode === 503) {
        message = 'Service temporarily unavailable';
      } else if (error.message.includes('fetch')) {
        message = 'Unable to connect to the server';
      } else {
        message = error.message;
      }
    } else {
      message = error.message || message;
    }

    setErrorMessage(message);
    setShowError(true);
  }, []);

  const clearError = useCallback(() => {
    setShowError(false);
    setTimeout(() => setErrorMessage(null), 300); // Wait for animation
  }, []);

  return {
    errorMessage,
    showError,
    handleError,
    clearError,
  };
}

/**
 * Hook for scroll-triggered animations (animate once on enter viewport)
 * PRD Step 10: Section entrance animations
 * Respects prefers-reduced-motion
 */
export function useScrollAnimation(
  threshold: number = 0.1,
  triggerOnce: boolean = true
) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      setHasAnimated(true);
      return;
    }

    // If already animated and triggerOnce is true, skip observer
    if (triggerOnce && hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            setHasAnimated(true);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, triggerOnce, hasAnimated]);

  return { ref: elementRef, isInView, hasAnimated };
}
