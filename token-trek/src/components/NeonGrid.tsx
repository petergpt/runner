import type { FC } from 'react'
import { Grid } from '@react-three/drei'

const NeonGrid: FC = () => (
  <Grid
    args={[100, 100]}
    sectionColor="#08f"
    cellColor="#222"
    sectionThickness={1.5}
    cellThickness={1}
    fadeDistance={30}
    fadeStrength={1}
    followCamera
    infiniteGrid
    rotation={[Math.PI / 2, 0, 0]}
  />
)

export default NeonGrid
