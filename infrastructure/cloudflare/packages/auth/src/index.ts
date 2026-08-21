/**
 * `@gefi/auth` — RBAC + claim vocabulary for GeFi.
 *
 * Three layers:
 *
 *   1. **Claim vocabulary** (`types.ts`) — `GefiAuthClaims`, action /
 *      resource enums, namespaced custom-claim prefix.
 *
 *   2. **RBAC engine** (`rbac.ts`) — a CASL-style permission matrix
 *      mapping personas (`admin`, `developer`, `investor`,
 *      `data_provider`, `regulator`, `auditor`, `compliance_officer`)
 *      to a set of `action:resource` permissions. Server-side
 *      middleware calls `canPerform()`.
 *
 *   3. **KYC/subscription tier mapping** (`kyc-tiers.ts`) — maps the
 *      subscription tier a tenant signed up to onto the KYC depth they
 *      need to complete onboarding (`free` → none, `enterprise` →
 *      enhanced).
 *
 * Token verification (RS256 / JWKS / M2M) lives in the upcoming
 * `gefi-auth` Cloudflare Worker — not in this package. The thin
 * helpers in `verify.ts` (`extractBearer`, `peekJurisdiction`,
 * `LooseAuthClaims`) are header / payload utilities that are not tied
 * to any specific auth provider.
 */

export * from "./types.js";
export * from "./verify.js";
export * from "./rbac.js";
export * from "./kyc-tiers.js";
