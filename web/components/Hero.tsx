'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { RocketIcon, TimerIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { fadeInUp, fadeIn, staggerContainer } from '@/lib/motion';

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background - disabled for reduced motion */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Radial Gradient */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.2) 40%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Floating Dots */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-accent rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.div
          className="text-center space-y-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-brand bg-clip-text text-transparent">
              AI-Powered Crypto Signals.
            </span>
            <br />
            <span className="text-text">Clear PnL. Zero Guesswork.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-text2 max-w-2xl mx-auto leading-relaxed">
            Real-time AI predictions backed by proven performance. Track every trade,
            see transparent P&amp;L, and make informed decisions with institutional-grade signals
            delivered in &lt;500ms.
          </p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <a
              href="https://discord.gg/your-server"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-brand rounded-lg shadow-soft hover:shadow-glow transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent/50 min-w-[200px]"
              aria-label="Join our Discord community (opens in new tab)"
            >
              <span className="relative z-10">Join Discord</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-accentB to-accentA opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
            </a>

            <Link
              href="/performance"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-text bg-surface border-2 border-border rounded-lg hover:border-accent hover:bg-elev transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent/50 min-w-[200px]"
            >
              View Performance
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <TrustCard
            icon={<TimerIcon className="w-6 h-6" />}
            label="&lt;500ms Publish"
          />
          <TrustCard
            icon={<RocketIcon className="w-6 h-6" />}
            label="99.5% Uptime Target"
          />
          <TrustCard
            icon={<LockClosedIcon className="w-6 h-6" />}
            label="Redis TLS + Risk Guards"
          />
        </motion.div>
      </div>
    </div>
  );
}

function TrustCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-3 p-6 bg-surface border border-border rounded-xl hover:border-accent/50 hover:shadow-soft transition-all duration-300"
      variants={fadeInUp}
    >
      <div className="p-3 bg-elev rounded-lg text-accent" aria-hidden="true">
        {icon}
      </div>
      <p className="text-sm font-medium text-text2 text-center">{label}</p>
    </motion.div>
  );
}
