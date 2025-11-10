'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'https://crypto-signals-api.fly.dev';

interface HealthStatus {
  isHealthy: boolean;
  latency: number;
  lastChecked: Date;
}

export default function LiveStatusPill() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      const startTime = performance.now();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(`${API_BASE_URL}/live`, {
          cache: 'no-store',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const latency = performance.now() - startTime;

        setStatus({
          isHealthy: response.ok,
          latency,
          lastChecked: new Date(),
        });
        setIsChecking(false);
      } catch (error) {
        setStatus({
          isHealthy: false,
          latency: 0,
          lastChecked: new Date(),
        });
        setIsChecking(false);
      }
    };

    // Initial check
    checkHealth();

    // Check every 20 seconds
    const interval = setInterval(checkHealth, 20000);

    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700">
        <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" />
        <span className="text-xs font-medium text-gray-400">Checking...</span>
      </div>
    );
  }

  const isHealthy = status?.isHealthy ?? false;
  const latencyMs = status?.latency ? Math.round(status.latency) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
        isHealthy
          ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20 shadow-lg shadow-green-500/10'
          : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
      }`}
      title={`Last checked: ${status?.lastChecked.toLocaleTimeString()} • Latency: ${latencyMs}ms`}
    >
      {/* Status dot with pulse animation */}
      <div className="relative flex items-center justify-center">
        {isHealthy ? (
          <>
            {/* Animated Radio Icon for LIVE */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Radio className="w-3 h-3 text-green-500" fill="currentColor" />
            </motion.div>
            {/* Outer pulse ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-ping opacity-60" />
            </div>
          </>
        ) : (
          <div className="w-2 h-2 rounded-full bg-red-500" />
        )}
      </div>

      {/* Status text */}
      <motion.span
        animate={isHealthy ? {
          opacity: [1, 0.8, 1],
        } : {}}
        transition={{
          duration: 2,
          repeat: isHealthy ? Infinity : 0,
          ease: "easeInOut"
        }}
        className={`text-xs font-bold uppercase tracking-wider ${
          isHealthy ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {isHealthy ? 'LIVE' : 'OFFLINE'}
      </motion.span>

      {/* Latency badge (only when healthy) */}
      {isHealthy && latencyMs > 0 && (
        <span className="text-[10px] text-green-300/70 font-mono font-semibold">
          {latencyMs}ms
        </span>
      )}
    </motion.div>
  );
}
