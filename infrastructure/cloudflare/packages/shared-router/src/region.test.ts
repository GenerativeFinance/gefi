import { describe, expect, it } from "vitest";
import { isRegion, pickRegion, regionalApiHost } from "./region.js";

describe("pickRegion", () => {
  it("routes EU member states to the EU region", () => {
    for (const cc of ["DE", "FR", "IT", "ES", "PL", "NL", "IE"]) {
      expect(pickRegion(cc, "us")).toBe("eu");
    }
  });

  it("routes the UK to the EU data plane", () => {
    expect(pickRegion("GB", "us")).toBe("eu");
  });

  it("routes US/CA/MX/BR to the US region", () => {
    for (const cc of ["US", "CA", "MX", "BR"]) {
      expect(pickRegion(cc, "eu")).toBe("us");
    }
  });

  it("routes MENA countries to the MENA region", () => {
    expect(pickRegion("AE", "us")).toBe("mena");
    expect(pickRegion("SA", "us")).toBe("mena");
  });

  it("routes APAC countries to the APAC region", () => {
    expect(pickRegion("SG", "us")).toBe("apac");
    expect(pickRegion("JP", "us")).toBe("apac");
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
  });
});

describe("isRegion", () => {
  it("accepts the four canonical regions", () => {
    expect(isRegion("eu")).toBe(true);
    expect(isRegion("us")).toBe(true);
    expect(isRegion("mena")).toBe(true);
    expect(isRegion("apac")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isRegion("EU")).toBe(false);
    expect(isRegion("global")).toBe(false);
    expect(isRegion("")).toBe(false);
  });
});

describe("regionalApiHost", () => {
  it("maps each region to its subdomain", () => {
    expect(regionalApiHost("eu")).toBe("eu.api.gefi.io");
    expect(regionalApiHost("us")).toBe("us.api.gefi.io");
    expect(regionalApiHost("mena")).toBe("mena.api.gefi.io");
    expect(regionalApiHost("apac")).toBe("apac.api.gefi.io");
  });
});
