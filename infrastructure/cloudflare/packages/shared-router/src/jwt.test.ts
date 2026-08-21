import { describe, expect, it } from "vitest";
import { signInternalJwt, verifyInternalJwt } from "./jwt.js";

const SECRET = "test-secret-do-not-use-in-prod-32-chars-minimum-please-1234";

describe("internal jwt", () => {
  it("round-trips a token", async () => {
    const token = await signInternalJwt("eu", SECRET);
    const claims = await verifyInternalJwt(token, SECRET, "eu");
    expect(claims.region).toBe("eu");
    expect(claims.iss).toBe("gefi-api");
    expect(claims.aud).toBe("gefi-api-eu");
    expect(claims.sub).toBe("internal-edge");
    expect(claims.jti).toMatch(/[0-9a-f-]{36}/);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await signInternalJwt("eu", SECRET);
    await expect(verifyInternalJwt(token, "different-secret-32-chars-minimum-please", "eu")).rejects.toThrow(
      /invalid signature/,
    );
  });

  it("rejects a token whose region claim does not match", async () => {
    const token = await signInternalJwt("eu", SECRET);
    await expect(verifyInternalJwt(token, SECRET, "us")).rejects.toThrow(/region mismatch/);
  });

  it("rejects an expired token", async () => {
    const fixedNow = 1_700_000_000;
    const token = await signInternalJwt("us", SECRET, 60, () => fixedNow);
    await expect(verifyInternalJwt(token, SECRET, "us", () => fixedNow + 120)).rejects.toThrow(
      /token expired/,
    );
  });

  it("rejects malformed tokens", async () => {
    await expect(verifyInternalJwt("not.a.jwt", SECRET, "eu")).rejects.toThrow();
    await expect(verifyInternalJwt("only.two", SECRET, "eu")).rejects.toThrow(/malformed token/);
  });
});
