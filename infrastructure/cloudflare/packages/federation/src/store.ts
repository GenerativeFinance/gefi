/**
 * D1-backed CRUD for the federation tables. Mirrors the registry pattern
 * in `@gefi/marketplace/registry.ts`: a thin class with stateless methods,
 * one row-mapper per table, parameterised SQL only.
 */

import type {
  AttestationKind,
  ContributionScore,
  FederationParticipant,
  FederationRound,
  FederationUpdate,
  ParticipantStatus,
  RoundAlgorithm,
  RoundStatus,
} from "./types.js";
import type { Region } from "@gefi/shared-types";

function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

function mapRound(row: Record<string, unknown>): FederationRound {
  return {
    id: row.id as string,
    modelId: row.model_id as string,
    jurisdiction: row.jurisdiction as Region,
    roundNumber: Number(row.round_number),
    status: row.status as RoundStatus,
    algorithm: row.algorithm as RoundAlgorithm,
    dpNoiseMultiplier: Number(row.dp_noise_multiplier),
    dpL2Clip: Number(row.dp_l2_clip),
    secureAggregation: Number(row.secure_aggregation) === 1,
    minParticipants: Number(row.min_participants),
    maxParticipants: Number(row.max_participants),
    baselineVersionId: (row.baseline_version_id as string | null) ?? null,
    targetVersionId: (row.target_version_id as string | null) ?? null,
    aggregateSha256: (row.aggregate_sha256 as string | null) ?? null,
    chainTxHash: (row.chain_tx_hash as string | null) ?? null,
    invitedAt: row.invited_at == null ? null : Number(row.invited_at),
    collectedAt: row.collected_at == null ? null : Number(row.collected_at),
    aggregatedAt: row.aggregated_at == null ? null : Number(row.aggregated_at),
    distributedAt: row.distributed_at == null ? null : Number(row.distributed_at),
    closedAt: row.closed_at == null ? null : Number(row.closed_at),
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

function mapParticipant(row: Record<string, unknown>): FederationParticipant {
  return {
    id: row.id as string,
    roundId: row.round_id as string,
    tenantId: row.tenant_id as string,
    jurisdiction: row.jurisdiction as Region,
    status: row.status as ParticipantStatus,
    attestationKind: (row.attestation_kind as AttestationKind | null) ?? null,
    attestationQuote: (row.attestation_quote as string | null) ?? null,
    attestationMrenclave: (row.attestation_mrenclave as string | null) ?? null,
    invitedAt: Number(row.invited_at),
    acceptedAt: row.accepted_at == null ? null : Number(row.accepted_at),
    submittedAt: row.submitted_at == null ? null : Number(row.submitted_at),
    sampleCount: Number(row.sample_count),
  };
}

function mapUpdate(row: Record<string, unknown>): FederationUpdate {
  return {
    id: row.id as string,
    roundId: row.round_id as string,
    participantId: row.participant_id as string,
    tenantId: row.tenant_id as string,
    r2Key: row.r2_key as string,
    payloadSha256: row.payload_sha256 as string,
    payloadSize: Number(row.payload_size),
    maskSumSha256: (row.mask_sum_sha256 as string | null) ?? null,
    dpNoiseApplied: Number(row.dp_noise_applied),
    sampleCount: Number(row.sample_count),
    createdAt: Number(row.created_at),
  };
}

export interface CreateRoundInput {
  modelId: string;
  jurisdiction: Region;
  roundNumber: number;
  algorithm?: RoundAlgorithm;
  dpNoiseMultiplier?: number;
  dpL2Clip?: number;
  secureAggregation?: boolean;
  minParticipants?: number;
  maxParticipants?: number;
  baselineVersionId?: string;
  ts?: number;
}

export interface InviteParticipantInput {
  roundId: string;
  tenantId: string;
  jurisdiction: Region;
  ts?: number;
}

export interface AcceptParticipantInput {
  participantId: string;
  attestationKind: AttestationKind;
  attestationQuote: string;
  attestationMrenclave: string | null;
  ts?: number;
}

export interface RecordUpdateInput {
  roundId: string;
  participantId: string;
  tenantId: string;
  r2Key: string;
  payloadSha256: string;
  payloadSize: number;
  maskSumSha256: string | null;
  dpNoiseApplied: number;
  sampleCount: number;
  ts?: number;
}

export class FederationStore {
  constructor(private readonly db: D1Database) {}

  async createRound(input: CreateRoundInput): Promise<FederationRound> {
    const ts = input.ts ?? Math.floor(Date.now() / 1000);
    const id = newId("fr");
    await this.db
      .prepare(
        `INSERT INTO federation_rounds (
          id, model_id, jurisdiction, round_number, status, algorithm,
          dp_noise_multiplier, dp_l2_clip, secure_aggregation,
          min_participants, max_participants, baseline_version_id,
          created_at, updated_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      )
      .bind(
        id,
        input.modelId,
        input.jurisdiction,
        input.roundNumber,
        "init",
        input.algorithm ?? "fedavg",
        input.dpNoiseMultiplier ?? 0,
        input.dpL2Clip ?? 1.0,
        input.secureAggregation === false ? 0 : 1,
        input.minParticipants ?? 3,
        input.maxParticipants ?? 100,
        input.baselineVersionId ?? null,
        ts,
        ts,
      )
      .run();
    const row = await this.getRound(id);
    if (!row) throw new Error("round_create_failed");
    return row;
  }

  async getRound(id: string): Promise<FederationRound | null> {
    const r = await this.db.prepare(`SELECT * FROM federation_rounds WHERE id = ?`).bind(id).first<Record<string, unknown>>();
    return r ? mapRound(r) : null;
  }

  async setRoundStatus(id: string, status: RoundStatus, ts: number = Math.floor(Date.now() / 1000)): Promise<void> {
    // Each status maps to the timestamp column recording *when that phase
    // was entered*. `init` and `failed` have no dedicated column.
    const tsCol =
      status === "invite" ? "invited_at" :
      status === "collect" ? "collected_at" :
      status === "aggregate" ? "aggregated_at" :
      status === "distribute" ? "distributed_at" :
      status === "closed" ? "closed_at" : null;
    if (tsCol) {
      await this.db
        .prepare(`UPDATE federation_rounds SET status = ?, ${tsCol} = COALESCE(${tsCol}, ?), updated_at = ? WHERE id = ?`)
        .bind(status, ts, ts, id)
        .run();
    } else {
      await this.db
        .prepare(`UPDATE federation_rounds SET status = ?, updated_at = ? WHERE id = ?`)
        .bind(status, ts, id)
        .run();
    }
  }

  async setRoundAggregate(id: string, sha256: string, chainTxHash: string | null, ts: number = Math.floor(Date.now() / 1000)): Promise<void> {
    await this.db
      .prepare(`UPDATE federation_rounds SET aggregate_sha256 = ?, chain_tx_hash = ?, aggregated_at = ?, updated_at = ? WHERE id = ?`)
      .bind(sha256, chainTxHash, ts, ts, id)
      .run();
  }

  async invite(input: InviteParticipantInput): Promise<FederationParticipant> {
    const ts = input.ts ?? Math.floor(Date.now() / 1000);
    const id = newId("fp");
    await this.db
      .prepare(
        `INSERT INTO federation_participants (
          id, round_id, tenant_id, jurisdiction, status, invited_at, sample_count
        ) VALUES (?,?,?,?,?,?,?)`,
      )
      .bind(id, input.roundId, input.tenantId, input.jurisdiction, "invited", ts, 0)
      .run();
    const row = await this.getParticipant(id);
    if (!row) throw new Error("participant_invite_failed");
    return row;
  }

  async accept(input: AcceptParticipantInput): Promise<void> {
    const ts = input.ts ?? Math.floor(Date.now() / 1000);
    await this.db
      .prepare(
        `UPDATE federation_participants
         SET status = 'accepted', accepted_at = ?,
             attestation_kind = ?, attestation_quote = ?, attestation_mrenclave = ?
         WHERE id = ? AND status = 'invited'`,
      )
      .bind(ts, input.attestationKind, input.attestationQuote, input.attestationMrenclave, input.participantId)
      .run();
  }

  async getParticipant(id: string): Promise<FederationParticipant | null> {
    const r = await this.db.prepare(`SELECT * FROM federation_participants WHERE id = ?`).bind(id).first<Record<string, unknown>>();
    return r ? mapParticipant(r) : null;
  }

  async listParticipants(roundId: string): Promise<FederationParticipant[]> {
    const r = await this.db
      .prepare(`SELECT * FROM federation_participants WHERE round_id = ? ORDER BY invited_at`)
      .bind(roundId)
      .all<Record<string, unknown>>();
    return (r.results ?? []).map(mapParticipant);
  }

  async findParticipantByTenant(roundId: string, tenantId: string): Promise<FederationParticipant | null> {
    const r = await this.db
      .prepare(`SELECT * FROM federation_participants WHERE round_id = ? AND tenant_id = ?`)
      .bind(roundId, tenantId)
      .first<Record<string, unknown>>();
    return r ? mapParticipant(r) : null;
  }

  async recordUpdate(input: RecordUpdateInput): Promise<FederationUpdate> {
    const ts = input.ts ?? Math.floor(Date.now() / 1000);
    const id = newId("fu");
    await this.db
      .prepare(
        `INSERT INTO federation_updates (
          id, round_id, participant_id, tenant_id, r2_key, payload_sha256,
          payload_size, mask_sum_sha256, dp_noise_applied, sample_count, created_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      )
      .bind(
        id,
        input.roundId,
        input.participantId,
        input.tenantId,
        input.r2Key,
        input.payloadSha256,
        input.payloadSize,
        input.maskSumSha256,
        input.dpNoiseApplied,
        input.sampleCount,
        ts,
      )
      .run();
    await this.db
      .prepare(`UPDATE federation_participants SET status = 'submitted', submitted_at = ?, sample_count = ? WHERE id = ?`)
      .bind(ts, input.sampleCount, input.participantId)
      .run();
    const r = await this.db
      .prepare(`SELECT * FROM federation_updates WHERE id = ?`)
      .bind(id)
      .first<Record<string, unknown>>();
    if (!r) throw new Error("update_record_failed");
    return mapUpdate(r);
  }

  async listUpdates(roundId: string): Promise<FederationUpdate[]> {
    const r = await this.db
      .prepare(`SELECT * FROM federation_updates WHERE round_id = ? ORDER BY created_at`)
      .bind(roundId)
      .all<Record<string, unknown>>();
    return (r.results ?? []).map(mapUpdate);
  }

  async writeContributions(roundId: string, scores: Array<{ tenantId: string; score: number; permutations: number }>): Promise<void> {
    const ts = Math.floor(Date.now() / 1000);
    const stmts = scores.map((s) =>
      this.db
        .prepare(`INSERT OR REPLACE INTO contribution_scores (round_id, tenant_id, score, permutations, computed_at) VALUES (?,?,?,?,?)`)
        .bind(roundId, s.tenantId, s.score, s.permutations, ts),
    );
    if (stmts.length > 0) await this.db.batch(stmts);
  }

  async listContributions(roundId: string): Promise<ContributionScore[]> {
    const r = await this.db
      .prepare(`SELECT * FROM contribution_scores WHERE round_id = ?`)
      .bind(roundId)
      .all<Record<string, unknown>>();
    return (r.results ?? []).map((row) => ({
      roundId: row.round_id as string,
      tenantId: row.tenant_id as string,
      score: Number(row.score),
      permutations: Number(row.permutations),
      computedAt: Number(row.computed_at),
    }));
  }

  async listContributionsByTenant(tenantId: string, limit = 50): Promise<ContributionScore[]> {
    const r = await this.db
      .prepare(`SELECT * FROM contribution_scores WHERE tenant_id = ? ORDER BY computed_at DESC LIMIT ?`)
      .bind(tenantId, limit)
      .all<Record<string, unknown>>();
    return (r.results ?? []).map((row) => ({
      roundId: row.round_id as string,
      tenantId: row.tenant_id as string,
      score: Number(row.score),
      permutations: Number(row.permutations),
      computedAt: Number(row.computed_at),
    }));
  }
}
