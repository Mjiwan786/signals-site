'use client';

import { useEffect } from "react";
import Hero from "@/components/Hero";
import LiveStatus from "@/components/LiveStatus";
import TrustStrip from "@/components/TrustStrip";
import KpiStrip from "@/components/KpiStrip";
import PnLSection from "@/components/PnLSection";
import HowItWorks from "@/components/HowItWorks";
import SocialProof from "@/components/SocialProof";
import FeatureGrid from "@/components/FeatureGrid";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import InvestorSnapshot from "@/components/InvestorSnapshot";
import WhyBuySection from "@/components/WhyBuySection";
import Link from "next/link";
import { motion } from "framer-motion";
import { prefetchPnL } from "@/lib/hooks";

export default function Home() {
  // PRD Step 11: Prefetch PnL data on landing page
  useEffect(() => {
    // Prefetch common PnL data sizes
    prefetchPnL(500); // Default timeframe
    prefetchPnL(200); // 1W timeframe
  }, []);

  return (
    <>
      {/* Hero Section — Aurora background + animated text */}
      <Hero />

      {/* Live Status Section — Real-time system metrics */}
      <LiveStatus />

      {/* Trust Strip — Exchange badges + latency + rolling ticker */}
      <TrustStrip />

      {/* KPI Strip — Investor snapshot (MTD, win rate, drawdown) */}
      <KpiStrip />

      {/* PnL Section — Live PnL peek (24h chart + "See full performance") */}
      <PnLSection />

      {/* Investor Snapshot — MTD PnL, win rate, max DD with StatPill */}
      <InvestorSnapshot />

      {/* How It Works — Three cards with animations */}
      <HowItWorks />

      {/* Social Proof — Discord members, uptime, Lighthouse score */}
      <SocialProof />

      {/* Feature Grid — Core capabilities */}
      <FeatureGrid />

      {/* Architecture Diagram — Tech stack visualization */}
      <ArchitectureDiagram />

      {/* Why Buy Section — 2x2 bento grid with business value props */}
      <WhyBuySection />

      {/* CTA Section */}
      <section className="relative w-full bg-bg py-20 overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-dots opacity-40 pointer-events-none" aria-hidden="true" />

        {/* Accent glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accentB/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="relative p-12 bg-gradient-to-br from-surface via-elev to-surface border border-accent/20 rounded-2xl shadow-glow overflow-hidden">
            {/* Inner grid for card */}
            <div className="absolute inset-0 bg-grid-sm opacity-20 pointer-events-none" aria-hidden="true" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
                Ready to Start Trading Smarter?
              </h2>
              <p className="text-lg text-text2 mb-8 max-w-2xl mx-auto">
                Join thousands of traders using AI-powered signals to enhance their crypto trading strategy.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="https://discord.gg/your-server"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-brand rounded-lg shadow-soft min-w-[220px]"
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(110, 231, 255, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <span className="relative z-10">Get Started Now</span>
              </motion.a>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-text bg-surface border-2 border-border rounded-lg hover:border-accent hover:bg-elev transition-colors duration-200 min-w-[220px]"
                >
                  View Dashboard
                </Link>
              </motion.div>
              </div>

              <p className="text-sm text-dim mt-6">
                No credit card required • Cancel anytime • 99.8% uptime
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
