"use client";

import { FileTextIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="w-full min-h-screen bg-bg py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-lg mb-4">
            <FileTextIcon className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-text2">
            Last updated: January 15, 2025
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-text2 legal-content">
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">1. Agreement to Terms</h2>
            <p className="mb-4">
              By accessing or using AI Predicted Signals (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these terms, you may not access the Service.
            </p>
            <p>
              The Service is operated by AI Predicted Signals (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">2. Description of Service</h2>
            <p className="mb-4">
              AI Predicted Signals provides AI-powered cryptocurrency trading signals delivered through a web interface and Discord integration. The Service includes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Real-time trading signals with entry, stop-loss, and take-profit levels</li>
              <li>Performance tracking and transparent P&L metrics</li>
              <li>Discord community access based on subscription tier</li>
              <li>API access for signal integration (subject to tier limits)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">3. User Accounts and Registration</h2>
            <p className="mb-4">
              To access certain features, you must register an account via Discord OAuth. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
            <p className="mt-4">
              We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">4. Subscriptions and Payments</h2>
            <p className="mb-4">
              The Service offers tiered subscription plans processed through Stripe. By subscribing, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Pay all applicable fees for your selected tier</li>
              <li>Automatic renewal unless canceled before the billing cycle ends</li>
              <li>No refunds for partial subscription periods</li>
              <li>Price changes with 30 days notice for existing subscribers</li>
            </ul>
            <p className="mt-4">
              You may cancel your subscription at any time through your dashboard or by contacting support. Access continues until the end of the current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">5. Intellectual Property</h2>
            <p className="mb-4">
              All content, features, and functionality of the Service (including but not limited to text, graphics, logos, algorithms, and software) are owned by AI Predicted Signals and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">6. Prohibited Uses</h2>
            <p className="mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Share account credentials or resell access to the Service</li>
              <li>Use automated systems (bots, scrapers) to access the Service without authorization</li>
              <li>Reverse engineer, decompile, or attempt to extract source code</li>
              <li>Engage in market manipulation or illegal trading activities</li>
              <li>Distribute malicious code or attempt to disrupt the Service</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">7. Disclaimer of Warranties</h2>
            <p className="mb-4">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p className="mb-4">
              We do not guarantee:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Continuous, uninterrupted, or error-free operation</li>
              <li>Accuracy, completeness, or reliability of signals or content</li>
              <li>Specific trading results or profitability</li>
              <li>Compatibility with all devices or network configurations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">8. Limitation of Liability</h2>
            <p className="mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, AI PREDICTED SIGNALS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your use or inability to use the Service</li>
              <li>Trading decisions based on signals provided by the Service</li>
              <li>Unauthorized access to or alteration of your data</li>
              <li>Service interruptions or technical failures</li>
            </ul>
            <p className="mt-4">
              Our total liability shall not exceed the amount you paid for the Service in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">9. Third-Party Services</h2>
            <p className="mb-4">
              The Service integrates with third-party platforms including Discord, Stripe, and Supabase. Your use of these services is subject to their respective terms and privacy policies. We are not responsible for the availability, content, or practices of third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">10. Governing Law and Dispute Resolution</h2>
            <p className="mb-4">
              These Terms are governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles. Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>
            <p>
              You agree to waive any right to a jury trial or to participate in a class action lawsuit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">11. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your right to use the Service ceases immediately</li>
              <li>No refunds will be issued for remaining subscription time</li>
              <li>We may delete your account data after a reasonable period</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">12. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at:{" "}
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
              href="/legal/privacy"
              className="flex-1 p-4 bg-elev border border-border rounded-lg hover:border-accent/50 transition-all text-center"
            >
              <span className="text-text font-medium">Privacy Policy</span>
            </Link>
            <Link
              href="/legal/risk"
              className="flex-1 p-4 bg-elev border border-border rounded-lg hover:border-accent/50 transition-all text-center"
            >
              <span className="text-text font-medium">Risk Disclosure</span>
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
