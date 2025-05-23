import { forwardRef } from 'react'
import type { Group } from 'three'
import type { ThreeElements } from '@react-three/fiber'

import type { TrackChunk as ChunkData } from '../game/trackChunkGenerator'

interface GroupProps extends Omit<ThreeElements['group'], 'id'> { id?: never }
type Props = GroupProps & Omit<ChunkData, 'id'>

const TrackChunk = forwardRef<Group, Props>(
  ({ id: _discard, lanes, length, startZ, ...props }, ref) => {
    void _discard
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
