
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useGameStore } from '../store/gameStore'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'

const VisualEffects: FC = () => {
  const composer = useRef<EffectComposer | null>(null)
  const { scene, camera, gl, size } = useThree()
  const lastDamage = useGameStore((s) => s.lastDamageTime)
  const shake = useRef(0)

  useEffect(() => {
    try {
      if (!gl.capabilities.isWebGL2) {
        console.warn('WebGL 2 not available, skipping visual effects')
        return
      }

      const pass = new RenderPass(scene, camera)
      const glitch = new GlitchPass()
      composer.current = new EffectComposer(gl)
      composer.current.addPass(pass)
      composer.current.addPass(glitch)
    } catch (err) {
      console.warn('Failed to initialize visual effects:', err)
    }
  }, [scene, camera, gl])

  /* Camera shake on damage */
  useEffect(() => {
    shake.current = 0.3
  }, [lastDamage])

  useEffect(() => {
    try {
      composer.current?.setSize(size.width, size.height)
    } catch (err) {
      console.warn('Failed to resize effects:', err)
    }
  }, [size])

  useFrame((_, dt) => {
    if (shake.current > 0) {
      camera.position.x = (Math.random() - 0.5) * shake.current
      camera.position.y = 2 + (Math.random() - 0.5) * shake.current
      shake.current -= dt
      if (shake.current <= 0) camera.position.set(0, 2, 5)
    }
    try {
      composer.current?.render()
    } catch (err) {
      console.warn('Failed to render effects:', err)
    }
  }, 1)

  return null
}

export default VisualEffects
