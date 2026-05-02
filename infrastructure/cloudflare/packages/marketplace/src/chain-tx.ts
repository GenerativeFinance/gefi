/**
 * Minimal Polygon legacy-tx signer + JSON-RPC broadcaster. Lives in this
 * package so `RealModelAnchor` can submit a real on-chain commitment of a
 * model-version artifact hash without pulling a 200KB Ethereum SDK into
 * the Worker bundle.
 *
 * What we encode is the canonical EIP-155 legacy transaction:
 *
 *   RLP([nonce, gasPrice, gasLimit, to, value, data, chainId, 0, 0])
 *
 * keccak256 that, sign with secp256k1, and emit:
 *
 *   RLP([nonce, gasPrice, gasLimit, to, value, data, v, r, s])
 *
 * The `data` field carries the 32-byte artifact sha-256 so a verifier can
 * re-derive the on-chain commitment from the marketplace row.
 *
 * We deliberately avoid EIP-1559 — Polygon accepts legacy txs and it
 * keeps this implementation under 100 lines.
 */

import { secp256k1 } from "@noble/curves/secp256k1";
import { keccak_256 } from "@noble/hashes/sha3";

export interface SubmitAnchorTxInput {
  rpcUrl: string;
  /** Hex-encoded private key (0x-prefixed or bare). */
  privateKey: string;
  /** Operator's anchor address (0x-prefixed). Used as the tx `to`. */
  toAddress: string;
  /** 64-hex sha-256 of the artifact, becomes the tx `data` field. */
  artifactSha256: string;
  /** Polygon mainnet=137, mumbai=80001, amoy=80002. Defaults to 137. */
  chainId?: number;
  /** Defaults to 100000 — committing 32 bytes of calldata is cheap. */
  gasLimit?: bigint;
  /** Optional fetch override for tests. */
  fetchImpl?: typeof fetch;
}

export interface SubmitAnchorTxResult {
  txHash: string;
  /** Block number iff the receipt was already mined; null otherwise. */
  block: number | null;
}

function hexToBytes(hex: string): Uint8Array {
  const h = (hex.startsWith("0x") ? hex.slice(2) : hex).toLowerCase();
  // Reject non-hex characters explicitly. parseInt() silently coerces
  // garbage to NaN which then writes 0-bytes, masking misconfigured
  // private keys / addresses — exactly the failure mode we cannot
  // afford on the on-chain anchor path.
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

function concat(...arrs: Uint8Array[]): Uint8Array {
  let total = 0;
  for (const a of arrs) total += a.length;
  const out = new Uint8Array(total);
  let off = 0;
  for (const a of arrs) {
    out.set(a, off);
    off += a.length;
  }
  return out;
}

/** RLP length prefix per the yellow paper. `off` is 0x80 for strings, 0xc0 for lists. */
function rlpLengthPrefix(len: number, off: number): Uint8Array {
  if (len < 56) return new Uint8Array([off + len]);
  const lb = bigintToBytes(BigInt(len));
  return new Uint8Array([off + 55 + lb.length, ...lb]);
}

/**
 * RLP encode. Accepts either a Uint8Array (string item) or an array of
 * already-encodable children (list). We deliberately keep the input
 * shape narrow rather than supporting arbitrary nested numbers — tx
 * builders are expected to convert ints to canonical big-endian bytes
 * via `bigintToBytes` first.
 */
export function rlpEncode(input: Uint8Array | Array<Uint8Array | unknown[]>): Uint8Array {
  if (input instanceof Uint8Array) {
    if (input.length === 1 && input[0]! < 0x80) return input;
    return concat(rlpLengthPrefix(input.length, 0x80), input);
  }
  const items: Uint8Array[] = [];
  for (const child of input) {
    items.push(rlpEncode(child as Uint8Array | Array<Uint8Array | unknown[]>));
  }
  let total = 0;
  for (const i of items) total += i.length;
  return concat(rlpLengthPrefix(total, 0xc0), ...items);
}

async function rpcCall(
  url: string,
  method: string,
  params: unknown[],
  fetchImpl: typeof fetch,
): Promise<unknown> {
  const res = await fetchImpl(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`rpc_http_${res.status}`);
  const j = (await res.json()) as { result?: unknown; error?: { message?: string } };
  if (j.error) throw new Error(`rpc_error: ${j.error.message ?? "unknown"}`);
  return j.result;
}

/**
 * Build, sign, and broadcast a Polygon legacy tx that commits the
 * artifact sha-256 in calldata. Returns the on-chain tx hash. Throws
 * on RPC errors so the caller can decide to fall back to the stub
 * path or persist a pending intent.
 */
export async function submitAnchorTx(input: SubmitAnchorTxInput): Promise<SubmitAnchorTxResult> {
  const fetchImpl = input.fetchImpl ?? fetch;
  const chainId = input.chainId ?? 137;
  const gasLimit = input.gasLimit ?? 100_000n;
  const data = hexToBytes(input.artifactSha256);
  if (data.length !== 32) throw new Error("artifact_sha256_must_be_32_bytes");
  const to = hexToBytes(input.toAddress);
  if (to.length !== 20) throw new Error("to_address_must_be_20_bytes");
  const pkRaw = hexToBytes(input.privateKey);
  if (pkRaw.length !== 32) throw new Error("private_key_must_be_32_bytes");

  // Derive the sender from the private key so we ask the RPC for *that*
  // address's nonce (not the `to` operator address — those can differ).
  const pubUncompressed = secp256k1.getPublicKey(pkRaw, false); // 65 bytes, leading 0x04
  const senderHash = keccak_256(pubUncompressed.slice(1));
  const sender = "0x" + bytesToHex(senderHash.slice(12));

  const [nonceHex, gasPriceHex] = (await Promise.all([
    rpcCall(input.rpcUrl, "eth_getTransactionCount", [sender, "pending"], fetchImpl),
    rpcCall(input.rpcUrl, "eth_gasPrice", [], fetchImpl),
  ])) as [string, string];
  const nonce = BigInt(nonceHex);
  const gasPrice = BigInt(gasPriceHex);

  const fields: Uint8Array[] = [
    bigintToBytes(nonce),
    bigintToBytes(gasPrice),
    bigintToBytes(gasLimit),
    to,
    bigintToBytes(0n), // value
    data,
  ];
  // EIP-155 unsigned digest: append (chainId, 0, 0) before keccak.
  const unsigned = rlpEncode([
    ...fields,
    bigintToBytes(BigInt(chainId)),
    bigintToBytes(0n),
    bigintToBytes(0n),
  ]);
  const digest = keccak_256(unsigned);
  const sig = secp256k1.sign(digest, pkRaw);
  // EIP-155 v = recovery + chainId * 2 + 35.
  const v = BigInt(sig.recovery) + BigInt(chainId) * 2n + 35n;
  const signed = rlpEncode([
    ...fields,
    bigintToBytes(v),
    bigintToBytes(sig.r),
    bigintToBytes(sig.s),
  ]);
  const rawHex = "0x" + bytesToHex(signed);
  const txHash = (await rpcCall(input.rpcUrl, "eth_sendRawTransaction", [rawHex], fetchImpl)) as string;
  return { txHash, block: null };
}
