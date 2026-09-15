import { describe, expect, it } from "vitest";
import { canSpend, createBudget, spendEpsilon, remaining } from "./privacy-budget.js";

describe("privacy budget", () => {
  it("tracks spend and refuses overspend", () => {
    const b = createBudget("m1", 1.0, 1e-5);
    expect(canSpend(b, 0.4)).toBe(true);
    spendEpsilon(b, 0.4);
    expect(remaining(b)).toBeCloseTo(0.6);
    expect(canSpend(b, 0.7)).toBe(false);
    expect(() => spendEpsilon(b, 0.7)).toThrow("privacy_budget_exhausted");
  });
});
