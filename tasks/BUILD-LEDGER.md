# GeFi build ledger

Source of truth for the continuous Claude Code run. **Read this first on every run
and resume from the first unchecked item. Never rebuild a ticked item.**

Prompts: `tasks/prompt-library.json` (465 prompts; 125 are Claude Code tasks).
Artifact: https://claude.ai/code/artifact/bca9b018-9001-45a8-a871-bc06a795e859

| | count |
|---|---|
| Claude Code tasks | 125 |
| Models | 92 |
| Surfaces | 32 |

Rules: model tasks are **content-only** (`_models/<slug>.md` + a MODELS row in
`assets/js/dashboard.js`) and must not touch `_layouts/model.html` — task 00 owns it.
Never touch `infrastructure/cloudflare/`. Build with
`JEKYLL_ENV=production bundle exec jekyll build` before every commit.

---

## Step 1 — Harness (blocks everything else)

| ✓ | # | Task | Status / Notes |
|---|---|---|---|
| [x] | 00 | Model Page Harness (`_layouts/model.html` + `assets/js/model-demo.js`) | Done. Front-matter `demo:` (score/curve/table/text) + `analytics: true`; also created `assets/js/dashboard.js` (SVG primitives + MODELS registry) which did not exist. Build passed; verified in Chromium. |

## Step 2 — Model pages (92), P0 → P1 → P2

| ✓ | # | Model | Wing | Priority | Status / Notes |
|---|---|---|---|---|---|
| [x] | 76 | GeFi Copilot (`gefi-copilot`) | Generative AI | P0 | Done. Content-only; text-output demo + analytics row. Build passed. |
| [x] | 77 | IC & Credit Memo Generator (`ic-credit-memo-generator`) | Generative AI | P0 | Done. Content-only; table-output demo + analytics row. Build passed. |
| [x] | 78 | Board & LP Report Generator (`board-lp-report-generator`) | Generative AI | P0 | Done. Content-only; table-output demo + analytics row. Build passed. |
| [x] | 79 | Scenario Narrative Engine (`scenario-narrative-engine`) | Generative AI | P0 | Done. Content-only; text-output demo + analytics row. Build passed. |
| [x] | 80 | Disclosure Drafter (`disclosure-drafter`) | Generative AI | P0 | Done. Content-only; table-output demo + analytics row. High-risk framing on page per spec. Build passed. |
| [x] | 01 | Macro Nowcast (`macro-nowcast`) | Investing & Macro | P1 | Done. Enriched existing page + curve demo; MODELS row already present. Copy per customer/backend prompts — the cited `tasks/01-enrich-ai-models-library.md` does not exist (handoff known gap). Build passed. |
| [x] | 02 | Portfolio Optimiser (`portfolio-optimiser`) | Investing & Macro | P1 | Done. Enriched existing page + table demo (allocation). Copy per customer/backend prompts (cited brief missing). Build passed. |
| [x] | 03 | Sentiment from Filings (`sentiment-from-filings`) | Investing & Macro | P1 | Done. Enriched existing page + score demo. NOTE: spec wants a -1..+1 gauge; harness gauge is unsigned, so the page shows a normalised 0-1 score and says so. Signed gauge = future harness change. Build passed. |
| [x] | 04 | Yield-Curve Forecaster (`yield-curve-forecaster`) | Investing & Macro | P1 | Done. New page + curve demo + MODELS row. Copy per customer/backend prompts (cited brief missing). Build passed. |
| [x] | 05 | Commodities Flow Nowcast (`commodities-flow-nowcast`) | Investing & Macro | P1 | Done. New page + curve demo + MODELS row. Copy per customer/backend prompts (cited brief missing). Build passed. |
| [x] | 06 | Credit Oracle (`credit-oracle`) | Credit & Risk | P1 | Done. Enriched existing page + score demo w/ adverse-action explanation formats. Copy per customer/backend prompts (cited brief missing). Build passed. |
| [x] | 07 | Liquidity Stress Engine (`liquidity-stress-engine`) | Credit & Risk | P1 | Done. New page + curve demo + MODELS row. NOTE: spec wants a conformity-assessment badge beside the risk badge; badge slots live in the layout, so status is surfaced in metric tiles + copy. Badge slot = future harness change. Build passed. |
| [x] | 08 | Mortgage Default & Prepay (`mortgage-default-prepay`) | Credit & Risk | P1 | Done. New page + curve demo + MODELS row. Copy per customer/backend prompts (cited brief missing). Build passed. |
| [x] | 09 | Vendor Risk AIOps (`vendor-risk-aiops`) | Credit & Risk | P1 | Done. New page + score demo + MODELS row. Copy per customer/backend prompts (cited brief missing). Build passed. |
| [x] | 10 | Fraud Graph (`fraud-graph`) | Fraud & AML | P1 | Done. Enriched existing page + score demo. Also corrected its task-00 seed row (was risk high/federated, page says low/not federated). Build passed. |
| [x] | 11 | Transaction Monitoring Explainer (`transaction-monitoring-explainer`) | Fraud & AML | P1 | Done. New page + table demo + MODELS row. Copy per customer/backend prompts (cited brief missing). Build passed. |
| [x] | 12 | Claim Fraud Vision (`claim-fraud-vision`) | Fraud & AML | P1 | Done. New page + score demo + MODELS row. Copy per customer/backend prompts (cited brief missing). Build passed. |
| [x] | 13 | Trade Finance Doc AI (`trade-finance-doc-ai`) | Trade, Payments & KYB | P1 | Done. Enriched existing page + table demo. Copy per customer/backend prompts (cited brief missing). Build passed. |
| [x] | 14 | Cross-Border Payment Router (`cross-border-payment-router`) | Trade, Payments & KYB | P1 | Done. New page + table demo + MODELS row. Copy per customer/backend prompts (cited brief missing). Build passed. |
| [x] | 15 | KYB Graph (`kyb-graph`) | Trade, Payments & KYB | P1 | Done. New page + table demo + MODELS row. Copy per customer/backend prompts (cited brief missing). Build passed. |
| [x] | 16 | Tax Residency Classifier (`tax-residency-classifier`) | Compliance & Regulatory | P1 | Done. New page + table demo (treaty tie-breaker trace) + MODELS row. Copy per customer/backend prompts (cited brief missing). Build passed. |
| [x] | 17 | Regulatory Change Summariser (`regulatory-change-summariser`) | Compliance & Regulatory | P1 | Done. New page + table demo + MODELS row. Copy per customer/backend prompts (cited brief missing). Build passed. |
| [x] | 18 | ESG Materiality Scorer (`esg-materiality-scorer`) | ESG | P1 | Done. New page + table demo (two-axis matrix) + MODELS row. Copy per customer/backend prompts (cited brief missing). Build passed. |
| [x] | 81 | CECL / IFRS 9 ECL Engine (`cecl-ifrs9-ecl-engine`) | Banking Book & Provisioning | P1 | Done. New page + table demo (provision waterfall) + MODELS row. Build passed. |
| [x] | 82 | IRRBB / ALM Modeler (`irrbb-alm-modeler`) | Banking Book & Provisioning | P1 | Done. New page + curve demo (EVE by bucket) + MODELS row. Build passed. |
| [x] | 83 | Deposit Behavior Model (`deposit-behavior-model`) | Banking Book & Provisioning | P1 | Done. New page + curve demo + MODELS row. Build passed. |
| [x] | 84 | Basel RWA & Capital Calculator (`basel-rwa-capital-calculator`) | Banking Book & Provisioning | P1 | Done. New page + table demo (rule-referenced weights) + MODELS row. Build passed. |
| [x] | 88 | Monte Carlo Simulation Service (`monte-carlo-simulation-service`) | Simulation & Market Primitives | P1 | Done. New page + table demo (percentiles + std. error) + MODELS row. Build passed. |
| [x] | 89 | Volatility Surface Service (`volatility-surface-service`) | Simulation & Market Primitives | P1 | Done. New page + curve demo + MODELS row. Build passed. |
| [x] | 90 | LP Treasury & Cash Management (`lp-treasury-cash-management`) | Simulation & Market Primitives | P1 | Done. New page + table demo (cash ladder) + MODELS row. Build passed. |
| [x] | 19 | Liquidation Valuation (`liquidation-valuation`) | Valuation (advanced) | P2 | Done. New page + table demo (claims waterfall) + MODELS row. Build passed. |
| [x] | 20 | Real Options Valuation (`real-options-valuation`) | Valuation (advanced) | P2 | Done. New page + score demo (flexibility share) + MODELS row. Build passed. |
| [x] | 21 | Merger Model (`merger-model`) | M&A & Corporate Transactions | P2 | Done. New page + table demo (pro forma) + MODELS row. Build passed. |
| [x] | 22 | Accretion / Dilution (`accretion-dilution`) | M&A & Corporate Transactions | P2 | Done. New page + curve demo + MODELS row. Build passed. |
| [x] | 23 | LBO Model (`lbo-model`) | M&A & Corporate Transactions | P2 | Done. New page + table demo (returns decomposition) + MODELS row. Build passed. |
| [x] | 24 | MBO Model (`mbo-model`) | M&A & Corporate Transactions | P2 | Done. New page + table demo (stakeholder proceeds) + MODELS row. Build passed. |
| [x] | 25 | Spin-Off Model (`spin-off-model`) | M&A & Corporate Transactions | P2 | Done. New page + table demo (parent/SpinCo + stranded cost) + MODELS row. Build passed. |
| [x] | 26 | Carve-Out Model (`carve-out-model`) | M&A & Corporate Transactions | P2 | Done. New page + table demo (reported/allocated/pro forma) + MODELS row. Build passed. |
| [x] | 27 | Recapitalization (`recapitalization-model`) | M&A & Corporate Transactions | P2 | Done. New page + table demo (before/after + headroom) + MODELS row. Build passed. |
| [x] | 28 | Purchase Price Allocation (`purchase-price-allocation`) | M&A & Corporate Transactions | P2 | Done. New page + table demo (allocation + reconciliation) + MODELS row. Build passed. |
| [x] | 29 | Growth Equity Model (`growth-equity-model`) | Venture & Growth Capital | P2 | Done. New page + table demo (returns by exit scenario) + MODELS row. Build passed. |
| [x] | 30 | IPO Model (`ipo-model`) | Venture & Growth Capital | P2 | Done. New page + table demo (price range) + MODELS row. Access-logging framing leads the page per spec. Build passed. |
| [x] | 31 | Startup Financial Model (`startup-financial-model`) | Venture & Growth Capital | P2 | Done. New page + curve demo (runway) + MODELS row. Build passed. |
| [x] | 32 | VC Method Valuation (`vc-method-valuation`) | Venture & Growth Capital | P2 | Done. New page + table demo (sensitivity) + MODELS row. Build passed. |
| [x] | 33 | VC Portfolio Tracker (`vc-portfolio-tracker`) | Venture & Growth Capital | P2 | Done. New page + table demo (fund vs peer median) + MODELS row. Build passed. |
| [x] | 34 | Cap Table Manager (`cap-table-manager`) | Venture & Growth Capital | P2 | Done. New page + table demo (round simulator) + MODELS row. Build passed. |
| [x] | 35 | Waterfall Distribution Engine (`waterfall-distribution`) | Venture & Growth Capital | P2 | Done. New page + table demo (stacked tiers) + MODELS row. Build passed. |
| [x] | 36 | SAFE & Note Conversion (`safe-note-conversion`) | Venture & Growth Capital | P2 | Done. New page + table demo (pre- vs post-money) + MODELS row. Build passed. |
| [x] | 37 | Follow-On Advisor (`follow-on-advisor`) | Venture & Growth Capital | P2 | Done. New page + score demo (participate score) + MODELS row. Build passed. |
| [x] | 38 | Startup Runway Tracker (`startup-runway-tracker`) | Venture & Growth Capital | P2 | Done. New page + curve demo + MODELS row. Completes Venture & Growth wing. Build passed. |
| [x] | 39 | Fund Cash-Flow Modeler (`fund-cash-flow-modeler`) | Private Funds | P2 | Done. New page + curve demo + MODELS row. Build passed. |
| [x] | 40 | Fund Performance Engine (`fund-performance-engine`) | Private Funds | P2 | Done. New page + table demo (gross vs net) + MODELS row. Completes Private Funds wing. Build passed. |
| [x] | 41 | Capital Budgeting Engine (`capital-budgeting-engine`) | Capital Budgeting & Project Finance | P2 | Done. New page + table demo (multi-project ranking) + MODELS row. Build passed. |
| [x] | 42 | Project Finance Modeler (`project-finance-modeler`) | Capital Budgeting & Project Finance | P2 | Done. New page + curve demo (DSCR vs covenant) + MODELS row. Build passed. |
| [x] | 43 | Infrastructure Investment Modeler (`infrastructure-investment-modeler`) | Capital Budgeting & Project Finance | P2 | Done. New page + table demo (tornado scenarios) + MODELS row. Build passed. |
| [x] | 44 | Renewable Project Modeler (`renewable-project-modeler`) | Capital Budgeting & Project Finance | P2 | Done. New page + curve demo (generation w/ degradation) + MODELS row. Completes Capital Budgeting & Project Finance wing. Build passed. |
| [x] | 45 | RE Development Modeler (`re-development-modeler`) | Real Estate | P2 | Done. New page + curve demo (cumulative cash / peak equity) + MODELS row. Build passed. |
| [x] | 46 | RE Acquisition Underwriter (`re-acquisition-underwriter`) | Real Estate | P2 | Done. New page + table demo (property vs investor) + MODELS row. Build passed. |
| [x] | 47 | Lease vs. Buy Analyzer (`lease-vs-buy-analyzer`) | Real Estate | P2 | Done. New page + table demo (cash + accounting) + MODELS row. Completes Real Estate wing. Build passed. |
| [x] | 48 | Debt Schedule Engine (`debt-schedule-engine`) | Corporate Treasury & Structured Finance | P2 | Done. New page + curve demo (headroom over time) + MODELS row. Build passed. |
| [ ] | 49 | Working Capital Forecaster (`working-capital-forecaster`) | Corporate Treasury & Structured Finance | P2 | |
| [ ] | 50 | Securitization Modeler (`securitization-modeler`) | Corporate Treasury & Structured Finance | P2 | |
| [ ] | 51 | Trend Following Engine (`trend-following-engine`) | Directional Strategies | P2 | |
| [ ] | 52 | Cross-Sectional Mean Reversion (`cross-sectional-mean-reversion`) | Directional Strategies | P2 | |
| [ ] | 53 | Breakout Signal Engine (`breakout-signal-engine`) | Directional Strategies | P2 | |
| [ ] | 54 | Reversal Detector (`reversal-detector`) | Directional Strategies | P2 | |
| [ ] | 55 | Global Macro Signal Engine (`global-macro-signal-engine`) | Directional Strategies | P2 | |
| [ ] | 56 | Carry Trade Optimizer (`carry-trade-optimizer`) | Directional Strategies | P2 | |
| [ ] | 57 | Statistical Arbitrage Engine (`statistical-arbitrage-engine`) | Relative-Value & Arbitrage | P2 | |
| [ ] | 58 | Pairs Trading Engine (`pairs-trading-engine`) | Relative-Value & Arbitrage | P2 | |
| [ ] | 59 | Convertible Arbitrage Modeler (`convertible-arbitrage-modeler`) | Relative-Value & Arbitrage | P2 | |
| [ ] | 60 | Fixed Income Arbitrage Engine (`fixed-income-arbitrage-engine`) | Relative-Value & Arbitrage | P2 | |
| [ ] | 61 | Merger Arbitrage Tracker (`merger-arbitrage-tracker`) | Relative-Value & Arbitrage | P2 | |
| [ ] | 62 | FX Triangular Arbitrage Scanner (`fx-triangular-arbitrage-scanner`) | Relative-Value & Arbitrage | P2 | |
| [ ] | 63 | Calendar Spread Optimizer (`calendar-spread-optimizer`) | Relative-Value & Arbitrage | P2 | |
| [ ] | 64 | Options Volatility Arbitrage Engine (`options-vol-arb-engine`) | Relative-Value & Arbitrage | P2 | |
| [ ] | 65 | Market Making Engine (`market-making-engine`) | Market Microstructure | P2 | |
| [ ] | 66 | HFT Signal Research Engine (`hft-signal-research-engine`) | Market Microstructure | P2 | |
| [ ] | 67 | Multifactor Ranking Engine (`multifactor-ranking-engine`) | Factor & Systematic | P2 | |
| [ ] | 68 | Momentum Factor Screener (`momentum-factor-screener`) | Factor & Systematic | P2 | |
| [ ] | 69 | Value & Low-Volatility Screener (`value-low-vol-screener`) | Factor & Systematic | P2 | |
| [ ] | 70 | Risk Parity Allocator (`risk-parity-allocator`) | Factor & Systematic | P2 | |
| [ ] | 71 | Gradient-Boosted Alpha Engine (`gradient-boosted-alpha-engine`) | ML & Alternative Data | P2 | |
| [ ] | 72 | Transformer Sentiment Alpha (`transformer-sentiment-alpha`) | ML & Alternative Data | P2 | |
| [ ] | 73 | RL Execution Agent (`rl-execution-agent`) | ML & Alternative Data | P2 | |
| [ ] | 74 | Alternative Data Alpha Scanner (`alt-data-alpha-scanner`) | ML & Alternative Data | P2 | |
| [ ] | 75 | Strategy Construction Engine (`strategy-construction-engine`) | Strategy Infrastructure | P2 | |
| [ ] | 85 | Wallet Risk Scorer (`wallet-risk-scorer`) | Crypto & DeFi | P2 | |
| [ ] | 86 | Stablecoin Depeg Monitor (`stablecoin-depeg-monitor`) | Crypto & DeFi | P2 | |
| [ ] | 87 | DeFi Protocol Risk Scorer (`defi-protocol-risk-scorer`) | Crypto & DeFi | P2 | |
| [ ] | 91 | Underwriting Pricing Engine (`underwriting-pricing-engine`) | Insurance & Actuarial | P2 | |
| [ ] | 92 | Reserving Engine (`reserving-engine`) | Insurance & Actuarial | P2 | |

## Step 3 — Platform surfaces (32), high → medium → low

| ✓ | # | Surface | Group | Priority | Status / Notes |
|---|---|---|---|---|---|
| [ ] | 93 | Credit Oracle (redesign) | Live model pages | High priority | |
| [ ] | 100 | Models catalogue | Catalogue & pricing | High priority | |
| [ ] | 102 | Compliance & Trust portal | Trust & security | High priority | |
| [ ] | 104 | Docs | Content & developer surface | High priority | |
| [ ] | 115 | Onboarding & KYC wizard | Onboarding & account lifecycle | High priority | |
| [ ] | 116 | Dashboard — API Keys tab | Onboarding & account lifecycle | High priority | |
| [ ] | 117 | Alerts & Notification Center | Onboarding & account lifecycle | High priority | |
| [ ] | 119 | Model Developer Console | Marketplace expansion | High priority | |
| [ ] | 123 | trust.gefi.io portal | Trust & federation surfaces | High priority | |
| [ ] | 94 | Fraud Graph (redesign) | Live model pages | Medium priority | |
| [ ] | 95 | Macro Nowcast (redesign) | Live model pages | Medium priority | |
| [ ] | 96 | Portfolio Optimiser (redesign) | Live model pages | Medium priority | |
| [ ] | 99 | Homepage & navigation shell | Marketing shell | Medium priority | |
| [ ] | 101 | Pricing | Catalogue & pricing | Medium priority | |
| [ ] | 103 | Security & vulnerability disclosure | Trust & security | Medium priority | |
| [ ] | 109 | Sign in / Sign up (prelaunch state) | Auth & operator surfaces | Medium priority | |
| [ ] | 110 | Admin sign-in | Auth & operator surfaces | Medium priority | |
| [ ] | 111 | Dashboard — Overview | Auth & operator surfaces | Medium priority | |
| [ ] | 112 | Dashboard — Analytics, Compliance, Federation | Auth & operator surfaces | Medium priority | |
| [ ] | 113 | Dashboard — admin tabs | Auth & operator surfaces | Medium priority | |
| [ ] | 118 | Transactional email system | Onboarding & account lifecycle | Medium priority | |
| [ ] | 120 | Paper-Trading Sandbox | Marketplace expansion | Medium priority | |
| [ ] | 121 | Public Model Leaderboard | Marketplace expansion | Medium priority | |
| [ ] | 124 | Federated Participant Console | Trust & federation surfaces | Medium priority | |
| [ ] | 97 | Sentiment from Filings (redesign) | Live model pages | Low priority | |
| [ ] | 98 | Trade Finance Doc AI (redesign) | Live model pages | Low priority | |
| [ ] | 105 | Research hub | Content & developer surface | Low priority | |
| [ ] | 106 | Blog | Content & developer surface | Low priority | |
| [ ] | 107 | About & Partnerships | Company & forms | Low priority | |
| [ ] | 108 | Contact & Demo request | Company & forms | Low priority | |
| [ ] | 114 | 404 / error state | Auth & operator surfaces | Low priority | |
| [ ] | 122 | Data-Feed Catalog | Marketplace expansion | Low priority | |

---

### Status vocabulary
- `[x]` done — built, build passed, committed
- `BLOCKED: <reason>` — two build attempts failed, or needs a product decision
- `SKIPPED: <reason>` — deliberately deferred
