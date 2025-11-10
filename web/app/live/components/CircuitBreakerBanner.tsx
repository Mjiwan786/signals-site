'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CircuitBreakerBanner Component
 *
 * Shows a warning banner when circuit breaker trips increase in last 60s
 * Orange banner at top of page, dismissible
 */

interface CircuitBreakerBannerProps {
  circuitBreakerTrips: number;
}

export default function CircuitBreakerBanner({ circuitBreakerTrips }: CircuitBreakerBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const previousTripsRef = useRef<number>(circuitBreakerTrips);
  const tripTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if trips increased
    if (circuitBreakerTrips > previousTripsRef.current) {
      tripTimeRef.current = Date.now();
      setShowBanner(true);
      setIsDismissed(false);
    }

    previousTripsRef.current = circuitBreakerTrips;

    // Auto-hide after 60 seconds
    if (tripTimeRef.current) {
      const elapsed = Date.now() - tripTimeRef.current;
      if (elapsed < 60000) {
        const timeout = setTimeout(() => {
          setShowBanner(false);
        }, 60000 - elapsed);

        return () => clearTimeout(timeout);
      } else {
        setShowBanner(false);
      }
    }
  }, [circuitBreakerTrips]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowBanner(false);
  };

  if (!showBanner || isDismissed) return null;

  const tripCount = circuitBreakerTrips - (previousTripsRef.current || 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-warning/10 border-b-2 border-warning/50 overflow-hidden"
        role="alert"
        aria-live="assertive"
      >
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Icon + Message */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <div className="relative">
                  <AlertTriangle className="w-6 h-6 text-warning animate-pulse" aria-hidden="true" />
                  <div className="absolute inset-0 blur-md bg-warning opacity-50" aria-hidden="true" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-warning">
                  Circuit Breaker Activity Detected
                </p>
                <p className="text-xs text-text2">
                  {tripCount > 0 && `${tripCount} new trip${tripCount > 1 ? 's' : ''} detected. `}
                  The Kraken WebSocket connection has triggered circuit breaker protection.
                  Monitoring continues in degraded mode.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDismiss}
                className="p-1.5 text-text2 hover:text-warning transition-colors focus:outline-none focus:ring-2 focus:ring-warning focus:ring-offset-2 focus:ring-offset-surface rounded"
                aria-label="Dismiss banner"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
