import { describe, it, expect } from 'vitest'
import React from 'react'
import { createRoot } from '@react-three/fiber'

// stub browser globals used by game code
(global as any).Audio = function () {}

const makeCanvas = () => ({
  style: {},
  addEventListener() {},
  removeEventListener() {},
}) as unknown as HTMLCanvasElement

const fakeRenderer = {
  render: () => {},
  setSize: () => {},
  setPixelRatio: () => {},
  domElement: makeCanvas(),
  shadowMap: {},
  xr: {
    enabled: false,
    isPresenting: false,
    setAnimationLoop() {},
    addEventListener() {},
    removeEventListener() {},
  },
  renderLists: { dispose() {} },
} as any

describe('GameScene', () => {
  it('mounts without crashing', async () => {
    const canvas = makeCanvas()
    const root = createRoot(canvas)
    root.configure({ gl: fakeRenderer, size: { width: 1, height: 1 } })
    const { default: GameScene } = await import('../GameScene')
    expect(() => {
      root.render(React.createElement(GameScene))
    }).not.toThrow()
    root.unmount()
  })
})
