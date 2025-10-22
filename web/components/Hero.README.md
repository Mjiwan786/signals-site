# Enhanced Hero Component

Modern hero section with 3D animation, staggered text reveal, and interactive CTAs.

## Overview

The Hero component features:
- **3D Background:** Abstract geometric shape with React Three Fiber (right side)
- **Animated Text:** Staggered fade-in for heading lines
- **Interactive CTAs:** Primary scroll-to-chart button and Discord invite
- **Trust Indicators:** Live status, security, and uptime badges
- **Responsive Layout:** Mobile-first design with desktop optimizations

## Component Structure

```tsx
<Hero>
  ├── Hero3D (3D Canvas Background)
  ├── Gradient Overlay (text readability)
  └── Hero Content
      ├── Badge (Live Trading Signals)
      ├── Heading (Staggered animation)
      ├── Subheading (Value proposition)
      ├── CTA Buttons
      │   ├── View Live PnL (Primary, scroll)
      │   └── Join Discord (Secondary, external)
      └── Trust Indicators
          ├── Live & Active
          ├── Redis TLS Secured
          └── 99.5% Uptime
```

## Features

### 🎨 Design Elements

**Badge Component:**
```tsx
<motion.div className="inline-flex items-center gap-2 px-4 py-2 bg-surface/50 border border-accent/30 rounded-full backdrop-blur-sm">
  <Zap className="w-4 h-4 text-accentA" />
  <span>Live Trading Signals • <500ms Latency</span>
</motion.div>
```

**Heading Text:**
- Size: `text-5xl md:text-6xl lg:text-7xl xl:text-8xl`
- Font: Space Grotesk (font-display)
- Line 1: Gradient brand colors (AI-Powered Signals)
- Line 2: White text (for Crypto)
- Staggered reveal with `fadeInUp` variants

**Subheading:**
- Size: `text-xl md:text-2xl`
- Color: Dimmed text with bold highlights
- Max width: `max-w-2xl`

### 🎯 CTA Buttons

#### Primary Button - View Live PnL

**Functionality:**
```tsx
onClick={() => scrollToElement('live-pnl')}
```
Smooth scrolls to `#live-pnl` section (KpiStrip component).

**Styling:**
- Gradient background: accentA → accentB
- Icons: TrendingUp, ArrowRight (lucide-react)
- Hover effects:
  - Scale: 1.05
  - Gradient shift: accentA → accentB → highlight
  - Arrow translate-x animation
  - Enhanced glow shadow

**Visual Hierarchy:**
- Primary action (larger, gradient, glowing)
- Left-aligned icon (TrendingUp)
- Right-aligned arrow (ArrowRight)

#### Secondary Button - Join Discord

**Functionality:**
```tsx
href={process.env.NEXT_PUBLIC_DISCORD_INVITE}
target="_blank"
rel="noopener noreferrer"
```

**Styling:**
- Semi-transparent background with backdrop blur
- Border: `border-accent/30`
- Icons: MessageCircle, ArrowRight
- Hover effects:
  - Border color: accent
  - Background: surface
  - Arrow opacity and translate-x

### ✨ Animations

**Stagger Configuration:**
```tsx
variants={staggerContainer}
initial="hidden"
animate="visible"
```

**Animation Timeline:**
1. **Badge:** Fade in + translate Y (0.5s)
2. **Heading Line 1:** Fade in up (staggered)
3. **Heading Line 2:** Fade in up (staggered + delay)
4. **Subheading:** Fade in + translate Y (0.6s, delay: 0.3s)
5. **CTA Buttons:** Fade in + translate Y (0.6s, delay: 0.5s)
6. **Trust Indicators:** Fade in (0.6s, delay: 0.7s)

**Reduced Motion:**
All animations respect `prefers-reduced-motion` via framer-motion.

### 🔒 Trust Indicators

Three inline badges showing:

1. **Live & Active**
   - Green pulsing dot
   - Indicates system is operational

2. **Redis TLS Secured**
   - Shield icon (lucide-react)
   - Shows security status

3. **99.5% Uptime**
   - Zap icon (lucide-react)
   - Reliability metric

## Scroll Functionality

**Implementation:**
```tsx
const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
```

**Target Element:**
The `#live-pnl` ID is set on the KpiStrip component:
```tsx
<section id="live-pnl" className="w-full bg-bg py-8">
```

## Typography Hierarchy

| Element | Size | Weight | Font | Color |
|---------|------|--------|------|-------|
| Badge text | text-sm | medium | Inter | text2 |
| Badge accent | text-sm | medium | Inter | accentA |
| Heading (L1) | text-8xl | bold | Space Grotesk | gradient-brand |
| Heading (L2) | text-8xl | bold | Space Grotesk | text (white) |
| Subheading | text-2xl | normal | Inter | dim |
| Subheading bold | text-2xl | semibold | Inter | text |
| CTA text | text-lg | semibold | Inter | white/text |
| Trust badges | text-sm | normal | Inter | dim |

## Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Badge border | accent/30 | Subtle accent outline |
| Badge background | surface/50 | Semi-transparent |
| Heading gradient | accentA → accentB | Brand gradient |
| Primary CTA bg | gradient-brand | Full brand gradient |
| Primary CTA hover | accentA → accentB → highlight | 3-color shift |
| Secondary CTA border | accent/30 | Subtle outline |
| Trust dot (live) | success | Green pulsing |
| Trust icon (security) | accentB | Violet |
| Trust icon (uptime) | highlight | Orange |

## Responsive Behavior

### Mobile (< 640px)
- Heading: text-5xl
- Subheading: text-xl
- Buttons: Stack vertically (flex-col)
- Trust badges: Wrap to multiple lines
- 3D canvas: Full width, reduced opacity

### Tablet (640px - 1024px)
- Heading: text-6xl
- Subheading: text-2xl
- Buttons: Horizontal row (flex-row)
- 3D canvas: Right half of screen

### Desktop (> 1024px)
- Heading: text-7xl → text-8xl
- Max container width: 7xl
- Hero content: max-w-4xl (left-aligned)
- 3D canvas: Right 50%, higher opacity

## Accessibility

**Keyboard Navigation:**
- All interactive elements focusable
- Focus ring: `focus:ring-4 focus:ring-accent/50`
- Tab order: Badge → Buttons → Trust indicators

**Screen Readers:**
- ARIA labels on buttons
- Icon decorations: `aria-hidden="true"`
- Semantic HTML (h1, p, button, a)

**Motion:**
- Respects `prefers-reduced-motion`
- Smooth scroll with `scroll-behavior: smooth`
- Fallback: Instant scroll if motion disabled

## Environment Variables

```env
NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/your-server
```

## Dependencies

```json
{
  "framer-motion": "^12.x",
  "lucide-react": "^0.x",
  "next": "^14.x"
}
```

## Performance

- **3D Component:** Lazy-loaded with `dynamic()`
- **SSR:** Disabled for Hero3D (client-only)
- **Bundle Size:** ~4.3KB (Hero component)
- **First Load JS:** 135KB (including shared chunks)

## Usage Example

```tsx
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <>
      <Hero />
      <KpiStrip /> {/* Contains #live-pnl ID */}
      {/* Other sections */}
    </>
  );
}
```

## Customization

**Change heading text:**
```tsx
<span className="inline-block bg-gradient-brand bg-clip-text text-transparent">
  Your Custom Heading
</span>
```

**Update value proposition:**
```tsx
<motion.p className="text-xl md:text-2xl text-dim max-w-2xl leading-relaxed mb-10">
  Your custom value proposition with <span className="text-text font-semibold">highlights</span>
</motion.p>
```

**Modify CTA actions:**
```tsx
// Change scroll target
onClick={() => scrollToElement('your-section-id')}

// Update Discord link
href={process.env.NEXT_PUBLIC_YOUR_LINK}
```

## Best Practices

1. **Keep heading concise:** 2 lines max for optimal hierarchy
2. **Value proposition:** Highlight 2-3 key benefits
3. **CTA clarity:** Primary action should be obvious
4. **Trust signals:** Use verifiable, specific metrics
5. **Scroll targets:** Ensure ID exists on target element
6. **Environment variables:** Use for all external links

## Future Enhancements

- [ ] A/B test CTA button copy
- [ ] Add video background option
- [ ] Implement typing animation for heading
- [ ] Add particle effects on scroll
- [ ] Integrate analytics for CTA clicks
