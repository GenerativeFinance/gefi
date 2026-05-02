/**
 * KYC provider factory.
 *
 * Resolves the right provider for an entity type + environment. The
 * decision tree:
 *
 *   1. If the configured API key for the natural provider is present,
 *      return that provider.
 *   2. Otherwise return the deterministic stub. The stub is safe in dev
 *      and in tests; it's NEVER what the prod runbook leaves you with.
 *
 * Individuals (`retail`, `professional`) → Onfido (or Persona — second
 * source, intentionally absent from the factory until the operator
 * picks one). Companies (`institutional`, `data_provider`) → Sumsub /
 * Middesk; not yet implemented in code.
 */

import type { EntityType, IntegrationSecrets, Region } from "@gefi/shared-types";
import { providerFamilyFor } from "@gefi/auth/kyc-tiers";
import { OnfidoKycProvider } from "./onfido.js";
import { StubKycProvider } from "./stub.js";
import type { KycProvider } from "./types.js";

export function resolveKycProvider(
  entity: EntityType,
  region: Region,
  secrets: IntegrationSecrets & { ONFIDO_WEBHOOK_SECRET?: string },
): KycProvider {
  const family = providerFamilyFor(entity);
  if (family === "individual" && secrets.ONFIDO_API_TOKEN && secrets.ONFIDO_WEBHOOK_SECRET) {
    return new OnfidoKycProvider(
      secrets.ONFIDO_API_TOKEN,
      secrets.ONFIDO_WEBHOOK_SECRET,
      region,
    );
  }
  // TODO Task #3 follow-up: Sumsub / Middesk for `business`.
  return new StubKycProvider();
}

export { OnfidoKycProvider, StubKycProvider };
