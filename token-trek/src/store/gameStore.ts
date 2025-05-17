import { create } from 'zustand'

interface GameState {
  tokenCount: number
  multiplier: number
  startTime: number
  collectToken: () => void
  tokensPerSecond: () => number
}

export const useGameStore = create<GameState>((set, get) => ({
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
