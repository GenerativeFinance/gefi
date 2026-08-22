/* GeFi.DEMO — the single canonical demo dataset for every /app/ surface
 * (UI-FOLLOWUP-LEDGER task 201; figures fixed by tasks/design-system-v2.md §4).
 *
 * Rules: deterministic (series derive from GeFi.seed, never Math.random);
 * every app page reads ONLY from here so two surfaces can never disagree;
 * everything is sample data and pages must label it as such.
 *
 * Load order: dashboard.js first (GeFi.seed / GeFi.fmt / GeFi.svg), then
 * this file, then the per-surface script.
 */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});
  if (!GeFi.seed) return; /* primitives not loaded — nothing to build on */

  function seededSeries(key, n, base, drift, vol) {
    var rand = GeFi.seed.rng(GeFi.seed.hash("demo|" + key));
    var out = [];
    var v = base;
    for (var i = 0; i < n; i++) {
      v = Math.max(0, v * (1 + (rand() - 0.5) * (vol || 0.02) + (drift || 0)));
      out.push(v);
    }
    return out;
  }

  /* ---- formatters (extend GeFi.fmt; NEVER shadow existing helpers —
   * dashboard.js's fmt.money abbreviates and fmt.pct multiplies by 100,
   * so the app gets its own, unambiguous names) ---- */
  var fmt = (GeFi.fmt = GeFi.fmt || {});
  fmt.moneyFull = function (v, ccy) {
    /* Thousands separators always ($2,847,500) — §5 improvement 4. */
    var n = Math.round(v).toLocaleString("en-US");
    return (ccy === "USD" || !ccy ? "$" : ccy + " ") + n;
  };
  fmt.signedPct = function (v, dp) {
    var s = v.toFixed(dp == null ? 1 : dp);
    return (v > 0 ? "+" : "") + s + "%";
  };
  fmt.date = fmt.date || function (iso) {
    /* "2026-08-14" -> "Aug 14, 2026" — the ONE date format (§5.3). */
    var m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var p = String(iso).split("-");
    if (p.length !== 3) return String(iso);
    return m[parseInt(p[1], 10) - 1] + " " + parseInt(p[2], 10) + ", " + p[0];
  };

  /* ------------------------------ canonical dataset ------------------------------ */

  var DEMO = (GeFi.DEMO = {});

  DEMO.portfolio = {
    value: 142500,
    dayChange: 2850,
    dayChangePct: 2.04,
    monthlyPct: 2.7,
    monthlyBenchPct: 1.8,
    ytdPct: 24.3,
    cash: 12750,
    valueSeries: seededSeries("portfolio-value", 180, 114000, 0.00125, 0.012),
    benchSeries: seededSeries("bench-value", 180, 114000, 0.00095, 0.01)
  };

  DEMO.risk = {
    sharpe: 1.42, sharpeBench: 1.18,
    maxDrawdown: -8.5, maxDrawdownBench: -12.3,
    beta: 0.89, alpha: 2.1, volatility: 14.2,
    var95: -7125,
    concentration: "Medium", sectors: 7, regions: 4
  };

  DEMO.allocation = [
    { name: "Stocks", pct: 45 },
    { name: "Bonds", pct: 25 },
    { name: "Real Estate", pct: 15 },
    { name: "Commodities", pct: 10 },
    { name: "Cash", pct: 5 }
  ];

  DEMO.holdings = [
    { ticker: "MSFT", name: "Microsoft Corporation", weight: 12.2, ret: 18.3, dayPct: 0.8 },
    { ticker: "AAPL", name: "Apple Inc.", weight: 10.1, ret: 15.7, dayPct: 0.4 },
    { ticker: "GOOGL", name: "Alphabet Inc.", weight: 9.3, ret: 11.9, dayPct: 1.1 },
    { ticker: "NVDA", name: "NVIDIA Corporation", weight: 8.5, ret: 24.8, dayPct: 2.3 },
    { ticker: "AMZN", name: "Amazon.com Inc.", weight: 7.8, ret: 12.4, dayPct: 0.6 },
    { ticker: "TSLA", name: "Tesla Inc.", weight: 4.6, ret: -6.2, dayPct: -2.1 },
    { ticker: "BTC", name: "Bitcoin", weight: 3.4, ret: 31.5, dayPct: 1.9 },
    { ticker: "ETH", name: "Ethereum", weight: 2.1, ret: 22.7, dayPct: 1.2 }
  ];

  DEMO.transactions = (function () {
    var rand = GeFi.seed.rng(GeFi.seed.hash("demo|transactions"));
    var assets = ["MSFT", "AAPL", "NVDA", "GOOGL", "AMZN", "BTC", "ETH", "TSLA"];
    var kinds = ["buy", "sell", "dividend", "deposit"];
    var rows = [];
    for (var i = 0; i < 14; i++) {
      var kind = kinds[Math.floor(rand() * (i < 2 ? 2 : kinds.length))];
      var qty = Math.round(2 + rand() * 60);
      var px = 40 + rand() * 460;
      rows.push({
        date: "2026-08-" + String(21 - i).padStart(2, "0"),
        kind: kind,
        asset: kind === "deposit" ? "USD" : assets[Math.floor(rand() * assets.length)],
        qty: kind === "deposit" ? null : qty,
        price: kind === "deposit" ? null : +px.toFixed(2),
        value: kind === "deposit" ? 10000 : +(qty * px).toFixed(2),
        status: i === 0 ? "pending" : "settled"
      });
    }
    return rows;
  })();

  DEMO.watchlist = [
    { ticker: "SPY", name: "S&P 500 ETF", price: 612.4, dayPct: 0.4, spark: seededSeries("watch-SPY", 24, 600, 0.0006, 0.008) },
    { ticker: "QQQ", name: "Nasdaq 100 ETF", price: 548.1, dayPct: 0.9, spark: seededSeries("watch-QQQ", 24, 530, 0.001, 0.01) },
    { ticker: "NVDA", name: "NVIDIA Corporation", price: 187.3, dayPct: 2.3, spark: seededSeries("watch-NVDA", 24, 170, 0.002, 0.02) },
    { ticker: "TLT", name: "20+ Year Treasury ETF", price: 91.6, dayPct: -0.6, spark: seededSeries("watch-TLT", 24, 93, -0.0006, 0.007) },
    { ticker: "GLD", name: "Gold ETF", price: 246.8, dayPct: 0.2, spark: seededSeries("watch-GLD", 24, 240, 0.0005, 0.006) },
    { ticker: "SOL", name: "Solana", price: 231.5, dayPct: -1.4, spark: seededSeries("watch-SOL", 24, 240, -0.001, 0.03) }
  ];

  DEMO.aiModels = {
    active: 3, totalPerformancePct: 19.1, monthlyFees: 327, avgAccuracy: 90.2,
    confidence: 94.2,
    rows: [
      { slug: "portfolio-optimiser", name: "Portfolio Optimiser", sub: "Allocation", status: "active", updated: "2h ago", allocationPct: 38, performancePct: 8.4, trades: 126, accuracy: 91.5, pnl: 5230, fee: 129 },
      { slug: "sentiment-from-filings", name: "Sentiment from Filings", sub: "NLP overlay", status: "active", updated: "4h ago", allocationPct: 22, performancePct: 6.2, trades: 84, accuracy: 88.9, pnl: 3140, fee: 49 },
      { slug: "breakout-signal-engine", name: "Breakout Signal Engine", sub: "Directional", status: "paused", updated: "1d ago", allocationPct: 0, performancePct: 4.5, trades: 57, accuracy: 90.1, pnl: 2110, fee: 149 }
    ]
  };

  DEMO.aiPortfolio = {
    strategies: [
      { name: "Conservative AI", value: 85500, retPct: 12.4 },
      { name: "Aggressive Growth", value: 57000, retPct: 24.8 }
    ],
    riskDistribution: [
      { name: "Stocks", pct: 60 },
      { name: "Bonds", pct: 30 },
      { name: "Crypto", pct: 10 }
    ],
    riskLevel: "Moderate",
    vsMarketPct: 5.2
  };

  DEMO.recommended = [
    { name: "Crypto Sentiment Analyzer", category: "Sentiment Analysis", fee: 129, rating: 4.8, accuracy: 91.5, subscribers: 1247, tags: ["Crypto", "NLP", "Sentiment"] },
    { name: "ESG Impact Scorer", category: "ESG Analysis", fee: 199, rating: 4.6, accuracy: 88.9, subscribers: 856, tags: ["ESG", "Sustainability", "Risk"] }
  ];

  DEMO.orders = (function () {
    var syms = ["AAPL", "MSFT", "NVDA", "TSLA", "GOOGL", "AMZN", "BTC", "ETH"];
    var strategies = ["Momentum Breakout", "Mean Reversion", "AI Rebalance", "Manual"];
    var types = ["market", "limit", "stop"];
    var rand = GeFi.seed.rng(GeFi.seed.hash("demo|orders"));
    var rows = [];
    for (var i = 0; i < 24; i++) {
      var qty = Math.round(5 + rand() * 195);
      var px = 40 + rand() * 460;
      var status = i === 2 ? "pending" : i === 7 || i === 15 ? "cancelled" : "filled";
      rows.push({
        id: "ORD-" + (9012 - i),
        strategy: strategies[Math.floor(rand() * strategies.length)],
        symbol: syms[Math.floor(rand() * syms.length)],
        side: rand() > 0.45 ? "BUY" : "SELL",
        type: types[Math.floor(rand() * types.length)],
        qty: qty,
        price: +px.toFixed(2),
        fill: status === "filled" ? +(px * (1 + (rand() - 0.5) * 0.002)).toFixed(2) : null,
        status: status,
        pnl: status === "filled" ? +((rand() - 0.42) * 220).toFixed(2) : 0,
        date: "2026-08-" + String(21 - Math.floor(i / 2)).padStart(2, "0")
      });
    }
    return rows;
  })();

  DEMO.fundingProjects = [
    { kind: "bot", name: "AI-Powered Grid Trading Bot", category: "Grid Trading", risk: "Medium", status: "active", goal: 50000, raised: 32500, backers: 41, roiPct: 14.2, daysLeft: 18, min: 100, features: ["Grid rebalancing", "Volatility bands", "Backtested 2y"], by: "quantessence" },
    { kind: "bot", name: "High-Frequency Arbitrage Bot", category: "Arbitrage", risk: "High", status: "active", goal: 75000, raised: 68250, backers: 55, roiPct: 22.6, daysLeft: 6, min: 250, features: ["Cross-venue", "Latency-aware", "Research only"], by: "meridian-labs" },
    { kind: "bot", name: "DeFi Yield Farming Optimizer", category: "DeFi", risk: "High", status: "funded", goal: 40000, raised: 40000, backers: 63, roiPct: 18.1, daysLeft: 0, min: 100, features: ["Protocol scoring", "Gas-aware"], by: "helios-quant" },
    { kind: "model", name: "Derivatives Pricing Model", category: "Pricing", risk: "Medium", status: "submitted", goal: 40000, raised: 2500, backers: 4, roiPct: 12.0, daysLeft: 41, min: 100, features: ["Vol surface", "American exercise"], by: "nordwind-am" },
    { kind: "model", name: "Market Sentiment Analysis Engine", category: "NLP", risk: "Medium", status: "approved", goal: 30000, raised: 11200, backers: 19, roiPct: 15.5, daysLeft: 29, min: 100, features: ["Multi-lingual", "Streaming"], by: "atlas-nlp" },
    { kind: "model", name: "Real-time Fraud Detection System", category: "Fraud", risk: "Low", status: "active", goal: 60000, raised: 44700, backers: 72, roiPct: 11.3, daysLeft: 12, min: 50, features: ["Graph features", "Sub-100ms"], by: "gulf-secure" }
  ];

  DEMO.bounties = [
    /* `status` is the developer-side lifecycle (bounties tab, task 218);
     * `funding` is the crowdfunding side (bounty-funding tab, task 225) —
     * its goal IS the reward, raised counts toward paying it out. */
    { id: "B-201", title: "Real-time Options Flow Analyzer", status: "OPEN", difficulty: "ADVANCED", reward: 2500, deadline: "2026-09-15", category: "Derivatives", submissions: 3, skills: ["Python", "Options", "Streaming"],
      funding: { status: "ACTIVE", raised: 1800, backers: 12, by: "quantessence", duration: "6 weeks" } },
    { id: "B-202", title: "ESG Scoring Algorithm", status: "CLAIMED", difficulty: "INTERMEDIATE", reward: 1500, deadline: "2026-09-01", category: "ESG", submissions: 1, skills: ["NLP", "ESG data"], claimedBy: "atlas-nlp",
      funding: { status: "COMPLETED", raised: 1500, backers: 9, by: "atlas-nlp", duration: "4 weeks" } },
    { id: "B-203", title: "Cross-Chain Bridge Risk Monitor", status: "IN PROGRESS", difficulty: "EXPERT", reward: 3250, deadline: "2026-09-28", category: "DeFi", submissions: 2, skills: ["Solidity", "Risk", "Graph"], claimedBy: "helios-quant",
      funding: { status: "APPROVED", raised: 2100, backers: 15, by: "helios-quant", duration: "8 weeks" } },
    { id: "B-204", title: "Earnings Call Tone Tracker", status: "OPEN", difficulty: "INTERMEDIATE", reward: 1000, deadline: "2026-09-10", category: "NLP", submissions: 0, skills: ["ASR", "NLP"],
      funding: { status: "SUBMITTED", raised: 0, backers: 0, by: "gulf-secure", duration: "3 weeks" } },
    /* Finished work stays on the board (task 311). The board's KPIs are
     * counted from these rows rather than stated as round numbers, so
     * "Completed" and "Active Developers" mean something checkable. */
    { id: "B-198", title: "Municipal Bond Spread Scanner", status: "COMPLETED", difficulty: "INTERMEDIATE", reward: 1750, deadline: "2026-07-30", category: "Fixed Income", submissions: 4, skills: ["Python", "Fixed Income"], claimedBy: "atlas-nlp",
      funding: { status: "COMPLETED", raised: 1750, backers: 11, by: "atlas-nlp", duration: "5 weeks" } },
    { id: "B-199", title: "Liquidity Fragmentation Map", status: "COMPLETED", difficulty: "ADVANCED", reward: 2250, deadline: "2026-08-05", category: "Microstructure", submissions: 6, skills: ["C++", "Microstructure"], claimedBy: "helios-quant",
      funding: { status: "COMPLETED", raised: 2250, backers: 18, by: "helios-quant", duration: "7 weeks" } },
    { id: "B-200", title: "Sanctions Screening Recall Test", status: "COMPLETED", difficulty: "BEGINNER", reward: 600, deadline: "2026-08-12", category: "Compliance", submissions: 2, skills: ["NLP", "Compliance"], claimedBy: "gulf-secure",
      funding: { status: "COMPLETED", raised: 600, backers: 5, by: "gulf-secure", duration: "2 weeks" } }
  ];

  /* Datasets (task 312): only the ACTIVITY is stored — downloads and
   * subscriber counts. Revenue and the quality score are derived from that
   * activity by assets/js/app/dataplatform-math.js, so an aggregate anywhere
   * in the app is the sum of line items a reader could add up themselves. */
  DEMO.datasets = (function () {
    var cats = ["Market Data", "Alternative", "Credit", "ESG", "Macro", "On-Chain"];
    var rand = GeFi.seed.rng(GeFi.seed.hash("demo|datasets"));
    var rows = [];
    for (var i = 0; i < 12; i++) {
      rand(); /* keep the seeded stream aligned with the original row order */
      rows.push({
        id: "DS-" + (7301 + i),
        name: ["Equities EOD Bundle", "Card Spend Aggregates", "SME Loan Performance", "ESG Controversies", "Freight Rates", "Stablecoin Flows", "Filings Corpus", "KYB Registry Deltas", "Options Surface", "Deposit Behavior", "Sanctions Deltas", "Macro Releases"][i],
        category: cats[i % cats.length],
        rows: Math.round(2 + rand() * 96) + "M",
        status: i === 10 ? "processing" : i === 11 ? "draft" : "published",
        downloads: i > 9 ? 0 : Math.round(100 + rand() * 1800),
        subscribers: i > 9 ? 0 : Math.round(4 + rand() * 40)
      });
    }
    return rows;
  })();

  DEMO.provider = {
    /* Aggregates DERIVE from the dataset rows — Overview and Revenue tabs
     * can never disagree (§5, improvement 6/contradiction fix). */
    totals: function () {
      var t = { datasets: DEMO.datasets.length, revenue: 0, downloads: 0, subscribers: 0, quality: 0, published: 0 };
      DEMO.datasets.forEach(function (d) {
        t.revenue += d.revenue;
        t.downloads += d.downloads;
        t.subscribers += d.subscribers;
        t.quality += d.quality;
        if (d.status === "published") t.published += 1;
      });
      t.avgQuality = +(t.quality / DEMO.datasets.length).toFixed(1);
      return t;
    },
    modelsUsingData: 156,
    adoptionPct: 15.3,
    impactScore: 8.7,
    impactValue: 2300000,
    trends: [
      { name: "Algorithmic Trading", impact: "High", growthPct: 23 },
      { name: "Risk Assessment", impact: "Medium", growthPct: 12 },
      { name: "Market Sentiment", impact: "High", growthPct: 34 }
    ]
  };

  DEMO.complianceReports = [
    { id: "CR-01", title: "MiFID II Transaction Reporting", category: "Trade reporting", status: "Compliant", risk: "LOW", regs: ["MiFID II", "RTS 22"], coverage: 98, findings: 0, next: "2026-09-01" },
    { id: "CR-02", title: "Best Execution Review", category: "Execution quality", status: "Compliant", risk: "MEDIUM", regs: ["MiFID II", "RTS 27"], coverage: 94, findings: 2, next: "2026-09-14" },
    { id: "CR-03", title: "Marketing Rule Review", category: "Communications", status: "Warning", risk: "MEDIUM", regs: ["SEC 206(4)-1", "FINRA 2210"], coverage: 88, findings: 3, next: "2026-08-28" },
    { id: "CR-04", title: "AML Transaction Monitoring", category: "Financial crime", status: "Compliant", risk: "HIGH", regs: ["AMLD6", "BSA"], coverage: 96, findings: 1, next: "2026-09-07" },
    { id: "CR-05", title: "Model Governance Inventory", category: "AI governance", status: "Violation", risk: "HIGH", regs: ["EU AI Act", "SR 11-7"], coverage: 71, findings: 5, next: "2026-08-25" },
    { id: "CR-06", title: "Data Retention Audit", category: "Records", status: "Compliant", risk: "LOW", regs: ["GDPR", "SEC 17a-4"], coverage: 99, findings: 0, next: "2026-10-02" }
  ];

  DEMO.riskReports = [
    { id: "RR-01", title: "Portfolio VaR Backtest", type: "Market Risk", severity: "Low", score: 22, trendPct: -5.1, confidence: 97, exposure: 142500, var95: 7125 },
    { id: "RR-02", title: "Liquidity Stress Scenarios", type: "Liquidity Risk", severity: "Critical", score: 89, trendPct: 18.7, confidence: 92, exposure: 3052000, var95: 610000 },
    { id: "RR-03", title: "Counterparty Concentration", type: "Concentration Risk", severity: "High", score: 71, trendPct: 4.4, confidence: 90, exposure: 820000, var95: 96000 },
    { id: "RR-04", title: "SME Credit Migration", type: "Credit Risk", severity: "Medium", score: 54, trendPct: 0.8, confidence: 88, exposure: 1240000, var95: 187000 },
    { id: "RR-05", title: "Operational Loss Events", type: "Operational Risk", severity: "Medium", score: 47, trendPct: -2.3, confidence: 85, exposure: 310000, var95: 42000 },
    { id: "RR-06", title: "FX Hedging Effectiveness", type: "Market Risk", severity: "High", score: 66, trendPct: 7.9, confidence: 91, exposure: 560000, var95: 78000 }
  ];

  DEMO.regulator = {
    audits30d: 142, pending: 18, dueThisWeek: 3, complianceRate: 87.3,
    flagged: 23, critical: 3, resolved: 156, standards: 15,
    completionRate: 94.2, avgResolutionDays: 4.8,
    upcoming: [
      { title: "Credit-scoring conformity re-assessment", owner: "EU desk", date: "2026-08-25", priority: "high" },
      { title: "Dataset lineage spot-check #DS-8834", owner: "Data audit", date: "2026-08-27", priority: "medium" },
      { title: "Bias testing cycle — fraud models", owner: "Model audit", date: "2026-09-02", priority: "medium" }
    ],
    activity: [
      { icon: "ok", title: "GDPR Compliance Audit Completed", detail: "Model #MT-4521 · Meridian Bank", when: "2 hours ago", org: "Meridian Bank", severity: "low" },
      { icon: "bad", title: "Data Retention Policy Violation", detail: "Dataset #DS-8834 · Atlas Lending", when: "5 hours ago", org: "Atlas Lending", severity: "high" },
      { icon: "doc", title: "Model Bias Assessment Initiated", detail: "Model #ML-3456 · Gulf Invest", when: "1 day ago", org: "Gulf Invest", severity: "medium" },
      { icon: "chat", title: "Compliance Reminder Sent", detail: "Case #CS-9912 · Helios Capital", when: "1 day ago", org: "Helios Capital", severity: "low" },
      { icon: "ok", title: "Security Vulnerability Fixed", detail: "Node agent 1.14.2 rollout", when: "2 days ago", org: "Platform", severity: "medium" }
    ],
    insights: [
      { tone: "blue", kind: "Improvement", title: "Audit turnaround is speeding up", body: "Average resolution fell to 4.8 days — automation of evidence collection is paying off across model audits." },
      { tone: "amber", kind: "Needs attention", title: "Three critical issues share one root cause", body: "All three open critical issues trace to stale consent records in dataset #DS-8834 — remediating the source closes them together." },
      { tone: "green", kind: "Best practice", title: "Meridian Bank's audit pack is a template", body: "Their pre-assembled lineage + bias evidence cut the GDPR audit to two days. Recommend it as the standard submission format." },
      { tone: "purple", kind: "Trend", title: "Bias assessments are the fastest-growing audit type", body: "Requests doubled quarter over quarter as credit-scoring models come under the EU AI Act's high-risk regime." }
    ],
    /* Task 230 — the five regulator tabs. IDs cross-reference the
     * Overview feed (#MT-4521, #ML-3456, #DS-8834, #CS-9912). */
    modelAudits: [
      { id: "MT-4521", model: "Credit Risk Scorer v3", org: "Meridian Bank", type: "GDPR compliance", severity: "low", status: "Completed", due: "2026-08-20",
        findings: [
          { when: "2026-08-14", text: "Scope agreed; evidence pack received up front" },
          { when: "2026-08-18", text: "Lineage and consent records verified against the audit log" },
          { when: "2026-08-20", text: "Closed with no findings — pack format recommended as template" }
        ] },
      { id: "ML-3456", model: "Fraud Graph Screener", org: "Gulf Invest", type: "Bias assessment", severity: "medium", status: "In Progress", due: "2026-09-02",
        findings: [
          { when: "2026-08-19", text: "Baseline fairness metrics collected across 4 cohorts" },
          { when: "2026-08-21", text: "Demographic parity drift above threshold on cohort B — remediation requested" }
        ] },
      { id: "MT-4522", model: "Sentiment Alpha Engine", org: "Atlas NLP", type: "Model governance", severity: "medium", status: "Scheduled", due: "2026-09-05",
        findings: [
          { when: "2026-08-19", text: "Kickoff scheduled; scoping questionnaire sent" }
        ] },
      { id: "MT-4526", model: "HFT Arbitrage Bot", org: "Meridian Labs", type: "Security review", severity: "high", status: "In Progress", due: "2026-08-29",
        findings: [
          { when: "2026-08-16", text: "Key-rotation gap found on the execution gateway" },
          { when: "2026-08-20", text: "Patched in 1.14.2 rollout; verification pass pending" }
        ] },
      { id: "MT-4530", model: "Derivatives Pricer", org: "Nordwind AM", type: "Conformity re-assessment", severity: "high", status: "Scheduled", due: "2026-08-25",
        findings: [
          { when: "2026-08-18", text: "High-risk classification confirmed under credit-adjacent use" }
        ] }
    ],
    datasetAudits: [
      { id: "DS-8834", dataset: "Card Spend Aggregates", org: "Atlas Lending", coverage: 92, pii: 3, license: "Restricted", severity: "high", status: "In Progress", due: "2026-08-27",
        findings: [
          { when: "2026-08-17", text: "Retention policy violation — records past the 24-month window" },
          { when: "2026-08-21", text: "Stale consent records identified as the shared root cause of 3 open issues" }
        ] },
      { id: "DS-7310", dataset: "SME Loan Performance", org: "Nordwind AM", coverage: 97, pii: 0, license: "Licensed", severity: "low", status: "Completed", due: "2026-08-15",
        findings: [
          { when: "2026-08-15", text: "Closed clean — lineage complete, no PII exposure" }
        ] },
      { id: "DS-9102", dataset: "KYB Registry Deltas", org: "Gulf Secure", coverage: 88, pii: 1, license: "Licensed", severity: "medium", status: "Scheduled", due: "2026-09-08",
        findings: [
          { when: "2026-08-20", text: "Scheduled after license renewal lands" }
        ] },
      { id: "DS-7714", dataset: "Deposit Behavior", org: "Helios Capital", coverage: 85, pii: 2, license: "Under review", severity: "medium", status: "In Progress", due: "2026-09-01",
        findings: [
          { when: "2026-08-19", text: "License terms under review; sampling continues meanwhile" }
        ] }
    ],
    /* 3 open criticals here = the Overview's "3 critical" KPI. */
    issues: [
      { id: "CI-201", title: "Stale consent records", severity: "critical", entity: "DS-8834", entityKind: "dataset", assignee: "L. Haddad", opened: "2026-08-17", slaDue: "2026-08-23" },
      { id: "CI-202", title: "Bias metric drift above threshold", severity: "critical", entity: "ML-3456", entityKind: "model", assignee: "J. Weber", opened: "2026-08-15", slaDue: "2026-08-21" },
      { id: "CI-203", title: "Missing adverse-action templates", severity: "high", entity: "MT-4526", entityKind: "model", assignee: "A. Marques", opened: "2026-08-12", slaDue: "2026-08-30" },
      { id: "CI-204", title: "Retention schedule not enforced", severity: "critical", entity: "DS-7714", entityKind: "dataset", assignee: "Compliance desk", opened: "2026-08-19", slaDue: "2026-08-24" },
      { id: "CI-205", title: "Audit log export gap", severity: "medium", entity: "MT-4522", entityKind: "model", assignee: "Platform", opened: "2026-08-10", slaDue: "2026-09-09" }
    ],
    resolved30d: 12,
    threads: [
      { id: "TH-1", org: "Helios Capital", subject: "Case #CS-9912 — quarterly attestation", unread: true,
        messages: [
          { from: "you", text: "Reminder: the quarterly attestation for case #CS-9912 is due Aug 29.", when: "Aug 21, 09:14" },
          { from: "them", text: "Acknowledged — the evidence pack is in preparation and lands this week.", when: "Aug 21, 15:40" }
        ] },
      { id: "TH-2", org: "Atlas Lending", subject: "Dataset #DS-8834 consent records", unread: true,
        messages: [
          { from: "you", text: "Audit #DS-8834 flagged consent records past their validity window. Please supply refreshed evidence.", when: "Aug 20, 11:02" },
          { from: "them", text: "We are re-running the consent sync; expect updated records by Aug 26.", when: "Aug 20, 17:19" },
          { from: "you", text: "Noted. The linked issues stay open until the refreshed records verify.", when: "Aug 21, 08:45" }
        ] },
      { id: "TH-3", org: "Meridian Bank", subject: "GDPR audit #MT-4521 closed", unread: false,
        messages: [
          { from: "you", text: "Audit #MT-4521 closed with no findings. Your evidence pack format is being recommended as the standard.", when: "Aug 20, 14:30" },
          { from: "them", text: "Great to hear — happy for the template to be shared.", when: "Aug 20, 16:02" }
        ] }
    ],
    standardsList: [
      { name: "EU AI Act — high-risk credit scoring", version: "2025-07", effective: "2026-08-02", status: "Adopted", linkedAudits: 34,
        requirements: ["Risk management system", "Data governance & lineage", "Technical documentation", "Human oversight", "Accuracy & robustness monitoring"] },
      { name: "SR 11-7 model risk management", version: "rev 2", effective: "2024-01-15", status: "Adopted", linkedAudits: 41,
        requirements: ["Model inventory", "Independent validation", "Ongoing monitoring", "Effective challenge documentation"] },
      { name: "GDPR Art. 22 — automated decisions", version: "2018", effective: "2018-05-25", status: "Adopted", linkedAudits: 28,
        requirements: ["Lawful basis for automation", "Meaningful human review path", "Explanation on request", "Consent freshness"] },
      { name: "zkML attestation profile", version: "0.9-draft", effective: "2026-11-01", status: "Draft", linkedAudits: 4,
        requirements: ["Deterministic inference build", "Proof aggregation format", "Verifier key registry", "Per-participant federation proofs"] }
    ]
  };

  DEMO.learning = {
    items: [
      { title: "Getting Started with GeFi", type: "GET-STARTED", level: "BEGINNER", duration: "25 min", enrolled: 4210, rating: 4.9, author: "GeFi team", progress: 100 },
      { title: "Your First AI Model Subscription", type: "TUTORIAL", level: "BEGINNER", duration: "40 min", enrolled: 3105, rating: 4.8, author: "GeFi team", progress: 100 },
      { title: "Backtesting Without Fooling Yourself", type: "TUTORIAL", level: "INTERMEDIATE", duration: "1h 10min", enrolled: 1876, rating: 4.7, author: "Quant guild", progress: 45 },
      { title: "Federated Learning for Lenders", type: "WEBINAR", level: "INTERMEDIATE", duration: "55 min", enrolled: 942, rating: 4.6, author: "Platform team", progress: 20 },
      { title: "Reading an Adverse-Action Notice", type: "TUTORIAL", level: "INTERMEDIATE", duration: "35 min", enrolled: 761, rating: 4.5, author: "Compliance desk", progress: 0 },
      { title: "The Audit Log, End to End", type: "WEBINAR", level: "ADVANCED", duration: "1h 20min", enrolled: 655, rating: 4.8, author: "Platform team", progress: 0 },
      { title: "Building a Model for the Marketplace", type: "TUTORIAL", level: "ADVANCED", duration: "2h", enrolled: 534, rating: 4.7, author: "Dev rel", progress: 0 },
      { title: "Understanding Differential Privacy", type: "BLOG", level: "INTERMEDIATE", duration: "12 min", enrolled: 1298, rating: 4.4, author: "Research", progress: 0 },
      { title: "Paper Trading vs Live: What Changes", type: "BLOG", level: "BEGINNER", duration: "9 min", enrolled: 2011, rating: 4.3, author: "Trading desk", progress: 0 },
      { title: "Marketplace FAQ", type: "FAQ", level: "BEGINNER", duration: "6 min", enrolled: 5120, rating: 4.2, author: "Support", progress: 0 }
    ],
    paths: [
      { name: "Investor Foundations", courses: 6, hours: 30, started: true },
      { name: "Model Developer Track", courses: 8, hours: 42, started: false },
      { name: "Compliance & Governance", courses: 5, hours: 24, started: false }
    ]
  };

  DEMO.activity = [
    { title: "AI rebalance executed", detail: "Portfolio Optimiser moved 3.2% from cash into bonds", when: "Today 09:14", value: "+$12,450", tone: "up" },
    { title: "Risk score updated", detail: "Concentration risk recalculated after NVDA run-up", when: "Today 08:02", value: "Risk: 6.2/10", tone: "warn" },
    { title: "Dividend received", detail: "MSFT quarterly dividend settled to cash", when: "Yesterday", value: "+$2,847", tone: "info" },
    { title: "Deposit completed", detail: "Bank transfer settled", when: "Aug 19", value: "+$10,000", tone: "up" }
  ];

  DEMO.marketData = {
    sources: [
      { key: "us-stocks", name: "Stock Data (US)", status: "Active", coverage: 98, points: "6.2M", range: "2020 — present", freq: "1 min", symbols: ["AAPL", "MSFT", "NVDA"] },
      { key: "crypto", name: "Crypto", status: "Active", coverage: 95, points: "2.9M", range: "2020 — present", freq: "tick", symbols: ["BTC", "ETH", "SOL"] },
      { key: "forex", name: "Forex", status: "Limited", coverage: 74, points: "1.1M", range: "2021 — present", freq: "1 min", symbols: ["EUR/USD", "GBP/USD"] },
      { key: "options", name: "Options", status: "Coming Soon", coverage: 0, points: "—", range: "—", freq: "—", symbols: ["SPY chains"] },
      { key: "commodities", name: "Commodities", status: "Active", coverage: 88, points: "640K", range: "2020 — present", freq: "5 min", symbols: ["GOLD", "WTI"] },
      { key: "fixed-income", name: "Fixed Income", status: "Limited", coverage: 61, points: "410K", range: "2022 — present", freq: "EOD", symbols: ["10Y Treasury", "Bund"] }
    ]
  };

  DEMO.insights = [
    { title: "Tech Sector Outlook", body: "Earnings revisions still positive; breadth narrowing to megacaps.", sentiment: "Bullish", confidence: 87, impact: "High" },
    { title: "Crypto Market Analysis", body: "Funding rates neutral; realized volatility compressing.", sentiment: "Neutral", confidence: 72, impact: "Medium" },
    { title: "Portfolio Concentration Risk", body: "Top-5 holdings are 47.9% of equity sleeve after the NVDA run.", sentiment: "Cautious", confidence: 91, impact: "High" }
  ];

  DEMO.devConsole = {
    totals: { models: 12, funding: 486750, collaborators: 28, deployments: 8 },
    models: [
      { name: "Advanced Portfolio Optimizer", status: "Deployed", category: "Optimization", tests: 214, collaborators: 6, funded: 68250, goal: 75000 },
      { name: "Real-time Risk Analyzer", status: "Testing", category: "Risk", tests: 158, collaborators: 4, funded: 41000, goal: 60000 },
      { name: "Sentiment Trading Bot", status: "Approved", category: "NLP", tests: 96, collaborators: 3, funded: 22500, goal: 30000 },
      { name: "Macro Regime Classifier", status: "Draft", category: "Macro", tests: 12, collaborators: 2, funded: 0, goal: 25000 }
    ],
    /* Training jobs (task 310): only what cannot be derived is stored.
     * Accuracy, loss and duration come from assets/js/app/devops-math.js so
     * the figures on a card always match the progress bar beside them. */
    jobs: [
      { name: "optimizer-v3 hyperband sweep", status: "completed", progress: 100 },
      { name: "risk-analyzer fine-tune", status: "running", progress: 75 },
      { name: "sentiment-bot distillation", status: "queued", progress: 0 }
    ],
    /* Deployments (task 310): uptime, requests and latency are telemetry,
     * so they are measured by the shared module rather than stored here —
     * a stopped deployment then cannot keep reporting the numbers it had
     * while it was up. */
    deployments: [
      { name: "portfolio-optimizer", env: "Production", status: "active", last: "2026-08-18" },
      { name: "risk-analyzer", env: "Staging", status: "active", last: "2026-08-20" },
      { name: "sentiment-bot", env: "Development", status: "inactive", last: "2026-08-11" }
    ],
    team: [
      { name: "Ana Marques", role: "ML Engineer", kind: "Owner" },
      { name: "Jonas Weber", role: "Quant Researcher", kind: "Collaborator" },
      { name: "Leila Haddad", role: "Data Engineer", kind: "Collaborator" }
    ],
    messages: [
      { who: "Ana Marques", when: "2h ago", text: "Portfolio optimizer accuracy improved to 94.8% after hyperparameter tuning." },
      { who: "Jonas Weber", when: "5h ago", text: "Risk analyzer staging run matches backtest within tolerance — promoting tomorrow." },
      { who: "Leila Haddad", when: "1d ago", text: "New loan-tape features landed in the registry; lineage recorded." }
    ],
    activityFeed: [
      { title: "Advanced Portfolio Optimizer deployed to production", meta: "Model · 1 hour ago", tag: "deployment" },
      { title: "Risk analyzer passed 158 integration tests", meta: "Test · 6 hours ago", tag: "test" },
      { title: "Grid bot funding reached 91%", meta: "Funding · 1 day ago", tag: "funding" },
      { title: "Leila joined sentiment-bot", meta: "Team · 2 days ago", tag: "collaboration" }
    ]
  };

  DEMO.developers = [
    { name: "Quantessence Labs", handle: "@quantessence", verified: true, rating: 4.9, reviews: 234, location: "Zurich", models: 14, subscribers: 4120, revenue: 182000, specialties: ["Optimization", "Risk"], top: ["Portfolio Optimiser", "Risk Analyzer"], joined: "Jan 2023" },
    { name: "Meridian Analytics", handle: "@meridian", verified: true, rating: 4.8, reviews: 189, location: "London", models: 11, subscribers: 3480, revenue: 156000, specialties: ["Arbitrage", "HFT research"], top: ["Stat-Arb Pairs", "Calendar Spread"], joined: "Mar 2023" },
    { name: "Atlas NLP", handle: "@atlasnlp", verified: true, rating: 4.7, reviews: 151, location: "Berlin", models: 9, subscribers: 2870, revenue: 121000, specialties: ["NLP", "Sentiment"], top: ["Sentiment from Filings", "Disclosure Drafter"], joined: "Jun 2023" },
    { name: "Gulf Secure AI", handle: "@gulfsecure", verified: true, rating: 4.7, reviews: 128, location: "Dubai", models: 8, subscribers: 2260, revenue: 98000, specialties: ["Fraud", "AML"], top: ["Fraud Graph", "Claim Fraud Vision"], joined: "Sep 2023" },
    { name: "Nordwind AM", handle: "@nordwind", verified: true, rating: 4.6, reviews: 96, location: "Stockholm", models: 10, subscribers: 1980, revenue: 87000, specialties: ["Credit", "Macro"], top: ["Credit Oracle", "Macro Nowcast"], joined: "Nov 2023" },
    { name: "SecureInvest Tech", handle: "@secureinvest", verified: false, rating: 4.2, reviews: 41, location: "Austin", models: 8, subscribers: 730, revenue: 39000, specialties: ["Treasury", "Payments"], top: ["Cross-Border Router", "Debt Schedule"], joined: "Feb 2024" }
  ];

  /* Run history for the backtesting page (task 309). Only the run is stored —
   * every metric is derived from the shared engine in assets/js/app/backtest-math.js,
   * so the table, the analysis chart and the comparison overlay cannot drift
   * apart. These are runs of the models the environment actually offers, so
   * any row here can be re-run from the dropdown. */
  DEMO.backtests = [
    { id: "BT-118", model: "Sentiment Trading Bot", range: "2y", status: "completed" },
    { id: "BT-117", model: "Advanced Portfolio Optimizer", range: "5y", status: "completed" },
    { id: "BT-116", model: "Real-time Risk Analyzer", range: "2y", status: "completed" }
  ];

  DEMO.reports = {
    categories: [
      { key: "performance", name: "Performance Reports", accent: "brand", rows: [
        { name: "Monthly AI Performance Review", desc: "Model-by-model contribution and fees", status: "generated", date: "2026-08-01" },
        { name: "Quarterly Investor Letter", desc: "Narrative + tables, LP-ready", status: "pending", date: "2026-09-30" }
      ] },
      { key: "risk", name: "Risk Assessment", accent: "red", rows: [
        { name: "Risk & Compliance Analysis", desc: "VaR, drawdown, concentration", status: "generated", date: "2026-08-14" },
        { name: "Stress Scenario Pack", desc: "Rates, liquidity, crypto shocks", status: "generated", date: "2026-08-10" }
      ] },
      { key: "regulatory", name: "Regulatory Compliance", accent: "amber", rows: [
        { name: "MiFID II Transaction File", desc: "RTS 22 fields, validated", status: "generated", date: "2026-08-18" },
        { name: "Marketing Rule Evidence Pack", desc: "Reviewed communications log", status: "pending", date: "2026-08-28" }
      ] },
      { key: "client", name: "Client Reports", accent: "green", rows: [
        { name: "Portfolio Optimization Summary", desc: "Allocation vs target, trades", status: "generated", date: "2026-08-20" },
        { name: "Client Summary", desc: "One-pager per mandate", status: "generated", date: "2026-08-19" }
      ] }
    ],
    market: {
      sentimentPct: 75, sentimentLabel: "Bullish",
      usd: { value: 102.4, changePct: 0.3 },
      gdp: { value: 2.8, label: "Stable" },
      fed: { prediction: "0.25% rate cut", probability: 68 }
    }
  };

  DEMO.zkml = {
    shardsDefault: 4,
    federatedNote: "Models trained federated can also be verified per participant.",
    stages: ["Compile WASM", "Create shards", "Prove shards", "Aggregate proofs", "Verify aggregate"]
  };
})(window);
