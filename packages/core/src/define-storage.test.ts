import { beforeEach, test, expect } from "vitest"
import { defineStorage } from "./define-storage.js"
import { z } from "zod"

beforeEach(() => {
  localStorage.clear()
})

test("writes to the storage", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string(),
  })

  // ACT
  storage.set("someKey", "someValue")

  // ASSERT
  expect(localStorage.getItem("someKey")).toBe("someValue")
  expect(storage.get("someKey")).toBe("someValue")
})

test("reads existing value from the storage", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string(),
  })

  localStorage.setItem("someKey", "someValue")

  // ACT
  const value = storage.get("someKey")

  // ASSERT
  expect(value).toBe("someValue")
})

test("unset the value", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string(),
  })

  storage.set("someKey", "someValue")

  // ACT
  storage.set("someKey", null)
  const result = storage.get("someKey")

  // ASSERT
  expect(result).toBeNull()
  expect(localStorage.getItem("someKey")).toBeNull()
})

test("throws an error when reading a value and it violates the schema", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string().min(5),
  })

  // ACT & ASSERT
  expect(() => storage.set("someKey", "hi")).toThrowError()
})

test("returns undefined when there's no value for the key", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string(),
  })

  // ACT
  const result = storage.get("someKey")

  // ASSERT
  expect(result).toBeNull()
})

test("writes a number to the storage", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.number(),
  })

  // ACT
  storage.set("someKey", 42)

  // ASSERT
  expect(localStorage.getItem("someKey")).toBe("42")
  expect(storage.get("someKey")).toBe(42)
})

test("writes a boolean to the storage", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.boolean(),
  })

  // ACT
  storage.set("someKey", true)

  // ASSERT
  expect(localStorage.getItem("someKey")).toBe("true")
  expect(storage.get("someKey")).toBe(true)
})

test("writes an object to the storage", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.object({
      someProperty: z.string(),
    }),
  })

  // ACT
  storage.set("someKey", { someProperty: "someValue" })

  // ASSERT
  expect(localStorage.getItem("someKey")).toBe(
    JSON.stringify({ someProperty: "someValue" }),
  )

  expect(storage.get("someKey")).toEqual({
    someProperty: "someValue",
  })
})

test("returns the number of values in the storage", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string(),
  })

  storage.set("someKey", "someValue")

  // ACT
  const result = storage.length

  // ASSERT
  expect(result).toBe(1)
})

test("returns 0 when store has no values set", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string(),
  })

  // ACT
  const result = storage.length

  // ASSERT
  expect(result).toBe(0)
})

test("clears all the items in localStorage", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string(),
  })

  storage.set("someKey", "someValue")

  // ACT
  storage.clear()

  // ASSERT
  expect(localStorage.length).toBe(0)
})

test("removes an item from localStorage", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string(),
  })

  storage.set("someKey", "someValue")

  // ACT
  storage.remove("someKey")

  // ASSERT
  expect(localStorage.length).toBe(0)
  expect(localStorage.getItem("someKey")).toBeNull()

  expect(storage.get("someKey")).toBeNull()
})

test("returns the name of the key", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string(),
  })

  storage.set("someKey", "someValue")

  // ACT
  const result = storage.key(0)

  // ASSERT
  expect(result).toBe("someKey")
})

test("returns null when the key is not set", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string(),
  })

  // ACT
  const result = storage.key(0)

  // ASSERT
  expect(result).toBeNull()
})
