import { forwardRef } from 'react'
import type { Mesh } from 'three'
import type { ThreeElements } from '@react-three/fiber'

const Obstacle = forwardRef<Mesh, ThreeElements['mesh']>((props, ref) => (
  <mesh ref={ref} {...props}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="red" />
  </mesh>
))

export default Obstacle
