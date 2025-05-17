import type { FC } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Player from './Player'
import {
  PromptInjectionCube,
  RateLimitGate,
  SequenceLengthWall,
} from './obstacles'

const GameScene: FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 60 }}
      style={{ height: '100vh' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Player position={[0, 0.5, 0]} />
      <PromptInjectionCube position={[0, 0.5, -5]} />
      <RateLimitGate position={[0, 0, -8]} />
      <SequenceLengthWall position={[0, 1, -12]} />
      <OrbitControls />
    </Canvas>
  )
}

export default GameScene
