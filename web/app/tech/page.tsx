import { Metadata } from "next";
import Section from "@/components/Section";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import { Shield, Lock, Zap, Database, TrendingUp, AlertTriangle, Clock, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Technology & Architecture",
  description: "Explore the technical architecture of our AI-powered crypto trading signals platform. Redis Cloud streaming, FastAPI backend, real-time signal delivery, and transparent safety controls.",
  openGraph: {
    title: "Technology & Architecture | AI Predicted Signals",
    description: "End-to-end system architecture: crypto-ai-bot → Redis Cloud → signals-api → web. Real-time streaming, safety controls, and transparent methodology.",
  },
};

interface SafetyControlItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const safetyControls: SafetyControlItem[] = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Position Sizing Limits",
    description: "Maximum 2% risk per trade with dynamic position sizing based on volatility and account equity.",
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: "Stop-Loss Enforcement",
    description: "Every signal includes mandatory stop-loss levels. Maximum drawdown threshold triggers automatic pause.",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "API Rate Limiting",
    description: "Redis-backed rate limiting prevents abuse and ensures fair access to signals across all subscribers.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Performance Monitoring",
    description: "Real-time tracking of win rate, Sharpe ratio, and maximum drawdown. Auto-disable on threshold breach.",
  },
];

interface TechSpecItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const techSpecs: TechSpecItem[] = [
  {
    label: "Signal Latency",
    value: "< 500ms",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    label: "Data Storage",
    value: "Redis Cloud (TLS)",
    icon: <Database className="w-5 h-5" />,
  },
  {
    label: "API Uptime",
    value: "99.8%",
    icon: <Server className="w-5 h-5" />,
  },
  {
    label: "Historical Data",
    value: "5+ years",
    icon: <Clock className="w-5 h-5" />,
  },
];

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How are signals generated?",
    answer: "Our AI engine uses an ensemble of LSTM, Transformer, and CNN models trained on 5+ years of historical market data. The models analyze order book depth, trade history, on-chain metrics, and technical indicators to generate signals with confidence scores, entry prices, stop-loss, and take-profit levels.",
  },
  {
    question: "What is the signals-api architecture?",
    answer: "The signals-api is a FastAPI backend that consumes live trading signals from Redis Cloud via secure TLS connection. It exposes REST endpoints (/v1/pnl, /v1/signals) and Server-Sent Events (/v1/signals/stream) for real-time signal delivery to this web frontend and Discord webhooks.",
  },
  {
    question: "How is data streamed in real-time?",
    answer: "Trading signals are published to Redis Cloud by the crypto-ai-bot. The signals-api subscribes to Redis channels and broadcasts signals via WebSocket and SSE connections. This ensures sub-500ms latency from signal generation to delivery on your screen.",
  },
  {
    question: "What safety controls are in place?",
    answer: "Position sizing is capped at 2% risk per trade. Every signal includes stop-loss levels. We monitor performance metrics in real-time and automatically pause signal generation if win rate drops below 55% or max drawdown exceeds 15%. Rate limiting prevents API abuse.",
  },
  {
    question: "How is P&L calculated and stored?",
    answer: "Daily P&L snapshots are calculated based on paper trading simulations or live execution results. Equity curve data is stored in Redis Cloud with TLS encryption and exposed via the /v1/pnl REST endpoint. Historical performance is fully transparent and auditable.",
  },
  {
    question: "What happens if the API goes down?",
    answer: "The frontend implements graceful degradation. If the signals-api is unreachable, the last known P&L snapshot is displayed with a notification banner. SSE connections use exponential backoff retry logic. All critical data is persisted in Redis Cloud for recovery.",
  },
  {
    question: "Is the infrastructure scalable?",
    answer: "Yes. The signals-api is stateless and can be horizontally scaled behind a load balancer. Redis Cloud handles millions of operations per second. The Next.js frontend is deployed on Vercel Edge Network for global low-latency access.",
  },
  {
    question: "What are the SLA/SLO targets?",
    answer: "We target 99.8% API uptime, less than 500ms signal delivery latency, and less than 2s page load time (LCP). Redis Cloud provides built-in replication and failover. Monitoring alerts trigger if uptime drops below 99.5% or latency exceeds 1s.",
  },
];

export default function TechPage() {
  return (
    <div>
      {/* Hero Section */}
      <Section bg="elev" size="xl" className="pt-24 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text mb-6">
            Technology & Architecture
          </h1>
          <p className="text-lg md:text-xl text-dim leading-relaxed">
            End-to-end system powering real-time AI trading signals with
            transparent performance tracking and enterprise-grade reliability.
          </p>
        </div>
      </Section>

      {/* Architecture Diagram */}
      <ArchitectureDiagram />

      {/* Tech Specs Grid */}
      <Section bg="default" size="xl" className="py-16">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-text text-center mb-12">
          Technical Specifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techSpecs.map((spec, index) => (
            <div
              key={index}
              className="glass-card rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="inline-flex p-3 bg-accentA/10 border-2 border-accentA/30 rounded-lg mb-4 text-accentA">
                {spec.icon}
              </div>
              <div className="text-sm text-dim mb-1">{spec.label}</div>
              <div className="text-2xl font-bold text-text">{spec.value}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* System Flow Explanation */}
      <Section bg="surface" size="xl" className="py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text text-center mb-8">
            How Signals Flow Through The System
          </h2>

          <div className="space-y-6 text-dim leading-relaxed">
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-xl font-bold text-accentA mb-3 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accentA/10 border border-accentA/30 text-sm font-bold">1</span>
                Crypto AI Bot (Signal Generation)
              </h3>
              <p>
                The crypto-ai-bot consumes real-time market data from 15+ exchanges via WebSocket connections.
                Machine learning models analyze price action, order book depth, and on-chain metrics to
                generate trading signals with entry, stop-loss, and take-profit levels. Signals are published
                to Redis Cloud channels with &lt;50ms latency.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="text-xl font-bold text-accentB mb-3 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accentB/10 border border-accentB/30 text-sm font-bold">2</span>
                Redis Cloud (Message Broker)
              </h3>
              <p>
                Redis Cloud acts as the central message broker with TLS encryption. Connection string:{" "}
                <code className="text-xs bg-bg px-2 py-1 rounded border border-accent/20">
                  redis://default:***@redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com:19818
                </code>
                <br />
                Signals are stored in sorted sets with TTL for historical queries. Pub/Sub channels
                enable real-time broadcasting to multiple subscribers. Redis handles millions of operations
                per second with built-in replication and failover.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="text-xl font-bold text-highlight mb-3 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-highlight/10 border border-highlight/30 text-sm font-bold">3</span>
                signals-api (FastAPI Backend)
              </h3>
              <p>
                The FastAPI backend subscribes to Redis channels and exposes REST and SSE endpoints:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
                <li><code className="text-xs bg-bg px-2 py-1 rounded">GET /v1/pnl?n=500</code> - Historical equity curve</li>
                <li><code className="text-xs bg-bg px-2 py-1 rounded">GET /v1/signals?mode=paper&limit=200</code> - Recent signals</li>
                <li><code className="text-xs bg-bg px-2 py-1 rounded">GET /v1/signals/stream</code> - Server-Sent Events for live updates</li>
              </ul>
              <p className="mt-3">
                Signals are validated with Pydantic models and delivered to this frontend and Discord webhooks
                within 500ms of generation.
              </p>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="text-xl font-bold text-success mb-3 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-success/10 border border-success/30 text-sm font-bold">4</span>
                signals-site (Next.js Frontend)
              </h3>
              <p>
                This Next.js 14 app consumes the signals-api and renders live signals with sub-1s latency.
                SSE connections provide real-time updates to the signals table. P&L charts are rendered with
                Recharts and updated dynamically. Error boundaries ensure graceful degradation if the API is unreachable.
                Deployed on Vercel Edge Network for global CDN distribution.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Safety Controls */}
      <Section bg="elev" size="xl" className="py-16">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-text text-center mb-12">
          Safety Controls & Risk Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {safetyControls.map((control, index) => (
            <div key={index} className="glass-card rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-danger/10 border-2 border-danger/30 rounded-lg text-danger">
                  {control.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text mb-2">{control.title}</h3>
                  <p className="text-sm text-dim leading-relaxed">{control.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Methodology & Disclaimers */}
      <Section bg="default" size="xl" className="py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text text-center mb-8">
            Methodology & Disclaimers
          </h2>

          <div className="glass-card rounded-xl p-8 space-y-6 text-dim leading-relaxed">
            <div>
              <h3 className="text-xl font-bold text-accentA mb-3">AI Model Training</h3>
              <p>
                Our ensemble of machine learning models is trained on 5+ years of historical cryptocurrency
                market data including price action, volume, order book snapshots, and on-chain metrics.
                Models are re-trained monthly and validated against out-of-sample data to prevent overfitting.
                Confidence scores reflect the model's certainty based on pattern similarity and historical accuracy.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-accentA mb-3">Performance Tracking</h3>
              <p>
                All P&L data displayed on this site reflects paper trading results unless explicitly marked as "live".
                Paper trading simulates trades with realistic slippage (0.1-0.3%) and exchange fees (0.1%).
                Historical equity curves are calculated from actual signal execution timestamps and cannot be cherry-picked.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-danger mb-3">Risk Disclaimer</h3>
              <p className="text-sm border-l-4 border-danger pl-4 italic">
                Cryptocurrency trading carries substantial risk of loss. Past performance does not guarantee
                future results. Signals provided by this platform are for informational purposes only and do not
                constitute financial advice. You are solely responsible for your trading decisions and should never
                trade with money you cannot afford to lose. Always conduct your own research and consult with a
                licensed financial advisor before making investment decisions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-accentA mb-3">Data Accuracy</h3>
              <p>
                We strive for maximum transparency and accuracy in all displayed metrics. However, signal delivery
                latency may vary based on network conditions. Historical data is stored in Redis Cloud with redundancy,
                but we cannot guarantee 100% data availability in the event of catastrophic infrastructure failure.
                In rare cases, displayed metrics may be delayed by up to 5 minutes during API maintenance windows.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQs */}
      <Section bg="surface" size="xl" className="py-16">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-text text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="glass-card rounded-xl p-6 group hover:border-accentA/30 transition-colors duration-300"
            >
              <summary className="text-lg font-bold text-text cursor-pointer list-none flex items-center justify-between">
                <span>{faq.question}</span>
                <span className="text-accentA text-2xl group-open:rotate-45 transition-transform duration-300">
                  +
                </span>
              </summary>
              <p className="mt-4 text-dim leading-relaxed text-sm border-t border-accent/20 pt-4">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section bg="elev" size="xl" className="py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text mb-6">
            Ready to Experience AI-Powered Trading?
          </h2>
          <p className="text-lg text-dim mb-8">
            View live signals and performance metrics in real-time.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/signals"
              className="btn-primary px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-transform duration-300"
            >
              View Live Signals
            </a>
            <a
              href="/pricing"
              className="btn-ghost px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-transform duration-300"
            >
              View Pricing
            </a>
          </div>
        </div>
      </Section>
    </div>
  );
}
