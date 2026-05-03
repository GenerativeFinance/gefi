/**
 * Performance-tab metrics seed — one `model_versions` row per featured model
 * with a JSON-encoded metrics blob containing three series:
 *
 *   - equityCurve : [unix_seconds, cumulative_return][]
 *   - accuracy    : [unix_seconds, accuracy_pct][]
 *   - latency     : { p50_ms: number, p95_ms: number }
 *
 * The Performance tab hydrates from `model_versions.metrics` (latest version)
 * and renders three uPlot charts. Missing series → empty-state component.
 *
 * The numbers are deterministic per slug so snapshot tests stay stable.
 */

export interface MetricsBlob {
  equityCurve: [number, number][];
  accuracy: [number, number][];
  latency: { p50_ms: number; p95_ms: number };
}

export interface MetricsSeed {
  model_slug: string;
  version: string;
  version_label: string;
  metrics: MetricsBlob;
}

const POINTS = 24;
const HOUR = 3600;
const START = 1730_000_000 - POINTS * HOUR; // ~24 hours of fake history

function deterministicSeries(slug: string, base: number, drift: number): [number, number][] {
  let h = 0x811c9dc5;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const out: [number, number][] = [];
  let value = base;
  for (let i = 0; i < POINTS; i++) {
    h = Math.imul(h ^ (i + 1), 0x01000193) >>> 0;
    const noise = ((h % 1000) / 1000 - 0.5) * drift;
    value = Math.max(0, value + noise);
    out.push([START + i * HOUR, Number(value.toFixed(4))]);
  }
  return out;
}

const SLUGS = [
  "sentiment-from-filings",
  "portfolio-optimiser",
  "credit-default-classifier",
  "fraud-anomaly-detector",
  "fx-volatility-forecast",
  "yield-curve-predictor",
  "esg-scorer",
  "trade-execution-rl",
  "lstm-price-predictor",
  "compliance-redaction-llm",
];

export const METRICS: ReadonlyArray<MetricsSeed> = SLUGS.map((slug, i) => ({
  model_slug: slug,
  version: "1.0.0",
  version_label: "v1.0.0 (production)",
  metrics: {
    equityCurve: deterministicSeries(slug, 1.0, 0.08),
    accuracy: deterministicSeries(slug, 0.7 + (i % 3) * 0.05, 0.03),
    latency: { p50_ms: 18 + i * 3, p95_ms: 90 + i * 12 },
  },
}));
