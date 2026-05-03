# @gefi-playground/api

Cloudflare Worker (Hono + TypeScript) for the GeFi Playground.

## Local dev

```bash
pnpm --filter @gefi-playground/api run dev   # wrangler dev on :8787
```

`wrangler dev` uses miniflare to emulate every binding declared in
`wrangler.toml`, so you can hit `/api/health` locally without provisioning
anything in Cloudflare. The endpoint will report `ok` when miniflare's
in-memory implementations satisfy each probe.

## Provisioning Cloudflare resources (one-time, per environment)

The Worker depends on D1 + R2 + KV + Vectorize + Queues + Analytics Engine
+ a Durable Object + Workers AI. Provision them with:

```bash
./scripts/provision.sh staging
./scripts/provision.sh production
```

The script is idempotent-friendly: re-running steps that already exist will
print `wrangler`'s "already exists" error and continue. **Capture stdout
into a file** so you don't lose any IDs.

After it finishes:

1. Paste each printed `database_id` / `kv_namespace.id` into the matching
   `REPLACE_WITH_<ENV>_*` placeholder in `wrangler.toml`.
2. Generate a JWT keypair and set the four required secrets:

   ```bash
   pnpm --filter @gefi-playground/api run keygen   # prints JWT_SK + JWT_PK
   pnpm exec wrangler secret put JWT_SK         --env staging
   pnpm exec wrangler secret put JWT_PK         --env staging
   pnpm exec wrangler secret put STRIPE_SK      --env staging
   pnpm exec wrangler secret put RESEND_API_KEY --env staging
   ```

3. Apply migrations and seed:

   ```bash
   pnpm --filter @gefi-playground/api run db:migrate:staging
   pnpm --filter @gefi-playground/api run db:seed:staging
   ```

4. Deploy:

   ```bash
   pnpm --filter @gefi-playground/api run deploy:staging
   curl https://gefi-playground-api-staging.<account>.workers.dev/api/health
   ```

## Routes

| Method | Path                | Auth | Notes                                  |
| ------ | ------------------- | ---- | -------------------------------------- |
| GET    | `/`                 | -    | Marketing placeholder homepage         |
| GET    | `/api/health`       | -    | Probes every binding in parallel       |
| POST   | `/api/auth/request` | -    | Magic link → email (3/email/10min)     |
| GET    | `/api/auth/verify`  | -    | Single-use token → 24h JWT cookie      |
| POST   | `/api/auth/logout`  | -    | Clears `gefi_session` cookie           |
| POST   | `/api/subscribe`    | -    | Phase 0 stub                           |

Use the `requireAuth` middleware (in `src/middleware/auth.ts`) on any new
authenticated routes — it parses the cookie and exposes `c.var.user`.

## Database

Migrations live in `migrations/` as plain SQL files; `wrangler d1 migrations
apply gefi` consumes them. The seed lives in `scripts/seed.ts` and is safe
to re-run (everything uses `INSERT OR IGNORE`).

| Script              | What it does                              |
| ------------------- | ----------------------------------------- |
| `db:migrate:local`  | Apply migrations to the local D1 emulator |
| `db:migrate:staging`| Apply migrations to remote staging D1     |
| `db:migrate:prod`   | Apply migrations to remote production D1  |
| `db:seed:local`     | Pipe seed SQL into local D1               |
| `db:seed:staging`   | Pipe seed SQL into remote staging D1      |
| `db:reset:local`    | Drop local tables and re-apply migrations |

Phase 1 seed expectations: **14 categories** (in `src/data/categories.ts`)
and **10 featured models** (`src/data/featured-models.ts`), all inserted as
`status='draft', featured=1`.

## Secrets

Never committed. Always set via `wrangler secret put`:

| Secret           | Purpose                                      |
| ---------------- | -------------------------------------------- |
| `JWT_SK`         | Ed25519 private JWK for signing session JWTs |
| `JWT_PK`         | Ed25519 public  JWK for verifying            |
| `STRIPE_SK`      | Stripe secret (used in Phase 5/6)            |
| `RESEND_API_KEY` | Resend API key for transactional email       |
