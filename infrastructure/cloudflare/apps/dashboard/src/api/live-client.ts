/**
 * Live API client — calls `api.gefi.io` (or VITE_API_BASE_URL override).
 *
 * Authentication: sends the Auth0 access token as `Authorization: Bearer <token>`.
 * All errors from the API surface as thrown `ApiError` instances.
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

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function createLiveClient(
  getToken: () => string | null,
  baseUrl = import.meta.env["VITE_API_BASE_URL"] ?? "https://api.gefi.io",
): ApiClient {
  async function req<T>(
    path: string,
    init?: RequestInit,
  ): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(`${baseUrl}${path}`, { ...init, headers });
    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as Record<string, unknown>;
      throw new ApiError(
        res.status,
        typeof body["code"] === "string" ? body["code"] : "unknown",
        typeof body["message"] === "string" ? body["message"] : res.statusText,
      );
    }
    return res.json() as Promise<T>;
  }

  return {
    getPortfolioSummary: () => req<PortfolioSummary>("/v1/investor/portfolio"),
    getModelPositions: () => req<ModelPosition[]>("/v1/investor/positions"),
    getComplianceEvents: (limit = 20) =>
      req<ComplianceEvent[]>(`/v1/compliance/events?limit=${limit}`),
    getAuditLog: (tenantId, limit = 20) =>
      req<AuditEntry[]>(
        `/v1/compliance/audit?limit=${limit}${tenantId ? `&tenant_id=${tenantId}` : ""}`,
      ),
    getAuditEntry: (id) => req<AuditEntry>(`/v1/compliance/audit/${id}`),
    getFederationRounds: (limit = 10) =>
      req<FederationRound[]>(`/v1/federation/rounds?limit=${limit}`),
    getContributors: (roundId) =>
      req<Contributor[]>(`/v1/federation/contributions/${roundId}`),
    getDatasets: () => req<Dataset[]>("/v1/datasets"),
    getPlatformMetrics: () => req<PlatformMetrics>("/v1/admin/metrics"),
    createModelDraft: (draft: ModelDraft) =>
      req<{ id: string }>("/v1/models", { method: "POST", body: JSON.stringify(draft) }),
    getTicker: () => req<TickerQuote[]>("/v1/market/ticker"),
  };
}
