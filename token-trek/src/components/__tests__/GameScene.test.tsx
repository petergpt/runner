import { describe, it, expect } from 'vitest'
import { createRoot } from '@react-three/fiber'
import type { WebGLRenderer } from 'three'

/* ------------------------------------------------------------------ */
/*  Browser-global stubs used by the game code                        */
/* ------------------------------------------------------------------ */

// Vitest runs in a Node-like environment, so we polyfill Audio here.
(globalThis as unknown as { Audio: () => void }).Audio = function () {}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const makeCanvas = () =>
  ({
    style: {},
    addEventListener() {},
    removeEventListener() {},
  } as unknown as HTMLCanvasElement)

/**
 * A minimal fake `WebGLRenderer` that satisfies React-Three-Fiber’s
 * `gl` interface during unit tests.  Nothing actually gets drawn.
 */
const fakeRenderer = {
  render() {},
  setSize() {},
  setPixelRatio() {},
  domElement: makeCanvas(),
  shadowMap: {} as unknown as WebGLRenderer['shadowMap'],
  xr: {
    enabled: false,
    isPresenting: false,
    setAnimationLoop() {},
    addEventListener() {},
    removeEventListener() {},
  },
  renderLists: { dispose() {} },
} as unknown as WebGLRenderer

/* ------------------------------------------------------------------ */
/*  Test                                                              */
/* ------------------------------------------------------------------ */

describe('GameScene', () => {
  it('mounts without crashing', async () => {
    const canvas = makeCanvas()
    const root = createRoot(canvas)

    // React-Three-Fiber v8: `configure` lets us inject the stub renderer.
    root.configure({
      gl: fakeRenderer,
      size: { width: 1, height: 1, top: 0, left: 0 },
    })

    // Lazy import to avoid pulling in the whole scene up-front.
    const { default: GameScene } = await import('../GameScene')

    expect(() => {
      root.render(<GameScene />)
    }).not.toThrow()

    root.unmount()
  })
})
