/**
 * Typed financial tools for AI orchestration.
 * The LLM proposes actions; deterministic services perform calculations.
 * Tools never write raw formulas into production tables directly —
 * they return structured, auditable outputs for the control plane to persist.
 */
import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  runRunwayCalculation,
  runSensitivityTable,
  validateModelAssumptions,
} from "@gefi/calc";
import type { CalculationRequest, CalculationResult } from "@gefi/schemas";

export const ToolNameSchema = z.enum([
  "create_model",
  "add_assumption",
  "build_revenue_forecast",
  "calculate_runway",
  "generate_sensitivity_table",
  "calculate_valuation",
  "run_scenario",
  "validate_model",
  "export_model",
]);
export type ToolName = z.infer<typeof ToolNameSchema>;

export type ToolResult = {
  tool: ToolName;
  ok: boolean;
  result?: unknown;
  error?: string;
  audit: {
    toolCallId: string;
    timestamp: string;
  };
};

function audit(tool: ToolName, ok: boolean, result?: unknown, error?: string): ToolResult {
  return {
    tool,
    ok,
    result,
    error,
    audit: { toolCallId: randomUUID(), timestamp: new Date().toISOString() },
  };
}

export function createModel(input: { organizationId: string; name: string }): ToolResult {
  return audit("create_model", true, {
    id: randomUUID(),
    organizationId: input.organizationId,
    name: input.name,
    version: 1,
    status: "draft",
    createdAt: new Date().toISOString(),
  });
}

export function addAssumption(input: {
  modelId: string;
  scenarioId: string;
  key: string;
  value: number | string | boolean;
  unit: "currency" | "percentage" | "months" | "count" | "ratio";
}): ToolResult {
  return audit("add_assumption", true, {
    id: randomUUID(),
    ...input,
    effectiveFrom: new Date().toISOString(),
  });
}

export function calculateRunway(req: CalculationRequest): ToolResult {
  const warnings = validateModelAssumptions(req);
  if (warnings.some((w) => w.startsWith("missing"))) {
    return audit("calculate_runway", false, undefined, warnings.join("; "));
  }
  return audit("calculate_runway", true, runRunwayCalculation(req));
}

export function generateSensitivityTable(
  req: CalculationRequest,
  paramKey = "monthly_burn",
  deltas = [-0.2, -0.1, 0, 0.1, 0.2],
): ToolResult {
  return audit("generate_sensitivity_table", true, runSensitivityTable(req, paramKey, deltas));
}

export function buildRevenueForecast(req: CalculationRequest): ToolResult {
  const result = runRunwayCalculation(req);
  return audit("build_revenue_forecast", true, {
    calculationId: result.calculationId,
    series: result.series?.map((s) => ({ period: s.period, revenue: s.values.revenue })),
  });
}

export function calculateValuation(input: {
  modelId: string;
  scenarioId: string;
  arr: number;
  multiple: number;
}): ToolResult {
  if (input.arr < 0 || input.multiple < 0) {
    return audit("calculate_valuation", false, undefined, "arr and multiple must be non-negative");
  }
  return audit("calculate_valuation", true, {
    calculationId: randomUUID(),
    modelId: input.modelId,
    scenarioId: input.scenarioId,
    enterpriseValue: input.arr * input.multiple,
    engine: "typescript",
    createdAt: new Date().toISOString(),
  });
}

export function runScenario(req: CalculationRequest): ToolResult {
  return calculateRunway(req);
}

export function validateModel(req: CalculationRequest): ToolResult {
  const warnings = validateModelAssumptions(req);
  return audit("validate_model", warnings.length === 0, { warnings });
}

export function exportModel(input: { modelId: string; format: "json" | "parquet" }): ToolResult {
  return audit("export_model", true, {
    modelId: input.modelId,
    format: input.format,
    uri: `r2://gefi-artifacts/exports/${input.modelId}.${input.format === "json" ? "json" : "parquet"}`,
  });
}

/** Dispatch by tool name — used by the Workers AI orchestration layer. */
export function invokeTool(name: ToolName, args: Record<string, unknown>): ToolResult {
  switch (name) {
    case "create_model":
      return createModel(args as { organizationId: string; name: string });
    case "add_assumption":
      return addAssumption(args as Parameters<typeof addAssumption>[0]);
    case "calculate_runway":
      return calculateRunway(args as CalculationRequest);
    case "generate_sensitivity_table":
      return generateSensitivityTable(args as CalculationRequest);
    case "build_revenue_forecast":
      return buildRevenueForecast(args as CalculationRequest);
    case "calculate_valuation":
      return calculateValuation(args as Parameters<typeof calculateValuation>[0]);
    case "run_scenario":
      return runScenario(args as CalculationRequest);
    case "validate_model":
      return validateModel(args as CalculationRequest);
    case "export_model":
      return exportModel(args as { modelId: string; format: "json" | "parquet" });
    default:
      return audit(name, false, undefined, `unknown tool: ${name}`);
  }
}

export type { CalculationResult };
