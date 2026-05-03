/**
 * The 10 launch-featured models for the GeFi Playground.
 *
 * Phase 1 seeded the slugs/names/categories. Phase 2 extends the seed with
 * the catalog filter/sort columns: risk_tier, maturity, price (cents),
 * rating, federated flag, subcategory, and a thumbnail URL.
 *
 * Models still seed as status='draft' until reviewed; the catalog API
 * filters draft+approved (drafts visible in dev) and the marketplace home
 * surfaces the 10 featured ones.
 */
export type RiskTier = "low" | "medium" | "high";
export type Maturity = "experimental" | "beta" | "staging" | "production";

export interface FeaturedModelSeed {
  slug: string;
  name: string;
  summary: string;
  category_slug: string;
  subcategory_slug?: string;
  developer: string;
  risk_tier: RiskTier;
  maturity: Maturity;
  price_cents: number;
  rating_avg: number;
  rating_count: number;
  trending_score: number;
  federated: boolean;
  thumbnail_url?: string;
}

export const FEATURED_MODELS: ReadonlyArray<FeaturedModelSeed> = [
  {
    slug: "sentiment-from-filings",
    name: "Sentiment from Filings",
    summary: "FinBERT-style classifier scoring 10-K and 10-Q narrative sections.",
    category_slug: "sentiment-analysis",
    subcategory_slug: "filings",
    developer: "GeFi Labs",
    risk_tier: "low",
    maturity: "production",
    price_cents: 4900,
    rating_avg: 4.7,
    rating_count: 128,
    trending_score: 0.92,
    federated: false,
  },
  {
    slug: "portfolio-optimiser",
    name: "Adaptive Portfolio Optimiser",
    summary: "Black-Litterman with ML-derived views and turnover-aware constraints.",
    category_slug: "portfolio-optimisation",
    subcategory_slug: "long-only",
    developer: "GeFi Labs",
    risk_tier: "medium",
    maturity: "staging",
    price_cents: 19900,
    rating_avg: 4.5,
    rating_count: 84,
    trending_score: 0.88,
    federated: true,
  },
  {
    slug: "credit-default-classifier",
    name: "Privacy-First Federated Credit Oracle",
    summary: "Gradient-boosted PD model with alt-data feature pack for SME books.",
    category_slug: "credit-scoring",
    subcategory_slug: "sme",
    developer: "GeFi Labs",
    risk_tier: "high",
    maturity: "production",
    price_cents: 14900,
    rating_avg: 4.8,
    rating_count: 211,
    trending_score: 0.97,
    federated: true,
  },
  {
    slug: "fraud-anomaly-detector",
    name: "Fraud Anomaly Detector",
    summary: "Graph autoencoder flagging coordinated fraud rings on payment networks.",
    category_slug: "fraud-detection",
    subcategory_slug: "card",
    developer: "GeFi Labs",
    risk_tier: "high",
    maturity: "production",
    price_cents: 24900,
    rating_avg: 4.6,
    rating_count: 156,
    trending_score: 0.85,
    federated: true,
  },
  {
    slug: "fx-volatility-forecast",
    name: "FX Volatility Forecast",
    summary: "Multi-horizon realised-vol forecaster across G10 and major EM crosses.",
    category_slug: "market-forecasting",
    subcategory_slug: "fx",
    developer: "GeFi Labs",
    risk_tier: "medium",
    maturity: "beta",
    price_cents: 9900,
    rating_avg: 4.3,
    rating_count: 47,
    trending_score: 0.71,
    federated: false,
  },
  {
    slug: "yield-curve-predictor",
    name: "Yield Curve Predictor",
    summary: "Nelson-Siegel-Svensson with neural correction terms for major curves.",
    category_slug: "fixed-income",
    subcategory_slug: "curves",
    developer: "GeFi Labs",
    risk_tier: "medium",
    maturity: "staging",
    price_cents: 12900,
    rating_avg: 4.4,
    rating_count: 62,
    trending_score: 0.66,
    federated: false,
  },
  {
    slug: "compliance-redaction-llm",
    name: "Compliance Redaction LLM",
    summary: "PII and counterparty-name redaction tuned for chat and call transcripts.",
    category_slug: "compliance-aml",
    subcategory_slug: "transaction-monitoring",
    developer: "GeFi Labs",
    risk_tier: "low",
    maturity: "production",
    price_cents: 7900,
    rating_avg: 4.9,
    rating_count: 304,
    trending_score: 0.94,
    federated: false,
  },
  {
    slug: "earnings-surprise-predictor",
    name: "Earnings Surprise Predictor",
    summary: "Pre-print estimate of EPS surprise direction from filings + alt-data.",
    category_slug: "time-series",
    subcategory_slug: "multivariate",
    developer: "GeFi Labs",
    risk_tier: "medium",
    maturity: "experimental",
    price_cents: 0,
    rating_avg: 4.0,
    rating_count: 18,
    trending_score: 0.55,
    federated: false,
  },
  {
    slug: "esg-news-classifier",
    name: "ESG News Classifier",
    summary: "Multi-label tagger linking news articles to issuer-level ESG controversies.",
    category_slug: "esg-scoring",
    subcategory_slug: "controversies",
    developer: "GeFi Labs",
    risk_tier: "low",
    maturity: "beta",
    price_cents: 5900,
    rating_avg: 4.2,
    rating_count: 39,
    trending_score: 0.62,
    federated: false,
  },
  {
    slug: "insurance-claims-triage",
    name: "Insurance Claims Triage",
    summary: "Severity and fraud-risk co-model routing claims to the right adjuster queue.",
    category_slug: "insurance-underwriting",
    subcategory_slug: "p-and-c",
    developer: "GeFi Labs",
    risk_tier: "medium",
    maturity: "staging",
    price_cents: 11900,
    rating_avg: 4.5,
    rating_count: 73,
    trending_score: 0.78,
    federated: true,
  },
];
