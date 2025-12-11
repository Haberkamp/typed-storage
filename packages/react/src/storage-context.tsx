import { createContext, useContext, type ReactNode } from "react"

export type StorageDriver = {
  getItem: (key: string) => string | null | undefined
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

const StorageContext = createContext<StorageDriver | undefined>(undefined)

export type StorageProviderProperties = {
  driver: StorageDriver
  children: ReactNode
}

export const StorageProvider = ({
  driver,
  children,
}: StorageProviderProperties) => {
  return (
    <StorageContext.Provider value={driver}>{children}</StorageContext.Provider>
  )
}

export function useStorageDriver(): StorageDriver {
  const driver = useContext(StorageContext)
  if (driver === undefined) {
    throw new Error(
      "useStorageDriver must be used within a <StorageProvider />",
    )
  }
  return driver
}
