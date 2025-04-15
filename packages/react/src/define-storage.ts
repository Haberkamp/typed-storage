import { type StandardSchemaV1 } from "@standard-schema/spec"
import { useState } from "react"

type KeyOf<T extends object> = Extract<keyof T, string>

export function standardValidate<T extends StandardSchemaV1>(
  schema: T,
  input: StandardSchemaV1.InferInput<T>,
): StandardSchemaV1.InferOutput<T> {
  const result = schema["~standard"].validate(input)
  if (result instanceof Promise) {
    throw new TypeError("Schema validation must be synchronous")
  }

  // if the `issues` field exists, the validation failed
  if (result.issues) {
    throw new Error(JSON.stringify(result.issues, undefined, 2))
  }

  return result.value
}

export function defineStorage<T extends Record<string, StandardSchemaV1>>(
  schema: T,
) {
  function useStorage<K extends KeyOf<T>>(
    key: K,
  ): [
    StandardSchemaV1.InferOutput<T[K]> | undefined,
    (value: StandardSchemaV1.InferInput<T[K]> | undefined) => void,
  ]
  function useStorage<K extends KeyOf<T>>(
    key: K,
    fallbackValue: StandardSchemaV1.InferInput<T[K]>,
  ): [
    StandardSchemaV1.InferOutput<T[K]>,
    (value: StandardSchemaV1.InferInput<T[K]> | undefined) => void,
  ]
  function useStorage<K extends KeyOf<T>>(
    key: K,
    fallbackValue?: unknown,
  ): [
    StandardSchemaV1.InferOutput<T[K]> | undefined,
    (value: StandardSchemaV1.InferInput<T[K]> | undefined) => void,
  ] {
    // Validate fallback value if provided
    let validatedFallback: StandardSchemaV1.InferOutput<T[K]> | undefined =
      undefined

    if (fallbackValue !== undefined) {
      // We know schema[key] exists because K extends KeyOf<T>
      const schemaForKey = schema[key] as StandardSchemaV1
      // This will throw if fallbackValue doesn't match the schema
      validatedFallback = standardValidate(
        schemaForKey,
        fallbackValue as StandardSchemaV1.InferInput<T[K]>,
      )
    }

    const [value, setValue] = useState<
      StandardSchemaV1.InferOutput<T[KeyOf<T>]> | undefined
    >(() => {
      const storedValue = localStorage.getItem(key)
      if (storedValue === null) return

      let valueToValidate: unknown = storedValue

      try {
        const parsed = JSON.parse(storedValue) as unknown
        valueToValidate = parsed
      } catch (error) {
        const isJSONParseError = error instanceof SyntaxError
        if (!isJSONParseError) {
          throw error
        }
      }

      return standardValidate(
        schema[key],
        // We can assert here, because we know that the value we get is part of the schema
        valueToValidate as StandardSchemaV1.InferInput<T[KeyOf<T>]>,
      )
    })

    function set(
      newValue: StandardSchemaV1.InferInput<T[K]> | undefined,
    ): void {
      if (newValue === undefined) {
        localStorage.removeItem(key)
        setValue(undefined)
        return
      }

      // We know schema[key] exists because K extends KeyOf<T>
      const schemaForKey = schema[key] as StandardSchemaV1
      standardValidate(schemaForKey, newValue)

      if (typeof newValue === "string") {
        localStorage.setItem(key, newValue)
      } else {
        localStorage.setItem(key, JSON.stringify(newValue))
      }

      setValue(newValue)
    }

    return [value, set] as const
  }

  return {
    useStorage,
  }
}
