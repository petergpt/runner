import { create } from 'zustand'
import { trackChunkGenerator, type TrackChunk } from '../game/trackChunkGenerator'

interface Position {
  x: number
  z: number
}

interface TrackState {
  nextPosition: (lane?: number) => Position
}

export const useTrackStore = create<TrackState>(() => {
  const gen: Generator<TrackChunk> = trackChunkGenerator()
  const SPAWN_LIMIT = 100
  return {
    /**
     * Returns a lane-aligned position some distance ahead of the
     * player. Objects spawned using this helper stay within
     * {@link SPAWN_LIMIT} units in front of the camera so they
     * appear regularly instead of thousands of units away.
     */
    nextPosition: (lane?: number) => {
      const chunk = gen.next().value
      const laneIndex = lane ?? Math.floor(Math.random() * chunk.lanes.length)
      const x = chunk.lanes[laneIndex]
      const z = -(
        (chunk.startZ % SPAWN_LIMIT) + Math.random() * chunk.length
      )
      return { x, z }
    },
  }
})
