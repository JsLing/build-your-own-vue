import { isReactive, readonly, isReadonly } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const orginal = { test: 1 }
    // not set
    const observed = readonly(orginal)
    expect(observed).not.toBe(orginal)
    expect(observed.test).toBe(1)
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(orginal)).toBe(false)
  })
})
