/**
 * GET /v1/kyc/status — current KYC state for the calling tenant.
 *
 * Returns the most recent kyc_evidence row plus an aggregate of any
 * outstanding sanction_hits. The dashboard uses this to render the
 * onboarding banner ("KYC pending review", "Sanctions hit — contact
 * compliance", etc.).
 */

import { requireAuth } from "../../middleware/auth.js";
import type { Handler } from "../../router.js";

export const kycStatusHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["read", "kyc_evidence"]);
  if (auth.response) return auth.response;
  const c = auth.claims;

  const latest = await rc.env.DB.prepare(
    "SELECT id, provider, provider_session_id, requested_tier, achieved_tier, status, reason_codes_json, created_at, updated_at FROM kyc_evidence WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 1",
  )
    .bind(c.tenant_id)
    .first<{
      id: string;
      provider: string;
      provider_session_id: string;
      requested_tier: string;
      achieved_tier: string | null;
      status: string;
      reason_codes_json: string;
      created_at: number;
      updated_at: number;
    }>();

  const hits = await rc.env.DB.prepare(
    "SELECT COUNT(*) AS n FROM sanction_hits WHERE tenant_id = ? AND status IN ('pending','confirmed')",
  )
    .bind(c.tenant_id)
    .first<{ n: number }>();

  return Response.json({
    ok: true,
    kyc: latest
      ? {
          id: latest.id,
          provider: latest.provider,
          requestedTier: latest.requested_tier,
          achievedTier: latest.achieved_tier,
          status: latest.status,
          reasonCodes: JSON.parse(latest.reason_codes_json) as string[],
          createdAt: latest.created_at,
          updatedAt: latest.updated_at,
        }
      : null,
    sanctionsBlocking: (hits?.n ?? 0) > 0,
  });
};
