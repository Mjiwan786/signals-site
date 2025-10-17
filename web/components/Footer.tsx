"use client";

import Link from "next/link";
import {
  GitHubLogoIcon,
  TwitterLogoIcon,
  DiscordLogoIcon,
  EnvelopeClosedIcon,
} from "@radix-ui/react-icons";

const siteName = "AI Predicted Signals";
const currentYear = new Date().getFullYear();

const footerLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/signals", label: "Performance" },
  { href: "/pricing", label: "Pricing" },
  { href: "/changelog", label: "Changelog" },
  { href: "/docs", label: "Docs" },
];

const legalLinks = [
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/risk", label: "Risk" },
];

const socialLinks = [
  {
    href: "https://discord.gg/your-server",
    label: "Discord",
    icon: DiscordLogoIcon,
  },
  {
    href: "https://twitter.com/CryptoAIBot",
    label: "Twitter",
    icon: TwitterLogoIcon,
  },
  {
    href: "https://github.com/your-org/signals-site",
    label: "GitHub",
    icon: GitHubLogoIcon,
  },
  {
    href: "mailto:support@aipredictedsignals.cloud",
    label: "Email",
    icon: EnvelopeClosedIcon,
  },
];

export default function Footer() {
  return (
    <footer
      className="border-t border-border bg-surface/50 mt-auto"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">
          {/* Top Row: Quick Links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Copyright */}
            <div className="text-sm text-text2 order-2 md:order-1">
              © {currentYear} {siteName}. All rights reserved.
            </div>

            {/* Center: Quick Links */}
            <nav
              className="flex items-center gap-6 flex-wrap justify-center order-1 md:order-2"
              aria-label="Footer navigation"
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text2 hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface rounded px-1"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: Social Icons */}
            <div className="flex items-center gap-4 order-3" aria-label="Social media links">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-text2 hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface rounded p-1"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Middle Row: Branding */}
          <div className="text-center">
            <p className="text-sm text-text2">
              Built by{" "}
              <span className="text-accent font-semibold">Crypto-AI-Bot</span>
            </p>
          </div>

          {/* Bottom Row: Legal Links */}
          <nav
            className="flex items-center justify-center gap-6 pt-4 border-t border-border/50"
            aria-label="Legal links"
          >
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-text2 hover:text-text transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface rounded px-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
