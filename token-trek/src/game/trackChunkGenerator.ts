export interface TrackChunk {
  /** unique id for the chunk */
  id: number;
  /** lane center positions along the X axis */
  lanes: [number, number, number];
  /** starting position of the chunk along the Z axis */
  startZ: number;
  /** length of the chunk */
  length: number;
}

/**
 * Generator for an endless 3-lane track.
 *
 * @param chunkLength - length of each track chunk
 * @param laneWidth - distance between lane centers
 */
export function* trackChunkGenerator(
  chunkLength = 10,
  laneWidth = 2,
): Generator<TrackChunk> {
  let id = 0;
  let startZ = 0;
  const lanes: [number, number, number] = [
    -laneWidth,
    0,
    laneWidth,
  ];
  while (true) {
    yield {
      id: id++,
      lanes,
      startZ,
      length: chunkLength,
    };
    startZ += chunkLength;
  }
}
