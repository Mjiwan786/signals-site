/**
 * Particle Field - Dense background depth layer
 * Optimized for performance with reduced particle count
 */

'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleFieldProps {
  count?: number
  reducedMotion?: boolean
}

export function ParticleField({ count = 500, reducedMotion = false }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const color = new THREE.Color()

    for (let i = 0; i < count; i++) {
      // Distribute particles in a wider space
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5

      // Color variation between accent colors
      const colorChoice = Math.random()
      if (colorChoice < 0.33) {
        color.set('#6EE7FF') // Cyan
      } else if (colorChoice < 0.66) {
        color.set('#A78BFA') // Violet
      } else {
        color.set('#FF7336') // Orange
      }

      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b
    }

    return [pos, col]
  }, [count])

  useFrame((state) => {
    if (pointsRef.current && !reducedMotion) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.02
    }
  })

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geom
  }, [positions, colors])

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}
