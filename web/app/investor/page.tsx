'use client';

import { motion } from 'framer-motion';
import SignalsPanel from '@/components/SignalsPanel';
import PnLWidget from '@/components/PnLWidget';

export default function InvestorPage() {
  // Temporarily enabled unconditionally for testing
  // To re-enable feature flag: check process.env.NEXT_PUBLIC_INVESTOR_MODE === 'true'
  const isAuthorized = true;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 text-center"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Access Restricted</h1>
          <p className="text-gray-400 mb-6">
            The investor dashboard is not currently enabled. Please contact support or check
            your environment configuration.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gradient-brand text-white font-semibold rounded-lg hover:shadow-glow transition-all"
          >
            Return Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-900/50 to-bg border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Investor Dashboard
              <span className="block text-2xl sm:text-3xl mt-2 bg-gradient-brand bg-clip-text text-transparent">
                Real-Time Performance Monitoring
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Track live trading signals and P&L performance with real-time SSE streaming.
              All data updates automatically with sub-second latency.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Real-Time Signals</h3>
              <p className="text-2xl font-bold text-white">Live SSE</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">P&L Tracking</h3>
              <p className="text-2xl font-bold text-white">24h Chart</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Latency</h3>
              <p className="text-2xl font-bold text-white">&lt;500ms</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* P&L Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <PnLWidget />
          </motion.div>

          {/* Signals Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SignalsPanel />
          </motion.div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">About This Dashboard</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  This dashboard connects to our live trading API using Server-Sent Events (SSE)
                  for real-time updates. The P&L chart displays the last 24 hours of equity
                  performance, while the signals panel shows up to 250 recent trading signals.
                  Connection status is indicated by the color of the status indicators.
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs">
                  <span className="text-gray-500">
                    API: <span className="text-accent font-mono">{process.env.NEXT_PUBLIC_API_BASE}</span>
                  </span>
                  <span className="text-gray-500">
                    Mode: <span className="text-green-400 font-semibold">Investor</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
