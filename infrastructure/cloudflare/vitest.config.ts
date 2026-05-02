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
      { find: "@gefi/compliance-rules/types", replacement: new URL("./packages/compliance-rules/src/types.ts", import.meta.url).pathname },
      { find: "@gefi/compliance-rules", replacement: new URL("./packages/compliance-rules/src/index.ts", import.meta.url).pathname },
      { find: "@gefi/compliance-engine/types", replacement: new URL("./packages/compliance-engine/src/types.ts", import.meta.url).pathname },
      { find: "@gefi/compliance-engine/merkle", replacement: new URL("./packages/compliance-engine/src/merkle.ts", import.meta.url).pathname },
      { find: "@gefi/compliance-engine/mailer", replacement: new URL("./packages/compliance-engine/src/mailer.ts", import.meta.url).pathname },
      { find: "@gefi/compliance-engine/anchor", replacement: new URL("./packages/compliance-engine/src/anchor.ts", import.meta.url).pathname },
      { find: "@gefi/compliance-engine/docusign", replacement: new URL("./packages/compliance-engine/src/docusign.ts", import.meta.url).pathname },
      { find: "@gefi/compliance-engine/directory", replacement: new URL("./packages/compliance-engine/src/directory.ts", import.meta.url).pathname },
      { find: "@gefi/compliance-engine/routing", replacement: new URL("./packages/compliance-engine/src/routing.ts", import.meta.url).pathname },
      { find: "@gefi/compliance-engine/evaluate", replacement: new URL("./packages/compliance-engine/src/evaluate.ts", import.meta.url).pathname },
      { find: "@gefi/compliance-engine", replacement: new URL("./packages/compliance-engine/src/index.ts", import.meta.url).pathname },
      { find: "@gefi/shared-headers", replacement: new URL("./packages/shared-headers/src/index.ts", import.meta.url).pathname },
      { find: "@gefi/shared-router", replacement: new URL("./packages/shared-router/src/index.ts", import.meta.url).pathname },
      { find: "@gefi/shared-types", replacement: new URL("./packages/shared-types/src/index.ts", import.meta.url).pathname },
      { find: "@gefi/marketplace", replacement: new URL("./packages/marketplace/src/index.ts", import.meta.url).pathname },
      { find: "@gefi/billing", replacement: new URL("./packages/billing/src/index.ts", import.meta.url).pathname },
      { find: "@gefi/model-gateway", replacement: new URL("./packages/model-gateway/src/index.ts", import.meta.url).pathname },
      { find: "@gefi/search-index", replacement: new URL("./packages/search-index/src/index.ts", import.meta.url).pathname },
      { find: "@gefi/reference-models", replacement: new URL("./packages/reference-models/src/index.ts", import.meta.url).pathname },
    ],
  },
});
