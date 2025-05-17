import { describe, expect, it } from 'vitest'
import { contextWindowClamp } from '../contextWindowClamp'

describe('contextWindowClamp', () => {
  it('clamps values to the provided range', () => {
    expect(contextWindowClamp(-1)).toBe(0)
    expect(contextWindowClamp(1)).toBe(1)
    expect(contextWindowClamp(3)).toBe(2)
  })

  it('works with custom bounds', () => {
    expect(contextWindowClamp(5, -2, 4)).toBe(4)
    expect(contextWindowClamp(-3, -2, 4)).toBe(-2)
  })
})
