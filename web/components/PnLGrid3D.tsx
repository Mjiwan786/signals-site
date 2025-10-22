'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * PnLGrid3D - Subtle 3D grid background for PnL chart section
 *
 * Features:
 * - Wireframe grid plane with perspective effect
 * - Gentle wave animation across Z-axis
 * - Respects prefers-reduced-motion
 * - Transparent cyan lines matching brand
 */

function AnimatedGrid({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create grid geometry with vertices we can animate
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 40, 40);
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;

    const time = state.clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position;

    // Subtle wave animation across the grid
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);

      // Create wave pattern
      const waveX = Math.sin(x * 0.3 + time * 0.5) * 0.15;
      const waveY = Math.sin(y * 0.3 + time * 0.5) * 0.15;

      positions.setZ(i, waveX + waveY);
    }

    positions.needsUpdate = true;

    // Gentle rotation
    meshRef.current.rotation.x = -Math.PI / 3 + Math.sin(time * 0.2) * 0.05;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 3, 0, 0]} position={[0, -3, -5]}>
      <meshBasicMaterial
        color="#6EE7FF"
        wireframe
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function PnLGrid3D() {
  // Check for reduced motion preference
  const reducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 2]}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <ambientLight intensity={0.5} />
      <AnimatedGrid reducedMotion={reducedMotion} />
    </Canvas>
  );
}
