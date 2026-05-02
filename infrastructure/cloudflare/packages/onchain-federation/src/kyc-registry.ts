/**
 * Client for `KYCRegistry.sol`.
 *
 * On-chain surface:
 *
 *   function add(address recipient, uint64 expiresAt) external
 *   function remove(address recipient) external
 *   function isAllowed(address recipient) external view returns (bool)
 *
 * The orchestrator mirrors writes into D1 (`kyc_whitelist`) so the
 * read-side `isAllowed` check happens locally in the worker without
 * paying an RPC round-trip per reward distribution.
 */

import type { BaseChainSecrets } from "@gefi/shared-types";
import { encodeCall } from "./encoding.js";
import { broadcastBaseTx } from "./model-registry.js";

export interface KycRegistryClient {
  add(recipient: string, expiresAt: number | null): Promise<{ txHash: string; onChain: boolean }>;
  remove(recipient: string): Promise<{ txHash: string; onChain: boolean }>;
  isAllowed(recipient: string): Promise<boolean>;
}

export class StubKycRegistry implements KycRegistryClient {
  public readonly added = new Set<string>();
  public readonly expiries = new Map<string, number | null>();
  async add(recipient: string, expiresAt: number | null = null): Promise<{ txHash: string; onChain: boolean }> {
    this.added.add(recipient.toLowerCase());
    this.expiries.set(recipient.toLowerCase(), expiresAt);
    return { txHash: `0xstubkyc${recipient.slice(2, 22)}`, onChain: false };
  }
  async remove(recipient: string): Promise<{ txHash: string; onChain: boolean }> {
    this.added.delete(recipient.toLowerCase());
    return { txHash: `0xstubkycrm${recipient.slice(2, 22)}`, onChain: false };
  }
  async isAllowed(recipient: string): Promise<boolean> {
    return this.added.has(recipient.toLowerCase());
  }
}

export class RealKycRegistry implements KycRegistryClient {
  public readonly rpcUrl: string;
  public readonly contractAddress: string;
  private readonly privateKey: string;
  private readonly chainId: number;
  private readonly fetchImpl: typeof fetch;

  constructor(
    secrets: Required<Pick<BaseChainSecrets, "BASE_RPC_URL" | "BASE_FEDERATION_KYC_ADDRESS" | "BASE_REWARD_PRIVATE_KEY">> & { BASE_CHAIN_ID?: string },
    opts: { fetchImpl?: typeof fetch } = {},
  ) {
    this.rpcUrl = secrets.BASE_RPC_URL;
    this.contractAddress = secrets.BASE_FEDERATION_KYC_ADDRESS;
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

  async add(recipient: string, expiresAt: number | null): Promise<{ txHash: string; onChain: boolean }> {
    const data = encodeCall("add(address,uint64)", [
      { type: "address", value: recipient },
      { type: "uint256", value: BigInt(expiresAt ?? 0) },
    ]);
    const txHash = await broadcastBaseTx(this, data);
    return { txHash, onChain: true };
  }

  async remove(recipient: string): Promise<{ txHash: string; onChain: boolean }> {
    const data = encodeCall("remove(address)", [{ type: "address", value: recipient }]);
    const txHash = await broadcastBaseTx(this, data);
    return { txHash, onChain: true };
  }

  /**
   * Read-only check via `eth_call`. Doesn't broadcast a tx so it's safe
   * to call from the rewards path on every distribute. We use the
   * stub-aware D1 mirror for hot-path checks; this method exists so the
   * orchestrator can reconcile the on-chain state on a schedule.
   */
  async isAllowed(recipient: string): Promise<boolean> {
    const data = encodeCall("isAllowed(address)", [{ type: "address", value: recipient }]);
    const callObj = {
      to: this.contractAddress,
      data: "0x" + Array.from(data).map((b) => b.toString(16).padStart(2, "0")).join(""),
    };
    const res = await this.fetchImpl(this.rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [callObj, "latest"] }),
    });
    if (!res.ok) throw new Error(`rpc_http_${res.status}`);
    const j = (await res.json()) as { result?: string; error?: { message?: string } };
    if (j.error) throw new Error(`rpc_error: ${j.error.message ?? "unknown"}`);
    return BigInt(j.result ?? "0x0") !== 0n;
  }
}
