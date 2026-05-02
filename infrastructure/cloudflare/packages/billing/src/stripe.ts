/**
 * Stripe abstraction. Two implementations:
 *
 *   - `StubStripe` — deterministic, no network. Used in dev/test and any
 *     environment without `STRIPE_SECRET_KEY`. Returns synthetic ids that
 *     callers treat exactly like real Stripe ids.
 *
 *   - `RealStripe` — small REST wrapper around the Stripe API. Avoids the
 *     official SDK because it pulls in Node-specific code; instead we POST
 *     `application/x-www-form-urlencoded` directly. The set of methods we
 *     need is small enough that this is simpler than a vendored SDK.
 *
 * Webhook signature verification is implemented in `verifyStripeSignature`
 * using the same `t=...,v1=...` scheme Stripe documents.
 */

import type { StripeSecrets } from "@gefi/shared-types";

export interface CheckoutSessionInput {
  customerEmail: string;
  tenantId: string;
  /** Stripe price id (lookup_key resolved by caller). */
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
  metadata?: Record<string, string>;
}

export interface CheckoutSession {
  id: string;
  url: string;
  customerId: string;
}

export interface PortalLinkInput {
  customerId: string;
  returnUrl: string;
}

export interface PortalLink {
  url: string;
}

export interface ConnectOnboardingLinkInput {
  developerTenantId: string;
  email: string;
  returnUrl: string;
  refreshUrl: string;
}

export interface ConnectOnboardingLink {
  accountId: string;
  url: string;
}

export interface StripeClient {
  createCheckoutSession(input: CheckoutSessionInput): Promise<CheckoutSession>;
  createPortalLink(input: PortalLinkInput): Promise<PortalLink>;
  createConnectOnboarding(input: ConnectOnboardingLinkInput): Promise<ConnectOnboardingLink>;
  /** Indicates whether this client makes live network calls. */
  readonly live: boolean;
}

function synthId(prefix: string, seed: string): string {
  // 24-char base16 chunk derived from seed → deterministic per-input.
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const tail = h.toString(16).padStart(8, "0").repeat(3).slice(0, 24);
  return `${prefix}_${tail}`;
}

export class StubStripe implements StripeClient {
  readonly live = false;
  async createCheckoutSession(input: CheckoutSessionInput): Promise<CheckoutSession> {
    const customerId = synthId("cus", input.customerEmail);
    const id = synthId("cs", `${input.tenantId}:${input.priceId}`);
    const url = `https://stub.stripe.local/checkout/${id}`;
    return { id, url, customerId };
  }
  async createPortalLink(input: PortalLinkInput): Promise<PortalLink> {
    return { url: `https://stub.stripe.local/portal/${input.customerId}` };
  }
  async createConnectOnboarding(input: ConnectOnboardingLinkInput): Promise<ConnectOnboardingLink> {
    const accountId = synthId("acct", input.developerTenantId);
    return { accountId, url: `https://stub.stripe.local/connect/${accountId}` };
  }
}

const STRIPE_API = "https://api.stripe.com/v1";

function formEncode(obj: Record<string, string | number | boolean | undefined>): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  }
  return parts.join("&");
}

export class RealStripe implements StripeClient {
  readonly live = true;
  private readonly secretKey: string;
  private readonly connectClientId: string | undefined;
  private readonly taxEnabled: boolean;

  constructor(secrets: Pick<StripeSecrets, "STRIPE_SECRET_KEY" | "STRIPE_CONNECT_CLIENT_ID" | "STRIPE_TAX_ENABLED">) {
    if (!secrets.STRIPE_SECRET_KEY) throw new Error("stripe_secret_missing");
    this.secretKey = secrets.STRIPE_SECRET_KEY;
    this.connectClientId = secrets.STRIPE_CONNECT_CLIENT_ID;
    this.taxEnabled = secrets.STRIPE_TAX_ENABLED === "true";
  }

  private async post<T>(path: string, body: Record<string, string | number | boolean | undefined>): Promise<T> {
    const res = await fetch(`${STRIPE_API}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formEncode(body),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`stripe_error:${res.status}:${txt.slice(0, 240)}`);
    }
    return (await res.json()) as T;
  }

  async createCheckoutSession(input: CheckoutSessionInput): Promise<CheckoutSession> {
    const body: Record<string, string | number | boolean | undefined> = {
      mode: "subscription",
      "line_items[0][price]": input.priceId,
      "line_items[0][quantity]": 1,
      customer_email: input.customerEmail,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      "metadata[tenant_id]": input.tenantId,
      automatic_tax_enabled: this.taxEnabled,
    };
    if (input.trialDays && input.trialDays > 0) {
      body["subscription_data[trial_period_days]"] = input.trialDays;
    }
    if (input.metadata) {
      for (const [k, v] of Object.entries(input.metadata)) {
        body[`metadata[${k}]`] = v;
      }
    }
    const out = await this.post<{ id: string; url: string; customer: string }>("/checkout/sessions", body);
    return { id: out.id, url: out.url, customerId: out.customer };
  }

  async createPortalLink(input: PortalLinkInput): Promise<PortalLink> {
    const out = await this.post<{ url: string }>("/billing_portal/sessions", {
      customer: input.customerId,
      return_url: input.returnUrl,
    });
    return { url: out.url };
  }

  async createConnectOnboarding(input: ConnectOnboardingLinkInput): Promise<ConnectOnboardingLink> {
    if (!this.connectClientId) throw new Error("stripe_connect_not_configured");
    const account = await this.post<{ id: string }>("/accounts", {
      type: "express",
      email: input.email,
      "metadata[tenant_id]": input.developerTenantId,
    });
    const link = await this.post<{ url: string }>("/account_links", {
      account: account.id,
      type: "account_onboarding",
      return_url: input.returnUrl,
      refresh_url: input.refreshUrl,
    });
    return { accountId: account.id, url: link.url };
  }
}

export function resolveStripe(secrets: StripeSecrets): StripeClient {
  if (secrets.STRIPE_SECRET_KEY) return new RealStripe(secrets);
  return new StubStripe();
}

/**
 * Verify a Stripe webhook signature. Stripe sends a `Stripe-Signature`
 * header of the form `t=<timestamp>,v1=<sig>[,v0=<sig>]` where `<sig>` is
 * `HMAC-SHA256(secret, t + "." + body)`. We compute and compare in
 * constant time. Returns `true` iff the signature is valid AND the
 * timestamp is within `toleranceSec` of `nowSec`.
 */
export async function verifyStripeSignature(args: {
  payload: string;
  header: string;
  secret: string;
  nowSec?: number;
  toleranceSec?: number;
}): Promise<boolean> {
  const tolerance = args.toleranceSec ?? 300;
  const now = args.nowSec ?? Math.floor(Date.now() / 1000);
  const parts = args.header.split(",").map((p) => p.trim());
  let t: number | null = null;
  const v1: string[] = [];
  for (const p of parts) {
    const eq = p.indexOf("=");
    if (eq < 0) continue;
    const k = p.slice(0, eq);
    const v = p.slice(eq + 1);
    if (k === "t") t = Number(v);
    else if (k === "v1") v1.push(v);
  }
  if (t === null || !Number.isFinite(t)) return false;
  if (Math.abs(now - t) > tolerance) return false;
  if (v1.length === 0) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(args.secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(`${t}.${args.payload}`));
  const expected = [...new Uint8Array(sigBuf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return v1.some((s) => constantTimeEqual(s, expected));
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

/**
 * Compute a stub signature header — used by tests that exercise the
 * verification path end-to-end without a real Stripe webhook.
 */
export async function signStripePayload(payload: string, secret: string, ts: number): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`${ts}.${payload}`));
  const hex = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `t=${ts},v1=${hex}`;
}
