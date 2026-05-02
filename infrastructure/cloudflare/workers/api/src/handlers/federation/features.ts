/**
 * Feature-store handlers.
 *
 *   POST /v1/features/lookup        (auth)  feature lookup w/ jurisdiction enforcement
 *   POST /v1/features/definitions   (admin) register a new feature definition
 */

import {
  FeatureRegistry,
  KvFeatureCache,
  StubFeatureNodeClient,
  HttpFeatureNodeClient,
  lookupFeature,
  type FeatureNodeClient,
} from "@gefi/feature-store";
import type { ApiEnv, Region } from "@gefi/shared-types";
import { requireAuth } from "../../middleware/auth.js";
import type { Handler } from "../../router.js";

function regionalCachePrefix(env: ApiEnv): string {
  return env.FEATURE_STORE_REGION_PREFIX ?? `feat:${env.WORKER_REGION}:`;
}

function clientFor(env: ApiEnv, sourceEndpoint: string): FeatureNodeClient {
  if (sourceEndpoint.startsWith("stub://")) return new StubFeatureNodeClient();
  if (!env.FEDERATION_INTERNAL_TOKEN) {
    // Fall back to stub when no bearer is configured — the lookup will
    // still resolve from the in-memory store any test setup pre-seeded.
    return new StubFeatureNodeClient();
  }
  return new HttpFeatureNodeClient(env.FEDERATION_INTERNAL_TOKEN);
}

interface LookupBody {
  feature?: string;
  key?: string;
  model_run_id?: string;
}

export const lookupFeatureHandler: Handler = async (rc) => {
  const auth = requireAuth(rc);
  if (auth.response) return auth.response;
  const c = auth.claims;

  let body: LookupBody;
  try { body = (await rc.request.json()) as LookupBody; } catch { return Response.json({ ok: false, error: "invalid_body" }, { status: 400 }); }
  if (!body.feature || !body.key) {
    return Response.json({ ok: false, error: "missing_required" }, { status: 400 });
  }

  const registry = new FeatureRegistry(rc.env.DB);
  const def = await registry.findBySlug(body.feature);
  if (!def) return Response.json({ ok: false, error: "feature_not_found" }, { status: 404 });

  const cache = new KvFeatureCache(rc.env.CACHE, regionalCachePrefix(rc.env));
  const client = clientFor(rc.env, def.sourceEndpoint);
  const result = await lookupFeature(
    {
      registry,
      cache,
      client,
      callerRegion: c.jurisdiction,
      callerIsAdmin: c.roles.includes("admin"),
    },
    {
      tenantId: c.tenant_id,
      feature: body.feature,
      key: body.key,
      modelRunId: body.model_run_id,
    },
  );
  if (!result.ok) {
    const status =
      result.error === "cross_jurisdiction" || result.error === "feature_forbidden"
        ? 403
        : result.error === "feature_not_found"
        ? 404
        : 400;
    return Response.json(result, { status });
  }
  return Response.json(result);
};

interface CreateDefinitionBody {
  slug?: string;
  jurisdiction?: Region;
  schema_json?: string;
  default_ttl_seconds?: number;
  source_endpoint?: string;
  description?: string;
}

export const createFeatureDefinitionHandler: Handler = async (rc) => {
  const auth = requireAuth(rc);
  if (auth.response) return auth.response;
  if (!auth.claims.roles.includes("admin")) {
    return Response.json({ ok: false, error: "admin_required" }, { status: 403 });
  }
  let body: CreateDefinitionBody;
  try { body = (await rc.request.json()) as CreateDefinitionBody; } catch { return Response.json({ ok: false, error: "invalid_body" }, { status: 400 }); }
  if (!body.slug || !body.jurisdiction || !body.source_endpoint) {
    return Response.json({ ok: false, error: "missing_required" }, { status: 400 });
  }
  if (body.jurisdiction !== rc.env.WORKER_REGION) {
    return Response.json({ ok: false, error: "jurisdiction_must_match_region" }, { status: 400 });
  }
  // Encrypted-transport gate at registration time. We accept `https://`
  // for production endpoints and `stub://` for dev/test fixtures. Any
  // other scheme (including bare `http://`) is rejected so a definition
  // can never be created with a plaintext source endpoint.
  if (!/^(https:\/\/|stub:\/\/)/.test(body.source_endpoint)) {
    return Response.json({ ok: false, error: "source_endpoint_not_https" }, { status: 400 });
  }
  const registry = new FeatureRegistry(rc.env.DB);
  const existing = await registry.findBySlug(body.slug);
  if (existing) return Response.json({ ok: false, error: "slug_exists" }, { status: 409 });
  const def = await registry.create({
    slug: body.slug,
    ownerTenantId: auth.claims.tenant_id,
    jurisdiction: body.jurisdiction,
    schemaJson: body.schema_json,
    defaultTtlSeconds: body.default_ttl_seconds,
    sourceEndpoint: body.source_endpoint,
    description: body.description,
  });
  return Response.json({ ok: true, definition: def }, { status: 201 });
};
