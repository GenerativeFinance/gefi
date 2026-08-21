/**
 * Deterministic seeded PRNG used by the secure-aggregation + DP layers.
 *
 * In production the orchestrator never needs randomness — the participants
 * generate their own pairwise masks via ECDH-derived shared secrets and the
 * orchestrator only sums them. We use a seeded mulberry32 here so:
 *
 *   1. Tests are deterministic (3-node consortium test would otherwise
 *      flake on the sub-bit precision of TMC-Shapley estimates).
 *   2. The reference `node-agent` ships the same PRNG so customers can
 *      reproduce a round bit-for-bit during dispute resolution.
 *
 * mulberry32 is *not* cryptographically secure. The Bonawitz protocol
 * expects pairwise masks to be sampled from a CSPRNG seeded by an ECDH
 * shared secret; the production node-agent uses crypto.getRandomValues +
 * the X25519 derivation. The deterministic version here is gated behind
 * an explicit `seed` parameter so callers cannot accidentally invoke it
 * in production.
 */

export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return function next(): number {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Box-Muller transform — turns a pair of uniform draws into a pair of
 * standard-normal draws. We return one and cache the other so each call
 * uses one rand() in the steady state.
 */
export function gaussianFactory(rand: () => number): () => number {
  let cached: number | null = null;
  return function next(): number {
    if (cached !== null) {
      const c = cached;
      cached = null;
      return c;
    }
    // Avoid u1=0 — Math.log(0) = -Infinity.
    let u1 = rand();
    while (u1 <= Number.EPSILON) u1 = rand();
    const u2 = rand();
    const mag = Math.sqrt(-2.0 * Math.log(u1));
    const z0 = mag * Math.cos(2.0 * Math.PI * u2);
    const z1 = mag * Math.sin(2.0 * Math.PI * u2);
    cached = z1;
    return z0;
  };
}

/**
 * Hash a string to a 32-bit seed. Used so callers can derive a stable
 * seed from `(roundId, participantId)` without having to manage a seed
 * registry. NOT a security primitive — it only needs to spread inputs
 * across the 32-bit space well enough that two rounds don't collide.
 */
export function seedFromString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
