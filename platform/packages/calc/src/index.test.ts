import { describe, expect, it } from "vitest";
import { runRunwayCalculation, validateModelAssumptions } from "./index.js";

const baseReq = {
  modelId: "11111111-1111-1111-1111-111111111111",
  scenarioId: "22222222-2222-2222-2222-222222222222",
  assumptions: [
    { key: "cash_on_hand", value: 1_200_000, unit: "currency" as const },
    { key: "monthly_burn", value: 100_000, unit: "currency" as const },
    { key: "monthly_revenue", value: 40_000, unit: "currency" as const },
    { key: "revenue_growth_mom", value: 0.05, unit: "percentage" as const },
  ],
};

describe("runRunwayCalculation", () => {
  it("computes finite runway from net burn", () => {
    const result = runRunwayCalculation(baseReq);
    expect(result.engine).toBe("typescript");
    expect(result.metrics.runway_months).toBe(20);
    expect(result.series?.length).toBe(24);
  });

  it("flags missing assumptions", () => {
    const warnings = validateModelAssumptions({
      ...baseReq,
      assumptions: [],
    });
    expect(warnings).toContain("missing required assumption: cash_on_hand");
  });
});
