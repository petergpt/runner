import { create } from 'zustand'

/** AGI milestone – reaching this many tokens wins the game */
export const AGI_GOAL = 8192

/**
 * Global game-state store (Zustand)
 * – health / game-over logic
 * – token counter + score multiplier
 */
interface GameState {
  /* Health & fail state */
  health: number
  maxHealth: number
  isGameOver: boolean
  isGameWon: boolean
  reduceHealth: (amount: number) => void
  resetHealth: () => void
  shrinkMaxHealth: (amount: number) => void

  /* Power-up state */
  systemPromptActive: boolean
  activateSystemPrompt: () => void
  ragPortalActive: boolean
  activateRagPortal: () => void

  /* Token / score system */
  tokenCount: number
  multiplier: number
  startTime: number
  collectToken: () => void
  tokensPerSecond: () => number

  /* Meta */
  highScore: number
  resetGame: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  /* ── health subsystem ─────────────────────────────────────────────── */
  health: 100,
  maxHealth: 100,
  isGameOver: false,
  isGameWon: false,
  reduceHealth: (amount: number) =>
    set((state) => {
      const nextHealth = Math.max(state.health - amount, 0)
      return { health: nextHealth, isGameOver: nextHealth <= 0 }
    }),
  resetHealth: () =>
    set({ health: 100, maxHealth: 100, isGameOver: false, isGameWon: false }),
  shrinkMaxHealth: (amount: number) =>
    set((state) => {
      const newMax = Math.max(state.maxHealth - amount, 0)
      const newHealth = Math.min(state.health, newMax)
      return {
        maxHealth: newMax,
        health: newHealth,
        isGameOver: newHealth <= 0,
      }
    }),

  /* ── power-ups ───────────────────────────────────────────────────── */
  systemPromptActive: false,
  activateSystemPrompt: () => {
    set({ systemPromptActive: true })
    setTimeout(() => set({ systemPromptActive: false }), 3000)
  },
  ragPortalActive: false,
  activateRagPortal: () => {
    set({ ragPortalActive: true })
    setTimeout(() => set({ ragPortalActive: false }), 3000)
  },

  /* ── token / scoring subsystem ─────────────────────────────────────── */
  tokenCount: 0,
  multiplier: 1,
  startTime: performance.now(),
  collectToken: () =>
    set((state) => {
      const tokenCount = state.tokenCount + state.multiplier
      return {
        tokenCount,
        multiplier: state.multiplier + 1,
        isGameWon: tokenCount >= AGI_GOAL,
      }
    }),
  tokensPerSecond: () => {
    const elapsed = (performance.now() - get().startTime) / 1000
    return elapsed > 0 ? get().tokenCount / elapsed : 0
  },

  /* ── meta ─────────────────────────────────────────────────────────── */
  highScore:
    typeof window === 'undefined'
      ? 0
      : Number(window.localStorage.getItem('highScore')) || 0,
  resetGame: () =>
    set((state) => {
      const highScore =
        state.tokenCount > state.highScore ? state.tokenCount : state.highScore
      if (typeof window !== 'undefined')
        window.localStorage.setItem('highScore', String(highScore))
      return {
        health: 100,
        maxHealth: 100,
        isGameOver: false,
        isGameWon: false,
        systemPromptActive: false,
        ragPortalActive: false,
        tokenCount: 0,
        multiplier: 1,
        startTime: performance.now(),
        highScore,
      }
    }),
}))
