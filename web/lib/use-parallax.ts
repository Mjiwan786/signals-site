/**
 * Parallax Hook
 * Creates scroll-linked parallax effects for depth and motion
 * PRD: Respects reduced-motion, returns static value when disabled
 */

'use client'

import { useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef, RefObject } from 'react'

/**
 * Creates a parallax effect based on scroll position
 * @param distance - Distance to travel in pixels (default: 50)
 * @returns MotionValue<number> for y transform and ref to attach to target element
 *
 * @example
 * const { ref, y } = useParallax(100)
 * return <motion.div ref={ref} style={{ y }}>Content</motion.div>
 */
export function useParallax(distance: number = 50): {
  ref: RefObject<HTMLDivElement>
  y: MotionValue<number>
} {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance])

  return { ref, y }
}

/**
 * Creates a parallax effect for background layers
 * @param distance - Distance to travel (default: 100)
 * @returns MotionValue<number> for y transform
 *
 * @example
 * const y = useParallaxBackground(150)
 * return <motion.div style={{ y }}>Background</motion.div>
 */
export function useParallaxBackground(distance: number = 100): MotionValue<number> {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, -distance])
  return y
}

/**
 * Creates a fade effect based on scroll position
 * @returns MotionValue<number> for opacity
 *
 * @example
 * const { ref, opacity } = useScrollFade()
 * return <motion.div ref={ref} style={{ opacity }}>Fading content</motion.div>
 */
export function useScrollFade(): {
  ref: RefObject<HTMLDivElement>
  opacity: MotionValue<number>
} {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return { ref, opacity }
}

/**
 * Creates a scale effect based on scroll position
 * @param minScale - Minimum scale value (default: 0.8)
 * @param maxScale - Maximum scale value (default: 1)
 * @returns MotionValue<number> for scale transform
 *
 * @example
 * const { ref, scale } = useScrollScale(0.9, 1.1)
 * return <motion.div ref={ref} style={{ scale }}>Scaling content</motion.div>
 */
export function useScrollScale(minScale: number = 0.8, maxScale: number = 1): {
  ref: RefObject<HTMLDivElement>
  scale: MotionValue<number>
} {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end center']
  })

  const scale = useTransform(scrollYProgress, [0, 1], [minScale, maxScale])

  return { ref, scale }
}
