"use client";

import { LockClosedIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="w-full min-h-screen bg-bg py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-lg mb-4">
            <LockClosedIcon className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-text2">
            Last updated: January 15, 2025
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-text2 legal-content">
          <section>
            <h2 className="text-2xl font-bold text-text mb-4">1. Introduction</h2>
            <p className="mb-4">
              AI Predicted Signals (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
            </p>
            <p>
              By using the Service, you consent to the data practices described in this policy. If you do not agree with this policy, please discontinue use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-text mb-3 mt-6">2.1 Information You Provide</h3>
            <p className="mb-4">
              When you register via Discord OAuth, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Discord user ID, username, and discriminator</li>
              <li>Email address (if provided to Discord)</li>
              <li>Profile picture URL</li>
              <li>Subscription tier and payment information (via Stripe)</li>
            </ul>

            <h3 className="text-xl font-semibold text-text mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <p className="mb-4">
              When you access the Service, we automatically collect:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>IP address and geographic location</li>
              <li>Browser type and version</li>
              <li>Operating system and device information</li>
              <li>Pages visited, time spent, and interaction patterns</li>
              <li>Referral source and exit pages</li>
            </ul>

            <h3 className="text-xl font-semibold text-text mb-3 mt-6">2.3 Usage Data</h3>
            <p className="mb-4">
              We collect data about your use of the Service, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Signals viewed and interaction timestamps</li>
              <li>Dashboard metrics and performance chart views</li>
              <li>API requests and response times (if using API access)</li>
              <li>Feature usage and navigation paths</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">
              We use collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Service Delivery:</strong> Provide and maintain the Service, including signal delivery and account management</li>
              <li><strong>Authentication:</strong> Verify your identity and manage access based on subscription tier</li>
              <li><strong>Discord Integration:</strong> Sync your subscription tier with Discord roles for community access</li>
              <li><strong>Payment Processing:</strong> Process subscriptions via Stripe (we do not store credit card details)</li>
              <li><strong>Performance Monitoring:</strong> Track signal latency, system uptime, and service quality</li>
              <li><strong>Communication:</strong> Send service updates, security alerts, and subscription notifications</li>
              <li><strong>Analytics:</strong> Understand usage patterns to improve the Service</li>
              <li><strong>Legal Compliance:</strong> Comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">4. Data Sharing and Disclosure</h2>
            <p className="mb-4">
              We do not sell your personal information. We may share your information with:
            </p>

            <h3 className="text-xl font-semibold text-text mb-3 mt-6">4.1 Service Providers</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Vercel:</strong> Hosting and content delivery</li>
              <li><strong>Supabase:</strong> Database and user authentication</li>
              <li><strong>Redis Cloud:</strong> Real-time signal streaming infrastructure</li>
              <li><strong>Stripe:</strong> Payment processing and subscription management</li>
              <li><strong>Discord:</strong> Community access and role synchronization</li>
            </ul>

            <h3 className="text-xl font-semibold text-text mb-3 mt-6">4.2 Legal Requirements</h3>
            <p className="mb-4">
              We may disclose your information if required to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Comply with legal obligations or court orders</li>
              <li>Protect our rights, property, or safety</li>
              <li>Investigate fraud or Terms of Service violations</li>
              <li>Respond to government requests or law enforcement</li>
            </ul>

            <h3 className="text-xl font-semibold text-text mb-3 mt-6">4.3 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. You will be notified via email or prominent notice on the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>TLS/SSL encryption for all data transmission</li>
              <li>Encrypted storage for sensitive data in Supabase</li>
              <li>Secure Redis Cloud connection with TLS authentication</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and role-based permissions</li>
              <li>Stripe PCI-DSS compliant payment processing</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">6. Data Retention</h2>
            <p className="mb-4">
              We retain your information for as long as necessary to provide the Service and comply with legal obligations:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Account Data:</strong> Retained while your account is active, plus 90 days after deletion</li>
              <li><strong>Usage Logs:</strong> Retained for 12 months for analytics and debugging</li>
              <li><strong>Payment Records:</strong> Retained for 7 years for tax and legal compliance</li>
              <li><strong>Support Communications:</strong> Retained for 3 years</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">7. Your Rights</h2>
            <p className="mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your data (subject to legal obligations)</li>
              <li><strong>Data Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Objection:</strong> Object to processing of your data for certain purposes</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at{" "}
              <a
                href="mailto:privacy@aipredictedsignals.cloud"
                className="text-accent hover:underline"
              >
                privacy@aipredictedsignals.cloud
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">8. Cookies and Tracking</h2>
            <p className="mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Maintain your login session (NextAuth session cookies)</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Improve Service performance and user experience</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings. Disabling cookies may affect Service functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">9. Children&apos;s Privacy</h2>
            <p>
              The Service is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately for deletion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries outside your jurisdiction. We ensure appropriate safeguards are in place, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Standard contractual clauses approved by regulatory authorities</li>
              <li>Compliance with EU-US Data Privacy Framework (if applicable)</li>
              <li>Adherence to GDPR and CCPA requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be posted on this page with an updated &quot;Last updated&quot; date. Continued use of the Service after changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-4">12. Contact Information</h2>
            <p>
              For questions about this Privacy Policy or to exercise your rights, contact us at:
            </p>
            <ul className="list-none space-y-2 mt-4">
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:privacy@aipredictedsignals.cloud"
                  className="text-accent hover:underline"
                >
                  privacy@aipredictedsignals.cloud
                </a>
              </li>
              <li>
                <strong>Support:</strong>{" "}
                <a
                  href="mailto:support@aipredictedsignals.cloud"
                  className="text-accent hover:underline"
                >
                  support@aipredictedsignals.cloud
                </a>
              </li>
            </ul>
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
          h1, h2, h3 {
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
