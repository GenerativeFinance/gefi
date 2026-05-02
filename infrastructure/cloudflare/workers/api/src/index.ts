/**
 * gefi-api — public REST surface + jurisdiction router.
 *
 * Three deployment shapes, each with distinct behaviour:
 *
 *   1. **Public edge** — `api.gefi.io`, deployed via `--env prod`. Picks
 *      a region from the JWT's `jurisdiction` claim if present (so
 *      authenticated users always land on their pinned data plane),
 *      else from `cf.country`. Mints a short-lived HS256 internal JWT
 *      and forwards the request over the matching Service binding
 *      (`REGIONAL_EU` / `REGIONAL_US`). If the binding for the chosen
 *      region is missing (mid-bootstrap) the request is handled
 *      locally as a fallback.
 *
 *   2. **Regional sibling** — `eu.api.gefi.io` / `us.api.gefi.io`,
 *      deployed via `--env eu` / `--env us`. These are reachable
 *      *publicly* (the routes are public so the edge can `fetch` them
 *      via Service binding without needing a private network hop), but:
 *        - every non-`/health` request MUST present a valid edge-signed
 *          JWT bound to this region — direct browser/CLI calls 401.
 *        - if the user JWT's `jurisdiction` claim doesn't match
 *          `WORKER_REGION`, return 403. (Cross-region rejection.)
 *
 *   3. **Dev / staging** — handled like the edge but with no regional
 *      bindings, so requests stay local. Useful for `wrangler dev`.
 *
 * Auth on the edge vs regional:
 *   - The edge inspects the user JWT *unverified* via `peekJurisdiction`
 *     to choose a region for forwarding. The signature is verified by
 *     the regional sibling, so a forged or wrong-region token gets
 *     rejected at its destination.
 *   - The regional sibling runs `tryAuthenticate` for every request
 *     (after the edge-JWT gate); if a token is present it must verify,
 *     and `enforceCrossRegion` rejects mismatched jurisdictions before
 *     any handler runs.
 */

import { applyHeaders } from "@gefi/shared-headers";
import { pickRegion, signInternalJwt, verifyInternalJwt } from "@gefi/shared-router";
import { extractBearer, peekJurisdiction } from "@gefi/auth/verify";
import type { ApiEnv, Region } from "@gefi/shared-types";
import { enforceCrossRegion, tryAuthenticate } from "./middleware/auth.js";
import { healthHandler } from "./handlers/health.js";
import { formsPreflightHandler, formsSubmitHandler } from "./handlers/forms.js";
import { meHandler } from "./handlers/auth/me.js";
import { onboardHandler } from "./handlers/auth/onboard.js";
import {
  createApiKeyHandler,
  listApiKeysHandler,
  revokeApiKeyHandler,
} from "./handlers/auth/api-keys.js";
import { kycStartHandler } from "./handlers/kyc/start.js";
import { kycStatusHandler } from "./handlers/kyc/status.js";
import { kycWebhookHandler } from "./handlers/kyc/webhook.js";
import { Router, type RouteContext } from "./router.js";

const REGIONAL_HOST_RE = /^https:\/\/(eu|us)\.api\./;

function isRegionalSibling(env: ApiEnv): boolean {
  return REGIONAL_HOST_RE.test(env.API_PUBLIC_URL);
}

function isOpenPath(pathname: string): boolean {
  // Paths that bypass the edge-JWT check on regional siblings:
  // monitoring + the KYC provider webhook (provider can't carry an
  // edge JWT — it's authenticated by the provider's HMAC signature).
  return (
    pathname === "/health" ||
    pathname === "/_health" ||
    pathname.startsWith("/v1/kyc/webhook")
  );
}

const router = new Router()
  .get("/health", healthHandler)
  .get("/_health", healthHandler)
  .get("/", ({ env, region }) =>
    Response.json({
      service: "gefi-api",
      environment: env.ENVIRONMENT,
      region,
      docs: "https://docs.gefi.io",
    }),
  )
  .post("/v1/forms/:kind", formsSubmitHandler)
  .add("OPTIONS", "/v1/forms/:kind", formsPreflightHandler)
  // Auth surface
  .get("/v1/auth/me", meHandler)
  .post("/v1/auth/onboard", onboardHandler)
  .post("/v1/api-keys", createApiKeyHandler)
  .get("/v1/api-keys", listApiKeysHandler)
  .delete("/v1/api-keys/:id", revokeApiKeyHandler)
  // KYC
  .post("/v1/kyc/start", kycStartHandler)
  .get("/v1/kyc/status", kycStatusHandler)
  .post("/v1/kyc/webhook/:provider", kycWebhookHandler)
  .post("/v1/kyc/webhook", kycWebhookHandler);

async function forwardToRegion(
  request: Request,
  env: ApiEnv,
  targetRegion: Region,
): Promise<Response | null> {
  const binding = targetRegion === "eu" ? env.REGIONAL_EU : env.REGIONAL_US;
  if (!binding) return null;
  if (!env.INTERNAL_SIGNING_KEY) {
    console.error("[gefi-api] missing INTERNAL_SIGNING_KEY — cannot forward");
    return null;
  }
  const token = await signInternalJwt(targetRegion, env.INTERNAL_SIGNING_KEY);
  const forwarded = new Request(request, { headers: new Headers(request.headers) });
  forwarded.headers.set("X-Gefi-Edge-JWT", token);
  forwarded.headers.set("X-Gefi-Edge-Region", targetRegion);
  return binding.fetch(forwarded);
}

async function requireEdgeJwt(request: Request, env: ApiEnv): Promise<Response | null> {
  const url = new URL(request.url);
  if (!isRegionalSibling(env)) return null;
  if (isOpenPath(url.pathname)) return null;

  const token = request.headers.get("X-Gefi-Edge-JWT");
  if (!token) {
    return Response.json({ ok: false, error: "edge_jwt_required" }, { status: 401 });
  }
  if (!env.INTERNAL_SIGNING_KEY) {
    console.error("[gefi-api] regional sibling missing INTERNAL_SIGNING_KEY");
    return Response.json({ ok: false, error: "regional_misconfigured" }, { status: 500 });
  }
  try {
    await verifyInternalJwt(token, env.INTERNAL_SIGNING_KEY, env.WORKER_REGION);
    return null;
  } catch (err) {
    console.warn("[gefi-api] edge JWT verification failed", err);
    return Response.json({ ok: false, error: "edge_jwt_invalid" }, { status: 401 });
  }
}

export default {
  async fetch(request: Request, env: ApiEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const country = (request.cf?.country as string | undefined) ?? null;
    const override = url.searchParams.get("region");
    // Route based on the JWT's jurisdiction claim if present (more
    // reliable than IP geolocation), falling back to cf.country.
    const userToken = extractBearer(request.headers.get("Authorization"));
    const jurisdictionFromToken = userToken ? peekJurisdiction(userToken) : null;
    const region = pickRegion(country, env.WORKER_REGION, override ?? jurisdictionFromToken);

    // Regional siblings: gate on edge-JWT before doing anything else.
    const gate = await requireEdgeJwt(request, env);
    if (gate) return applyHeaders(gate, "api", env);

    // Public edge: forward to the chosen region if a binding exists.
    if (!isRegionalSibling(env) && region !== env.WORKER_REGION) {
      const forwarded = await forwardToRegion(request, env, region);
      if (forwarded) {
        return applyHeaders(forwarded, "api", env, {
          extra: {
            "X-Gefi-Region": region,
            "X-Gefi-Environment": env.ENVIRONMENT,
            "X-Gefi-Forwarded": "true",
          },
        });
      }
      // Fall through to local handling if the binding is missing.
    }

    // Verify user JWT (if present). Skip for the KYC webhook, which is
    // authenticated by the provider's HMAC signature.
    let auth: RouteContext["auth"] = null;
    if (!url.pathname.startsWith("/v1/kyc/webhook")) {
      const result = await tryAuthenticate(request, env);
      if (result.response) return applyHeaders(result.response, "api", env);
      auth = result.auth ?? null;
    }

    // Cross-region rejection runs before any handler — applies on
    // regional siblings only.
    const crossRegion = enforceCrossRegion({ env, auth });
    if (crossRegion) return applyHeaders(crossRegion, "api", env);

    const match = router.match(request.method, url);
    if (!match) {
      return applyHeaders(
        Response.json({ ok: false, error: "not_found", path: url.pathname }, { status: 404 }),
        "api",
        env,
      );
    }
    const [handler, params] = match;
    const rc: RouteContext = { request, env, ctx, region, country, params, auth };
    try {
      const response = await handler(rc);
      return applyHeaders(response, "api", env, {
        extra: {
          "X-Gefi-Region": region,
          "X-Gefi-Environment": env.ENVIRONMENT,
        },
      });
    } catch (err) {
      console.error("[gefi-api] handler threw", err);
      return applyHeaders(
        Response.json({ ok: false, error: "internal_error" }, { status: 500 }),
        "api",
        env,
      );
    }
  },
} satisfies ExportedHandler<ApiEnv>;
