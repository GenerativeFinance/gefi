/**
 * Internal-token auth middleware.
 *
 * `gefi-compliance` is reachable only via Service binding from `gefi-api`,
 * but the binding URL is technically a regular `fetch()` call — there's no
 * cryptographic guarantee a misconfigured route on `gefi-api` (or a future
 * leak of the binding) couldn't expose privileged endpoints. We require the
 * caller present `X-Gefi-Internal-Token: <secret>` matching
 * `COMPLIANCE_INTERNAL_TOKEN` for every non-`/health` request.
 *
 * In dev/staging the secret may be unset — in that mode the gate accepts
 * any request to keep `wrangler dev` ergonomic. In prod the bootstrap path
 * MUST set the secret; we reject all calls otherwise.
 */

import type { ComplianceEnv } from "@gefi/shared-types";

const PUBLIC_PATHS = new Set(["/health", "/_health"]);

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.has(pathname);
}

/** Returns null when authorised, or a Response to short-circuit with. */
export function requireInternalToken(request: Request, env: ComplianceEnv): Response | null {
  const url = new URL(request.url);
  if (isPublicPath(url.pathname)) return null;

  const provided = request.headers.get("X-Gefi-Internal-Token");
  const expected = env.COMPLIANCE_INTERNAL_TOKEN;

  if (!expected) {
    // Prod must always have it set; dev/staging skip the gate.
    if (env.ENVIRONMENT === "prod") {
      console.error("[gefi-compliance] prod is missing COMPLIANCE_INTERNAL_TOKEN");
      return Response.json(
        { ok: false, error: "compliance_misconfigured" },
        { status: 503 },
      );
    }
    return null;
  }

  if (!provided) {
    return Response.json(
      { ok: false, error: "internal_token_required" },
      { status: 401 },
    );
  }
  if (!constantTimeEqual(provided, expected)) {
    return Response.json(
      { ok: false, error: "internal_token_invalid" },
      { status: 401 },
    );
  }
  return null;
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
