/**
 * Hash-chain + Merkle-tree primitives for the audit vault.
 *
 * Two separate cryptographic structures:
 *
 *   1. **Hash chain** — every audit row stores `event_hash = sha256(prev_hash
 *      || canonicalJson(payload))`. Tampering with row N invalidates rows
 *      N..end. Cheap to verify by re-walking the table.
 *
 *   2. **Merkle tree** — once per (region, day) the engine builds a Merkle
 *      tree over the `event_hash` values, commits the root on-chain, and
 *      can return an inclusion proof for any leaf. An external auditor can
 *      then independently verify a leaf is in the day's anchored root by
 *      walking the proof.
 *
 * Web Crypto's `crypto.subtle.digest` is available in Workers + Node 20,
 * which is the runtime we ship to.
 */

const ZERO_HASH = "0".repeat(64);

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i] ?? 0;
    hex += b.toString(16).padStart(2, "0");
  }
  return hex;
}

export async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return toHex(buf);
}

/**
 * Concatenate two hex hashes (each 64 chars) and hash the resulting 128-char
 * hex string. Order matters: `(left, right)` ≠ `(right, left)`.
 */
export async function hashPair(left: string, right: string): Promise<string> {
  return sha256Hex(left + right);
}

/**
 * Canonical JSON serializer — sorts keys recursively so the same object
 * always serializes to the same bytes regardless of property insertion
 * order. Critical for the hash chain (we hash payloads, not strings).
 */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonicalJson).join(",") + "]";
  const keys = Object.keys(value as Record<string, unknown>).sort();
  const obj = value as Record<string, unknown>;
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonicalJson(obj[k])).join(",") + "}";
}

/** Genesis prev_hash used for the first row in a fresh chain. */
export function genesisHash(): string {
  return ZERO_HASH;
}

/**
 * Compute `event_hash` for a row given the canonicalised payload. The hash
 * commits to (prev_hash || canonical_payload) — no other fields, so a
 * verifier reconstructing the chain only needs (prev_hash, payload).
 */
export async function computeEventHash(prevHash: string, payload: unknown): Promise<string> {
  return sha256Hex(prevHash + canonicalJson(payload));
}

/**
 * Build a Merkle tree from leaf hashes. Returns `[root, levels]` where
 * `levels[0]` is the leaves and `levels[levels.length - 1]` is `[root]`.
 *
 * If `leaves.length` at a level is odd, the last leaf is duplicated (the
 * Bitcoin convention). For an empty input we return `(ZERO_HASH, [[]])`.
 */
export async function buildMerkle(leaves: readonly string[]): Promise<{ root: string; levels: string[][] }> {
  if (leaves.length === 0) return { root: ZERO_HASH, levels: [[]] };
  const levels: string[][] = [[...leaves]];
  let cur: string[] = [...leaves];
  while (cur.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < cur.length; i += 2) {
      const left = cur[i] as string;
      const right = (cur[i + 1] ?? cur[i]) as string;
      next.push(await hashPair(left, right));
    }
    levels.push(next);
    cur = next;
  }
  return { root: cur[0] as string, levels };
}

/**
 * Generate an inclusion proof for `leafIndex` against the tree built from
 * `leaves`. The returned `path` walks from the leaf level upward; each
 * entry holds the sibling and whether the sibling sat on the left (= the
 * verifier hashes `sibling || acc`) or right.
 */
export async function inclusionProof(
  leaves: readonly string[],
  leafIndex: number,
): Promise<{ path: { sibling: string; position: "left" | "right" }[]; root: string }> {
  if (leafIndex < 0 || leafIndex >= leaves.length) {
    throw new Error("inclusion_proof_out_of_range");
  }
  const { root, levels } = await buildMerkle(leaves);
  const path: { sibling: string; position: "left" | "right" }[] = [];
  let idx = leafIndex;
  for (let lvl = 0; lvl < levels.length - 1; lvl++) {
    const level = levels[lvl] as string[];
    // Sibling sits at idx XOR 1, padding the odd-tail by duplicating idx.
    const siblingIdx = idx % 2 === 0 ? Math.min(idx + 1, level.length - 1) : idx - 1;
    const sibling = level[siblingIdx] as string;
    const position: "left" | "right" = idx % 2 === 0 ? "right" : "left";
    path.push({ sibling, position });
    idx = Math.floor(idx / 2);
  }
  return { path, root };
}

/** Verify `(leaf, path)` reconstructs `root`. */
export async function verifyInclusion(
  leaf: string,
  path: { sibling: string; position: "left" | "right" }[],
  root: string,
): Promise<boolean> {
  let acc = leaf;
  for (const step of path) {
    acc = step.position === "left" ? await hashPair(step.sibling, acc) : await hashPair(acc, step.sibling);
  }
  return acc === root;
}
