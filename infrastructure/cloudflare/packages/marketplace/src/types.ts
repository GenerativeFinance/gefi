/**
 * Marketplace types — the public shape of a model + version + run.
 *
 * Kept deliberately framework-free so they can be consumed by the
 * Worker, the search-index serialiser, and any future SDK without
 * dragging in D1 / Workers types.
 */

import type { Region } from "@gefi/shared-types";

export type ModelCategory =
  | "sentiment"
  | "optimisation"
  | "forecasting"
  | "risk"
  | "classification"
  | "rag"
  | "other";

export type ModelRiskClass = "low" | "medium" | "high";

export type ModelStatus =
  | "draft"
  | "pending_compliance"
  | "approved"
  | "suspended"
  | "retired";

export type ModelVisibility = "private" | "public";

/**
 * Performance metrics surfaced on the model detail page. Keys map 1:1 to
 * what the marketing site renders. All numbers are decimals (e.g. 0.18 =
 * 18 % return) so we never rehydrate "%" strings on the client.
 */
export interface PerformanceMetrics {
  total_return?: number;
  sharpe?: number;
  max_dd?: number;
  win_rate?: number;
  sortino?: number;
}

/** Risk profile shown on the detail page. */
export interface RiskProfile {
  var?: number;
  beta?: number;
  vol?: number;
}

export interface ModelInputSpec {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  required: boolean;
  description?: string;
}

export interface ModelOutputSpec {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  description?: string;
}

export interface Model {
  id: string;
  slug: string;
  developerTenantId: string;
  jurisdiction: Region;
  name: string;
  summary: string;
  category: ModelCategory;
  riskClass: ModelRiskClass;
  status: ModelStatus;
  visibility: ModelVisibility;
  currentVersionId: string | null;
  monthlyPriceCents: number;
  developerShareBps: number;
  federationEnabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ModelMetadata {
  longDescription: string;
  inputs: ModelInputSpec[];
  outputs: ModelOutputSpec[];
  metrics: PerformanceMetrics;
  risk: RiskProfile;
  jurisdictionsSupported: Region[];
}

export interface ModelVersion {
  id: string;
  modelId: string;
  version: string;
  artifactR2Key: string;
  artifactSha256: string;
  artifactSize: number;
  manifestJson: string;
  chainTxHash: string | null;
  approvedAt: number | null;
  createdAt: number;
}

export interface ModelRunRecord {
  id: string;
  modelId: string;
  versionId: string;
  tenantId: string;
  userId: string | null;
  jurisdiction: Region;
  provider: string;
  modelString: string;
  inputSha: string;
  outputSha: string;
  inputJson: string;
  outputJson: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  isPaper: boolean;
  createdAt: number;
}

/** Compact card shown in the search/list response. */
export interface ModelCard {
  id: string;
  slug: string;
  name: string;
  summary: string;
  category: ModelCategory;
  riskClass: ModelRiskClass;
  jurisdiction: Region;
  jurisdictionsSupported: Region[];
  monthlyPriceCents: number;
  metrics: PerformanceMetrics;
  federationEnabled: boolean;
}
