import { create } from 'zustand'

interface PlayerState {
  lane: number
  setLane: (lane: number) => void
  updateLane: (fn: (lane: number) => number) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  lane: 1,
  setLane: (lane) => set({ lane }),
  updateLane: (fn) => set((state) => ({ lane: fn(state.lane) })),
}))
