import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: __dirname,
    projects: ["packages/*"],
    include: ["tests/**/*.spec.ts"],
    coverage: {
      enabled: true,
      include: ["**/src/**/*.ts"],
      exclude: ["tooling/**"],
      reporter: ["lcov", "html"],
      thresholds: {
        100: true,
      },
    },
  },
});
