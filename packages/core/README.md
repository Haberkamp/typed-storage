# @typed-storage/core

![CI passing](https://github.com/Haberkamp/typed-storage/actions/workflows/ci.yml/badge.svg?event=push&branch=main)
![Created by](https://img.shields.io/badge/created%20by-@n__haberkamp-065afa.svg)
![NPM License](https://img.shields.io/npm/l/%40typed-storage%2Fcore)

## Highlights

- Schema validation
- Automatic type inference
- Use it with zod, validbot, arktype, etc.

## Overview

TypedStorage gives you a type-safe way to access `localStorage`. Moreover, you can use zod or any other schema validation library to make sure your data is always valid.

### Author

Hey, I'm Nils. In my spare time [I write about things I learned](https://www.haberkamp.dev/) or I [create open source packages](https://github.com/Haberkamp), that help me (and hopefully you) to build better apps.

## Usage

Two steps: define your schema and use it like normal localStorage.

1. Define your schema

```ts
// schema.ts

import { defineStorage } from "@typed-storage/core"
// Feel free to use any other StandardSchema compatible library
import { z } from "zod"

const { storage } = defineStorage({
  theme: z.enum(["light", "dark"]),
})

export { storage }
```

2. Use the storage

```ts
// my-file.ts

import { storage } from "./schema"

storage.set("theme", "light")

const theme = storage.get("theme")
```

## Installation

You can install this package with any package manager you like.

```bash
pnpm add @typed-storage/core
```

## Feedback and Contributing

I highly appreceate your feedback! Please create an [issue](https://github.com/Haberkamp/typed-storage/issues/new), if you've found any bugs or want to request a feature.
