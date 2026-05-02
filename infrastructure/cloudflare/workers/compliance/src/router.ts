/**
 * Tiny method-and-path router for `gefi-compliance`. Mirrors the shape used
 * by `gefi-api` (regex-based matcher, single-segment named params) so the
 * two Workers stay readable side-by-side.
 */

import type { ComplianceEnv } from "@gefi/shared-types";

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RouteContext {
  request: Request;
  env: ComplianceEnv;
  ctx: ExecutionContext;
  params: Record<string, string>;
}

export type Handler = (rc: RouteContext) => Promise<Response> | Response;

interface CompiledRoute {
  method: Method;
  regex: RegExp;
  paramNames: string[];
  handler: Handler;
}

function compilePattern(path: string): { regex: RegExp; paramNames: string[] } {
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
  return { regex: new RegExp(`^${body}/?$`), paramNames };
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
  patch(path: string, h: Handler): this { return this.add("PATCH", path, h); }

  match(method: string, url: URL): [Handler, Record<string, string>] | null {
    for (const route of this.routes) {
      if (route.method !== method) continue;
      const m = route.regex.exec(url.pathname);
      if (!m) continue;
      const params: Record<string, string> = {};
      route.paramNames.forEach((name, idx) => {
        const captured = m[idx + 1];
        if (typeof captured === "string") params[name] = decodeURIComponent(captured);
      });
      return [route.handler, params];
    }
    return null;
  }
}
