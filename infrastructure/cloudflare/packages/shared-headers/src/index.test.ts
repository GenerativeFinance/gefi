import { describe, expect, it } from "vitest";
import { applyHeaders, buildCsp, WEB_CSP_DIRECTIVES } from "./index.js";

describe("buildCsp", () => {
  it("emits directive entries joined with semicolons", () => {
    const value = buildCsp({
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": [],
      "font-src": [],
      "img-src": [],
      "connect-src": ["'self'"],
      "frame-ancestors": ["'none'"],
      "base-uri": [],
      "form-action": [],
      "object-src": [],
      "worker-src": [],
      "manifest-src": [],
      "media-src": [],
    });
    expect(value).toContain("default-src 'self'");
    expect(value).toContain("script-src 'self' 'unsafe-inline'");
    expect(value).toContain("frame-ancestors 'none'");
    // Empty directives are dropped, not emitted as bare keys.
    expect(value).not.toContain("style-src ;");
    expect(value).not.toMatch(/style-src\s*$/);
  });
});

describe("applyHeaders", () => {
  it("sets the strict header set on every response", () => {
    const upstream = new Response("ok", { status: 200 });
    const out = applyHeaders(upstream, "api", { ENVIRONMENT: "prod" });

    expect(out.headers.get("Strict-Transport-Security")).toMatch(/max-age=63072000/);
    expect(out.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(out.headers.get("X-Frame-Options")).toBe("DENY");
    expect(out.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(out.headers.get("Cross-Origin-Opener-Policy")).toBe("same-origin");
    expect(out.headers.get("Permissions-Policy")).toContain("camera=()");
  });

  it("disables HSTS in non-prod environments", () => {
    const out = applyHeaders(new Response("ok"), "api", { ENVIRONMENT: "dev" });
    expect(out.headers.get("Strict-Transport-Security")).toBe("max-age=0");
  });

  it("uses different default CSPs for api vs web", () => {
    const apiOut = applyHeaders(new Response("ok"), "api", { ENVIRONMENT: "prod" });
    const webOut = applyHeaders(new Response("<html></html>"), "web", { ENVIRONMENT: "prod" });

    const apiCsp = apiOut.headers.get("Content-Security-Policy") ?? "";
    const webCsp = webOut.headers.get("Content-Security-Policy") ?? "";

    expect(apiCsp).toContain("default-src 'none'");
    expect(webCsp).toContain("default-src 'self'");
    expect(webCsp).toContain("https://api.gefi.io");
  });

  it("merges cspExtras into the default policy without dropping defaults", () => {
    const out = applyHeaders(new Response("ok"), "web", { ENVIRONMENT: "prod" }, {
      cspExtras: { "connect-src": ["https://eu.api.gefi.io"] },
    });
    const csp = out.headers.get("Content-Security-Policy") ?? "";
    expect(csp).toContain("https://api.gefi.io");
    expect(csp).toContain("https://eu.api.gefi.io");
  });

  it("forces Cache-Control: no-store on api responses by default", () => {
    const out = applyHeaders(new Response("ok"), "api", { ENVIRONMENT: "prod" });
    expect(out.headers.get("Cache-Control")).toBe("private, no-store");
  });

  it("respects an explicit Cache-Control override on api responses", () => {
    const out = applyHeaders(new Response("ok"), "api", { ENVIRONMENT: "prod" }, {
      extra: { "Cache-Control": "public, max-age=60" },
    });
    expect(out.headers.get("Cache-Control")).toBe("public, max-age=60");
  });

  it("preserves the upstream body and status", () => {
    const upstream = new Response("the body", { status: 418 });
    const out = applyHeaders(upstream, "web", { ENVIRONMENT: "prod" });
    expect(out.status).toBe(418);
    return out.text().then((body) => expect(body).toBe("the body"));
  });

  it("does not relax web defaults when cspExtras is empty", () => {
    const out = applyHeaders(new Response(""), "web", { ENVIRONMENT: "prod" });
    const csp = out.headers.get("Content-Security-Policy") ?? "";
    for (const [key, sources] of Object.entries(WEB_CSP_DIRECTIVES)) {
      if (sources.length === 0) continue;
      expect(csp).toContain(`${key} ${sources.join(" ")}`);
    }
  });
});
