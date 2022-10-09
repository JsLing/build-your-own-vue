import { isReactive, readonly, reactive } from '../reactive'

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

  test('nested reactives', () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    }
    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })
})
