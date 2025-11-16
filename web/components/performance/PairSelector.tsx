/**
 * PairSelector Component
 * Dropdown for selecting trading pairs for backtest view
 * Features: Clean UI, keyboard navigation, active state
 */

'use client';

import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { getAllPairs } from '@/lib/trading-pairs';

// Use centralized trading pairs config
export const AVAILABLE_PAIRS = getAllPairs().map((pair) => ({
  value: pair.symbol,
  label: pair.display,
  name: pair.name,
}));

interface PairSelectorProps {
  value: string;
  onChange: (pair: string) => void;
}

export default function PairSelector({ value, onChange }: PairSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedPair = AVAILABLE_PAIRS.find((p) => p.value === value) || AVAILABLE_PAIRS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (pairValue: string) => {
    onChange(pairValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Label */}
      <label className="block text-xs text-dim mb-2 font-medium">Select Trading Pair</label>

      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-64 flex items-center justify-between px-4 py-3 bg-surface border border-accent/30 rounded-lg hover:border-accent/50 transition-all duration-300 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {selectedPair.label.split('/')[0]}
            </span>
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-text">{selectedPair.label}</div>
            <div className="text-xs text-dim">{selectedPair.name}</div>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-dim transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full sm:w-64 bg-surface border border-accent/30 rounded-lg shadow-glow overflow-hidden"
          >
            <div className="py-2">
              {AVAILABLE_PAIRS.map((pair) => (
                <button
                  key={pair.value}
                  onClick={() => handleSelect(pair.value)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 transition-all duration-200
                    ${
                      pair.value === value
                        ? 'bg-accent/20 text-accent'
                        : 'hover:bg-surface/50 text-text'
                    }
                  `}
                >
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${
                      pair.value === value
                        ? 'bg-gradient-brand'
                        : 'bg-elev'
                    }
                  `}
                  >
                    <span
                      className={`text-xs font-bold ${
                        pair.value === value ? 'text-white' : 'text-dim'
                      }`}
                    >
                      {pair.label.split('/')[0]}
                    </span>
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-semibold">{pair.label}</div>
                    <div className="text-xs text-dim">{pair.name}</div>
                  </div>
                  {pair.value === value && (
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
