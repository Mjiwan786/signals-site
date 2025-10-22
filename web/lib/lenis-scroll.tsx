/**
 * Lenis Smooth Scroll Component
 * Provides butter-smooth, accessible scroll for Awwwards-style depth
 * PRD: Respects prefers-reduced-motion, disables when user preference is set
 */

'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export function LenisScroll() {
  useEffect(() => {
    // Respect reduced-motion preference - PRD requirement
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Initialize Lenis with custom easing
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for premium feel
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    // Request animation frame loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup on unmount
    return () => {
      lenis.destroy()
    }
  }, [])

  return null // No UI, just behavior
}
