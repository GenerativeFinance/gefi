import { describe, expect, it } from "vitest";
import { app } from "../index.js";
import { buildStubEnv } from "../test-helpers.js";

describe("GET /api/health", () => {
  it("returns ok with every service probed", async () => {
    const { env, bindings } = await buildStubEnv();
    const res = await app.request("/api/health", {}, env);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      status: string;
      environment: string;
      services: Record<string, { status: string }>;
    };
    expect(body.status).toBe("ok");
    expect(body.environment).toBe("dev");
    for (const key of [
      "d1",
      "sessions_kv",
      "rate_limits_kv",
      "r2_models",
      "r2_datasets_public",
      "r2_datasets_licensed",
      "r2_fed_updates",
      "r2_audit",
      "vectorize",
      "queue",
      "analytics",
      "durable_object",
    ]) {
      expect(body.services[key]?.status, `${key} should be ok`).toBe("ok");
    }
    expect(bindings.queue.sent.length).toBeGreaterThan(0);
    expect(bindings.analytics.points.length).toBeGreaterThan(0);
  });

  it("reports degraded when D1 throws", async () => {
    const { env } = await buildStubEnv();
    (env.DB as unknown as { prepare: () => unknown }).prepare = () => {
      throw new Error("d1 down");
    };
    const res = await app.request("/api/health", {}, env);
    expect(res.status).toBe(503);
    const body = (await res.json()) as {
      status: string;
      services: Record<string, { status: string }>;
    };
    expect(body.status).toBe("degraded");
    expect(body.services.d1!.status).toBe("degraded");
  });
});
