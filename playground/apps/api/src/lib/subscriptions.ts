/**
 * Subscription tier lookup + per-tier daily quota.
 *
 * Authenticated callers without a subscription row default to `free`. The
 * playground's KV-backed sliding-window rate limiter takes the per-tier
 * limit; over-quota → 429 with `Retry-After`.
 *
 * The Phase 4 anonymous IP limit (20/day) is preserved separately in
 * `playground.ts` — anonymous users are not subject to this lookup.
 */

export type SubscriptionTier = "free" | "pro" | "enterprise";

export const TIER_DAILY_QUOTA: Record<SubscriptionTier, number> = {
  free: 100,
  pro: 10_000,
  enterprise: 1_000_000,
};

export async function getTier(
  db: D1Database,
  userId: string,
): Promise<SubscriptionTier> {
  const row = await db
    .prepare("SELECT tier FROM subscriptions WHERE user_id = ? LIMIT 1")
    .bind(userId)
    .first<{ tier: SubscriptionTier }>();
  return row?.tier ?? "free";
}
