/**
 * Edge security-header module shared by every public-facing Worker.
 *
 * The headers below are deliberately strict — fail closed. If a future
 * surface needs to relax one of them, do it at that surface (`applyHeaders`
 * accepts an override map) rather than weakening the default for everyone.
 *
 * Reference: OWASP Secure Headers Project, MDN, and Cloudflare's own
 * "Recommended HTTP response headers" guide.
 */

import type { CommonVars } from "@gefi/shared-types";

export interface HeaderOverrides {
  /**
   * Extra `Content-Security-Policy` source allow-listing, merged into the
   * default policy. Keys are CSP directives, values are extra source
   * expressions to add. Use this sparingly — every relaxation widens the
   * blast radius of a future XSS.
   */
  cspExtras?: Partial<Record<CspDirective, string[]>>;
  /**
   * Extra response headers to set verbatim (e.g. `Cache-Control` for the
   * static-asset surface, or `Cross-Origin-Resource-Policy: cross-origin`
   * for fonts).
   */
  extra?: Record<string, string>;
}

type CspDirective =
  | "default-src"
  | "script-src"
  | "style-src"
  | "font-src"
  | "img-src"
  | "connect-src"
  | "frame-ancestors"
  | "base-uri"
  | "form-action"
  | "object-src"
  | "worker-src"
  | "manifest-src"
  | "media-src";

/**
 * Build a `Content-Security-Policy` header value from a directive map.
 * Exported separately so callers can compute the policy once at module load
 * and reuse it (e.g. via a cached `Headers` object) when handling many
 * requests.
 */
export function buildCsp(directives: Record<CspDirective, string[]>): string {
  return (Object.entries(directives) as [CspDirective, string[]][])
    .filter(([, sources]) => sources.length > 0)
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
}

/**
 * Default CSP for the API surface. The API only ever returns JSON — no HTML,
 * no inline scripts — so almost every directive is `'none'`.
 */
export const API_CSP_DIRECTIVES: Record<CspDirective, string[]> = {
  "default-src": ["'none'"],
  "script-src": ["'none'"],
  "style-src": ["'none'"],
  "font-src": ["'none'"],
  "img-src": ["'none'"],
  "connect-src": ["'self'"],
  "frame-ancestors": ["'none'"],
  "base-uri": ["'none'"],
  "form-action": ["'none'"],
  "object-src": ["'none'"],
  "worker-src": ["'none'"],
  "manifest-src": ["'none'"],
  "media-src": ["'none'"],
};

/**
 * Default CSP for the public web surface. Mirrors what the Jekyll site sets
 * via meta tag, so a Worker proxying the apex domain produces identical
 * behaviour whether the response originates from GH Pages or a future
 * Cloudflare Pages migration.
 */
export const WEB_CSP_DIRECTIVES: Record<CspDirective, string[]> = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "img-src": ["'self'", "data:"],
  "connect-src": ["'self'", "https://api.gefi.io"],
  "frame-ancestors": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'", "https://api.gefi.io"],
  "object-src": ["'none'"],
  "worker-src": ["'self'"],
  "manifest-src": ["'self'"],
  "media-src": ["'self'"],
};

/** Headers that are safe and useful for both API and web responses. */
function commonStrictHeaders(env: Pick<CommonVars, "ENVIRONMENT">): Record<string, string> {
  const headers: Record<string, string> = {
    // 2-year HSTS with preload + subdomain inclusion. Only in prod — staging
    // and dev shouldn't pin browsers to HTTPS for a development hostname.
    "Strict-Transport-Security":
      env.ENVIRONMENT === "prod"
        ? "max-age=63072000; includeSubDomains; preload"
        : "max-age=0",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Resource-Policy": "same-site",
    // Disable everything not explicitly used by the marketing site or API.
    // Each new surface that needs a feature (e.g. clipboard for "copy API
    // key") opts in via `extra`.
    "Permissions-Policy":
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()",
  };
  return headers;
}

/**
 * Apply the standard security-header set to a Response. Returns a new
 * Response — the original is not mutated, since `Response.headers` from
 * upstream is often immutable.
 */
export function applyHeaders(
  response: Response,
  surface: "api" | "web",
  env: Pick<CommonVars, "ENVIRONMENT">,
  overrides: HeaderOverrides = {},
): Response {
  const headers = new Headers(response.headers);

  // Common strict headers.
  for (const [name, value] of Object.entries(commonStrictHeaders(env))) {
    headers.set(name, value);
  }

  // CSP per surface.
  const baseCsp = surface === "api" ? API_CSP_DIRECTIVES : WEB_CSP_DIRECTIVES;
  const mergedCsp: Record<CspDirective, string[]> = { ...baseCsp };
  if (overrides.cspExtras) {
    for (const [key, extras] of Object.entries(overrides.cspExtras) as [
      CspDirective,
      string[],
    ][]) {
      mergedCsp[key] = [...(mergedCsp[key] ?? []), ...extras];
    }
  }
  headers.set("Content-Security-Policy", buildCsp(mergedCsp));

  // API responses should never be cached by intermediaries by default.
  // Web responses inherit upstream's Cache-Control unless overridden.
  if (surface === "api" && !headers.has("Cache-Control")) {
    headers.set("Cache-Control", "private, no-store");
  }

  // Caller overrides take final precedence.
  if (overrides.extra) {
    for (const [name, value] of Object.entries(overrides.extra)) {
      headers.set(name, value);
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
