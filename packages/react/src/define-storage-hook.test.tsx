import { beforeEach, expect, test } from "vitest"
import { renderHook } from "vitest-browser-react"
import { act, type ReactNode } from "react"
import { defineStorageHook } from "./define-storage-hook.js"
import { StorageProvider } from "./storage-context.js"
import { z } from "zod"

beforeEach(() => {
  localStorage.clear()
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <StorageProvider driver={localStorage}>{children}</StorageProvider>
)

test("writes to the storage", () => {
  // ARRANGE
  const { useStorage } = defineStorageHook({
    someKey: z.string(),
  })

  const { result } = renderHook(() => useStorage("someKey"), { wrapper })

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
  const { useStorage } = defineStorageHook({
    someKey: z.string(),
  })

  localStorage.setItem("someKey", "someValue")

  const subject = renderHook(() => useStorage("someKey"), { wrapper })

  // ACT
  const [result] = subject.result.current

  // ASSERT
  expect(result).toBe("someValue")
})

test("unset the value", () => {
  // ARRANGE
  const { useStorage } = defineStorageHook({
    someKey: z.string(),
  })

  const subject = renderHook(() => useStorage("someKey"), { wrapper })
  const [, setValue] = subject.result.current

  // ACT

  act(() => {
    setValue(undefined)
  })

  const [result] = subject.result.current

  // ASSERT
  expect(result).toBeUndefined()
})

test("throws error when value violates schema", () => {
  // ARRANGE
  const { useStorage } = defineStorageHook({
    someKey: z.string().min(5),
  })

  const { result } = renderHook(() => useStorage("someKey"), { wrapper })

  // ACT & ASSERT
  act(() => {
    const [, setValue] = result.current
    expect(() => setValue("hi")).toThrowError()
  })
})

test("throws an error when reading a value and it violates the schema", () => {
  // ARRANGE
  const { useStorage } = defineStorageHook({
    someKey: z.string().min(5),
  })

  localStorage.setItem("someKey", "hi")

  // ACT & ASSERT
  expect(() =>
    renderHook(() => useStorage("someKey"), { wrapper }),
  ).toThrowError()
})

test("it returns undefined when there's not value for the key", () => {
  // ARRANGE
  const { useStorage } = defineStorageHook({
    someKey: z.string(),
  })

  const subject = renderHook(() => useStorage("someKey"), { wrapper })

  // ACT
  const [result] = subject.result.current

  // ASSERT
  expect(result).toBeUndefined()
})

test("writes a number to the storage", () => {
  // ARRANGE
  const { useStorage } = defineStorageHook({
    someNumberKey: z.number(),
  })

  const { result } = renderHook(() => useStorage("someNumberKey"), { wrapper })

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
  const { useStorage } = defineStorageHook({
    someBooleanKey: z.boolean(),
  })

  const { result } = renderHook(() => useStorage("someBooleanKey"), { wrapper })

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
  const { useStorage } = defineStorageHook({
    someObjectKey: z.object({
      someProperty: z.string(),
    }),
  })

  const { result } = renderHook(() => useStorage("someObjectKey"), { wrapper })

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
  const { useStorage } = defineStorageHook({
    someObjectKey: z.object({
      someProperty: z.string(),
    }),
  })

  localStorage.setItem(
    "someObjectKey",
    JSON.stringify({ someProperty: "someValue" }),
  )

  const subject = renderHook(() => useStorage("someObjectKey"), { wrapper })

  // ACT
  const [result] = subject.result.current

  // ASSERT
  expect(result).toEqual({ someProperty: "someValue" })
})

test("returns the fallback value when the value for the key is not in the storage", () => {
  // ARRANGE
  const { useStorage } = defineStorageHook({
    someKey: z.string(),
  })

  const subject = renderHook(() => useStorage("someKey", "fallbackValue"), {
    wrapper,
  })

  // ACT
  const [result] = subject.result.current

  // ASSERT
  expect(result).toBe("fallbackValue")
})

test("throws an error when the fallback value violates the schema", () => {
  // ARRANGE
  const { useStorage } = defineStorageHook({
    someKey: z.string(),
  })

  // ACT & ASSERT
  expect(() => {
    // @ts-expect-error -- number is not assignable to string
    renderHook(() => useStorage("someKey", 1), { wrapper })
  }).toThrowError()
})

test("returns the set value when a fallback value is defined but the key exists in the storage", () => {
  // ARRANGE
  const { useStorage } = defineStorageHook({
    someKey: z.string(),
  })

  localStorage.setItem("someKey", "someValue")

  const subject = renderHook(() => useStorage("someKey", "fallbackValue"), {
    wrapper,
  })

  // ACT
  const [result] = subject.result.current

  // ASSERT
  expect(result).toBe("someValue")
})

test("unsetting the key returns the fallback value", () => {
  // ARRANGE
  const { useStorage } = defineStorageHook({
    someKey: z.string(),
  })

  const subject = renderHook(() => useStorage("someKey", "fallbackValue"), {
    wrapper,
  })
  const [, setValue] = subject.result.current

  // ACT
  act(() => {
    setValue(undefined)
  })

  const [result] = subject.result.current

  // ASSERT
  expect(result).toBe("fallbackValue")
})

test("uses a custom storage driver via StorageProvider", () => {
  // ARRANGE
  const inMemoryStore = new Map<string, string>()
  const inMemoryStorage = {
    getItem: (key: string) => inMemoryStore.get(key) ?? undefined,
    setItem: (key: string, value: string) => inMemoryStore.set(key, value),
    removeItem: (key: string) => inMemoryStore.delete(key),
  }

  const customWrapper = ({ children }: { children: ReactNode }) => (
    <StorageProvider driver={inMemoryStorage}>{children}</StorageProvider>
  )

  const { useStorage } = defineStorageHook({
    someKey: z.string(),
  })

  const { result } = renderHook(() => useStorage("someKey"), {
    wrapper: customWrapper,
  })

  // ACT
  act(() => {
    const [, setValue] = result.current
    setValue("inMemoryValue")
  })

  // ASSERT
  expect(inMemoryStore.get("someKey")).toBe("inMemoryValue")
  expect(localStorage.getItem("someKey")).toBeNull() // not in localStorage

  const [value] = result.current
  expect(value).toBe("inMemoryValue")
})
