'use client';

import { TrendingUp, Shield, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

// Smooth scroll to element
const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Aurora Background Component
function Aurora({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.3) 50%, transparent 100%)',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[100px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(168,85,247,0.3) 50%, transparent 100%)',
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-[700px] h-[700px] rounded-full blur-[110px] opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(99,102,241,0.2) 50%, transparent 100%)',
          }}
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}

// Split Text Animation Component
function SplitText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.h1
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}

// Gradient Text Animation Component
function GradientText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <motion.h2
      className={className}
      style={{
        background: 'linear-gradient(90deg, #a855f7, #ec4899, #6366f1)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
      animate={{
        backgroundPosition: ['0%', '100%', '0%'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {text}
    </motion.h2>
  );
}

// Button Component (inline for simplicity)
interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "gradient";
  size?: "default" | "sm" | "lg";
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}

function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants: Record<"default" | "outline" | "gradient", string> = {
    gradient: "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105",
    default: "bg-surface text-text border-2 border-border hover:border-accent hover:bg-elev",
    outline: "border-2 border-border bg-transparent text-text hover:bg-surface",
  };

  const sizes: Record<"default" | "sm" | "lg", string> = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-24 overflow-hidden bg-black">
      {/* Aurora gradient background */}
      <Aurora className="absolute inset-0 z-0" />

      <div className="relative z-10 text-center max-w-6xl mx-auto">
        {/* Live Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-purple-500/30 rounded-full mb-8 backdrop-blur-sm"
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium text-white/90">
            Live Trading Signals • <span className="text-purple-400">&lt;500ms Latency</span>
          </span>
        </motion.div>

        {/* Animated headline with SplitText */}
        <div className="mb-6">
          <SplitText
            text="AI-Driven Crypto Signals"
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
          />
        </div>

        {/* Gradient subheading with GradientText */}
        <div className="mb-8">
          <GradientText
            text="Live. Verified. Profitable."
            className="text-2xl md:text-3xl lg:text-4xl font-semibold"
          />
        </div>

        {/* Description */}
        <motion.p
          className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Real-time AI predictions with{' '}
          <span className="text-white font-semibold">transparent P&L</span>,{' '}
          <span className="text-white font-semibold">live performance tracking</span>, and
          institutional-grade signals delivered at lightning speed.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {/* Primary CTA - View Live PnL */}
          <Button
            size="lg"
            variant="gradient"
            onClick={() => scrollToElement('live-pnl')}
            className="group relative min-w-[220px]"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            <span>View Live PnL</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Secondary CTA - Join Discord */}
          <Link href="https://discord.gg/your-server" target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              variant="outline"
              className="min-w-[220px] bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-500/50"
            >
              Join Discord
              <ArrowRight className="w-5 h-5 ml-2 opacity-50 group-hover:opacity-100" />
            </Button>
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Live & Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Redis TLS Secured</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-pink-400" />
            <span>99.5% Uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>+177.9% CAGR</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
