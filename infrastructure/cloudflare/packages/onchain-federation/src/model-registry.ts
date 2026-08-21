/**
 * Client for `ModelRegistry.sol`.
 *
 * On-chain surface:
 *
 *   function register(bytes32 modelId, bytes32 versionId, bytes32 artifactSha) external
 *   function setCurrent(bytes32 modelId, bytes32 versionId) external
 *
 * Both methods are admin-only on the contract side (multi-sig modifier).
 * The orchestrator calls them from a server-side key, never from a user's
 * browser, so the multi-sig gating happens before this client is invoked.
 */

import type { BaseChainSecrets } from "@gefi/shared-types";
import { rlpEncode } from "@gefi/marketplace/chain-tx";
import { secp256k1 } from "@noble/curves/secp256k1";
import { keccak_256 } from "@noble/hashes/sha3";
import { encodeCall, stringToBytes32 } from "./encoding.js";

export interface ModelRegistryRegisterInput {
  modelId: string;
  versionId: string;
  artifactSha256: string; // 64-hex
}

export interface ModelRegistryResult {
  txHash: string;
  onChain: boolean;
}

export interface ModelRegistryClient {
  register(input: ModelRegistryRegisterInput): Promise<ModelRegistryResult>;
  setCurrent(modelId: string, versionId: string): Promise<ModelRegistryResult>;
}

export class StubModelRegistry implements ModelRegistryClient {
  async register(input: ModelRegistryRegisterInput): Promise<ModelRegistryResult> {
    return { txHash: `0xstubreg${input.artifactSha256.slice(0, 56)}`, onChain: false };
  }
  async setCurrent(modelId: string, versionId: string): Promise<ModelRegistryResult> {
    return { txHash: `0xstubcur${modelId.slice(0, 28)}${versionId.slice(0, 28)}`, onChain: false };
  }
}

export interface RealClientOptions {
  fetchImpl?: typeof fetch;
  onError?: (err: unknown) => void;
}

/**
 * Real Base client. Reuses the legacy-tx + secp256k1 pattern from
 * `@gefi/marketplace/chain-tx` — we don't need EIP-1559 for v1 and the
 * legacy shape keeps the worker bundle small.
 */
export class RealModelRegistry implements ModelRegistryClient {
  public readonly rpcUrl: string;
  public readonly contractAddress: string;
  private readonly privateKey: string;
  private readonly chainId: number;
  private readonly fetchImpl: typeof fetch;

  constructor(
    secrets: Required<Pick<BaseChainSecrets, "BASE_RPC_URL" | "BASE_FEDERATION_REGISTRY_ADDRESS" | "BASE_REWARD_PRIVATE_KEY">> & { BASE_CHAIN_ID?: string },
    opts: RealClientOptions = {},
  ) {
    this.rpcUrl = secrets.BASE_RPC_URL;
    this.contractAddress = secrets.BASE_FEDERATION_REGISTRY_ADDRESS;
    this.privateKey = secrets.BASE_REWARD_PRIVATE_KEY;
    this.chainId = secrets.BASE_CHAIN_ID ? Number(secrets.BASE_CHAIN_ID) : 8453;
    this.fetchImpl = opts.fetchImpl ?? fetch;
  }

  async register(input: ModelRegistryRegisterInput): Promise<ModelRegistryResult> {
    const data = encodeCall("register(bytes32,bytes32,bytes32)", [
      { type: "bytes32", value: stringToBytes32(input.modelId) },
      { type: "bytes32", value: stringToBytes32(input.versionId) },
      { type: "bytes32", value: "0x" + input.artifactSha256 },
    ]);
    const txHash = await broadcastBaseTx(this, data);
    return { txHash, onChain: true };
  }

  async setCurrent(modelId: string, versionId: string): Promise<ModelRegistryResult> {
    const data = encodeCall("setCurrent(bytes32,bytes32)", [
      { type: "bytes32", value: stringToBytes32(modelId) },
      { type: "bytes32", value: stringToBytes32(versionId) },
    ]);
    const txHash = await broadcastBaseTx(this, data);
    return { txHash, onChain: true };
  }

  // exposed via internal helper so the other contract clients in this
  // package can share the same RPC + signing path without duplicating it.
  // (See `_baseClient` accessor used by the helper below.)
  /* istanbul ignore next */
  get _internals() {
    return {
      rpcUrl: this.rpcUrl,
      contractAddress: this.contractAddress,
      privateKey: this.privateKey,
      chainId: this.chainId,
      fetchImpl: this.fetchImpl,
    };
  }
}

// -----------------------------------------------------------------------
// Shared Base broadcast helper. Lives in this file so all four contract
// clients can call it without a circular import. Mirrors the
// `submitAnchorTx` pattern in `@gefi/marketplace/chain-tx`.
// -----------------------------------------------------------------------

interface BaseTxClient {
  rpcUrl: string;
  contractAddress: string;
  fetchImpl: typeof fetch;
  chainId: number;
  /** Hex private key. Held privately; never logged. */
  privateKey: string;
}

function hexToBytes(hex: string): Uint8Array {
  const h = (hex.startsWith("0x") ? hex.slice(2) : hex).toLowerCase();
  if (!/^[0-9a-f]*$/.test(h)) throw new Error("invalid_hex_input");
  const padded = h.length % 2 ? "0" + h : h;
  const out = new Uint8Array(padded.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(padded.substr(i * 2, 2), 16);
  return out;
}

function bytesToHex(b: Uint8Array): string {
  let s = "";
  for (let i = 0; i < b.length; i++) s += b[i]!.toString(16).padStart(2, "0");
  return s;
}

function bigintToBytes(n: bigint): Uint8Array {
  if (n === 0n) return new Uint8Array(0);
  const arr: number[] = [];
  let v = n;
  while (v > 0n) {
    arr.unshift(Number(v & 0xffn));
    v >>= 8n;
  }
  return new Uint8Array(arr);
}

async function rpcCall(client: BaseTxClient, method: string, params: unknown[]): Promise<unknown> {
  const res = await client.fetchImpl(client.rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`rpc_http_${res.status}`);
  const j = (await res.json()) as { result?: unknown; error?: { message?: string } };
  if (j.error) throw new Error(`rpc_error: ${j.error.message ?? "unknown"}`);
  return j.result;
}

export async function broadcastBaseTx(
  client: { _internals: BaseTxClient } | BaseTxClient,
  data: Uint8Array,
  value: bigint = 0n,
  gasLimit: bigint = 200_000n,
): Promise<string> {
  const c: BaseTxClient = "_internals" in client ? client._internals : client;
  const pkRaw = hexToBytes(c.privateKey);
  if (pkRaw.length !== 32) throw new Error("private_key_must_be_32_bytes");
  const to = hexToBytes(c.contractAddress);
  if (to.length !== 20) throw new Error("contract_address_must_be_20_bytes");
  const pubUncompressed = secp256k1.getPublicKey(pkRaw, false);
  const senderHash = keccak_256(pubUncompressed.slice(1));
  const sender = "0x" + bytesToHex(senderHash.slice(12));

  const [nonceHex, gasPriceHex] = (await Promise.all([
    rpcCall(c, "eth_getTransactionCount", [sender, "pending"]),
    rpcCall(c, "eth_gasPrice", []),
  ])) as [string, string];
  const nonce = BigInt(nonceHex);
  const gasPrice = BigInt(gasPriceHex);

  const fields: Uint8Array[] = [
    bigintToBytes(nonce),
    bigintToBytes(gasPrice),
    bigintToBytes(gasLimit),
    to,
    bigintToBytes(value),
    data,
  ];
  const unsigned = rlpEncode([...fields, bigintToBytes(BigInt(c.chainId)), bigintToBytes(0n), bigintToBytes(0n)]);
  const digest = keccak_256(unsigned);
  const sig = secp256k1.sign(digest, pkRaw);
  const v = BigInt(sig.recovery) + BigInt(c.chainId) * 2n + 35n;
  const signed = rlpEncode([...fields, bigintToBytes(v), bigintToBytes(sig.r), bigintToBytes(sig.s)]);
  const rawHex = "0x" + bytesToHex(signed);
  const txHash = (await rpcCall(c, "eth_sendRawTransaction", [rawHex])) as string;
  return txHash;
}
