import { StandardSchemaV1 } from "@standard-schema/spec"
import { useState } from "react"

export function standardValidate<T extends StandardSchemaV1>(
  schema: T,
  input: StandardSchemaV1.InferInput<T>,
): StandardSchemaV1.InferOutput<T> {
  let result = schema["~standard"].validate(input)
  if (result instanceof Promise) {
    throw new TypeError("Schema validation must be synchronous")
  }

  // if the `issues` field exists, the validation failed
  if (result.issues) {
    throw new Error(JSON.stringify(result.issues, null, 2))
  }

  return result.value
}

export function defineStorage(schema: Record<string, StandardSchemaV1>) {
  function useStorage(key: string) {
    const [value, setValue] = useState<string | null>(localStorage.getItem(key))

    function set(newValue: string) {
      standardValidate(schema[key], newValue)

      localStorage.setItem(key, newValue)
      setValue(newValue)
    }

    return [value, set] as const
  }

  return {
    useStorage,
  }
}
