import { FC, RefObject, MutableRefObject, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeElements } from '@react-three/fiber'
import type { Mesh, Box3, MeshStandardMaterial } from 'three'
import { Box3 as ThreeBox3, MathUtils } from 'three'

import { contextWindowClamp } from '../game/contextWindowClamp'
import { useGameStore } from '../store/gameStore'
import { usePlayerStore } from '../store/playerStore'

const LANE_WIDTH = 2
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]
const BONUS_OFFSET = 4
const JUMP_VELOCITY = 8
const GRAVITY = -20
const FLOOR_Y = 0.5

interface MeshProps extends Omit<ThreeElements['mesh'], 'id'> { id?: never }

interface PlayerProps extends MeshProps {
  obstacles?: RefObject<Mesh>[]
  /** External set tracking which obstacles have already triggered a collision. */
  collidedRef?: MutableRefObject<Set<Mesh>>
}

const Player: FC<PlayerProps> = ({
  obstacles = [],
  collidedRef,
  ...meshProps
}) => {
  const meshRef = useRef<Mesh>(null!)
  const materialRef = useRef<MeshStandardMaterial>(null!)

  /* --- movement state --- */
  const velocityY = useRef(0)
  const jumping = useRef(false)

  /* --- collision state --- */
  const internalCollided = useRef<Set<Mesh>>(new Set())
  const collided = collidedRef ?? internalCollided

  /* --- bounding boxes (re-used each frame to avoid GC) --- */
  const playerBox = useRef<Box3>(new ThreeBox3())
  const obstacleBox = useRef<Box3>(new ThreeBox3())

  /* --- global stores --- */
  const lane = usePlayerStore((s) => s.lane)
  const setLane = usePlayerStore((s) => s.setLane)

  const {
    reduceHealth,
    isGameOver,
    isGameWon,
    ragPortalActive,
    lastDamageTime,
    lastTokenTime,
  } = useGameStore((s) => ({
    reduceHealth: s.reduceHealth,
    isGameOver: s.isGameOver,
    isGameWon: s.isGameWon,
    ragPortalActive: s.ragPortalActive,
    lastDamageTime: s.lastDamageTime,
    lastTokenTime: s.lastTokenTime,
  }))

  /* --- helpers --- */
  const flashColor = (hex: string, duration = 200) => {
    if (!materialRef.current) return
    materialRef.current.color.set(hex)
    setTimeout(() => materialRef.current?.color.set('hotpink'), duration)
  }

  /* --- keyboard controls --- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyA':
        case 'ArrowLeft':
          setLane((l) => contextWindowClamp(l - 1))
          break
        case 'KeyD':
        case 'ArrowRight':
          setLane((l) => contextWindowClamp(l + 1))
          break
        case 'Space':
          if (!jumping.current) {
            jumping.current = true
            velocityY.current = JUMP_VELOCITY
          }
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setLane])

  /* --- visual feedback --- */
  useEffect(() => {
    if (lastDamageTime) flashColor('red')
  }, [lastDamageTime])

  useEffect(() => {
    if (lastTokenTime) flashColor('cyan')
  }, [lastTokenTime])

  /* --- per-frame logic --- */
  useFrame((_, dt) => {
    if (isGameOver || isGameWon) return

    const mesh = meshRef.current

    /* side-to-side lane movement with bonus offset */
    const targetX = LANES[lane] + (ragPortalActive ? BONUS_OFFSET : 0)
    mesh.position.x = MathUtils.damp(mesh.position.x, targetX, 10, dt)

    /* jumping / gravity */
    if (jumping.current) {
      velocityY.current += GRAVITY * dt
      mesh.position.y += velocityY.current * dt
      if (mesh.position.y <= FLOOR_Y) {
        mesh.position.y = FLOOR_Y
        jumping.current = false
        velocityY.current = 0
      }
    }

    /* collision detection */
    playerBox.current.setFromObject(mesh)
    obstacles.forEach((oref) => {
      const obstacle = oref.current
      if (!obstacle || !obstacle.visible || collided.current.has(obstacle)) return
      obstacleBox.current.setFromObject(obstacle)
      if (playerBox.current.intersectsBox(obstacleBox.current)) {
        collided.current.add(obstacle)
        reduceHealth(10)
      }
    })
  })

  return (
    <mesh
      ref={meshRef}
      {...meshProps}
      position={[0, FLOOR_Y, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial ref={materialRef} color="hotpink" />
    </mesh>
  )
}

export default Player
