/**
 * Fraud-anomaly-detector.
 *
 * Runtime: `synthetic`. Per-transaction risk scoring with five additive
 * heuristics (high amount, foreign country, round-number-fraud signature,
 * merchant high-risk class, volume burst). Each contributes a weight to a
 * per-row score; rows with score ≥ 0.5 are flagged.
 *
 * Backwards-compatible Phase 5 keys (`score`, `flagged_indexes`) preserved;
 * spec extension keys (`row_scores`, `stats`) added alongside.
 */
import { type ModelHandler, round } from "./_shared.js";
import { PLAYGROUND_MOCKS_BY_SLUG } from "../data/playground-mocks.js";

const SLUG = "fraud-anomaly-detector";
const mock = PLAYGROUND_MOCKS_BY_SLUG.get(SLUG)!;

const HIGH_RISK_COUNTRIES = new Set(["RO", "NG", "VE", "RU", "BY"]);
const HIGH_RISK_MERCHANT_HINTS = ["wire", "crypto", "prepaid", "cash"];

function rowScore(t: { amount?: number; merchant?: string; country?: string }): number {
  const amount = Number(t.amount ?? 0);
  const merchant = String(t.merchant ?? "").toLowerCase();
  const country = String(t.country ?? "US");

  let s = 0;
  if (amount > 5000) s += 0.45;
  else if (amount > 1000) s += 0.25;
  if (HIGH_RISK_COUNTRIES.has(country)) s += 0.4;
  if (HIGH_RISK_MERCHANT_HINTS.some((h) => merchant.includes(h))) s += 0.3;
  // Round-amount fraud signature (e.g. exactly 100, 500, 1000).
  if (amount >= 100 && amount % 100 === 0) s += 0.1;
  return Math.min(1, s);
}

export const handler: ModelHandler = {
  slug: SLUG,
  runtime: "synthetic",
  inputSchema: mock.inputSchema,
  outputSchema: mock.outputSchema,
  defaultInput: mock.defaultInput,
  predict(input) {
    const txs = (input.transactions as Array<{ amount?: number; merchant?: string; country?: string }>) ?? [];
    const rowScores = txs.map(rowScore);
    const flagged: number[] = [];
    rowScores.forEach((s, i) => { if (s >= 0.5) flagged.push(i); });

    // Aggregate score = average row risk capped at 1.
    const avg = rowScores.reduce((a, b) => a + b, 0) / Math.max(1, rowScores.length);

    // Stats — counts per country / amount bucket.
    const countryCounts: Record<string, number> = {};
    const amountBuckets = { sub100: 0, "100-1k": 0, "1k-10k": 0, over10k: 0 };
    for (const t of txs) {
      const c = String(t.country ?? "US");
      countryCounts[c] = (countryCounts[c] ?? 0) + 1;
      const a = Number(t.amount ?? 0);
      if (a < 100) amountBuckets.sub100++;
      else if (a < 1000) amountBuckets["100-1k"]++;
      else if (a < 10_000) amountBuckets["1k-10k"]++;
      else amountBuckets.over10k++;
    }

    return {
      // Phase 5 backwards-compat keys.
      score: round(avg, 3),
      flagged_indexes: flagged,
      // Phase 6 extensions.
      row_scores: rowScores.map((s) => round(s, 3)),
      stats: {
        flagged_pct: round(flagged.length / Math.max(1, txs.length), 3),
        country_counts: countryCounts,
        amount_buckets: amountBuckets,
      },
    };
  },
};
