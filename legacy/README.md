# `legacy/` — archived React + Express prototype

This directory contains the **previous** GeFi codebase: a React + Vite +
Express + Drizzle (Postgres) monolith that was running on Replit before the
project was restructured.

## Why it's archived (not deleted)

The new architecture decomposes that monolith into:

| Old surface                                  | New home                                                  |
|----------------------------------------------|-----------------------------------------------------------|
| Marketing pages (React routes)               | This Jekyll site, hosted on GitHub Pages (`gefi.io`).     |
| REST APIs (`server/routes/*.ts`)             | Cloudflare Workers under `api.gefi.io` (Task #2 onward).  |
| Postgres schema (`shared/schema.ts`, Drizzle)| Cloudflare D1 with a re-derived schema (Task #2 onward).  |
| Object storage (`@google-cloud/storage`)     | Cloudflare R2 (Task #2 onward).                           |
| Vector search (Meilisearch)                  | Cloudflare Vectorize (Task #2 onward).                    |
| Auth (Replit Auth + Passport)                | Auth0 + JWT (Task #3 onward).                             |
| Web3/onchain payments (`contracts/`)         | Re-evaluated and re-implemented on the new stack.         |
| App / dashboard surfaces                     | A separate React app under `app.gefi.io` (later phase).   |

We keep the legacy code around as a **reference implementation** while the
new platform is being built — to lift business logic, schema decisions,
and integration patterns from. Do **not** treat anything in `legacy/` as
production code, deploy it, install its dependencies, or run its workflows.

## Contents

| Path                       | What it is                                              |
|----------------------------|---------------------------------------------------------|
| `client/`                  | Old React + Vite frontend.                              |
| `server/`                  | Old Express + TypeScript API server.                    |
| `shared/`                  | Old Drizzle schemas shared between client and server.   |
| `migrations/`              | Old Drizzle SQL migrations against Postgres.            |
| `contracts/`               | Solidity contracts for the legacy onchain payment flow. |
| `storage/`                 | Local seeds / fixtures used by the legacy server.       |
| `package.json`             | Old npm manifest (`rest-express`).                      |
| `package-lock.json`        | Old lockfile.                                           |
| `tsconfig.json`            | Old TypeScript config.                                  |
| `vite.config.ts`           | Old Vite config.                                        |
| `tailwind.config.ts`       | Old Tailwind config (the new Jekyll site uses hand-rolled CSS, not Tailwind). |
| `postcss.config.js`        | Old PostCSS config.                                     |
| `components.json`          | Old shadcn/ui registry.                                 |
| `jest.config.js`           | Old Jest config.                                        |
| `drizzle.config.ts`        | Old Drizzle Kit config.                                 |

## Want to run it locally anyway?

You can, but it will fail unless you provision a Postgres database, set
`DATABASE_URL`, and install dependencies inside this directory:

```bash
cd legacy
npm install
DATABASE_URL=postgresql://... npm run dev
```

Again — there is no reason to do this in normal development of the new
platform. Mining it for reference is the only intended use.

## Removal plan

`legacy/` will be deleted from the main branch once:

1. The Cloudflare backend (Task #2) reaches feature parity for the API
   surfaces this code exposed.
2. The new app surface at `app.gefi.io` reaches feature parity for the
   dashboard surfaces this code exposed.
3. The migration of any production data has been completed and verified.

Until then, leave it alone.
