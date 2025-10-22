# SignalsTicker Component - Live Streaming Ticker Bar

Continuous scrolling ticker displaying real-time trading signals via SSE with glowing effects.

## Overview

The SignalsTicker connects to the `/v1/signals/stream` SSE endpoint and displays incoming signals in a continuously scrolling marquee-style ticker bar. New signals pulse with a glow effect when they arrive.

## Features

### Real-Time SSE Connection
- Auto-connects to Server-Sent Events endpoint
- Maintains persistent connection with auto-reconnect
- Handles connection status (connected/disconnected)
- Error recovery with 5-second retry delay
- Clean disconnection on component unmount

### Continuous Marquee Animation
- Infinite horizontal scroll using Framer Motion
- Seamless loop by duplicating signal array
- 40-second full cycle duration
- Linear easing for smooth, consistent motion
- GPU-accelerated animation (translateX)

### Glowing Ticker Bar Design
- Gradient background (surface → elev → surface)
- Glowing top/bottom accent lines (cyan/violet)
- Pulsing background gradient effect
- Border accents with brand colors
- Semi-transparent glass morphism

### Visual Effects
- **New Signal Pulse**: Scale animation + shadow glow (2s duration)
- **Live Indicator**: Pulsing Zap icon with blur glow
- **Status Dot**: Animated green dot when connected, red when disconnected
- **Separators**: Vertical accent lines between data points

## Component Structure

### Main Component: `SignalsTicker`

```tsx
export default function SignalsTicker({ mode = 'paper' }: SignalsTickerProps) {
  const [signals, setSignals] = useState<SignalDTO[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSignalId, setNewSignalId] = useState<string | null>(null);
  // ...
}
```

**State Management:**
- `signals`: Array of last 20 signals (FIFO queue)
- `isConnected`: Boolean connection status
- `error`: Error message or null
- `newSignalId`: ID of most recent signal for pulse effect

### Child Component: `TickerItem`

```tsx
function TickerItem({ signal, isNew }: { signal: SignalDTO; isNew: boolean }) {
  const isBuy = signal.side?.toLowerCase() === 'buy';
  // ...
}
```

**Props:**
- `signal`: Individual signal data
- `isNew`: Boolean flag for pulse animation

## SSE Connection

### Initialization

```tsx
useEffect(() => {
  const streamUrl = `${API_BASE}/v1/signals/stream?mode=${mode}`;
  const eventSource = new EventSource(streamUrl);

  eventSource.onopen = () => {
    setIsConnected(true);
    setError(null);
  };

  eventSource.onmessage = (event) => {
    const signal: SignalDTO = JSON.parse(event.data);
    setSignals(prev => [signal, ...prev].slice(0, 20));
    setNewSignalId(signal.id);
    setTimeout(() => setNewSignalId(null), 2000);
  };

  eventSource.onerror = (err) => {
    setIsConnected(false);
    setError('Connection lost');
    eventSource.close();
  };

  return () => eventSource.close();
}, [mode]);
```

**Event Handlers:**
- `onopen`: Connection established
- `onmessage`: New signal received
- `onerror`: Connection failed/closed

**Signal Queue Management:**
- New signals prepended to array
- Limit: 20 most recent signals
- Automatic FIFO eviction

### Auto-Reconnect Logic

```tsx
eventSource.onerror = (err) => {
  console.error('SSE error:', err);
  setIsConnected(false);
  setError('Connection lost');

  eventSource.close();
  setTimeout(() => {
    if (eventSourceRef.current === eventSource) {
      eventSourceRef.current = null;
    }
  }, 5000);
};
```

**Behavior:**
- Close connection on error
- Wait 5 seconds before allowing reconnect
- EventSource native reconnection handles retry

## Marquee Animation

### Infinite Scroll

```tsx
<motion.div
  className="flex gap-8"
  animate={{
    x: [0, -1000],
  }}
  transition={{
    x: {
      repeat: Infinity,
      repeatType: 'loop',
      duration: 40,
      ease: 'linear',
    },
  }}
>
  {[...signals, ...signals].map((signal, index) => (
    <TickerItem key={`${signal.id}-${index}`} signal={signal} isNew={...} />
  ))}
</motion.div>
```

**Parameters:**
- **Translation**: 0 → -1000px
- **Duration**: 40 seconds
- **Easing**: Linear (constant speed)
- **Repeat**: Infinite loop

**Seamless Loop:**
- Array duplicated: `[...signals, ...signals]`
- Animation resets before visible gap
- Continuous motion without interruption

### Speed Calculation

```
Speed = Distance / Duration
Speed = 1000px / 40s = 25px/s
```

**Adjustments:**
```tsx
// Faster (20s cycle)
duration: 20

// Slower (60s cycle)
duration: 60
```

## Visual Design

### Ticker Bar Container

```tsx
<div className="relative w-full bg-gradient-to-r from-surface via-elev to-surface border-y border-accent/20 overflow-hidden">
  {/* Top glow */}
  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accentA to-transparent opacity-50" />

  {/* Bottom glow */}
  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accentB to-transparent opacity-50" />

  {/* Pulse background */}
  <div className="absolute inset-0 bg-gradient-to-r from-accentA/5 via-transparent to-accentB/5 animate-pulse opacity-30" />
</div>
```

**Layers (bottom to top):**
1. Gradient background (surface → elev → surface)
2. Pulsing gradient overlay (cyan → transparent → violet)
3. Top accent line (cyan gradient)
4. Bottom accent line (violet gradient)
5. Content layer

### Live Indicator

```tsx
<div className="flex items-center gap-2 pr-6 border-r border-accent/30">
  <div className="relative">
    <Zap className="w-4 h-4 text-accentA" />
    {isConnected && (
      <div className="absolute inset-0 blur-sm bg-accentA opacity-50 animate-pulse" />
    )}
  </div>
  <span className="text-xs font-bold uppercase">Live Signals</span>
  <div className={`w-2 h-2 rounded-full ${
    isConnected ? 'bg-success animate-pulse' : 'bg-danger'
  }`} />
</div>
```

**Elements:**
- Zap icon with blur glow (when connected)
- "LIVE SIGNALS" label (uppercase, tracked)
- Status dot (pulsing green / static red)
- Right border separator

## Ticker Item Design

### Layout Structure

```tsx
<motion.div className="flex items-center gap-3 px-4 py-1 rounded-lg">
  {/* Pair */}
  <span className="text-sm font-bold">BTC-USD</span>

  <div className="w-px h-4 bg-accent/30" /> {/* Separator */}

  {/* Side Badge */}
  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded">
    <ArrowUpCircle className="w-3 h-3" />
    BUY
  </div>

  <div className="w-px h-4 bg-accent/30" /> {/* Separator */}

  {/* Entry Price */}
  <div className="flex items-center gap-1">
    <span className="text-xs">@</span>
    <span className="text-sm font-mono">$42,150.2500</span>
  </div>

  <div className="w-px h-4 bg-accent/30" /> {/* Separator */}

  {/* Confidence */}
  <div className="flex items-center gap-1">
    <TrendingUp className="w-3 h-3" />
    <span className="text-xs font-bold">85%</span>
  </div>

  <div className="w-px h-4 bg-accent/30" /> {/* Separator */}

  {/* Time */}
  <div className="flex items-center gap-1">
    <Activity className="w-3 h-3" />
    <span className="text-xs">3:45 PM</span>
  </div>
</motion.div>
```

**Data Order:**
1. Trading Pair (bold)
2. Side (BUY/SELL badge with icon)
3. Entry Price ($ monospace)
4. Confidence (% with TrendingUp icon)
5. Time (HH:MM AM/PM)

**Separators:**
- Vertical 1px lines
- 16px height
- Accent color at 30% opacity

### New Signal Pulse Effect

```tsx
<motion.div
  className={isNew ? 'bg-accentA/10 border-accentA/50 shadow-glow' : 'bg-surface/50 border-accent/20'}
  animate={
    isNew
      ? {
          scale: [1, 1.05, 1],
          boxShadow: [
            '0 0 0px rgba(110, 231, 255, 0)',
            '0 0 20px rgba(110, 231, 255, 0.5)',
            '0 0 0px rgba(110, 231, 255, 0)',
          ],
        }
      : {}
  }
  transition={{ duration: 2 }}
/>
```

**Animation Keyframes:**
- **0s**: Scale 100%, no glow
- **1s**: Scale 105%, full glow (20px cyan)
- **2s**: Scale 100%, no glow

**Visual Changes:**
- Background: surface/50 → accentA/10
- Border: accent/20 → accentA/50
- Shadow: none → shadow-glow → none

**Duration:** 2 seconds total

### Badge Styling

**Buy Badge:**
```tsx
<div className="bg-success/20 text-success">
  <ArrowUpCircle /> BUY
</div>
```
- Green background (20% opacity)
- Green text and icon
- Arrow up circle icon

**Sell Badge:**
```tsx
<div className="bg-danger/20 text-danger">
  <ArrowDownCircle /> SELL
</div>
```
- Red background (20% opacity)
- Red text and icon
- Arrow down circle icon

**Confidence Colors:**
- **High** (≥80%): Green (success)
- **Medium** (60-79%): Cyan (accentA)
- **Low** (<60%): Orange (highlight)

## Responsive Behavior

### Desktop (> 1024px)
- Full ticker width
- All data points visible
- Smooth scrolling
- Live indicator on left

### Tablet (768px - 1024px)
- Reduced padding
- Smaller gaps
- Faster scroll to compensate

### Mobile (< 768px)
- Compact ticker items
- Abbreviated labels
- Touch-friendly spacing
- Reduced separator count

## States

### Normal State
```tsx
<div className="bg-surface/50 border-accent/20">
  {/* Signal content */}
</div>
```
- Semi-transparent background
- Subtle border
- Normal scrolling speed

### New Signal State
```tsx
<div className="bg-accentA/10 border-accentA/50 shadow-glow">
  {/* Signal content with pulse */}
</div>
```
- Highlighted background (cyan tint)
- Bright border (cyan)
- Glow shadow
- Scale pulse animation

### Connected State
- Pulsing green status dot
- Glowing Zap icon
- Normal ticker scrolling

### Disconnected State
- Solid red status dot
- No Zap glow
- Error message (if no signals)
- Ticker continues scrolling cached signals

### Error State
```tsx
{error && signals.length === 0 && (
  <div className="flex items-center gap-2 px-6 text-sm text-danger">
    <Activity className="w-4 h-4" />
    {error}
  </div>
)}
```
- Red error text
- Activity icon
- Replaces ticker content

## Performance

### Optimization Techniques
1. **Signal Limit**: Max 20 signals in memory
2. **Array Slicing**: FIFO queue prevents memory growth
3. **GPU Animation**: translateX is hardware-accelerated
4. **Ref Cleanup**: EventSource properly closed on unmount
5. **Timeout Cleanup**: Pulse effect timeout cleared

### Bundle Impact
- Lucide icons: ~2KB per icon × 6 = 12KB
- Framer Motion: Already included
- EventSource: Native browser API (0KB)
- Total increase: ~12KB

### Memory Management
- Signal array capped at 20 items
- Old signals automatically evicted
- EventSource ref properly nulled
- No memory leaks from animations

## Customization

### Change Scroll Speed

```tsx
// Faster (20 seconds)
transition={{ duration: 20 }}

// Slower (60 seconds)
transition={{ duration: 60 }}

// Very slow (2 minutes)
transition={{ duration: 120 }}
```

### Modify Signal Limit

```tsx
// Keep more signals (50)
setSignals(prev => [signal, ...prev].slice(0, 50));

// Keep fewer signals (10)
setSignals(prev => [signal, ...prev].slice(0, 10));
```

### Change Pulse Duration

```tsx
// Shorter pulse (1 second)
setTimeout(() => setNewSignalId(null), 1000);

// Longer pulse (3 seconds)
setTimeout(() => setNewSignalId(null), 3000);
```

### Add More Data Points

```tsx
// Add volume to ticker items
<div className="flex items-center gap-1">
  <span className="text-xs text-dim">Vol:</span>
  <span className="text-sm font-mono">{signal.volume}</span>
</div>
```

### Custom Colors

```tsx
// Change glow colors
<div className="bg-gradient-to-r from-accentB/5 via-transparent to-highlight/5" />

// Change accent lines
<div className="bg-gradient-to-r from-transparent via-success to-transparent" />
```

## Integration Example

### Basic Usage

```tsx
import SignalsTicker from '@/components/SignalsTicker';

export default function Page() {
  return (
    <>
      <SignalsTicker mode="live" />
      {/* Rest of page content */}
    </>
  );
}
```

### Sticky Positioning

```tsx
<div className="sticky top-0 z-50">
  <SignalsTicker mode="paper" />
</div>
```

### With Header

```tsx
<header className="sticky top-0 z-50">
  <Navbar />
  <SignalsTicker mode="live" />
</header>
```

## API Endpoint

### Expected Response Format

**SSE Stream:**
```
data: {"id":"sig_123","ts":1234567890,"pair":"BTC-USD","side":"buy","entry":42150.25,"sl":41000,"tp":45000,"strategy":"momentum","confidence":0.85,"mode":"live"}

data: {"id":"sig_124","ts":1234567895,"pair":"ETH-USD","side":"sell","entry":2250.50,"sl":2300,"tp":2100,"strategy":"reversal","confidence":0.72,"mode":"live"}
```

**Event Format:**
- Type: `message`
- Data: JSON-serialized SignalDTO
- Newline-delimited

### Redis Backend (Example)

```typescript
// app/api/v1/signals/stream/route.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL, {
  tls: { ca: process.env.REDIS_CA_CERT },
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'paper';

  const stream = new ReadableStream({
    async start(controller) {
      // Subscribe to Redis pub/sub
      const subscriber = redis.duplicate();
      await subscriber.subscribe(`signals:${mode}`);

      subscriber.on('message', (channel, message) => {
        const data = `data: ${message}\n\n`;
        controller.enqueue(new TextEncoder().encode(data));
      });

      // Keep-alive heartbeat
      const interval = setInterval(() => {
        controller.enqueue(new TextEncoder().encode(': heartbeat\n\n'));
      }, 30000);

      // Cleanup
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        subscriber.quit();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

## Accessibility

### ARIA Labels
```tsx
<div role="region" aria-label="Live trading signals ticker">
  <div aria-live="polite" aria-atomic="false">
    {/* Ticker content */}
  </div>
</div>
```

### Reduced Motion
```tsx
// Disable animation if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={prefersReducedMotion ? {} : { x: [0, -1000] }}
/>
```

### Screen Readers
- Status announcements for connection state
- Signal data readable in DOM order
- Icon labels for assistive tech

## Troubleshooting

**Issue: Ticker not scrolling**
- Check Framer Motion installation
- Verify animate prop syntax
- Ensure overflow: hidden on container

**Issue: SSE connection failing**
- Verify API_BASE environment variable
- Check CORS headers on backend
- Inspect browser network tab for SSE stream

**Issue: Signals not updating**
- Check onmessage event handler
- Verify JSON parsing succeeds
- Look for console errors

**Issue: Memory growing**
- Confirm slice(0, 20) is limiting array
- Check for EventSource leaks
- Verify useEffect cleanup runs

## Future Enhancements

- [ ] Pause/resume scrolling on hover
- [ ] Click to view signal details in modal
- [ ] Filter by trading pair
- [ ] Volume-weighted signal prominence
- [ ] Historical signal replay mode
- [ ] Export ticker data to CSV
- [ ] Customizable scroll direction (RTL support)
- [ ] Multi-line ticker for mobile
- [ ] Sound notification on high-confidence signals
- [ ] Integration with trading platform APIs
