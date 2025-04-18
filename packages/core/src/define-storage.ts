import type { StandardSchemaV1 } from "@standard-schema/spec"

type KeyOf<T extends object> = Extract<keyof T, string>

export function standardValidate<T extends StandardSchemaV1>(
  schema: T,
  input: StandardSchemaV1.InferInput<T>,
): StandardSchemaV1.InferOutput<T> {
  const result = schema["~standard"].validate(input)
  if (result instanceof Promise) {
    throw new TypeError("Schema validation must be synchronous")
  }

  if (result.issues) {
    throw new Error(JSON.stringify(result.issues, undefined, 2))
  }

  return result.value
}

export function defineStorage<T extends Record<string, StandardSchemaV1>>(
  schema: T,
) {
  return {
    storage: {
      get<K extends KeyOf<T>>(
        key: K,
      ): StandardSchemaV1.InferOutput<T[K]> | null {
        const item = localStorage.getItem(key as string)
        if (item === null) {
          return null
        }

        let parsedValue: unknown
        try {
          parsedValue = JSON.parse(item)
        } catch {
          if (item === "true") parsedValue = true
          else if (item === "false") parsedValue = false
          else if (Number.isNaN(Number(item))) {
            parsedValue = item
          } else {
            parsedValue = Number(item)
          }
        }

        try {
          // We know schema[key] exists because K extends KeyOf<T>
          const schemaForKey = schema[key] as StandardSchemaV1
          const validatedValue = standardValidate(schemaForKey, parsedValue)

          return validatedValue
        } catch (error) {
          const isJSONParseError = error instanceof SyntaxError
          if (!isJSONParseError) {
            throw error
          }
        }
      },
      set<K extends KeyOf<T>>(
        key: K,
        value: StandardSchemaV1.InferInput<T[K]> | null,
      ): void {
        if (value === null) {
          localStorage.removeItem(key as string)
        } else {
          // We know schema[key] exists because K extends KeyOf<T>
          const schemaForKey = schema[key] as StandardSchemaV1
          const validatedValue = standardValidate(schemaForKey, value)

          const stringifiedValue =
            typeof validatedValue === "object" && validatedValue !== null
              ? JSON.stringify(validatedValue)
              : String(validatedValue)

          localStorage.setItem(key as string, stringifiedValue)
        }
      },
      get length(): number {
        return localStorage.length
      },
      clear(): void {
        localStorage.clear()
      },
      remove<K extends KeyOf<T>>(key: K): void {
        localStorage.removeItem(key as string)
      },
      key(index: number): string | null {
        return localStorage.key(index)
      },
    },
  }
}
