/**
 * Per-jurisdiction data residency surface.
 *
 *   GET /residency/:tenant_id
 *
 * Returns the customer-facing residency badge: which physical data planes
 * (D1 db, R2 bucket, KV namespace) hold the tenant's data, plus the list
 * of regulators applicable to those planes. Exposed to gefi-api which
 * proxies it onto `/v1/compliance/residency` for the dashboard.
 */

import type { Region } from "@gefi/shared-types";
import type { Handler } from "../router.js";

interface Attestation {
  tenantId: string;
  region: Region;
  d1Database: string;
  r2Bucket: string;
  kvNamespace: string;
  regulators: string[];
  lastVerifiedAt: number;
  attestationHash: string;
}

const REGULATORS_BY_REGION: Record<Region, string[]> = {
  eu: ["mifid-ii", "gdpr", "fca", "finma", "dfsa", "sama"],
  us: ["sec", "finra", "ccpa", "mas", "austrac"],
};

const PLANE_NAMES = (env: { ENVIRONMENT: string }, region: Region) => ({
  d1Database: `gefi-api-${region}-${env.ENVIRONMENT}`,
  r2Bucket: `gefi-artifacts-${region}-${env.ENVIRONMENT}`,
  kvNamespace: `gefi-cache-${region}-${env.ENVIRONMENT}`,
});

export const residencyHandler: Handler = async ({ env, params }) => {
  const tenantId = params["tenant_id"];
  if (!tenantId) {
    return Response.json({ ok: false, error: "tenant_id_required" }, { status: 400 });
  }

  // Try the cached attestation first.
  const row = await env.DB.prepare(
    `SELECT tenant_id AS tenantId, region, d1_database AS d1Database, r2_bucket AS r2Bucket,
            kv_namespace AS kvNamespace, regulators_json AS regulatorsJson,
            last_verified_at AS lastVerifiedAt, attestation_hash AS attestationHash
       FROM data_residency_attestations WHERE tenant_id = ?`,
  )
    .bind(tenantId)
    .first<{
      tenantId: string;
      region: Region;
      d1Database: string;
      r2Bucket: string;
      kvNamespace: string;
      regulatorsJson: string;
      lastVerifiedAt: number;
      attestationHash: string;
    }>();

  if (row) {
    const out: Attestation = {
      tenantId: row.tenantId,
      region: row.region,
      d1Database: row.d1Database,
      r2Bucket: row.r2Bucket,
      kvNamespace: row.kvNamespace,
      regulators: JSON.parse(row.regulatorsJson) as string[],
      lastVerifiedAt: row.lastVerifiedAt,
      attestationHash: row.attestationHash,
    };
    return Response.json({ ok: true, attestation: out, source: "cached" });
  }

  // No cached attestation yet → derive a synthetic one from the tenant's
  // most recent compliance case, falling back to the worker's own region.
  const last = await env.DB.prepare(
    `SELECT region FROM compliance_cases WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 1`,
  )
    .bind(tenantId)
    .first<{ region: Region }>();
  const region: Region = last?.region ?? env.WORKER_REGION;
  const planes = PLANE_NAMES(env, region);
  const synthetic: Attestation = {
    tenantId,
    region,
    d1Database: planes.d1Database,
    r2Bucket: planes.r2Bucket,
    kvNamespace: planes.kvNamespace,
    regulators: REGULATORS_BY_REGION[region],
    lastVerifiedAt: Math.floor(Date.now() / 1000),
    attestationHash: "synthetic",
  };
  return Response.json({ ok: true, attestation: synthetic, source: "synthetic" });
};
