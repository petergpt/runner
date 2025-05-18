import { create } from 'zustand'

interface PlayerState {
  lane: number
  setLane: (lane: number | ((lane: number) => number)) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  lane: 1,
  setLane: (lane) =>
    set((state) => ({
      lane: typeof lane === 'function' ? lane(state.lane) : lane,
    })),
}))
