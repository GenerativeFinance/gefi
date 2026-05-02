/**
 * Reference-model dispatcher. Given a registered reference slug
 * (`sentiment-from-filings` | `portfolio-optimiser`) and an
 * `InferenceRequest`-shaped input, runs the package's deterministic
 * executor and returns an `InferenceResponse`-shaped result so the
 * gateway's run/persistence flow stays uniform across "real" provider
 * runs and reference-model runs.
 *
 * The provider id is reported as `"reference"` in the resulting
 * model_runs row so a future audit query can distinguish reference-
 * model traffic from generic LLM traffic without scraping the
 * model_string.
 */

import { deterministicSentiment, retrieve } from "./sentiment.js";
import { optimise } from "./optimiser.js";
import {
  isReferenceSlug,
  REFERENCE_MODEL_SLUGS,
  type ReferenceModelSlug,
} from "./bootstrap.js";

export interface ReferenceInput {
  prompt: string;
  system?: string;
  context?: Array<{ id: string; text: string }>;
  maxTokens?: number;
  temperature?: number;
}

export interface ReferenceOutput {
  text: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  /** Always "reference" — distinct from "deterministic" so audits can filter. */
  provider: "reference";
  /** "reference:<slug>" — replay can route back to this dispatcher by parsing. */
  modelString: string;
}

function approxTokens(s: string): number {
  return Math.max(1, Math.ceil(s.length / 4));
}

/**
 * Execute a reference model deterministically. Throws on unknown slug
 * so the caller's `isReferenceSlug` check stays load-bearing.
 */
export async function executeReferenceModel(
  slug: string,
  input: ReferenceInput,
): Promise<ReferenceOutput> {
  if (!isReferenceSlug(slug)) {
    throw new Error(`reference_unknown_slug:${slug}`);
  }
  const start = Date.now();
  const tokensIn = approxTokens(input.prompt + (input.system ?? ""));

  if (slug === "sentiment-from-filings") {
    // Allow the caller to pass an explicit ticker filter via the
    // `system` channel as `ticker:AAPL`. The contract is
    // intentionally tiny — full structured input lives in `context`
    // for free-form augmentation, but the system message keeps the
    // simple ticker-filter case ergonomic.
    let ticker: string | undefined;
    const sys = input.system ?? "";
    const m = /\bticker\s*[:=]\s*([A-Z][A-Z0-9.\-]{0,9})/.exec(sys);
    if (m) ticker = m[1];
    const chunks = retrieve({ query: input.prompt, ticker, topK: 4 });
    const sentiment = deterministicSentiment(chunks);
    const text = JSON.stringify({
      sentiment,
      evidence: chunks.map((c) => ({ id: c.id, score: c.score })),
    });
    return {
      text,
      tokensIn,
      tokensOut: approxTokens(text),
      latencyMs: Date.now() - start,
      provider: "reference",
      modelString: `reference:${slug}` as const,
    };
  }

  if (slug === "portfolio-optimiser") {
    // The prompt for the optimiser is a JSON-encoded OptimiserInput.
    // We accept either the raw object on the prompt OR a `payload`
    // wrapper — the marketing site sends the wrapped form so the same
    // text endpoint can carry both natural-language and structured
    // payloads in the future.
    let payload: unknown;
    try {
      payload = JSON.parse(input.prompt);
    } catch {
      throw new Error("reference_optimiser_invalid_json");
    }
    const inputObj =
      payload && typeof payload === "object" && "payload" in (payload as Record<string, unknown>)
        ? ((payload as { payload: unknown }).payload as Record<string, unknown>)
        : (payload as Record<string, unknown>);
    if (!inputObj || typeof inputObj !== "object" || !Array.isArray(inputObj.assets)) {
      throw new Error("reference_optimiser_missing_assets");
    }
    const result = optimise({
      assets: inputObj.assets as Array<{ symbol: string; expectedReturn: number; vol: number }>,
      correlation: (inputObj.correlation as number[][]) ?? [],
      riskAversion: (inputObj.riskAversion as number | undefined) ?? undefined,
      longOnly: (inputObj.longOnly as boolean | undefined) ?? undefined,
      maxIters: (inputObj.maxIters as number | undefined) ?? undefined,
    });
    const text = JSON.stringify(result);
    return {
      text,
      tokensIn,
      tokensOut: approxTokens(text),
      latencyMs: Date.now() - start,
      provider: "reference",
      modelString: `reference:${slug}` as const,
    };
  }

  // Unreachable due to `isReferenceSlug` guard — but keep TS happy +
  // future-proof if someone adds a slug to the union without wiring
  // a branch here.
  const _exhaustive: never = slug;
  void _exhaustive;
  throw new Error(`reference_unhandled_slug`);
}

export { REFERENCE_MODEL_SLUGS, isReferenceSlug, type ReferenceModelSlug };
