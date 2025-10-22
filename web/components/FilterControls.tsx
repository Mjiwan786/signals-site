'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Filter,
  Activity,
  Calendar,
  TrendingUp,
  Check,
} from 'lucide-react';

/**
 * FilterControls - Animated filter controls for signals
 *
 * Features:
 * - Mode toggle (Paper/Live) with animated switch
 * - Trading pair dropdown with search
 * - Timeframe selector
 * - Keyboard accessible
 * - Smooth animations
 * - Global state management ready
 */

interface FilterControlsProps {
  mode?: 'paper' | 'live';
  onModeChange?: (mode: 'paper' | 'live') => void;
  pair?: string;
  onPairChange?: (pair: string) => void;
  timeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
  showTimeframe?: boolean;
}

const popularPairs = [
  'All Pairs',
  'BTC-USD',
  'ETH-USD',
  'SOL-USD',
  'MATIC-USD',
  'AVAX-USD',
  'LINK-USD',
  'UNI-USD',
  'AAVE-USD',
];

const timeframes = [
  { label: 'Last Hour', value: '1h' },
  { label: 'Last 24 Hours', value: '24h' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'All Time', value: 'all' },
];

export default function FilterControls({
  mode = 'paper',
  onModeChange,
  pair = 'All Pairs',
  onPairChange,
  timeframe = '24h',
  onTimeframeChange,
  showTimeframe = true,
}: FilterControlsProps) {
  const [isPairDropdownOpen, setIsPairDropdownOpen] = useState(false);
  const [isTimeframeDropdownOpen, setIsTimeframeDropdownOpen] = useState(false);
  const [pairSearch, setPairSearch] = useState('');

  const pairDropdownRef = useRef<HTMLDivElement>(null);
  const timeframeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pairDropdownRef.current &&
        !pairDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPairDropdownOpen(false);
      }
      if (
        timeframeDropdownRef.current &&
        !timeframeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTimeframeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPairs = popularPairs.filter((p) =>
    p.toLowerCase().includes(pairSearch.toLowerCase())
  );

  const selectedTimeframe = timeframes.find((tf) => tf.value === timeframe);

  return (
    <div className="flex flex-wrap items-center gap-4 p-6 glass-card-hover rounded-xl border border-accent/20">
      {/* Filter Icon Header */}
      <div className="flex items-center gap-2 text-text2">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-semibold uppercase tracking-wider">
          Filters
        </span>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-accent/30" />

      {/* Mode Toggle */}
      <div className="flex items-center gap-3">
        <Activity className="w-4 h-4 text-dim" />
        <span className="text-sm text-dim">Mode:</span>

        <div className="relative inline-flex items-center">
          {/* Toggle Track */}
          <motion.button
            className="relative inline-flex h-8 w-32 items-center rounded-full border-2 border-accent/30 transition-colors focus:outline-none focus:ring-2 focus:ring-accentA focus:ring-offset-2 focus:ring-offset-surface"
            style={{
              backgroundColor:
                mode === 'live' ? 'rgba(110, 231, 255, 0.1)' : 'rgba(167, 139, 250, 0.1)',
            }}
            onClick={() => onModeChange?.(mode === 'paper' ? 'live' : 'paper')}
            role="switch"
            aria-checked={mode === 'live'}
            aria-label="Toggle between paper and live trading mode"
          >
            {/* Sliding Background */}
            <motion.div
              className="absolute inset-1 rounded-full bg-gradient-brand"
              initial={false}
              animate={{
                x: mode === 'live' ? '50%' : '0%',
              }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
              style={{ width: 'calc(50% - 4px)' }}
            />

            {/* Labels */}
            <span
              className={`relative z-10 flex-1 text-center text-xs font-bold transition-colors ${
                mode === 'paper' ? 'text-white' : 'text-dim'
              }`}
            >
              PAPER
            </span>
            <span
              className={`relative z-10 flex-1 text-center text-xs font-bold transition-colors ${
                mode === 'live' ? 'text-white' : 'text-dim'
              }`}
            >
              LIVE
            </span>
          </motion.button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-accent/30" />

      {/* Pair Dropdown */}
      <div className="relative" ref={pairDropdownRef}>
        <label className="sr-only" htmlFor="pair-filter">
          Trading Pair
        </label>
        <motion.button
          id="pair-filter"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-accent/30 hover:border-accent/50 transition-all focus:outline-none focus:ring-2 focus:ring-accentA"
          onClick={() => setIsPairDropdownOpen(!isPairDropdownOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-haspopup="listbox"
          aria-expanded={isPairDropdownOpen}
        >
          <TrendingUp className="w-4 h-4 text-accentA" />
          <span className="text-sm font-medium text-text min-w-[80px] text-left">
            {pair}
          </span>
          <motion.div
            animate={{ rotate: isPairDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-dim" />
          </motion.div>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isPairDropdownOpen && (
            <motion.div
              className="absolute top-full left-0 mt-2 w-64 glass-card-hover rounded-xl border border-accent/30 shadow-glow z-50 overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              role="listbox"
            >
              {/* Search Input */}
              <div className="p-3 border-b border-accent/20">
                <input
                  type="text"
                  placeholder="Search pairs..."
                  value={pairSearch}
                  onChange={(e) => setPairSearch(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-accent/30 rounded-lg text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accentA"
                  autoFocus
                />
              </div>

              {/* Options List */}
              <div className="max-h-64 overflow-y-auto">
                {filteredPairs.map((p) => (
                  <motion.button
                    key={p}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                      pair === p
                        ? 'bg-accentA/10 text-accentA'
                        : 'text-text hover:bg-surface'
                    }`}
                    onClick={() => {
                      onPairChange?.(p);
                      setIsPairDropdownOpen(false);
                      setPairSearch('');
                    }}
                    whileHover={{ x: 4 }}
                    role="option"
                    aria-selected={pair === p}
                  >
                    <span className="font-medium">{p}</span>
                    {pair === p && <Check className="w-4 h-4" />}
                  </motion.button>
                ))}

                {filteredPairs.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-dim">
                    No pairs found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timeframe Dropdown */}
      {showTimeframe && (
        <>
          {/* Divider */}
          <div className="h-8 w-px bg-accent/30" />

          <div className="relative" ref={timeframeDropdownRef}>
            <label className="sr-only" htmlFor="timeframe-filter">
              Timeframe
            </label>
            <motion.button
              id="timeframe-filter"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-accent/30 hover:border-accent/50 transition-all focus:outline-none focus:ring-2 focus:ring-accentA"
              onClick={() => setIsTimeframeDropdownOpen(!isTimeframeDropdownOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-haspopup="listbox"
              aria-expanded={isTimeframeDropdownOpen}
            >
              <Calendar className="w-4 h-4 text-accentB" />
              <span className="text-sm font-medium text-text min-w-[100px] text-left">
                {selectedTimeframe?.label || 'Select...'}
              </span>
              <motion.div
                animate={{ rotate: isTimeframeDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-dim" />
              </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isTimeframeDropdownOpen && (
                <motion.div
                  className="absolute top-full left-0 mt-2 w-56 glass-card-hover rounded-xl border border-accent/30 shadow-glow z-50 overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  role="listbox"
                >
                  <div className="max-h-64 overflow-y-auto">
                    {timeframes.map((tf) => (
                      <motion.button
                        key={tf.value}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                          timeframe === tf.value
                            ? 'bg-accentB/10 text-accentB'
                            : 'text-text hover:bg-surface'
                        }`}
                        onClick={() => {
                          onTimeframeChange?.(tf.value);
                          setIsTimeframeDropdownOpen(false);
                        }}
                        whileHover={{ x: 4 }}
                        role="option"
                        aria-selected={timeframe === tf.value}
                      >
                        <span className="font-medium">{tf.label}</span>
                        {timeframe === tf.value && <Check className="w-4 h-4" />}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
