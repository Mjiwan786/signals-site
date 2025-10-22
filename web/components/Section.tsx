/**
 * Section Component with Scroll-Triggered Animations
 * PRD Step 10: Section entrance animations (animate once)
 * Respects prefers-reduced-motion
 */

'use client';

import { ReactNode } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/lib/hooks";
import { fadeInUp } from "@/lib/motion-variants";

interface SectionProps {
  children: ReactNode;
  className?: string;
  bg?: "default" | "surface" | "elev" | "transparent";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  noPadding?: boolean;
  grid?: "none" | "default" | "sm" | "lg" | "dots";
  border?: "none" | "top" | "bottom" | "both";
  id?: string;
  ariaLabel?: string;
  animate?: boolean; // Enable/disable entrance animation (default: true)
}

const bgClasses = {
  default: "bg-bg",
  surface: "bg-surface",
  elev: "bg-elev",
  transparent: "bg-transparent",
};

const sizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

const gridClasses = {
  none: "",
  default: "bg-grid",
  sm: "bg-grid-sm",
  lg: "bg-grid-lg",
  dots: "bg-grid-dots",
};

const borderClasses = {
  none: "",
  top: "border-t border-accent",
  bottom: "border-b border-accent",
  both: "border-t border-b border-accent",
};

export default function Section({
  children,
  className,
  bg = "default",
  size = "lg",
  noPadding = false,
  grid = "none",
  border = "none",
  id,
  ariaLabel,
  animate = true,
}: SectionProps) {
  const { ref, isInView } = useScrollAnimation(0.1, true);

  // If animations are disabled, render without motion wrapper
  if (!animate) {
    return (
      <section
        id={id}
        className={clsx(
          "w-full relative",
          bgClasses[bg],
          gridClasses[grid],
          borderClasses[border],
          !noPadding && "py-12 md:py-16 lg:py-20",
          className
        )}
        aria-label={ariaLabel}
      >
        <div className={clsx(sizeClasses[size], "mx-auto px-4 sm:px-6 lg:px-8")}>
          {children}
        </div>
      </section>
    );
  }

  return (
    <motion.section
      ref={ref as any}
      id={id}
      className={clsx(
        "w-full relative",
        bgClasses[bg],
        gridClasses[grid],
        borderClasses[border],
        !noPadding && "py-12 md:py-16 lg:py-20",
        className
      )}
      aria-label={ariaLabel}
      variants={fadeInUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className={clsx(sizeClasses[size], "mx-auto px-4 sm:px-6 lg:px-8")}>
        {children}
      </div>
    </motion.section>
  );
}
