import { create } from 'zustand'
import { trackChunkGenerator } from '../game/trackChunkGenerator'

interface Position {
  x: number
  z: number
}

export const useTrackStore = create<{
  /**
   * Returns the next spawn position along the track.
   * @param lane If provided, forces an object to spawn in the given lane.
   */
  nextPosition: (lane?: number) => Position
}>(() => {
  // Generator yields TrackChunks containing lane coordinates and length
  const gen = trackChunkGenerator()

  // Prime the generator so we have initial lane data to work with
  let currentChunk = gen.next().value
  const lanes = currentChunk.lanes

  /**
   * Cursor marches forward (+Z) each time we spawn so objects appear in a
   * steady rhythm rather than at purely random depths. The world uses a
   * -Z forward convention, so we negate the cursor when converting to world
   * coordinates.
   */
  let cursor = 0

  /**
   * When the cursor exceeds this threshold we wrap it to avoid very large
   * floating‑point values far from the origin.
   */
  const SPAWN_LIMIT = 100

  return {
    nextPosition: (forcedLane?: number): Position => {
      // Advance the generator and fall back to the previous chunk if it stops
      currentChunk = gen.next().value ?? currentChunk

      // Pick a lane, either random or caller‑specified
      const laneIndex =
        forcedLane ?? Math.floor(Math.random() * currentChunk.lanes.length)
      const x = currentChunk.lanes[laneIndex]

      // Move the cursor forward by half the chunk length for even spacing
      cursor += currentChunk.length / 2

      // Wrap the cursor so numbers stay modest and precision remains high
      if (cursor > SPAWN_LIMIT) cursor -= SPAWN_LIMIT

      // Convert the positive cursor to a negative‑Z world position
      const z = -cursor

      return { x, z }
    },
  }
})
