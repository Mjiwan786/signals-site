'use client';

import { motion } from 'framer-motion';
import { Shield, Server, Lock, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TechSafetyPage() {
  const sections = [
    {
      title: 'Architecture Overview',
      icon: Server,
      description: '3-layer microservices architecture',
      details: [
        'Crypto-AI-Bot: Multi-agent trading engine with ML models',
        'Signals-API: FastAPI gateway with Redis Streams',
        'Signals-Site: Next.js 14 SaaS portal with real-time SSE',
      ],
    },
    {
      title: 'Risk Controls & Safeguards',
      icon: Shield,
      description: 'Multi-layered protection mechanisms',
      details: [
        'No customer funds at risk - signals only, not execution',
        'Rate limiting: 60 req/min per IP',
        'Circuit breakers for API failures',
        'Kill switches for emergency shutdown',
      ],
    },
    {
      title: 'Security',
      icon: Lock,
      description: 'Enterprise-grade security protocols',
      details: [
        'Redis Cloud with TLS encryption',
        'Environment variable isolation',
        'API authentication with bearer tokens',
        'CORS policies and input validation',
      ],
    },
    {
      title: 'Monitoring & Rollback',
      icon: Activity,
      description: '24/7 operational reliability',
      details: [
        'Prometheus metrics with Grafana dashboards',
        'Real-time health checks (API, Redis, Kraken)',
        'Automated rollback on deployment failures',
        'Discord alerts for critical issues',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-b from-purple-950/20 via-black to-black">
        <div className="absolute inset-0 bg-grid-dots opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">Enterprise Security</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tech & Safety
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Institutional-grade architecture with robust security and risk controls for 24/7 operation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Architecture Diagram Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-black to-purple-950/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">System Architecture</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Three-tier architecture for scalability, reliability, and maintainability
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                layer: 'Layer 1',
                name: 'Crypto-AI-Bot',
                tech: 'Python • Pandas • scikit-learn',
                description: 'Multi-agent AI engine generating trading signals',
                color: 'purple',
              },
              {
                layer: 'Layer 2',
                name: 'Signals-API',
                tech: 'FastAPI • Redis Streams • SSE',
                description: 'Real-time API gateway with sub-500ms latency',
                color: 'pink',
              },
              {
                layer: 'Layer 3',
                name: 'Signals-Site',
                tech: 'Next.js 14 • React • Tailwind',
                description: 'Modern SaaS portal with live dashboards',
                color: 'cyan',
              },
            ].map((layer, idx) => (
              <motion.div
                key={layer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative p-6 rounded-xl bg-gradient-to-br from-gray-900/50 to-black/40 border border-purple-600/20"
              >
                <div className={`inline-block px-3 py-1 mb-4 text-xs font-bold rounded-full bg-${layer.color}-500/20 text-${layer.color}-400`}>
                  {layer.layer}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{layer.name}</h3>
                <p className="text-sm text-purple-300 mb-3 font-mono">{layer.tech}</p>
                <p className="text-sm text-white/60">{layer.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Connection Flow */}
          <div className="text-center text-white/40 text-sm mb-12">
            <div className="inline-flex items-center gap-4">
              <span>Bot</span>
              <span>→</span>
              <span>API</span>
              <span>→</span>
              <span>Site</span>
              <span>→</span>
              <span>Users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Risk Sections */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="p-8 rounded-xl bg-gradient-to-br from-purple-900/20 to-black/40 border border-purple-600/20"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-purple-500/10">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{section.title}</h3>
                      <p className="text-sm text-white/60">{section.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {section.details.map((detail, detailIdx) => (
                      <div key={detailIdx} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/80">{detail}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* View Runbook CTA */}
      <section className="py-16 px-6 bg-gradient-to-b from-black to-purple-950/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Detailed Operations Documentation
            </h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto">
              Access comprehensive runbooks, deployment guides, and operational procedures for seamless handoff.
            </p>
            <motion.a
              href="https://github.com/your-repo/runbook"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg shadow-lg"
            >
              <Server className="w-5 h-5" />
              View Runbook
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
