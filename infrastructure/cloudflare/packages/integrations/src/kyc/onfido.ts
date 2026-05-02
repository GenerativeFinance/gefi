/**
 * Onfido provider (individual KYC).
 *
 * Today this stubs out the actual HTTP call shape so the API contract is
 * locked in; real network calls are wired up against the live Onfido API
 * during the bootstrap step in `infrastructure/cloudflare/AUTH0-SETUP.md`.
 *
 * What's *real* here:
 *   - the constructor signature accepts `apiToken` from `env.ONFIDO_API_TOKEN`
 *   - `parseWebhook` performs a constant-time HMAC-SHA256 signature check
 *     against the X-SHA2-Signature header Onfido sends
 *
 * What's stubbed:
 *   - `startSession` returns a session ref derived from the subject; the
 *     real implementation does `POST /v3.6/applicants` + `POST /v3.6/sdk_token`
 *     against `api.{eu,us}.onfido.com` and returns the SDK token.
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
  ) {}

  /** Onfido API base URL for this provider's region. */
  private get apiBase(): string {
    return `https://api.${this.region}.onfido.com/v3.6`;
  }

  /** Authorization header used by the live HTTP path; tests don't read this. */
  private authHeader(): string {
    return `Token token=${this.apiToken}`;
  }

  async startSession(subject: KycSubject, requestedTier: KycTier): Promise<KycSession> {
    // Stubbed for now — real impl posts to `${this.apiBase}/applicants` with
    // `this.authHeader()` and returns the SDK token. The contract below
    // mirrors what we'll store in D1 either way.
    void this.apiBase;
    void this.authHeader;
    const providerSessionId = `onfido_${subject.internalRef}_${requestedTier}`;
    return {
      provider: this.name,
      providerSessionId,
      hostedUrl: `https://onfido.app/${this.region}/session/${providerSessionId}`,
      expiresAt: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
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
