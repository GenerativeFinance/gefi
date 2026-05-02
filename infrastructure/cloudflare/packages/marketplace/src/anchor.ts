/**
 * Polygon anchor for model-version artifact hashes.
 *
 * `RealModelAnchor` actually signs and broadcasts a Polygon legacy tx
 * (see `chain-tx.ts`) when the operator has supplied an RPC URL +
 * anchor address + private key. The tx's calldata carries the 32-byte
 * artifact sha-256, so a third-party verifier can re-derive the on-chain
 * commitment from the marketplace `model_versions.chain_tx_hash` row.
 *
 * If the broadcast fails (RPC unreachable, signer misconfigured, etc.)
 * we fall back to a deterministic synthetic txHash with `onChain: false`
 * so the publish flow doesn't block on a chain hiccup. Operators can
 * detect un-anchored versions by querying for `chain_tx_hash LIKE
 * '0xpending%'` and re-anchor via the off-Worker reconciliation script.
 *
 * `StubModelAnchor` is the dev/test fallback — same synthetic shape,
 * never touches the network.
 */

import type { AnchorSecrets } from "@gefi/shared-types";
import { submitAnchorTx } from "./chain-tx.js";

export interface ModelAnchorInput {
  modelId: string;
  versionId: string;
  artifactSha256: string;
  ts: number;
}

export interface ModelAnchorResult {
  txHash: string;
  block: number | null;
  /** True iff the call hit Polygon and produced a broadcast tx hash. */
  onChain: boolean;
}

export interface ModelAnchor {
  anchor(input: ModelAnchorInput): Promise<ModelAnchorResult>;
}

export class StubModelAnchor implements ModelAnchor {
  async anchor(input: ModelAnchorInput): Promise<ModelAnchorResult> {
    return {
      txHash: `0xstub${input.artifactSha256.slice(0, 60)}`,
      block: null,
      onChain: false,
    };
  }
}

export interface RealModelAnchorOptions {
  /** Polygon chainId. Defaults to mainnet (137). */
  chainId?: number;
  /** Optional fetch override for tests. */
  fetchImpl?: typeof fetch;
  /** Optional logger for broadcast failures. Defaults to console.warn. */
  onBroadcastError?: (err: unknown) => void;
}

export class RealModelAnchor implements ModelAnchor {
  public readonly rpcUrl: string;
  public readonly address: string;
  /** Held in memory only; never logged or returned in any response. */
  private readonly privateKey: string;
  private readonly chainId: number;
  private readonly fetchImpl: typeof fetch;
  private readonly onBroadcastError: (err: unknown) => void;

  constructor(
    secrets: Required<
      Pick<AnchorSecrets, "POLYGON_RPC_URL" | "POLYGON_ANCHOR_ADDRESS" | "POLYGON_ANCHOR_PRIVATE_KEY">
    > & { POLYGON_CHAIN_ID?: string | number },
    opts: RealModelAnchorOptions = {},
  ) {
    this.rpcUrl = secrets.POLYGON_RPC_URL;
    this.address = secrets.POLYGON_ANCHOR_ADDRESS;
    this.privateKey = secrets.POLYGON_ANCHOR_PRIVATE_KEY;
    this.chainId =
      opts.chainId ??
      (secrets.POLYGON_CHAIN_ID ? Number(secrets.POLYGON_CHAIN_ID) : 137);
    this.fetchImpl = opts.fetchImpl ?? fetch;
    this.onBroadcastError =
      opts.onBroadcastError ??
      ((err) => {
        // Never include the private key or raw payload in the log.
        console.warn("[gefi-marketplace] anchor broadcast failed:", String(err));
      });
  }

  async anchor(input: ModelAnchorInput): Promise<ModelAnchorResult> {
    try {
      const result = await submitAnchorTx({
        rpcUrl: this.rpcUrl,
        privateKey: this.privateKey,
        toAddress: this.address,
        artifactSha256: input.artifactSha256,
        chainId: this.chainId,
        fetchImpl: this.fetchImpl,
      });
      return { txHash: result.txHash, block: result.block, onChain: true };
    } catch (err) {
      // Don't fail the publish path on a chain hiccup. We persist a
      // pending synthetic hash; an off-Worker reconciler can pick this
      // up and replay against the same input later.
      this.onBroadcastError(err);
      return {
        txHash: `0xpending${input.artifactSha256.slice(0, 56)}`,
        block: null,
        onChain: false,
      };
    }
  }
}

export function resolveModelAnchor(
  secrets: AnchorSecrets,
  opts?: RealModelAnchorOptions,
): ModelAnchor {
  if (
    secrets.POLYGON_RPC_URL &&
    secrets.POLYGON_ANCHOR_ADDRESS &&
    secrets.POLYGON_ANCHOR_PRIVATE_KEY
  ) {
    return new RealModelAnchor(
      {
        POLYGON_RPC_URL: secrets.POLYGON_RPC_URL,
        POLYGON_ANCHOR_ADDRESS: secrets.POLYGON_ANCHOR_ADDRESS,
        POLYGON_ANCHOR_PRIVATE_KEY: secrets.POLYGON_ANCHOR_PRIVATE_KEY,
      },
      opts,
    );
  }
  return new StubModelAnchor();
}
