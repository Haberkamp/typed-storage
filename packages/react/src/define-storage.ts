import type { StandardSchemaV1 } from "@standard-schema/spec"
import { defineStorageHook } from "./define-storage-hook.js"
import { defineStorage as defineCoreStorage } from "@typed-storage/core"

export function defineStorage<T extends Record<string, StandardSchemaV1>>(
  schema: T,
) {
  const { storage } = defineCoreStorage(schema)
  const { useStorage } = defineStorageHook(schema)

  return {
    storage,
    useStorage,
  }
}
