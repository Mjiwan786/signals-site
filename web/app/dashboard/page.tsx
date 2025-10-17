import dynamic from "next/dynamic";
import { DEFAULT_MODE } from "@/lib/env";

const PnLChart = dynamic(() => import("@/components/PnLChart"), { ssr: false });
const SignalsTable = dynamic(() => import("@/components/SignalsTable"), { ssr: false });
const SignalsTicker = dynamic(() => import("@/components/SignalsTicker"), { ssr: false });

export default function DashboardPage() {
  const mode = (DEFAULT_MODE as "paper" | "live") || "paper";

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-text mb-3">Live PnL & Signals</h1>
        <p className="text-lg text-text2">
          Monitor your AI trading performance with real-time equity curves and signal tracking
        </p>
      </header>

      {/* Main Dashboard Stack */}
      <div className="space-y-12">
        {/* PnL Chart Section */}
        <section>
          <PnLChart n={500} />
        </section>

        {/* Live Signal Ticker */}
        <section>
          <h2 className="text-2xl font-semibold text-text mb-4">Latest Signal</h2>
          <SignalsTicker mode={mode} />
        </section>

        {/* Signals Table */}
        <section>
          <h2 className="text-2xl font-semibold text-text mb-4">Recent Signals</h2>
          <SignalsTable />
        </section>
      </div>
    </div>
  );
}
