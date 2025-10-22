'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { OrbitalNodes } from './Hero3D/OrbitalNodes';
import { NeuralBeams } from './Hero3D/NeuralBeams';
import { ParticleField } from './Hero3D/ParticleField';

interface AnimatedGeometryProps {
  reducedMotion: boolean;
}

function AnimatedGeometry({ reducedMotion }: AnimatedGeometryProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Animated rotation and float effect
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current || reducedMotion) return;

    const time = state.clock.getElapsedTime();

    // Gentle rotation
    groupRef.current.rotation.y = time * 0.15;
    groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;

    // Gentle float animation
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.2;

    // Gentle scale pulse
    const scale = 1 + Math.sin(time * 0.8) * 0.05;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        {/* Main sphere with distortion for organic look */}
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial
            color="#6EE7FF"
            attach="material"
            distort={0.4}
            speed={reducedMotion ? 0 : 2}
            roughness={0.2}
            metalness={0.8}
            emissive="#6EE7FF"
            emissiveIntensity={0.3}
          />
        </Sphere>
      </mesh>

      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#A78BFA"
          emissive="#A78BFA"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Inner ring */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.3, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#FF7336"
          emissive="#FF7336"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Orbiting particles */}
      {!reducedMotion && <OrbitingParticles />}

      {/* New enhanced components */}
      <OrbitalNodes reducedMotion={reducedMotion} />
      <NeuralBeams reducedMotion={reducedMotion} />
    </group>
  );
}

function OrbitingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 50;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 2 + Math.random() * 1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particles, 3));
    return geo;
  }, [particles]);

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        color="#6EE7FF"
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
}

export default function Hero3D() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch (e) {
      setWebGLSupported(false);
    }

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Fallback for no WebGL support
  if (!webGLSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-gradient-radial opacity-30 blur-3xl" />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
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

        {/* 3D Geometry */}
        <AnimatedGeometry reducedMotion={reducedMotion} />

        {/* Particle field background */}
        {!reducedMotion && <ParticleField count={300} reducedMotion={reducedMotion} />}

        {/* Allow manual rotation only if not reduced motion */}
        {!reducedMotion && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        )}
      </Canvas>
    </div>
  );
}
