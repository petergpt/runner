import { forwardRef } from 'react'
import type { Group } from 'three'
import type { ThreeElements } from '@react-three/fiber'

import type { TrackChunk as ChunkData } from '../game/trackChunkGenerator'

type Props = ThreeElements['group'] & ChunkData

const TrackChunk = forwardRef<Group, Props>(
  ({ lanes, length, startZ, ...props }, ref) => {
    const laneWidth = Math.abs(lanes[1] - lanes[0])
    return (
      <group ref={ref} position={[0, 0, startZ]} {...props}>
        {lanes.map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <boxGeometry args={[laneWidth * 0.9, 0.1, length]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        ))}
      </group>
    )
  }
)

export default TrackChunk
