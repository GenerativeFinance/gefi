/**
 * POST /v1/kyc/start — begin a hosted KYC session.
 *
 * Resolves the right provider for the tenant's entity type + region,
 * starts a session at the *requested* tier (mapped from subscription
 * tier), persists the session as a `kyc_evidence` row in `pending`
 * status, and returns the hosted URL the client should redirect to.
 *
 * Idempotency: if a `pending` session already exists for this tenant
 * we return that one instead of creating a new one. Real providers
 * tolerate this — we just keep the same `provider_session_id`.
 */

import { resolveKycProvider } from "@gefi/integrations/kyc";
import { kycSatisfies, subscriptionToKycTier } from "@gefi/auth/kyc-tiers";
import { requireAuth } from "../../middleware/auth.js";
import type { Handler } from "../../router.js";

export const kycStartHandler: Handler = async (rc) => {
  // Any authenticated user starting the flow on behalf of *their own*
  // tenant is fine — KYC is a self-service step before the user gets
  // any RBAC-gated abilities. We only assert that the user has finished
  // onboarding (so we know which tenant the session belongs to).
  const auth = requireAuth(rc);
  if (auth.response) return auth.response;
  const c = auth.claims;

  const tenantRow = await rc.env.DB.prepare(
    "SELECT subscription_tier, kyc_tier, status FROM tenants WHERE id = ?",
  )
    .bind(c.tenant_id)
    .first<{ subscription_tier: "free" | "starter" | "pro" | "enterprise"; kyc_tier: "none" | "basic" | "standard" | "enhanced"; status: string }>();
  if (!tenantRow) {
    return Response.json({ ok: false, error: "tenant_not_found" }, { status: 404 });
  }

  const requestedTier = subscriptionToKycTier(tenantRow.subscription_tier);
  if (requestedTier === "none") {
    return Response.json({ ok: false, error: "kyc_not_required_for_tier" }, { status: 400 });
  }
  if (kycSatisfies(tenantRow.kyc_tier, requestedTier)) {
    return Response.json(
      { ok: true, alreadySatisfied: true, achievedTier: tenantRow.kyc_tier },
      { status: 200 },
    );
  }

  // Reuse an existing pending session if one is open.
  const existing = await rc.env.DB.prepare(
    "SELECT id, provider, provider_session_id, requested_tier FROM kyc_evidence WHERE tenant_id = ? AND status = 'pending' ORDER BY created_at DESC LIMIT 1",
  )
    .bind(c.tenant_id)
    .first<{ id: string; provider: string; provider_session_id: string; requested_tier: string }>();
  if (existing && existing.requested_tier === requestedTier) {
    return Response.json({
      ok: true,
      reused: true,
      session: { id: existing.id, provider: existing.provider, providerSessionId: existing.provider_session_id },
    });
  }

  let provider;
  try {
    provider = resolveKycProvider(c.entity_type, c.jurisdiction, rc.env);
  } catch (err) {
    console.error("[gefi-api] kyc provider unavailable", err);
    return Response.json(
      { ok: false, error: "kyc_provider_not_configured" },
      { status: 503 },
    );
  }
  const session = await provider.startSession(
    {
      internalRef: c.tenant_id,
      entity: c.entity_type,
      jurisdiction: c.jurisdiction,
      details: { email: c.email ?? "" },
    },
    requestedTier,
  );

  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  try {
    await rc.env.DB.prepare(
      `INSERT INTO kyc_evidence (id, tenant_id, user_id, jurisdiction, provider, provider_session_id, requested_tier, status, created_at, updated_at)
         VALUES (?, ?, NULL, ?, ?, ?, ?, 'pending', ?, ?)`,
    )
      .bind(id, c.tenant_id, c.jurisdiction, session.provider, session.providerSessionId, requestedTier, now, now)
      .run();
  } catch (err) {
    console.error("[gefi-api] kyc_evidence insert failed", err);
    return Response.json({ ok: false, error: "storage_failed" }, { status: 502 });
  }

  return Response.json(
    {
      ok: true,
      session: {
        id,
        provider: session.provider,
        providerSessionId: session.providerSessionId,
        hostedUrl: session.hostedUrl,
        expiresAt: session.expiresAt,
        requestedTier,
      },
    },
    { status: 201 },
  );
};
