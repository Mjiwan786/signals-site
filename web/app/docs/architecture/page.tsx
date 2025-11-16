/**
 * Architecture Documentation Page
 * PRD-003: System architecture and data flow documentation
 */

'use client';

import { motion } from 'framer-motion';
import { GitBranch, Database, Cloud, Smartphone, Shield, Zap } from 'lucide-react';
import { fadeInUp } from '@/lib/motion-variants';

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-sm opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accentB/10 border border-accentB/30 rounded-full mb-6">
            <GitBranch className="w-4 h-4 text-accentB" />
            <span className="text-sm font-medium text-accentB">System Design</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            System Architecture
          </h1>
          <p className="text-lg text-text2 max-w-3xl mx-auto">
            A modern, cloud-native 3-tier architecture designed for real-time signal delivery,
            scalability, and reliability.
          </p>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.section
          className="glass-card rounded-2xl p-8 mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-text mb-6">High-Level Overview</h2>

          <div className="relative">
            {/* Flow Diagram */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Bot Layer */}
              <div className="flex-1 glass-card-hover p-6 rounded-xl border-2 border-accentA/30 bg-accentA/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-accentA/20 rounded-lg">
                    <Zap className="w-6 h-6 text-accentA" />
                  </div>
                  <h3 className="text-lg font-bold text-text">Crypto AI Bot</h3>
                </div>
                <p className="text-sm text-text2 mb-3">
                  Python-based trading bot running locally or on cloud VM
                </p>
                <ul className="text-xs text-dim space-y-1">
                  <li>• Bar Reaction 5M strategy</li>
                  <li>• Multi-agent AI system</li>
                  <li>• Kraken exchange integration</li>
                  <li>• Risk management engine</li>
                </ul>
              </div>

              {/* Arrow */}
              <div className="hidden lg:block text-accentA text-2xl">→</div>

              {/* Redis Layer */}
              <div className="flex-1 glass-card-hover p-6 rounded-xl border-2 border-accentB/30 bg-accentB/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-accentB/20 rounded-lg">
                    <Database className="w-6 h-6 text-accentB" />
                  </div>
                  <h3 className="text-lg font-bold text-text">Redis Cloud</h3>
                </div>
                <p className="text-sm text-text2 mb-3">
                  Message broker and real-time data store
                </p>
                <ul className="text-xs text-dim space-y-1">
                  <li>• TLS-encrypted streams</li>
                  <li>• Pub/sub messaging</li>
                  <li>• Sub-millisecond latency</li>
                  <li>• 99.9% uptime SLA</li>
                </ul>
              </div>

              {/* Arrow */}
              <div className="hidden lg:block text-accentA text-2xl">→</div>

              {/* API Layer */}
              <div className="flex-1 glass-card-hover p-6 rounded-xl border-2 border-success/30 bg-success/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-success/20 rounded-lg">
                    <Cloud className="w-6 h-6 text-success" />
                  </div>
                  <h3 className="text-lg font-bold text-text">Signals API</h3>
                </div>
                <p className="text-sm text-text2 mb-3">
                  FastAPI backend hosted on Fly.io
                </p>
                <ul className="text-xs text-dim space-y-1">
                  <li>• RESTful endpoints</li>
                  <li>• Server-Sent Events (SSE)</li>
                  <li>• Prometheus metrics</li>
                  <li>• Global edge deployment</li>
                </ul>
              </div>

              {/* Arrow */}
              <div className="hidden lg:block text-accentA text-2xl">→</div>

              {/* Frontend Layer */}
              <div className="flex-1 glass-card-hover p-6 rounded-xl border-2 border-highlight/30 bg-highlight/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-highlight/20 rounded-lg">
                    <Smartphone className="w-6 h-6 text-highlight" />
                  </div>
                  <h3 className="text-lg font-bold text-text">Web Frontend</h3>
                </div>
                <p className="text-sm text-text2 mb-3">
                  Next.js 14 app deployed on Vercel
                </p>
                <ul className="text-xs text-dim space-y-1">
                  <li>• React 18 + TypeScript</li>
                  <li>• Recharts visualization</li>
                  <li>• SWR data fetching</li>
                  <li>• Edge runtime</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Data Flow */}
        <motion.section
          className="glass-card rounded-2xl p-8 mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-text mb-6">Data Flow</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-accentA/20 rounded-full flex items-center justify-center text-accentA font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-text mb-2">Signal Generation</h3>
                <p className="text-text2 text-sm">
                  The crypto AI bot monitors Kraken exchange price feeds for BTC, ETH, SOL, MATIC, and LINK.
                  When the Bar Reaction 5M strategy detects a high-confidence trade setup, it generates a signal
                  with entry price, stop loss, and take profit levels.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-accentB/20 rounded-full flex items-center justify-center text-accentB font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-text mb-2">Stream Publishing</h3>
                <p className="text-text2 text-sm">
                  The bot publishes signals to Redis Cloud using TLS-encrypted streams (signals:paper or signals:live).
                  PnL updates are published to the pnl:equity stream. Redis acts as the real-time message broker
                  between the bot and API.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-success/20 rounded-full flex items-center justify-center text-success font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-text mb-2">API Consumption</h3>
                <p className="text-text2 text-sm">
                  The signals-api FastAPI backend consumes signals from Redis streams and serves them via
                  RESTful endpoints (/v1/signals) and Server-Sent Events (/v1/signals/stream). It also
                  aggregates PnL data and calculates performance metrics.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-highlight/20 rounded-full flex items-center justify-center text-highlight font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-text mb-2">Frontend Rendering</h3>
                <p className="text-text2 text-sm">
                  The Next.js frontend fetches signals and PnL data from the API using SWR for caching and
                  EventSource for real-time streams. Users see live signal cards, equity charts, and performance
                  metrics updated in real-time.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Technology Stack */}
        <motion.section
          className="grid md:grid-cols-2 gap-6 mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-accentA" />
              Backend Stack
            </h3>
            <ul className="space-y-2 text-text2 text-sm">
              <li>• <strong>Bot:</strong> Python 3.11, pandas, ccxt, asyncio</li>
              <li>• <strong>API:</strong> FastAPI, Uvicorn, Pydantic v2</li>
              <li>• <strong>Database:</strong> Redis Cloud (TLS)</li>
              <li>• <strong>Monitoring:</strong> Prometheus, Loguru</li>
              <li>• <strong>Deployment:</strong> Fly.io (global edge)</li>
            </ul>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-bold text-text mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-highlight" />
              Frontend Stack
            </h3>
            <ul className="space-y-2 text-text2 text-sm">
              <li>• <strong>Framework:</strong> Next.js 14, React 18</li>
              <li>• <strong>Language:</strong> TypeScript</li>
              <li>• <strong>Styling:</strong> Tailwind CSS, Framer Motion</li>
              <li>• <strong>Data Fetching:</strong> SWR, EventSource</li>
              <li>• <strong>Charts:</strong> Recharts</li>
              <li>• <strong>Deployment:</strong> Vercel (serverless)</li>
            </ul>
          </div>
        </motion.section>

        {/* Security & Reliability */}
        <motion.section
          className="glass-card rounded-2xl p-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-success" />
            Security & Reliability
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-text mb-3">Security Measures</h3>
              <ul className="text-sm text-text2 space-y-2">
                <li>• End-to-end TLS encryption (Redis, API, Frontend)</li>
                <li>• Environment variable secrets management</li>
                <li>• CORS protection on API endpoints</li>
                <li>• Rate limiting (60 req/min per IP)</li>
                <li>• No sensitive keys in frontend code</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-text mb-3">Reliability Features</h3>
              <ul className="text-sm text-text2 space-y-2">
                <li>• Exponential backoff retry logic</li>
                <li>• Dead letter queue for failed messages</li>
                <li>• Health check endpoints at all layers</li>
                <li>• Prometheus metrics collection</li>
                <li>• 99.9% uptime SLA (monitored)</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-elev border border-border rounded-xl">
          <p className="text-sm text-dim">
            For technical implementation details, see our{' '}
            <a href="https://github.com/your-org/signals-site" className="text-accentA hover:underline">
              GitHub repository
            </a>{' '}
            or read the{' '}
            <a href="/docs/api-reference" className="text-accentA hover:underline">
              API Reference
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
