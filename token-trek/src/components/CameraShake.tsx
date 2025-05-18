import type { FC } from 'react'
import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useGameStore } from '../store/gameStore'

const CameraShake: FC = () => {
  const { camera } = useThree()
  const basePos = useRef(new Vector3().copy(camera.position))
  const intensity = useRef(0)
  const lastDamage = useGameStore((s) => s.lastDamageTime)

  useEffect(() => {
    if (lastDamage) intensity.current = 0.3
  }, [lastDamage])

  useFrame((_, dt) => {
    if (intensity.current > 0) {
      camera.position.x = basePos.current.x + (Math.random() - 0.5) * intensity.current
      camera.position.y = basePos.current.y + (Math.random() - 0.5) * intensity.current
      intensity.current -= dt * 2
      if (intensity.current <= 0) {
        camera.position.copy(basePos.current)
        intensity.current = 0
      }
    }
  })

  return null
}

export default CameraShake
