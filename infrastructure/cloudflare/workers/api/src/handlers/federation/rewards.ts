/**
 * Federation rewards + KYC + contributions handlers.
 *
 *   POST /v1/federation/rewards/distribute      (admin) compute + on-chain pay
 *   GET  /v1/federation/contributions/:tenant_id (auth) list per-tenant scores
 *   POST /v1/federation/kyc-whitelist            (admin) add to KYC allow-list
 */

import { FederationStore } from "@gefi/federation";
import {
  StubRewardDistributor,
  RealRewardDistributor,
  StubKycRegistry,
  RealKycRegistry,
  computeRewards,
  type RewardDistributorClient,
  type KycRegistryClient,
} from "@gefi/onchain-federation";
import type { ApiEnv } from "@gefi/shared-types";
import { requireAuth } from "../../middleware/auth.js";
import type { Handler } from "../../router.js";

function rewardsClient(env: ApiEnv): RewardDistributorClient {
  if (env.BASE_RPC_URL && env.BASE_FEDERATION_REWARDS_ADDRESS && env.BASE_REWARD_PRIVATE_KEY) {
    return new RealRewardDistributor({
      BASE_RPC_URL: env.BASE_RPC_URL,
      BASE_FEDERATION_REWARDS_ADDRESS: env.BASE_FEDERATION_REWARDS_ADDRESS,
      BASE_REWARD_PRIVATE_KEY: env.BASE_REWARD_PRIVATE_KEY,
      BASE_CHAIN_ID: env.BASE_CHAIN_ID,
    });
  }
  return new StubRewardDistributor();
}

function kycClient(env: ApiEnv): KycRegistryClient {
  if (env.BASE_RPC_URL && env.BASE_FEDERATION_KYC_ADDRESS && env.BASE_REWARD_PRIVATE_KEY) {
    return new RealKycRegistry({
      BASE_RPC_URL: env.BASE_RPC_URL,
      BASE_FEDERATION_KYC_ADDRESS: env.BASE_FEDERATION_KYC_ADDRESS,
      BASE_REWARD_PRIVATE_KEY: env.BASE_REWARD_PRIVATE_KEY,
      BASE_CHAIN_ID: env.BASE_CHAIN_ID,
    });
  }
  return new StubKycRegistry();
}

interface DistributeBody {
  round_id?: string;
  total_pool_wei?: string; // bigint as string
  recipients?: Array<{ tenant_id: string; recipient_address: string }>;
}

export const distributeRewardsHandler: Handler = async (rc) => {
  const auth = requireAuth(rc);
  if (auth.response) return auth.response;
  if (!auth.claims.roles.includes("admin")) {
    return Response.json({ ok: false, error: "admin_required" }, { status: 403 });
  }
  let body: DistributeBody;
  try { body = (await rc.request.json()) as DistributeBody; } catch { return Response.json({ ok: false, error: "invalid_body" }, { status: 400 }); }
  if (!body.round_id || !body.total_pool_wei || !Array.isArray(body.recipients) || body.recipients.length === 0) {
    return Response.json({ ok: false, error: "missing_required" }, { status: 400 });
  }
  let pool: bigint;
  try { pool = BigInt(body.total_pool_wei); } catch { return Response.json({ ok: false, error: "invalid_total_pool_wei" }, { status: 400 }); }
  if (pool <= 0n) return Response.json({ ok: false, error: "invalid_total_pool_wei" }, { status: 400 });

  const store = new FederationStore(rc.env.DB);
  const round = await store.getRound(body.round_id);
  if (!round) return Response.json({ ok: false, error: "round_not_found" }, { status: 404 });
  if (round.status !== "distribute" && round.status !== "aggregate") {
    return Response.json({ ok: false, error: "round_not_ready_for_distribution", status: round.status }, { status: 409 });
  }
  const scores = await store.listContributions(body.round_id);
  const scoreByTenant = new Map(scores.map((s) => [s.tenantId, s.score] as const));
  const contributions = body.recipients.map((r) => ({
    tenantId: r.tenant_id,
    recipientAddress: r.recipient_address,
    score: scoreByTenant.get(r.tenant_id) ?? 0,
  }));
  const allocations = computeRewards({ totalPoolWei: pool, contributions });

  // KYC gate: drop allocations whose recipient isn't on the whitelist.
  // The mirror lives in D1 (`kyc_whitelist`) for hot-path checks; the
  // on-chain gate in RewardDistributor.sol catches anything that slips
  // through (defence in depth).
  // Filter by jurisdiction AND active expiry — an entry whose
  // `expires_at` is in the past is treated as not whitelisted, matching
  // KYCRegistry.sol semantics. NULL expiry = never expires.
  const allowed = new Set<string>();
  const kycRows = await rc.env.DB.prepare(
    `SELECT recipient_address FROM kyc_whitelist
       WHERE jurisdiction = ?
         AND (expires_at IS NULL OR expires_at >= ?)`,
  ).bind(round.jurisdiction, Math.floor(Date.now() / 1000))
    .all<{ recipient_address: string }>();
  for (const row of kycRows.results ?? []) allowed.add(row.recipient_address.toLowerCase());

  const distributor = rewardsClient(rc.env);
  const results: Array<{ tenant_id: string; recipient_address: string; amount_wei: string; tx_hash: string | null; skipped: string | null }> = [];
  const now = Math.floor(Date.now() / 1000);
  for (const a of allocations) {
    if (a.amountWei === 0n) {
      results.push({ tenant_id: a.tenantId, recipient_address: a.recipientAddress, amount_wei: "0", tx_hash: null, skipped: "zero_allocation" });
      continue;
    }
    if (!allowed.has(a.recipientAddress.toLowerCase())) {
      results.push({ tenant_id: a.tenantId, recipient_address: a.recipientAddress, amount_wei: a.amountWei.toString(), tx_hash: null, skipped: "kyc_not_whitelisted" });
      continue;
    }
    try {
      const r = await distributor.distribute({ recipient: a.recipientAddress, amountWei: a.amountWei, roundId: round.id });
      await rc.env.DB.prepare(
        `INSERT INTO reward_distributions (
           id, round_id, tenant_id, recipient_address, wei_amount,
           contribution_score, status, chain_tx_hash, created_at, updated_at
         ) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      )
        .bind(
          `rd_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`,
          round.id,
          a.tenantId,
          a.recipientAddress.toLowerCase(),
          a.amountWei.toString(),
          a.score,
          r.onChain ? "broadcast" : "confirmed",
          r.txHash,
          now,
          now,
        )
        .run();
      results.push({ tenant_id: a.tenantId, recipient_address: a.recipientAddress, amount_wei: a.amountWei.toString(), tx_hash: r.txHash, skipped: null });
    } catch (err) {
      console.error("[gefi-api] reward distribute failed", err);
      results.push({ tenant_id: a.tenantId, recipient_address: a.recipientAddress, amount_wei: a.amountWei.toString(), tx_hash: null, skipped: "distribute_failed" });
    }
  }

  await rc.env.DB.prepare(
    `UPDATE federation_rounds SET status = 'closed', distributed_at = ?, closed_at = ?, updated_at = ? WHERE id = ?`,
  ).bind(now, now, now, round.id).run();

  return Response.json({ ok: true, round_id: round.id, distributions: results });
};

export const listContributionsHandler: Handler = async (rc) => {
  const auth = requireAuth(rc);
  if (auth.response) return auth.response;
  const tenantId = rc.params["tenant_id"];
  if (!tenantId) return Response.json({ ok: false, error: "tenant_id_required" }, { status: 400 });
  // Ownership: only the tenant itself or an admin can read.
  if (tenantId !== auth.claims.tenant_id && !auth.claims.roles.includes("admin")) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const store = new FederationStore(rc.env.DB);
  const scores = await store.listContributionsByTenant(tenantId);
  return Response.json({ ok: true, tenant_id: tenantId, contributions: scores });
};

interface KycAddBody {
  recipient_address?: string;
  tenant_id?: string;
  expires_at?: number | null;
}

export const addKycWhitelistHandler: Handler = async (rc) => {
  const auth = requireAuth(rc);
  if (auth.response) return auth.response;
  if (!auth.claims.roles.includes("admin")) {
    return Response.json({ ok: false, error: "admin_required" }, { status: 403 });
  }
  let body: KycAddBody;
  try { body = (await rc.request.json()) as KycAddBody; } catch { return Response.json({ ok: false, error: "invalid_body" }, { status: 400 }); }
  if (!body.recipient_address || !body.tenant_id) {
    return Response.json({ ok: false, error: "missing_required" }, { status: 400 });
  }
  if (!/^0x[0-9a-fA-F]{40}$/.test(body.recipient_address)) {
    return Response.json({ ok: false, error: "invalid_address" }, { status: 400 });
  }
  const kyc = kycClient(rc.env);
  const tx = await kyc.add(body.recipient_address, body.expires_at ?? null);
  const now = Math.floor(Date.now() / 1000);
  await rc.env.DB.prepare(
    `INSERT INTO kyc_whitelist (
       tenant_id, recipient_address, jurisdiction, expires_at,
       chain_tx_hash, added_by, created_at, updated_at
     ) VALUES (?,?,?,?,?,?,?,?)
     ON CONFLICT(tenant_id) DO UPDATE SET
       recipient_address = excluded.recipient_address,
       jurisdiction      = excluded.jurisdiction,
       expires_at        = excluded.expires_at,
       chain_tx_hash     = excluded.chain_tx_hash,
       added_by          = excluded.added_by,
       updated_at        = excluded.updated_at`,
  )
    .bind(
      body.tenant_id,
      body.recipient_address.toLowerCase(),
      auth.claims.jurisdiction,
      body.expires_at ?? null,
      tx.txHash,
      auth.claims.sub,
      now,
      now,
    )
    .run();
  return Response.json({ ok: true, tx_hash: tx.txHash, on_chain: tx.onChain }, { status: 201 });
};
