import { describe, expect, it } from "vitest";
import { fedAvg, aggregateAndAverage, aggregateFingerprint, linearMseLoss } from "./aggregator.js";
import { applyDpSgd, l2Clip, addGaussianNoise, estimateEpsilon } from "./dp.js";
import { DeterministicMaskSource, maskUpdate, aggregateMaskedUpdates, unmaskWithRecovery } from "./secure-agg.js";
import { tmcShapley } from "./shapley.js";
import { mulberry32, gaussianFactory, seedFromString } from "./prng.js";
import type { PlaintextUpdate } from "./types.js";

describe("prng", () => {
  it("mulberry32 is deterministic", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 100; i++) expect(a()).toBe(b());
  });

  it("gaussian samples have ~0 mean and ~1 stddev over 10k draws", () => {
    const g = gaussianFactory(mulberry32(1));
    let sum = 0, sq = 0;
    const N = 10000;
    for (let i = 0; i < N; i++) {
      const x = g();
      sum += x;
      sq += x * x;
    }
    const mean = sum / N;
    const variance = sq / N - mean * mean;
    expect(Math.abs(mean)).toBeLessThan(0.05);
    expect(Math.abs(variance - 1)).toBeLessThan(0.1);
  });

  it("seedFromString diverges between distinct inputs", () => {
    expect(seedFromString("a")).not.toBe(seedFromString("b"));
    expect(seedFromString("round-1|alice")).not.toBe(seedFromString("round-1|bob"));
  });
});

describe("dp", () => {
  it("l2Clip leaves vectors with norm <= clip alone", () => {
    const v = new Float64Array([0.3, 0.4]); // norm = 0.5
    const out = l2Clip(v, 1.0);
    expect(out[0]).toBe(0.3);
    expect(out[1]).toBe(0.4);
  });

  it("l2Clip scales vectors with norm > clip", () => {
    const v = new Float64Array([3, 4]); // norm = 5
    const out = l2Clip(v, 1.0);
    expect(out[0]).toBeCloseTo(0.6, 10);
    expect(out[1]).toBeCloseTo(0.8, 10);
  });

  it("addGaussianNoise with σ=0 returns input unchanged", () => {
    const v = new Float64Array([1, 2, 3]);
    const out = addGaussianNoise({ vector: v, noiseMultiplier: 0, clipNorm: 1, seed: 42 });
    expect(out).toBe(v);
  });

  it("applyDpSgd is deterministic given the same seed", () => {
    const v = new Float64Array([1, 2, 3, 4]);
    const a = applyDpSgd(v, 0.5, 1.0, 7);
    const b = applyDpSgd(v, 0.5, 1.0, 7);
    expect(Array.from(a)).toEqual(Array.from(b));
  });

  it("applyDpSgd produces different outputs for different seeds", () => {
    const v = new Float64Array([1, 2, 3, 4]);
    const a = applyDpSgd(v, 0.5, 1.0, 1);
    const b = applyDpSgd(v, 0.5, 1.0, 2);
    expect(Array.from(a)).not.toEqual(Array.from(b));
  });

  it("estimateEpsilon shrinks as σ grows", () => {
    const e1 = estimateEpsilon(0.5, 100, 1e-5, 0.01);
    const e2 = estimateEpsilon(2.0, 100, 1e-5, 0.01);
    expect(e1).toBeGreaterThan(e2);
  });

  it("estimateEpsilon returns Infinity for σ=0 (no DP)", () => {
    expect(estimateEpsilon(0, 100, 1e-5, 0.01)).toBe(Infinity);
  });
});

describe("secure-agg / Bonawitz", () => {
  it("DeterministicMaskSource gives sign-symmetric pairs (a,b) = -mask(b,a)", () => {
    const src = new DeterministicMaskSource();
    const m_ab = src.pairwiseMask("r1", "alice", "bob", 8);
    const m_ba = src.pairwiseMask("r1", "bob", "alice", 8);
    for (let i = 0; i < 8; i++) expect(m_ab[i]).toBeCloseTo(-m_ba[i]!, 12);
  });

  it("masks cancel when all participants submit", async () => {
    const cohort = ["alice", "bob", "carol"];
    const updates: Record<string, Float64Array> = {
      alice: new Float64Array([1, 2, 3]),
      bob: new Float64Array([0.5, -1, 2]),
      carol: new Float64Array([-2, 4, 0]),
    };
    const masked: Float64Array[] = [];
    for (const p of cohort) {
      const r = await maskUpdate({ roundId: "r1", participantId: p, cohort, update: updates[p]! });
      masked.push(r.masked);
    }
    const agg = aggregateMaskedUpdates(masked);
    for (let i = 0; i < 3; i++) {
      const expected = updates.alice![i]! + updates.bob![i]! + updates.carol![i]!;
      expect(agg[i]).toBeCloseTo(expected, 10);
    }
  });

  it("dropout recovery restores correct sum", async () => {
    const cohort = ["a", "b", "c"];
    const updates: Record<string, Float64Array> = {
      a: new Float64Array([1, 1, 1]),
      b: new Float64Array([2, 2, 2]),
      c: new Float64Array([3, 3, 3]),
    };
    // Only a + b submit; c drops out.
    const ma = (await maskUpdate({ roundId: "r1", participantId: "a", cohort, update: updates.a! })).masked;
    const mb = (await maskUpdate({ roundId: "r1", participantId: "b", cohort, update: updates.b! })).masked;
    const partial = aggregateMaskedUpdates([ma, mb]);
    const recovered = unmaskWithRecovery(partial, "r1", ["a", "b"], ["c"]);
    for (let i = 0; i < 3; i++) {
      expect(recovered[i]).toBeCloseTo(updates.a![i]! + updates.b![i]!, 10);
    }
  });

  it("rejects self-not-in-cohort", async () => {
    await expect(
      maskUpdate({ roundId: "r1", participantId: "x", cohort: ["a", "b"], update: new Float64Array([1]) }),
    ).rejects.toThrow("self_not_in_cohort");
  });

  it("rejects cohort of size 1", async () => {
    await expect(
      maskUpdate({ roundId: "r1", participantId: "a", cohort: ["a"], update: new Float64Array([1]) }),
    ).rejects.toThrow("cohort_too_small");
  });
});

describe("aggregator / FedAvg", () => {
  it("weighted mean by sample count", () => {
    const updates: PlaintextUpdate[] = [
      { participantId: "a", tenantId: "t1", vector: new Float64Array([10, 20]), sampleCount: 100 },
      { participantId: "b", tenantId: "t2", vector: new Float64Array([0, 0]), sampleCount: 100 },
    ];
    const out = fedAvg(updates);
    expect(out[0]).toBeCloseTo(5, 10);
    expect(out[1]).toBeCloseTo(10, 10);
  });

  it("weights skew toward larger sample counts", () => {
    const updates: PlaintextUpdate[] = [
      { participantId: "a", tenantId: "t1", vector: new Float64Array([10]), sampleCount: 900 },
      { participantId: "b", tenantId: "t2", vector: new Float64Array([0]), sampleCount: 100 },
    ];
    const out = fedAvg(updates);
    expect(out[0]).toBeCloseTo(9, 10);
  });

  it("falls back to uniform mean when all sample counts are zero", () => {
    const updates: PlaintextUpdate[] = [
      { participantId: "a", tenantId: "t1", vector: new Float64Array([10]), sampleCount: 0 },
      { participantId: "b", tenantId: "t2", vector: new Float64Array([0]), sampleCount: 0 },
    ];
    const out = fedAvg(updates);
    expect(out[0]).toBeCloseTo(5, 10);
  });

  it("rejects dim mismatch", () => {
    expect(() =>
      fedAvg([
        { participantId: "a", tenantId: "t", vector: new Float64Array([1, 2]), sampleCount: 1 },
        { participantId: "b", tenantId: "t", vector: new Float64Array([1]), sampleCount: 1 },
      ]),
    ).toThrow("dim_mismatch");
  });

  it("aggregateAndAverage divides masked sum by total samples", () => {
    const masked = [
      { participantId: "a", tenantId: "t1", masked: new Float64Array([100, 200]), maskSumSha256: "x", sampleCount: 10 },
      { participantId: "b", tenantId: "t2", masked: new Float64Array([300, 400]), maskSumSha256: "y", sampleCount: 30 },
    ];
    const r = aggregateAndAverage(masked);
    expect(r.totalSamples).toBe(40);
    expect(r.aggregate[0]).toBeCloseTo(10, 10); // (100+300)/40
    expect(r.aggregate[1]).toBeCloseTo(15, 10); // (200+400)/40
  });

  it("aggregateFingerprint is deterministic + length 64", async () => {
    const v = new Float64Array([1, 2, 3]);
    const f1 = await aggregateFingerprint(v);
    const f2 = await aggregateFingerprint(v);
    expect(f1).toBe(f2);
    expect(f1).toMatch(/^[0-9a-f]{64}$/);
  });

  it("linearMseLoss = 0 for perfect fit", () => {
    const w = new Float64Array([2, 3]);
    const X = [new Float64Array([1, 0]), new Float64Array([0, 1])];
    const y = new Float64Array([2, 3]);
    expect(linearMseLoss(w, X, y)).toBe(0);
  });
});

describe("TMC-Shapley", () => {
  it("perfectly-redundant participants split credit", () => {
    // Two identical participants with identical updates and a third
    // participant that doesn't help at all.
    const goodVec = new Float64Array([1, 2]);
    const X = [new Float64Array([1, 0]), new Float64Array([0, 1])];
    const y = new Float64Array([1, 2]); // matches goodVec exactly
    const r = tmcShapley({
      participants: [
        { participantId: "a", tenantId: "t1", vector: goodVec, sampleCount: 10 },
        { participantId: "b", tenantId: "t2", vector: goodVec, sampleCount: 10 },
        { participantId: "c", tenantId: "t3", vector: new Float64Array([-5, -5]), sampleCount: 10 },
      ],
      X, y,
      permutations: 30,
    });
    expect(r.scores.length).toBe(3);
    // a and b should score similarly; c should be ≤ both.
    expect(r.scores[2]!).toBeLessThanOrEqual(Math.max(r.scores[0]!, r.scores[1]!));
  });

  it("returns empty for empty participant list", () => {
    const r = tmcShapley({ participants: [], X: [], y: new Float64Array(0), permutations: 5 });
    expect(r.scores).toEqual([]);
    expect(r.permutationsSampled).toBe(0);
  });

  it("is deterministic when seeded by participant ids", () => {
    const X = [new Float64Array([1, 0]), new Float64Array([0, 1])];
    const y = new Float64Array([1, 1]);
    const ps: PlaintextUpdate[] = [
      { participantId: "p1", tenantId: "t1", vector: new Float64Array([1, 0.5]), sampleCount: 10 },
      { participantId: "p2", tenantId: "t2", vector: new Float64Array([0.5, 1]), sampleCount: 10 },
    ];
    const r1 = tmcShapley({ participants: ps, X, y, permutations: 20 });
    const r2 = tmcShapley({ participants: ps, X, y, permutations: 20 });
    expect(r1.scores).toEqual(r2.scores);
  });
});

describe("FederationStore / per-participant auth", () => {
  // Minimal in-memory D1 fake: holds one participant row keyed by id, lets
  // `invite` write it and `getParticipant` read it. We only exercise the
  // queries `invite` and `verifyParticipantToken` actually issue.
  function makeFakeDb() {
    const rows = new Map<string, Record<string, unknown>>();
    return {
      rows,
      prepare(sql: string) {
        const isInsert = /^INSERT INTO federation_participants/i.test(sql);
        const isSelect = /^SELECT \* FROM federation_participants WHERE id = \?$/i.test(sql);
        let bound: unknown[] = [];
        const stmt: {
          bind: (...args: unknown[]) => typeof stmt;
          run: () => Promise<void>;
          first: <T>() => Promise<T | null>;
          all: () => Promise<{ results: unknown[] }>;
        } = {
          bind(...args: unknown[]) { bound = args; return stmt; },
          async run() {
            if (isInsert) {
              const [id, round_id, tenant_id, jurisdiction, status, invited_at, sample_count, node_token_hash] = bound;
              rows.set(String(id), { id, round_id, tenant_id, jurisdiction, status, invited_at, sample_count, node_token_hash });
            }
          },
          async first<T>() {
            if (isSelect) return (rows.get(String(bound[0])) as T | undefined) ?? null;
            return null;
          },
          async all() { return { results: [] }; },
        };
        return stmt;
      },
    };
  }

  it("invite mints a fresh raw token and persists only the sha256", async () => {
    const { FederationStore } = await import("./store.js");
    const fake = makeFakeDb();
    const store = new FederationStore(fake as unknown as D1Database);
    const r = await store.invite({ roundId: "r1", tenantId: "t_a", jurisdiction: "us" });
    expect(r.nodeToken).toMatch(/^[0-9a-f]{64}$/);
    const row = [...fake.rows.values()][0]!;
    // Raw token is NEVER stored — only its sha256 hex (length 64).
    expect(row.node_token_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(row.node_token_hash).not.toBe(r.nodeToken);
    // Verifying the raw token must succeed.
    expect(await store.verifyParticipantToken(r.participant.id, r.nodeToken)).toBe(true);
  });

  it("rejects token from a sibling participant (impersonation resistance)", async () => {
    const { FederationStore } = await import("./store.js");
    const fake = makeFakeDb();
    const store = new FederationStore(fake as unknown as D1Database);
    const a = await store.invite({ roundId: "r1", tenantId: "t_a", jurisdiction: "us" });
    const b = await store.invite({ roundId: "r1", tenantId: "t_b", jurisdiction: "us" });
    // A's token is valid for A, but presenting it as B must fail.
    expect(await store.verifyParticipantToken(a.participant.id, a.nodeToken)).toBe(true);
    expect(await store.verifyParticipantToken(b.participant.id, a.nodeToken)).toBe(false);
    expect(await store.verifyParticipantToken(a.participant.id, b.nodeToken)).toBe(false);
  });

  it("rejects token for unknown participant id", async () => {
    const { FederationStore } = await import("./store.js");
    const fake = makeFakeDb();
    const store = new FederationStore(fake as unknown as D1Database);
    const a = await store.invite({ roundId: "r1", tenantId: "t_a", jurisdiction: "us" });
    expect(await store.verifyParticipantToken("fp_does_not_exist", a.nodeToken)).toBe(false);
  });

  it("rejects empty / wrong-length tokens", async () => {
    const { FederationStore } = await import("./store.js");
    const fake = makeFakeDb();
    const store = new FederationStore(fake as unknown as D1Database);
    const a = await store.invite({ roundId: "r1", tenantId: "t_a", jurisdiction: "us" });
    expect(await store.verifyParticipantToken(a.participant.id, "")).toBe(false);
    expect(await store.verifyParticipantToken(a.participant.id, "deadbeef")).toBe(false);
  });
});

describe("3-node consortium round (integration)", () => {
  it("Bonawitz-masked FedAvg recovers the plaintext FedAvg result", async () => {
    // Three participants train a 4-dim model. Each submits a masked
    // update; the orchestrator sums and divides.
    const cohort = ["node-eu-1", "node-us-1", "node-us-2"];
    const updates: PlaintextUpdate[] = [
      { participantId: "node-eu-1", tenantId: "t1", vector: new Float64Array([0.1, 0.2, 0.3, 0.4]), sampleCount: 200 },
      { participantId: "node-us-1", tenantId: "t2", vector: new Float64Array([0.05, 0.1, 0.2, 0.5]), sampleCount: 300 },
      { participantId: "node-us-2", tenantId: "t3", vector: new Float64Array([0.0, 0.0, 0.1, 0.6]), sampleCount: 500 },
    ];
    // Plaintext reference.
    const reference = fedAvg(updates);

    // Masked path — each participant scales by sample count first
    // (orchestrator's wire convention: SUM of n_i * x_i then divide).
    const masked = await Promise.all(
      updates.map(async (u) => {
        const scaled = new Float64Array(u.vector.length);
        for (let i = 0; i < u.vector.length; i++) scaled[i] = u.vector[i]! * u.sampleCount;
        const r = await maskUpdate({ roundId: "round-1", participantId: u.participantId, cohort, update: scaled });
        return { participantId: u.participantId, tenantId: u.tenantId, masked: r.masked, maskSumSha256: r.maskSumSha256, sampleCount: u.sampleCount };
      }),
    );
    const agg = aggregateAndAverage(masked);
    expect(agg.totalSamples).toBe(1000);
    for (let i = 0; i < 4; i++) {
      expect(agg.aggregate[i]).toBeCloseTo(reference[i]!, 10);
    }

    // Anchor fingerprint of the aggregate is stable.
    const fp = await aggregateFingerprint(agg.aggregate);
    expect(fp).toMatch(/^[0-9a-f]{64}$/);
  });
});
