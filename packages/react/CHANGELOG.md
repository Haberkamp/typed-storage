# @typed-storage/react

## 0.4.0

### Minor Changes

- 72b60c3: add light-weight wrapper around localStorage

  The `defineStorage` function now returns a `storage` property that allows you to call
  the localStorage API directly. You can use that when you want to access the localStorage
  outside of the React context.

  ```ts
  const { storage } = defineStorage({
    foo: z.string(),
  })

  storage.set("foo", "bar")
  ```

## 0.3.1

### Patch Changes

- 16913bd: Include typescript definitions

## 0.3.0

### Minor Changes

- aae9471: Add option to define fallback

### Patch Changes

- de4e2fb: Allow removing the value from localStorage

## 0.2.0

### Minor Changes

- db6c4ec: Allow storing numbers in localStorage

### Patch Changes

- db6c4ec: De-serialize value from localStorage when mounting the component
- f9fdc39: Add `README.md` file

## 0.1.0

### Minor Changes

- 05c9e8f: add `useStorage` hook
