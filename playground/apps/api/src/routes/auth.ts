/**
 * Magic-link auth routes.
 *
 *   POST /api/auth/request   { email }              → 204
 *   GET  /api/auth/verify?token=…                   → 302 / + sets cookie
 *   POST /api/auth/logout                           → 204 + clears cookie
 *
 * Tokens live in KV (`SESSIONS`) at key `magic:<token>` with a 15-min TTL.
 * On verify the token is single-use (deleted before the JWT is issued).
 * Rate limit: 3 requests per email per 10 minutes via KV (`RATE_LIMITS`).
 */
import { Hono } from "hono";
import type { Env, HonoVariables } from "../types.js";
import { signJwt } from "../lib/jwt.js";
import { randomToken, uuid } from "../lib/random.js";
import { checkRateLimit } from "../lib/rate-limit.js";
import { ResendEmailSender, magicLinkEmailHtml, type EmailSender } from "../lib/email.js";
import { buildSessionCookie, clearSessionCookie } from "../lib/cookie.js";

const MAGIC_PREFIX = "magic:";
const MAGIC_TTL_SECONDS = 15 * 60;
const SESSION_TTL_SECONDS = 24 * 60 * 60;
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface MagicTokenRecord {
  email: string;
  exp: number;
}

export interface AuthDeps {
  /** Override email sender in tests. */
  emailSender?: EmailSender;
}

export function authRoutes(deps: AuthDeps = {}) {
  const app = new Hono<{ Bindings: Env; Variables: HonoVariables }>();

  app.post("/request", async (c) => {
    const body = await c.req
      .json<{ email?: unknown }>()
      .catch(() => ({}) as { email?: unknown });
    const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!EMAIL_RE.test(emailRaw)) {
      return c.json({ error: "invalid_email" }, 400);
    }

    const rl = await checkRateLimit(
      c.env.RATE_LIMITS,
      `auth:request:${emailRaw}`,
      RATE_LIMIT,
      RATE_WINDOW_MS,
    );
    if (!rl.allowed) {
      return c.json(
        { error: "rate_limited", retry_after_ms: rl.resetMs },
        429,
        { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) },
      );
    }

    const token = randomToken(32);
    const record: MagicTokenRecord = {
      email: emailRaw,
      exp: Math.floor(Date.now() / 1000) + MAGIC_TTL_SECONDS,
    };
    await c.env.SESSIONS.put(MAGIC_PREFIX + token, JSON.stringify(record), {
      expirationTtl: MAGIC_TTL_SECONDS,
    });

    const verifyUrl = `${c.env.APP_BASE_URL}/api/auth/verify?token=${encodeURIComponent(token)}`;
    const sender =
      deps.emailSender ??
      new ResendEmailSender(c.env.RESEND_API_KEY, c.env.ENVIRONMENT === "dev");
    await sender.send({
      from: c.env.EMAIL_FROM,
      to: emailRaw,
      subject: "Sign in to GeFi Playground",
      html: magicLinkEmailHtml(verifyUrl, MAGIC_TTL_SECONDS / 60),
    });

    console.log("[auth] magic link issued", {
      domain: emailRaw.split("@")[1],
      env: c.env.ENVIRONMENT,
    });
    return c.body(null, 204);
  });

  app.get("/verify", async (c) => {
    const token = c.req.query("token");
    if (!token) return c.json({ error: "missing_token" }, 400);

    const key = MAGIC_PREFIX + token;
    const raw = await c.env.SESSIONS.get(key);
    if (!raw) return c.json({ error: "invalid_or_expired_token" }, 400);
    await c.env.SESSIONS.delete(key); // single-use

    let record: MagicTokenRecord;
    try {
      record = JSON.parse(raw) as MagicTokenRecord;
    } catch {
      return c.json({ error: "invalid_token_payload" }, 400);
    }
    if (record.exp <= Math.floor(Date.now() / 1000)) {
      return c.json({ error: "invalid_or_expired_token" }, 400);
    }

    const user = await getOrCreateUser(c.env.DB, record.email);
    const jwt = await signJwt(
      { sub: user.id, email: user.email },
      c.env.JWT_SK,
      SESSION_TTL_SECONDS,
    );

    const secure = c.env.ENVIRONMENT !== "dev";
    c.header(
      "Set-Cookie",
      buildSessionCookie(jwt, { maxAgeSeconds: SESSION_TTL_SECONDS, secure }),
    );
    return c.redirect("/", 302);
  });

  app.post("/logout", (c) => {
    const secure = c.env.ENVIRONMENT !== "dev";
    c.header("Set-Cookie", clearSessionCookie(secure));
    return c.body(null, 204);
  });

  return app;
}

async function getOrCreateUser(
  db: D1Database,
  email: string,
): Promise<{ id: string; email: string }> {
  const now = Math.floor(Date.now() / 1000);
  const existing = await db
    .prepare("SELECT id, email FROM users WHERE email = ?")
    .bind(email)
    .first<{ id: string; email: string }>();
  if (existing) {
    await db
      .prepare("UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?")
      .bind(now, now, existing.id)
      .run();
    return existing;
  }
  const id = uuid();
  await db
    .prepare(
      "INSERT INTO users (id, email, created_at, updated_at, last_login_at) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(id, email, now, now, now)
    .run();
  return { id, email };
}
