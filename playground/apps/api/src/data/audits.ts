/**
 * Audit seed — one audit row per featured model so the Compliance tab on
 * the detail page has real content to render. The `hash` is a deterministic
 * sha256-stub (just a hex slug derived string) — Phase 7+ replaces with
 * real proof verification.
 */
export interface AuditSeed {
  id: string;
  model_slug: string;
  auditor: string;
  standard: string;
  audited_at: number;
  passed: boolean;
  /** 64-char hex digest. */
  hash: string;
}

/** Deterministic 64-hex digest derived from the slug — purely a stub. */
function fakeHash(slug: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const word = (h >>> 0).toString(16).padStart(8, "0");
  return word.repeat(8);
}

const FIXED_AUDITED_AT = 1730_000_000; // 2024-10-26 UTC — deterministic for tests.

export const AUDITS: ReadonlyArray<AuditSeed> = [
  "sentiment-from-filings",
  "portfolio-optimiser",
  "credit-default-classifier",
  "fraud-anomaly-detector",
  "fx-volatility-forecast",
  "yield-curve-predictor",
  "compliance-redaction-llm",
  "earnings-surprise-predictor",
  "esg-news-classifier",
  "insurance-claims-triage",
].map((slug, i) => ({
  id: `audit_${slug}`,
  model_slug: slug,
  auditor: i % 2 === 0 ? "Trail of Bits" : "OpenZeppelin",
  standard: ["ISO 42001", "SOC 2 Type II", "NIST AI RMF", "EU AI Act"][i % 4]!,
  audited_at: FIXED_AUDITED_AT - i * 86_400 * 7, // staggered weekly
  passed: i !== 4, // FX vol forecast intentionally fails for the failing-badge demo
  hash: fakeHash(slug),
}));
