import type { FC } from 'react'
import { useRef } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

/**
 * Two bars that slide together to block a lane.
 */
const RateLimitGate: FC<ThreeElements['group']> = (props) => {
  const leftRef = useRef<Mesh>(null!)
  const rightRef = useRef<Mesh>(null!)
  useFrame(({ clock }) => {
    const t = Math.sin(clock.getElapsedTime()) // -1..1
    const offset = 1 - Math.abs(t) // 0..1
    leftRef.current.position.x = -1 - offset
    rightRef.current.position.x = 1 + offset
  })
  return (
    <group {...props}>
      <mesh ref={leftRef} position={[-1, 1, 0]}>
        <boxGeometry args={[0.2, 2, 0.2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <mesh ref={rightRef} position={[1, 1, 0]}>
        <boxGeometry args={[0.2, 2, 0.2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  )
}

export default RateLimitGate
