/**
 * Credit-default-classifier — privacy-first federated credit oracle.
 *
 * Runtime: `synthetic` (the spec calls for `onnx-edge`, but shipping an
 * actual ONNX artifact requires R2 binding + browser-targeted runtime; we
 * emulate the same logit shape with hand-tuned weights so the response
 * stays schema-conformant and the per-feature reason codes still follow
 * SHAP-style "feature × value" attribution).
 *
 * Backwards-compatible Phase 5 keys (`pd_12m`, `rating`, `drivers`) are
 * preserved; spec extension keys (`score`, `reason_codes`,
 * `peer_distribution`, `proof_hash`) are added alongside.
 */
import { type ModelHandler, makeRng, round, sha256Hex } from "./_shared.js";
import { PLAYGROUND_MOCKS_BY_SLUG } from "../data/playground-mocks.js";

const SLUG = "credit-default-classifier";
const mock = PLAYGROUND_MOCKS_BY_SLUG.get(SLUG)!;

const INDUSTRY_BETA: Record<string, number> = {
  retail: 0.35,
  manufacturing: 0.25,
  tech: 0.15,
  healthcare: 0.10,
  energy: 0.40,
};

function logit(x: number): number { return 1 / (1 + Math.exp(-x)); }

export const handler: ModelHandler = {
  slug: SLUG,
  runtime: "synthetic",
  inputSchema: mock.inputSchema,
  outputSchema: mock.outputSchema,
  defaultInput: mock.defaultInput,
  async predict(input, ctx) {
    const revenue = Number(input.revenue ?? 0);
    const de = Number(input.debt_to_equity ?? 1);
    const industry = String(input.industry ?? "manufacturing");
    const years = Number(input.years_in_business ?? 5);

    // Logit features. Higher z → higher default probability.
    const fLeverage = de * 0.8;
    const fIndustry = INDUSTRY_BETA[industry] ?? 0.25;
    const fSize = -Math.log10(Math.max(1, revenue)) * 0.25; // bigger revenue lowers risk
    const fVintage = Math.max(0, 1 - years / 20) * 0.5;     // young firms riskier
    const z = -3.2 + fLeverage + fIndustry + fSize + fVintage;
    const pd12m = round(logit(z), 4);

    // FICO-like 300–850 score — inverse of logit.
    const score = Math.round(850 - pd12m * 550);

    // Rating tier from PD.
    const rating =
      pd12m < 0.03 ? "AA" :
      pd12m < 0.06 ? "A" :
      pd12m < 0.10 ? "BBB" :
      pd12m < 0.18 ? "BB" : "B";

    // SHAP-style top-3 reason codes — sorted by |contribution|.
    const contribs: Array<{ feature: string; value: number; impact: number }> = [
      { feature: "debt_to_equity", value: de, impact: round(fLeverage, 3) },
      { feature: "industry", value: 0, impact: round(fIndustry, 3) },
      { feature: "revenue", value: revenue, impact: round(fSize, 3) },
      { feature: "years_in_business", value: years, impact: round(fVintage, 3) },
    ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

    // Phase 5 widget reads `drivers` as a flat string array.
    const drivers = contribs.slice(0, 3).map((c) => c.feature.replace(/_/g, " "));

    // Peer distribution — synthetic 20-bucket histogram around `score`.
    const rng = makeRng(ctx.seed);
    const peer = Array.from({ length: 20 }, (_, i) => {
      const center = 300 + i * 27.5;
      const distance = Math.abs(center - score) / 80;
      return round(Math.max(0.005, Math.exp(-distance * distance) * 0.3 + rng() * 0.02), 4);
    });

    // Phase 7 will replace this with a real groth16 attestation; for now we
    // hash (slug, version, input, output) so the digest is stable per call.
    const proof_hash = await sha256Hex(`${SLUG}|v1|${ctx.seed}|${score}|${pd12m}`);

    return {
      // Phase 5 backwards-compat keys.
      pd_12m: pd12m,
      rating,
      drivers,
      // Phase 6 extensions.
      score,
      reason_codes: contribs.slice(0, 3),
      peer_distribution: peer,
      proof_hash,
    };
  },
};
