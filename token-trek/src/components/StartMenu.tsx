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
        Collect <span style={{ color: 'cyan' }}>cyan spheres</span> for points
        and avoid <span style={{ color: 'red' }}>red cubes</span> or
        <span style={{ color: 'orange' }}> orange gates</span>.<br />
        <span style={{ color: 'yellow' }}>Yellow icosahedrons</span> clear
        obstacles briefly. The blue portal leads to a bonus lane.
        <br />
        Watch for on‑screen messages when power‑ups activate.
      </div>
    </div>
  )
}

export default StartMenu
