/**
 * Tiny method-and-path router for `gefi-api`.
 *
 * We deliberately don't take a dependency on Hono / itty-router / etc. for
 * this foundation — the API surface is small enough that a few hundred
 * lines of explicit code are easier to audit than a third-party router's
 * middleware chain. When the API surface gets larger (Task #5 / Task #7)
 * we can revisit.
 */

import type { ApiEnv } from "@gefi/shared-types";

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
}

export type Handler = (rc: RouteContext) => Promise<Response> | Response;

interface Route {
  method: Method;
  pattern: URLPattern;
  handler: Handler;
}

export class Router {
  private readonly routes: Route[] = [];

  add(method: Method, path: string, handler: Handler): this {
    this.routes.push({
      method,
      pattern: new URLPattern({ pathname: path }),
      handler,
    });
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
      const m = route.pattern.exec({ pathname: url.pathname });
      if (!m) continue;
      const groups = m.pathname.groups;
      const params: Record<string, string> = {};
      for (const [k, v] of Object.entries(groups)) {
        if (typeof v === "string") params[k] = decodeURIComponent(v);
      }
      return [route.handler, params];
    }
    return null;
  }
}
