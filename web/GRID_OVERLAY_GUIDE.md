# Grid Overlay Design System

ChainGPT-inspired grid patterns for depth and futuristic aesthetic.

## Overview

Grid overlays add subtle visual depth to sections without compromising readability. They use CSS background patterns defined in `globals.css` and applied strategically across the site.

## Grid Pattern Types

### 1. Standard Grid (`bg-grid`)
**Pattern:** 40px × 40px
**Usage:** Large sections, hero backgrounds
**Opacity:** 30-50% with gradient fade

```css
background-image:
  linear-gradient(to right, rgba(110, 231, 255, 0.03) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(110, 231, 255, 0.03) 1px, transparent 1px);
background-size: 40px 40px;
```

**Color:** Cyan (#6EE7FF) at 3% opacity

### 2. Small Grid (`bg-grid-sm`)
**Pattern:** 20px × 20px
**Usage:** Cards, contained sections
**Opacity:** 20-30%

```css
background-size: 20px 20px;
```

### 3. Large Grid (`bg-grid-lg`)
**Pattern:** 80px × 80px
**Usage:** Full-page backgrounds
**Opacity:** 40-60%

```css
background-size: 80px 80px;
```

### 4. Dot Grid (`bg-grid-dots`)
**Pattern:** Radial dots, 24px spacing
**Usage:** CTA sections, footers
**Opacity:** 30-40%

```css
background-image: radial-gradient(circle, rgba(110, 231, 255, 0.08) 1px, transparent 1px);
background-size: 24px 24px;
```

## Implementation Examples

### Hero Section

```tsx
<div className="relative overflow-hidden bg-bg">
  {/* Grid overlay */}
  <div className="absolute inset-0 bg-grid pointer-events-none" aria-hidden="true" />

  {/* Radial gradient mask (fades at edges) */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background: 'radial-gradient(ellipse 120% 100% at 50% 0%, transparent 0%, rgba(11, 11, 15, 0.3) 50%, rgba(11, 11, 15, 0.9) 100%)',
    }}
    aria-hidden="true"
  />

  {/* Content */}
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</div>
```

**Layers (bottom to top):**
1. Background color (`bg-bg`)
2. Grid pattern (`bg-grid`)
3. Radial gradient mask (fades grid at edges)
4. Additional overlays (3D, gradients)
5. Content (z-10)

### How It Works Section

```tsx
<section className="relative w-full bg-elev py-20 overflow-hidden">
  {/* Grid overlay */}
  <div className="absolute inset-0 bg-grid-sm opacity-30 pointer-events-none" aria-hidden="true" />

  {/* Gradient fade */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background: 'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 0%, rgba(26, 26, 36, 0.8) 100%)',
    }}
    aria-hidden="true"
  />

  <div className="relative z-10 max-w-6xl mx-auto px-6">
    {/* Content */}
  </div>
</section>
```

### CTA Card with Inner Grid

```tsx
<div className="relative p-12 bg-gradient-to-br from-surface via-elev to-surface border border-accent/20 rounded-2xl shadow-glow overflow-hidden">
  {/* Inner grid for card */}
  <div className="absolute inset-0 bg-grid-sm opacity-20 pointer-events-none" aria-hidden="true" />

  <div className="relative z-10">
    {/* Card content */}
  </div>
</div>
```

## Gradient Masks

Gradient masks soften grid edges and create depth perception.

### Radial Fade (Center Out)
```css
background: radial-gradient(
  ellipse 100% 80% at 50% 50%,
  transparent 0%,
  rgba(26, 26, 36, 0.8) 100%
);
```

**Effect:** Grid visible in center, fades at edges

### Radial Fade (Top Down)
```css
background: radial-gradient(
  ellipse 120% 100% at 50% 0%,
  transparent 0%,
  rgba(11, 11, 15, 0.3) 50%,
  rgba(11, 11, 15, 0.9) 100%
);
```

**Effect:** Grid visible at top, fades toward bottom

### Linear Fade
```css
background: linear-gradient(
  to bottom,
  transparent 0%,
  rgba(11, 11, 15, 0.9) 100%
);
```

**Effect:** Grid fades from top to bottom

## Accent Glow Spots

Complement grids with subtle colored glows:

```tsx
<div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
  {/* Top left glow */}
  <div className="absolute -top-40 -left-40 w-80 h-80 bg-accentA/10 rounded-full blur-3xl" />

  {/* Bottom right glow */}
  <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accentB/10 rounded-full blur-3xl" />
</div>
```

**Colors:**
- `bg-accentA/10` - Cyan glow (top-left, left side)
- `bg-accentB/10` - Violet glow (bottom-right, right side)
- `bg-highlight/10` - Orange glow (accents)

**Positioning:**
- Offset by -40 (w-80/h-80 size)
- Creates overflow blur effect
- Use sparingly (1-2 per section)

## Layering Order

Always maintain this z-index hierarchy:

```
z-0   : Base background color
z-0   : Grid pattern (absolute inset-0)
z-0   : Gradient masks (absolute inset-0)
z-0   : Accent glows (absolute inset-0)
z-0   : Other backgrounds (3D canvas, etc.)
z-10  : Content layer
z-20+ : Modals, tooltips, overlays
```

**Key principles:**
- All background layers: `z-index: auto` (natural stacking)
- Content always: `relative z-10`
- Pointer events: `pointer-events-none` on decorative layers

## Accessibility

### Reduced Motion
Grids are static patterns but glow animations should respect motion preferences:

```tsx
<div
  className="absolute -top-40 -left-40 w-80 h-80 bg-accentA/10 rounded-full blur-3xl"
  style={{ opacity: shouldReduceMotion ? 0.3 : 0.5 }}
/>
```

### ARIA
Always mark decorative layers:

```tsx
<div className="absolute inset-0 bg-grid pointer-events-none" aria-hidden="true" />
```

### Contrast
Ensure text remains readable:
- Grid opacity: 3-8% base color
- Additional 20-80% fade with gradients
- Content always on `relative z-10` layer

## Performance

**CSS-based patterns:**
- No image downloads required
- GPU-accelerated rendering
- Minimal performance impact

**Best practices:**
- Use `pointer-events-none` to prevent interaction
- Limit to 1-2 grid types per section
- Combine with gradient masks for polish

## Color Variations

### Primary (Cyan - Default)
```css
rgba(110, 231, 255, 0.03) /* --accent-a */
```
Use for: Main sections, hero, primary content

### Secondary (Violet)
```css
rgba(167, 139, 250, 0.03) /* --accent-b */
```
Use for: Alternate sections, cards

### Tertiary (Orange)
```css
rgba(255, 115, 54, 0.03) /* --highlight */
```
Use for: CTAs, special sections

### Neutral (White)
```css
rgba(255, 255, 255, 0.02)
```
Use for: Dark mode variations

## Section-Specific Guidelines

| Section | Grid Type | Opacity | Mask | Glow |
|---------|-----------|---------|------|------|
| Hero | bg-grid | 100% → 30% (fade) | Radial top-down | Cyan + Violet |
| KPI Strip | None | - | - | - |
| How It Works | bg-grid-sm | 30% | Radial center | None |
| CTA | bg-grid-dots | 40% | - | Violet center |
| CTA Card | bg-grid-sm | 20% | - | - |
| Footer | bg-grid-sm | 20% | Linear fade | - |

## Troubleshooting

**Issue: Grid not visible**
- Check opacity value (3-8% is very subtle)
- Verify z-index layering
- Ensure parent has `position: relative`

**Issue: Grid too prominent**
- Reduce opacity (try 3% instead of 8%)
- Add gradient mask
- Use smaller grid pattern

**Issue: Performance lag**
- Remove blur effects (blur-3xl)
- Reduce number of gradient layers
- Simplify gradient calculations

## Future Enhancements

- [ ] Animated grid lines on scroll
- [ ] Parallax grid movement
- [ ] Dynamic grid color based on section
- [ ] Grid intensity based on scroll depth
