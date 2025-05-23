import type { FC } from 'react'
import { useRef, useEffect, useCallback } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { useGameStore } from '../../store/gameStore'
import { useTrackStore } from '../../store/trackStore'

/**
 * A red cube that rotates continuously.
 * Represents a Prompt-Injection obstacle.
 */


interface MeshProps extends Omit<ThreeElements['mesh'], 'id'> { id?: never }
interface Props extends MeshProps { onReset?: (mesh: Mesh) => void }
const PromptInjectionCube: FC<Props> = ({ id: _discard, onReset, ...props }) => {
  void _discard
  const meshRef = useRef<Mesh>(null!)
  const active = useGameStore((s) => s.systemPromptActive)
  const isGameOver = useGameStore((s) => s.isGameOver)
  const isGameWon = useGameStore((s) => s.isGameWon)
  const trackSpeed = useGameStore((s) => s.trackSpeed)
  const nextPosition = useTrackStore((s) => s.nextPosition)

  const reset = useCallback(() => {
    if (!meshRef.current) return
    const { x, z } = nextPosition()
    meshRef.current.position.set(x, 0.5, z)
    if (onReset) onReset(meshRef.current)
  }, [nextPosition, onReset])

  useEffect(() => {
    if (meshRef.current) meshRef.current.visible = !active
  }, [active])

  useEffect(() => {
    reset()
  }, [reset])

  useFrame((_, delta) => {
    if (isGameOver || isGameWon) return
    const mesh = meshRef.current
    if (!mesh) return
    mesh.rotation.x += delta
    mesh.rotation.y += delta
    mesh.position.z += trackSpeed * delta
    if (mesh.position.z > 5) reset()
  })

  return (
    <mesh ref={meshRef} {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
}

export default PromptInjectionCube
