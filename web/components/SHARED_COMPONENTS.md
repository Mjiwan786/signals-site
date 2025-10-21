# Shared Components Library - Step 9

Polished, reusable components with ReactBits-inspired animations and CSS var theming.

## Components

### 1. SectionTitle
Animated section headings with gradient text support.

```tsx
import SectionTitle, { AnimatedGradientTitle, SplitTextTitle } from '@/components/SectionTitle';

// Basic usage
<SectionTitle
  title="Technology & Architecture"
  subtitle="End-to-end system powering real-time AI trading signals"
  align="center"
  size="lg"
  gradient={true}
/>

// Animated gradient variant
<AnimatedGradientTitle size="xl">
  AI-Powered Trading Signals
</AnimatedGradientTitle>

// Character-by-character animation
<SplitTextTitle size="lg" delay={0.2}>
  Welcome to the Future
</SplitTextTitle>
```

**Props:**
- `title`: string - Main heading text
- `subtitle?`: string - Optional subheading
- `align?`: 'left' | 'center' - Text alignment
- `size?`: 'sm' | 'md' | 'lg' | 'xl' - Text size
- `gradient?`: boolean - Enable gradient text
- `animate?`: boolean - Enable fade-in animation

---

### 2. Skeleton (Enhanced)
Loading states with smooth shimmer animation.

```tsx
import {
  Skeleton,
  SignalSkeleton,
  ChartSkeleton,
  KpiSkeleton
} from '@/components/Skeleton';

// Basic skeleton
<Skeleton className="w-full h-32" shimmer={true} />

// Variants
<Skeleton variant="text" className="w-48" />
<Skeleton variant="circle" className="w-12 h-12" />
<Skeleton variant="button" className="w-32 h-10" />

// Specialized skeletons
<SignalSkeleton />
<ChartSkeleton />
<KpiSkeleton />
```

**Props:**
- `variant?`: 'default' | 'text' | 'circle' | 'button'
- `shimmer?`: boolean - Enable shimmer animation
- `className?`: string - Tailwind classes
- `style?`: React.CSSProperties

---

### 3. StatPill
Stylized metric display pills with variants and animations.

```tsx
import StatPill, {
  CompactStatPill,
  AnimatedStatPill,
  StatBadge,
  IconStatPill
} from '@/components/StatPill';
import { TrendingUp, Zap } from 'lucide-react';

// Basic usage
<StatPill
  label="Win Rate"
  value="68.4%"
  variant="success"
  trend="up"
  glow={true}
/>

// With icon
<StatPill
  label="Latency"
  value="<500ms"
  variant="info"
  icon={Zap}
  size="lg"
/>

// Compact variant
<CompactStatPill label="ROI" value="+247%" variant="success" />

// Animated counter
<AnimatedStatPill
  label="Live Signals"
  value={142}
  variant="info"
  suffix=" active"
/>

// Badge
<StatBadge variant="success" pulse={true}>
  Live
</StatBadge>

// Icon stat (dashboard KPI)
<IconStatPill
  icon={TrendingUp}
  label="Monthly Return"
  value="+24.7%"
  trend={{ value: '+5.2%', direction: 'up' }}
  variant="success"
/>
```

**StatPill Props:**
- `label`: string - Metric label
- `value`: string | number - Metric value
- `variant?`: 'default' | 'success' | 'danger' | 'info' | 'warning'
- `trend?`: 'up' | 'down' | 'neutral' - Trend indicator
- `icon?`: LucideIcon - Optional icon
- `size?`: 'sm' | 'md' | 'lg'
- `glow?`: boolean - Enable glow on hover
- `animate?`: boolean - Enable entrance animation

---

## CSS Utilities (globals.css)

### Gradient Text
```tsx
<h1 className="gradient-text">Static Gradient</h1>
<h1 className="animated-gradient-text">Animated Gradient</h1>
```

### Text Glow
```tsx
<span className="text-glow">Cyan Glow</span>
<span className="text-glow-violet">Violet Glow</span>
<span className="text-glow-highlight">Orange Glow</span>
```

### Shimmer
```tsx
<div className="text-shimmer">Shimmering Text</div>
```

---

## CSS Variables (Theme)

All components use CSS variables for consistent theming:

```css
--accent-a: #6EE7FF    /* Cyan */
--accent-b: #A78BFA    /* Violet */
--highlight: #FF7336   /* Orange */
--success: #10b981     /* Green */
--danger: #ef4444      /* Red */
```

### Gradients
```css
--gradient-neural: linear-gradient(135deg, #6EE7FF 0%, #A78BFA 50%, #FF7336 100%)
--gradient-mesh: radial gradients with cyan and violet
--gradient-glow: radial gradient accent
```

---

## Reduced Motion Support

All components respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .animated-gradient-text {
    animation: none;
  }
  .text-shimmer {
    animation: none;
  }
}
```

Framer Motion animations automatically disable for users who prefer reduced motion.

---

## Usage Examples

### Hero Section
```tsx
<Section bg="elev">
  <SplitTextTitle size="xl">
    AI-Powered Crypto Trading
  </SplitTextTitle>
  <div className="flex gap-4 justify-center mt-6">
    <StatPill label="Win Rate" value="68.4%" variant="success" trend="up" glow />
    <StatPill label="Latency" value="<500ms" variant="info" icon={Zap} glow />
    <StatPill label="Uptime" value="99.8%" variant="default" glow />
  </div>
</Section>
```

### Dashboard KPIs
```tsx
<div className="grid grid-cols-3 gap-6">
  <IconStatPill
    icon={TrendingUp}
    label="Monthly Return"
    value="+24.7%"
    trend={{ value: '+5.2%', direction: 'up' }}
    variant="success"
  />
  <IconStatPill
    icon={Activity}
    label="Active Signals"
    value="142"
    variant="info"
  />
  <IconStatPill
    icon={AlertCircle}
    label="Win Rate"
    value="68.4%"
    variant="success"
  />
</div>
```

### Loading States
```tsx
{loading ? (
  <div className="space-y-4">
    <Skeleton className="w-full h-12" shimmer />
    <Skeleton className="w-3/4 h-8" shimmer />
    <Skeleton className="w-1/2 h-6" shimmer />
  </div>
) : (
  <Content />
)}
```

---

## Integration Checklist

- ✅ All components use CSS variables (no hardcoded colors)
- ✅ Minimal custom CSS (Tailwind + utility classes)
- ✅ Framer Motion for animations
- ✅ Reduced motion support
- ✅ TypeScript typed props
- ✅ Accessible (ARIA labels, keyboard nav)
- ✅ Responsive (mobile-first)
- ✅ Themed consistently with PRD colors

---

## Performance Notes

- **Skeleton shimmer**: Uses CSS transforms (GPU-accelerated)
- **Gradient animations**: CSS `background-position` (efficient)
- **Framer Motion**: Only animates when in viewport
- **Reduced motion**: All animations disable automatically

---

## Next Steps

1. Update existing pages to use SectionTitle instead of raw h2 tags
2. Replace loading states with enhanced Skeleton components
3. Add StatPills to KPI sections (/signals, /performance, /dashboard)
4. Test with reduced motion enabled
5. Verify Lighthouse Performance score remains ≥90
