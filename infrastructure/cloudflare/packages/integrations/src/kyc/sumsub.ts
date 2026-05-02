/**
 * Sumsub provider — business + individual KYC/KYB.
 *
 * Real HTTP integration against `api.sumsub.com`:
 *   - `startSession` does the documented two-step Sumsub flow:
 *       1. `POST /resources/applicants?levelName={level}` — create
 *          the applicant (or company, when `entity` is institutional /
 *          data_provider — Sumsub keys it on the level shape).
 *       2. `POST /resources/sdkIntegrations/levels/{level}/websdkLink`
 *          — mint a hosted Sumsub WebSDK link for the same
 *          `externalUserId` we just created.
 *   - All Sumsub calls are signed: `X-App-Token` (the token), plus
 *     `X-App-Access-Sig` = HMAC-SHA256(secret, ts + METHOD + path + body)
 *     and `X-App-Access-Ts` (the unix-second timestamp).
 *   - `parseWebhook` performs constant-time HMAC-SHA256 verification
 *     of the `X-Payload-Digest` header (header `X-Payload-Digest-Alg:
 *     HMAC_SHA256_HEX`) and maps `reviewResult.reviewAnswer`
 *     (GREEN / RED / YELLOW) onto our provider-agnostic outcome.
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
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  /** Sumsub has a single global API endpoint. */
  private get apiBase(): string {
    return "https://api.sumsub.com";
  }

  /** Compute Sumsub's three-piece signed-request headers. */
  private async signedHeaders(method: string, path: string, body: string): Promise<Record<string, string>> {
    const ts = Math.floor(Date.now() / 1000).toString();
    const payload = `${ts}${method.toUpperCase()}${path}${body}`;
    const sig = hex(await hmacSha256(this.secretKey, payload));
    return {
      "X-App-Token": this.appToken,
      "X-App-Access-Sig": sig,
      "X-App-Access-Ts": ts,
      "content-type": "application/json",
      accept: "application/json",
    };
  }

  async startSession(subject: KycSubject, requestedTier: KycTier): Promise<KycSession> {
    const tier = requestedTier === "none" ? "basic" : requestedTier;
    const level = LEVEL_FOR_TIER[tier];

    // Step 1 — create the applicant. The shape differs slightly for
    // companies (KYB) vs individuals; Sumsub infers it from the level
    // configuration but we send `type` defensively.
    const isCompany = subject.entity === "institutional" || subject.entity === "data_provider";
    const applicantPath = `/resources/applicants?levelName=${encodeURIComponent(level)}`;
    const applicantBody: Record<string, unknown> = {
      externalUserId: subject.internalRef,
      type: isCompany ? "company" : "individual",
    };
    if (subject.details["email"]) applicantBody["email"] = subject.details["email"];
    const applicantBodyStr = JSON.stringify(applicantBody);
    const applicantHeaders = await this.signedHeaders("POST", applicantPath, applicantBodyStr);
    const applicantRes = await this.fetchImpl(`${this.apiBase}${applicantPath}`, {
      method: "POST",
      headers: applicantHeaders,
      body: applicantBodyStr,
    });
    if (!applicantRes.ok) {
      throw new Error(`sumsub_applicant_create_failed status=${applicantRes.status}`);
    }
    const applicant = (await applicantRes.json()) as { id?: string };
    if (!applicant.id) throw new Error("sumsub_applicant_missing_id");

    // Step 2 — mint a hosted WebSDK link bound to this applicant.
    const linkPath = `/resources/sdkIntegrations/levels/${encodeURIComponent(level)}/websdkLink`;
    const ttlSecs = 24 * 60 * 60;
    const linkBody = JSON.stringify({ ttlInSecs: ttlSecs, externalUserId: subject.internalRef });
    const linkHeaders = await this.signedHeaders("POST", linkPath, linkBody);
    const linkRes = await this.fetchImpl(`${this.apiBase}${linkPath}`, {
      method: "POST",
      headers: linkHeaders,
      body: linkBody,
    });
    if (!linkRes.ok) {
      throw new Error(`sumsub_websdk_link_failed status=${linkRes.status}`);
    }
    const linkData = (await linkRes.json()) as { url?: string };
    if (!linkData.url) throw new Error("sumsub_websdk_link_missing_url");

    void this.region; // currently informational only — Sumsub is single-endpoint.
    return {
      provider: this.name,
      providerSessionId: applicant.id,
      hostedUrl: linkData.url,
      expiresAt: Math.floor(Date.now() / 1000) + ttlSecs,
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
