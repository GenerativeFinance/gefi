# UI FOLLOW-UP LEDGER — platform app surfaces (200-series)

Source: 56 reference screenshots (PDFs) of the GeFi platform UI reviewed on
2026-08-21, plus the zKML hackathon deck. These are the UIs started before this
repo's rebuild. Each task pairs a **Claude Design prompt** (the visual) with a
**Claude Code prompt** (wiring it into this Jekyll repo as a working preview
with seeded data). Companion document: `tasks/design-system-v2.md` — its §1
master prefix MUST be prepended to every Design prompt below, and its §4
canonical dataset and §5 improvements are binding on every task.

## Standing conventions (apply to every task; keep prompts short)

- **Where pages live:** app preview pages under `app/` (URLs `/app/...`),
  front matter `sitemap: false`, layout `app`.
- **Shell (built in task 200):** `_layouts/app.html`; includes
  `_includes/app-topbar.html`, `app-tabs.html`, `app-trust.html`,
  `app-footer.html`; persona nav sets in `_data/app_nav.yml` (page picks
  persona + active tab via front matter).
- **Data:** one seeded source of truth `GeFi.DEMO` in
  `assets/js/app-demo-data.js` (canonical dataset from design-system-v2 §4;
  deterministic, using the existing `GeFi.seed` PRNG). Per-surface behavior in
  `assets/js/app/<surface>.js`. Client state in sessionStorage keys prefixed
  `gefi-app-*`. No real backend: interactions mutate in-memory/sessionStorage
  state and re-render, clearly labelled as sample data.
- **Styling:** extend `assets/css/main.css` with a dark app section scoped
  under `.app-shell` (tokens from design-system-v2 §1) so the light
  marketing site is untouched. Charts reuse `GeFi.svg` primitives, restyled
  via CSS variables where needed.
- **Rules (same as BUILD-LEDGER):** build must pass before every commit
  (`JEKYLL_ENV=production bundle exec ruby "$JEKYLL_BIN" build`); verify the
  page in a browser (Playwright, `/opt/pw-browsers` chromium) — no console
  errors, interactive elements work, no-JS fallback text present; never touch
  `_layouts/model.html` or `infrastructure/cloudflare/`; tick the row in the
  same commit; after two failed attempts mark `BLOCKED: <reason>` and stop;
  commit messages name the task number.
- **Design→Code order:** Design prompt produces the mock; Code prompt
  implements it in this stack. When executing without a fresh mock, implement
  from the prompt text + reference notes directly.

## Checklist

### Foundation
- [ ] 200 — App shell: layout, topbar, persona tab nav, trust strip, mega footer
- [ ] 201 — Canonical demo data module (`GeFi.DEMO`)
- [ ] 202 — App component library: KPI card, segments, cards, chips, states

### Investor wing
- [ ] 203 — Investor Overview (chart dashboard, quick actions, activity)
- [ ] 204 — Holdings · Transactions · Watchlist tabs
- [ ] 205 — Analytics · Insights tabs
- [ ] 206 — Portfolio Performance (Overview/Returns/Allocation/Risk Analysis)
- [ ] 207 — AI Portfolio (split panel)
- [ ] 208 — Portfolio AI Models (Active/Recommended/Settings)
- [ ] 209 — Rebalancing & Actions

### Trading wing
- [ ] 210 — Live Trading
- [ ] 211 — Order History + Activity feed
- [ ] 212 — Backtesting Environment

### Marketplace & developer wing
- [ ] 213 — AI Model Marketplace (For You/Trending/Browse All)
- [ ] 214 — Model Categories (wired to the real 92-model taxonomy)
- [ ] 215 — Developers directory
- [ ] 216 — Developer Console: Overview + My Models
- [ ] 217 — Developer Console: Training + Deployment + Monitoring
- [ ] 218 — Developer Console: Collaboration + Bounty Board
- [ ] 219 — Learning Center
- [ ] 220 — Market Data

### Data-provider wing
- [ ] 221 — Data Provider Overview + Datasets
- [ ] 222 — Market Insights + Revenue tabs

### Funding wing
- [ ] 223 — Funding Hub dashboard
- [ ] 224 — Bot Funding + AI Model Funding
- [ ] 225 — Bounty Funding

### Reports & compliance wing
- [ ] 226 — Reports (merge the two competing Reports pages)
- [ ] 227 — Compliance Reports + Risk Reports
- [ ] 228 — Custom Report Builder
- [ ] 229 — Regulator Overview (4 segments)
- [ ] 230 — Regulator sub-pages (the five 404 tabs)
- [ ] 231 — zKML Verification surface

### Cross-cutting
- [ ] 232 — Consistency + accessibility sweep
- [ ] 233 — Decision task: unify marketing site on the dark system?

---

## Task 200 — App shell
Refs: every PDF; chrome fully visible in `portfolio.pdf`, `aimodels.pdf`.

**Design prompt** (append after §1 prefix):
> Design the GeFi app shell itself as a reference frame: top bar, persona tab
> nav (show the Investor set: Overview · Portfolio · AI Marketplace · Trading ·
> Reports · Funding · Learning, with Overview active), an empty content region
> with a placeholder page header ("Investor Overview" / "Your comprehensive
> investment dashboard with enhanced analytics", one indigo primary "Settings"),
> the trust badge strip, and the full mega footer exactly as specified. Show
> hover and active states for tabs and the bell's unread dot. Desktop 1280px
> and a mobile variant where the tab nav becomes horizontally scrollable.

**Code prompt:**
> In the gefi Jekyll repo, build `_layouts/app.html` rendering: app topbar
> include, persona tab nav include driven by `_data/app_nav.yml` (personas and
> their tab lists from design-system-v2 §2; page front matter sets `persona:`
> and `active_tab:`), `{{ content }}`, trust strip include, mega footer include
> (footer copy verbatim from §1). Scope all styling under `.app-shell` with the
> dark tokens as CSS variables in `assets/css/main.css`. Add a smoke page
> `app/index.md` (`sitemap: false`) with placeholder content. No-JS must render
> everything (nav is plain links). Verify: build passes; `_site/app/index.html`
> shows topbar, 7 investor tabs with Overview active, trust strip, footer;
> no console errors; marketing pages' light styling unchanged.

## Task 201 — Canonical demo data module
Refs: contradictions listed in design-system-v2 §4.

**Design prompt:** n/a (data-only task).

**Code prompt:**
> Create `assets/js/app-demo-data.js` defining `GeFi.DEMO`: portfolio (value
> 142500, dayChange 2850, monthly 2.7 vs bench 1.8, ytd 24.3, cash 12750),
> risk (sharpe 1.42, maxDrawdown −8.5, beta 0.89, alpha 2.1, vol 14.2,
> var95 −7125), allocation [Stocks 45, Bonds 25, Real Estate 15, Commodities
> 10, Cash 5], holdings (NVDA/MSFT/AAPL/AMZN/GOOGL/BTC/ETH/TSLA with the §4
> weights, TSLA −2.1% red), aiModels (3 active, +19.1%, $327/mo, 90.2%
> accuracy, confidence 94.2), orders, fundingProjects, bounties, datasets +
> provider revenue, complianceReports, riskReports, regulator (audits/issues),
> learning content, activity feeds. Deterministic; derive any series via
> `GeFi.seed`. Add formatters `GeFi.fmt.money/pct/date` enforcing thousands
> separators and "Jan 15, 2026" dates, reusing existing `GeFi.fmt` where
> present. Every later task reads ONLY from `GeFi.DEMO`. Verify build + a
> console check that KPIs and lists derived from it agree.

## Task 202 — App component library
Refs: component grammar in design-system-v2 §1; all PDFs.

**Design prompt:**
> Design a single component sheet on the dark canvas showing, each labelled:
> the KPI stat card (one anatomy: muted label, big mono value, colored
> sub-line, colored icon top-right) in 4-up row; the full-width pill segmented
> control (one active); a filter bar card (search + two "All X" dropdowns +
> sort + grid/list toggle); a row-card with status chip, metric columns,
> allocation bar, right action rail; a 3-col grid card with dual corner chips,
> mini-stat trio, tag chips, twin footer buttons; every chip vocabulary
> (status, severity, difficulty, lifecycle, data availability) with labels;
> progress bars incl. a red bad-is-high meter; a quick-action dashed tile; and
> the three states: empty (icon/headline/hint/CTA), skeleton loading, error
> with "Go Back". Include focus-ring states.

**Code prompt:**
> Implement the sheet as reusable pieces: CSS classes under `.app-shell` in
> `assets/css/main.css` (`app-kpi`, `app-segments`, `app-filterbar`,
> `app-rowcard`, `app-gridcard`, `app-chip--*` for every vocabulary,
> `app-meter` + `app-meter--bad`, `app-tile`, `app-empty`, `app-skeleton`,
> `app-error`) and tiny JS helpers in `assets/js/app/components.js`
> (segment switching with `aria-selected` + hash sync; chip factory; empty/
> error-state factory). Build a gallery page `app/components.md` rendering all
> of them from `GeFi.DEMO` samples — this page is the regression reference.
> Verify: build passes; Playwright checks segment switching, focus rings,
> aria attributes, no console errors; axe-style contrast spot-check on chips.

## Task 203 — Investor Overview
Refs: `profile.pdf` (richest page), `AImodels_copy.pdf` band.

**Design prompt:**
> Design "Investor Overview" (Investor persona, Overview tab): header with
> Settings ghost + "Last updated" pill; hero Portfolio Overview band with
> Export — $142,500 (+$2,850 / +2.04% green), +2.7% monthly (vs +1.8%
> benchmark), +24.3% YTD (blue), $12,750 cash, right rail "View Details"
> (indigo) + "Performance"; the 7-segment control (Overview active); KPI row:
> 8 Active AI Models (+2), 3 Trading Bots (+1), 6.2/10 Risk Score (−0.3,
> orange shield), 2 Alerts (red); chart row: "Portfolio Performance" green
> area chart vs dashed benchmark with legend + "Asset Allocation" donut with
> dot-swatch legend; "Quick Actions" 4 dashed tiles (View Portfolio, Browse
> AI Models, Risk Assessment, Generate Reports — dark surfaces, colored icons,
> not pastel tints); "Recent Activity" feed with right-aligned colored values.

**Code prompt:**
> Build `app/overview.md` (persona investor, tab Overview) implementing the
> mock with `GeFi.DEMO`: hero band values, KPI row, area chart + donut via
> `GeFi.svg` (dashed benchmark line; donut legend percentages sum to 100),
> quick-action tiles linking to sibling app pages, activity feed from
> `DEMO.activity`. Segments render as links to the sibling tab pages (204/205)
> — only Overview's panel lives here. No-JS: static text fallbacks for chart
> regions. Verify: build; Playwright — charts render, KPI count 4, activity
> rows 4+, segment links resolve, console clean.

## Task 204 — Holdings · Transactions · Watchlist
Refs: `holdings.pdf`; transactions/watchlist unbuilt in refs (design from grammar).

**Design prompt:**
> Design the Investor Overview page with the 7-segment control on Holdings,
> then Transactions, then Watchlist (three frames, same hero band). Holdings:
> "Top Holdings" row-cards — ticker chip, company, "% of portfolio", right
> value + green/red change (TSLA −2.1% red with down arrow). Transactions
> (new, follow the grammar): filter bar + data table Date · Type chip
> (buy green/sell red) · Asset · Quantity · Price · Value · Status chip.
> Watchlist (new): row-cards with ticker, price, sparkline, signed day change,
> star toggle, "Add to watchlist" empty-state variant. Active segment must
> match content; nav tab stays Overview only if that is truthful — here set
> the Portfolio tab active instead.

**Code prompt:**
> Build `app/holdings.md`, `app/transactions.md`, `app/watchlist.md` (persona
> investor, tab Portfolio) sharing the hero band include; segment control
> cross-links the trio + 203/205 pages. Holdings/watchlist row-cards and the
> transactions table read `GeFi.DEMO.holdings/transactions/watchlist` (add the
> latter two to DEMO in this task if missing, deterministic). Watchlist star
> toggles persist to sessionStorage `gefi-app-watchlist`. Sparklines via
> `GeFi.svg.sparkline`. Table degrades to plain HTML table without JS.
> Verify: build; Playwright — TSLA row red with arrow icon + label, star
> toggle persists across reload, table sortable if implemented else static,
> console clean.

## Task 205 — Analytics · Insights
Refs: `analytics.pdf` (investor), `insights.pdf` (c1d78ec3 investor variant).

**Design prompt:**
> Two frames of Investor Overview (hero band, Portfolio tab active).
> Analytics segment: 2-col key-value stat cards — "Performance Analysis"
> (Sharpe 1.42, Max Drawdown −8.5% red, Beta 0.89, Alpha +2.1% green,
> Volatility 14.2%) and "Risk Metrics" (VaR 95% −$7,125, Concentration Risk
> "Medium" amber chip, Sector Diversification "7 sectors", Geographic
> Exposure "4 regions"). Insights segment: "AI-Driven Market Insights"
> row-cards — title, body, sentiment chip (Bullish indigo / Neutral gray /
> Cautious red), "87% confident" pill, "Impact: High/Medium" colored label
> with icon, "Set Alert" ghost + "Learn More" indigo. All values from the
> canonical dataset — note these previously contradicted the Performance page.

**Code prompt:**
> Build `app/analytics.md` and `app/insights.md` (persona investor, tab
> Portfolio, shared hero + segments). Stat lists and insight cards from
> `GeFi.DEMO.risk` / `DEMO.insights` (add insights entries: Tech Sector
> Outlook bullish 87%, Crypto Market Analysis neutral 72%, Portfolio
> Concentration Risk cautious 91%, impacts High/Medium/High). "Set Alert"
> stores to sessionStorage `gefi-app-alerts` and flips to "Alert set ✓".
> Verify: build; Playwright — the two stat cards render 5+4 rows matching
> DEMO exactly (assert Sharpe text "1.42"), sentiment chips carry text labels,
> Set Alert persists, console clean.

## Task 206 — Portfolio Performance
Refs: `performance.pdf`, `returns.pdf`, `allocation.pdf`, `riskanalysis.pdf`.

**Design prompt:**
> Design "Portfolio Performance" (Portfolio-suite persona: Overview ·
> Portfolio · AI Models · Rebalancing · Performance; Performance active):
> header "Track your investment returns and risk metrics", ghost Refresh +
> indigo Export Report; KPI row: $142,500 (+24.3% YTD), +2.7% monthly (vs
> +1.8%), Sharpe 1.42 (vs 1.18), Max Drawdown −8.5% ("Better than −12.3%");
> segmented Overview | Returns | Allocation | Risk Analysis — four frames:
> (1) Overview: "Portfolio Value Over Time" indigo line chart with 1Y range
> dropdown ⅔ + "Asset Allocation" donut ⅓; (2) Returns: "Monthly Returns vs
> Benchmark" grouped bars (indigo vs green, negatives below axis) + "Top
> Performers" list (NVDA +24.80% · 8.5% allocation …); (3) Allocation: five
> color-coded horizontal allocation bars; (4) Risk Analysis: five benchmark
> row-cards with "Good"/"Neutral" badges. One consistent dataset across all
> four.

**Code prompt:**
> Build `app/performance.md` (persona portfolio, tab Performance) with all
> four segments as client-side panels (hash-routed, `hidden` attr, no-JS shows
> all four stacked). Charts from `GeFi.svg` (line, grouped bars with negative
> support — extend `GeFi.svg.bars` if needed, donut) reading `GeFi.DEMO`.
> Top Performers list = DEMO.holdings sorted by return. Risk panel = DEMO.risk
> vs benchmarks with badge logic (better-than-benchmark → "Good"). Verify:
> build; Playwright — all four panels switch, negative Feb/Jun bars render
> below axis, donut legend sums 100, risk values match DEMO, console clean.
> (If `GeFi.svg.bars` changes, re-run the model-page catalogue audit to prove
> no regression on existing pages.)

## Task 207 — AI Portfolio
Refs: `aiportfolio.pdf`.

**Design prompt:**
> Design "AI Portfolio" (Portfolio-suite persona, Portfolio tab): 2-col split.
> Left: "Portfolio Overview" card — Total Investment $142,500, Live P&L
> +$2,850 green, Annual Returns 24.3%, Sharpe 1.42, footer "Performance vs
> Market +5.2% better"; below it "Risk Distribution" card — indigo bars
> Stocks 60 / Bonds 30 / Crypto 10 with "Risk Level: Moderate" amber chip.
> Right: tall "AI Models" card — model rows with chevrons (Conservative AI
> $85,500 +12.4%; Aggressive Growth $57,000 +24.8% — must sum to the total),
> stacked full-width buttons: indigo "Rebalance with AI", ghost "Manual
> Override", ghost "Download Report"; centered "AI Confidence Score 94.2%"
> large green with a thin gauge arc. Use the canonical $142,500 — the
> reference's $247,580 contradicted every other page.

**Code prompt:**
> Build `app/ai-portfolio.md` (persona portfolio, tab Portfolio). Split panel
> from `GeFi.DEMO` (add `DEMO.aiPortfolio` with the two strategy rows summing
> to portfolio value). "Rebalance with AI" links to `app/rebalance.md`;
> "Download Report" generates a client-side text summary in a modal (sample-
> labelled, no download link). Confidence gauge via `GeFi.svg.gauge`. Verify:
> build; Playwright — strategy values sum to $142,500 (assert), gauge renders,
> buttons navigate/open modal, console clean.

## Task 208 — Portfolio AI Models
Refs: `aimodels.pdf`, `recommended.pdf`.

**Design prompt:**
> Design "Portfolio AI Models" (Portfolio-suite persona, AI Models tab):
> header + indigo "Browse Models"; KPI row Active Models 3 · Total Performance
> +19.1% · Monthly Fees $327 · Avg Accuracy 90.2%; full-width pill segments
> Active Models | Recommended | Settings (NOT small pills — one segmented
> style). Active: full-width row-cards — icon, name + subcategory, green
> "active"/amber "paused" chip, "Updated 2h ago", Portfolio Allocation bar
> + %, columns Performance / Total Trades / Accuracy / P&L, right rail
> Monthly Fee + stacked outline buttons Pause · Configure · Analytics (filled
> indigo Resume when paused). Recommended: 2-up marketplace cards — bot icon,
> name/category, price pill, description, 2x2 stats (Rating ★ / Accuracy /
> Subscribers / Category), tag chips, indigo Subscribe + ghost Details.
> Settings: toggle rows (auto-pause on drawdown, fee cap slider, alerts).

**Code prompt:**
> Build `app/portfolio-models.md` (persona portfolio, tab AI Models), three
> hash-routed segments from `GeFi.DEMO.aiModels` + `DEMO.recommended` (add:
> Crypto Sentiment Analyzer $129/mo ★4.8 91.5% 1,247 subs; ESG Impact Scorer
> $199/mo ★4.6 88.9% 856). Pause/Resume flips state in sessionStorage
> `gefi-app-portfolio-models` and swaps chip + button styling; Subscribe
> shows a sample-labelled confirm then moves the card into Active. Settings
> toggles persist. Link "Browse Models" to the marketplace page (213) and
> model names to the real `/models/<slug>/` pages where a matching slug
> exists in `GeFi.MODELS`. Verify: build; Playwright — pause→resume round-
> trip persists reload, subscribe migrates card, chips always have text
> labels, console clean.

## Task 209 — Rebalancing & Actions
Refs: `rebalance.pdf`.

**Design prompt:**
> Design "Portfolio Rebalancing & Actions" (Portfolio-suite persona,
> Rebalancing tab): scales icon + header "Optimize your portfolio allocation
> and manage rebalancing strategies", ghost Settings + indigo "Execute
> Rebalance"; KPI row Portfolio Drift 5.0% · Actions Required 2 · Rebalance
> Value $10,000 · Last Rebalance 15 days; split panel — left "Target
> Allocation": four sliders with "Current x% · Drift x%" sublabels and green
> "Total Allocation 100%" footer that turns amber when ≠100; right
> "Rebalancing Settings": threshold slider "Rebalance Threshold: 5%",
> Auto-Rebalancing toggle, Monthly/Quarterly/Annually segmented, Cost
> Optimization toggles (Minimize Trading Costs, Tax-Loss Harvesting); bottom
> full-width "Required Rebalancing Actions": rows red-dot "Sell Stocks" /
> green-dot "Buy Bonds" $5,000 each with Low risk chips, footer "Total
> Transaction Value $10,000"; Execute opens a confirm modal listing the trades
> with a sample-data notice.

**Code prompt:**
> Build `app/rebalance.md` (persona portfolio, tab Rebalancing). Sliders are
> real `<input type=range>` with live `<output>` readouts (reuse the harness
> range pattern); target weights recompute drift, required actions, and totals
> live from `GeFi.DEMO.allocation`; settings persist to sessionStorage
> `gefi-app-rebalance`; Execute modal lists computed trades, confirming
> updates "Last Rebalance" to today and zeroes drift (sample-labelled).
> No-JS: static current values. Verify: build; Playwright — moving a slider
> updates drift + action rows, ≠100% state shows amber and disables Execute,
> confirm round-trip works, console clean.

## Task 210 — Live Trading
Refs: `livetrading.pdf`.

**Design prompt:**
> Design "Live Trading" (Trader persona: Overview · Live Trading · Trading
> Bots · Order History · Strategies; Live Trading active): header with green
> "Live" pill + "Secure" badge; three feature cards (Real-Time Data, Fast
> Execution, Risk Management); ONE segmented level — Trade | Orders |
> Positions | History (drop the reference's second nested tab bar). Trade:
> split panel — left "Place Order" form (Symbol, Side, Order Type, Quantity,
> Time in Force; big indigo "Buy AAPL" that re-labels with side+symbol);
> right price panel with mono last price, signed day change, mini line chart,
> and a designed loading state (skeleton, not "Loading price data...").
> Mini-stat row shows sample positions, not $0.00 zeros. Amber "Trading
> Safety Notice" callout: Risk Warning (red), Demo Environment, Educational
> Purpose. Positions/Orders/History: compact tables with side chips.

**Code prompt:**
> Build `app/live-trading.md` (persona trader, tab Live Trading). Order form
> validates client-side; submit appends to sessionStorage `gefi-app-orders`
> (status "filled" via seeded mock fill after 400ms) and prepends to the
> Orders table; Positions aggregates filled orders onto seeded starting
> positions; price panel = deterministic seeded walk via `GeFi.seed`,
> re-rendering every 2s while visible, chart via `GeFi.svg.line`. Safety
> notice verbatim incl. "Real money is not at risk in this demonstration."
> Verify: build; Playwright — place buy order → appears in Orders then
> Positions, price ticks change the mono readout, one segmented level only,
> console clean.

## Task 211 — Order History + Activity
Refs: `orderhistory.pdf`, `activity.pdf` (feed grammar).

**Design prompt:**
> Design "Order History" (Trader persona, Order History active): ghost Export
> + indigo Refresh; KPI row Total Orders · Filled (green check) · Pending
> (amber clock) · Total P&L (green); filter card — search "Search by symbol,
> order ID, or strategy..." + Status / Date Range / Type dropdowns; filter
> pills All Orders | Filled | Pending | Cancelled; dense data table: Order ID
> (strategy subtext e.g. "Momentum Breakout"), Symbol, Side (BUY green / SELL
> red with icons), Type outline chips (market/limit/stop), Quantity, Price,
> Fill Price ("—" if unfilled), Status icon-chip (filled green / pending
> amber / cancelled red), P&L signed colored, Date ("Jan 15, 2026" format);
> pagination footer "Showing 1–10 of 24" with page buttons; designed empty
> state for a filter with no matches.

**Code prompt:**
> Build `app/order-history.md` (persona trader, tab Order History). Table
> from `GeFi.DEMO.orders` (~24 seeded rows) merged with sessionStorage
> `gefi-app-orders` from task 210; search + dropdowns + pills filter
> client-side with live KPI recompute; pagination 10/page; empty state from
> the component library; Export copies a CSV string to clipboard with a
> sample-data toast. No-JS: first 10 rows static. Verify: build; Playwright —
> search narrows rows + KPIs, each status chip has icon+label, pagination
> works, empty state appears for nonsense search, console clean.

## Task 212 — Backtesting Environment
Refs: `backtesting.pdf`.

**Design prompt:**
> Design "Backtesting Environment" (Developer persona: Overview · Backtesting
> · AI Marketplace · Market Data · Bounties · Learning; Backtesting active;
> top-bar </> icon): header + indigo "New Backtest"; KPI row with REAL sample
> data (not the reference's zeros): Total Backtests 12 (2 running), Best
> Sharpe 1.87, Avg Annual Return +14.2%, Active Models 3; segmented Configure
> | Live Monitor | Optimizer | Results | Analysis | Comparison. Configure:
> split — left "Backtest Configuration" with Available Models rows (lifecycle
> chips deployed/testing/approved), Quick Presets (Last 1 Year / Last 2 Years
> / Custom Range), indigo "Configure New Backtest"; right "Market Data
> Status" rows with Active/Limited/Coming Soon chips + info panel "Historical
> data available from January 2020 to present". Results: table of runs with
> Sharpe/return/drawdown mono columns. Live Monitor: progress bars + log
> lines. Others: designed empty states.

**Code prompt:**
> Build `app/backtesting.md` (persona developer, tab Backtesting), six
> hash-routed segments. Configure reads `GeFi.DEMO.backtests` + model
> lifecycle rows; "Configure New Backtest" opens a form modal (model, preset
> range) whose submit seeds a deterministic run: Live Monitor shows it
> progressing (interval-driven bar to 100%), then Results gains the row with
> seeded metrics. State in sessionStorage `gefi-app-backtests`. Optimizer/
> Analysis/Comparison get component-library empty states with honest copy.
> Verify: build; Playwright — full run lifecycle (create → monitor → result
> row), presets fill dates, chips labelled, console clean.

## Task 213 — AI Model Marketplace
Refs: `modelmarketplace.pdf` (= `aimarketplace.pdf`).

**Design prompt:**
> Design "AI Model Marketplace" (Marketplace persona: Overview · AI
> Marketplace · Categories · My Subscriptions · Developers; AI Marketplace
> active): subtitle "Discover and subscribe to AI-powered financial models
> tailored to your needs"; Preferences ghost button; filter card search +
> All Categories / All Subcategories / All Risk Levels; segmented For You |
> Trending | Browse All | Categories. For You: "Personalized Recommendations"
> with sparkle icon — show BOTH the empty state ("Building Your
> Recommendations" / "We're analyzing your preferences to find the perfect AI
> models for you." / "Set Your Preferences" CTA) and the filled state: 3-col
> grid of model cards (name, category, risk chip, price, mini-stats, indigo
> Subscribe + ghost Details). Trending: same grid ranked with flame chips.
> Browse All: grid + pagination. Preferences: modal with category checkboxes
> + risk tolerance segmented control.

**Code prompt:**
> Build `app/marketplace.md` (persona marketplace, tab AI Marketplace).
> Cards come from the REAL `GeFi.MODELS` registry (92 models): map category,
> risk, price, maturity; Details links to `/models/<slug>/`. For You is empty
> until preferences exist in sessionStorage `gefi-app-prefs` (set via the
> Preferences modal), then filters MODELS by chosen categories/risk; Trending
> = seeded deterministic ranking; Browse All = full grid with the filter bar
> live-filtering (reuse the models-filter predicate approach) + 12/page
> pagination. Subscribe stores to `gefi-app-subs` and the card shows
> "Subscribed ✓". Verify: build; Playwright — empty→set prefs→filled round
> trip, filters narrow the grid with live counts, Details resolves to a real
> model page, console clean.

## Task 214 — Model Categories
Refs: `modelcategories.pdf`.

**Design prompt:**
> Design "AI Model Categories" (Marketplace persona, Categories active): KPI
> row Total Categories · Total Models · Average Rating · Top Category —
> internally consistent (the reference showed "Total Models 0" above cards
> claiming hundreds); filter card search + category dropdown + Name/Models/
> Rating sort + grid/list toggle; 3-col grid of category cards: icon, name,
> optional "Featured" indigo / "Trending" orange-flame chips, description,
> big indigo model count + amber star rating, REAL subcategory chips (no
> "General Advanced Custom" filler), "Starting from $X/month", full-width
> indigo "Browse Models". List view: same data as rows. 
 
**Code prompt:**
> Build `app/categories.md` (persona marketplace, tab Categories). Derive
> categories AT BUILD TIME from the `_models` collection via Liquid
> `group_by_exp` (category, count, min price) + enrich client-side from
> `GeFi.MODELS` (avg risk mix). Subcategory chips from real model families.
> KPIs computed from the same data so they cannot disagree. Sort + view
> toggle client-side; "Browse Models" links to `/models/` filtered anchor or
> marketplace Browse All with the category pre-selected via query param that
> 213's filter reads. Verify: build; Playwright — card count equals distinct
> categories in the collection, KPI Total Models equals 92, sort by Models
> reorders, list toggle works, console clean.

## Task 215 — Developers directory
Refs: `developers.pdf`.

**Design prompt:**
> Design "Developers" (Marketplace persona, Developers active): subtitle
> "Discover talented AI model developers and their work"; indigo "Become a
> Developer"; KPI row Total Developers 6 · Verified 5 (green) · AI Models
> Created 60 · Revenue Generated $683,000 (green trend); filter bar search
> ("Search developers by name, username, or specialization...") + Rating sort
> + All Developers filter; 3x2 grid of profile cards: initials avatar, name +
> indigo "Verified" badge, @handle, bio, amber ★ rating "(234)", location
> pin, Models/Subscribers/Revenue stat trio, "Specialties:" chips, "Top
> Models:" two rows with ★, "Joined Jan 2023", globe icon + ghost "View
> Profile". One unverified profile to justify the KPI.

**Code prompt:**
> Build `app/developers.md` (persona marketplace, tab Developers) from
> `GeFi.DEMO.developers` (6 seeded profiles; KPIs computed from the array).
> Search filters name/handle/specialties; sort by rating/models/revenue.
> "Top Models" rows link to real `/models/<slug>/` pages chosen from
> `GeFi.MODELS`. "View Profile" opens a detail modal (bio, all stats, model
> list) — no separate route needed. Verify: build; Playwright — KPI numbers
> equal computed aggregates, search narrows, modal opens/closes with focus
> trap, console clean.

## Task 216 — Developer Console: Overview + My Models
Refs: `developeroverview.pdf`, `mymodels.pdf`; fix the orphan hyperparameter form.

**Design prompt:**
> Design "Developer Overview" (Developer persona, Overview tab; </> top-bar
> icon): header + indigo "Create Model" + ghost "Export Data"; KPI row 12
> Total Models · $486,750 Total Funding (with separator) · 28 Collaborators ·
> 8 Deployments; segmented Overview | My Models | Training | Deployment |
> Collaboration | Monitoring. Overview: "Recent Activity" rows (colored icon,
> title, "Model • 1 hour ago" meta, gray tag chip) + three quick-action cards
> (Create New Model / Upload Dataset / View Documentation). My Models: "My
> Models (4)" + Filter + All Status dropdown; 2x2 grid — lifecycle chip
> (Deployed indigo / Testing amber / Approved green / Draft gray), Category /
> Tests / Collaborators fields, indigo "Funding Progress $68,250 / $75,000"
> bar, View · Edit (· Monitor) buttons. The stray hyperparameter form from
> the references is REMOVED — it returns properly inside task 217's training
> config modal.

**Code prompt:**
> Build `app/dev.md` (Overview) and `app/dev-models.md` (persona developer,
> tab Overview, segments linking across the console pages 216–218's routes).
> Data from `GeFi.DEMO.devConsole` (models, activity, funding). Create Model
> opens a modal (name, category, template select) adding a Draft card to
> sessionStorage `gefi-app-dev-models`; Export Data copies JSON to clipboard
> with toast. Status dropdown filters the grid. KPI funding string must use
> `GeFi.fmt.money`. Verify: build; Playwright — create-model adds a Draft
> card that survives reload, filter by Testing shows only Testing, no bare
> form elements outside cards anywhere on the page, console clean.

## Task 217 — Developer Console: Training + Deployment + Monitoring
Refs: `training.pdf`, `deployment.pdf`, `monitoring.pdf`.

**Design prompt:**
> Three frames of the Developer console. Training: "Training Jobs — Monitor
> and manage your model training processes" — row-cards with status chip
> (completed indigo-outline / running indigo / queued gray+clock), Duration,
> Accuracy / Loss fields, progress bar with %, buttons per state (Download +
> View Logs / Pause + View Logs / View Logs); "New Training Job" opens a
> config modal containing the hyperparameter form done properly: Learning
> Rate, Batch Size, Epochs, Optimization Method select, validation, inside a
> card. Deployment: "Model Deployments" row-cards — env subtitle (Production/
> Staging/Development), status chip, Uptime green % · Requests · Latency ·
> Last Deploy fields, Stop | Configure | Metrics | Logs ghosts, indigo Start
> on inactive. Monitoring: KPI trio System Health 98.5% green pulse · Active
> Models 8/8 · Avg Response 43ms; per-model blocks with DISTINCT metrics and
> four meters — Prediction Accuracy, Response Time, Uptime indigo; Error Rate
> as a RED bad-is-high meter.

**Code prompt:**
> Build `app/dev-training.md`, `app/dev-deploy.md`, `app/dev-monitoring.md`
> (persona developer, tab Overview, console segments). Training jobs from
> `DEMO.devConsole.jobs`; New Training Job modal validates hyperparameters
> (numeric ranges; method required) and enqueues a job that progresses
> deterministically; Pause toggles running→paused. Deployment Start/Stop
> flips status + zeroes/restores live fields; state in sessionStorage
> `gefi-app-dev-ops`. Monitoring meters read per-model DISTINCT seeded values
> (not the reference's copy-paste 95.2/0.2 for both); Error Rate uses
> `app-meter--bad`; Refresh reseeds within tolerance; View Logs opens modal
> with seeded log lines. Verify: build; Playwright — job lifecycle, deploy
> start/stop round-trip, two models show different accuracy values, error
> meter red, console clean.

## Task 218 — Developer Console: Collaboration + Bounty Board
Refs: `collaboration.pdf`, `bounties.pdf`.

**Design prompt:**
> Two frames. Collaboration (console segment): split — left "Team Members —
> Manage collaborators across your projects": rows (colored initials avatar,
> name, role subtitle), Owner indigo / Collaborator outline chips, ghost
> "+ Invite Collaborator"; right "Team Communication — Recent discussions and
> updates": message rows (avatar, name, "2h ago", message), ghost "Start
> Discussion". Bounty Board (Developer persona, Bounties tab): target icon +
> "Discover and claim bounties... Earn rewards while contributing to the
> future of finance."; KPI row Active Bounties 12 · Total Rewards $8,250 ·
> Active Developers 47 · Completed 156; filter card; 3-col grid — status chip
> left (OPEN green / CLAIMED blue-outline / IN PROGRESS amber) + difficulty
> right (INTERMEDIATE yellow / ADVANCED orange / EXPERT red), title,
> description, green reward, clock + "Jan 15, 2026" deadline, category +
> submission count (grammar-correct singular/plural), ghost "View Details" +
> indigo "Claim" on OPEN only.

**Code prompt:**
> Build `app/dev-collab.md` (console segment) and `app/bounties.md` (persona
> developer, tab Bounties). Collaboration from `DEMO.devConsole.team/messages`;
> Invite opens modal (name, role) adding a row; Start Discussion appends a
> message (sessionStorage `gefi-app-collab`). Bounties from `DEMO.bounties`;
> filters live; Claim flips OPEN→CLAIMED (sessionStorage `gefi-app-bounties`)
> and disables the button; submission counts pluralize correctly ("1
> submission"). Verify: build; Playwright — invite + message round-trips,
> claim persists reload, "1 submission" renders singular, dual chips both
> labelled, console clean.

## Task 219 — Learning Center
Refs: `learning.pdf`.

**Design prompt:**
> Design "Learning Center" (Learning persona: Overview · Learning · Tutorials
> · Webinars · Documentation · Community; Learning active): book icon +
> "Master AI financial modeling through comprehensive tutorials, workshops,
> and hands-on projects."; KPI row Completed 2 (green check) · In Progress 2
> (blue play) · Certificates 3 (purple) · Hours Learned 24.5 (amber clock);
> segmented All Content | In Progress | Completed | Recommended; filter card;
> 3-col grid of content cards: dual chips (type GET-STARTED green / TUTORIAL
> blue / WEBINAR purple / BLOG pink / FAQ gray + level BEGINNER green /
> INTERMEDIATE yellow / ADVANCED orange), title, description, duration +
> enrolled, ★ + author, progress bar where started, button by state (Start
> Learning indigo / Continue / ghost Completed ✓). "Featured Learning Paths":
> three DARK cards with colored left accents (fixing the reference's
> white-on-pastel illegibility), "6 courses ~30 hours", Continue Path/Start
> Path.

**Code prompt:**
> Build `app/learning.md` (persona learning, tab Learning) from
> `DEMO.learning` (10 items + 3 paths). Segments and filters live-filter the
> grid; KPIs computed from item states; Start/Continue advances a seeded
> progress % stored in sessionStorage `gefi-app-learning`; completed items
> get the check + download-certificate icon (toast: sample). Verify: build;
> Playwright — segment Completed shows only completed, starting an item moves
> it to In Progress and bumps the KPI, path card text contrast passes (assert
> computed colors are light-on-dark), console clean.

## Task 220 — Market Data
Refs: `marketdata.pdf`.

**Design prompt:**
> Design "Market Data" (Developer persona, Market Data active): header
> "Access comprehensive financial data for AI model development and
> backtesting" with breathing room above (the reference was cramped), indigo
> "Start Stream" (play icon) + ghost "Export Data"; KPI row 6 Data Sources ·
> 10.9M Total Data Points · 4 Real-time Sources · 86% Avg Coverage; segmented
> Data Sources | Date Range | Data Preview. Sources: 2-col grid of six cards
> (Stock Data (US) with indigo selected border, Crypto, Forex, Options,
> Commodities, Fixed Income) — status chip (Active green / Limited amber+info
> / Coming Soon gray), Coverage / Data Points / Date Range / Update Frequency
> pairs, "Sample Symbols" chips (AAPL, BTC, EUR/USD, GOLD, 10Y Treasury).
> Date Range: preset pills + custom pickers. Data Preview: mono table of
> sample rows for the selected source with a live-stream state when streaming.

**Code prompt:**
> Build `app/market-data.md` (persona developer, tab Market Data) from
> `DEMO.marketData` (six sources + seeded sample rows per source). Selecting
> a card sets the preview source; Start Stream toggles a 1s-interval seeded
> row appender with a green "Streaming" pill (Stop reverses); Coming Soon
> cards unselectable with tooltip; Export Data copies visible rows as CSV
> with sample toast. Verify: build; Playwright — select→preview updates,
> stream adds rows then stops, Limited chip carries info icon + label,
> console clean.

## Task 221 — Data Provider Overview + Datasets
Refs: `data_provider.pdf`, `datasets.pdf` (both largely empty stubs).

**Design prompt:**
> Design "Data Provider Overview" (Data Provider persona: Overview ·
> Portfolio · AI Marketplace · Collaboration): subtitle "Manage your
> datasets, monitor revenue, and collaborate with developers"; segmented
> Overview | Datasets | Market Insights | Revenue. Overview: KPI row 12 Total
> Datasets · $2,847,500 Total Revenue · 156 Active Subscriptions · 9.4 Avg
> Quality Score (consistent, unlike the reference's zeros-with-revenue) +
> "Recent Activity" feed (uploads, subscription events, quality-score
> changes) — the reference panel was empty; design the filled state AND its
> empty state. Datasets: "Dataset Management" + indigo "+ Upload Dataset";
> row-cards per dataset — name, category chip, quality score badge, rows/size
> mono, monthly revenue green, subscriber count, status chip
> (Published/Processing/Draft), Edit · Analytics · Archive actions; upload
> modal (name, category, file drop zone, license select, price).

**Code prompt:**
> Build `app/data-provider.md` + `app/datasets.md` (persona data-provider,
> tab Overview, shared segments). Data from `DEMO.datasets` (12 entries;
> KPIs computed). Upload modal validates and adds a Processing dataset that
> flips to Published after 2s (sessionStorage `gefi-app-datasets`); Archive
> asks typed-confirm then grays the row. Activity feed from dataset events.
> Verify: build; Playwright — KPIs equal computed aggregates, upload
> round-trip Published, archive confirm flow, feed non-empty with designed
> empty state reachable (clear-state button in a dev-only query param),
> console clean.

## Task 222 — Market Insights + Revenue
Refs: `insights.pdf` (0ac4bd99 provider variant), `revenue.pdf` (empty stub).

**Design prompt:**
> Two provider segments. Market Insights: "Market Insights & Trends" + indigo
> "Generate Report"; "Market Performance" card — two indigo meters (Dataset
> Adoption Rate +15.3%, Market Impact Score 8.7/10) beside stat tiles ($2.3M
> Market Impact Value green, 156 Models Using Data blue); "Trend Analysis"
> card — rows Algorithmic Trading / Risk Assessment / Market Sentiment with
> High/Medium Impact chips and green growth %. Revenue: KPI row Total
> Revenue $2,847,500 · Downloads 8,432 · Active Subscriptions 156 (consistent
> with Overview — the reference showed $0 under a $2.8M overview); "Revenue
> by Dataset" panel designed as a horizontal bar list (dataset name, indigo
> bar, mono $, share %) + monthly revenue line chart with range dropdown;
> payout schedule row-card.

**Code prompt:**
> Build `app/data-insights.md` + `app/data-revenue.md` (provider segments).
> All figures computed from `DEMO.datasets` so Overview/Revenue can never
> disagree; revenue-by-dataset bars sorted desc with shares summing 100%;
> line chart via `GeFi.svg.line` on seeded monthly series; Generate Report
> composes a client-side summary modal (sample-labelled). Verify: build;
> Playwright — Revenue KPI equals Overview KPI exactly (assert same string),
> bars sum ≈100%, chart renders, console clean.

## Task 223 — Funding Hub dashboard
Refs: `fundinghub.pdf`.

**Design prompt:**
> Design "Funding Hub" (Funding persona: Overview · Funding Hub · Bot Funding
> · AI Model Funding · Bounty Funding; Funding Hub active): subtitle "Support
> and fund AI financial innovations"; segmented (with icons) Dashboard | AI
> Model Funding | Bounty Funding; KPI row using the ONE standard card
> anatomy (the reference used a variant): Total Funding $2,540,750 (+12% this
> month), Active Projects 149 (147 models, 2 bots — internally consistent,
> unlike the $0-with-+12% reference), Success Rate 87%, Contributors 1,247;
> two summary cards "AI Model Funding" and "Bounty Funding" — Total Raised /
> Active rows with mono values + full-width indigo "View Model Funding" /
> "View Bounty Funding"; below, "Recently Funded" feed of 3 row-cards with
> progress bars at 100% and Funded chips.

**Code prompt:**
> Build `app/funding.md` (persona funding, tab Funding Hub). KPIs and summary
> cards computed from `DEMO.fundingProjects` + `DEMO.bounties` aggregates
> (single source, no contradictions); segment buttons route to 224/225 pages;
> Recently Funded = completed projects from DEMO. Verify: build; Playwright —
> KPI totals equal the sum over both linked pages' lists (assert), links
> resolve, standard KPI anatomy used (class check), console clean.

## Task 224 — Bot Funding + AI Model Funding
Refs: `botfunding.pdf`, `aimodelfunding.pdf`.

**Design prompt:**
> Two frames, Funding persona. Bot Funding (tab active): "Fund innovative
> trading bot development and earn from successful deployments"; indigo
> "+ Request Funding" (ONE verb set); KPI row Total Funded $140,750 · Active
> Bots 2 · Contributors 96 · Success Rate 84%; segmented (pill style, not
> plain text) Browse Requests | My Contributions | My Requests; filter bar;
> 2-col project cards: status chip (Active green / Funded blue) + risk chip
> (Medium yellow / High red), category chip, green raised amount, indigo
> "Funding Progress $32,500 of $50,000" bar + %, Contributors / Expected ROI
> green / Days Left, "Features:" chips, "Created by" indigo link, "Min
> Contribution $100", full-width indigo "Contribute $100" (absent when
> Funded/Ended). AI Model Funding (tab active): same recipe; KPI row Total
> Funded $2.4M · Active Models 147 · Funders 1,243 · Avg ROI 18.4%; grid of
> model funding requests consistent with those KPIs, plus the designed empty
> state ("No funding requests found" / "Try adjusting your search filters")
> for filtered-to-nothing.

**Code prompt:**
> Build `app/bot-funding.md` + `app/model-funding.md` (persona funding).
> Cards from `DEMO.fundingProjects` filtered by kind; KPIs computed from the
> same arrays. Contribute opens amount modal (min enforced), updates raised/
> progress/contributors in sessionStorage `gefi-app-funding`, flips to Funded
> at goal with confetti-free state change; My Contributions segment lists the
> user's contributions; Request Funding opens a form modal adding a SUBMITTED
> request to My Requests. Verify: build; Playwright — contribute raises the
> bar and persists, goal-reach flips chip to Funded and removes CTA, empty
> state on nonsense search, KPIs match list aggregates, console clean.

## Task 225 — Bounty Funding
Refs: `bountyfunding.pdf`.

**Design prompt:**
> Design "AI Financial Bounty Funding" (Funding persona, Bounty Funding
> active): "Support and fund the development of AI financial models and
> tools"; indigo "+ Request Funding"; KPI row with sub-lines: Total Funded
> $2.4M (+15% this month green) · Active Bounties 47 (12 pending approval
> blue) · Contributors 1,247 (+23 this week purple) · Completed 189 (94%
> success rate amber); segmented Browse Requests | My Requests | My Funding;
> filters All Categories + Newest sort; full-width stacked row-cards: dual
> top-right chips — status (SUBMITTED amber / APPROVED green / ACTIVE
> outline / COMPLETED purple) + difficulty (EXPERT red / ADVANCED orange /
> INTERMEDIATE yellow); 3-col body: "Funding Progress $2,500 / $40,000" bar +
> backers + duration; "Required Skills" chips with "+1 more"; Developer name;
> "Estimated Reward" green + indigo "Fund" (disabled on COMPLETED) + eye
> icon.

**Code prompt:**
> Build `app/bounty-funding.md` (persona funding, tab Bounty Funding) from
> `DEMO.bounties` (funding-side fields added in 201). Fund modal contributes
> (sessionStorage `gefi-app-bounty-funding`); sort Newest/Ending/Most Funded;
> eye icon opens detail modal; Request Funding form adds SUBMITTED row under
> My Requests. Disabled Fund on COMPLETED carries aria-disabled + tooltip.
> Verify: build; Playwright — fund round-trip, sort reorders, dual chips
> labelled, disabled state not clickable, console clean.

## Task 226 — Reports (merged page)
Refs: `reports.pdf` ("Reports & Insights") + `reports_dashboard.pdf`
("Reports Dashboard") — two different pages claimed the same tab; merge them.

**Design prompt:**
> Design ONE "Reports" page (Reports persona: Overview · Reports · Risk
> Analysis · Compliance · Custom Reports; Reports active) merging the two
> references: header "Reports & Insights" / "AI-powered financial insights
> and comprehensive reports", ghost "View All Reports" + indigo "Generate
> Report" right-aligned (standard header, not the icon-beside-title variant);
> top split — left "AI-Generated Market Insights": Real-Time Market Sentiment
> indigo meter "75% Bullish", Macroeconomic Trends icon-stats (USD Index
> 102.4 +0.3%, GDP Growth 2.8% Stable), amber Fed Decision callout "AI
> predicts 0.25% rate cut · probability: 68%"; right "Investor Reports" card
> — rows with green Ready chips + Download, full-width "+ Generate New
> Report". Below: four DARK category panels with colored left accents (not
> pastel tints) — Performance / Risk Assessment / Regulatory Compliance /
> Client Reports — each nesting report rows (name, description, generated
> green / pending amber chip + "Jan 15, 2026" date, eye + download icon
> buttons); "Quick Actions" tiles Monthly Performance / Risk Analysis /
> Client Summary.

**Code prompt:**
> Build `app/reports.md` (persona reports, tab Reports) from `DEMO.reports`
> (categorized report objects; single date format via `GeFi.fmt.date`).
> Generate Report opens a modal (category, period) adding a pending row that
> flips to generated after 1.5s (sessionStorage `gefi-app-reports`); eye
> opens a sample summary modal; download copies text with sample toast.
> Verify: build; Playwright — generate round-trip pending→generated, every
> date matches /^[A-Z][a-z]{2} \d{1,2}, \d{4}$/, four panels dark with
> accent borders (computed style check), console clean.

## Task 227 — Compliance Reports + Risk Reports
Refs: `compliance.pdf` (= `compliance_reports.pdf`), `risk.pdf` (= `risk_reports.pdf`).

**Design prompt:**
> Two frames, Reports persona. Compliance (tab Compliance): "Monitor
> regulatory compliance across all financial operations and requirements";
> ghost Refresh + indigo Export All; 6-KPI strip Total Reports 6 · Compliant
> 4 green · Warnings 1 amber · Violations 1 red · Compliance Rate 67% indigo
> · Overdue 2 orange (consistent with the counts, unlike the reference's
> Overdue 6); filter bar search + All Types / All Status / Last 30 days;
> 2-col card grid: status pill (Compliant/Warning/Violation) + risk pill
> (LOW/MEDIUM/HIGH RISK), title, "Category • description", "Regulations:"
> chips (MiFID II, RTS 22...), mini-stats Coverage % indigo / Findings / Next
> Due, twin ghost View Details | Download. Risk Analysis (tab Risk Analysis):
> same recipe; KPI strip Total 6 · Critical 1 red · High 2 orange · Medium 2
> amber · Low 1 green · Portfolio VaR $3,052,000 indigo; cards add severity
> pill + risk-type chip (Liquidity/Market/Concentration/Credit/Operational)
> + signed trend delta, "Risk Score 89/100" bar colored by severity,
> Confidence % / Exposure / VaR mini-stats.

**Code prompt:**
> Build `app/compliance-reports.md` + `app/risk-reports.md` (persona reports)
> from `DEMO.complianceReports` / `DEMO.riskReports`; KPI strips computed
> from the arrays (assert consistency by construction). Filters live; View
> Details opens a detail modal (regulations, findings list, dates); Download
> copies a summary; Export All copies all visible. Risk score bar color maps
> severity (red/orange/amber/green). Verify: build; Playwright — KPIs equal
> computed counts, filter by Violations shows 1 card, severity colors carry
> text labels, modals focus-trap, console clean.

## Task 228 — Custom Report Builder
Refs: `customreports.pdf` (= `custom_reports.pdf`).

**Design prompt:**
> Design "Custom Reports" (Reports persona, Custom Reports active): header +
> ghost Export All; segmented Report Builder | My Reports | Templates.
> Builder: form card "Create Custom Report — Build a custom report with your
> preferred metrics and visualizations": Report Name* (placeholder "e.g.,
> Monthly Portfolio Review"), Report Type* select, Description textarea
> ("Describe what this report covers..."), Date Range* select, Schedule
> (Optional) select, "Visualization Types" checkbox grid — Line Chart, Bar
> Chart, Pie Chart, Data Table, Heat Map, Scatter Plot — "Make this report
> public (visible to team members)" checkbox; indigo Create Report + ghost
> Reset; inline validation states. My Reports: row list with status chips,
> schedule badge, run/edit/delete actions and a designed empty state.
> Templates: 3-col grid of template cards with "Use Template".

**Code prompt:**
> Build `app/custom-reports.md` (persona reports, tab Custom Reports).
> Builder validates required fields + ≥1 visualization; Create adds to
> sessionStorage `gefi-app-custom-reports` and switches to My Reports with
> the new row; Reset clears with confirm if dirty; delete typed-confirm;
> Use Template prefills the builder. Verify: build; Playwright — invalid
> submit shows inline errors and no row, valid submit round-trips to My
> Reports and survives reload, template prefill works, console clean.

## Task 229 — Regulator Overview
Refs: `regulator.pdf`, `analytics.pdf` (eef8bdd9), `activity.pdf`,
`insights.pdf` (adbba07a).

**Design prompt:**
> Design "Regulator Overview" (Regulator persona: Overview · Model Audits ·
> Dataset Audits · Compliance Issues · Communications · Standards; shield
> top-bar icon; Overview active): header "Comprehensive compliance monitoring
> and AI model governance" with Last 30 days dropdown + bell + gear; search
> "Search audits, models, or datasets..." + All Categories + indigo Export
> Dashboard; segmented Regulator Overview | Analytics | Recent Activity |
> Insights. Overview: 3x3 KPI grid (Total Audits 142 +12% · Pending 18 "3
> due this week" amber · Compliance Rate 87.3% · Flagged Issues 23 "3
> critical" red · Resolved 156 green · Active Standards 15 blue · Completion
> Rate 94.2% · Avg Resolution 4.8 days · Critical Issues 3 red); three
> dashed quick-action tiles Start New Audit / Report Issue (red) / Send
> Communication (blue); "Upcoming Audits" rows with owner • date, lowercase
> priority pills, ghost View. Analytics: 2x2 horizontal-bar cards
> (Compliance Rate Trend, Audit Distribution by Type, Issue Distribution,
> Performance Metrics key-values). Recent Activity: feed rows with colored
> icon tiles, entity IDs (#MT-4521), timestamps, org + severity chips.
> Insights: four DARK banners with colored left borders + icons (blue
> improvement / amber attention / green best practice / purple trend) — not
> pastel.

**Code prompt:**
> Build `app/regulator.md` (persona regulator, tab Overview) with four
> hash-routed segments from `DEMO.regulator`. Quick actions open modals
> (audit: entity + type; issue: severity + description; communication:
> recipient + message) appending to the activity feed (sessionStorage
> `gefi-app-regulator`); Export Dashboard copies a JSON summary. Analytics
> bars computed from the same DEMO arrays as the KPIs. Verify: build;
> Playwright — all four segments switch, quick-action round-trip lands in
> Recent Activity, KPI/analytics consistency (flagged = feed count), banners
> are dark surfaces (computed style), console clean.

## Task 230 — Regulator sub-pages (the five 404 tabs)
Refs: `model_audits.pdf`, `dataaudits.pdf`, `complianceissues.pdf`,
`communications.pdf`, `standards.pdf` — ALL currently render "Regulator Not
Found". Build them for real.

**Design prompt:**
> Five frames, Regulator persona, one per tab. Model Audits: filter bar +
> data table (Audit ID #MT-xxxx, Model, Organization, Type, severity pill,
> status chip Scheduled/In Progress/Completed, Due "Jan 15, 2026", View) +
> audit detail modal with findings timeline. Dataset Audits: same recipe
> with #DS-xxxx and data-quality columns (Coverage, PII flags, License).
> Compliance Issues: KPI row (Open · Critical · Avg Resolution · Resolved
> 30d) + issue row-cards with severity chip, entity link, assignee, SLA
> countdown (amber when close, red overdue), Resolve action. Communications:
> split — thread list left (org, subject, unread dot), thread view right with
> message bubbles + composer; "Send Communication" primary. Standards: card
> grid of standards (name e.g. "EU AI Act — high-risk credit scoring",
> version, effective date, status Adopted/Draft chip, linked audits count,
> View requirements accordion). Also design the improved error state used
> when a deep link is truly missing: "Regulator Not Found" / "The regulator
> profile you're looking for doesn't exist." / Go Back — kept, but reached
> only on genuinely bad routes.

**Code prompt:**
> Build `app/reg-model-audits.md`, `app/reg-dataset-audits.md`,
> `app/reg-issues.md`, `app/reg-communications.md`, `app/reg-standards.md`
> (persona regulator, matching active tabs) from `DEMO.regulator` (extend in
> this task: audits with findings, issues with SLA timestamps relative to a
> fixed seed date, threads with messages, standards with requirements).
> Resolve moves an issue to Resolved and updates Overview's counts (shared
> DEMO + sessionStorage `gefi-app-regulator`); composer appends to a thread;
> accordion requirements. Entity IDs cross-link (#ML-3456 → model audit
> row). Verify: build; Playwright — each tab renders real content (no
> "Regulator Not Found" anywhere in the five pages), resolve round-trip,
> thread compose, accordion toggles, console clean.

## Task 231 — zKML Verification surface
Refs: `zKML.pdf` (hackathon deck — proof sharding pipeline, federated
learning roadmap; the conceptual seed of "AI Models Run Locally" /
verifiable-model claims).

**Design prompt:**
> Design "zKML Verification" (Developer persona, new page reachable from the
> Overview console): header "Zero-Knowledge Model Verification — Prove model
> execution without exposing data or weights"; explainer strip of three
> cards: Proof Generation ("Local proofs are generated for each shard —
> sensitive data never leaves the participant's environment"), Proof
> Verification ("Verified using public values, enabling trustless
> collaboration"), Elapsed Time (wall-clock vs task-time). Pipeline
> visualization as a horizontal stepper: Compile WASM → Create n shards →
> Prove shard 1…n (parallel lanes with per-shard progress bars + status
> chips) → Aggregate proofs → Verify aggregated proof; a mono log panel
> streaming prover output ("Shard 0 verification succeeded", "Total wall
> clock time: 210 secs"); a verification summary card with green "Verified"
> state, proof hash (truncated mono), shard count, timing; and a "Verify a
> model" form (model select from the catalogue, shard count 2–8 slider,
> Run verification indigo CTA). Empty state before first run.

**Code prompt:**
> Build `app/zkml.md` (persona developer, tab Overview) with a deterministic
> mock pipeline: Run verification animates the stepper (seeded per-shard
> durations, parallel bars), streams seeded log lines into the mono panel,
> then renders the summary card (proof hash = FNV-1a of model+shards,
> timings from the seed; "sample verification" label). State survives reload
> via sessionStorage `gefi-app-zkml`. Add an entry link card on the dev
> console Overview (216). Cross-link each federated model page's network
> section? NO — model layout is off-limits; instead link from this page TO
> federated model pages (list from `GeFi.MODELS` where federated). Verify:
> build; Playwright — run completes all shards → aggregate → verified green,
> log panel scrolled, hash stable across two runs with same inputs, links to
> federated models resolve, console clean.

## Task 232 — Consistency + accessibility sweep
Refs: design-system-v2 §5 (all twelve improvements).

**Design prompt:** n/a (verification task).

**Code prompt:**
> Sweep all `app/` pages built above and enforce: one KPI anatomy (`app-kpi`
> only), one segmented style, one date format via `GeFi.fmt.date`, thousands
> separators via `GeFi.fmt.money`, no color-only status (every chip/meter
> has label or icon — automated DOM audit), designed empty/error states on
> every list (audit for bare panels), dark-consistent banners, truthful
> active tabs (audit front matter vs page content), focus rings + aria on
> segments/modals/tables (keyboard walk in Playwright), AA contrast
> spot-checks on chips and muted text. Produce
> `tasks/reports/ui-followup-audit.md` listing every violation found and
> fixed. Verify: build; full-catalogue Playwright pass over all app pages —
> zero console errors, zero audit violations remaining.

## Task 233 — Decision: unify the marketing site?
**Not buildable without a decision.** The marketing/docs site (gefi.io — 92
model pages, dashboard preview, trust center) shipped light-first per the
original prefix; the platform app is dark-first. Options: (a) keep split —
light marketing, dark app (common; Stripe-style); (b) restyle marketing dark
to match (one brand, bigger change; the §6 token mapping in design-system-v2
would guide it). Record the owner's choice here, then — if (b) — raise a
dedicated ledger of restyle tasks. Mark this row done when the decision is
recorded.
