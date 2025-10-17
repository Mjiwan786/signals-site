"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Signals";
const discordInvite = process.env.NEXT_PUBLIC_DISCORD_INVITE || "#";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/signals", label: "Signals" },
  { href: "/performance", label: "Performance" },
  { href: "/pricing", label: "Pricing" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Subtle gradient bar */}
      <div className="h-[2px] w-full bg-gradient-brand" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Wordmark */}
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-brand bg-clip-text text-transparent hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface rounded"
            aria-label="AI Predicted Signals home"
          >
            {siteName}
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center space-x-8" role="list">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "relative text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface rounded px-2 py-1",
                    isActive
                      ? "text-accent"
                      : "text-text2 hover:text-text"
                  )}
                  aria-current={isActive ? "page" : undefined}
                  role="listitem"
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-gradient-brand"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: CTA Button */}
          <a
            href={discordInvite}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gradient-brand text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-glow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
            aria-label="Join our Discord community (opens in new tab)"
          >
            Join Discord
          </a>
        </div>
      </div>
    </nav>
  );
}
