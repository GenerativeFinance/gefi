/**
 * Deterministic stub API client.
 *
 * All data is seeded so tests are reproducible. Production wires the
 * live client; the stub is used in dev (VITE_API_STUB=true) and tests.
 *
 * Stub latency: 120 ms to simulate network without slowing tests.
 */
import type {
  ApiClient,
  AuditEntry,
  Contributor,
  Dataset,
  FederationRound,
  ModelDraft,
  ModelPosition,
  PlatformMetrics,
  PortfolioSummary,
  ComplianceEvent,
  TickerQuote,
} from "./client.js";

const DELAY = typeof process !== "undefined" && process.env["NODE_ENV"] === "test" ? 0 : 120;

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const SPARKLINES: Record<string, number[]> = {
  alpha: [102, 105, 103, 108, 110, 107, 112, 115, 113, 118],
  beta:  [98, 97, 99, 96, 100, 102, 101, 103, 100, 104],
  gamma: [120, 118, 122, 119, 124, 126, 123, 128, 125, 130],
  delta: [80, 82, 79, 84, 83, 86, 84, 87, 85, 89],
  epsilon:[200, 195, 202, 198, 205, 203, 208, 206, 210, 212],
};

export const stubClient: ApiClient = {
  async getPortfolioSummary(): Promise<PortfolioSummary> {
    await delay(DELAY);
    return {
      totalAum: 4_281_350_000,
      dayReturn: 0.83,
      weekReturn: 2.41,
      monthReturn: 7.18,
      sharpeRatio: 2.34,
      maxDrawdown: -4.12,
      varP95: -1.85,
      activeModels: 12,
    };
  },

  async getModelPositions(): Promise<ModelPosition[]> {
    await delay(DELAY);
    return [
      { id: "mdl-001", name: "AlphaQuant EU", jurisdiction: "eu", allocation: 28.4, return7d: 2.1, return30d: 7.4, riskLevel: "low", complianceStatus: "compliant", sparkline: SPARKLINES["alpha"]! },
      { id: "mdl-002", name: "BetaSignal US", jurisdiction: "us", allocation: 22.1, return7d: -0.6, return30d: 3.2, riskLevel: "medium", complianceStatus: "compliant", sparkline: SPARKLINES["beta"]! },
      { id: "mdl-003", name: "GammaMomentum UK", jurisdiction: "uk", allocation: 18.7, return7d: 3.4, return30d: 9.1, riskLevel: "low", complianceStatus: "review", sparkline: SPARKLINES["gamma"]! },
      { id: "mdl-004", name: "DeltaHedge MENA", jurisdiction: "mena", allocation: 15.3, return7d: 1.8, return30d: 5.6, riskLevel: "medium", complianceStatus: "pending", sparkline: SPARKLINES["delta"]! },
      { id: "mdl-005", name: "EpsilonMacro APAC", jurisdiction: "apac", allocation: 15.5, return7d: -1.2, return30d: 2.8, riskLevel: "high", complianceStatus: "compliant", sparkline: SPARKLINES["epsilon"]! },
    ];
  },

  async getComplianceEvents(limit = 20): Promise<ComplianceEvent[]> {
    await delay(DELAY);
    const events: ComplianceEvent[] = [
      { id: "ce-001", timestamp: "2026-05-03T08:14:22Z", jurisdiction: "eu", kind: "model_audit_pass", severity: "info", summary: "AlphaQuant EU passed quarterly audit", proofHash: "0xabcd1234" },
      { id: "ce-002", timestamp: "2026-05-03T07:55:11Z", jurisdiction: "us", kind: "kyc_expiry_warn", severity: "warn", summary: "3 investor KYC records expire within 30 days" },
      { id: "ce-003", timestamp: "2026-05-02T22:31:08Z", jurisdiction: "mena", kind: "sanctions_match_cleared", severity: "info", summary: "MENA entity sanctions check cleared" },
      { id: "ce-004", timestamp: "2026-05-02T18:00:00Z", jurisdiction: "eu", kind: "gdpr_deletion_request", severity: "warn", summary: "GDPR erasure request received — 48h deadline" },
      { id: "ce-005", timestamp: "2026-05-01T14:22:44Z", jurisdiction: "uk", kind: "fca_report_submitted", severity: "info", summary: "FCA quarterly report submitted on time" },
      { id: "ce-006", timestamp: "2026-04-30T09:00:00Z", jurisdiction: "us", kind: "sec_comment_letter", severity: "critical", summary: "SEC comment letter received — respond by May 15" },
    ];
    return events.slice(0, limit);
  },

  async getAuditLog(_tenantId?: string, limit = 20): Promise<AuditEntry[]> {
    await delay(DELAY);
    const entries: AuditEntry[] = Array.from({ length: limit }, (_, i) => ({
      id: `audit-${String(i).padStart(4, "0")}`,
      timestamp: new Date(Date.now() - i * 3_600_000).toISOString(),
      tenantId: "tenant-acme",
      action: ["inference", "subscribe", "publish", "update", "read"][i % 5]!,
      resource: ["model", "subscription", "audit_log", "compliance_event", "tenant"][i % 5]!,
      hash: `0x${(0xdeadbeef + i).toString(16).padStart(8, "0")}${"0".repeat(56)}`,
      prevHash: i === 0 ? null : `0x${(0xdeadbeef + i - 1).toString(16).padStart(8, "0")}${"0".repeat(56)}`,
      proofPath: [`0x${"a".repeat(64)}`, `0x${"b".repeat(64)}`],
    }));
    return entries;
  },

  async getAuditEntry(id: string): Promise<AuditEntry> {
    await delay(DELAY);
    return {
      id,
      timestamp: new Date().toISOString(),
      tenantId: "tenant-acme",
      action: "inference",
      resource: "model",
      hash: `0x${"f".repeat(64)}`,
      prevHash: `0x${"e".repeat(64)}`,
      proofPath: [`0x${"a".repeat(64)}`, `0x${"b".repeat(64)}`, `0x${"c".repeat(64)}`],
    };
  },

  async getFederationRounds(limit = 10): Promise<FederationRound[]> {
    await delay(DELAY);
    const statuses = ["aggregate", "collect", "distribute", "closed", "invite"];
    return Array.from({ length: limit }, (_, i) => ({
      id: `round-${String(i + 1).padStart(4, "0")}`,
      modelId: `mdl-00${(i % 5) + 1}`,
      roundNumber: limit - i,
      status: statuses[i % statuses.length]!,
      participantCount: 3 + (i % 8),
      completedAt: i > 2 ? new Date(Date.now() - i * 86_400_000).toISOString() : null,
      accuracy: i > 2 ? 0.82 + i * 0.004 : undefined,
      privacyBudgetUsed: 0.1 + i * 0.05,
    }));
  },

  async getContributors(roundId: string): Promise<Contributor[]> {
    await delay(DELAY);
    const n = parseInt(roundId.slice(-4), 10) % 5 + 3;
    return Array.from({ length: n }, (_, i) => ({
      participantId: `node-${String(i + 1).padStart(3, "0")}`,
      score: parseFloat((0.15 + i * 0.07).toFixed(4)),
      sampleCount: 1000 + i * 250,
      reward: parseFloat((0.08 + i * 0.02).toFixed(4)),
      attestationKind: i === 0 ? "sgx" : i === 1 ? "nitro" : "stub",
    }));
  },

  async getDatasets(): Promise<Dataset[]> {
    await delay(DELAY);
    return [
      { id: "ds-001", name: "EU Equity Price Feed", schema: '{"price":float,"volume":int,"timestamp":datetime}', rowCount: 4_200_000, privacyBudgetUsed: 0.8, privacyBudgetMax: 10.0, registeredAt: "2026-01-15T00:00:00Z", jurisdiction: "eu" },
      { id: "ds-002", name: "US Options Chain", schema: '{"strike":float,"expiry":date,"iv":float}', rowCount: 12_800_000, privacyBudgetUsed: 2.1, privacyBudgetMax: 10.0, registeredAt: "2026-02-01T00:00:00Z", jurisdiction: "us" },
      { id: "ds-003", name: "UK Credit Reference", schema: '{"score":int,"utilisation":float,"delinquency":bool}', rowCount: 890_000, privacyBudgetUsed: 4.5, privacyBudgetMax: 8.0, registeredAt: "2026-03-10T00:00:00Z", jurisdiction: "uk" },
    ];
  },

  async getPlatformMetrics(): Promise<PlatformMetrics> {
    await delay(DELAY);
    return {
      dailyActiveUsers: 1_842,
      modelsDeployed: 47,
      totalInferences: 8_421_300,
      openTickets: 12,
      complianceScore: 96.4,
      revenueMonth: 284_700,
    };
  },

  async createModelDraft(_draft: ModelDraft): Promise<{ id: string }> {
    await delay(DELAY * 2);
    return { id: `mdl-${Date.now().toString(36)}` };
  },

  async getTicker(): Promise<TickerQuote[]> {
    await delay(DELAY);
    const base: TickerQuote[] = [
      { symbol: "BTC/USD", price: 67_420.50, change: 842.30, changePct: 1.27, ts: Date.now() },
      { symbol: "ETH/USD", price: 3_218.80, change: -42.10, changePct: -1.29, ts: Date.now() },
      { symbol: "SPX",     price: 5_301.42, change: 18.74,  changePct: 0.35,  ts: Date.now() },
      { symbol: "EURUSD",  price: 1.0842,   change: 0.0012,  changePct: 0.11,  ts: Date.now() },
      { symbol: "XAU/USD", price: 2_327.60, change: -8.40,  changePct: -0.36, ts: Date.now() },
    ];
    return base;
  },
};
