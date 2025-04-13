import { StandardSchemaV1 } from "@standard-schema/spec"
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
    throw new Error(JSON.stringify(result.issues, null, 2))
  }

  return result.value
}

export function defineStorage<T extends Record<string, StandardSchemaV1>>(
  schema: T,
) {
  function useStorage(key: KeyOf<T>) {
    const [value, setValue] = useState<string | undefined>(() => {
      const storedValue = localStorage.getItem(key)
      if (storedValue === null) return undefined

      standardValidate(schema[key], storedValue)
      return storedValue
    })

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
