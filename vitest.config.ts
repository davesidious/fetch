import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    workspace: ["packages/*"],
    coverage: {
      enabled: true,
      include: ["**/src/**/*.ts"],
    },
    ui: !process.env.CI,
  },
});
