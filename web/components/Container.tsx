import { ReactNode } from 'react';
import clsx from 'clsx';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  noPadding?: boolean;
}

/**
 * Container component with max-width, responsive padding, and safe areas
 * Provides consistent layout boundaries across the application
 */
export default function Container({
  children,
  className,
  size = 'xl',
  noPadding = false,
}: ContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={clsx(
        'w-full mx-auto',
        maxWidthClasses[size],
        !noPadding && 'px-4 sm:px-6 lg:px-8',
        // Safe area insets for notched devices
        !noPadding && 'safe-area-inset',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Section container with optional background and spacing
 */
export function Section({
  children,
  className,
  background = false,
  spacing = 'default',
}: {
  children: ReactNode;
  className?: string;
  background?: boolean;
  spacing?: 'none' | 'sm' | 'default' | 'lg';
}) {
  const spacingClasses = {
    none: '',
    sm: 'py-8 md:py-12',
    default: 'py-12 md:py-16 lg:py-20',
    lg: 'py-16 md:py-24 lg:py-32',
  };

  return (
    <section
      className={clsx(
        'relative w-full',
        spacingClasses[spacing],
        background && 'bg-surface/30',
        className
      )}
    >
      {children}
    </section>
  );
}
