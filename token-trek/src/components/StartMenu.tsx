import type { FC } from 'react'
import { useGameStore } from '../store/gameStore'

interface Props {
  onStart: () => void
}

const StartMenu: FC<Props> = ({ onStart }) => {
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
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>Token Trek</div>
      <div style={{ marginBottom: '0.5rem' }}>High Score: {highScore.toFixed(0)}</div>
      <button onClick={onStart}>Start</button>
      <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
        Use A/D or ←/→ to switch lanes, Space to jump.<br />
        Collect <span style={{ color: 'cyan' }}>cyan tokens</span> and avoid
        <span style={{ color: 'red' }}> red cubes</span> &amp; gates.<br />
        The blue portal sends you to a bonus lane for extra tokens.
      </div>
    </div>
  )
}

export default StartMenu
