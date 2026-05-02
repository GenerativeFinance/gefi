import { describe, expect, it } from "vitest";
import {
  buildMerkle,
  canonicalJson,
  computeEventHash,
  genesisHash,
  inclusionProof,
  sha256Hex,
  verifyInclusion,
} from "./merkle.js";

describe("canonicalJson", () => {
  it("sorts keys", () => {
    expect(canonicalJson({ b: 1, a: 2 })).toBe('{"a":2,"b":1}');
  });

  it("recurses into nested objects + arrays", () => {
    expect(canonicalJson({ z: [{ b: 1, a: 2 }], a: 1 })).toBe('{"a":1,"z":[{"a":2,"b":1}]}');
  });

  it("handles primitives + null", () => {
    expect(canonicalJson(null)).toBe("null");
    expect(canonicalJson(42)).toBe("42");
    expect(canonicalJson("hi")).toBe('"hi"');
    expect(canonicalJson(true)).toBe("true");
  });
});

describe("hash chain", () => {
  it("genesis hash is 64 zeros", () => {
    expect(genesisHash()).toBe("0".repeat(64));
  });

  it("event hash depends on prev_hash + canonical payload", async () => {
    const prev = genesisHash();
    const a = await computeEventHash(prev, { b: 1, a: 2 });
    const b = await computeEventHash(prev, { a: 2, b: 1 });
    expect(a).toBe(b);
    const c = await computeEventHash(prev, { a: 2, b: 99 });
    expect(c).not.toBe(a);
  });

  it("changing prev_hash changes event_hash", async () => {
    const a = await computeEventHash(genesisHash(), { x: 1 });
    const b = await computeEventHash("a".repeat(64), { x: 1 });
    expect(a).not.toBe(b);
  });

  it("sha256Hex produces 64-char lowercase hex", async () => {
    const h = await sha256Hex("abc");
    expect(h).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
});

describe("Merkle tree", () => {
  it("empty tree returns zero root", async () => {
    const { root } = await buildMerkle([]);
    expect(root).toBe("0".repeat(64));
  });

  it("single-leaf tree root equals the leaf", async () => {
    const leaf = await sha256Hex("only");
    const { root } = await buildMerkle([leaf]);
    expect(root).toBe(leaf);
  });

  it("inclusion proof verifies", async () => {
    const leaves = await Promise.all([
      sha256Hex("a"),
      sha256Hex("b"),
      sha256Hex("c"),
      sha256Hex("d"),
    ]);
    const { path, root } = await inclusionProof(leaves, 2);
    expect(await verifyInclusion(leaves[2]!, path, root)).toBe(true);
  });

  it("inclusion proof rejects wrong leaf", async () => {
    const leaves = await Promise.all([sha256Hex("a"), sha256Hex("b"), sha256Hex("c"), sha256Hex("d")]);
    const { path, root } = await inclusionProof(leaves, 0);
    expect(await verifyInclusion(await sha256Hex("z"), path, root)).toBe(false);
  });

  it("odd-sized tree duplicates the tail", async () => {
    const leaves = await Promise.all([sha256Hex("1"), sha256Hex("2"), sha256Hex("3")]);
    const { path, root } = await inclusionProof(leaves, 2);
    expect(await verifyInclusion(leaves[2]!, path, root)).toBe(true);
  });

  it("out-of-range leaf throws", async () => {
    const leaves = [await sha256Hex("a")];
    await expect(inclusionProof(leaves, 5)).rejects.toThrow("inclusion_proof_out_of_range");
  });

  it("tampered path fails verification", async () => {
    const leaves = await Promise.all([sha256Hex("a"), sha256Hex("b"), sha256Hex("c"), sha256Hex("d")]);
    const { path, root } = await inclusionProof(leaves, 1);
    const tampered = [...path];
    tampered[0] = { sibling: "f".repeat(64), position: tampered[0]!.position };
    expect(await verifyInclusion(leaves[1]!, tampered, root)).toBe(false);
  });
});
