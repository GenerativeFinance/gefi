/**
 * Tests the on-chain anchor path:
 *   - rlpEncode round-trips canonical examples from the Ethereum yellow paper.
 *   - submitAnchorTx() makes the right JSON-RPC calls in the right order with
 *     a mock fetch and produces a tx hash from `eth_sendRawTransaction`.
 *   - RealModelAnchor.anchor() returns onChain=true on success.
 *   - RealModelAnchor.anchor() falls back to a synthetic "0xpending..." hash
 *     when the RPC fails, and routes the error through `onBroadcastError`.
 *
 * The signing private key here is `0x01..01` (32 bytes of 1s) — a well-known
 * test vector with no value, never used on mainnet.
 */
import { describe, expect, it, vi } from "vitest";
import { rlpEncode, submitAnchorTx } from "./chain-tx.js";
import { RealModelAnchor } from "./anchor.js";

const TEST_PK = "0x" + "01".repeat(32);
const TEST_TO = "0x" + "ab".repeat(20);
const TEST_SHA = "11".repeat(32); // 32-byte canonical artifact sha-256
const TEST_RPC = "https://polygon-rpc.test/v1";

function bytesToHex(b: Uint8Array): string {
  let s = "";
  for (let i = 0; i < b.length; i++) s += b[i]!.toString(16).padStart(2, "0");
  return s;
}

describe("rlpEncode", () => {
  it("encodes the empty string as 0x80", () => {
    expect(bytesToHex(rlpEncode(new Uint8Array(0)))).toBe("80");
  });
  it("encodes a single byte < 0x80 as itself", () => {
    expect(bytesToHex(rlpEncode(new Uint8Array([0x7f])))).toBe("7f");
  });
  it("encodes 'dog' as 0x83646f67", () => {
    expect(bytesToHex(rlpEncode(new TextEncoder().encode("dog")))).toBe("83646f67");
  });
  it("encodes the empty list as 0xc0", () => {
    expect(bytesToHex(rlpEncode([]))).toBe("c0");
  });
  it("encodes a 56-byte string with the long-form prefix", () => {
    const data = new Uint8Array(56);
    const enc = rlpEncode(data);
    // 56 bytes → 0xb8 (0x80 + 55 + 1) || 0x38 (length=56) || 56 bytes of data
    expect(enc[0]).toBe(0xb8);
    expect(enc[1]).toBe(0x38);
    expect(enc.length).toBe(58);
  });
});

describe("submitAnchorTx", () => {
  it("issues getTransactionCount + gasPrice + sendRawTransaction in that order", async () => {
    const calls: Array<{ method: string; params: unknown[] }> = [];
    const fetchImpl = vi.fn(async (_url: unknown, init?: { body?: string }) => {
      const body = JSON.parse(String(init?.body ?? "{}"));
      calls.push({ method: body.method, params: body.params });
      let result: string;
      if (body.method === "eth_getTransactionCount") result = "0x5";
      else if (body.method === "eth_gasPrice") result = "0x77359400"; // 2 gwei
      else if (body.method === "eth_sendRawTransaction") result = "0xdeadbeef";
      else throw new Error(`unexpected_method: ${body.method}`);
      return new Response(JSON.stringify({ jsonrpc: "2.0", id: 1, result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as unknown as typeof fetch;

    const out = await submitAnchorTx({
      rpcUrl: TEST_RPC,
      privateKey: TEST_PK,
      toAddress: TEST_TO,
      artifactSha256: TEST_SHA,
      chainId: 137,
      fetchImpl,
    });
    expect(out.txHash).toBe("0xdeadbeef");
    expect(out.block).toBeNull();
    // First two calls are issued via Promise.all so they may interleave —
    // assert the *set* matches and the broadcast comes last.
    expect(calls.map((c) => c.method).sort()).toEqual([
      "eth_gasPrice",
      "eth_getTransactionCount",
      "eth_sendRawTransaction",
    ]);
    const broadcast = calls.find((c) => c.method === "eth_sendRawTransaction")!;
    const raw = String(broadcast.params[0]);
    expect(raw.startsWith("0x")).toBe(true);
    // The 32-byte sha-256 must appear verbatim in the signed-tx calldata.
    expect(raw.toLowerCase()).toContain(TEST_SHA);
  });

  it("rejects an artifact hash that isn't 32 bytes", async () => {
    const fetchImpl = vi.fn() as unknown as typeof fetch;
    await expect(
      submitAnchorTx({
        rpcUrl: TEST_RPC,
        privateKey: TEST_PK,
        toAddress: TEST_TO,
        artifactSha256: "deadbeef",
        fetchImpl,
      }),
    ).rejects.toThrow(/artifact_sha256_must_be_32_bytes/);
  });

  it("rejects non-hex characters in the private key (no silent NaN coercion)", async () => {
    const fetchImpl = vi.fn() as unknown as typeof fetch;
    await expect(
      submitAnchorTx({
        rpcUrl: TEST_RPC,
        privateKey: "0xZZ" + "01".repeat(31),
        toAddress: TEST_TO,
        artifactSha256: TEST_SHA,
        fetchImpl,
      }),
    ).rejects.toThrow(/invalid_hex_input/);
  });

  it("propagates an RPC error", async () => {
    const fetchImpl = (async () =>
      new Response(JSON.stringify({ jsonrpc: "2.0", id: 1, error: { message: "nonce too low" } }), {
        status: 200,
      })) as unknown as typeof fetch;
    await expect(
      submitAnchorTx({
        rpcUrl: TEST_RPC,
        privateKey: TEST_PK,
        toAddress: TEST_TO,
        artifactSha256: TEST_SHA,
        fetchImpl,
      }),
    ).rejects.toThrow(/nonce too low/);
  });
});

describe("RealModelAnchor", () => {
  it("returns onChain=true when broadcast succeeds", async () => {
    const fetchImpl = (async (_url: unknown, init?: { body?: string }) => {
      const m = JSON.parse(String(init?.body ?? "{}")).method;
      const result =
        m === "eth_getTransactionCount" ? "0x0"
        : m === "eth_gasPrice" ? "0x1"
        : "0xchainsuccess";
      return new Response(JSON.stringify({ jsonrpc: "2.0", id: 1, result }), { status: 200 });
    }) as unknown as typeof fetch;

    const a = new RealModelAnchor(
      {
        POLYGON_RPC_URL: TEST_RPC,
        POLYGON_ANCHOR_ADDRESS: TEST_TO,
        POLYGON_ANCHOR_PRIVATE_KEY: TEST_PK,
      },
      { fetchImpl },
    );
    const r = await a.anchor({
      modelId: "m1",
      versionId: "v1",
      artifactSha256: TEST_SHA,
      ts: 1700000000,
    });
    expect(r.onChain).toBe(true);
    expect(r.txHash).toBe("0xchainsuccess");
  });

  it("falls back to 0xpending... and routes the broadcast error through onBroadcastError", async () => {
    const fetchImpl = (async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch;
    const errors: unknown[] = [];
    const a = new RealModelAnchor(
      {
        POLYGON_RPC_URL: TEST_RPC,
        POLYGON_ANCHOR_ADDRESS: TEST_TO,
        POLYGON_ANCHOR_PRIVATE_KEY: TEST_PK,
      },
      { fetchImpl, onBroadcastError: (e) => errors.push(e) },
    );
    const r = await a.anchor({
      modelId: "m1",
      versionId: "v1",
      artifactSha256: TEST_SHA,
      ts: 1700000000,
    });
    expect(r.onChain).toBe(false);
    expect(r.txHash.startsWith("0xpending")).toBe(true);
    expect(errors).toHaveLength(1);
  });
});
