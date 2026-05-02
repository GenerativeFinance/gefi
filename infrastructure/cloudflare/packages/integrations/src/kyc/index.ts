/**
 * KYC provider factory.
 *
 * Resolves the right provider for an entity type + jurisdiction + deploy
 * environment. The decision tree:
 *
 *   1. Individuals (`retail`, `professional`):
 *      a. If `ONFIDO_API_TOKEN` + `ONFIDO_WEBHOOK_SECRET` → Onfido.
 *      b. Else if `SUMSUB_APP_TOKEN` + `SUMSUB_SECRET_KEY` → Sumsub
 *         (Sumsub also covers individuals — second source).
 *   2. Businesses (`institutional`, `data_provider`):
 *      a. If `SUMSUB_APP_TOKEN` + `SUMSUB_SECRET_KEY` → Sumsub.
 *   3. Otherwise:
 *      a. If `ENVIRONMENT === "prod"` → **throw** `kyc_provider_not_configured`.
 *         Production must always have a real provider; falling back to
 *         the stub here would silently approve anyone.
 *      b. Else → return the deterministic `StubKycProvider` (dev / tests).
 *
 * The "throw on prod-without-provider" behaviour is what makes the
 * factory genuinely *fail-closed*. A misconfigured prod deploy
 * surfaces as a 503 from `/v1/kyc/start` rather than as a free pass
 * through onboarding.
 */

import type { DeployEnv, EntityType, IntegrationSecrets, Region } from "@gefi/shared-types";
import { providerFamilyFor } from "@gefi/auth/kyc-tiers";
import { OnfidoKycProvider } from "./onfido.js";
import { StubKycProvider } from "./stub.js";
import { SumsubKycProvider } from "./sumsub.js";
import type { KycProvider } from "./types.js";

export interface KycProviderEnv extends IntegrationSecrets {
  ONFIDO_WEBHOOK_SECRET?: string;
  SUMSUB_WEBHOOK_SECRET?: string;
  ENVIRONMENT?: DeployEnv;
}

export class KycProviderNotConfiguredError extends Error {
  constructor(public readonly entity: EntityType, public readonly region: Region) {
    super(`kyc_provider_not_configured entity=${entity} region=${region}`);
    this.name = "KycProviderNotConfiguredError";
  }
}

export function resolveKycProvider(
  entity: EntityType,
  region: Region,
  env: KycProviderEnv,
): KycProvider {
  const family = providerFamilyFor(entity);

  if (family === "individual") {
    if (env.ONFIDO_API_TOKEN && env.ONFIDO_WEBHOOK_SECRET) {
      return new OnfidoKycProvider(env.ONFIDO_API_TOKEN, env.ONFIDO_WEBHOOK_SECRET, region);
    }
    if (env.SUMSUB_APP_TOKEN && env.SUMSUB_SECRET_KEY) {
      return new SumsubKycProvider(env.SUMSUB_APP_TOKEN, env.SUMSUB_SECRET_KEY, region);
    }
  } else {
    // Business — KYB.
    if (env.SUMSUB_APP_TOKEN && env.SUMSUB_SECRET_KEY) {
      return new SumsubKycProvider(env.SUMSUB_APP_TOKEN, env.SUMSUB_SECRET_KEY, region);
    }
  }

  if (env.ENVIRONMENT === "prod") {
    throw new KycProviderNotConfiguredError(entity, region);
  }
  return new StubKycProvider();
}

export { OnfidoKycProvider, StubKycProvider, SumsubKycProvider };
