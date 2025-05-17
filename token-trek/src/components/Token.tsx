import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import type { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import type { ThreeElements } from '@react-three/fiber'
import { usePlayerStore } from '../store/playerStore'
import { useGameStore } from '../store/gameStore'

const LANE_WIDTH = 2
const SPEED = 5

const lanes = [-LANE_WIDTH, 0, LANE_WIDTH]

const Token: FC<ThreeElements['mesh']> = (props) => {
  const meshRef = useRef<Mesh>(null!)
  const lane = usePlayerStore((s) => s.lane)
  const collectToken = useGameStore((s) => s.collectToken)

  const resetToken = () => {
    if (!meshRef.current) return
    meshRef.current.position.z = 20 + Math.random() * 10
    const laneIndex = Math.floor(Math.random() * 3)
    meshRef.current.position.x = lanes[laneIndex]
  }

  useEffect(() => {
    resetToken()
  }, [])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    mesh.rotation.y += delta * 2
    mesh.position.z -= SPEED * delta
    if (mesh.position.z < -5) {
      resetToken()
      return
    }
    if (
      mesh.position.z <= 0 &&
      mesh.position.z > -1 &&
      Math.abs(mesh.position.x - lanes[lane]) < 0.1
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
