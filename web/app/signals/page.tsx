import SignalsTable from "@/components/SignalsTable";
import SignalsTicker from "@/components/SignalsTicker";
import { DEFAULT_MODE } from "@/lib/env";

export default function SignalsPage() {
  const mode = (DEFAULT_MODE as "paper" | "live") || "paper";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text mb-3">Live Trading Signals</h1>
        <p className="text-text2">
          Real-time AI-powered trading signals with transparent performance tracking.
        </p>
      </div>

      {/* Live Signal Ticker (SSE) */}
      <div className="mb-8">
        <SignalsTicker mode={mode} />
      </div>

      {/* Signals Table */}
      <SignalsTable />

      {/* Info Section */}
      <div className="mt-12 p-6 bg-surface border border-border rounded-xl">
        <h3 className="text-lg font-semibold text-text mb-4">Understanding Signals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-text2 mb-2">Confidence Levels</h4>
            <ul className="space-y-2 text-dim">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-success rounded-full"></span>
                High (80%+) - Strong signal
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-accent rounded-full"></span>
                Medium (60-79%) - Moderate signal
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-danger rounded-full"></span>
                Low (&lt;60%) - Weak signal
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text2 mb-2">Signal Types</h4>
            <ul className="space-y-2 text-dim">
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-success/20 text-success text-xs rounded">BUY</span>
                Long position recommendation
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-danger/20 text-danger text-xs rounded">SELL</span>
                Short position recommendation
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-text2 mb-2">Risk Management</h4>
            <ul className="space-y-2 text-dim">
              <li>
                <strong className="text-text2">SL (Stop Loss):</strong> Exit level if price moves against you
              </li>
              <li>
                <strong className="text-text2">TP (Take Profit):</strong> Target price to close position
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}