'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

/**
 * FilterContext - Global state management for filters
 *
 * Provides centralized filter state that can be accessed by:
 * - SignalsTable
 * - SignalsTicker
 * - FilterControls
 * - Any other component needing filter state
 */

interface FilterState {
  mode: 'paper' | 'live';
  pair: string;
  timeframe: string;
}

interface FilterContextType extends FilterState {
  setMode: (mode: 'paper' | 'live') => void;
  setPair: (pair: string) => void;
  setTimeframe: (timeframe: string) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const defaultFilters: FilterState = {
  mode: 'paper',
  pair: 'All Pairs',
  timeframe: '24h',
};

export function FilterProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'paper' | 'live'>(defaultFilters.mode);
  const [pair, setPair] = useState(defaultFilters.pair);
  const [timeframe, setTimeframe] = useState(defaultFilters.timeframe);

  const resetFilters = () => {
    setMode(defaultFilters.mode);
    setPair(defaultFilters.pair);
    setTimeframe(defaultFilters.timeframe);
  };

  return (
    <FilterContext.Provider
      value={{
        mode,
        setMode,
        pair,
        setPair,
        timeframe,
        setTimeframe,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
