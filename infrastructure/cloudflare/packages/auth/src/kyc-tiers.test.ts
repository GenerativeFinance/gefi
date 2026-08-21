import { describe, expect, it } from "vitest";
import {
  KYC_TIER_RANK,
  REQUIRED_KYC_TIER_BY_SUBSCRIPTION,
  kycSatisfies,
  providerFamilyFor,
  requiresMfa,
  subscriptionToKycTier,
} from "./kyc-tiers.js";

describe("subscription → KYC tier mapping", () => {
  it("free needs no KYC", () => {
    expect(subscriptionToKycTier("free")).toBe("none");
  });

  it("starter needs Basic KYC", () => {
    expect(subscriptionToKycTier("starter")).toBe("basic");
  });

  it("pro needs Standard KYC", () => {
    expect(subscriptionToKycTier("pro")).toBe("standard");
  });

  it("enterprise needs Enhanced KYC", () => {
    expect(subscriptionToKycTier("enterprise")).toBe("enhanced");
  });

  it("ranks tiers in the expected order", () => {
    expect(KYC_TIER_RANK.none).toBeLessThan(KYC_TIER_RANK.basic);
    expect(KYC_TIER_RANK.basic).toBeLessThan(KYC_TIER_RANK.standard);
    expect(KYC_TIER_RANK.standard).toBeLessThan(KYC_TIER_RANK.enhanced);
  });

  it("kycSatisfies honours rank ordering", () => {
    expect(kycSatisfies("enhanced", "standard")).toBe(true);
    expect(kycSatisfies("standard", "enhanced")).toBe(false);
    expect(kycSatisfies("standard", "standard")).toBe(true);
    expect(kycSatisfies(undefined, "basic")).toBe(false);
    expect(kycSatisfies(undefined, "none")).toBe(true);
  });
});

describe("MFA requirement", () => {
  it("is required from pro tier upward", () => {
    expect(requiresMfa("free")).toBe(false);
    expect(requiresMfa("starter")).toBe(false);
    expect(requiresMfa("pro")).toBe(true);
    expect(requiresMfa("enterprise")).toBe(true);
  });
});

describe("provider family selection", () => {
  it("routes individuals to the individual provider family", () => {
    expect(providerFamilyFor("retail")).toBe("individual");
    expect(providerFamilyFor("professional")).toBe("individual");
  });
  it("routes companies to the business provider family", () => {
    expect(providerFamilyFor("institutional")).toBe("business");
    expect(providerFamilyFor("data_provider")).toBe("business");
  });
});

describe("REQUIRED_KYC_TIER_BY_SUBSCRIPTION exhaustiveness", () => {
  it("covers every subscription tier", () => {
    const subs: Array<keyof typeof REQUIRED_KYC_TIER_BY_SUBSCRIPTION> = [
      "free",
      "starter",
      "pro",
      "enterprise",
    ];
    for (const t of subs) {
      expect(REQUIRED_KYC_TIER_BY_SUBSCRIPTION[t]).toBeDefined();
    }
  });
});
