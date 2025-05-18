import type { FC, RefObject, MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import type { Mesh, Box3, MeshStandardMaterial } from 'three'
import { Box3 as ThreeBox3 } from 'three'

import { contextWindowClamp } from '../game/contextWindowClamp'
import { useGameStore }   from '../store/gameStore'
import { usePlayerStore } from '../store/playerStore'

const LANE_WIDTH    = 2
const BONUS_OFFSET  = 4
const JUMP_VELOCITY = 8
const GRAVITY       = -20
const FLOOR_Y       = 0.5

interface MeshProps extends Omit<ThreeElements['mesh'], 'id'> { id?: never }
type PlayerProps = MeshProps & {
  obstacles?: RefObject<Mesh>[]
  /**
   * External set tracking which obstacles have already triggered a collision.
   * Passed in from the scene so obstacles can reset this state when they
   * recycle.
   */
  collidedRef?: MutableRefObject<Set<Mesh>>
}

const Player: FC<PlayerProps> = ({
  id: _discard,
  obstacles = [],
  collidedRef,
  ...props
}) => {
  void _discard
  const meshRef   = useRef<Mesh>(null!)
  const materialRef = useRef<MeshStandardMaterial>(null!)
  const velocityY = useRef(0)
  const jumping   = useRef(false)
  const internalCollided = useRef<Set<Mesh>>(new Set())
  const collided = collidedRef ?? internalCollided

  /* Boxes reused each frame to avoid GC churn */
  const playerBox   = useRef<Box3>(new ThreeBox3())
  const obstacleBox = useRef<Box3>(new ThreeBox3())

  /* Global stores */
  const lane        = usePlayerStore((s) => s.lane)
  const setLane     = usePlayerStore((s) => s.setLane)
  const reduceHealth= useGameStore((s) => s.reduceHealth)
  const isGameOver  = useGameStore((s) => s.isGameOver)
  const isGameWon   = useGameStore((s) => s.isGameWon)
  const ragPortalActive = useGameStore((s) => s.ragPortalActive)
  const lastDamage  = useGameStore((s) => s.lastDamageTime)
  const lastToken   = useGameStore((s) => s.lastTokenTime)

  /* Keyboard controls */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft')
        setLane(contextWindowClamp(lane - 1))
      else if (e.code === 'KeyD' || e.code === 'ArrowRight')
        setLane(contextWindowClamp(lane + 1))
      else if (e.code === 'Space' && !jumping.current) {
        jumping.current  = true
        velocityY.current = JUMP_VELOCITY
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lane, setLane])

  /* Visual feedback on damage */
  useEffect(() => {
    if (!materialRef.current || !lastDamage) return
    materialRef.current.color.set('red')
    const id = setTimeout(() => materialRef.current?.color.set('hotpink'), 200)
    return () => clearTimeout(id)
  }, [lastDamage])

  /* Visual feedback on token */
  useEffect(() => {
    if (!materialRef.current || !lastToken) return
    materialRef.current.color.set('cyan')
    const id = setTimeout(() => materialRef.current?.color.set('hotpink'), 200)
    return () => clearTimeout(id)
  }, [lastToken])

  /* Per-frame logic */
  useFrame((_, dt) => {
    if (isGameOver || isGameWon) return

    const mesh = meshRef.current
    const offset = ragPortalActive ? BONUS_OFFSET : 0
    mesh.position.x = (-1 + lane) * LANE_WIDTH + offset // snap to lane or bonus

    /* jump / gravity */
    if (jumping.current) {
      velocityY.current += GRAVITY * dt
      mesh.position.y   += velocityY.current * dt
      if (mesh.position.y <= FLOOR_Y) {
        mesh.position.y   = FLOOR_Y
        jumping.current   = false
        velocityY.current = 0
      }
    }

    /* collision detection */
    playerBox.current.setFromObject(mesh)
    obstacles.forEach((oRef) => {
      const o = oRef.current
      if (!o || !o.visible || collided.current.has(o)) return
      obstacleBox.current.setFromObject(o)
      if (playerBox.current.intersectsBox(obstacleBox.current)) {
        collided.current.add(o)
        reduceHealth(10)
      }
    })
  })

  return (
    <mesh ref={meshRef} {...props} position={[0, FLOOR_Y, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial ref={materialRef} color="hotpink" />
    </mesh>
  )
}

export default Player
