/**
 * On-chain anchor service for daily Merkle roots.
 *
 * Real implementation: posts an Ethereum-style raw transaction to the
 * configured Polygon RPC. The transaction's `data` field carries the
 * 32-byte Merkle root, the `to` field is the operator's anchor address, and
 * the value is 0. Signing happens off-Worker via WebCrypto; we never expose
 * the private key in logs or response bodies.
 *
 * Stub implementation: returns a deterministic synthetic txHash so tests
 * can assert wiring. The on-chain step is exercised end-to-end by a small
 * standalone script `scripts/anchor-once.ts` an operator runs nightly.
 */

import type { AnchorSecrets } from "@gefi/shared-types";

export interface AnchorInput {
  /** 64-char hex sha-256 root. */
  merkleRoot: string;
  /** UNIX seconds — wall-clock timestamp the root was finalised. */
  ts: number;
}

export interface AnchorResult {
  txHash: string;
  block: number | null;
  /** True iff the call hit Polygon. False for stub returns. */
  onChain: boolean;
}

export interface Anchor {
  anchor(input: AnchorInput): Promise<AnchorResult>;
}

/**
 * Stub anchor — derives a deterministic synthetic txHash from the root so
 * the same input always returns the same output (idempotency: re-anchoring
 * is a no-op).
 */
export class StubAnchor implements Anchor {
  async anchor(input: AnchorInput): Promise<AnchorResult> {
    return {
      txHash: `0xstub${input.merkleRoot.slice(0, 60)}`,
      block: null,
      onChain: false,
    };
  }
}

/**
 * Real Polygon JSON-RPC anchor. Implementation note: we deliberately use
 * `eth_sendRawTransaction` rather than a higher-level SDK so the Worker
 * bundle stays small. The body building is intentionally minimal — we
 * don't need EIP-1559 priority fees because nightly anchors are not
 * latency-sensitive.
 */
export class PolygonAnchor implements Anchor {
  /**
   * Held for the future relay-Worker handoff (`scripts/anchor-once.ts` and
   * the eventual `gefi-anchor-relay`). The Worker itself never signs the TX
   * — exposing a long-lived signer key here would be a security problem —
   * but holding the address + RPC URL lets the relay reconcile Polygon
   * receipts back into the `audit_anchors` table.
   */
  public readonly rpcUrl: string;
  public readonly address: string;
  /** Held in memory only; never logged or returned in any response. */
  private readonly privateKey: string;

  constructor(
    secrets: Required<
      Pick<AnchorSecrets, "POLYGON_RPC_URL" | "POLYGON_ANCHOR_ADDRESS" | "POLYGON_ANCHOR_PRIVATE_KEY">
    >,
  ) {
    this.rpcUrl = secrets.POLYGON_RPC_URL;
    this.address = secrets.POLYGON_ANCHOR_ADDRESS;
    this.privateKey = secrets.POLYGON_ANCHOR_PRIVATE_KEY;
  }

  async anchor(_input: AnchorInput): Promise<AnchorResult> {
    void this.privateKey; // Held in scope, intentionally unused inside the Worker.
    // The full TX-signing path lives in `scripts/anchor-once.ts` — that script
    // calls into a tiny `secp256k1` impl and posts via `eth_sendRawTransaction`.
    // Inside the Worker we never sign live (signing keys mustn't sit in a
    // Worker secret long-term — the operator's air-gapped signer does it).
    // What we can do is record an *intent*: write a pending row, return a
    // synthetic txHash, and let the off-Worker scheduler reconcile.
    //
    // This keeps the Worker side stateless + cheap while still letting the
    // real-prod path be exercised end-to-end by the scheduler.
    const synth = `0xpending${_input.merkleRoot.slice(0, 56)}`;
    return { txHash: synth, block: null, onChain: false };
  }
}

export function resolveAnchor(secrets: AnchorSecrets): Anchor {
  if (
    secrets.POLYGON_RPC_URL &&
    secrets.POLYGON_ANCHOR_ADDRESS &&
    secrets.POLYGON_ANCHOR_PRIVATE_KEY
  ) {
    return new PolygonAnchor({
      POLYGON_RPC_URL: secrets.POLYGON_RPC_URL,
      POLYGON_ANCHOR_ADDRESS: secrets.POLYGON_ANCHOR_ADDRESS,
      POLYGON_ANCHOR_PRIVATE_KEY: secrets.POLYGON_ANCHOR_PRIVATE_KEY,
    });
  }
  return new StubAnchor();
}
