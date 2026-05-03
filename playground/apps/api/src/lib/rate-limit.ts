/**
 * KV-backed sliding-window rate limit.
 *
 * Stores an array of request timestamps (ms). Each call:
 *   1. Loads the array
 *   2. Drops entries older than `windowMs`
 *   3. If pruned length >= `limit` → deny
 *   4. Otherwise append `now`, save with TTL = ceil(windowMs/1000)
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

export async function checkRateLimit(
  kv: KVNamespace,
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): Promise<RateLimitResult> {
  const cutoff = now - windowMs;
  const raw = await kv.get(key, "json");
  const prev = Array.isArray(raw) ? (raw as number[]).filter((t) => t > cutoff) : [];

  if (prev.length >= limit) {
    const oldest = prev[0]!;
    return { allowed: false, remaining: 0, resetMs: oldest + windowMs - now };
  }

  prev.push(now);
  await kv.put(key, JSON.stringify(prev), {
    expirationTtl: Math.max(60, Math.ceil(windowMs / 1000)),
  });
  return { allowed: true, remaining: limit - prev.length, resetMs: windowMs };
}
