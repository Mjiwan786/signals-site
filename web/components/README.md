# Core Layout Components

This directory contains the core layout components for the Signals-Site application.

## Components

### Navbar
**File:** `Navbar.tsx`

Sticky navigation bar with semi-transparent backdrop blur effect.

**Features:**
- Logo with glowing icon (Activity from lucide-react)
- Gradient wordmark using brand colors
- Active state indicators with underline
- Glowing "Join Discord" CTA button with hover effects
- Fully accessible with keyboard navigation

**Nav Links:**
- Dashboard
- Performance
- Pricing
- Docs

### Footer
**File:** `Footer.tsx`

ChainGPT-inspired multi-column footer with partner logos and social links.

**Structure:**
- **Column 1 (Brand):** Logo, tagline, social icons
- **Column 2 (Product):** Live Signals, Performance, Dashboard, Pricing
- **Column 3 (Company):** Documentation, Changelog, Methodology, Contact
- **Column 4 (Legal):** Terms, Privacy, Risk Disclaimer
- **Partners Section:** Placeholder partner logo grid
- **Bottom Bar:** Copyright and credits

### Section
**File:** `Section.tsx`

Reusable section wrapper component for standardized layouts.

**Props:**
```tsx
interface SectionProps {
  children: ReactNode;
  className?: string;
  bg?: "default" | "surface" | "elev" | "transparent";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  noPadding?: boolean;
  grid?: "none" | "default" | "sm" | "lg" | "dots";
  border?: "none" | "top" | "bottom" | "both";
  id?: string;
  ariaLabel?: string;
}
```

**Usage Examples:**

```tsx
// Basic section
<Section>
  <h1>Content</h1>
</Section>

// With grid overlay and border
<Section grid="default" border="both" bg="surface">
  <h2>Hero Section</h2>
</Section>

// Custom size with dots grid
<Section size="xl" grid="dots" bg="transparent">
  <div>Full width content</div>
</Section>
```

**Grid Options:**
- `none`: No grid (default)
- `default`: 40px grid
- `sm`: 20px grid
- `lg`: 80px grid
- `dots`: Radial dot pattern

**Size Options:**
- `sm`: max-w-3xl
- `md`: max-w-5xl
- `lg`: max-w-6xl (default)
- `xl`: max-w-7xl
- `full`: max-w-full

## Design System

### Colors
- **Background:** `#0b0b0f` (--bg)
- **Surface:** `#0f1116` (--surface)
- **Accent A (Cyan):** `#6EE7FF` (--accent-a)
- **Accent B (Violet):** `#A78BFA` (--accent-b)
- **Highlight (Orange):** `#FF7336` (--highlight)

### Typography
- **Sans (Body):** Inter
- **Display (Headers):** Space Grotesk

### Effects
- **Glow Shadow:** `0 0 40px rgba(110, 231, 255, 0.3)`
- **Gradient Brand:** `linear-gradient(135deg, var(--accent-a), var(--accent-b))`
- **Backdrop Blur:** Applied to navbar and footer

## Accessibility

All components follow WCAG 2.1 AA standards:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus-visible states
- Reduced motion support (automatically disables animations and transforms)
- Skip-to-main-content link in layout

## Environment Variables

- `NEXT_PUBLIC_SITE_NAME`: Site name for branding (default: "AI Predicted Signals")
- `NEXT_PUBLIC_DISCORD_INVITE`: Discord invite link for CTA buttons
