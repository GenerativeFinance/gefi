/**
 * gefi-api — public REST surface + jurisdiction router.
 *
 * Behaviour:
 *   - On `api.gefi.io` (the public edge): pick a region from cf.country,
 *     mint an internal HS256 JWT, and forward to the regional sibling via
 *     a service binding. Falls back to handling the request locally if
 *     the chosen region's binding isn't configured.
 *   - On `eu.api.gefi.io` / `us.api.gefi.io` (regional siblings): the
 *     `WORKER_REGION` env var pins the region; the router code recognises
 *     it as the local region and handles the request directly.
 *
 * The split is enforced by which Wrangler environment was deployed — see
 * `wrangler.jsonc`.
 */

import { applyHeaders } from "@gefi/shared-headers";
import { pickRegion, signInternalJwt } from "@gefi/shared-router";
import type { ApiEnv } from "@gefi/shared-types";
import { healthHandler } from "./handlers/health.js";
import { formsPreflightHandler, formsSubmitHandler } from "./handlers/forms.js";
import { Router, type RouteContext } from "./router.js";

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
  .add("OPTIONS", "/v1/forms/:kind", formsPreflightHandler);

/**
 * Decide whether this Worker handles the request locally or forwards it to
 * a regional sibling. The "edge" deployment (api.gefi.io) forwards;
 * regional deployments (eu.api.gefi.io, us.api.gefi.io) handle locally.
 */
function shouldHandleLocally(env: ApiEnv, targetRegion: ApiEnv["WORKER_REGION"]): boolean {
  // Regional Workers always handle locally — they ARE the destination.
  if (env.API_PUBLIC_URL.startsWith(`https://${targetRegion}.api.`)) return true;
  // Otherwise (the edge), only handle locally if the chosen region matches
  // the edge's own pinned region (cheap path) or no service binding exists
  // for the chosen region.
  return env.WORKER_REGION === targetRegion;
}

async function forwardToRegion(
  request: Request,
  env: ApiEnv,
  targetRegion: ApiEnv["WORKER_REGION"],
): Promise<Response | null> {
  // For Task #2 we have the JWT helper and the routing decision wired up
  // but no service-binding glue yet — that lands once the EU/US deployments
  // are real Workers in Cloudflare. Returning null tells the caller to
  // handle locally.
  //
  // The JWT mint stays here so the helper is exercised in dev and the
  // surface-area is committed to the build.
  try {
    const token = await signInternalJwt(targetRegion, env.INTERNAL_SIGNING_KEY);
    request.headers.set("X-Gefi-Edge-JWT", token);
  } catch {
    // No signing key configured — fall back to local handling.
  }
  return null;
}

export default {
  async fetch(request: Request, env: ApiEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const country = (request.cf?.country as string | undefined) ?? null;
    const override = url.searchParams.get("region");
    const region = pickRegion(country, env.WORKER_REGION, override);

    // Forwarding bypass for now (see forwardToRegion comment).
    if (!shouldHandleLocally(env, region)) {
      const forwarded = await forwardToRegion(request, env, region);
      if (forwarded) return applyHeaders(forwarded, "api", env);
    }

    const match = router.match(request.method, url);
    if (!match) {
      return applyHeaders(
        Response.json({ ok: false, error: "not_found", path: url.pathname }, { status: 404 }),
        "api",
        env,
      );
    }
    const [handler, params] = match;
    const rc: RouteContext = { request, env, ctx, region, country, params };
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
