/** Sanctions / PEP screening provider abstraction. */

import type { Region } from "@gefi/shared-types";

/**
 * What we're screening: a person or a company. Names matter —
 * sanctions lists are matched on names + DOB + company number.
 */
export interface SanctionsSubject {
  internalRef: string;
  jurisdiction: Region;
  fullName: string;
  dateOfBirth?: string; // YYYY-MM-DD for individuals
  countryCode?: string; // residency / incorporation
  companyNumber?: string; // for entities
}

/** A single hit on a sanctions / PEP / adverse-media list. */
export interface SanctionsHit {
  list: string;            // e.g. "OFAC SDN", "EU CFSP", "UK HMT", "PEP"
  matchScore: number;      // 0..1
  matchedName: string;
  reason: string;
  raw: unknown;
}

export interface SanctionsScreeningResult {
  provider: string;
  /** True if any hit at or above the configured threshold. */
  hit: boolean;
  hits: SanctionsHit[];
  raw: unknown;
}

export interface SanctionsProvider {
  readonly name: string;
  screen(subject: SanctionsSubject): Promise<SanctionsScreeningResult>;
}
