import { create } from 'zustand'
import { trackChunkGenerator } from '../game/trackChunkGenerator'

interface Position {
  x: number
  z: number
}

interface TrackState {
  nextPosition: (lane?: number) => Position
}

export const useTrackStore = create<TrackState>(() => {
  const lanes = trackChunkGenerator().next().value.lanes
  let cursor = -20
  const STEP = 8
  const LIMIT = -100
  return {
    /**
     * Spawn positions march forward along the Z axis so objects appear in a
     * consistent rhythm rather than jumping randomly. Once the cursor passes
     * {@link LIMIT}, it wraps back near the player to avoid huge values.
     */
    nextPosition: (lane?: number) => {
      const laneIndex = lane ?? Math.floor(Math.random() * lanes.length)
      const pos = { x: lanes[laneIndex], z: cursor }
      cursor -= STEP + Math.random() * 4
      if (cursor < LIMIT) cursor = -20
      return pos
    },
  }
})
