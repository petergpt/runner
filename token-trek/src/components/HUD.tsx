import type { FC, CSSProperties } from 'react'
import { useGameStore } from '../store/gameStore'
import styles from './HUD.module.css'

const HUD: FC = () => {
  const tokenCount = useGameStore((s) => s.tokenCount)
  const tokensPerSecond = useGameStore((s) => s.tokensPerSecond())
  const health = useGameStore((s) => s.health)
  const maxHealth = useGameStore((s) => s.maxHealth)

  const barStyle: CSSProperties = {
    width: `${(health / maxHealth) * 100}%`,
  }

  return (
    <div className={styles.hud}>
      <div className={styles.healthContainer}>
        <div className={styles.healthBar} style={barStyle} />
      </div>
      <div className={styles.stats}>
        <div>Tokens: {tokenCount.toFixed(0)}</div>
        <div>T/s: {tokensPerSecond.toFixed(2)}</div>
      </div>
    </div>
  )
}

export default HUD
