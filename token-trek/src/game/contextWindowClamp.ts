export function contextWindowClamp(value: number, min = 0, max = 2): number {
  return Math.min(Math.max(value, min), max)
}
