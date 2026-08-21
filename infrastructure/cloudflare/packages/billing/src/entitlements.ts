/**
 * Entitlements + quota enforcement. Source of truth lives in the
 * `entitlements` table; the KV cache is a hot-path read-through with a
 * short TTL. Writes always hit D1 first, then invalidate the cache.
 *
 * Quota check is the same one-shot operation across every callsite:
 * `consume(deps, tenantId, feature, n)` — it returns `{ allowed, remaining }`
 * atomically by way of a `RETURNING used_value` clause (D1 supports it).
 */

import type { TierDef } from "./tiers.js";

export interface EntitlementDeps {
  db: D1Database;
  kv?: KVNamespace;
}

export interface EntitlementRow {
  tenantId: string;
  feature: string;
  limitValue: number;
  usedValue: number;
  period: "day" | "month" | "total";
  resetsAt: number | null;
}

const KV_PREFIX = "entitlement:";
const KV_TTL_SECONDS = 60;

function rowToEntitlement(row: Record<string, unknown>): EntitlementRow {
  return {
    tenantId: String(row.tenant_id),
    feature: String(row.feature),
    limitValue: Number(row.limit_value),
    usedValue: Number(row.used_value),
    period: row.period as "day" | "month" | "total",
    resetsAt: row.resets_at ? Number(row.resets_at) : null,
  };
}

function startOfNextDay(ts: number): number {
  const d = new Date(ts * 1000);
  d.setUTCHours(0, 0, 0, 0);
  return Math.floor(d.getTime() / 1000) + 86400;
}

function startOfNextMonth(ts: number): number {
  const d = new Date(ts * 1000);
  const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
  return Math.floor(next.getTime() / 1000);
}

export async function seedTierEntitlements(
  deps: EntitlementDeps,
  tenantId: string,
  tier: TierDef,
  ts?: number,
): Promise<void> {
  const now = ts ?? Math.floor(Date.now() / 1000);
  const dayReset = startOfNextDay(now);
  const monthReset = startOfNextMonth(now);
  const rows: Array<[string, number, "day" | "month" | "total", number | null]> = [
    ["requests_per_day", tier.requestsPerDay, "day", dayReset],
    ["tokens_per_month", tier.tokensPerMonth, "month", monthReset],
    ["inferences_per_month", tier.inferencesPerMonth, "month", monthReset],
  ];
  for (const [feature, limit, period, resets] of rows) {
    await deps.db
      .prepare(
        `INSERT INTO entitlements (tenant_id, feature, limit_value, used_value, period, resets_at, updated_at)
         VALUES (?, ?, ?, 0, ?, ?, ?)
         ON CONFLICT(tenant_id, feature) DO UPDATE SET
           limit_value = excluded.limit_value,
           period      = excluded.period,
           resets_at   = excluded.resets_at,
           updated_at  = excluded.updated_at`,
      )
      .bind(tenantId, feature, limit, period, resets, now)
      .run();
    if (deps.kv) await deps.kv.delete(`${KV_PREFIX}${tenantId}:${feature}`);
  }
}

export async function getEntitlement(
  deps: EntitlementDeps,
  tenantId: string,
  feature: string,
): Promise<EntitlementRow | null> {
  if (deps.kv) {
    const cached = await deps.kv.get(`${KV_PREFIX}${tenantId}:${feature}`, "json");
    if (cached) return cached as EntitlementRow;
  }
  const row = await deps.db
    .prepare("SELECT * FROM entitlements WHERE tenant_id = ? AND feature = ?")
    .bind(tenantId, feature)
    .first<Record<string, unknown>>();
  if (!row) return null;
  const ent = rowToEntitlement(row);
  if (deps.kv) {
    await deps.kv.put(`${KV_PREFIX}${tenantId}:${feature}`, JSON.stringify(ent), {
      expirationTtl: KV_TTL_SECONDS,
    });
  }
  return ent;
}

export interface ConsumeResult {
  allowed: boolean;
  remaining: number;
  reason?: "no_entitlement" | "limit_exceeded" | "ok";
}

/**
 * Atomically reserve `n` units of `feature` for `tenantId`. Returns
 * `{ allowed: false }` if the row is missing or the limit would be
 * exceeded. Limit `0` means unlimited (paid tier).
 *
 * Race-safe by way of a *conditional* UPDATE: the WHERE clause re-checks
 * the limit at write time and SQLite holds the row lock through the
 * statement, so two concurrent `consume()` calls that each see
 * `used=N, limit=N+1` and both compute `N+1<=N+1` will not both
 * succeed — only the first commits, and the second's WHERE evaluates
 * against the just-written `used` value and fails to match. We
 * detect that via D1's `meta.changes` (rows affected). The pre-read
 * is only there to (a) report a useful `no_entitlement` reason and
 * (b) compute the next-window timestamp from the row's period.
 */
export async function consume(
  deps: EntitlementDeps,
  tenantId: string,
  feature: string,
  n: number,
  ts?: number,
): Promise<ConsumeResult> {
  const now = ts ?? Math.floor(Date.now() / 1000);
  // We bypass the KV cache here on purpose: the budget check must read
  // the source-of-truth `used_value`, not a 60s-stale snapshot.
  const ent = await deps.db
    .prepare("SELECT * FROM entitlements WHERE tenant_id = ? AND feature = ?")
    .bind(tenantId, feature)
    .first<Record<string, unknown>>();
  if (!ent) return { allowed: false, remaining: 0, reason: "no_entitlement" };
  const period = String(ent.period) as "day" | "month" | "total";
  const limitValue = Number(ent.limit_value);
  const nextReset = period === "day" ? startOfNextDay(now) : period === "month" ? startOfNextMonth(now) : null;
  // The CASE expression in both SET and WHERE is identical so the
  // value committed equals the value the limit was checked against.
  // The "(limit_value = 0 OR …)" branch lets unlimited tiers always pass.
  const result = await deps.db
    .prepare(
      `UPDATE entitlements SET
         used_value = CASE WHEN resets_at IS NOT NULL AND ? >= resets_at THEN ? ELSE used_value + ? END,
         resets_at  = CASE WHEN resets_at IS NOT NULL AND ? >= resets_at THEN ? ELSE resets_at  END,
         updated_at = ?
       WHERE tenant_id = ? AND feature = ?
         AND (limit_value = 0
              OR (CASE WHEN resets_at IS NOT NULL AND ? >= resets_at THEN ? ELSE used_value + ? END) <= limit_value)`,
    )
    .bind(
      now, n, n,            // SET used_value CASE
      now, nextReset,       // SET resets_at CASE
      now,                  // SET updated_at
      tenantId, feature,    // WHERE tenant + feature
      now, n, n,            // WHERE limit-guard CASE
    )
    .run();
  const changes = Number((result as { meta?: { changes?: number } }).meta?.changes ?? 0);
  if (changes === 0) {
    // Row exists (we just read it) but the conditional UPDATE found
    // the limit was already at or above the cap.
    const usedNow = Number(ent.used_value);
    return { allowed: false, remaining: Math.max(0, limitValue - usedNow), reason: "limit_exceeded" };
  }
  if (deps.kv) await deps.kv.delete(`${KV_PREFIX}${tenantId}:${feature}`);
  // Best-effort `remaining` for the caller. We don't re-read the row
  // because the value can drift the moment the next `consume()`
  // commits anyway; this is for display, not enforcement.
  const usedAfter =
    ent.resets_at !== null && now >= Number(ent.resets_at) ? n : Number(ent.used_value) + n;
  return {
    allowed: true,
    remaining: limitValue === 0 ? Number.MAX_SAFE_INTEGER : Math.max(0, limitValue - usedAfter),
    reason: "ok",
  };
}

export async function listEntitlements(deps: EntitlementDeps, tenantId: string): Promise<EntitlementRow[]> {
  const { results } = await deps.db
    .prepare("SELECT * FROM entitlements WHERE tenant_id = ?")
    .bind(tenantId)
    .all<Record<string, unknown>>();
  return (results ?? []).map(rowToEntitlement);
}

// ============================================================================
// Per-API-key quotas — `api_key_quotas` table.
//
// `entitlements` is tenant-scoped: it caps "the org as a whole". When an
// operator wants to hand out a read-only key with a tighter cap (eg. a
// 1k/day key for a partner integration) we layer this per-key counter
// on top. The check order in the run path is:
//
//   1. consume(tenant, "requests_per_day", 1)        — tenant cap
//   2. consumeApiKey(keyId, "requests_per_day", 1)   — per-key cap
//   3. consume(tenant, "tokens_per_month", maxTok)   — pre-flight tokens
//
// Either denial returns 429 / 402 to the caller. The per-key row is
// optional — when no row exists, `consumeApiKey` returns `allowed: true`
// (unconfigured = inherits tenant cap).
//
// Row + SQL shape mirrors `entitlements` exactly so the same atomic
// conditional-UPDATE pattern applies (race-safe limit check, inline
// period reset via CASE expressions).
// ============================================================================

const KEY_KV_PREFIX = "api_key_quota:";

export interface ApiKeyQuotaRow {
  apiKeyId: string;
  feature: string;
  limitValue: number;
  usedValue: number;
  period: "day" | "month" | "total";
  resetsAt: number | null;
}

function rowToApiKeyQuota(row: Record<string, unknown>): ApiKeyQuotaRow {
  return {
    apiKeyId: String(row.api_key_id),
    feature: String(row.feature),
    limitValue: Number(row.limit_value),
    usedValue: Number(row.used_value),
    period: row.period as "day" | "month" | "total",
    resetsAt: row.resets_at ? Number(row.resets_at) : null,
  };
}

/**
 * Provision a per-key quota row. Idempotent: re-running with a different
 * limit updates the cap but never resets the counter (so an operator can
 * tighten / loosen a key without forgiving its current period usage).
 */
export async function setApiKeyQuota(
  deps: EntitlementDeps,
  apiKeyId: string,
  feature: string,
  limit: number,
  period: "day" | "month" | "total",
  ts?: number,
): Promise<void> {
  const now = ts ?? Math.floor(Date.now() / 1000);
  const resets = period === "day" ? startOfNextDay(now) : period === "month" ? startOfNextMonth(now) : null;
  await deps.db
    .prepare(
      `INSERT INTO api_key_quotas (api_key_id, feature, limit_value, used_value, period, resets_at, updated_at)
       VALUES (?, ?, ?, 0, ?, ?, ?)
       ON CONFLICT(api_key_id, feature) DO UPDATE SET
         limit_value = excluded.limit_value,
         period      = excluded.period,
         resets_at   = excluded.resets_at,
         updated_at  = excluded.updated_at`,
    )
    .bind(apiKeyId, feature, limit, period, resets, now)
    .run();
  if (deps.kv) await deps.kv.delete(`${KEY_KV_PREFIX}${apiKeyId}:${feature}`);
}

/**
 * Per-key version of `consume()`. Returns `{ allowed: true }` when no
 * per-key cap is configured (keys default to "inherit tenant cap").
 * When a row exists, applies the same atomic conditional-UPDATE check
 * that `consume()` uses against `entitlements`.
 */
export async function consumeApiKey(
  deps: EntitlementDeps,
  apiKeyId: string,
  feature: string,
  n: number,
  ts?: number,
): Promise<ConsumeResult> {
  const now = ts ?? Math.floor(Date.now() / 1000);
  const ent = await deps.db
    .prepare("SELECT * FROM api_key_quotas WHERE api_key_id = ? AND feature = ?")
    .bind(apiKeyId, feature)
    .first<Record<string, unknown>>();
  // No per-key cap configured → caller falls back to the tenant cap.
  if (!ent) return { allowed: true, remaining: Number.MAX_SAFE_INTEGER, reason: "ok" };
  const period = String(ent.period) as "day" | "month" | "total";
  const limitValue = Number(ent.limit_value);
  const nextReset =
    period === "day" ? startOfNextDay(now) : period === "month" ? startOfNextMonth(now) : null;
  const result = await deps.db
    .prepare(
      `UPDATE api_key_quotas SET
         used_value = CASE WHEN resets_at IS NOT NULL AND ? >= resets_at THEN ? ELSE used_value + ? END,
         resets_at  = CASE WHEN resets_at IS NOT NULL AND ? >= resets_at THEN ? ELSE resets_at  END,
         updated_at = ?
       WHERE api_key_id = ? AND feature = ?
         AND (limit_value = 0
              OR (CASE WHEN resets_at IS NOT NULL AND ? >= resets_at THEN ? ELSE used_value + ? END) <= limit_value)`,
    )
    .bind(now, n, n, now, nextReset, now, apiKeyId, feature, now, n, n)
    .run();
  const changes = Number((result as { meta?: { changes?: number } }).meta?.changes ?? 0);
  if (changes === 0) {
    const usedNow = Number(ent.used_value);
    return { allowed: false, remaining: Math.max(0, limitValue - usedNow), reason: "limit_exceeded" };
  }
  if (deps.kv) await deps.kv.delete(`${KEY_KV_PREFIX}${apiKeyId}:${feature}`);
  const usedAfter =
    ent.resets_at !== null && now >= Number(ent.resets_at) ? n : Number(ent.used_value) + n;
  return {
    allowed: true,
    remaining: limitValue === 0 ? Number.MAX_SAFE_INTEGER : Math.max(0, limitValue - usedAfter),
    reason: "ok",
  };
}

export async function listApiKeyQuotas(
  deps: EntitlementDeps,
  apiKeyId: string,
): Promise<ApiKeyQuotaRow[]> {
  const { results } = await deps.db
    .prepare("SELECT * FROM api_key_quotas WHERE api_key_id = ?")
    .bind(apiKeyId)
    .all<Record<string, unknown>>();
  return (results ?? []).map(rowToApiKeyQuota);
}
