/**
 * Worker entrypoint.
 *
 * Default export wires Hono to `fetch`, plus the `scheduled` and `queue`
 * handlers Cloudflare invokes for cron triggers and queue consumers.
 */
import { Hono } from "hono";
import { renderHome } from "./html.js";
import type { Env, HonoVariables } from "./types.js";
import { authRoutes } from "./routes/auth.js";
import { healthHandler } from "./routes/health.js";
import { modelsRoutes } from "./routes/models.js";
import { detailRoutes, favoritesRoutes } from "./routes/detail.js";
import { scheduled } from "./scheduled.js";
import { Round } from "./durable-objects/Round.js";

export const app = new Hono<{ Bindings: Env; Variables: HonoVariables }>();

app.get("/", (c) => c.html(renderHome()));

app.get("/api/health", healthHandler);

// CORS for the public catalog + detail + favorites surface. The Jekyll site
// runs on a different origin (`:4000` in dev, the docs domain in prod) than
// the Worker (`:8787` / api.gefi.io), so the browser is in cross-origin
// mode for every fetch from a model page. Two things matter:
//
//   1. credentialed POSTs (favorites toggle, review submit, verify) need
//      `access-control-allow-credentials: true` AND a non-wildcard
//      `access-control-allow-origin` echoing the caller's Origin header.
//   2. preflight (OPTIONS) must list the verbs we actually use, plus the
//      `content-type` request header for JSON bodies.
//
// We intentionally echo the request Origin rather than maintain an env-
// configured allowlist for now — Phase 5 hardening can switch to an
// explicit list once the prod web origin is locked in.
const corsHeaders = async (
  c: { req: { header: (n: string) => string | undefined }; res: Response },
  next: () => Promise<void>,
) => {
  await next();
  const origin = c.req.header("origin");
  if (origin) {
    c.res.headers.set("access-control-allow-origin", origin);
    c.res.headers.set("access-control-allow-credentials", "true");
  } else {
    // Same-origin or non-browser caller — wildcard is safe (no credentials).
    c.res.headers.set("access-control-allow-origin", "*");
  }
  c.res.headers.set("access-control-allow-methods", "GET, POST, OPTIONS");
  c.res.headers.set("access-control-allow-headers", "content-type");
  c.res.headers.set("access-control-max-age", "600");
  c.res.headers.set("vary", "Origin");
};
app.use("/api/models", corsHeaders);
app.use("/api/models/*", corsHeaders);
app.options("/api/models", (c) => c.body(null, 204));
app.options("/api/models/*", (c) => c.body(null, 204));
// /api/favorites/* is hit cross-origin from the Jekyll site with credentials,
// so it goes through the same handler.
app.use("/api/favorites/*", corsHeaders);
app.options("/api/favorites/*", (c) => c.body(null, 204));

app.route("/api/auth", authRoutes());
// IMPORTANT: detail must mount BEFORE the catalog browse route — Hono walks
// routes in registration order, and we want `/api/models/:slug` to win over
// the wildcard catalog handler at the same prefix.
app.route("/api/models", detailRoutes());
app.route("/api/models", modelsRoutes());
app.route("/api/favorites", favoritesRoutes());

app.post("/api/subscribe", async (c) => {
  const body = await c.req.parseBody();
  const email = String(body.email ?? "");
  if (!email || !email.includes("@")) return c.json({ error: "invalid_email" }, 400);
  console.log("[subscribe stub] queued", {
    domain: email.split("@")[1] ?? "unknown",
    length: email.length,
  });
  return c.json({ ok: true });
});

export { Round };

export default {
  fetch: app.fetch,
  scheduled,
  async queue(_batch: MessageBatch<unknown>, env: Env): Promise<void> {
    console.log("[queue] received batch", { size: _batch.messages.length, env: env.ENVIRONMENT });
    for (const msg of _batch.messages) msg.ack();
  },
} satisfies ExportedHandler<Env>;
