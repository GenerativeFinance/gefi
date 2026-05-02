/**
 * `@gefi/auth` — user authentication and RBAC for GeFi.
 *
 * Three layers:
 *
 *   1. **Token verification** (`verify.ts`) — validates Auth0 RS256 JWTs
 *      against the tenant's JWKS, hydrates the namespaced custom claims
 *      (`https://gefi.io/jurisdiction`, etc.) into a flat `GefiAuthClaims`
 *      object the rest of the API can consume.
 *
 *   2. **RBAC engine** (`rbac.ts`) — a CASL-style permission matrix mapping
 *      personas (`admin`, `developer`, `investor`, `data_provider`,
 *      `regulator`, `auditor`, `compliance_officer`) to a set of
 *      `action:resource` permissions. Server-side middleware and the
 *      client-side `<RoleGate>` (Task #7) both call `canPerform()`.
 *
 *   3. **KYC/subscription tier mapping** (`kyc-tiers.ts`) — maps the
 *      subscription tier a tenant signed up to onto the KYC depth they
 *      need to complete onboarding (`free` → none, `enterprise` →
 *      enhanced).
 */

export * from "./types.js";
export * from "./verify.js";
export * from "./jwks.js";
export * from "./rbac.js";
export * from "./kyc-tiers.js";
export * from "./management.js";
