import { create } from 'zustand'

interface GameState {
  health: number
  isGameOver: boolean
  reduceHealth: (amount: number) => void
  reset: () => void
}

export const useGameStore = create<GameState>((set) => ({
  health: 100,
  isGameOver: false,
  reduceHealth: (amount) =>
    set((state) => {
      const nextHealth = state.health - amount
      return { health: nextHealth, isGameOver: nextHealth <= 0 }
    }),
  reset: () => set({ health: 100, isGameOver: false }),
}))
