// @ts-check

import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.Config[]} */
export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
)
