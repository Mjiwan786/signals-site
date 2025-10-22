'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';

const Scene = dynamic(() => import('./Hero3DScene'), { ssr: false });

export default function Hero3D() {
  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-2xl">
      <ErrorBoundary>
        <Suspense fallback={
          <div className="h-full w-full bg-gradient-to-b from-[#0b0b0f] to-[#0f1116]" />
        }>
          <Scene />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
