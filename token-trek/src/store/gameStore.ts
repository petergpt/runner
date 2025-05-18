import { create } from 'zustand'
import { playToken, playCollision, playPowerup } from '../utils/sfx'

/** AGI milestone – reaching this many tokens wins the game */
export const AGI_GOAL = 8192

interface GameState {
  /* Health & fail/win state */
  health: number
  maxHealth: number
  isGameOver: boolean
  isGameWon: boolean
  reduceHealth: (amount: number) => void
  resetHealth: () => void
  shrinkMaxHealth: (amount: number) => void

  /* Power-ups */
  systemPromptActive: boolean
  activateSystemPrompt: () => void
  systemPromptTimeoutId?: ReturnType<typeof setTimeout>
  ragPortalActive: boolean
  activateRagPortal: () => void
  ragPortalTimeoutId?: ReturnType<typeof setTimeout>
  clearPowerUpTimers: () => void

  /* Tokens / scoring */
  tokenCount: number
  multiplier: number
  startTime: number
  collectToken: () => void
  tokensPerSecond: () => number

  /* Track progression */
  trackSpeed: number
  increaseTrackSpeed: (amount: number) => void

  /* Meta */
  highScore: number
  resetGame: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  /* ── health ─────────────────────────────────────────────────────── */
  health: 100,
  maxHealth: 100,
  isGameOver: false,
  isGameWon: false,
  reduceHealth: (amount) =>
    set((state) => {
      const nextHealth = Math.max(state.health - amount, 0)
      playCollision()
      return { health: nextHealth, isGameOver: nextHealth <= 0 }
    }),
  resetHealth: () =>
    set({ health: 100, maxHealth: 100, isGameOver: false, isGameWon: false }),
  shrinkMaxHealth: (amount) =>
    set((state) => {
      const newMax = Math.max(state.maxHealth - amount, 0)
      const newHealth = Math.min(state.health, newMax)
      return {
        maxHealth: newMax,
        health: newHealth,
        isGameOver: newHealth <= 0,
      }
    }),

  /* ── power-ups ──────────────────────────────────────────────────── */
  systemPromptActive: false,
  activateSystemPrompt: () => {
    playPowerup()
    set({ systemPromptActive: true })
    const id = setTimeout(() => {
      set({ systemPromptActive: false, systemPromptTimeoutId: undefined })
    }, 3000)
    set({ systemPromptTimeoutId: id })
  },

  ragPortalActive: false,
  activateRagPortal: () => {
    playPowerup()
    set({ ragPortalActive: true })
    const id = setTimeout(() => {
      set({ ragPortalActive: false, ragPortalTimeoutId: undefined })
    }, 3000)
    set({ ragPortalTimeoutId: id })
  },

  clearPowerUpTimers: () => {
    const { systemPromptTimeoutId, ragPortalTimeoutId } = get()
    if (systemPromptTimeoutId) clearTimeout(systemPromptTimeoutId)
    if (ragPortalTimeoutId)    clearTimeout(ragPortalTimeoutId)
    set({
      systemPromptTimeoutId: undefined,
      ragPortalTimeoutId: undefined,
      systemPromptActive: false,
      ragPortalActive: false,
    })
  },

  /* ── tokens / scoring ───────────────────────────────────────────── */
  tokenCount: 0,
  multiplier: 1,
  startTime: performance.now(),
  collectToken: () =>
    set((state) => {
      const tokenCount = state.tokenCount + state.multiplier
      playToken()
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

  /* ── track progression ─────────────────────────────────────────── */
  trackSpeed: 10, // Higher default for snappier early gameplay
  increaseTrackSpeed: (amount) =>
    set((state) => ({
      trackSpeed: state.trackSpeed + amount,
      // You might tie future difficulty scaling to state.multiplier here
    })),

  /* ── meta & reset ──────────────────────────────────────────────── */
  highScore:
    typeof window === 'undefined'
      ? 0
      : Number(window.localStorage.getItem('highScore')) || 0,

  resetGame: () => {
    get().clearPowerUpTimers()
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
        trackSpeed: 10,
        highScore,
      }
    })
  },
}))
