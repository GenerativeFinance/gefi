# GeFi — Claude Design prompts queue (automated canvas generation)
_Every Claude Design prompt from gefi-prompt-pack.md, pulled onto its own queue and tagged with
which master prefix applies. This is the queue the continuous design-canvas loop works through —
one canvas (or small artboard set) per row, drafted and published as a Claude Design canvas
(Artifact) via the `design` skill. Tracked against tasks/design-canvas-manifest.md in the repo._

- **DARK** rows prepend the app master prefix (below) — tasks/design-system-v2.md §1.
- **LIGHT** rows prepend the marketing prefix (below) — tasks/prompt-library.json meta.designSystemPrefix.

## DARK app prefix

```
GeFi App Design System — dark-first. Design a screen for GeFi, an AI-finance
platform. Aesthetic: calm, dense, institutional trading console — not a marketing
site. Dark theme is the default and only theme unless stated.

TOKENS. Canvas near-black #0A0C14. Raised surface #12141F with 1px border
#232636; hover #161927. Text #F2F4FF primary, #8A91A6 muted. Brand indigo
#6D5BFF — primary buttons, active tabs/segments, selection borders, progress
bars, hero metrics. Accent cyan #22D3EE, sparingly. Semantic colors: positive /
profit / compliant / low-risk green #22C55E; negative / loss / critical /
violation red #EF4444; warning / pending / medium amber #F59E0B; high-risk /
overdue orange #F97316; informational blue #3B82F6; contributors / completed
purple #A78BFA; neutral chip gray #6B7280. Radius: 12px cards, 8px controls,
999px chips. Minimal shadows — separation comes from surface color + border, not
elevation. Typography: Inter for UI; JetBrains Mono with tabular figures for ALL
numerics (currency, %, ratios, IDs, timestamps). Currency always with thousands
separators ($2,847,500). Dates always "Jan 15, 2026". Deltas always signed, with
arrow/icon AND color — never color alone.

APP SHELL — every screen includes, top to bottom:
1. Top bar: indigo rounded-square logo tile with white brain glyph + "GeFi"
   wordmark; right cluster: persona icon (trend-chart for investors, </> code
   for developers, shield for regulators), search, bell with unread dot, theme
   toggle, globe + "Language", user avatar.
2. Icon+label horizontal tab nav for the persona's sections; active tab is an
   indigo pill.
3. Page header: bold H1 + one-line muted subtitle; right-aligned actions — at
   most ONE filled indigo primary, all others ghost/outline.
4. Main content on the near-black canvas, max-width ~1280px.
5. Trust badge strip: SSL Secured (green) · SOC 2 Compliant (blue) · GDPR Ready
   (purple) · ISO 27001 (amber) · 99.9% SLA (green).
6. Mega footer: brand + one-line description + pills "Enterprise Security" and
   "Bank-Grade Encryption"; link columns Platform / Legal & Privacy / Support &
   Contact; reassurance row "Your data is encrypted and never shared with third
   parties" with Zero Data Retention · AI Models Run Locally · End-to-End
   Encrypted; bottom row: © 2026 GeFi Technologies · "Version 1.0" pill ·
   "Built with ❤️ for financial professionals" · "Trusted by 10,000+ users".

COMPONENT GRAMMAR.
- KPI stat cards, row of 4 (occasionally 3 or 6): muted label top-left, big bold
  mono value below, small colored sub-line (delta or context), colored icon
  top-right. This is the ONLY stat-card anatomy.
- Segmented control: ONE style everywhere — full-width pill bar, active segment
  indigo fill. Used for in-page views (e.g. Overview | Returns | Allocation |
  Risk Analysis). Never mix pill bars with plain-text tab rows on one screen;
  nest at most one level.
- Filter bar card: search input with descriptive placeholder + "All <X>"
  dropdowns + optional sort dropdown + optional grid/list toggle.
- Row-cards (full-width stacked): icon + title + subcategory left, status chip
  top-right, "Updated X ago" meta, labeled metric columns (e.g. Performance /
  Trades / Accuracy / P&L), optional allocation or funding progress bar with %
  right-aligned, right rail with fee/price + stacked outline icon buttons and at
  most one filled indigo action.
- Card grids (2- or 3-col): dual corner chips (status top-left, risk/difficulty
  top-right), title, one-line description, mini-stat trio or 2x2 grid, tag chip
  row, footer twin buttons — ghost "View Details" + one indigo primary.
- Progress/allocation bars: indigo fill on #232636 track, % right-aligned;
  bad-is-high meters (error rate, drawdown) use red fill, not indigo.
- Chip vocabularies (fixed): status active/paused/pending/filled/cancelled/
  draft; severity critical/high/medium/low = red/orange/amber/green; difficulty
  EXPERT/ADVANCED/INTERMEDIATE/BEGINNER = red/orange/yellow/green; lifecycle
  Draft/Testing/Approved/Deployed = gray/amber/green/indigo; data availability
  Active/Limited/Coming Soon = green/amber/gray. Chips always carry a text
  label, never color alone.
- Charts, dark-styled: indigo line/area with subtle gradient fill and dashed
  gray benchmark line; grouped bars indigo (portfolio) vs green (benchmark);
  donut with dot-swatch legend list and right-aligned %; dashed gridlines on
  transparent; no 3D, no white chart backgrounds.
- Quick-action tiles: dashed-border tiles with icon, short title, one-line
  muted description.
- States: every list, table, and panel ships a designed empty state (icon,
  one-line headline, one-line hint, primary CTA), skeleton loading, and an
  error state (headline, explanation, "Go Back"/retry) — never a blank panel.

ACCESSIBILITY. WCAG AA contrast on dark surfaces; status never encoded by color
alone (always icon or label too); visible indigo focus rings; hit targets
≥ 40px; charts readable without color (line styles / labels).
```

## LIGHT marketing prefix

```
GeFi design system — bg #FAFBFF, surface #FFFFFF, text #0B0E1A, muted #6B7280, brand #6D5BFF, accent #22D3EE, profit #16A34A, loss #DC2626, warn #F59E0B. Type: Inter for UI and headings, JetBrains Mono for numerics, badges, and code. Badge vocabulary: Federated; Risk: Low / Medium / High; jurisdiction chips (US, UK, EU, UAE, SG). Standards: design the empty, loading, and error states, not just the happy path; label all sample data as sample; show units, currency, and period on every figure; make editable inputs visually distinct from calculated outputs; responsive desktop and tablet; visible keyboard focus; include a dark-mode variant built from the same tokens.
```

---

## Group A — UI-FOLLOWUP-LEDGER 200-series + 303 (DARK)

### [001] Task 200 — App shell (DARK)

```
Design the GeFi app shell itself as a reference frame: top bar, persona tab
nav (show the Investor set: Overview · Portfolio · AI Marketplace · Trading ·
Reports · Funding · Learning, with Overview active), an empty content region
with a placeholder page header ("Investor Overview" / "Your comprehensive
investment dashboard with enhanced analytics", one indigo primary "Settings"),
the trust badge strip, and the full mega footer exactly as specified. Show
hover and active states for tabs and the bell's unread dot. Desktop 1280px
and a mobile variant where the tab nav becomes horizontally scrollable.
```

### [002] Task 202 — App component library (DARK)

```
Design a single component sheet on the dark canvas showing, each labelled:
the KPI stat card (one anatomy: muted label, big mono value, colored
sub-line, colored icon top-right) in 4-up row; the full-width pill segmented
control (one active); a filter bar card (search + two "All X" dropdowns +
sort + grid/list toggle); a row-card with status chip, metric columns,
allocation bar, right action rail; a 3-col grid card with dual corner chips,
mini-stat trio, tag chips, twin footer buttons; every chip vocabulary
(status, severity, difficulty, lifecycle, data availability) with labels;
progress bars incl. a red bad-is-high meter; a quick-action dashed tile; and
the three states: empty (icon/headline/hint/CTA), skeleton loading, error
with "Go Back". Include focus-ring states.
```

### [003] Task 203 — Investor Overview (DARK)

```
Design "Investor Overview" (Investor persona, Overview tab): header with
Settings ghost + "Last updated" pill; hero Portfolio Overview band with
Export — $142,500 (+$2,850 / +2.04% green), +2.7% monthly (vs +1.8%
benchmark), +24.3% YTD (blue), $12,750 cash, right rail "View Details"
(indigo) + "Performance"; the 7-segment control (Overview active); KPI row:
8 Active AI Models (+2), 3 Trading Bots (+1), 6.2/10 Risk Score (−0.3,
orange shield), 2 Alerts (red); chart row: "Portfolio Performance" green
area chart vs dashed benchmark with legend + "Asset Allocation" donut with
dot-swatch legend; "Quick Actions" 4 dashed tiles (View Portfolio, Browse
AI Models, Risk Assessment, Generate Reports — dark surfaces, colored icons,
not pastel tints); "Recent Activity" feed with right-aligned colored values.
```

### [004] Task 204 — Holdings · Transactions · Watchlist (DARK)

```
Design the Investor Overview page with the 7-segment control on Holdings,
then Transactions, then Watchlist (three frames, same hero band). Holdings:
"Top Holdings" row-cards — ticker chip, company, "% of portfolio", right
value + green/red change (TSLA −2.1% red with down arrow). Transactions
(new, follow the grammar): filter bar + data table Date · Type chip
(buy green/sell red) · Asset · Quantity · Price · Value · Status chip.
Watchlist (new): row-cards with ticker, price, sparkline, signed day change,
star toggle, "Add to watchlist" empty-state variant. Active segment must
match content; nav tab stays Overview only if that is truthful — here set
the Portfolio tab active instead.
```

### [005] Task 205 — Analytics · Insights (DARK)

```
Two frames of Investor Overview (hero band, Portfolio tab active).
Analytics segment: 2-col key-value stat cards — "Performance Analysis"
(Sharpe 1.42, Max Drawdown −8.5% red, Beta 0.89, Alpha +2.1% green,
Volatility 14.2%) and "Risk Metrics" (VaR 95% −$7,125, Concentration Risk
"Medium" amber chip, Sector Diversification "7 sectors", Geographic
Exposure "4 regions"). Insights segment: "AI-Driven Market Insights"
row-cards — title, body, sentiment chip (Bullish indigo / Neutral gray /
Cautious red), "87% confident" pill, "Impact: High/Medium" colored label
with icon, "Set Alert" ghost + "Learn More" indigo. All values from the
canonical dataset — note these previously contradicted the Performance page.
```

### [006] Task 206 — Portfolio Performance (DARK)

```
Design "Portfolio Performance" (Portfolio-suite persona: Overview ·
Portfolio · AI Models · Rebalancing · Performance; Performance active):
header "Track your investment returns and risk metrics", ghost Refresh +
indigo Export Report; KPI row: $142,500 (+24.3% YTD), +2.7% monthly (vs
+1.8%), Sharpe 1.42 (vs 1.18), Max Drawdown −8.5% ("Better than −12.3%");
segmented Overview | Returns | Allocation | Risk Analysis — four frames:
(1) Overview: "Portfolio Value Over Time" indigo line chart with 1Y range
dropdown ⅔ + "Asset Allocation" donut ⅓; (2) Returns: "Monthly Returns vs
Benchmark" grouped bars (indigo vs green, negatives below axis) + "Top
Performers" list (NVDA +24.80% · 8.5% allocation …); (3) Allocation: five
color-coded horizontal allocation bars; (4) Risk Analysis: five benchmark
row-cards with "Good"/"Neutral" badges. One consistent dataset across all
four.
```

### [007] Task 207 — AI Portfolio (DARK)

```
Design "AI Portfolio" (Portfolio-suite persona, Portfolio tab): 2-col split.
Left: "Portfolio Overview" card — Total Investment $142,500, Live P&L
+$2,850 green, Annual Returns 24.3%, Sharpe 1.42, footer "Performance vs
Market +5.2% better"; below it "Risk Distribution" card — indigo bars
Stocks 60 / Bonds 30 / Crypto 10 with "Risk Level: Moderate" amber chip.
Right: tall "AI Models" card — model rows with chevrons (Conservative AI
$85,500 +12.4%; Aggressive Growth $57,000 +24.8% — must sum to the total),
stacked full-width buttons: indigo "Rebalance with AI", ghost "Manual
Override", ghost "Download Report"; centered "AI Confidence Score 94.2%"
large green with a thin gauge arc. Use the canonical $142,500 — the
reference's $247,580 contradicted every other page.
```

### [008] Task 208 — Portfolio AI Models (DARK)

```
Design "Portfolio AI Models" (Portfolio-suite persona, AI Models tab):
header + indigo "Browse Models"; KPI row Active Models 3 · Total Performance
+19.1% · Monthly Fees $327 · Avg Accuracy 90.2%; full-width pill segments
Active Models | Recommended | Settings (NOT small pills — one segmented
style). Active: full-width row-cards — icon, name + subcategory, green
"active"/amber "paused" chip, "Updated 2h ago", Portfolio Allocation bar
+ %, columns Performance / Total Trades / Accuracy / P&L, right rail
Monthly Fee + stacked outline buttons Pause · Configure · Analytics (filled
indigo Resume when paused). Recommended: 2-up marketplace cards — bot icon,
name/category, price pill, description, 2x2 stats (Rating ★ / Accuracy /
Subscribers / Category), tag chips, indigo Subscribe + ghost Details.
Settings: toggle rows (auto-pause on drawdown, fee cap slider, alerts).
```

### [009] Task 209 — Rebalancing & Actions (DARK)

```
Design "Portfolio Rebalancing & Actions" (Portfolio-suite persona,
Rebalancing tab): scales icon + header "Optimize your portfolio allocation
and manage rebalancing strategies", ghost Settings + indigo "Execute
Rebalance"; KPI row Portfolio Drift 5.0% · Actions Required 2 · Rebalance
Value $10,000 · Last Rebalance 15 days; split panel — left "Target
Allocation": four sliders with "Current x% · Drift x%" sublabels and green
"Total Allocation 100%" footer that turns amber when ≠100; right
"Rebalancing Settings": threshold slider "Rebalance Threshold: 5%",
Auto-Rebalancing toggle, Monthly/Quarterly/Annually segmented, Cost
Optimization toggles (Minimize Trading Costs, Tax-Loss Harvesting); bottom
full-width "Required Rebalancing Actions": rows red-dot "Sell Stocks" /
green-dot "Buy Bonds" $5,000 each with Low risk chips, footer "Total
Transaction Value $10,000"; Execute opens a confirm modal listing the trades
with a sample-data notice.
```

### [010] Task 210 — Live Trading (DARK)

```
Design "Live Trading" (Trader persona: Overview · Live Trading · Trading
Bots · Order History · Strategies; Live Trading active): header with green
"Live" pill + "Secure" badge; three feature cards (Real-Time Data, Fast
Execution, Risk Management); ONE segmented level — Trade | Orders |
Positions | History (drop the reference's second nested tab bar). Trade:
split panel — left "Place Order" form (Symbol, Side, Order Type, Quantity,
Time in Force; big indigo "Buy AAPL" that re-labels with side+symbol);
right price panel with mono last price, signed day change, mini line chart,
and a designed loading state (skeleton, not "Loading price data...").
Mini-stat row shows sample positions, not $0.00 zeros. Amber "Trading
Safety Notice" callout: Risk Warning (red), Demo Environment, Educational
Purpose. Positions/Orders/History: compact tables with side chips.
```

### [011] Task 211 — Order History + Activity (DARK)

```
Design "Order History" (Trader persona, Order History active): ghost Export
+ indigo Refresh; KPI row Total Orders · Filled (green check) · Pending
(amber clock) · Total P&L (green); filter card — search "Search by symbol,
order ID, or strategy..." + Status / Date Range / Type dropdowns; filter
pills All Orders | Filled | Pending | Cancelled; dense data table: Order ID
(strategy subtext e.g. "Momentum Breakout"), Symbol, Side (BUY green / SELL
red with icons), Type outline chips (market/limit/stop), Quantity, Price,
Fill Price ("—" if unfilled), Status icon-chip (filled green / pending
amber / cancelled red), P&L signed colored, Date ("Jan 15, 2026" format);
pagination footer "Showing 1–10 of 24" with page buttons; designed empty
state for a filter with no matches.
```

### [012] Task 212 — Backtesting Environment (DARK)

```
Design "Backtesting Environment" (Developer persona: Overview · Backtesting
· AI Marketplace · Market Data · Bounties · Learning; Backtesting active;
top-bar </> icon): header + indigo "New Backtest"; KPI row with REAL sample
data (not the reference's zeros): Total Backtests 12 (2 running), Best
Sharpe 1.87, Avg Annual Return +14.2%, Active Models 3; segmented Configure
| Live Monitor | Optimizer | Results | Analysis | Comparison. Configure:
split — left "Backtest Configuration" with Available Models rows (lifecycle
chips deployed/testing/approved), Quick Presets (Last 1 Year / Last 2 Years
/ Custom Range), indigo "Configure New Backtest"; right "Market Data
Status" rows with Active/Limited/Coming Soon chips + info panel "Historical
data available from January 2020 to present". Results: table of runs with
Sharpe/return/drawdown mono columns. Live Monitor: progress bars + log
lines. Others: designed empty states.
```

### [013] Task 213 — AI Model Marketplace (DARK)

```
Design "AI Model Marketplace" (Marketplace persona: Overview · AI
Marketplace · Categories · My Subscriptions · Developers; AI Marketplace
active): subtitle "Discover and subscribe to AI-powered financial models
tailored to your needs"; Preferences ghost button; filter card search +
All Categories / All Subcategories / All Risk Levels; segmented For You |
Trending | Browse All | Categories. For You: "Personalized Recommendations"
with sparkle icon — show BOTH the empty state ("Building Your
Recommendations" / "We're analyzing your preferences to find the perfect AI
models for you." / "Set Your Preferences" CTA) and the filled state: 3-col
grid of model cards (name, category, risk chip, price, mini-stats, indigo
Subscribe + ghost Details). Trending: same grid ranked with flame chips.
Browse All: grid + pagination. Preferences: modal with category checkboxes
+ risk tolerance segmented control.
```

### [014] Task 214 — Model Categories (DARK)

```
Design "AI Model Categories" (Marketplace persona, Categories active): KPI
row Total Categories · Total Models · Average Rating · Top Category —
internally consistent (the reference showed "Total Models 0" above cards
claiming hundreds); filter card search + category dropdown + Name/Models/
Rating sort + grid/list toggle; 3-col grid of category cards: icon, name,
optional "Featured" indigo / "Trending" orange-flame chips, description,
big indigo model count + amber star rating, REAL subcategory chips (no
"General Advanced Custom" filler), "Starting from $X/month", full-width
indigo "Browse Models". List view: same data as rows.
```

### [015] Task 215 — Developers directory (DARK)

```
Design "Developers" (Marketplace persona, Developers active): subtitle
"Discover talented AI model developers and their work"; indigo "Become a
Developer"; KPI row Total Developers 6 · Verified 5 (green) · AI Models
Created 60 · Revenue Generated $683,000 (green trend); filter bar search
("Search developers by name, username, or specialization...") + Rating sort
+ All Developers filter; 3x2 grid of profile cards: initials avatar, name +
indigo "Verified" badge, @handle, bio, amber ★ rating "(234)", location
pin, Models/Subscribers/Revenue stat trio, "Specialties:" chips, "Top
Models:" two rows with ★, "Joined Jan 2023", globe icon + ghost "View
Profile". One unverified profile to justify the KPI.
```

### [016] Task 216 — Developer Console: Overview + My Models (DARK)

```
Design "Developer Overview" (Developer persona, Overview tab; </> top-bar
icon): header + indigo "Create Model" + ghost "Export Data"; KPI row 12
Total Models · $486,750 Total Funding (with separator) · 28 Collaborators ·
8 Deployments; segmented Overview | My Models | Training | Deployment |
Collaboration | Monitoring. Overview: "Recent Activity" rows (colored icon,
title, "Model • 1 hour ago" meta, gray tag chip) + three quick-action cards
(Create New Model / Upload Dataset / View Documentation). My Models: "My
Models (4)" + Filter + All Status dropdown; 2x2 grid — lifecycle chip
(Deployed indigo / Testing amber / Approved green / Draft gray), Category /
Tests / Collaborators fields, indigo "Funding Progress $68,250 / $75,000"
bar, View · Edit (· Monitor) buttons. The stray hyperparameter form from
the references is REMOVED — it returns properly inside task 217's training
config modal.
```

### [017] Task 217 — Developer Console: Training + Deployment + Monitoring (DARK)

```
Three frames of the Developer console. Training: "Training Jobs — Monitor
and manage your model training processes" — row-cards with status chip
(completed indigo-outline / running indigo / queued gray+clock), Duration,
Accuracy / Loss fields, progress bar with %, buttons per state (Download +
View Logs / Pause + View Logs / View Logs); "New Training Job" opens a
config modal containing the hyperparameter form done properly: Learning
Rate, Batch Size, Epochs, Optimization Method select, validation, inside a
card. Deployment: "Model Deployments" row-cards — env subtitle (Production/
Staging/Development), status chip, Uptime green % · Requests · Latency ·
Last Deploy fields, Stop | Configure | Metrics | Logs ghosts, indigo Start
on inactive. Monitoring: KPI trio System Health 98.5% green pulse · Active
Models 8/8 · Avg Response 43ms; per-model blocks with DISTINCT metrics and
four meters — Prediction Accuracy, Response Time, Uptime indigo; Error Rate
as a RED bad-is-high meter.
```

### [018] Task 218 — Developer Console: Collaboration + Bounty Board (DARK)

```
Two frames. Collaboration (console segment): split — left "Team Members —
Manage collaborators across your projects": rows (colored initials avatar,
name, role subtitle), Owner indigo / Collaborator outline chips, ghost
"+ Invite Collaborator"; right "Team Communication — Recent discussions and
updates": message rows (avatar, name, "2h ago", message), ghost "Start
Discussion". Bounty Board (Developer persona, Bounties tab): target icon +
"Discover and claim bounties... Earn rewards while contributing to the
future of finance."; KPI row Active Bounties 12 · Total Rewards $8,250 ·
Active Developers 47 · Completed 156; filter card; 3-col grid — status chip
left (OPEN green / CLAIMED blue-outline / IN PROGRESS amber) + difficulty
right (INTERMEDIATE yellow / ADVANCED orange / EXPERT red), title,
description, green reward, clock + "Jan 15, 2026" deadline, category +
submission count (grammar-correct singular/plural), ghost "View Details" +
indigo "Claim" on OPEN only.
```

### [019] Task 219 — Learning Center (DARK)

```
Design "Learning Center" (Learning persona: Overview · Learning · Tutorials
· Webinars · Documentation · Community; Learning active): book icon +
"Master AI financial modeling through comprehensive tutorials, workshops,
and hands-on projects."; KPI row Completed 2 (green check) · In Progress 2
(blue play) · Certificates 3 (purple) · Hours Learned 24.5 (amber clock);
segmented All Content | In Progress | Completed | Recommended; filter card;
3-col grid of content cards: dual chips (type GET-STARTED green / TUTORIAL
blue / WEBINAR purple / BLOG pink / FAQ gray + level BEGINNER green /
INTERMEDIATE yellow / ADVANCED orange), title, description, duration +
enrolled, ★ + author, progress bar where started, button by state (Start
Learning indigo / Continue / ghost Completed ✓). "Featured Learning Paths":
three DARK cards with colored left accents (fixing the reference's
white-on-pastel illegibility), "6 courses ~30 hours", Continue Path/Start
Path.
```

### [020] Task 220 — Market Data (DARK)

```
Design "Market Data" (Developer persona, Market Data active): header
"Access comprehensive financial data for AI model development and
backtesting" with breathing room above (the reference was cramped), indigo
"Start Stream" (play icon) + ghost "Export Data"; KPI row 6 Data Sources ·
10.9M Total Data Points · 4 Real-time Sources · 86% Avg Coverage; segmented
Data Sources | Date Range | Data Preview. Sources: 2-col grid of six cards
(Stock Data (US) with indigo selected border, Crypto, Forex, Options,
Commodities, Fixed Income) — status chip (Active green / Limited amber+info
/ Coming Soon gray), Coverage / Data Points / Date Range / Update Frequency
pairs, "Sample Symbols" chips (AAPL, BTC, EUR/USD, GOLD, 10Y Treasury).
Date Range: preset pills + custom pickers. Data Preview: mono table of
sample rows for the selected source with a live-stream state when streaming.
```

### [021] Task 221 — Data Provider Overview + Datasets (DARK)

```
Design "Data Provider Overview" (Data Provider persona: Overview ·
Portfolio · AI Marketplace · Collaboration): subtitle "Manage your
datasets, monitor revenue, and collaborate with developers"; segmented
Overview | Datasets | Market Insights | Revenue. Overview: KPI row 12 Total
Datasets · $2,847,500 Total Revenue · 156 Active Subscriptions · 9.4 Avg
Quality Score (consistent, unlike the reference's zeros-with-revenue) +
"Recent Activity" feed (uploads, subscription events, quality-score
changes) — the reference panel was empty; design the filled state AND its
empty state. Datasets: "Dataset Management" + indigo "+ Upload Dataset";
row-cards per dataset — name, category chip, quality score badge, rows/size
mono, monthly revenue green, subscriber count, status chip
(Published/Processing/Draft), Edit · Analytics · Archive actions; upload
modal (name, category, file drop zone, license select, price).
```

### [022] Task 222 — Market Insights + Revenue (DARK)

```
Two provider segments. Market Insights: "Market Insights & Trends" + indigo
"Generate Report"; "Market Performance" card — two indigo meters (Dataset
Adoption Rate +15.3%, Market Impact Score 8.7/10) beside stat tiles ($2.3M
Market Impact Value green, 156 Models Using Data blue); "Trend Analysis"
card — rows Algorithmic Trading / Risk Assessment / Market Sentiment with
High/Medium Impact chips and green growth %. Revenue: KPI row Total
Revenue $2,847,500 · Downloads 8,432 · Active Subscriptions 156 (consistent
with Overview — the reference showed $0 under a $2.8M overview); "Revenue
by Dataset" panel designed as a horizontal bar list (dataset name, indigo
bar, mono $, share %) + monthly revenue line chart with range dropdown;
payout schedule row-card.
```

### [023] Task 223 — Funding Hub dashboard (DARK)

```
Design "Funding Hub" (Funding persona: Overview · Funding Hub · Bot Funding
· AI Model Funding · Bounty Funding; Funding Hub active): subtitle "Support
and fund AI financial innovations"; segmented (with icons) Dashboard | AI
Model Funding | Bounty Funding; KPI row using the ONE standard card
anatomy (the reference used a variant): Total Funding $2,540,750 (+12% this
month), Active Projects 149 (147 models, 2 bots — internally consistent,
unlike the $0-with-+12% reference), Success Rate 87%, Contributors 1,247;
two summary cards "AI Model Funding" and "Bounty Funding" — Total Raised /
Active rows with mono values + full-width indigo "View Model Funding" /
"View Bounty Funding"; below, "Recently Funded" feed of 3 row-cards with
progress bars at 100% and Funded chips.
```

### [024] Task 224 — Bot Funding + AI Model Funding (DARK)

```
Two frames, Funding persona. Bot Funding (tab active): "Fund innovative
trading bot development and earn from successful deployments"; indigo
"+ Request Funding" (ONE verb set); KPI row Total Funded $140,750 · Active
Bots 2 · Contributors 96 · Success Rate 84%; segmented (pill style, not
plain text) Browse Requests | My Contributions | My Requests; filter bar;
2-col project cards: status chip (Active green / Funded blue) + risk chip
(Medium yellow / High red), category chip, green raised amount, indigo
"Funding Progress $32,500 of $50,000" bar + %, Contributors / Expected ROI
green / Days Left, "Features:" chips, "Created by" indigo link, "Min
Contribution $100", full-width indigo "Contribute $100" (absent when
Funded/Ended). AI Model Funding (tab active): same recipe; KPI row Total
Funded $2.4M · Active Models 147 · Funders 1,243 · Avg ROI 18.4%; grid of
model funding requests consistent with those KPIs, plus the designed empty
state ("No funding requests found" / "Try adjusting your search filters")
for filtered-to-nothing.
```

### [025] Task 225 — Bounty Funding (DARK)

```
Design "AI Financial Bounty Funding" (Funding persona, Bounty Funding
active): "Support and fund the development of AI financial models and
tools"; indigo "+ Request Funding"; KPI row with sub-lines: Total Funded
$2.4M (+15% this month green) · Active Bounties 47 (12 pending approval
blue) · Contributors 1,247 (+23 this week purple) · Completed 189 (94%
success rate amber); segmented Browse Requests | My Requests | My Funding;
filters All Categories + Newest sort; full-width stacked row-cards: dual
top-right chips — status (SUBMITTED amber / APPROVED green / ACTIVE
outline / COMPLETED purple) + difficulty (EXPERT red / ADVANCED orange /
INTERMEDIATE yellow); 3-col body: "Funding Progress $2,500 / $40,000" bar +
backers + duration; "Required Skills" chips with "+1 more"; Developer name;
"Estimated Reward" green + indigo "Fund" (disabled on COMPLETED) + eye
icon.
```

### [026] Task 226 — Reports (merged page) (DARK)

```
Design ONE "Reports" page (Reports persona: Overview · Reports · Risk
Analysis · Compliance · Custom Reports; Reports active) merging the two
references: header "Reports & Insights" / "AI-powered financial insights
and comprehensive reports", ghost "View All Reports" + indigo "Generate
Report" right-aligned (standard header, not the icon-beside-title variant);
top split — left "AI-Generated Market Insights": Real-Time Market Sentiment
indigo meter "75% Bullish", Macroeconomic Trends icon-stats (USD Index
102.4 +0.3%, GDP Growth 2.8% Stable), amber Fed Decision callout "AI
predicts 0.25% rate cut · probability: 68%"; right "Investor Reports" card
— rows with green Ready chips + Download, full-width "+ Generate New
Report". Below: four DARK category panels with colored left accents (not
pastel tints) — Performance / Risk Assessment / Regulatory Compliance /
Client Reports — each nesting report rows (name, description, generated
green / pending amber chip + "Jan 15, 2026" date, eye + download icon
buttons); "Quick Actions" tiles Monthly Performance / Risk Analysis /
Client Summary.
```

### [027] Task 227 — Compliance Reports + Risk Reports (DARK)

```
Two frames, Reports persona. Compliance (tab Compliance): "Monitor
regulatory compliance across all financial operations and requirements";
ghost Refresh + indigo Export All; 6-KPI strip Total Reports 6 · Compliant
4 green · Warnings 1 amber · Violations 1 red · Compliance Rate 67% indigo
· Overdue 2 orange (consistent with the counts, unlike the reference's
Overdue 6); filter bar search + All Types / All Status / Last 30 days;
2-col card grid: status pill (Compliant/Warning/Violation) + risk pill
(LOW/MEDIUM/HIGH RISK), title, "Category • description", "Regulations:"
chips (MiFID II, RTS 22...), mini-stats Coverage % indigo / Findings / Next
Due, twin ghost View Details | Download. Risk Analysis (tab Risk Analysis):
same recipe; KPI strip Total 6 · Critical 1 red · High 2 orange · Medium 2
amber · Low 1 green · Portfolio VaR $3,052,000 indigo; cards add severity
pill + risk-type chip (Liquidity/Market/Concentration/Credit/Operational)
+ signed trend delta, "Risk Score 89/100" bar colored by severity,
Confidence % / Exposure / VaR mini-stats.
```

### [028] Task 228 — Custom Report Builder (DARK)

```
Design "Custom Reports" (Reports persona, Custom Reports active): header +
ghost Export All; segmented Report Builder | My Reports | Templates.
Builder: form card "Create Custom Report — Build a custom report with your
preferred metrics and visualizations": Report Name* (placeholder "e.g.,
Monthly Portfolio Review"), Report Type* select, Description textarea
("Describe what this report covers..."), Date Range* select, Schedule
(Optional) select, "Visualization Types" checkbox grid — Line Chart, Bar
Chart, Pie Chart, Data Table, Heat Map, Scatter Plot — "Make this report
public (visible to team members)" checkbox; indigo Create Report + ghost
Reset; inline validation states. My Reports: row list with status chips,
schedule badge, run/edit/delete actions and a designed empty state.
Templates: 3-col grid of template cards with "Use Template".
```

### [029] Task 229 — Regulator Overview (DARK)

```
Design "Regulator Overview" (Regulator persona: Overview · Model Audits ·
Dataset Audits · Compliance Issues · Communications · Standards; shield
top-bar icon; Overview active): header "Comprehensive compliance monitoring
and AI model governance" with Last 30 days dropdown + bell + gear; search
"Search audits, models, or datasets..." + All Categories + indigo Export
Dashboard; segmented Regulator Overview | Analytics | Recent Activity |
Insights. Overview: 3x3 KPI grid (Total Audits 142 +12% · Pending 18 "3
due this week" amber · Compliance Rate 87.3% · Flagged Issues 23 "3
critical" red · Resolved 156 green · Active Standards 15 blue · Completion
Rate 94.2% · Avg Resolution 4.8 days · Critical Issues 3 red); three
dashed quick-action tiles Start New Audit / Report Issue (red) / Send
Communication (blue); "Upcoming Audits" rows with owner • date, lowercase
priority pills, ghost View. Analytics: 2x2 horizontal-bar cards
(Compliance Rate Trend, Audit Distribution by Type, Issue Distribution,
Performance Metrics key-values). Recent Activity: feed rows with colored
icon tiles, entity IDs (#MT-4521), timestamps, org + severity chips.
Insights: four DARK banners with colored left borders + icons (blue
improvement / amber attention / green best practice / purple trend) — not
pastel.
```

### [030] Task 230 — Regulator sub-pages (the five 404 tabs) (DARK)

```
Five frames, Regulator persona, one per tab. Model Audits: filter bar +
data table (Audit ID #MT-xxxx, Model, Organization, Type, severity pill,
status chip Scheduled/In Progress/Completed, Due "Jan 15, 2026", View) +
audit detail modal with findings timeline. Dataset Audits: same recipe
with #DS-xxxx and data-quality columns (Coverage, PII flags, License).
Compliance Issues: KPI row (Open · Critical · Avg Resolution · Resolved
30d) + issue row-cards with severity chip, entity link, assignee, SLA
countdown (amber when close, red overdue), Resolve action. Communications:
split — thread list left (org, subject, unread dot), thread view right with
message bubbles + composer; "Send Communication" primary. Standards: card
grid of standards (name e.g. "EU AI Act — high-risk credit scoring",
version, effective date, status Adopted/Draft chip, linked audits count,
View requirements accordion). Also design the improved error state used
when a deep link is truly missing: "Regulator Not Found" / "The regulator
profile you're looking for doesn't exist." / Go Back — kept, but reached
only on genuinely bad routes.
```

### [031] Task 231 — zKML Verification surface (DARK)

```
Design "zKML Verification" (Developer persona, new page reachable from the
Overview console): header "Zero-Knowledge Model Verification — Prove model
execution without exposing data or weights"; explainer strip of three
cards: Proof Generation ("Local proofs are generated for each shard —
sensitive data never leaves the participant's environment"), Proof
Verification ("Verified using public values, enabling trustless
collaboration"), Elapsed Time (wall-clock vs task-time). Pipeline
visualization as a horizontal stepper: Compile WASM → Create n shards →
Prove shard 1…n (parallel lanes with per-shard progress bars + status
chips) → Aggregate proofs → Verify aggregated proof; a mono log panel
streaming prover output ("Shard 0 verification succeeded", "Total wall
clock time: 210 secs"); a verification summary card with green "Verified"
state, proof hash (truncated mono), shard count, timing; and a "Verify a
model" form (model select from the catalogue, shard count 2–8 slider,
Run verification indigo CTA). Empty state before first run.
```

### [032] Task 303 — Auth & identity + auth screens (DARK)

```
Design GeFi sign-in and sign-up screens plus a profile/security settings
page: centered dark auth card with the brain logo, email + password with
visible-toggle, SSO buttons (Google, GitHub) as outline buttons, 2FA code
step, password strength meter, error and loading states; sign-up adds
persona selection cards (Investor / Developer / Data Provider) with icons
and one-line descriptions; settings page shows profile fields, avatar
upload, language select, theme toggle, active sessions list with revoke,
and a danger zone. Trust strip + footer as always.
```

---

## Group B — per-model UI (DARK), all 92 models

### [033] Model 01 — macro-nowcast (DARK)

```
Design the model detail page for “Macro Nowcast” — Macro / Investing (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $149/mo. Lead sentence: “Real-time nowcast of US, UK, and EU GDP, CPI, and unemployment from high-frequency alternative data.” Metrics strip of KPI cards: GDP RMSE (vs final) 0.32 pp · CPI RMSE (vs final) 0.21 pp · Median refresh 15 min · Geographies US, UK, EU. Interactive demo card (“Run the nowcast”): inputs — Geography (select: US, UK, EU), Indicator (select: GDP, CPI, Unemployment), Refresh window (number), Overlay last confirmed print (checkbox); a single indigo “Run the nowcast” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [034] Model 02 — portfolio-optimiser (DARK)

```
Design the model detail page for “Portfolio Optimiser” — Optimisation / Investing (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); GA lifecycle chip; Federated (indigo); jurisdiction chips US UK EU UAE; price pill $199/mo. Lead sentence: “Mean-variance + Black-Litterman + risk-parity optimiser with federated views from anonymised institutional positioning data.” Metrics strip of KPI cards: Universe size 10,000+ · Median solve time 240 ms · Backtest CAGR (60/40) +1.8 pp · Federated participants 27. Interactive demo card (“Solve”): inputs — Regime (select: Mean-variance, Black-Litterman, Risk-parity), Mandate (select: Long-only, Long-short), Turnover cap (number), Max positions (number), Use the federated prior (checkbox); a single indigo “Solve” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [035] Model 03 — sentiment-from-filings (DARK)

```
Design the model detail page for “Sentiment from Filings” — NLP / Investing (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK EU; price pill $49/mo. Lead sentence: “Extracts forward-looking sentiment, risk language, and management tone from 10-K, 10-Q, 8-K, and equivalent EU/UK filings.” Metrics strip of KPI cards: F1 (binary tone) 0.91 · Backtest IR (2018-2025) 0.78 · Median p99 latency 120 ms · Calls served 12.4 M. Interactive demo card (“Score the filing”): inputs — Ticker (text), Filing type (select: 10-K, 10-Q, 8-K, EU Annual Report, UK Annual Report), Section (select: Whole document, MD&A, Risk factors), Return risk-language offsets (checkbox); a single indigo “Score the filing” action runs it; output — a large mono score readout (“Tone (0–1)”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [036] Model 04 — yield-curve-forecaster (DARK)

```
Design the model detail page for “Yield-Curve Forecaster” — Investing (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK EU; price pill $99/mo. Lead sentence: “Ensemble forecast of the US, UK, and EU government yield curves, shown against the forward-implied curve with per-tenor error history.” Metrics strip of KPI cards: 2y forecast RMSE 14 bp · 10y forecast RMSE 21 bp · Horizons 1–12 months · Geographies US, UK, EU. Interactive demo card (“Forecast the curve”): inputs — Geography (select: US, UK, EU), Forecast horizon (number), Overlay (select: Forward-implied curve, Current spot curve, Both), Show macro-driver attribution (checkbox); a single indigo “Forecast the curve” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [037] Model 05 — commodities-flow-nowcast (DARK)

```
Design the model detail page for “Commodities Flow Nowcast” — Macro (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU UAE SG; price pill $199/mo. Lead sentence: “Nowcasts physical commodity flows across energy, metals, and agriculture from satellite, AIS, and customs-manifest data, with a price-impact estimate per corridor.” Metrics strip of KPI cards: Live corridors 84 · Median data age 6 h · Flow RMSE (vs realized) 7.4% · Regions US, UK, EU, UAE, SG. Interactive demo card (“Nowcast the flow”): inputs — Commodity class (select: Energy, Metals, Agriculture), Corridor (select: Arabian Gulf → Singapore, US Gulf → NW Europe, Brazil → China, Australia → East Asia), Window (number), Include price-impact estimate (checkbox); a single indigo “Nowcast the flow” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [038] Model 06 — credit-oracle (DARK)

```
Design the model detail page for “Credit Oracle” — Credit / Risk (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; Federated (indigo); jurisdiction chips US UK EU; price pill $149/mo. Lead sentence: “Federated credit risk model for SME lending, trained on anonymised loan tape from 14 partner lenders.” Metrics strip of KPI cards: AUC (out-of-sample) 0.84 · Gini 0.68 · PSI (vs baseline) 0.04 · Federated lenders 14 — caption “as of 2026-08-14”. Interactive demo card (“Score it”): inputs — Annual revenue (slider 100k–20M USD), Request amount (slider 25k–5M USD), Sector (select: Retail, Manufacturing, Construction, Professional services, Hospitality), Explanation format (select: US adverse-action notice, UK adverse-action notice, EU AI Act documentation packet); inputs re-run the output live (debounced); output — a signed SHAP-style waterfall from base rate to final score (green up / red down contribution bars) with an adverse-action reason list rendered as “Adverse-action notice”. Sample data always labelled; designed loading and error states. Network section “Federated lender network”: hub-and-spoke diagram, 14 partner lenders; caption: “Fourteen lenders contribute gradients each training round; borrower-level data never leaves its lender of origin.” Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [039] Model 07 — liquidity-stress-engine (DARK)

```
Design the model detail page for “Liquidity Stress Engine” — Risk (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $499/mo. Lead sentence: “Projects LCR and NSFR through idiosyncratic and market-wide stress, with a survival horizon and regulator-ready Basel III and FCA templates.” Metrics strip of KPI cards: Conformity assessment Pending · Scenario library Versioned · Horizon Up to 12 months · Templates Basel III, FCA. Interactive demo card (“Run the stress”): inputs — Scenario (select: Idiosyncratic, Market-wide, Combined), Stress horizon (number), Metric (select: LCR, NSFR), Regulator template (select: Basel III, FCA); a single indigo “Run the stress” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [040] Model 08 — mortgage-default-prepay (DARK)

```
Design the model detail page for “Mortgage Default & Prepay” — Credit (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; Federated (indigo); jurisdiction chips US UK; price pill $199/mo. Lead sentence: “Paired default and prepayment curves over a loan's life, federated across servicers, with a servicing recommendation and rate/HPI shock testing.” Metrics strip of KPI cards: Default AUC 0.81 · Prepay AUC 0.77 · Servicer network 9 · Cohorts monitored By vintage. Interactive demo card (“Project the loan”): inputs — Current balance (number), LTV (number), Rate shock (number), HPI shock (number), Show federated-lender percentile (checkbox); a single indigo “Project the loan” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [041] Model 09 — vendor-risk-aiops (DARK)

```
Design the model detail page for “Vendor Risk AIOps” — Ops / Risk (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK EU UAE SG; price pill $99/mo. Lead sentence: “Composite vendor risk across financial, cyber, and concentration dimensions, with continuous monitoring and contract-clause flags.” Metrics strip of KPI cards: Alert precision 0.86 · Dimensions scored 3 · Monitoring Continuous · Regions US, UK, EU, UAE, SG. Interactive demo card (“Score the vendor”): inputs — Vendor (text), Category (select: Cloud infrastructure, Data provider, Payments, Professional services, Logistics), Annual spend (number), Criticality (select: Low, Material, Critical), Flag SLA and contract-clause risk (checkbox); a single indigo “Score the vendor” action runs it; output — a large mono score readout (“Composite risk”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [042] Model 10 — fraud-graph (DARK)

```
Design the model detail page for “Fraud Graph” — Fraud / AML (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK EU UAE; price pill $99/mo. Lead sentence: “Real-time transaction fraud scoring over a 1.2B-node entity graph, returning in under 50 ms from any region.” Metrics strip of KPI cards: Recall @ 0.1% FPR 0.74 · p99 latency 48 ms · Graph size 1.2B nodes · Edge regions US, EU, UAE. Interactive demo card (“Score the transaction”): inputs — Device fingerprint (text), IP route (select: Residential, Datacenter, VPN / proxy, Mobile carrier), Merchant id (text), Amount (number); a single indigo “Score the transaction” action runs it; output — a large mono score readout (“Fraud score”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [043] Model 11 — transaction-monitoring-explainer (DARK)

```
Design the model detail page for “Transaction Monitoring Explainer” — AML (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Turns AML alerts into plain-language rationales with a typology tag and a one-click SAR draft, and feeds analyst dispositions back into retraining.” Metrics strip of KPI cards: Alerts explained 100% · Median draft time 12s · Typologies tagged 9 · Rule mappings FinCEN, FCA, 6AMLD. Interactive demo card (“Explain the alert”): inputs — Alert queue (select: Retail banking, Correspondent banking, Payments / EMI), Typology filter (select: All, Structuring, Layering, Smurfing, Trade-based), Lookback (number), Generate SAR drafts for confirmed alerts (checkbox); a single indigo “Explain the alert” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [044] Model 12 — claim-fraud-vision (DARK)

```
Design the model detail page for “Claim Fraud Vision” — Insurance (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); Beta lifecycle chip; Federated (indigo); jurisdiction chips US UK EU; price pill $99/mo. Lead sentence: “Scores claim photos and documents for fraud likelihood with a visual overlay, benchmarked against a federated insurer network.” Metrics strip of KPI cards: Detection AUC 0.79 · Insurer network 11 · Override logging Mandatory · Evidence packs SII, NAIC, PRA. Interactive demo card (“Assess the claim”): inputs — Claim type (select: Motor, Property, Contents, Commercial), Claimed amount (number), Days since policy start (number), Prior claims (number), Compare against federated network (checkbox); a single indigo “Assess the claim” action runs it; output — a large mono score readout (“Fraud likelihood”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [045] Model 13 — trade-finance-doc-ai (DARK)

```
Design the model detail page for “Trade Finance Doc AI” — Trade Finance / Compliance (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK EU UAE; price pill $79/mo. Lead sentence: “Reads bills of lading, letters of credit, and inspection certificates. Flags discrepancies, sanctions risk, and dual-use goods.” Metrics strip of KPI cards: OCR accuracy 98.6% · Median processing 9 s / bundle · Sanctions lists OFAC, UK, EU, UN · Discrepancy rules UCP 600 / ISBP. Interactive demo card (“Check the bundle”): inputs — Document bundle (select: Full presentation, L/C + BoL only, Inspection docs only), Corridor (select: UAE → EU, US → UK, EU → SG, UK → US), Consignment value (number), Screen for dual-use goods (checkbox); a single indigo “Check the bundle” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [046] Model 14 — cross-border-payment-router (DARK)

```
Design the model detail page for “Cross-Border Payment Router” — Payments (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips Global; price pill $99/mo. Lead sentence: “Compares rails for a payment corridor on cost, speed, and compliance burden, and shows why a route was chosen.” Metrics strip of KPI cards: Rails compared SWIFT, RTP, local · Routing decision Traced · FX markup Disclosed · Travel-rule check Built in. Interactive demo card (“Compare routes”): inputs — Send from (select: US, UK, EU, UAE, SG), Receive in (select: Philippines, India, Nigeria, Mexico, Brazil), Amount (number), Priority (select: Cheapest, Fastest, Balanced); a single indigo “Compare routes” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [047] Model 15 — kyb-graph (DARK)

```
Design the model detail page for “KYB Graph” — Compliance (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK EU UAE; price pill $99/mo. Lead sentence: “Traces ultimate beneficial ownership through corporate structures, cross-checked against registries in four jurisdictions with sanctions and PEP screening.” Metrics strip of KPI cards: UBO resolution rate 91% · Registries US, UK, EU, UAE · Median lookup 6 s · Screening Sanctions + PEP. Interactive demo card (“Trace ownership”): inputs — Entity name (text), Jurisdiction of incorporation (select: US, UK, EU, UAE), UBO threshold (number), Include PEP screening (checkbox); a single indigo “Trace ownership” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [048] Model 16 — tax-residency-classifier (DARK)

```
Design the model detail page for “Tax Residency Classifier” — Compliance (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK EU; price pill $99/mo. Lead sentence: “Determines tax residency from days present, ties, and applicable treaty, showing the tie-breaker trace and CRS/FATCA reportability.” Metrics strip of KPI cards: Backtest agreement 94% · Treaty database Versioned · Tie-breaker trace Always shown · Reportability CRS + FATCA. Interactive demo card (“Determine residency”): inputs — Days in jurisdiction A (number), Days in jurisdiction B (number), Applicable treaty (select: US–UK, US–EU member, UK–EU member, No treaty), Permanent home available in (select: Both, A only, B only, Neither), Assess CRS / FATCA reportability (checkbox); a single indigo “Determine residency” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [049] Model 17 — regulatory-change-summariser (DARK)

```
Design the model detail page for “Regulatory Change Summariser” — Compliance / NLP (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK EU UAE SG; price pill $99/mo. Lead sentence: “Watches SEC, FCA, ESMA, MAS, and ADGM sources and delivers plain-language change digests tagged by impact to your own policies.” Metrics strip of KPI cards: Regulator sources 5 · Citation trace Every item · Spot-check review Human · Delivery Email + webhook. Interactive demo card (“Build the digest”): inputs — Jurisdiction (select: All, US (SEC), UK (FCA), EU (ESMA), SG (MAS)…), Topic (select: Disclosure, Conduct, Capital, Market abuse, Client assets), Window (number), Digest frequency (select: Daily, Weekly, Monthly); a single indigo “Build the digest” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [050] Model 18 — esg-materiality-scorer (DARK)

```
Design the model detail page for “ESG Materiality Scorer” — ESG (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; Federated (indigo); jurisdiction chips EU UK; price pill $199/mo. Lead sentence: “Plots financial against stakeholder impact on a materiality matrix, scores SASB and ISSB topics, and flags greenwashing risk with evidence.” Metrics strip of KPI cards: Taxonomies SASB, ISSB, EU · Disclosure network 19 partners · Greenwashing flag Evidence-backed · Weights Per sector. Interactive demo card (“Score materiality”): inputs — Company or ticker (text), Sector (select: Consumer staples, Energy, Financials, Industrials, Technology), Taxonomy (select: SASB, ISSB, EU Taxonomy), Run greenwashing-risk check (checkbox); a single indigo “Score materiality” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [051] Model 19 — liquidation-valuation (DARK)

```
Design the model detail page for “Liquidation Valuation” — Valuation (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Asset-by-asset recovery under orderly and distressed sale, with a priority-claims waterfall showing what each stakeholder class actually gets.” Metrics strip of KPI cards: Scenarios Base / down / severe · Benchmark library By asset class · Overrides Audit-trailed · Waterfall Priority-ordered. Interactive demo card (“Value the estate”): inputs — Scenario (select: Base, Downside, Severe stress), Sale type (select: Orderly, Distressed), Gross book assets (number), Liquidation timeline (number); a single indigo “Value the estate” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [052] Model 20 — real-options-valuation (DARK)

```
Design the model detail page for “Real Options Valuation” — Valuation (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Values managerial flexibility — expand, delay, abandon — alongside static NPV, and says plainly how much of the answer is the option.” Metrics strip of KPI cards: Option types Expand / delay / abandon · Methods BS, binomial, MC · Flexibility split Always shown · Review trigger Configurable. Interactive demo card (“Value the option”): inputs — Underlying asset value (number), Exercise cost (number), Time to expiration (number), Volatility (number), Option type (select: Expand, Delay, Abandon); a single indigo “Value the option” action runs it; output — a large mono score readout (“Option value / total”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [053] Model 21 — merger-model (DARK)

```
Design the model detail page for “Merger Model” — M&A (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $499/mo. Lead sentence: “Pro forma combined statements from target and acquirer financials, consideration mix, financing and synergies — with every assumption change logged.” Metrics strip of KPI cards: Accounting rule sets US GAAP / IFRS · Assumption log Author + timestamp · External share Sign-off gated · Consideration Cash / stock / debt. Interactive demo card (“Build the pro forma”): inputs — Purchase price (number), Cash consideration (number), Run-rate synergies (number), Accounting standard (select: US GAAP, IFRS); a single indigo “Build the pro forma” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [054] Model 22 — accretion-dilution (DARK)

```
Design the model detail page for “Accretion / Dilution” — M&A (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Year-by-year EPS accretion or dilution with a break-even synergies calculator and sensitivities across price, financing mix, and close timing.” Metrics strip of KPI cards: Break-even synergies Solved · Sensitivities Price / mix / timing · Consensus feed Health-monitored · Annotations Per cell. Interactive demo card (“Run accretion”): inputs — Offer price per share (number), Cash consideration (number), Financing cost (number), Run-rate synergies (number); a single indigo “Run accretion” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [055] Model 23 — lbo-model (DARK)

```
Design the model detail page for “LBO Model” — M&A (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $499/mo. Lead sentence: “Sources and uses, debt paydown with cash sweep, and a returns waterfall showing sponsor IRR and MOIC across entry and exit multiple grids.” Metrics strip of KPI cards: Debt tranches Modelled · Cash sweep Scheduled · Comps feed Weekly · Export audit Per counterparty. Interactive demo card (“Run the LBO”): inputs — Entry multiple (number), Total leverage (number), Exit multiple (number), Hold period (number); a single indigo “Run the LBO” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [056] Model 24 — mbo-model (DARK)

```
Design the model detail page for “MBO Model” — M&A (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK; price pill $199/mo. Lead sentence: “Ownership and proceeds by stakeholder across exit scenarios, showing how incentive-pool sizing changes management's effective ownership.” Metrics strip of KPI cards: Stakeholders modelled Mgmt / sponsor / seller · Rollover Modelled explicitly · Pool templates By deal size · Share log Per party. Interactive demo card (“Split the proceeds”): inputs — Purchase price (number), Management rollover (number), Incentive pool (number), Seller financing (number); a single indigo “Split the proceeds” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [057] Model 25 — spin-off-model (DARK)

```
Design the model detail page for “Spin-Off Model” — M&A (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Pro forma statements for parent and spun-off entity, with an explicit stranded-cost estimate and a separation timeline.” Metrics strip of KPI cards: Entities modelled Parent + SpinCo · Stranded costs Estimated · Allocation library Versioned · Sign-off Finance / legal / tax. Interactive demo card (“Model the separation”): inputs — SpinCo revenue (number), Shared services cost (number), Allocation method (select: Revenue-based, Headcount-based, Usage-based), Separation timeline (number); a single indigo “Model the separation” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [058] Model 26 — carve-out-model (DARK)

```
Design the model detail page for “Carve-Out Model” — M&A (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Standalone P&L and cash flow from allocated historicals, keeping reported, allocated, and pro forma figures visually separate.” Metrics strip of KPI cards: Column basis Reported / allocated / pro forma · TSA timeline Stepped down · Allocation basis 3 methods · Variance log Per change. Interactive demo card (“Build standalone”): inputs — Carve-out revenue (number), Allocation basis (select: Revenue-based, Headcount-based, Usage-based), TSA period (number), Initial TSA cost (number); a single indigo “Build standalone” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [059] Model 27 — recapitalization-model (DARK)

```
Design the model detail page for “Recapitalization” — M&A (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Before-and-after leverage, interest expense, covenant headroom, and ownership change, with a dividend-recap proceeds calculator.” Metrics strip of KPI cards: Covenant library Per agreement · Rating impact Comps-estimated · Structures Version-historied · Dividend recap Modelled. Interactive demo card (“Model the recap”): inputs — Proposed debt (number), Blended rate (number), Dividend to shareholders (number), Purpose (select: Dividend recap, Refinancing, Leverage reduction); a single indigo “Model the recap” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [060] Model 28 — purchase-price-allocation (DARK)

```
Design the model detail page for “Purchase Price Allocation” — M&A (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Full allocation across tangibles, identifiable intangibles, deferred tax, and goodwill, with a reconciliation strip and per-intangible amortisation.” Metrics strip of KPI cards: Reconciliation Must balance · Useful lives Benchmarked · Auditor checklist Per allocation · Post-close Monitored vs actual. Interactive demo card (“Allocate”): inputs — Purchase consideration (number), Target net assets (number), Standard (select: US GAAP, IFRS), Deferred tax rate (number); a single indigo “Allocate” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [061] Model 29 — growth-equity-model (DARK)

```
Design the model detail page for “Growth Equity Model” — Venture / Growth (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Dilution, growth-and-margin forecast, and investor IRR/MOIC across exit scenarios, with preferred terms modelled rather than assumed away.” Metrics strip of KPI cards: Preferred terms Template library · Primary/secondary Split modelled · Downside library Team-shared · Export IC-ready. Interactive demo card (“Model the round”): inputs — Entry valuation (number), Investment (number), Secondary share (number), Liquidation preference (select: 1x non-participating, 1x participating, 1.5x non-participating); a single indigo “Model the round” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [062] Model 30 — ipo-model (DARK)

```
Design the model detail page for “IPO Model” — Venture / Growth (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $499/mo. Lead sentence: “Post-IPO ownership and dilution, comps-based multiple comparison, pro forma statements, lock-up timeline — with every view and export logged.” Metrics strip of KPI cards: Access log Every view + export · Comps feed Health-monitored · Underwriter terms Benchmarked · Disclosure risk Highest in catalogue. Interactive demo card (“Model the offering”): inputs — Shares offered (number), Range low (number), Range high (number), Include greenshoe (checkbox); a single indigo “Model the offering” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [063] Model 31 — startup-financial-model (DARK)

```
Design the model detail page for “Startup Financial Model” — Venture / Growth (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips Global; price pill $99/mo. Lead sentence: “A guided builder from funnel to headcount that returns burn, runway, and a round planner — usable by a founder, exportable as an investor-grade model.” Metrics strip of KPI cards: Guided build No finance background · Scenarios One-tap 3-way · Consistency check Automatic · Benchmarks Opt-in federated. Interactive demo card (“Build the model”): inputs — Current MRR (number), Monthly growth (number), Net monthly burn (number), Cash on hand (number), Scenario (select: Conservative, Base, Aggressive); a single indigo “Build the model” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [064] Model 32 — vc-method-valuation (DARK)

```
Design the model detail page for “VC Method Valuation” — Venture / Growth (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips Global; price pill $99/mo. Lead sentence: “Implied pre- and post-money from exit assumptions and a target return, with sensitivity heatmaps over multiple, growth, timing, and required return.” Metrics strip of KPI cards: Exit multiples Benchmarked quarterly · Sensitivities 4-way heatmap · Return assumption Audit-trailed · Firm comparison Same-stage history. Interactive demo card (“Value it”): inputs — Exit year (number), Exit revenue (number), Target return (number), Expected future dilution (number); a single indigo “Value it” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [065] Model 33 — vc-portfolio-tracker (DARK)

```
Design the model detail page for “VC Portfolio Tracker” — Venture / Growth (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; Federated (indigo); jurisdiction chips US UK EU; price pill $99/mo. Lead sentence: “Portfolio marks rolled up to fund-level MOIC, IRR, DPI and TVPI, with concentration views and a federated peer-median benchmark.” Metrics strip of KPI cards: Fund metrics MOIC / IRR / DPI / TVPI · Concentration Sector / geo / stage / vintage · Peer benchmark Federated median · Mark methodology Consistency-checked. Interactive demo card (“Roll up the fund”): inputs — Vintage (number), Positions (number), Capital deployed (number), Compare against federated peer median (checkbox); a single indigo “Roll up the fund” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [066] Model 34 — cap-table-manager (DARK)

```
Design the model detail page for “Cap Table Manager” — Venture / Growth (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK EU; price pill $99/mo. Lead sentence: “Interactive cap table across every instrument, with a round simulator that updates ownership, pool, and per-stakeholder dilution in place.” Metrics strip of KPI cards: Instruments Common / pref / options / SAFEs · Reconciliation Must total 100% · Access log Full audit trail · Templates Per jurisdiction. Interactive demo card (“Simulate a round”): inputs — Round size (number), Pre-money (number), Post-round option pool (number), Pool created pre-money (checkbox); a single indigo “Simulate a round” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [067] Model 35 — waterfall-distribution (DARK)

```
Design the model detail page for “Waterfall Distribution Engine” — Venture / Growth (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Distribution by stakeholder across the preference stack, redrawing live against exit value so the breakpoints are visible.” Metrics strip of KPI cards: Tiers Visually stacked · Cap-table sync Reconciled · Preference stack By round vintage · Runs Version-historied. Interactive demo card (“Run the waterfall”): inputs — Exit value (number), Senior preference (number), Participation (select: Non-participating, Participating, Participating capped at 2x), Total preference stack (number); a single indigo “Run the waterfall” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [068] Model 36 — safe-note-conversion (DARK)

```
Design the model detail page for “SAFE & Note Conversion” — Venture / Growth (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK; price pill $99/mo. Lead sentence: “Conversion price and resulting ownership, shown side by side for pre-money and post-money SAFE treatment so the dilution difference is explicit.” Metrics strip of KPI cards: Forms YC + NVCA standard · Treatments Pre- vs post-money · Regression suite On conversion math · Runs Audit-trailed. Interactive demo card (“Convert”): inputs — Principal (number), Valuation cap (number), Discount (number), Qualifying round pre-money (number); a single indigo “Convert” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [069] Model 37 — follow-on-advisor (DARK)

```
Design the model detail page for “Follow-On Advisor” — Venture / Growth (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK EU; price pill $99/mo. Lead sentence: “Dilution with and without pro-rata participation, expected fund-level return contribution, and a participate / pass / partial recommendation with its reasoning.” Metrics strip of KPI cards: Recommendation With reasoning · Reserve tracking Fund-wide · Concentration Guardrailed · Decisions Logged. Interactive demo card (“Advise”): inputs — Current ownership (number), Pro-rata amount (number), Remaining reserves (number), Position as share of NAV (number); a single indigo “Advise” action runs it; output — a large mono score readout (“Participate score”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [070] Model 38 — startup-runway-tracker (DARK)

```
Design the model detail page for “Startup Runway Tracker” — Venture / Growth (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips Global; price pill $99/mo. Lead sentence: “Live cash and burn projecting a runway date, with hiring and fundraising toggles and a minimum-cash alert line.” Metrics strip of KPI cards: Connections Bank / payroll or manual · Alert line Minimum-cash threshold · Alert delivery Reliability-monitored · Benchmarks Anonymised aggregate. Interactive demo card (“Project runway”): inputs — Cash balance (number), Monthly net burn (number), Planned hires (number), Minimum-cash alert (number); a single indigo “Project runway” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [071] Model 39 — fund-cash-flow-modeler (DARK)

```
Design the model detail page for “Fund Cash-Flow Modeler” — Private Funds (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Capital-call and distribution projections with ending unfunded commitments, pacing charts, and LP-level allocation.” Metrics strip of KPI cards: Granularity Monthly / quarterly / annual · Pacing benchmark By strategy + vintage · Recycling Per LPA terms · Notices Logged per LP. Interactive demo card (“Project cash flows”): inputs — Total commitments (number), Granularity (select: Monthly, Quarterly, Annual), Investment period (number), Apply recycling provisions (checkbox); a single indigo “Project cash flows” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [072] Model 40 — fund-performance-engine (DARK)

```
Design the model detail page for “Fund Performance Engine” — Private Funds (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; Federated (indigo); jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Gross and net IRR, MOIC, DPI, RVPI and TVPI from investment-level cash flows, with vintage comparison and a federated PME benchmark.” Metrics strip of KPI cards: Gross and net Both reported · Benchmark Federated PME · Fee waterfall Audited · Exit sensitivity On unrealised. Interactive demo card (“Compute performance”): inputs — Vintage (number), Capital called (number), Carried interest (number), Exit multiple on unrealised (number); a single indigo “Compute performance” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [073] Model 41 — capital-budgeting-engine (DARK)

```
Design the model detail page for “Capital Budgeting Engine” — Capital Budgeting (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips Global; price pill $99/mo. Lead sentence: “NPV, IRR, payback and profitability index across candidate projects, ranked by value creation and capital efficiency.” Metrics strip of KPI cards: Metrics NPV / IRR / PB / PI · WACC library Per business unit · Portfolio view Committed vs available · Approval NPV-threshold gated. Interactive demo card (“Rank the projects”): inputs — Discount rate (number), Available capital (number), Evaluation horizon (number), Rank by (select: NPV, IRR, Profitability index, Payback); a single indigo “Rank the projects” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [074] Model 42 — project-finance-modeler (DARK)

```
Design the model detail page for “Project Finance Modeler” — Project Finance (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU UAE; price pill $499/mo. Lead sentence: “Full debt-service schedule with DSCR and LLCR against covenant minimums, separate lender and sponsor views, and a headroom traffic light.” Metrics strip of KPI cards: Coverage DSCR + LLCR · Views Lender and sponsor · Headroom Traffic light · Breach warning Across live projects. Interactive demo card (“Run the schedule”): inputs — Construction cost (number), Gearing (number), Debt tenor (number), DSCR covenant (number); a single indigo “Run the schedule” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [075] Model 43 — infrastructure-investment-modeler (DARK)

```
Design the model detail page for “Infrastructure Investment Modeler” — Project Finance (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU UAE; price pill $499/mo. Lead sentence: “Investor returns across delay, cost-overrun, and low-utilisation downsides as a tornado chart, over a concession timeline from construction to hand-back.” Metrics strip of KPI cards: Downside cases Delay / overrun / utilisation · Concession To hand-back · Benchmarks Comparable projects · Milestones Case-system tracked. Interactive demo card (“Stress the concession”): inputs — Capital cost (number), Concession period (number), Construction period (number), Tariff escalation (number); a single indigo “Stress the concession” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [076] Model 44 — renewable-project-modeler (DARK)

```
Design the model detail page for “Renewable Project Modeler” — Project Finance (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Generation forecast with degradation, DSCR and project/equity IRR, and tax credits shown as their own waterfall step.” Metrics strip of KPI cards: Degradation Modelled · Tax credits Separate step · Resource feeds Health-monitored · Reconciliation Post-COD vs forecast. Interactive demo card (“Model the project”): inputs — Installed capacity (number), Capacity factor (number), PPA price (number), Annual degradation (number); a single indigo “Model the project” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [077] Model 45 — re-development-modeler (DARK)

```
Design the model detail page for “RE Development Modeler” — Real Estate (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Monthly draw schedule and construction-to-exit cash flow with developer profit, IRR and equity multiple, plus unit-mix and absorption editing.” Metrics strip of KPI cards: Draw schedule Monthly · Cost benchmarks Per market + type · Reconciliation Draw vs actual · Milestones Permit / entitlement. Interactive demo card (“Model the development”): inputs — Land cost (number), Hard cost / sq ft (number), Units (number), Absorption pace (number); a single indigo “Model the development” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [078] Model 46 — re-acquisition-underwriter (DARK)

```
Design the model detail page for “RE Acquisition Underwriter” — Real Estate (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; Federated (indigo); jurisdiction chips US UK EU; price pill $99/mo. Lead sentence: “Cap rate, NOI, cash-on-cash and IRR at property and investor level, with a federated comps benchmark from the same submarket.” Metrics strip of KPI cards: Levels Property + investor · Comps Federated, submarket · Pipeline Screened → closed · Refresh Scheduled. Interactive demo card (“Underwrite”): inputs — Purchase price (number), Year-1 NOI (number), LTV (number), Exit cap rate (number); a single indigo “Underwrite” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [079] Model 47 — lease-vs-buy-analyzer (DARK)

```
Design the model detail page for “Lease vs. Buy Analyzer” — Real Estate (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK EU; price pill $99/mo. Lead sentence: “Total-cost-of-ownership comparison with an NPV recommendation, and the ASC 842 / IFRS 16 treatment called out because it changes the balance sheet, not just the cash.” Metrics strip of KPI cards: Standards ASC 842 / IFRS 16 · Comparison Cash + balance sheet · Discount rates Benchmarked by class · Accuracy Tracked vs decisions. Interactive demo card (“Compare”): inputs — Purchase price (number), Annual lease (number), Term (number), Standard (select: ASC 842, IFRS 16); a single indigo “Compare” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [080] Model 48 — debt-schedule-engine (DARK)

```
Design the model detail page for “Debt Schedule Engine” — Treasury (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); GA lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Linked schedule across revolver, term loans and notes with sweep, covenant headroom, and a maturity strip that makes a refinancing wall obvious early.” Metrics strip of KPI cards: Instruments Revolver / TL / notes · Sweep Toggleable · Covenants Per lender template · Maturity wall Early warning. Interactive demo card (“Build the schedule”): inputs — Total debt (number), Revolver drawn (number), Blended rate (number), Apply cash sweep (checkbox); a single indigo “Build the schedule” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [081] Model 49 — working-capital-forecaster (DARK)

```
Design the model detail page for “Working Capital Forecaster” — Treasury (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK EU; price pill $99/mo. Lead sentence: “DSO, DIO, DPO and the cash-conversion cycle, with a seasonality-aware forecast and a flag when the forecast implies a funding gap.” Metrics strip of KPI cards: Cycle metrics DSO / DIO / DPO · Seasonality Detected + monitored · Funding gap Flagged · Terms benchmark By industry. Interactive demo card (“Forecast working capital”): inputs — DSO (number), DIO (number), DPO (number), Revenue growth (number); a single indigo “Forecast working capital” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [082] Model 50 — securitization-modeler (DARK)

```
Design the model detail page for “Securitization Modeler” — Structured Finance (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $499/mo. Lead sentence: “Investor cash flows by tranche with WAL and credit enhancement, and a waterfall visual showing exactly where cash diverts when a trigger trips.” Metrics strip of KPI cards: Tranche outputs Cash flow + WAL · Enhancement Computed per tranche · Triggers Per deal structure · Stress library Centrally maintained. Interactive demo card (“Run the structure”): inputs — Pool balance (number), Default rate (number), Loss severity (number), Prepayment (number); a single indigo “Run the structure” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [083] Model 51 — trend-following-engine (DARK)

```
Design the model detail page for “Trend Following Engine” — Trading / Directional (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Moving-average crossover and breakout trend signals with a live equity curve and per-instrument signal strength. Signals only — GeFi does not place or route orders.” Metrics strip of KPI cards: Realistic Sharpe 0.5 – 1.0 · Signal decay Monitored · Crowding Flagged · Execution Yours, not ours. Interactive demo card (“Generate signals”): inputs — Universe (select: Global futures, US equities, FX majors, Commodities), Lookback window (number), Signal type (select: MA crossover, Breakout, Both), Volatility target (number); a single indigo “Generate signals” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [084] Model 52 — cross-sectional-mean-reversion (DARK)

```
Design the model detail page for “Cross-Sectional Mean Reversion” — Trading / Directional (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Securities ranked by short-term overreaction with a reversion half-life per name. Signals only — GeFi does not place or route orders.” Metrics strip of KPI cards: Ranking Overreaction score · Half-life Per name · Regime monitor Trending vs reverting · Execution Yours, not ours. Interactive demo card (“Rank the universe”): inputs — Universe (select: S&P 500, Russell 2000, STOXX 600, FTSE 350), Deviation window (number), Holding period (number), Sector-neutralise (checkbox); a single indigo “Rank the universe” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [085] Model 53 — breakout-signal-engine (DARK)

```
Design the model detail page for “Breakout Signal Engine” — Trading / Directional (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Support and resistance levels with a volume-and-follow-through confirmation score, and the false-breakout rate published alongside. Signals only.” Metrics strip of KPI cards: False-breakout rate Published · Confirmation Volume + follow-through · Monitored by Instrument + vol regime · Execution Yours, not ours. Interactive demo card (“Score the breakout”): inputs — Instrument (text), Level lookback (number), Volume threshold (number), Volatility regime (select: Low, Normal, Elevated); a single indigo “Score the breakout” action runs it; output — a large mono score readout (“Confirmation”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [086] Model 54 — reversal-detector (DARK)

```
Design the model detail page for “Reversal Detector” — Trading / Directional (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Top and bottom detection with the specific pattern flagged and accuracy segmented by regime. The hardest-to-time signal in the catalogue. Signals only.” Metrics strip of KPI cards: Patterns Exhaustion / divergence / climax · Accuracy By market regime · Manual review Highest in catalogue · Execution Yours, not ours. Interactive demo card (“Detect reversal”): inputs — Instrument (text), Looking for (select: Top, Bottom, Either), Pattern window (number), Market regime (select: Trending, Ranging, High volatility); a single indigo “Detect reversal” action runs it; output — a large mono score readout (“Reversal confidence”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [087] Model 55 — global-macro-signal-engine (DARK)

```
Design the model detail page for “Global Macro Signal Engine” — Trading / Directional (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; Federated (indigo); jurisdiction chips US UK EU SG; price pill $199/mo. Lead sentence: “Theme-driven position signals across currencies, rates and indices with macro-data citations, benchmarked against federated consensus positioning. Signals only.” Metrics strip of KPI cards: Themes Growth / inflation / policy · Citations Per signal · Consensus Federated positioning · Execution Yours, not ours. Interactive demo card (“Generate signals”): inputs — Asset class (select: FX majors, Rates, Equity indices), Horizon (select: 1 month, 3 months, 6 months), Primary theme (select: Growth, Inflation, Policy divergence, All), Show federated consensus positioning (checkbox); a single indigo “Generate signals” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [088] Model 56 — carry-trade-optimizer (DARK)

```
Design the model detail page for “Carry Trade Optimizer” — Trading / Directional (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU SG; price pill $199/mo. Lead sentence: “Rate and yield differentials scored against volatility, with crash risk shown as a warning panel rather than a footnote. Signals only.” Metrics strip of KPI cards: Carry score Volatility-adjusted · Crash risk Prominent, not footnoted · Sizing Guardrail library · Execution Yours, not ours. Interactive demo card (“Score the carry”): inputs — Pair (select: AUD/JPY, NZD/JPY, USD/TRY, MXN/JPY, EUR/CHF), Horizon (number), Leverage (number), Tail-hedged (checkbox); a single indigo “Score the carry” action runs it; output — a large mono score readout (“Adjusted carry”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [089] Model 57 — statistical-arbitrage-engine (DARK)

```
Design the model detail page for “Statistical Arbitrage Engine” — Trading / Arbitrage (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; Federated (indigo); jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Cointegration-tested basket trades with a market-neutral beta confirmation, and a federated crowding score — stat-arb edges decay fast once crowded. Signals only.” Metrics strip of KPI cards: Cointegration test Engle-Granger / Johansen · Target beta ~0 · Holding period Hours to days · Crowding Federated score. Interactive demo card (“Find baskets”): inputs — Universe (select: US equities, EU equities, Sector ETFs, Global futures), Cointegration test (select: Engle-Granger, Johansen), Basket size (number), Max residual beta (number); a single indigo “Find baskets” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [090] Model 58 — pairs-trading-engine (DARK)

```
Design the model detail page for “Pairs Trading Engine” — Trading / Arbitrage (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Cointegration-tested pairs with a live spread z-score against entry/exit bands, and a signal when the spread crosses threshold. Signals only.” Metrics strip of KPI cards: Cointegration test Engle-Granger / Johansen · Half-life Monitored · Discovery Continuous scan · Execution Yours, not ours. Interactive demo card (“Analyse the pair”): inputs — Pair (text), Lookback (number), Entry threshold (number), Exit threshold (number); a single indigo “Analyse the pair” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [091] Model 59 — convertible-arbitrage-modeler (DARK)

```
Design the model detail page for “Convertible Arbitrage Modeler” — Trading / Arbitrage (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “The implied-vol gap between a convertible's embedded option and the equity options market, a delta-hedge ratio, and credit-spread sensitivity. Signals only.” Metrics strip of KPI cards: Vol gap Embedded vs listed · Hedge ratio Delta-calculated · Credit sensitivity Charted · Execution Yours, not ours. Interactive demo card (“Model the convertible”): inputs — Conversion price (number), Coupon (number), Credit spread (number), Delta hedge ratio (number); a single indigo “Model the convertible” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [092] Model 60 — fixed-income-arbitrage-engine (DARK)

```
Design the model detail page for “Fixed Income Arbitrage Engine” — Trading / Arbitrage (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $499/mo. Lead sentence: “Mispricing signals across on-the-run/off-the-run, swap spreads, and curve relative value, with leverage disclosed explicitly rather than understated. Signals only.” Metrics strip of KPI cards: Signal types OTR/OFR, swap spread, curve RV · Leverage Disclosed, not assumed · Repo stress Scenario library · Execution Yours, not ours. Interactive demo card (“Find mispricings”): inputs — Universe (select: US Treasuries, UK Gilts, EU sovereigns), Strategy type (select: OTR/OFR basis, Swap spread, Curve relative value), Assumed leverage (number), Apply repo-market stress scenario (checkbox); a single indigo “Find mispricings” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [093] Model 61 — merger-arbitrage-tracker (DARK)

```
Design the model detail page for “Merger Arbitrage Tracker” — Trading / Arbitrage (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $499/mo. Lead sentence: “Deal spread and completion probability from public deal data only, with contributing factors broken out. Never non-public information. Signals only.” Metrics strip of KPI cards: Data source Public filings only · Completion factors Regulatory / financing / shareholder · Info barrier Audit-trailed · Execution Yours, not ours. Interactive demo card (“Assess the deal”): inputs — Announced deal (text), Deal price (number), Current target price (number), Expected close (number); a single indigo “Assess the deal” action runs it; output — a large mono score readout (“Completion probability”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [094] Model 62 — fx-triangular-arbitrage-scanner (DARK)

```
Design the model detail page for “FX Triangular Arbitrage Scanner” — Trading / Arbitrage (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); GA lifecycle chip; jurisdiction chips US UK EU SG; price pill $199/mo. Lead sentence: “Cross-rate inconsistencies with the implied profit shown net of transaction cost — most triangular arb is arbitraged away by cost alone in liquid pairs. Signals only.” Metrics strip of KPI cards: Rate feeds Multi-venue · Viability Net-of-cost flag · Window frequency Dashboarded · Execution Yours, not ours. Interactive demo card (“Scan for arbitrage”): inputs — Currency triangle (select: EUR/USD-USD/JPY-EUR/JPY, GBP/USD-USD/CHF-GBP/CHF, AUD/USD-USD/CAD-AUD/CAD), Venue (select: Primary ECN, Retail broker, Interbank), Notional (number), Assumed execution latency (number); a single indigo “Scan for arbitrage” action runs it; output — a large mono score readout (“Net-of-cost profit”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [095] Model 63 — calendar-spread-optimizer (DARK)

```
Design the model detail page for “Calendar Spread Optimizer” — Trading / Arbitrage (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Near/far expiration price differential with a roll-yield estimate and the term-structure regime shown, so the spread's economic driver is visible, not just its value. Signals only.” Metrics strip of KPI cards: Roll yield Estimated · Regime Contango / backwardation · Feed health Per underlying · Execution Yours, not ours. Interactive demo card (“Analyse the term structure”): inputs — Underlying (text), Near-dated contract (number), Far-dated contract (number), Contract type (select: Futures, Options); a single indigo “Analyse the term structure” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [096] Model 64 — options-vol-arb-engine (DARK)

```
Design the model detail page for “Options Volatility Arbitrage Engine” — Trading / Arbitrage (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $499/mo. Lead sentence: “Full implied-vol surface with model fits overlaid, a mispricing heatmap by strike and tenor, and Greeks shown alongside every flagged mispricing. Signals only.” Metrics strip of KPI cards: Models Black-Scholes / SABR / Heston · Mispricing view Heatmap by strike/tenor · Greeks Shown with every flag · Execution Yours, not ours. Interactive demo card (“Scan the surface”): inputs — Underlying (text), Expiry (number), Model fit (select: Black-Scholes, SABR, Heston), Mispricing threshold (number); a single indigo “Scan the surface” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [097] Model 65 — market-making-engine (DARK)

```
Design the model detail page for “Market Making Engine” — Trading / Microstructure (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $499/mo. Lead sentence: “Avellaneda-Stoikov-style optimal bid/ask quotes for a target inventory band. Quoting signals for your own infrastructure — GeFi does not act as a market maker or provide direct market access.” Metrics strip of KPI cards: Quoting model Avellaneda-Stoikov · MiFID II RTS 6 Self-assessment tracked · SEC 15c3-5 Risk controls tracked · Execution Yours, not ours. Interactive demo card (“Generate quotes”): inputs — Instrument (text), Risk aversion (gamma) (number), Target inventory band (number), Order-arrival intensity (number); a single indigo “Generate quotes” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [098] Model 66 — hft-signal-research-engine (DARK)

```
Design the model detail page for “HFT Signal Research Engine” — Trading / Microstructure (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $499/mo. Lead sentence: “Order-book-imbalance and Hawkes-process intensity signals over historical tick data. A research and backtesting tool — not live microsecond execution, which GeFi's infrastructure does not provide.” Metrics strip of KPI cards: Scope Research, not live execution · Signals Book imbalance, Hawkes intensity · Edge decay vs latency, backtested · Data Historical tick. Interactive demo card (“Research the signal”): inputs — Instrument (text), Signal (select: Order-book imbalance, Hawkes intensity, Both), Lookback window (number), Assumed round-trip latency (number); a single indigo “Research the signal” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [099] Model 67 — multifactor-ranking-engine (DARK)

```
Design the model detail page for “Multifactor Ranking Engine” — Trading / Factor (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK EU; price pill $99/mo. Lead sentence: “A composite score blending value, momentum, quality, size and low-volatility factors, with per-factor contribution bars and live-adjustable weights. Signals only.” Metrics strip of KPI cards: Framework Fama-French 3/5-factor · Attribution Per-factor bars · Crowding Monitored · Execution Yours, not ours. Interactive demo card (“Rank the security”): inputs — Universe (select: US large-cap, US small-cap, EU equities, UK equities), Value weight (number), Momentum weight (number), Quality weight (number); a single indigo “Rank the security” action runs it; output — a large mono score readout (“Composite score”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [100] Model 68 — momentum-factor-screener (DARK)

```
Design the model detail page for “Momentum Factor Screener” — Trading / Factor (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK EU; price pill $99/mo. Lead sentence: “Price momentum and earnings-surprise momentum ranked side by side, with momentum-crash risk shown prominently — not buried in fine print. Signals only.” Metrics strip of KPI cards: Momentum types Price + earnings surprise · Crash risk Prominent, not footnoted · Windows 3 / 6 / 12 month · Execution Yours, not ours. Interactive demo card (“Screen for momentum”): inputs — Universe (select: US large-cap, US small-cap, EU equities, UK equities), Lookback window (select: 3-month, 6-month, 12-month), Skip most recent month (checkbox), Minimum earnings surprise (number); a single indigo “Screen for momentum” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [101] Model 69 — value-low-vol-screener (DARK)

```
Design the model detail page for “Value & Low-Volatility Screener” — Trading / Factor (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips US UK EU; price pill $99/mo. Lead sentence: “Securities ranked by book-to-price and realised/implied volatility, with an overlay showing where the two anomalies agree or conflict. Signals only.” Metrics strip of KPI cards: Anomalies Value + low-volatility · Data quality Restatement-monitored · Refresh Quarterly · Execution Yours, not ours. Interactive demo card (“Screen the universe”): inputs — Universe (select: US large-cap, US small-cap, EU equities, UK equities), Volatility measure (select: Realised, Implied), Minimum book-to-price (number), Show combined overlay (checkbox); a single indigo “Screen the universe” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [102] Model 70 — risk-parity-allocator (DARK)

```
Design the model detail page for “Risk Parity Allocator” — Trading / Factor (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; Federated (indigo); jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Asset-class-level allocation where each class contributes equal risk, not equal dollar weight — with the leverage this typically requires disclosed plainly. Signals only.” Metrics strip of KPI cards: Level Asset class, not security · Allocation basis Equal risk contribution · Leverage Indicator shown · Benchmark Federated peer allocations. Interactive demo card (“Allocate by risk”): inputs — Target portfolio volatility (number), Allow bond-sleeve leverage (checkbox), Rebalance frequency (select: Monthly, Quarterly), Show federated peer benchmark (checkbox); a single indigo “Allocate by risk” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [103] Model 71 — gradient-boosted-alpha-engine (DARK)

```
Design the model detail page for “Gradient-Boosted Alpha Engine” — Trading / ML & Alt-Data (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Return-prediction scores with SHAP feature importance, and an out-of-sample chart that separates training fit from live performance. Signals only.” Metrics strip of KPI cards: Explanation SHAP per prediction · Validation Out-of-sample, shown · Retraining Drift-triggered · Execution Yours, not ours. Interactive demo card (“Score the security”): inputs — Security (text), Feature set (select: Price only, Price + fundamental, Full (price/fundamental/macro)), Prediction horizon (number), Show out-of-sample validation (checkbox); a single indigo “Score the security” action runs it; output — a large mono score readout (“Alpha score”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [104] Model 72 — transformer-sentiment-alpha (DARK)

```
Design the model detail page for “Transformer Sentiment Alpha” — Trading / ML & Alt-Data (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “News wires, earnings calls and analyst commentary into a tradeable position signal — with per-source attribution for every day's signal. Signals only.” Metrics strip of KPI cards: Sources Wires / transcripts / analyst notes · Output Position signal, not score · Attribution Per source, per day · Execution Yours, not ours. Interactive demo card (“Generate the signal”): inputs — Security (text), Sources (select: All, News wires only, Transcripts only, Analyst notes only), Signal window (number), Require cross-source agreement (checkbox); a single indigo “Generate the signal” action runs it; output — a large mono score readout (“Position signal”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [105] Model 73 — rl-execution-agent (DARK)

```
Design the model detail page for “RL Execution Agent” — Trading / ML & Alt-Data (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $499/mo. Lead sentence: “Reinforcement-learned execution schedules for order slicing, with simulated slippage savings vs TWAP. It schedules slicing — it does not route or execute orders.” Metrics strip of KPI cards: Scope Scheduling, not autonomy · Baseline vs naive TWAP · Audit trail Every recommendation · Execution Yours, not ours. Interactive demo card (“Schedule the order”): inputs — Order size (number), Order as % of ADV (number), Urgency (select: Low, Medium, High), Benchmark (select: VWAP, Arrival price, TWAP); a single indigo “Schedule the order” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [106] Model 74 — alt-data-alpha-scanner (DARK)

```
Design the model detail page for “Alternative Data Alpha Scanner” — Trading / ML & Alt-Data (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; Federated (indigo); jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Alpha scores from satellite foot traffic, card-spend panels, and web trends, with per-source contribution and aggregate-only federated pooling. Signals only.” Metrics strip of KPI cards: Sources Satellite / card / web · Contribution Per source · Federation Aggregate-only, audited · Execution Yours, not ours. Interactive demo card (“Scan the ticker”): inputs — Security (text), Sector (select: Consumer / retail, Industrials, Energy, Real estate), Sources (select: All available, Satellite only, Card spend only, Web only), Include federated coverage (checkbox); a single indigo “Scan the ticker” action runs it; output — a large mono score readout (“Alpha score”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [107] Model 75 — strategy-construction-engine (DARK)

```
Design the model detail page for “Strategy Construction Engine” — Trading / Infrastructure (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “The pipeline the other trading models sit on — plug in any alpha signal, configure risk, cost and construction models, and get final position sizes. Signals only.” Metrics strip of KPI cards: Signal input Yours or any GeFi model · Cost models Flat / linear / piecewise / quadratic · Volatility GARCH / EGARCH, live · Config history Versioned. Interactive demo card (“Construct the portfolio”): inputs — Alpha signal (select: Own signal (upload), Multifactor Ranking, Momentum Screener, Trend Following), Transaction-cost model (select: Flat, Linear, Piecewise-linear, Quadratic), Gross exposure limit (number), Volatility model (select: GARCH, EGARCH); a single indigo “Construct the portfolio” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Compliance callout (amber): hypothetical-performance disclaimer and signals-only statement — prominent, above the fold of the demo card, never fine print. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [108] Model 76 — gefi-copilot (DARK)

```
Design the model detail page for “GeFi Copilot” — Generative / Copilot (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Chat surface over your portfolio and subscribed models, where every numeric claim carries a run id that resolves to its audit-log proof.” Metrics strip of KPI cards: Claims with a run id 98.2% · Median answer latency 4.1s · Models callable Your subscriptions · Ships as advice No. Interactive demo card (“Ask the copilot”): inputs — Question (textarea), Portfolio scope (select: EU credit book, US SME book, Global macro overlay), Horizon (number), Require a run id for every figure (checkbox); a single indigo “Ask the copilot” action runs it; output — a generated-text panel in a mono block with a copy button and sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [109] Model 77 — ic-credit-memo-generator (DARK)

```
Design the model detail page for “IC & Credit Memo Generator” — Generative / Documents (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Drafts investment-committee and credit memos from a deal file, with every figure linked back to the model run that produced it.” Metrics strip of KPI cards: Figures with a run id 100% · Median draft time 38s · Templates versioned Yes · Watermark until signoff Enforced. Interactive demo card (“Draft the memo”): inputs — Deal or loan file (select: Project Meridian (LBO), Harbour SME facility, Northwind refinancing), Template (select: Investment-committee memo, Credit memo), Sections (number), Watermark draft until sign-off (checkbox); a single indigo “Draft the memo” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [110] Model 78 — board-lp-report-generator (DARK)

```
Design the model detail page for “Board & LP Report Generator” — Generative / Documents (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Quarterly LP letters and board decks drafted from Fund Performance Engine records, with GIPS-aware language and auto-inserted past-performance disclaimers.” Metrics strip of KPI cards: Figures reconciled 100% · Median draft time 52s · GIPS language checks Enabled · Per-LP distribution log Audited. Interactive demo card (“Draft the report”): inputs — Fund (select: Fund III, Fund IV, Continuation vehicle I), Period (select: Q1, Q2, Q3, Q4), Document (select: Quarterly LP letter, Board deck), GIPS-aware performance language (checkbox); a single indigo “Draft the report” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [111] Model 79 — scenario-narrative-engine (DARK)

```
Design the model detail page for “Scenario Narrative Engine” — Generative / Narrative (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Turns a stress-test run into prose in three registers — board summary, regulator submission, internal deep-dive — with every sentence linked to the figures it describes.” Metrics strip of KPI cards: Registers 3 · Claims consistency-checked 100% · Regulator formats FCA, ECB · Median draft time 21s. Interactive demo card (“Write the narrative”): inputs — Source run (select: Liquidity Stress Engine — severe adverse, IRRBB — parallel +200bp, IRRBB — steepener), Audience register (select: Board summary, Regulator submission, Internal deep-dive), Regulator format (select: None, FCA, ECB), Block on any claim that fails the consistency check (checkbox); a single indigo “Write the narrative” action runs it; output — a generated-text panel in a mono block with a copy button and sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [112] Model 80 — disclosure-drafter (DARK)

```
Design the model detail page for “Disclosure Drafter” — Generative / Documents (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $499/mo. Lead sentence: “Financials in, draft MD&A and risk-factor language out — redlined against the prior filing, watermarked for counsel, and never filed by the model.” Metrics strip of KPI cards: Drafts, never files By design · Watermark removable No · Requirement libraries SEC, UK, EU · Paragraph provenance Tracked. Interactive demo card (“Draft disclosures”): inputs — Filing (select: Form 10-K, Form 10-Q, UK Annual Report, EU Annual Financial Report), Requirement library (select: SEC (Reg S-K), UK, EU), Period (text), Redline against prior period (checkbox); a single indigo “Draft disclosures” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [113] Model 81 — cecl-ifrs9-ecl-engine (DARK)

```
Design the model detail page for “CECL / IFRS 9 ECL Engine” — Banking / Provisioning (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $499/mo. Lead sentence: “Twelve-month and lifetime expected credit losses by stage, with a stage-migration matrix and a provision waterfall attributing every quarter's change.” Metrics strip of KPI cards: Standards CECL, IFRS 9 · Stages modelled 1 / 2 / 3 · Scenario weights Editable · Validation pack SR 11-7 style. Interactive demo card (“Calculate ECL”): inputs — Standard (select: CECL, IFRS 9), Base scenario weight (number), Adverse scenario weight (number), Measurement (select: 12-month ECL, Lifetime ECL); a single indigo “Calculate ECL” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [114] Model 82 — irrbb-alm-modeler (DARK)

```
Design the model detail page for “IRRBB / ALM Modeler” — Banking / ALM (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $499/mo. Lead sentence: “EVE and NII sensitivity across the six Basel IRRBB shocks, with a repricing-gap table and live behavioural-assumption toggles.” Metrics strip of KPI cards: Basel shocks 6 · Metrics EVE + NII · Outlier test Flagged live · Disclosure export Standardised. Interactive demo card (“Run the shocks”): inputs — Basel shock scenario (select: Parallel up, Parallel down, Steepener, Flattener, Short rate up…), Metric (select: EVE, NII), Non-maturity deposit beta (number), Prepayment speed (number); a single indigo “Run the shocks” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [115] Model 83 — deposit-behavior-model (DARK)

```
Design the model detail page for “Deposit Behavior Model” — Banking / ALM (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Pass-through beta by segment, decay and vintage curves, and a surge-deposit flag that separates transient balances from core.” Metrics strip of KPI cards: Segments modelled Configurable · Surge flag Explicit · Backtest vs realized outflows · Divergence alert On drift. Interactive demo card (“Project balances”): inputs — Segment (select: Retail checking, Retail savings, Small business, Commercial operating), Rate scenario (number), Assumed pass-through beta (number), Exclude surge deposits from core (checkbox); a single indigo “Project balances” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [116] Model 84 — basel-rwa-capital-calculator (DARK)

```
Design the model detail page for “Basel RWA & Capital Calculator” — Banking / Capital (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Risk-weighted assets by exposure class with a standardised/IRB toggle, a CET1 bridge, and every risk weight traced to the rule paragraph behind it.” Metrics strip of KPI cards: Approaches Standardised + IRB · Weight traced to Rule paragraph · National packs Per jurisdiction · Audit trail Every figure. Interactive demo card (“Calculate RWA”): inputs — Approach (select: Standardised, Foundation IRB, Advanced IRB), National discretion pack (select: US, UK (PRA), EU (EBA)), Current CET1 (number), Show pro-forma bridge (checkbox); a single indigo “Calculate RWA” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [117] Model 85 — wallet-risk-scorer (DARK)

```
Design the model detail page for “Wallet Risk Scorer” — Crypto / Compliance (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU SG; price pill $199/mo. Lead sentence: “Address risk with reason codes — mixer exposure, sanctioned-cluster proximity, darknet lineage — plus an entity-cluster graph and travel-rule readiness.” Metrics strip of KPI cards: Reason codes Always attached · SDN refresh Scheduled + alerting · Chains Multi-chain · Travel rule Readiness flagged. Interactive demo card (“Score the address”): inputs — Address (text), Chain (select: Ethereum, Bitcoin, Polygon, Solana), Proximity depth (number), Assess travel-rule readiness (checkbox); a single indigo “Score the address” action runs it; output — a large mono score readout (“Wallet risk”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [118] Model 86 — stablecoin-depeg-monitor (DARK)

```
Design the model detail page for “Stablecoin Depeg Monitor” — Crypto / Risk (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU SG; price pill $199/mo. Lead sentence: “Live peg deviation across venues, reserve-attestation freshness and composition, and a redemption-stress indicator with configurable alerts.” Metrics strip of KPI cards: Peg deviation Cross-venue, live · Attestations Freshness + composition · Backtest Scored per historical event · Alerts Configurable thresholds. Interactive demo card (“Monitor the peg”): inputs — Stablecoin (select: USDC, USDT, DAI, PYUSD), Venue set (select: All venues, CEX only, DEX only), Alert threshold (number), Include redemption-stress indicator (checkbox); a single indigo “Monitor the peg” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [119] Model 87 — defi-protocol-risk-scorer (DARK)

```
Design the model detail page for “DeFi Protocol Risk Scorer” — Crypto / Risk (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk high (red); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $499/mo. Lead sentence: “Composite protocol risk across contract, economic and governance dimensions — with an incident timeline and a linked post-mortem behind every score penalty.” Metrics strip of KPI cards: Dimensions Contract / economic / governance · Penalties Post-mortem-linked · Audit registry Staleness-tracked · Indexers Health-monitored per chain. Interactive demo card (“Score the protocol”): inputs — Protocol (text), Chain (select: Ethereum, Arbitrum, Optimism, Polygon), Focus dimension (select: Composite, Contract, Economic, Governance), Show incident timeline (checkbox); a single indigo “Score the protocol” action runs it; output — a large mono score readout (“Protocol risk”) with a gauge arc, colored by band, and a sample-data label. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [120] Model 88 — monte-carlo-simulation-service (DARK)

```
Design the model detail page for “Monte Carlo Simulation Service” — Primitives / Simulation (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk low (green); GA lifecycle chip; jurisdiction chips Global; price pill $99/mo. Lead sentence: “Path simulation as a primitive — define or import distributions and correlations, run with fan charts and percentile tables, and replay any run exactly.” Metrics strip of KPI cards: Replay Deterministic · Convergence Reported · Consumed by LP Treasury, Real Options · Config sharing Save + share. Interactive demo card (“Run the simulation”): inputs — Paths (number), Horizon (number), Distribution (select: Normal, Student-t, Empirical bootstrap, Import from model), Seed (number); a single indigo “Run the simulation” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [121] Model 89 — volatility-surface-service (DARK)

```
Design the model detail page for “Volatility Surface Service” — Primitives / Volatility (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); GA lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Fitted implied-volatility surfaces with SABR, Heston, and GARCH-family toggles, term-structure and skew slices, and per-model fit quality.” Metrics strip of KPI cards: Models SABR, Heston, GARCH · Fit quality Per underlying · Refit trigger On degradation · Export API. Interactive demo card (“Fit the surface”): inputs — Underlying (text), Model (select: SABR, Heston, GARCH-family), Slice (select: Term structure, Skew, Full surface), Moneyness (number); a single indigo “Fit the surface” action runs it; output — an indigo line/area curve on dashed gridlines with a dashed gray benchmark overlay and mono axis labels. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [122] Model 90 — lp-treasury-cash-management (DARK)

```
Design the model detail page for “LP Treasury & Cash Management” — Primitives / Treasury (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Cash ladder, sweep recommendations, and Monte Carlo capital-call coverage for fund back offices — the weekly treasury run.” Metrics strip of KPI cards: Coverage probability Simulated · Sweep instruments T-bill, MMF · Guardrails Floors + caps · Onchain rails USDC on/off-ramp. Interactive demo card (“Build the ladder”): inputs — Uncalled commitments (number), Planning horizon (number), Minimum liquidity floor (number), Include USDC rails (checkbox); a single indigo “Build the ladder” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [123] Model 91 — underwriting-pricing-engine (DARK)

```
Design the model detail page for “Underwriting Pricing Engine” — Insurance / Pricing (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Technical premium decomposed into expected loss, expenses and risk margin, with rate adequacy against the in-force book and filing status beside the price.” Metrics strip of KPI cards: Decomposition Loss / expense / margin · Rate adequacy vs in-force book · Filing status NAIC / PRA, surfaced · Overrides Monitored + costed. Interactive demo card (“Price the risk”): inputs — Line of business (select: Commercial property, General liability, Professional lines, Motor fleet), Sum insured (number), Filing jurisdiction (select: US (NAIC), UK (PRA), EU), Show rating-factor sensitivity (checkbox); a single indigo “Price the risk” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

### [124] Model 92 — reserving-engine (DARK)

```
Design the model detail page for “Reserving Engine” — Insurance / Reserving (Marketplace persona, AI Marketplace tab active, breadcrumb back to the catalogue). Hero: model icon tile, name, category subtitle, chip row — risk medium (amber); Beta lifecycle chip; jurisdiction chips US UK EU; price pill $199/mo. Lead sentence: “Chain-ladder and Bornhuetter-Ferguson reserves side by side from a claims triangle, with editable development factors and an IBNR bridge to ultimate.” Metrics strip of KPI cards: Methods Chain-ladder + BF, side by side · Dev factors Editable, live re-projection · IBNR bridge Paid → reported → ultimate · Sign-off Actuarial workflow. Interactive demo card (“Project reserves”): inputs — Line of business (select: Motor, Property, Casualty, Professional lines), Triangle basis (select: Paid, Incurred), Tail factor (number), BF a priori loss ratio (number); a single indigo “Project reserves” action runs it; output — a compact mono results table with right-aligned numerics and chip-styled categorical cells. Sample data always labelled; designed loading and error states. Analytics section: usage sparkline and latency percentile mini-cards in mono. Below: What it does / Why it works editorial sections as readable prose cards; footer CTA row — indigo Subscribe with the price, ghost Docs. Trust strip and mega footer as always.
```

---

## Group C — remaining BUILD-LEDGER marketing redesigns (LIGHT), 24 surfaces

### [125] Surface 119 — Model Developer Console (LIGHT)

```
Design the Model Developer Console: a listings table (draft / pending approval / live) with per-model status, a version-upload flow showing artifact hash and Polygon anchor status, an earnings dashboard (gross revenue, 70% share, next payout date), and a Stripe Connect onboarding card for payout setup.
```

### [126] Surface 123 — trust.gefi.io portal (LIGHT)

```
Design trust.gefi.io as a standalone trust center on GeFi's tokens: certification tiles with live status (SOC 2, ISO 27001 and 42001 in progress), a policy library, the subprocessor list, a live audit-anchor ticker showing the latest Merkle root and Polygon transaction, and an evidence-pack request flow gated by plan tier.
```

### [127] Surface 94 — Fraud Graph (redesign) (LIGHT)

```
Redesign the live /models/fraud-graph/ page. Keep the GA badge, jurisdiction chips, and existing metrics, but add a small force-directed graph preview — even a synthetic 20-node sample — showing how a transaction connects to device, IP, and merchant nodes, with the fraud score appearing as the graph resolves. Replace the static “32ms median latency” text with a live-updating latency sparkline so the sub-50ms claim reads as measured, not asserted.
```

### [128] Surface 95 — Macro Nowcast (redesign) (LIGHT)

```
Redesign the live /models/macro-nowcast/ page. Keep the methodology prose and RMSE metrics, but add a small geography/indicator picker (US/UK/EU × GDP/CPI/unemployment) that renders an actual nowcast line against the last confirmed print, plus a visible “refreshed Xm ago” timestamp so the real-time claim is demonstrated, not just described.
```

### [129] Surface 96 — Portfolio Optimiser (redesign) (LIGHT)

```
Redesign the live /models/portfolio-optimiser/ page. Keep the federated-upside and constraints-supported prose, but turn the regime list into three selectable tabs with a one-line plain-language description each, and add a simplified constraint builder (2–3 toggles) that shows a mock allocation shift live as constraints change — so “risk-parity” and “long-only” become visibly different outputs, not just different words.
```

### [130] Surface 99 — Homepage & navigation shell (LIGHT)

```
Redesign gefi.io's homepage shell — hero, proof bar, feature grid, CTA band — around one idea: this is a live, audited network, not a brochure. Keep the dark hero with its purple/cyan gradient wash, but add a small live-feeling module inside it — a rotating ticker of real inference events (e.g. “Credit Oracle scored a request in Sofia · 41ms ago”) sourced from the audit log — so the fold shows motion, not just static copy. Pull the proof-bar stats up into the hero's lower third so they're visible without scrolling, and tie every feature card to a real badge (Federated / Audited / Jurisdictional) from the existing badge system.
```

### [131] Surface 101 — Pricing (LIGHT)

```
Redesign /pricing/ to put compliance differentiation on equal footing with price. Keep the three tier cards and monthly/yearly toggle, but add a small live usage calculator under the Pro card — sliders for inference calls/day and API keys estimating a monthly total. Promote three rows from the comparison matrix (sovereign data plane, audit evidence packs, per-jurisdiction counsel) into visible badges directly on the Enterprise card, and keep the full matrix below as detailed reference.
```

### [132] Surface 103 — Security & vulnerability disclosure (LIGHT)

```
Redesign /security/ so reporting is immediately visible and legal reference material is clearly secondary. Open with one high-contrast panel — report email, a security.txt link, a PGP-key link — beside three stat tiles pulled from the SLA table (1-business-day ack, 30/60/90-day fix targets). Turn the in-scope/out-of-scope lists into a two-column comparison with check/cross iconography. Collapse the safe-harbour legal text into an expandable section, present but not competing for attention.
```

### [133] Surface 109 — Sign in / Sign up (prelaunch state) (LIGHT)

```
Redesign the auth prelaunch state shown on /login/ and /register/ while auth_ready is false. Keep the card and early-access CTA, but add a small blurred/muted preview strip beneath it — three tiny KPI tiles and a chart silhouette lifted from the /dashboard/ visual language — captioned “What opens up when sign-in goes live,” so the visitor sees a taste of the product instead of a bare waiting-list form.
```

### [134] Surface 110 — Admin sign-in (LIGHT)

```
Redesign /admin/ to be unmistakably an operator surface. Keep the passphrase form and preview-mode note, but shift the card's accent from GeFi brand-purple to a distinct slate/amber operator palette, add a small terminal-style icon or corner ribbon reading “Internal preview,” and move the Cloudflare Access / production-auth caveat into a persistent footer strip rather than a paragraph inside the note box.
```

### [135] Surface 112 — Dashboard — Analytics, Compliance, Federation (LIGHT)

```
Redesign the /dashboard/ Analytics, Compliance, and Federation tabs for domain-correct visualization. Fix the drift chart to a 0–1 y-axis with a shaded “acceptable” band. Add an SLA countdown chip to each compliance case, colored by urgency. On Federation, color-link each Shapley bar to its participant's row in the rounds table above with a shared key, so contribution and round history read as one view.
```

### [136] Surface 113 — Dashboard — admin tabs (LIGHT)

```
Redesign the /dashboard/ admin-only Tenants, Approvals, and System tabs for real decisions, not just display. Add column sort and a plan/region filter to Tenants. On Approvals, expand each row into a detail drawer showing the EU AI Act risk-class rationale before the action buttons are usable. On System, replace the flat region list with a simple three-node status map (EU/US/MENA) so a degraded region is spotted spatially.
```

### [137] Surface 118 — Transactional email system (LIGHT)

```
Design the transactional email system: a 600px hand-coded HTML base template on GeFi's palette with dark-mode meta support, a shared header/footer, and variants for receipts, dunning, KYC status, alert digests, and federation notices — each with a plain-text twin.
```

### [138] Surface 120 — Paper-Trading Sandbox (LIGHT)

```
Design the Paper-Trading Sandbox: a simulated portfolio built from any trading model's signals, an equity curve stamped SIMULATED across both chart and exports, a per-model comparison mode, and a reset control — visually distinct (dashed borders, sandbox banner) so it can never be mistaken for live results.
```

### [139] Surface 121 — Public Model Leaderboard (LIGHT)

```
Design the public Model Leaderboard at /leaderboard/: per-category rankings with each model's key metric, a Verified badge where the figure is backed by an audit-log inclusion proof (click through to the proof), visibly different self-attested styling where it isn't, a methodology note, and last-updated stamps.
```

### [140] Surface 124 — Federated Participant Console (LIGHT)

```
Design the Federated Participant Console: node-agent connection status with last heartbeat, an attestation badge (SGX / Nitro / stub) with expiry countdown, round-participation history with per-round Shapley earnings and USDC payout status, and a data-lineage viewer showing exactly which features their node served.
```

### [141] Surface 97 — Sentiment from Filings (redesign) (LIGHT)

```
Redesign the live /models/sentiment-from-filings/ page. Keep the “where to be careful” honesty section exactly as-is — it's good — but add a small filing-excerpt reader with 2–3 sentences of real 10-K language, sentiment-highlighted inline (shaded by phrase), so the reader sees a risk-language detection in action rather than reading a paragraph about what it does.
```

### [142] Surface 98 — Trade Finance Doc AI (redesign) (LIGHT)

```
Redesign the live /models/trade-finance-doc-ai/ page. Keep the compliance citations exactly as written — they're specific and credible — but add a before/after panel: a small sample bill-of-lading excerpt on the left, its normalised structured-field extraction and a flagged UCP 600 discrepancy on the right, so “discrepancy recall 0.91” has a visible example behind it.
```

### [143] Surface 105 — Research hub (LIGHT)

```
Redesign /research/ to distinguish depth. Add a lightweight type indicator per card — Note / Methodology / Whitepaper — using the existing badge style, and let Methodology pieces render a longer excerpt with a read-time chip. Cross-link the audit-log note directly from a “How it works” callout on /compliance/ so the two surfaces reinforce each other.
```

### [144] Surface 106 — Blog (LIGHT)

```
Redesign the blog post template to carry more credibility per post. Add an author card — photo, name, title, one-line credential — pinned near the top, keep the existing reading-progress bar, and add a “cited in” footer strip surfacing which /compliance/ or /research/ pages the post references, turning each post into a hub instead of a dead end.
```

### [145] Surface 107 — About & Partnerships (LIGHT)

```
Redesign /about/ and /partnerships/ as a paired proof-of-credibility pair. On /about/, keep the team grid but add a compact timeline strip (founded, first federated round, first regulator engagement) above it. On /partnerships/, replace prose-only tiers with a three-column comparison — Technology / Data / Distribution partner — using the same comparison-table pattern as /pricing/, so a prospective partner self-qualifies in seconds.
```

### [146] Surface 108 — Contact & Demo request (LIGHT)

```
Redesign /contact/ and /demo/ as a single fork instead of two look-alike forms. Open with two differentiated cards — “Book a demo” (fast, 3 fields, calendar-style urgency) and “Ask us anything” (open form, next-business-day expectation) — so intent is chosen before typing starts. Keep the existing topic-prefill behaviour so a /contact/?topic=... link still lands pre-selected on the right fork.
```

### [147] Surface 114 — 404 / error state (LIGHT)

```
Redesign the 404 page to stay inside GeFi's system instead of stepping outside it. Keep it minimal, but include the standard header and footer, one on-brand line (“This model isn't in the catalogue — yet.”), and three quick links — Models, Docs, Contact — styled as the existing badge-row pattern.
```

### [148] Surface 122 — Data-Feed Catalog (LIGHT)

```
Design the Data-Feed Catalog at /data/: feed cards (name, freshness, jurisdictions, lineage link, sample fields) in the model-card visual style, a subscribe CTA gated exactly like model subscriptions, and a lineage detail view showing where a feature has been used.
```
