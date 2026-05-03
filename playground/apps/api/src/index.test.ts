import { describe, expect, it } from "vitest";
import { app } from "./index.js";
import { buildStubEnv } from "./test-helpers.js";

describe("playground api router", () => {
  it("GET / renders the marketing homepage with brand tokens", async () => {
    const { env } = await buildStubEnv();
    const res = await app.request("/", {}, env);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("AI Financial Model Library");
    expect(html).toContain("Federated. Audited. Accountable.");
    expect(html).toContain("--color-brand: #6D5BFF;");
  });

  it("POST /api/subscribe accepts a valid email", async () => {
    const { env } = await buildStubEnv();
    const res = await app.request(
      "/api/subscribe",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "email=alice@example.com",
      },
      env,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("POST /api/subscribe rejects garbage", async () => {
    const { env } = await buildStubEnv();
    const res = await app.request(
      "/api/subscribe",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "email=not-an-email",
      },
      env,
    );
    expect(res.status).toBe(400);
  });

  it("unknown route returns 404", async () => {
    const { env } = await buildStubEnv();
    const res = await app.request("/nope", {}, env);
    expect(res.status).toBe(404);
  });

  it("OPTIONS /api/models responds with permissive CORS headers", async () => {
    const { env } = await buildStubEnv();
    const res = await app.request("/api/models", { method: "OPTIONS" }, env);
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    expect(res.headers.get("access-control-allow-methods")).toContain("GET");
  });

  it("OPTIONS /api/models/anything (subpath) also CORS-enabled", async () => {
    const { env } = await buildStubEnv();
    const res = await app.request("/api/models/foo", { method: "OPTIONS" }, env);
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });
});
