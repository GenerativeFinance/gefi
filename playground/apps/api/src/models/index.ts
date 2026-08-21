/**
 * Phase 6 model handler registry.
 *
 * Each of the 10 featured slugs has a real backend at `apps/api/src/models/
 * {slug}.ts` exporting a `ModelHandler`. The route layer (`playground.ts`,
 * `v1.ts`) calls into `MODEL_HANDLERS.get(slug)` rather than the Phase 4
 * canned `PLAYGROUND_MOCKS_BY_SLUG` registry.
 *
 * If a slug is missing from this registry, the route falls back to the
 * Phase 4 canned mock (defensive — keeps the playground resilient if a
 * handler crashes import).
 */
import type { ModelHandler } from "./_shared.js";
import { handler as sentiment } from "./sentiment-from-filings.js";
import { handler as portfolio } from "./portfolio-optimiser.js";
import { handler as credit } from "./credit-default-classifier.js";
import { handler as fraud } from "./fraud-anomaly-detector.js";
import { handler as fxvol } from "./fx-volatility-forecast.js";
import { handler as ycurve } from "./yield-curve-predictor.js";
import { handler as compliance } from "./compliance-redaction-llm.js";
import { handler as earnings } from "./earnings-surprise-predictor.js";
import { handler as esg } from "./esg-news-classifier.js";
import { handler as claims } from "./insurance-claims-triage.js";

export const MODEL_HANDLERS: ReadonlyMap<string, ModelHandler> = new Map([
  [sentiment.slug, sentiment],
  [portfolio.slug, portfolio],
  [credit.slug, credit],
  [fraud.slug, fraud],
  [fxvol.slug, fxvol],
  [ycurve.slug, ycurve],
  [compliance.slug, compliance],
  [earnings.slug, earnings],
  [esg.slug, esg],
  [claims.slug, claims],
]);

export type { ModelHandler, ModelRuntime, PredictContext } from "./_shared.js";
