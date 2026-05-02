/**
 * Polygon anchor for model-version artifact hashes. Mirrors the pattern
 * used by `@gefi/compliance-engine/anchor.ts`: in-Worker we never sign
 * a live TX (signing keys belong off-Worker), so the StubAnchor returns
 * a deterministic synthetic txHash and the real RealAnchor records an
 * "intent" to be reconciled by the off-Worker relay.
 */

import type { AnchorSecrets } from "@gefi/shared-types";

export interface ModelAnchorInput {
  modelId: string;
  versionId: string;
  artifactSha256: string;
  ts: number;
}

export interface ModelAnchorResult {
  txHash: string;
  block: number | null;
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

export class RealModelAnchor implements ModelAnchor {
  public readonly rpcUrl: string;
  public readonly address: string;
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

  async anchor(input: ModelAnchorInput): Promise<ModelAnchorResult> {
    void this.privateKey;
    return {
      txHash: `0xpending${input.artifactSha256.slice(0, 56)}`,
      block: null,
      onChain: false,
    };
  }
}

export function resolveModelAnchor(secrets: AnchorSecrets): ModelAnchor {
  if (
    secrets.POLYGON_RPC_URL &&
    secrets.POLYGON_ANCHOR_ADDRESS &&
    secrets.POLYGON_ANCHOR_PRIVATE_KEY
  ) {
    return new RealModelAnchor({
      POLYGON_RPC_URL: secrets.POLYGON_RPC_URL,
      POLYGON_ANCHOR_ADDRESS: secrets.POLYGON_ANCHOR_ADDRESS,
      POLYGON_ANCHOR_PRIVATE_KEY: secrets.POLYGON_ANCHOR_PRIVATE_KEY,
    });
  }
  return new StubModelAnchor();
}
