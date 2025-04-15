import { z } from "zod"
import { defineStorage } from "./define-storage.js"
import { test, assertType, expectTypeOf } from "vitest"

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

test("the value has a type of string", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someKey: z.string(),
  })

  // ACT
  const [result] = useStorage("someKey")

  // ASSERT
  assertType<string | undefined>(result)
})

test("the value has a type of boolean", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someBooleanKey: z.boolean(),
  })

  // ACT
  const [result] = useStorage("someBooleanKey")

  // ASSERT
  assertType<boolean | undefined>(result)
})

test("the value has a type of number", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someNumberKey: z.number(),
  })

  // ACT
  const [result] = useStorage("someNumberKey")

  // ASSERT
  assertType<number | undefined>(result)
})

test("value must have type of undefined", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someNumberKey: z.number(),
  })

  // ACT
  const [result] = useStorage("someNumberKey")

  // ASSERT
  assertType<number | undefined>(result)
})

test("value is not undefined when setting a fallback value", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someNumberKey: z.number(),
  })

  // ACT
  const [result] = useStorage("someNumberKey", 1)

  // ASSERT
  assertType<number>(result)
})

test("value can be undefined when fallback is set but the schema includes undefined", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someNumberKey: z.number().optional(),
  })

  // ACT
  const [result] = useStorage("someNumberKey", 1)

  // ASSERT
  expectTypeOf(result).toEqualTypeOf<undefined | number>()
})

test("fallback value must have the conform to the schema", () => {
  // ARRANGE
  const { useStorage } = defineStorage({
    someNumberKey: z.number(),
  })

  // ACT & ASSERT
  // @ts-expect-error -- Cannot assign value that violates the schema
  assertType(useStorage("someNumberKey", "not a number"))
})
