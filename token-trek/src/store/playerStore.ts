import { create } from 'zustand'

interface PlayerState {
  lane: number
  setLane: (lane: number) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  lane: 1,
  setLane: (lane) => set({ lane }),
}))
