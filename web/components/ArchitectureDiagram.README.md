# ArchitectureDiagram Component - System Architecture Visualization

Interactive end-to-end architecture diagram with sequential animations and SVG flow graphics.

## Overview

The ArchitectureDiagram visualizes the complete data pipeline from market data ingestion through AI processing to PnL tracking. Each node appears sequentially with animated connections showing real-time data flow.

## Architecture Flow

```
Data Sources → AI Engine → Trade Execution → PnL Tracking
```

### 1. Data Sources (Cyan)
**Icon:** Database
**Subtitle:** Multi-Exchange Aggregation
**Description:** Real-time market data from 15+ exchanges including Binance, Coinbase, Kraken. Order book depth, trade history, and on-chain metrics aggregated via WebSocket connections.

**Metrics:**
- Exchanges: 15+
- Latency: <50ms
- Data Points: 1M+/sec

### 2. AI Engine (Violet)
**Icon:** Brain
**Subtitle:** Neural Pattern Recognition
**Description:** Ensemble of LSTM, Transformer, and CNN models trained on 5+ years of historical data. Generates signals with confidence scores, entry/exit prices, and risk parameters.

**Metrics:**
- Models: 12
- Accuracy: 68.4%
- Inference: <100ms

### 3. Trade Execution (Orange)
**Icon:** Zap (Lightning Bolt)
**Subtitle:** Lightning-Fast Delivery
**Description:** Signals delivered via Discord webhooks and WebSocket API in <500ms. Redis-backed queue ensures zero message loss with automatic retry logic and delivery confirmation.

**Metrics:**
- Delivery: <500ms
- Uptime: 99.8%
- Channels: Discord + API

### 4. PnL Tracking (Green)
**Icon:** TrendingUp
**Subtitle:** Transparent Performance
**Description:** Real-time equity curve calculation with daily PnL snapshots stored in Redis Cloud. Historical performance data accessible via REST API for complete transparency.

**Metrics:**
- ROI (12M): +247.8%
- Max DD: -12.3%
- Storage: Redis TLS

## Animation System

### Sequential Node Animations

**Container Stagger:**
```tsx
variants={containerVariant}
// Config:
staggerChildren: 0.4,  // 400ms delay between nodes
delayChildren: 0.2,    // Initial 200ms delay
```

**Node Fade-In:**
```tsx
{
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutCubic
    },
  },
}
```

### Animation Timeline

```
0.0s → Section header fades in
0.2s → Data Sources node appears
0.6s → First connection line draws + traveling dot starts
1.0s → AI Engine node appears
1.4s → Second connection line draws
1.8s → Trade Execution node appears
2.2s → Third connection line draws
2.6s → PnL Tracking node appears
3.2s → Legend appears
```

**Total Duration:** ~3.2 seconds from start to finish

### Connection Line Animation

**SVG Path Animation:**
```tsx
variants={connectionVariant}
{
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.8, ease: 'easeInOut' },
      opacity: { duration: 0.3 },
    },
  },
}
```

**Line Style:**
- Stroke width: 2px
- Gradient: Cyan → Violet → Orange
- Arrow head with matching gradient

### Traveling Dot Effect

**Infinite Loop Animation:**
```tsx
<motion.circle
  r="3"
  fill="#6EE7FF"
  animate={{
    cx: [5, 55],           // Horizontal: start → end
    opacity: [0, 1, 1, 0], // Fade in → visible → fade out
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    repeatDelay: 1,
    ease: 'linear',
  }}
/>
```

**Effect:** Cyan dot travels from left to right along connection line, repeating every 3 seconds (2s travel + 1s delay).

## SVG Graphics

### Horizontal Arrow (Desktop)
```svg
<!-- Line -->
<path d="M 5 20 L 55 20" stroke="url(#gradient-flow)" strokeWidth="2" />

<!-- Arrow head -->
<path d="M 48 13 L 55 20 L 48 27" stroke="url(#gradient-flow)" strokeWidth="2" />

<!-- Gradient definition -->
<linearGradient id="gradient-flow" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" stopColor="#6EE7FF" stopOpacity="0.3" />
  <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.5" />
  <stop offset="100%" stopColor="#FF7336" stopOpacity="0.3" />
</linearGradient>
```

### Vertical Arrow (Mobile)
```svg
<!-- Line -->
<path d="M 20 5 L 20 55" stroke="url(#gradient-flow-v)" strokeWidth="2" />

<!-- Arrow head -->
<path d="M 13 48 L 20 55 L 27 48" stroke="url(#gradient-flow-v)" strokeWidth="2" />

<!-- Vertical gradient -->
<linearGradient id="gradient-flow-v" x1="0%" y1="0%" x2="0%" y2="100%">
  <stop offset="0%" stopColor="#6EE7FF" stopOpacity="0.3" />
  <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.5" />
  <stop offset="100%" stopColor="#FF7336" stopOpacity="0.3" />
</linearGradient>
```

## Interactive Hover States

### Hover Effects

**On Mouse Enter:**
1. Card scales to 105%
2. Color-coded glow shadow appears
3. Background gradient overlay fades in
4. Bottom accent bar expands (scaleX: 0 → 1)
5. Icon wobbles: [0°, -5°, 5°, 0°]

**Hover Detection:**
```tsx
const [hoveredNode, setHoveredNode] = useState<string | null>(null);

<ArchitectureNodeCard
  isHovered={hoveredNode === node.id}
  onHover={setHoveredNode}
/>
```

**State Management:**
- Only one node can be hovered at a time
- Hover state passed down to child component
- Conditional styling based on `isHovered` prop

### Icon Animation

```tsx
<motion.div
  whileHover={{ rotate: [0, -5, 5, 0] }}
  transition={{ duration: 0.4 }}
>
  {node.icon}
</motion.div>
```

**Effect:** Quick left-right wobble on hover

## Card Styling

### Glass Morphism

```tsx
className="glass-card-hover rounded-xl p-6"
```

**Properties:**
- Background: `rgba(15, 17, 22, 0.6)`
- Backdrop filter: `blur(12px)`
- Border: `1px solid rgba(110, 231, 255, 0.15)`
- Transition: All 300ms

### Color System

Each node has a color-coded visual identity:

```tsx
const colorClasses = {
  cyan: {
    icon: 'text-accentA',
    iconBg: 'bg-accentA/10',
    border: 'border-accentA/30',
    glow: 'shadow-glow',
    gradient: 'from-accentA/20 to-accentA/5',
  },
  // ... violet, orange, green
};
```

**Applied to:**
- Icon color
- Icon background (10% opacity)
- Icon border (30% opacity)
- Card hover glow
- Gradient overlay
- Metric values

### Metrics Grid

**Layout:** 3-column grid at bottom of card
```tsx
<div className="grid grid-cols-3 gap-2 pt-4 border-t border-accent/20">
  {node.metrics.map(metric => (
    <div className="text-center">
      <div className="text-base font-bold">{metric.value}</div>
      <div className="text-xs text-dim">{metric.label}</div>
    </div>
  ))}
</div>
```

**Styling:**
- Top border separator
- Color-coded metric values
- Dimmed labels

## Responsive Layout

### Desktop (lg: 1024px+)
**Layout:** Horizontal flow with inline arrows
```tsx
<div className="flex items-center justify-between gap-4">
  {nodes.map(node => (
    <div className="flex items-center flex-1">
      <ArchitectureNodeCard />
      <svg><!-- Horizontal arrow --></svg>
    </div>
  ))}
</div>
```

**Spacing:**
- Nodes: `flex-1` (equal width)
- Arrows: 60px wide, 4-unit horizontal margin

### Mobile/Tablet (< 1024px)
**Layout:** Vertical stack with top-down arrows
```tsx
<div className="space-y-6">
  {nodes.map(node => (
    <div>
      <ArchitectureNodeCard />
      <svg><!-- Vertical arrow --></svg>
    </div>
  ))}
</div>
```

**Spacing:**
- Vertical gap: 24px (space-y-6)
- Arrow height: 60px
- Additional margin: 16px top/bottom

### Responsive Typography

| Element | Mobile | Desktop |
|---------|--------|---------|
| Section header | 30px | 36px → 48px |
| Node title | 20px | 20px |
| Node subtitle | 14px | 14px |
| Description | 14px | 14px |
| Metric value | 16px | 16px |
| Metric label | 12px | 12px |

## Accessibility

### ARIA Labels
```tsx
<section aria-label="System architecture">
  <div aria-hidden="true"> {/* Decorative SVG */}
</section>
```

### Keyboard Navigation
- All nodes are focusable
- Hover effects work on focus
- Proper heading hierarchy (h2 → h3)

### Reduced Motion
- Animations respect `prefers-reduced-motion`
- Static fallback for path animations
- Traveling dots disabled
- Icon wobbles disabled

**Framer Motion handles this automatically via built-in support**

### Screen Readers
- Descriptive section label
- Icon backgrounds marked as decorative
- Meaningful text hierarchy
- Metric labels provide context

## Performance

### Bundle Impact
- SVG inline (no additional HTTP requests)
- Lucide icons: ~2KB per icon × 4 = 8KB
- Animation variants reused from `lib/motion.ts`
- Total increase: ~10KB

### Optimization Techniques
1. **Intersection Observer:** Animations trigger only when scrolled into view
2. **Once flag:** Animations play only once per page load
3. **GPU-accelerated:** All animations use transform/opacity
4. **Lazy SVG:** SVG gradients defined inline, no external files

### Memory Management
- Component unmounts cleanly (Framer Motion handles cleanup)
- No memory leaks from animations
- Hover state properly cleared on mouse leave

## Customization

### Add New Node

```tsx
{
  id: 'new-node',
  title: 'New Stage',
  subtitle: 'Stage Description',
  description: 'Full description of what this stage does...',
  icon: <YourIcon className="w-8 h-8" />,
  color: 'cyan' | 'violet' | 'orange' | 'green',
  metrics: [
    { label: 'Metric 1', value: 'Value 1' },
    { label: 'Metric 2', value: 'Value 2' },
    { label: 'Metric 3', value: 'Value 3' },
  ],
}
```

### Change Animation Speed

**Faster (2 seconds total):**
```tsx
const containerVariant = {
  visible: {
    transition: {
      staggerChildren: 0.3,  // 300ms (was 400ms)
      delayChildren: 0.1,    // 100ms (was 200ms)
    },
  },
};
```

**Slower (5 seconds total):**
```tsx
const containerVariant = {
  visible: {
    transition: {
      staggerChildren: 0.8,  // 800ms
      delayChildren: 0.3,    // 300ms
    },
  },
};
```

### Modify Connection Line Style

**Dashed Line:**
```tsx
<motion.path
  d="M 5 20 L 55 20"
  stroke="url(#gradient-flow)"
  strokeWidth="2"
  strokeDasharray="5,5"  // Add dashing
/>
```

**Thicker Line:**
```tsx
strokeWidth="4"  // Was 2
```

**Different Gradient:**
```tsx
<linearGradient id="gradient-flow">
  <stop offset="0%" stopColor="#FF0000" stopOpacity="0.5" />
  <stop offset="100%" stopColor="#0000FF" stopOpacity="0.5" />
</linearGradient>
```

### Change Traveling Dot Speed

**Faster (1 second):**
```tsx
animate={{ cx: [5, 55], opacity: [0, 1, 1, 0] }}
transition={{
  duration: 1,     // Was 2
  repeatDelay: 0.5, // Was 1
}}
```

**Multiple Dots:**
```tsx
{[0, 0.5].map(delay => (
  <motion.circle
    key={delay}
    animate={{ cx: [5, 55], opacity: [0, 1, 1, 0] }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatDelay: 1,
      delay,  // Stagger by 0.5s
    }}
  />
))}
```

## Data Integration

### Static Data (Current)
```tsx
const nodes: ArchitectureNode[] = [
  { title: '...', description: '...', metrics: [...] },
];
```

### Dynamic Metrics (Future)

**Fetch real-time metrics from Redis:**
```tsx
// app/api/architecture-metrics/route.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL, {
  tls: { ca: process.env.REDIS_CA_CERT },
});

export async function GET() {
  const metrics = await redis.hgetall('system:metrics');

  return Response.json({
    dataSource: {
      exchanges: metrics.active_exchanges,
      latency: metrics.avg_latency_ms,
      dataPoints: metrics.data_points_per_sec,
    },
    aiEngine: {
      models: metrics.active_models,
      accuracy: metrics.win_rate,
      inference: metrics.avg_inference_ms,
    },
    execution: {
      delivery: metrics.avg_delivery_ms,
      uptime: metrics.uptime_percentage,
      channels: 'Discord + API',
    },
    pnl: {
      roi: metrics.roi_12m,
      maxDrawdown: metrics.max_dd_12m,
      storage: 'Redis TLS',
    },
  });
}
```

**Component with dynamic data:**
```tsx
'use client';

import { useEffect, useState } from 'react';

export default function ArchitectureDiagram() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch('/api/architecture-metrics')
      .then(res => res.json())
      .then(setMetrics);
  }, []);

  // Use metrics to populate node.metrics dynamically
}
```

## Best Practices

1. **Keep descriptions concise:** Max 2-3 sentences per node
2. **Use accurate metrics:** Update metrics regularly from live data
3. **Maintain visual balance:** Each node should have similar content length
4. **Test animations:** Ensure smooth performance on all devices
5. **Accessibility first:** Always provide text alternatives for visual elements

## Future Enhancements

- [ ] Click to expand node with detailed modal
- [ ] Real-time metric updates via WebSocket
- [ ] Animated performance graphs within nodes
- [ ] System health indicators (green/yellow/red status dots)
- [ ] Export diagram as image/PDF
- [ ] Interactive data flow simulation
- [ ] Configurable diagram layouts (horizontal/vertical/circular)
- [ ] Integration with monitoring dashboards (Grafana, Datadog)
- [ ] Historical metric comparison (hover to see yesterday's values)
- [ ] 3D version using React Three Fiber (advanced)

## Redis Integration Notes

**Connection String:**
```bash
redis-cli -u redis://default:<password>@redis-19818.c9.us-east-1-4.ec2.redns.redis-cloud.com:19818 --tls --cacert ./redis-ca-cert.pem
```

**Suggested Redis Schema:**
```
system:metrics (hash)
├─ active_exchanges: "15"
├─ avg_latency_ms: "42"
├─ data_points_per_sec: "1247839"
├─ active_models: "12"
├─ win_rate: "68.4"
├─ avg_inference_ms: "87"
├─ avg_delivery_ms: "456"
├─ uptime_percentage: "99.8"
├─ roi_12m: "247.8"
└─ max_dd_12m: "-12.3"
```

**Update Frequency:** Every 5 minutes via cron job or background worker
