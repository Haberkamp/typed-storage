import { beforeEach, expect, test } from "vitest"
import { renderHook } from "vitest-browser-react"
import { act } from "react"
import { defineStorage } from "./defineStorage"
import { z } from "zod"

beforeEach(() => {
  localStorage.clear()
})

test("writes to the storage", async () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someKey: z.string(),
  })

  const { result } = renderHook(() => useStorage("someKey"))

  // ACT
  act(() => {
    const [, setValue] = result.current

    setValue("someValue")
  })

  // ASSERT
  expect(localStorage.getItem("someKey")).toBe("someValue")

  const [value] = result.current
  expect(value).toBe("someValue")
})

test("reads existing value from the storage", async () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someKey: z.string(),
  })

  localStorage.setItem("someKey", "someValue")

  const subject = renderHook(() => useStorage("someKey"))

  // ACT
  const [result] = subject.result.current

  // ASSERT
  expect(result).toBe("someValue")
})

test("throws error when value violates schema", async () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someKey: z.string().min(5),
  })

  const { result } = renderHook(() => useStorage("someKey"))

  // ACT & ASSERT
  act(() => {
    const [, setValue] = result.current
    expect(() => setValue("hi")).toThrowError()
  })
})
