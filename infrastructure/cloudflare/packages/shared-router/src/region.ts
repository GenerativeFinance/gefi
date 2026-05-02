/**
 * Jurisdiction → region mapping.
 *
 * Inputs come from `request.cf?.country` (a 2-letter ISO 3166-1 code) plus
 * an optional explicit override (e.g. a `?region=eu` query param or a
 * tenant's persisted preference loaded from D1). The output is the canonical
 * `Region` we route requests to.
 *
 * Today we only run two regions, EU and US. Everything else falls through
 * to whichever region's data residency rules are most permissive for that
 * country. We keep the country list explicit (rather than "EU = anything in
 * Europe") because compliance routing in Task #4 will need precise per-
 * country branches anyway.
 */

import type { Region } from "@gefi/shared-types";

const EU_COUNTRIES = new Set<string>([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE",
  // Non-EU but typically routed to the EU data plane:
  "GB", "CH", "NO", "IS", "LI",
]);

const MENA_COUNTRIES = new Set<string>([
  "AE", "BH", "EG", "IL", "JO", "KW", "LB", "MA", "OM", "QA", "SA", "TN", "TR",
]);

const APAC_COUNTRIES = new Set<string>([
  "AU", "CN", "HK", "ID", "IN", "JP", "KR", "MY", "NZ", "PH", "SG", "TH", "TW", "VN",
]);

/**
 * Pick the region to route a request to.
 *
 * Resolution order:
 *   1. `override` if provided and valid (used for tenant-pinned routing).
 *   2. The country lookup table.
 *   3. Fallback to `defaultRegion` (set per Worker env via `WORKER_REGION`).
 */
export function pickRegion(
  country: string | null | undefined,
  defaultRegion: Region,
  override?: string | null,
): Region {
  if (override && isRegion(override)) return override;

  if (!country) return defaultRegion;
  const cc = country.toUpperCase();

  if (EU_COUNTRIES.has(cc)) return "eu";
  if (MENA_COUNTRIES.has(cc)) return "mena";
  if (APAC_COUNTRIES.has(cc)) return "apac";
  // North + South America default to US until a dedicated LATAM region exists.
  if (cc === "US" || cc === "CA" || cc === "MX" || cc === "BR") return "us";

  return defaultRegion;
}

/** Type guard: true if a string is a known `Region`. */
export function isRegion(value: string): value is Region {
  return value === "eu" || value === "us" || value === "mena" || value === "apac";
}

/**
 * Map a region to its public regional API hostname.
 * Mirrors the DNS records described in `infrastructure/cloudflare/README.md`.
 */
export function regionalApiHost(region: Region): string {
  switch (region) {
    case "eu":
      return "eu.api.gefi.io";
    case "us":
      return "us.api.gefi.io";
    case "mena":
      return "mena.api.gefi.io";
    case "apac":
      return "apac.api.gefi.io";
  }
}
