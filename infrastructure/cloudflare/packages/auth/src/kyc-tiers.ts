/**
 * Subscription tier ↔ KYC tier mapping.
 *
 * Drives onboarding: a tenant signing up to `enterprise` must complete
 * Enhanced KYC (full identity + sanctions + adverse-media) before they
 * can use the API; a `free` tenant is admitted immediately with no KYC.
 *
 * `requiresMfa()` mirrors the task requirement that MFA be enforced for
 * paid tiers ($500/mo+ → `pro` and above).
 */

import type { EntityType, KycTier, SubscriptionTier } from "@gefi/shared-types";

/**
 * Minimum KYC tier required to *operate* (not just sign up) on each
 * subscription. KYC is escalated, never downgraded — once a user reaches
 * `enhanced`, downgrading their subscription doesn't drop the tier.
 */
export const REQUIRED_KYC_TIER_BY_SUBSCRIPTION: Record<SubscriptionTier, KycTier> = {
  free: "none",
  starter: "basic",
  pro: "standard",
  enterprise: "enhanced",
};

/** Tier ordering for "is X at-or-above Y" comparisons. */
export const KYC_TIER_RANK: Record<KycTier, number> = {
  none: 0,
  basic: 1,
  standard: 2,
  enhanced: 3,
};

/** Check if `actual` satisfies `required` KYC depth. */
export function kycSatisfies(actual: KycTier | undefined, required: KycTier): boolean {
  const a = actual ? KYC_TIER_RANK[actual] : 0;
  return a >= KYC_TIER_RANK[required];
}

export function subscriptionToKycTier(tier: SubscriptionTier): KycTier {
  return REQUIRED_KYC_TIER_BY_SUBSCRIPTION[tier];
}

/** MFA is required for `pro` and above. */
export function requiresMfa(tier: SubscriptionTier): boolean {
  return tier === "pro" || tier === "enterprise";
}

/**
 * Pick the best provider for an entity type. Individuals go to identity
 * providers (Onfido / Persona); companies go to business KYB providers
 * (Sumsub Business / Middesk). The factory in `@gefi/integrations` reads
 * this to instantiate the right SDK.
 */
export type KycProviderFamily = "individual" | "business";

export function providerFamilyFor(entity: EntityType): KycProviderFamily {
  return entity === "institutional" || entity === "data_provider" ? "business" : "individual";
}
