import { ReactNode } from "react";
import clsx from "clsx";

interface SectionProps {
  children: ReactNode;
  className?: string;
  bg?: "default" | "surface" | "elev";
  size?: "sm" | "md" | "lg" | "xl";
  noPadding?: boolean;
  id?: string;
  ariaLabel?: string;
}

const bgClasses = {
  default: "bg-bg",
  surface: "bg-surface",
  elev: "bg-elev",
};

const sizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
};

export default function Section({
  children,
  className,
  bg = "default",
  size = "lg",
  noPadding = false,
  id,
  ariaLabel,
}: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(
        "w-full",
        bgClasses[bg],
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
