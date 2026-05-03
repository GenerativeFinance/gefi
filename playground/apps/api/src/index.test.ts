import { describe, expect, it } from "vitest";
import app from "./index.js";

describe("playground api", () => {
  it("GET / returns HTML with brand tokens", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("AI Financial Model Library");
    expect(html).toContain("Federated. Audited. Accountable.");
    expect(html).toContain("--color-brand: #6D5BFF;");
  });

  it("GET /health returns json heartbeat", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, service: "gefi-playground-api", phase: 0 });
  });

  it("POST /api/subscribe accepts a valid email", async () => {
    const res = await app.request("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "alice@example.com" }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; message: string };
    expect(body.ok).toBe(true);
    expect(body.message).toMatch(/Thanks/i);
  });

  it("POST /api/subscribe rejects garbage", async () => {
    const res = await app.request("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email" }),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(false);
  });

  it("POST /api/subscribe rejects malformed json", async () => {
    const res = await app.request("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });
    expect(res.status).toBe(400);
  });

  it("unknown route returns 404 json", async () => {
    const res = await app.request("/nope");
    expect(res.status).toBe(404);
  });
});
