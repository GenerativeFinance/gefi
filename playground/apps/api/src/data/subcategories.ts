/**
 * Subcategories — chip-row entries that filter the model grid on a category page.
 *
 * The Phase 2 spec mandates the four risk-assessment chips (VaR, Stress-Test,
 * Volatility, Tail-Risk). The rest are illustrative starters so other category
 * landing pages also get a populated chip row.
 */
export interface SubcategorySeed {
  slug: string;
  category_slug: string;
  name: string;
}

export const SUBCATEGORIES: ReadonlyArray<SubcategorySeed> = [
  // risk-assessment (mandated by spec)
  { slug: "var", category_slug: "risk-assessment", name: "VaR" },
  { slug: "stress-test", category_slug: "risk-assessment", name: "Stress-Test" },
  { slug: "volatility", category_slug: "risk-assessment", name: "Volatility" },
  { slug: "tail-risk", category_slug: "risk-assessment", name: "Tail-Risk" },

  // sentiment-analysis
  { slug: "filings", category_slug: "sentiment-analysis", name: "Filings" },
  { slug: "news", category_slug: "sentiment-analysis", name: "News" },
  { slug: "social", category_slug: "sentiment-analysis", name: "Social" },

  // credit-scoring
  { slug: "consumer", category_slug: "credit-scoring", name: "Consumer" },
  { slug: "sme", category_slug: "credit-scoring", name: "SME" },
  { slug: "corporate", category_slug: "credit-scoring", name: "Corporate" },

  // fraud-detection
  { slug: "card", category_slug: "fraud-detection", name: "Card" },
  { slug: "wire", category_slug: "fraud-detection", name: "Wire" },
  { slug: "account-takeover", category_slug: "fraud-detection", name: "Account Takeover" },

  // market-forecasting
  { slug: "fx", category_slug: "market-forecasting", name: "FX" },
  { slug: "equities", category_slug: "market-forecasting", name: "Equities" },
  { slug: "rates", category_slug: "market-forecasting", name: "Rates" },

  // portfolio-optimisation
  { slug: "long-only", category_slug: "portfolio-optimisation", name: "Long-only" },
  { slug: "long-short", category_slug: "portfolio-optimisation", name: "Long/Short" },

  // compliance-aml
  { slug: "kyc", category_slug: "compliance-aml", name: "KYC" },
  { slug: "sanctions", category_slug: "compliance-aml", name: "Sanctions" },
  { slug: "transaction-monitoring", category_slug: "compliance-aml", name: "Transaction Monitoring" },

  // fixed-income
  { slug: "curves", category_slug: "fixed-income", name: "Curves" },
  { slug: "prepayment", category_slug: "fixed-income", name: "Prepayment" },

  // insurance-underwriting
  { slug: "p-and-c", category_slug: "insurance-underwriting", name: "P&C" },
  { slug: "life", category_slug: "insurance-underwriting", name: "Life" },

  // esg-scoring
  { slug: "controversies", category_slug: "esg-scoring", name: "Controversies" },
  { slug: "climate", category_slug: "esg-scoring", name: "Climate" },

  // financial-nlp
  { slug: "summarisation", category_slug: "financial-nlp", name: "Summarisation" },
  { slug: "qa", category_slug: "financial-nlp", name: "Q&A" },

  // time-series
  { slug: "univariate", category_slug: "time-series", name: "Univariate" },
  { slug: "multivariate", category_slug: "time-series", name: "Multivariate" },

  // customer-analytics
  { slug: "churn", category_slug: "customer-analytics", name: "Churn" },
  { slug: "ltv", category_slug: "customer-analytics", name: "LTV" },

  // algorithmic-trading
  { slug: "execution", category_slug: "algorithmic-trading", name: "Execution" },
  { slug: "signal", category_slug: "algorithmic-trading", name: "Signal" },
];
