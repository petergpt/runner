import type { FC, CSSProperties } from 'react'
import { useEffect, useState, useRef } from 'react'
import { useGameStore, AGI_GOAL } from '../store/gameStore'
import styles from './HUD.module.css'

/**
 * Continuously updates tokens-per-second via requestAnimationFrame so
 * the HUD does not trigger cascading store updates each render.
 */
function useTokensPerSecond(): number {
  const compute = useGameStore((s) => s.tokensPerSecond)
  const [value, setValue] = useState(() => compute())

  useEffect(() => {
    let frame: number
    const update = () => {
      setValue(compute())
      frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [compute])

  return value
}

const HUD: FC = () => {
  const tokenCount = useGameStore((s) => s.tokenCount)
  const tokensPerSecond = useTokensPerSecond()
  const health = useGameStore((s) => s.health)
  const maxHealth = useGameStore((s) => s.maxHealth)
  const systemPrompt = useGameStore((s) => s.systemPromptActive)
  const ragPortal = useGameStore((s) => s.ragPortalActive)
  const [flashClass, setFlashClass] = useState('')
  const prevHealth = useRef(health)
  const prevTokens = useRef(tokenCount)

  useEffect(() => {
    if (health < prevHealth.current) {
      setFlashClass(styles.flashDamage)
      const id = setTimeout(() => setFlashClass(''), 200)
      return () => clearTimeout(id)
    }
    prevHealth.current = health
  }, [health])

  useEffect(() => {
    if (tokenCount > prevTokens.current) {
      setFlashClass(styles.flashToken)
      const id = setTimeout(() => setFlashClass(''), 200)
      return () => clearTimeout(id)
    }
    prevTokens.current = tokenCount
  }, [tokenCount])

  const barStyle: CSSProperties = {
    width: `${(health / maxHealth) * 100}%`,
  }

  return (
    <div className={`${styles.hud} ${flashClass}`}>
      <div className={styles.healthContainer}>
        <div className={styles.healthBar} style={barStyle} />
      </div>
      <div className={styles.stats}>
        <div>Tokens: {tokenCount.toFixed(0)} / {AGI_GOAL}</div>
        <div>T/s: {tokensPerSecond.toFixed(2)}</div>
      </div>
      {systemPrompt && (
        <div className={`${styles.powerMsg} ${styles.system}`}>SYSTEM PROMPT!</div>
      )}
      {ragPortal && (
        <div className={`${styles.powerMsg} ${styles.bonus}`}>BONUS LANE!</div>
      )}
    </div>
  )
}

export default HUD
