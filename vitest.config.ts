import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    workspace: ["packages/*"],
    include: ["tests/**/*.spec.ts"],
    coverage: {
      enabled: true,
      include: ["**/src/**/*.ts"],
      exclude: ["tooling/**"],
      reporter: "lcov",
    },
    ui: !process.env.CI,
  },
});
