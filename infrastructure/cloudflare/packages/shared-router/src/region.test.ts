import { describe, expect, it } from "vitest";
import { isRegion, pickRegion, regionalApiHost } from "./region.js";

describe("pickRegion", () => {
  it("routes EU member states to the EU region", () => {
    for (const cc of ["DE", "FR", "IT", "ES", "PL", "NL", "IE"]) {
      expect(pickRegion(cc, "us")).toBe("eu");
    }
  });

  it("routes the UK + EFTA to the EU data plane", () => {
    for (const cc of ["GB", "CH", "NO"]) {
      expect(pickRegion(cc, "us")).toBe("eu");
    }
  });

  it("routes MENA countries to the EU region (closest until a MENA data plane exists)", () => {
    for (const cc of ["AE", "SA", "IL", "EG", "TR"]) {
      expect(pickRegion(cc, "us")).toBe("eu");
    }
  });

  it("routes the Americas to the US region", () => {
    for (const cc of ["US", "CA", "MX", "BR", "AR", "CL"]) {
      expect(pickRegion(cc, "eu")).toBe("us");
    }
  });

  it("routes APAC countries to the US region (closest west-coast PoP)", () => {
    for (const cc of ["SG", "JP", "AU", "IN", "KR"]) {
      expect(pickRegion(cc, "eu")).toBe("us");
    }
  });

  it("falls back to defaultRegion for unknown countries", () => {
    expect(pickRegion("ZZ", "eu")).toBe("eu");
    expect(pickRegion(null, "us")).toBe("us");
    expect(pickRegion(undefined, "us")).toBe("us");
  });

  it("is case-insensitive on the country code", () => {
    expect(pickRegion("de", "us")).toBe("eu");
    expect(pickRegion("Gb", "us")).toBe("eu");
  });

  it("respects a valid override over the country lookup", () => {
    // Tenant pinned to US even though they're requesting from Germany.
    expect(pickRegion("DE", "eu", "us")).toBe("us");
  });

  it("ignores an invalid override and falls through to country", () => {
    expect(pickRegion("DE", "us", "moon")).toBe("eu");
    expect(pickRegion("DE", "us", "")).toBe("eu");
    // Stretch labels are NOT valid overrides — pickRegion only accepts
    // genuinely deployable regions.
    expect(pickRegion("DE", "us", "mena")).toBe("eu");
    expect(pickRegion("US", "eu", "apac")).toBe("us");
  });
});

describe("isRegion", () => {
  it("accepts the two canonical regions", () => {
    expect(isRegion("eu")).toBe(true);
    expect(isRegion("us")).toBe(true);
  });

  it("rejects anything else (including future stretch labels)", () => {
    expect(isRegion("EU")).toBe(false);
    expect(isRegion("global")).toBe(false);
    expect(isRegion("")).toBe(false);
    expect(isRegion("mena")).toBe(false);
    expect(isRegion("apac")).toBe(false);
  });
});

describe("regionalApiHost", () => {
  it("maps each region to its subdomain", () => {
    expect(regionalApiHost("eu")).toBe("eu.api.gefi.io");
    expect(regionalApiHost("us")).toBe("us.api.gefi.io");
  });
});
