/**
 * gefi-web — edge headers + redirects in front of the apex domain.
 *
 * Two deployment modes:
 *   1. **Header proxy (today):** `ASSETS` is unset. The Worker fetches the
 *      upstream origin (GitHub Pages, accessed via Cloudflare's origin
 *      transform) and re-emits the response with the strict header set.
 *   2. **Pages bound (future):** when we migrate the marketing site to
 *      Cloudflare Pages, the Pages project's `[ASSETS]` binding will be
 *      mounted here. The Worker becomes the canonical front door.
 *
 * Either way the response a browser sees is identical — same headers, same
 * redirects, same /health endpoint.
 */

import { applyHeaders } from "@gefi/shared-headers";
import type { WebEnv } from "@gefi/shared-types";

export default {
  async fetch(request: Request, env: WebEnv): Promise<Response> {
    const url = new URL(request.url);

    // Health check, never goes to origin.
    if (url.pathname === "/_health" || url.pathname === "/health") {
      return applyHeaders(
        Response.json({
          ok: true,
          worker: "gefi-web",
          environment: env.ENVIRONMENT,
          region: env.WORKER_REGION,
        }),
        "api",
        env,
      );
    }

    // Canonical-host redirect: www.gefi.io -> gefi.io. Apex is the marketing
    // surface; www exists only as a courtesy and 301s.
    if (url.hostname === "www.gefi.io") {
      const target = new URL(url.toString());
      target.hostname = "gefi.io";
      return applyHeaders(
        Response.redirect(target.toString(), 301),
        "web",
        env,
      );
    }

    // Fetch the underlying asset. Prefer the Pages binding when present;
    // otherwise fall through to the upstream origin (configured via a
    // Cloudflare Origin Rule to point at GitHub Pages).
    const upstream = env.ASSETS
      ? await env.ASSETS.fetch(request)
      : await fetch(request);

    return applyHeaders(upstream, "web", env);
  },
} satisfies ExportedHandler<WebEnv>;
