/**
 * Stripe Connect developer payouts — D1-backed CRUD for the
 * `developer_payouts` table. One row per developer tenant captures the
 * Connect account id and the live `charges_enabled` / `payouts_enabled`
 * / `details_submitted` flags Stripe sets during onboarding.
 *
 * The kind=model checkout flow refuses to create a destination charge
 * (HTTP 503 `developer_payouts_not_ready`) unless `chargesEnabled` is
 * 1. The `account.updated` webhook flips the flags as Stripe's KYC +
 * payout-method verification progress.
 */

export interface DeveloperPayout {
  tenantId: string;
  stripeAccountId: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  defaultCurrency: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface ConnectDeps {
  db: D1Database;
}

function rowToPayout(row: Record<string, unknown>): DeveloperPayout {
  return {
    tenantId: String(row.tenant_id),
    stripeAccountId: String(row.stripe_account_id),
    chargesEnabled: Number(row.charges_enabled ?? 0) === 1,
    payoutsEnabled: Number(row.payouts_enabled ?? 0) === 1,
    detailsSubmitted: Number(row.details_submitted ?? 0) === 1,
    defaultCurrency: row.default_currency ? String(row.default_currency) : null,
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

/** Look up a developer's payout state by tenant id. Null if not onboarded. */
export async function getDeveloperPayout(
  deps: ConnectDeps,
  tenantId: string,
): Promise<DeveloperPayout | null> {
  const row = await deps.db
    .prepare("SELECT * FROM developer_payouts WHERE tenant_id = ? LIMIT 1")
    .bind(tenantId)
    .first<Record<string, unknown>>();
  return row ? rowToPayout(row) : null;
}

/** Look up by Connect account id — used by the `account.updated` webhook. */
export async function getDeveloperPayoutByAccountId(
  deps: ConnectDeps,
  accountId: string,
): Promise<DeveloperPayout | null> {
  const row = await deps.db
    .prepare("SELECT * FROM developer_payouts WHERE stripe_account_id = ? LIMIT 1")
    .bind(accountId)
    .first<Record<string, unknown>>();
  return row ? rowToPayout(row) : null;
}

/**
 * Create or refresh the Connect account row for a developer tenant.
 * Used by `connectOnboardingHandler` after RealStripe.createConnectOnboarding
 * returns the Express account id. Idempotent: the same tenant calling
 * twice keeps the original account id (UNIQUE on stripe_account_id
 * forces re-use rather than orphaning the prior account).
 */
export async function upsertDeveloperPayout(
  deps: ConnectDeps,
  args: {
    tenantId: string;
    stripeAccountId: string;
    chargesEnabled?: boolean;
    payoutsEnabled?: boolean;
    detailsSubmitted?: boolean;
    defaultCurrency?: string | null;
    ts?: number;
  },
): Promise<DeveloperPayout> {
  const ts = args.ts ?? Math.floor(Date.now() / 1000);
  await deps.db
    .prepare(
      `INSERT INTO developer_payouts
        (tenant_id, stripe_account_id, charges_enabled, payouts_enabled,
         details_submitted, default_currency, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(tenant_id) DO UPDATE SET
         stripe_account_id = excluded.stripe_account_id,
         charges_enabled   = excluded.charges_enabled,
         payouts_enabled   = excluded.payouts_enabled,
         details_submitted = excluded.details_submitted,
         default_currency  = excluded.default_currency,
         updated_at        = excluded.updated_at`,
    )
    .bind(
      args.tenantId,
      args.stripeAccountId,
      args.chargesEnabled ? 1 : 0,
      args.payoutsEnabled ? 1 : 0,
      args.detailsSubmitted ? 1 : 0,
      args.defaultCurrency ?? null,
      ts,
      ts,
    )
    .run();
  return {
    tenantId: args.tenantId,
    stripeAccountId: args.stripeAccountId,
    chargesEnabled: args.chargesEnabled === true,
    payoutsEnabled: args.payoutsEnabled === true,
    detailsSubmitted: args.detailsSubmitted === true,
    defaultCurrency: args.defaultCurrency ?? null,
    createdAt: ts,
    updatedAt: ts,
  };
}

/**
 * Update only the live flags from a Stripe `account.updated` webhook
 * payload. Returns null if no row matches the account id (e.g. the
 * webhook fired for an account we never wrote — possible when the
 * developer ran onboarding through StubStripe in dev, then the same
 * Stripe account fires real webhooks in staging).
 */
export async function applyAccountUpdate(
  deps: ConnectDeps,
  args: {
    accountId: string;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
    defaultCurrency?: string | null;
    ts?: number;
  },
): Promise<DeveloperPayout | null> {
  const ts = args.ts ?? Math.floor(Date.now() / 1000);
  const existing = await getDeveloperPayoutByAccountId(deps, args.accountId);
  if (!existing) return null;
  await deps.db
    .prepare(
      `UPDATE developer_payouts
         SET charges_enabled = ?, payouts_enabled = ?, details_submitted = ?,
             default_currency = ?, updated_at = ?
       WHERE stripe_account_id = ?`,
    )
    .bind(
      args.chargesEnabled ? 1 : 0,
      args.payoutsEnabled ? 1 : 0,
      args.detailsSubmitted ? 1 : 0,
      args.defaultCurrency ?? existing.defaultCurrency ?? null,
      ts,
      args.accountId,
    )
    .run();
  return {
    ...existing,
    chargesEnabled: args.chargesEnabled,
    payoutsEnabled: args.payoutsEnabled,
    detailsSubmitted: args.detailsSubmitted,
    defaultCurrency: args.defaultCurrency ?? existing.defaultCurrency,
    updatedAt: ts,
  };
}

/**
 * Compute the platform application-fee percent from a model's
 * `developer_share_bps`. A 7000 bps developer share leaves the
 * platform with 30 % — i.e. `(10000 - 7000) / 100 = 30`. Clamped to
 * [0, 100] so a malformed db value can't crash live Stripe with an
 * out-of-range fee.
 */
export function applicationFeePercentFromBps(developerShareBps: number): number {
  const bps = Number.isFinite(developerShareBps) ? developerShareBps : 7000;
  const fee = (10000 - bps) / 100;
  if (fee < 0) return 0;
  if (fee > 100) return 100;
  return Math.round(fee * 100) / 100;
}
