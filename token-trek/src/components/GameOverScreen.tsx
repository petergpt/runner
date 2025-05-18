import type { FC } from 'react'
import { useGameStore } from '../store/gameStore'

interface Props {
  onRestart: () => void
}

const GameOverScreen: FC<Props> = ({ onRestart }) => {
  const isGameWon = useGameStore((s) => s.isGameWon)
  const tokenCount = useGameStore((s) => s.tokenCount)
  const highScore = useGameStore((s) => s.highScore)

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        {isGameWon ? 'AGI Achieved!' : 'Game Over'}
      </div>
      <div style={{ marginBottom: '0.5rem' }}>Tokens: {tokenCount.toFixed(0)}</div>
      <div style={{ marginBottom: '1rem' }}>High Score: {highScore.toFixed(0)}</div>
      <button onClick={onRestart}>Restart</button>
    </div>
  )
}

export default GameOverScreen
