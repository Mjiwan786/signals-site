"use client";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function RiskPage() {
  return (
    <div className="w-full min-h-screen bg-bg py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-warning/10 rounded-lg mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-warning" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Risk Disclosure
          </h1>
          <p className="text-lg text-text2">
            Last updated: January 15, 2025
          </p>
        </div>

        {/* Warning Banner */}
        <div className="mb-8 p-6 bg-warning/10 border-2 border-warning/30 rounded-xl">
          <div className="flex items-start gap-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-warning mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-warning mb-2">
                Important: Read Before Trading
              </h3>
              <p className="text-text2">
                Cryptocurrency trading involves substantial risk of loss and is not suitable for all investors. You should carefully consider whether trading is appropriate for you in light of your financial condition, experience, and risk tolerance.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8 text-text2 legal-content">
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">1. Nature of Cryptocurrency Trading</h2>
            <p className="mb-4">
              Cryptocurrency markets are highly volatile and speculative. Prices can fluctuate dramatically within minutes, and past performance is not indicative of future results. You should be prepared to lose your entire investment.
            </p>
            <p className="mb-4">
              Trading digital assets involves risks including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Extreme price volatility and market manipulation</li>
              <li>Lack of regulatory oversight in many jurisdictions</li>
              <li>Limited liquidity and potential for flash crashes</li>
              <li>Exchange failures, hacks, and technical outages</li>
              <li>Irreversible transactions and loss of funds</li>
              <li>Regulatory changes affecting market access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">2. AI-Generated Signals</h2>
            <p className="mb-4">
              AI Predicted Signals uses machine learning algorithms to generate trading signals. You acknowledge and understand that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>No Guarantee of Accuracy:</strong> AI models can produce incorrect predictions and false signals</li>
              <li><strong>Past Performance:</strong> Historical results do not guarantee future performance</li>
              <li><strong>Model Limitations:</strong> Algorithms cannot predict unforeseen market events or black swan events</li>
              <li><strong>Data Dependencies:</strong> Signal quality depends on input data, which may be delayed, incomplete, or inaccurate</li>
              <li><strong>Technical Failures:</strong> System downtime or latency may prevent timely signal delivery</li>
              <li><strong>Overfitting Risk:</strong> Models may perform well on historical data but fail in live markets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">3. Not Financial Advice</h2>
            <p className="mb-4">
              The signals and information provided by AI Predicted Signals are for informational and educational purposes only. They do not constitute:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Financial, investment, or trading advice</li>
              <li>Recommendations to buy, sell, or hold any asset</li>
              <li>Professional guidance tailored to your circumstances</li>
              <li>A substitute for independent research and due diligence</li>
            </ul>
            <p className="mt-4">
              <strong>You are solely responsible for your trading decisions.</strong> We strongly recommend consulting with a licensed financial advisor before making any investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">4. Performance Metrics</h2>
            <p className="mb-4">
              Performance statistics displayed on the Service (including P&L, win rates, and equity curves) are provided for transparency but come with important caveats:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Hypothetical Results:</strong> Some metrics may be based on backtesting, which does not reflect actual trading</li>
              <li><strong>Slippage and Fees:</strong> Live trading involves slippage, fees, and execution delays not reflected in theoretical results</li>
              <li><strong>Position Sizing:</strong> Results assume consistent position sizing, which may not match your strategy</li>
              <li><strong>Market Conditions:</strong> Performance can vary dramatically based on market regime changes</li>
              <li><strong>Cherry-Picking:</strong> Displayed signals may not represent all signals generated</li>
            </ul>
            <p className="mt-4">
              <strong>Individual results will vary.</strong> Your actual trading performance may differ significantly from displayed metrics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">5. Leverage and Margin Trading</h2>
            <p className="mb-4">
              If you use leverage or margin to trade based on our signals, you face additional risks:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Losses can exceed your initial investment</li>
              <li>Forced liquidations during volatile market conditions</li>
              <li>Interest charges on borrowed funds</li>
              <li>Margin calls requiring immediate capital injection</li>
              <li>Cascading liquidations amplifying losses</li>
            </ul>
            <p className="mt-4 font-semibold text-warning">
              WARNING: Leverage magnifies both gains and losses. Only experienced traders should use leverage, and never risk more than you can afford to lose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">6. Technical Risks</h2>
            <p className="mb-4">
              The Service relies on complex technical infrastructure. You acknowledge the following risks:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Signal Latency:</strong> Delays in signal delivery may reduce profitability or cause losses</li>
              <li><strong>Service Downtime:</strong> Maintenance, outages, or attacks may prevent access</li>
              <li><strong>Data Errors:</strong> Incorrect or delayed market data can lead to faulty signals</li>
              <li><strong>Integration Issues:</strong> Discord, API, or webhook failures may disrupt service</li>
              <li><strong>Third-Party Dependencies:</strong> Failures at Vercel, Redis Cloud, or Supabase affect availability</li>
            </ul>
            <p className="mt-4">
              We do not guarantee uninterrupted service or real-time delivery. You should implement your own risk management and not rely solely on our signals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">7. Regulatory Considerations</h2>
            <p className="mb-4">
              Cryptocurrency regulations vary by jurisdiction and are rapidly evolving. You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Understanding and complying with laws in your jurisdiction</li>
              <li>Reporting taxes on trading gains accurately</li>
              <li>Ensuring you are legally permitted to trade cryptocurrencies</li>
              <li>Monitoring regulatory changes that may affect your access</li>
            </ul>
            <p className="mt-4">
              Some jurisdictions prohibit or restrict cryptocurrency trading. <strong>It is your responsibility to ensure compliance with local laws.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">8. No Liability for Losses</h2>
            <p className="mb-4">
              AI Predicted Signals and its operators, employees, and affiliates shall not be liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Trading losses or missed opportunities</li>
              <li>Incorrect, delayed, or missing signals</li>
              <li>Technical failures or service interruptions</li>
              <li>Actions taken based on signals or information provided</li>
              <li>Third-party exchange failures, hacks, or fraud</li>
              <li>Regulatory actions or changes in law</li>
            </ul>
            <p className="mt-4 font-semibold">
              By using the Service, you agree to hold us harmless from any claims arising from your trading activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">9. Risk Management Best Practices</h2>
            <p className="mb-4">
              We strongly recommend implementing the following risk management principles:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Never invest more than you can afford to lose</li>
              <li>Use stop-loss orders to limit downside risk</li>
              <li>Diversify across multiple assets and strategies</li>
              <li>Avoid emotional trading and stick to your plan</li>
              <li>Keep detailed records for tax and performance tracking</li>
              <li>Continuously educate yourself about markets and technology</li>
              <li>Start with small positions and scale gradually</li>
              <li>Avoid trading during high-stress or emotional periods</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">10. Subscription Fees</h2>
            <p>
              Subscription fees are non-refundable, regardless of trading performance. Paying for access to signals does not guarantee profitability. You may lose money on trades while still being required to pay subscription fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">11. Acknowledgment and Consent</h2>
            <p className="mb-4">
              By using AI Predicted Signals, you acknowledge that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You have read, understood, and agree to this Risk Disclosure</li>
              <li>You understand the risks of cryptocurrency trading</li>
              <li>You are not relying on signals as financial advice</li>
              <li>You accept full responsibility for your trading decisions</li>
              <li>You will not hold us liable for any trading losses</li>
              <li>You have the financial capacity to bear potential losses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">12. Contact Information</h2>
            <p>
              For questions about this Risk Disclosure, contact us at:{" "}
              <a
                href="mailto:legal@aipredictedsignals.cloud"
                className="text-accent hover:underline"
              >
                legal@aipredictedsignals.cloud
              </a>
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 p-6 bg-surface border border-border rounded-xl">
          <h3 className="text-lg font-bold text-text mb-4">Related Legal Documents</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/legal/terms"
              className="flex-1 p-4 bg-elev border border-border rounded-lg hover:border-accent/50 transition-all text-center"
            >
              <span className="text-text font-medium">Terms of Service</span>
            </Link>
            <Link
              href="/legal/privacy"
              className="flex-1 p-4 bg-elev border border-border rounded-lg hover:border-accent/50 transition-all text-center"
            >
              <span className="text-text font-medium">Privacy Policy</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .legal-content {
            color: #000;
            font-size: 12pt;
          }
          header, footer, nav, .no-print {
            display: none !important;
          }
          h1, h2 {
            color: #000;
            page-break-after: avoid;
          }
          section {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
