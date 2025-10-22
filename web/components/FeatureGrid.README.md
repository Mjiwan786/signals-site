# FeatureGrid Component - Core Features Showcase

Animated three-column feature grid with alternating slide-in directions and hover micro-interactions.

## Overview

The FeatureGrid displays three core platform features with scroll-triggered animations and interactive hover effects. Each card slides in from a different direction (left, bottom, right) with staggered timing for visual interest.

## Features Displayed

### 1. AI-Driven Signal Generation
**Icon:** Cpu (Lucide)
**Color:** Cyan (#6EE7FF)
**Direction:** Slide from left
**Description:** Advanced ML models analyze market patterns in real-time, generating high-probability trading signals with confidence scores and entry/exit recommendations.

### 2. Adaptive Risk Management
**Icon:** Shield (Lucide)
**Color:** Violet (#A78BFA)
**Direction:** Slide from bottom
**Description:** Dynamic position sizing and stop-loss optimization based on market volatility, portfolio correlation, and personal risk tolerance.

### 3. Lightning-Fast Execution
**Icon:** Zap (Lucide)
**Color:** Orange (#FF7336)
**Direction:** Slide from right
**Description:** Sub-500ms signal delivery via WebSocket and Discord integration with real-time notifications.

## Animation System

### Scroll-Triggered Animations

**Container Animation:**
```tsx
variants={staggerContainer}
initial="hidden"
whileInView="visible"
viewport={{ once: true, margin: '-100px' }}
```

**Stagger Configuration (from lib/motion.ts):**
- Delay between children: 100ms
- Initial delay: 100ms
- Creates wave effect across cards

### Direction-Specific Variants

**Slide from Left:**
```tsx
{
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutCubic
    },
  },
}
```

**Slide from Bottom:**
```tsx
{
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, ... }
}
```

**Slide from Right:**
```tsx
{
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, ... }
}
```

### Animation Timeline

```
0.0s → Section header fades in
0.1s → Card 1 (AI) slides from left
0.2s → Card 2 (Risk) slides from bottom
0.3s → Card 3 (Speed) slides from right
0.9s → All animations complete
```

## Hover Micro-Interactions

### 1. Icon Rotation
**Effect:** Wobble animation on hover
```tsx
whileHover={{ rotate: [0, -10, 10, -5, 0] }}
transition={{ duration: 0.5 }}
```
**Keyframes:** 0° → -10° → 10° → -5° → 0°

### 2. Card Scale
**Effect:** Subtle scale-up on hover
```tsx
className="hover:scale-[1.02]"
```
**Scale:** 100% → 102%

### 3. Shadow Glow
**Effect:** Color-coded glow based on feature
- Cyan: `hover:shadow-glow`
- Violet: `hover:shadow-glow-violet`
- Orange: `hover:shadow-glow-highlight`

**Box Shadow Definition (tailwind.config.ts):**
```tsx
boxShadow: {
  glow: '0 0 40px rgba(110, 231, 255, 0.3)',
  'glow-violet': '0 0 40px rgba(167, 139, 250, 0.3)',
  'glow-highlight': '0 0 40px rgba(255, 115, 54, 0.3)',
}
```

### 4. Grid Overlay Reveal
**Effect:** Background grid fades in
```tsx
className="opacity-0 group-hover:opacity-10"
```
**Transition:** 300ms ease

### 5. Gradient Accent
**Effect:** Top-to-bottom gradient overlay
```tsx
className={`bg-gradient-to-b ${colors.gradient} opacity-0 group-hover:opacity-100`}
```
**Colors:**
- Cyan: `from-accentA/5 to-transparent`
- Violet: `from-accentB/5 to-transparent`
- Orange: `from-highlight/5 to-transparent`

### 6. Bottom Accent Line
**Effect:** Horizontal line appears at bottom
```tsx
className="opacity-0 group-hover:opacity-100"
```
**Gradient:** `from-transparent via-{color} to-transparent`

## Card Styling

### Base Glass Effect
```tsx
className="glass-card-hover rounded-2xl p-8"
```

**Properties (from globals.css):**
- Background: `rgba(15, 17, 22, 0.6)`
- Backdrop filter: `blur(12px)`
- Border: `1px solid rgba(110, 231, 255, 0.15)`
- Transition: All 300ms cubic-bezier

### Color System

Each feature has a color scheme applied to:
- Icon color
- Icon background
- Icon border
- Card hover glow

**Color Classes:**
```tsx
const colorClasses = {
  cyan: {
    icon: 'text-accentA',
    iconBg: 'bg-accentA/10',
    border: 'border-accentA/20',
    glow: 'hover:shadow-glow',
    gradient: 'from-accentA/5 to-transparent',
  },
  // ... violet, orange
};
```

## Structure

```tsx
<section className="relative w-full bg-bg py-20">
  {/* Background grid pattern */}
  <div className="bg-grid opacity-20" />

  {/* Radial gradient overlay */}
  <div style={{ background: 'radial-gradient(...)' }} />

  {/* Section Header */}
  <motion.div>
    <h2>Core Features</h2>
    <p>Powered by cutting-edge AI...</p>
  </motion.div>

  {/* Features Grid */}
  <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {features.map(feature => (
      <FeatureCard feature={feature} />
    ))}
  </motion.div>
</section>
```

### FeatureCard Anatomy

```tsx
<motion.div className="glass-card-hover" variants={slideInLeft/Bottom/Right}>
  {/* Background grid (reveals on hover) */}
  <div className="bg-grid-sm opacity-0 group-hover:opacity-10" />

  {/* Gradient accent (reveals on hover) */}
  <div className="bg-gradient-to-b opacity-0 group-hover:opacity-100" />

  {/* Icon with rotation animation */}
  <motion.div whileHover={{ rotate: [...] }}>
    <Cpu />
  </motion.div>

  {/* Title */}
  <h3>AI-Driven Signal Generation</h3>

  {/* Description */}
  <p>Advanced machine learning models...</p>

  {/* Bottom accent line (reveals on hover) */}
  <div className="opacity-0 group-hover:opacity-100" />
</motion.div>
```

## Responsive Layout

| Breakpoint | Grid Layout | Gap | Card Width |
|------------|-------------|-----|------------|
| Mobile (< 768px) | 1 column | 32px | 100% |
| Tablet (768px - 1024px) | 2 columns | 32px | ~50% |
| Desktop (> 1024px) | 3 columns | 32px | ~33% |

**Responsive Typography:**
- Header: `text-3xl md:text-4xl lg:text-5xl` (30px → 36px → 48px)
- Card title: `text-2xl` (24px)
- Card description: `text-base` (16px)

## Accessibility

### ARIA Labels
```tsx
<section aria-label="Core features">
  <div aria-hidden="true"> {/* Decorative elements */}
</section>
```

### Keyboard Navigation
- Cards focusable via tab
- Hover effects work on focus
- Proper heading hierarchy (h2 → h3)

### Reduced Motion
- Animations respect `prefers-reduced-motion`
- Static fallback for slide-in effects
- Icon rotation disabled
- Card scale transitions disabled

**Implementation (via Framer Motion):**
```tsx
// Automatically handled by Framer Motion's built-in support
```

## Performance

### Bundle Impact
- Lucide icons: ~2KB per icon (gzipped)
- Framer Motion: Already included
- Total increase: ~6KB

### Optimization
- Uses existing `staggerContainer` variant (no duplication)
- Intersection Observer triggers only once
- GPU-accelerated transforms (translateX, translateY, scale, rotate)

## Customization

### Add New Feature

```tsx
{
  title: 'New Feature',
  description: 'Description of the new feature...',
  icon: <YourIcon className="w-8 h-8" />,
  color: 'cyan' | 'violet' | 'orange',
  direction: 'left' | 'right' | 'bottom',
}
```

### Change Animation Duration

```tsx
const slideInLeft = {
  visible: {
    transition: {
      duration: 1.0, // Slower: 1 second
    },
  },
};
```

### Add New Color

```tsx
const colorClasses = {
  // ... existing colors
  green: {
    icon: 'text-success',
    iconBg: 'bg-success/10',
    border: 'border-success/20',
    glow: 'hover:shadow-[0_0_40px_rgba(34,197,94,0.3)]',
    gradient: 'from-success/5 to-transparent',
  },
};
```

### Modify Hover Effects

**Icon Rotation:**
```tsx
// More dramatic wobble
whileHover={{ rotate: [0, -20, 20, -10, 0] }}

// Smooth continuous spin
whileHover={{ rotate: 360 }}
transition={{ duration: 0.5, ease: "linear" }}
```

**Card Scale:**
```tsx
// Larger scale
className="hover:scale-105"

// With rotation
whileHover={{ scale: 1.05, rotateY: 5 }}
```

## Integration Example

### Static Data (Current)
```tsx
const features: Feature[] = [
  { title: '...', description: '...', ... },
];

export default function FeatureGrid() {
  return (
    <section>
      {features.map(f => <FeatureCard feature={f} />)}
    </section>
  );
}
```

### Dynamic Data (Future)
```tsx
import { useFeatures } from '@/lib/api';

export default function FeatureGrid() {
  const { data, isLoading } = useFeatures();

  if (isLoading) return <FeatureGridSkeleton />;

  return (
    <section>
      {data.map(f => <FeatureCard feature={f} />)}
    </section>
  );
}
```

### Redis Integration (Example)

If features need to be dynamically enabled/disabled based on subscription tier:

```tsx
// app/api/features/route.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL, {
  tls: { ca: process.env.REDIS_CA_CERT },
});

export async function GET() {
  const tier = await redis.get('user:tier'); // 'free' | 'pro' | 'enterprise'

  const features = {
    free: ['ai-signals'],
    pro: ['ai-signals', 'risk-management'],
    enterprise: ['ai-signals', 'risk-management', 'lightning-execution'],
  };

  return Response.json({
    enabled: features[tier] || features.free,
  });
}
```

## Best Practices

1. **Keep descriptions concise:** 2-3 sentences maximum per feature
2. **Use action-oriented language:** Focus on benefits, not just features
3. **Consistent icon style:** All icons from same family (Lucide)
4. **Test hover states:** Ensure all interactions feel responsive
5. **Performance:** Limit to 3-6 features max for optimal load time

## Future Enhancements

- [ ] Feature detail modal on click
- [ ] Video demonstrations for each feature
- [ ] Real-time status indicators (e.g., "99.5% Uptime")
- [ ] Testimonials related to specific features
- [ ] Interactive demos embedded in cards
- [ ] A/B testing for feature descriptions
