export { AuditEventSchema, type AuditEvent } from "@gefi/schemas";

export const AuditKinds = {
  OrganizationCreated: "organization.created",
  RoundAggregated: "federation.round.aggregated",
  AiTool: (tool: string) => `ai.tool.${tool}`,
} as const;
