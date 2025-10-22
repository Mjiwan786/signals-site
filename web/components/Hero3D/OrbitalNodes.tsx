/**
 * Orbital Nodes - Floating crypto coin spheres
 * ChainGPT-inspired orbital elements with emissive glow
 */

'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface OrbitalNodesProps {
  reducedMotion?: boolean
}

export function OrbitalNodes({ reducedMotion = false }: OrbitalNodesProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const nodes = [
    { pos: [2, 0.5, 0] as [number, number, number], color: '#6EE7FF', scale: 0.4 },
    { pos: [-2, -0.3, 0.5] as [number, number, number], color: '#A78BFA', scale: 0.35 },
    { pos: [0, 1.5, -1] as [number, number, number], color: '#FF7336', scale: 0.3 },
  ]

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <Sphere key={i} args={[node.scale, 32, 32]} position={node.pos}>
          <MeshDistortMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.5}
            distort={reducedMotion ? 0 : 0.3}
            speed={reducedMotion ? 0 : 2}
            roughness={0.4}
            metalness={0.6}
          />
        </Sphere>
      ))}
    </group>
  )
}
