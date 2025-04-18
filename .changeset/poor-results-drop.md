---
"@typed-storage/react": minor
---

add light-weight wrapper around localStorage

The `defineStorage` function now returns a `storage` property that allows you to call
the localStorage API directly. You can use that when you want to access the localStorage
outside of the React context.

```ts
const { storage } = defineStorage({
  foo: z.string(),
})

storage.set("foo", "bar")
```
