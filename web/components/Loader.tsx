/**
 * Loading State Components
 * ReactBits-inspired loaders with reduced-motion support
 * PRD: Premium SaaS feel, accessible, performant
 */

'use client'

import { motion } from 'framer-motion'

/**
 * Neural Loader - Three-dot pulse animation
 * Usage: <NeuralLoader />
 */
export function NeuralLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  return (
    <div className="flex gap-2 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${sizeMap[size]} rounded-full bg-accent`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Pulse Loader - Circular pulse with color transition
 * Usage: <PulseLoader />
 */
export function PulseLoader({ size = 64 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="rounded-full border-2"
        style={{
          width: size,
          height: size,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
          borderColor: ['#6EE7FF', '#A78BFA', '#6EE7FF'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

/**
 * Spinner Loader - Rotating border gradient
 * Usage: <SpinnerLoader />
 */
export function SpinnerLoader({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="rounded-full border-2 border-transparent border-t-accent"
        style={{
          width: size,
          height: size,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

/**
 * Glow Loader - Pulsing glow effect
 * Usage: <GlowLoader />
 */
export function GlowLoader({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="rounded-full bg-accent"
        style={{
          width: size,
          height: size,
        }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(110, 231, 255, 0.3)',
            '0 0 40px rgba(110, 231, 255, 0.6)',
            '0 0 20px rgba(110, 231, 255, 0.3)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

/**
 * Bar Loader - Horizontal progress bar
 * Usage: <BarLoader />
 */
export function BarLoader({ width = 200, height = 4 }: { width?: number; height?: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-full bg-surface"
      style={{ width, height }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full rounded-full bg-gradient-brand"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ width: '50%' }}
      />
    </div>
  )
}

/**
 * Skeleton Loader - Shimmer effect for content placeholders
 * Usage: <SkeletonLoader className="w-full h-20" />
 */
export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-surface ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

/**
 * Grid Loader - Pulsing grid pattern
 * Usage: <GridLoader />
 */
export function GridLoader() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[...Array(9)].map((_, i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded bg-accent"
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
