/**
 * Earnings-surprise-predictor.
 *
 * Runtime: `synthetic`. Logistic predictor over (revisions_30d,
 * consensus_eps level, ticker hash). Returns beat/inline/miss probabilities
 * and a single direction call.
 *
 * Backwards-compatible Phase 5 keys (`surprise_direction`, `surprise_pct`,
 * `confidence`) preserved; spec extension keys (`probabilities`, `drivers`)
 * added alongside.
 */
import { type ModelHandler, makeRng, round } from "./_shared.js";
import { PLAYGROUND_MOCKS_BY_SLUG } from "../data/playground-mocks.js";

const SLUG = "earnings-surprise-predictor";
const mock = PLAYGROUND_MOCKS_BY_SLUG.get(SLUG)!;

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0) || 1;
  return exps.map((e) => e / sum);
}

export const handler: ModelHandler = {
  slug: SLUG,
  runtime: "synthetic",
  inputSchema: mock.inputSchema,
  outputSchema: mock.outputSchema,
  defaultInput: mock.defaultInput,
  predict(input, ctx) {
    const ticker = String(input.ticker ?? "AAPL");
    const consensus = Number(input.consensus_eps ?? 0);
    const revisions = Number(input.revisions_30d ?? 0);

    // Logits over [beat, inline, miss].
    const rng = makeRng(ctx.seed);
    const noise = (rng() - 0.5) * 0.4;
    const beatLogit = 0.5 * revisions + 0.2 * Math.sign(consensus) + noise;
    const missLogit = -0.5 * revisions - 0.2 * Math.sign(consensus) - noise;
    const probs = softmax([beatLogit, 0, missLogit]); // [beat, inline, miss]
    const direction = probs[0]! > probs[1]! && probs[0]! > probs[2]!
      ? "beat"
      : probs[2]! > probs[1]! ? "miss" : "inline";

    // Surprise % proxy: revisions × 1.5%, signed by direction.
    const sign = direction === "beat" ? 1 : direction === "miss" ? -1 : 0;
    const surprise_pct = round(Math.min(0.4, Math.abs(revisions) * 0.015) * sign, 3);

    return {
      // Phase 5 backwards-compat keys.
      surprise_direction: direction,
      surprise_pct,
      confidence: round(Math.max(probs[0]!, probs[1]!, probs[2]!), 3),
      // Phase 6 extensions.
      probabilities: { beat: round(probs[0]!, 3), inline: round(probs[1]!, 3), miss: round(probs[2]!, 3) },
      drivers: [
        { feature: "revisions_30d", value: revisions, impact: round(0.5 * revisions, 3) },
        { feature: "consensus_eps", value: consensus, impact: round(0.2 * Math.sign(consensus), 3) },
        { feature: "ticker", value: ticker, impact: round(noise, 3) },
      ],
    };
  },
};
