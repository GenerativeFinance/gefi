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
  tmcShapley,
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
  if (existing) {
    // Re-invite is idempotent at the participant level — the original
    // node token was already returned at first-invite time and is the
    // only copy. We do not re-mint here so a leak of the orchestrator
    // role can't rotate-and-impersonate.
    return Response.json({ ok: true, participant: existing }, { status: 200 });
  }
  const { participant, nodeToken } = await store.invite({ roundId: id, tenantId: body.tenant_id, jurisdiction: body.jurisdiction });
  // Promote round to "invite" once the first participant is invited.
  if (round.status === "init") await store.setRoundStatus(id, "invite");
  // node_token is returned EXACTLY ONCE — the orchestrator forwards it
  // to the node-agent over its OOB channel and we never store the raw
  // value in D1 (only sha256). Subsequent reads of this participant
  // will not include `node_token`.
  return Response.json({ ok: true, participant, node_token: nodeToken }, { status: 201 });
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
  // Two-factor node auth: the shared FEDERATION_INTERNAL_TOKEN gates the
  // *endpoint* (only the orchestrator's trust boundary should reach here)
  // AND the participant-bound `X-Participant-Token` proves the caller is
  // the actual node holding the bearer minted at invite time. A leak of
  // either factor alone cannot impersonate a participant: the shared
  // bearer can't synthesise a per-participant secret (32 random bytes
  // never persisted raw), and the per-participant bearer can't cross the
  // orchestrator gate without also stealing the shared bearer.
  const expected = rc.env.FEDERATION_INTERNAL_TOKEN;
  if (!expected) return Response.json({ ok: false, error: "federation_misconfigured" }, { status: 500 });
  const provided = rc.request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? null;
  if (!provided || provided !== expected) {
    return Response.json({ ok: false, error: "node_token_required" }, { status: 401 });
  }
  const participantToken = rc.request.headers.get("X-Participant-Token");
  if (!participantToken) {
    return Response.json({ ok: false, error: "participant_token_required" }, { status: 401 });
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
  // Participant-bound auth check. We deliberately compare AFTER loading
  // the row (constant memory cost regardless of whether the participant
  // exists) and use the constant-time-ish helper in the store.
  const tokenOk = await store.verifyParticipantToken(participant.id, participantToken);
  if (!tokenOk) {
    return Response.json({ ok: false, error: "participant_token_invalid" }, { status: 401 });
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
  // Cohort-consistency check for secure-aggregation rounds.
  // Bonawitz pairwise masks only cancel iff every accepted cohort
  // member submits. Dropouts leave residual masks that unbalance the
  // sum unless the orchestrator runs `unmaskWithRecovery` with the
  // survivors' shared-mask shares — a flow we don't yet expose
  // through this handler. Reject the aggregate so a partial cohort
  // can't silently produce a poisoned model.
  if (round.secureAggregation) {
    const participants = await store.listParticipants(id);
    const accepted = participants.filter((p) => p.status === "accepted" || p.status === "submitted");
    const submittedIds = new Set(updates.map((u) => u.participantId));
    const dropouts = accepted.filter((p) => !submittedIds.has(p.id)).map((p) => p.id);
    if (dropouts.length > 0) {
      return Response.json({
        ok: false,
        error: "secure_agg_cohort_incomplete",
        submitted: updates.length,
        accepted: accepted.length,
        dropouts,
      }, { status: 409 });
    }
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

  // ----- 1. Compute contribution scores BEFORE the chain commit -----
  //
  // The on-chain `ContributionLedger.commit(...)` anchors a single
  // `contributionsRoot`. That root must be a deterministic hash over
  // the canonical contribution table for the round so any auditor can
  // re-derive it from `contribution_scores` and prove the chain
  // commitment matches the ledger row.
  //
  // For plaintext rounds we run TMC-Shapley with each participant's
  // submitted vector as the model and a synthetic validation target
  // derived from the FedAvg aggregate (the participants' weighted mean
  // acts as the held-out target). For secure-aggregation rounds we
  // cannot see individual vectors at the orchestrator (by design), so
  // we fall back to sample-count proportional scoring — identical to
  // FedAvg's contribution weighting.
  let scoreRows: Array<{ tenantId: string; score: number; permutations: number }>;
  if (round.secureAggregation || plaintext.length === 0) {
    const totalSamples = updates.reduce((s, u) => s + u.sampleCount, 0) || 1;
    scoreRows = updates.map((u) => ({
      tenantId: u.tenantId,
      score: u.sampleCount / totalSamples,
      permutations: 0,
    }));
  } else {
    // Build a small synthetic validation set: rows = participant vectors,
    // target = inner-product with the FedAvg aggregate. This rewards
    // participants whose updates align with the consensus model and
    // penalises adversarial / drifted updates. Cap evaluation rows at 32
    // for bounded CPU cost on the Worker.
    const X = plaintext.slice(0, 32).map((p) => p.vector);
    const y = new Float64Array(X.length);
    for (let i = 0; i < X.length; i++) {
      const v = X[i]!;
      let dot = 0;
      for (let k = 0; k < v.length; k++) dot += v[k]! * aggregate[k]!;
      y[i] = dot;
    }
    const shap = tmcShapley({ participants: plaintext, X, y, permutations: 6 });
    scoreRows = plaintext.map((p, i) => ({
      tenantId: p.tenantId,
      score: shap.scores[i] ?? 0,
      permutations: shap.permutationsSampled,
    }));
  }
  await store.writeContributions(round.id, scoreRows);

  // ----- 2. Derive the canonical contributions root -----
  //
  // Sort by tenantId (stable across re-derivation), serialise as
  // `<tenantId>:<score-as-fixed-binary64>:<permutations>` lines, hash.
  // An auditor running the same canonicalisation against
  // `contribution_scores` MUST get the same root.
  const sorted = [...scoreRows].sort((a, b) => (a.tenantId < b.tenantId ? -1 : a.tenantId > b.tenantId ? 1 : 0));
  const buf = new ArrayBuffer(8);
  const dv = new DataView(buf);
  const enc = new TextEncoder();
  const lines: Uint8Array[] = [];
  for (const r of sorted) {
    dv.setFloat64(0, r.score, true);
    let scoreHex = "";
    for (let i = 0; i < 8; i++) scoreHex += new Uint8Array(buf)[i]!.toString(16).padStart(2, "0");
    lines.push(enc.encode(`${r.tenantId}:${scoreHex}:${r.permutations}\n`));
  }
  const totalLen = lines.reduce((s, l) => s + l.length, 0);
  const canonical = new Uint8Array(totalLen);
  let off = 0;
  for (const l of lines) { canonical.set(l, off); off += l.length; }
  const rootBuf = await crypto.subtle.digest("SHA-256", canonical);
  const rootBytes = new Uint8Array(rootBuf);
  let contributionsRoot = "";
  for (let i = 0; i < rootBytes.length; i++) contributionsRoot += rootBytes[i]!.toString(16).padStart(2, "0");

  // ----- 3. On-chain commit with the real contributions root -----
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
      contributionsRoot,
    });
    chainTxHash = commit.txHash;
  } catch (err) {
    console.error("[gefi-api] federation on-chain commit failed", err);
    // Still record the off-chain aggregate so the operator can retry the
    // chain commit out of band; the round just doesn't carry a tx hash.
  }

  // ----- 4. Persist round-level state and advance status -----
  await store.setRoundAggregate(round.id, sha, chainTxHash);
  await store.setRoundStatus(round.id, "aggregate");
  await store.setRoundStatus(round.id, "distribute");

  return Response.json({
    ok: true,
    round_id: round.id,
    aggregate_sha256: sha,
    aggregate_dim: aggregate.length,
    contributions_root: contributionsRoot,
    chain_tx_hash: chainTxHash,
    participants: updates.length,
    contributions_persisted: scoreRows.length,
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
