/**
 * Federated feature-store types. Mirror of the `feature_definitions` and
 * `feature_lookups` D1 tables.
 */

import type { Region } from "@gefi/shared-types";

export interface FeatureDefinition {
  id: string;
  slug: string;
  ownerTenantId: string;
  jurisdiction: Region;
  /** JSON-schema-shaped descriptor. We don't validate it here — that's the
   * orchestrator's responsibility — but downstream consumers can. */
  schemaJson: string;
  defaultTtlSeconds: number;
  /**
   * URL or `stub://<id>` reference. Production: HTTPS URL of the data
   * provider's `FeatureServer`. Test: `stub://demo` resolves through an
   * in-memory `StubFeatureNodeClient`.
   */
  sourceEndpoint: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface FeatureLookup {
  id: string;
  featureId: string;
  tenantId: string;
  modelRunId: string | null;
  lookupKey: string;
  resultSha256: string;
  cached: boolean;
  latencyMs: number;
  createdAt: number;
}

export interface LookupRequest {
  tenantId: string;
  feature: string;       // slug
  key: string;
  modelRunId?: string;
}

export interface LookupResult {
  ok: true;
  value: unknown;
  cached: boolean;
  schemaVersion: string;
  latencyMs: number;
  resultSha256: string;
}

export interface LookupError {
  ok: false;
  error: string;
}
