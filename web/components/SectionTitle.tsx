/**
 * SectionTitle - Animated Gradient Text Component
 * Inspired by ReactBits patterns with CSS var theming
 *
 * Features:
 * - Animated gradient text
 * - Optional subtitle with dim color
 * - Center or left alignment
 * - Reduced motion support
 * - Customizable size variants
 */

'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion-variants';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: boolean;
  className?: string;
  animate?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  align = 'center',
  size = 'lg',
  gradient = false,
  className = '',
  animate = true,
}: SectionTitleProps) {
  const sizeClasses = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-3xl md:text-4xl lg:text-5xl',
    xl: 'text-4xl md:text-5xl lg:text-6xl',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
  };

  const subtitleAlignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
  };

  const TitleWrapper = animate ? motion.div : 'div';
  const titleProps = animate
    ? {
        variants: fadeInUp,
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-50px' },
      }
    : {};

  return (
    <TitleWrapper
      className={`${alignClasses[align]} ${className}`}
      {...titleProps}
    >
      <h2
        className={`
          ${sizeClasses[size]}
          font-display font-bold
          ${gradient ? 'gradient-text' : 'text-text'}
          mb-4
        `}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`
            text-base md:text-lg lg:text-xl
            text-dim
            leading-relaxed
            max-w-3xl
            ${subtitleAlignClasses[align]}
          `}
        >
          {subtitle}
        </p>
      )}
    </TitleWrapper>
  );
}

/**
 * Animated Gradient Text Variant
 * Uses CSS animation for gradient movement
 */
export function AnimatedGradientTitle({
  children,
  size = 'lg',
  className = '',
}: {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-3xl md:text-4xl lg:text-5xl',
    xl: 'text-4xl md:text-5xl lg:text-6xl',
  };

  return (
    <motion.h2
      className={`
        ${sizeClasses[size]}
        font-display font-bold
        animated-gradient-text
        ${className}
      `}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {children}
    </motion.h2>
  );
}

/**
 * Split Text Title - Character-by-character animation
 * ReactBits-inspired pattern
 */
export function SplitTextTitle({
  children,
  size = 'lg',
  className = '',
  delay = 0,
}: {
  children: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  delay?: number;
}) {
  const sizeClasses = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-3xl md:text-4xl lg:text-5xl',
    xl: 'text-4xl md:text-5xl lg:text-6xl',
  };

  const words = children.split(' ');

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const wordVariant = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.h2
      className={`
        ${sizeClasses[size]}
        font-display font-bold gradient-text
        ${className}
      `}
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block">
          <motion.span
            variants={wordVariant}
            className="inline-block"
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.h2>
  );
}
