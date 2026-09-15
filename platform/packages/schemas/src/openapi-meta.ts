/**
 * Shared OpenAPI fragments for control-plane ↔ Python ↔ Rust.
 * Source of truth for generated types in later iterations.
 */
export const openApiInfo = {
  openapi: "3.1.0",
  info: {
    title: "GeFi Platform API",
    version: "0.1.0",
    description:
      "Control-plane API for financial calculation graphs and private federated learning governance.",
  },
} as const;
