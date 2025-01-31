import { defineConfig } from 'vitest/config'; // Use vitest's config function

export default defineConfig({
  test: {
    setupFiles:'src/setupTests.ts',
    globals: true,    // Enables global test functions like `describe`, `it`, etc.
    environment: 'jsdom', // Simulates browser environment for DOM-related testing
  },
});
