import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { contextWindowClamp } from '../game/contextWindowClamp'

const LANE_WIDTH = 2
const JUMP_VELOCITY = 8
const GRAVITY = -20
const FLOOR_Y = 0.5

const Player: FC<ThreeElements['mesh']> = (props) => {
  const meshRef = useRef<Mesh>(null!)
  const lane = useRef(1)
  const velocityY = useRef(0)
  const jumping = useRef(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        lane.current = contextWindowClamp(lane.current - 1)
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        lane.current = contextWindowClamp(lane.current + 1)
      } else if (e.code === 'Space' && !jumping.current) {
        jumping.current = true
        velocityY.current = JUMP_VELOCITY
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    mesh.position.x = (-1 + lane.current) * LANE_WIDTH
    if (jumping.current) {
      velocityY.current += GRAVITY * delta
      mesh.position.y += velocityY.current * delta
      if (mesh.position.y <= FLOOR_Y) {
        mesh.position.y = FLOOR_Y
        jumping.current = false
        velocityY.current = 0
      }
    }
  })

  return (
    <mesh ref={meshRef} {...props} position={[0, FLOOR_Y, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

export default Player
