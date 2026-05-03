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
import { scheduled } from "./scheduled.js";
import { Round } from "./durable-objects/Round.js";

export const app = new Hono<{ Bindings: Env; Variables: HonoVariables }>();

app.get("/", (c) => c.html(renderHome()));

app.get("/api/health", healthHandler);

// Permissive CORS for the public catalog so the Jekyll frontend (different
// origin in dev/prod — :4000 vs :8787) can hit /api/models from the browser.
// Mounted BEFORE the route so the middleware wraps the handler regardless of
// Hono's internal matching order. Auth routes remain same-origin via the
// cookie attributes and intentionally skip CORS.
const corsHeaders = async (c: { res: Response }, next: () => Promise<void>) => {
  await next();
  c.res.headers.set("access-control-allow-origin", "*");
  c.res.headers.set("access-control-allow-methods", "GET, OPTIONS");
  c.res.headers.set("vary", "Origin");
};
app.use("/api/models", corsHeaders);
app.use("/api/models/*", corsHeaders);
app.options("/api/models", (c) => c.body(null, 204));
app.options("/api/models/*", (c) => c.body(null, 204));

app.route("/api/auth", authRoutes());
app.route("/api/models", modelsRoutes());

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
