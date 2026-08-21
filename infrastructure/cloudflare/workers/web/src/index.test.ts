import { describe, expect, it } from "vitest";
import worker from "./index.js";
import type { WebEnv } from "@gefi/shared-types";

const env: WebEnv = {
  ENVIRONMENT: "prod",
  WORKER_REGION: "us",
  API_PUBLIC_URL: "https://api.gefi.io",
  SITE_PUBLIC_URL: "https://gefi.io",
};

const ctx = {
  waitUntil: () => undefined,
  passThroughOnException: () => undefined,
  props: {},
} as unknown as ExecutionContext;

describe("gefi-web Worker", () => {
  it("responds to /health with worker metadata and strict headers", async () => {
    const res = await worker.fetch(new Request("https://gefi.io/health"), env, ctx);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; worker: string };
    expect(body.ok).toBe(true);
    expect(body.worker).toBe("gefi-web");
    expect(res.headers.get("Strict-Transport-Security")).toMatch(/max-age=63072000/);
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("301-redirects www.gefi.io to gefi.io", async () => {
    const res = await worker.fetch(
      new Request("https://www.gefi.io/pricing/"),
      env,
      ctx,
    );
    expect(res.status).toBe(301);
    expect(res.headers.get("Location")).toBe("https://gefi.io/pricing/");
  });
});
