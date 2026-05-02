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
    alias: [
      // Sub-path entries first (longest match wins). `@gefi/auth/kyc-tiers` /
      // `@gefi/auth/rbac` etc. need explicit aliases because vitest doesn't
      // honour `package.json#exports` for workspace packages by default.
      { find: "@gefi/auth/kyc-tiers", replacement: new URL("./packages/auth/src/kyc-tiers.ts", import.meta.url).pathname },
      { find: "@gefi/auth/management", replacement: new URL("./packages/auth/src/management.ts", import.meta.url).pathname },
      { find: "@gefi/auth/verify", replacement: new URL("./packages/auth/src/verify.ts", import.meta.url).pathname },
      { find: "@gefi/auth/rbac", replacement: new URL("./packages/auth/src/rbac.ts", import.meta.url).pathname },
      { find: "@gefi/auth/jwks", replacement: new URL("./packages/auth/src/jwks.ts", import.meta.url).pathname },
      { find: "@gefi/auth/types", replacement: new URL("./packages/auth/src/types.ts", import.meta.url).pathname },
      { find: "@gefi/auth", replacement: new URL("./packages/auth/src/index.ts", import.meta.url).pathname },
      { find: "@gefi/integrations/kyc", replacement: new URL("./packages/integrations/src/kyc/index.ts", import.meta.url).pathname },
      { find: "@gefi/integrations/sanctions", replacement: new URL("./packages/integrations/src/sanctions/index.ts", import.meta.url).pathname },
      { find: "@gefi/integrations", replacement: new URL("./packages/integrations/src/index.ts", import.meta.url).pathname },
      { find: "@gefi/shared-headers", replacement: new URL("./packages/shared-headers/src/index.ts", import.meta.url).pathname },
      { find: "@gefi/shared-router", replacement: new URL("./packages/shared-router/src/index.ts", import.meta.url).pathname },
      { find: "@gefi/shared-types", replacement: new URL("./packages/shared-types/src/index.ts", import.meta.url).pathname },
    ],
  },
});
