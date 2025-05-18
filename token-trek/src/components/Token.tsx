import type { FC } from 'react'
import { useEffect, useRef, useCallback } from 'react'
import type { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import type { ThreeElements } from '@react-three/fiber'
import { usePlayerStore } from '../store/playerStore'
import { useGameStore } from '../store/gameStore'
import { useTrackStore } from '../store/trackStore'

const LANE_WIDTH = 2
const SPEED = 5
const lanes = [-LANE_WIDTH, 0, LANE_WIDTH]
const BONUS_OFFSET = 4

interface MeshProps extends Omit<ThreeElements['mesh'], 'id'> { id?: never }
const Token: FC<MeshProps> = ({ id: _discard, ...props }) => {
  void _discard
  const meshRef = useRef<Mesh>(null!)
  const lane = usePlayerStore((s) => s.lane)
  const collectToken = useGameStore((s) => s.collectToken)
  const ragPortalActive = useGameStore((s) => s.ragPortalActive)
  const isGameOver = useGameStore((s) => s.isGameOver)
  const isGameWon = useGameStore((s) => s.isGameWon)
  const nextPosition = useTrackStore((s) => s.nextPosition)

  const resetToken = useCallback(() => {
    if (!meshRef.current) return
    const { x, z } = nextPosition(ragPortalActive ? lane : undefined)
    const offset = ragPortalActive ? BONUS_OFFSET : 0
    meshRef.current.position.set(x + offset, 0.5, z)
  }, [nextPosition, ragPortalActive, lane])

  useEffect(() => {
    resetToken()
  }, [resetToken])

  useFrame((_, delta) => {
    if (isGameOver || isGameWon) return
    const mesh = meshRef.current
    mesh.rotation.y += delta * 2
    mesh.position.z -= (ragPortalActive ? SPEED * 1.5 : SPEED) * delta
    if (mesh.position.z < -5) {
      resetToken()
      return
    }
    const offset = ragPortalActive ? BONUS_OFFSET : 0
    if (
      mesh.position.z <= 0 &&
      mesh.position.z > -1 &&
      Math.abs(mesh.position.x - (lanes[lane] + offset)) < 0.1
    ) {
      collectToken()
      resetToken()
    }
  })

  return (
    <mesh ref={meshRef} {...props}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="cyan" />
    </mesh>
  )
}

export default Token
