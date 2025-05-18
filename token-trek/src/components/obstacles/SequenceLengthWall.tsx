import type { FC } from 'react'
import { useEffect, useRef, useCallback } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { useGameStore } from '../../store/gameStore'
import { useTrackStore } from '../../store/trackStore'

/**
 * A wall that appears after a delay, forcing the player to jump.
 */
type MeshProps = ThreeElements['mesh']

interface Props extends MeshProps {
  appearAfter?: number
}

const SPEED = 5

const SequenceLengthWall: FC<Props> = ({ appearAfter = 30, ...props }) => {
  const meshRef = useRef<Mesh>(null!)
  const isGameOver = useGameStore((s) => s.isGameOver)
  const isGameWon = useGameStore((s) => s.isGameWon)
  const nextPosition = useTrackStore((s) => s.nextPosition)
  const startTime = useRef<number>(0)

  const reset = useCallback((clockTime: number) => {
    const { x, z } = nextPosition()
    meshRef.current.position.set(x, 1, z)
    meshRef.current.visible = false
    startTime.current = clockTime
  }, [nextPosition])

  useEffect(() => {
    reset(0)
  }, [reset])

  useFrame(({ clock }, dt) => {
    if (isGameOver || isGameWon) return
    const elapsed = clock.getElapsedTime() - startTime.current
    if (elapsed >= appearAfter) meshRef.current.visible = true
    meshRef.current.position.z -= SPEED * dt
    if (meshRef.current.position.z < -5) reset(clock.getElapsedTime())
  })

  return (
    <mesh ref={meshRef} {...props} visible={false}>
      <boxGeometry args={[2, 2, 0.5]} />
      <meshStandardMaterial color="purple" />
    </mesh>
  )
}

export default SequenceLengthWall
