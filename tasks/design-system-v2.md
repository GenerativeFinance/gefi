# GeFi Design System v2 — dark-first master prompt for Claude Design

**Why this exists.** The prompt library's original `designSystemPrefix` describes a
light theme (bg `#FAFBFF`, white surfaces). The actual GeFi platform — per the 56
reference screenshots reviewed on 2026-08-21 — is a **dark-first fintech console**.
Claude Design followed the light prefix, which is why its output didn't match the
platform. This document is the corrected master prefix plus the layout system
extracted from the references, with deliberate improvements where the references
are inconsistent or unfinished.

**How to use.**
1. Copy the block in §1 verbatim as the FIRST part of every Claude Design prompt
   for a platform/app screen.
2. Append the page-specific prompt (see `tasks/UI-FOLLOWUP-LEDGER.md` for one per
   screen).
3. This prefix is also stored as `meta.designSystemPrefixApp` in
   `tasks/prompt-library.json`. The original light prefix remains for the
   marketing/docs site (gefi.io); this dark prefix is for the platform UI
   (app screens). If you later want one unified brand, adopt this dark system
   everywhere — the tokens include a light-mode mapping in §6.

---

## 1. MASTER PREFIX (copy this block verbatim)

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

---

## 2. Persona nav sets (the icon tab rows)

One shell, five persona apps. The tab set — and the top-bar persona icon — is
the only thing that changes:

| Persona | Top-bar icon | Tabs |
|---|---|---|
| Investor | trend chart | Overview · Portfolio · AI Marketplace · Trading · Reports · Funding · Learning |
| Portfolio suite | trend chart | Overview · Portfolio · AI Models · Rebalancing · Performance |
| Trader | trend chart | Overview · Live Trading · Trading Bots · Order History · Strategies |
| Developer | `</>` code | Overview · Backtesting · AI Marketplace · Market Data · Bounties · Learning |
| Marketplace | trend chart | Overview · AI Marketplace · Categories · My Subscriptions · Developers |
| Funding | trend chart | Overview · Funding Hub · Bot Funding · AI Model Funding · Bounty Funding |
| Regulator | shield | Overview · Model Audits · Dataset Audits · Compliance Issues · Communications · Standards |
| Reports | trend chart | Overview · Reports · Risk Analysis · Compliance · Custom Reports |
| Learning | trend chart | Overview · Learning · Tutorials · Webinars · Documentation · Community |

## 3. Layout archetypes (page recipes)

Every reference screen is one of these. Name the archetype in a page prompt and
Claude Design has most of the layout:

1. **KPI dashboard** — header → 4-KPI row → segmented control → content cards.
   (Portfolio Performance, Regulator Overview, Funding Hub.)
2. **Row-card manager** — KPI row → filter/segments → full-width row-cards with
   metric columns and a right action rail. (Portfolio AI Models, Training Jobs,
   Model Deployments, Bounty Funding requests.)
3. **Card-grid catalog** — KPI row → filter bar → 2/3-col grid with dual corner
   chips and twin footer buttons. (Model Categories, Developers, Bounty Board,
   Learning Center, Compliance/Risk report cards, Bot Funding projects.)
4. **Split panel** — 2-col: overview/summary card left, action or detail card
   right. (AI Portfolio, Rebalancing, Collaboration, Backtest Configure,
   Reports & Insights.)
5. **Data table** — KPI row → search + filter pills → dense table with chip
   columns, mono numerics, green/red P&L. (Order History.)
6. **Chart dashboard** — chart cards mixed with stat lists: line/area + donut +
   grouped bars + key-value rows. (Investor Overview, Performance tabs,
   Regulator Analytics.)
7. **Activity feed** — vertical rows: colored icon tile, bold title, meta line
   with entity IDs, right timestamp, footer chips incl. severity.
   (Regulator Recent Activity, Recent Activity cards.)
8. **Form / builder** — labeled inputs with * required, selects, textarea,
   checkbox grid, toggle rows, sliders with live value; footer "Create" primary
   + "Reset" ghost. (Custom Report Builder, Rebalancing settings, Place Order.)
9. **Empty / error state** — centered icon, headline, one-line hint, single
   CTA. ("Building Your Recommendations", "No funding requests found",
   "Regulator Not Found".)

## 4. Canonical demo dataset (fixes the contradictions)

The references contradict themselves (portfolio $142,500 vs $247,580; Sharpe
1.42 vs 2.1 vs 1.24; revenue $2,847,500 vs $0 on the next tab; "147 active
models" above an empty list). All future design mocks and wired pages use ONE
dataset:

- Portfolio: **$142,500** total · day +$2,850 (+2.04%) · monthly +2.7% (bench
  +1.8%) · YTD +24.3% · cash $12,750.
- Risk: Sharpe **1.42** · max drawdown −8.5% (bench −12.3%) · beta 0.89 ·
  alpha +2.1% · volatility 14.2% · VaR(95) −$7,125.
- Allocation: Stocks 45 · Bonds 25 · Real Estate 15 · Commodities 10 · Cash 5.
- Holdings: NVDA 8.5% · MSFT 12.2% · AAPL 10.1% · AMZN 7.8% · GOOGL 9.3% ·
  BTC/ETH minor; TSLA the one red position (−2.1%).
- AI models: 3 active · +19.1% total · $327/mo fees · 90.2% avg accuracy ·
  AI confidence 94.2%.
- Data provider: 12 datasets · $2,847,500 lifetime revenue · 156 models using
  data · 9.4 avg quality.
- KPIs and lists on one screen must agree with each other.

## 5. Deliberate improvements over the references

Carry these into every redesign; they fix observed defects, not taste:

1. **One KPI card anatomy** (funding pages used a second one).
2. **One segmented-control style**; max one nesting level (Live Trading nested
   two).
3. **One date format** ("Jan 15, 2026") — references mix DD/MM/YYYY, ISO, and
   prose.
4. **Thousands separators everywhere** ("$486750.00" appeared).
5. **Never color-only status**; error-rate meters red, not indigo (Monitoring
   showed "Error Rate" as a healthy-looking indigo bar).
6. **Designed empty states everywhere** — Recent Activity, Revenue by Dataset,
   and the Datasets tab were blank panels; "No funding requests found" is the
   pattern to copy.
7. **Dark-consistent insight banners** — Regulator Insights used light pastel
   banners on the dark theme; restyle as dark surfaces with colored left border
   + icon.
8. **Contrast fix** — Learning "Featured Learning Paths" put white text on
   pastel tints (illegible). Use dark surfaces with colored accents.
9. **Nav truthfulness** — active tab must match the content (investor pages
   showed "Overview" active while rendering Holdings; returns page highlighted
   Rebalancing).
10. **One Reports page** — two different pages both claimed the Reports tab;
    merge "Reports Dashboard" and "Reports & Insights" into one.
11. **Copy consistency** — one CTA verb set ("Request Funding", not also
    "Create Funding Request"); fix "1 submissions".
12. **Real category/subcategory data** — no filler "General Advanced Custom"
    chips; wire to the actual 92-model catalogue taxonomy.

## 6. Light-mode mapping (optional, for a unified brand)

The dark system is authoritative for the platform app. If the marketing site
is ever unified onto it (ledger task 233), or a user-facing theme toggle is
wanted, map tokens rather than redesigning:

| Role | Dark (default) | Light mapping |
|---|---|---|
| Canvas | `#0A0C14` | `#FAFBFF` |
| Surface | `#12141F` | `#FFFFFF` |
| Border | `#232636` | `#E5E7F0` |
| Hover surface | `#161927` | `#F3F4FA` |
| Text primary | `#F2F4FF` | `#0B0E1A` |
| Text muted | `#8A91A6` | `#6B7280` |
| Brand indigo | `#6D5BFF` | `#6D5BFF` (unchanged) |
| Positive green | `#22C55E` | `#16A34A` |
| Negative red | `#EF4444` | `#DC2626` |
| Warning amber | `#F59E0B` | `#D97706` |
| High-risk orange | `#F97316` | `#EA580C` |
| Info blue | `#3B82F6` | `#2563EB` |
| Purple | `#A78BFA` | `#7C3AED` |

Semantic colors darken one step in light mode to keep AA contrast on white.
Component anatomy, spacing, chips, and chart grammar do not change between
modes — only the token values.
