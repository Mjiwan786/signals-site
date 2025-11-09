'use client';

import { motion } from 'framer-motion';

interface LiveIndicatorProps {
  isConnected: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LiveIndicator({ isConnected, className = '', size = 'md' }: LiveIndicatorProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={"inline-flex items-center gap-2 rounded-full font-semibold " + sizeClasses[size] + " " + className + " " + (isConnected ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30' : 'bg-gray-700 text-gray-300')}
    >
      <span className={dotSizes[size] + " rounded-full " + (isConnected ? 'bg-white animate-ping absolute' : 'bg-gray-500')} />
      <span className={dotSizes[size] + " rounded-full relative " + (isConnected ? 'bg-white' : 'bg-gray-500')} />
      <span>{isConnected ? 'LIVE' : 'CONNECTING'}</span>
    </motion.div>
  );
}
