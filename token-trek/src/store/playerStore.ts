import { create } from 'zustand'

interface PlayerState {
  lane: number
  /**
   * Updates the lane. Accepts either a numeric value or a function that
   * computes the next lane from the previous one.
   */
  setLane: (lane: number | ((lane: number) => number)) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  lane: 1,
  setLane: (lane) =>
    set((state) => ({
      lane: typeof lane === 'function' ? lane(state.lane) : lane,
    })),
}))
