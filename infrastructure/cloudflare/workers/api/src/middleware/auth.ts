/**
 * Auth middleware for `gefi-api`.
 *
 * Two phases:
 *
 *   1. **`tryAuthenticate(request, env)`** — runs once per request from
 *      `index.ts`. If `Authorization: Bearer …` is present:
 *        a. Verify the RS256 signature against the Auth0 JWKS (KV-cached).
 *        b. Validate `iss` / `aud` / `exp`.
 *        c. Flatten the namespaced GeFi custom claims.
 *      Returns either `{auth}` (with a `GefiAuthClaims` if the user has
 *      onboarded, or a `LooseAuthClaims` if not) or `{response}` (a 401
 *      with a stable error code) on any verification failure.
 *      No header → `{auth: null}` and the handler decides whether it
 *      cares.
 *
 *   2. **`requireAuth(rc, ...permissions)`** — handler-level gate.
 *      Returns the verified claims or a 401/403 Response. Verifies:
 *        - `rc.auth` is fully hydrated (GeFi custom claims present).
 *        - The user has every requested permission.
 *      The cross-region rejection is enforced separately in `index.ts`
 *      *before* a handler runs, so by the time this is called the
 *      jurisdiction has already been confirmed.
 *
 * `enforceCrossRegion(rc)` is the cross-region rejection. It returns a
 * 403 Response if the request reached a regional sibling on the wrong
 * side of the boundary, or `null` to continue.
 */

import type { Action, GefiAuthClaims, Resource } from "@gefi/auth/types";
import { canPerform } from "@gefi/auth/rbac";
import { extractBearer, verifyAuth0TokenLoose, type LooseAuthClaims } from "@gefi/auth/verify";
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
 * Verify the bearer token if present; never reject for missing tokens
 * (handlers decide whether they care). Returns `{response}` on a present-
 * but-invalid token so the API never accepts a partially-authenticated
 * caller into a handler.
 */
export async function tryAuthenticate(request: Request, env: ApiEnv): Promise<AuthResult> {
  const token = extractBearer(request.headers.get("Authorization"));
  if (!token) return { auth: null };
  if (!env.AUTH0_DOMAIN || !env.AUTH0_AUDIENCE) {
    console.error("[gefi-api] auth0 env vars missing — refusing to verify");
    return {
      response: Response.json(
        { ok: false, error: "auth_misconfigured" },
        { status: 500 },
      ),
    };
  }
  try {
    const claims = await verifyAuth0TokenLoose(token, {
      auth0Domain: env.AUTH0_DOMAIN,
      audience: env.AUTH0_AUDIENCE,
      cache: env.CACHE,
    });
    return { auth: claims };
  } catch (err) {
    const code = err instanceof Error ? err.message : "auth_token_invalid";
    return {
      response: Response.json(
        { ok: false, error: code },
        { status: 401 },
      ),
    };
  }
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
