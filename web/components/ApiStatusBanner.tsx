'use client';

import { useState, useEffect } from 'react';
import { Cross2Icon, ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.aipredictedsignals.cloud';

interface ApiStatus {
  isHealthy: boolean;
  message: string;
  lastChecked: Date;
}

export default function ApiStatusBanner() {
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Only show in development
  const isDev = process.env.NODE_ENV !== 'production';

  useEffect(() => {
    if (!isDev) return;

    const checkApiHealth = async () => {
      setIsChecking(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(`${API_BASE_URL}/v1/status/health`, {
          cache: 'no-store',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          setStatus({
            isHealthy: true,
            message: 'API is healthy and reachable',
            lastChecked: new Date(),
          });
        } else {
          setStatus({
            isHealthy: false,
            message: `API returned status ${response.status}`,
            lastChecked: new Date(),
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.name === 'AbortError'
              ? 'API health check timed out (5s)'
              : error.message
            : 'Unknown error';

        setStatus({
          isHealthy: false,
          message: `API unavailable: ${errorMessage}`,
          lastChecked: new Date(),
        });
      } finally {
        setIsChecking(false);
      }
    };

    // Initial check
    checkApiHealth();

    // Check every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);

    return () => clearInterval(interval);
  }, [isDev]);

  // Don't render in production or if dismissed or if checking
  if (!isDev || isDismissed || isChecking) return null;

  // Don't show banner if API is healthy
  if (status?.isHealthy) return null;

  return (
    <AnimatePresence>
      {status && !status.isHealthy && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full bg-warning/10 border-b-2 border-warning/30 overflow-hidden"
          role="alert"
          aria-live="polite"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Icon + Message */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <ExclamationTriangleIcon
                  className="w-5 h-5 text-warning flex-shrink-0"
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-warning">
                    Development Mode: API Issue Detected
                  </p>
                  <p className="text-xs text-text2 truncate">
                    {status.message} • Last checked:{' '}
                    {status.lastChecked.toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-dim mt-1">
                    API Base: <code className="bg-elev px-1 rounded">{API_BASE_URL}</code>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="px-3 py-1 text-xs font-medium text-warning bg-warning/10 border border-warning/30 rounded hover:bg-warning/20 transition-colors focus:outline-none focus:ring-2 focus:ring-warning focus:ring-offset-2 focus:ring-offset-surface"
                  aria-label="Retry API connection"
                >
                  Retry
                </button>
                <button
                  onClick={() => setIsDismissed(true)}
                  className="p-1 text-text2 hover:text-warning transition-colors focus:outline-none focus:ring-2 focus:ring-warning focus:ring-offset-2 focus:ring-offset-surface rounded"
                  aria-label="Dismiss banner"
                >
                  <Cross2Icon className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Separate component for showing when API is healthy (optional, for debugging)
export function ApiHealthIndicator() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const isDev = process.env.NODE_ENV !== 'production';

  useEffect(() => {
    if (!isDev) return;

    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/v1/status/health`, {
          cache: 'no-store',
        });
        setIsHealthy(response.ok);
      } catch {
        setIsHealthy(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [isDev]);

  if (!isDev || isHealthy === null) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
          isHealthy
            ? 'bg-success/10 border-success/30 text-success'
            : 'bg-danger/10 border-danger/30 text-danger'
        }`}
        role="status"
        aria-live="polite"
      >
        {isHealthy ? (
          <>
            <CheckCircledIcon className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs font-medium">API Connected</span>
          </>
        ) : (
          <>
            <ExclamationTriangleIcon className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs font-medium">API Disconnected</span>
          </>
        )}
      </div>
    </div>
  );
}
