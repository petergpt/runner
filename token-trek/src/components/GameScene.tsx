import type { FC } from 'react';
import { useRef, useState, useEffect, createRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import type { Mesh, Group } from 'three';

import Player from './Player';
import Token from './Token';
import Obstacle from './Obstacle';
import SystemPromptPowerUp from './SystemPromptPowerUp';
import RAGPortal from './RAGPortal';
import NeonGrid from './NeonGrid';
import VisualEffects from './VisualEffects';
import CameraShake from './CameraShake';
import TrackChunk from './TrackChunk';
import {
  trackChunkGenerator,
  type TrackChunk as ChunkData,
} from '../game/trackChunkGenerator';
import {
  PromptInjectionCube,
  RateLimitGate,
  SequenceLengthWall,
} from './obstacles';
import { useGameStore } from '../store/gameStore';

/**
 * Main scene content rendered inside the <Canvas>.
 * Handles obstacle references, procedural track generation, and the game loop.
 */
const SceneContent: FC = () => {
  /* ─────────── Obstacle references for collision ─────────── */
  const GENERIC_COUNT = 6;
  const CUBE_COUNT = 4;
  const GATE_COUNT = 3;

  const genericRefs = useRef([...Array(GENERIC_COUNT)].map(() => createRef<Mesh>()));
  const cubeRefs = useRef([...Array(CUBE_COUNT)].map(() => createRef<Mesh>()));
  const gateRefs = useRef([...Array(GATE_COUNT)].map(() => createRef<Mesh>()));
  const wallRef = createRef<Mesh>();

  /**
   * Keeps track of obstacles already collided with this frame so we don\'t
   * register multiple collisions before the reset callback runs.
   */
  const collidedRef = useRef<Set<Mesh>>(new Set());

  /* ─────────── Procedural track generation ─────────── */
  const chunkGen = useRef(trackChunkGenerator());
  const CHUNK_COUNT = 6;

  const [chunks, setChunks] = useState<ChunkData[]>(() => {
    const arr: ChunkData[] = [];
    for (let i = 0; i < CHUNK_COUNT; i++) {
      const chunk = chunkGen.current.next().value as ChunkData;
      // Move each pre‑spawned chunk back so the player starts "inside" the level
      arr.push({ ...chunk, startZ: -(chunk.startZ + chunk.length) });
    }
    return arr;
  });

  const chunkRefs = useRef<(Group | null)[]>([]);

  /* ─────────── Game state from the global store ─────────── */
  const isGameOver = useGameStore((s) => s.isGameOver);
  const isGameWon = useGameStore((s) => s.isGameWon);
  const shrinkMaxHealth = useGameStore((s) => s.shrinkMaxHealth);
  const clearPowerUpTimers = useGameStore((s) => s.clearPowerUpTimers);
  const trackSpeed = useGameStore((s) => s.trackSpeed);
  const increaseTrackSpeed = useGameStore((s) => s.increaseTrackSpeed);

  // Used for 10‑second checkpoints that gradually ramp difficulty
  const checkpointRef = useRef(0);

  /* ─────────── Clear timers on unmount ─────────── */
  useEffect(() => () => clearPowerUpTimers(), [clearPowerUpTimers]);

  /* ─────────── Main game loop ─────────── */
  useFrame(({ clock }, dt) => {
    if (isGameOver || isGameWon) return;

    /* 10‑s summarization checkpoint: reduce max HP & speed up track */
    const elapsed = clock.getElapsedTime();
    if (elapsed - checkpointRef.current >= 10) {
      shrinkMaxHealth(10);
      increaseTrackSpeed(1);
      checkpointRef.current = elapsed;
    }

    /* Scroll chunks towards the player */
    chunkRefs.current.forEach((g) => {
      if (g) g.position.z += trackSpeed * dt;
    });

    /* Recycle the first chunk once it\'s far behind the player */
    const firstRef = chunkRefs.current[0];
    const firstChunk = chunks[0];
    if (firstRef && firstChunk && firstRef.position.z - firstChunk.length > 20) {
      const lastRef = chunkRefs.current[chunkRefs.current.length - 1];
      const lastChunk = chunks[chunks.length - 1];

      /* Generate the next procedural chunk */
      const next = chunkGen.current.next().value as ChunkData;
      const newZ = (lastRef?.position.z ?? 0) - (lastChunk?.length ?? 0);

      /* Move the recycled mesh & update arrays */
      firstRef.position.set(0, 0, newZ);
      next.startZ = newZ;
      chunkRefs.current = [...chunkRefs.current.slice(1), firstRef];
      setChunks((prev) => [...prev.slice(1), { ...next, startZ: newZ }]);
    }
  });

  /* ─────────── Render ─────────── */
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
            if (el) chunkRefs.current[i] = el;
          }}
          lanes={chunk.lanes}
          length={chunk.length}
          startZ={chunk.startZ}
        />
      ))}

      {/* Player */}
      {(() => {
        const obstacleRefs: React.RefObject<Mesh>[] = [
          ...(genericRefs.current as React.RefObject<Mesh>[]),
          ...(cubeRefs.current as React.RefObject<Mesh>[]),
          ...(gateRefs.current as React.RefObject<Mesh>[]),
          wallRef as React.RefObject<Mesh>,
        ];
        return (
          <Player
            position={[0, 0.5, 0]}
            obstacles={obstacleRefs}
            /**
             * Pass the collidedRef down so the Player component can mark which
             * meshes have already been handled this frame.
             */
            collidedRef={collidedRef}
          />
        );
      })()}

      {/* Collectibles & power‑ups */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Token key={`t${i}`} position={[0, 0.5, -50]} />
      ))}
      <SystemPromptPowerUp position={[0, 0.5, -50]} />
      <RAGPortal position={[0, 0.5, -50]} />

      {/* Obstacles */}
      {Array.from({ length: GENERIC_COUNT }).map((_, i) => (
        <Obstacle
          key={`o${i}`}
          ref={genericRefs.current[i]}
          position={[0, 0.5, -50]}
          onReset={(m) => collidedRef.current.delete(m)}
        />
      ))}
      {Array.from({ length: CUBE_COUNT }).map((_, i) => (
        <PromptInjectionCube
          key={`c${i}`}
          ref={cubeRefs.current[i]}
          position={[0, 0.5, -50]}
          onReset={(m) => collidedRef.current.delete(m)}
        />
      ))}
      {Array.from({ length: GATE_COUNT }).map((_, i) => (
        <RateLimitGate
          key={`g${i}`}
          ref={gateRefs.current[i]}
          position={[0, 0, -50]}
          onReset={(m) => collidedRef.current.delete(m)}
        />
      ))}
      <SequenceLengthWall
        ref={wallRef}
        position={[0, 1, -50]}
        appearAfter={15}
        onReset={(m) => collidedRef.current.delete(m)}
      />

      {/* Effects & HUD */}
      <CameraShake />
      <VisualEffects />
      <Stats />
      <OrbitControls />
    </>
  );
};

/* ─────────── <Canvas> wrapper ─────────── */
const GameScene: FC = () => (
  <Canvas camera={{ position: [0, 2, 5], fov: 60 }} style={{ height: '100vh' }}>
    <SceneContent />
  </Canvas>
);

export default GameScene;
