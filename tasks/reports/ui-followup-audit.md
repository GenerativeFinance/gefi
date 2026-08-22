# UI follow-up audit — task 232

Automated Playwright sweep over **all 45 `/app/` pages** (the full 200-series
surface), enforcing the twelve §5 improvements from `tasks/design-system-v2.md`.
Run date: Aug 22, 2026. Audit script: headless Chromium, DOM + computed-style
checks per page, plus a global link-resolution pass and a keyboard walk.

## What was checked

| Rule | Method | Result |
| --- | --- | --- |
| One KPI anatomy (`app-kpi` + `__label`/`__value`/`__sub`) | DOM audit of every `.app-kpi` | **0 violations** |
| One segmented style | every `[role="tablist"]` must be `.app-segments`; buttons carry `aria-selected` | **0 violations** |
| One date format (`GeFi.fmt.date`) | visible-text scan for raw ISO (`YYYY-MM-DD`) and slash (`M/D/YYYY`) dates | **0 violations** |
| Thousands separators | visible-text scan for `$` amounts of 5+ digits without commas | **0 violations** |
| No color-only status | every visible `.app-chip` must carry text; every `.app-meter` must sit in a labelled scope | **0 violations** |
| Truthful active tabs | exactly one `aria-current="page"` in the top-level tab bar per page | **0 violations** |
| Modal semantics | every `.app-modal__card` is `role="dialog"` + `aria-modal="true"` | **0 violations** |
| Keyboard: segments | focus + ArrowRight moves both `aria-selected` and focus | **pass** |
| Focus rings | `.app-shell :focus-visible` outline rule (CSS) | **present** |
| Console errors | pageerror + console.error listeners on all 45 pages | **0 errors** |
| Internal links resolve | every `a[href^="/"]` across all pages, deduped, fetched | **1 violation — fixed** |
| AA contrast (4.5:1) | computed fg vs alpha-composited chip bg, one sample per chip class; muted `.app-kpi__sub` | **10 violations — fixed** |

## Violations found and fixed

### 1. Broken link: `/app/ai-models/` → 404
The investor sub-tab bar (`_includes/app-subtabs.html`) linked its **AI Models**
tab to `/app/ai-models/`, a page that never existed — the AI Models surface
was built at `/app/portfolio-models/` (task 208). Every investor sub-page
(holdings, analytics, transactions, watchlist, insights) carried the dead link.

**Fix:** subtab now points at `/app/portfolio-models/`.

### 2. Chip text contrast just under AA on tinted backgrounds (10 classes)
Red, blue and brand-purple chip text used the same tokens as large UI accents
(`--app-red` #EF4444, `--app-blue` #3B82F6, `--app-brand-2`), which land at
**4.06–4.25:1** against their own 14–16% tinted backgrounds composited over
`--app-surface` — under the 4.5:1 AA threshold for 11–12px text. Flagged
classes: `critical, violation, cancelled, expert, sell, sev-critical` (red,
4.15–4.25), `info, claimed, buy` (blue, 4.24), `deployed, featured`
(brand, 4.06). Green, amber, orange and purple chip families all passed.

**Fix:** chip-scoped foreground overrides (tokens untouched elsewhere):
red chips → `#F87171` (≈5.8:1), blue chips → `#60A5FA` (≈6.2:1), brand chips
→ `#9A8EFF` (≈5.7:1). Appended as the Task 232 block in `assets/css/main.css`.

## Re-run

After both fixes the full sweep reports **0 violations across all 45 pages**
(structure, dates, money, tabs, aria, links, contrast, console).
