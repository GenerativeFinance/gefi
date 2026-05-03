import { describe, expect, it } from "vitest";
import { checkRateLimit } from "./rate-limit.js";
import { StubKV } from "../test-helpers.js";

describe("checkRateLimit (sliding window)", () => {
  it("allows up to limit then denies", async () => {
    const kv = new StubKV() as unknown as KVNamespace;
    const now = 1_000_000;
    const k = "test:user@x.com";
    const r1 = await checkRateLimit(kv, k, 3, 600_000, now);
    const r2 = await checkRateLimit(kv, k, 3, 600_000, now + 100);
    const r3 = await checkRateLimit(kv, k, 3, 600_000, now + 200);
    const r4 = await checkRateLimit(kv, k, 3, 600_000, now + 300);
    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
    expect(r3.allowed).toBe(true);
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
    expect(r4.resetMs).toBeGreaterThan(0);
  });

  it("re-allows after window slides past oldest entry", async () => {
    const kv = new StubKV() as unknown as KVNamespace;
    const k = "slide:user@x.com";
    const t0 = 2_000_000;
    await checkRateLimit(kv, k, 2, 1000, t0);
    await checkRateLimit(kv, k, 2, 1000, t0 + 100);
    const denied = await checkRateLimit(kv, k, 2, 1000, t0 + 200);
    expect(denied.allowed).toBe(false);
    const allowed = await checkRateLimit(kv, k, 2, 1000, t0 + 1500);
    expect(allowed.allowed).toBe(true);
  });

  it("isolates keys", async () => {
    const kv = new StubKV() as unknown as KVNamespace;
    const t = 3_000_000;
    await checkRateLimit(kv, "a", 1, 1000, t);
    const a = await checkRateLimit(kv, "a", 1, 1000, t + 1);
    const b = await checkRateLimit(kv, "b", 1, 1000, t + 1);
    expect(a.allowed).toBe(false);
    expect(b.allowed).toBe(true);
  });
});
