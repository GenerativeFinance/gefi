/**
 * Sanctions provider factory.
 *
 * Returns the OpenSanctions provider when an API key is configured, or
 * the deterministic stub for tests / dev.
 */

import type { IntegrationSecrets } from "@gefi/shared-types";
import { OpenSanctionsProvider } from "./opensanctions.js";
import { StubSanctionsProvider } from "./stub.js";
import type { SanctionsProvider } from "./types.js";

export function resolveSanctionsProvider(secrets: IntegrationSecrets): SanctionsProvider {
  if (secrets.OPENSANCTIONS_API_KEY) {
    return new OpenSanctionsProvider(secrets.OPENSANCTIONS_API_KEY);
  }
  return new StubSanctionsProvider();
}

export { OpenSanctionsProvider, StubSanctionsProvider };
