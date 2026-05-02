/**
 * POST /v1/auth/onboard — first-time tenant + membership creation.
 *
 * Called once per user, immediately after they sign up via Auth0. The
 * Auth0 JWT issued at signup contains only the standard claims; the
 * client posts the user's chosen `jurisdiction`, `entity_type`,
 * `display_name` and `subscription_tier` here, and we:
 *
 *   1. Create a `tenants` row with status="pending_kyc".
 *   2. Create the matching `users` row keyed by `auth0_sub`.
 *   3. Create a `memberships` row promoting the user to `admin` of the
 *      new tenant.
 *   4. Tell the caller the tenant id + slug. The caller must then ask
 *      Auth0 to refresh the user's tokens — the next JWT will include
 *      the new tenant_id / jurisdiction / entity_type claims (set by the
 *      Auth0 Action documented in AUTH0-SETUP.md).
 *
 * This endpoint is idempotent on the (auth0_sub, jurisdiction) pair:
 * calling it twice with the same Auth0 user returns the existing tenant.
 */

import { requireLooseAuth } from "../../middleware/auth.js";
import { Auth0Management, type GefiAppMetadata } from "@gefi/auth/management";
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

  // Write the GeFi claims onto Auth0 `app_metadata.gefi` via the
  // Management API. The post-login Action (see AUTH0-SETUP.md §5)
  // copies app_metadata.gefi onto every subsequent token, so the
  // user's NEXT access token will carry the claims that
  // `requireAuth` expects (`tenant_id`, `jurisdiction`, etc.). Their
  // CURRENT token is unchanged, which is why the response below
  // sets `requires_token_refresh: true` — the client must refresh
  // before calling `/v1/kyc/start`.
  //
  // M2M secrets are optional: in dev/staging without them we just
  // log + continue (the post-login Action will still hydrate claims
  // on next login from D1 fall-back), but in prod the operator
  // should configure them. Failures here are NEVER fatal to onboard
  // (D1 is the source of truth) — the user can re-attempt the
  // refresh path until the claims propagate.
  const gefiClaims: GefiAppMetadata = {
    tenant_id: tenantId,
    jurisdiction: body.jurisdiction,
    entity_type: body.entity_type,
    subscription_tier: subTier,
    kyc_tier: "none",
    roles: ["admin"],
  };
  let appMetadataWritten = false;
  if (rc.env.AUTH0_M2M_CLIENT_ID && rc.env.AUTH0_M2M_CLIENT_SECRET) {
    try {
      const mgmt = new Auth0Management(
        rc.env.AUTH0_DOMAIN,
        rc.env.AUTH0_M2M_CLIENT_ID,
        rc.env.AUTH0_M2M_CLIENT_SECRET,
        rc.env.CACHE,
      );
      await mgmt.updateAppMetadata(principal.sub, gefiClaims);
      appMetadataWritten = true;
    } catch (err) {
      console.error("[gefi-api] auth0 app_metadata write failed", err);
    }
  } else if (rc.env.ENVIRONMENT === "prod") {
    // Loud warning: in prod we want the M2M wired up so claim
    // propagation is immediate. The user can still complete
    // onboarding at next login, but it's a misconfiguration.
    console.warn("[gefi-api] AUTH0_M2M_CLIENT_ID/SECRET missing in prod; relying on post-login Action only");
  }

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
      // True iff the backend wrote `app_metadata.gefi` directly. When
      // false, the Auth0 post-login Action will pick the claims up
      // from D1 on next login; the user just needs to refresh.
      app_metadata_written: appMetadataWritten,
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
