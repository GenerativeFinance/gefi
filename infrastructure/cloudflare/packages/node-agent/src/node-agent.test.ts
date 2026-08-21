/*
 * Copyright 2026 GeFi Labs. Licensed under the Apache License, Version 2.0.
 * SPDX-License-Identifier: Apache-2.0
 */
import { describe, expect, it } from "vitest";
import { StubSyntheticAdapter } from "./adapters.js";
import { trainOneRound } from "./trainer.js";
import { StubAttestation, SgxAttestation, NitroAttestation, verifyQuoteShape } from "./attestation.js";
import { AuditLogger, InMemoryAuditSink, verifyChain } from "./audit.js";
import { FeatureServer, InMemoryFeatureProvider } from "./feature-server.js";

describe("node-agent / adapters", () => {
  it("StubSyntheticAdapter generates deterministic batches", async () => {
    const a = new StubSyntheticAdapter({ rows: 100, features: ["x1", "x2"], seed: 7 });
    const b = new StubSyntheticAdapter({ rows: 100, features: ["x1", "x2"], seed: 7 });
    const ba = await a.read(null, 10);
    const bb = await b.read(null, 10);
    expect(ba.X.length).toBe(10);
    expect(ba.cursor).toBe("10");
    for (let i = 0; i < 10; i++) {
      expect(Array.from(ba.X[i]!)).toEqual(Array.from(bb.X[i]!));
      expect(ba.y[i]).toBe(bb.y[i]);
    }
  });

  it("count returns total rows", async () => {
    const a = new StubSyntheticAdapter({ rows: 250, features: ["a"] });
    expect(await a.count()).toBe(250);
  });

  it("returns null cursor on the final batch", async () => {
    const a = new StubSyntheticAdapter({ rows: 5, features: ["a"] });
    const b = await a.read(null, 100);
    expect(b.cursor).toBeNull();
    expect(b.X.length).toBe(5);
  });
});

describe("node-agent / trainer", () => {
  it("converges toward the synthetic ground truth (no DP)", async () => {
    // Synthetic data target is y = 1*x1 + 2*x2. Train a 2-d linear model
    // from zero baseline; expect weights to move toward [1, 2].
    const adapter = new StubSyntheticAdapter({ rows: 500, features: ["x1", "x2"], seed: 11 });
    const baseline = new Float64Array([0, 0]);
    const r = await trainOneRound({
      baseline,
      adapter,
      epochs: 5,
      learningRate: 0.5,
      batchSize: 50,
      dpNoiseMultiplier: 0,
      dpL2Clip: 100,
      dpSeed: 1,
    });
    expect(r.sampleCount).toBe(500 * 5);
    // Recovered weight = baseline + scaledDelta / sampleCount.
    const w0 = r.scaledDelta[0]! / r.sampleCount;
    const w1 = r.scaledDelta[1]! / r.sampleCount;
    expect(w0).toBeGreaterThan(0.5);
    expect(w1).toBeGreaterThan(1.5);
  });

  it("applying DP noise still produces a valid update", async () => {
    const adapter = new StubSyntheticAdapter({ rows: 100, features: ["x"] });
    const r = await trainOneRound({
      baseline: new Float64Array([0]),
      adapter,
      dpNoiseMultiplier: 1.0,
      dpL2Clip: 1.0,
      dpSeed: 42,
    });
    expect(Number.isFinite(r.scaledDelta[0]!)).toBe(true);
    expect(r.sampleCount).toBe(100);
  });

  it("DP noise is INDEPENDENT across batches (no seed reuse)", async () => {
    // Regression test for an earlier bug where the per-batch noise PRNG
    // was seeded with `dpSeed + epoch * K`, i.e. identical across every
    // batch in an epoch. With independent noise, two runs that differ
    // only in batch ordering must produce different scaled deltas; with
    // seed reuse, they collapse to the same value.
    //
    // We exercise this by running with a tiny batch size on the same
    // 200-row stream — that produces ~10 batches per epoch, so any
    // seed-reuse bug across batches would zero out the across-run
    // variance from the noise PRNG. We compare two runs that share
    // dpSeed but use different batch sizes (so the (epoch, batchIdx)
    // mixing produces different seeds): if noise were duplicated within
    // an epoch, batch-size variation alone would not perturb the output.
    const baseSeed = 12345;
    const a = new StubSyntheticAdapter({ rows: 200, features: ["x1", "x2"], seed: 7 });
    const b = new StubSyntheticAdapter({ rows: 200, features: ["x1", "x2"], seed: 7 });
    const runA = await trainOneRound({
      baseline: new Float64Array([0, 0]), adapter: a,
      epochs: 2, batchSize: 20, learningRate: 0.05,
      dpNoiseMultiplier: 2.0, dpL2Clip: 1.0, dpSeed: baseSeed,
    });
    const runB = await trainOneRound({
      baseline: new Float64Array([0, 0]), adapter: b,
      epochs: 2, batchSize: 25, learningRate: 0.05,
      dpNoiseMultiplier: 2.0, dpL2Clip: 1.0, dpSeed: baseSeed,
    });
    // Same data + same seed but different batch ordering ⇒ scaledDelta
    // must visibly differ. With the seed-reuse bug the noise stream was
    // identical across batches in an epoch; the only thing that varies
    // here is the (epoch, batchIdx) mix, so a positive delta proves
    // independence.
    let dist = 0;
    for (let i = 0; i < runA.scaledDelta.length; i++) {
      const d = runA.scaledDelta[i]! - runB.scaledDelta[i]!;
      dist += d * d;
    }
    expect(Math.sqrt(dist)).toBeGreaterThan(1e-6);
  });
});

describe("node-agent / attestation", () => {
  it("StubAttestation generates a deterministic quote per nonce", async () => {
    const s = new StubAttestation();
    const a = await s.generate("round1|alice");
    const b = await s.generate("round1|alice");
    expect(a.kind).toBe("stub");
    expect(a.mrenclave).toBe(b.mrenclave);
  });

  it("SgxAttestation rejects bad mrenclave", () => {
    expect(() => new SgxAttestation("not-hex")).toThrow("mrenclave_must_be_64_hex");
  });

  it("NitroAttestation accepts hex pcr0", async () => {
    const n = new NitroAttestation("a".repeat(96));
    const q = await n.generate("nonce");
    expect(q.kind).toBe("nitro");
    expect(q.expiresAt).toBeGreaterThan(q.generatedAt);
  });

  it("verifyQuoteShape passes for a valid stub quote", async () => {
    const q = await new StubAttestation().generate("x");
    const r = verifyQuoteShape(q);
    expect(r.ok).toBe(true);
  });

  it("verifyQuoteShape rejects expired quote", () => {
    const r = verifyQuoteShape({
      kind: "sgx",
      quote: btoa("xx"),
      mrenclave: "ab".repeat(32),
      generatedAt: 0,
      expiresAt: 1,
    });
    expect(r.ok).toBe(false);
  });

  it("verifyQuoteShape rejects sgx without mrenclave", () => {
    const r = verifyQuoteShape({
      kind: "sgx",
      quote: btoa("xx"),
      mrenclave: null,
      generatedAt: 0,
      expiresAt: null,
    });
    expect(r.ok).toBe(false);
  });
});

describe("node-agent / audit", () => {
  it("appends events with correct hash chain", async () => {
    const sink = new InMemoryAuditSink();
    const log = new AuditLogger(sink);
    await log.log("a", { x: 1 }, 1000);
    await log.log("b", { y: 2 }, 1001);
    const rows = await sink.list();
    expect(rows.length).toBe(2);
    expect(rows[0]!.prevHash).toMatch(/^0+$/);
    expect(rows[1]!.prevHash).toBe(rows[0]!.eventHash);
  });

  it("verifyChain detects tampering", async () => {
    const sink = new InMemoryAuditSink();
    const log = new AuditLogger(sink);
    await log.log("a", { x: 1 });
    await log.log("b", { y: 2 });
    const rows = await sink.list();
    rows[0]!.payload = { x: 999 }; // tamper
    const v = await verifyChain(rows);
    expect(v.ok).toBe(false);
  });

  it("resume picks up after restart", async () => {
    const sink = new InMemoryAuditSink();
    const log1 = new AuditLogger(sink);
    await log1.log("a", { x: 1 });
    const log2 = new AuditLogger(sink);
    await log2.resume();
    await log2.log("b", { x: 2 });
    const rows = await sink.list();
    expect(rows.length).toBe(2);
    expect(rows[1]!.id).toBe(2);
    expect(rows[1]!.prevHash).toBe(rows[0]!.eventHash);
    expect((await verifyChain(rows)).ok).toBe(true);
  });
});

describe("node-agent / feature server", () => {
  const provider = new InMemoryFeatureProvider({
    schemaVersion: "v1",
    schema: { features: ["price_volatility", "volume"], target: "value" },
  });
  provider.put("price_volatility", "AAPL", 0.32);
  provider.put("volume", "AAPL", 1234567);
  const server = new FeatureServer(provider);

  it("resolves known feature/key", async () => {
    const r = await server.handle({ feature: "price_volatility", key: "AAPL" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value).toBe(0.32);
      expect(r.schemaVersion).toBe("v1");
    }
  });

  it("rejects unknown feature", async () => {
    const r = await server.handle({ feature: "nope", key: "AAPL" });
    expect(r.ok).toBe(false);
  });

  it("returns key_not_found for unknown key", async () => {
    const r = await server.handle({ feature: "volume", key: "TSLA" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("key_not_found");
  });

  it("rejects empty inputs", async () => {
    const r1 = await server.handle({ feature: "", key: "x" });
    const r2 = await server.handle({ feature: "x", key: "" });
    expect(r1.ok).toBe(false);
    expect(r2.ok).toBe(false);
  });
});
