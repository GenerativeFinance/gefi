import { describe, expect, it } from "vitest";
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

  it("returns the first registered match when patterns overlap", () => {
    const r = new Router()
      .get("/v1/foo/:id", () => new Response("first"))
      .get("/v1/foo/:id", () => new Response("second"));
    const m = r.match("GET", new URL("https://x/v1/foo/42"));
    return m![0]({} as never).then(async (res) => {
      expect(await (res as Response).text()).toBe("first");
    });
  });
});
