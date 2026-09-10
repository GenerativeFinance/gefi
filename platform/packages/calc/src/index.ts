import { randomUUID } from "node:crypto";
import type { CalculationRequest, CalculationResult } from "@gefi/schemas";

export type AssumptionMap = Record<string, number>;

function num(assumptions: CalculationRequest["assumptions"], key: string, fallback: number): number {
  const hit = assumptions.find((a) => a.key === key);
  if (!hit) return fallback;
  return typeof hit.value === "number" ? hit.value : fallback;
}

/**
 * Deterministic TypeScript calculation engine for Phase 1 product UX.
 * Complex forecasting / Monte Carlo move to the Python quant service in Phase 2.
 */
export function runRunwayCalculation(req: CalculationRequest): CalculationResult {
  const cash = num(req.assumptions, "cash_on_hand", 1_000_000);
  const monthlyBurn = num(req.assumptions, "monthly_burn", 80_000);
  const monthlyRevenue = num(req.assumptions, "monthly_revenue", 20_000);
  const growthRate = num(req.assumptions, "revenue_growth_mom", 0.03);

  const warnings: string[] = [];
  if (monthlyBurn <= 0) warnings.push("monthly_burn must be positive");
  const netBurn = monthlyBurn - monthlyRevenue;
  const runwayMonths = netBurn > 0 ? cash / netBurn : Number.POSITIVE_INFINITY;

  const series: { period: string; values: Record<string, number> }[] = [];
  let rev = monthlyRevenue;
  let balance = cash;
  for (let m = 1; m <= 24; m++) {
    balance = balance - monthlyBurn + rev;
    series.push({
      period: `M${m}`,
      values: {
        cash: Math.round(balance),
        revenue: Math.round(rev),
        burn: monthlyBurn,
      },
    });
    rev *= 1 + growthRate;
  }

  return {
    calculationId: randomUUID(),
    modelId: req.modelId,
    scenarioId: req.scenarioId,
    version: 1,
    metrics: {
      runway_months: Number.isFinite(runwayMonths) ? Math.round(runwayMonths * 10) / 10 : -1,
      net_monthly_burn: Math.round(netBurn),
      cash_on_hand: cash,
      break_even_month: series.findIndex((s) => s.values.cash >= cash && s.values.revenue >= monthlyBurn) + 1 || -1,
    },
    series,
    warnings,
    engine: "typescript",
    createdAt: new Date().toISOString(),
  };
}

export function runSensitivityTable(
  req: CalculationRequest,
  paramKey: string,
  deltas: number[],
): CalculationResult {
  const base = num(req.assumptions, paramKey, 0);
  const rows: Record<string, number> = {};
  for (const d of deltas) {
    const cloned: CalculationRequest = {
      ...req,
      assumptions: req.assumptions.map((a) =>
        a.key === paramKey ? { ...a, value: base * (1 + d) } : a,
      ),
    };
    if (!cloned.assumptions.some((a) => a.key === paramKey)) {
      cloned.assumptions = [
        ...cloned.assumptions,
        { key: paramKey, value: base * (1 + d), unit: "currency" },
      ];
    }
    const result = runRunwayCalculation(cloned);
    rows[`delta_${Math.round(d * 100)}pct`] = result.metrics.runway_months;
  }
  return {
    calculationId: randomUUID(),
    modelId: req.modelId,
    scenarioId: req.scenarioId,
    version: 1,
    metrics: rows,
    warnings: [],
    engine: "typescript",
    createdAt: new Date().toISOString(),
  };
}

export function validateModelAssumptions(req: CalculationRequest): string[] {
  const warnings: string[] = [];
  const required = ["cash_on_hand", "monthly_burn"];
  for (const key of required) {
    if (!req.assumptions.some((a) => a.key === key)) {
      warnings.push(`missing required assumption: ${key}`);
    }
  }
  const burn = num(req.assumptions, "monthly_burn", 0);
  if (burn < 0) warnings.push("monthly_burn cannot be negative");
  return warnings;
}
