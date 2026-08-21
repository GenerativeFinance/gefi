/**
 * Deterministic sanctions provider for dev + tests.
 *
 * Fires a "hit" iff the subject's name matches one of the well-known
 * test-data names from the OFAC sample list (e.g. "Specially Designated
 * National"). Useful for asserting that the onboarding flow correctly
 * blocks a hit without needing real OFAC data.
 */

import type { SanctionsHit, SanctionsProvider, SanctionsScreeningResult, SanctionsSubject } from "./types.js";

const SAMPLE_HIT_NAMES = ["Specially Designated National", "Sanctioned Person", "John Doe Sanctioned"];

export class StubSanctionsProvider implements SanctionsProvider {
  readonly name = "stub";

  async screen(subject: SanctionsSubject): Promise<SanctionsScreeningResult> {
    const matches = SAMPLE_HIT_NAMES.filter((n) =>
      n.toLowerCase() === subject.fullName.trim().toLowerCase(),
    );
    const hits: SanctionsHit[] = matches.map((m) => ({
      list: "STUB OFAC",
      matchScore: 1,
      matchedName: m,
      reason: "Exact name match against stubbed sample list",
      raw: { source: "stub" },
    }));
    return {
      provider: this.name,
      hit: hits.length > 0,
      hits,
      raw: { source: "stub", subject: subject.internalRef },
    };
  }
}
