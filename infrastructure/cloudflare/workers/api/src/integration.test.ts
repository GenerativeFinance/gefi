/**
 * gefi-api integration tests — DISABLED PENDING gefi-auth WORKER.
 *
 * The previous suite (≈80 cases) drove every protected route by
 * minting RS256 user tokens against an in-process Auth0 JWKS, calling
 * `verifyAuth0Token` from `@gefi/auth/verify`, and asserting the
 * router's auth + RBAC + cross-region behaviour end-to-end.
 *
 * GeFi pivoted off Auth0 in May 2026. The Auth0-specific pieces of
 * `@gefi/auth` (`jwks.ts`, `verify.ts` RS256 path, `management.ts`)
 * were removed; token verification now belongs to a yet-to-ship
 * `gefi-auth` Cloudflare Worker. Until that Worker lands and exposes
 * a Service-binding verifier, this suite has no fixture for "a valid
 * authenticated request" and is held as a single skipped placeholder.
 *
 * When `gefi-auth` ships, restore this file from git history at the
 * commit that removed Auth0, and rewrite the token-minting helper
 * (`signUserToken` / `signEdgeJwt`) to call the new Worker's signer.
 * The handler assertions themselves should not need to change.
 */

import { describe, it } from "vitest";

describe.skip("gefi-api integration (Auth0 path removed; awaiting gefi-auth Worker)", () => {
  it("placeholder — re-enable once the gefi-auth verifier ships", () => {
    // intentionally empty
  });
});
