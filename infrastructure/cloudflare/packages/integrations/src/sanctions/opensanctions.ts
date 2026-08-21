/**
 * OpenSanctions provider — covers OFAC SDN, EU CFSP, UK HMT, PEPs, and
 * adverse media via a single API. Free for low volumes, paid above.
 *
 * Today's implementation hits the real `api.opensanctions.org/match/` endpoint
 * with `name` + `birth_date`. The matched-list source comes back in the
 * `dataset` field on each result; we map a small subset onto our
 * canonical list names for the audit trail.
 */

import type { SanctionsHit, SanctionsProvider, SanctionsScreeningResult, SanctionsSubject } from "./types.js";

const DATASET_TO_LIST: Record<string, string> = {
  us_ofac_sdn: "OFAC SDN",
  eu_fsf: "EU CFSP",
  gb_hmt_sanctions: "UK HMT",
  peps: "PEP",
  default: "OpenSanctions",
};

export class OpenSanctionsProvider implements SanctionsProvider {
  readonly name = "opensanctions";

  constructor(
    private readonly apiKey: string,
    private readonly threshold = 0.8,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async screen(subject: SanctionsSubject): Promise<SanctionsScreeningResult> {
    const body = {
      queries: {
        q: {
          schema: subject.companyNumber ? "Organization" : "Person",
          properties: {
            name: [subject.fullName],
            ...(subject.dateOfBirth ? { birthDate: [subject.dateOfBirth] } : {}),
            ...(subject.countryCode ? { country: [subject.countryCode.toLowerCase()] } : {}),
            ...(subject.companyNumber ? { registrationNumber: [subject.companyNumber] } : {}),
          },
        },
      },
    };

    const res = await this.fetchImpl("https://api.opensanctions.org/match/default?algorithm=best", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `ApiKey ${this.apiKey}`,
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`opensanctions_screen_failed status=${res.status}`);
    }
    const data = (await res.json()) as {
      responses?: { q?: { results?: Array<{ score?: number; caption?: string; datasets?: string[] }> } };
    };
    const results = data.responses?.q?.results ?? [];
    const hits: SanctionsHit[] = results
      .filter((r) => (r.score ?? 0) >= this.threshold)
      .map((r) => ({
        list:
          (r.datasets ?? []).map((d) => DATASET_TO_LIST[d]).find(Boolean) ??
          DATASET_TO_LIST.default ?? "OpenSanctions",
        matchScore: r.score ?? 0,
        matchedName: r.caption ?? subject.fullName,
        reason: "Name match in sanctions / PEP source",
        raw: r,
      }));
    return {
      provider: this.name,
      hit: hits.length > 0,
      hits,
      raw: data,
    };
  }
}
