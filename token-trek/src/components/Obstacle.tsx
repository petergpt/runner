import { forwardRef, useEffect, useRef, useCallback } from 'react'
import type { Mesh } from 'three'
import type { ThreeElements } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import { useTrackStore } from '../store/trackStore'
import { useGameStore } from '../store/gameStore'

interface MeshProps extends Omit<ThreeElements['mesh'], 'id'> { id?: never }
interface Props extends MeshProps {
  /** called when the obstacle respawns ahead of the player */
  onReset?: (mesh: Mesh) => void
}

const Obstacle = forwardRef<Mesh, Props>(({ id: _discard, onReset, ...props }, ref) => {
  void _discard
  const meshRef = useRef<Mesh>(null!)
  const nextPosition = useTrackStore((s) => s.nextPosition)
  const isGameOver = useGameStore((s) => s.isGameOver)
  const isGameWon = useGameStore((s) => s.isGameWon)
  const trackSpeed = useGameStore((s) => s.trackSpeed)

  const reset = useCallback(() => {
    const { x, z } = nextPosition()
    meshRef.current.position.set(x, 0.5, z)
    if (onReset) onReset(meshRef.current)
  }, [nextPosition, onReset])

  useEffect(() => {
    reset()
  }, [reset])

  useFrame((_, dt) => {
    if (isGameOver || isGameWon) return
    meshRef.current.position.z += trackSpeed * dt
    if (meshRef.current.position.z > 5) reset()
  })

  return (
    <mesh ref={(node) => {
      meshRef.current = node!
      if (typeof ref === 'function') ref(node!)
      else if (ref) (ref as React.MutableRefObject<Mesh | null>).current = node!
    }} {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
})

export default Obstacle
