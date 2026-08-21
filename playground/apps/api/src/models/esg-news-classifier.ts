/**
 * ESG-news-classifier.
 *
 * Runtime: `synthetic`. Multi-label classification across the GRI-style
 * taxonomy (environmental, social, governance) using a small in-tree
 * lexicon. Severity escalates on regulator / fines / breach mentions.
 *
 * Backwards-compatible Phase 5 keys (`labels`, `severity`) preserved;
 * spec extension keys (`scores`, `entities`) added alongside.
 */
import { type ModelHandler, round } from "./_shared.js";
import { PLAYGROUND_MOCKS_BY_SLUG } from "../data/playground-mocks.js";

const SLUG = "esg-news-classifier";
const mock = PLAYGROUND_MOCKS_BY_SLUG.get(SLUG)!;

const TAXONOMY: Array<{ label: string; words: string[] }> = [
  { label: "environmental:emissions", words: ["emission", "carbon", "co2", "ghg", "pollution"] },
  { label: "environmental:climate", words: ["climate", "flooding", "drought", "wildfire"] },
  { label: "social:labor-relations", words: ["strike", "labor", "union", "wage"] },
  { label: "social:human-rights", words: ["forced labor", "child labor", "modern slavery"] },
  { label: "governance:financial-crime", words: ["aml", "sanctions", "money laundering", "bribery"] },
  { label: "governance:disclosure", words: ["restatement", "audit", "disclosure", "controls"] },
  { label: "governance:executive-pay", words: ["bonus", "compensation", "say-on-pay"] },
];

export const handler: ModelHandler = {
  slug: SLUG,
  runtime: "synthetic",
  inputSchema: mock.inputSchema,
  outputSchema: mock.outputSchema,
  defaultInput: mock.defaultInput,
  predict(input) {
    const txt = (String(input.headline ?? "") + " " + String(input.body ?? "")).toLowerCase();

    const scores: Record<string, number> = {};
    for (const t of TAXONOMY) {
      const hits = t.words.reduce((n, w) => n + (txt.includes(w) ? 1 : 0), 0);
      if (hits > 0) scores[t.label] = round(Math.min(1, 0.4 + hits * 0.25), 3);
    }
    const labels = Object.keys(scores).sort((a, b) => scores[b]! - scores[a]!);
    if (labels.length === 0) {
      labels.push("governance:other");
      scores["governance:other"] = 0.4;
    }

    const severity = /(fine|breach|fraud|investigation|sanction)/.test(txt)
      ? "high"
      : labels.length > 1 ? "medium" : "low";

    // Naive named-entity surface: capitalised bigrams.
    const entities = Array.from(
      new Set(((String(input.headline ?? "") + " " + String(input.body ?? "")).match(/\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g)) ?? []),
    ).slice(0, 5);

    return {
      // Phase 5 backwards-compat keys.
      labels,
      severity,
      // Phase 6 extensions.
      scores,
      entities,
    };
  },
};
