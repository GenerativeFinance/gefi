/**
 * GET /v1/auth/me — return the currently authenticated principal.
 *
 * The single most-called endpoint in the dashboard. Returns the verified
 * claims (tenant_id, jurisdiction, roles, KYC tier) plus a small slice
 * of D1 data (tenant display name, status). 401 if no token, 403 if the
 * user hasn't onboarded.
 */

import { requireAuth } from "../../middleware/auth.js";
import type { Handler } from "../../router.js";

interface TenantSlice {
  id: string;
  slug: string;
  display_name: string;
  status: string;
  subscription_tier: string;
  kyc_tier: string;
}

export const meHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["read", "user"]);
  if (auth.response) return auth.response;
  const c = auth.claims;

  const tenantRow = await rc.env.DB.prepare(
    "SELECT id, slug, display_name, status, subscription_tier, kyc_tier FROM tenants WHERE id = ?",
  )
    .bind(c.tenant_id)
    .first<TenantSlice>();

  return Response.json({
    ok: true,
    user: {
      sub: c.sub,
      email: c.email ?? null,
      jurisdiction: c.jurisdiction,
      tenant_id: c.tenant_id,
      entity_type: c.entity_type,
      roles: c.roles,
      kyc_tier: c.kyc_tier ?? null,
      subscription_tier: c.subscription_tier ?? null,
    },
    tenant: tenantRow ?? null,
  });
};
