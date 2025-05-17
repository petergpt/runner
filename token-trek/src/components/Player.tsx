import type { FC } from 'react'
import type { ThreeElements } from '@react-three/fiber'

const Player: FC<ThreeElements['mesh']> = (props) => {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

export default Player
