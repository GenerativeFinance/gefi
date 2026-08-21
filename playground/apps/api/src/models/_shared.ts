/**
 * Shared helpers for the Phase 6 per-model backends.
 *
 * Every handler in `apps/api/src/models/{slug}.ts` is pure and deterministic:
 * a stable hash of the input is fed to a mulberry32-style PRNG so that the
 * same input always produces the same output. This satisfies the Phase 6
 * common contract's "deterministic same-seed output where applicable" check
 * and keeps tests stable without snapshot churn.
 *
 * The handler interface is intentionally minimal:
 *
 *   predict(input: any, ctx: { seed: string, ai?: Ai }) → output
 *
 * Handlers may treat `ctx.ai` as optional. None of the in-tree handlers
 * actually require a Workers AI binding — runtimes labelled `workers-ai`
 * fall through to a deterministic stub when `ctx.ai` is not provided.
 */
import type { JsonSchema } from "../data/playground-mocks.js";

export type ModelRuntime =
  | "synthetic"
  | "simulator"
  | "onnx-edge"
  | "workers-ai"
  | "external-llm";

export interface PredictContext {
  /** Stable seed derived from the canonical input hash. */
  seed: string;
  /** Optional Workers AI binding — only `workers-ai` runtimes use it. */
  ai?: Ai;
}

export interface ModelHandler {
  slug: string;
  runtime: ModelRuntime;
  inputSchema: JsonSchema;
  outputSchema: JsonSchema;
  defaultInput: Record<string, unknown>;
  /** Pure deterministic prediction function. Must not throw on valid input. */
  predict: (input: Record<string, unknown>, ctx: PredictContext) => Promise<Record<string, unknown>> | Record<string, unknown>;
}

/**
 * mulberry32-style PRNG seeded by a string. Returns a closure that produces
 * uniform [0,1) floats. Identical seeds always produce identical sequences.
 */
export function makeRng(seed: string): () => number {
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  let state = h >>> 0;
  return function next(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Round to N decimal places — keeps numeric outputs comparable in tests. */
export function round(n: number, places = 4): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

/** Box-Muller normal sample using the supplied uniform RNG. */
export function gaussian(rng: () => number, mean = 0, std = 1): number {
  // Avoid log(0) by clamping.
  const u = Math.max(1e-9, rng());
  const v = rng();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + z * std;
}

/** SHA-256 of a UTF-8 string → 64-char lowercase hex. */
export async function sha256Hex(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Quantile of a sorted array (linear interpolation). Inputs:
 *   sorted   — ascending-sorted numeric array
 *   q        — quantile in [0,1]
 */
export function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return NaN;
  if (q <= 0) return sorted[0]!;
  if (q >= 1) return sorted[sorted.length - 1]!;
  const pos = q * (sorted.length - 1);
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  const frac = pos - lo;
  return sorted[lo]! * (1 - frac) + sorted[hi]! * frac;
}
