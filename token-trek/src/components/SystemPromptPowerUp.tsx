import type { FC } from 'react'
import { useEffect, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeElements } from '@react-three/fiber'
import type { Mesh } from 'three'

import { usePlayerStore } from '../store/playerStore'
import { useGameStore } from '../store/gameStore'
import { useTrackStore } from '../store/trackStore'

const LANE_WIDTH = 2
const SPEED = 5
const lanes = [-LANE_WIDTH, 0, LANE_WIDTH]

const SystemPromptPowerUp: FC<ThreeElements['mesh']> = (props) => {
  const meshRef = useRef<Mesh>(null!)
  const lane = usePlayerStore((s) => s.lane)
  const activate = useGameStore((s) => s.activateSystemPrompt)
  const isGameOver = useGameStore((s) => s.isGameOver)
  const isGameWon = useGameStore((s) => s.isGameWon)
  const nextPosition = useTrackStore((s) => s.nextPosition)

  const reset = useCallback(() => {
    if (!meshRef.current) return
    const { x, z } = nextPosition()
    meshRef.current.position.set(x, 0.5, z)
  }, [nextPosition])

  useEffect(() => {
    reset()
  }, [reset])

  useFrame((_, dt) => {
    if (isGameOver || isGameWon) return
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
      reset()
    }
  })

  return (
    <mesh ref={meshRef} {...props}>
      <icosahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  )
}

export default SystemPromptPowerUp
