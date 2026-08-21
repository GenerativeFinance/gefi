# Session handoff — read this first

Context from the Claude Code session that produced this state. Read before
touching git history further or starting the build run.

## Current state

- **AxalNetwork/gefi `main` @ `eeb9de7`** — 719 commits. Canonical merge of
  AxalNetwork/gefi (117 commits: Jekyll site, Cloudflare Workers monorepo,
  playground) and GenerativeFinance/gefi (599 commits: the original React +
  Vite + Express + Drizzle monolith, now archived under `legacy/`). Both
  root commits reachable; nothing deleted.
- **GenerativeFinance/gefi `main`** — NOT yet synced as of this handoff. Still
  at its pre-merge state. Sync with:
  ```
  git remote add axal https://github.com/AxalNetwork/gefi
  git fetch axal main
  git push origin origin/main:refs/heads/pre-sync-backup   # safety net first
  git push origin FETCH_HEAD:main --force                  # force: history was rewritten, see below
  ```

## Why it's a force-push

A Google OAuth Client ID + Client Secret were hardcoded in `server/multiAuth.ts`
in GenerativeFinance's history (commit `f2aeea4`, 2025-08-07 through `7b053d4`,
2025-08-14; fixed in code by `2025-08-19` but left in history). The repo went
public with that history intact, so the secret was exposed. Purged from all
7,591 objects via `git filter-repo --replace-text` (regex match on the
`GOCSPX-` prefix and the `apps.googleusercontent.com` client-ID pattern — the
literal values were never read or logged). Verified zero remaining matches
across all branches before anything was pushed.

**The credential itself has NOT been rotated as of this handoff.** It was
public; purging history doesn't un-expose something already public. Rotate in
Google Cloud Console → APIs & Services → Credentials, then update whatever env
var consumes it. This is independent of the merge and still outstanding.

## What else is in this commit

`tasks/prompt-library.json` (360K) and `tasks/BUILD-LEDGER.md` (16K) — the
full GeFi Design Prompt Library exported from its published artifact:
92 model prompts (customer / backend / Claude Code / Replit each), 32
platform-surface redesign prompts, and the Model Page Harness prompt, with
a precomputed build order. `_config.yml` excludes `tasks/` from the Jekyll
build.

To continue the build: read `tasks/BUILD-LEDGER.md` first, resume from the
first unchecked box, start with task 00 (Model Page Harness) before any
model or surface task — the harness owns `_layouts/model.html` and every
other task is content-only against it.

## Known gap — not recovered

Early in the originating session, before this merge work began, an admin
login (`/admin/`), a `/dashboard/` preview, and four Replit task briefs
(`tasks/00`–`04-security-hardening.md`) were built against a since-reset
container and were **never pushed to either repo**. The only surviving copy
is a `git am`-able patch file delivered directly to the user in that session
(`admin-dashboard-and-tasks.patch`) — not present here. If that work is still
wanted, it needs to be rebuilt as its own task; nothing to inherit from git
for it.

## Repo hygiene notes from the merge

- `client/`, `server/`, `shared/`, `storage/`, `migrations/`, `contracts/` at
  root (from GenerativeFinance) were byte-identical duplicates of their
  `legacy/` counterparts (from AxalNetwork) and were removed — `_config.yml`
  only excluded `legacy/`, so the root copies were being published to
  gefi.io, including `server/middleware/auth.ts` and `server/services/s3.ts`.
  Nothing lost: `legacy/` holds the same content, full history stays
  reachable through the merge commit's first parent.
- `attached_assets/` (117MB, 725 files) stayed at root, excluded from the
  build. Worth deciding whether it belongs in the repo long-term or should
  move to object storage.
- GitHub reports 296 Dependabot vulnerabilities (34 critical) on the default
  branch — effectively all from the archived `legacy/` lockfile, which is
  excluded from the Jekyll build and not deployed.
