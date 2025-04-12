import { beforeEach, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import { act } from "react";
import { defineStorage } from "./defineStorage";

beforeEach(() => {
  localStorage.clear();
});

test("writes to the storage", async () => {
  // ARRANGE
  const { useStorage } = defineStorage();
  const { result } = renderHook(() => useStorage("someKey"));

  // ACT
  act(() => {
    const [, setValue] = result.current;

    setValue("someValue");
  });

  // ASSERT
  expect(localStorage.getItem("someKey")).toBe("someValue");

  const [value] = result.current;
  expect(value).toBe("someValue");
});
