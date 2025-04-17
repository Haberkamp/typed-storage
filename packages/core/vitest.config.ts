import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    // Add any core-specific test configurations here if needed
    browser: {
      enabled: true,
      provider: "playwright", // or 'webdriverio'
      name: "chromium", // Required by type, let's use chromium like in react pkg
      instances: [{ browser: "chromium" }],
      screenshotFailures: false,
    },
  },
})
