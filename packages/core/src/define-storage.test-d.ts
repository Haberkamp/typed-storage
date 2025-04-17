import { z } from "zod"
import { defineStorage } from "./define-storage.js"
import { test, assertType } from "vitest"

test("it's not possible to set a value that violates the schema", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string(),
  })

  // ACT & ASSERT
  // @ts-expect-error -- Cannot set a value that violates the schema
  assertType(storage.set("someKey", 1))
})

test("it's not possible to access a non string key", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string(),
  })

  // ACT & ASSERT
  // @ts-expect-error -- Cannot access a non string key
  assertType(storage.get(1))
})

test("it's not possible to access a non existent key", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string(),
  })

  // ACT & ASSERT
  // @ts-expect-error -- Cannot access a non existent key
  assertType(storage.get("some-non-existent-key"))
})

test("the value has a type of string", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string(),
  })

  // ACT & ASSERT
  assertType<string | null>(storage.get("someKey"))
})

test("the value has a type of boolean", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someBooleanKey: z.boolean(),
  })

  // ACT & ASSERT
  assertType<boolean | null>(storage.get("someBooleanKey"))
})

test("the value has a type of number", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someNumberKey: z.number(),
  })

  // ACT & ASSERT
  assertType<number | null>(storage.get("someNumberKey"))
})

test("value must have type of null", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someNumberKey: z.number(),
  })

  // ACT & ASSERT
  assertType<number | null>(storage.get("someNumberKey"))
})

test("returns nothing when removing an item", () => {
  // ARRANGE
  const { storage } = defineStorage({
    someKey: z.string(),
  })

  // ACT
  storage.remove("someKey")

  // ASSERT
  assertType<void>(storage.remove("someKey"))
})
