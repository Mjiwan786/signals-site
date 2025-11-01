'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { pageview, GA_ID } from '@/lib/analytics';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!GA_ID || process.env.NODE_ENV !== 'production') return;
    pageview(pathname || '/');
  }, [pathname]);
  return null;
}
