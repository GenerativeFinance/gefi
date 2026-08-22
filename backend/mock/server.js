#!/usr/bin/env node
/* GeFi mock API server (ledger task 301). Zero dependencies.
 *
 * Serves every path declared in api/openapi/<service>.yaml on :8788 under
 * /v1, from the same deterministic dataset the UI ships
 * (assets/js/app-demo-data.js + GeFi.MODELS from dashboard.js, loaded via
 * a vm shim). Coverage is checked by construction: startup fails if any
 * contract route has no handler. Every response carries
 * X-GeFi-Sample: true. Mutations are in-memory and reset on restart.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const vm = require("vm");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..", "..");
const PORT = process.env.PORT || 8788;

/* ------------------------------------------------- load the GeFi dataset */
function loadGeFi() {
  const stubEl = () =>
    new Proxy({ style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {} } }, {
      get(t, k) {
        if (k in t) return t[k];
        return () => stubEl();
      },
    });
  const documentStub = {
    addEventListener() {},
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: stubEl,
    createElementNS: stubEl,
    documentElement: stubEl(),
    body: stubEl(),
  };
  const win = {
    document: documentStub,
    location: { pathname: "/", hash: "", search: "" },
    addEventListener() {},
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    navigator: {},
    history: { replaceState() {} },
    sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    localStorage: { getItem: () => null, setItem() {} },
    setTimeout,
    clearTimeout,
    setInterval: () => 0,
    clearInterval() {},
    Math,
    Date,
    JSON,
  };
  win.window = win;
  const ctx = vm.createContext({
    window: win,
    document: documentStub,
    navigator: {},
    sessionStorage: win.sessionStorage,
    localStorage: win.localStorage,
    location: win.location,
    history: win.history,
    Math,
    JSON,
    Date,
    setTimeout,
    clearTimeout,
    setInterval: () => 0,
    clearInterval() {},
    console,
  });
  for (const f of ["assets/js/dashboard.js", "assets/js/app-demo-data.js"]) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
  }
  return win.GeFi;
}

const GeFi = loadGeFi();
const D = GeFi.DEMO;
const MODELS = GeFi.MODELS;
const seed = GeFi.seed;
if (!D || !MODELS || !seed) {
  console.error("FATAL: GeFi shim did not load DEMO/MODELS/seed");
  process.exit(1);
}

function series(key, n, base, spread) {
  const rand = seed.rng(seed.hash(key));
  const out = [];
  for (let i = 0; i < n; i++) out.push(+(base + (rand() - 0.35) * spread + i * spread * 0.04).toFixed(2));
  return out;
}
function fnvHex(str) {
  return ("00000000" + seed.hash(str).toString(16)).slice(-8);
}

/* --------------------------------------------------- contract route table */
function contractRoutes() {
  const dir = path.join(ROOT, "api", "openapi");
  const routes = new Set();
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".yaml") || f === "_envelope.yaml") continue;
    const lines = fs.readFileSync(path.join(dir, f), "utf8").split("\n");
    let current = null;
    for (const line of lines) {
      const p = line.match(/^  (\/[^\s:]*):\s*$/);
      if (p) {
        current = p[1];
        continue;
      }
      const m = line.match(/^    (get|post|patch|put|delete):\s*$/);
      if (m && current) routes.add(m[1].toUpperCase() + " " + current);
      if (/^\S/.test(line) && line.trim() && !line.startsWith("paths:")) current = null;
    }
  }
  return [...routes].sort();
}

/* ------------------------------------------------------- in-memory state */
function freshState() {
  return {
    profile: { name: "Alex Deme", email: "alex@sample.gefi", persona: "investor", language: "en", theme: "dark", avatar: null },
    users: [],
    watchlist: D.watchlist.map((w) => ({ ...w })),
    orders: D.orders.map((o) => ({ ...o })),
    proposals: [],
    executions: [],
    rebalanceSettings: { band_pct: 5, cadence: "monthly", auto_execute: false },
    ratings: {},
    subscriptions: [{ id: "sub-1", slug: MODELS[1].slug, since: "2026-06-01" }],
    preferences: { wings: [], risk: "medium" },
    devModels: D.devConsole.models.map((m, i) => ({ id: "dm-" + (i + 1), ...m })),
    trainingJobs: D.devConsole.jobs.map((j, i) => ({ id: "tj-" + (i + 1), ...j })),
    deployments: D.devConsole.deployments.map((d, i) => ({ id: "dep-" + (i + 1), ...d })),
    alertRules: [],
    devAlertRules: [],
    threads: D.devConsole.messages.map((m, i) => ({ id: "th-" + (i + 1), title: m.who + " — " + m.text.slice(0, 40), messages: [m] })),
    bounties: D.bounties.map((b) => ({ ...b, claims: [], submissions: [] })),
    datasets: D.datasets.map((d) => ({ ...d })),
    datasetExtra: [],
    fundingProjects: D.fundingProjects.map((p) => ({ ...p })),
    fundingRequests: [],
    contributions: [],
    enrollments: [],
    reports: [],
    customDefs: [],
    issuesResolved: [],
    regThreadExtra: {},
    regAudits: [],
    notifications: [
      { id: "n-1", title: "Rebalance executed", detail: "Portfolio Optimiser moved 3.2% into bonds", unread: true },
      { id: "n-2", title: "Model audit passed", detail: "#MT-4521 closed with no findings", unread: true },
      { id: "n-3", title: "Dataset published", detail: "Options Surface passed its quality audit", unread: false },
    ],
    verifications: [],
    anchors: [],
    apiKeys: [{ id: "key-1", label: "dashboard sample", prefix: "gefi_sk_9f2a", created: "2026-08-01" }],
    idempotency: new Map(),
  };
}
let S = freshState();

/* ------------------------------------------------------------- handlers */
const H = {};
function on(route, fn) {
  H[route] = fn;
}
const page = (items, q) => {
  const limit = Math.min(100, Math.max(1, parseInt(q.limit, 10) || 25));
  const offset = q.cursor ? parseInt(Buffer.from(String(q.cursor), "base64").toString() || "0", 10) || 0 : 0;
  const slice = items.slice(offset, offset + limit);
  const next = offset + limit < items.length ? Buffer.from(String(offset + limit)).toString("base64") : null;
  return { items: slice, next_cursor: next };
};
const notFound = { __status: 404, code: "not_found", message: "No such resource" };

/* ---- auth ---- */
on("POST /auth/register", (p, q, b) => {
  const user = { id: "u-" + (S.users.length + 1), email: (b && b.email) || "new@sample.gefi" };
  S.users.push(user);
  return { __status: 201, user };
});
on("POST /auth/session", (p, q, b) => ({ token: "sample-" + fnvHex("token|" + ((b && b.email) || "anon")), user: S.profile }));
on("DELETE /auth/session", () => ({ ok: true }));
on("GET /me", () => S.profile);
on("PATCH /me", (p, q, b) => {
  Object.assign(S.profile, b || {});
  return S.profile;
});
on("GET /me/personas", () => ({
  items: ["investor", "portfolio", "trader", "developer", "marketplace", "funding", "regulator", "reports", "learning", "data-provider"].map((k) => ({ persona: k, granted: true })),
  next_cursor: null,
}));
on("GET /orgs", (p, q) => page([{ id: "org-1", name: "Meridian Bank", role: "member" }, { id: "org-2", name: "GeFi Labs", role: "owner" }], q));
on("GET /orgs/{org_id}/members", (p, q) => page(D.devConsole.team.map((t, i) => ({ id: "m-" + i, ...t })), q));

/* ---- portfolio ---- */
on("GET /portfolio", () => D.portfolio);
on("GET /portfolio/holdings", (p, q) => page(D.holdings, q));
on("GET /portfolio/transactions", (p, q) => page(D.transactions, q));
on("GET /portfolio/performance", () => ({ series: series("perf|portfolio", 12, 100, 8), benchmark: series("perf|bench", 12, 100, 6), period: "12m" }));
on("GET /portfolio/risk", () => D.risk);
on("GET /portfolio/allocation", () => ({ items: D.allocation, next_cursor: null }));
on("GET /watchlist", (p, q) => page(S.watchlist, q));
on("POST /watchlist", (p, q, b) => {
  const row = { symbol: (b && b.symbol) || "NEW", name: (b && b.name) || "Added symbol" };
  S.watchlist.push(row);
  return { __status: 201, ...row };
});
on("DELETE /watchlist/{symbol}", (p) => {
  const before = S.watchlist.length;
  S.watchlist = S.watchlist.filter((w) => w.symbol !== p.symbol);
  return before === S.watchlist.length ? notFound : { ok: true };
});

/* ---- rebalance ---- */
const drift = () =>
  D.allocation.map((a, i) => ({ name: a.name, current_pct: a.pct, target_pct: a.pct + [1.5, -1.5, 0.5, -0.5, 0][i % 5], drift_pct: -[1.5, -1.5, 0.5, -0.5, 0][i % 5] }));
on("GET /rebalance/drift", () => ({ items: drift(), next_cursor: null }));
on("POST /rebalance/proposals", () => {
  const pr = { id: "prop-" + (S.proposals.length + 1), created: "2026-08-22", trades: drift().filter((d) => d.drift_pct !== 0).map((d) => ({ asset: d.name, side: d.drift_pct > 0 ? "sell" : "buy", pct: Math.abs(d.drift_pct) })) };
  S.proposals.push(pr);
  return { __status: 201, ...pr };
});
on("GET /rebalance/proposals", (p, q) => page(S.proposals, q));
on("POST /rebalance/executions", (p, q, b) => {
  const ex = { id: "exec-" + (S.executions.length + 1), proposal_id: b && b.proposal_id, status: "executed" };
  S.executions.push(ex);
  return { __status: 201, ...ex };
});
on("GET /rebalance/executions", (p, q) => page(S.executions, q));
on("GET /rebalance/settings", () => S.rebalanceSettings);
on("PATCH /rebalance/settings", (p, q, b) => {
  Object.assign(S.rebalanceSettings, b || {});
  return S.rebalanceSettings;
});

/* ---- marketplace ---- */
const catalogRow = (m) => ({ slug: m.slug, name: m.name, wing: m.wing, risk: m.risk, federated: m.federated, unit: m.unit });
on("GET /models", (p, q) => {
  let rows = MODELS.map(catalogRow);
  if (q.wing) rows = rows.filter((m) => m.wing === q.wing);
  if (q.risk) rows = rows.filter((m) => m.risk === q.risk);
  if (q.federated) rows = rows.filter((m) => String(m.federated) === q.federated);
  return page(rows, q);
});
on("GET /models/{slug}", (p) => {
  const m = MODELS.find((x) => x.slug === p.slug);
  return m ? { ...catalogRow(m), series: m.series } : notFound;
});
on("GET /models/{slug}/ratings", (p, q) => page(S.ratings[p.slug] || [{ user: "quantessence", stars: 5, comment: "Deterministic and well documented." }], q));
on("POST /models/{slug}/ratings", (p, q, b) => {
  S.ratings[p.slug] = S.ratings[p.slug] || [];
  const r = { user: "you", stars: (b && b.stars) || 5, comment: (b && b.comment) || "" };
  S.ratings[p.slug].push(r);
  return { __status: 201, ...r };
});
on("GET /subscriptions", (p, q) => page(S.subscriptions, q));
on("POST /subscriptions", (p, q, b) => {
  const sub = { id: "sub-" + (S.subscriptions.length + 1), slug: b && b.slug, since: "2026-08-22" };
  S.subscriptions.push(sub);
  return { __status: 201, ...sub };
});
on("DELETE /subscriptions/{id}", (p) => {
  const before = S.subscriptions.length;
  S.subscriptions = S.subscriptions.filter((s) => s.id !== p.id);
  return before === S.subscriptions.length ? notFound : { ok: true };
});
on("GET /billing/invoices", (p, q) => page(S.subscriptions.map((s, i) => ({ id: "inv-" + (i + 1), subscription: s.id, amount_usd: 49, period: "2026-08" })), q));
on("GET /recommendations", () => ({ items: MODELS.filter((m) => !S.preferences.wings.length || S.preferences.wings.includes(m.wing)).slice(0, 6).map(catalogRow), next_cursor: null }));
on("GET /trending", () => ({ items: MODELS.slice().sort((a, b) => seed.hash("tr|" + b.slug) - seed.hash("tr|" + a.slug)).slice(0, 8).map(catalogRow), next_cursor: null }));
on("GET /preferences", () => S.preferences);
on("PUT /preferences", (p, q, b) => {
  S.preferences = b || S.preferences;
  return S.preferences;
});

/* ---- models-runtime ---- */
on("POST /models/{slug}/run", (p, q, b) => {
  const m = MODELS.find((x) => x.slug === p.slug);
  if (!m) return notFound;
  const rand = seed.rng(seed.hash("run|" + p.slug + "|" + JSON.stringify(b || {})));
  return { slug: p.slug, unit: m.unit, output: +(m.series[11] * (0.97 + rand() * 0.06)).toFixed(4), sample: true };
});
on("GET /models/{slug}/jobs/{job_id}", (p) => ({ id: p.job_id, slug: p.slug, status: "completed" }));
on("GET /models/{slug}/metrics", (p) => {
  const m = MODELS.find((x) => x.slug === p.slug);
  return m ? { slug: m.slug, unit: m.unit, series: m.series } : notFound;
});
on("POST /models/{slug}/metrics/refresh", (p) => ({ __status: 202, job_id: "mr-" + fnvHex("refresh|" + p.slug) }));

/* ---- trading ---- */
on("GET /market-data/quotes", (p, q) => {
  const syms = (q.symbols || "AAPL,MSFT,NVDA").split(",");
  return { items: syms.map((s) => { const r = seed.rng(seed.hash("q|" + s)); return { symbol: s, price: +(40 + r() * 460).toFixed(2), ts: "2026-08-22T05:30:00Z" }; }), next_cursor: null };
});
on("POST /orders", (p, q, b) => {
  /* Full shape — same fields as the seeded DEMO.orders rows, so a
   * server-side fill renders identically to a sample one. */
  const r = seed.rng(seed.hash("fill|" + (S.orders.length + 1)));
  const px = +(40 + r() * 460).toFixed(2);
  const o = {
    id: "ORD-" + (9000 + S.orders.length),
    strategy: (b && b.strategy) || "Manual",
    symbol: (b && b.symbol) || "AAPL",
    side: ((b && b.side) || "buy").toUpperCase(),
    type: (b && b.type) || "market",
    qty: (b && b.qty) || 1,
    price: px,
    fill: +(px * (1 + (r() - 0.5) * 0.002)).toFixed(2),
    status: "filled",
    pnl: +((r() - 0.42) * 220).toFixed(2),
    date: "2026-08-22",
  };
  S.orders.unshift(o);
  return { __status: 201, ...o };
});
on("GET /orders", (p, q) => page(S.orders, q));
on("GET /orders/{id}", (p) => S.orders.find((o) => String(o.id) === p.id) || notFound);
on("DELETE /orders/{id}", (p) => {
  const o = S.orders.find((x) => String(x.id) === p.id);
  if (!o) return notFound;
  o.status = "cancelled";
  return o;
});
on("GET /positions", (p, q) => page(D.holdings.map((h) => ({ symbol: h.ticker, qty: h.shares, value: h.value })), q));
on("POST /paper/reset", () => {
  S.orders = D.orders.map((o) => ({ ...o }));
  return { ok: true, orders: S.orders.length };
});
const BOTS = [
  { id: "bot-1", name: "AI-Powered Grid Trading Bot", status: "running" },
  { id: "bot-2", name: "High-Frequency Arbitrage Bot", status: "stopped" },
  { id: "bot-3", name: "DeFi Yield Farming Optimizer", status: "stopped" },
];
on("GET /bots", (p, q) => page(BOTS, q));
on("POST /bots/{id}/toggle", (p) => {
  const b = BOTS.find((x) => x.id === p.id);
  if (!b) return notFound;
  b.status = b.status === "running" ? "stopped" : "running";
  return b;
});

/* ---- backtesting ---- */
on("POST /backtests", (p, q, b) => {
  const job = { id: "bt-" + (D.backtests.length + S.reports.length + 1), status: "queued", params: b || {} };
  return { __status: 202, ...job };
});
on("GET /backtests", (p, q) => page(D.backtests || [], q));
on("GET /backtests/{id}", (p) => ({ id: p.id, status: "completed", sharpe: 1.34, return_pct: 12.5, max_drawdown_pct: -8.2 }));
on("GET /backtests/{id}/results", (p) => ({ id: p.id, equity: series("bt|" + p.id, 60, 100, 12), trades: 148, stats: { sharpe: 1.34, win_rate: 0.56 } }));
on("POST /optimizer/runs", () => ({ __status: 202, id: "opt-1", status: "queued" }));
on("GET /optimizer/runs/{id}", (p) => ({ id: p.id, status: "completed", best: { lookback: 20, band: 2.0, sharpe: 1.51 } }));
on("GET /historical-data/{symbol}", (p, q) => page(series("hist|" + p.symbol, 48, 100, 20).map((v, i) => ({ t: i, close: v })), q));

/* ---- devconsole ---- */
on("GET /dev/models", (p, q) => page(S.devModels, q));
on("POST /dev/models", (p, q, b) => {
  const m = { id: "dm-" + (S.devModels.length + 1), name: (b && b.name) || "New model", status: "Draft", category: (b && b.category) || "Misc", tests: 0, collaborators: 1, funded: 0, goal: 25000 };
  S.devModels.push(m);
  return { __status: 201, ...m };
});
on("PATCH /dev/models/{id}", (p, q, b) => {
  const m = S.devModels.find((x) => x.id === p.id);
  if (!m) return notFound;
  Object.assign(m, b || {});
  return m;
});
on("DELETE /dev/models/{id}", (p) => {
  const m = S.devModels.find((x) => x.id === p.id);
  if (!m) return notFound;
  if (m.status !== "Draft") return { __status: 409, code: "conflict", message: "Only draft models can be deleted" };
  S.devModels = S.devModels.filter((x) => x.id !== p.id);
  return { ok: true };
});
on("POST /dev/training-jobs", (p, q, b) => {
  const j = { id: "tj-" + (S.trainingJobs.length + 1), name: (b && b.name) || "training run", status: "queued", progress: 0 };
  S.trainingJobs.push(j);
  return { __status: 202, ...j };
});
on("GET /dev/training-jobs", (p, q) => page(S.trainingJobs, q));
on("GET /dev/deployments", (p, q) => page(S.deployments, q));
on("POST /dev/deployments/{id}/toggle", (p) => {
  const d = S.deployments.find((x) => x.id === p.id);
  if (!d) return notFound;
  d.status = d.status === "active" ? "inactive" : "active";
  return d;
});
on("GET /dev/telemetry", () => ({ uptime_pct: 99.8, latency_ms: series("tel|lat", 24, 45, 12), error_rate: series("tel|err", 24, 0.4, 0.3) }));
on("GET /dev/alert-rules", (p, q) => page(S.devAlertRules, q));
on("POST /dev/alert-rules", (p, q, b) => {
  const r = { id: "dar-" + (S.devAlertRules.length + 1), metric: (b && b.metric) || "latency_ms", threshold: (b && b.threshold) || 100 };
  S.devAlertRules.push(r);
  return { __status: 201, ...r };
});

/* ---- collab ---- */
on("GET /teams", (p, q) => page([{ id: "team-1", name: "Optimizer squad", members: D.devConsole.team.length }], q));
on("POST /teams/{id}/invites", (p, q, b) => ({ __status: 201, team: p.id, email: (b && b.email) || "invitee@sample.gefi", status: "sent" }));
on("GET /threads", (p, q) => page(S.threads.map((t) => ({ id: t.id, title: t.title, messages: t.messages.length })), q));
on("POST /threads/{id}/messages", (p, q, b) => {
  const t = S.threads.find((x) => x.id === p.id);
  if (!t) return notFound;
  const m = { who: "you", when: "just now", text: (b && b.text) || "" };
  t.messages.push(m);
  return { __status: 201, ...m };
});
on("GET /bounties", (p, q) => page(S.bounties, q));
on("POST /bounties/{id}/claim", (p) => {
  const b = S.bounties.find((x) => x.id === p.id);
  if (!b) return notFound;
  b.claims.push({ who: "you", when: "2026-08-22" });
  b.status = "CLAIMED";
  return b;
});
on("POST /bounties/{id}/submissions", (p, q, body) => {
  const b = S.bounties.find((x) => x.id === p.id);
  if (!b) return notFound;
  b.submissions.push({ who: "you", url: (body && body.url) || "", when: "2026-08-22" });
  return { __status: 201, submissions: b.submissions.length };
});
on("POST /bounties/{id}/review", (p, q, body) => {
  const b = S.bounties.find((x) => x.id === p.id);
  if (!b) return notFound;
  const accept = !body || body.accept !== false;
  if (accept) b.status = "COMPLETED";
  return { id: b.id, status: b.status, reward_paid: accept ? b.reward : 0 };
});

/* ---- data-platform ---- */
const allDatasets = () => S.datasets.concat(S.datasetExtra);
on("GET /datasets", (p, q) => page(allDatasets(), q));
on("POST /datasets", (p, q, b) => {
  const d = { id: "DS-NEW-" + (S.datasetExtra.length + 1), name: (b && b.name) || "New dataset", category: (b && b.category) || "Alternative", quality: 0, rows: "—", status: "processing", revenue: 0, downloads: 0, subscribers: 0 };
  S.datasetExtra.push(d);
  return { __status: 202, ...d };
});
on("GET /datasets/{id}", (p) => allDatasets().find((d) => d.id === p.id) || notFound);
on("POST /datasets/{id}/archive", (p) => {
  const d = allDatasets().find((x) => x.id === p.id);
  if (!d) return notFound;
  d.status = "archived";
  return d;
});
on("GET /datasets/{id}/quality", (p) => {
  const d = allDatasets().find((x) => x.id === p.id);
  if (!d) return notFound;
  const r = seed.rng(seed.hash("dq|" + p.id));
  return { id: d.id, quality: d.quality, completeness: +(90 + r() * 9).toFixed(1), freshness: +(85 + r() * 14).toFixed(1), lineage: "complete" };
});
on("GET /dataset-subscriptions", (p, q) => page(allDatasets().filter((d) => d.subscribers > 0).map((d) => ({ dataset: d.id, subscribers: d.subscribers })), q));
on("GET /revenue/summary", () => {
  const t = allDatasets().reduce((n, d) => n + (d.revenue || 0), 0);
  return { total_revenue: t, monthly_avg: Math.round(t / 12), datasets: allDatasets().length };
});
on("GET /revenue/payouts", (p, q) => page([{ period: "2026-07", amount: 186966, status: "settled" }, { period: "2026-08", amount: 224513, status: "scheduled" }], q));
on("GET /market-data/sources", (p, q) => page(D.marketData.sources, q));

/* ---- funding ---- */
const fundingAll = () => S.fundingProjects.concat(S.fundingRequests);
on("GET /funding/projects", (p, q) => {
  let rows = fundingAll();
  if (q.kind) rows = rows.filter((x) => x.kind === q.kind);
  return page(rows, q);
});
on("POST /funding/projects", (p, q, b) => {
  const r = { kind: (b && b.kind) || "model", name: (b && b.name) || "New request", category: (b && b.category) || "Misc", risk: (b && b.risk) || "Medium", status: "submitted", goal: (b && b.goal) || 25000, raised: 0, backers: 0, daysLeft: 45, min: 100, features: [], by: "you" };
  S.fundingRequests.push(r);
  return { __status: 201, ...r };
});
on("POST /funding/projects/{id}/approve", (p) => {
  const r = S.fundingRequests[parseInt(p.id, 10)] || S.fundingRequests.find((x) => x.name === p.id);
  if (!r) return notFound;
  r.status = "approved";
  return r;
});
on("POST /funding/projects/{id}/contributions", (p, q, b) => {
  const proj = fundingAll().find((x) => x.name === p.id) || fundingAll()[parseInt(p.id, 10)];
  if (!proj) return notFound;
  const amount = (b && b.amount) || proj.min;
  if (amount < proj.min) return { __status: 422, code: "validation_failed", message: "Below minimum contribution", details: [{ field: "amount", issue: "min " + proj.min }] };
  proj.raised += amount;
  proj.backers += 1;
  if (proj.raised >= proj.goal) proj.status = "funded";
  S.contributions.push({ project: proj.name, amount, escrow: proj.raised < proj.goal });
  return { __status: 201, project: proj.name, amount, escrow: proj.raised < proj.goal, status: proj.status };
});
on("GET /funding/projects/{id}/contributions", (p, q) => page(S.contributions.filter((c) => c.project === p.id), q));
on("GET /funding/payouts", (p, q) => page(fundingAll().filter((x) => x.status === "funded").map((x) => ({ project: x.name, amount: x.raised, status: "released" })), q));
on("GET /funding/roi", () => ({ items: fundingAll().filter((x) => x.roiPct != null).map((x) => ({ project: x.name, roi_pct: x.roiPct })), next_cursor: null }));

/* ---- learning ---- */
on("GET /learning/catalog", (p, q) => page(D.learning.items.concat(D.learning.paths.map((x) => ({ type: "PATH", ...x }))), q));
on("POST /learning/enrollments", (p, q, b) => {
  const e = { id: "en-" + (S.enrollments.length + 1), item: (b && b.item) || D.learning.items[0].title, progress: 0 };
  S.enrollments.push(e);
  return { __status: 201, ...e };
});
on("PATCH /learning/progress/{enrollment_id}", (p, q, b) => {
  const e = S.enrollments.find((x) => x.id === p.enrollment_id);
  if (!e) return notFound;
  e.progress = Math.min(100, (b && b.progress) || 0);
  return e;
});
on("GET /learning/certificates", (p, q) => page(D.learning.items.filter((i) => i.progress >= 100).map((i) => ({ item: i.title, issued: "2026-07-15" })), q));

/* ---- reports ---- */
on("GET /reports", (p, q) => page(D.reports.categories.flatMap((c) => c.rows.map((r) => ({ category: c.key, ...r }))).concat(S.reports), q));
on("POST /reports/generate", (p, q, b) => {
  const r = { id: "rep-" + (S.reports.length + 1), category: (b && b.category) || "performance", status: "pending", date: "2026-08-22" };
  S.reports.push(r);
  setTimeout(() => (r.status = "generated"), 1500);
  return { __status: 202, ...r };
});
on("GET /reports/schedules", (p, q) => page(D.reports.categories.flatMap((c) => c.rows.filter((r) => r.status === "pending").map((r) => ({ category: c.key, name: r.name, next: r.date }))), q));
on("GET /reports/custom-definitions", (p, q) => page(S.customDefs, q));
on("POST /reports/custom-definitions", (p, q, b) => {
  const d = { id: "cd-" + (S.customDefs.length + 1), ...(b || {}) };
  S.customDefs.push(d);
  return { __status: 201, ...d };
});
on("PATCH /reports/custom-definitions/{id}", (p, q, b) => {
  const d = S.customDefs.find((x) => x.id === p.id);
  if (!d) return notFound;
  Object.assign(d, b || {});
  return d;
});
on("DELETE /reports/custom-definitions/{id}", (p) => {
  const before = S.customDefs.length;
  S.customDefs = S.customDefs.filter((x) => x.id !== p.id);
  return before === S.customDefs.length ? notFound : { ok: true };
});
on("GET /compliance/evaluations", (p, q) => page(D.complianceReports, q));
on("GET /risk/aggregate", () => ({ var95_total: D.riskReports.reduce((n, r) => n + r.var95, 0), reports: D.riskReports.length, by_severity: { Critical: 1, High: 2, Medium: 2, Low: 1 } }));

/* ---- regulator ---- */
const R = D.regulator;
on("GET /regulator/audits/model", (p, q) => page(R.modelAudits, q));
on("GET /regulator/audits/dataset", (p, q) => page(R.datasetAudits, q));
on("GET /regulator/audits/{id}", (p) => R.modelAudits.concat(R.datasetAudits).find((a) => a.id === p.id) || S.regAudits.find((a) => a.id === p.id) || notFound);
on("POST /regulator/audits", (p, q, b) => {
  const a = { id: "MT-NEW-" + (S.regAudits.length + 1), model: (b && b.entity) || "unnamed", org: "You", type: (b && b.type) || "Model governance", severity: "medium", status: "Scheduled", due: "2026-09-15", findings: [] };
  S.regAudits.push(a);
  return { __status: 201, ...a };
});
on("GET /regulator/issues", (p, q) => page(R.issues.filter((i) => !S.issuesResolved.includes(i.id)), q));
on("POST /regulator/issues", (p, q, b) => ({ __status: 201, id: "CI-NEW-1", title: (b && b.title) || "New issue", severity: (b && b.severity) || "medium", status: "open" }));
on("POST /regulator/issues/{id}/resolve", (p) => {
  const i = R.issues.find((x) => x.id === p.id);
  if (!i) return notFound;
  if (!S.issuesResolved.includes(p.id)) S.issuesResolved.push(p.id);
  return { id: p.id, status: "resolved" };
});
on("GET /regulator/threads", (p, q) => page(R.threads.map((t) => ({ id: t.id, org: t.org, subject: t.subject, unread: t.unread, messages: t.messages.length + (S.regThreadExtra[t.id] || []).length })), q));
on("POST /regulator/threads/{id}/messages", (p, q, b) => {
  const t = R.threads.find((x) => x.id === p.id);
  if (!t) return notFound;
  S.regThreadExtra[t.id] = S.regThreadExtra[t.id] || [];
  const m = { from: "you", text: (b && b.text) || "", when: "just now" };
  S.regThreadExtra[t.id].push(m);
  return { __status: 201, ...m };
});
on("GET /regulator/standards", (p, q) => page(R.standardsList, q));
on("GET /regulator/entities/{ref}", (p) => {
  const ref = p.ref.replace(/^#/, "");
  const audit = R.modelAudits.concat(R.datasetAudits).find((a) => a.id === ref);
  if (audit) return { ref, kind: R.modelAudits.includes(audit) ? "model_audit" : "dataset_audit", record: audit };
  const issue = R.issues.find((i) => i.id === ref || i.entity === ref);
  if (issue) return { ref, kind: "issue", record: issue };
  const thread = R.threads.find((t) => t.subject.includes(ref));
  if (thread) return { ref, kind: "thread", record: { id: thread.id, org: thread.org, subject: thread.subject } };
  return notFound;
});

/* ---- notifications ---- */
on("GET /notifications", (p, q) => page(S.notifications, q));
on("POST /notifications/read", (p, q, b) => {
  const ids = (b && b.ids) || S.notifications.map((n) => n.id);
  S.notifications.forEach((n) => {
    if (ids.includes(n.id)) n.unread = false;
  });
  return { ok: true, unread: S.notifications.filter((n) => n.unread).length };
});
on("GET /alerts", (p, q) => page(D.activity.map((a, i) => ({ id: "al-" + i, title: a.title, detail: a.detail, when: a.when })), q));
on("GET /alert-rules", (p, q) => page(S.alertRules, q));
on("POST /alert-rules", (p, q, b) => {
  const r = { id: "ar-" + (S.alertRules.length + 1), symbol: (b && b.symbol) || "AAPL", condition: (b && b.condition) || "above", value: (b && b.value) || 200 };
  S.alertRules.push(r);
  return { __status: 201, ...r };
});
on("DELETE /alert-rules/{id}", (p) => {
  const before = S.alertRules.length;
  S.alertRules = S.alertRules.filter((r) => r.id !== p.id);
  return before === S.alertRules.length ? notFound : { ok: true };
});
on("GET /delivery/channels", () => ({ email: { address: "alex@sample.gefi", verified: true }, push: { enabled: false } }));

/* ---- insights ---- */
on("GET /insights", (p, q) => page(D.insights, q));
on("POST /insights/generate", () => ({ __status: 202, job_id: "ins-1", note: "deterministic sample generator (Claude API behind a flag)" }));
on("GET /sentiment", () => D.reports.market);
on("GET /predictions", () => ({ items: [{ subject: "Fed decision", prediction: D.reports.market.fed.prediction, probability_pct: D.reports.market.fed.probability }], next_cursor: null }));
on("POST /narratives", (p, q, b) => ({ __status: 201, report_id: b && b.report_id, narrative: "Sample narrative: portfolio $142,500, YTD +8.6%, Sharpe 1.34. Deterministic mock output." }));

/* ---- zkml ---- */
function zkPlan(model, shards) {
  const rand = seed.rng(seed.hash("zkml|" + model + "|" + shards));
  const lanes = [];
  for (let i = 0; i < shards; i++) lanes.push(3 + Math.round(rand() * 4));
  const compile = 2 + Math.round(rand() * 2);
  const wall = (compile + 1 + Math.max(...lanes) + 2 + 1) * 15;
  return { model, shards, lanes: lanes.map((t) => t * 15), wall_secs: wall, hash: "0x" + fnvHex(model + "|" + shards) };
}
on("POST /zkml/verifications", (p, q, b) => {
  const model = (b && b.model) || MODELS[0].slug;
  const shards = (b && b.shards) || 4;
  const v = { id: "zk-" + (S.verifications.length + 1), status: "completed", verdict: "verified", ...zkPlan(model, shards) };
  S.verifications.push(v);
  return { __status: 201, ...v };
});
on("GET /zkml/verifications", (p, q) => page(S.verifications, q));
on("GET /zkml/verifications/{id}", (p) => S.verifications.find((v) => v.id === p.id) || notFound);
on("GET /zkml/proofs/{hash}", (p) => {
  const v = S.verifications.find((x) => x.hash === (p.hash.startsWith("0x") ? p.hash : "0x" + p.hash));
  return v ? { hash: v.hash, verification: v.id, verdict: v.verdict } : notFound;
});
on("POST /zkml/anchors", (p, q, b) => {
  const a = { id: "anchor-" + (S.anchors.length + 1), hash: b && b.hash, chain: "sample-l2", tx: "0x" + fnvHex("tx|" + ((b && b.hash) || "")) + fnvHex("tx2|" + ((b && b.hash) || "")) };
  S.anchors.push(a);
  return { __status: 201, ...a };
});
on("GET /federation/rounds", (p, q) => page([1, 2, 3].map((n) => ({ round: n, participants: 3, status: n < 3 ? "aggregated" : "running" })), q));

/* ---- platform ---- */
on("GET /api-keys", (p, q) => page(S.apiKeys, q));
on("POST /api-keys", (p, q, b) => {
  const k = { id: "key-" + (S.apiKeys.length + 1), label: (b && b.label) || "new key", prefix: "gefi_sk_" + fnvHex("key|" + S.apiKeys.length).slice(0, 4), created: "2026-08-22" };
  S.apiKeys.push(k);
  return { __status: 201, ...k, secret_once: k.prefix + "_" + fnvHex("secret|" + k.id) };
});
on("DELETE /api-keys/{id}", (p) => {
  const before = S.apiKeys.length;
  S.apiKeys = S.apiKeys.filter((k) => k.id !== p.id);
  return before === S.apiKeys.length ? notFound : { ok: true };
});
on("GET /rate-limits", () => ({ per_minute: 600, remaining: 597, reset_secs: 42 }));
on("GET /audit-chain/{run_id}", (p) => {
  const rand = seed.rng(seed.hash("chain|" + p.run_id));
  let prev = fnvHex("genesis|" + p.run_id);
  const chain = [];
  for (let i = 0; i < 4; i++) {
    const h = fnvHex(prev + "|" + i + "|" + Math.floor(rand() * 1e6));
    chain.push({ index: i, prev, hash: h });
    prev = h;
  }
  return { run_id: p.run_id, chain };
});
on("GET /search", (p, q) => {
  const needle = (q.q || "").toLowerCase();
  const hits = [];
  MODELS.forEach((m) => {
    if (m.name.toLowerCase().includes(needle)) hits.push({ kind: "model", ref: m.slug, name: m.name });
  });
  allDatasets().forEach((d) => {
    if (d.name.toLowerCase().includes(needle)) hits.push({ kind: "dataset", ref: d.id, name: d.name });
  });
  return page(hits, q);
});
on("GET /i18n/{locale}", (p) => ({ locale: p.locale, strings: { "app.title": "GeFi", "app.sample": "Sample data" } }));
on("GET /gdpr/retention-jobs", (p, q) => page([{ job: "session-purge", last_run: "2026-08-21", status: "succeeded" }, { job: "audit-archive", last_run: "2026-08-20", status: "succeeded" }], q));

/* ---- SSE endpoints ---- */
const SSE = {
  "GET /market-data/stream": (req, res, p, q) => {
    const syms = (q.symbols || "AAPL,MSFT,NVDA").split(",");
    let tick = 0;
    return setInterval(() => {
      tick += 1;
      const s = syms[tick % syms.length];
      const r = seed.rng(seed.hash("sse|" + s + "|" + tick));
      sseSend(res, "quote.tick", tick, { symbol: s, price: +(40 + r() * 460).toFixed(2) });
    }, 1000);
  },
  "GET /backtests/{id}/events": (req, res, p) => {
    let pct = 0;
    return setInterval(() => {
      pct = Math.min(100, pct + 20);
      sseSend(res, pct < 100 ? "backtest.progress" : "backtest.completed", pct, { id: p.id, progress: pct });
      if (pct >= 100) res.end();
    }, 700);
  },
  "GET /dev/training-jobs/{id}/logs": (req, res, p) => {
    let n = 0;
    return setInterval(() => {
      n += 1;
      sseSend(res, "training.log", n, { id: p.id, line: "epoch " + n + " loss " + (0.2 / n).toFixed(4) });
      if (n >= 8) res.end();
    }, 600);
  },
  "GET /zkml/verifications/{id}/events": (req, res, p) => {
    const v = S.verifications.find((x) => x.id === p.id);
    let shard = -1;
    return setInterval(() => {
      shard += 1;
      if (!v || shard >= v.shards) {
        sseSend(res, "zkml.verified", shard, { id: p.id, verdict: "verified" });
        res.end();
        return;
      }
      sseSend(res, "zkml.shard_proved", shard, { id: p.id, shard, task_secs: v.lanes[shard] });
    }, 500);
  },
};
function sseSend(res, event, id, data) {
  try {
    res.write("event: " + event + "\nid: " + id + "\ndata: " + JSON.stringify(data) + "\n\n");
  } catch (e) {}
}

/* --------------------------------------------------------------- server */
function corsHeaders(req) {
  const origin = req.headers.origin || "";
  const ok = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : "http://localhost:8099",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization,Content-Type,Idempotency-Key,X-GeFi-Api-Key,Last-Event-ID",
    "Access-Control-Expose-Headers": "X-GeFi-Sample,X-Request-Id,Retry-After",
  };
}

function matchTemplate(template, actual) {
  const t = template.split("/");
  const a = actual.split("/");
  if (t.length !== a.length) return null;
  const params = {};
  for (let i = 0; i < t.length; i++) {
    const m = t[i].match(/^\{(.+)\}$/);
    if (m) params[m[1]] = decodeURIComponent(a[i]);
    else if (t[i] !== a[i]) return null;
  }
  return params;
}

const routes = contractRoutes();
const missing = routes.filter((r) => !H[r] && !SSE[r]);
if (missing.length) {
  console.error("FATAL: contract routes without handlers:\n  " + missing.join("\n  "));
  process.exit(1);
}
const extra = Object.keys(H).concat(Object.keys(SSE)).filter((r) => !routes.includes(r));
if (extra.length) {
  console.error("FATAL: handlers with no contract route:\n  " + extra.join("\n  "));
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const requestId = "req_" + crypto.randomBytes(6).toString("hex");
  const url = new URL(req.url, "http://localhost");
  const q = Object.fromEntries(url.searchParams);
  const base = { "X-GeFi-Sample": "true", "X-Request-Id": requestId, ...corsHeaders(req) };

  if (req.method === "OPTIONS") {
    res.writeHead(204, base);
    res.end();
    return;
  }
  if (!url.pathname.startsWith("/v1/")) {
    res.writeHead(404, { ...base, "Content-Type": "application/json" });
    res.end(JSON.stringify({ code: "not_found", message: "All routes live under /v1", request_id: requestId }));
    return;
  }
  const apiPath = url.pathname.slice(3);

  let matched = null;
  let params = null;
  let isSse = false;
  for (const r of routes) {
    const [method, template] = r.split(" ");
    if (method !== req.method) continue;
    const m = matchTemplate(template, apiPath);
    if (m) {
      matched = r;
      params = m;
      isSse = !!SSE[r];
      break;
    }
  }
  if (!matched) {
    res.writeHead(404, { ...base, "Content-Type": "application/json" });
    res.end(JSON.stringify({ code: "not_found", message: "No contract route matches " + req.method + " " + apiPath, request_id: requestId }));
    return;
  }

  if (isSse) {
    res.writeHead(200, { ...base, "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    const timer = SSE[matched](req, res, params, q);
    const ping = setInterval(() => {
      try {
        res.write(": ping\n\n");
      } catch (e) {}
    }, 15000);
    req.on("close", () => {
      clearInterval(timer);
      clearInterval(ping);
    });
    res.on("close", () => {
      clearInterval(timer);
      clearInterval(ping);
    });
    return;
  }

  let bodyRaw = "";
  req.on("data", (c) => (bodyRaw += c));
  req.on("end", () => {
    let body = null;
    if (bodyRaw) {
      try {
        body = JSON.parse(bodyRaw);
      } catch (e) {
        res.writeHead(400, { ...base, "Content-Type": "application/json" });
        res.end(JSON.stringify({ code: "validation_failed", message: "Body must be JSON", request_id: requestId }));
        return;
      }
    }

    /* idempotency: required on mutating POSTs, replayed within the process */
    if (req.method === "POST") {
      const key = req.headers["idempotency-key"];
      if (!key) {
        res.writeHead(400, { ...base, "Content-Type": "application/json" });
        res.end(JSON.stringify({ code: "validation_failed", message: "Idempotency-Key header is required on mutating POSTs", details: [{ field: "Idempotency-Key", issue: "missing" }], request_id: requestId }));
        return;
      }
      const cached = S.idempotency.get(key);
      if (cached) {
        res.writeHead(cached.status, { ...base, "X-GeFi-Idempotent-Replay": "true", "Content-Type": "application/json" });
        res.end(cached.body);
        return;
      }
    }

    let out;
    try {
      out = H[matched](params, q, body, req);
    } catch (e) {
      res.writeHead(500, { ...base, "Content-Type": "application/json" });
      res.end(JSON.stringify({ code: "internal", message: String(e && e.message), request_id: requestId }));
      return;
    }
    let status = 200;
    if (out && out.__status) {
      status = out.__status;
      out = { ...out };
      delete out.__status;
    }
    const payload = JSON.stringify(status >= 400 ? { ...out, request_id: requestId } : out);
    if (req.method === "POST") S.idempotency.set(req.headers["idempotency-key"], { status, body: payload });
    res.writeHead(status, { ...base, "Content-Type": "application/json" });
    res.end(payload);
  });
});

server.listen(PORT, () => {
  console.log("GeFi mock API on http://localhost:" + PORT + "/v1 — " + routes.length + " contract routes, all handled");
  const byService = {};
  routes.forEach((r) => {
    const svc = r.split(" ")[1].split("/")[1];
    byService[svc] = (byService[svc] || 0) + 1;
  });
  console.log("route table: " + Object.entries(byService).map(([k, v]) => k + ":" + v).join(" "));
  console.log("dataset: " + MODELS.length + " models, " + Object.keys(D).length + " DEMO collections. State is in-memory; restart resets.");
});
