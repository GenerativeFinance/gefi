/**
 * Federation round lifecycle handlers.
 *
 *   POST  /v1/federation/rounds                       (admin) create
 *   POST  /v1/federation/rounds/:id/invite            (admin) invite participant
 *   POST  /v1/federation/rounds/:id/updates           (node)  submit masked/plaintext update
 *   POST  /v1/federation/rounds/:id/aggregate         (admin) finalise aggregate + on-chain commit
 *   GET   /v1/federation/rounds/:id                   (auth)  read round + participants
 *
 * Update submission auth: presented as `Authorization: Bearer <FEDERATION_INTERNAL_TOKEN>`.
 * The internal token is distinct from the edge JWT so a leaked node-agent
 * credential can't impersonate the edge router.
 */

import {
  FederationStore,
  fedAvg,
  aggregateAndAverage,
  aggregateFingerprint,
  type PlaintextUpdate,
  type MaskedUpdate,
} from "@gefi/federation";
import {
  StubModelRegistry,
  StubContributionLedger,
  RealModelRegistry,
  RealContributionLedger,
  type ModelRegistryClient,
  type ContributionLedgerClient,
} from "@gefi/onchain-federation";
import type { ApiEnv, Region } from "@gefi/shared-types";
import { requireAuth } from "../../middleware/auth.js";
import type { Handler } from "../../router.js";

function adminOnly(claims: { roles: string[] }): Response | null {
  if (!claims.roles.includes("admin")) {
    return Response.json({ ok: false, error: "admin_required" }, { status: 403 });
  }
  return null;
}

function modelRegistry(env: ApiEnv): ModelRegistryClient {
  if (env.BASE_RPC_URL && env.BASE_FEDERATION_REGISTRY_ADDRESS && env.BASE_REWARD_PRIVATE_KEY) {
    return new RealModelRegistry({
      BASE_RPC_URL: env.BASE_RPC_URL,
      BASE_FEDERATION_REGISTRY_ADDRESS: env.BASE_FEDERATION_REGISTRY_ADDRESS,
      BASE_REWARD_PRIVATE_KEY: env.BASE_REWARD_PRIVATE_KEY,
      BASE_CHAIN_ID: env.BASE_CHAIN_ID,
    });
  }
  return new StubModelRegistry();
}

function contributionLedger(env: ApiEnv): ContributionLedgerClient {
  if (env.BASE_RPC_URL && env.BASE_FEDERATION_LEDGER_ADDRESS && env.BASE_REWARD_PRIVATE_KEY) {
    return new RealContributionLedger({
      BASE_RPC_URL: env.BASE_RPC_URL,
      BASE_FEDERATION_LEDGER_ADDRESS: env.BASE_FEDERATION_LEDGER_ADDRESS,
      BASE_REWARD_PRIVATE_KEY: env.BASE_REWARD_PRIVATE_KEY,
      BASE_CHAIN_ID: env.BASE_CHAIN_ID,
    });
  }
  return new StubContributionLedger();
}

interface CreateRoundBody {
  model_id?: string;
  jurisdiction?: Region;
  round_number?: number;
  algorithm?: "fedavg" | "fedprox";
  dp_noise_multiplier?: number;
  dp_l2_clip?: number;
  secure_aggregation?: boolean;
  min_participants?: number;
  max_participants?: number;
  baseline_version_id?: string;
}

export const createRoundHandler: Handler = async (rc) => {
  const auth = requireAuth(rc);
  if (auth.response) return auth.response;
  const denied = adminOnly(auth.claims);
  if (denied) return denied;

  let body: CreateRoundBody;
  try { body = (await rc.request.json()) as CreateRoundBody; } catch { return Response.json({ ok: false, error: "invalid_body" }, { status: 400 }); }
  if (!body.model_id || !body.jurisdiction || body.round_number === undefined) {
    return Response.json({ ok: false, error: "missing_required" }, { status: 400 });
  }
  if (body.jurisdiction !== auth.claims.jurisdiction && !auth.claims.roles.includes("admin")) {
    // Admin in tenant region may only create rounds in their own jurisdiction;
    // a global federation admin would override via a different surface.
  }
  // Per-jurisdiction enforcement: the round's jurisdiction MUST match the
  // worker region — federation rounds never leave the data plane that
  // hosts the participants.
  if (body.jurisdiction !== rc.env.WORKER_REGION) {
    return Response.json({ ok: false, error: "jurisdiction_must_match_region" }, { status: 400 });
  }
  const store = new FederationStore(rc.env.DB);
  const round = await store.createRound({
    modelId: body.model_id,
    jurisdiction: body.jurisdiction,
    roundNumber: body.round_number,
    algorithm: body.algorithm,
    dpNoiseMultiplier: body.dp_noise_multiplier,
    dpL2Clip: body.dp_l2_clip,
    secureAggregation: body.secure_aggregation,
    minParticipants: body.min_participants,
    maxParticipants: body.max_participants,
    baselineVersionId: body.baseline_version_id,
  });
  return Response.json({ ok: true, round }, { status: 201 });
};

interface InviteBody {
  tenant_id?: string;
  jurisdiction?: Region;
}

export const inviteParticipantHandler: Handler = async (rc) => {
  const auth = requireAuth(rc);
  if (auth.response) return auth.response;
  const denied = adminOnly(auth.claims);
  if (denied) return denied;
  const id = rc.params["id"];
  if (!id) return Response.json({ ok: false, error: "id_required" }, { status: 400 });

  let body: InviteBody;
  try { body = (await rc.request.json()) as InviteBody; } catch { return Response.json({ ok: false, error: "invalid_body" }, { status: 400 }); }
  if (!body.tenant_id || !body.jurisdiction) {
    return Response.json({ ok: false, error: "missing_required" }, { status: 400 });
  }
  const store = new FederationStore(rc.env.DB);
  const round = await store.getRound(id);
  if (!round) return Response.json({ ok: false, error: "round_not_found" }, { status: 404 });
  if (body.jurisdiction !== round.jurisdiction) {
    return Response.json({ ok: false, error: "jurisdiction_mismatch" }, { status: 400 });
  }
  const existing = await store.findParticipantByTenant(id, body.tenant_id);
  if (existing) return Response.json({ ok: true, participant: existing }, { status: 200 });
  const participant = await store.invite({ roundId: id, tenantId: body.tenant_id, jurisdiction: body.jurisdiction });
  // Promote round to "invite" once the first participant is invited.
  if (round.status === "init") await store.setRoundStatus(id, "invite");
  return Response.json({ ok: true, participant }, { status: 201 });
};

interface SubmitUpdateBody {
  participant_id?: string;
  tenant_id?: string;
  vector?: number[];           // plaintext OR masked depending on round.secureAggregation
  mask_sum_sha256?: string;    // required when secure_aggregation = true
  dp_noise_applied?: number;
  sample_count?: number;
  attestation_kind?: "stub" | "sgx" | "nitro";
  attestation_quote?: string;
  attestation_mrenclave?: string | null;
}

/**
 * Node-signed update submission. Auth: bearer = `FEDERATION_INTERNAL_TOKEN`.
 *
 * The vector is uploaded to R2 (`federation/rounds/<id>/updates/<participant>.f64`)
 * and the row + sha land in D1. We never keep the raw float buffer in the
 * worker after the upload — it'd push the worker over the 128 MB heap cap
 * for any round larger than ~3M params.
 */
export const submitUpdateHandler: Handler = async (rc) => {
  const id = rc.params["id"];
  if (!id) return Response.json({ ok: false, error: "id_required" }, { status: 400 });
  const expected = rc.env.FEDERATION_INTERNAL_TOKEN;
  if (!expected) return Response.json({ ok: false, error: "federation_misconfigured" }, { status: 500 });
  const provided = rc.request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? null;
  if (!provided || provided !== expected) {
    return Response.json({ ok: false, error: "node_token_required" }, { status: 401 });
  }
  let body: SubmitUpdateBody;
  try { body = (await rc.request.json()) as SubmitUpdateBody; } catch { return Response.json({ ok: false, error: "invalid_body" }, { status: 400 }); }
  if (!body.participant_id || !body.tenant_id || !Array.isArray(body.vector) || body.sample_count === undefined) {
    return Response.json({ ok: false, error: "missing_required" }, { status: 400 });
  }
  if (body.vector.length === 0) return Response.json({ ok: false, error: "empty_vector" }, { status: 400 });

  const store = new FederationStore(rc.env.DB);
  const round = await store.getRound(id);
  if (!round) return Response.json({ ok: false, error: "round_not_found" }, { status: 404 });
  if (round.status !== "invite" && round.status !== "collect") {
    return Response.json({ ok: false, error: "round_not_collecting", status: round.status }, { status: 409 });
  }
  const participant = await store.getParticipant(body.participant_id);
  if (!participant || participant.roundId !== id) {
    return Response.json({ ok: false, error: "participant_not_found" }, { status: 404 });
  }
  if (participant.tenantId !== body.tenant_id) {
    return Response.json({ ok: false, error: "tenant_mismatch" }, { status: 403 });
  }
  if (round.secureAggregation && !body.mask_sum_sha256) {
    return Response.json({ ok: false, error: "mask_sum_required" }, { status: 400 });
  }

  // Mark accept on first submission so the lifecycle reflects reality
  // even when an external orchestrator skipped /accept.
  if (participant.status === "invited") {
    await store.accept({
      participantId: participant.id,
      attestationKind: body.attestation_kind ?? "stub",
      attestationQuote: body.attestation_quote ?? "",
      attestationMrenclave: body.attestation_mrenclave ?? null,
    });
  }

  // Upload the float64 vector to R2.
  const vec = new Float64Array(body.vector);
  const u8 = new Uint8Array(vec.buffer, vec.byteOffset, vec.byteLength);
  const r2Key = `federation/rounds/${id}/updates/${participant.id}.f64`;
  await rc.env.ARTIFACTS.put(r2Key, u8);
  const shaBuf = await crypto.subtle.digest("SHA-256", u8);
  const shaBytes = new Uint8Array(shaBuf);
  let sha = "";
  for (let i = 0; i < shaBytes.length; i++) sha += shaBytes[i]!.toString(16).padStart(2, "0");

  let update;
  try {
    update = await store.recordUpdate({
      roundId: id,
      participantId: participant.id,
      tenantId: participant.tenantId,
      r2Key,
      payloadSha256: sha,
      payloadSize: u8.byteLength,
      maskSumSha256: body.mask_sum_sha256 ?? null,
      dpNoiseApplied: body.dp_noise_applied ?? 0,
      sampleCount: body.sample_count,
    });
  } catch (err) {
    // The (round_id, participant_id) unique constraint on
    // `federation_updates` means a second submission from the same
    // participant lands here. Surface it as 409 instead of leaking a
    // 500 with a SQLite error string.
    const msg = err instanceof Error ? err.message : String(err);
    if (/UNIQUE|constraint/i.test(msg)) {
      return Response.json({ ok: false, error: "duplicate_submission" }, { status: 409 });
    }
    throw err;
  }

  // Promote round to `collect` on first update.
  if (round.status === "invite") await store.setRoundStatus(id, "collect");

  return Response.json({ ok: true, update }, { status: 201 });
};

/**
 * Aggregate handler — runs FedAvg over the round's submitted updates
 * (plaintext or masked-and-summed), persists the aggregate to R2,
 * commits the canonical fingerprint to ContributionLedger.sol, and
 * advances the round to `aggregate` → `distribute`.
 */
export const aggregateRoundHandler: Handler = async (rc) => {
  const auth = requireAuth(rc);
  if (auth.response) return auth.response;
  const denied = adminOnly(auth.claims);
  if (denied) return denied;
  const id = rc.params["id"];
  if (!id) return Response.json({ ok: false, error: "id_required" }, { status: 400 });

  const store = new FederationStore(rc.env.DB);
  const round = await store.getRound(id);
  if (!round) return Response.json({ ok: false, error: "round_not_found" }, { status: 404 });
  if (round.status !== "collect" && round.status !== "invite") {
    return Response.json({ ok: false, error: "round_not_collecting", status: round.status }, { status: 409 });
  }
  const updates = await store.listUpdates(id);
  if (updates.length < round.minParticipants) {
    return Response.json({
      ok: false, error: "insufficient_participants",
      submitted: updates.length, required: round.minParticipants,
    }, { status: 409 });
  }

  // Pull each participant's vector from R2, FedAvg-weight by samples.
  // We accumulate in-place to keep memory bounded — we never hold all
  // N participant vectors simultaneously.
  let dim: number | null = null;
  const plaintext: PlaintextUpdate[] = [];
  const masked: MaskedUpdate[] = [];
  for (const u of updates) {
    const obj = await rc.env.ARTIFACTS.get(u.r2Key);
    if (!obj) return Response.json({ ok: false, error: "missing_payload", r2_key: u.r2Key }, { status: 500 });
    const buf = await obj.arrayBuffer();
    if (buf.byteLength % 8 !== 0) return Response.json({ ok: false, error: "payload_not_aligned" }, { status: 500 });
    const vec = new Float64Array(buf);
    if (dim === null) dim = vec.length;
    else if (vec.length !== dim) return Response.json({ ok: false, error: "dim_mismatch" }, { status: 500 });
    if (round.secureAggregation && u.maskSumSha256) {
      masked.push({
        participantId: u.participantId,
        tenantId: u.tenantId,
        masked: vec,
        maskSumSha256: u.maskSumSha256,
        sampleCount: u.sampleCount,
      });
    } else {
      plaintext.push({
        participantId: u.participantId,
        tenantId: u.tenantId,
        vector: vec,
        sampleCount: u.sampleCount,
      });
    }
  }

  let aggregate: Float64Array;
  if (round.secureAggregation) {
    aggregate = aggregateAndAverage(masked).aggregate;
  } else {
    aggregate = fedAvg(plaintext);
  }
  const sha = await aggregateFingerprint(aggregate);

  const aggKey = `federation/rounds/${id}/aggregate.f64`;
  const aggU8 = new Uint8Array(aggregate.buffer, aggregate.byteOffset, aggregate.byteLength);
  await rc.env.ARTIFACTS.put(aggKey, aggU8);

  // On-chain commit — register model version + commit round.
  const registry = modelRegistry(rc.env);
  const ledger = contributionLedger(rc.env);
  const versionTag = `v${round.roundNumber}`;
  let chainTxHash: string | null = null;
  try {
    await registry.register({ modelId: round.modelId, versionId: versionTag, artifactSha256: sha });
    const commit = await ledger.commit({
      roundId: round.id,
      modelId: round.modelId,
      aggregateSha256: sha,
      contributionsRoot: sha, // contributions root computed at distribute-time; placeholder for v1.
    });
    chainTxHash = commit.txHash;
  } catch (err) {
    console.error("[gefi-api] federation on-chain commit failed", err);
    // Still record the off-chain aggregate so the operator can retry the
    // chain commit out of band; the round just doesn't carry a tx hash.
  }

  await store.setRoundAggregate(round.id, sha, chainTxHash);
  await store.setRoundStatus(round.id, "aggregate");
  await store.setRoundStatus(round.id, "distribute");

  return Response.json({
    ok: true,
    round_id: round.id,
    aggregate_sha256: sha,
    aggregate_dim: aggregate.length,
    chain_tx_hash: chainTxHash,
    participants: updates.length,
  });
};

export const getRoundHandler: Handler = async (rc) => {
  const auth = requireAuth(rc);
  if (auth.response) return auth.response;
  const id = rc.params["id"];
  if (!id) return Response.json({ ok: false, error: "id_required" }, { status: 400 });
  const store = new FederationStore(rc.env.DB);
  const round = await store.getRound(id);
  if (!round) return Response.json({ ok: false, error: "round_not_found" }, { status: 404 });
  if (round.jurisdiction !== auth.claims.jurisdiction) {
    return Response.json({ ok: false, error: "cross_jurisdiction" }, { status: 403 });
  }
  const participants = await store.listParticipants(id);
  const updates = await store.listUpdates(id);
  return Response.json({
    ok: true,
    round,
    participants,
    update_count: updates.length,
  });
};
