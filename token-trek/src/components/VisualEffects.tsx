import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'

const VisualEffects: FC = () => {
  const composer = useRef<EffectComposer | null>(null)
  const { scene, camera, gl, size } = useThree()

  useEffect(() => {
    const pass = new RenderPass(scene, camera)
    const glitch = new GlitchPass()
    composer.current = new EffectComposer(gl)
    composer.current.addPass(pass)
    composer.current.addPass(glitch)
  }, [scene, camera, gl])

  useEffect(() => {
    composer.current?.setSize(size.width, size.height)
  }, [size])

  useFrame(() => {
    composer.current?.render()
  }, 1)

  return null
}

export default VisualEffects
