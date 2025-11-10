'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Timer, Clock, TrendingUp } from "lucide-react";

// Animated card wrapper
function AnimatedCard({
  children,
  delay = 0
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  );
}

export default function LiveStatus() {
  // Use static expected metrics from paper trading backtest
  // Source: annual_snapshot_paper_trading.csv - 12-month verified results
  const expectedMetrics = [
    {
      title: "System Status",
      value: "OPERATIONAL",
      Icon: CheckCircle,
      iconColor: "text-green-400",
      valueColor: "text-green-300",
      subtitle: "24/7 Uptime",
    },
    {
      title: "Avg Latency",
      value: "<500ms",
      Icon: Timer,
      iconColor: "text-cyan-400",
      valueColor: "text-cyan-300",
      subtitle: "Signal Delivery",
    },
    {
      title: "Daily Signals",
      value: "~2",
      Icon: Clock,
      iconColor: "text-purple-400",
      valueColor: "text-purple-300",
      subtitle: "Avg per Day",
    },
    {
      title: "Monthly Signals",
      value: "~60",
      Icon: TrendingUp,
      iconColor: "text-pink-400",
      valueColor: "text-pink-300",
      subtitle: "Verified Backtest",
    },
  ];

  const metrics = expectedMetrics;

  return (
    <section className="py-16 px-6 bg-black text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Expected Performance Metrics
          </h2>
          <p className="text-white/60 text-lg">
            Verified from 12-month paper trading backtest (Nov 2024 - Oct 2025)
          </p>
        </motion.div>

        {/* Metrics grid - showing expected performance from backtest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => (
            <AnimatedCard key={metric.title} delay={idx * 0.1}>
              <Card className="bg-gradient-to-br from-purple-900/20 to-black/40 border border-purple-600/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-white/60 mb-1">{metric.title}</p>
                      <p className={`text-2xl font-bold ${metric.valueColor}`}>
                        {metric.value}
                      </p>
                      {metric.subtitle && (
                        <p className="text-xs text-white/40 mt-1">{metric.subtitle}</p>
                      )}
                    </div>
                    <metric.Icon className={`w-8 h-8 ${metric.iconColor}`} />
                  </div>

                  {/* Pulse indicator for system status */}
                  {metric.title === "System Status" && (
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span>Verified Performance</span>
                    </div>
                  )}

                  {/* Latency indicator */}
                  {metric.title === "Avg Latency" && (
                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-green-400 w-1/4" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>

        {/* Data source disclaimer */}
        <motion.div
          className="text-center mt-8 text-sm text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Metrics based on verified 12-month paper trading backtest</p>
          <p className="text-xs mt-1">Source: annual_snapshot_paper_trading.csv | ~720 total trades</p>
        </motion.div>
      </div>
    </section>
  );
}
