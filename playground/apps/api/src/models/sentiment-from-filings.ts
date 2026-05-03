/**
 * Sentiment-from-filings — synthetic NLP scorer over short filing snippets.
 *
 * Runtime: `synthetic`. A weighted bag-of-words count over an in-tree
 * positive/negative lexicon plus a deterministic confidence noise term.
 * Output shape stays backwards-compatible with the Phase 5 Demo widget
 * (`sentiment`, `confidence`, `topics`) — no extension fields.
 */
import { type ModelHandler, makeRng, round } from "./_shared.js";
import { PLAYGROUND_MOCKS_BY_SLUG } from "../data/playground-mocks.js";

const SLUG = "sentiment-from-filings";
const POS = ["strong", "growth", "gain", "improve", "robust", "expand", "record", "outperform"];
const NEG = ["loss", "decline", "risk", "weak", "warning", "drop", "miss", "headwind", "downturn"];
const TOPIC_LEXICON: Array<[string, string[]]> = [
  ["liquidity", ["cash", "liquidity", "facility", "revolving"]],
  ["capital structure", ["debt", "leverage", "issuance", "covenant"]],
  ["outlook", ["guidance", "outlook", "forecast", "expects"]],
  ["litigation", ["lawsuit", "litigation", "regulator", "settlement"]],
  ["operations", ["margin", "operating", "supply", "production"]],
];

const mock = PLAYGROUND_MOCKS_BY_SLUG.get(SLUG)!;

export const handler: ModelHandler = {
  slug: SLUG,
  runtime: "synthetic",
  inputSchema: mock.inputSchema,
  outputSchema: mock.outputSchema,
  defaultInput: mock.defaultInput,
  predict(input, ctx) {
    const txt = String(input.text ?? "").toLowerCase();
    const pos = POS.reduce((n, w) => n + (txt.split(w).length - 1), 0);
    const neg = NEG.reduce((n, w) => n + (txt.split(w).length - 1), 0);
    const sentiment = neg > pos ? "negative" : pos > neg ? "positive" : "neutral";

    // Confidence: dominance ratio plus a tiny seeded jitter for realism.
    const total = Math.max(1, pos + neg);
    const dominance = Math.abs(pos - neg) / total;
    const rng = makeRng(ctx.seed);
    const conf = 0.55 + dominance * 0.4 + (rng() - 0.5) * 0.04;

    const topics: string[] = [];
    for (const [name, words] of TOPIC_LEXICON) {
      if (words.some((w) => txt.includes(w))) topics.push(name);
    }
    if (topics.length === 0) topics.push("general");

    return {
      sentiment,
      confidence: round(Math.max(0, Math.min(1, conf)), 3),
      topics: topics.slice(0, 3),
    };
  },
};
