/** Common shapes for KYC providers. */

import type { EntityType, KycTier, Region } from "@gefi/shared-types";

/** A single subject of a KYC check (person or company). */
export interface KycSubject {
  /** Stable internal identifier we pass through so we can correlate webhooks. */
  internalRef: string;
  entity: EntityType;
  jurisdiction: Region;
  /** Free-form additional data (name, DOB, company number, etc.). */
  details: Record<string, string | undefined>;
}

/** Returned when we kick off a KYC session — the URL the user should be redirected to. */
export interface KycSession {
  /** Provider identifier, e.g. `"onfido"` / `"sumsub"` / `"stub"`. */
  provider: string;
  /** Provider-specific session id. Stored in D1 to correlate webhook events. */
  providerSessionId: string;
  /** URL the user should visit to complete the flow. */
  hostedUrl: string;
  /** When the hosted URL expires (UNIX seconds). */
  expiresAt: number;
}

export interface KycEvidenceUpload {
  /** R2 key the evidence was stored under. Empty for stubs. */
  evidenceKey: string;
  /** Bytes uploaded. */
  size: number;
}

/** Final state of a KYC session, derived from a provider webhook. */
export interface KycResult {
  provider: string;
  providerSessionId: string;
  /** What the provider attests we proved. */
  achievedTier: KycTier;
  /** "approved" | "declined" | "review" — provider-agnostic outcome. */
  outcome: "approved" | "declined" | "review";
  /** Reason code(s) the provider returned. */
  reasonCodes: string[];
  /** Raw provider payload for the audit log. */
  raw: unknown;
}

/** Provider abstraction the API talks to. */
export interface KycProvider {
  /** Identifier for logs + the `kyc_evidence.provider` column. */
  readonly name: string;
  /**
   * Start a hosted KYC flow. Returns the URL we redirect the user to.
   * Must be safe to call from a Worker (no Node-only APIs).
   */
  startSession(subject: KycSubject, requestedTier: KycTier): Promise<KycSession>;
  /**
   * Verify and parse a webhook payload (raw body + signature header).
   * Returns the normalised result, or throws if the signature is invalid
   * or the payload doesn't correspond to a tracked session.
   */
  parseWebhook(rawBody: string, signature: string | null): Promise<KycResult>;
}
