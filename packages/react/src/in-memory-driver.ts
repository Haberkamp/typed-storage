import type { StorageDriver } from "./storage-context.js"

export function createInMemoryDriver(): StorageDriver {
  const store = new Map<string, string>()

  return {
    getItem: (key: string) => store.get(key),
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
  }
}

