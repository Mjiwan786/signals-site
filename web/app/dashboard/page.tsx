import dynamic from "next/dynamic";
import { DEFAULT_MODE } from "@/lib/env";

// Use dynamic imports for SSE components to avoid SSR issues
const SignalsFeedSSE = dynamic(() => import("@/components/SignalsFeedSSE"), { ssr: false });
const HealthDashboard = dynamic(() => import("@/components/HealthDashboard"), { ssr: false });
const PnLChart = dynamic(() => import("@/components/PnLChart"), { ssr: false });
const PerformanceMetricsSection = dynamic(() => import("@/components/PerformanceMetricsSection"), { ssr: false });

export default function DashboardPage() {
  const mode = (DEFAULT_MODE as "paper" | "live") || "paper";

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-text mb-3">
          Live Trading Dashboard
        </h1>
        <p className="text-lg text-text2">
          Real-time monitoring of AI trading signals, P&L, and system health
        </p>
      </header>

      {/* Main Dashboard Stack */}
      <div className="space-y-12">
        {/* Performance Metrics Section */}
        <section>
          <PerformanceMetricsSection />
        </section>

        {/* System Health Section */}
        <section>
          <HealthDashboard />
        </section>

        {/* PnL Chart Section */}
        <section>
          <PnLChart initialN={500} />
        </section>

        {/* Live Signals Feed */}
        <section>
          <SignalsFeedSSE mode={mode} maxSignals={50} />
        </section>
      </div>
    </div>
  );
}
