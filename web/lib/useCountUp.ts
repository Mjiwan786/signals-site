import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  separator?: string;
  triggerOnView?: boolean;
}

export function useCountUp({
  start = 0,
  end,
  duration = 2,
  decimals = 0,
  suffix = '',
  prefix = '',
  separator = ',',
  triggerOnView = true,
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const countRef = useRef({ value: start });
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!triggerOnView || hasAnimated) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCount();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated, triggerOnView]);

  const animateCount = () => {
    gsap.to(countRef.current, {
      value: end,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        setCount(countRef.current.value);
      },
    });
  };

  const formatNumber = (value: number): string => {
    const num = value.toFixed(decimals);
    const parts = num.split('.');

    // Add thousands separator
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    return prefix + parts.join('.') + suffix;
  };

  return {
    count: formatNumber(count),
    elementRef,
    trigger: animateCount,
  };
}
