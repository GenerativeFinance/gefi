/**
 * Phase 6 — per-model handler unit tests.
 *
 * One describe block per slug. Each handler is exercised against three
 * common contract checks plus a slug-specific output-shape sanity check:
 *
 *   1. Valid default input → output validates against the handler's
 *      `outputSchema` (re-using the runtime JSON-schema validator).
 *   2. Deterministic — same input yields a byte-identical output.
 *   3. Spec extension fields are present (sanity check that we didn't
 *      regress the Phase 6 surface alongside the Phase 5 keys).
 *
 * Integration-level checks (422 / 429 / audit_log) live in
 * `routes/playground.test.ts`.
 */
import { describe, it, expect } from "vitest";
import { MODEL_HANDLERS } from "./index.js";
import { validateAgainstSchema } from "../lib/schema-validate.js";
import { canonicalInputHash } from "../lib/playground-repo.js";

const SLUGS = [
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
] as const;

describe("Phase 6 model handlers — common contract", () => {
  for (const slug of SLUGS) {
    describe(slug, () => {
      const handler = MODEL_HANDLERS.get(slug)!;

      it("is registered with a recognised runtime", () => {
        expect(handler).toBeDefined();
        expect(handler.runtime).toMatch(/^(synthetic|simulator|onnx-edge|workers-ai|external-llm)$/);
      });

      it("produces an output that validates against outputSchema", async () => {
        const seed = await canonicalInputHash(handler.defaultInput);
        const out = await handler.predict(handler.defaultInput, { seed });
        const v = validateAgainstSchema(out, handler.outputSchema);
        if (!v.valid) {
          // Surface validation errors so the failure message is actionable.
          throw new Error(`output failed schema for ${slug}: ${JSON.stringify(v.errors)}`);
        }
        expect(v.valid).toBe(true);
      });

      it("is deterministic for identical input", async () => {
        const seed = await canonicalInputHash(handler.defaultInput);
        const a = await handler.predict(handler.defaultInput, { seed });
        const b = await handler.predict(handler.defaultInput, { seed });
        expect(JSON.stringify(a)).toBe(JSON.stringify(b));
      });
    });
  }
});

describe("Phase 6 model handlers — spec extension surface", () => {
  it("portfolio-optimiser returns scenarios / frontier / drawdown / stats", async () => {
    const h = MODEL_HANDLERS.get("portfolio-optimiser")!;
    const seed = await canonicalInputHash(h.defaultInput);
    const out = (await h.predict(h.defaultInput, { seed })) as {
      scenarios: unknown[]; frontier: unknown[]; drawdown: unknown[]; stats: { sharpe: number };
    };
    expect(out.scenarios.length).toBe(24);
    expect(out.frontier.length).toBe(5);
    expect(out.drawdown.length).toBeGreaterThan(0);
    expect(typeof out.stats.sharpe).toBe("number");
  });

  it("credit-default-classifier returns score / reason_codes / peer_distribution / proof_hash", async () => {
    const h = MODEL_HANDLERS.get("credit-default-classifier")!;
    const seed = await canonicalInputHash(h.defaultInput);
    const out = (await h.predict(h.defaultInput, { seed })) as {
      score: number; reason_codes: unknown[]; peer_distribution: number[]; proof_hash: string;
    };
    expect(out.score).toBeGreaterThanOrEqual(300);
    expect(out.score).toBeLessThanOrEqual(850);
    expect(out.reason_codes.length).toBeGreaterThan(0);
    expect(out.peer_distribution.length).toBe(20);
    expect(out.proof_hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("compliance-redaction-llm returns controls + proof_hash + qr_url", async () => {
    const h = MODEL_HANDLERS.get("compliance-redaction-llm")!;
    const seed = await canonicalInputHash(h.defaultInput);
    const out = (await h.predict(h.defaultInput, { seed })) as {
      controls: Array<{ id: string; status: string; hash: string }>;
      proof_hash: string; qr_url: string;
    };
    expect(out.controls.length).toBe(5);
    expect(out.controls[0]!.hash).toMatch(/^[0-9a-f]{64}$/);
    expect(out.proof_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(out.qr_url).toMatch(/^https:\/\/verify\.gefi\.io\/proof\//);
  });

  it("insurance-claims-triage returns count + severity forecasts + reserve_adequacy", async () => {
    const h = MODEL_HANDLERS.get("insurance-claims-triage")!;
    const seed = await canonicalInputHash(h.defaultInput);
    const out = (await h.predict(h.defaultInput, { seed })) as {
      count_forecast: Array<{ month: number; count: number }>;
      severity_forecast: Array<{ month: number; severity: number }>;
      reserve_adequacy: { rating: string; rationale: string };
    };
    expect(out.count_forecast.length).toBe(12);
    expect(out.severity_forecast.length).toBe(12);
    expect(["green", "amber", "red"]).toContain(out.reserve_adequacy.rating);
  });

  it("fx-volatility-forecast returns worst_case", async () => {
    const h = MODEL_HANDLERS.get("fx-volatility-forecast")!;
    const seed = await canonicalInputHash(h.defaultInput);
    const out = (await h.predict(h.defaultInput, { seed })) as { worst_case: number };
    expect(typeof out.worst_case).toBe("number");
    expect(out.worst_case).toBeGreaterThan(0);
  });
});
