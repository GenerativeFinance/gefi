/**
 * GeFi API client interface.
 *
 * The live client calls `api.gefi.io`. The stub client returns
 * deterministic fixture data. Tests always use the stub; production
 * uses the live client.
 */

export interface PortfolioSummary {
  totalAum: number;
  dayReturn: number;
  weekReturn: number;
  monthReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  varP95: number;
  activeModels: number;
}

export interface ModelPosition {
  id: string;
  name: string;
  jurisdiction: string;
  allocation: number;
  return7d: number;
  return30d: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  complianceStatus: "compliant" | "review" | "violation" | "pending";
  sparkline: number[];
}

export interface ComplianceEvent {
  id: string;
  timestamp: string;
  jurisdiction: string;
  kind: string;
  severity: "info" | "warn" | "critical";
  summary: string;
  proofHash?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  tenantId: string;
  action: string;
  resource: string;
  hash: string;
  prevHash: string | null;
  proofPath: string[];
}

export interface FederationRound {
  id: string;
  modelId: string;
  roundNumber: number;
  status: string;
  participantCount: number;
  completedAt: string | null;
  accuracy?: number;
  privacyBudgetUsed?: number;
}

export interface Contributor {
  participantId: string;
  score: number;
  sampleCount: number;
  reward?: number;
  attestationKind: string;
}

export interface Dataset {
  id: string;
  name: string;
  schema: string;
  rowCount: number;
  privacyBudgetUsed: number;
  privacyBudgetMax: number;
  registeredAt: string;
  jurisdiction: string;
}

export interface PlatformMetrics {
  dailyActiveUsers: number;
  modelsDeployed: number;
  totalInferences: number;
  openTickets: number;
  complianceScore: number;
  revenueMonth: number;
}

export interface ModelDraft {
  name: string;
  description: string;
  jurisdiction: string;
  algorithm: string;
  tags: string[];
}

export interface TickerQuote {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  ts: number;
}

export interface ApiClient {
  getPortfolioSummary(): Promise<PortfolioSummary>;
  getModelPositions(): Promise<ModelPosition[]>;
  getComplianceEvents(limit?: number): Promise<ComplianceEvent[]>;
  getAuditLog(tenantId?: string, limit?: number): Promise<AuditEntry[]>;
  getAuditEntry(id: string): Promise<AuditEntry>;
  getFederationRounds(limit?: number): Promise<FederationRound[]>;
  getContributors(roundId: string): Promise<Contributor[]>;
  getDatasets(): Promise<Dataset[]>;
  getPlatformMetrics(): Promise<PlatformMetrics>;
  createModelDraft(draft: ModelDraft): Promise<{ id: string }>;
  getTicker(): Promise<TickerQuote[]>;
}
