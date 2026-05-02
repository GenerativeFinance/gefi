/**
 * Tests for the Auth0 Management M2M client.
 */
import { describe, expect, it } from "vitest";
import { Auth0Management, type GefiAppMetadata } from "./management.js";

const DOMAIN = "https://gefi-test.auth0.com/";

function memKv(): KVNamespace {
  const store = new Map<string, string>();
  return {
    get: async (k: string) => store.get(k) ?? null,
    put: async (k: string, v: string) => {
      store.set(k, v);
    },
    delete: async (k: string) => {
      store.delete(k);
    },
    list: async () => ({ keys: [], list_complete: true, cacheStatus: null }),
    getWithMetadata: async () => ({ value: null, metadata: null, cacheStatus: null }),
  } as unknown as KVNamespace;
}

const claims: GefiAppMetadata = {
  tenant_id: "tenant_abc",
  jurisdiction: "eu",
  entity_type: "professional",
  subscription_tier: "pro",
  kyc_tier: "none",
  roles: ["admin"],
};

describe("Auth0Management", () => {
  it("getManagementToken posts client_credentials and caches the result", async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const fakeFetch = async (url: string, init?: RequestInit) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ access_token: "mgmt-tok-123", expires_in: 3600 }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };
    const cache = memKv();
    const m = new Auth0Management(DOMAIN, "client-id", "client-secret", cache, fakeFetch as unknown as typeof fetch);
    const t1 = await m.getManagementToken();
    expect(t1).toBe("mgmt-tok-123");
    expect(calls).toHaveLength(1);
    expect(calls[0]?.url).toBe(`${DOMAIN}oauth/token`);
    const body = JSON.parse((calls[0]?.init?.body as string) ?? "{}");
    expect(body.grant_type).toBe("client_credentials");
    expect(body.audience).toBe(`${DOMAIN}api/v2/`);
    // Second call should be served from KV.
    const t2 = await m.getManagementToken();
    expect(t2).toBe("mgmt-tok-123");
    expect(calls).toHaveLength(1);
  });

  it("updateAppMetadata sends the gefi block under app_metadata", async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const fakeFetch = async (url: string, init?: RequestInit) => {
      calls.push({ url, init });
      if (url.endsWith("/oauth/token")) {
        return new Response(JSON.stringify({ access_token: "tok", expires_in: 3600 }), { status: 200 });
      }
      return new Response("{}", { status: 200 });
    };
    const m = new Auth0Management(DOMAIN, "cid", "csec", null, fakeFetch as unknown as typeof fetch);
    await m.updateAppMetadata("auth0|user-123", claims);
    expect(calls).toHaveLength(2);
    const patch = calls[1];
    expect(patch?.url).toBe(`${DOMAIN}api/v2/users/auth0%7Cuser-123`);
    expect(patch?.init?.method).toBe("PATCH");
    const headers = patch?.init?.headers as Record<string, string>;
    expect(headers?.authorization).toBe("Bearer tok");
    const body = JSON.parse((patch?.init?.body as string) ?? "{}");
    expect(body.app_metadata.gefi.tenant_id).toBe("tenant_abc");
    expect(body.app_metadata.gefi.jurisdiction).toBe("eu");
    expect(body.app_metadata.gefi.roles).toEqual(["admin"]);
  });

  it("throws when the M2M token fetch returns a non-2xx", async () => {
    const fakeFetch = async () => new Response("nope", { status: 401 });
    const m = new Auth0Management(DOMAIN, "x", "y", null, fakeFetch as unknown as typeof fetch);
    await expect(m.updateAppMetadata("auth0|u", claims)).rejects.toThrow(/auth0_m2m_token_failed/);
  });

  it("throws when the user PATCH returns a non-2xx", async () => {
    const fakeFetch = async (url: string) => {
      if (url.endsWith("/oauth/token")) {
        return new Response(JSON.stringify({ access_token: "t", expires_in: 60 }), { status: 200 });
      }
      return new Response("forbidden", { status: 403 });
    };
    const m = new Auth0Management(DOMAIN, "x", "y", null, fakeFetch as unknown as typeof fetch);
    await expect(m.updateAppMetadata("auth0|u", claims)).rejects.toThrow(/auth0_m2m_update_failed/);
  });
});
