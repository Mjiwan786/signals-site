'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Activity, Zap, TrendingUp, Server, Info, Shield, Loader2 } from 'lucide-react';
import SystemHealth from './components/SystemHealth';
import KrakenMetrics from './components/KrakenMetrics';
import SignalsFeed from './components/SignalsFeed';
import PnLChart from './components/PnLChart';
import HowItWorks from './components/HowItWorks';
import SafetyRiskNote from './components/SafetyRiskNote';
import CircuitBreakerBanner from './components/CircuitBreakerBanner';

/**
 * Live Dashboard - Investor-Ready System Live Page
 *
 * Sections:
 * 1. System Health (polling /health every 10s)
 * 2. Kraken Latency & Circuit Breakers (from /metrics)
 * 3. Signals Feed (SSE /v1/signals/stream)
 * 4. PnL & Equity Curve (SSE /v1/pnl/stream)
 */

function LivePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read pair from query param or default to BTC-USD
  const initialPair = searchParams.get('pair') || 'BTC-USD';
  const [selectedPair, setSelectedPair] = useState<string>(initialPair);
  const [circuitBreakerTrips, setCircuitBreakerTrips] = useState<number>(0);

  const pairs = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD'];

  // Update query param when pair changes
  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    if (selectedPair !== 'BTC-USD') {
      currentParams.set('pair', selectedPair);
    } else {
      currentParams.delete('pair');
    }

    const newSearch = currentParams.toString();
    const newUrl = newSearch ? `?${newSearch}` : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  }, [selectedPair, router]);

  const handlePairChange = (pair: string) => {
    setSelectedPair(pair);
  };

  const handleCircuitBreakerChange = (trips: number) => {
    setCircuitBreakerTrips(trips);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Circuit Breaker Banner */}
      <CircuitBreakerBanner circuitBreakerTrips={circuitBreakerTrips} />

      {/* Header */}
      <header className="border-b border-accent/30 bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Activity className="w-8 h-8 text-accentA" aria-hidden="true" />
                <div className="absolute inset-0 blur-md bg-accentA opacity-50" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold bg-gradient-brand bg-clip-text text-transparent">
                  Live Dashboard
                </h1>
                <p className="text-xs text-dim">Real-time system monitoring</p>
              </div>
            </div>

            {/* Pair Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="pair-select" className="text-sm text-dim">
                Trading Pair:
              </label>
              <select
                id="pair-select"
                value={selectedPair}
                onChange={(e) => handlePairChange(e.target.value)}
                className="px-3 py-2 bg-elev border border-accent/30 rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {pairs.map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: System Health */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-5 h-5 text-accentA" />
              <h2 className="text-lg font-semibold text-text">System Health</h2>
            </div>
            <SystemHealth />
          </div>

          {/* Section 2: Kraken Latency & Circuit Breakers */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accentB" />
              <h2 className="text-lg font-semibold text-text">Kraken Metrics</h2>
            </div>
            <KrakenMetrics onCircuitBreakerChange={handleCircuitBreakerChange} />
          </div>

          {/* Section 3: Signals Feed */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-success" />
              <h2 className="text-lg font-semibold text-text">Live Signals</h2>
            </div>
            <SignalsFeed pair={selectedPair} />
          </div>

          {/* Section 4: PnL & Equity Curve */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-success" />
              <h2 className="text-lg font-semibold text-text">P&L Performance</h2>
            </div>
            <PnLChart />
          </div>

          {/* Section 5: How It Works */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-accentB" />
              <h2 className="text-lg font-semibold text-text">System Architecture</h2>
            </div>
            <HowItWorks />
          </div>

          {/* Section 6: Safety & Risk Disclosure */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-warning" />
              <h2 className="text-lg font-semibold text-text">Safety & Risk</h2>
            </div>
            <SafetyRiskNote mode="paper" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LivePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-dim">Loading live dashboard...</p>
          </div>
        </div>
      }
    >
      <LivePageContent />
    </Suspense>
  );
}
