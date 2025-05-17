import { create } from 'zustand'

/**
 * Global game-state store (Zustand)
 * – health / game-over logic
 * – token counter + score multiplier
 */
interface GameState {
  /* Health & fail state */
  health: number
  isGameOver: boolean
  reduceHealth: (amount: number) => void
  resetHealth: () => void

  /* Token / score system */
  tokenCount: number
  multiplier: number
  startTime: number
  collectToken: () => void
  tokensPerSecond: () => number
}

export const useGameStore = create<GameState>((set, get) => ({
  /* ── health subsystem ─────────────────────────────────────────────── */
  health: 100,
  isGameOver: false,
  reduceHealth: (amount: number) =>
    set((state) => {
      const nextHealth = state.health - amount
      return { health: nextHealth, isGameOver: nextHealth <= 0 }
    }),
  resetHealth: () => set({ health: 100, isGameOver: false }),

  /* ── token / scoring subsystem ─────────────────────────────────────── */
  tokenCount: 0,
  multiplier: 1,
  startTime: performance.now(),
  collectToken: () =>
    set((state) => ({
      tokenCount: state.tokenCount + state.multiplier,
      multiplier: state.multiplier + 1,
    })),
  tokensPerSecond: () => {
    const elapsed = (performance.now() - get().startTime) / 1000
    return elapsed > 0 ? get().tokenCount / elapsed : 0
  },
}))
