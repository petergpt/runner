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
  return {
    nextPosition: (lane?: number) => {
      const chunk = gen.next().value
      const laneIndex = lane ?? Math.floor(Math.random() * chunk.lanes.length)
      const x = chunk.lanes[laneIndex]
      const z = chunk.startZ + Math.random() * chunk.length
      return { x, z }
    },
  }
})
