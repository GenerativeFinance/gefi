/**
 * Phase-4 generic playground mocks.
 *
 * Each featured model declares:
 *   - `inputSchema`   — a JSON Schema (Draft-07 subset) that drives the
 *                       SchemaForm auto-form on the Try tab and the
 *                       server-side validator on `POST /run`.
 *   - `outputSchema`  — JSON Schema describing the canned response so the
 *                       generic Result panel can pick widgets per field.
 *   - `defaultInput`  — example values pre-filled into the form on first
 *                       paint; also the input the canned mock is keyed to.
 *   - `mockOutput(input)` — pure deterministic function returning the
 *                       canned response. Phase 6 will swap this for the
 *                       real per-model backend.
 *
 * Schema features used (all supported by the in-house validator in
 * `lib/schema-validate.ts` AND mirrored in the client SchemaForm):
 *
 *   number / integer  : minimum, maximum, multipleOf
 *   string            : enum, format ("date"), maxLength
 *   boolean
 *   array             : items (primitive or object), minItems, maxItems
 *   object            : properties, required, additionalProperties:false
 *
 * Keep the schemas small — the goal is a credible per-model Try form, not a
 * faithful production payload. Phase 5 replaces these with handcrafted UIs.
 */
export interface JsonSchema {
  type?: "object" | "array" | "string" | "number" | "integer" | "boolean";
  title?: string;
  description?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  additionalProperties?: boolean;
  items?: JsonSchema;
  enum?: (string | number)[];
  format?: "date";
  minimum?: number;
  maximum?: number;
  multipleOf?: number;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  default?: unknown;
}

export interface PlaygroundMock {
  slug: string;
  trainingEnabled: boolean;
  inputSchema: JsonSchema;
  outputSchema: JsonSchema;
  defaultInput: Record<string, unknown>;
  mockOutput: (input: Record<string, unknown>) => Record<string, unknown>;
}

/** Tiny deterministic PRNG (mulberry32) seeded from a string for stable mocks. */
function seededFloat(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i);
  let t = (h ^ 0x9e3779b9) >>> 0;
  t = (t + 0x6d2b79f5) >>> 0;
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
}

function round(n: number, places = 4): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

const NUMERIC_SERIES = (seed: string, n = 24, base = 0.5, drift = 0.05) => {
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    v = Math.max(0, v + (seededFloat(seed + i) - 0.5) * drift);
    out.push(round(v, 4));
  }
  return out;
};

export const PLAYGROUND_MOCKS: ReadonlyArray<PlaygroundMock> = [
  // ── 1. sentiment-from-filings ────────────────────────────────────────────
  {
    slug: "sentiment-from-filings",
    trainingEnabled: false,
    inputSchema: {
      type: "object",
      title: "Filing snippet",
      additionalProperties: false,
      required: ["text"],
      properties: {
        text: { type: "string", title: "Filing text", maxLength: 4000 },
        section: {
          type: "string",
          title: "Section",
          enum: ["MD&A", "Risk Factors", "Liquidity", "Other"],
          default: "MD&A",
        },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
        confidence: { type: "number" },
        topics: { type: "array", items: { type: "string" } },
      },
    },
    defaultInput: {
      text: "Our liquidity position remains strong with $2.3B in cash and revolving facilities…",
      section: "Liquidity",
    },
    mockOutput: (input) => {
      const txt = String(input.text ?? "").toLowerCase();
      const negHits = (txt.match(/\b(loss|decline|risk|weak|warning)\b/g) ?? []).length;
      const posHits = (txt.match(/\b(strong|growth|gain|improve|robust)\b/g) ?? []).length;
      const sentiment = negHits > posHits ? "negative" : posHits > negHits ? "positive" : "neutral";
      return {
        sentiment,
        confidence: round(0.6 + seededFloat(txt) * 0.35, 3),
        topics: ["liquidity", "capital structure", "outlook"].slice(0, 2 + (negHits % 2)),
      };
    },
  },
  // ── 2. portfolio-optimiser ───────────────────────────────────────────────
  {
    slug: "portfolio-optimiser",
    trainingEnabled: true,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["tickers", "risk_aversion"],
      properties: {
        tickers: {
          type: "array",
          title: "Tickers",
          items: { type: "string" },
          minItems: 2,
          maxItems: 20,
        },
        risk_aversion: {
          type: "number",
          title: "Risk aversion (λ)",
          minimum: 0.1,
          maximum: 10,
          multipleOf: 0.1,
          default: 2.5,
        },
        long_only: { type: "boolean", title: "Long only", default: true },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        weights: { type: "array", items: { type: "number" } },
        expected_return: { type: "number" },
        expected_vol: { type: "number" },
      },
    },
    defaultInput: {
      tickers: ["AAPL", "MSFT", "NVDA", "GOOGL"],
      risk_aversion: 2.5,
      long_only: true,
    },
    mockOutput: (input) => {
      const t = (input.tickers as string[]) ?? [];
      const weights = t.map((s, i) => round(seededFloat(s + i) + 0.1, 4));
      const sum = weights.reduce((a, b) => a + b, 0) || 1;
      const norm = weights.map((w) => round(w / sum, 4));
      return {
        weights: norm,
        expected_return: round(0.06 + seededFloat(t.join("|")) * 0.06, 4),
        expected_vol: round(0.12 + seededFloat(t.join(":")) * 0.08, 4),
      };
    },
  },
  // ── 3. credit-default-classifier ─────────────────────────────────────────
  {
    slug: "credit-default-classifier",
    trainingEnabled: true,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["revenue", "debt_to_equity", "industry"],
      properties: {
        revenue: { type: "number", title: "Revenue (USD)", minimum: 0 },
        debt_to_equity: { type: "number", title: "Debt/Equity", minimum: 0, maximum: 20 },
        industry: {
          type: "string",
          enum: ["retail", "manufacturing", "tech", "healthcare", "energy"],
        },
        years_in_business: { type: "integer", minimum: 0, maximum: 200, default: 5 },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        pd_12m: { type: "number" },
        rating: { type: "string" },
        drivers: { type: "array", items: { type: "string" } },
      },
    },
    defaultInput: {
      revenue: 5_000_000,
      debt_to_equity: 1.4,
      industry: "manufacturing",
      years_in_business: 8,
    },
    mockOutput: (input) => {
      const de = Number(input.debt_to_equity ?? 1);
      const pd = Math.max(0.005, Math.min(0.4, 0.02 + de * 0.04));
      const rating = pd < 0.03 ? "AA" : pd < 0.06 ? "A" : pd < 0.1 ? "BBB" : pd < 0.18 ? "BB" : "B";
      return {
        pd_12m: round(pd, 4),
        rating,
        drivers: ["leverage", "industry concentration", "vintage"].slice(0, de > 2 ? 3 : 2),
      };
    },
  },
  // ── 4. fraud-anomaly-detector ────────────────────────────────────────────
  {
    slug: "fraud-anomaly-detector",
    trainingEnabled: false,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["transactions"],
      properties: {
        transactions: {
          type: "array",
          minItems: 1,
          maxItems: 100,
          items: {
            type: "object",
            required: ["amount", "merchant"],
            properties: {
              amount: { type: "number", minimum: 0 },
              merchant: { type: "string" },
              country: { type: "string", default: "US" },
            },
          },
        },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        score: { type: "number" },
        flagged_indexes: { type: "array", items: { type: "integer" } },
      },
    },
    defaultInput: {
      transactions: [
        { amount: 12.5, merchant: "Coffee Co", country: "US" },
        { amount: 4500, merchant: "Electronics Direct", country: "RO" },
        { amount: 9.99, merchant: "Streaming Inc", country: "US" },
      ],
    },
    mockOutput: (input) => {
      const txs = (input.transactions as { amount: number; country?: string }[]) ?? [];
      const flagged: number[] = [];
      txs.forEach((t, i) => {
        const risky = t.amount > 1000 || (t.country && t.country !== "US");
        if (risky) flagged.push(i);
      });
      return {
        score: round(Math.min(1, flagged.length / Math.max(1, txs.length) + 0.1), 3),
        flagged_indexes: flagged,
      };
    },
  },
  // ── 5. fx-volatility-forecast ────────────────────────────────────────────
  {
    slug: "fx-volatility-forecast",
    trainingEnabled: false,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["pair", "horizon_days"],
      properties: {
        pair: { type: "string", enum: ["EURUSD", "USDJPY", "GBPUSD", "USDCHF", "AUDUSD"] },
        horizon_days: { type: "integer", minimum: 1, maximum: 90, default: 10 },
        as_of: { type: "string", format: "date" },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        forecast_vol: { type: "array", items: { type: "number" } },
        confidence_lo: { type: "array", items: { type: "number" } },
        confidence_hi: { type: "array", items: { type: "number" } },
      },
    },
    defaultInput: { pair: "EURUSD", horizon_days: 10, as_of: "2026-04-01" },
    mockOutput: (input) => {
      const n = Math.max(1, Math.min(90, Number(input.horizon_days ?? 10)));
      const seed = String(input.pair ?? "EURUSD");
      const f = NUMERIC_SERIES(seed, n, 0.08, 0.012);
      return {
        forecast_vol: f,
        confidence_lo: f.map((v) => round(v * 0.85, 4)),
        confidence_hi: f.map((v) => round(v * 1.15, 4)),
      };
    },
  },
  // ── 6. yield-curve-predictor ─────────────────────────────────────────────
  {
    slug: "yield-curve-predictor",
    trainingEnabled: false,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["curve", "horizon_months"],
      properties: {
        curve: { type: "string", enum: ["UST", "BUND", "GILT", "JGB"] },
        horizon_months: { type: "integer", minimum: 1, maximum: 60, default: 12 },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        tenors_years: { type: "array", items: { type: "number" } },
        yields_pct: { type: "array", items: { type: "number" } },
      },
    },
    defaultInput: { curve: "UST", horizon_months: 12 },
    mockOutput: (input) => {
      const tenors = [0.25, 0.5, 1, 2, 3, 5, 7, 10, 20, 30];
      const seed = String(input.curve ?? "UST") + String(input.horizon_months ?? 12);
      const yields = tenors.map((t, i) => round(2 + Math.log(t + 1) * 0.7 + seededFloat(seed + i) * 0.4, 3));
      return { tenors_years: tenors, yields_pct: yields };
    },
  },
  // ── 7. compliance-redaction-llm ──────────────────────────────────────────
  {
    slug: "compliance-redaction-llm",
    trainingEnabled: false,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["text"],
      properties: {
        text: { type: "string", title: "Transcript", maxLength: 4000 },
        redact_counterparties: { type: "boolean", default: true },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        redacted_text: { type: "string" },
        spans_redacted: { type: "integer" },
      },
    },
    defaultInput: {
      text: "Spoke with John Smith at Acme Corp about the Q4 trade; SSN 123-45-6789.",
      redact_counterparties: true,
    },
    mockOutput: (input) => {
      let text = String(input.text ?? "");
      let spans = 0;
      text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, () => (spans++, "[REDACTED:SSN]"));
      if (input.redact_counterparties) {
        text = text.replace(/\b([A-Z][a-z]+\s[A-Z][a-z]+)\b/g, () => (spans++, "[REDACTED:NAME]"));
      }
      return { redacted_text: text, spans_redacted: spans };
    },
  },
  // ── 8. earnings-surprise-predictor ───────────────────────────────────────
  {
    slug: "earnings-surprise-predictor",
    trainingEnabled: false,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["ticker", "consensus_eps"],
      properties: {
        ticker: { type: "string" },
        consensus_eps: { type: "number" },
        revisions_30d: { type: "integer", minimum: -50, maximum: 50, default: 0 },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        surprise_direction: { type: "string", enum: ["beat", "inline", "miss"] },
        surprise_pct: { type: "number" },
        confidence: { type: "number" },
      },
    },
    defaultInput: { ticker: "AAPL", consensus_eps: 2.1, revisions_30d: 3 },
    mockOutput: (input) => {
      const r = Number(input.revisions_30d ?? 0);
      const dir = r > 1 ? "beat" : r < -1 ? "miss" : "inline";
      return {
        surprise_direction: dir,
        surprise_pct: round((r / 10) * (dir === "miss" ? -1 : 1), 3),
        confidence: round(0.55 + seededFloat(String(input.ticker ?? "")) * 0.3, 3),
      };
    },
  },
  // ── 9. esg-news-classifier ───────────────────────────────────────────────
  {
    slug: "esg-news-classifier",
    trainingEnabled: false,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["headline"],
      properties: {
        headline: { type: "string", maxLength: 300 },
        body: { type: "string", maxLength: 2000 },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        labels: { type: "array", items: { type: "string" } },
        severity: { type: "string", enum: ["low", "medium", "high"] },
      },
    },
    defaultInput: {
      headline: "Regulator fines bank for AML breaches",
      body: "The supervisor cited weak transaction monitoring and missed sanctions hits.",
    },
    mockOutput: (input) => {
      const txt = (String(input.headline ?? "") + " " + String(input.body ?? "")).toLowerCase();
      const labels: string[] = [];
      if (txt.includes("aml") || txt.includes("sanctions")) labels.push("governance:financial-crime");
      if (txt.includes("emission") || txt.includes("carbon")) labels.push("environmental:emissions");
      if (txt.includes("strike") || txt.includes("labor")) labels.push("social:labor-relations");
      if (labels.length === 0) labels.push("governance:other");
      const severity = txt.includes("fines") || txt.includes("breach") ? "high" : "medium";
      return { labels, severity };
    },
  },
  // ── 10. insurance-claims-triage ──────────────────────────────────────────
  {
    slug: "insurance-claims-triage",
    trainingEnabled: true,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["claim_amount", "loss_type"],
      properties: {
        claim_amount: { type: "number", minimum: 0 },
        loss_type: { type: "string", enum: ["auto", "property", "liability", "workers-comp"] },
        prior_claims: { type: "integer", minimum: 0, default: 0 },
        date_of_loss: { type: "string", format: "date" },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        severity: { type: "string", enum: ["low", "medium", "high"] },
        fraud_risk: { type: "number" },
        queue: { type: "string" },
      },
    },
    defaultInput: {
      claim_amount: 4500,
      loss_type: "auto",
      prior_claims: 1,
      date_of_loss: "2026-04-15",
    },
    mockOutput: (input) => {
      const amt = Number(input.claim_amount ?? 0);
      const sev = amt > 50_000 ? "high" : amt > 5_000 ? "medium" : "low";
      const fraud = round(Math.min(1, Number(input.prior_claims ?? 0) * 0.15 + (amt > 25_000 ? 0.3 : 0)), 3);
      const queue = sev === "high" ? "complex-loss" : fraud > 0.4 ? "fraud-investigation" : "fast-track";
      return { severity: sev, fraud_risk: fraud, queue };
    },
  },
];

export const PLAYGROUND_MOCKS_BY_SLUG: ReadonlyMap<string, PlaygroundMock> = new Map(
  PLAYGROUND_MOCKS.map((m) => [m.slug, m]),
);
