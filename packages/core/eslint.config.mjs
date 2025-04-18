// @ts-check

import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import eslintPluginUnicorn from "eslint-plugin-unicorn"

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.Config[]} */
export default tseslint.config(
  {
    ignores: ["dist"],
  },
  eslint.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "unicorn/no-null": "off",
    },
  },
)
