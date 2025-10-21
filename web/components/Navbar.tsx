"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Activity } from "lucide-react";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "AI Predicted Signals";
const discordInvite = process.env.NEXT_PUBLIC_DISCORD_INVITE || "#";

const navLinks = [
  { href: "/signals", label: "Signals" },
  { href: "/pricing", label: "Pricing" },
  { href: "/tech", label: "Tech" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);

      // Hide/show navbar on scroll direction (with spring animation)
      if (latest > lastScrollY && latest > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      setLastScrollY(latest);
    });
    return () => unsubscribe();
  }, [scrollY, lastScrollY]);

  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(15, 17, 22, 0.4)', 'rgba(15, 17, 22, 0.9)']
  );

  const borderGlow = useTransform(
    scrollY,
    [0, 100],
    ['rgba(110, 231, 255, 0.2)', 'rgba(110, 231, 255, 0.4)']
  );

  const navY = useTransform(scrollY, (value) => {
    return isVisible ? 0 : -100;
  });

  return (
    <motion.nav
      style={{ backgroundColor: navBackground, y: navY }}
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={clsx(
        "sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300",
        isScrolled ? "border-accent-glow shadow-glow" : "border-accent"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Subtle gradient bar */}
      <motion.div
        className="h-[1px] w-full bg-gradient-brand"
        aria-hidden="true"
        style={{
          boxShadow: isScrolled ? '0 0 8px rgba(110, 231, 255, 0.3)' : 'none'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface rounded-lg px-2 py-1"
            aria-label="AI Predicted Signals home"
          >
            <div className="relative">
              <Activity
                className="w-6 h-6 text-accentA transition-transform group-hover:scale-110"
                aria-hidden="true"
              />
              <div className="absolute inset-0 blur-md bg-accentA opacity-50 group-hover:opacity-75 transition-opacity" aria-hidden="true" />
            </div>
            <span className="text-lg font-display font-bold bg-gradient-brand bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              {siteName}
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center space-x-1" role="list">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "relative text-sm font-medium transition-all px-4 py-2 rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface",
                    isActive
                      ? "text-accentA bg-accentA/10 border border-accent-glow"
                      : "text-text2 hover:text-text hover:bg-surface/50"
                  )}
                  aria-current={isActive ? "page" : undefined}
                  role="listitem"
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-gradient-brand shadow-glow"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Glowing Discord CTA Button */}
          <a
            href={discordInvite}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-5 py-2.5 bg-gradient-brand text-white text-sm font-semibold rounded-lg overflow-hidden transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface"
            aria-label="Join our Discord community (opens in new tab)"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-100 blur-xl transition-opacity" aria-hidden="true" />

            {/* Button content */}
            <span className="relative flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Join Discord
            </span>

            {/* Subtle shadow */}
            <div className="absolute inset-0 shadow-glow opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
