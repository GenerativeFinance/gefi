/**
 * verifyAuth0Token tests.
 *
 * Real Auth0 tokens are RS256 — we generate a tiny RSA keypair in test
 * setup, sign a payload, and pass the public JWK directly via the
 * `signingKey` escape hatch (avoids needing a fetch'able JWKS endpoint
 * here). The same code path that handles a JWKS-fetched key handles the
 * direct one, so this exercises the whole verify pipeline.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { GEFI_CLAIM_NS } from "./types.js";
import { extractBearer, peekJurisdiction, verifyAuth0Token } from "./verify.js";
import type { JsonWebKey } from "./jwks.js";

const encoder = new TextEncoder();

function b64url(input: ArrayBuffer | Uint8Array | string): string {
  const bytes =
    typeof input === "string"
      ? encoder.encode(input)
      : input instanceof Uint8Array
      ? input
      : new Uint8Array(input);
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    const code = bytes[i];
    if (code !== undefined) bin += String.fromCharCode(code);
  }
  return btoa(bin).replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

interface TestKeypair {
  privateKey: CryptoKey;
  publicJwk: JsonWebKey;
  kid: string;
}

async function generateRsaKeypair(kid = "test-key-1"): Promise<TestKeypair> {
  const pair = (await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  )) as CryptoKeyPair;
  const rawJwk = (await crypto.subtle.exportKey("jwk", pair.publicKey)) as unknown as Record<string, unknown>;
  const publicJwk: JsonWebKey = {
    kty: "RSA",
    use: "sig",
    alg: "RS256",
    kid,
    n: rawJwk.n as string,
    e: rawJwk.e as string,
  };
  return { privateKey: pair.privateKey, publicJwk, kid };
}

interface SignOpts {
  iss?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  customClaims?: Record<string, unknown>;
  alg?: "RS256" | "none";
  /** Skip the header entirely (used to test malformed tokens). */
  malformed?: boolean;
}

async function makeToken(kp: TestKeypair, opts: SignOpts = {}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: opts.alg ?? "RS256", typ: "JWT", kid: kp.kid };
  const ns = GEFI_CLAIM_NS;
  const payload = {
    iss: opts.iss ?? "https://gefi-test.auth0.com/",
    sub: "auth0|test-user",
    aud: opts.aud ?? "https://api.gefi.io",
    iat: opts.iat ?? now,
    exp: opts.exp ?? now + 3600,
    [`${ns}jurisdiction`]: "eu",
    [`${ns}entity_type`]: "retail",
    [`${ns}tenant_id`]: "tenant_test",
    [`${ns}roles`]: ["investor"],
    ...opts.customClaims,
  };
  const headerB64 = b64url(JSON.stringify(header));
  const payloadB64 = b64url(JSON.stringify(payload));
  if (opts.malformed) return "not.a.token";
  if (opts.alg === "none") return `${headerB64}.${payloadB64}.`;
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    kp.privateKey,
    encoder.encode(`${headerB64}.${payloadB64}`),
  );
  return `${headerB64}.${payloadB64}.${b64url(sig)}`;
}

describe("verifyAuth0Token", () => {
  let kp: TestKeypair;
  beforeAll(async () => {
    kp = await generateRsaKeypair();
  });

  it("verifies a valid token and flattens custom claims", async () => {
    const token = await makeToken(kp);
    const claims = await verifyAuth0Token(token, {
      auth0Domain: "https://gefi-test.auth0.com/",
      audience: "https://api.gefi.io",
      signingKey: kp.publicJwk,
    });
    expect(claims.jurisdiction).toBe("eu");
    expect(claims.entity_type).toBe("retail");
    expect(claims.tenant_id).toBe("tenant_test");
    expect(claims.roles).toEqual(["investor"]);
    expect(claims.iss).toBe("https://gefi-test.auth0.com/");
  });

  it("rejects a tampered token", async () => {
    const token = await makeToken(kp);
    const parts = token.split(".");
    const flippedSig = parts[2]?.split("").reverse().join("") ?? "";
    const tampered = `${parts[0]}.${parts[1]}.${flippedSig}`;
    await expect(
      verifyAuth0Token(tampered, {
        auth0Domain: "https://gefi-test.auth0.com/",
        audience: "https://api.gefi.io",
        signingKey: kp.publicJwk,
      }),
    ).rejects.toThrow(/auth_token_signature_invalid|auth_token_malformed/);
  });

  it("rejects a token with the wrong issuer", async () => {
    const token = await makeToken(kp, { iss: "https://attacker.example/" });
    await expect(
      verifyAuth0Token(token, {
        auth0Domain: "https://gefi-test.auth0.com/",
        audience: "https://api.gefi.io",
        signingKey: kp.publicJwk,
      }),
    ).rejects.toThrow(/auth_token_issuer_mismatch/);
  });

  it("rejects a token with the wrong audience", async () => {
    const token = await makeToken(kp, { aud: "https://api.someoneelse.io" });
    await expect(
      verifyAuth0Token(token, {
        auth0Domain: "https://gefi-test.auth0.com/",
        audience: "https://api.gefi.io",
        signingKey: kp.publicJwk,
      }),
    ).rejects.toThrow(/auth_token_audience_mismatch/);
  });

  it("rejects an expired token", async () => {
    const past = Math.floor(Date.now() / 1000) - 3600;
    const token = await makeToken(kp, { exp: past, iat: past - 60 });
    await expect(
      verifyAuth0Token(token, {
        auth0Domain: "https://gefi-test.auth0.com/",
        audience: "https://api.gefi.io",
        signingKey: kp.publicJwk,
      }),
    ).rejects.toThrow(/auth_token_expired/);
  });

  it("rejects 'none' alg attacks", async () => {
    const token = await makeToken(kp, { alg: "none" });
    await expect(
      verifyAuth0Token(token, {
        auth0Domain: "https://gefi-test.auth0.com/",
        audience: "https://api.gefi.io",
        signingKey: kp.publicJwk,
      }),
    ).rejects.toThrow(/auth_token_malformed/);
  });

  it("rejects a token missing required custom claims", async () => {
    const ns = GEFI_CLAIM_NS;
    const token = await makeToken(kp, {
      customClaims: { [`${ns}roles`]: undefined, roles: undefined },
    });
    // The custom claim shape after the makeToken merge will lack `roles`
    // because we explicitly nullified it via spread. Build a payload by
    // hand for this test instead.
    const now = Math.floor(Date.now() / 1000);
    const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT", kid: kp.kid }));
    const payload = b64url(
      JSON.stringify({
        iss: "https://gefi-test.auth0.com/",
        sub: "auth0|test",
        aud: "https://api.gefi.io",
        iat: now,
        exp: now + 60,
        [`${ns}jurisdiction`]: "eu",
        [`${ns}entity_type`]: "retail",
        [`${ns}tenant_id`]: "tenant_test",
        // roles intentionally omitted
      }),
    );
    const sig = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      kp.privateKey,
      encoder.encode(`${header}.${payload}`),
    );
    const realToken = `${header}.${payload}.${b64url(sig)}`;
    await expect(
      verifyAuth0Token(realToken, {
        auth0Domain: "https://gefi-test.auth0.com/",
        audience: "https://api.gefi.io",
        signingKey: kp.publicJwk,
      }),
    ).rejects.toThrow(/auth_token_claims_missing/);
    // Suppress the unused-variable warning from the original call above.
    expect(token).toBeDefined();
  });

  it("accepts tokens whose audience is an array containing the API id", async () => {
    const token = await makeToken(kp, {
      aud: undefined,
      customClaims: { aud: ["https://api.gefi.io", "https://gefi-test.auth0.com/userinfo"] },
    });
    const claims = await verifyAuth0Token(token, {
      auth0Domain: "https://gefi-test.auth0.com/",
      audience: "https://api.gefi.io",
      signingKey: kp.publicJwk,
    });
    expect(claims.tenant_id).toBe("tenant_test");
  });
});

describe("peekJurisdiction", () => {
  it("returns the unverified jurisdiction claim", async () => {
    const kp = await generateRsaKeypair();
    const token = await makeToken(kp);
    expect(peekJurisdiction(token)).toBe("eu");
  });

  it("returns null on malformed input", () => {
    expect(peekJurisdiction("not a jwt")).toBeNull();
    expect(peekJurisdiction("")).toBeNull();
  });

  it("returns null when the claim is absent", async () => {
    const kp = await generateRsaKeypair();
    const token = await makeToken(kp, { customClaims: { [`${GEFI_CLAIM_NS}jurisdiction`]: undefined } });
    // The spread above doesn't actually delete; build a token explicitly.
    const now = Math.floor(Date.now() / 1000);
    const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT", kid: kp.kid }));
    const payload = b64url(JSON.stringify({ iss: "x", sub: "y", aud: "z", iat: now, exp: now + 60 }));
    expect(peekJurisdiction(`${header}.${payload}.sig`)).toBeNull();
    expect(token).toBeDefined();
  });
});

describe("extractBearer", () => {
  it("pulls a token out of an Authorization header", () => {
    expect(extractBearer("Bearer abc.def.ghi")).toBe("abc.def.ghi");
    expect(extractBearer("bearer abc.def.ghi")).toBe("abc.def.ghi");
  });

  it("returns null on missing or malformed header", () => {
    expect(extractBearer(null)).toBeNull();
    expect(extractBearer(undefined)).toBeNull();
    expect(extractBearer("Basic abc")).toBeNull();
    expect(extractBearer("")).toBeNull();
  });
});
