import { describe, expect, it } from "vitest";
import { generateKeypair, signJwt, verifyJwt } from "./jwt.js";

describe("jwt (Ed25519)", () => {
  it("signs and verifies a valid token round-trip", async () => {
    const { privateJwk, publicJwk } = await generateKeypair();
    const token = await signJwt({ sub: "u1", email: "a@b.co" }, privateJwk, 60);
    const payload = await verifyJwt(token, publicJwk);
    expect(payload).not.toBeNull();
    expect(payload!.sub).toBe("u1");
    expect(payload!.email).toBe("a@b.co");
    expect(payload!.exp).toBeGreaterThan(payload!.iat);
  });

  it("rejects an expired token", async () => {
    const { privateJwk, publicJwk } = await generateKeypair();
    const past = Math.floor(Date.now() / 1000) - 10000;
    const token = await signJwt({ sub: "u1", email: "a@b.co" }, privateJwk, 1, past);
    const payload = await verifyJwt(token, publicJwk);
    expect(payload).toBeNull();
  });

  it("rejects a tampered payload", async () => {
    const { privateJwk, publicJwk } = await generateKeypair();
    const token = await signJwt({ sub: "u1", email: "a@b.co" }, privateJwk, 60);
    const [h, , s] = token.split(".");
    const tampered = `${h}.eyJzdWIiOiJ1MiIsImVtYWlsIjoiZUBmLmNvbSIsImlhdCI6MSwiZXhwIjo5OTk5OTk5OTk5fQ.${s}`;
    expect(await verifyJwt(tampered, publicJwk)).toBeNull();
  });

  it("rejects garbage strings", async () => {
    const { publicJwk } = await generateKeypair();
    expect(await verifyJwt("not.a.token", publicJwk)).toBeNull();
    expect(await verifyJwt("only-one-segment", publicJwk)).toBeNull();
    expect(await verifyJwt("", publicJwk)).toBeNull();
  });

  it("rejects a token signed by a different key", async () => {
    const k1 = await generateKeypair();
    const k2 = await generateKeypair();
    const token = await signJwt({ sub: "u1", email: "a@b.co" }, k1.privateJwk, 60);
    expect(await verifyJwt(token, k2.publicJwk)).toBeNull();
  });
});
