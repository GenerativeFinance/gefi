/**
 * `requireAuth` — Hono middleware that verifies the session JWT and attaches
 * the user to `c.var.user`. Returns 401 if missing/invalid/expired.
 */
import type { MiddlewareHandler } from "hono";
import type { Env, HonoVariables } from "../types.js";
import { verifyJwt } from "../lib/jwt.js";
import { SESSION_COOKIE, readCookie } from "../lib/cookie.js";

export const requireAuth: MiddlewareHandler<{
  Bindings: Env;
  Variables: HonoVariables;
}> = async (c, next) => {
  const token = readCookie(c.req.header("cookie"), SESSION_COOKIE);
  if (!token) return c.json({ error: "unauthenticated" }, 401);
  const payload = await verifyJwt(token, c.env.JWT_PK);
  if (!payload) return c.json({ error: "unauthenticated" }, 401);
  c.set("user", { id: payload.sub, email: payload.email });
  await next();
};
