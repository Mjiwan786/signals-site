'use client';

import { useState } from 'react';
import { ArrowRight, Database, Radio, BarChart3, Cpu, Shield, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * System Architecture Page
 *
 * Animated diagram showing data flow: Kraken WS → Engine → Redis → API → SSE → Dashboard
 * Educational and transparent about the technical stack
 */

export default function SystemArchitecturePage() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="border-b border-accent/30 bg-surface/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold bg-gradient-brand bg-clip-text text-transparent">
                System Architecture
              </h1>
              <p className="text-sm text-dim mt-1">Real-time data pipeline from exchange to dashboard</p>
            </div>
            <Link
              href="/live"
              className="px-4 py-2 bg-accent text-surface rounded-lg hover:bg-accent/80 transition-colors text-sm font-medium"
            >
              View Live Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="mb-12 max-w-3xl">
          <h2 className="text-2xl font-semibold text-text mb-4">How It Works</h2>
          <p className="text-dim leading-relaxed mb-4">
            Our system processes cryptocurrency market data in real-time through a carefully
            architected pipeline. Each component is optimized for low latency and high reliability.
          </p>
          <p className="text-dim leading-relaxed">
            Below is an interactive diagram showing the complete data flow from Kraken exchange
            to your browser.
          </p>
        </div>

        {/* Animated Data Flow Diagram */}
        <div className="mb-16">
          <DataFlowDiagram hoveredStep={hoveredStep} setHoveredStep={setHoveredStep} />
        </div>

        {/* Component Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <ComponentCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Kraken Exchange"
            description="WebSocket connection provides sub-second market data"
            details={[
              'OHLC candlestick data',
              'Trade tick data',
              'Order book snapshots',
              'Spread metrics',
            ]}
            color="text-accentA"
          />

          <ComponentCard
            icon={<Cpu className="w-8 h-8" />}
            title="AI Engine"
            description="Multi-agent analysis powered by Python"
            details={[
              'Technical indicator analysis',
              'Pattern recognition',
              'Multi-timeframe alignment',
              'Confidence scoring',
            ]}
            color="text-accentB"
          />

          <ComponentCard
            icon={<Database className="w-8 h-8" />}
            title="Redis Cloud"
            description="TLS-encrypted message queue"
            details={[
              'Persistent stream storage',
              'Sub-millisecond latency',
              '<2ms average ping',
              'Circuit breaker state',
            ]}
            color="text-success"
          />

          <ComponentCard
            icon={<Radio className="w-8 h-8" />}
            title="FastAPI Gateway"
            description="RESTful API with SSE streaming"
            details={[
              'Server-Sent Events (SSE)',
              'Prometheus metrics export',
              'Health check endpoints',
              'Fly.io deployment',
            ]}
            color="text-warning"
          />

          <ComponentCard
            icon={<Activity className="w-8 h-8" />}
            title="Next.js Frontend"
            description="Real-time dashboard on Vercel"
            details={[
              'Live SSE connections',
              'Animated charts',
              'Exponential backoff retry',
              'Offline-first design',
            ]}
            color="text-accentA"
          />

          <ComponentCard
            icon={<Shield className="w-8 h-8" />}
            title="Reliability"
            description="Built-in fault tolerance"
            details={[
              'Circuit breaker protection',
              'Auto-reconnect logic',
              'Graceful degradation',
              'Real-time monitoring',
            ]}
            color="text-success"
          />
        </div>

        {/* Technical Specifications */}
        <div className="bg-elev border border-accent/30 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-text mb-6">Technical Specifications</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Latency Metrics</h3>
              <div className="space-y-3">
                <SpecRow label="Kraken WebSocket" value="<50ms p95" status="success" />
                <SpecRow label="Redis Ping" value="<2ms avg" status="success" />
                <SpecRow label="API Response Time" value="<100ms p95" status="success" />
                <SpecRow label="SSE Event Delivery" value="Real-time" status="success" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text mb-4">Reliability Features</h3>
              <div className="space-y-3">
                <SpecRow label="Circuit Breaker" value="Enabled" status="success" />
                <SpecRow label="Auto-Reconnect" value="Exponential backoff" status="success" />
                <SpecRow label="Data Persistence" value="Redis streams" status="success" />
                <SpecRow label="Health Monitoring" value="24/7 active" status="success" />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-accent/20">
            <h3 className="text-lg font-semibold text-text mb-4">Technology Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <TechStackItem name="Python 3.11" category="Engine" />
              <TechStackItem name="FastAPI" category="API" />
              <TechStackItem name="Next.js 14" category="Frontend" />
              <TechStackItem name="Redis Cloud" category="Queue" />
              <TechStackItem name="Kraken API" category="Exchange" />
              <TechStackItem name="Fly.io" category="Hosting" />
              <TechStackItem name="Vercel" category="CDN" />
              <TechStackItem name="Prometheus" category="Metrics" />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/live"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-brand text-surface rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            <Activity className="w-5 h-5" />
            View Live Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

interface DataFlowStep {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}

const steps: DataFlowStep[] = [
  {
    icon: <BarChart3 className="w-8 h-8" />,
    label: 'Kraken Exchange',
    description: 'WebSocket market data',
    color: 'text-accentA',
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    label: 'AI Engine',
    description: 'Signal generation',
    color: 'text-accentB',
  },
  {
    icon: <Database className="w-8 h-8" />,
    label: 'Redis Cloud',
    description: 'TLS-encrypted queue',
    color: 'text-success',
  },
  {
    icon: <Radio className="w-8 h-8" />,
    label: 'FastAPI',
    description: 'SSE streaming',
    color: 'text-warning',
  },
  {
    icon: <Activity className="w-8 h-8" />,
    label: 'Dashboard',
    description: 'Real-time display',
    color: 'text-accentA',
  },
];

interface DataFlowDiagramProps {
  hoveredStep: number | null;
  setHoveredStep: (step: number | null) => void;
}

function DataFlowDiagram({ hoveredStep, setHoveredStep }: DataFlowDiagramProps) {
  return (
    <div className="relative bg-elev border border-accent/30 rounded-xl p-8 overflow-hidden">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Flow Steps */}
      <div className="relative flex items-center justify-between gap-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4 flex-1">
            {/* Step Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              onHoverStart={() => setHoveredStep(index)}
              onHoverEnd={() => setHoveredStep(null)}
              className={`relative flex-1 group cursor-pointer`}
            >
              <div
                className={`p-6 rounded-xl border transition-all ${
                  hoveredStep === index
                    ? 'border-accent bg-surface/50 shadow-lg scale-105'
                    : 'border-accent/30 bg-surface/20'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`mb-3 ${step.color}`}>{step.icon}</div>
                  <h3 className="text-sm font-semibold text-text mb-1">{step.label}</h3>
                  <p className="text-xs text-dim">{step.description}</p>
                </div>

                {/* Pulsing indicator */}
                {hoveredStep === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-accent animate-pulse"
                  />
                )}
              </div>
            </motion.div>

            {/* Animated Arrow */}
            {index < steps.length - 1 && (
              <div className="relative flex-shrink-0">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    delay: index * 0.1 + 0.15,
                    duration: 0.3,
                    repeat: Infinity,
                    repeatType: 'loop',
                    repeatDelay: 2,
                  }}
                >
                  <ArrowRight className="w-6 h-6 text-accent" />
                </motion.div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Data Flow Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/2 left-0 w-32 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"
        />
      </div>
    </div>
  );
}

interface ComponentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  color: string;
}

function ComponentCard({ icon, title, description, details, color }: ComponentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-elev border border-accent/30 rounded-xl p-6 hover:border-accent/50 transition-all"
    >
      <div className={`mb-4 ${color}`}>{icon}</div>
      <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
      <p className="text-sm text-dim mb-4">{description}</p>
      <ul className="space-y-2">
        {details.map((detail, index) => (
          <li key={index} className="flex items-start gap-2 text-xs text-dim">
            <div className="w-1 h-1 rounded-full bg-accent mt-1.5 flex-shrink-0" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

interface SpecRowProps {
  label: string;
  value: string;
  status: 'success' | 'warning' | 'info';
}

function SpecRow({ label, value, status }: SpecRowProps) {
  const colors = {
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-accentB',
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-accent/10 last:border-0">
      <span className="text-sm text-dim">{label}</span>
      <span className={`text-sm font-semibold font-mono ${colors[status]}`}>{value}</span>
    </div>
  );
}

interface TechStackItemProps {
  name: string;
  category: string;
}

function TechStackItem({ name, category }: TechStackItemProps) {
  return (
    <div className="p-3 bg-surface/30 rounded-lg border border-accent/20">
      <p className="font-semibold text-text text-sm">{name}</p>
      <p className="text-xs text-dim mt-0.5">{category}</p>
    </div>
  );
}
