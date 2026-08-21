/**
 * Tests for the model detail / favorites / verify / reviews routes.
 *
 * Uses `InMemoryDetailRepository` so we can exercise the full route layer
 * (including auth via `requireAuth`) without depending on miniflare D1.
 */
import { describe, expect, it } from "vitest";
import { Hono } from "hono";
import { detailRoutes, favoritesRoutes } from "./detail.js";
import { buildStubEnv, InMemoryDetailRepository } from "../test-helpers.js";
import { signJwt } from "../lib/jwt.js";
import type { Env, HonoVariables } from "../types.js";
import type { ModelRow } from "../lib/models-repo.js";
import type { AuditRow, ModelVersionRow } from "../lib/detail-repo.js";

function modelRow(overrides: Partial<ModelRow> = {}): ModelRow {
  return {
    slug: "credit-default-classifier",
    name: "Credit Default Classifier",
    summary: "Predicts SME default risk.",
    category_slug: "credit-scoring",
    subcategory_slug: "sme",
    developer: "GeFi Labs",
    status: "approved",
    featured: 1,
    risk_tier: "high",
    maturity: "production",
    price_cents: 14_900,
    rating_avg: 4.8,
    rating_count: 211,
    trending_score: 0.97,
    federated: 1,
    thumbnail_url: null,
    created_at: 1_700_000_000,
    updated_at: 1_700_000_000,
    ...overrides,
  };
}

function versionRow(slug: string, metrics: unknown, ts = 1_700_000_000): ModelVersionRow {
  return {
    id: `v_${slug}_${ts}`,
    model_slug: slug,
    version: "1.0.0",
    version_label: "v1.0.0",
    metrics: JSON.stringify(metrics),
    sha256: "deadbeef",
    created_at: ts,
  };
}

function auditRow(slug: string, passed = true): AuditRow {
  return {
    id: `audit_${slug}`,
    model_slug: slug,
    auditor: "Trail of Bits",
    standard: "ISO 42001",
    audited_at: 1_700_000_000,
    passed: passed ? 1 : 0,
    hash: "ff".repeat(32),
    created_at: 1_700_000_000,
  };
}

async function envWithAuth(): Promise<{ env: Env; cookie: string; userId: string }> {
  const built = await buildStubEnv();
  const userId = "user_test_1";
  const jwt = await signJwt(
    { sub: userId, email: "alice@example.com" },
    built.env.JWT_SK,
    3600,
  );
  return { env: built.env, cookie: `gefi_session=${jwt}`, userId };
}

function makeApp(repo: InMemoryDetailRepository, opts: { resolveUserId?: (req: Request) => string | null } = {}) {
  const app = new Hono<{ Bindings: Env; Variables: HonoVariables }>();
  const now = () => 1_730_000_000;
  let counter = 0;
  const newId = () => `rev_${++counter}`;
  app.route(
    "/api/models",
    detailRoutes({ repository: repo, now, newId, resolveUserId: opts.resolveUserId }),
  );
  app.route("/api/favorites", favoritesRoutes({ repository: repo, now, newId }));
  return app;
}

describe("GET /api/models/:slug", () => {
  it("returns 404 for unknown slug", async () => {
    const { env } = await buildStubEnv();
    const app = makeApp(new InMemoryDetailRepository());
    const res = await app.request("/api/models/nope", {}, env);
    expect(res.status).toBe(404);
  });

  it("returns the full detail DTO with versions, latest metrics, and audits", async () => {
    const { env } = await buildStubEnv();
    const slug = "credit-default-classifier";
    const repo = new InMemoryDetailRepository({
      models: [modelRow()],
      versions: [
        versionRow(slug, { equityCurve: [[1, 1.05]] }, 1_700_000_001),
        versionRow(slug, { equityCurve: [[1, 0.99]] }, 1_700_000_000),
      ],
      audits: [auditRow(slug, true)],
    });
    repo.descriptions.set(slug, "Long description");

    const app = makeApp(repo);
    const res = await app.request(`/api/models/${slug}`, {}, env);
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toContain("max-age=30");
    const body = (await res.json()) as Record<string, unknown> & {
      versions: { createdAt: number }[];
      audits: unknown[];
      metrics: { equityCurve: [number, number][] };
      favoritedByMe: boolean;
    };
    expect(body.slug).toBe(slug);
    expect(body.description).toBe("Long description");
    expect(body.versions).toHaveLength(2);
    // Newest first; metrics taken from the newer version.
    expect(body.versions[0]!.createdAt).toBe(1_700_000_001);
    expect(body.metrics.equityCurve[0]![1]).toBe(1.05);
    expect(body.audits).toHaveLength(1);
    expect(body.favoritedByMe).toBe(false);
  });

  it("reflects favorited=true when the request user has favorited the model", async () => {
    const { env } = await buildStubEnv();
    const slug = "credit-default-classifier";
    const repo = new InMemoryDetailRepository({ models: [modelRow()] });
    repo.favorites.add(`u1|${slug}`);
    const app = makeApp(repo, { resolveUserId: () => "u1" });
    const res = await app.request(`/api/models/${slug}`, {}, env);
    const body = (await res.json()) as { favoritedByMe: boolean };
    expect(body.favoritedByMe).toBe(true);
  });
});

describe("POST /api/models/:slug/verify", () => {
  it("returns the sha256-stub verified shape by default", async () => {
    const { env } = await buildStubEnv();
    const slug = "credit-default-classifier";
    const repo = new InMemoryDetailRepository({ models: [modelRow()] });
    const app = makeApp(repo);
    const res = await app.request(`/api/models/${slug}/verify`, { method: "POST" }, env);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ verified: true, method: "sha256-stub" });
  });

  it("returns verified:false for the tampered=1 demo flow", async () => {
    const { env } = await buildStubEnv();
    const slug = "credit-default-classifier";
    const repo = new InMemoryDetailRepository({ models: [modelRow()] });
    const app = makeApp(repo);
    const res = await app.request(
      `/api/models/${slug}/verify?tampered=1`,
      { method: "POST" },
      env,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { verified: boolean };
    expect(body.verified).toBe(false);
  });

  it("404s on unknown slug", async () => {
    const { env } = await buildStubEnv();
    const app = makeApp(new InMemoryDetailRepository());
    const res = await app.request("/api/models/nope/verify", { method: "POST" }, env);
    expect(res.status).toBe(404);
  });
});

describe("Reviews", () => {
  it("rejects unauthenticated POST", async () => {
    const { env } = await buildStubEnv();
    const slug = "credit-default-classifier";
    const repo = new InMemoryDetailRepository({ models: [modelRow()] });
    const app = makeApp(repo);
    const res = await app.request(
      `/api/models/${slug}/reviews`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars: 4, comment: "ok" }),
      },
      env,
    );
    expect(res.status).toBe(401);
  });

  it("validates stars 1..5 and comment <=200 chars", async () => {
    const { env, cookie } = await envWithAuth();
    const slug = "credit-default-classifier";
    const repo = new InMemoryDetailRepository({ models: [modelRow()] });
    const app = makeApp(repo);

    const bad1 = await app.request(
      `/api/models/${slug}/reviews`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", cookie },
        body: JSON.stringify({ stars: 0 }),
      },
      env,
    );
    expect(bad1.status).toBe(400);

    const bad2 = await app.request(
      `/api/models/${slug}/reviews`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", cookie },
        body: JSON.stringify({ stars: 4, comment: "x".repeat(201) }),
      },
      env,
    );
    expect(bad2.status).toBe(400);
  });

  it("upserts (no duplicate row) and recomputes rating_avg/rating_count atomically", async () => {
    const { env, cookie, userId } = await envWithAuth();
    const slug = "credit-default-classifier";
    const repo = new InMemoryDetailRepository({
      models: [modelRow({ rating_avg: 0, rating_count: 0 })],
    });
    const app = makeApp(repo);

    const post = (stars: number, comment = "") =>
      app.request(
        `/api/models/${slug}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", cookie },
          body: JSON.stringify({ stars, comment }),
        },
        env,
      );

    const r1 = await post(5, "great");
    expect(r1.status).toBe(200);
    let body = (await r1.json()) as {
      rating_avg: number;
      rating_count: number;
      review: { reviewer: string; createdAt: number; stars: number };
    };
    expect(body.rating_count).toBe(1);
    expect(body.rating_avg).toBe(5);
    // Response carries the GET /reviews-shaped review back so the client
    // can render the row without a follow-up fetch.
    expect(body.review.reviewer).toMatch(/^user-/);
    expect(body.review.stars).toBe(5);
    expect(body.review.createdAt).toBeGreaterThan(0);

    // Upsert: same user resubmits — must still be one row.
    const r2 = await post(3, "changed mind");
    body = (await r2.json()) as typeof body;
    expect(body.rating_count).toBe(1);
    expect(body.rating_avg).toBe(3);
    expect(repo.reviews.filter((r) => r.user_id === userId)).toHaveLength(1);

    // Model row updated via the same orchestration.
    expect(repo.models[0]!.rating_count).toBe(1);
    expect(repo.models[0]!.rating_avg).toBe(3);
  });

  it("paginates GET /api/models/:slug/reviews via cursor", async () => {
    const { env } = await buildStubEnv();
    const slug = "credit-default-classifier";
    const repo = new InMemoryDetailRepository({ models: [modelRow()] });
    for (let i = 0; i < 25; i++) {
      repo.reviews.push({
        id: `r${i}`,
        model_slug: slug,
        user_id: `u${i}`,
        stars: ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5,
        comment: `n${i}`,
        created_at: 1_700_000_000 - i,
        updated_at: 1_700_000_000 - i,
      });
    }
    const app = makeApp(repo);

    const p1 = (await (await app.request(`/api/models/${slug}/reviews`, {}, env)).json()) as {
      items: { id: string }[];
      next_cursor: string | null;
    };
    expect(p1.items).toHaveLength(20);
    expect(p1.next_cursor).not.toBeNull();

    const p2 = (await (
      await app.request(`/api/models/${slug}/reviews?cursor=${p1.next_cursor}`, {}, env)
    ).json()) as { items: { id: string }[]; next_cursor: string | null };
    expect(p2.items).toHaveLength(5);
    expect(p2.next_cursor).toBeNull();
  });
});

describe("POST /api/favorites/toggle", () => {
  it("requires auth", async () => {
    const { env } = await buildStubEnv();
    const repo = new InMemoryDetailRepository({ models: [modelRow()] });
    const app = makeApp(repo);
    const res = await app.request(
      "/api/favorites/toggle",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "credit-default-classifier" }),
      },
      env,
    );
    expect(res.status).toBe(401);
  });

  it("flips the favorite state on each call", async () => {
    const { env, cookie, userId } = await envWithAuth();
    const slug = "credit-default-classifier";
    const repo = new InMemoryDetailRepository({ models: [modelRow()] });
    const app = makeApp(repo);

    const call = () =>
      app.request(
        "/api/favorites/toggle",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", cookie },
          body: JSON.stringify({ slug }),
        },
        env,
      );

    expect(((await (await call()).json()) as { favorited: boolean }).favorited).toBe(true);
    expect(repo.favorites.has(`${userId}|${slug}`)).toBe(true);
    expect(((await (await call()).json()) as { favorited: boolean }).favorited).toBe(false);
    expect(repo.favorites.has(`${userId}|${slug}`)).toBe(false);
  });

  it("400 on missing slug, 404 on unknown slug", async () => {
    const { env, cookie } = await envWithAuth();
    const repo = new InMemoryDetailRepository({ models: [modelRow()] });
    const app = makeApp(repo);
    const r1 = await app.request(
      "/api/favorites/toggle",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", cookie },
        body: JSON.stringify({}),
      },
      env,
    );
    expect(r1.status).toBe(400);

    const r2 = await app.request(
      "/api/favorites/toggle",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", cookie },
        body: JSON.stringify({ slug: "nope" }),
      },
      env,
    );
    expect(r2.status).toBe(404);
  });
});
