import Hero from "@/components/Hero";
import KpiStrip from "@/components/KpiStrip";
import Link from "next/link";
import { RocketIcon, LightningBoltIcon, BarChartIcon } from "@radix-ui/react-icons";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* KPI Strip */}
      <KpiStrip />

      {/* How It Works Section */}
      <section className="w-full bg-elev py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              How It Works
            </h2>
            <p className="text-lg text-text2 max-w-2xl mx-auto">
              Get started with AI-powered crypto signals in three simple steps
            </p>
          </div>

          {/* 3 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="p-8 bg-surface border border-border rounded-xl hover:border-accent/50 transition-all duration-300 shadow-soft hover:shadow-glow h-full">
                <div className="mb-6">
                  <div className="inline-flex p-4 bg-accent/10 rounded-lg text-accent">
                    <RocketIcon className="w-8 h-8" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 text-5xl font-bold text-border">01</div>
                <h3 className="text-xl font-bold text-text mb-3">Join Discord</h3>
                <p className="text-text2 leading-relaxed">
                  Subscribe to our Discord server and choose your tier. Get instant access to our AI signals community.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="p-8 bg-surface border border-border rounded-xl hover:border-accent/50 transition-all duration-300 shadow-soft hover:shadow-glow h-full">
                <div className="mb-6">
                  <div className="inline-flex p-4 bg-success/10 rounded-lg text-success">
                    <LightningBoltIcon className="w-8 h-8" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 text-5xl font-bold text-border">02</div>
                <h3 className="text-xl font-bold text-text mb-3">Receive Signals</h3>
                <p className="text-text2 leading-relaxed">
                  Get real-time AI trading signals delivered in &lt;500ms via Discord and our web dashboard.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="p-8 bg-surface border border-border rounded-xl hover:border-accent/50 transition-all duration-300 shadow-soft hover:shadow-glow h-full">
                <div className="mb-6">
                  <div className="inline-flex p-4 bg-accentB/10 rounded-lg text-accentB">
                    <BarChartIcon className="w-8 h-8" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 text-5xl font-bold text-border">03</div>
                <h3 className="text-xl font-bold text-text mb-3">Track Performance</h3>
                <p className="text-text2 leading-relaxed">
                  Monitor transparent P&L, view live equity curves, and make informed trading decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-bg py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-12 bg-gradient-to-br from-surface via-elev to-surface border border-border rounded-2xl shadow-glow">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Ready to Start Trading Smarter?
            </h2>
            <p className="text-lg text-text2 mb-8 max-w-2xl mx-auto">
              Join thousands of traders using AI-powered signals to enhance their crypto trading strategy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://discord.gg/your-server"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-brand rounded-lg shadow-soft hover:shadow-glow transition-all duration-300 min-w-[220px]"
              >
                <span className="relative z-10">Get Started Now</span>
              </a>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-text bg-surface border-2 border-border rounded-lg hover:border-accent hover:bg-elev transition-all duration-300 min-w-[220px]"
              >
                View Dashboard
              </Link>
            </div>

            <p className="text-sm text-dim mt-6">
              No credit card required • Cancel anytime • 99.8% uptime
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
