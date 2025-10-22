# Design System & Visual Direction Plan
**Signals-Site — Premium Dark SaaS x AI Experience**

---

## Executive Summary

Transform Signals-Site into a **best-in-class, futuristic crypto-AI trading platform** by combining:
- **ReactBits** polished animated components (hero text effects, backgrounds, loaders)
- **React Three Fiber (R3F)** for lightweight 3D scenes (coins, orbital nodes, neural beams)
- **Motion (Framer Motion)** for production-grade page transitions, scroll effects, staggering
- **Lenis** butter-smooth, accessible scroll for Awwwards-style depth
- **ChainGPT-inspired** high-contrast gradients, neon-glass cards, motion language

**Core Brand Vibe:**
Dark matte base (#0A0B0F), neon-glass accent glows (teal/cyan/magenta), tasteful grain & gradients, micro-interactions that feel "AI-sentient." Motion is quick, confident—hover reveals, frictive parallax, scroll storytelling without overwhelming.

---

## 1. Color System Enhancement

### Current Foundation (Already Implemented)
```css
--bg: #0b0b0f;           /* Dark matte base */
--surface: #0f1116;      /* Card surfaces */
--elev: #1a1a24;         /* Elevated elements */
--accent-a: #6EE7FF;     /* Cyan/Teal */
--accent-b: #A78BFA;     /* Violet */
--highlight: #FF7336;    /* Orange accent */
```

### New Additions for Premium Feel

#### Gradient Presets
```css
/* Add to globals.css */
--gradient-neural: linear-gradient(135deg, #6EE7FF 0%, #A78BFA 50%, #FF7336 100%);
--gradient-mesh: radial-gradient(circle at 20% 50%, rgba(110, 231, 255, 0.15), transparent 50%),
                 radial-gradient(circle at 80% 50%, rgba(167, 139, 250, 0.15), transparent 50%);
--gradient-glow: radial-gradient(circle at center, rgba(110, 231, 255, 0.2), transparent 70%);
```

#### Glass Morphism Variants
```css
--glass-primary: rgba(15, 17, 22, 0.6);
--glass-secondary: rgba(26, 26, 36, 0.4);
--glass-border: rgba(110, 231, 255, 0.15);
--glass-border-hover: rgba(110, 231, 255, 0.35);
```

#### Semantic States
```css
--success-glow: rgba(16, 185, 129, 0.2);
--danger-glow: rgba(239, 68, 68, 0.2);
--warning-glow: rgba(255, 115, 54, 0.2);
--info-glow: rgba(110, 231, 255, 0.2);
```

---

## 2. Typography Enhancements

### Current Setup
- **Sans:** Inter (body text)
- **Display:** Space Grotesk (headlines)

### Recommended Additions

#### Font Weights & Hierarchy
```tsx
// Update tailwind.config.ts fontFamily
fontFamily: {
  sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
  display: ['var(--font-space-grotesk)', 'Space Grotesk', 'system-ui'],
  mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'], // For code/data
}
```

#### Text Effect Classes (ReactBits-Inspired)
```css
/* Add to globals.css utilities */

/* Gradient text */
.text-gradient {
  background: linear-gradient(135deg, var(--accent-a), var(--accent-b));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glow text */
.text-glow {
  text-shadow: 0 0 20px rgba(110, 231, 255, 0.6),
               0 0 40px rgba(110, 231, 255, 0.3);
}

/* Shimmer effect (for loading states) */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.text-shimmer {
  background: linear-gradient(90deg,
    var(--dim) 0%,
    var(--text) 50%,
    var(--dim) 100%);
  background-size: 1000px 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 2s linear infinite;
}
```

---

## 3. Motion System (Framer Motion / Motion)

### Philosophy
- **Quick & Confident:** 200-400ms durations, easeOut/easeInOut
- **Hover reveals:** Subtle scale (1.02-1.05), glow increase, translate
- **Scroll-linked:** Parallax layers, fade-in-up, stagger children
- **Reduced-motion support:** Already implemented, preserve for all new animations

### Animation Presets (Motion Variants)

Create `lib/motion-variants.ts`:

```typescript
import { Variants } from 'framer-motion'

// Fade in from bottom (for sections, cards)
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

// Stagger children (for grids, lists)
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

// Scale + glow on hover (for cards, buttons)
export const hoverGlow = {
  rest: { scale: 1, boxShadow: '0 0 20px rgba(110, 231, 255, 0.05)' },
  hover: {
    scale: 1.03,
    boxShadow: '0 0 40px rgba(110, 231, 255, 0.25)',
    transition: { duration: 0.3, ease: 'easeOut' }
  }
}

// Page transitions (for route changes)
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
}

// Parallax (for scroll-linked elements)
export const parallaxVariants = (offset: number = 50): Variants => ({
  hidden: { y: offset },
  visible: { y: -offset, transition: { duration: 0 } }
})

// Neural beam pulse (for 3D hero effects)
export const neuralPulse = {
  initial: { opacity: 0.3, scale: 0.95 },
  animate: {
    opacity: [0.3, 0.8, 0.3],
    scale: [0.95, 1.05, 0.95],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}
```

### Lenis Smooth Scroll Setup

Create `lib/lenis-scroll.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export function LenisScroll() {
  useEffect(() => {
    // Respect reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return null
}
```

Add to `app/layout.tsx`:
```tsx
import { LenisScroll } from '@/lib/lenis-scroll'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LenisScroll />
        {children}
      </body>
    </html>
  )
}
```

---

## 4. Three.js / R3F 3D Enhancements

### Current Hero3D Status
You have `Hero3D.tsx` — now enhance with:

#### Orbital Nodes (Crypto Coins Floating)
```typescript
// components/Hero3D/OrbitalNodes.tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export function OrbitalNodes() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const nodes = [
    { pos: [2, 0.5, 0], color: '#6EE7FF', scale: 0.4 },
    { pos: [-2, -0.3, 0.5], color: '#A78BFA', scale: 0.35 },
    { pos: [0, 1.5, -1], color: '#FF7336', scale: 0.3 },
  ]

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <Sphere key={i} args={[node.scale, 32, 32]} position={node.pos as [number, number, number]}>
          <MeshDistortMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.5}
            distort={0.3}
            speed={2}
            roughness={0.4}
          />
        </Sphere>
      ))}
    </group>
  )
}
```

#### Neural Beams (Connecting Lines)
```typescript
// components/Hero3D/NeuralBeams.tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function NeuralBeams() {
  const linesRef = useRef<THREE.LineSegments>(null)

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    // Create connecting lines between nodes
    pts.push(new THREE.Vector3(2, 0.5, 0))
    pts.push(new THREE.Vector3(-2, -0.3, 0.5))
    pts.push(new THREE.Vector3(-2, -0.3, 0.5))
    pts.push(new THREE.Vector3(0, 1.5, -1))
    return pts
  }, [])

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points)
    return geom
  }, [points])

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#6EE7FF" transparent opacity={0.3} />
    </lineSegments>
  )
}
```

#### Particle Field (Background Depth)
```typescript
// components/Hero3D/ParticleField.tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleField({ count = 500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const color = new THREE.Color()

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5

      color.setHSL(0.5 + Math.random() * 0.1, 0.7, 0.5)
      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b
    }

    return [pos, col]
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} />
    </points>
  )
}
```

---

## 5. Component-Level Enhancements

### A. Navbar (Sticky Blur Effect)

**Current:** Basic sticky navbar
**Target:** ChainGPT-style backdrop blur with border glow on scroll

```tsx
// components/Navbar.tsx enhancement
'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function Navbar() {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50)
    })
    return () => unsubscribe()
  }, [scrollY])

  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(11, 11, 15, 0)', 'rgba(11, 11, 15, 0.8)']
  )

  return (
    <motion.nav
      style={{ backgroundColor: navBackground }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-lg border-b border-accent-glow' : ''
      }`}
    >
      {/* Nav content */}
    </motion.nav>
  )
}
```

### B. Hero Section (Animated Text with ReactBits Style)

```tsx
// components/Hero.tsx enhancement
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/motion-variants'

export function Hero() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen flex items-center justify-center"
    >
      <motion.h1
        variants={fadeInUp}
        className="text-6xl md:text-8xl font-display font-bold text-gradient text-center"
      >
        AI-Powered Crypto Signals
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        className="mt-6 text-xl text-dim max-w-2xl text-center"
      >
        Real-time trading intelligence powered by advanced machine learning
      </motion.p>

      <motion.div
        variants={fadeInUp}
        className="mt-10 flex gap-4"
      >
        <button className="glass-card-hover px-8 py-4 rounded-xl text-accent font-semibold">
          View Live Signals
        </button>
        <button className="bg-gradient-brand px-8 py-4 rounded-xl font-semibold">
          Start Trading
        </button>
      </motion.div>
    </motion.section>
  )
}
```

### C. Signals Table (Micro-interactions)

```tsx
// components/SignalsTable.tsx enhancement
import { motion } from 'framer-motion'

export function SignalRow({ signal }: { signal: Signal }) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01, backgroundColor: 'rgba(110, 231, 255, 0.05)' }}
      transition={{ duration: 0.2 }}
      className="border-b border-border cursor-pointer"
    >
      <td className="py-4 px-6">{signal.pair}</td>
      <td className={`py-4 px-6 ${signal.side === 'buy' ? 'text-success' : 'text-danger'}`}>
        {signal.side.toUpperCase()}
      </td>
      {/* More cells */}
    </motion.tr>
  )
}
```

### D. KPI Strip (Count-up Animation)

```tsx
// lib/useCountUp.ts already exists, enhance with glow
export function KPICard({ label, value, prefix }: KPICardProps) {
  const count = useCountUp(value, 2000)

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass-card-hover p-6 rounded-xl text-center"
    >
      <div className="text-4xl font-display font-bold text-gradient">
        {prefix}{count}
      </div>
      <div className="mt-2 text-dim">{label}</div>
    </motion.div>
  )
}
```

---

## 6. Grain Texture Overlay

Add subtle film grain for premium analog feel:

```css
/* Add to globals.css */
@layer base {
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0.03;
    z-index: 9999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }
}

/* Disable for reduced motion */
@media (prefers-reduced-motion: reduce) {
  body::before {
    display: none;
  }
}
```

---

## 7. Scroll-Linked Parallax

Create `lib/use-parallax.ts`:

```typescript
import { useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef } from 'react'

export function useParallax(distance: number = 50): MotionValue<number> {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance])
  return y
}

// Usage in component:
// const y = useParallax(100)
// <motion.div style={{ y }}>Content</motion.div>
```

---

## 8. Loading States (ReactBits-Inspired)

Create `components/Loader.tsx`:

```tsx
import { motion } from 'framer-motion'

export function NeuralLoader() {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full bg-accent"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  )
}

export function PulseLoader() {
  return (
    <motion.div
      className="w-16 h-16 rounded-full border-2 border-accent"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5],
        borderColor: ['#6EE7FF', '#A78BFA', '#6EE7FF']
      }}
      transition={{
        duration: 2,
        repeat: Infinity
      }}
    />
  )
}
```

---

## 9. Implementation Checklist

### Phase 1: Foundation Enhancements
- [ ] Install Lenis: `npm install @studio-freight/lenis`
- [ ] Install Motion: `npm install framer-motion@latest`
- [ ] Install R3F helpers: `npm install @react-three/drei`
- [ ] Create `lib/motion-variants.ts` with animation presets
- [ ] Create `lib/lenis-scroll.tsx` and add to layout
- [ ] Add grain texture overlay to `globals.css`
- [ ] Add gradient presets and glass variants to `globals.css`

### Phase 2: Component Enhancements
- [ ] Enhance Navbar with scroll-linked blur + glow
- [ ] Upgrade Hero with animated text (fadeInUp + stagger)
- [ ] Add micro-interactions to SignalsTable rows
- [ ] Enhance KPI Strip with hover glows
- [ ] Update CTA buttons with hover states (scale + glow)

### Phase 3: 3D Enhancements
- [ ] Add `OrbitalNodes.tsx` to Hero3D
- [ ] Add `NeuralBeams.tsx` to Hero3D
- [ ] Add `ParticleField.tsx` to Hero3D
- [ ] Optimize R3F performance (throttle when tab hidden)
- [ ] Add WebGL fallback for unsupported devices

### Phase 4: Scroll & Parallax
- [ ] Create `lib/use-parallax.ts` hook
- [ ] Apply parallax to Hero background elements
- [ ] Apply parallax to section backgrounds
- [ ] Test Lenis smooth scroll on all pages
- [ ] Verify reduced-motion disables all effects

### Phase 5: Polish & Testing
- [ ] Add loading states (NeuralLoader, PulseLoader)
- [ ] Create reusable glass-card components
- [ ] Test all animations on mobile (60 FPS target)
- [ ] Lighthouse audit (≥90 Performance/A11y)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Document component variants in Storybook (optional)

---

## 10. Performance Budget

| Asset Type | Budget | Current | Notes |
|------------|--------|---------|-------|
| Initial JS | ≤250KB | TBD | Lazy-load R3F, charts |
| Hero3D | ≤150KB | TBD | Low-poly meshes, <1k particles |
| Fonts | ≤100KB | TBD | Subset to Latin, self-host |
| Images | ≤500KB | TBD | WebP/AVIF, lazy-load below fold |
| LCP | <2s | TBD | Hero visible w/o JS |
| FID/INP | <100ms | TBD | Throttle scroll handlers |

---

## 11. Accessibility Checklist

- [x] Reduced-motion support (already implemented)
- [ ] Keyboard navigation for all interactive elements
- [ ] Focus visible styles (outline: 2px solid accent)
- [ ] ARIA live regions for streaming signals
- [ ] Color contrast ≥ AA (4.5:1 text, 3:1 UI)
- [ ] Alt text for all images/icons
- [ ] Skip-to-main link for keyboard users
- [ ] Screen reader testing (NVDA, VoiceOver)

---

## 12. Reference Links

- **ReactBits:** https://reactbits.dev (animated components)
- **React Three Fiber:** https://docs.pmnd.rs/react-three-fiber (R3F docs)
- **Motion:** https://motion.dev (Framer Motion v11+)
- **Lenis:** https://github.com/studio-freight/lenis (smooth scroll)
- **ChainGPT:** https://www.chaingpt.org (brand reference)

---

## Next Steps

1. **Run current build:** `npm run dev` → verify baseline
2. **Install dependencies:** Lenis, Motion updates, R3F helpers
3. **Implement Phase 1** (foundation enhancements)
4. **Iterate visually:** Compare each change to ChainGPT/ReactBits references
5. **Performance test:** Lighthouse after each phase
6. **Document:** Screenshot before/after, update README

---

**End of Design System Plan**
*Last updated: 2025-10-19*
*Generated for Signals-Site MVP → Acquire-Ready*
