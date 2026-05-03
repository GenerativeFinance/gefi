/**
 * The 10 launch-featured models for the GeFi Playground.
 *
 * Phase 1 only seeds metadata — the actual artifacts, versions, and per-model
 * playground UIs land in Phases 5/6. All entries seed as status='draft' so
 * nothing is publicly browsable until reviewed.
 */
export interface FeaturedModelSeed {
  slug: string;
  name: string;
  summary: string;
  category_slug: string;
  developer: string;
}

export const FEATURED_MODELS: ReadonlyArray<FeaturedModelSeed> = [
  {
    slug: "sentiment-from-filings",
    name: "Sentiment from Filings",
    summary: "FinBERT-style classifier scoring 10-K and 10-Q narrative sections.",
    category_slug: "sentiment-analysis",
    developer: "GeFi Labs",
  },
  {
    slug: "portfolio-optimiser",
    name: "Adaptive Portfolio Optimiser",
    summary: "Black-Litterman with ML-derived views and turnover-aware constraints.",
    category_slug: "portfolio-optimisation",
    developer: "GeFi Labs",
  },
  {
    slug: "credit-default-classifier",
    name: "Credit Default Classifier",
    summary: "Gradient-boosted PD model with alt-data feature pack for SME books.",
    category_slug: "credit-scoring",
    developer: "GeFi Labs",
  },
  {
    slug: "fraud-anomaly-detector",
    name: "Fraud Anomaly Detector",
    summary: "Graph autoencoder flagging coordinated fraud rings on payment networks.",
    category_slug: "fraud-detection",
    developer: "GeFi Labs",
  },
  {
    slug: "fx-volatility-forecast",
    name: "FX Volatility Forecast",
    summary: "Multi-horizon realised-vol forecaster across G10 and major EM crosses.",
    category_slug: "market-forecasting",
    developer: "GeFi Labs",
  },
  {
    slug: "yield-curve-predictor",
    name: "Yield Curve Predictor",
    summary: "Nelson-Siegel-Svensson with neural correction terms for major curves.",
    category_slug: "fixed-income",
    developer: "GeFi Labs",
  },
  {
    slug: "compliance-redaction-llm",
    name: "Compliance Redaction LLM",
    summary: "PII and counterparty-name redaction tuned for chat and call transcripts.",
    category_slug: "compliance-aml",
    developer: "GeFi Labs",
  },
  {
    slug: "earnings-surprise-predictor",
    name: "Earnings Surprise Predictor",
    summary: "Pre-print estimate of EPS surprise direction from filings + alt-data.",
    category_slug: "time-series",
    developer: "GeFi Labs",
  },
  {
    slug: "esg-news-classifier",
    name: "ESG News Classifier",
    summary: "Multi-label tagger linking news articles to issuer-level ESG controversies.",
    category_slug: "esg-scoring",
    developer: "GeFi Labs",
  },
  {
    slug: "insurance-claims-triage",
    name: "Insurance Claims Triage",
    summary: "Severity and fraud-risk co-model routing claims to the right adjuster queue.",
    category_slug: "insurance-underwriting",
    developer: "GeFi Labs",
  },
];
