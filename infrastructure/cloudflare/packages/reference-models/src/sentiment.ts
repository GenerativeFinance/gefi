/**
 * sentiment-from-filings — RAG over a small fixture corpus of SEC filings
 * (10-K, 10-Q, 8-K excerpts). The retrieval step picks the top-k chunks
 * by token-overlap with the query, then the prompt is assembled and
 * handed to the gateway.
 *
 * In dev/test the deterministic provider produces a stable summary; in
 * production the gateway will route to the Workers-AI provider first.
 */

export interface FilingChunk {
  id: string;
  ticker: string;
  filing: "10-K" | "10-Q" | "8-K";
  filed_at: number;
  text: string;
}

/**
 * Tiny but representative fixture corpus. Real production wires R2 +
 * Vectorize and the corpus is loaded from there; for tests / paper
 * trading the in-memory corpus is enough to exercise the full path.
 */
export const FIXTURE_FILINGS: FilingChunk[] = [
  {
    id: "AAPL-10K-2024-1",
    ticker: "AAPL",
    filing: "10-K",
    filed_at: 1_730_000_000,
    text: "Apple iPhone revenue grew 5% year-over-year, services hit a record high, and gross margin expanded.",
  },
  {
    id: "AAPL-10Q-2024-3",
    ticker: "AAPL",
    filing: "10-Q",
    filed_at: 1_725_000_000,
    text: "Apple sees softness in China demand and forecasts conservative iPhone shipments next quarter.",
  },
  {
    id: "MSFT-10K-2024-1",
    ticker: "MSFT",
    filing: "10-K",
    filed_at: 1_730_000_000,
    text: "Microsoft Azure revenue grew 30%, AI workloads contributed materially, capex increased significantly.",
  },
  {
    id: "MSFT-8K-2024-2",
    ticker: "MSFT",
    filing: "8-K",
    filed_at: 1_731_000_000,
    text: "Microsoft announced a major OpenAI partnership extension and a new infrastructure agreement.",
  },
  {
    id: "TSLA-10K-2024-1",
    ticker: "TSLA",
    filing: "10-K",
    filed_at: 1_730_000_000,
    text: "Tesla deliveries declined year-over-year, average selling prices fell, energy storage grew strongly.",
  },
];

function tokenise(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

export interface RetrieveInput {
  query: string;
  ticker?: string;
  topK?: number;
  corpus?: FilingChunk[];
}

export interface RetrievedChunk extends FilingChunk {
  score: number;
}

export function retrieve(input: RetrieveInput): RetrievedChunk[] {
  const corpus = input.corpus ?? FIXTURE_FILINGS;
  const queryTokens = tokenise(input.query);
  const scored: RetrievedChunk[] = [];
  for (const chunk of corpus) {
    if (input.ticker && chunk.ticker.toUpperCase() !== input.ticker.toUpperCase()) continue;
    const haystack = tokenise(chunk.text);
    let score = 0;
    for (const q of queryTokens) {
      for (const h of haystack) {
        if (h === q) score += 2;
        else if (h.startsWith(q)) score += 1;
      }
    }
    if (score > 0) scored.push({ ...chunk, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, input.topK ?? 4);
}

export interface AssembledPrompt {
  system: string;
  prompt: string;
  context: Array<{ id: string; text: string }>;
}

export function assemblePrompt(query: string, chunks: RetrievedChunk[]): AssembledPrompt {
  const system =
    "You are a financial analyst. Read the provided filing excerpts and respond with " +
    "a sentiment label (BULLISH | NEUTRAL | BEARISH) and a one-sentence rationale.";
  const ctx = chunks.map((c) => `[${c.id} ${c.filing}] ${c.text}`).join("\n");
  const prompt = `Question: ${query}\n\nExcerpts:\n${ctx}\n\nAnswer:`;
  return {
    system,
    prompt,
    context: chunks.map((c) => ({ id: c.id, text: c.text })),
  };
}

/**
 * Deterministic fallback used when the provider chain returns the
 * deterministic-echo. Maps overlap-score sums to a sentiment label.
 */
export function deterministicSentiment(chunks: RetrievedChunk[]): "BULLISH" | "NEUTRAL" | "BEARISH" {
  let score = 0;
  const positives = ["grew", "record", "strong", "expanded", "partnership"];
  const negatives = ["softness", "declined", "fell", "conservative", "softening"];
  for (const c of chunks) {
    const t = c.text.toLowerCase();
    for (const p of positives) if (t.includes(p)) score += 1;
    for (const n of negatives) if (t.includes(n)) score -= 1;
  }
  if (score > 0) return "BULLISH";
  if (score < 0) return "BEARISH";
  return "NEUTRAL";
}
