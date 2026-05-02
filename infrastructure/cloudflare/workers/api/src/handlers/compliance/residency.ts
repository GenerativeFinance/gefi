/**
 * `GET /v1/compliance/residency` — proxy to `gefi-compliance` for the
 * authenticated tenant's residency attestation. Returns the customer-facing
 * data-plane breakdown (D1 / R2 / KV identifiers + applicable regulators).
 */

import { requireAuth } from "../../middleware/auth.js";
import { complianceGet } from "../../lib/compliance-client.js";
import type { Handler } from "../../router.js";

interface ResidencyResponse {
  ok: boolean;
  attestation?: {
    tenantId: string;
    region: string;
    d1Database: string;
    r2Bucket: string;
    kvNamespace: string;
    regulators: string[];
    lastVerifiedAt: number;
    attestationHash: string;
  };
  source?: string;
  error?: string;
}

export const residencyHandler: Handler = async (rc) => {
  const auth = requireAuth(rc);
  if (auth.response) return auth.response;
  const principal = auth.claims;

  const data = await complianceGet<ResidencyResponse>(
    rc.env,
    `/residency/${encodeURIComponent(principal.tenant_id)}`,
  );
  if (!data || !data.ok || !data.attestation) {
    return Response.json({ ok: false, error: "residency_unavailable" }, { status: 503 });
  }
  return Response.json({ ok: true, attestation: data.attestation, source: data.source });
};
