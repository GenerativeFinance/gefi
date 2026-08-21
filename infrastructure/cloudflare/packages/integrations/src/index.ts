/**
 * `@gefi/integrations` — third-party integrations the API needs.
 *
 * Each provider is wrapped behind a small, framework-agnostic interface
 * so the API code is provider-agnostic (Onfido, Persona, Sumsub, Middesk
 * for KYC; OpenSanctions for sanctions). When the matching API key is
 * absent from the env (e.g. local dev) the factory returns the
 * deterministic `stub` implementation so tests don't need network access.
 *
 * What this package does NOT do:
 *   - persist anything (the API persists results into D1)
 *   - decide whether a tier needs KYC at all (that's `@gefi/auth/kyc-tiers`)
 *   - route compliance events to lawyers (that's Task #4)
 */

export type { KycProvider, KycSession, KycResult, KycEvidenceUpload } from "./kyc/types.js";
export { resolveKycProvider } from "./kyc/index.js";
export type { SanctionsProvider, SanctionsScreeningResult, SanctionsHit } from "./sanctions/types.js";
export { resolveSanctionsProvider } from "./sanctions/index.js";
