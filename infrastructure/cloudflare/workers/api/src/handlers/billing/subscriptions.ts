/**
 * Billing handlers.
 *
 *   POST /v1/billing/subscriptions          — create a subscription (tier or per-model)
 *   GET  /v1/billing/portal                 — Stripe billing portal URL
 *   POST /v1/billing/connect/onboarding     — Stripe Connect Express onboarding link
 *   GET  /v1/entitlements                   — list current entitlements + remaining quota
 *   POST /v1/billing/webhook                — Stripe webhook (HMAC-SHA256 verified)
 */

import {
  buildDunningEmail,
  consume as _consume,
  listEntitlements,
  resolveMailer,
  resolveStripe,
  seedTierEntitlements,
  signStripePayload as _signStripePayload,
  tierOrThrow,
  verifyStripeSignature,
} from "@gefi/billing";
import type { SubscriptionTier } from "@gefi/shared-types";
import { requireAuth } from "../../middleware/auth.js";
import { emitComplianceEvent } from "../../lib/compliance-client.js";
import type { Handler } from "../../router.js";

function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

interface SubscribeBody {
  kind?: "tier" | "model";
  tier?: SubscriptionTier;
  model_id?: string;
  price_id?: string;
}

export const createSubscriptionHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["create", "subscription"]);
  if (auth.response) return auth.response;
  const c = auth.claims;

  let body: SubscribeBody;
  try {
    body = (await rc.request.json()) as SubscribeBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  if (body.kind !== "tier" && body.kind !== "model") {
    return Response.json({ ok: false, error: "invalid_kind" }, { status: 400 });
  }
  if (body.kind === "tier" && !body.tier) {
    return Response.json({ ok: false, error: "missing_tier" }, { status: 400 });
  }
  if (body.kind === "model" && !body.model_id) {
    return Response.json({ ok: false, error: "missing_model_id" }, { status: 400 });
  }

  const stripe = resolveStripe(rc.env);
  let priceId = body.price_id;
  let monthlyCents = 0;
  let trialDays = 0;
  if (body.kind === "tier") {
    const tier = tierOrThrow(body.tier!);
    monthlyCents = tier.monthlyCents;
    trialDays = tier.trialDays;
    // Map tier → env-configured Stripe price id. The `free` tier has no
    // Stripe price (entitlements are seeded directly without checkout).
    // In production with a real Stripe key, a missing tier price is a
    // hard 503 — we won't quietly hand a synthetic id to live Stripe.
    const tierPrice =
      tier.tier === "starter"
        ? rc.env.STRIPE_PRICE_STARTER
        : tier.tier === "pro"
          ? rc.env.STRIPE_PRICE_PRO
          : tier.tier === "enterprise"
            ? rc.env.STRIPE_PRICE_ENTERPRISE
            : undefined; // "free"
    if (rc.env.STRIPE_SECRET_KEY && !priceId && !tierPrice && tier.tier !== "free") {
      return Response.json(
        { ok: false, error: "tier_price_not_configured", tier: tier.tier },
        { status: 503 },
      );
    }
    // Stub path falls back to a stable synthetic id so dev/test still
    // round-trips through the StubStripe checkout flow.
    priceId = priceId ?? tierPrice ?? `price_tier_${tier.tier}`;
  } else {
    const row = await rc.env.DB.prepare("SELECT id, monthly_price_cents FROM models WHERE id = ?")
      .bind(body.model_id!)
      .first<{ id: string; monthly_price_cents: number }>();
    if (!row) return Response.json({ ok: false, error: "model_not_found" }, { status: 404 });
    monthlyCents = Number(row.monthly_price_cents);
    priceId = priceId ?? `price_model_${row.id}`;
  }

  const now = Math.floor(Date.now() / 1000);
  const session = await stripe.createCheckoutSession({
    customerEmail: c.email ?? `${c.sub}@noemail.gefi.io`,
    tenantId: c.tenant_id,
    priceId: priceId!,
    successUrl: rc.env.STRIPE_RETURN_URL ?? `${rc.env.SITE_PUBLIC_URL}/billing/success`,
    cancelUrl: `${rc.env.SITE_PUBLIC_URL}/billing/cancel`,
    trialDays: trialDays > 0 ? trialDays : undefined,
    metadata: body.kind === "model" && body.model_id ? { model_id: body.model_id } : undefined,
  });

  const subId = newId("sub");
  await rc.env.DB.prepare(
    `INSERT INTO subscriptions (id, tenant_id, jurisdiction, kind, tier, model_id, status,
     stripe_customer_id, stripe_subscription_id, trial_ends_at, current_period_end,
     monthly_price_cents, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'incomplete', ?, NULL, ?, NULL, ?, ?, ?)`,
  )
    .bind(
      subId,
      c.tenant_id,
      c.jurisdiction,
      body.kind,
      body.kind === "tier" ? body.tier : null,
      body.kind === "model" ? body.model_id : null,
      session.customerId,
      trialDays > 0 ? now + trialDays * 86400 : null,
      monthlyCents,
      now,
      now,
    )
    .run();

  // Provision tier entitlements immediately (Stripe webhook will mark
  // active later — until then quota uses the tier limits anyway).
  if (body.kind === "tier") {
    await seedTierEntitlements({ db: rc.env.DB, kv: rc.env.CACHE }, c.tenant_id, tierOrThrow(body.tier!), now);
  }

  await emitComplianceEvent(rc.env, {
    kind: "subscription_created",
    tenantId: c.tenant_id,
    region: c.jurisdiction,
    userId: c.sub,
    severity: "info",
    payload: {
      kind: body.kind,
      tier: body.tier ?? "",
      modelId: body.model_id ?? "",
      monthlyCents,
    },
  });

  return Response.json(
    { ok: true, subscriptionId: subId, checkout_url: session.url, customer_id: session.customerId },
    { status: 201 },
  );
};

export const billingPortalHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["read", "subscription"]);
  if (auth.response) return auth.response;
  const c = auth.claims;
  const row = await rc.env.DB.prepare(
    "SELECT stripe_customer_id FROM subscriptions WHERE tenant_id = ? AND stripe_customer_id IS NOT NULL ORDER BY created_at DESC LIMIT 1",
  )
    .bind(c.tenant_id)
    .first<{ stripe_customer_id: string | null }>();
  if (!row?.stripe_customer_id) {
    return Response.json({ ok: false, error: "no_customer" }, { status: 404 });
  }
  const stripe = resolveStripe(rc.env);
  const link = await stripe.createPortalLink({
    customerId: row.stripe_customer_id,
    returnUrl: rc.env.STRIPE_RETURN_URL ?? `${rc.env.SITE_PUBLIC_URL}/billing`,
  });
  return Response.json({ ok: true, url: link.url });
};

export const connectOnboardingHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["publish", "model"]);
  if (auth.response) return auth.response;
  const c = auth.claims;
  const stripe = resolveStripe(rc.env);
  try {
    const link = await stripe.createConnectOnboarding({
      developerTenantId: c.tenant_id,
      email: c.email ?? `${c.sub}@noemail.gefi.io`,
      returnUrl: `${rc.env.SITE_PUBLIC_URL}/dashboard/payouts`,
      refreshUrl: `${rc.env.SITE_PUBLIC_URL}/dashboard/payouts/refresh`,
    });
    return Response.json({ ok: true, accountId: link.accountId, url: link.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "stripe_connect_error";
    return Response.json({ ok: false, error: msg }, { status: 400 });
  }
};

export const listEntitlementsHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["read", "subscription"]);
  if (auth.response) return auth.response;
  const c = auth.claims;
  const rows = await listEntitlements({ db: rc.env.DB }, c.tenant_id);
  return Response.json({ ok: true, entitlements: rows });
};

export const stripeWebhookHandler: Handler = async (rc) => {
  // We avoid the user-JWT path: this endpoint is called by Stripe directly.
  // Auth is the HMAC signature; tenant identity comes from session metadata.
  const sig = rc.request.headers.get("Stripe-Signature");
  const body = await rc.request.text();
  const secret = rc.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    if (rc.env.ENVIRONMENT === "prod") {
      return Response.json({ ok: false, error: "webhook_not_configured" }, { status: 503 });
    }
    // In dev/test we accept bodies as-is so curl can drive the path.
  } else {
    if (!sig) return Response.json({ ok: false, error: "missing_signature" }, { status: 400 });
    const ok = await verifyStripeSignature({ payload: body, header: sig, secret });
    if (!ok) return Response.json({ ok: false, error: "invalid_signature" }, { status: 400 });
  }

  let event: { id?: string; type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(body);
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!event.id || !event.type) {
    return Response.json({ ok: false, error: "missing_event_fields" }, { status: 400 });
  }

  // Idempotency: skip if the event is already in `billing_events`.
  const existing = await rc.env.DB.prepare("SELECT id FROM billing_events WHERE id = ?")
    .bind(event.id)
    .first<{ id: string }>();
  if (existing) return Response.json({ ok: true, idempotent: true });

  const now = Math.floor(Date.now() / 1000);
  const obj = event.data?.object ?? {};
  const tenantId =
    (obj.metadata as Record<string, string> | undefined)?.tenant_id ??
    (obj.tenant_id as string | undefined) ??
    null;

  await rc.env.DB.prepare(
    `INSERT INTO billing_events (id, type, tenant_id, payload_json, processed_at) VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(event.id, event.type, tenantId, JSON.stringify(event), now)
    .run();

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const stripeSubId = (obj.id as string | undefined) ?? null;
      const status = (obj.status as string | undefined) ?? "active";
      const periodEnd = obj.current_period_end as number | undefined;
      if (tenantId && stripeSubId) {
        await rc.env.DB.prepare(
          `UPDATE subscriptions SET status = ?, stripe_subscription_id = ?, current_period_end = ?, updated_at = ?
           WHERE tenant_id = ? AND id = (SELECT id FROM subscriptions WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 1)`,
        )
          .bind(status, stripeSubId, periodEnd ?? null, now, tenantId, tenantId)
          .run();
      }
      break;
    }
    case "invoice.payment_failed": {
      const customerEmail = obj.customer_email as string | undefined;
      const amountDue = (obj.amount_due as number | undefined) ?? 0;
      if (customerEmail) {
        const mailer = resolveMailer(rc.env);
        const tmpl = buildDunningEmail({
          tenantName: tenantId ?? "Customer",
          amountCents: amountDue,
          retryUrl: `${rc.env.SITE_PUBLIC_URL}/billing`,
        });
        await mailer.send({ ...tmpl, to: customerEmail });
      }
      if (tenantId) {
        await rc.env.DB.prepare(
          `UPDATE subscriptions SET status = 'past_due', updated_at = ?
           WHERE tenant_id = ? AND id = (SELECT id FROM subscriptions WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 1)`,
        )
          .bind(now, tenantId, tenantId)
          .run();
      }
      break;
    }
    case "customer.subscription.deleted": {
      if (tenantId) {
        await rc.env.DB.prepare(
          `UPDATE subscriptions SET status = 'canceled', updated_at = ?
           WHERE tenant_id = ? AND id = (SELECT id FROM subscriptions WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 1)`,
        )
          .bind(now, tenantId, tenantId)
          .run();
      }
      break;
    }
  }

  return Response.json({ ok: true });
};
