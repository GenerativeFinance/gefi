/**
 * The model-gateway run service.
 *
 * Two operations:
 *   - `runModel(...)`: pick a provider chain, try each in order, persist a
 *     `model_runs` row with `input_sha`/`output_sha`, optionally stream
 *     the output as Server-Sent Events.
 *   - `replayRun(runId)`: load the stored input + provider/model_string,
 *     re-execute against the deterministic provider (so replay is bit-exact)
 *     and assert that the input_sha matches.
 *
 * The deterministic provider is a pure function of the input, so any
 * model that wants to be deterministically replayable should generate
 * its outputs through it (or have caller code post-process the live
 * output through a deterministic refinement step).
 */

import type { Region } from "@gefi/shared-types";
import {
  DeterministicProvider,
  type InferenceProvider,
  type InferenceRequest,
  type InferenceResponse,
  RegionRefused,
} from "./providers.js";

export interface RunDeps {
  db: D1Database;
}

export interface RunInput {
  modelId: string;
  versionId: string;
  tenantId: string;
  userId: string | null;
  jurisdiction: Region;
  request: InferenceRequest;
  isPaper?: boolean;
  ts?: number;
}

export interface RunResult {
  runId: string;
  response: InferenceResponse;
  inputSha: string;
  outputSha: string;
}

function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Canonicalise the request so the same logical input always produces the
 * same sha. We do a true deep canonical JSON: sort object keys recursively
 * and serialise the result with no replacer. The previous implementation
 * passed `Object.keys(stable).sort()` as JSON.stringify's replacer ARRAY,
 * which globally filtered properties — nested context fields like
 * `id`/`text` were stripped, so materially different prompts could collide
 * on the same input_sha. That undermines audit replay guarantees.
 */
function canonicaliseValue(v: unknown): unknown {
  if (v === null || v === undefined) return v;
  if (typeof v !== "object") return v;
  if (Array.isArray(v)) return v.map(canonicaliseValue);
  const src = v as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(src).sort()) {
    out[k] = canonicaliseValue(src[k]);
  }
  return out;
}

export function canonicaliseRequest(req: InferenceRequest): string {
  const stable = {
    prompt: req.prompt,
    system: req.system ?? "",
    max_tokens: req.maxTokens ?? null,
    temperature: req.temperature ?? null,
    region: req.region,
    context: (req.context ?? []).map((c) => ({ id: c.id, text: c.text })),
  };
  return JSON.stringify(canonicaliseValue(stable));
}

export async function runModel(
  deps: RunDeps,
  chain: InferenceProvider[],
  input: RunInput,
): Promise<RunResult> {
  const ts = input.ts ?? Math.floor(Date.now() / 1000);
  const canonicalInput = canonicaliseRequest(input.request);
  const inputSha = await sha256Hex(canonicalInput);

  let response: InferenceResponse | null = null;
  const errors: string[] = [];
  for (const provider of chain) {
    try {
      response = await provider.generate(input.request);
      break;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${provider.id}:${msg}`);
      if (err instanceof RegionRefused) continue;
      // Non-region errors fall through — the gateway is best-effort.
      continue;
    }
  }
  if (!response) throw new Error(`gateway_no_provider_succeeded:${errors.join(",")}`);

  const outputSha = await sha256Hex(response.text);
  const runId = newId("run");
  await deps.db
    .prepare(
      `INSERT INTO model_runs (id, model_id, version_id, tenant_id, user_id, jurisdiction,
       provider, model_string, input_sha, output_sha, input_json, output_json,
       tokens_in, tokens_out, latency_ms, is_paper, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      runId,
      input.modelId,
      input.versionId,
      input.tenantId,
      input.userId,
      input.jurisdiction,
      response.provider,
      response.modelString,
      inputSha,
      outputSha,
      canonicalInput,
      JSON.stringify({ text: response.text }),
      response.tokensIn,
      response.tokensOut,
      response.latencyMs,
      input.isPaper ? 1 : 0,
      ts,
    )
    .run();

  return { runId, response, inputSha, outputSha };
}

export interface ReplayResult {
  runId: string;
  originalProvider: string;
  originalOutput: string;
  replayOutput: string;
  inputShaMatches: boolean;
  outputShaMatches: boolean;
}

/**
 * Convert a stored canonical-JSON record (snake_case fields, see
 * `canonicaliseRequest`) back into a typed `InferenceRequest`
 * (camelCase). The stored shape uses `max_tokens`/`temperature` while
 * the type uses `maxTokens`/`temperature`; without this conversion the
 * deterministic provider sees `undefined` for those fields and the
 * recomputed canonical hash diverges from the stored `input_sha`.
 */
function storedRecordToRequest(j: Record<string, unknown>): InferenceRequest {
  const ctxRaw = j.context;
  const context = Array.isArray(ctxRaw)
    ? ctxRaw.map((c) => {
        const cc = c as Record<string, unknown>;
        return { id: String(cc.id ?? ""), text: String(cc.text ?? "") };
      })
    : undefined;
  return {
    prompt: String(j.prompt ?? ""),
    system: typeof j.system === "string" && j.system ? j.system : undefined,
    maxTokens:
      j.max_tokens === null || j.max_tokens === undefined ? undefined : Number(j.max_tokens),
    temperature:
      j.temperature === null || j.temperature === undefined ? undefined : Number(j.temperature),
    region: j.region as Region,
    context,
  };
}

/**
 * Replay a run from its stored input. The replay always runs through the
 * deterministic provider — that way the regulator gets the same answer
 * every time, regardless of whether the original used a non-deterministic
 * provider chain. We surface whether the replay matched the original
 * output sha so non-deterministic-by-design models get a clear signal.
 */
export async function replayRun(deps: RunDeps, runId: string): Promise<ReplayResult> {
  const row = await deps.db
    .prepare("SELECT * FROM model_runs WHERE id = ?")
    .bind(runId)
    .first<Record<string, unknown>>();
  if (!row) throw new Error("replay_run_not_found");
  const stored = JSON.parse(String(row.input_json)) as Record<string, unknown>;
  const req = storedRecordToRequest(stored);
  const originalOutput = (JSON.parse(String(row.output_json)) as { text: string }).text;
  const det = new DeterministicProvider();
  const replayResp = await det.generate(req);
  const replayedSha = await sha256Hex(replayResp.text);
  // Recompute canonical input sha from the typed request. Equivalently
  // we could `sha256Hex(String(row.input_json))` since input_json IS
  // the canonical text, but recomputing through `canonicaliseRequest`
  // also catches drift in the canonicalisation function itself — if a
  // future refactor changes the canonical form, audits will surface
  // the mismatch instead of silently re-blessing the new shape.
  const recomputedInputSha = await sha256Hex(canonicaliseRequest(req));
  return {
    runId,
    originalProvider: String(row.provider),
    originalOutput,
    replayOutput: replayResp.text,
    inputShaMatches: recomputedInputSha === String(row.input_sha),
    outputShaMatches: replayedSha === String(row.output_sha),
  };
}

/**
 * Convert an `InferenceResponse` into a Server-Sent Events stream. The
 * stream emits one `data:` chunk per ~32 chars and a final `event: done`
 * marker, matching what the marketing-site SDK expects.
 */
export function responseToSseStream(resp: InferenceResponse): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      const text = resp.text;
      const chunkSize = 32;
      for (let i = 0; i < text.length; i += chunkSize) {
        const piece = text.slice(i, i + chunkSize);
        controller.enqueue(enc.encode(`data: ${JSON.stringify({ delta: piece })}\n\n`));
      }
      controller.enqueue(
        enc.encode(
          `event: done\ndata: ${JSON.stringify({ tokens_in: resp.tokensIn, tokens_out: resp.tokensOut })}\n\n`,
        ),
      );
      controller.close();
    },
  });
}
