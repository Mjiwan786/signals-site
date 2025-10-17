import { ClockIcon, CheckCircledIcon, RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export const metadata = {
  title: "Changelog | AI Predicted Signals",
  description: "Track updates, improvements, and new features in our AI crypto trading platform.",
};

interface ChangelogEntry {
  date: string;
  version?: string;
  category: "feature" | "improvement" | "fix" | "infrastructure";
  highlights: string[];
}

// Static changelog data (ready to be replaced with Redis stream later)
const changelogData: ChangelogEntry[] = [
  {
    date: "2025-01-15",
    version: "1.2.0",
    category: "feature",
    highlights: [
      "Added live signals streaming with Redis Cloud integration",
      "Implemented real-time equity curve visualization",
      "Enhanced Discord role synchronization system",
    ],
  },
  {
    date: "2025-01-10",
    version: "1.1.5",
    category: "improvement",
    highlights: [
      "Optimized signal latency to <500ms",
      "Improved dashboard performance by 40%",
      "Enhanced mobile responsiveness across all pages",
    ],
  },
  {
    date: "2025-01-05",
    version: "1.1.0",
    category: "feature",
    highlights: [
      "Launched performance tracking page with P&L metrics",
      "Added Stripe subscription management portal",
      "Introduced tiered pricing system",
    ],
  },
  {
    date: "2024-12-20",
    version: "1.0.5",
    category: "fix",
    highlights: [
      "Fixed webhook processing for Stripe events",
      "Resolved NextAuth session timeout issues",
      "Corrected timezone handling for signal timestamps",
    ],
  },
  {
    date: "2024-12-15",
    version: "1.0.0",
    category: "infrastructure",
    highlights: [
      "Official launch of AI Predicted Signals platform",
      "Deployed to Vercel with edge caching",
      "Integrated Supabase for user data management",
      "Established Redis Cloud TLS connection for live signals",
    ],
  },
];

const categoryConfig = {
  feature: {
    label: "New Feature",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
  },
  improvement: {
    label: "Improvement",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
  },
  fix: {
    label: "Bug Fix",
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
  },
  infrastructure: {
    label: "Infrastructure",
    color: "text-accentB",
    bgColor: "bg-accentB/10",
    borderColor: "border-accentB/30",
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ChangelogPage() {
  return (
    <div className="w-full min-h-screen bg-bg py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-lg mb-4">
            <ClockIcon className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Changelog
          </h1>
          <p className="text-lg text-text2 max-w-2xl mx-auto">
            Track our progress and stay updated with the latest improvements, features, and fixes.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

          {/* Changelog entries */}
          <div className="space-y-8">
            {changelogData.map((entry, index) => {
              const config = categoryConfig[entry.category];
              return (
                <div
                  key={index}
                  className="relative pl-0 md:pl-20"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-accent border-4 border-bg hidden md:block" />

                  {/* Content card */}
                  <div className="p-6 bg-surface border border-border rounded-xl hover:border-accent/30 transition-all duration-300 shadow-soft hover:shadow-glow">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-sm text-dim font-mono">
                        {formatDate(entry.date)}
                      </span>
                      {entry.version && (
                        <span className="px-3 py-1 bg-elev border border-border rounded-full text-xs font-semibold text-text">
                          v{entry.version}
                        </span>
                      )}
                      <span
                        className={`px-3 py-1 ${config.bgColor} border ${config.borderColor} rounded-full text-xs font-semibold ${config.color}`}
                      >
                        {config.label}
                      </span>
                    </div>

                    {/* Highlights */}
                    <ul className="space-y-2">
                      {entry.highlights.map((highlight, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-text2"
                        >
                          <CheckCircledIcon className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 p-8 bg-gradient-to-br from-surface via-elev to-surface border border-border rounded-xl text-center">
          <RocketIcon className="w-10 h-10 text-accent mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-text mb-3">
            More Updates Coming Soon
          </h3>
          <p className="text-text2 mb-6 max-w-xl mx-auto">
            We're constantly improving our platform. Join our Discord to stay updated with real-time announcements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://discord.gg/your-server"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-brand rounded-lg shadow-soft hover:shadow-glow transition-all duration-300"
            >
              Join Discord
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-text bg-surface border border-border rounded-lg hover:border-accent hover:bg-elev transition-all duration-300"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
