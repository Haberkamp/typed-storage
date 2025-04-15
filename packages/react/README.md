# @typed-storage/react

![CI passing](https://github.com/Haberkamp/typed-storage/actions/workflows/ci.yml/badge.svg?event=push&branch=main)
![Created by](https://img.shields.io/badge/created%20by-@n__haberkamp-065afa.svg)
![NPM License](https://img.shields.io/npm/l/%40typed-storage%2Freact)

## Highlights

- Schema validation
- Automatic type inference
- useState-like API
- Use it with zod, validbot, arktype, etc.

## Overview

TypedStorage gives you a type-safe way to access `localStorage`. Moreover, you can use zod or any other schema validation library to make sure your data is always valid.

### Author

Hey, I'm Nils. In my spare time [I write about things I learned](https://www.haberkamp.dev/) or I [create open source packages](https://github.com/Haberkamp), that help me (and hopefully you) to build better apps.

## Usage

Two steps: define your schema and use the hook, nothing else.

1. Define your schema

```ts
// schema.ts

import { defineStorage } from "@typed-storage/react"
// Feel free to use any other StandardSchema compatible library
import { z } from "zod"

const { useStorage } = defineStorage({
  theme: z.enum(["light", "dark"]),
})

export { useStorage }
```

2. Use the hook

```tsx
// my-component.tsx

import { useStorage } from "./schema"

export function MyComponent() {
  const [theme, setTheme] = useStorage("theme")

  return (
    <>
      <div>{theme}</div>

      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>

      {/* type-error: Cannot assign "system" to "light" | "dark" */}
      <button onClick={() => setTheme("system")}>System</button>
    </>
  )
}
```

### Fallback values

You can define a fallback value for the key if it doesn't exist in the storage.

```tsx
export function MyComponent() {
  const [theme, setTheme] = useStorage("theme", "light")

  return (
    <>
      {/* This will be "light" because the key doesn't exist in the storage */}
      <div>{theme}</div>
    </>
  )
}
```

## Installation

You can install this package with any package manager you like.

```bash
pnpm add @typed-storage/react
```

## Feedback and Contributing

I highly appreceate your feedback! Please create an [issue](https://github.com/Haberkamp/typed-storage/issues/new), if you've found any bugs or want to request a feature.
