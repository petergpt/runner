import type { FC } from 'react'
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import type { Mesh, Group } from 'three'

import Player from './Player'
import Token from './Token'
import Obstacle from './Obstacle'
import SystemPromptPowerUp from './SystemPromptPowerUp'
import RAGPortal from './RAGPortal'
import NeonGrid from './NeonGrid'
import VisualEffects from './VisualEffects'
import TrackChunk from './TrackChunk'
import {
  trackChunkGenerator,
  type TrackChunk as ChunkData,
} from '../game/trackChunkGenerator'
import {
  PromptInjectionCube,
  RateLimitGate,
  SequenceLengthWall,
} from './obstacles'
import { useGameStore } from '../store/gameStore'

const GameScene: FC = () => {
  /* refs let Player poll obstacle positions for collision */
  const genericObstacleRef = useRef<Mesh>(null!)
  const injCubeRef = useRef<Mesh>(null!)
  const gateRef = useRef<Mesh>(null!)
  const wallRef = useRef<Mesh>(null!)

  const chunkGen = useRef(trackChunkGenerator())
  const CHUNK_COUNT = 6
  const [chunks, setChunks] = useState<ChunkData[]>(() => {
    const arr: ChunkData[] = []
    for (let i = 0; i < CHUNK_COUNT; i++)
      arr.push(chunkGen.current.next().value)
    return arr
  })
  const chunkRefs = useRef<Group[]>([])

  const isGameOver = useGameStore((s) => s.isGameOver)
  const isGameWon = useGameStore((s) => s.isGameWon)
  const shrinkMaxHealth = useGameStore((s) => s.shrinkMaxHealth)
  const clearPowerUpTimers = useGameStore((s) => s.clearPowerUpTimers)
  const checkpointRef = useRef(0)

  useEffect(() => {
    return () => {
      clearPowerUpTimers()
    }
  }, [clearPowerUpTimers])

  useFrame(({ clock }, dt) => {
    if (isGameOver || isGameWon) return
    const elapsed = clock.getElapsedTime()
    if (elapsed - checkpointRef.current >= 15) {
      shrinkMaxHealth(10)
      checkpointRef.current = elapsed
    }

    chunkRefs.current.forEach((g) => {
      g.position.z -= 5 * dt
    })

    const firstRef = chunkRefs.current[0]
    const firstChunk = chunks[0]
    if (firstRef && firstRef.position.z + firstChunk.length < -20) {
      const lastRef = chunkRefs.current[chunkRefs.current.length - 1]
      const lastChunk = chunks[chunks.length - 1]
      const next = chunkGen.current.next().value
      const newZ = lastRef.position.z + lastChunk.length
      firstRef.position.z = newZ
      next.startZ = newZ
      chunkRefs.current.push(chunkRefs.current.shift()!)
      setChunks((prev) => [...prev.slice(1), next])
    }
  })

  return (
    <>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 60 }}
        style={{ height: '100vh' }}
      >
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <NeonGrid />
        {chunks.map((chunk, i) => (
          <TrackChunk
            key={i}
            ref={(el) => {
              if (el) chunkRefs.current[i] = el
            }}
            {...chunk}
          />
        ))}

        {/* Player passes array of refs for collision checks */}
        <Player
          position={[0, 0.5, 0]}
          obstacles={[genericObstacleRef, injCubeRef, gateRef, wallRef]}
        />

        {/* Collectible */}
        <Token position={[0, 0.5, -3]} />
        <SystemPromptPowerUp position={[0, 0.5, -6]} />
        <RAGPortal position={[0, 0.5, -9]} />

        {/* Obstacles */}
        <Obstacle ref={genericObstacleRef} position={[0, 0.5, -2]} />
        <PromptInjectionCube ref={injCubeRef} position={[0, 0.5, -5]} />
        <RateLimitGate ref={gateRef} position={[0, 0, -8]} />
        <SequenceLengthWall ref={wallRef} position={[0, 1, -12]} />

        {/* Visuals */}
        <VisualEffects />
        <Stats />
        {/* Controls */}
        <OrbitControls />
      </Canvas>
    </>
  )
}

export default GameScene
