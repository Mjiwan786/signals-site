/**
 * API Reference Documentation
 * PRD-003: Developer documentation for programmatic access
 */

'use client';

import { motion } from 'framer-motion';
import { Code, Lock, Zap, Database, Activity } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/motion-variants';
import { API_BASE } from '@/lib/env';

export default function APIReferencePage() {
  const endpoints = [
    {
      method: 'GET',
      path: '/v1/signals',
      description: 'Retrieve recent trading signals',
      params: [
        { name: 'mode', type: 'string', required: false, description: 'Trading mode: "paper" or "live" (default: paper)' },
        { name: 'limit', type: 'number', required: false, description: 'Number of signals to return (default: 200, max: 1000)' },
        { name: 'pair', type: 'string', required: false, description: 'Filter by trading pair (e.g., "BTC/USD")' },
      ],
      example: `curl "${API_BASE}/v1/signals?mode=paper&limit=10"`,
    },
    {
      method: 'GET',
      path: '/v1/signals/stream',
      description: 'Server-Sent Events stream for real-time signals',
      params: [
        { name: 'mode', type: 'string', required: false, description: 'Trading mode: "paper" or "live"' },
      ],
      example: `curl -N "${API_BASE}/v1/signals/stream?mode=paper"`,
    },
    {
      method: 'GET',
      path: '/v1/pnl',
      description: 'Get historical PnL / equity curve data',
      params: [
        { name: 'n', type: 'number', required: false, description: 'Number of data points (default: 500, max: 10000)' },
      ],
      example: `curl "${API_BASE}/v1/pnl?n=1000"`,
    },
    {
      method: 'GET',
      path: '/v1/backtest/pnl',
      description: 'Get backtest equity curve for a specific symbol',
      params: [
        { name: 'symbol', type: 'string', required: true, description: 'Trading pair (e.g., "BTC-USD")' },
        { name: 'timeframe', type: 'string', required: false, description: 'Chart timeframe (default: "1h")' },
      ],
      example: `curl "${API_BASE}/v1/backtest/pnl?symbol=BTC-USD"`,
    },
    {
      method: 'GET',
      path: '/v1/backtest/trades',
      description: 'Get backtest trade entry/exit markers',
      params: [
        { name: 'symbol', type: 'string', required: true, description: 'Trading pair (e.g., "BTC-USD")' },
      ],
      example: `curl "${API_BASE}/v1/backtest/trades?symbol=BTC-USD"`,
    },
    {
      method: 'GET',
      path: '/v1/status/health',
      description: 'API health check endpoint',
      params: [],
      example: `curl "${API_BASE}/v1/status/health"`,
    },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-sm opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accentB/10 border border-accentB/30 rounded-full mb-6">
            <Code className="w-4 h-4 text-accentB" />
            <span className="text-sm font-medium text-accentB">Developer Documentation</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            API Reference
          </h1>
          <p className="text-lg text-text2 max-w-2xl mx-auto">
            Programmatic access to trading signals, performance data, and real-time streams.
          </p>
        </motion.div>

        {/* Getting Started */}
        <motion.section
          className="glass-card rounded-2xl p-8 mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-accentA" />
            Getting Started
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-text mb-2">Base URL</h3>
              <div className="p-4 bg-surface border border-border rounded-lg font-mono text-sm text-accentA">
                {API_BASE}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-text mb-2">Response Format</h3>
              <p className="text-text2 text-sm mb-2">
                All responses are in JSON format with appropriate HTTP status codes:
              </p>
              <ul className="text-sm text-text2 space-y-1 ml-6">
                <li>• <code className="text-success">200 OK</code> - Request successful</li>
                <li>• <code className="text-highlight">404 Not Found</code> - Resource not found</li>
                <li>• <code className="text-danger">500 Internal Server Error</code> - Server error</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-text mb-2">Rate Limiting</h3>
              <p className="text-text2 text-sm">
                API requests are rate-limited to 60 requests per minute per IP address.
                Exceeding this limit will result in HTTP 429 responses.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Authentication Note */}
        <motion.div
          className="p-6 bg-accentA/5 border border-accentA/20 rounded-xl mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-start gap-4">
            <Lock className="w-6 h-6 text-accentA mt-1" />
            <div>
              <h3 className="font-semibold text-text mb-2">Authentication</h3>
              <p className="text-text2 text-sm">
                Currently, all endpoints are publicly accessible without authentication.
                Premium features requiring API keys will be available in a future release.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Endpoints */}
        <motion.section
          className="space-y-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
            <Database className="w-6 h-6 text-accentB" />
            Available Endpoints
          </h2>

          {endpoints.map((endpoint, index) => (
            <motion.div
              key={endpoint.path}
              className="glass-card rounded-xl p-6"
              variants={fadeInUp}
            >
              {/* Method + Path */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    endpoint.method === 'GET'
                      ? 'bg-success/20 text-success'
                      : 'bg-accentB/20 text-accentB'
                  }`}
                >
                  {endpoint.method}
                </span>
                <code className="text-sm font-mono text-text">{endpoint.path}</code>
              </div>

              {/* Description */}
              <p className="text-text2 mb-4">{endpoint.description}</p>

              {/* Parameters */}
              {endpoint.params.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-text mb-3">Parameters</h4>
                  <div className="space-y-2">
                    {endpoint.params.map((param) => (
                      <div key={param.name} className="flex items-start gap-3 text-sm">
                        <code className="px-2 py-0.5 bg-surface border border-border rounded text-accentA">
                          {param.name}
                        </code>
                        <div className="flex-1">
                          <span className="text-dim">({param.type})</span>
                          {param.required && (
                            <span className="ml-2 text-xs text-danger">required</span>
                          )}
                          <p className="text-text2 mt-1">{param.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Example */}
              <div>
                <h4 className="text-sm font-semibold text-text mb-2">Example Request</h4>
                <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-300">{endpoint.example}</code>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Code Examples */}
        <motion.section
          className="glass-card rounded-2xl p-8 mt-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-text mb-6">Code Examples</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-text mb-3">JavaScript / TypeScript</h3>
              <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg overflow-x-auto">
                <pre className="text-sm text-gray-300">
                  <code>{`// Fetch recent signals
const response = await fetch('${API_BASE}/v1/signals?mode=paper&limit=10');
const signals = await response.json();

// Connect to real-time stream
const eventSource = new EventSource('${API_BASE}/v1/signals/stream?mode=paper');
eventSource.addEventListener('signal', (event) => {
  const signal = JSON.parse(event.data);
  console.log('New signal:', signal);
});`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-text mb-3">Python</h3>
              <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg overflow-x-auto">
                <pre className="text-sm text-gray-300">
                  <code>{`import requests

# Fetch recent signals
response = requests.get('${API_BASE}/v1/signals', params={'mode': 'paper', 'limit': 10})
signals = response.json()

# Get PnL data
pnl_response = requests.get('${API_BASE}/v1/pnl', params={'n': 1000})
pnl_data = pnl_response.json()`}</code>
                </pre>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <div className="mt-12 p-6 bg-elev border border-border rounded-xl">
          <p className="text-sm text-dim">
            Need help or have questions? Join our{' '}
            <a href="https://discord.gg/your-server" className="text-accentA hover:underline">
              Discord community
            </a>{' '}
            or email{' '}
            <a href="mailto:support@aipredictedsignals.cloud" className="text-accentA hover:underline">
              support@aipredictedsignals.cloud
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
