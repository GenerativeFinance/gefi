import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "packages/**/src/**/*.test.ts",
      "workers/**/src/**/*.test.ts",
    ],
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["packages/**/src/**/*.ts", "workers/**/src/**/*.ts"],
      exclude: ["**/*.test.ts"],
    },
  },
  resolve: {
    alias: {
      "@gefi/shared-headers": new URL("./packages/shared-headers/src/index.ts", import.meta.url).pathname,
      "@gefi/shared-router": new URL("./packages/shared-router/src/index.ts", import.meta.url).pathname,
      "@gefi/shared-types": new URL("./packages/shared-types/src/index.ts", import.meta.url).pathname,
    },
  },
});
