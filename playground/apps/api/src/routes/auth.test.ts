import { describe, expect, it } from "vitest";
import { Hono } from "hono";
import { authRoutes } from "./auth.js";
import { requireAuth } from "../middleware/auth.js";
import { buildStubEnv, CapturingEmailSender } from "../test-helpers.js";
import type { Env, HonoVariables } from "../types.js";

function makeApp(sender: CapturingEmailSender) {
  const app = new Hono<{ Bindings: Env; Variables: HonoVariables }>();
  app.route("/api/auth", authRoutes({ emailSender: sender }));
  app.get("/api/me", requireAuth, (c) => c.json({ user: c.get("user") }));
  return app;
}

describe("magic-link auth", () => {
  it("rejects invalid email shapes", async () => {
    const { env } = await buildStubEnv();
    const sender = new CapturingEmailSender();
    const app = makeApp(sender);
    const res = await app.request(
      "/api/auth/request",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "garbage" }),
      },
      env,
    );
    expect(res.status).toBe(400);
    expect(sender.sent).toHaveLength(0);
  });

  it("issues a magic link, verifies it, sets a session cookie, and authorises /api/me", async () => {
    const { env, bindings } = await buildStubEnv();
    const sender = new CapturingEmailSender();
    const app = makeApp(sender);

    const reqRes = await app.request(
      "/api/auth/request",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "alice@example.com" }),
      },
      env,
    );
    expect(reqRes.status).toBe(204);
    expect(sender.sent).toHaveLength(1);
    expect(sender.sent[0]!.to).toBe("alice@example.com");

    // Pull the token straight from the stub KV — same data the email contains.
    const tokenKey = [...bindings.sessions.store.keys()].find((k) => k.startsWith("magic:"));
    expect(tokenKey).toBeDefined();
    const token = tokenKey!.slice("magic:".length);

    const verifyRes = await app.request(
      `/api/auth/verify?token=${encodeURIComponent(token)}`,
      {},
      env,
    );
    expect(verifyRes.status).toBe(302);
    expect(verifyRes.headers.get("location")).toBe("/");
    const cookie = verifyRes.headers.get("set-cookie");
    expect(cookie).toMatch(/^gefi_session=/);
    expect(cookie).toMatch(/HttpOnly/);
    expect(cookie).toMatch(/SameSite=Lax/);

    // Single-use: the token is gone from KV.
    expect(bindings.sessions.store.has(tokenKey!)).toBe(false);

    // The user landed in the DB.
    const userIds = Object.keys(bindings.db.users);
    expect(userIds).toHaveLength(1);
    expect(bindings.db.users[userIds[0]!]!.email).toBe("alice@example.com");

    // requireAuth sees the cookie.
    const sessionValue = cookie!.match(/gefi_session=([^;]+)/)![1];
    const meRes = await app.request(
      "/api/me",
      { headers: { cookie: `gefi_session=${sessionValue}` } },
      env,
    );
    expect(meRes.status).toBe(200);
    const me = (await meRes.json()) as { user: { email: string } };
    expect(me.user.email).toBe("alice@example.com");
  });

  it("rejects a re-used magic-link token", async () => {
    const { env, bindings } = await buildStubEnv();
    const sender = new CapturingEmailSender();
    const app = makeApp(sender);
    await app.request(
      "/api/auth/request",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "bob@example.com" }),
      },
      env,
    );
    const token = [...bindings.sessions.store.keys()][0]!.slice("magic:".length);
    const first = await app.request(`/api/auth/verify?token=${token}`, {}, env);
    expect(first.status).toBe(302);
    const second = await app.request(`/api/auth/verify?token=${token}`, {}, env);
    expect(second.status).toBe(400);
  });

  it("rate-limits to 3 requests per email per window", async () => {
    const { env } = await buildStubEnv();
    const sender = new CapturingEmailSender();
    const app = makeApp(sender);
    const body = JSON.stringify({ email: "spammer@example.com" });
    const headers = { "Content-Type": "application/json" };
    for (let i = 0; i < 3; i++) {
      const r = await app.request("/api/auth/request", { method: "POST", headers, body }, env);
      expect(r.status).toBe(204);
    }
    const blocked = await app.request("/api/auth/request", { method: "POST", headers, body }, env);
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("retry-after")).toBeTruthy();
  });

  it("logout clears the session cookie", async () => {
    const { env } = await buildStubEnv();
    const sender = new CapturingEmailSender();
    const app = makeApp(sender);
    const res = await app.request("/api/auth/logout", { method: "POST" }, env);
    expect(res.status).toBe(204);
    const cookie = res.headers.get("set-cookie");
    expect(cookie).toMatch(/^gefi_session=;/);
    expect(cookie).toMatch(/Max-Age=0/);
  });

  it("requireAuth rejects requests with no cookie", async () => {
    const { env } = await buildStubEnv();
    const app = makeApp(new CapturingEmailSender());
    const res = await app.request("/api/me", {}, env);
    expect(res.status).toBe(401);
  });
});
