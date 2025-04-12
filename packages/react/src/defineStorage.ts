import { useState, useEffect } from "react"

export function defineStorage() {
  function useStorage(key: string) {
    const [value, setValue] = useState<string | null>(localStorage.getItem(key))

    function set(newValue: string) {
      localStorage.setItem(key, newValue)
      setValue(newValue)
    }

    return [value, set] as const
  }

  return {
    useStorage,
  }
}
