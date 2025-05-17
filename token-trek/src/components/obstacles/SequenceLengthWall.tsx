import type { FC } from 'react'
import { useRef } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { useGameStore } from '../../store/gameStore'

/**
 * A wall that appears after a delay, forcing the player to jump.
 */
type MeshProps = ThreeElements['mesh']

interface Props extends MeshProps {
  appearAfter?: number
}

const SequenceLengthWall: FC<Props> = ({ appearAfter = 30, ...props }) => {
  const meshRef = useRef<Mesh>(null!)
  const isGameOver = useGameStore((s) => s.isGameOver)
  const isGameWon = useGameStore((s) => s.isGameWon)
  useFrame(({ clock }) => {
    if (isGameOver || isGameWon) return
    if (meshRef.current) {
      meshRef.current.visible = clock.getElapsedTime() >= appearAfter
    }
  })
  return (
    <mesh ref={meshRef} {...props} visible={false}>
      <boxGeometry args={[2, 2, 0.5]} />
      <meshStandardMaterial color="purple" />
    </mesh>
  )
}

export default SequenceLengthWall
