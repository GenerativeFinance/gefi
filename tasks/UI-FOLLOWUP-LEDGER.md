# UI FOLLOW-UP LEDGER — platform app surfaces (200-series)

Source: 56 reference screenshots (PDFs) of the GeFi platform UI reviewed on
2026-08-21, plus the zKML hackathon deck. These are the UIs started before this
repo's rebuild. Each task pairs a **Claude Design prompt** (the visual) with a
**Claude Code prompt** (wiring it into this Jekyll repo as a working preview
with seeded data). Companion document: `tasks/design-system-v2.md` — its §1
master prefix MUST be prepended to every Design prompt below, and its §4
canonical dataset and §5 improvements are binding on every task.

Two workstreams: the **200-series** builds the UI surfaces on seeded mocks;
the **300-series** builds the backend the UIs assume (gap analysis in
design-system-v2 §7) — contract-first with a mock server, so each UI later
flips from mock to live without redesign. 200-series tasks do not wait on
300-series ones; the 302 data layer migrates them when it lands.

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
- **Per-model UI design prompts:** every model also has a dark-system Claude
  Design prompt for its own page UI at `models[].prompts.designApp` in
  `tasks/prompt-library.json` (generated from each built page's front matter
  — demo kind, inputs, metrics, network, compliance posture). Prepend the §1
  prefix. Use them for dark model-page mocks (task 233's option b) or as the
  model-detail views inside app surfaces like the marketplace (task 213).

## Checklist

### Foundation
- [x] 200 — App shell: layout, topbar, persona tab nav, trust strip, mega footer — done (commit + canvas https://claude.ai/code/artifact/f97235b6-8185-4404-8ff7-edf6da15a752)
- [x] 201 — Canonical demo data module (`GeFi.DEMO`) — done (assets/js/app-demo-data.js; consistency invariants verified: strategies sum to portfolio value, allocation sums 100, provider aggregates derive from dataset rows; formatters moneyFull/signedPct/date added without shadowing dashboard semantics)
- [x] 202 — App component library: KPI card, segments, cards, chips, states — done (CSS under .app-shell + GeFi.app helpers in assets/js/app/components.js; gallery /app/components/ is the regression reference; segments have aria roles, arrow-key nav, hash deep-links; bad-is-high meters red; empty/skeleton/error states; chips always labelled)

### Investor wing
- [x] 203 — Investor Overview (chart dashboard, quick actions, activity) — done (built INTO /app/ since Overview is the persona's index; hero band, 4 KPI deltas, area-vs-dashed-benchmark chart, 5-segment donut + legend summing 100, 4 dark quick-action tiles, 4-row activity feed; dark chart token overrides added)
- [x] 204 — Holdings · Transactions · Watchlist tabs — done (three pages under /app/, shared app-hero include + hero.js hydration + app-subtabs link bar with truthful active state and Portfolio nav tab; holdings row-cards w/ TSLA red arrow+label, transactions filterable table w/ designed empty state, watchlist sparklines + star toggle persisted in sessionStorage; DEMO gains transactions/watchlist)
- [x] 205 — Analytics · Insights tabs — done (Performance Analysis 5 rows asserting Sharpe 1.42 + Risk Metrics 4 rows from DEMO.risk; insight row-cards w/ labelled sentiment chips, confidence pills, colored impact; Set Alert persists to sessionStorage gefi-app-alerts)
- [x] 206 — Portfolio Performance (Overview/Returns/Allocation/Risk Analysis) — done (4 hash-routed segments, one dataset: value line + donut; grouped monthly bars w/ 2 negative months + top performers; 5 color-coded allocation bars; 5 benchmark row-cards w/ 4 Good badges; GeFi.app gains donut/donutLegend/groupedBars, overview.js refactored onto them; segments now follow hashchange)
- [x] 207 — AI Portfolio (split panel) — done (overview kv card + risk distribution bars + Moderate chip left; strategy rows summing exactly to $142,500 + Rebalance/Manual/Report actions + 94.2% confidence gauge right; sample report modal w/ Escape close; canonical figures replace the reference's contradictory $247,580)
- [x] 208 — Portfolio AI Models (Active/Recommended/Settings) — done (full-width segments not small pills; row-cards w/ allocation meters zeroed when paused, pause/resume + KPI recompute persisted; Recommended cards migrate into Active on Subscribe; settings toggles + fee-cap slider persisted; fee KPI warns past cap)
- [x] 209 — Rebalancing & Actions — done (live target sliders w/ current/drift sublabels; total-allocation guard disables Execute at !=100% w/ amber message; drift/actions/value KPIs recompute live; threshold slider, auto toggle, Monthly/Quarterly/Annually segments, cost toggles all persisted; confirm modal executes: current:=target, drift 0, "just now", survives reload)

### Trading wing
- [x] 210 — Live Trading — done (ONE segmented level Trade/Orders/Positions/History; seeded 2s price ticker + session chart; order form relabels Buy/Sell+symbol, 400ms mock fill -> orders/positions/history w/ chips; positions aggregate fills onto seeded AAPL start; safety notice verbatim incl. "real money is not at risk in this demonstration"; orders persist sessionStorage)
- [x] 211 — Order History + Activity feed — done (24 seeded rows merged w/ live-session fills; KPIs recompute w/ filters; search incl. strategy names, status/type dropdowns + quick pills kept in sync; 10/page pagination w/ Showing x–y of n; designed empty state; CSV export stamped SAMPLE; dates in the one format; activity feed already lives on /app/ overview)
- [x] 212 — Backtesting Environment — done (6 segments; real sample KPIs not the reference zeros; lifecycle-chip model rows + Active/Limited/Coming Soon data status + data-range note; presets prefill the new-backtest modal; run lifecycle: create -> auto-hash to Live Monitor progress bar -> completed Results row w/ seeded metrics -> KPIs update, persisted; Optimizer/Analysis/Comparison get honest designed empty states)

### Marketplace & developer wing
- [x] 213 — AI Model Marketplace (For You/Trending/Browse All) — done (cards from the REAL 92-model registry w/ risk/federated chips + sparklines + Details -> /models/<slug>/; For You empty state w/ exact reference copy -> preferences modal (wings + risk ceiling) -> filled recs, persisted; seeded Trending ranking; Browse All w/ live count, filters (17 high-risk), 12/page pagination, ?category= deep link from 214)
- [x] 214 — Model Categories (wired to the real 92-model taxonomy) — done (28 family cards derived at BUILD TIME via the same group_by_exp as the catalogue; KPIs computed from the identical grouping so Total Models 92 = card sum 92; real subcategory chips + min entry price; Featured chip at >=8 models; name/models/price sort + grid/list toggle + empty state; Browse Models deep-links /models/?family= which now pre-selects the catalogue chip)
- [x] 215 — Developers directory — done (6 seeded profiles; KPIs computed from the array and landing on the reference figures 6/5/60/$683,000; initials avatars, Verified chips on 5 of 6, specialties + top-model chips linking real /models/ pages; rating/models/revenue sort + specialty search + empty state; View Profile modal w/ kv rows, focus management, Escape close)
- [x] 216 — Developer Console: Overview + My Models — done (/app/dev/ + /app/dev-models/ w/ shared console link-tabs + KPI strip ($486,750 WITH separator, fixing the reference); activity feed w/ tag chips; quick-action tiles incl. zKML entry; My Models 2x2 grid w/ lifecycle chips, funding meters, Monitor link on Deployed; status filter + empty state; Create Model modal (also #new deep link incl. same-page hashchange) adds a persisted Draft that bumps the KPI; the reference's orphan hyperparameter form does NOT exist anywhere)
- [x] 217 — Developer Console: Training + Deployment + Monitoring — done (training rows w/ per-state action rails; the hyperparameter form lives INSIDE the New Training Job modal w/ real validation (lr/batch/epochs ranges, method required); queued job progresses seeded, pausable mid-run; deployment start/stop zeroes/restores live fields, persisted in gefi-app-dev-ops; monitoring KPI trio + per-model blocks w/ DISTINCT seeded metrics, Error Rate on a RED bad-is-high meter, Refresh reseeds, Logs modal w/ seeded lines)
- [x] 218 — Developer Console: Collaboration + Bounty Board — done (collab split: team rows w/ Owner/Collaborator/Invited chips + invite modal; discussion feed w/ composer, both persisted in gefi-app-collab; bounty board: KPI strip ($8,250 rewards), dual status+difficulty chips, grammar-correct submission counts, Claim flips OPEN->CLAIMED persisted + removes CTA, search/status/level filters + empty state)
- [x] 219 — Learning Center — done (10 content cards w/ dual type+level chips, ratings, enrollments, progress meters; segments All/In Progress/Completed/Recommended + type/level/search filters + empty state; Start/Continue advances persisted progress and recomputes KPIs (completion 2->3 verified); Featured Paths as DARK cards with colored top accents — light text on dark computed rgb(242,244,255)/rgb(18,20,31), fixing the reference's illegible pastels)
- [x] 220 — Market Data — done (6 source cards w/ Active/Limited-ⓘ/Coming Soon chips, coverage/points/range/frequency stats, sample-symbol chips; Coming Soon unselectable w/ tooltip; selecting a card hash-routes to Preview w/ seeded rows; Start/Stop Stream adds 1 row/s w/ green Streaming pill and holds when stopped; Export copies SAMPLE-stamped CSV; KPIs computed)

### Data-provider wing
- [x] 221 — Data Provider Overview + Datasets — done (provider link-tabs; KPI strip DERIVED from dataset rows so tabs can never disagree (12/$2,243,599/222/9.1); Recent Activity derived from dataset events (never blank, w/ designed empty state fallback); Datasets: 12 row-cards w/ status+quality chips, upload modal -> processing -> published in 2s persisted, Archive typed-confirm rejects wrong name; shared GeFi.appProvider aggregates for task 222)
- [x] 222 — Market Insights + Revenue tabs — done (/app/data-insights/ + /app/data-revenue/ sharing data-revenue.js; Revenue KPIs derived from GeFi.appProvider.totals() so they equal Overview verbatim ($2,243,599 / 222 subs, Playwright-asserted string equality); revenue-by-dataset allocbars sorted desc, shares sum 100.0%; seeded monthly area chart whose 12 months sum exactly to total revenue, last month = next payout ($224,513); insights: adoption +15.3%, impact 8.7/10, $2,300,000 value, 156 models, 3 trend rows w/ text-labelled impact chips; Generate Report modal stamped SAMPLE quoting the same totals, close round-trip)

### Funding wing
- [x] 223 — Funding Hub dashboard — done (/app/funding/; all figures aggregate DEMO.fundingProjects+DEMO.bounties: Total Funding $204,550 = card totals bot $140,750 + model $58,400 + bounty $5,400 raised (Playwright-asserted sum equality; bounty side re-aggregated to funding.raised/backers when 225 added those fields), Active 5 (3 models · 2 bots), Avg Goal Progress 62%, Contributors 290 = campaign+bounty backers — reference's contradictory $2.54M/$0-with-+12% dropped per §5.6; anchor segments Dashboard|Bot|Model|Bounty routing to 224/225 URLs; 3 summary gridcards w/ Total Raised/Active rows + block CTAs; Recently Funded = only campaigns actually at 100% (1 row, Funded chip, green meter) w/ honest count note instead of the reference's padded three)
- [x] 224 — Bot Funding + AI Model Funding — done (/app/bot-funding/ + /app/model-funding/ from one shared include + project-funding.js keyed by data-pf-kind; KPIs recompute from the rendered list incl. session contributions (bot: $140,750/2 active/159/33% success; model: $58,400/95 funders/+12.9% avg ROI — all Playwright-asserted against DEMO aggregates); cards w/ status+risk+category chips, indigo progress bar, 3-col stats, Features chips, Created-by link, min-enforced Contribute modal (below-min rejected w/ error) persisting to gefi-app-funding; $6,750 top-up flips HF Arbitrage to Funded: chip→blue Funded, CTA removed, green 100% bar, KPIs re-aggregate ($150,000/67%); My Contributions + My Requests segments w/ designed empty states; + Request Funding pagehead link (#request hash, relative_url gotcha fixed w/ full-path hash URLs) adds Submitted request card sans CTA; nonsense search → designed empty state; per-kind state isolation verified)
- [x] 225 — Bounty Funding — done (/app/bounty-funding/; DEMO.bounties gained the funding-side object the 201 note promised ({status SUBMITTED/APPROVED/ACTIVE/COMPLETED, raised, backers, by, duration} — goal IS the reward; dev-side lifecycle on /app/bounties/ untouched and re-smoke-tested); KPIs from aggregates ($5,400 of $8,250 · 4 active w/ blue "pending approval" sub · 36 purple · 1 completed amber — colored sub-lines via new is-blue/is-purple/is-amber); stacked row-cards w/ dual text chips (status vocab + EXPERT red/ADVANCED orange/INTERMEDIATE amber via new chip--expert/--adv), 3-col progress/backers/duration, skills chips w/ "+n more", green Estimated Reward rail, Fund + eye buttons; COMPLETED/own-request Fund disabled w/ aria-disabled + tooltip (click-through asserted inert); $50-min Fund modal persists gefi-app-bounty-funding, updates bar/backers, survives reload; Newest/Ending Soon/Most Funded sorts reorder (asserted leads); eye detail modal w/ full KV; Request form files SUBMITTED row + disabled card; hub 223 re-verified on the reconciled aggregates)

### Reports & compliance wing
- [x] 226 — Reports (merge the two competing Reports pages) — done (/app/reports/; left panel: sentiment meter 75% Bullish (bar width asserted), USD 102.4 +0.3% green / GDP 2.8% Stable stats, amber Fed callout (app-lt-notice, computed rgb(245,158,11)) w/ "prediction, not advice" copy; right Investor Reports card DERIVED from the generated performance+client rows (3 Ready rows + Download, asserted equal to source array); four DARK category panels w/ distinct colored left accents (new app-rp-cat--brand/red/amber/green, computed-style asserted dark bg + 4 distinct border colors) nesting rows w/ Generated/Pending chips, fmt.date dates (all 11 asserted vs the ONE format regex), eye + download icon buttons; Generate modal (pagehead #generate link + panel button + Quick Action tiles w/ preset category) queues Pending row in gefi-app-reports flipping to Generated after 1.5s and surviving reload; eye = SAMPLE-stamped summary modal, download = clipboard copy + toast)
- [x] 227 — Compliance Reports + Risk Reports — done (/app/compliance-reports/ + /app/risk-reports/ sharing compliance-risk.js; compliance: 6-KPI strip computed from the array (6 / 4 green / 1 amber / 1 red / 67% indigo / Due This Week 2 orange — replaces the reference's impossible "Overdue 6", asserted ≤ total), live search/type/status/due-window filters (Violation → exactly Model Governance card), 2-col cards w/ status + "X RISK" pills (new sev-* chip vocab, text-labelled + distinct colors asserted), Regulations chips, Coverage indigo/Findings/Next-Due stats (dates in the ONE format), View Details modal w/ KV + per-finding rows + real focus trap (Tab wraps, Escape closes — both asserted), Download + Export All clipboard w/ SAMPLE stamp (6 stamped blocks asserted); risk: KPI strip 6 / C1 red / H2 orange / M2 amber / L1 green / Total VaR(95) $1,020,125 indigo SUMMED from rows (reference's fabricated $3.05M dropped), severity-colored score bars w/ "Risk Score n/100" text (4 distinct computed colors), signed trend deltas tone-mapped bad-is-up (rising risk red — asserted), type/severity filters, detail modal + Export All)
- [x] 228 — Custom Report Builder — done (/app/custom-reports/; Builder|My Reports|Templates segments; builder form w/ per-field inline errors (empty submit → 4 alerts name/type/range/≥1-viz, focus jumps to first invalid, NOTHING stored — asserted; fixing fields clears their errors), 6 visualization checkboxes, public toggle; valid create lands in My Reports (Ready chip + blue schedule badge + Public chip + "n visualizations" sub) persisted in gefi-app-custom-reports across reload; Run stamps last-run, Edit prefills builder + "Save Changes" updates in place (no dupes — asserted 1 row after rename), Delete typed-confirm (wrong name rejected, right name deletes → designed empty state); 3 template cards prefill the builder in create mode (viz set asserted); Reset arms a Confirm step when dirty before clearing; Export All copies SAMPLE-stamped list and explains itself when empty)
- [x] 229 — Regulator Overview (4 segments) — done (/app/regulator/; search + All Categories + period filterbar + Export Dashboard (valid JSON w/ sample:true + embedded KPIs, asserted parseable); four hash-routed segments (#overview/#analytics/#activity/#insights all asserted); 3x3 KPI grid from DEMO.regulator scalars (142 +12% · 18 pending "3 due" amber · 87.3% · 23 flagged "3 critical" red · 156 green · 15 blue · 94.2% · 4.8 days · 3 critical red); Analytics DERIVED from the same scalars: audit-type bars sum exactly 142, issue bars sum exactly 23 w/ Critical bar = 3 (both asserted), compliance trend ends at 87.3%, perf KV; three dashed quick-action tiles (red/blue accent variants) → modals appending to Recent Activity (issue round-trip lands top of feed w/ red tile + critical chip, persists in gefi-app-regulator; audit + communication asserted too); feed rows w/ colored icon tiles (ok/bad/doc/chat), entity IDs (#MT-4521), org + severity chips; Upcoming Audits w/ lowercase priority pills + "owner • Mon D, YYYY" + View links; Insights = four DARK banners (computed dark bg + 4 distinct left accents) sourced from new DEMO.regulator.insights)
- [x] 230 — Regulator sub-pages (the five 404 tabs) — done (reg-model-audits / reg-dataset-audits / reg-issues / reg-communications / reg-standards, one shared reg-pages.js; DEMO.regulator extended w/ modelAudits×5 + findings timelines, datasetAudits×4 (Coverage/PII/License cols), issues×5 w/ SLA dates (3 criticals = the Overview KPI), threads×3 w/ messages, standardsList×4 w/ requirements — IDs cross-reference the Overview feed (#MT-4521/#ML-3456/#DS-8834/#CS-9912); asserted: all five tabs render real content w/ "Regulator Not Found" NOWHERE; audit tables w/ severity+status chips, filters, View detail modal w/ findings timeline; deep link #ML-3456 auto-opens its row's modal (hash-follow both audit pages); issues page: KPI row from the array, SLA countdown red-overdue/amber-≤3-days (computed colors asserted), entity links → audit-page row hashes, Resolve → moves card to Resolved, KPIs 5→4 open/3→2 critical AND Overview re-renders 22 flagged/2 critical w/ bars re-summing 22 (shared gefi-app-regulator); communications: split thread list w/ unread dots (auto-cleared on open) + bubble view + composer appending persisted "you" bubbles; standards: 4 cards (Adopted/Draft + version chips, honest "4 of 15 shown" note) w/ aria-synced requirements accordions)
- [x] 231 — zKML Verification surface — done (/app/zkml/ from the hackathon deck; explainer strip (Proof Generation / Proof Verification / Elapsed Time wall-vs-task); Verify form w/ all 92 catalogue models + 2–8 shard range slider; deterministic mock pipeline: seeded per-shard tick durations animate a 5-stage stepper (Compile WASM → Create n shards → Prove shards → Aggregate → Verify, running/done states) + parallel shard lanes (progress bars + queued/proving/proved chips, green tracks at 100%); mono prover log streams seeded lines ("Shard 0 verification succeeded (task time Ys)", "Total wall clock time: N secs", proof hash) auto-scrolled (asserted ≤4px from bottom); summary card w/ green Verified chip + "sample verification" label + truncated FNV-1a hash of model|shards — asserted STABLE across two identical runs (0xdabc951a…) and different for 6 shards; completed run survives reload via gefi-app-zkml (stepper+log+summary rehydrate); designed empty states before first run; links out to the 12 federated catalogue models (resolve 200); /app/dev/ quick-action entry link confirmed; zero page errors)

### Cross-cutting
- [x] 232 — Consistency + accessibility sweep — done (automated Playwright audit over ALL 45 /app/ pages enforcing the twelve §5 rules: KPI anatomy, one segmented style + aria-selected, raw-ISO/slash-date scan, $-without-separators scan, chip-has-text + meter-has-label (no color-only status), exactly-one-active-tab, modal role=dialog+aria-modal, keyboard segment walk (ArrowRight moves selection+focus), console errors, deduped internal-link resolution, per-chip-class AA contrast vs alpha-composited backgrounds; round 1 found 11 violations in 2 buckets — (a) investor subtab "AI Models" → /app/ai-models/ 404 on 5 pages, fixed to /app/portfolio-models/; (b) 10 chip classes at 4.06–4.25:1 (red/blue/brand-purple text on own tints), fixed w/ chip-scoped lighter foregrounds #F87171/#60A5FA/#9A8EFF (≈5.7–6.2:1, tokens untouched); everything else was already clean (0 date/money/anatomy/tab/aria/console violations — §5 discipline held through 200-series); round 2 re-run: 45 pages, 0 violations; full findings in tasks/reports/ui-followup-audit.md)
- [ ] 233 — Decision task: unify marketing site on the dark system? — AWAITING OWNER (not self-answered; both palettes are codified — design-system-v2 §1 dark app prefix + §6 light-mode token mapping — so either call is a mechanical follow-up)

### Backend workstream (300-series — what the UIs assume but the repo lacks)
- [x] 300 — API contract pack: envelope conventions + OpenAPI skeletons — done (api/openapi/_envelope.yaml: bearer+API-key schemes, Limit/Cursor params + Page{next_cursor}, Error{code,message,details[],request_id}, required Idempotency-Key on mutating POSTs w/ 24h replay semantics, X-GeFi-Sample + X-Request-Id headers, SseEvent framing convention (resource.verb events, monotonic ids for Last-Event-ID, ping heartbeats), shared Error/RateLimited responses; 18 service skeletons generated from the §7 gap table (auth 8 ops, portfolio 9, rebalance 7, marketplace 12, models-runtime 4 — incl. the existing /models/{slug}/run contract, trading 10 w/ SSE quote stream, backtesting 8 w/ SSE progress, devconsole 12 w/ SSE logs, collab 8, data-platform 9, funding 7, learning 4, reports 9, regulator 11 incl. /entities/{ref} cross-id lookup, notifications 7, insights 5 w/ Claude-behind-flag note, zkml 7 w/ SSE prover events, platform 8 incl. /audit-chain/{run_id} for the trust-center verifier — 145 stubbed operations, all $ref-ing the envelope); api/README.md documents contract→mock→client→real flow + the binding live-with-fallback rule; api/+backend/ added to _config.yml exclude; verified: all 19 YAMLs yaml.safe_load clean, build green, _site contains no api/ or backend/)
- [x] 301 — Mock API server implementing the contracts from `GeFi.DEMO` — done (backend/mock/server.js, Node zero-deps; loads dashboard.js + app-demo-data.js via a vm shim so the mock serves the EXACT dataset the UI renders (92 models, 26 DEMO collections, same seed/rng); coverage by construction: startup scans api/openapi/*.yaml into a route table (145 routes) and exits(1) on any contract route without a handler OR handler without a contract route; envelope enforced: X-GeFi-Sample+X-Request-Id on every response, uniform error object, limit/cursor→next_cursor pagination, Idempotency-Key REQUIRED on mutating POSTs (missing → validation_failed, repeat → replay w/ X-GeFi-Idempotent-Replay); in-memory mutations (orders fill, watchlist, contributions w/ escrow + min enforcement + funded flip, bounty claim/submit/review, issue resolve, report pending→generated after 1.5s, dataset ingest, zkml verifications w/ the same FNV hash as the UI) reset on restart; 4 SSE endpoints (quotes/backtest progress/training logs/zkml prover) w/ named events + monotonic ids + ping heartbeats; CORS localhost-only; smoke.sh: 21/21 green (one check per service + error envelope + idempotency-required + SSE frame shape; first run caught a ${data:-{}} brace-mangling bug in the script itself); no stray processes or artifacts after runs; build green, _site contains no backend/)
- [x] 302 — Client data layer — done (assets/js/app/api.js: GeFi.api.get/post over site.api.base_url — sessionStorage gefi-api-base override → meta[gefi-api-base] (site.api.base_url, defaulted to the task-301 mock on :8788 in non-production builds only) → sample; 2s timeout + 1 retry; on failure/non-2xx falls back to a registered GeFi.DEMO resolver, marking the result sample:true; GeFi.api.stream wraps EventSource w/ a seeded-simulation fallback (same call site, live flag tells the caller which); GeFi.api.page(fn) is the ONE boot gate — probes once, hydrates GeFi.DEMO from the live endpoints when the mock answers, then flips a truthful data-gefi-mode attribute + fixed corner badge (never silently presents sample as live); ALL 29 page scripts migrated from the bare DOMContentLoaded boot to api.page(); market-data.js's stream now runs through GeFi.api.stream (live SSE quote.tick from the mock vs the prior seeded interval, same rendering); _layouts/app.html loads api.js right after app-demo-data.js and injects the meta tag; _includes/head.html's CSP connect-src extends to site.api.base_url / the dev mock only outside production (verified: production build's CSP is untouched, no meta tag, single api.js script tag). Verification caught and fixed one real bug: the mock's POST /orders response was missing price/type/strategy/pnl vs the seeded schema, which crashed order-history's renderer on the very first live-filled row — fixed in backend/mock/server.js, re-smoked 21/21. Full pass: (a) fallback/offline — production pre-migration build (worktree at the prior commit) vs the migrated build, 45 pages hashed via a stripped-interval capture, BYTE-EQUAL innerHTML on every page, zero console errors; (b) live/mock running — dev build w/ CSP allowance: live badge, a server-side order POST hydrates into /app/order-history/, a server-side $1,234 contribution moves the live /app/funding/ KPI to the exact expected total, Start Stream consumes the mock's SSE ticks (t-live rows), and — separately — a clean context with an explicit empty override shows the honest SAMPLE badge + api.get() resolver marked sample:true; zero page errors in both runs; test/worktree artifacts cleaned up, final production build reconfirmed green): live-with-fallback (`assets/js/app/api.js`)
- [x] 303 — Auth & identity service + auth screens — done (api/openapi/auth.yaml filled in: register/login/refresh/logout/me/sessions-list/sessions-revoke/personas/orgs w/ User+AuthResult+Session+PersonaGrant schemas, 401/409/422 paths documented; mock implements it with an in-memory user store — 5 seeded persona accounts (investor/developer/data-provider/regulator/admin @demo.gefi, password demo1234), JWT-shaped opaque tokens + refresh tokens, real session tracking w/ device/ip/current, an unknown email registers a fresh guest so the mock never dead-ends, a KNOWN email + wrong password is the one deterministic 401; app/signin.md (password + visible-toggle, SSO outline buttons, 2FA step w/ demo code 000000, error states), app/signup.md (3 persona cards w/ aria-pressed, live password-strength meter, auto-login on create), app/settings.md (profile fields, avatar upload/remove w/ instant topbar reflection, language select, theme segments, Active Sessions w/ revoke, danger zone w/ typed-confirm delete) — all on a new app-solo layout (topbar without persona tabs, via a `bare` topbar flag); login stores gefi-app-token + hydrates the topbar avatar globally from components.js (initials or uploaded image, on EVERY /app/ page, no per-page wiring); fallback mode signs in offline as the seeded sample investor. Fixed a real data-layer bug this task surfaced: api.js could not tell "server unreachable" from "server said 401", so a wrong password would have silently fallen back to a successful sample sign-in — HTTP errors now carry httpStatus/body, are never retried, and never fall back (verified explicitly). Verified: mock smoke 21/21; Playwright 22/22 across live + fallback (2FA gate incl. wrong-code rejection, persona-based redirect, avatar hydration + cross-page + reload persistence, wrong-password real error, profile save round-trip + persistence, avatar upload, session revoke, sign-out clearing, persona selection, strength meter, sign-up auto-login, offline sign-in); byte-equal re-check confirms all 45 existing pages render identically in fallback mode after the api.js change; production build green w/ CSP untouched)
- [x] 304 — Portfolio & risk service — done (api/openapi/portfolio.yaml filled in: PortfolioSummary (value 142500 / cash 12750 / day+monthly+ytd deltas / seeded valueSeries+benchSeries), Holding, Transaction, WatchlistRow (w/ 24-pt spark), AllocationSlice ("slices sum to exactly 100"), RiskMetrics (sharpe/drawdown/beta/alpha/vol/var95 + benchmarks + concentration/sectors/regions), Performance w/ period param — every shape mirrors the canonical §4 figures so live and sample render the same strings; mock serves them from DEMO, with /portfolio/performance SLICING the canonical seeded series per period (1m→21, 3m→63, 6m→126, 1y→180 pts) instead of inventing a second, disagreeing generator; api.js hydrates holdings/transactions/allocation alongside the existing jobs and registers fallback resolvers for performance/transactions/watchlist-delete; the watchlist star now round-trips through the contract (star → POST /watchlist, unstar → DELETE /watchlist/{ticker}), resolving locally when offline so the interaction is identical either way. Fixed a second real mock bug this surfaced: the watchlist handlers keyed on `symbol` while DEMO.watchlist rows use `ticker`, so DELETE could never remove a seeded row and POST produced rows that didn't match the schema — both now key on ticker, POST also rejects duplicates (409) and generates a seeded price+spark. Verified: mock smoke 21/21; endpoint checks (1m slice = 21 pts, allocation sums 100, POST/dup-409/DELETE-seeded round-trip); Playwright 8/8 — live and sample modes render all 31 KPI/hero/meter figures across /app/, /app/holdings/, /app/analytics/, /app/performance/, /app/ai-portfolio/ byte-identically (incl. the canonical $142,500), unstar→DELETE and re-star→POST both confirmed against the mock (6→5→6 rows), star still toggles offline; 45-page byte-equal fallback baseline still intact; build green)
- [x] 305 — Rebalancing engine — done (api/openapi/rebalance.yaml filled in: GET /rebalance/drift (rows + targets + current + max_drift + settings + last_rebalance), PUT /rebalance/targets, GET/POST /rebalance/proposals, GET/POST /rebalance/executions, GET/PATCH /rebalance/settings, w/ Weights/DriftRow/Trade/Proposal/Settings/Execution schemas; NEW assets/js/app/rebalance-math.js holds the drift/trade math as pure functions (MIN_DRIFT_PCT 1, ROUND_TO $500, driftRows/maxDrift/totalTarget/trades/proposal/applied) and is loaded by BOTH the page (app_scripts) and the mock (through the same vm shim, which now fails fast if it's missing) — so identical sliders cannot propose different trades; page 209 rewired to the shared math + optimistic execute through POST /rebalance/executions (applies locally at once, then records server-side; data-rb-executed carries the returned id, "local" offline); mock computes everything server-side from the same module, seeds targets from the canonical allocation w/ the same slightly-drifted current weights the page defaults to, rejects targets that don't sum to 100 (422) and moves current onto targets on execute. Verified: mock boots at 149 routes all handled; endpoint checks (drift 3% max, proposal Sell Stocks $4,500 / Buy Bonds $4,500, 105% execute → 422, valid execute → drift 0 + "just now"); Playwright 12/12 — three slider positions each produce byte-identical proposals in live and sample modes (e.g. 55/20/10/10/5 → Buy Stocks $10,000, Sell Bonds $3,000, Sell Real Estate $7,000), 105% disables Execute with an explanatory total, execute round-trip updates Last Rebalance → "just now" and drift → 0.0% with exec-1 stored on the mock, and execute also works offline; smoke 21/21; fallback baseline unchanged on 44 pages — /app/rebalance/ differs by exactly the 31-byte data-rb-root wrapper this task added, with all rendered figures and trades verified identical, so the baseline was updated)
- [x] 306 — Marketplace, subscriptions & recommendations — done (api/openapi/marketplace.yaml filled in: catalog list w/ wing/risk/federated/q/max_price/sort/pagination + unpaginated `total`, model detail, ratings (summary + histogram + POST w/ 1–5 validation), NEW /categories (real counts + entry_price + federated_count + total_models) and NEW /developers (search + verified filter), preferences GET/PUT, recommendations (derived from stored prefs, echoes `based_on`), trending (seeded), subscriptions CRUD w/ a billing stub (plan, monthly_fee, next_renewal, status) — the BILLING GAP is documented explicitly at the top of the contract: no payment is taken, no card is stored, and a real provider would own payment methods/invoices/proration/dunning/tax; /billing/invoices returns derived sample statements, marked status "sample"; NEW assets/js/app/catalog.js holds pricing (risk-banded base + seeded spread), filtering, sorting, category grouping, preference-driven recommendation and seeded trending/ratings as pure functions, loaded by BOTH the marketplace pages and the mock (shim now fails fast without it) — the same pattern task 305 established, so identical filters cannot return different sets; pages 213/215 + 208's Recommended/Subscribe rewired: subscribe is optimistic then confirmed through POST /subscriptions (data-sub-id carries the server id, "local" offline), preferences persist through PUT /preferences, and cards now show the monthly fee (price filtering is meaningless if the price is invisible); developers hydrate from /developers; page 214 keeps its build-time Jekyll render — converting a correct, instant, static count into a fetch would be a regression, so instead the test asserts the page KPI and the endpoint agree. Fixed nothing broken this round but tightened three mock handlers: ratings now 422 on out-of-range stars, subscribe 404s an unknown slug and 409s a duplicate, and DELETE /subscriptions accepts either the id or the slug (the UI knows the slug). Verified: mock boots at 151 routes all handled; endpoint checks (92 total, 24 families summing to 92, risk=low 25, federated 12, q=credit 5, max_price=100 8, sort=price ascending, verified developers 5/6); Playwright 20/20 — five filter configurations produce byte-identical result sets AND prices in live and sample modes (incl. the empty-state case), browse reports 92 of 92, the Categories page KPI agrees with /categories, subscribe creates a server record w/ the billing stub and survives reload, a duplicate is refused 409, subscribing offline flips the button locally, preference-driven recommendations are identical in both modes and persist server-side, developers render in both modes; smoke 21/21; fallback baseline unchanged on 44 pages — /app/marketplace/ grew by the one price line per card (18 lines on 18 cards, same models, same order, verified), so the baseline was updated)
- [x] 307 — Model runtime & inference (`/v1/models/{slug}/run` for real) — done (NEW assets/js/model-runtime.js holds the deterministic scorer extracted VERBATIM from model-demo.js's mock() — the only edit is that the demo config arrives as a parameter instead of a closure variable; model-demo.js now delegates in three lines and is otherwise untouched, and `_layouts/model.html` was not touched at all (the module loads from _includes/head.html, gated on `page.demo`, so only demo pages fetch it and non-demo pages are unchanged). Extraction proved byte-identical against the pre-change function across 35 (config, input) pairs covering all six output kinds. api/openapi/models-runtime.yaml filled in to match the EXISTING harness exactly: request is `{ inputs: {...} }` (what the harness posts today, NOT a flat object — corrected after reading the code), response is the RunResult whose `kind` selects the renderer (score/curve/bars/table/waterfall/text), and the documented tolerance that the harness accepts either the bare result or `{result: ...}` and degrades to text when `kind` is missing; plus async run (202 + job), job fetch, SSE progress (run.progress → run.completed), metrics w/ metrics_as_of and a refresh endpoint. Mock implements run for all 92 slugs by reading each page's OWN embedded demo config out of the built HTML (single source of truth — no second copy to drift) and calling the shared runtime. Two real integration bugs surfaced and fixed: (a) the shipped harness sends NO Idempotency-Key, but the mock demanded one on every POST, so the real demo could not talk to the mock at all — enforcement is now contract-driven (the mock scans which POST routes actually declare the header and enforces only those; /run documents it as explicitly optional since a deterministic run is safe to replay, while every other mutating POST still requires it, asserted both ways); (b) the smoke check for models-runtime was asserting a placeholder shape that never matched the harness, now asserts the real contract. Verified: 368 run comparisons across ALL 92 models × 4 input sets — every one byte-identical between the mock API and the client scorer (kinds exercised: table 188, curve 96, score 68, text 8, waterfall 4, bars 4); async job + SSE + metrics + 404 checked by curl; Playwright on four pages covering waterfall/curve/score/bars — identical rendered output live vs offline, identical structure, consistent sample labelling, and the live path genuinely exercised (status "Run complete." vs "Sample run complete."), after fixing the test twice: the harness captures cfg at script load so the endpoint must be rewritten in flight, and production CSP correctly blocks localhost so live tests need the dev build; catalogue audit 92/92 pages with demo configs; smoke 21/21; all 45 app pages still byte-equal in fallback; production build green w/ CSP untouched)
- [x] 308 — Trading & market-data streaming — done (NEW assets/js/app/market.js holds the seeded price walk and the paper-fill rules as pure functions — BASE opening prices, priceAt/seriesAt (recomputed from the seed rather than accumulated, so any caller lands on the same number for a given tick without having watched every step), fillPrice (market fills at once; limit fills only when crossed, buy price<=limit / sell price>=limit; stop the mirror image) and positions (opening book + filled orders) — loaded by BOTH the trading page and the mock through the same vm shim (which fails fast without it), the pattern tasks 305/306 established; verified the recomputed walk is identical to the incremental one the page used before. api/openapi/trading.yaml filled in (v0.2.0): quotes single + SSE stream, order place (idempotent) / cancel / list w/ filters + pagination, positions, bots, paper-reset, w/ Quote/Order/Position/Bot schemas and a PAPER TRADING ONLY note at the top — no broker, no real money, no market access. api/openapi/data-platform.yaml gained the market-data source catalog, preview rows and preview stream. Pages 210/211/220 switched to the API. **Two real bugs surfaced and fixed, both created by wiring the pages to a server that now has its own state:** (a) client and server kept INDEPENDENT tick clocks, so a fill printed by the server and a fill printed offline disagreed (live 232.40 vs offline 232.18) — the order request now carries the tick the trader was actually looking at, documented in the contract as exactly that, and the server fills at the price the client was showing; the page publishes its position in the walk as data-lt-tick so the agreement is checkable from outside; (b) 211 merges its own sessionStorage copy of each fill with the ledger the server sends, so once the server knew about the order the SAME trade was listed twice (SES-100 and ORD-9003, both AAPL 7 @ $232.61) — the local echo is now dropped when the server owns the record, while offline fills (no server id) still reach the table. Verified: mock boots at 154 contract routes, all handled; curl checks (market fill, limit stays pending, 422 on a missing trigger, 404 unknown symbol, positions, cancel 409, preview rows); Playwright 15/15 — the quote on screen is the server's price at the page's own tick (1 → 232.61) and the server's walk genuinely moves with the tick (0→232.40, 1→232.61, 5→232.52) so the check can't pass on a constant, the order fills through the API and is recorded server-side, positions update (AAPL 60 @ avg 227.19), the fill renders EXACTLY ONCE in 211 after reload and it is the server record not the local echo, the SSE quote stream advances the shared walk, an unreachable limit stays pending and cancels, offline the whole flow still works and says "(simulated)" rather than "(paper account)", the fill price is the same number in both modes, and market-data preview rows are identical in both modes and byte-equal to what /preview returns; smoke 21/21; fallback baseline — /app/live-trading/ differs by exactly the data-lt-root wrapper + the runtime tick attribute (+48 bytes), proven by diffing the rendered body against a build of the previous commit rather than inferred from the byte count, so the baseline was updated; the 211 dedup is invisible offline as designed and all 45 pages are byte-identical after it; production build green w/ CSP still excluding localhost)
- [x] 309 — Backtesting service — done (NEW assets/js/app/backtest-math.js holds the simulated run as pure functions, loaded by BOTH page 212 and the mock through the same vm shim — the pattern 305/306/307/308 established. The engine's design point: the EQUITY CURVE is generated first and every headline metric is MEASURED OFF IT (annualised return from start/end over the window, max drawdown from the running peak, Sharpe from the per-step returns, win rate from their signs), so the results table, the analysis chart, the per-trade breakdown and the comparison overlay cannot contradict each other — before this the page drew its metrics from independent random calls and nothing tied them together. A model is given a TRUE annualised Sharpe and the drift is solved backwards from it, which makes a 1y window report a noisy estimate and a 5y window converge (0.94 true → 2.55/1.86/0.83 realised at 1y/2y/5y): that sampling error is real statistics, not decoration, and is what a backtest of that length would actually show. Earlier tuning produced Sharpes of 3–4, which would read as obviously fake to the audience this page is for, so the edges were lowered and the drift/vol relationship made explicit. api/openapi/backtesting.yaml filled in (v0.2.0): create (202 + queued run), list w/ status filter, get, SSE progress, full results (curve + stats + trade rows), NEW /backtests/compare (n runs resampled onto a shared axis), optimizer sweep POST/GET/detail, historical bars, w/ BacktestRequest/Metrics/Backtest/BacktestResults/OptimizerRun/OptimizerRow/Bar schemas and a SIMULATED RESULTS ONLY note at the top saying plainly that nothing here is evidence a strategy works. Mock runs everything through the shared engine and streams progress whose step sequence is derived from the run id, so a client that loses the stream and finishes locally walks the same percentages. Page 212 rewired end to end: create through POST /backtests, progress bar driven by SSE live and by the identical local sequence offline, and the three segments that were honest-but-empty placeholders (Optimizer, Analysis, Comparison) now carry real content in both modes — a ranked 12-combination parameter sweep, an equity curve w/ per-trade table, and a multi-curve overlay. **Three coherence problems found and fixed:** (a) the seeded run history referenced models the dropdown does not offer (Breakout Signal Engine, Cross-Sectional Mean Reversion, Carry Trade Optimizer), so every row in the results table was a dead end you could not re-run — the history is now runs of the three models the environment actually has, and the test asserts no row names a model the dropdown lacks; (b) "Custom Range" collected no dates and passed the literal string "custom", so a range that looked configurable was a fixed one — it now collects start and end, is labelled by its dates, and is validated (coverage starts 2020-01-01, end after start) by the same rule on both sides; (c) the coverage date existed twice, once in the engine and once as a hardcoded `min` in the markup, so native validation and the engine could drift apart — the input's bound is now read from the engine and the test asserts they are the same date. Also labelled the sweep table with which model and window it is a sweep of, since the panel opens on a default. Verified: mock boots at 156 contract routes, all handled; curl checks (422 unknown model, 422 pre-coverage start, custom window accepted and labelled by its dates, results shape, compare w/ 422 on one id and on an unknown id, 404, optimizer ranking); Playwright 24/24 — results table identical in both modes, every history model re-runnable, live run created through the API w/ the bar climbing 0→17→37→58→76→94→100 driven by SSE, the mock recording it completed, the SAME inputs producing IDENTICAL metrics offline and a DIFFERENT window producing different ones (so the check isn't vacuous), the run surviving reload unchanged from server state while offline runs honestly do not, an inverted window refused with the same words on both sides, the sweep ranking identically and picking the same winner, analysis identical w/ the headline win rate agreeing with the sampled table, and /backtests/compare returning exactly the metrics the page drew; smoke 21/21 after correcting a check that asserted a stale fixture id and a placeholder shape; fallback baseline — /app/backtesting/ is the only page that changed, growing because three empty states became real tables and charts, verified by inspecting the rendered panels (12 sweep rows, 12 trade rows + 1 curve, 2 comparison rows + 2 curves, and the one empty state that should remain is "Nothing running"), so the baseline was updated; production build green w/ CSP untouched)
- [x] 310 — Developer console ops (training / deployment / monitoring) — done (NEW assets/js/app/devops-math.js holds the console's rules and simulations as pure functions, loaded by BOTH the console pages and the mock through the same vm shim — the pattern 305–309 established: the model lifecycle (Draft→Testing→Approved→Deployed) and its one-stage-at-a-time rule, the registry's duplicate-name rule, the hyperparameter bounds and the optimizer list, the training progression, and the per-deployment telemetry. api/openapi/devconsole.yaml filled in (v0.2.0, 16 paths): models CRUD w/ lifecycle enforcement + GET one, NEW /dev/hyperparameters publishing the bounds the server validates against, training jobs create/list/get/pause/resume/SSE-progress/logs, deployments list/create/toggle/logs, telemetry w/ a refresh counter, activity feed, alert rules CRUD, w/ DevModel/TrainingRequest/TrainingJob/Deployment/Telemetry/Fleet/Activity/AlertRule schemas and a SIMULATED OPERATIONS note at the top. Mock implements all of it against the shared engine and streams training progress whose step sequence is derived from the job name, so a client that loses the stream and finishes locally walks the same percentages. Pages 216/217 rewired: models created through POST /dev/models (draft card comes back from the registry and survives a reload), training jobs created through POST w/ SSE-driven bars and pause/resume through the API, deployments toggled through the API, monitoring pulled from /dev/telemetry. **Four coherence problems found and fixed:** (a) accuracy and loss were stored on each job INDEPENDENTLY of its progress bar, so a card could show 91.2% next to a 75% bar with nothing tying them together — both are now derived from the step, and the stale stored copies were removed from the demo data rather than left to mislead; (b) the monitoring page stated System Health 98.5% and Avg Response 43ms as CONSTANTS while the meters below them were seeded, so the headline never had to agree with anything on screen — the fleet figures are now MEASURED from the deployments that are actually serving, and the KPI reads "—/nothing serving" when none are; (c) a stopped deployment kept reporting the uptime, request count and latency it had while it was up, which reads as though it were still serving — a stopped deployment now reports zeroes, in the list and in the telemetry endpoint, and the stored values were removed from the demo data; (d) telemetry drew all four metrics in sequence from ONE seeded stream, so two deployments whose names hashed into a similar first draw showed the same headline accuracy (portfolio-optimizer and risk-analyzer both read 93.8%) — the exact copy-paste-twins problem the page's own comment claimed to have solved; each field now has its own stream. Also removed two duplicated rule copies: the training form's `min`/`max` and its method list are rendered from the engine (the markup had min="0.00001" for learning rate while the validator used 0.000001) and the registry's duplicate-name message is the engine's, so the page and the server refuse the same names in the same words. Verified: mock boots at 167 contract routes, all handled; curl checks (lifecycle jump 422, backwards 422, delete non-draft 409, duplicate 409, bad learning rate 422, telemetry rollup, stop zeroing, refresh moving the meters); Playwright 26/26 — model created w/ a server id and a Draft card that survives reload, duplicate refused identically on both sides, offline creation honest about being local, lifecycle jump refused and single-stage promotion accepted, the form's bounds and methods proven to BE the server's, an out-of-range learning rate refused in the same words, a training job driven to 100% by SSE and reading identically in both modes, stopping a deployment zeroing its fields AND the stop sticking across a reload, starting it again restoring them, every deployment's meters differing both as whole rows and field by field, the health headline equal to the server's measured figure rather than a constant, Refresh moving the meters, and full fallback parity on every shared deployment; smoke 21/21; fallback baseline — exactly the four pages this task touched changed, each delta inspected and accounted for (test hooks, the zeroed stopped deployment, the derived job figures, the measured KPIs), so the baseline was updated; production build green w/ CSP untouched)
- [x] 311 — Collaboration & bounty services — done (NEW assets/js/app/collab-math.js holds the board's rules as pure functions, loaded by BOTH the collaboration pages and the mock through the same vm shim — the claim rule, submission eligibility, filtering, invite/message validation, and the board's headline figures. api/openapi/collab.yaml filled in (v0.2.0, 12 paths): teams + NEW /teams/{id}/members, invites w/ a NEW accept stub, threads + NEW GET messages, the bounty board w/ q/status/difficulty filters and a `stats` block, NEW GET one bounty, claim, NEW release, submissions GET/POST, review, w/ Team/Member/Thread/Message/Bounty/BoardStats/Submission/Reward schemas and three plainly-stated notes at the top: THE CLAIM RULE, SIMULATED PAYOUTS (nothing is paid, `settled` is always false) and BOARD FIGURES ARE COUNTED. NEW app.toast() in components.js + CSS — the task called for the envelope error rendered as a toast and no such component existed; errors get role=alert/aria-live=assertive and twice the dwell time, because they are the ones a reader must not miss. **Three coherence problems found and fixed:** (a) the board's KPI strip stated "Active Developers 47" and "Completed 156" as CONSTANTS that no row on the page had to agree with — every figure is now COUNTED from the board, and to make those counts mean something three COMPLETED bounties with real claimants were seeded, so a reader can check the headline against the rows (the test does exactly that); (b) claims lived in sessionStorage with NO rules at all — you could claim every bounty on the board — the one-active-claim rule is now enforced server-side w/ a 409 and client-side from the same module, so the refusal reads identically either way, and completed work correctly does NOT count against the limit or a developer could only ever finish one bounty; (c) there was no way to give a claim back, so claiming the wrong bounty would strand a developer's single claim forever — NEW /bounties/{id}/release. Also: the submission COUNT is now derived from submission ROWS rather than stored beside them, board stats are computed from the WHOLE board so filtering does not move the headline, and the difficulty chip vocabulary on the funding frame was missing BEGINNER. Verified: mock boots at 173 contract routes, all handled; curl checks (board stats, filter, claim, second-claim 409, claim-already-claimed 409, submit-without-claim 409, submit → IN PROGRESS, review → COMPLETED + reward record w/ settled:false, bad verdict 422, and that completing frees the claim); Playwright 25/25 — invite appears as Invited and survives reload, duplicate invite refused in the same words on both sides, message posts and survives reload, the board KPIs identical in both modes AND countable from the rows on screen, filtering narrowing the board without moving the headline, the endpoint returning exactly the set the page rendered, claim flipping OPEN→CLAIMED server-side and surviving reload, a second claim refused with 409 and rendered as a toast carrying the ENVELOPE'S OWN message announced assertively, the refused bounty left untouched, release freeing the claim, the same one-claim rule and wording offline, and the funding frame reading the same seven-bounty board; smoke 21/21; fallback baseline — four pages changed: the three this task rewrote plus /app/funding/ by exactly ONE byte, traced to the Bounty Funding rollup going $5,400 → $10,000 as the three completed bounties' backing joined the total, with the other two figures happening to keep their widths; production build green w/ CSP untouched)
- [x] 312 — Data platform (datasets, quality, revenue) — done (NEW assets/js/app/dataplatform-math.js holds pricing, quality scoring and revenue accounting as pure functions, loaded by BOTH the provider pages and the mock through the same vm shim. **The accounting rule this task exists to enforce:** a dataset's revenue is DERIVED from its line items — downloads at its own download price, plus subscriptions at its own monthly rate over a stated 12-month window — and every aggregate is the sum of those. Previously revenue was a STORED scalar per dataset with no relationship to the downloads and subscriber counts printed beside it, so the numbers could not be checked and only agreed across tabs because both read the same stored field; now the total is provably the sum of 20 line items, the twelve-month series sums EXACTLY to that total (the last month absorbs the rounding rather than the total being quietly wrong), and the ten per-dataset bars on the Revenue tab add up to the headline. The stored `revenue` and `quality` fields were removed from the demo data so there is no second copy to drift; only ACTIVITY (downloads, subscribers) is stored. api/openapi/data-platform.yaml raised to v0.2.0 w/ THE ACCOUNTING RULE, UPLOAD LIFECYCLE and SIMULATED MONEY stated at the top: registry list w/ status/category filters, register (202 → processing), get, NEW PATCH (name and category only — quality and revenue are derived and cannot be set, which is what makes the aggregates trustworthy), typed-confirm archive, quality breakdown, dataset subscriptions, revenue summary that returns ITS OWN LINE ITEMS so a client can check the arithmetic rather than trust it, payout schedule taken off the same series, NEW /provider/activity, w/ Dataset/LineItem/RevenueSummary/DatasetSubscription/Payout schemas. **Three honesty problems fixed:** (a) an uploaded dataset published with a hardcoded quality of 8.6 and rows "1M" regardless of what it was — the score is now seeded per dataset and a dataset that is still processing has NO score and earns nothing, rather than a flattering default; (b) archiving was local-only and the typed confirmation was checked only in the browser — it now round-trips w/ the same rule applied on both sides, and the test confirms a mismatched confirmation leaves the dataset untouched server-side; (c) the payout schedule and the revenue chart were computed independently and could disagree — both now come off the shared monthly series. Verified: mock boots at 175 contract routes, all handled; curl checks (summary reconciling to its line items and to its monthly series, upload → processing → published w/ quality null while unaudited, duplicate 409, archive 422 on a wrong confirmation then success, and the archived row leaving the listing); Playwright 24/24 — the task's own acceptance criterion asserted literally (the Revenue tab total is the SAME STRING as the Overview KPI, in both modes, and the same string in both), the total equal to the sum of its line items AND to the sum of the monthly series, the page rendering the accounting's own figure, upload round-trip reaching published w/ a server id and surviving reload, a brand-new dataset earning NOTHING (no invented revenue), duplicate refused identically, typed-confirm archive refused on a mismatch and leaving the server untouched then deleting server-side, the listing losing the row after reload, the two tabs still agreeing AFTER the archive, and the offline upload honest about being local while still reaching published; smoke 21/21; fallback baseline — exactly the three provider pages changed, each delta inspected and the arithmetic re-checked by hand (bars sum to the headline, monthly = total/12, avg = total/earning datasets), so the baseline was updated; production build green w/ CSP untouched)
- [x] 313 — Funding services (projects, contributions, approvals) — done (NEW assets/js/app/funding-math.js holds the contribution rules and every hub aggregate as pure functions, loaded by BOTH the funding pages and the mock through the same vm shim. api/openapi/funding.yaml filled in (v0.2.0, 8 paths): campaigns w/ kind/status/risk filters, NEW GET one, request funding (→ submitted), approve stub, contribute, contributions per campaign, NEW /funding/contributions (mine), NEW /funding/summary (the hub's figures and the counts they were taken over), payouts and ROI records, w/ Project/Contribution/HubSummary/Payout/RoiRecord schemas and four notes stated plainly at the top: HUB FIGURES ARE COMPUTED FROM THE SAME ROWS, NO MONEY MOVES (no payment taken, no card stored, nothing held or transferred; a real implementation would need a payment provider, escrow and — because these are investment-like offerings — the securities and KYC treatment for its jurisdictions, NONE of which exists, and nothing here is an offer or solicitation), CONTRIBUTION RULES, and that ROI records are simulated and not a forecast or a promise. **Three real problems found and fixed:** (a) the funding hub read the raw stored `raised` while the Bot/Model tabs added the session's own contributions on top as a separate overlay, so backing a campaign made the hub and the tab DISAGREE IMMEDIATELY — the exact failure the hub's own header comment says it exists to prevent; contributions are now applied to the campaign ROW as the server applies them, the overlay is gone, and the hub reads the same rows the tabs render (the test asserts the headline equals the sum of the three summary cards, equals the service's figure, AND equals the sum of the raw project and bounty lists, then re-asserts it after a contribution); (b) there was no over-goal rule — you could push a campaign past 100% raised — now refused w/ 422 and the same wording client-side, and the goal-reach flip to `funded` is DERIVED from raised >= goal rather than being a flag set in two places; (c) one campaign was stored as status "approved" while three others were "active" and nothing anywhere treated them differently — a label without a meaning — so the data was normalised to the four states the contract defines rather than the page silently reinterpreting it. Verified: mock boots at 178 contract routes, all handled; curl checks (hub summary, below-min 422, over-goal 422, already-funded 422, valid contribution moving raised/backers, filling the goal exactly flipping to funded w/ daysLeft 0, and the hub following); Playwright 22/22 — hub KPIs identical in both modes, the headline proven to be the sum of the cards AND of both raw lists, contributor count likewise, below-min and over-goal refused with the envelope's own words in both modes, a valid contribution raising the bar server-side and surviving reload, the hub moving by exactly the contribution and still agreeing with its cards, goal-reach flipping to funded, a funded campaign taking no more, all payout records carrying settled:false and all ROI records declaring themselves simulated, and the same over-goal rule and arithmetic offline; smoke 21/21; fallback baseline — two pages changed: /app/funding/ by the four KPI test hooks and /app/model-funding/ by exactly the one normalised status chip ("Approved" → "Active"), confirmed by diffing the rendered body against a build of the previous commit rather than inferred; production build green w/ CSP untouched)
- [ ] 314 — Learning service
- [ ] 315 — Reports & compliance engine
- [ ] 316 — Regulator portal services
- [ ] 317 — Notifications & alerts
- [ ] 318 — AI insights service
- [ ] 319 — zKML proof pipeline
- [ ] 320 — Platform cross-cutting (API keys, rate limits, audit chain, search, i18n, GDPR)
- [ ] 321 — Decision task: where the real backend runs

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

---

# 300-SERIES — BACKEND WORKSTREAM

The reference UIs assume a running platform backend that the repo does not
have: the pre-purge `server/` was removed with the old history, and the only
API contract in the codebase today is the mocked
`{{site.api.base_url}}/v1/models/{slug}/run`. The full UI→backend gap
analysis is `tasks/design-system-v2.md` §7. This workstream closes the gap
**contract-first** so UI wiring never waits on infrastructure decisions.

## 300-series conventions (in addition to the standing conventions)

- **Contract-first.** Every service task adds/extends an OpenAPI 3.1 file in
  `api/openapi/<service>.yaml` using the shared envelope from task 300. The
  contract is the deliverable; the mock implements it; the UI consumes it.
- **Mock server.** `backend/mock/` holds a dependency-free Node server
  (node:http) implementing every contract by loading
  `assets/js/app-demo-data.js` through a small GeFi shim — the canonical
  dataset stays single-source. Run: `node backend/mock/server.js` (port
  8788). State mutations live in memory per process, seeded-deterministic.
- **Live-with-fallback.** App pages call endpoints through the task-302 data
  layer; when the API is absent they fall back to `GeFi.DEMO` client-side —
  the same pattern as the model demo harness. Pages must work in BOTH modes;
  Playwright verifies both (mock running, mock stopped).
- **Excluded from the site.** `api/` and `backend/` are added to
  `_config.yml` `exclude:` in task 300; the Jekyll build must stay green and
  `_site` must not contain them.
- **Off-limits unchanged.** Never touch `infrastructure/cloudflare/` or
  `_layouts/model.html`. Real deployment is task 321, an owner decision.
- **Realtime.** Streaming surfaces standardise on SSE endpoints in the
  contracts; the mock serves them with seeded ticks; the client falls back
  to seeded local simulation.
- Design prompts: n/a for 300-series except task 303 (auth screens are a UI).

## Task 300 — API contract pack
Unblocks: every other 300-series task; gives 200-series pages stable paths.

**Code prompt:**
> Create `api/openapi/_envelope.yaml` defining shared components: bearer +
> API-key auth schemes, cursor pagination (`limit`/`cursor`/`next_cursor`),
> the error object (`code`, `message`, `details[]`, `request_id`), idempotency
> keys for mutating POSTs, `X-GeFi-Sample: true` header semantics for mock
> responses, and SSE event framing conventions. Create skeleton
> `api/openapi/<service>.yaml` files for: auth, portfolio, rebalance,
> marketplace, models-runtime, trading, backtesting, devconsole, collab,
> data-platform, funding, learning, reports, regulator, notifications,
> insights, zkml, platform — each with info block, tag list, and the resource
> list from design-system-v2 §7 (paths stubbed, schemas referenced). Add
> `api/` and `backend/` to `_config.yml` exclude. Add `api/README.md`
> explaining contract-first flow and the live-with-fallback rule. Verify:
> every YAML parses (python3 yaml.safe_load loop); build passes; `_site`
> contains no `api/` or `backend/`.

## Task 301 — Mock API server
Unblocks: live-mode verification for all 200-series pages.

**Code prompt:**
> Build `backend/mock/server.js` (Node, no dependencies): loads
> `assets/js/app-demo-data.js` via a GeFi shim, serves every contract in
> `api/openapi/` on port 8788 with CORS for localhost, the shared envelope,
> `X-GeFi-Sample: true` on every response, in-memory mutations (orders,
> contributions, claims, resolves...) reset on restart, and SSE endpoints
> (`/v1/stream/...`) emitting seeded ticks. Add `backend/mock/README.md` and
> a route table generated from the contracts at startup (fail fast on a
> contract path with no handler — coverage by construction). Smoke script
> `backend/mock/smoke.sh` curls one endpoint per service and checks JSON
> shape. Verify: smoke passes; build stays green; server start/stop leaves
> no artifacts.

## Task 302 — Client data layer
Unblocks: converts 200-series pages from mock-only to live-with-fallback.

**Code prompt:**
> Create `assets/js/app/api.js`: `GeFi.api.get/post(path, opts)` using
> `site.api.base_url` (default `http://localhost:8788` in dev via a meta
> tag), 2s timeout, one retry, and deterministic fallback — on network
> failure or non-2xx, resolve from a registered `GeFi.DEMO` resolver for
> that path and mark the result `sample: true`; surface a subtle "sample
> data" notice hook pages already render. Add `GeFi.api.stream(path,
> onEvent)` wrapping EventSource with seeded local simulation fallback.
> Migrate every existing `app/` page's reads/writes through it (reads keep
> working identically when the API is down — assert byte-equal rendering in
> fallback mode). Verify: build; Playwright twice — mock running (live badge,
> mutations round-trip through the server) and mock stopped (fallback
> rendering identical to pre-migration), console clean in both.

## Task 303 — Auth & identity + auth screens
Unblocks: personalised state everywhere; replaces sessionStorage stubs.

**Design prompt** (append after §1 prefix):
> Design GeFi sign-in and sign-up screens plus a profile/security settings
> page: centered dark auth card with the brain logo, email + password with
> visible-toggle, SSO buttons (Google, GitHub) as outline buttons, 2FA code
> step, password strength meter, error and loading states; sign-up adds
> persona selection cards (Investor / Developer / Data Provider) with icons
> and one-line descriptions; settings page shows profile fields, avatar
> upload, language select, theme toggle, active sessions list with revoke,
> and a danger zone. Trust strip + footer as always.

**Code prompt:**
> Fill `api/openapi/auth.yaml`: register, login, refresh, logout, me,
> sessions list/revoke, profile update, persona field, org membership +
> roles (investor/developer/data-provider/regulator/admin). Mock implements
> with an in-memory user store (seeded demo user per persona; JWT-shaped
> opaque tokens). Build `app/signin.md`, `app/signup.md`, `app/settings.md`
> wired through `GeFi.api`; on login store the token (sessionStorage
> `gefi-app-token`) and hydrate the top-bar avatar + persona nav; fallback
> mode signs in as the seeded demo user. Verify: build; Playwright — login
> round-trip changes avatar and persists reload, revoke session works
> against mock, fallback sign-in works with mock stopped, console clean.

## Task 304 — Portfolio & risk service
Unblocks live mode for: 203–207 (overview, holdings, analytics, performance,
AI portfolio).

**Code prompt:**
> Fill `api/openapi/portfolio.yaml`: holdings, transactions, watchlist CRUD,
> valuation summary, performance series (period param), returns vs
> benchmark, allocation, risk metrics (sharpe/drawdown/beta/alpha/vol/var95)
> — all shapes mirroring `GeFi.DEMO` §4 canonical figures. Mock serves them
> from DEMO (series seeded). Register fallback resolvers in the data layer
> and switch pages 203–207 to `GeFi.api`. Verify: build; Playwright live +
> fallback — hero band and KPI figures identical in both modes (assert exact
> strings, e.g. "$142,500"), watchlist star round-trips through the mock,
> console clean.

## Task 305 — Rebalancing engine
Unblocks live mode for: 209.

**Code prompt:**
> Fill `api/openapi/rebalance.yaml`: GET state (targets, current, drift,
> settings), PUT targets/settings, POST proposal (returns computed trades),
> POST execute (idempotency key; returns execution record + updated state).
> Mock computes drift and proposals server-side from DEMO allocation (same
> math as the client fallback — extract the calculation into a shared pure
> function used by both, `assets/js/app/rebalance-math.js`, loaded by the
> mock through the shim). Switch page 209 to the API with optimistic UI.
> Verify: build; Playwright live + fallback — identical proposed trades for
> identical slider positions in both modes (assert), execute round-trip
> updates Last Rebalance, console clean.

## Task 306 — Marketplace, subscriptions & recommendations
Unblocks live mode for: 208 (Recommended/Subscribe), 213–215.

**Code prompt:**
> Fill `api/openapi/marketplace.yaml`: catalog list with filters (category,
> risk, price, search, sort, pagination), categories with real counts,
> developers directory, ratings summary, preferences get/put,
> recommendations (derived from preferences), trending (seeded ranking),
> subscriptions CRUD with a billing stub (plan, monthly fee, next renewal —
> no real payments; document the gap for a future billing provider).
> Mock derives the catalog from `GeFi.MODELS` via the shim. Switch pages
> 208/213/214/215 to the API. Verify: build; Playwright live + fallback —
> subscribe persists across reload in live mode (server state), filters
> return identical result sets in both modes, category counts equal 92
> total, console clean.

## Task 307 — Model runtime & inference
Unblocks: real `/v1/models/{slug}/run` behind the 92 model-page demos and
the marketplace "try" flows — without touching `_layouts/model.html`.

**Code prompt:**
> Fill `api/openapi/models-runtime.yaml` to match the EXISTING harness
> contract exactly (`POST /v1/models/{slug}/run` — the request/response
> shape `assets/js/model-demo.js` already sends/expects, per demo output
> kinds score/curve/table/text/waterfall), plus GET model metadata/metrics
> (`metrics_as_of` refresh) and an async job variant (POST run → job id,
> GET job, SSE progress) for long runs. Mock implements run for all 92
> slugs by reusing the client's seeded-mock scoring logic through the shim
> (extract it into a shared pure module first, keeping model-demo.js
> behavior byte-identical — this file may be edited only for the
> extraction, no behavior change; `_layouts/model.html` stays untouched).
> Model pages then hydrate live automatically via their existing endpoint
> config. Verify: build; catalogue audit still 92/92; Playwright on 3
> model pages (score, waterfall, curve) live + fallback — identical outputs
> for identical inputs (assert), sample labelling correct in both, console
> clean.

## Task 308 — Trading & market-data streaming
Unblocks live mode for: 210, 211, 220.

**Code prompt:**
> Fill `api/openapi/trading.yaml`: quotes (single + SSE stream), order
> place/cancel (idempotent), order list with filters + pagination,
> positions, paper-fill engine semantics (market fills at seeded price,
> limit fills when crossed), bots/strategies list (read-only seeded), and
> `api/openapi/data-platform.yaml`'s market-data source catalog + preview
> rows + preview stream. Mock runs a seeded price walk per symbol (same
> generator as the client fallback via the shared shim). Switch pages
> 210/211/220 to the API. Verify: build; Playwright live — place order,
> watch fill arrive via SSE, position updates, order appears in 211's table
> after reload (server state); fallback — full flow still works locally;
> console clean in both.

## Task 309 — Backtesting service
Unblocks live mode for: 212.

**Code prompt:**
> Fill `api/openapi/backtesting.yaml`: create backtest (model, range,
> preset), list runs, get run (metrics: sharpe, annual return, drawdown,
> trades), SSE progress, compare (n run ids), optimizer job (param grid →
> best set, seeded). Mock executes runs as seeded timed simulations
> (progress events over ~5s). Switch page 212; Results/Comparison segments
> gain live content in both modes. Verify: build; Playwright live — create
> run, progress bar driven by SSE to 100%, result row matches GET run;
> fallback — local simulation produces the same metrics for the same
> inputs (assert); console clean.

## Task 310 — Developer console ops
Unblocks live mode for: 216, 217.

**Code prompt:**
> Fill `api/openapi/devconsole.yaml`: models CRUD (lifecycle
> draft/testing/approved/deployed), training jobs (create with validated
> hyperparameters, list, pause/resume, SSE progress, GET logs), deployments
> (create per env, start/stop, GET ops metrics: uptime/requests/latency/
> error-rate series), alert rules CRUD, activity feed. Mock seeds per-model
> DISTINCT telemetry and streams training progress. Switch pages 216/217.
> Verify: build; Playwright live — create model → draft card from server,
> training job lifecycle via SSE, deployment stop zeroes live fields on
> next poll; fallback parity; monitoring meters show different values per
> model (assert inequality); console clean.

## Task 311 — Collaboration & bounty services
Unblocks live mode for: 218, and 225's bounty-side data.

**Code prompt:**
> Fill `api/openapi/collab.yaml`: teams, members, invites (create/accept
> stub), discussion threads + messages; bounties list with filters, claim
> (one active claim per user), submissions (create, list, review status),
> completion + reward record. Mock enforces claim rules and pluralization-
> ready counts. Switch pages 218 (both frames) and the bounty read-paths of
> 225. Verify: build; Playwright live — invite appears in members, message
> posts and persists reload, claim flips OPEN→CLAIMED server-side and a
> second claim attempt is rejected with the envelope error rendered as a
> toast; fallback parity; console clean.

## Task 312 — Data platform
Unblocks live mode for: 221, 222.

**Code prompt:**
> Extend `api/openapi/data-platform.yaml`: dataset registry CRUD, upload
> intent → processing → published state machine (mock advances after 2s),
> quality scoring (seeded per dataset), dataset subscriptions, revenue
> accounting (per-dataset revenue, downloads, payout schedule — aggregates
> MUST derive from line items so Overview and Revenue tabs cannot
> disagree), provider activity feed. Switch pages 221/222. Verify: build;
> Playwright live — upload round-trip reaches published, archive typed-
> confirm deletes server-side, Revenue tab totals equal Overview KPI
> (assert same string) in both modes; console clean.

## Task 313 — Funding services
Unblocks live mode for: 223, 224, 225.

**Code prompt:**
> Fill `api/openapi/funding.yaml`: projects (kind bot/model/bounty) with
> filters, contribute (min enforced, idempotent, updates raised/backers;
> goal-reach flips status to funded), my contributions, funding requests
> (create → SUBMITTED, approval transition stub), payouts + ROI records
> (read-only seeded). All hub aggregates computed from project line items.
> Switch pages 223/224/225. Verify: build; Playwright live — contribute
> raises the bar server-side and survives reload, over-goal contribution
> rejected with envelope error, hub KPIs equal the sum over both lists
> (assert) in both modes; console clean.

## Task 314 — Learning service
Unblocks live mode for: 219.

**Code prompt:**
> Fill `api/openapi/learning.yaml`: content catalog with filters, paths,
> enrollment, progress put (0–100), certificate issue on completion
> (record with id + issued date). Mock persists per-user progress in
> memory. Switch page 219; KPIs computed from server state in live mode.
> Verify: build; Playwright live — start item, progress persists reload,
> completing issues a certificate that appears in the KPI; fallback
> parity; console clean.

## Task 315 — Reports & compliance engine
Unblocks live mode for: 226, 227, 228.

**Code prompt:**
> Fill `api/openapi/reports.yaml`: report catalog by category, generate
> (async: pending → generated via SSE or poll), custom report definitions
> CRUD + templates, schedules, compliance reports + risk reports lists
> (KPI strips derived from the same arrays), report content GET (sample
> narrative). Switch pages 226/227/228. Verify: build; Playwright live —
> generate flips pending→generated from server events, custom report
> definition persists reload, compliance KPIs equal computed counts in
> both modes, single date format everywhere; console clean.

## Task 316 — Regulator portal services
Unblocks live mode for: 229, 230.

**Code prompt:**
> Fill `api/openapi/regulator.yaml`: audits (model/dataset) with findings
> + workflow states, issues with SLA clocks (server computes due state
> from a fixed seed epoch), resolve transition, communications threads +
> messages, standards registry + requirements, overview aggregates (all
> derived), activity feed, entity cross-links (#MT/#DS/#ML/#CS resolve to
> their records). Switch pages 229/230. Verify: build; Playwright live —
> resolve updates Overview counts server-side, composer posts persist,
> deep entity links resolve (no "Regulator Not Found" on valid ids, the
> designed error state on invalid ones); fallback parity; console clean.

## Task 317 — Notifications & alerts
Unblocks: top-bar bell everywhere; 205's "Set Alert"; dashboard alert center
parity.

**Code prompt:**
> Fill `api/openapi/notifications.yaml`: notifications list + unread count,
> mark-read, alert rules CRUD (entity, condition, channel), SSE stream for
> new notifications, delivery preferences (in-app/email/push — email/push
> as recorded stubs). Mock emits a seeded notification on relevant
> mutations (order filled, training complete, issue resolved). Wire the
> app-shell bell (badge + dropdown list) through the data layer on all app
> pages; wire 205's Set Alert to rules. Keep the existing marketing-site
> dashboard alert center untouched; note parity in the task row. Verify:
> build; Playwright live — placing an order pops the bell badge via SSE,
> mark-read clears it, rule round-trips; fallback — bell renders seeded
> state; console clean.

## Task 318 — AI insights service
Unblocks live mode for: 203/205 insights, 222 market insights, 226's
AI-generated panel.

**Code prompt:**
> Fill `api/openapi/insights.yaml`: insights list per surface (portfolio,
> market, regulator, provider) with sentiment, confidence, impact; insight
> detail; generate-report narrative endpoint. Mock returns deterministic
> seeded insights; include an OPTIONAL live generator behind
> `GEFI_INSIGHTS_CLAUDE=1` env var calling the Claude API (model
> claude-sonnet-5, temperature 0, strict JSON schema output, prompt
> template in `backend/mock/prompts/insights.txt`) — clearly labelled
> AI-generated, falling back to seeded output on any error; no key in the
> repo. Switch the insight panels to the API. Verify: build; Playwright
> live + fallback — identical seeded insights in both when the env var is
> unset; schema-validate the generator path with the var set only if a key
> is present in the environment, else skip and note; console clean.

## Task 319 — zKML proof pipeline
Unblocks live mode for: 231.

**Code prompt:**
> Fill `api/openapi/zkml.yaml` from the pipeline in the reference deck:
> create verification (model, shard count) → job with stages (compile →
> shard → prove per shard → aggregate → verify), SSE stage/progress/log
> events, proof record (hash, shard count, wall-clock + task time,
> verified flag), verification history per model. Mock simulates timing
> deterministically (seeded per model+shards; hash = FNV-1a as in the
> client). Switch page 231; history list gains server persistence in live
> mode. Verify: build; Playwright live — run streams stage events to the
> stepper and log panel, summary matches GET proof record, same inputs →
> same hash across runs (assert); fallback parity; console clean.

## Task 320 — Platform cross-cutting
Unblocks: dashboard API-keys tab parity, trust-center verifier, global
search, i18n, GDPR claims.

**Code prompt:**
> Fill `api/openapi/platform.yaml`: API keys (create → one-time reveal,
> list, revoke with typed-confirm semantics), rate-limit headers on every
> mock response (X-RateLimit-*), audit hash-chain endpoints matching what
> the trust-center verifier expects (GET run record by run_id, GET chain
> segment) served from seeded records, global search (models, datasets,
> docs, orders — grouped results for the top-bar search), i18n string
> bundles (en + one stub locale) with a `data-i18n` client hook, GDPR
> endpoints (export my data, delete my data — recorded stubs with status).
> Wire the app-shell top-bar search to grouped results; keep marketing-site
> surfaces untouched. Verify: build; Playwright — search returns grouped
> live results and seeded fallback, key create/reveal/revoke round-trip,
> verifier finds a seeded run_id via the API, console clean in both modes.

## Task 321 — Decision: where the real backend runs
**Not buildable without a decision.** The contracts + mock make every UI
wireable; production needs a home. Options: (a) Cloudflare Workers + D1/KV/
Queues/Durable Objects — fits the existing `infrastructure/cloudflare/`
deployment (changes there are owner-driven; the loop never touches that
directory); (b) a separate API service (any host) fronted at
`api.gefi.io`, keeping this repo static-only; (c) stay mock-only for demo
purposes. Also decide: billing provider (306 stub), email/push provider
(317 stubs), Claude API key handling (318), and real market-data vendor
(308). Record choices here; then raise a deployment ledger. Mark done when
recorded.
