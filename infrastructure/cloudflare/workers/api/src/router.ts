/**
 * Tiny method-and-path router for `gefi-api`.
 *
 * Implementation note: we use a small regex-based matcher rather than the
 * `URLPattern` global so tests can run in Node (`URLPattern` is only a
 * Workers / browser global). The matcher supports the two patterns we need
 * for Task #2: literal paths (`/health`) and single-segment named params
 * (`/v1/forms/:kind`). When the API surface gets larger we can swap in a
 * fully featured router — every consumer of this module already accepts a
 * `Handler` shape that won't change.
 */

import type { ApiEnv } from "@gefi/shared-types";
import type { GefiAuthClaims } from "@gefi/auth/types";
import type { LooseAuthClaims } from "@gefi/auth/verify";

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

export interface RouteContext {
  request: Request;
  env: ApiEnv;
  ctx: ExecutionContext;
  /** Resolved region for this request (after `pickRegion`). */
  region: ApiEnv["WORKER_REGION"];
  /** Detected country code from `request.cf.country`, if any. */
  country: string | null;
  /** URL-decoded path-parameter map (empty for non-parameterised routes). */
  params: Record<string, string>;
  /**
   * The verified user claims. Set by the auth middleware in `index.ts`
   * BEFORE the handler runs:
   *   - `null` if the request has no `Authorization` header.
   *   - a `GefiAuthClaims` if the token verified AND has GeFi custom claims.
   *   - a `LooseAuthClaims` (no GeFi claims yet) if the token verified
   *     but the user hasn't onboarded — only the onboarding handler
   *     should accept this. Other handlers must check `auth?.tenant_id`.
   *
   * If the token is *present but invalid*, the middleware short-circuits
   * with a 401 and the handler never runs.
   */
  auth: GefiAuthClaims | LooseAuthClaims | null;
}

export type Handler = (rc: RouteContext) => Promise<Response> | Response;

interface CompiledRoute {
  method: Method;
  regex: RegExp;
  paramNames: string[];
  handler: Handler;
}

function compilePattern(path: string): { regex: RegExp; paramNames: string[] } {
  // Split into segments, escape literal segments, and convert `:name`
  // segments into a single-segment capture group. Trailing slashes are
  // tolerated (they match the same route).
  const paramNames: string[] = [];
  const parts = path.split("/").filter((p) => p.length > 0);
  const compiledParts = parts.map((part) => {
    if (part.startsWith(":")) {
      paramNames.push(part.slice(1));
      return "([^/]+)";
    }
    return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  });
  const body = compiledParts.length === 0 ? "" : `/${compiledParts.join("/")}`;
  const regex = new RegExp(`^${body}/?$`);
  return { regex, paramNames };
}

export class Router {
  private readonly routes: CompiledRoute[] = [];

  add(method: Method, path: string, handler: Handler): this {
    const { regex, paramNames } = compilePattern(path);
    this.routes.push({ method, regex, paramNames, handler });
    return this;
  }

  get(path: string, h: Handler): this { return this.add("GET", path, h); }
  post(path: string, h: Handler): this { return this.add("POST", path, h); }
  put(path: string, h: Handler): this { return this.add("PUT", path, h); }
  patch(path: string, h: Handler): this { return this.add("PATCH", path, h); }
  delete(path: string, h: Handler): this { return this.add("DELETE", path, h); }

  /**
   * Match a request against the registered routes. Returns `null` if no
   * pattern matches, or a tuple of `[handler, params]` if one does.
   */
  match(method: string, url: URL): [Handler, Record<string, string>] | null {
    for (const route of this.routes) {
      if (route.method !== method) continue;
      const m = route.regex.exec(url.pathname);
      if (!m) continue;
      const params: Record<string, string> = {};
      route.paramNames.forEach((name, idx) => {
        const captured = m[idx + 1];
        if (typeof captured === "string") {
          params[name] = decodeURIComponent(captured);
        }
      });
      return [route.handler, params];
    }
    return null;
  }
}
