import type { FC, RefObject } from 'react'
import { useEffect, useRef } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import type { Mesh, Box3 } from 'three'
import { Box3 as ThreeBox3 } from 'three'
import { contextWindowClamp } from '../game/contextWindowClamp'
import { useGameStore } from '../store/gameStore'

const LANE_WIDTH = 2
const JUMP_VELOCITY = 8
const GRAVITY = -20
const FLOOR_Y = 0.5

type PlayerProps = ThreeElements['mesh'] & {
  obstacles?: RefObject<Mesh>[]
}

const Player: FC<PlayerProps> = ({ obstacles = [], ...props }) => {
  const meshRef = useRef<Mesh>(null!)
  const lane = useRef(1)
  const velocityY = useRef(0)
  const jumping = useRef(false)
  const collided = useRef<Set<Mesh>>(new Set())
  const reduceHealth = useGameStore((s) => s.reduceHealth)
  const isGameOver = useGameStore((s) => s.isGameOver)
  const playerBoxRef = useRef<Box3>(new ThreeBox3())
  const obstacleBoxRef = useRef<Box3>(new ThreeBox3())

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
    if (isGameOver) return
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

    playerBoxRef.current.setFromObject(mesh)
    obstacles.forEach((oRef) => {
      const o = oRef.current
      if (!o || collided.current.has(o)) return
      obstacleBoxRef.current.setFromObject(o)
      if (playerBoxRef.current.intersectsBox(obstacleBoxRef.current)) {
        collided.current.add(o)
        reduceHealth(10)
      }
    })
  })

  return (
    <mesh ref={meshRef} {...props} position={[0, FLOOR_Y, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

export default Player
