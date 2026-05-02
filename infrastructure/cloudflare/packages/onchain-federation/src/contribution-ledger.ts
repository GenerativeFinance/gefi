/**
 * Client for `ContributionLedger.sol`.
 *
 * On-chain surface:
 *
 *   function commitRound(
 *     bytes32 roundId,
 *     bytes32 modelId,
 *     bytes32 aggregateSha256,
 *     bytes32[] calldata participants,
 *     int256[] calldata scores
 *   ) external
 *
 * (We unroll the dynamic arrays into a single keccak256 commitment so
 * we can use the simpler bytes32 + bytes32 ABI here. The full Merkle
 * scheme lives in the orchestrator: the contract just records the
 * commitment that the off-chain auditor walks.)
 *
 * Effective signature shipped:
 *   commit(bytes32 roundId, bytes32 modelId, bytes32 aggregateSha256, bytes32 contributionsRoot)
 */

import type { BaseChainSecrets } from "@gefi/shared-types";
import { encodeCall, stringToBytes32 } from "./encoding.js";
import { broadcastBaseTx } from "./model-registry.js";

export interface CommitRoundInput {
  roundId: string;
  modelId: string;
  /** sha256 of the canonical aggregate, hex (no 0x). */
  aggregateSha256: string;
  /** sha256 of the canonical contributions table, hex (no 0x). */
  contributionsRoot: string;
}

export interface ContributionLedgerResult {
  txHash: string;
  onChain: boolean;
}

export interface ContributionLedgerClient {
  commit(input: CommitRoundInput): Promise<ContributionLedgerResult>;
}

export class StubContributionLedger implements ContributionLedgerClient {
  async commit(input: CommitRoundInput): Promise<ContributionLedgerResult> {
    return {
      txHash: `0xstubcommit${input.aggregateSha256.slice(0, 50)}`,
      onChain: false,
    };
  }
}

export class RealContributionLedger implements ContributionLedgerClient {
  public readonly rpcUrl: string;
  public readonly contractAddress: string;
  private readonly privateKey: string;
  private readonly chainId: number;
  private readonly fetchImpl: typeof fetch;

  constructor(
    secrets: Required<Pick<BaseChainSecrets, "BASE_RPC_URL" | "BASE_FEDERATION_LEDGER_ADDRESS" | "BASE_REWARD_PRIVATE_KEY">> & { BASE_CHAIN_ID?: string },
    opts: { fetchImpl?: typeof fetch } = {},
  ) {
    this.rpcUrl = secrets.BASE_RPC_URL;
    this.contractAddress = secrets.BASE_FEDERATION_LEDGER_ADDRESS;
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

  async commit(input: CommitRoundInput): Promise<ContributionLedgerResult> {
    const data = encodeCall("commit(bytes32,bytes32,bytes32,bytes32)", [
      { type: "bytes32", value: stringToBytes32(input.roundId) },
      { type: "bytes32", value: stringToBytes32(input.modelId) },
      { type: "bytes32", value: "0x" + input.aggregateSha256 },
      { type: "bytes32", value: "0x" + input.contributionsRoot },
    ]);
    const txHash = await broadcastBaseTx(this, data);
    return { txHash, onChain: true };
  }
}
