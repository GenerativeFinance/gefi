/**
 * Model detail / favorites / verify / reviews routes.
 *
 *   GET  /api/models/:slug                  → ModelDetailDTO (404 if unknown)
 *   POST /api/models/:slug/verify           → ZKP verifier stub
 *   GET  /api/models/:slug/reviews?cursor=  → paginated reviews
 *   POST /api/models/:slug/reviews          → upsert review (auth)
 *   POST /api/favorites/toggle              → toggle favorite (auth)
 *
 * The catalog browse endpoint (`GET /api/models`) lives in `routes/models.ts`
 * — it shares the same Hono base path but a different concern. We mount the
 * detail router under the same `/api/models` prefix in `index.ts`.
 */
import { Hono } from "hono";
import type { Env, HonoVariables } from "../types.js";
import { requireAuth } from "../middleware/auth.js";
import { uuid } from "../lib/random.js";
import { verifyJwt } from "../lib/jwt.js";
import { SESSION_COOKIE, readCookie } from "../lib/cookie.js";
import {
  buildModelDetail,
  listReviewsPage,
  reviewerHandle,
  type DetailRepository,
} from "../lib/detail-repo.js";
import { D1DetailRepository } from "../lib/detail-repo.js";

export interface DetailRoutesOptions {
  repository?: DetailRepository;
  /** Override `c.var.user.id` resolution in tests where no auth is wired. */
  resolveUserId?: (req: Request) => string | null;
  /** Inject a clock for deterministic tests. */
  now?: () => number;
  /** Inject id generator for deterministic tests. */
  newId?: () => string;
}

const MAX_COMMENT_LEN = 200;

export function detailRoutes(opts: DetailRoutesOptions = {}) {
  const router = new Hono<{ Bindings: Env; Variables: HonoVariables }>();
  const now = opts.now ?? (() => Math.floor(Date.now() / 1000));
  const newId = opts.newId ?? uuid;
  const repoOf = (env: Env): DetailRepository => opts.repository ?? new D1DetailRepository(env.DB);

  // Default cookie-based resolver for production: verifies the session JWT
  // and returns the user id, or null for anonymous. Tests inject their own
  // resolveUserId so they can simulate a logged-in user without minting JWTs.
  async function defaultResolveUserId(c: {
    req: { header: (name: string) => string | undefined };
    env: Env;
  }): Promise<string | null> {
    const token = readCookie(c.req.header("cookie"), SESSION_COOKIE);
    if (!token) return null;
    const payload = await verifyJwt(token, c.env.JWT_PK);
    return payload?.sub ?? null;
  }

  router.get("/:slug", async (c) => {
    const slug = c.req.param("slug");
    const repo = repoOf(c.env);
    // Detail uses the optional cookie user (no 401 on anonymous) so that
    // hydrated `favoritedByMe` survives a refresh for signed-in users.
    const userId = opts.resolveUserId
      ? opts.resolveUserId(c.req.raw)
      : await defaultResolveUserId(c);
    const dto = await buildModelDetail(repo, slug, userId);
    if (!dto) return c.json({ error: "not_found" }, 404);
    return c.json(dto, 200, {
      "cache-control": "public, max-age=30, s-maxage=30",
    });
  });

  router.post("/:slug/verify", async (c) => {
    const slug = c.req.param("slug");
    const repo = repoOf(c.env);
    const exists = await repo.getModelRow(slug);
    if (!exists) return c.json({ error: "not_found" }, 404);
    const tampered = c.req.query("tampered") === "1";
    if (tampered) {
      return c.json({
        verified: false,
        method: "sha256-stub",
        reason: "hash mismatch (tampered=1 demo)",
      });
    }
    return c.json({ verified: true, method: "sha256-stub" });
  });

  router.get("/:slug/reviews", async (c) => {
    const slug = c.req.param("slug");
    const repo = repoOf(c.env);
    const exists = await repo.getModelRow(slug);
    if (!exists) return c.json({ error: "not_found" }, 404);
    const cursor = c.req.query("cursor");
    const result = await listReviewsPage(repo, slug, cursor);
    return c.json(result);
  });

  router.post("/:slug/reviews", requireAuth, async (c) => {
    const slug = c.req.param("slug");
    const repo = repoOf(c.env);
    const exists = await repo.getModelRow(slug);
    if (!exists) return c.json({ error: "not_found" }, 404);

    const body = await c.req
      .json<{ stars?: unknown; comment?: unknown }>()
      .catch(() => ({}) as { stars?: unknown; comment?: unknown });
    const stars = Number(body.stars);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return c.json({ error: "invalid_stars" }, 400);
    }
    const commentRaw = typeof body.comment === "string" ? body.comment : "";
    if (commentRaw.length > MAX_COMMENT_LEN) {
      return c.json({ error: "comment_too_long", max: MAX_COMMENT_LEN }, 400);
    }
    const comment = commentRaw.trim();

    const user = c.get("user");
    const result = await repo.upsertReview({
      slug,
      userId: user.id,
      stars,
      comment,
      now: now(),
      newId,
    });
    return c.json(
      {
        review: {
          id: result.review.id,
          // Match the GET /reviews ReviewDTO shape exactly so the client can
          // render the row from either response without branching.
          reviewer: reviewerHandle(result.review.user_id),
          stars: result.review.stars,
          comment: result.review.comment,
          createdAt: result.review.created_at,
          updatedAt: result.review.updated_at,
        },
        rating_avg: result.ratingAvg,
        rating_count: result.ratingCount,
      },
      200,
    );
  });

  return router;
}

export function favoritesRoutes(opts: DetailRoutesOptions = {}) {
  const router = new Hono<{ Bindings: Env; Variables: HonoVariables }>();
  const now = opts.now ?? (() => Math.floor(Date.now() / 1000));
  const repoOf = (env: Env): DetailRepository => opts.repository ?? new D1DetailRepository(env.DB);

  router.post("/toggle", requireAuth, async (c) => {
    const body = await c.req
      .json<{ slug?: unknown }>()
      .catch(() => ({}) as { slug?: unknown });
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    if (!slug) return c.json({ error: "missing_slug" }, 400);
    const repo = repoOf(c.env);
    const exists = await repo.getModelRow(slug);
    if (!exists) return c.json({ error: "not_found" }, 404);
    const user = c.get("user");
    const favorited = await repo.toggleFavorite(user.id, slug, now());
    return c.json({ slug, favorited });
  });

  return router;
}
