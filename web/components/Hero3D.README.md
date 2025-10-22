# Hero3D Component

3D animated hero section built with React Three Fiber (`@react-three/fiber`) and Drei (`@react-three/drei`).

## Overview

The `Hero3D` component renders an abstract 3D geometric shape with the following features:
- **Central Sphere:** Distorted mesh material with emissive cyan glow (#6EE7FF)
- **Outer Ring:** Violet torus (#A78BFA) rotating on X-axis
- **Inner Ring:** Orange torus (#FF7336) rotating on Y-axis
- **Orbiting Particles:** 50 cyan particles orbiting the geometry

## Features

### ✨ Animations

All animations use `useFrame` from React Three Fiber:

1. **Rotation** (Y-axis): `time * 0.15`
2. **Tilt** (X-axis): `sin(time * 0.3) * 0.1`
3. **Float** (Y-position): `sin(time * 0.5) * 0.2`
4. **Scale Pulse**: `1 + sin(time * 0.8) * 0.05`
5. **Particle Orbit**: `time * 0.1`

### ♿ Accessibility

**Prefers-Reduced-Motion Support:**
- Detects `(prefers-reduced-motion: reduce)` media query
- When enabled:
  - All animations pause (rotation, float, scale)
  - MeshDistortMaterial speed set to 0
  - Orbiting particles hidden
  - OrbitControls disabled

**Implementation:**
```tsx
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  setReducedMotion(mediaQuery.matches);

  const handleChange = (e: MediaQueryListEvent) => {
    setReducedMotion(e.matches);
  };

  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);
```

### 🎨 Lighting Setup

```tsx
<ambientLight intensity={0.5} />
<pointLight position={[10, 10, 10]} intensity={1} color="#6EE7FF" />
<pointLight position={[-10, -10, -10]} intensity={0.5} color="#A78BFA" />
<spotLight
  position={[0, 10, 0]}
  angle={0.3}
  penumbra={1}
  intensity={1}
  color="#FF7336"
/>
```

### 🔄 WebGL Fallback

If WebGL is not supported, the component renders a static radial gradient:

```tsx
<div className="w-64 h-64 rounded-full bg-gradient-radial opacity-30 blur-3xl" />
```

WebGL detection:
```tsx
try {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) setWebGLSupported(false);
} catch (e) {
  setWebGLSupported(false);
}
```

## Integration in Hero Component

The Hero3D component is lazy-loaded with SSR disabled:

```tsx
import dynamic from 'next/dynamic';

const Hero3D = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-64 h-64 rounded-full bg-gradient-radial opacity-30 blur-3xl" />
    </div>
  ),
});
```

**Positioning:**
```tsx
<div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-60">
  <Hero3D />
</div>
```

## Performance Optimizations

1. **Dynamic Import:** 3D component only loads on client-side
2. **Lazy Loading:** Uses Next.js dynamic() with SSR disabled
3. **DPR Limit:** `dpr={[1, 2]}` caps device pixel ratio
4. **Geometry Memoization:** Particle positions calculated once with `useMemo`
5. **Conditional Rendering:** Particles hidden when reduced motion is enabled

## Camera Settings

```tsx
<Canvas
  camera={{ position: [0, 0, 5], fov: 50 }}
  gl={{ antialias: true, alpha: true }}
  dpr={[1, 2]}
>
```

- **Position:** `[0, 0, 5]` - 5 units back on Z-axis
- **FOV:** 50 degrees
- **Antialiasing:** Enabled for smooth edges
- **Alpha:** Transparent background

## Color Palette

Matches PRD specifications:

| Element | Color | Hex | Variable |
|---------|-------|-----|----------|
| Main Sphere (Emissive) | Cyan | #6EE7FF | --accent-a |
| Outer Ring | Violet | #A78BFA | --accent-b |
| Inner Ring | Orange | #FF7336 | --highlight |
| Particles | Cyan | #6EE7FF | --accent-a |

## Browser Support

- **Modern Browsers:** Chrome 56+, Firefox 51+, Safari 15+, Edge 79+
- **WebGL Required:** Falls back to static gradient if not supported
- **Mobile:** Tested on iOS Safari, Chrome Android

## Performance Metrics (Target)

- **FPS:** 60fps on desktop, 30fps on mobile
- **Load Time:** < 500ms for 3D assets
- **Bundle Size:** ~150KB (Three.js + R3F + Drei)

## Troubleshooting

**Issue: 3D not rendering**
- Check browser console for WebGL errors
- Verify GPU acceleration enabled in browser settings
- Ensure `ssr: false` in dynamic import

**Issue: Animations choppy**
- Reduce particle count (line 87: `const count = 50`)
- Lower distortion complexity (line 46: `distort={0.4}`)
- Disable auto-rotation in OrbitControls

**Issue: Build errors**
- Ensure all R3F/Drei components are client-side only
- Use `'use client'` directive at top of file
- Check TypeScript types for buffer geometry

## Future Enhancements

- [ ] GLTF model support for more complex shapes
- [ ] Custom shaders for advanced effects
- [ ] Interactive mouse parallax
- [ ] Bloom post-processing
- [ ] Custom particle textures
