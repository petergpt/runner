import type { FC } from 'react'
import { useEffect, useRef, useCallback } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { useGameStore } from '../../store/gameStore'
import { useTrackStore } from '../../store/trackStore'

/**
 * Two bars that slide together to block a lane.
 */


interface GroupProps extends Omit<ThreeElements['group'], 'id'> { id?: never }
interface Props extends GroupProps { onReset?: (mesh: Mesh) => void }
const RateLimitGate: FC<Props> = ({ id: _discard, onReset, ...props }) => {
  void _discard
  const leftRef = useRef<Mesh>(null!)
  const rightRef = useRef<Mesh>(null!)
  const groupRef = useRef<Mesh>(null!)
  const isGameOver = useGameStore((s) => s.isGameOver)
  const isGameWon = useGameStore((s) => s.isGameWon)
  const trackSpeed = useGameStore((s) => s.trackSpeed)
  const nextPosition = useTrackStore((s) => s.nextPosition)

  const reset = useCallback(() => {
    const { x, z } = nextPosition()
    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z)
      if (onReset) onReset(groupRef.current)
    }
  }, [nextPosition, onReset])

  useEffect(() => {
    reset()
  }, [reset])

  useFrame(({ clock }, dt) => {
    if (isGameOver || isGameWon) return
    const t = Math.sin(clock.getElapsedTime()) // -1..1
    const offset = 1 - Math.abs(t) // 0..1
    leftRef.current.position.x = -1 - offset
    rightRef.current.position.x = 1 + offset
    if (groupRef.current) {
      groupRef.current.position.z += trackSpeed * dt
      if (groupRef.current.position.z > 5) reset()
    }
  })
  return (
    <group ref={groupRef} {...props}>
      <mesh ref={leftRef} position={[-1, 1, 0]}>
        <boxGeometry args={[0.2, 2, 0.2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <mesh ref={rightRef} position={[1, 1, 0]}>
        <boxGeometry args={[0.2, 2, 0.2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  )
}

export default RateLimitGate
