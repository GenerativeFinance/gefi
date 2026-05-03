/**
 * GeFi Playground API Worker (Phase 0).
 *
 * Surface:
 *   GET  /          -> Worker-rendered placeholder homepage (uses brand tokens).
 *   GET  /health    -> JSON heartbeat.
 *   POST /api/subscribe -> stubbed subscribe endpoint (Phase 1 wires real storage).
 */
import { Hono } from "hono";
import { cors } from "hono/cors";
import { isValidEmail, type SubscribeResponse } from "@gefi-playground/schemas";
import { renderHome } from "./html.js";

type Env = Record<string, never>;

const app = new Hono<{ Bindings: Env }>();

app.use(
  "/api/*",
  cors({
    origin: (origin) => origin ?? "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Accept"],
    maxAge: 600,
  }),
);

app.get("/", (c) => c.html(renderHome()));

app.get("/health", (c) =>
  c.json({ ok: true, service: "gefi-playground-api", phase: 0 }),
);

app.post("/api/subscribe", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json<SubscribeResponse>(
      { ok: false, message: "Invalid JSON body." },
      400,
    );
  }
  const email = (body as { email?: unknown })?.email;
  if (!isValidEmail(email)) {
    return c.json<SubscribeResponse>(
      { ok: false, message: "Please provide a valid email address." },
      400,
    );
  }
  // Phase 1 will persist this to D1 + enqueue notification. Don't log raw
  // PII — record only the domain so the stub is debuggable without leaking emails.
  const domain = email.split("@")[1] ?? "unknown";
  console.log("[subscribe stub] queued", { domain, length: email.length });
  return c.json<SubscribeResponse>({
    ok: true,
    message: "Thanks — we'll be in touch shortly.",
  });
});

app.notFound((c) => c.json({ ok: false, message: "Not found" }, 404));

export default app;
