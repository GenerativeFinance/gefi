/**
 * Minimal ABI calldata encoder for the four federation contracts.
 *
 * We deliberately don't pull in ethers / viem (200KB+ each) — the
 * function signatures we ship are short and well-known, so a 100-line
 * encoder covers the whole surface. Encoding rules implemented:
 *
 *   - 4-byte selector = first 4 bytes of keccak256(signature)
 *   - `address`       = 32 bytes left-padded
 *   - `uint256`       = 32 bytes big-endian
 *   - `bytes32`       = 32 bytes (already 32, no padding)
 *   - `string`/`bytes`= dynamic — head holds the offset, tail holds
 *                       (length, padded data).
 *
 * Tuples + arrays of dynamic types aren't supported because none of our
 * contract methods take them. If we add `distributeBatch` we'll need to
 * extend this.
 */

import { keccak_256 } from "@noble/hashes/sha3";

export type AbiArg =
  | { type: "address"; value: string }
  | { type: "uint256"; value: bigint }
  | { type: "bytes32"; value: string /* 0x-prefixed 64 hex */ }
  | { type: "string"; value: string }
  | { type: "bytes"; value: Uint8Array };

function hexToBytes(hex: string): Uint8Array {
  const h = (hex.startsWith("0x") ? hex.slice(2) : hex).toLowerCase();
  if (!/^[0-9a-f]*$/.test(h)) throw new Error("invalid_hex_input");
  const padded = h.length % 2 ? "0" + h : h;
  const out = new Uint8Array(padded.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(padded.substr(i * 2, 2), 16);
  return out;
}

export function bytesToHex(b: Uint8Array): string {
  let s = "";
  for (let i = 0; i < b.length; i++) s += b[i]!.toString(16).padStart(2, "0");
  return s;
}

function pad32(b: Uint8Array): Uint8Array {
  if (b.length > 32) throw new Error("value_overflow_32");
  const out = new Uint8Array(32);
  out.set(b, 32 - b.length);
  return out;
}

function uint256ToBytes(n: bigint): Uint8Array {
  if (n < 0n) throw new Error("uint256_negative");
  const out = new Uint8Array(32);
  let v = n;
  for (let i = 31; i >= 0 && v > 0n; i--) {
    out[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return out;
}

function isDynamic(arg: AbiArg): boolean {
  return arg.type === "string" || arg.type === "bytes";
}

function encodeStatic(arg: AbiArg): Uint8Array {
  switch (arg.type) {
    case "address": {
      const b = hexToBytes(arg.value);
      if (b.length !== 20) throw new Error("address_must_be_20_bytes");
      return pad32(b);
    }
    case "uint256":
      return uint256ToBytes(arg.value);
    case "bytes32": {
      const b = hexToBytes(arg.value);
      if (b.length !== 32) throw new Error("bytes32_must_be_32_bytes");
      return b;
    }
    default:
      throw new Error(`encodeStatic called with dynamic type ${arg.type}`);
  }
}

function encodeDynamicTail(arg: AbiArg): Uint8Array {
  if (arg.type === "string") {
    const data = new TextEncoder().encode(arg.value);
    return concatPadded(uint256ToBytes(BigInt(data.length)), data);
  }
  if (arg.type === "bytes") {
    return concatPadded(uint256ToBytes(BigInt(arg.value.length)), arg.value);
  }
  throw new Error("encodeDynamicTail called on static");
}

function concatPadded(...parts: Uint8Array[]): Uint8Array {
  let total = 0;
  for (const p of parts) total += p.length;
  // round up to 32-byte boundary on the data segment only — the length
  // prefix is already 32 bytes wide.
  const padding = (32 - (total % 32)) % 32;
  const out = new Uint8Array(total + padding);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

function concat(arrs: Uint8Array[]): Uint8Array {
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

/** Compute the 4-byte selector for a Solidity function signature. */
export function selectorFor(signature: string): Uint8Array {
  const h = keccak_256(new TextEncoder().encode(signature));
  return h.slice(0, 4);
}

/**
 * Encode the calldata for `signature(args...)`. Returns the 4-byte
 * selector concatenated with ABI-encoded arguments. Caller passes the
 * resulting bytes as the legacy-tx `data` field.
 */
export function encodeCall(signature: string, args: AbiArg[]): Uint8Array {
  const head: Uint8Array[] = [];
  const tail: Uint8Array[] = [];
  let dynOffset = args.length * 32;
  for (const arg of args) {
    if (isDynamic(arg)) {
      head.push(uint256ToBytes(BigInt(dynOffset)));
      const t = encodeDynamicTail(arg);
      tail.push(t);
      dynOffset += t.length;
    } else {
      head.push(encodeStatic(arg));
    }
  }
  return concat([selectorFor(signature), ...head, ...tail]);
}

/** Right-pad a string to bytes32 — convenience for short id slots. */
export function stringToBytes32(s: string): string {
  const b = new TextEncoder().encode(s);
  if (b.length > 32) throw new Error("string_too_long_for_bytes32");
  const out = new Uint8Array(32);
  out.set(b, 0);
  return "0x" + bytesToHex(out);
}
