import type { FC } from 'react'
import { useRef, useState, useEffect, createRef } from 'react'
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

const SceneContent: FC = () => {
  /* obstacle references for collision */
  const GENERIC_COUNT = 6
  const CUBE_COUNT = 4
  const GATE_COUNT = 3
  const genericRefs = useRef([...Array(GENERIC_COUNT)].map(() => createRef<Mesh>()))
  const cubeRefs = useRef([...Array(CUBE_COUNT)].map(() => createRef<Mesh>()))
  const gateRefs = useRef([...Array(GATE_COUNT)].map(() => createRef<Mesh>()))
  const wallRef = useRef<Mesh>(null!)

  /* procedural track */
  const chunkGen = useRef(trackChunkGenerator())
  const CHUNK_COUNT = 6
  const [chunks, setChunks] = useState<ChunkData[]>(() => {
    const arr: ChunkData[] = []
    for (let i = 0; i < CHUNK_COUNT; i++) {
      const chunk = chunkGen.current.next().value
      arr.push({ ...chunk, startZ: -(chunk.startZ + chunk.length) })
    }
    return arr
  })
  const chunkRefs = useRef<(Group | null)[]>([])

  /* game state */
  const isGameOver = useGameStore((s) => s.isGameOver)
  const isGameWon = useGameStore((s) => s.isGameWon)
  const shrinkMaxHealth = useGameStore((s) => s.shrinkMaxHealth)
  const clearPowerUpTimers = useGameStore((s) => s.clearPowerUpTimers)
  const trackSpeed = useGameStore((s) => s.trackSpeed)
  const increaseTrackSpeed = useGameStore((s) => s.increaseTrackSpeed)
  const checkpointRef = useRef(0)

  /* clear timers on unmount */
  useEffect(() => () => clearPowerUpTimers(), [clearPowerUpTimers])

  /* game loop */
  useFrame(({ clock }, dt) => {
    if (isGameOver || isGameWon) return

    /* 10‑s summarization checkpoint */
    const elapsed = clock.getElapsedTime()
    if (elapsed - checkpointRef.current >= 10) {
      shrinkMaxHealth(10)
      increaseTrackSpeed(1)
      checkpointRef.current = elapsed
    }

    /* scroll chunks towards player */
    chunkRefs.current.forEach((g) => {
      if (g) g.position.z += trackSpeed * dt
    })

    /* recycle first chunk when it’s far behind */
    const firstRef = chunkRefs.current[0]
    const firstChunk = chunks[0]
    if (firstRef && firstChunk && firstRef.position.z - firstChunk.length > 20) {
      const lastRef = chunkRefs.current[chunkRefs.current.length - 1]
      const lastChunk = chunks[chunks.length - 1]

      /* next procedural chunk */
      const next = chunkGen.current.next().value
      const newZ = (lastRef?.position.z ?? 0) - (lastChunk?.length ?? 0)

      /* move the recycled mesh & update arrays */
      firstRef.position.set(0, 0, newZ)
      next.startZ = newZ
      chunkRefs.current = [...chunkRefs.current.slice(1), firstRef]
      setChunks((prev) => [...prev.slice(1), { ...next, startZ: newZ }])
    }
  })

  return (
    <>
      {/* Lights & grid */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <NeonGrid />

      {/* Track chunks */}
      {chunks.map((chunk, i) => (
        <TrackChunk
          key={chunk.id}
          ref={(el) => {
            if (el) chunkRefs.current[i] = el
          }}
          lanes={chunk.lanes}
          length={chunk.length}
          startZ={chunk.startZ}
        />
      ))}

      {/* Player */}
      <Player
        position={[0, 0.5, 0]}
        obstacles={[
          ...genericRefs.current,
          ...cubeRefs.current,
          ...gateRefs.current,
          wallRef,
        ]}
      />

      {/* Collectibles & power‑ups */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Token key={`t${i}`} position={[0, 0.5, -50]} />
      ))}
      <SystemPromptPowerUp position={[0, 0.5, -50]} />
      <RAGPortal position={[0, 0.5, -50]} />

      {/* Obstacles */}
      {Array.from({ length: GENERIC_COUNT }).map((_, i) => (
        <Obstacle
          key={`o${i}`]
          ref={genericRefs.current[i]}
          position={[0, 0.5, -50]}
        />
      ))}
      {Array.from({ length: CUBE_COUNT }).map((_, i) => (
        <PromptInjectionCube
          key={`c${i}`]
          ref={cubeRefs.current[i]}
          position={[0, 0.5, -50]}
        />
      ))}
      {Array.from({ length: GATE_COUNT }).map((_, i) => (
        <RateLimitGate
          key={`g${i}`]
          ref={gateRefs.current[i]}
          position={[0, 0, -50]}
        />
      ))}
      <SequenceLengthWall ref={wallRef} position={[0, 1, -50]} appearAfter={15} />

      {/* Effects & HUD */}
      <VisualEffects />
      <Stats />
      <OrbitControls />
    </>
  )
}

const GameScene: FC = () => (
  <Canvas camera={{ position: [0, 2, 5], fov: 60 }} style={{ height: '100vh' }}>
    <SceneContent />
  </Canvas>
)

export default GameScene
