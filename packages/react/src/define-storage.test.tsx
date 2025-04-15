import { beforeEach, expect, test } from "vitest"
import { renderHook } from "vitest-browser-react"
import { act } from "react"
import { defineStorage } from "./define-storage.js"
import { z } from "zod"

beforeEach(() => {
  localStorage.clear()
})

test("writes to the storage", () => {
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

test("reads existing value from the storage", () => {
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

test("throws error when value violates schema", () => {
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

test("throws an error when reading a value and it violates the schema", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someKey: z.string().min(5),
  })

  localStorage.setItem("someKey", "hi")

  // ACT & ASSERT
  expect(() => renderHook(() => useStorage("someKey"))).toThrowError()
})

test("it returns undefined when there's not value for the key", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someKey: z.string(),
  })

  const subject = renderHook(() => useStorage("someKey"))

  // ACT
  const [result] = subject.result.current

  // ASSERT
  expect(result).toBeUndefined()
})

test("writes a number to the storage", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someNumberKey: z.number(),
  })

  const { result } = renderHook(() => useStorage("someNumberKey"))

  // ACT
  act(() => {
    const [, setValue] = result.current

    setValue(42)
  })

  // ASSERT
  expect(localStorage.getItem("someNumberKey")).toBe("42")

  const [value] = result.current
  expect(value).toBe(42)
})

test("writes a boolean to the storage", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someBooleanKey: z.boolean(),
  })

  const { result } = renderHook(() => useStorage("someBooleanKey"))

  // ACT
  act(() => {
    const [, setValue] = result.current

    setValue(true)
  })

  // ASSERT
  expect(localStorage.getItem("someBooleanKey")).toBe("true")

  const [value] = result.current
  expect(value).toBe(true)
})

test("writes an object to the storage", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someObjectKey: z.object({
      someProperty: z.string(),
    }),
  })

  const { result } = renderHook(() => useStorage("someObjectKey"))

  // ACT
  act(() => {
    const [, setValue] = result.current

    setValue({ someProperty: "someValue" })
  })

  // ASSERT
  expect(localStorage.getItem("someObjectKey")).toBe(
    JSON.stringify({ someProperty: "someValue" }),
  )

  const [value] = result.current
  expect(value).toEqual({ someProperty: "someValue" })
})

test("retrieve an object from local storage when mounting the component", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someObjectKey: z.object({
      someProperty: z.string(),
    }),
  })

  localStorage.setItem(
    "someObjectKey",
    JSON.stringify({ someProperty: "someValue" }),
  )

  const subject = renderHook(() => useStorage("someObjectKey"))

  // ACT
  const [result] = subject.result.current

  // ASSERT
  expect(result).toEqual({ someProperty: "someValue" })
})

test("returns the fallback value when the value for the key is not in the storage", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someKey: z.string(),
  })

  const subject = renderHook(() => useStorage("someKey", "fallbackValue"))

  // ACT
  const [result] = subject.result.current

  // ASSERT
  expect(result).toBe("fallbackValue")
})

test("throws an error when the fallback value violates the schema", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someKey: z.string(),
  })

  // ACT & ASSERT
  expect(() => {
    // @ts-expect-error -- number is not assignable to string
    renderHook(() => useStorage("someKey", 1))
  }).toThrowError()
})

test("returns the set value when a fallback value is defined but the key exists in the storage", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someKey: z.string(),
  })

  localStorage.setItem("someKey", "someValue")

  const subject = renderHook(() => useStorage("someKey", "fallbackValue"))

  // ACT
  const [result] = subject.result.current

  // ASSERT
  expect(result).toBe("someValue")
})
