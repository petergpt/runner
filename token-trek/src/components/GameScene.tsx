import type { FC } from 'react'
import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { Mesh } from 'three'

import Player from './Player'
import Token from './Token'
import Obstacle from './Obstacle'
import {
  PromptInjectionCube,
  RateLimitGate,
  SequenceLengthWall,
} from './obstacles'
import { useGameStore } from '../store/gameStore'

const GameScene: FC = () => {
  /* refs let Player poll obstacle positions for collision */
  const genericObstacleRef = useRef<Mesh>(null!)
  const injCubeRef        = useRef<Mesh>(null!)
  const gateRef           = useRef<Mesh>(null!)
  const wallRef           = useRef<Mesh>(null!)

  const isGameOver = useGameStore((s) => s.isGameOver)

  return (
    <>
      <Canvas camera={{ position: [0, 2, 5], fov: 60 }} style={{ height: '100vh' }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Player passes array of refs for collision checks */}
        <Player position={[0, 0.5, 0]} obstacles={[
          genericObstacleRef,
          injCubeRef,
          gateRef,
          wallRef,
        ]} />

        {/* Collectible */}
        <Token position={[0, 0.5, -3]} />

        {/* Obstacles */}
        <Obstacle ref={genericObstacleRef} position={[0, 0.5, -2]} />
        <PromptInjectionCube ref={injCubeRef} position={[0, 0.5, -5]} />
        <RateLimitGate        ref={gateRef}  position={[0, 0,   -8]} />
        <SequenceLengthWall   ref={wallRef}  position={[0, 1,  -12]} />

        {/* Controls */}
        <OrbitControls />
      </Canvas>

      {/* Simple overlay when the store flags game-over */}
      {isGameOver && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '2rem',
            pointerEvents: 'none',
          }}
        >
          Game Over
        </div>
      )}
    </>
  )
}

export default GameScene
