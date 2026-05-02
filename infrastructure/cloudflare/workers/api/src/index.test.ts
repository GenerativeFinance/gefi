import { describe, expect, it } from "vitest";
import worker from "./index.js";
import { signInternalJwt } from "@gefi/shared-router";
import type { ApiEnv } from "@gefi/shared-types";
import { Router } from "./router.js";

describe("Router", () => {
  it("matches static paths", () => {
    const r = new Router().get("/health", () => new Response("ok"));
    const m = r.match("GET", new URL("https://x/health"));
    expect(m).not.toBeNull();
    expect(m![1]).toEqual({});
  });

  it("matches parameterised paths and decodes URL params", () => {
    const r = new Router().post("/v1/forms/:kind", () => new Response("ok"));
    const m = r.match("POST", new URL("https://x/v1/forms/contact"));
    expect(m).not.toBeNull();
    expect(m![1]).toEqual({ kind: "contact" });
  });

  it("rejects path mismatch", () => {
    const r = new Router().get("/health", () => new Response("ok"));
    expect(r.match("GET", new URL("https://x/elsewhere"))).toBeNull();
  });

  it("rejects method mismatch", () => {
    const r = new Router().get("/health", () => new Response("ok"));
    expect(r.match("POST", new URL("https://x/health"))).toBeNull();
  });

  it("returns the first registered match when patterns overlap", async () => {
    const r = new Router()
      .get("/v1/foo/:id", () => new Response("first"))
      .get("/v1/foo/:id", () => new Response("second"));
    const m = r.match("GET", new URL("https://x/v1/foo/42"));
    expect(m).not.toBeNull();
    const res = await m![0]({} as never);
    expect(await res.text()).toBe("first");
  });
});

const SECRET = "test-internal-signing-key-32-chars-minimum-please-1234";
const ctx = {
  waitUntil: () => undefined,
  passThroughOnException: () => undefined,
  props: {},
} as unknown as ExecutionContext;

function regionalEnv(): ApiEnv {
  return {
    ENVIRONMENT: "prod",
    WORKER_REGION: "eu",
    API_PUBLIC_URL: "https://eu.api.gefi.io",
    SITE_PUBLIC_URL: "https://gefi.io",
    INTERNAL_SIGNING_KEY: SECRET,
    DB: { prepare: () => ({ first: async () => null }) } as unknown as D1Database,
    ARTIFACTS: { head: async () => null } as unknown as R2Bucket,
    CACHE: { list: async () => ({ keys: [], list_complete: true }) } as unknown as KVNamespace,
    VECTORS: { describe: async () => ({}) } as unknown as VectorizeIndex,
    COMPLIANCE: { fetch: async () => new Response("ok", { status: 200 }) } as unknown as Fetcher,
  };
}

describe("Regional sibling JWT gate", () => {
  it("rejects a non-health request with no edge JWT", async () => {
    const env = regionalEnv();
    const res = await worker.fetch(
      new Request("https://eu.api.gefi.io/", { method: "GET" }),
      env,
      ctx,
    );
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("edge_jwt_required");
  });

  it("rejects a non-health request with an invalid edge JWT", async () => {
    const env = regionalEnv();
    const res = await worker.fetch(
      new Request("https://eu.api.gefi.io/", {
        headers: { "X-Gefi-Edge-JWT": "totally.bogus.jwt" },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("edge_jwt_invalid");
  });

  it("rejects a JWT signed for a different region", async () => {
    const env = regionalEnv();
    const wrongRegionToken = await signInternalJwt("us", SECRET);
    const res = await worker.fetch(
      new Request("https://eu.api.gefi.io/", {
        headers: { "X-Gefi-Edge-JWT": wrongRegionToken },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(401);
  });

  it("accepts a valid JWT signed for this region", async () => {
    const env = regionalEnv();
    const token = await signInternalJwt("eu", SECRET);
    const res = await worker.fetch(
      new Request("https://eu.api.gefi.io/", {
        headers: { "X-Gefi-Edge-JWT": token },
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { service: string; region: string };
    expect(body.service).toBe("gefi-api");
    expect(body.region).toBe("eu");
  });

  it("lets /health through without any JWT (monitoring)", async () => {
    const env = regionalEnv();
    const res = await worker.fetch(
      new Request("https://eu.api.gefi.io/health"),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
  });
});

describe("Public edge forwarding", () => {
  function edgeEnv(opts: { withRegionalEU?: boolean } = {}): ApiEnv {
    const base = regionalEnv();
    const captured: { token?: string | null; targetHost?: string } = {};
    const env: ApiEnv = {
      ...base,
      WORKER_REGION: "us",
      API_PUBLIC_URL: "https://api.gefi.io",
    };
    if (opts.withRegionalEU) {
      env.REGIONAL_EU = {
        async fetch(req: Request) {
          captured.token = req.headers.get("X-Gefi-Edge-JWT");
          captured.targetHost = new URL(req.url).host;
          return Response.json({ forwarded: true, host: captured.targetHost }, { status: 200 });
        },
      } as unknown as Fetcher;
    }
    (env as unknown as { _captured: typeof captured })._captured = captured;
    return env;
  }

  it("forwards an EU-bound request over REGIONAL_EU with a signed JWT", async () => {
    const env = edgeEnv({ withRegionalEU: true });
    // Country override forces the EU branch without needing real cf.country.
    const res = await worker.fetch(
      new Request("https://api.gefi.io/?region=eu"),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("X-Gefi-Forwarded")).toBe("true");
    expect(res.headers.get("X-Gefi-Region")).toBe("eu");
    const captured = (env as unknown as { _captured: { token?: string | null } })._captured;
    expect(typeof captured.token).toBe("string");
    expect(captured.token!.split(".")).toHaveLength(3);
  });

  it("falls back to local handling when the regional binding is missing", async () => {
    const env = edgeEnv({ withRegionalEU: false });
    const res = await worker.fetch(
      new Request("https://api.gefi.io/?region=eu"),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("X-Gefi-Forwarded")).toBeNull();
    const body = (await res.json()) as { service: string; region: string };
    expect(body.service).toBe("gefi-api");
    expect(body.region).toBe("eu");
  });

  it("handles same-region requests locally without forwarding", async () => {
    const env = edgeEnv({ withRegionalEU: true });
    // WORKER_REGION is "us"; ?region=us should NOT trigger forwarding.
    const res = await worker.fetch(
      new Request("https://api.gefi.io/?region=us"),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("X-Gefi-Forwarded")).toBeNull();
  });
});
