/**
 * Lenis Smooth Scroll Utilities
 * Centralized helper functions for smooth scrolling with Lenis
 * Respects prefers-reduced-motion for accessibility
 */

import Lenis from 'lenis';

/**
 * Check if user prefers reduced motion
 * @returns true if reduced-motion is enabled
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initialize Lenis smooth scroll instance
 * Automatically disabled if user prefers reduced motion
 * @returns Lenis instance or null if disabled
 */
export function initLenis(): Lenis | null {
  if (prefersReducedMotion()) {
    console.log('Lenis: Smooth scroll disabled (prefers-reduced-motion)');
    return null;
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  return lenis;
}

/**
 * Scroll to target element smoothly
 * @param target CSS selector or HTMLElement
 * @param offset Optional offset from top in pixels
 */
export function scrollTo(target: string | HTMLElement, offset: number = 0): void {
  const element = typeof target === 'string'
    ? document.querySelector(target)
    : target;

  if (!element) {
    console.warn(`Lenis: Target element not found: ${target}`);
    return;
  }

  if (prefersReducedMotion()) {
    // Instant scroll for reduced motion
    element.scrollIntoView({ block: 'start' });
    return;
  }

  // Smooth scroll with Lenis
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  window.scrollTo({
    top: elementPosition - offset,
    behavior: 'smooth'
  });
}
