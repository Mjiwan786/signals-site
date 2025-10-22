# FilterControls Component - Animated Filter Interface

Comprehensive filter controls with animated toggle, searchable dropdowns, and keyboard accessibility.

## Overview

FilterControls provides a unified interface for filtering trading signals by mode (paper/live), trading pair, and timeframe. Features smooth animations, keyboard navigation, and can be used standalone or with the FilterContext provider for global state management.

## Features

### Visual Design
- **Glass Morphism Panel**: Semi-transparent background with backdrop blur
- **Animated Mode Toggle**: Spring-animated sliding switch between Paper/Live
- **Searchable Dropdowns**: Pair selection with real-time search
- **Icon Labels**: Lucide icons for visual identification
- **Smooth Transitions**: All interactions animated with Framer Motion

### Accessibility
- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Escape, Arrow keys)
- **ARIA Labels**: Proper roles and labels for screen readers
- **Focus Management**: Visible focus rings with brand colors
- **Auto-focus**: Search input auto-focuses on dropdown open
- **Screen Reader**: Semantic HTML with role attributes

### Functionality
- **Outside Click Detection**: Dropdowns close when clicking outside
- **Search Filtering**: Real-time pair search with case-insensitive matching
- **State Management**: Works standalone or with FilterContext
- **Controlled Components**: Fully controlled with props
- **Event Callbacks**: onChange handlers for all filters

## Component API

### Props

```tsx
interface FilterControlsProps {
  mode?: 'paper' | 'live';                    // Current mode (default: 'paper')
  onModeChange?: (mode: 'paper' | 'live') => void;  // Mode change callback
  pair?: string;                              // Selected pair (default: 'All Pairs')
  onPairChange?: (pair: string) => void;      // Pair change callback
  timeframe?: string;                         // Selected timeframe (default: '24h')
  onTimeframeChange?: (timeframe: string) => void;  // Timeframe change callback
  showTimeframe?: boolean;                    // Show timeframe selector (default: true)
}
```

### Default Values

```tsx
{
  mode: 'paper',
  pair: 'All Pairs',
  timeframe: '24h',
  showTimeframe: true
}
```

## Usage

### Standalone (Controlled)

```tsx
import FilterControls from '@/components/FilterControls';

export default function MyComponent() {
  const [mode, setMode] = useState<'paper' | 'live'>('paper');
  const [pair, setPair] = useState('All Pairs');
  const [timeframe, setTimeframe] = useState('24h');

  return (
    <FilterControls
      mode={mode}
      onModeChange={setMode}
      pair={pair}
      onPairChange={setPair}
      timeframe={timeframe}
      onTimeframeChange={setTimeframe}
    />
  );
}
```

### With FilterContext (Global State)

```tsx
// 1. Wrap app with FilterProvider
import { FilterProvider } from '@/lib/FilterContext';

export default function RootLayout({ children }) {
  return (
    <FilterProvider>
      {children}
    </FilterProvider>
  );
}

// 2. Use in any component
import { useFilters } from '@/lib/FilterContext';
import FilterControls from '@/components/FilterControls';

export default function SignalsPage() {
  const { mode, setMode, pair, setPair, timeframe, setTimeframe } = useFilters();

  return (
    <FilterControls
      mode={mode}
      onModeChange={setMode}
      pair={pair}
      onPairChange={setPair}
      timeframe={timeframe}
      onTimeframeChange={setTimeframe}
    />
  );
}

// 3. Access filters in other components
export default function SignalsTable() {
  const { mode, pair } = useFilters();

  useEffect(() => {
    // Fetch signals based on current filters
    fetchSignals({ mode, pair });
  }, [mode, pair]);
}
```

### Without Timeframe

```tsx
<FilterControls
  mode={mode}
  onModeChange={setMode}
  pair={pair}
  onPairChange={setPair}
  showTimeframe={false}
/>
```

## Mode Toggle

### Visual Design

```tsx
<motion.button
  className="relative inline-flex h-8 w-32 items-center rounded-full border-2"
  style={{
    backgroundColor: mode === 'live' ? 'rgba(110, 231, 255, 0.1)' : 'rgba(167, 139, 250, 0.1)'
  }}
>
  {/* Sliding indicator */}
  <motion.div
    className="absolute inset-1 rounded-full bg-gradient-brand"
    animate={{ x: mode === 'live' ? '50%' : '0%' }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
  />

  {/* Labels */}
  <span className={mode === 'paper' ? 'text-white' : 'text-dim'}>PAPER</span>
  <span className={mode === 'live' ? 'text-white' : 'text-dim'}>LIVE</span>
</motion.button>
```

**States:**
- **Paper Mode**: Indicator on left, violet background tint
- **Live Mode**: Indicator on right, cyan background tint
- **Transition**: Spring animation (500 stiffness, 30 damping)

**Interaction:**
- Click anywhere on toggle to switch
- Keyboard: Space/Enter to toggle
- Focus: Cyan ring with offset

**ARIA:**
```tsx
role="switch"
aria-checked={mode === 'live'}
aria-label="Toggle between paper and live trading mode"
```

## Pair Dropdown

### Button

```tsx
<motion.button
  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border"
  onClick={() => setIsPairDropdownOpen(!isPairDropdownOpen)}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  <TrendingUp className="w-4 h-4 text-accentA" />
  <span className="text-sm font-medium">{pair}</span>
  <ChevronDown className="w-4 h-4" rotate={isPairDropdownOpen ? 180 : 0} />
</motion.button>
```

**Hover Effects:**
- Scale: 100% → 102%
- Border: accent/30 → accent/50

**Active Effects:**
- Scale: 100% → 98%
- Chevron rotation: 0° → 180°

### Dropdown Menu

```tsx
<motion.div
  className="absolute top-full left-0 mt-2 w-64 glass-card-hover"
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.2 }}
>
  {/* Search Input */}
  <input
    type="text"
    placeholder="Search pairs..."
    value={pairSearch}
    onChange={(e) => setPairSearch(e.target.value)}
    autoFocus
  />

  {/* Options */}
  {filteredPairs.map(p => (
    <motion.button
      className={pair === p ? 'bg-accentA/10 text-accentA' : 'text-text hover:bg-surface'}
      onClick={() => onPairChange(p)}
      whileHover={{ x: 4 }}
    >
      {p}
      {pair === p && <Check />}
    </motion.button>
  ))}
</motion.div>
```

**Animation:**
- **Entry**: Fade in + slide down (10px)
- **Exit**: Fade out + slide up (10px)
- **Duration**: 200ms
- **Hover**: Slide right (4px)

**Search:**
- Auto-focus on open
- Real-time filtering
- Case-insensitive
- No results message

**Popular Pairs:**
```tsx
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
```

### Selection Behavior

```tsx
onClick={() => {
  onPairChange?.(p);
  setIsPairDropdownOpen(false);
  setPairSearch('');  // Clear search on selection
}}
```

**Visual Feedback:**
- Selected item: Cyan background, check icon
- Hover: Surface background, slide animation
- Active: Immediate selection + close

## Timeframe Dropdown

### Button

```tsx
<motion.button
  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border"
  onClick={() => setIsTimeframeDropdownOpen(!isTimeframeDropdownOpen)}
>
  <Calendar className="w-4 h-4 text-accentB" />
  <span className="text-sm font-medium">{selectedTimeframe?.label}</span>
  <ChevronDown className="w-4 h-4" rotate={isTimeframeDropdownOpen ? 180 : 0} />
</motion.button>
```

**Icon Color:** Violet (accentB) to differentiate from pair (cyan)

### Dropdown Menu

```tsx
<motion.div className="absolute top-full left-0 mt-2 w-56 glass-card-hover">
  {timeframes.map(tf => (
    <motion.button
      className={timeframe === tf.value ? 'bg-accentB/10 text-accentB' : 'text-text'}
      onClick={() => onTimeframeChange(tf.value)}
      whileHover={{ x: 4 }}
    >
      {tf.label}
      {timeframe === tf.value && <Check />}
    </motion.button>
  ))}
</motion.div>
```

**Timeframe Options:**
```tsx
const timeframes = [
  { label: 'Last Hour', value: '1h' },
  { label: 'Last 24 Hours', value: '24h' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 3 Months', value: '3m' },
  { label: 'All Time', value: 'all' },
];
```

**Selection Behavior:**
- Selected item: Violet background, check icon
- No search input (fixed list)
- Immediate close on selection

## Keyboard Accessibility

### Tab Navigation

```
Filter Label → Mode Toggle → Pair Dropdown → Timeframe Dropdown
```

### Keyboard Shortcuts

**Mode Toggle:**
- `Tab`: Focus toggle
- `Space` / `Enter`: Switch mode
- `Escape`: Blur toggle

**Dropdowns:**
- `Tab`: Focus button
- `Enter` / `Space`: Open dropdown
- `Escape`: Close dropdown
- `ArrowDown`: Next option (when open)
- `ArrowUp`: Previous option (when open)
- `Enter`: Select option
- `Home`: First option
- `End`: Last option

**Search Input (Pair Dropdown):**
- `Tab`: Move to first option
- `Escape`: Close dropdown
- `Enter`: Select first filtered result
- Typing: Filter options

### Focus Management

```tsx
// Auto-focus search input on dropdown open
<input autoFocus />

// Trap focus within dropdown
useEffect(() => {
  if (isPairDropdownOpen) {
    // Focus search input
  }
}, [isPairDropdownOpen]);

// Return focus to button on close
onClick={() => {
  onPairChange(p);
  setIsPairDropdownOpen(false);
  buttonRef.current?.focus();
}}
```

## Click Outside Detection

```tsx
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (pairDropdownRef.current && !pairDropdownRef.current.contains(event.target as Node)) {
      setIsPairDropdownOpen(false);
    }
    if (timeframeDropdownRef.current && !timeframeDropdownRef.current.contains(event.target as Node)) {
      setIsTimeframeDropdownOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

**Behavior:**
- Click outside dropdown → Close dropdown
- Click inside dropdown → Keep open
- Click on button → Toggle open/close

## FilterContext

### Provider

```tsx
export function FilterProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'paper' | 'live'>('paper');
  const [pair, setPair] = useState('All Pairs');
  const [timeframe, setTimeframe] = useState('24h');

  const resetFilters = () => {
    setMode('paper');
    setPair('All Pairs');
    setTimeframe('24h');
  };

  return (
    <FilterContext.Provider value={{ mode, setMode, pair, setPair, timeframe, setTimeframe, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
}
```

### Hook

```tsx
export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
```

### Usage

```tsx
import { useFilters } from '@/lib/FilterContext';

function MyComponent() {
  const { mode, setMode, pair, setPair, resetFilters } = useFilters();

  return (
    <>
      <button onClick={resetFilters}>Reset Filters</button>
      <div>Mode: {mode}, Pair: {pair}</div>
    </>
  );
}
```

## Responsive Design

### Desktop (> 1024px)
- Horizontal layout
- All filters visible inline
- Dropdowns appear below buttons

### Tablet (768px - 1024px)
- Wrap to multiple rows if needed
- Maintain horizontal flow
- Reduced spacing

### Mobile (< 768px)
- Vertical stack recommended
- Full-width dropdowns
- Touch-friendly sizes (min 44px tap targets)

## Styling

### Glass Card

```tsx
className="p-6 glass-card-hover rounded-xl border border-accent/20"
```

**Properties:**
- Background: `rgba(15, 17, 22, 0.6)`
- Backdrop blur: 12px
- Border: Accent 20% opacity
- Padding: 24px (p-6)

### Dividers

```tsx
<div className="h-8 w-px bg-accent/30" />
```

**Properties:**
- Height: 32px (h-8)
- Width: 1px
- Color: Accent 30% opacity

### Dropdown Menu

```tsx
className="glass-card-hover rounded-xl border border-accent/30 shadow-glow"
```

**Properties:**
- Same glass effect as main panel
- Glow shadow on appearance
- Max height: 256px with scroll
- Z-index: 50 (above content)

## Performance

### Optimization Techniques
1. **Ref-based click detection**: No re-renders on document clicks
2. **Memoized filter function**: Pair search only runs when search changes
3. **AnimatePresence**: Proper cleanup of dropdown animations
4. **Event listener cleanup**: All listeners removed on unmount

### Bundle Impact
- Lucide icons: ~2KB per icon × 5 = 10KB
- Framer Motion: Already included
- Total increase: ~10KB

## Customization

### Add New Pairs

```tsx
const popularPairs = [
  'All Pairs',
  'BTC-USD',
  'ETH-USD',
  // Add more pairs
  'DOGE-USD',
  'SHIB-USD',
];
```

### Change Timeframes

```tsx
const timeframes = [
  { label: 'Last 5 Minutes', value: '5m' },
  { label: 'Last 15 Minutes', value: '15m' },
  // Customize labels and values
];
```

### Modify Toggle Colors

```tsx
style={{
  backgroundColor: mode === 'live'
    ? 'rgba(34, 197, 94, 0.1)'  // Green
    : 'rgba(239, 68, 68, 0.1)'  // Red
}}
```

### Add Icons

```tsx
import { Star, Heart } from 'lucide-react';

<Star className="w-4 h-4 text-warning" />
```

## Integration Examples

### With SignalsTable

```tsx
function SignalsPage() {
  const [mode, setMode] = useState('paper');
  const [pair, setPair] = useState('All Pairs');

  return (
    <>
      <FilterControls
        mode={mode}
        onModeChange={setMode}
        pair={pair}
        onPairChange={setPair}
        showTimeframe={false}
      />
      <SignalsTable mode={mode} pair={pair === 'All Pairs' ? '' : pair} />
    </>
  );
}
```

### With SignalsTicker

```tsx
function DashboardHeader() {
  const { mode } = useFilters();

  return (
    <>
      <Navbar />
      <FilterControls {...useFilters()} />
      <SignalsTicker mode={mode} />
    </>
  );
}
```

## Best Practices

1. **Use FilterContext for global state**: Avoid prop drilling
2. **Validate selections**: Ensure pair exists before filtering
3. **Provide feedback**: Show loading state when filtering
4. **Persist filters**: Use localStorage or URL params
5. **Default to safe values**: Always have fallback selections

## Future Enhancements

- [ ] Multi-select pairs
- [ ] Custom date range picker for timeframe
- [ ] Save filter presets
- [ ] URL sync for shareable filter states
- [ ] Advanced filters (confidence threshold, strategy type)
- [ ] Filter history (undo/redo)
- [ ] Keyboard shortcuts (Cmd+K to focus search)
- [ ] Mobile bottom sheet for dropdowns
- [ ] Filter badges showing active selections
- [ ] Export filtered results
