# GeFi — Claude Code prompts queue (execution order)
_Every Claude Code prompt from gefi-prompt-pack.md, pulled onto its own queue in the order this
session executes them: (1) remaining BUILD-LEDGER surfaces, priority order; (2) UI-FOLLOWUP-LEDGER
200-series; (3) UI-FOLLOWUP-LEDGER 300-series. Decision tasks (233, 321) have no Code prompt and are
skipped. Each row ticks in tasks/BUILD-LEDGER.md or tasks/UI-FOLLOWUP-LEDGER.md as it completes._

## Queue 1 — remaining BUILD-LEDGER surfaces (24)

### [001] Surface 119 — Model Developer Console

```
Add a developer persona area to the /dashboard/ preview: a Developer section in the sidebar behind a persona toggle in the mock session, with listings, versions, and earnings panels of mock data following the existing table and KPI patterns. Jekyll-only.
```

### [002] Surface 123 — trust.gefi.io portal

```
Build the trust portal as a separate static surface in the repo (a trust/ directory with its own layout, reusing GeFi tokens), rendering certification status and subprocessors from data files, with the anchor ticker reading a JSON endpoint and degrading gracefully when it's absent.
```

### [003] Surface 94 — Fraud Graph (redesign)

```
Implement the redesign above in the gefi repo. Edit `_models/fraud-graph.md` and `_layouts/model.html` to add the force-directed graph preview and the live latency sparkline, following the same “Try it” / local-mock-fallback pattern used elsewhere in the catalogue. Rebuild with `JEKYLL_ENV=production bundle exec jekyll build` and confirm `/models/fraud-graph/` renders. Jekyll-only — see the Replit prompt for the backend side.
```

### [004] Surface 95 — Macro Nowcast (redesign)

```
Implement the redesign above in the gefi repo. Edit `_models/macro-nowcast.md` and `_layouts/model.html` to add the geography/indicator picker and live nowcast chart with a refresh countdown, using the local-mock fallback pattern from `tasks/01-enrich-ai-models-library.md`. Rebuild with `JEKYLL_ENV=production bundle exec jekyll build` and confirm `/models/macro-nowcast/` renders. Jekyll-only.
```

### [005] Surface 96 — Portfolio Optimiser (redesign)

```
Implement the redesign above in the gefi repo. Edit `_models/portfolio-optimiser.md` and `_layouts/model.html` to add the regime tabs and the simplified constraint builder with a live mock-allocation preview, following the local-mock fallback pattern. Rebuild with `JEKYLL_ENV=production bundle exec jekyll build` and confirm `/models/portfolio-optimiser/` renders. Jekyll-only.
```

### [006] Surface 99 — Homepage & navigation shell

```
Implement the redesign above directly in the gefi repo. Touch `index.html`, `_includes/hero.html`, `_includes/proof-bar.html`, `_includes/feature-grid.html`, `_includes/cta.html`, following the existing Liquid/vanilla-JS conventions — no bundler, no Tailwind, hand-rolled CSS in `assets/css/main.css`. Keep every CTA gated through `site.app.enabled` / `auth_ready` exactly as today, and rebuild with `JEKYLL_ENV=production bundle exec jekyll build` to confirm nothing regresses before committing.
```

### [007] Surface 101 — Pricing

```
Implement the redesign above directly in the gefi repo. Touch `pricing.md`, `_layouts/pricing.html`, `_includes/pricing-table.html`, `_includes/pricing-comparison.html`, `assets/js/pricing-toggle.js`, following the existing Liquid/vanilla-JS conventions — no bundler, no Tailwind, hand-rolled CSS in `assets/css/main.css`. Keep every CTA gated through `site.app.enabled` / `auth_ready` exactly as today, and rebuild with `JEKYLL_ENV=production bundle exec jekyll build` to confirm nothing regresses before committing.
```

### [008] Surface 103 — Security & vulnerability disclosure

```
Implement the redesign above directly in the gefi repo. Touch `security.md`, `security.txt`, following the existing Liquid/vanilla-JS conventions — no bundler, no Tailwind, hand-rolled CSS in `assets/css/main.css`. Keep every CTA gated through `site.app.enabled` / `auth_ready` exactly as today, and rebuild with `JEKYLL_ENV=production bundle exec jekyll build` to confirm nothing regresses before committing.
```

### [009] Surface 109 — Sign in / Sign up (prelaunch state)

```
Implement the redesign above directly in the gefi repo. Touch `login.md`, `register.md`, `_layouts/auth.html`, following the existing Liquid/vanilla-JS conventions — no bundler, no Tailwind, hand-rolled CSS in `assets/css/main.css`. Keep every CTA gated through `site.app.enabled` / `auth_ready` exactly as today, and rebuild with `JEKYLL_ENV=production bundle exec jekyll build` to confirm nothing regresses before committing.
```

### [010] Surface 110 — Admin sign-in

```
Implement the redesign above directly in the gefi repo. Touch `admin.md`, `_layouts/auth.html`, `assets/js/admin-gate.js`, following the existing Liquid/vanilla-JS conventions — no bundler, no Tailwind, hand-rolled CSS in `assets/css/main.css`. Keep every CTA gated through `site.app.enabled` / `auth_ready` exactly as today, and rebuild with `JEKYLL_ENV=production bundle exec jekyll build` to confirm nothing regresses before committing.
```

### [011] Surface 112 — Dashboard — Analytics, Compliance, Federation

```
Implement the redesign above directly in the gefi repo. Touch `dashboard.md`, `assets/js/dashboard.js`, following the existing Liquid/vanilla-JS conventions — no bundler, no Tailwind, hand-rolled CSS in `assets/css/main.css`. Keep every CTA gated through `site.app.enabled` / `auth_ready` exactly as today, and rebuild with `JEKYLL_ENV=production bundle exec jekyll build` to confirm nothing regresses before committing.
```

### [012] Surface 113 — Dashboard — admin tabs

```
Implement the redesign above directly in the gefi repo. Touch `dashboard.md`, `assets/js/dashboard.js`, following the existing Liquid/vanilla-JS conventions — no bundler, no Tailwind, hand-rolled CSS in `assets/css/main.css`. Keep every CTA gated through `site.app.enabled` / `auth_ready` exactly as today, and rebuild with `JEKYLL_ENV=production bundle exec jekyll build` to confirm nothing regresses before committing.
```

### [013] Surface 118 — Transactional email system

```
Create packages/shared-email in the monorepo with the base template, variant builders, and a local fixtures preview page rendering every variant; port the existing dunning builder onto the base. TypeScript with vitest snapshot tests asserting byte-stable output.
```

### [014] Surface 120 — Paper-Trading Sandbox

```
Add the Sandbox tab to /dashboard/ with mock simulated portfolios, reusing the chart primitives with a distinct dashed-border sandbox treatment. Jekyll-only.
```

### [015] Surface 121 — Public Model Leaderboard

```
Build /leaderboard/ as a Jekyll page rendering from a committed _data/leaderboard.json, with verified/self-attested badge styling and category tabs via the existing filter-chip pattern. Jekyll-only.
```

### [016] Surface 124 — Federated Participant Console

```
Add a Participant view to the /dashboard/ Federation tab behind the mock session's persona toggle: status card, attestation badge, and earnings table with mock data. Jekyll-only, existing patterns.
```

### [017] Surface 97 — Sentiment from Filings (redesign)

```
Implement the redesign above in the gefi repo. Edit `_models/sentiment-from-filings.md` and `_layouts/model.html` to add the sentiment-highlighted filing-excerpt reader, keeping the existing “where to be careful” section untouched. Rebuild with `JEKYLL_ENV=production bundle exec jekyll build` and confirm `/models/sentiment-from-filings/` renders. Jekyll-only.
```

### [018] Surface 98 — Trade Finance Doc AI (redesign)

```
Implement the redesign above in the gefi repo. Edit `_models/trade-finance-doc-ai.md` and `_layouts/model.html` to add the before/after document panel (sample excerpt → structured extraction + flagged discrepancy). Rebuild with `JEKYLL_ENV=production bundle exec jekyll build` and confirm `/models/trade-finance-doc-ai/` renders. Jekyll-only.
```

### [019] Surface 105 — Research hub

```
Implement the redesign above directly in the gefi repo. Touch `research.md`, `_includes/research-card.html`, `_research/*.md`, following the existing Liquid/vanilla-JS conventions — no bundler, no Tailwind, hand-rolled CSS in `assets/css/main.css`. Keep every CTA gated through `site.app.enabled` / `auth_ready` exactly as today, and rebuild with `JEKYLL_ENV=production bundle exec jekyll build` to confirm nothing regresses before committing.
```

### [020] Surface 106 — Blog

```
Implement the redesign above directly in the gefi repo. Touch `blog.md`, `_includes/blog-list.html`, `_posts/*.md`, `assets/js/reading-progress.js`, following the existing Liquid/vanilla-JS conventions — no bundler, no Tailwind, hand-rolled CSS in `assets/css/main.css`. Keep every CTA gated through `site.app.enabled` / `auth_ready` exactly as today, and rebuild with `JEKYLL_ENV=production bundle exec jekyll build` to confirm nothing regresses before committing.
```

### [021] Surface 107 — About & Partnerships

```
Implement the redesign above directly in the gefi repo. Touch `about.md`, `partnerships.md`, following the existing Liquid/vanilla-JS conventions — no bundler, no Tailwind, hand-rolled CSS in `assets/css/main.css`. Keep every CTA gated through `site.app.enabled` / `auth_ready` exactly as today, and rebuild with `JEKYLL_ENV=production bundle exec jekyll build` to confirm nothing regresses before committing.
```

### [022] Surface 108 — Contact & Demo request

```
Implement the redesign above directly in the gefi repo. Touch `contact.md`, `demo.md`, `_includes/demo-form.html`, following the existing Liquid/vanilla-JS conventions — no bundler, no Tailwind, hand-rolled CSS in `assets/css/main.css`. Keep every CTA gated through `site.app.enabled` / `auth_ready` exactly as today, and rebuild with `JEKYLL_ENV=production bundle exec jekyll build` to confirm nothing regresses before committing.
```

### [023] Surface 114 — 404 / error state

```
Implement the redesign above directly in the gefi repo. Touch `404.html`, following the existing Liquid/vanilla-JS conventions — no bundler, no Tailwind, hand-rolled CSS in `assets/css/main.css`. Keep every CTA gated through `site.app.enabled` / `auth_ready` exactly as today, and rebuild with `JEKYLL_ENV=production bundle exec jekyll build` to confirm nothing regresses before committing.
```

### [024] Surface 122 — Data-Feed Catalog

```
Build /data/ as a Jekyll catalog page from a committed data file, reusing the model-card and filter-chip patterns. Jekyll-only.
```

---

## Queue 2 — UI-FOLLOWUP-LEDGER 200-series

### [025] Task 200 — App shell

```
In the gefi Jekyll repo, build `_layouts/app.html` rendering: app topbar
include, persona tab nav include driven by `_data/app_nav.yml` (personas and
their tab lists from design-system-v2 §2; page front matter sets `persona:`
and `active_tab:`), `{{ content }}`, trust strip include, mega footer include
(footer copy verbatim from §1). Scope all styling under `.app-shell` with the
dark tokens as CSS variables in `assets/css/main.css`. Add a smoke page
`app/index.md` (`sitemap: false`) with placeholder content. No-JS must render
everything (nav is plain links). Verify: build passes; `_site/app/index.html`
shows topbar, 7 investor tabs with Overview active, trust strip, footer;
no console errors; marketing pages' light styling unchanged.
```

### [026] Task 201 — Canonical demo data module

```
Create `assets/js/app-demo-data.js` defining `GeFi.DEMO`: portfolio (value
142500, dayChange 2850, monthly 2.7 vs bench 1.8, ytd 24.3, cash 12750),
risk (sharpe 1.42, maxDrawdown −8.5, beta 0.89, alpha 2.1, vol 14.2,
var95 −7125), allocation [Stocks 45, Bonds 25, Real Estate 15, Commodities
10, Cash 5], holdings (NVDA/MSFT/AAPL/AMZN/GOOGL/BTC/ETH/TSLA with the §4
weights, TSLA −2.1% red), aiModels (3 active, +19.1%, $327/mo, 90.2%
accuracy, confidence 94.2), orders, fundingProjects, bounties, datasets +
provider revenue, complianceReports, riskReports, regulator (audits/issues),
learning content, activity feeds. Deterministic; derive any series via
`GeFi.seed`. Add formatters `GeFi.fmt.money/pct/date` enforcing thousands
separators and "Jan 15, 2026" dates, reusing existing `GeFi.fmt` where
present. Every later task reads ONLY from `GeFi.DEMO`. Verify build + a
console check that KPIs and lists derived from it agree.
```

### [027] Task 202 — App component library

```
Implement the sheet as reusable pieces: CSS classes under `.app-shell` in
`assets/css/main.css` (`app-kpi`, `app-segments`, `app-filterbar`,
`app-rowcard`, `app-gridcard`, `app-chip--*` for every vocabulary,
`app-meter` + `app-meter--bad`, `app-tile`, `app-empty`, `app-skeleton`,
`app-error`) and tiny JS helpers in `assets/js/app/components.js`
(segment switching with `aria-selected` + hash sync; chip factory; empty/
error-state factory). Build a gallery page `app/components.md` rendering all
of them from `GeFi.DEMO` samples — this page is the regression reference.
Verify: build passes; Playwright checks segment switching, focus rings,
aria attributes, no console errors; axe-style contrast spot-check on chips.
```

### [028] Task 203 — Investor Overview

```
Build `app/overview.md` (persona investor, tab Overview) implementing the
mock with `GeFi.DEMO`: hero band values, KPI row, area chart + donut via
`GeFi.svg` (dashed benchmark line; donut legend percentages sum to 100),
quick-action tiles linking to sibling app pages, activity feed from
`DEMO.activity`. Segments render as links to the sibling tab pages (204/205)
— only Overview's panel lives here. No-JS: static text fallbacks for chart
regions. Verify: build; Playwright — charts render, KPI count 4, activity
rows 4+, segment links resolve, console clean.
```

### [029] Task 204 — Holdings · Transactions · Watchlist

```
Build `app/holdings.md`, `app/transactions.md`, `app/watchlist.md` (persona
investor, tab Portfolio) sharing the hero band include; segment control
cross-links the trio + 203/205 pages. Holdings/watchlist row-cards and the
transactions table read `GeFi.DEMO.holdings/transactions/watchlist` (add the
latter two to DEMO in this task if missing, deterministic). Watchlist star
toggles persist to sessionStorage `gefi-app-watchlist`. Sparklines via
`GeFi.svg.sparkline`. Table degrades to plain HTML table without JS.
Verify: build; Playwright — TSLA row red with arrow icon + label, star
toggle persists across reload, table sortable if implemented else static,
console clean.
```

### [030] Task 205 — Analytics · Insights

```
Build `app/analytics.md` and `app/insights.md` (persona investor, tab
Portfolio, shared hero + segments). Stat lists and insight cards from
`GeFi.DEMO.risk` / `DEMO.insights` (add insights entries: Tech Sector
Outlook bullish 87%, Crypto Market Analysis neutral 72%, Portfolio
Concentration Risk cautious 91%, impacts High/Medium/High). "Set Alert"
stores to sessionStorage `gefi-app-alerts` and flips to "Alert set ✓".
Verify: build; Playwright — the two stat cards render 5+4 rows matching
DEMO exactly (assert Sharpe text "1.42"), sentiment chips carry text labels,
Set Alert persists, console clean.
```

### [031] Task 206 — Portfolio Performance

```
Build `app/performance.md` (persona portfolio, tab Performance) with all
four segments as client-side panels (hash-routed, `hidden` attr, no-JS shows
all four stacked). Charts from `GeFi.svg` (line, grouped bars with negative
support — extend `GeFi.svg.bars` if needed, donut) reading `GeFi.DEMO`.
Top Performers list = DEMO.holdings sorted by return. Risk panel = DEMO.risk
vs benchmarks with badge logic (better-than-benchmark → "Good"). Verify:
build; Playwright — all four panels switch, negative Feb/Jun bars render
below axis, donut legend sums 100, risk values match DEMO, console clean.
(If `GeFi.svg.bars` changes, re-run the model-page catalogue audit to prove
no regression on existing pages.)
```

### [032] Task 207 — AI Portfolio

```
Build `app/ai-portfolio.md` (persona portfolio, tab Portfolio). Split panel
from `GeFi.DEMO` (add `DEMO.aiPortfolio` with the two strategy rows summing
to portfolio value). "Rebalance with AI" links to `app/rebalance.md`;
"Download Report" generates a client-side text summary in a modal (sample-
labelled, no download link). Confidence gauge via `GeFi.svg.gauge`. Verify:
build; Playwright — strategy values sum to $142,500 (assert), gauge renders,
buttons navigate/open modal, console clean.
```

### [033] Task 208 — Portfolio AI Models

```
Build `app/portfolio-models.md` (persona portfolio, tab AI Models), three
hash-routed segments from `GeFi.DEMO.aiModels` + `DEMO.recommended` (add:
Crypto Sentiment Analyzer $129/mo ★4.8 91.5% 1,247 subs; ESG Impact Scorer
$199/mo ★4.6 88.9% 856). Pause/Resume flips state in sessionStorage
`gefi-app-portfolio-models` and swaps chip + button styling; Subscribe
shows a sample-labelled confirm then moves the card into Active. Settings
toggles persist. Link "Browse Models" to the marketplace page (213) and
model names to the real `/models/<slug>/` pages where a matching slug
exists in `GeFi.MODELS`. Verify: build; Playwright — pause→resume round-
trip persists reload, subscribe migrates card, chips always have text
labels, console clean.
```

### [034] Task 209 — Rebalancing & Actions

```
Build `app/rebalance.md` (persona portfolio, tab Rebalancing). Sliders are
real `<input type=range>` with live `<output>` readouts (reuse the harness
range pattern); target weights recompute drift, required actions, and totals
live from `GeFi.DEMO.allocation`; settings persist to sessionStorage
`gefi-app-rebalance`; Execute modal lists computed trades, confirming
updates "Last Rebalance" to today and zeroes drift (sample-labelled).
No-JS: static current values. Verify: build; Playwright — moving a slider
updates drift + action rows, ≠100% state shows amber and disables Execute,
confirm round-trip works, console clean.
```

### [035] Task 210 — Live Trading

```
Build `app/live-trading.md` (persona trader, tab Live Trading). Order form
validates client-side; submit appends to sessionStorage `gefi-app-orders`
(status "filled" via seeded mock fill after 400ms) and prepends to the
Orders table; Positions aggregates filled orders onto seeded starting
positions; price panel = deterministic seeded walk via `GeFi.seed`,
re-rendering every 2s while visible, chart via `GeFi.svg.line`. Safety
notice verbatim incl. "Real money is not at risk in this demonstration."
Verify: build; Playwright — place buy order → appears in Orders then
Positions, price ticks change the mono readout, one segmented level only,
console clean.
```

### [036] Task 211 — Order History + Activity

```
Build `app/order-history.md` (persona trader, tab Order History). Table
from `GeFi.DEMO.orders` (~24 seeded rows) merged with sessionStorage
`gefi-app-orders` from task 210; search + dropdowns + pills filter
client-side with live KPI recompute; pagination 10/page; empty state from
the component library; Export copies a CSV string to clipboard with a
sample-data toast. No-JS: first 10 rows static. Verify: build; Playwright —
search narrows rows + KPIs, each status chip has icon+label, pagination
works, empty state appears for nonsense search, console clean.
```

### [037] Task 212 — Backtesting Environment

```
Build `app/backtesting.md` (persona developer, tab Backtesting), six
hash-routed segments. Configure reads `GeFi.DEMO.backtests` + model
lifecycle rows; "Configure New Backtest" opens a form modal (model, preset
range) whose submit seeds a deterministic run: Live Monitor shows it
progressing (interval-driven bar to 100%), then Results gains the row with
seeded metrics. State in sessionStorage `gefi-app-backtests`. Optimizer/
Analysis/Comparison get component-library empty states with honest copy.
Verify: build; Playwright — full run lifecycle (create → monitor → result
row), presets fill dates, chips labelled, console clean.
```

### [038] Task 213 — AI Model Marketplace

```
Build `app/marketplace.md` (persona marketplace, tab AI Marketplace).
Cards come from the REAL `GeFi.MODELS` registry (92 models): map category,
risk, price, maturity; Details links to `/models/<slug>/`. For You is empty
until preferences exist in sessionStorage `gefi-app-prefs` (set via the
Preferences modal), then filters MODELS by chosen categories/risk; Trending
= seeded deterministic ranking; Browse All = full grid with the filter bar
live-filtering (reuse the models-filter predicate approach) + 12/page
pagination. Subscribe stores to `gefi-app-subs` and the card shows
"Subscribed ✓". Verify: build; Playwright — empty→set prefs→filled round
trip, filters narrow the grid with live counts, Details resolves to a real
model page, console clean.
```

### [039] Task 214 — Model Categories

```
Build `app/categories.md` (persona marketplace, tab Categories). Derive
categories AT BUILD TIME from the `_models` collection via Liquid
`group_by_exp` (category, count, min price) + enrich client-side from
`GeFi.MODELS` (avg risk mix). Subcategory chips from real model families.
KPIs computed from the same data so they cannot disagree. Sort + view
toggle client-side; "Browse Models" links to `/models/` filtered anchor or
marketplace Browse All with the category pre-selected via query param that
213's filter reads. Verify: build; Playwright — card count equals distinct
categories in the collection, KPI Total Models equals 92, sort by Models
reorders, list toggle works, console clean.
```

### [040] Task 215 — Developers directory

```
Build `app/developers.md` (persona marketplace, tab Developers) from
`GeFi.DEMO.developers` (6 seeded profiles; KPIs computed from the array).
Search filters name/handle/specialties; sort by rating/models/revenue.
"Top Models" rows link to real `/models/<slug>/` pages chosen from
`GeFi.MODELS`. "View Profile" opens a detail modal (bio, all stats, model
list) — no separate route needed. Verify: build; Playwright — KPI numbers
equal computed aggregates, search narrows, modal opens/closes with focus
trap, console clean.
```

### [041] Task 216 — Developer Console: Overview + My Models

```
Build `app/dev.md` (Overview) and `app/dev-models.md` (persona developer,
tab Overview, segments linking across the console pages 216–218's routes).
Data from `GeFi.DEMO.devConsole` (models, activity, funding). Create Model
opens a modal (name, category, template select) adding a Draft card to
sessionStorage `gefi-app-dev-models`; Export Data copies JSON to clipboard
with toast. Status dropdown filters the grid. KPI funding string must use
`GeFi.fmt.money`. Verify: build; Playwright — create-model adds a Draft
card that survives reload, filter by Testing shows only Testing, no bare
form elements outside cards anywhere on the page, console clean.
```

### [042] Task 217 — Developer Console: Training + Deployment + Monitoring

```
Build `app/dev-training.md`, `app/dev-deploy.md`, `app/dev-monitoring.md`
(persona developer, tab Overview, console segments). Training jobs from
`DEMO.devConsole.jobs`; New Training Job modal validates hyperparameters
(numeric ranges; method required) and enqueues a job that progresses
deterministically; Pause toggles running→paused. Deployment Start/Stop
flips status + zeroes/restores live fields; state in sessionStorage
`gefi-app-dev-ops`. Monitoring meters read per-model DISTINCT seeded values
(not the reference's copy-paste 95.2/0.2 for both); Error Rate uses
`app-meter--bad`; Refresh reseeds within tolerance; View Logs opens modal
with seeded log lines. Verify: build; Playwright — job lifecycle, deploy
start/stop round-trip, two models show different accuracy values, error
meter red, console clean.
```

### [043] Task 218 — Developer Console: Collaboration + Bounty Board

```
Build `app/dev-collab.md` (console segment) and `app/bounties.md` (persona
developer, tab Bounties). Collaboration from `DEMO.devConsole.team/messages`;
Invite opens modal (name, role) adding a row; Start Discussion appends a
message (sessionStorage `gefi-app-collab`). Bounties from `DEMO.bounties`;
filters live; Claim flips OPEN→CLAIMED (sessionStorage `gefi-app-bounties`)
and disables the button; submission counts pluralize correctly ("1
submission"). Verify: build; Playwright — invite + message round-trips,
claim persists reload, "1 submission" renders singular, dual chips both
labelled, console clean.
```

### [044] Task 219 — Learning Center

```
Build `app/learning.md` (persona learning, tab Learning) from
`DEMO.learning` (10 items + 3 paths). Segments and filters live-filter the
grid; KPIs computed from item states; Start/Continue advances a seeded
progress % stored in sessionStorage `gefi-app-learning`; completed items
get the check + download-certificate icon (toast: sample). Verify: build;
Playwright — segment Completed shows only completed, starting an item moves
it to In Progress and bumps the KPI, path card text contrast passes (assert
computed colors are light-on-dark), console clean.
```

### [045] Task 220 — Market Data

```
Build `app/market-data.md` (persona developer, tab Market Data) from
`DEMO.marketData` (six sources + seeded sample rows per source). Selecting
a card sets the preview source; Start Stream toggles a 1s-interval seeded
row appender with a green "Streaming" pill (Stop reverses); Coming Soon
cards unselectable with tooltip; Export Data copies visible rows as CSV
with sample toast. Verify: build; Playwright — select→preview updates,
stream adds rows then stops, Limited chip carries info icon + label,
console clean.
```

### [046] Task 221 — Data Provider Overview + Datasets

```
Build `app/data-provider.md` + `app/datasets.md` (persona data-provider,
tab Overview, shared segments). Data from `DEMO.datasets` (12 entries;
KPIs computed). Upload modal validates and adds a Processing dataset that
flips to Published after 2s (sessionStorage `gefi-app-datasets`); Archive
asks typed-confirm then grays the row. Activity feed from dataset events.
Verify: build; Playwright — KPIs equal computed aggregates, upload
round-trip Published, archive confirm flow, feed non-empty with designed
empty state reachable (clear-state button in a dev-only query param),
console clean.
```

### [047] Task 222 — Market Insights + Revenue

```
Build `app/data-insights.md` + `app/data-revenue.md` (provider segments).
All figures computed from `DEMO.datasets` so Overview/Revenue can never
disagree; revenue-by-dataset bars sorted desc with shares summing 100%;
line chart via `GeFi.svg.line` on seeded monthly series; Generate Report
composes a client-side summary modal (sample-labelled). Verify: build;
Playwright — Revenue KPI equals Overview KPI exactly (assert same string),
bars sum ≈100%, chart renders, console clean.
```

### [048] Task 223 — Funding Hub dashboard

```
Build `app/funding.md` (persona funding, tab Funding Hub). KPIs and summary
cards computed from `DEMO.fundingProjects` + `DEMO.bounties` aggregates
(single source, no contradictions); segment buttons route to 224/225 pages;
Recently Funded = completed projects from DEMO. Verify: build; Playwright —
KPI totals equal the sum over both linked pages' lists (assert), links
resolve, standard KPI anatomy used (class check), console clean.
```

### [049] Task 224 — Bot Funding + AI Model Funding

```
Build `app/bot-funding.md` + `app/model-funding.md` (persona funding).
Cards from `DEMO.fundingProjects` filtered by kind; KPIs computed from the
same arrays. Contribute opens amount modal (min enforced), updates raised/
progress/contributors in sessionStorage `gefi-app-funding`, flips to Funded
at goal with confetti-free state change; My Contributions segment lists the
user's contributions; Request Funding opens a form modal adding a SUBMITTED
request to My Requests. Verify: build; Playwright — contribute raises the
bar and persists, goal-reach flips chip to Funded and removes CTA, empty
state on nonsense search, KPIs match list aggregates, console clean.
```

### [050] Task 225 — Bounty Funding

```
Build `app/bounty-funding.md` (persona funding, tab Bounty Funding) from
`DEMO.bounties` (funding-side fields added in 201). Fund modal contributes
(sessionStorage `gefi-app-bounty-funding`); sort Newest/Ending/Most Funded;
eye icon opens detail modal; Request Funding form adds SUBMITTED row under
My Requests. Disabled Fund on COMPLETED carries aria-disabled + tooltip.
Verify: build; Playwright — fund round-trip, sort reorders, dual chips
labelled, disabled state not clickable, console clean.
```

### [051] Task 226 — Reports (merged page)

```
Build `app/reports.md` (persona reports, tab Reports) from `DEMO.reports`
(categorized report objects; single date format via `GeFi.fmt.date`).
Generate Report opens a modal (category, period) adding a pending row that
flips to generated after 1.5s (sessionStorage `gefi-app-reports`); eye
opens a sample summary modal; download copies text with sample toast.
Verify: build; Playwright — generate round-trip pending→generated, every
date matches /^[A-Z][a-z]{2} \d{1,2}, \d{4}$/, four panels dark with
accent borders (computed style check), console clean.
```

### [052] Task 227 — Compliance Reports + Risk Reports

```
Build `app/compliance-reports.md` + `app/risk-reports.md` (persona reports)
from `DEMO.complianceReports` / `DEMO.riskReports`; KPI strips computed
from the arrays (assert consistency by construction). Filters live; View
Details opens a detail modal (regulations, findings list, dates); Download
copies a summary; Export All copies all visible. Risk score bar color maps
severity (red/orange/amber/green). Verify: build; Playwright — KPIs equal
computed counts, filter by Violations shows 1 card, severity colors carry
text labels, modals focus-trap, console clean.
```

### [053] Task 228 — Custom Report Builder

```
Build `app/custom-reports.md` (persona reports, tab Custom Reports).
Builder validates required fields + ≥1 visualization; Create adds to
sessionStorage `gefi-app-custom-reports` and switches to My Reports with
the new row; Reset clears with confirm if dirty; delete typed-confirm;
Use Template prefills the builder. Verify: build; Playwright — invalid
submit shows inline errors and no row, valid submit round-trips to My
Reports and survives reload, template prefill works, console clean.
```

### [054] Task 229 — Regulator Overview

```
Build `app/regulator.md` (persona regulator, tab Overview) with four
hash-routed segments from `DEMO.regulator`. Quick actions open modals
(audit: entity + type; issue: severity + description; communication:
recipient + message) appending to the activity feed (sessionStorage
`gefi-app-regulator`); Export Dashboard copies a JSON summary. Analytics
bars computed from the same DEMO arrays as the KPIs. Verify: build;
Playwright — all four segments switch, quick-action round-trip lands in
Recent Activity, KPI/analytics consistency (flagged = feed count), banners
are dark surfaces (computed style), console clean.
```

### [055] Task 230 — Regulator sub-pages (the five 404 tabs)

```
Build `app/reg-model-audits.md`, `app/reg-dataset-audits.md`,
`app/reg-issues.md`, `app/reg-communications.md`, `app/reg-standards.md`
(persona regulator, matching active tabs) from `DEMO.regulator` (extend in
this task: audits with findings, issues with SLA timestamps relative to a
fixed seed date, threads with messages, standards with requirements).
Resolve moves an issue to Resolved and updates Overview's counts (shared
DEMO + sessionStorage `gefi-app-regulator`); composer appends to a thread;
accordion requirements. Entity IDs cross-link (#ML-3456 → model audit
row). Verify: build; Playwright — each tab renders real content (no
"Regulator Not Found" anywhere in the five pages), resolve round-trip,
thread compose, accordion toggles, console clean.
```

### [056] Task 231 — zKML Verification surface

```
Build `app/zkml.md` (persona developer, tab Overview) with a deterministic
mock pipeline: Run verification animates the stepper (seeded per-shard
durations, parallel bars), streams seeded log lines into the mono panel,
then renders the summary card (proof hash = FNV-1a of model+shards,
timings from the seed; "sample verification" label). State survives reload
via sessionStorage `gefi-app-zkml`. Add an entry link card on the dev
console Overview (216). Cross-link each federated model page's network
section? NO — model layout is off-limits; instead link from this page TO
federated model pages (list from `GeFi.MODELS` where federated). Verify:
build; Playwright — run completes all shards → aggregate → verified green,
log panel scrolled, hash stable across two runs with same inputs, links to
federated models resolve, console clean.
```

### [057] Task 232 — Consistency + accessibility sweep

```
Sweep all `app/` pages built above and enforce: one KPI anatomy (`app-kpi`
only), one segmented style, one date format via `GeFi.fmt.date`, thousands
separators via `GeFi.fmt.money`, no color-only status (every chip/meter
has label or icon — automated DOM audit), designed empty/error states on
every list (audit for bare panels), dark-consistent banners, truthful
active tabs (audit front matter vs page content), focus rings + aria on
segments/modals/tables (keyboard walk in Playwright), AA contrast
spot-checks on chips and muted text. Produce
`tasks/reports/ui-followup-audit.md` listing every violation found and
fixed. Verify: build; full-catalogue Playwright pass over all app pages —
zero console errors, zero audit violations remaining.
```

---

## Queue 3 — UI-FOLLOWUP-LEDGER 300-series

### [058] Task 300 — API contract pack

```
Create `api/openapi/_envelope.yaml` defining shared components: bearer +
API-key auth schemes, cursor pagination (`limit`/`cursor`/`next_cursor`),
the error object (`code`, `message`, `details[]`, `request_id`), idempotency
keys for mutating POSTs, `X-GeFi-Sample: true` header semantics for mock
responses, and SSE event framing conventions. Create skeleton
`api/openapi/<service>.yaml` files for: auth, portfolio, rebalance,
marketplace, models-runtime, trading, backtesting, devconsole, collab,
data-platform, funding, learning, reports, regulator, notifications,
insights, zkml, platform — each with info block, tag list, and the resource
list from design-system-v2 §7 (paths stubbed, schemas referenced). Add
`api/` and `backend/` to `_config.yml` exclude. Add `api/README.md`
explaining contract-first flow and the live-with-fallback rule. Verify:
every YAML parses (python3 yaml.safe_load loop); build passes; `_site`
contains no `api/` or `backend/`.
```

### [059] Task 301 — Mock API server

```
Build `backend/mock/server.js` (Node, no dependencies): loads
`assets/js/app-demo-data.js` via a GeFi shim, serves every contract in
`api/openapi/` on port 8788 with CORS for localhost, the shared envelope,
`X-GeFi-Sample: true` on every response, in-memory mutations (orders,
contributions, claims, resolves...) reset on restart, and SSE endpoints
(`/v1/stream/...`) emitting seeded ticks. Add `backend/mock/README.md` and
a route table generated from the contracts at startup (fail fast on a
contract path with no handler — coverage by construction). Smoke script
`backend/mock/smoke.sh` curls one endpoint per service and checks JSON
shape. Verify: smoke passes; build stays green; server start/stop leaves
no artifacts.
```

### [060] Task 302 — Client data layer

```
Create `assets/js/app/api.js`: `GeFi.api.get/post(path, opts)` using
`site.api.base_url` (default `http://localhost:8788` in dev via a meta
tag), 2s timeout, one retry, and deterministic fallback — on network
failure or non-2xx, resolve from a registered `GeFi.DEMO` resolver for
that path and mark the result `sample: true`; surface a subtle "sample
data" notice hook pages already render. Add `GeFi.api.stream(path,
onEvent)` wrapping EventSource with seeded local simulation fallback.
Migrate every existing `app/` page's reads/writes through it (reads keep
working identically when the API is down — assert byte-equal rendering in
fallback mode). Verify: build; Playwright twice — mock running (live badge,
mutations round-trip through the server) and mock stopped (fallback
rendering identical to pre-migration), console clean in both.
```

### [061] Task 303 — Auth & identity + auth screens

```
Fill `api/openapi/auth.yaml`: register, login, refresh, logout, me,
sessions list/revoke, profile update, persona field, org membership +
roles (investor/developer/data-provider/regulator/admin). Mock implements
with an in-memory user store (seeded demo user per persona; JWT-shaped
opaque tokens). Build `app/signin.md`, `app/signup.md`, `app/settings.md`
wired through `GeFi.api`; on login store the token (sessionStorage
`gefi-app-token`) and hydrate the top-bar avatar + persona nav; fallback
mode signs in as the seeded demo user. Verify: build; Playwright — login
round-trip changes avatar and persists reload, revoke session works
against mock, fallback sign-in works with mock stopped, console clean.
```

### [062] Task 304 — Portfolio & risk service

```
Fill `api/openapi/portfolio.yaml`: holdings, transactions, watchlist CRUD,
valuation summary, performance series (period param), returns vs
benchmark, allocation, risk metrics (sharpe/drawdown/beta/alpha/vol/var95)
— all shapes mirroring `GeFi.DEMO` §4 canonical figures. Mock serves them
from DEMO (series seeded). Register fallback resolvers in the data layer
and switch pages 203–207 to `GeFi.api`. Verify: build; Playwright live +
fallback — hero band and KPI figures identical in both modes (assert exact
strings, e.g. "$142,500"), watchlist star round-trips through the mock,
console clean.
```

### [063] Task 305 — Rebalancing engine

```
Fill `api/openapi/rebalance.yaml`: GET state (targets, current, drift,
settings), PUT targets/settings, POST proposal (returns computed trades),
POST execute (idempotency key; returns execution record + updated state).
Mock computes drift and proposals server-side from DEMO allocation (same
math as the client fallback — extract the calculation into a shared pure
function used by both, `assets/js/app/rebalance-math.js`, loaded by the
mock through the shim). Switch page 209 to the API with optimistic UI.
Verify: build; Playwright live + fallback — identical proposed trades for
identical slider positions in both modes (assert), execute round-trip
updates Last Rebalance, console clean.
```

### [064] Task 306 — Marketplace, subscriptions & recommendations

```
Fill `api/openapi/marketplace.yaml`: catalog list with filters (category,
risk, price, search, sort, pagination), categories with real counts,
developers directory, ratings summary, preferences get/put,
recommendations (derived from preferences), trending (seeded ranking),
subscriptions CRUD with a billing stub (plan, monthly fee, next renewal —
no real payments; document the gap for a future billing provider).
Mock derives the catalog from `GeFi.MODELS` via the shim. Switch pages
208/213/214/215 to the API. Verify: build; Playwright live + fallback —
subscribe persists across reload in live mode (server state), filters
return identical result sets in both modes, category counts equal 92
total, console clean.
```

### [065] Task 307 — Model runtime & inference

```
Fill `api/openapi/models-runtime.yaml` to match the EXISTING harness
contract exactly (`POST /v1/models/{slug}/run` — the request/response
shape `assets/js/model-demo.js` already sends/expects, per demo output
kinds score/curve/table/text/waterfall), plus GET model metadata/metrics
(`metrics_as_of` refresh) and an async job variant (POST run → job id,
GET job, SSE progress) for long runs. Mock implements run for all 92
slugs by reusing the client's seeded-mock scoring logic through the shim
(extract it into a shared pure module first, keeping model-demo.js
behavior byte-identical — this file may be edited only for the
extraction, no behavior change; `_layouts/model.html` stays untouched).
Model pages then hydrate live automatically via their existing endpoint
config. Verify: build; catalogue audit still 92/92; Playwright on 3
model pages (score, waterfall, curve) live + fallback — identical outputs
for identical inputs (assert), sample labelling correct in both, console
clean.
```

### [066] Task 308 — Trading & market-data streaming

```
Fill `api/openapi/trading.yaml`: quotes (single + SSE stream), order
place/cancel (idempotent), order list with filters + pagination,
positions, paper-fill engine semantics (market fills at seeded price,
limit fills when crossed), bots/strategies list (read-only seeded), and
`api/openapi/data-platform.yaml`'s market-data source catalog + preview
rows + preview stream. Mock runs a seeded price walk per symbol (same
generator as the client fallback via the shared shim). Switch pages
210/211/220 to the API. Verify: build; Playwright live — place order,
watch fill arrive via SSE, position updates, order appears in 211's table
after reload (server state); fallback — full flow still works locally;
console clean in both.
```

### [067] Task 309 — Backtesting service

```
Fill `api/openapi/backtesting.yaml`: create backtest (model, range,
preset), list runs, get run (metrics: sharpe, annual return, drawdown,
trades), SSE progress, compare (n run ids), optimizer job (param grid →
best set, seeded). Mock executes runs as seeded timed simulations
(progress events over ~5s). Switch page 212; Results/Comparison segments
gain live content in both modes. Verify: build; Playwright live — create
run, progress bar driven by SSE to 100%, result row matches GET run;
fallback — local simulation produces the same metrics for the same
inputs (assert); console clean.
```

### [068] Task 310 — Developer console ops

```
Fill `api/openapi/devconsole.yaml`: models CRUD (lifecycle
draft/testing/approved/deployed), training jobs (create with validated
hyperparameters, list, pause/resume, SSE progress, GET logs), deployments
(create per env, start/stop, GET ops metrics: uptime/requests/latency/
error-rate series), alert rules CRUD, activity feed. Mock seeds per-model
DISTINCT telemetry and streams training progress. Switch pages 216/217.
Verify: build; Playwright live — create model → draft card from server,
training job lifecycle via SSE, deployment stop zeroes live fields on
next poll; fallback parity; monitoring meters show different values per
model (assert inequality); console clean.
```

### [069] Task 311 — Collaboration & bounty services

```
Fill `api/openapi/collab.yaml`: teams, members, invites (create/accept
stub), discussion threads + messages; bounties list with filters, claim
(one active claim per user), submissions (create, list, review status),
completion + reward record. Mock enforces claim rules and pluralization-
ready counts. Switch pages 218 (both frames) and the bounty read-paths of
225. Verify: build; Playwright live — invite appears in members, message
posts and persists reload, claim flips OPEN→CLAIMED server-side and a
second claim attempt is rejected with the envelope error rendered as a
toast; fallback parity; console clean.
```

### [070] Task 312 — Data platform

```
Extend `api/openapi/data-platform.yaml`: dataset registry CRUD, upload
intent → processing → published state machine (mock advances after 2s),
quality scoring (seeded per dataset), dataset subscriptions, revenue
accounting (per-dataset revenue, downloads, payout schedule — aggregates
MUST derive from line items so Overview and Revenue tabs cannot
disagree), provider activity feed. Switch pages 221/222. Verify: build;
Playwright live — upload round-trip reaches published, archive typed-
confirm deletes server-side, Revenue tab totals equal Overview KPI
(assert same string) in both modes; console clean.
```

### [071] Task 313 — Funding services

```
Fill `api/openapi/funding.yaml`: projects (kind bot/model/bounty) with
filters, contribute (min enforced, idempotent, updates raised/backers;
goal-reach flips status to funded), my contributions, funding requests
(create → SUBMITTED, approval transition stub), payouts + ROI records
(read-only seeded). All hub aggregates computed from project line items.
Switch pages 223/224/225. Verify: build; Playwright live — contribute
raises the bar server-side and survives reload, over-goal contribution
rejected with envelope error, hub KPIs equal the sum over both lists
(assert) in both modes; console clean.
```

### [072] Task 314 — Learning service

```
Fill `api/openapi/learning.yaml`: content catalog with filters, paths,
enrollment, progress put (0–100), certificate issue on completion
(record with id + issued date). Mock persists per-user progress in
memory. Switch page 219; KPIs computed from server state in live mode.
Verify: build; Playwright live — start item, progress persists reload,
completing issues a certificate that appears in the KPI; fallback
parity; console clean.
```

### [073] Task 315 — Reports & compliance engine

```
Fill `api/openapi/reports.yaml`: report catalog by category, generate
(async: pending → generated via SSE or poll), custom report definitions
CRUD + templates, schedules, compliance reports + risk reports lists
(KPI strips derived from the same arrays), report content GET (sample
narrative). Switch pages 226/227/228. Verify: build; Playwright live —
generate flips pending→generated from server events, custom report
definition persists reload, compliance KPIs equal computed counts in
both modes, single date format everywhere; console clean.
```

### [074] Task 316 — Regulator portal services

```
Fill `api/openapi/regulator.yaml`: audits (model/dataset) with findings
+ workflow states, issues with SLA clocks (server computes due state
from a fixed seed epoch), resolve transition, communications threads +
messages, standards registry + requirements, overview aggregates (all
derived), activity feed, entity cross-links (#MT/#DS/#ML/#CS resolve to
their records). Switch pages 229/230. Verify: build; Playwright live —
resolve updates Overview counts server-side, composer posts persist,
deep entity links resolve (no "Regulator Not Found" on valid ids, the
designed error state on invalid ones); fallback parity; console clean.
```

### [075] Task 317 — Notifications & alerts

```
Fill `api/openapi/notifications.yaml`: notifications list + unread count,
mark-read, alert rules CRUD (entity, condition, channel), SSE stream for
new notifications, delivery preferences (in-app/email/push — email/push
as recorded stubs). Mock emits a seeded notification on relevant
mutations (order filled, training complete, issue resolved). Wire the
app-shell bell (badge + dropdown list) through the data layer on all app
pages; wire 205's Set Alert to rules. Keep the existing marketing-site
dashboard alert center untouched; note parity in the task row. Verify:
build; Playwright live — placing an order pops the bell badge via SSE,
mark-read clears it, rule round-trips; fallback — bell renders seeded
state; console clean.
```

### [076] Task 318 — AI insights service

```
Fill `api/openapi/insights.yaml`: insights list per surface (portfolio,
market, regulator, provider) with sentiment, confidence, impact; insight
detail; generate-report narrative endpoint. Mock returns deterministic
seeded insights; include an OPTIONAL live generator behind
`GEFI_INSIGHTS_CLAUDE=1` env var calling the Claude API (model
claude-sonnet-5, temperature 0, strict JSON schema output, prompt
template in `backend/mock/prompts/insights.txt`) — clearly labelled
AI-generated, falling back to seeded output on any error; no key in the
repo. Switch the insight panels to the API. Verify: build; Playwright
live + fallback — identical seeded insights in both when the env var is
unset; schema-validate the generator path with the var set only if a key
is present in the environment, else skip and note; console clean.
```

### [077] Task 319 — zKML proof pipeline

```
Fill `api/openapi/zkml.yaml` from the pipeline in the reference deck:
create verification (model, shard count) → job with stages (compile →
shard → prove per shard → aggregate → verify), SSE stage/progress/log
events, proof record (hash, shard count, wall-clock + task time,
verified flag), verification history per model. Mock simulates timing
deterministically (seeded per model+shards; hash = FNV-1a as in the
client). Switch page 231; history list gains server persistence in live
mode. Verify: build; Playwright live — run streams stage events to the
stepper and log panel, summary matches GET proof record, same inputs →
same hash across runs (assert); fallback parity; console clean.
```

### [078] Task 320 — Platform cross-cutting

```
Fill `api/openapi/platform.yaml`: API keys (create → one-time reveal,
list, revoke with typed-confirm semantics), rate-limit headers on every
mock response (X-RateLimit-*), audit hash-chain endpoints matching what
the trust-center verifier expects (GET run record by run_id, GET chain
segment) served from seeded records, global search (models, datasets,
docs, orders — grouped results for the top-bar search), i18n string
bundles (en + one stub locale) with a `data-i18n` client hook, GDPR
endpoints (export my data, delete my data — recorded stubs with status).
Wire the app-shell top-bar search to grouped results; keep marketing-site
surfaces untouched. Verify: build; Playwright — search returns grouped
live results and seeded fallback, key create/reveal/revoke round-trip,
verifier finds a seeded run_id via the API, console clean in both modes.
```
