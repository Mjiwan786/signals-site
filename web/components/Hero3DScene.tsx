'use client';

import * as React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function hasWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch { return false; }
}

/**
 * Particle system with instanced rendering for performance
 * Max 1000 particles with randomized positions
 */
function Particles({ count = 800 }: { count?: number }) {
  const meshRef = React.useRef<THREE.InstancedMesh>(null);
  const dummy = React.useMemo(() => new THREE.Object3D(), []);

  // Generate random particle positions once
  const particles = React.useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
        ],
        scale: Math.random() * 0.03 + 0.01,
        speed: Math.random() * 0.0005 + 0.0002,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;

    particles.forEach((particle, i) => {
      const t = state.clock.elapsedTime * particle.speed;
      dummy.position.set(
        particle.position[0] + Math.sin(t) * 0.1,
        particle.position[1] + Math.cos(t * 0.7) * 0.1,
        particle.position[2]
      );
      dummy.scale.setScalar(particle.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#6EE7FF" transparent opacity={0.4} />
    </instancedMesh>
  );
}

/**
 * Main 3D mesh - low-poly icosahedron with emissive glow
 */
function MainMesh() {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Slow rotation
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial
          color="#6EE7FF"
          emissive="#2ad1ff"
          emissiveIntensity={0.5}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>
    </Float>
  );
}

/**
 * SVG fallback gradient for non-WebGL environments
 */
function SVGFallback() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="3D visualization fallback"
    >
      <defs>
        <radialGradient id="heroGradient" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#19202B" stopOpacity="1" />
          <stop offset="50%" stopColor="#0f1520" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0b0b0f" stopOpacity="1" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect width="400" height="400" fill="url(#heroGradient)" />
      <circle
        cx="200"
        cy="180"
        r="80"
        fill="none"
        stroke="#6EE7FF"
        strokeWidth="2"
        opacity="0.6"
        filter="url(#glow)"
      />
      <circle
        cx="200"
        cy="180"
        r="60"
        fill="none"
        stroke="#2ad1ff"
        strokeWidth="1.5"
        opacity="0.4"
      />
    </svg>
  );
}

export default function Hero3DScene() {
  const [isVisible, setIsVisible] = React.useState(true);

  // Reduced motion: prefer static fallback
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Suspend on tab blur/visibility change
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (prefersReducedMotion || !hasWebGL()) {
    return <SVGFallback />;
  }

  return (
    <Canvas
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        alpha: true,
      }}
      frameloop={isVisible ? 'always' : 'never'}
      onCreated={({ gl }) => {
        gl.setClearColor('#0b0b0f', 1);
      }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#6EE7FF" />

      <MainMesh />
      <Particles count={800} />
    </Canvas>
  );
}
