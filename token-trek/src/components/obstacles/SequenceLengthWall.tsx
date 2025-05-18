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
interface MeshProps extends Omit<ThreeElements['mesh'], 'id'> { id?: never }

interface Props extends MeshProps {
  appearAfter?: number
  onReset?: (mesh: Mesh) => void
}



const SequenceLengthWall: FC<Props> = ({
  id: _discard,
  appearAfter = 30,
  onReset,
  ...props
}) => {
  void _discard
  const meshRef = useRef<Mesh>(null!)
  const isGameOver = useGameStore((s) => s.isGameOver)
  const isGameWon = useGameStore((s) => s.isGameWon)
  const trackSpeed = useGameStore((s) => s.trackSpeed)
  const nextPosition = useTrackStore((s) => s.nextPosition)
  const startTime = useRef<number>(0)

  const reset = useCallback(
    (clockTime: number) => {
      if (!meshRef.current) return
      const { x, z } = nextPosition()
      meshRef.current.position.set(x, 1, z)
      meshRef.current.visible = false
      startTime.current = clockTime
      if (onReset) onReset(meshRef.current)
    },
    [nextPosition, onReset],
  )

  useEffect(() => {
    reset(0)
  }, [reset])

  useFrame(({ clock }, dt) => {
    if (isGameOver || isGameWon) return
    const mesh = meshRef.current
    if (!mesh) return
    const elapsed = clock.getElapsedTime() - startTime.current
    if (elapsed >= appearAfter) mesh.visible = true
    mesh.position.z += trackSpeed * dt
    if (mesh.position.z > 5) reset(clock.getElapsedTime())
  })

  return (
    <mesh ref={meshRef} {...props} visible={false}>
      <boxGeometry args={[2, 2, 0.5]} />
      <meshStandardMaterial color="purple" />
    </mesh>
  )
}

export default SequenceLengthWall
