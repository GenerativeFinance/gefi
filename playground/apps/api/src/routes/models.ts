/**
 * GET /api/models — public catalog browse / search endpoint.
 *
 * Query parameters (all optional except none — bare endpoint returns the
 * trending top-24):
 *
 *   category     slug (e.g. "risk-assessment")
 *   subcategory  slug (e.g. "var")
 *   q            free-text needle, matched against name + summary (case-insensitive)
 *   risk         "low" | "medium" | "high"
 *   maturity     "experimental" | "beta" | "staging" | "production"
 *   featured     "1" | "0"
 *   sort         "trending" (default) | "newest" | "price-asc" | "price-desc" | "rating"
 *   limit        1..24 (default 24, capped at 24)
 *   cursor       opaque base64url, returned as `next_cursor` in the previous page
 *
 * Response: `{ items: ModelDTO[], next_cursor: string | null }`.
 */
import { Hono } from "hono";
import type { Env, HonoVariables } from "../types.js";
import {
  D1ModelsRepository,
  listModels,
  parseListQuery,
  type ModelsRepository,
} from "../lib/models-repo.js";

export interface ModelsRoutesOptions {
  /** Override the repository for tests. Falls back to D1ModelsRepository(env.DB). */
  repository?: ModelsRepository;
}

export function modelsRoutes(opts: ModelsRoutesOptions = {}) {
  const router = new Hono<{ Bindings: Env; Variables: HonoVariables }>();

  router.get("/", async (c) => {
    const url = new URL(c.req.url);
    const query = parseListQuery(url.searchParams);
    const repo = opts.repository ?? new D1ModelsRepository(c.env.DB);
    const result = await listModels(repo, query);
    // 60s edge cache for anonymous browse responses; tune later in Phase 8.
    return c.json(result, 200, {
      "cache-control": "public, max-age=60, s-maxage=60",
    });
  });

  return router;
}
