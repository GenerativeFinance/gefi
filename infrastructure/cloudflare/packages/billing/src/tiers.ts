/**
 * Subscription-tier catalog. Mirrors what the marketing site advertises.
 * The Stripe price IDs are environment-specific (dev/staging/prod each
 * have their own price object), so the catalog only stores the *amount*;
 * resolution to a Stripe price id happens at checkout time.
 */

import type { SubscriptionTier } from "@gefi/shared-types";

export interface TierDef {
  /** Canonical tier id used in code + DB. */
  tier: SubscriptionTier;
  /** Display name on the pricing page. */
  display: string;
  /** Monthly price in cents (USD). */
  monthlyCents: number;
  /** Soft daily request quota. 0 = unlimited. */
  requestsPerDay: number;
  /** Soft monthly token quota. 0 = unlimited. */
  tokensPerMonth: number;
  /** Soft monthly inference quota. 0 = unlimited. */
  inferencesPerMonth: number;
  /** Trial length in days. 0 = no trial. */
  trialDays: number;
}

export const TIERS: Record<SubscriptionTier, TierDef> = {
  free: {
    tier: "free",
    display: "Free",
    monthlyCents: 0,
    requestsPerDay: 100,
    tokensPerMonth: 50_000,
    inferencesPerMonth: 100,
    trialDays: 0,
  },
  starter: {
    tier: "starter",
    display: "Starter",
    monthlyCents: 9_900,
    requestsPerDay: 10_000,
    tokensPerMonth: 5_000_000,
    inferencesPerMonth: 10_000,
    trialDays: 14,
  },
  pro: {
    tier: "pro",
    display: "Pro",
    monthlyCents: 49_900,
    requestsPerDay: 100_000,
    tokensPerMonth: 50_000_000,
    inferencesPerMonth: 100_000,
    trialDays: 14,
  },
  enterprise: {
    tier: "enterprise",
    display: "Institutional",
    monthlyCents: 249_900,
    requestsPerDay: 0,
    tokensPerMonth: 0,
    inferencesPerMonth: 0,
    trialDays: 14,
  },
};

export function tierOrThrow(tier: string): TierDef {
  const def = TIERS[tier as SubscriptionTier];
  if (!def) throw new Error(`unknown_tier:${tier}`);
  return def;
}

/** Per-model subscription price band — surfaced to developers as a slider. */
export const MODEL_PRICE_RANGE = {
  minCents: 7_900,
  maxCents: 99_900,
};
