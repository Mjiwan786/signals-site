/**
 * Neural Beams - Connecting lines between orbital nodes
 * Pulsing connection lines with opacity animation
 */

'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NeuralBeamsProps {
  reducedMotion?: boolean
}

export function NeuralBeams({ reducedMotion = false }: NeuralBeamsProps) {
  const linesRef = useRef<THREE.LineSegments>(null)

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    // Create connecting lines between nodes
    pts.push(new THREE.Vector3(2, 0.5, 0))
    pts.push(new THREE.Vector3(-2, -0.3, 0.5))
    pts.push(new THREE.Vector3(-2, -0.3, 0.5))
    pts.push(new THREE.Vector3(0, 1.5, -1))
    pts.push(new THREE.Vector3(0, 1.5, -1))
    pts.push(new THREE.Vector3(2, 0.5, 0))
    return pts
  }, [])

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points)
    return geom
  }, [points])

  useFrame((state) => {
    if (linesRef.current && !reducedMotion) {
      const material = linesRef.current.material as THREE.LineBasicMaterial
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#6EE7FF" transparent opacity={0.3} linewidth={2} />
    </lineSegments>
  )
}
