/**
 * Auth middleware for `gefi-api` — STUB pending the `gefi-auth` Worker.
 *
 * GeFi pivoted off Auth0 in May 2026. The RS256 / JWKS verifier that
 * used to live in `@gefi/auth` was removed; token verification is now
 * the responsibility of a dedicated `gefi-auth` Cloudflare Worker
 * (D1 + KV + Workers crypto + GitHub OAuth + WebAuthn) which has not
 * shipped yet.
 *
 * Until that lands, `tryAuthenticate` answers in three ways:
 *
 *   - No `Authorization` header        → `{auth: null}` (handlers
 *                                         that don't require auth
 *                                         continue, gated handlers
 *                                         return 401 via `requireAuth`).
 *   - `Authorization: Bearer …` set    → 503 `auth_unavailable`
 *                                         (no verifier wired up).
 *
 * `requireAuth`, `requireLooseAuth`, and `enforceCrossRegion` keep
 * their original shape so the dozens of call-sites compile unchanged.
 * Once `gefi-auth` ships, swap `tryAuthenticate` to call its verifier
 * via a Service binding — the rest of the file is untouched.
 */

import type { Action, GefiAuthClaims, Resource } from "@gefi/auth/types";
import { canPerform } from "@gefi/auth/rbac";
import { extractBearer, type LooseAuthClaims } from "@gefi/auth/verify";
import type { ApiEnv } from "@gefi/shared-types";
import type { RouteContext } from "../router.js";

const REGIONAL_HOST_RE = /^https:\/\/(eu|us)\.api\./;

function isRegionalSibling(env: ApiEnv): boolean {
  return REGIONAL_HOST_RE.test(env.API_PUBLIC_URL);
}

/** Result discriminator for `tryAuthenticate`. */
export type AuthResult =
  | { auth: GefiAuthClaims | LooseAuthClaims | null; response?: undefined }
  | { auth?: undefined; response: Response };

/**
 * Returns `{auth: null}` if no bearer token is present (the request
 * proceeds; gated handlers will 401). Returns a 503 `auth_unavailable`
 * Response if a token IS present, because the verifier is not wired up
 * yet (see file header).
 */
export async function tryAuthenticate(request: Request, _env: ApiEnv): Promise<AuthResult> {
  const token = extractBearer(request.headers.get("Authorization"));
  if (!token) return { auth: null };
  return {
    response: Response.json(
      { ok: false, error: "auth_unavailable", detail: "gefi-auth Worker not yet deployed" },
      { status: 503 },
    ),
  };
}

/**
 * Cross-region rejection. Only runs on regional siblings; on the public
 * edge it's a no-op (the edge forwards based on the JWT's jurisdiction
 * or `cf.country` and lets the regional sibling do the final check).
 */
export function enforceCrossRegion(rc: Pick<RouteContext, "env" | "auth">): Response | null {
  if (!isRegionalSibling(rc.env)) return null;
  if (!rc.auth || !rc.auth.jurisdiction) return null;
  if (rc.auth.jurisdiction !== rc.env.WORKER_REGION) {
    return Response.json(
      {
        ok: false,
        error: "cross_region_denied",
        detail: `token jurisdiction=${rc.auth.jurisdiction} but worker region=${rc.env.WORKER_REGION}`,
      },
      { status: 403 },
    );
  }
  return null;
}

/** Handler-level: assert the user is fully onboarded with the given permissions. */
export type RequireAuthResult =
  | { claims: GefiAuthClaims; response?: undefined }
  | { claims?: undefined; response: Response };

export function requireAuth(
  rc: Pick<RouteContext, "auth">,
  ...permissions: Array<[Action, Resource]>
): RequireAuthResult {
  if (!rc.auth) {
    return {
      response: Response.json({ ok: false, error: "auth_required" }, { status: 401 }),
    };
  }
  if (!rc.auth.tenant_id || !rc.auth.jurisdiction || !rc.auth.entity_type || !rc.auth.roles) {
    return {
      response: Response.json(
        { ok: false, error: "auth_onboarding_incomplete" },
        { status: 403 },
      ),
    };
  }
  const claims = rc.auth as GefiAuthClaims;
  for (const [action, resource] of permissions) {
    if (!canPerform(claims, action, resource)) {
      return {
        response: Response.json(
          { ok: false, error: "permission_denied", action, resource },
          { status: 403 },
        ),
      };
    }
  }
  return { claims };
}

/**
 * Soft-auth used by the onboarding handler only. Requires a verified
 * token but does NOT require GeFi custom claims (the user wouldn't have
 * any yet — they're calling onboard precisely to get them).
 */
export function requireLooseAuth(rc: Pick<RouteContext, "auth">):
  | { claims: LooseAuthClaims; response?: undefined }
  | { claims?: undefined; response: Response } {
  if (!rc.auth) {
    return {
      response: Response.json({ ok: false, error: "auth_required" }, { status: 401 }),
    };
  }
  return { claims: rc.auth };
}
