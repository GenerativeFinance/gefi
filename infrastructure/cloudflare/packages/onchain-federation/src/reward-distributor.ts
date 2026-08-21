/**
 * Client for `RewardDistributor.sol`.
 *
 * On-chain surface:
 *
 *   function distribute(address recipient, uint256 amount, bytes32 roundId) external
 *
 * The contract checks `KYCRegistry.isAllowed(recipient)` before emitting
 * the transfer. The orchestrator double-checks in D1 (`kyc_whitelist`)
 * before issuing the call so a non-whitelisted recipient never wastes a
 * gas-paying RPC round-trip.
 *
 * Reward computation lives in this package (in `computeRewards`) so the
 * orchestrator can preview payouts before broadcasting. The pure
 * computation is unit-testable without any RPC.
 */

import type { BaseChainSecrets } from "@gefi/shared-types";
import { encodeCall, stringToBytes32 } from "./encoding.js";
import { broadcastBaseTx } from "./model-registry.js";

export interface DistributeInput {
  recipient: string;
  amountWei: bigint;
  roundId: string;
}

export interface DistributeResult {
  txHash: string;
  onChain: boolean;
}

export interface RewardDistributorClient {
  distribute(input: DistributeInput): Promise<DistributeResult>;
}

export class StubRewardDistributor implements RewardDistributorClient {
  /** Captures calls so tests can assert against them. */
  public readonly calls: DistributeInput[] = [];
  async distribute(input: DistributeInput): Promise<DistributeResult> {
    this.calls.push(input);
    const tag = input.recipient.slice(2, 10);
    return { txHash: `0xstubreward${tag}${input.roundId.slice(0, 28)}`, onChain: false };
  }
}

export class RealRewardDistributor implements RewardDistributorClient {
  public readonly rpcUrl: string;
  public readonly contractAddress: string;
  private readonly privateKey: string;
  private readonly chainId: number;
  private readonly fetchImpl: typeof fetch;

  constructor(
    secrets: Required<Pick<BaseChainSecrets, "BASE_RPC_URL" | "BASE_FEDERATION_REWARDS_ADDRESS" | "BASE_REWARD_PRIVATE_KEY">> & { BASE_CHAIN_ID?: string },
    opts: { fetchImpl?: typeof fetch } = {},
  ) {
    this.rpcUrl = secrets.BASE_RPC_URL;
    this.contractAddress = secrets.BASE_FEDERATION_REWARDS_ADDRESS;
    this.privateKey = secrets.BASE_REWARD_PRIVATE_KEY;
    this.chainId = secrets.BASE_CHAIN_ID ? Number(secrets.BASE_CHAIN_ID) : 8453;
    this.fetchImpl = opts.fetchImpl ?? fetch;
  }

  get _internals() {
    return {
      rpcUrl: this.rpcUrl,
      contractAddress: this.contractAddress,
      privateKey: this.privateKey,
      chainId: this.chainId,
      fetchImpl: this.fetchImpl,
    };
  }

  async distribute(input: DistributeInput): Promise<DistributeResult> {
    const data = encodeCall("distribute(address,uint256,bytes32)", [
      { type: "address", value: input.recipient },
      { type: "uint256", value: input.amountWei },
      { type: "bytes32", value: stringToBytes32(input.roundId) },
    ]);
    const txHash = await broadcastBaseTx(this, data);
    return { txHash, onChain: true };
  }
}

export interface RewardComputationInput {
  /** Total reward pool in wei. */
  totalPoolWei: bigint;
  /** Per-tenant Shapley contribution. Tenants with score <= 0 earn nothing. */
  contributions: Array<{ tenantId: string; recipientAddress: string; score: number }>;
  /** Minimum score floor — anyone below `minScore` earns 0. */
  minScore?: number;
}

export interface RewardAllocation {
  tenantId: string;
  recipientAddress: string;
  amountWei: bigint;
  score: number;
}

/**
 * Pure reward-distribution computation.
 *
 *   reward_i = (clamp(score_i, 0, ∞) / Σ clamp(score_j, 0, ∞)) * totalPool
 *
 * Negative scores (degrading the model) are clamped to 0. Implementations
 * with a minimum-floor slash slot in via `minScore`.
 */
export function computeRewards(input: RewardComputationInput): RewardAllocation[] {
  const minScore = input.minScore ?? 0;
  const positive = input.contributions.map((c) => ({ ...c, weight: c.score >= minScore ? Math.max(0, c.score) : 0 }));
  const total = positive.reduce((s, c) => s + c.weight, 0);
  if (total === 0) {
    // No one earned anything — return zero allocations so callers can
    // record the round as distributed-but-empty without special-casing.
    return input.contributions.map((c) => ({
      tenantId: c.tenantId,
      recipientAddress: c.recipientAddress,
      amountWei: 0n,
      score: c.score,
    }));
  }
  // Compute floats first, then convert to wei using bigint math at the
  // very last step so we don't accumulate float rounding error across
  // a 1000-participant round.
  const out: RewardAllocation[] = [];
  let distributed = 0n;
  for (let i = 0; i < positive.length; i++) {
    const c = positive[i]!;
    const share = c.weight / total;
    const wei = (input.totalPoolWei * BigInt(Math.floor(share * 1e12))) / 1_000_000_000_000n;
    out.push({
      tenantId: c.tenantId,
      recipientAddress: c.recipientAddress,
      amountWei: wei,
      score: c.score,
    });
    distributed += wei;
  }
  // Pour the rounding remainder into the largest allocation so Σ allocations
  // equals totalPoolWei exactly. Without this, repeated rounds would leak
  // wei into the contract balance over time.
  const remainder = input.totalPoolWei - distributed;
  if (remainder !== 0n && out.length > 0) {
    let largestIdx = 0;
    for (let i = 1; i < out.length; i++) {
      if (out[i]!.amountWei > out[largestIdx]!.amountWei) largestIdx = i;
    }
    out[largestIdx]!.amountWei += remainder;
  }
  return out;
}
