/**
 * POST /v1/auth/onboard — first-time tenant + membership creation.
 *
 * Called once per user, immediately after they sign up. The signup JWT
 * carries only standard claims; the client posts the user's chosen
 * `jurisdiction`, `entity_type`, `display_name` and `subscription_tier`
 * here, and we:
 *
 *   1. Create a `tenants` row with status="pending_kyc".
 *   2. Create the matching `users` row keyed on the principal `sub`
 *      (the `users.auth0_sub` column name is preserved for schema
 *      continuity; it now holds whatever subject id the forthcoming
 *      `gefi-auth` Worker mints).
 *   3. Create a `memberships` row promoting the user to `admin` of the
 *      new tenant.
 *   4. Tell the caller the tenant id + slug. The caller must then
 *      refresh their token so subsequent requests carry the new
 *      `tenant_id` / `jurisdiction` / `entity_type` claims.
 *
 * Claim hydration onto the identity provider used to happen here via
 * the Auth0 Management M2M client; that path was removed when GeFi
 * pivoted off Auth0. The new `gefi-auth` Worker (TBD) will own claim
 * propagation directly from D1 — no out-of-band metadata write needed.
 *
 * This endpoint is idempotent on the (subject, jurisdiction) pair:
 * calling it twice with the same user returns the existing tenant.
 */

import { requireLooseAuth } from "../../middleware/auth.js";
import { subscriptionToKycTier } from "@gefi/auth/kyc-tiers";
import { emitComplianceEvent } from "../../lib/compliance-client.js";
import type { Handler } from "../../router.js";
import type { EntityType, Region, SubscriptionTier } from "@gefi/shared-types";

interface OnboardBody {
  jurisdiction: Region;
  entity_type: EntityType;
  display_name: string;
  subscription_tier?: SubscriptionTier;
  /** Marketing slug; auto-generated from display_name if absent. */
  slug?: string;
  email?: string;
}

const VALID_JURISDICTIONS: Region[] = ["eu", "us"];
const VALID_ENTITY: EntityType[] = ["retail", "professional", "institutional", "data_provider"];
const VALID_TIER: SubscriptionTier[] = ["free", "starter", "pro", "enterprise"];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export const onboardHandler: Handler = async (rc) => {
  const auth = requireLooseAuth(rc);
  if (auth.response) return auth.response;
  const principal = auth.claims;

  let body: OnboardBody;
  try {
    body = (await rc.request.json()) as OnboardBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  if (!VALID_JURISDICTIONS.includes(body.jurisdiction)) {
    return Response.json({ ok: false, error: "invalid_jurisdiction" }, { status: 400 });
  }
  if (!VALID_ENTITY.includes(body.entity_type)) {
    return Response.json({ ok: false, error: "invalid_entity_type" }, { status: 400 });
  }
  const subTier = body.subscription_tier ?? "free";
  if (!VALID_TIER.includes(subTier)) {
    return Response.json({ ok: false, error: "invalid_subscription_tier" }, { status: 400 });
  }
  if (!body.display_name || body.display_name.trim().length < 2) {
    return Response.json({ ok: false, error: "invalid_display_name" }, { status: 400 });
  }
  // On a regional sibling, the chosen jurisdiction MUST match WORKER_REGION
  // — onboarding is the one place where the user picks their data plane,
  // so we can't rely on the user JWT (which has no jurisdiction yet).
  if (REGIONAL_HOST_RE.test(rc.env.API_PUBLIC_URL) && body.jurisdiction !== rc.env.WORKER_REGION) {
    return Response.json(
      { ok: false, error: "wrong_region_for_onboarding", expected: rc.env.WORKER_REGION },
      { status: 400 },
    );
  }

  // Look up an existing tenant for this user first (idempotency).
  const existing = await rc.env.DB.prepare(
    `SELECT t.id, t.slug FROM tenants t
       JOIN memberships m ON m.tenant_id = t.id
       JOIN users u       ON u.id = m.user_id
      WHERE u.auth0_sub = ?
      LIMIT 1`,
  )
    .bind(principal.sub)
    .first<{ id: string; slug: string }>();
  if (existing) {
    return Response.json({ ok: true, idempotent: true, tenant: existing }, { status: 200 });
  }

  const now = Math.floor(Date.now() / 1000);
  const tenantId = crypto.randomUUID();
  const userId = crypto.randomUUID();
  const baseSlug = slugify(body.slug ?? body.display_name);
  // Append a short suffix so collisions on common names don't error.
  const slug = `${baseSlug}-${tenantId.slice(0, 6)}`;

  try {
    await rc.env.DB.batch([
      rc.env.DB.prepare(
        `INSERT INTO tenants (id, slug, display_name, jurisdiction, entity_type, subscription_tier, kyc_tier, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, 'none', 'pending_kyc', ?, ?)`,
      ).bind(tenantId, slug, body.display_name.trim(), body.jurisdiction, body.entity_type, subTier, now, now),
      rc.env.DB.prepare(
        `INSERT INTO users (id, auth0_sub, email, email_verified, primary_tenant_id, jurisdiction, mfa_enrolled, passkey_count, created_at)
           VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?)`,
      ).bind(
        userId,
        principal.sub,
        body.email ?? principal.email ?? "",
        principal.email_verified ? 1 : 0,
        tenantId,
        body.jurisdiction,
        now,
      ),
      rc.env.DB.prepare(
        `INSERT INTO memberships (tenant_id, user_id, jurisdiction, roles_json, created_at) VALUES (?, ?, ?, ?, ?)`,
      ).bind(tenantId, userId, body.jurisdiction, JSON.stringify(["admin"]), now),
    ]);
  } catch (err) {
    console.error("[gefi-api] onboard insert failed", err);
    return Response.json({ ok: false, error: "storage_failed" }, { status: 502 });
  }

  // Claim hydration onto the identity provider used to happen here
  // (PATCH `app_metadata.gefi` on the Auth0 user via the M2M
  // Management API). That path was removed when GeFi pivoted off
  // Auth0. The new `gefi-auth` Worker will read these claims directly
  // from D1 (`tenants` + `memberships`) when minting the next access
  // token, so no out-of-band write is required. The response still
  // sets `requires_token_refresh: true` — the client must refresh
  // before calling `/v1/kyc/start` so the new token carries the
  // freshly-created tenant claims.

  // Emit `tenant_onboarded` to the compliance Worker. Best-effort: a
  // transient binding failure must not block onboarding (the tenant
  // row is the durable source of truth; the compliance event can be
  // backfilled). We pass `entity_type` + `subscription_tier` in the
  // payload because some MiFID/FCA rules fire only for institutional
  // / enhanced-tier tenants.
  await emitComplianceEvent(rc.env, {
    kind: "tenant_onboarded",
    tenantId,
    region: body.jurisdiction,
    userId: principal.sub,
    severity: "info",
    payload: {
      entityType: body.entity_type,
      subscriptionTier: subTier,
      kycTier: "none",
    },
  });

  return Response.json(
    {
      ok: true,
      tenant: { id: tenantId, slug },
      // Always true — the user's CURRENT token was issued before the
      // tenant existed, so it has no GeFi claims. The frontend MUST
      // fetch a fresh token (silent refresh / interactive login)
      // before calling `/v1/kyc/start`, or that call will 403 with
      // `auth_onboarding_incomplete`.
      requires_token_refresh: true,
      next: {
        // The client should call /v1/kyc/start next if the chosen tier
        // requires KYC (see kycSatisfies / subscriptionToKycTier).
        kyc_required: subscriptionToKycTier(subTier) !== "none",
        mfa_required: subTier === "pro" || subTier === "enterprise",
      },
    },
    { status: 201 },
  );
};

const REGIONAL_HOST_RE = /^https:\/\/(eu|us)\.api\./;
