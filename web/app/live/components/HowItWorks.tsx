'use client';

import { ArrowRight, Database, Radio, Zap, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * HowItWorks Component
 *
 * Explains the data flow from Kraken to dashboard
 * Professional, scannable, no marketing fluff
 */

export default function HowItWorks() {
  const steps = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      label: 'Kraken Live Data',
      description: 'Real-time market data via WebSocket',
      color: 'text-accentA',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'AI Engine',
      description: 'Multi-agent analysis & signal generation',
      color: 'text-accentB',
    },
    {
      icon: <Database className="w-6 h-6" />,
      label: 'Redis Cloud',
      description: 'TLS-encrypted signal queue',
      color: 'text-success',
    },
    {
      icon: <Radio className="w-6 h-6" />,
      label: 'API (SSE)',
      description: 'Server-Sent Events streaming',
      color: 'text-warning',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      label: 'This Dashboard',
      description: 'Real-time visualization',
      color: 'text-accentA',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-elev border border-accent/30 rounded-xl p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text mb-2">How It Works</h3>
        <p className="text-sm text-dim">
          Transparent data pipeline from exchange to dashboard
        </p>
      </div>

      {/* Flow Diagram */}
      <div className="flex items-center justify-between gap-2 mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2 flex-1">
            {/* Step */}
            <div className="flex flex-col items-center text-center flex-1">
              <div
                className={`w-12 h-12 rounded-lg border border-accent/30 bg-surface/50 flex items-center justify-center mb-2 ${step.color}`}
              >
                {step.icon}
              </div>
              <p className="text-xs font-semibold text-text mb-1">{step.label}</p>
              <p className="text-xs text-dim">{step.description}</p>
            </div>

            {/* Arrow */}
            {index < steps.length - 1 && (
              <ArrowRight className="w-5 h-5 text-dim flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Technical Details */}
      <div className="pt-6 border-t border-accent/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <p className="font-semibold text-text mb-1">Data Source</p>
            <p className="text-dim">
              Kraken WebSocket API provides sub-second latency market data with circuit
              breaker protection.
            </p>
          </div>
          <div>
            <p className="font-semibold text-text mb-1">Processing</p>
            <p className="text-dim">
              Multi-agent AI engine analyzes price action, volume, and technical indicators
              to generate high-confidence signals.
            </p>
          </div>
          <div>
            <p className="font-semibold text-text mb-1">Delivery</p>
            <p className="text-dim">
              Signals stream via SSE (Server-Sent Events) with automatic reconnection and
              exponential backoff.
            </p>
          </div>
        </div>
      </div>

      {/* Latency Stats */}
      <div className="mt-6 pt-6 border-t border-accent/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-success font-mono">{'<50ms'}</p>
            <p className="text-xs text-dim mt-1">WebSocket Latency</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success font-mono">{'<2ms'}</p>
            <p className="text-xs text-dim mt-1">Redis Ping</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success font-mono">Real-time</p>
            <p className="text-xs text-dim mt-1">SSE Streaming</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
