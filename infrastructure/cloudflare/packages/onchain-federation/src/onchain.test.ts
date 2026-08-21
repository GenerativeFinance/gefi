import { describe, expect, it } from "vitest";
import { encodeCall, selectorFor, stringToBytes32, bytesToHex } from "./encoding.js";
import { StubModelRegistry } from "./model-registry.js";
import { StubContributionLedger } from "./contribution-ledger.js";
import { StubRewardDistributor, computeRewards } from "./reward-distributor.js";
import { StubKycRegistry } from "./kyc-registry.js";

describe("encoding", () => {
  it("selector matches well-known erc20 transfer signature", () => {
    // transfer(address,uint256) → 0xa9059cbb
    const s = selectorFor("transfer(address,uint256)");
    expect(bytesToHex(s)).toBe("a9059cbb");
  });

  it("encodeCall produces selector + 32-byte-aligned args", () => {
    const data = encodeCall("distribute(address,uint256,bytes32)", [
      { type: "address", value: "0x" + "12".repeat(20) },
      { type: "uint256", value: 1_000_000n },
      { type: "bytes32", value: "0x" + "ab".repeat(32) },
    ]);
    // 4 selector + 3 * 32 args
    expect(data.length).toBe(4 + 96);
  });

  it("rejects bad address length", () => {
    expect(() =>
      encodeCall("foo(address)", [{ type: "address", value: "0x1234" }]),
    ).toThrow("address_must_be_20_bytes");
  });

  it("stringToBytes32 right-pads correctly", () => {
    const s = stringToBytes32("hello");
    expect(s).toMatch(/^0x68656c6c6f0+$/);
    expect(s.length).toBe(2 + 64);
  });

  it("string args produce dynamic encoding", () => {
    const data = encodeCall("hello(string)", [{ type: "string", value: "hi" }]);
    // selector(4) + offset(32) + length(32) + padded data(32) = 100
    expect(data.length).toBe(100);
  });
});

describe("StubModelRegistry", () => {
  it("returns synthetic txHash", async () => {
    const r = await new StubModelRegistry().register({ modelId: "m1", versionId: "v1", artifactSha256: "a".repeat(64) });
    expect(r.txHash).toMatch(/^0xstubreg/);
    expect(r.onChain).toBe(false);
  });

  it("setCurrent returns synthetic", async () => {
    const r = await new StubModelRegistry().setCurrent("m1", "v2");
    expect(r.onChain).toBe(false);
  });
});

describe("StubContributionLedger", () => {
  it("returns synthetic commit txHash", async () => {
    const r = await new StubContributionLedger().commit({
      roundId: "r1", modelId: "m1", aggregateSha256: "f".repeat(64), contributionsRoot: "e".repeat(64),
    });
    expect(r.txHash).toMatch(/^0xstubcommit/);
  });
});

describe("StubKycRegistry", () => {
  it("isAllowed reflects add/remove", async () => {
    const k = new StubKycRegistry();
    const addr = "0x" + "ab".repeat(20);
    expect(await k.isAllowed(addr)).toBe(false);
    await k.add(addr, null);
    expect(await k.isAllowed(addr)).toBe(true);
    await k.remove(addr);
    expect(await k.isAllowed(addr)).toBe(false);
  });

  it("address comparison is case-insensitive", async () => {
    const k = new StubKycRegistry();
    await k.add("0xABCDEF" + "00".repeat(17), null);
    expect(await k.isAllowed("0xabcdef" + "00".repeat(17))).toBe(true);
  });
});

describe("StubRewardDistributor", () => {
  it("captures distribute calls", async () => {
    const d = new StubRewardDistributor();
    await d.distribute({ recipient: "0x" + "11".repeat(20), amountWei: 5n, roundId: "r1" });
    await d.distribute({ recipient: "0x" + "22".repeat(20), amountWei: 7n, roundId: "r1" });
    expect(d.calls.length).toBe(2);
    expect(d.calls[0]!.amountWei).toBe(5n);
  });
});

describe("computeRewards", () => {
  it("splits proportionally to positive scores", () => {
    const r = computeRewards({
      totalPoolWei: 1_000_000n,
      contributions: [
        { tenantId: "a", recipientAddress: "0x" + "aa".repeat(20), score: 0.5 },
        { tenantId: "b", recipientAddress: "0x" + "bb".repeat(20), score: 0.5 },
      ],
    });
    expect(r.length).toBe(2);
    expect(r[0]!.amountWei + r[1]!.amountWei).toBe(1_000_000n);
    expect(r[0]!.amountWei).toBe(500_000n);
  });

  it("clamps negative scores to zero", () => {
    const r = computeRewards({
      totalPoolWei: 100n,
      contributions: [
        { tenantId: "a", recipientAddress: "0x" + "aa".repeat(20), score: 1.0 },
        { tenantId: "b", recipientAddress: "0x" + "bb".repeat(20), score: -0.5 },
      ],
    });
    expect(r[0]!.amountWei).toBe(100n);
    expect(r[1]!.amountWei).toBe(0n);
  });

  it("returns all zero allocations when total is zero", () => {
    const r = computeRewards({
      totalPoolWei: 1000n,
      contributions: [
        { tenantId: "a", recipientAddress: "0x" + "aa".repeat(20), score: -1 },
        { tenantId: "b", recipientAddress: "0x" + "bb".repeat(20), score: -2 },
      ],
    });
    expect(r.every((x) => x.amountWei === 0n)).toBe(true);
  });

  it("sum of allocations exactly equals pool (no rounding leak)", () => {
    const r = computeRewards({
      totalPoolWei: 10_000_000_000n,
      contributions: [
        { tenantId: "a", recipientAddress: "0x" + "11".repeat(20), score: 0.333 },
        { tenantId: "b", recipientAddress: "0x" + "22".repeat(20), score: 0.333 },
        { tenantId: "c", recipientAddress: "0x" + "33".repeat(20), score: 0.334 },
      ],
    });
    const total = r.reduce((s, x) => s + x.amountWei, 0n);
    expect(total).toBe(10_000_000_000n);
  });
});
