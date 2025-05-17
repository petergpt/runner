import type { FC } from 'react'
import { useGameStore } from '../store/gameStore'

const HUD: FC = () => {
  const tokenCount = useGameStore((s) => s.tokenCount)
  const tokensPerSecond = useGameStore((s) => s.tokensPerSecond())

  return (
    <div className="hud">
      <div>Tokens: {tokenCount.toFixed(0)}</div>
      <div>T/s: {tokensPerSecond.toFixed(2)}</div>
    </div>
  )
}

export default HUD
