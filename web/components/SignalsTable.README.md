# SignalsTable Component - Enhanced Live Trading Signals Feed

Redesigned signals table with dark theme, zebra stripes, and animated row loading.

## Overview

The SignalsTable displays real-time trading signals with a modern dark theme, glass morphism effects, and smooth animations. Each row slides in with a stagger effect, and interactive elements respond to hover states.

## Features

### Visual Design
- **Dark Theme**: Seamless integration with futuristic brand aesthetic
- **Zebra Stripes**: Alternating row backgrounds for better readability
- **Glass Morphism**: Semi-transparent backgrounds with backdrop blur
- **Gradient Accents**: Subtle cyan/violet gradients throughout
- **Minimalistic Icons**: Lucide React icons for clean, modern UI

### Animations
- **Row Entrance**: Staggered fade-in with slide from left (50ms delay per row)
- **Hover Effects**: Scale animations on badges and smooth color transitions
- **Loading States**: Custom spinner with brand colors
- **Error Messages**: Animated entry/exit for error notifications
- **Panel Fade-In**: Sequential reveal of control elements

### Functionality
- **Mode Toggle**: Switch between Paper Trading and Live Trading
- **Pair Filtering**: Filter signals by trading pair (e.g., BTC-USD, ETH-USD)
- **Real-Time Refresh**: Manual refresh button with loading state
- **Responsive Design**: Horizontal scroll on mobile, full table on desktop
- **Live Indicator**: Pulsing status dot showing last signal time

## Component Structure

### Main Component: `SignalsTable`

```tsx
export default function SignalsTable() {
  const [mode, setMode] = useState<'paper' | 'live'>('paper');
  const [pair, setPair] = useState<string>('');
  const [rows, setRows] = useState<SignalDTO[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // ...
}
```

**State Management:**
- `mode`: Trading mode (paper/live)
- `pair`: Trading pair filter (empty string = all pairs)
- `rows`: Array of signal data from API
- `err`: Error message string or null
- `loading`: Boolean loading state

### Child Component: `SignalRow`

```tsx
function SignalRow({ signal, index }: { signal: SignalDTO; index: number }) {
  const isBuy = signal.side?.toLowerCase() === 'buy';
  const isZebra = index % 2 === 0;
  // ...
}
```

**Props:**
- `signal`: Individual signal data object
- `index`: Row index for zebra striping and stagger delay

## Data Structure

### SignalDTO Type (from lib/api.ts)

```tsx
type SignalDTO = {
  id: string;
  ts: number;              // Unix timestamp
  pair: string;            // e.g., "BTC-USD"
  side: "buy" | "sell";
  entry: number;           // Entry price
  sl?: number;             // Stop loss (optional)
  tp?: number;             // Take profit (optional)
  strategy: string;        // Strategy name
  confidence: number;      // 0-1 range
  mode: "paper" | "live";
};
```

## Controls Panel

### Mode Toggle

```tsx
<select value={mode} onChange={(e) => setMode(e.target.value as any)}>
  <option value="paper">Paper Trading</option>
  <option value="live">Live Trading</option>
</select>
```

**Styling:**
- Glass card with hover border glow
- Activity icon label
- Focus ring in brand cyan
- Smooth transition effects

### Pair Filter

```tsx
<input
  value={pair}
  onChange={(e) => setPair(e.target.value)}
  placeholder="e.g. BTC-USD, ETH-USD"
/>
```

**Features:**
- Real-time filtering (onChange)
- Placeholder with examples
- Filter icon label
- Focus states matching brand

### Refresh Button

```tsx
<motion.button
  onClick={load}
  disabled={loading}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  <RefreshCw className={loading ? 'animate-spin' : ''} />
  Refresh
</motion.button>
```

**States:**
- **Normal**: Gradient background with glow shadow
- **Loading**: Spinning icon, disabled state
- **Hover**: Scale up (102%)
- **Active**: Scale down (98%)

### Status Indicator

```tsx
{lastTs && !loading && (
  <motion.div>
    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
    Last: {new Date(lastTs * 1000).toLocaleTimeString()}
  </motion.div>
)}
```

**Display:**
- Pulsing green dot
- Formatted timestamp
- Only shown when data exists and not loading

## Table Design

### Header Row

```tsx
<thead className="bg-surface/80 backdrop-blur-sm border-b-2 border-accent/30 sticky top-0 z-10">
  <tr>
    <th>Time</th>
    <th>Pair</th>
    <th>Side</th>
    <th>Entry</th>
    <th>Stop Loss</th>
    <th>Take Profit</th>
    <th>Strategy</th>
    <th>Confidence</th>
  </tr>
</thead>
```

**Styling:**
- Semi-transparent background with backdrop blur
- Sticky positioning for scroll
- Uppercase bold labels with tracking
- Bottom border accent

### Table Columns

| Column | Alignment | Type | Example |
|--------|-----------|------|---------|
| Time | Left | Timestamp | 3:45:12 PM |
| Pair | Left | String (bold) | BTC-USD |
| Side | Left | Badge | BUY / SELL |
| Entry | Right | Number (mono) | $42,150.2500 |
| Stop Loss | Right | Number (mono) | $41,000.0000 |
| Take Profit | Right | Number (mono) | $45,000.0000 |
| Strategy | Left | String (uppercase) | MOMENTUM |
| Confidence | Right | Badge | 85.3% |

## Row Animations

### Entrance Animation

```tsx
<motion.tr
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 20 }}
  transition={{
    duration: 0.3,
    delay: index * 0.05, // Stagger: 50ms per row
    ease: [0.25, 0.46, 0.45, 0.94], // easeOutCubic
  }}
  layout
/>
```

**Timeline:**
- Row 1: 0ms delay → 0-300ms fade/slide
- Row 2: 50ms delay → 50-350ms fade/slide
- Row 3: 100ms delay → 100-400ms fade/slide
- Row N: (N-1) * 50ms delay

**Effect:**
- Slides from left (-20px → 0)
- Fades in (opacity: 0 → 1)
- Exit slides to right (0 → 20px)
- Layout animation handles reordering

### AnimatePresence Configuration

```tsx
<AnimatePresence mode="popLayout">
  {rows.map((signal, index) => (
    <SignalRow key={signal.id || index} signal={signal} index={index} />
  ))}
</AnimatePresence>
```

**Mode: popLayout**
- Immediately removes exiting items
- Animates layout changes
- Prevents visual jumps

## Zebra Striping

```tsx
const isZebra = index % 2 === 0;

className={`
  ${isZebra ? 'bg-surface/30' : 'bg-surface/10'}
  hover:bg-accentA/5
`}
```

**Pattern:**
- Even rows (0, 2, 4...): `bg-surface/30` (darker)
- Odd rows (1, 3, 5...): `bg-surface/10` (lighter)
- All rows on hover: `bg-accentA/5` (cyan tint)

## Badge Components

### Side Badge (Buy/Sell)

```tsx
<motion.div
  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
    isBuy
      ? 'bg-success/20 text-success border border-success/30'
      : 'bg-danger/20 text-danger border border-danger/30'
  }`}
  whileHover={{ scale: 1.05 }}
>
  {isBuy ? <ArrowUpCircle /> : <ArrowDownCircle />}
  {signal.side?.toUpperCase()}
</motion.div>
```

**Buy Badge:**
- Green background (success/20)
- Green text and border (success)
- Arrow up circle icon

**Sell Badge:**
- Red background (danger/20)
- Red text and border (danger)
- Arrow down circle icon

**Hover:**
- Scales to 105%
- 200ms transition duration

### Confidence Badge

```tsx
const confidenceLevel =
  (signal.confidence || 0) >= 0.8
    ? { bg: 'bg-success/20', text: 'text-success', label: 'High' }
    : (signal.confidence || 0) >= 0.6
    ? { bg: 'bg-accentA/20', text: 'text-accentA', label: 'Medium' }
    : { bg: 'bg-highlight/20', text: 'text-highlight', label: 'Low' };

<motion.div
  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${confidenceLevel.bg} ${confidenceLevel.text} border`}
  whileHover={{ scale: 1.05 }}
>
  <TrendingUp />
  {(signal.confidence * 100).toFixed(1)}%
</motion.div>
```

**Confidence Levels:**
- **High** (≥80%): Green (success)
- **Medium** (60-79%): Cyan (accentA)
- **Low** (<60%): Orange (highlight)

## Empty and Loading States

### No Data

```tsx
{rows.length === 0 && !loading && (
  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <td colSpan={8}>
      <div className="flex flex-col items-center gap-3">
        <Activity className="w-8 h-8 text-accent/50" />
        <p>No signals found</p>
        <p className="text-xs">Try adjusting your filters or refresh the data</p>
      </div>
    </td>
  </motion.tr>
)}
```

**Display:**
- Centered content with Activity icon
- Two-line message
- Fades in over 200ms

### Loading

```tsx
{loading && rows.length === 0 && (
  <motion.tr>
    <td colSpan={8}>
      <div className="flex items-center justify-center gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-accentA/30 border-t-accentA animate-spin" />
        <span>Loading signals...</span>
      </div>
    </td>
  </motion.tr>
)}
```

**Spinner:**
- Custom circular spinner
- Cyan accent color (accentA)
- CSS animate-spin (1s linear infinite)

### Error State

```tsx
<AnimatePresence>
  {err && (
    <motion.div
      className="mb-4 p-4 bg-danger/10 border border-danger/30 rounded-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <strong>Error:</strong> {err}
    </motion.div>
  )}
</AnimatePresence>
```

**Animation:**
- Slides down from top (-10px → 0)
- Fades in/out
- Automatic cleanup on dismiss

## Footer Info

```tsx
{rows.length > 0 && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5 }}
  >
    <span>
      Showing <strong>{rows.length}</strong> signal{rows.length !== 1 ? 's' : ''}
      <span className="text-muted">(limit: 200)</span>
    </span>
  </motion.div>
)}
```

**Display:**
- Total signal count
- Limit notation
- Fades in with 500ms delay

## Responsive Behavior

### Desktop (> 1024px)
- Full table visible
- All columns displayed
- Hover effects enabled
- Status indicator in header

### Tablet (768px - 1024px)
- Horizontal scroll enabled
- Full table width maintained
- Touch-friendly row heights
- Reduced padding

### Mobile (< 768px)
- Horizontal scroll required
- Minimum column widths enforced
- Controls stack vertically
- Simplified footer

## API Integration

### Fetch Function

```tsx
const load = () => {
  setLoading(true);
  setErr(null);
  getSignals({ mode, pair: pair || undefined, limit: 200 })
    .then((data) => {
      setRows(data);
      setErr(null);
    })
    .catch((e) => {
      setErr(String(e));
    })
    .finally(() => setLoading(false));
};
```

**Parameters:**
- `mode`: "paper" or "live"
- `pair`: Trading pair filter (optional)
- `limit`: Max rows to fetch (default: 200)

### Auto-Refresh on Mode Change

```tsx
useEffect(() => {
  load();
}, [mode]);
```

**Behavior:**
- Automatically fetches new data when mode changes
- Pair filter requires manual refresh
- Loading state prevents duplicate requests

## Accessibility

### ARIA Labels
```tsx
<section aria-label="Live trading signals">
  <label htmlFor="mode-select">Trading Mode</label>
  <label htmlFor="pair-filter">Pair Filter</label>
</section>
```

### Keyboard Navigation
- All controls focusable via tab
- Dropdown keyboard navigable
- Input supports arrow keys
- Button activates on Enter/Space

### Reduced Motion

Framer Motion automatically respects `prefers-reduced-motion`:
- Animations disabled
- Instant state changes
- Static content

## Performance

### Optimization Techniques
1. **useMemo**: Last timestamp calculation memoized
2. **Key Props**: Unique signal.id prevents unnecessary re-renders
3. **Layout Animations**: GPU-accelerated transforms
4. **Lazy Rendering**: Only visible rows animated
5. **Debouncing**: Could add for pair filter input

### Bundle Impact
- Lucide icons: ~2KB per icon × 6 = 12KB
- Framer Motion: Already included
- Total increase: ~12KB

## Customization

### Change Stagger Delay

```tsx
// Faster (25ms per row)
delay: index * 0.025

// Slower (100ms per row)
delay: index * 0.1
```

### Modify Zebra Colors

```tsx
${isZebra ? 'bg-accentA/5' : 'bg-accentB/5'}  // Cyan/Violet alternating
```

### Add New Column

1. Update table header:
```tsx
<th className="px-4 py-4 text-right">Volume</th>
```

2. Add cell to SignalRow:
```tsx
<td className="px-4 py-4 text-right">
  {signal.volume ? `${signal.volume.toLocaleString()}` : '-'}
</td>
```

3. Update colSpan in empty/loading states

## Future Enhancements

- [ ] Real-time updates via WebSocket/SSE
- [ ] Export to CSV functionality
- [ ] Advanced filtering (date range, strategy, confidence threshold)
- [ ] Sorting by column headers
- [ ] Pagination for large datasets
- [ ] Row detail expansion on click
- [ ] Copy signal to clipboard
- [ ] Favorite/bookmark signals
- [ ] Push notifications for high-confidence signals
- [ ] Historical signal performance tracking

## Redis Integration Notes

While the current implementation uses REST API, signals could be streamed from Redis Pub/Sub:

```tsx
// Future: Redis SSE integration
useEffect(() => {
  const eventSource = new EventSource('/api/signals/stream');

  eventSource.onmessage = (event) => {
    const newSignal = JSON.parse(event.data);
    setRows(prev => [newSignal, ...prev].slice(0, 200));
  };

  return () => eventSource.close();
}, []);
```

**Redis Schema Example:**
```
signals:paper:latest (list) - Last 200 paper signals
signals:live:latest (list) - Last 200 live signals
signals:stream (pub/sub channel) - Real-time signal broadcast
```
