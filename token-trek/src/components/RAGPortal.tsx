import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeElements } from '@react-three/fiber'
import type { Mesh } from 'three'

import { usePlayerStore } from '../store/playerStore'
import { useGameStore } from '../store/gameStore'

const LANE_WIDTH = 2
const SPEED = 5
const lanes = [-LANE_WIDTH, 0, LANE_WIDTH]

const RAGPortal: FC<ThreeElements['mesh']> = (props) => {
  const meshRef = useRef<Mesh>(null!)
  const lane = usePlayerStore((s) => s.lane)
  const setLane = usePlayerStore((s) => s.setLane)
  const activate = useGameStore((s) => s.activateRagPortal)

  const reset = () => {
    if (!meshRef.current) return
    meshRef.current.position.z = 30 + Math.random() * 10
    const laneIndex = Math.floor(Math.random() * 3)
    meshRef.current.position.x = lanes[laneIndex]
  }

  useEffect(() => {
    reset()
  }, [])

  useFrame((_, dt) => {
    const mesh = meshRef.current
    mesh.rotation.y += dt
    mesh.position.z -= SPEED * dt
    if (mesh.position.z < -5) {
      reset()
      return
    }
    if (
      mesh.position.z <= 0 &&
      mesh.position.z > -1 &&
      Math.abs(mesh.position.x - lanes[lane]) < 0.1
    ) {
      activate()
      setLane(1)
      reset()
    }
  })

  return (
    <mesh ref={meshRef} {...props}>
      <torusGeometry args={[0.6, 0.2, 16, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  )
}

export default RAGPortal
