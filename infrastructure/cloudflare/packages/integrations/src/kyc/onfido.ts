/**
 * Onfido provider (individual KYC).
 *
 * Real HTTP integration:
 *   - `startSession` does the documented two-step Onfido flow:
 *       1. `POST /v3.6/applicants`     → create the applicant.
 *       2. `POST /v3.6/sdk_token`      → mint an SDK token bound to that
 *                                       applicant + our SDK referrer.
 *     The applicant id becomes our `providerSessionId` (so webhooks
 *     correlate back to the same row), and the SDK token is embedded
 *     in the `hostedUrl` returned to the caller. The dashboards (and
 *     the Jekyll onboarding page) load Onfido's web SDK with that
 *     token to render the verification flow inline.
 *   - `parseWebhook` performs constant-time HMAC-SHA256 verification
 *     of the `X-SHA2-Signature` header Onfido attaches.
 *
 * `fetchImpl` is injected for tests; production callers use the
 * default global `fetch`.
 */

import type { KycProvider, KycResult, KycSession, KycSubject } from "./types.js";
import type { KycTier } from "@gefi/shared-types";

const encoder = new TextEncoder();

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) return false;
  let diff = 0;
  for (let i = 0; i < a.byteLength; i++) {
    const av = a[i];
    const bv = b[i];
    if (av === undefined || bv === undefined) return false;
    diff |= av ^ bv;
  }
  return diff === 0;
}

async function hmacSha256(secret: string, body: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return new Uint8Array(sig);
}

function hex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    const b = bytes[i] ?? 0;
    out += b.toString(16).padStart(2, "0");
  }
  return out;
}

function fromHex(s: string): Uint8Array {
  const out = new Uint8Array(s.length / 2);
  for (let i = 0; i < out.byteLength; i++) {
    out[i] = parseInt(s.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export class OnfidoKycProvider implements KycProvider {
  readonly name = "onfido";
  constructor(
    private readonly apiToken: string,
    private readonly webhookSecret: string,
    private readonly region: "eu" | "us",
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  /** Onfido API base URL for this provider's region. */
  private get apiBase(): string {
    return `https://api.${this.region}.onfido.com/v3.6`;
  }

  /** Authorization header used by every Onfido call. */
  private authHeader(): string {
    return `Token token=${this.apiToken}`;
  }

  async startSession(subject: KycSubject, _requestedTier: KycTier): Promise<KycSession> {
    // Step 1 — create the applicant. Onfido needs at least first_name +
    // last_name; we accept structured details when the caller provides
    // them, otherwise derive a passable placeholder from the internal
    // ref so the call still succeeds (the user re-enters their name in
    // the SDK regardless).
    const firstName = subject.details["firstName"] ?? "GeFi";
    const lastName = subject.details["lastName"] ?? subject.internalRef.slice(-12);
    const applicantBody: Record<string, unknown> = { first_name: firstName, last_name: lastName };
    if (subject.details["email"]) applicantBody["email"] = subject.details["email"];

    const applicantRes = await this.fetchImpl(`${this.apiBase}/applicants`, {
      method: "POST",
      headers: {
        authorization: this.authHeader(),
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(applicantBody),
    });
    if (!applicantRes.ok) {
      throw new Error(`onfido_applicant_create_failed status=${applicantRes.status}`);
    }
    const applicant = (await applicantRes.json()) as { id?: string };
    if (!applicant.id) throw new Error("onfido_applicant_missing_id");

    // Step 2 — mint an SDK token for this applicant. Onfido binds the
    // token to a referrer pattern; `*://*.gefi.io/*` covers all our
    // host variants (apex + dashboards + onboarding subdomain).
    const tokenRes = await this.fetchImpl(`${this.apiBase}/sdk_token`, {
      method: "POST",
      headers: {
        authorization: this.authHeader(),
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ applicant_id: applicant.id, referrer: "*://*.gefi.io/*" }),
    });
    if (!tokenRes.ok) {
      throw new Error(`onfido_sdk_token_failed status=${tokenRes.status}`);
    }
    const tokenData = (await tokenRes.json()) as { token?: string };
    if (!tokenData.token) throw new Error("onfido_sdk_token_missing");

    // Onfido SDK tokens live for 90 minutes by default.
    const expiresAt = Math.floor(Date.now() / 1000) + 90 * 60;
    return {
      provider: this.name,
      providerSessionId: applicant.id,
      // The dashboards load Onfido's hosted SDK at this URL with the
      // token mounted as a query string. Onfido also exposes a token
      // exchange for their hosted "Studio" flow at `id.onfido.com`;
      // we keep the SDK URL pattern because it works for both the
      // embedded and redirect-style flows.
      hostedUrl: `https://onfido.com/sdk/?token=${encodeURIComponent(tokenData.token)}`,
      expiresAt,
    };
  }

  async parseWebhook(rawBody: string, signatureHeader: string | null): Promise<KycResult> {
    if (!signatureHeader) throw new Error("onfido_webhook_signature_missing");
    const expected = await hmacSha256(this.webhookSecret, rawBody);
    const actual = fromHex(signatureHeader.replace(/^sha256=/i, "").trim());
    if (!timingSafeEqual(expected, actual)) {
      throw new Error("onfido_webhook_signature_invalid");
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      throw new Error("onfido_webhook_malformed");
    }
    const obj = parsed as { payload?: { resource_type?: string; object?: { id?: string; status?: string } } };
    const sessionId = obj.payload?.object?.id;
    const status = obj.payload?.object?.status;
    if (!sessionId || !status) throw new Error("onfido_webhook_missing_fields");
    const outcome: KycResult["outcome"] =
      status === "complete" ? "approved" : status === "withdrawn" ? "declined" : "review";
    return {
      provider: this.name,
      providerSessionId: sessionId,
      outcome,
      // Onfido's "report" shape doesn't 1:1 map to our tiers; the live
      // implementation will derive the achieved tier from the report
      // breakdown. For now we mirror "complete" → "standard".
      achievedTier: outcome === "approved" ? "standard" : "basic",
      reasonCodes: [],
      raw: parsed,
    };
  }

  /** Exposed for tests so we can produce a valid signature header. */
  static async signForTest(secret: string, body: string): Promise<string> {
    return hex(await hmacSha256(secret, body));
  }
}
