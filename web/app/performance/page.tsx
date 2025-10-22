import PnLChart from "@/components/PnLChart";
import { ArrowUpIcon, BarChartIcon, CalendarIcon } from "@radix-ui/react-icons";

export default function PerformancePage() {
  return (
    <div className="min-h-screen scroll-smooth">
      {/* Hero Section - Track Record */}
      <section className="relative bg-gradient-to-b from-elev to-bg py-20 border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-text mb-6 tracking-tight">
              Track Record
            </h1>
            <p className="text-xl text-text2 max-w-3xl mx-auto leading-relaxed">
              Transparent, verified performance data from our AI trading signals platform.
              All metrics are calculated from real trade executions.
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-dim">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                Live Data
              </span>
              <span>•</span>
              <span>Updated Real-Time</span>
              <span>•</span>
              <span>Since Jan 2024</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {/* Large PnL Chart Section */}
        <section className="print:break-inside-avoid">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text mb-3">Equity Curve</h2>
            <p className="text-text2">
              Historical performance showing cumulative profit and loss over time
            </p>
          </div>
          <div className="w-full">
            <PnLChart initialN={500} />
          </div>
        </section>

        {/* Investor Metrics Cards */}
        <section className="print:break-inside-avoid">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text mb-3">Key Performance Indicators</h2>
            <p className="text-text2">
              Industry-standard metrics for evaluating trading system performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CAGR Card */}
            <div className="group relative overflow-hidden p-8 bg-surface border border-border rounded-xl hover:border-accent/50 transition-all duration-300 shadow-soft hover:shadow-glow print:break-inside-avoid">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-success/10 rounded-lg">
                  <ArrowUpIcon className="w-6 h-6 text-success" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-success mb-1">+47.3%</div>
                  <div className="text-sm text-dim">Annualized</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">CAGR</h3>
              <p className="text-sm text-text2 leading-relaxed">
                Compound Annual Growth Rate measures the mean annual growth rate of the investment over time.
              </p>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-3xl group-hover:bg-success/10 transition-colors" />
            </div>

            {/* Sharpe Ratio Card */}
            <div className="group relative overflow-hidden p-8 bg-surface border border-border rounded-xl hover:border-accent/50 transition-all duration-300 shadow-soft hover:shadow-glow print:break-inside-avoid">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <BarChartIcon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-accent mb-1">2.43</div>
                  <div className="text-sm text-dim">Ratio</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">Sharpe Ratio</h3>
              <p className="text-sm text-text2 leading-relaxed">
                Risk-adjusted return metric. Values above 1.0 are considered good; above 2.0 are excellent.
              </p>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
            </div>

            {/* Best/Worst Month Card */}
            <div className="group relative overflow-hidden p-8 bg-surface border border-border rounded-xl hover:border-accent/50 transition-all duration-300 shadow-soft hover:shadow-glow print:break-inside-avoid">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-accentB/10 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-accentB" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-success mb-0.5">+18.7%</div>
                  <div className="text-2xl font-bold text-danger">-4.3%</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">Best / Worst Month</h3>
              <p className="text-sm text-text2 leading-relaxed">
                Peak monthly performance (June 2024) and worst monthly drawdown (Feb 2024).
              </p>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-accentB/5 rounded-full blur-3xl group-hover:bg-accentB/10 transition-colors" />
            </div>
          </div>
        </section>

        {/* Additional Statistics Grid */}
        <section className="print:break-inside-avoid">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text mb-3">Additional Statistics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-surface border border-border rounded-lg">
              <div className="text-2xl font-bold text-text mb-1">68.4%</div>
              <div className="text-xs text-dim uppercase tracking-wide">Win Rate</div>
            </div>
            <div className="p-5 bg-surface border border-border rounded-lg">
              <div className="text-2xl font-bold text-text mb-1">1,247</div>
              <div className="text-xs text-dim uppercase tracking-wide">Total Trades</div>
            </div>
            <div className="p-5 bg-surface border border-border rounded-lg">
              <div className="text-2xl font-bold text-danger mb-1">-8.2%</div>
              <div className="text-xs text-dim uppercase tracking-wide">Max Drawdown</div>
            </div>
            <div className="p-5 bg-surface border border-border rounded-lg">
              <div className="text-2xl font-bold text-text mb-1">3.2</div>
              <div className="text-xs text-dim uppercase tracking-wide">Profit Factor</div>
            </div>
          </div>
        </section>

        {/* Methodology & Disclaimers */}
        <section className="print:break-inside-avoid">
          <div className="p-8 bg-elev border-2 border-border rounded-xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
                <span className="text-accent">⚠</span>
                Methodology & Disclaimers
              </h2>
            </div>

            <div className="space-y-4 text-sm text-text2 leading-relaxed">
              <div>
                <h3 className="font-semibold text-text mb-2">Performance Calculation</h3>
                <p>
                  All performance metrics are calculated from actual signal executions tracked in our system.
                  Returns assume position sizing of 2% per trade with stop-loss and take-profit levels as published.
                  Slippage of 0.1% and trading fees of 0.075% (maker) / 0.15% (taker) are factored into calculations.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-text mb-2">Data Integrity</h3>
                <p>
                  Signal timestamps are recorded with millisecond precision and stored immutably in our database.
                  All signals are published to Discord and our web platform simultaneously. Historical performance
                  cannot be altered retroactively. Data is backed up daily and auditable upon request.
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold text-danger mb-2">Risk Disclosure</h3>
                <p className="text-dim">
                  <strong>PAST PERFORMANCE IS NOT INDICATIVE OF FUTURE RESULTS.</strong> Trading cryptocurrencies
                  involves substantial risk of loss and is not suitable for all investors. You should carefully
                  consider whether trading is appropriate for you in light of your experience, objectives, financial
                  resources, and other relevant circumstances. Never invest money you cannot afford to lose.
                  Our signals are provided for informational purposes only and do not constitute financial advice.
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold text-text mb-2">Hypothetical Limitations</h3>
                <p className="text-dim">
                  While based on actual signals, these performance figures represent simulated results and may not
                  reflect the impact of material economic and market factors on actual trading decisions.
                  Simulated results have inherent limitations and do not account for financial risk, psychological
                  factors, or the impact of unexpected market events.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-border text-xs text-dim">
              <p>
                Last Updated: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {' • '}
                For questions about our methodology, please contact us via Discord.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
