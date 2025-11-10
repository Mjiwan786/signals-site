'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Settings, TrendingUp, ShieldCheck } from 'lucide-react';

// Animated grid item wrapper
function AnimatedBentoItem({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group"
    >
      {children}
    </motion.div>
  );
}

export default function WhyBuySection() {
  const items = [
    {
      title: 'Moat',
      description: 'Proprietary AI models provide a strong competitive edge.',
      Icon: Shield,
      gradient: 'from-purple-900/20 to-purple-950/40',
      iconColor: 'text-purple-400',
      ringColor: 'ring-purple-600/20 group-hover:ring-purple-500/40',
    },
    {
      title: 'Operational Simplicity',
      description: 'Minimal overhead with automated trading and monitoring.',
      Icon: Settings,
      gradient: 'from-blue-900/20 to-blue-950/40',
      iconColor: 'text-blue-400',
      ringColor: 'ring-blue-600/20 group-hover:ring-blue-500/40',
    },
    {
      title: 'Growth Levers',
      description: 'Scalable operations with ample market expansion opportunities.',
      Icon: TrendingUp,
      gradient: 'from-pink-900/20 to-pink-950/40',
      iconColor: 'text-pink-400',
      ringColor: 'ring-pink-600/20 group-hover:ring-pink-500/40',
    },
    {
      title: 'Security & Risk Controls',
      description: 'Rigorous security measures and robust risk protocols.',
      Icon: ShieldCheck,
      gradient: 'from-cyan-900/20 to-cyan-950/40',
      iconColor: 'text-cyan-400',
      ringColor: 'ring-cyan-600/20 group-hover:ring-cyan-500/40',
    },
  ];

  return (
    <section className="relative py-16 px-6 bg-black text-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/5 to-black pointer-events-none" />

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
            Why Buy This Business?
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Four pillars of sustainable competitive advantage
          </p>
        </motion.div>

        {/* 2x2 Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {items.map((item, idx) => (
            <AnimatedBentoItem key={item.title} delay={idx * 0.1}>
              <div
                className={`
                  h-full p-8 rounded-xl
                  bg-gradient-to-b ${item.gradient}
                  ring-1 ${item.ringColor}
                  backdrop-blur-sm
                  transition-all duration-300
                  cursor-pointer
                `}
              >
                {/* Icon */}
                <div className="mb-4">
                  <item.Icon className={`w-10 h-10 ${item.iconColor} transition-transform group-hover:scale-110`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/70 leading-relaxed">
                  {item.description}
                </p>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent" />
                </div>
              </div>
            </AnimatedBentoItem>
          ))}
        </div>
      </div>
    </section>
  );
}
