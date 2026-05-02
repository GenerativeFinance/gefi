/**
 * gefi-api — public REST surface + jurisdiction router.
 *
 * Three deployment shapes, each with distinct behaviour:
 *
 *   1. **Public edge** — `api.gefi.io`, deployed via `--env prod`. Picks
 *      a region from `cf.country`, mints a short-lived HS256 JWT, and
 *      forwards over the matching Service binding (`REGIONAL_EU` /
 *      `REGIONAL_US`). If the binding for the chosen region is missing
 *      (e.g. mid-bootstrap) the request is handled locally as a fallback.
 *
 *   2. **Regional sibling** — `eu.api.gefi.io` / `us.api.gefi.io`,
 *      deployed via `--env eu` / `--env us`. These are reachable
 *      *publicly* (the routes are public so the edge can `fetch` them
 *      via Service binding without needing a private network hop), but
 *      every non-`/health` request MUST present a valid edge-signed JWT
 *      bound to this region. Direct browser/CLI calls are rejected 401.
 *
 *   3. **Dev / staging** — handled like the edge but with no regional
 *      bindings, so requests stay local. Useful for `wrangler dev`.
 *
 * Which shape we are is detected from `env.API_PUBLIC_URL`. We can't use
 * `env.WORKER_REGION` alone because the public edge is also pinned to a
 * region (its own `WORKER_REGION` is the fallback when geo lookup fails).
 */

import { applyHeaders } from "@gefi/shared-headers";
import { pickRegion, signInternalJwt, verifyInternalJwt } from "@gefi/shared-router";
import type { ApiEnv, Region } from "@gefi/shared-types";
import { healthHandler } from "./handlers/health.js";
import { formsPreflightHandler, formsSubmitHandler } from "./handlers/forms.js";
import { Router, type RouteContext } from "./router.js";

const REGIONAL_HOST_RE = /^https:\/\/(eu|us)\.api\./;

/** This deployment is one of the regional siblings (eu / us). */
function isRegionalSibling(env: ApiEnv): boolean {
  return REGIONAL_HOST_RE.test(env.API_PUBLIC_URL);
}

/** Paths that bypass the edge-JWT check (monitoring, identification). */
function isOpenPath(pathname: string): boolean {
  return pathname === "/health" || pathname === "/_health";
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
  .add("OPTIONS", "/v1/forms/:kind", formsPreflightHandler);

/**
 * Forward a request from the edge to a regional sibling via Service
 * binding. Returns the upstream Response on success, or `null` if the
 * binding for the target region isn't configured (caller should then
 * handle locally).
 *
 * The forwarded request is annotated with `X-Gefi-Edge-JWT` so the
 * regional Worker can prove the call came from the edge. The token is
 * scoped to `targetRegion` and expires in 60 s.
 */
async function forwardToRegion(
  request: Request,
  env: ApiEnv,
  targetRegion: Region,
): Promise<Response | null> {
  const binding =
    targetRegion === "eu" ? env.REGIONAL_EU : env.REGIONAL_US;
  if (!binding) return null;
  if (!env.INTERNAL_SIGNING_KEY) {
    console.error("[gefi-api] missing INTERNAL_SIGNING_KEY — cannot forward");
    return null;
  }

  const token = await signInternalJwt(targetRegion, env.INTERNAL_SIGNING_KEY);
  // Clone the request so we can mutate headers safely. Body is preserved.
  const forwarded = new Request(request, {
    headers: new Headers(request.headers),
  });
  forwarded.headers.set("X-Gefi-Edge-JWT", token);
  forwarded.headers.set("X-Gefi-Edge-Region", targetRegion);
  return binding.fetch(forwarded);
}

/**
 * If we're a regional sibling, every non-open path requires a valid
 * edge-JWT pinned to this region. Returns null if the request passes,
 * or a 401 Response if not.
 */
async function requireEdgeJwt(
  request: Request,
  env: ApiEnv,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (!isRegionalSibling(env)) return null;
  if (isOpenPath(url.pathname)) return null;

  const token = request.headers.get("X-Gefi-Edge-JWT");
  if (!token) {
    return Response.json(
      { ok: false, error: "edge_jwt_required" },
      { status: 401 },
    );
  }
  if (!env.INTERNAL_SIGNING_KEY) {
    console.error("[gefi-api] regional sibling missing INTERNAL_SIGNING_KEY");
    return Response.json(
      { ok: false, error: "regional_misconfigured" },
      { status: 500 },
    );
  }
  try {
    await verifyInternalJwt(token, env.INTERNAL_SIGNING_KEY, env.WORKER_REGION);
    return null;
  } catch (err) {
    console.warn("[gefi-api] edge JWT verification failed", err);
    return Response.json(
      { ok: false, error: "edge_jwt_invalid" },
      { status: 401 },
    );
  }
}

export default {
  async fetch(request: Request, env: ApiEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const country = (request.cf?.country as string | undefined) ?? null;
    const override = url.searchParams.get("region");
    const region = pickRegion(country, env.WORKER_REGION, override);

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
      // Fall through to local handling if the binding is missing
      // (mid-bootstrap or dev environment without regional siblings).
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
