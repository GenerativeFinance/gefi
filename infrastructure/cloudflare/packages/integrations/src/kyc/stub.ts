/**
 * Deterministic KYC provider used in dev + tests.
 *
 * - `startSession` returns a session id derived from the subject's
 *   `internalRef` and a fake hosted URL on `kyc.stub.gefi.io`.
 * - `parseWebhook` accepts JSON bodies of shape
 *   `{ providerSessionId, outcome, achievedTier, reasonCodes }`,
 *   validates them, and returns a normalised `KycResult`. Signature is
 *   ignored — never use this provider in prod.
 *
 * Production providers (Onfido / Persona / Sumsub / Middesk) live in
 * sibling files and follow the same shape; their real HTTP calls + HMAC
 * signature checks are stubbed today and finalised against the live API
 * as part of the deploy bootstrap (see `infrastructure/cloudflare/AUTH0-SETUP.md`).
 */

import type { KycProvider, KycResult, KycSession, KycSubject } from "./types.js";
import type { KycTier } from "@gefi/shared-types";

export class StubKycProvider implements KycProvider {
  readonly name = "stub";

  async startSession(subject: KycSubject, requestedTier: KycTier): Promise<KycSession> {
    const sessionId = `stub_${subject.internalRef}_${requestedTier}_${Date.now()}`;
    return {
      provider: this.name,
      providerSessionId: sessionId,
      hostedUrl: `https://kyc.stub.gefi.io/session/${sessionId}`,
      expiresAt: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    };
  }

  async parseWebhook(rawBody: string, _signature: string | null): Promise<KycResult> {
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      throw new Error("kyc_stub_webhook_malformed");
    }
    const obj = parsed as Record<string, unknown>;
    const providerSessionId = obj.providerSessionId as string | undefined;
    const outcome = obj.outcome as KycResult["outcome"] | undefined;
    const achievedTier = obj.achievedTier as KycTier | undefined;
    const reasonCodes = Array.isArray(obj.reasonCodes) ? (obj.reasonCodes as string[]) : [];
    if (!providerSessionId) throw new Error("kyc_stub_webhook_missing_session_id");
    if (!outcome) throw new Error("kyc_stub_webhook_missing_outcome");
    if (!achievedTier) throw new Error("kyc_stub_webhook_missing_tier");
    return {
      provider: this.name,
      providerSessionId,
      outcome,
      achievedTier,
      reasonCodes,
      raw: obj,
    };
  }
}
