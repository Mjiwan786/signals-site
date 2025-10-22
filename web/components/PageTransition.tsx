/**
 * PageTransition Component
 * Provides smooth route transition animations with Framer Motion
 * Respects prefers-reduced-motion accessibility preference
 * PRD Step 10: Motion language & scroll
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Disable animations if user prefers reduced motion
  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1], // Custom easing for premium feel
      }}
    >
      {children}
    </motion.div>
  );
}
