/**
 * Root Template for Route Transitions
 * Wraps all pages with PageTransition component for smooth navigation
 * PRD Step 10: Motion language & scroll
 */

import PageTransition from '@/components/PageTransition';

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
