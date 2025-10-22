"use client";

import Link from "next/link";
import { Activity, Github, Twitter, Mail } from "lucide-react";
import {
  DiscordLogoIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

const siteName = "AI Predicted Signals";
const currentYear = new Date().getFullYear();

const productLinks = [
  { href: "/signals", label: "Live Signals" },
  { href: "/performance", label: "Performance" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
];

const companyLinks = [
  { href: "/docs", label: "Documentation" },
  { href: "/changelog", label: "Changelog" },
  { href: "/#methodology", label: "Methodology" },
  { href: "/#contact", label: "Contact" },
];

const legalLinks = [
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/risk", label: "Risk Disclaimer" },
];

const socialLinks = [
  {
    href: process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/your-server",
    label: "Discord",
    Icon: DiscordLogoIcon,
  },
  {
    href: "https://twitter.com/CryptoAIBot",
    label: "Twitter",
    Icon: Twitter,
  },
  {
    href: "https://github.com/your-org/signals-site",
    label: "GitHub",
    Icon: Github,
  },
  {
    href: "mailto:support@aipredictedsignals.cloud",
    label: "Email",
    Icon: Mail,
  },
];

// Partner logos placeholders - replace with actual partner logos
const partners = [
  { name: "Partner 1", logo: "P1" },
  { name: "Partner 2", logo: "P2" },
  { name: "Partner 3", logo: "P3" },
];

/**
 * Health Status Pill - fetches /v1/status/health
 */
function HealthStatus() {
  const [status, setStatus] = useState<'healthy' | 'degraded' | 'unknown'>('unknown');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || '';
        const response = await fetch(`${apiBase}/v1/status/health`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });

        if (response.ok) {
          setStatus('healthy');
        } else {
          setStatus('degraded');
        }
      } catch (error) {
        setStatus('degraded');
      } finally {
        setLoading(false);
      }
    }

    fetchHealth();
    // Refresh every 60 seconds
    const interval = setInterval(fetchHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    healthy: {
      label: 'All Systems Operational',
      color: 'bg-success',
      glow: 'shadow-[0_0_8px_rgba(16,185,129,0.3)]',
    },
    degraded: {
      label: 'Service Degraded',
      color: 'bg-danger',
      glow: 'shadow-[0_0_8px_rgba(239,68,68,0.3)]',
    },
    unknown: {
      label: 'Checking Status...',
      color: 'bg-dim',
      glow: '',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-surface/30">
        <div className={`w-2 h-2 rounded-full ${config.color} ${config.glow} ${!loading && status === 'healthy' ? 'animate-pulse' : ''}`} />
        <span className="text-dim">{config.label}</span>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      className="border-t border-accent bg-surface/30 backdrop-blur-sm mt-auto"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Top gradient line */}
      <div className="h-[1px] w-full bg-gradient-brand" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content - ChainGPT style multi-column */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 group w-fit"
              aria-label="AI Predicted Signals home"
            >
              <div className="relative">
                <Activity
                  className="w-6 h-6 text-accentA transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
                <div className="absolute inset-0 blur-md bg-accentA opacity-50 group-hover:opacity-75 transition-opacity" aria-hidden="true" />
              </div>
              <span className="font-display font-bold text-lg bg-gradient-brand bg-clip-text text-transparent">
                {siteName}
              </span>
            </Link>
            <p className="text-sm text-dim max-w-xs">
              Real-time AI-powered cryptocurrency trading signals with transparent performance tracking.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.Icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="p-2 text-dim hover:text-accentA transition-all rounded-lg hover:bg-surface/50 border border-transparent hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                    aria-label={social.label}
                  >
                    {typeof Icon === 'function' && Icon.name === 'DiscordLogoIcon' ? (
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider">
              Product
            </h3>
            <nav className="flex flex-col space-y-3" aria-label="Product links">
              {productLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-dim hover:text-accentA transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider">
              Company
            </h3>
            <nav className="flex flex-col space-y-3" aria-label="Company links">
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-dim hover:text-accentA transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider">
              Legal
            </h3>
            <nav className="flex flex-col space-y-3" aria-label="Legal links">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-dim hover:text-accentA transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Partner logos section */}
        <div className="border-t border-accent/30 pt-8 mb-8">
          <p className="text-xs text-dim uppercase tracking-wider text-center mb-4">
            Trusted By
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="w-16 h-16 rounded-lg border border-accent/20 flex items-center justify-center text-dim hover:border-accent hover:text-accentA transition-all bg-surface/30"
                aria-label={partner.name}
              >
                <span className="text-xs font-mono">{partner.logo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-accent/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <div className="text-sm text-dim">
              © {currentYear} {siteName}. All rights reserved.
            </div>
            <HealthStatus />
          </div>

          <div className="text-xs text-dim">
            Built with{" "}
            <span className="text-accentA font-semibold">AI</span>
            {" "}by{" "}
            <span className="text-accentB font-semibold">Crypto-AI-Bot</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
