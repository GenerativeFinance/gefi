/**
 * Sanctions provider factory.
 *
 *   1. If `OPENSANCTIONS_API_KEY` is set → `OpenSanctionsProvider`
 *      (real `api.opensanctions.org` calls).
 *   2. Else:
 *      a. If `ENVIRONMENT === "prod"` → **throw**
 *         `sanctions_provider_not_configured`. Sanctions screening is
 *         a regulatory must-have; a prod deploy without a configured
 *         provider must never silently pass everyone through.
 *      b. Else → `StubSanctionsProvider` for dev / tests.
 */

import type { DeployEnv, IntegrationSecrets } from "@gefi/shared-types";
import { OpenSanctionsProvider } from "./opensanctions.js";
import { StubSanctionsProvider } from "./stub.js";
import type { SanctionsProvider } from "./types.js";

export interface SanctionsProviderEnv extends IntegrationSecrets {
  ENVIRONMENT?: DeployEnv;
}

export class SanctionsProviderNotConfiguredError extends Error {
  constructor() {
    super("sanctions_provider_not_configured");
    this.name = "SanctionsProviderNotConfiguredError";
  }
}

export function resolveSanctionsProvider(env: SanctionsProviderEnv): SanctionsProvider {
  if (env.OPENSANCTIONS_API_KEY) {
    return new OpenSanctionsProvider(env.OPENSANCTIONS_API_KEY);
  }
  if (env.ENVIRONMENT === "prod") {
    throw new SanctionsProviderNotConfiguredError();
  }
  return new StubSanctionsProvider();
}

export { OpenSanctionsProvider, StubSanctionsProvider };
