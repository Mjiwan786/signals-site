/**
 * Motion Variants Library
 * Reusable Framer Motion animation presets for Signals-Site
 * PRD: Quick, confident animations (200-400ms), reduced-motion support
 */

import { Variants } from 'framer-motion'

/**
 * Fade in from bottom (for sections, cards)
 * Usage: <motion.div variants={fadeInUp} initial="hidden" animate="visible">
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

/**
 * Fade in from top (for dropdown menus, modals)
 */
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

/**
 * Stagger children animations (for grids, lists)
 * Usage: <motion.div variants={staggerContainer} initial="hidden" animate="visible">
 *          <motion.div variants={fadeInUp}>...</motion.div>
 *        </motion.div>
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

/**
 * Fast stagger for dense lists (signals table, tickers)
 */
export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

/**
 * Scale + glow on hover (for cards, buttons)
 * Usage: <motion.div variants={hoverGlow} initial="rest" whileHover="hover">
 */
export const hoverGlow: Variants = {
  rest: { scale: 1, boxShadow: '0 0 20px rgba(110, 231, 255, 0.05)' },
  hover: {
    scale: 1.03,
    boxShadow: '0 0 40px rgba(110, 231, 255, 0.25)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

/**
 * Subtle hover lift (for glass cards)
 */
export const hoverLift: Variants = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
}

/**
 * Page transitions (for route changes)
 * Usage: <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

/**
 * Parallax variants generator (for scroll-linked elements)
 * @param offset - Distance to travel in pixels (default: 50)
 * Usage: <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [-offset, offset]) }}>
 */
export const parallaxVariants = (offset: number = 50): Variants => ({
  hidden: { y: offset },
  visible: { y: -offset, transition: { duration: 0 } },
})

/**
 * Neural beam pulse (for 3D hero effects, accent elements)
 */
export const neuralPulse: Variants = {
  initial: { opacity: 0.3, scale: 0.95 },
  animate: {
    opacity: [0.3, 0.8, 0.3],
    scale: [0.95, 1.05, 0.95],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/**
 * Glow pulse (for status indicators, live badges)
 */
export const glowPulse: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/**
 * Slide in from left (for sidebar, drawer)
 */
export const slideInLeft: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

/**
 * Slide in from right (for sidebar, drawer)
 */
export const slideInRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

/**
 * Scale in (for modals, popups)
 */
export const scaleIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

/**
 * Rotate + fade (for loading spinners, icons)
 */
export const rotateFade: Variants = {
  hidden: { rotate: -180, opacity: 0 },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

/**
 * Accordion expand (for collapsible sections)
 */
export const accordionExpand: Variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
}

/**
 * Text reveal (for hero headlines)
 * Splits by word/character in component
 */
export const textReveal: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

/**
 * Float animation (for decorative elements)
 */
export const float: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/**
 * Shimmer effect (for loading skeletons)
 */
export const shimmer: Variants = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}
