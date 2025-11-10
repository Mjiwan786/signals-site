'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Zap, DollarSign, FileText, CheckCircle, Shield, Server, Package } from 'lucide-react';

export default function AcquirePage() {
  const highlights = [
    {
      title: 'Proven Profitability',
      value: '+177.9% CAGR',
      description: 'Verified backtest results with real Kraken data',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Operational Simplicity',
      value: '3 Repos',
      description: 'Fully automated, minimal overhead',
      icon: Zap,
      color: 'cyan',
    },
    {
      title: 'Monthly Recurring Revenue',
      value: '$5K-$50K',
      description: 'Potential with 100-1000 subscribers',
      icon: DollarSign,
      color: 'purple',
    },
    {
      title: 'Tech Stack Value',
      value: 'Modern',
      description: 'Next.js, FastAPI, ML models',
      icon: Server,
      color: 'pink',
    },
  ];

  const moatPoints = [
    'Proprietary multi-agent AI architecture',
    'Real-time ML models with proven edge',
    '24/7 automated signal generation',
    'Sub-500ms latency infrastructure',
  ];

  const growthLevers = [
    {
      title: 'Add More Pairs',
      description: 'Currently 5 pairs, easily scalable to 20+',
      potential: 'High',
    },
    {
      title: 'Subscription Tiers',
      description: 'Premium analytics, custom alerts, API access',
      potential: 'Medium',
    },
    {
      title: 'White-Label Offering',
      description: 'License the stack to hedge funds or brokers',
      potential: 'High',
    },
    {
      title: 'Expand to Stocks/Forex',
      description: 'Adapt AI models to traditional markets',
      potential: 'Very High',
    },
  ];

  const handoffIncludes = [
    'Full source code (3 repos: Bot, API, Site)',
    'Complete documentation & runbooks',
    'Deployment configs (Fly.io, Vercel)',
    'Redis Cloud account transfer',
    'Kraken API credentials',
    '30 days post-sale support',
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Premium Gradient */}
      <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-purple-950/30 via-black to-yellow-900/20">
        <div className="absolute inset-0 bg-grid-dots opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-6">
              <DollarSign className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-300">Investment Opportunity</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Acquire This Business
            </h1>
            <p className="text-lg text-white/70 max-w-3xl mx-auto mb-8">
              A profitable, fully-automated AI trading signals SaaS with proven performance,
              minimal overhead, and significant growth potential.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#valuation"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg shadow-lg"
              >
                View Valuation Details
              </motion.a>
              <motion.a
                href="#handoff"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/5 border-2 border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Handoff Plan
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Highlights Grid */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((highlight, idx) => {
              const Icon = highlight.icon;
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-gray-900/50 to-black/40 border border-purple-600/20 text-center"
                >
                  <Icon className={`w-10 h-10 mx-auto mb-4 text-${highlight.color}-400`} />
                  <div className={`text-2xl font-bold text-${highlight.color}-400 mb-2`}>
                    {highlight.value}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{highlight.title}</h3>
                  <p className="text-xs text-white/60">{highlight.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Buy This Business */}
      <section id="valuation" className="py-16 px-6 bg-gradient-to-b from-black to-purple-950/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Why Buy This Business?</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Four pillars of sustainable competitive advantage
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Moat */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl bg-gradient-to-br from-purple-900/20 to-black/40 border border-purple-600/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Competitive Moat</h3>
              </div>
              <div className="space-y-3">
                {moatPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-white/80">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Operational Simplicity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl bg-gradient-to-br from-cyan-900/20 to-black/40 border border-cyan-600/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-8 h-8 text-cyan-400" />
                <h3 className="text-2xl font-bold text-white">Operational Simplicity</h3>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-white/80">
                  <strong className="text-white">3 Repositories</strong> - Clean codebase, well-documented
                </p>
                <p className="text-sm text-white/80">
                  <strong className="text-white">Auto-Deployed</strong> - Fly.io + Vercel with CI/CD
                </p>
                <p className="text-sm text-white/80">
                  <strong className="text-white">24/7 Automated</strong> - No manual intervention needed
                </p>
                <p className="text-sm text-white/80">
                  <strong className="text-white">Minimal Overhead</strong> - ~$50/month infrastructure
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Growth Levers */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Growth Opportunities</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Multiple clear paths to scale revenue and expand market reach
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {growthLevers.map((lever, idx) => (
              <motion.div
                key={lever.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-6 rounded-xl bg-gradient-to-br from-pink-900/20 to-black/40 border border-pink-600/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{lever.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded ${
                      lever.potential === 'Very High'
                        ? 'bg-green-500/20 text-green-400'
                        : lever.potential === 'High'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {lever.potential}
                  </span>
                </div>
                <p className="text-sm text-white/70">{lever.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Handoff Plan */}
      <section id="handoff" className="py-16 px-6 bg-gradient-to-b from-black to-purple-950/10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Seamless Handoff</h2>
            <p className="text-white/60">
              Everything you need for a smooth transition and immediate operation
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-xl bg-gradient-to-br from-gray-900/50 to-black/40 border border-purple-600/20"
          >
            <div className="space-y-4">
              {handoffIncludes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <p className="text-white/90">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-purple-600/20">
              <motion.a
                href="https://acquire.com/listing/your-listing-id"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-center font-semibold rounded-lg shadow-lg"
              >
                View Full Listing on Acquire.com
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
