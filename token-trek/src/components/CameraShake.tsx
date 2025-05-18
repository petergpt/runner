import type { FC } from 'react'
import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useGameStore } from '../store/gameStore'

const DURATION = 300 // ms
const INTENSITY = 0.1

const CameraShake: FC = () => {
  const { camera } = useThree()
  const base = useRef(new Vector3())
  const lastDamage = useGameStore((s) => s.lastDamageTime)

  useEffect(() => {
    base.current.copy(camera.position)
  }, [camera])

  useFrame(() => {
    const now = performance.now()
    if (now - lastDamage < DURATION) {
      const factor = (1 - (now - lastDamage) / DURATION) * INTENSITY
      camera.position.set(
        base.current.x + (Math.random() - 0.5) * factor,
        base.current.y + (Math.random() - 0.5) * factor,
        base.current.z + (Math.random() - 0.5) * factor,
      )
    } else if (!camera.position.equals(base.current)) {
      camera.position.copy(base.current)
    }
  })
  return null
}

export default CameraShake
