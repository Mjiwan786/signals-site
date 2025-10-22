# KpiStrip Component - Performance Metrics Dashboard

Animated performance metrics strip with count-up numbers and glassy card effects.

## Overview

The KpiStrip displays four key performance indicators with smooth count-up animations triggered when scrolled into view. Each card features a glassy surface, color-coded icons, and hover glow effects.

## Metrics Displayed

### 1. ROI (12-Month)
**Value:** +247.8%
**Icon:** TrendingUp (Lucide)
**Color:** Green
**Trend:** ↑ (Up indicator)
**Tooltip:** "Total return on investment over the past 12 months"

### 2. Win Rate
**Value:** 68.4%
**Icon:** Target (Lucide)
**Color:** Cyan
**Tooltip:** "Percentage of profitable signals over the last 30 days"

### 3. Max Drawdown
**Value:** -12.3%
**Icon:** TrendingDown (Lucide)
**Color:** Orange
**Trend:** ↓ (Down indicator)
**Tooltip:** "Maximum peak-to-trough decline over the past 12 months"

### 4. Active Traders
**Value:** 1,247
**Icon:** Users (Lucide)
**Color:** Violet
**Tooltip:** "Number of active traders using our signals this month"

## Count-Up Animation

### Custom Hook: `useCountUp`

Located in `lib/useCountUp.ts`, this hook provides smooth number animations using GSAP.

**Features:**
- Intersection Observer for scroll-triggered animation
- GSAP easing (power2.out)
- Configurable duration, decimals, prefix, suffix
- Thousands separator support
- One-time animation (hasAnimated flag)

**API:**
```tsx
const { count, elementRef, trigger } = useCountUp({
  start: 0,           // Starting value
  end: 247.8,         // Ending value
  duration: 2.5,      // Animation duration in seconds
  decimals: 1,        // Number of decimal places
  prefix: '+',        // Prefix character
  suffix: '%',        // Suffix character
  separator: ',',     // Thousands separator
  triggerOnView: true // Animate when scrolled into view
});
```

**Usage:**
```tsx
<div ref={elementRef}>
  {count} {/* Displays: +247.8% */}
</div>
```

### Animation Behavior

1. **On Page Load:** Numbers start at 0
2. **Scroll Trigger:** When section reaches 30% visibility
3. **Animation:** 2.5 second count-up with power2.out easing
4. **One-Time:** Animation only plays once per page load

## Card Styling

### Glassy Surface Effect

```tsx
className="glass-card-hover"
```

**Properties (from globals.css):**
- Background: `rgba(15, 17, 22, 0.6)`
- Backdrop filter: `blur(12px)`
- Border: `1px solid rgba(110, 231, 255, 0.15)`
- Box shadow: Soft inner highlight
- Transition: All properties 300ms

### Hover Effects

**On Hover:**
1. Border brightens: `rgba(110, 231, 255, 0.3)`
2. Box shadow enhances: Color-specific glow
3. Card lifts: `translateY(-2px)`
4. Grid overlay fades in: `opacity: 0 → 0.1`
5. Bottom accent line appears: Color-coded gradient

### Color System

Each metric has a color scheme:

```tsx
const colorClasses = {
  cyan: {
    icon: 'text-accentA',
    bg: 'bg-accentA/10',
    border: 'border-accentA/20',
    glow: 'group-hover:shadow-glow',
  },
  violet: { /* ... */ },
  orange: { /* ... */ },
  green: { /* ... */ },
};
```

**Applied to:**
- Icon color
- Icon background
- Icon border
- Card hover glow

## Structure

```tsx
<section id="live-pnl">
  <header>
    <h2>Live Performance Metrics</h2>
    <p>Real-time data updated every 24 hours</p>
  </header>

  <div className="grid">
    {kpis.map(kpi => (
      <KpiCard kpi={kpi} />
    ))}
  </div>
</section>
```

### KpiCard Anatomy

```tsx
<motion.div className="glass-card-hover">
  {/* Background grid (opacity 0 → 10% on hover) */}

  {/* Icon with colored background */}
  <div className="icon-container">
    <TrendingUp />
  </div>

  {/* Animated value with trend indicator */}
  <div className="value-container">
    <div>{count}</div>
    {trend && <div>↑</div>}
  </div>

  {/* Label with info tooltip */}
  <div className="label-container">
    <span>ROI (12-Month)</span>
    <Info /> {/* Tooltip trigger */}
  </div>

  {/* Bottom accent line (hidden → visible on hover) */}
  <div className="accent-line" />
</motion.div>
```

## Responsive Layout

| Breakpoint | Grid Layout | Gap | Card Size |
|------------|-------------|-----|-----------|
| Mobile (< 640px) | 1 column | 16px | Full width |
| Tablet (640px - 1024px) | 2 columns | 16px | ~50% width |
| Desktop (> 1024px) | 4 columns | 24px | ~25% width |

**Responsive Typography:**
- Value: `text-3xl md:text-4xl` (30px → 36px)
- Label: `text-sm` (14px)
- Header: `text-2xl md:text-3xl` (24px → 30px)

## Animations

### Motion Variants

**staggerContainer (parent):**
```tsx
{
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,  // 100ms delay between children
      delayChildren: 0.1,    // Initial 100ms delay
    },
  },
}
```

**scaleIn (each card):**
```tsx
{
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
}
```

### Sequence

```
0.0s → Section header fades in
0.1s → Card 1 scales in + count-up starts
0.2s → Card 2 scales in + count-up starts
0.3s → Card 3 scales in + count-up starts
0.4s → Card 4 scales in + count-up starts
2.5s → All count-ups complete
```

## Tooltips

**Trigger:** Hover over Info icon
**Position:** Bottom-full (above icon)
**Style:**
- Background: `bg-elev`
- Border: `border-accent/30`
- Shadow: `shadow-glow`
- Width: 192px (w-48)
- Text: Centered, xs size

**Accessibility:**
- `role="tooltip"`
- `aria-label` on icon
- Keyboard accessible via focus

## Accessibility

### ARIA

```tsx
<section aria-label="Key performance indicators">
  <div aria-hidden="true"> {/* Decorative elements */}
  <div role="tooltip">     {/* Tooltip content */}
```

### Keyboard Navigation

- Cards focusable via tab
- Tooltips appear on hover and focus
- Info icons have proper labels

### Reduced Motion

- Animations respect `prefers-reduced-motion`
- Count-up still functions (instant)
- Card scale transitions disabled

## Performance

### Bundle Impact

- GSAP: ~30KB (gzipped)
- useCountUp hook: ~1KB
- Total increase: ~31KB

### Optimization

```tsx
// Intersection Observer options
{ threshold: 0.3 }  // Trigger at 30% visibility
```

Only animates once per session (hasAnimated flag).

### Memory Management

```tsx
useEffect(() => {
  return () => {
    observer.disconnect(); // Cleanup on unmount
  };
}, []);
```

## Customization

### Add New Metric

```tsx
{
  label: 'Custom Metric',
  value: 123.45,
  suffix: '',
  prefix: '',
  decimals: 2,
  tooltip: 'Description here',
  icon: <YourIcon className="w-6 h-6" />,
  color: 'cyan' | 'violet' | 'orange' | 'green',
  trend: 'up' | 'down', // Optional
}
```

### Change Animation Duration

```tsx
const { count } = useCountUp({
  end: kpi.value,
  duration: 3.0, // Slower: 3 seconds
});
```

### Modify Color

Add to `colorClasses` object:
```tsx
const colorClasses = {
  // ... existing colors
  blue: {
    icon: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    glow: 'group-hover:shadow-[0_0_40px_rgba(96,165,250,0.3)]',
  },
};
```

## Data Integration

### Static (Current)

```tsx
const kpis: KpiData[] = [
  { value: 247.8, ... },
];
```

### Dynamic (Future)

```tsx
import { useKpiData } from '@/lib/api';

export default function KpiStrip() {
  const { data, isLoading } = useKpiData();

  if (isLoading) return <KpiStripSkeleton />;

  return (
    <section>
      {data.map(kpi => <KpiCard kpi={kpi} />)}
    </section>
  );
}
```

### Redis Integration (Example)

```tsx
// app/api/kpis/route.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function GET() {
  const metrics = await redis.hgetall('performance:metrics');

  return Response.json({
    roi: parseFloat(metrics.roi_12m),
    winRate: parseFloat(metrics.win_rate_30d),
    maxDrawdown: parseFloat(metrics.max_dd_12m),
    activeTraders: parseInt(metrics.active_traders),
  });
}
```

## Best Practices

1. **Keep metrics relevant:** Show only actionable KPIs
2. **Update regularly:** Refresh data every 24 hours minimum
3. **Accurate tooltips:** Provide clear context for each metric
4. **Color meaning:** Use consistent color semantics (green = positive, orange = caution)
5. **Performance:** Lazy-load GSAP if bundle size is a concern

## Future Enhancements

- [ ] Real-time updates via WebSocket
- [ ] Historical sparklines in cards
- [ ] Click to expand detailed view
- [ ] Export metrics as image
- [ ] Compare with previous period
- [ ] Customizable metric selection
