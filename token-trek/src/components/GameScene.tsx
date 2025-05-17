import type { FC } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Player from './Player'
import Obstacle from './Obstacle'
import { useRef } from 'react'
import type { Mesh } from 'three'
import { useGameStore } from '../store/gameStore'

const GameScene: FC = () => {
  const obstacleRef = useRef<Mesh>(null!)
  const isGameOver = useGameStore((s) => s.isGameOver)
  return (
    <>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 60 }}
        style={{ height: '100vh' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Player position={[0, 0.5, 0]} obstacles={[obstacleRef]} />
        <Obstacle ref={obstacleRef} position={[0, 0.5, -2]} />
        <OrbitControls />
      </Canvas>
      {isGameOver && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '2rem',
          }}
        >
          Game Over
        </div>
      )}
    </>
  )
}

export default GameScene
