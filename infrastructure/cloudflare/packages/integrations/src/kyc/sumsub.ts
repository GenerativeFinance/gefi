/**
 * Sumsub provider — business + individual KYC/KYB.
 *
 * Wired against Sumsub's REST API (https://docs.sumsub.com/reference).
 * What's *real* here:
 *   - constructor accepts `appToken` (`X-App-Token` header) + `secretKey`
 *     (HMAC-SHA256 of every request body — Sumsub uses the same secret
 *     for outbound webhook signing too).
 *   - `parseWebhook` performs a constant-time HMAC-SHA256 check against
 *     the `X-Payload-Digest` header (Sumsub's documented signing scheme
 *     — `X-Payload-Digest-Alg: HMAC_SHA256_HEX`).
 *   - `parseWebhook` maps Sumsub's `reviewResult.reviewAnswer` (GREEN /
 *     RED / YELLOW) onto our provider-agnostic outcome.
 *
 * What's stubbed:
 *   - `startSession` returns a deterministic session ref so the API
 *     contract is locked in. The live implementation does
 *     `POST /resources/applicants` (creating the applicant) followed
 *     by `POST /resources/sdkIntegrations/levels/{level}/websdkLink`
 *     (generating the hosted URL) — both signed with the same HMAC
 *     used in `parseWebhook`. Wiring those calls is the bootstrap
 *     step in `infrastructure/cloudflare/AUTH0-SETUP.md`.
 *
 * Sumsub is a one-stop shop covering individuals (KYC) and companies
 * (KYB) so we use it for `institutional` and `data_provider`. For
 * individuals we still prefer Onfido (cheaper at our scale) but Sumsub
 * is a valid fallback.
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

/** Sumsub level keys we use. Map onto our `KycTier`. */
const LEVEL_FOR_TIER: Record<Exclude<KycTier, "none">, string> = {
  basic: "basic-kyc-level",
  standard: "standard-kyc-level",
  enhanced: "enhanced-kyb-level",
};

/** Reverse map for webhook parsing — Sumsub returns the level name. */
const TIER_FOR_LEVEL: Record<string, KycTier> = {
  "basic-kyc-level": "basic",
  "standard-kyc-level": "standard",
  "enhanced-kyb-level": "enhanced",
};

export class SumsubKycProvider implements KycProvider {
  readonly name = "sumsub";

  constructor(
    private readonly appToken: string,
    private readonly secretKey: string,
    private readonly region: "eu" | "us",
  ) {}

  /** Sumsub API base — single global endpoint, but we tag region for logging. */
  private get apiBase(): string {
    return "https://api.sumsub.com";
  }

  /** Headers used by the live HTTP path. */
  private async signedHeaders(method: string, path: string, body: string): Promise<Record<string, string>> {
    const ts = Math.floor(Date.now() / 1000).toString();
    const payload = `${ts}${method.toUpperCase()}${path}${body}`;
    const sig = hex(await hmacSha256(this.secretKey, payload));
    return {
      "X-App-Token": this.appToken,
      "X-App-Access-Sig": sig,
      "X-App-Access-Ts": ts,
      "content-type": "application/json",
    };
  }

  async startSession(subject: KycSubject, requestedTier: KycTier): Promise<KycSession> {
    // Stubbed for now — see file header. The live implementation does
    // two POSTs to `${this.apiBase}` using `signedHeaders()` and
    // returns the websdkLink. The contract below mirrors the live shape.
    void this.apiBase;
    void this.signedHeaders;
    const level = LEVEL_FOR_TIER[requestedTier === "none" ? "basic" : requestedTier];
    const providerSessionId = `sumsub_${subject.internalRef}_${level}`;
    return {
      provider: this.name,
      providerSessionId,
      hostedUrl: `https://api.sumsub.com/idensic/l/${this.region}/${providerSessionId}`,
      expiresAt: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    };
  }

  async parseWebhook(rawBody: string, signatureHeader: string | null): Promise<KycResult> {
    if (!signatureHeader) throw new Error("sumsub_webhook_signature_missing");
    const expected = await hmacSha256(this.secretKey, rawBody);
    const actual = fromHex(signatureHeader.trim().replace(/^sha256=/i, ""));
    if (!timingSafeEqual(expected, actual)) {
      throw new Error("sumsub_webhook_signature_invalid");
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      throw new Error("sumsub_webhook_malformed");
    }
    const obj = parsed as {
      applicantId?: string;
      inspectionId?: string;
      externalUserId?: string;
      levelName?: string;
      reviewResult?: { reviewAnswer?: "GREEN" | "RED" | "YELLOW"; rejectLabels?: string[] };
    };
    const sessionId = obj.applicantId ?? obj.inspectionId;
    if (!sessionId) throw new Error("sumsub_webhook_missing_session_id");
    const answer = obj.reviewResult?.reviewAnswer;
    const outcome: KycResult["outcome"] =
      answer === "GREEN" ? "approved" : answer === "RED" ? "declined" : "review";
    const achievedTier: KycTier =
      outcome === "approved"
        ? (obj.levelName ? TIER_FOR_LEVEL[obj.levelName] ?? "standard" : "standard")
        : "basic";
    return {
      provider: this.name,
      providerSessionId: sessionId,
      outcome,
      achievedTier,
      reasonCodes: obj.reviewResult?.rejectLabels ?? [],
      raw: parsed,
    };
  }

  /** Exposed for tests so we can produce a valid signature header. */
  static async signForTest(secret: string, body: string): Promise<string> {
    return hex(await hmacSha256(secret, body));
  }
}
