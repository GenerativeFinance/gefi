/**
 * The 14 top-level categories that anchor the GeFi Playground library.
 * Order matters — `sort_order` is set from the array position.
 *
 * Slugs are lowercase-kebab and double as URL segments and stable IDs.
 */
export interface CategorySeed {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export const CATEGORIES: ReadonlyArray<CategorySeed> = [
  {
    slug: "sentiment-analysis",
    name: "Sentiment Analysis",
    description: "Extract market-moving sentiment from filings, news, and social signal.",
    icon: "mood",
  },
  {
    slug: "risk-modelling",
    name: "Risk Modelling",
    description: "VaR, stress tests, and scenario analysis for portfolios and books.",
    icon: "shield",
  },
  {
    slug: "fraud-detection",
    name: "Fraud Detection",
    description: "Anomaly detection on transactions, accounts, and behavioural graphs.",
    icon: "alert-triangle",
  },
  {
    slug: "portfolio-optimisation",
    name: "Portfolio Optimisation",
    description: "Mean-variance, Black-Litterman, and ML-driven allocation engines.",
    icon: "pie-chart",
  },
  {
    slug: "credit-scoring",
    name: "Credit Scoring",
    description: "PD/LGD models, alt-data underwriting, and cohort default forecasting.",
    icon: "credit-card",
  },
  {
    slug: "algorithmic-trading",
    name: "Algorithmic Trading",
    description: "Signal generators, execution algos, and microstructure models.",
    icon: "activity",
  },
  {
    slug: "compliance-aml",
    name: "Compliance & AML",
    description: "KYC/KYB enrichment, sanctions screening, and transaction monitoring.",
    icon: "scale",
  },
  {
    slug: "market-forecasting",
    name: "Market Forecasting",
    description: "Macro nowcasts, regime detection, and price-path projection models.",
    icon: "trending-up",
  },
  {
    slug: "insurance-underwriting",
    name: "Insurance Underwriting",
    description: "Pricing, claim severity, and triage models for P&C and life.",
    icon: "umbrella",
  },
  {
    slug: "financial-nlp",
    name: "Financial NLP",
    description: "Domain-tuned LLMs and retrievers for finance documents and chats.",
    icon: "file-text",
  },
  {
    slug: "time-series",
    name: "Time-Series Prediction",
    description: "Foundation models and classical methods for forecasting series.",
    icon: "line-chart",
  },
  {
    slug: "customer-analytics",
    name: "Customer Analytics",
    description: "Lifetime value, churn, propensity, and next-best-action models.",
    icon: "users",
  },
  {
    slug: "fixed-income",
    name: "Fixed Income Analytics",
    description: "Curve building, OAS, and prepayment models for rates and credit.",
    icon: "bar-chart-3",
  },
  {
    slug: "esg-scoring",
    name: "ESG Scoring",
    description: "Issuer scoring, controversy detection, and climate-risk overlays.",
    icon: "leaf",
  },
];
