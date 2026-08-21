import { describe, expect, it } from "vitest";
import {
  OpenSanctionsProvider,
  SanctionsProviderNotConfiguredError,
  StubSanctionsProvider,
  resolveSanctionsProvider,
} from "./sanctions/index.js";

describe("StubSanctionsProvider", () => {
  const stub = new StubSanctionsProvider();

  it("returns no hits for a clean subject", async () => {
    const r = await stub.screen({
      internalRef: "u1",
      jurisdiction: "eu",
      fullName: "Alice Investor",
    });
    expect(r.hit).toBe(false);
    expect(r.hits).toHaveLength(0);
  });

  it("hits on a known sample name", async () => {
    const r = await stub.screen({
      internalRef: "u2",
      jurisdiction: "eu",
      fullName: "Specially Designated National",
    });
    expect(r.hit).toBe(true);
    expect(r.hits[0]?.list).toBe("STUB OFAC");
    expect(r.hits[0]?.matchScore).toBe(1);
  });

  it("matches case-insensitively", async () => {
    const r = await stub.screen({
      internalRef: "u3",
      jurisdiction: "us",
      fullName: "specially designated NATIONAL",
    });
    expect(r.hit).toBe(true);
  });
});

describe("OpenSanctionsProvider", () => {
  it("posts to the match endpoint and parses results above threshold", async () => {
    const fakeFetch = async (_url: string, _init?: RequestInit) =>
      new Response(
        JSON.stringify({
          responses: {
            q: {
              results: [
                {
                  score: 0.92,
                  caption: "Sanctioned Person",
                  datasets: ["us_ofac_sdn"],
                },
                {
                  score: 0.6,
                  caption: "Below Threshold",
                  datasets: ["peps"],
                },
              ],
            },
          },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    const provider = new OpenSanctionsProvider("test-key", 0.8, fakeFetch as unknown as typeof fetch);
    const r = await provider.screen({
      internalRef: "u1",
      jurisdiction: "us",
      fullName: "Some Name",
    });
    expect(r.hit).toBe(true);
    expect(r.hits).toHaveLength(1);
    expect(r.hits[0]?.list).toBe("OFAC SDN");
    expect(r.hits[0]?.matchScore).toBe(0.92);
  });

  it("returns no hit when all results are below threshold", async () => {
    const fakeFetch = async () =>
      new Response(JSON.stringify({ responses: { q: { results: [{ score: 0.1, caption: "x", datasets: ["peps"] }] } } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    const provider = new OpenSanctionsProvider("k", 0.8, fakeFetch as unknown as typeof fetch);
    const r = await provider.screen({ internalRef: "u", jurisdiction: "eu", fullName: "Clean" });
    expect(r.hit).toBe(false);
  });

  it("throws on a non-2xx response", async () => {
    const fakeFetch = async () => new Response("err", { status: 500 });
    const provider = new OpenSanctionsProvider("k", 0.8, fakeFetch as unknown as typeof fetch);
    await expect(
      provider.screen({ internalRef: "u", jurisdiction: "eu", fullName: "x" }),
    ).rejects.toThrow(/opensanctions_screen_failed/);
  });
});

describe("resolveSanctionsProvider factory", () => {
  it("returns OpenSanctions when an API key is configured", () => {
    const p = resolveSanctionsProvider({ OPENSANCTIONS_API_KEY: "k" });
    expect(p.name).toBe("opensanctions");
  });
  it("falls back to the stub in dev", () => {
    const p = resolveSanctionsProvider({ ENVIRONMENT: "dev" });
    expect(p.name).toBe("stub");
  });
  it("THROWS in prod when no provider is configured (fail-closed)", () => {
    expect(() => resolveSanctionsProvider({ ENVIRONMENT: "prod" })).toThrow(
      SanctionsProviderNotConfiguredError,
    );
  });
});
