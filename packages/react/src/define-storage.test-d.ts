import { z } from "zod"
import { defineStorage } from "./define-storage.js"
import { test, assertType } from "vitest"

test("it's not possible to insert a value that violates the schema", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someKey: z.string(),
  })

  const [, setValue] = useStorage("someKey")

  // ACT & ASSERT
  // @ts-expect-error -- Cannot assign value that violates the schema
  assertType(setValue(1))
})

test("it's not possible to access a non string key", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someKey: z.string(),
  })

  // ACT & ASSERT
  // @ts-expect-error -- Cannot access a non string key
  assertType(useStorage(1))
})

test("it's not possible to access a non existent key", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someKey: z.string(),
  })

  // ACT & ASSERT
  // @ts-expect-error -- Cannot access a non existent key
  assertType(useStorage("some-non-existent-key"))
})
