# gefi-playground

Phase 0 scaffold for the GeFi Playground monorepo. Lives **alongside** the
gefi.io marketing Jekyll site (this Repl's root) — it does not replace it.

## Layout

```
playground/
├── apps/
│   ├── web/       Jekyll 4.3 (Ruby 3.2) — placeholder homepage on :4000
│   └── api/       Cloudflare Worker (Hono + TS) — :8787, stubbed /api/subscribe
├── packages/
│   ├── ui/        Brand tokens (single source of truth) + Button + Card
│   └── schemas/   Shared TypeScript types (placeholder for Phase 1)
└── .github/...    CI lives at the repo root in .github/workflows/playground-ci.yml
```

## Local dev (outside Replit)

```bash
cd playground
pnpm install              # installs Node deps (and triggers Husky)
pnpm run build:tokens     # generates apps/web/assets/css/tokens.css + apps/api/src/generated/tokens.css.ts
pnpm dev                  # boots Jekyll :4000 + Wrangler :8787 concurrently
```

## In Replit

A second workflow named **"Playground (manual start)"** is registered in `.replit`
(autoStart=false, console mode). The default Run button still serves the marketing
Jekyll site on :5000 via the "Start application" workflow. Start the playground
manually from the Workflows panel when you want to develop against it.

> **Toolchain note:** this monorepo runs on pnpm **10** (the version available in
> the Replit Nix environment) rather than pnpm 9 from the original spec. The
> workspace layout and `pnpm-workspace.yaml` are forward-compatible.

## Brand tokens

Edit `packages/ui/src/tokens.ts`, then run `pnpm run build:tokens`. The same
CSS is consumed by both Jekyll (`<link>`) and the Worker HTML (inline `<style>`).

## Commit hygiene

Conventional Commits enforced via commitlint + Husky. Activate hooks once with:

```bash
git config core.hooksPath playground/.husky
```

(opt-in so hooks don't fire on commits to the marketing site at the repo root).
