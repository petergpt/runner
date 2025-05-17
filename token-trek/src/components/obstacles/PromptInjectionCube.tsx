import type { FC } from 'react'
import { useRef, useEffect } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { useGameStore } from '../../store/gameStore'

/**
 * A red cube that rotates continuously.
 * Represents a Prompt-Injection obstacle.
 */
const PromptInjectionCube: FC<ThreeElements['mesh']> = (props) => {
  const meshRef = useRef<Mesh>(null!)
  const active = useGameStore((s) => s.systemPromptActive)
  const isGameOver = useGameStore((s) => s.isGameOver)
  const isGameWon = useGameStore((s) => s.isGameWon)

  useEffect(() => {
    if (meshRef.current) meshRef.current.visible = !active
  }, [active])
  useFrame((_, delta) => {
    if (isGameOver || isGameWon) return
    meshRef.current.rotation.x += delta
    meshRef.current.rotation.y += delta
  })
  return (
    <mesh ref={meshRef} {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
}

export default PromptInjectionCube
