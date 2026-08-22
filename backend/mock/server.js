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
  for (const f of ["assets/js/dashboard.js", "assets/js/app-demo-data.js", "assets/js/app/rebalance-math.js", "assets/js/app/catalog.js", "assets/js/model-runtime.js", "assets/js/app/market.js", "assets/js/app/backtest-math.js", "assets/js/app/devops-math.js"]) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
  }
  return win.GeFi;
}

const GeFi = loadGeFi();
const D = GeFi.DEMO;
const MODELS = GeFi.MODELS;
const seed = GeFi.seed;
const RB = GeFi.rebalanceMath; /* shared with the client page (task 305) */
const CAT = GeFi.catalog; /* shared with the marketplace pages (task 306) */
const RUNTIME = GeFi.modelRuntime; /* shared with model-demo.js (task 307) */
const MKT = GeFi.market; /* shared with the trading page (task 308) */
const BT = GeFi.backtest; /* shared with the backtesting page (task 309) */
const DO = GeFi.devOps; /* shared with the dev console pages (task 310) */
if (!D || !MODELS || !seed || !RB || !CAT || !RUNTIME || !MKT || !BT || !DO) {
  console.error("FATAL: GeFi shim did not load DEMO/MODELS/seed/rebalanceMath/catalog/modelRuntime/market/backtest/devOps");
  process.exit(1);
}

/* Demo configs (task 307): the built model pages already embed each demo's
 * config as JSON for the harness to read, so the mock reads the SAME blob
 * rather than keeping a second copy that could drift. Without a build the
 * map is simply empty and /run falls back to a slug-only config. */
function loadDemoConfigs() {
  const out = new Map();
  const dir = path.join(ROOT, "_site", "models");
  let slugs = [];
  try {
    slugs = fs.readdirSync(dir);
  } catch (e) {
    return out;
  }
  for (const slug of slugs) {
    const file = path.join(dir, slug, "index.html");
    let html;
    try {
      html = fs.readFileSync(file, "utf8");
    } catch (e) {
      continue;
    }
    const m = html.match(/data-demo-config[^>]*>([\s\S]*?)<\/script>/);
    if (!m) continue;
    try {
      out.set(slug, JSON.parse(m[1]));
    } catch (e) {
      /* a page without a parseable demo config just has no demo */
    }
  }
  return out;
}
const DEMO_CONFIGS = loadDemoConfigs();

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
const IDEMPOTENT_ROUTES = new Set();
function contractRoutes() {
  const dir = path.join(ROOT, "api", "openapi");
  const routes = new Set();
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".yaml") || f === "_envelope.yaml") continue;
    const lines = fs.readFileSync(path.join(dir, f), "utf8").split("\n");
    let current = null;
    let currentOp = null;
    for (const line of lines) {
      const p = line.match(/^  (\/[^\s:]*):\s*$/);
      if (p) {
        current = p[1];
        currentOp = null;
        continue;
      }
      const m = line.match(/^    (get|post|patch|put|delete):\s*$/);
      if (m && current) {
        currentOp = m[1].toUpperCase() + " " + current;
        routes.add(currentOp);
      }
      /* Enforce the Idempotency-Key only where the contract says it is
       * REQUIRED. A blanket rule would reject the shipped model-demo
       * harness, which never sends one — the contract is the authority. */
      if (currentOp && currentOp.startsWith("POST ") && line.includes("parameters/IdempotencyKey")) {
        IDEMPOTENT_ROUTES.add(currentOp);
      }
      if (/^\S/.test(line) && line.trim() && !line.startsWith("paths:")) {
        current = null;
        currentOp = null;
      }
    }
  }
  return [...routes].sort();
}

/* Seeded demo accounts (task 303) — one per persona, fixed password.
 * Sign-in with an unknown email registers a fresh guest account instead
 * of failing, so the mock never dead-ends a curious user; a KNOWN seeded
 * email with the wrong password is the one deterministic 401 path. */
var DEMO_PASSWORD = "demo1234";
var SEED_USERS = [
  { id: "seed-investor", name: "Alex Deme", email: "investor@demo.gefi", persona: "investor", language: "en", theme: "dark", avatar: null, _password: DEMO_PASSWORD },
  { id: "seed-developer", name: "Jordan Rivas", email: "developer@demo.gefi", persona: "developer", language: "en", theme: "dark", avatar: null, _password: DEMO_PASSWORD },
  { id: "seed-provider", name: "Sam Okoye", email: "provider@demo.gefi", persona: "data-provider", language: "en", theme: "dark", avatar: null, _password: DEMO_PASSWORD },
  { id: "seed-regulator", name: "Priya Nair", email: "regulator@demo.gefi", persona: "regulator", language: "en", theme: "dark", avatar: null, _password: DEMO_PASSWORD },
  { id: "seed-admin", name: "Morgan Blake", email: "admin@demo.gefi", persona: "admin", language: "en", theme: "dark", avatar: null, _password: DEMO_PASSWORD },
];

/* ------------------------------------------------------- in-memory state */
function freshState() {
  return {
    profile: null, /* set on sign-in/register; GET /me 401s until then */
    users: SEED_USERS.map((u) => ({ ...u })),
    sessions: [],
    tokens: new Map(), /* token -> { userId, refreshToken } */
    refreshTokens: new Map(), /* refreshToken -> userId */
    watchlist: D.watchlist.map((w) => ({ ...w })),
    orders: D.orders.map((o) => ({ ...o })),
    proposals: [],
    executions: [],
    /* Rebalance state (task 305): targets come from the canonical
     * allocation; current weights start slightly drifted, exactly as the
     * client page's defaults do, so both sides start from one story. */
    rebalanceTargets: D.allocation.reduce((acc, a) => { acc[a.name] = a.pct; return acc; }, {}),
    rebalanceCurrent: { Stocks: 48, Bonds: 22, "Real Estate": 15, Commodities: 10, Cash: 5 },
    lastRebalance: "15 days ago",
    rebalanceSettings: { threshold_pct: 5, auto: false, frequency: "Quarterly", account_costs: true, tax_aware: true },
    ratings: {},
    subscriptions: [{ id: "sub-1", slug: MODELS[1].slug, plan: "standard", monthly_fee: GeFi.catalog.monthlyFee(MODELS[1]), since: "2026-06-01", next_renewal: "2026-09-22", status: "active" }],
    preferences: { wings: [], risk: "medium" },
    /* Dev console (task 310). Jobs keep only what cannot be derived —
     * accuracy, loss and duration come from the shared engine. */
    devModels: D.devConsole.models.map((m, i) => ({ id: "dm-" + (i + 1), ...m })),
    nextDevModelId: D.devConsole.models.length + 1,
    trainingJobs: D.devConsole.jobs.map((j, i) => ({
      id: "tj-" + (i + 1),
      name: j.name,
      status: j.status,
      progress: j.progress,
    })),
    nextTrainingJobId: D.devConsole.jobs.length + 1,
    deployments: D.devConsole.deployments.map((d, i) => ({
      id: "dep-" + (i + 1),
      name: d.name,
      env: d.env,
      status: d.status,
      last: d.last,
    })),
    nextDeploymentId: D.devConsole.deployments.length + 1,
    devActivity: D.devConsole.activityFeed.map((a) => ({ ...a })),
    devRefresh: 0,
    nextAlertRuleId: 1,
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
    /* Backtesting (task 309). The seeded runs are the history; new runs
     * append and every metric is derived by the shared engine. */
    backtests: (D.backtests || []).map((r) => ({
      id: r.id,
      model: r.model,
      range: r.range,
      spec: { model: r.model, range: r.range },
      status: r.status,
      progress: r.status === "completed" ? 100 : 0,
    })),
    nextBacktestId: 119,
    optimizerRuns: [],
    nextOptimizerId: 1,
    metricsAsOf: {},
    paperOrders: [],
    tick: 0,
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

/* ---- auth (task 303) ---- */
function sanitizeUser(u) {
  if (!u) return null;
  var out = {};
  Object.keys(u).forEach(function (k) { if (k !== "_password") out[k] = u[k]; });
  return out;
}
function findUser(email) {
  var e = String(email || "").toLowerCase();
  return S.users.find((u) => u.email.toLowerCase() === e);
}
function issueSession(user, device) {
  const tok = "gefi_" + Buffer.from(JSON.stringify({ typ: "sampleJWT" })).toString("base64url") +
    "." + Buffer.from(JSON.stringify({ sub: user.id, persona: user.persona })).toString("base64url") +
    "." + fnvHex("sig|" + user.id + "|" + S.sessions.length);
  const refresh = "rt_" + fnvHex("refresh|" + user.id + "|" + S.sessions.length) + fnvHex("r2|" + S.sessions.length);
  S.tokens.set(tok, { userId: user.id });
  S.refreshTokens.set(refresh, user.id);
  S.sessions.forEach((s) => { if (s.userId === user.id) s.current = false; });
  const rand = seed.rng(seed.hash("session|" + user.id + "|" + S.sessions.length));
  S.sessions.push({
    id: "sess-" + (S.sessions.length + 1),
    userId: user.id,
    token: tok,
    device: device || ["Chrome on macOS", "Safari on iOS", "Firefox on Windows", "Edge on Windows"][Math.floor(rand() * 4)],
    ip: "203.0.113." + (10 + Math.floor(rand() * 240)),
    created: "2026-08-22",
    current: true,
  });
  S.profile = user;
  return { token: tok, refresh_token: refresh, user: sanitizeUser(user) };
}
on("POST /auth/register", (p, q, b) => {
  const email = b && b.email;
  const password = (b && b.password) || "";
  if (!email || password.length < 8) {
    return { __status: 422, code: "validation_failed", message: "Email and an 8+ character password are required.", details: [{ field: "password", issue: "min length 8" }] };
  }
  if (findUser(email)) {
    return { __status: 409, code: "conflict", message: "An account with that email already exists." };
  }
  const user = {
    id: "u-" + (S.users.length + 1),
    name: (b && b.name) || email.split("@")[0],
    email: email,
    persona: (b && b.persona) || "investor",
    language: "en",
    theme: "dark",
    avatar: null,
    _password: password,
  };
  S.users.push(user);
  return { __status: 201, ...issueSession(user, "New account") };
});
on("POST /auth/session", (p, q, b) => {
  const email = b && b.email;
  const password = (b && b.password) || "";
  if (!email) return { __status: 422, code: "validation_failed", message: "Email is required." };
  var user = findUser(email);
  if (user) {
    if (user._password !== password) {
      return { __status: 401, code: "invalid_credentials", message: "Wrong password for " + email + "." };
    }
  } else {
    /* Unknown email never dead-ends the mock: it becomes a fresh guest,
     * so any email/password combo "just works" on first use. */
    user = { id: "u-" + (S.users.length + 1), name: email.split("@")[0], email: email, persona: "investor", language: "en", theme: "dark", avatar: null, _password: password };
    S.users.push(user);
  }
  return issueSession(user);
});
on("DELETE /auth/session", () => {
  const cur = S.sessions.find((s) => s.current);
  if (cur) {
    S.tokens.delete(cur.token);
    cur.current = false;
  }
  S.profile = null;
  return { ok: true };
});
on("POST /auth/session/refresh", (p, q, b) => {
  const rt = b && b.refresh_token;
  const userId = S.refreshTokens.get(rt);
  if (!userId) return { __status: 401, code: "invalid_credentials", message: "Refresh token is invalid or expired." };
  const user = S.users.find((u) => u.id === userId);
  if (!user) return { __status: 401, code: "invalid_credentials", message: "Account no longer exists." };
  S.refreshTokens.delete(rt);
  return issueSession(user, "Refreshed session");
});
on("GET /auth/sessions", (p, q) => {
  const mine = S.profile ? S.sessions.filter((s) => s.userId === S.profile.id) : [];
  return page(mine.map((s) => ({ id: s.id, device: s.device, ip: s.ip, created: s.created, current: s.current })), q);
});
on("DELETE /auth/sessions/{id}", (p) => {
  const sess = S.sessions.find((s) => s.id === p.id);
  if (!sess) return { __status: 404, code: "not_found", message: "No such session." };
  S.tokens.delete(sess.token);
  S.sessions = S.sessions.filter((s) => s.id !== p.id);
  if (sess.current && S.profile && S.profile.id === sess.userId) S.profile = null;
  return { ok: true };
});
on("GET /me", () => {
  if (!S.profile) return { __status: 401, code: "invalid_credentials", message: "Not signed in." };
  return sanitizeUser(S.profile);
});
on("PATCH /me", (p, q, b) => {
  if (!S.profile) return { __status: 401, code: "invalid_credentials", message: "Not signed in." };
  Object.assign(S.profile, b || {});
  const stored = S.users.find((u) => u.id === S.profile.id);
  if (stored) Object.assign(stored, b || {});
  return sanitizeUser(S.profile);
});
on("GET /me/personas", () => ({
  items: ["investor", "portfolio", "trader", "developer", "marketplace", "funding", "regulator", "reports", "learning", "data-provider"].map((k) => ({ persona: k, granted: true })),
  next_cursor: null,
}));
on("GET /orgs", (p, q) => page([{ id: "org-1", name: "Meridian Bank", role: "member" }, { id: "org-2", name: "GeFi Labs", role: "owner" }], q));
on("GET /orgs/{org_id}/members", (p, q) => page(D.devConsole.team.map((t, i) => ({ id: "m-" + i, ...t })), q));

/* ---- portfolio (task 304) ---- */
on("GET /portfolio", () => D.portfolio);
on("GET /portfolio/holdings", (p, q) => page(D.holdings, q));
on("GET /portfolio/transactions", (p, q) => page(D.transactions, q));
on("GET /portfolio/performance", (p, q) => {
  /* Slice the canonical seeded series so live mode charts exactly what
   * the sample dataset charts — no second, disagreeing generator. */
  const WINDOWS = { "1m": 21, "3m": 63, "6m": 126, "1y": 180, ytd: 180, all: 180 };
  const n = WINDOWS[q.period] || WINDOWS["1y"];
  const full = D.portfolio.valueSeries;
  const fullBench = D.portfolio.benchSeries;
  const s = full.slice(Math.max(0, full.length - n));
  const bench = fullBench.slice(Math.max(0, fullBench.length - n));
  const pct = (arr) => (arr.length > 1 ? +(((arr[arr.length - 1] - arr[0]) / arr[0]) * 100).toFixed(2) : 0);
  return { period: q.period || "1y", series: s, benchmark: bench, returnPct: pct(s), benchReturnPct: pct(bench) };
});
on("GET /portfolio/risk", () => D.risk);
on("GET /portfolio/allocation", () => ({ items: D.allocation, next_cursor: null }));
on("GET /watchlist", (p, q) => page(S.watchlist, q));
on("POST /watchlist", (p, q, b) => {
  /* Rows are keyed by `ticker` — the same field DEMO.watchlist uses, so
   * added rows and seeded rows are interchangeable everywhere. */
  const ticker = ((b && (b.ticker || b.symbol)) || "").toUpperCase();
  if (!ticker) return { __status: 422, code: "validation_failed", message: "ticker is required.", details: [{ field: "ticker", issue: "missing" }] };
  if (S.watchlist.some((w) => w.ticker === ticker)) {
    return { __status: 409, code: "conflict", message: ticker + " is already on the watchlist." };
  }
  const rand = seed.rng(seed.hash("wl|" + ticker));
  const price = +(40 + rand() * 460).toFixed(2);
  const spark = [];
  for (let i = 0; i < 24; i++) spark.push(+(price * (0.98 + rand() * 0.04)).toFixed(2));
  const row = { ticker: ticker, name: (b && b.name) || ticker, price: price, dayPct: +((rand() - 0.45) * 3).toFixed(2), spark: spark };
  S.watchlist.push(row);
  return { __status: 201, ...row };
});
on("DELETE /watchlist/{symbol}", (p) => {
  const ticker = String(p.symbol || "").toUpperCase();
  const before = S.watchlist.length;
  S.watchlist = S.watchlist.filter((w) => w.ticker !== ticker);
  return before === S.watchlist.length ? notFound : { ok: true };
});

/* ---- rebalance (task 305) — all math via the SHARED module ---- */
on("GET /rebalance/drift", () => ({
  items: RB.driftRows(S.rebalanceTargets, S.rebalanceCurrent),
  next_cursor: null,
  targets: S.rebalanceTargets,
  current: S.rebalanceCurrent,
  max_drift_pct: +RB.maxDrift(S.rebalanceTargets, S.rebalanceCurrent).toFixed(1),
  settings: S.rebalanceSettings,
  last_rebalance: S.lastRebalance,
}));
on("PUT /rebalance/targets", (p, q, b) => {
  if (!b || typeof b !== "object") return { __status: 422, code: "validation_failed", message: "Body must be a weights object." };
  const bad = Object.keys(b).filter((k) => typeof b[k] !== "number" || b[k] < 0);
  if (bad.length) return { __status: 422, code: "validation_failed", message: "Weights must be non-negative numbers.", details: bad.map((f) => ({ field: f, issue: "invalid" })) };
  S.rebalanceTargets = Object.assign({}, b);
  return S.rebalanceTargets;
});
on("POST /rebalance/proposals", (p, q, b) => {
  const targets = (b && b.targets) || S.rebalanceTargets;
  const pr = RB.proposal(targets, S.rebalanceCurrent, D.portfolio.value);
  pr.id = "prop-" + (S.proposals.length + 1);
  pr.created = "2026-08-22";
  S.proposals.push(pr);
  return { __status: 201, ...pr };
});
on("GET /rebalance/proposals", (p, q) => page(S.proposals, q));
on("POST /rebalance/executions", (p, q, b) => {
  const targets = (b && b.targets) || S.rebalanceTargets;
  const total = RB.totalTarget(targets);
  if (Math.round(total) !== 100) {
    return { __status: 422, code: "validation_failed", message: "Targets must sum to 100% (got " + total + "%).", details: [{ field: "targets", issue: "sum != 100" }] };
  }
  const proposed = RB.proposal(targets, S.rebalanceCurrent, D.portfolio.value);
  S.rebalanceTargets = Object.assign({}, targets);
  S.rebalanceCurrent = RB.applied(targets);
  S.lastRebalance = "just now";
  const ex = {
    id: "exec-" + (S.executions.length + 1),
    executed_at: "2026-08-22",
    trades: proposed.trades,
    total_value: proposed.total_value,
    resulting_weights: S.rebalanceCurrent,
  };
  S.executions.push(ex);
  return { __status: 201, ...ex };
});
on("GET /rebalance/executions", (p, q) => page(S.executions, q));
on("GET /rebalance/settings", () => S.rebalanceSettings);
on("PATCH /rebalance/settings", (p, q, b) => {
  Object.assign(S.rebalanceSettings, b || {});
  return S.rebalanceSettings;
});

/* ---- marketplace (task 306) — catalogue math via the SHARED module ---- */
const FEE_OF = (slug) => {
  const m = MODELS.find((x) => x.slug === slug);
  return m ? CAT.monthlyFee(m) : 0;
};
const RENEWAL = "2026-09-22";

on("GET /models", (p, q) => {
  const rows = CAT.filter(CAT.catalog(), q);
  const out = page(rows, q);
  out.total = rows.length;
  return out;
});
on("GET /models/{slug}", (p) => {
  const m = MODELS.find((x) => x.slug === p.slug);
  return m ? CAT.decorate(m) : notFound;
});
on("GET /models/{slug}/ratings", (p, q) => {
  const own = S.ratings[p.slug] || [];
  const seeded = [{ user: "quantessence", stars: 5, comment: "Deterministic and well documented." }];
  const out = page(own.concat(seeded), q);
  out.summary = CAT.ratingsSummary(p.slug);
  return out;
});
on("POST /models/{slug}/ratings", (p, q, b) => {
  const stars = b && b.stars;
  if (!(stars >= 1 && stars <= 5)) {
    return { __status: 422, code: "validation_failed", message: "stars must be between 1 and 5.", details: [{ field: "stars", issue: "out of range" }] };
  }
  S.ratings[p.slug] = S.ratings[p.slug] || [];
  const r = { user: "you", stars: stars, comment: (b && b.comment) || "" };
  S.ratings[p.slug].push(r);
  return { __status: 201, ...r };
});
on("GET /categories", (p, q) => {
  const cats = CAT.categories(CAT.catalog());
  const out = page(cats, q);
  out.total_models = cats.reduce((n, c) => n + c.model_count, 0);
  return out;
});
on("GET /developers", (p, q) => {
  let rows = D.developers.slice();
  if (q.q) {
    const needle = String(q.q).toLowerCase();
    rows = rows.filter((d) => (d.name + " " + d.handle + " " + d.specialties.join(" ")).toLowerCase().includes(needle));
  }
  if (q.verified) rows = rows.filter((d) => String(d.verified) === q.verified);
  return page(rows, q);
});
on("GET /subscriptions", (p, q) => page(S.subscriptions, q));
on("POST /subscriptions", (p, q, b) => {
  const slug = b && b.slug;
  if (!slug) return { __status: 422, code: "validation_failed", message: "slug is required.", details: [{ field: "slug", issue: "missing" }] };
  if (!MODELS.some((m) => m.slug === slug)) return { __status: 404, code: "not_found", message: "No model with slug " + slug + "." };
  if (S.subscriptions.some((s) => s.slug === slug && s.status !== "cancelled")) {
    return { __status: 409, code: "conflict", message: "Already subscribed to " + slug + "." };
  }
  /* Billing stub: a plan and a fee, but no payment is taken (see the
   * BILLING GAP note in api/openapi/marketplace.yaml). */
  const sub = {
    id: "sub-" + (S.subscriptions.length + 1),
    slug: slug,
    plan: (b && b.plan) || "standard",
    monthly_fee: FEE_OF(slug),
    since: "2026-08-22",
    next_renewal: RENEWAL,
    status: "active",
  };
  S.subscriptions.push(sub);
  return { __status: 201, ...sub };
});
on("DELETE /subscriptions/{id}", (p) => {
  /* Accept either the subscription id or the model slug — the UI knows
   * the slug, and making the caller look up an id first buys nothing. */
  const before = S.subscriptions.length;
  S.subscriptions = S.subscriptions.filter((s) => s.id !== p.id && s.slug !== p.id);
  return before === S.subscriptions.length ? notFound : { ok: true };
});
on("GET /billing/invoices", (p, q) =>
  page(
    S.subscriptions.map((s, i) => ({
      id: "inv-" + (i + 1),
      subscription: s.id,
      amount_usd: s.monthly_fee != null ? s.monthly_fee : FEE_OF(s.slug),
      period: "2026-08",
      status: "sample",
    })),
    q
  ));
on("GET /recommendations", () => ({
  items: CAT.recommend(CAT.catalog(), S.preferences, 6),
  next_cursor: null,
  based_on: S.preferences,
}));
on("GET /trending", () => ({ items: CAT.trending(CAT.catalog(), 8), next_cursor: null }));
on("GET /preferences", () => S.preferences);
on("PUT /preferences", (p, q, b) => {
  S.preferences = b || S.preferences;
  return S.preferences;
});

/* ---- models-runtime (task 307) — the SHARED scorer ---- */
const RUN_JOBS = new Map();
function demoCfg(slug) {
  /* The page's own demo config when a build is present; otherwise just the
   * slug, which still seeds deterministically. */
  return DEMO_CONFIGS.get(slug) || { slug: slug };
}
function runFor(slug, body) {
  /* model-demo.js posts { inputs: {...} } and seeds on that object, so the
   * mock must seed on exactly the same value to match byte for byte. */
  const inputs = body && body.inputs !== undefined ? body.inputs : body || {};
  return RUNTIME.run(demoCfg(slug), inputs);
}
on("POST /models/{slug}/run", (p, q, b) => {
  if (!MODELS.some((m) => m.slug === p.slug)) return notFound;
  const result = runFor(p.slug, b);
  if (q.async === "true") {
    const job = { id: "run-" + (RUN_JOBS.size + 1), slug: p.slug, status: "completed", progress: 100, result: result };
    RUN_JOBS.set(job.id, job);
    return { __status: 202, ...job };
  }
  return result;
});
on("GET /models/{slug}/jobs/{job_id}", (p) => RUN_JOBS.get(p.job_id) || notFound);
on("GET /models/{slug}/metrics", (p) => {
  const m = MODELS.find((x) => x.slug === p.slug);
  return m ? { slug: m.slug, unit: m.unit, series: m.series, metrics_as_of: S.metricsAsOf[m.slug] || "2026-08-22" } : notFound;
});
on("POST /models/{slug}/metrics/refresh", (p) => {
  if (!MODELS.some((m) => m.slug === p.slug)) return notFound;
  S.metricsAsOf[p.slug] = "2026-08-22";
  return { __status: 202, job_id: "mr-" + fnvHex("refresh|" + p.slug), metrics_as_of: S.metricsAsOf[p.slug] };
});

/* ---- trading (task 308) — seeded walk + fills via the SHARED module ---- */
function paperOrders() {
  return S.paperOrders;
}
/* A limit/stop order fills as soon as the walk crosses its trigger. */
function settlePending(tick) {
  S.paperOrders.forEach((o) => {
    if (o.status !== "pending") return;
    const px = MKT.priceAt(o.symbol, tick);
    if (px == null) return;
    const fill = MKT.fillPrice(o, px);
    if (fill != null) {
      o.fill = fill;
      o.status = "filled";
      o.tick = tick;
    }
  });
}
on("GET /market-data/quotes", (p, q) => {
  const tick = q.tick != null && q.tick !== "" ? parseInt(q.tick, 10) : S.tick;
  const syms = (q.symbols ? String(q.symbols).split(",") : MKT.symbols()).map((x) => x.trim().toUpperCase());
  return {
    items: syms
      .filter((sym) => MKT.priceAt(sym, 0) != null)
      .map((sym) => ({ symbol: sym, price: +MKT.priceAt(sym, tick).toFixed(2), tick: tick, series: MKT.seriesAt(sym, tick, 40).map((v) => +v.toFixed(2)) })),
    next_cursor: null,
    tick: tick,
  };
});
on("POST /orders", (p, q, b) => {
  const symbol = String((b && b.symbol) || "").toUpperCase();
  if (MKT.priceAt(symbol, 0) == null) return { __status: 404, code: "not_found", message: "Unknown symbol " + (symbol || "(none)") + "." };
  const qty = b && Number(b.qty);
  if (!qty || qty < 1) return { __status: 422, code: "validation_failed", message: "qty must be at least 1.", details: [{ field: "qty", issue: "invalid" }] };
  const type = ((b && b.type) || "market").toLowerCase();
  const trigger = b && b.limit != null ? Number(b.limit) : null;
  if ((type === "limit" || type === "stop") && trigger == null) {
    return { __status: 422, code: "validation_failed", message: type + " orders need a limit price.", details: [{ field: "limit", issue: "missing" }] };
  }
  /* Fill at the tick the client was showing, so the price the user saw is
   * the price they get; fall back to the server's tick when not sent. */
  const atTick = b && b.tick != null ? Math.max(0, parseInt(b.tick, 10) || 0) : S.tick;
  const px = MKT.priceAt(symbol, atTick);
  const order = {
    id: "ORD-" + (9000 + S.paperOrders.length + 1),
    symbol: symbol,
    side: ((b && b.side) || "buy").toLowerCase(),
    type: type,
    qty: qty,
    limit: trigger,
    price: +px.toFixed(2),
    fill: null,
    status: "pending",
    tick: atTick,
    date: "2026-08-22",
  };
  const fill = MKT.fillPrice(order, px);
  if (fill != null) {
    order.fill = fill;
    order.status = "filled";
  }
  S.paperOrders.unshift(order);
  return { __status: 201, ...order };
});
on("GET /orders", (p, q) => {
  settlePending(S.tick);
  let rows = paperOrders().concat(S.orders);
  if (q.symbol) rows = rows.filter((o) => o.symbol === String(q.symbol).toUpperCase());
  if (q.status) rows = rows.filter((o) => o.status === q.status);
  if (q.side) rows = rows.filter((o) => String(o.side).toLowerCase() === String(q.side).toLowerCase());
  const out = page(rows, q);
  out.total = rows.length;
  return out;
});
on("GET /orders/{id}", (p) => paperOrders().concat(S.orders).find((o) => String(o.id) === p.id) || notFound);
on("DELETE /orders/{id}", (p) => {
  const o = paperOrders().concat(S.orders).find((x) => String(x.id) === p.id);
  if (!o) return notFound;
  if (o.status !== "pending") return { __status: 409, code: "conflict", message: "Order is already " + o.status + "." };
  o.status = "cancelled";
  return o;
});
on("GET /positions", (p, q) => {
  settlePending(S.tick);
  return page(MKT.positions(paperOrders(), S.tick), q);
});
on("POST /paper/reset", () => {
  S.paperOrders = [];
  S.tick = 0;
  return { ok: true, orders: 0 };
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

/* ---- backtesting (task 309) ----
 * Every figure comes from the shared engine, so a run the server computed
 * and the same run simulated in the browser report the same numbers. */

/* A stored run, flattened for the list and detail views. */
function btRow(run) {
  if (run.status !== "completed") {
    return { id: run.id, model: run.model, range: run.range, rangeLabel: BT.span(run.spec).label, status: run.status, progress: run.progress || 0 };
  }
  const m = BT.metrics(run.model, run.spec);
  return {
    id: run.id,
    model: run.model,
    range: m.range,
    rangeLabel: m.rangeLabel,
    status: "completed",
    sharpe: m.sharpe,
    annualPct: m.annualPct,
    drawdownPct: m.drawdownPct,
    trades: m.trades,
    winRatePct: m.winRatePct,
  };
}
function btFind(id) {
  return S.backtests.find((r) => r.id === id);
}

on("POST /backtests", (p, q, b) => {
  const spec = { model: (b && b.model) || "", range: (b && b.range) || "1y", start: b && b.start, end: b && b.end };
  const why = BT.validate(spec);
  if (why) return { __status: 422, code: "validation_failed", message: why };
  const run = { id: "BT-" + S.nextBacktestId++, model: spec.model, range: BT.span(spec).key, spec, status: "queued", progress: 0 };
  S.backtests.unshift(run);
  return { __status: 202, ...btRow(run) };
});
on("GET /backtests", (p, q) => {
  let rows = S.backtests.map(btRow);
  if (q.status) rows = rows.filter((r) => r.status === q.status);
  return page(rows, q);
});
on("GET /backtests/{id}", (p) => {
  const run = btFind(p.id);
  if (!run) return notFound;
  return btRow(run);
});
on("GET /backtests/{id}/results", (p, q) => {
  const run = btFind(p.id);
  if (!run) return notFound;
  const limit = Math.min(200, Math.max(1, parseInt(q.trades, 10) || 20));
  return {
    id: run.id,
    model: run.model,
    range: run.range,
    equity: BT.equity(run.model, run.spec),
    stats: BT.metrics(run.model, run.spec),
    tradeRows: BT.trades(run.model, run.spec, limit),
  };
});
on("GET /backtests/compare", (p, q) => {
  const ids = String(q.ids || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (ids.length < 2) return { __status: 422, code: "validation_failed", message: "compare needs at least two run ids" };
  const points = Math.min(400, Math.max(10, parseInt(q.points, 10) || 60));
  const items = [];
  for (const id of ids) {
    const run = btFind(id);
    if (!run) return { __status: 422, code: "validation_failed", message: "unknown run: " + id };
    items.push({
      id: run.id,
      model: run.model,
      range: run.range,
      metrics: BT.metrics(run.model, run.spec),
      equity: resample(BT.equity(run.model, run.spec), points),
    });
  }
  return { points, items };
});

/* Curves of different lengths are put on one x-axis before they are drawn,
 * so a 1y run and a 5y run overlay honestly instead of one being stretched. */
function resample(values, n) {
  if (values.length === n) return values.slice();
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(values[Math.round((i / (n - 1)) * (values.length - 1))]);
  }
  return out;
}

on("POST /optimizer/runs", (p, q, b) => {
  const spec = { model: (b && b.model) || "", range: (b && b.range) || "1y", start: b && b.start, end: b && b.end };
  const why = BT.validate(spec);
  if (why) return { __status: 422, code: "validation_failed", message: why };
  const grid = (b && b.grid) || BT.GRID;
  if (!Object.keys(grid).length) return { __status: 422, code: "validation_failed", message: "grid must name at least one parameter" };
  const result = BT.optimize(spec.model, spec, grid);
  const run = { id: "OPT-" + S.nextOptimizerId++, status: "completed", ...result };
  S.optimizerRuns.unshift(run);
  return { __status: 202, ...run };
});
on("GET /optimizer/runs", (p, q) => page(S.optimizerRuns, q));
on("GET /optimizer/runs/{id}", (p) => {
  const run = S.optimizerRuns.find((r) => r.id === p.id);
  if (!run) return notFound;
  return run;
});
on("GET /historical-data/{symbol}", (p, q) => page(series("hist|" + p.symbol, 48, 100, 20).map((v, i) => ({ t: i, close: v })), q));

/* ---- devconsole (task 310) ----
 * Lifecycle, hyperparameter bounds, the training progression and the
 * telemetry all come from the shared engine, so the console pages and the
 * server cannot disagree about what is allowed or what a job reports. */

function devActivity(title, meta, tag) {
  S.devActivity.unshift({ title, meta, tag });
}

/* A job's public shape: accuracy and loss are DERIVED from progress rather
 * than stored, so they cannot drift away from the bar the user is watching. */
function jobRow(j) {
  const m = DO.jobMetrics(j.name, j.progress);
  return {
    id: j.id,
    name: j.name,
    status: j.status,
    progress: j.progress,
    accuracy: j.progress > 0 ? m.accuracy : 0,
    loss: j.progress > 0 ? m.loss : 0,
    duration: j.status === "completed" ? DO.jobDuration(j.name) : j.progress > 0 ? "running" : "0m",
    params: j.params || null,
  };
}

/* A stopped deployment is serving nothing, so its live fields read zero. */
function deployRow(d) {
  if (d.status !== "active") {
    return { ...d, uptime: 0, requests: "0", latency: "0ms" };
  }
  const t = DO.telemetry(d.name, S.devRefresh, d.status);
  return { ...d, uptime: t.uptime, requests: Math.round(t.requests / 1000) + "K", latency: t.response + "ms" };
}

on("GET /dev/models", (p, q) => {
  let rows = S.devModels;
  if (q.status) rows = rows.filter((m) => m.status === q.status);
  return page(rows, q);
});
on("POST /dev/models", (p, q, b) => {
  const name = ((b && b.name) || "").trim();
  const why = DO.validateModel({ name }, S.devModels);
  if (why) {
    return why === "name is required"
      ? { __status: 422, code: "validation_failed", message: why }
      : { __status: 409, code: "conflict", message: why };
  }
  const m = {
    id: "dm-" + S.nextDevModelId++,
    name,
    status: "Draft",
    category: (b && b.category) || "Misc",
    tests: 0,
    collaborators: 1,
    funded: 0,
    goal: b && b.goal != null ? b.goal : 0,
  };
  S.devModels.push(m);
  devActivity(name + " registered", "Model · just now", "model");
  return { __status: 201, ...m };
});
on("GET /dev/models/{id}", (p) => S.devModels.find((x) => x.id === p.id) || notFound);
on("PATCH /dev/models/{id}", (p, q, b) => {
  const m = S.devModels.find((x) => x.id === p.id);
  if (!m) return notFound;
  const body = b || {};
  if (body.status !== undefined && body.status !== m.status) {
    const bad = DO.validateStage(m.status, body.status);
    if (bad) return { __status: 422, code: "validation_failed", message: bad };
    m.status = body.status;
    devActivity(m.name + " promoted to " + m.status, "Model · just now", "model");
  }
  if (body.name !== undefined) m.name = body.name;
  if (body.category !== undefined) m.category = body.category;
  return m;
});
on("DELETE /dev/models/{id}", (p) => {
  const m = S.devModels.find((x) => x.id === p.id);
  if (!m) return notFound;
  if (m.status !== "Draft") return { __status: 409, code: "conflict", message: "only draft models can be deleted; " + m.name + " is " + m.status };
  S.devModels = S.devModels.filter((x) => x.id !== p.id);
  return { ok: true };
});

on("GET /dev/hyperparameters", () => ({ params: DO.HYPERPARAMS, methods: DO.METHODS }));
on("POST /dev/training-jobs", (p, q, b) => {
  const spec = b || {};
  const why = DO.validateJob(spec);
  if (why) return { __status: 422, code: "validation_failed", message: why };
  const j = {
    id: "tj-" + S.nextTrainingJobId++,
    name: DO.jobName(spec),
    status: "queued",
    progress: 0,
    params: { lr: +spec.lr, batch: +spec.batch, epochs: +spec.epochs, method: spec.method },
  };
  S.trainingJobs.unshift(j);
  return { __status: 202, ...jobRow(j) };
});
on("GET /dev/training-jobs", (p, q) => {
  let rows = S.trainingJobs.map(jobRow);
  if (q.status) rows = rows.filter((j) => j.status === q.status);
  return page(rows, q);
});
on("GET /dev/training-jobs/{id}", (p) => {
  const j = S.trainingJobs.find((x) => x.id === p.id);
  return j ? jobRow(j) : notFound;
});
on("POST /dev/training-jobs/{id}/pause", (p) => {
  const j = S.trainingJobs.find((x) => x.id === p.id);
  if (!j) return notFound;
  if (j.status !== "running") return { __status: 409, code: "conflict", message: "job is " + j.status + ", not running" };
  j.status = "paused";
  return jobRow(j);
});
on("POST /dev/training-jobs/{id}/resume", (p) => {
  const j = S.trainingJobs.find((x) => x.id === p.id);
  if (!j) return notFound;
  if (j.status !== "paused") return { __status: 409, code: "conflict", message: "job is " + j.status + ", not paused" };
  j.status = "running";
  return jobRow(j);
});

on("GET /dev/deployments", (p, q) => {
  let rows = S.deployments.map(deployRow);
  if (q.env) rows = rows.filter((d) => d.env === q.env);
  return page(rows, q);
});
on("POST /dev/deployments", (p, q, b) => {
  const name = ((b && b.name) || "").trim();
  const env = (b && b.env) || "";
  if (!name) return { __status: 422, code: "validation_failed", message: "name is required" };
  if (DO.ENVIRONMENTS.indexOf(env) === -1) {
    return { __status: 422, code: "validation_failed", message: "env must be one of " + DO.ENVIRONMENTS.join(", ") };
  }
  if (S.deployments.some((d) => d.name === name && d.env === env)) {
    return { __status: 409, code: "conflict", message: name + " is already deployed to " + env };
  }
  const d = { id: "dep-" + S.nextDeploymentId++, name, env, status: "active", last: "2026-08-22" };
  S.deployments.push(d);
  devActivity(name + " deployed to " + env, "Deployment · just now", "deployment");
  return { __status: 201, ...deployRow(d) };
});
on("POST /dev/deployments/{id}/toggle", (p) => {
  const d = S.deployments.find((x) => x.id === p.id);
  if (!d) return notFound;
  d.status = d.status === "active" ? "inactive" : "active";
  devActivity(d.name + (d.status === "active" ? " started" : " stopped"), "Deployment · just now", "deployment");
  return deployRow(d);
});
on("GET /dev/deployments/{id}/logs", (p, q) => {
  const d = S.deployments.find((x) => x.id === p.id);
  if (!d) return notFound;
  return { id: d.id, lines: DO.logLines(d.name, Math.min(100, parseInt(q.limit, 10) || 8)) };
});

on("GET /dev/telemetry", (p, q) => {
  const refresh = Math.max(0, parseInt(q.refresh, 10) || 0);
  S.devRefresh = refresh;
  const items = S.deployments.map((d) => {
    const t = DO.telemetry(d.name, refresh, d.status);
    return {
      id: d.id,
      name: d.name,
      env: d.env,
      status: d.status,
      ...t,
      latency_series: t.serving ? DO.seriesFor(d.name, "latency") : [],
      error_series: t.serving ? DO.seriesFor(d.name, "errors") : [],
    };
  });
  return { refresh, fleet: DO.fleet(S.deployments, refresh), items };
});

on("GET /dev/activity", (p, q) => page(S.devActivity, q));

const ALERT_METRICS = ["accuracy", "response", "uptime", "errors"];
on("GET /dev/alert-rules", (p, q) => page(S.devAlertRules, q));
on("POST /dev/alert-rules", (p, q, b) => {
  const body = b || {};
  if (ALERT_METRICS.indexOf(body.metric) === -1) {
    return { __status: 422, code: "validation_failed", message: "metric must be one of " + ALERT_METRICS.join(", ") };
  }
  if (typeof body.threshold !== "number" || !isFinite(body.threshold)) {
    return { __status: 422, code: "validation_failed", message: "threshold must be a number" };
  }
  const r = {
    id: "dar-" + S.nextAlertRuleId++,
    metric: body.metric,
    comparator: body.comparator === "below" ? "below" : "above",
    threshold: body.threshold,
    deployment: body.deployment || null,
    enabled: true,
  };
  S.devAlertRules.push(r);
  return { __status: 201, ...r };
});
on("PATCH /dev/alert-rules/{id}", (p, q, b) => {
  const r = S.devAlertRules.find((x) => x.id === p.id);
  if (!r) return notFound;
  Object.assign(r, b || {});
  return r;
});
on("DELETE /dev/alert-rules/{id}", (p) => {
  const r = S.devAlertRules.find((x) => x.id === p.id);
  if (!r) return notFound;
  S.devAlertRules = S.devAlertRules.filter((x) => x.id !== p.id);
  return { ok: true };
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
/* Preview rows use the same seed key the market-data page uses offline,
 * so the live table and the offline table show identical rows. */
function previewRows(key, extra, n) {
  const src = D.marketData.sources.find((s) => s.key === key);
  if (!src) return null;
  const rand = seed.rng(seed.hash("mdrows|" + key + "|" + extra));
  const rows = [];
  for (let i = 0; i < (n || 8); i++) {
    const sym = src.symbols[Math.floor(rand() * src.symbols.length)];
    rows.push({
      t: "t-" + (extra > 0 ? "live" : (8 - i) + "m"),
      sym: sym,
      px: (40 + rand() * 460).toFixed(2),
      vol: Math.round(1000 + rand() * 90000).toLocaleString("en-US"),
    });
  }
  return rows;
}
on("GET /market-data/sources/{key}/preview", (p, q) => {
  const rows = previewRows(p.key, 0, q.limit ? parseInt(q.limit, 10) : 8);
  if (!rows) return notFound;
  return page(rows, {});
});

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
    /* Advances the shared session walk, so a fill printed by the order
     * endpoint and a quote printed here come from the same series. */
    const syms = (q.symbols ? String(q.symbols).split(",") : MKT.symbols()).map((x) => x.trim().toUpperCase());
    return setInterval(() => {
      S.tick += 1;
      settlePending(S.tick);
      syms.forEach((sym) => {
        const px = MKT.priceAt(sym, S.tick);
        if (px == null) return;
        sseSend(res, "quote.tick", S.tick, { symbol: sym, price: +px.toFixed(2), tick: S.tick });
      });
    }, 1000);
  },
  "GET /backtests/{id}/events": (req, res, p) => {
    /* Steps come from the shared engine keyed on the run id, so a client
     * that loses the stream and finishes the run locally walks through the
     * same percentages instead of inventing its own. The run is marked
     * completed server-side on the last frame, which is what makes it show
     * up in the results table after a reload. */
    const run = S.backtests.find((r) => r.id === p.id);
    const steps = BT.steps(p.id);
    let i = 0;
    if (run && run.status === "queued") run.status = "running";
    return setInterval(() => {
      if (i >= steps.length) return;
      const pct = steps[i++];
      if (run) run.progress = pct;
      if (pct >= 100) {
        if (run) {
          run.status = "completed";
          run.progress = 100;
        }
        sseSend(res, "backtest.completed", pct, { id: p.id, progress: 100, run: run ? btRow(run) : { id: p.id, progress: 100, status: "completed" } });
        res.end();
        return;
      }
      sseSend(res, "backtest.progress", pct, { id: p.id, progress: pct });
    }, 500);
  },
  "GET /dev/training-jobs/{id}/logs": (req, res, p) => {
    /* Log lines quote the same loss curve the progress frames report, so
     * the log and the meter tell one story rather than two. */
    const job = S.trainingJobs.find((x) => x.id === p.id);
    const name = job ? job.name : p.id;
    let n = 0;
    return setInterval(() => {
      n += 1;
      const pct = Math.min(100, n * 12);
      const m = DO.jobMetrics(name, pct);
      sseSend(res, "training.log", n, {
        id: p.id,
        line: "epoch " + n + "  loss " + m.loss.toFixed(3) + "  acc " + m.accuracy.toFixed(1) + "%",
      });
      if (n >= 8) res.end();
    }, 600);
  },
  "GET /dev/training-jobs/{id}/events": (req, res, p) => {
    /* Steps come from the shared engine keyed on the job name, so a client
     * that loses the stream and finishes locally walks the same sequence.
     * A paused job stops emitting rather than closing, so a resume picks
     * the stream back up where it left off. */
    const job = S.trainingJobs.find((x) => x.id === p.id);
    if (job && job.status === "queued") job.status = "running";
    const name = job ? job.name : p.id;
    const steps = DO.jobSteps(name);
    let i = 0;
    return setInterval(() => {
      if (!job || job.status === "paused" || i >= steps.length) return;
      const pct = steps[i++];
      job.progress = pct;
      const m = DO.jobMetrics(name, pct);
      if (pct >= 100) {
        job.status = "completed";
        devActivity(job.name + " finished at " + m.accuracy + "% accuracy", "Training · just now", "test");
        sseSend(res, "training.completed", pct, { id: p.id, progress: 100, accuracy: m.accuracy, loss: m.loss });
        res.end();
        return;
      }
      sseSend(res, "training.progress", pct, { id: p.id, progress: pct, accuracy: m.accuracy, loss: m.loss });
    }, 500);
  },
  "GET /market-data/sources/{key}/stream": (req, res, p) => {
    let n = 0;
    return setInterval(() => {
      n += 1;
      const rows = previewRows(p.key, n, 1);
      if (!rows) {
        res.end();
        return;
      }
      sseSend(res, "preview.row", n, rows[0]);
    }, 1000);
  },
  "GET /models/{slug}/jobs/{job_id}/events": (req, res, p) => {
    let pct = 0;
    return setInterval(() => {
      pct = Math.min(100, pct + 25);
      if (pct < 100) {
        sseSend(res, "run.progress", pct, { id: p.job_id, slug: p.slug, progress: pct });
        return;
      }
      const job = RUN_JOBS.get(p.job_id);
      sseSend(res, "run.completed", pct, { id: p.job_id, slug: p.slug, progress: 100, result: job ? job.result : null });
      res.end();
    }, 400);
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
    if (req.method === "POST" && IDEMPOTENT_ROUTES.has(matched)) {
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
    if (req.method === "POST" && req.headers["idempotency-key"]) {
      S.idempotency.set(req.headers["idempotency-key"], { status, body: payload });
    }
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
