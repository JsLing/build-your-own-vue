import { reactive } from "../reactive"

describe("reactive", () => {
  it("happy path", () => {
    const orginal = { test: 1 }
    const observed = reactive(orginal)
    expect(observed).not.toBe(orginal)
    expect(observed.test).toBe(1)
  })
})
