/**
 * Trading Pairs Configuration
 * Single source of truth for all supported trading pairs
 * PRD-003: Fix duplicate trading pairs across the app
 */

export interface TradingPair {
  symbol: string; // API format (e.g., "BTC-USD")
  display: string; // Display format (e.g., "BTC/USD")
  name: string; // Full name (e.g., "Bitcoin")
  baseAsset: string; // Base currency (e.g., "BTC")
  quoteAsset: string; // Quote currency (e.g., "USD")
  description?: string;
}

/**
 * All supported trading pairs
 * These are the pairs our AI bot actively trades
 */
export const TRADING_PAIRS: TradingPair[] = [
  {
    symbol: 'BTC-USD',
    display: 'BTC/USD',
    name: 'Bitcoin',
    baseAsset: 'BTC',
    quoteAsset: 'USD',
    description: 'The original cryptocurrency, highest market cap and liquidity',
  },
  {
    symbol: 'ETH-USD',
    display: 'ETH/USD',
    name: 'Ethereum',
    baseAsset: 'ETH',
    quoteAsset: 'USD',
    description: 'Leading smart contract platform, second largest crypto by market cap',
  },
  {
    symbol: 'SOL-USD',
    display: 'SOL/USD',
    name: 'Solana',
    baseAsset: 'SOL',
    quoteAsset: 'USD',
    description: 'High-performance blockchain for decentralized apps',
  },
  {
    symbol: 'MATIC-USD',
    display: 'MATIC/USD',
    name: 'Polygon',
    baseAsset: 'MATIC',
    quoteAsset: 'USD',
    description: 'Ethereum scaling solution with fast, low-cost transactions',
  },
  {
    symbol: 'LINK-USD',
    display: 'LINK/USD',
    name: 'Chainlink',
    baseAsset: 'LINK',
    quoteAsset: 'USD',
    description: 'Decentralized oracle network connecting smart contracts to real-world data',
  },
];

/**
 * Get all trading pairs
 */
export function getAllPairs(): TradingPair[] {
  return TRADING_PAIRS;
}

/**
 * Get a trading pair by symbol
 */
export function getPairBySymbol(symbol: string): TradingPair | undefined {
  return TRADING_PAIRS.find(
    (pair) => pair.symbol === symbol || pair.display === symbol
  );
}

/**
 * Get display names for all pairs
 */
export function getPairDisplayNames(): string[] {
  return TRADING_PAIRS.map((pair) => pair.display);
}

/**
 * Get API symbols for all pairs
 */
export function getPairSymbols(): string[] {
  return TRADING_PAIRS.map((pair) => pair.symbol);
}

/**
 * Convert display format to API format
 * Example: "BTC/USD" → "BTC-USD"
 */
export function displayToSymbol(display: string): string {
  const pair = TRADING_PAIRS.find((p) => p.display === display);
  return pair?.symbol || display.replace('/', '-');
}

/**
 * Convert API format to display format
 * Example: "BTC-USD" → "BTC/USD"
 */
export function symbolToDisplay(symbol: string): string {
  const pair = TRADING_PAIRS.find((p) => p.symbol === symbol);
  return pair?.display || symbol.replace('-', '/');
}
