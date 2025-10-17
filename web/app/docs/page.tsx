import {
  FileTextIcon,
  CodeIcon,
  LinkBreak2Icon,
  ChatBubbleIcon,
  LightningBoltIcon,
  LockClosedIcon,
  GlobeIcon,
  PersonIcon
} from "@radix-ui/react-icons";
import Link from "next/link";

export const metadata = {
  title: "Documentation | AI Predicted Signals",
  description: "Complete guide to integrating with signals-api, understanding our endpoints, and community guidelines.",
};

interface DocSection {
  id: string;
  title: string;
  icon: any;
  description: string;
  links?: { label: string; href: string; external?: boolean }[];
  content?: string[];
}

const docSections: DocSection[] = [
  {
    id: "intro",
    title: "Introduction",
    icon: FileTextIcon,
    description: "Welcome to AI Predicted Signals",
    content: [
      "AI Predicted Signals is a real-time crypto trading signal platform powered by machine learning algorithms and delivered through a modern web interface and Discord integration.",
      "Our platform streams live signals from Redis Cloud with <500ms latency, providing traders with actionable insights backed by transparent performance metrics.",
      "This documentation covers API integration, endpoint reference, authentication flows, and community best practices.",
    ],
  },
  {
    id: "quick-start",
    title: "Quick Start",
    icon: LightningBoltIcon,
    description: "Get started in minutes",
    links: [
      { label: "Subscribe to a Tier", href: "/pricing" },
      { label: "Join Discord", href: "https://discord.gg/your-server", external: true },
      { label: "View Live Signals", href: "/signals" },
      { label: "Check Performance", href: "/performance" },
    ],
  },
  {
    id: "api-endpoints",
    title: "Signals API Endpoints",
    icon: CodeIcon,
    description: "REST & SSE endpoints for integration",
    content: [
      "Base URL: https://api.aipredictedsignals.cloud",
      "",
      "GET /signals - Fetch recent signals (REST)",
      "GET /stream - Server-Sent Events stream for live signals",
      "GET /metrics - Prometheus-style metrics endpoint",
      "GET /health - Health check endpoint",
      "",
      "All endpoints require authentication via Bearer token (obtained after Discord OAuth).",
    ],
  },
  {
    id: "authentication",
    title: "Authentication",
    icon: LockClosedIcon,
    description: "Secure access to signals",
    content: [
      "Authentication is handled via NextAuth with Discord OAuth2 provider.",
      "After login, your session is linked to your Supabase user profile and subscription tier.",
      "API requests must include: Authorization: Bearer <your_token>",
      "Tokens expire after 30 days and are automatically refreshed.",
    ],
  },
  {
    id: "data-format",
    title: "Signal Data Format",
    icon: LinkBreak2Icon,
    description: "Understanding signal structure",
    content: [
      "Each signal follows the SignalDTO schema:",
      "",
      "{",
      '  "id": "uuid",',
      '  "symbol": "BTCUSDT",',
      '  "action": "BUY" | "SELL",',
      '  "confidence": 0.85,',
      '  "entry_price": 43250.50,',
      '  "stop_loss": 42800.00,',
      '  "take_profit": 44500.00,',
      '  "timestamp": "2025-01-15T12:34:56Z"',
      "}",
    ],
  },
  {
    id: "community",
    title: "Community Guidelines",
    icon: ChatBubbleIcon,
    description: "Best practices for our community",
    content: [
      "✓ Share insights and learning experiences",
      "✓ Ask questions respectfully in Discord channels",
      "✓ Report technical issues via GitHub or support tickets",
      "✓ Follow risk management principles (signals are not financial advice)",
      "",
      "✗ Do not share account credentials or API tokens",
      "✗ Avoid spamming or promoting external services",
      "✗ Do not engage in market manipulation discussions",
      "✗ Respect other members and maintain professional conduct",
    ],
  },
  {
    id: "resources",
    title: "Additional Resources",
    icon: GlobeIcon,
    description: "External links and tools",
    links: [
      { label: "Changelog", href: "/changelog" },
      { label: "GitHub Repository", href: "https://github.com/your-org/signals-site", external: true },
      { label: "Status Page", href: "https://status.aipredictedsignals.cloud", external: true },
      { label: "Support Email", href: "mailto:support@aipredictedsignals.cloud", external: true },
    ],
  },
  {
    id: "investor-info",
    title: "Investor Information",
    icon: PersonIcon,
    description: "Transparency for potential acquirers",
    content: [
      "Platform Status: Production (Vercel deployment)",
      "Uptime: 99.8% (measured over 90 days)",
      "Monthly Active Users: Growing subscriber base",
      "Tech Stack: Next.js 14, Redis Cloud, Supabase, Stripe",
      "",
      "Performance Metrics:",
      "• Signal latency: <500ms (p95)",
      "• API response time: <200ms TTFB",
      "• Lighthouse score: 92/100",
      "",
      "For acquisition inquiries, contact: invest@aipredictedsignals.cloud",
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="w-full min-h-screen bg-bg py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-lg mb-4">
            <FileTextIcon className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Documentation
          </h1>
          <p className="text-lg text-text2 max-w-2xl mx-auto">
            Everything you need to integrate, understand, and contribute to AI Predicted Signals.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 p-6 bg-surface border border-border rounded-xl">
          <h2 className="text-xl font-bold text-text mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {docSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 p-3 bg-elev border border-border rounded-lg hover:border-accent/50 transition-all duration-200 group"
              >
                <section.icon className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                <span className="text-text font-medium">{section.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="space-y-12">
          {docSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-8"
            >
              <div className="p-8 bg-surface border border-border rounded-xl shadow-soft">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <section.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text">
                      {section.title}
                    </h2>
                    <p className="text-sm text-text2">{section.description}</p>
                  </div>
                </div>

                {/* Section Content */}
                {section.content && (
                  <div className="mt-6 space-y-3">
                    {section.content.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className={`text-text2 ${
                          paragraph.startsWith("{") || paragraph.startsWith(" ")
                            ? "font-mono text-sm bg-elev border border-border rounded p-3"
                            : paragraph.startsWith("•") || paragraph.startsWith("✓") || paragraph.startsWith("✗")
                            ? "ml-4"
                            : ""
                        }`}
                        style={{ whiteSpace: paragraph.startsWith("{") ? "pre-wrap" : "normal" }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {/* Section Links */}
                {section.links && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {section.links.map((link, idx) => (
                      link.external ? (
                        <a
                          key={idx}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-elev border border-border rounded-lg hover:border-accent/50 transition-all duration-200 group"
                        >
                          <span className="text-text font-medium">{link.label}</span>
                          <LinkBreak2Icon className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                        </a>
                      ) : (
                        <Link
                          key={idx}
                          href={link.href}
                          className="flex items-center justify-between p-4 bg-elev border border-border rounded-lg hover:border-accent/50 transition-all duration-200 group"
                        >
                          <span className="text-text font-medium">{link.label}</span>
                          <LinkBreak2Icon className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 p-8 bg-gradient-to-br from-surface via-elev to-surface border border-border rounded-xl text-center">
          <ChatBubbleIcon className="w-10 h-10 text-accent mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-text mb-3">
            Need Help?
          </h3>
          <p className="text-text2 mb-6 max-w-xl mx-auto">
            Can't find what you're looking for? Join our Discord community or reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://discord.gg/your-server"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-brand rounded-lg shadow-soft hover:shadow-glow transition-all duration-300"
            >
              Join Discord Community
            </a>
            <a
              href="mailto:support@aipredictedsignals.cloud"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-text bg-surface border border-border rounded-lg hover:border-accent hover:bg-elev transition-all duration-300"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
