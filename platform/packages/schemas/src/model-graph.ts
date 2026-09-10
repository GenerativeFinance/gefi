import { z } from "zod";

export const UnitSchema = z.enum(["currency", "percentage", "months", "count", "ratio"]);
export type Unit = z.infer<typeof UnitSchema>;

export const FinancialAssumptionSchema = z.object({
  id: z.string().uuid(),
  modelId: z.string().uuid(),
  key: z.string().min(1),
  value: z.union([z.number(), z.string(), z.boolean()]),
  unit: UnitSchema,
  source: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  scenarioId: z.string().uuid(),
  effectiveFrom: z.string().datetime(),
});
export type FinancialAssumption = z.infer<typeof FinancialAssumptionSchema>;

export const ScenarioSchema = z.object({
  id: z.string().uuid(),
  modelId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
});
export type Scenario = z.infer<typeof ScenarioSchema>;

export const ModelGraphSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  name: z.string().min(1),
  version: z.number().int().positive(),
  status: z.enum(["draft", "validated", "published", "archived"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type ModelGraph = z.infer<typeof ModelGraphSchema>;

export const CalculationRequestSchema = z.object({
  modelId: z.string().uuid(),
  scenarioId: z.string().uuid(),
  assumptions: z.array(
    z.object({
      key: z.string(),
      value: z.union([z.number(), z.string(), z.boolean()]),
      unit: UnitSchema,
    }),
  ),
});
export type CalculationRequest = z.infer<typeof CalculationRequestSchema>;

export const CalculationResultSchema = z.object({
  calculationId: z.string().uuid(),
  modelId: z.string().uuid(),
  scenarioId: z.string().uuid(),
  version: z.number().int(),
  metrics: z.record(z.number()),
  series: z
    .array(
      z.object({
        period: z.string(),
        values: z.record(z.number()),
      }),
    )
    .optional(),
  warnings: z.array(z.string()).default([]),
  engine: z.enum(["typescript", "python"]),
  createdAt: z.string().datetime(),
});
export type CalculationResult = z.infer<typeof CalculationResultSchema>;
