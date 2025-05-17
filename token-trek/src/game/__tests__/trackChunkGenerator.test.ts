import { describe, expect, it } from 'vitest'
import { trackChunkGenerator } from '../trackChunkGenerator'

describe('trackChunkGenerator', () => {
  it('generates sequential chunks with default settings', () => {
    const gen = trackChunkGenerator()
    const first = gen.next().value
    const second = gen.next().value
    const third = gen.next().value
    expect(first).toEqual({ id: 0, lanes: [-2, 0, 2], startZ: 0, length: 10 })
    expect(second).toEqual({ id: 1, lanes: [-2, 0, 2], startZ: 10, length: 10 })
    expect(third).toEqual({ id: 2, lanes: [-2, 0, 2], startZ: 20, length: 10 })
  })

  it('allows custom chunk length and lane width', () => {
    const gen = trackChunkGenerator(5, 1.5)
    const first = gen.next().value
    const second = gen.next().value
    expect(first).toEqual({ id: 0, lanes: [-1.5, 0, 1.5], startZ: 0, length: 5 })
    expect(second).toEqual({ id: 1, lanes: [-1.5, 0, 1.5], startZ: 5, length: 5 })
  })
})
