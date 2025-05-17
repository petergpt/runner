declare module 'three/examples/jsm/postprocessing/EffectComposer.js' {
  import type { WebGLRenderer } from 'three'
  export class EffectComposer {
    constructor(renderer: WebGLRenderer)
    addPass(pass: unknown): void
    setSize(width: number, height: number): void
    render(): void
  }
}
declare module 'three/examples/jsm/postprocessing/RenderPass.js' {
  import type { Scene, Camera } from 'three'
  export class RenderPass {
    constructor(scene: Scene, camera: Camera)
  }
}
declare module 'three/examples/jsm/postprocessing/GlitchPass.js' {
  export class GlitchPass {
    constructor()
  }
}
