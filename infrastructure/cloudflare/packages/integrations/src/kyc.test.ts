import { describe, expect, it } from "vitest";
import { OnfidoKycProvider, StubKycProvider, resolveKycProvider } from "./kyc/index.js";

describe("StubKycProvider", () => {
  const stub = new StubKycProvider();

  it("starts a session deterministically scoped to the subject", async () => {
    const session = await stub.startSession(
      {
        internalRef: "user_42",
        entity: "retail",
        jurisdiction: "eu",
        details: {},
      },
      "standard",
    );
    expect(session.provider).toBe("stub");
    expect(session.providerSessionId).toContain("stub_user_42_standard_");
    expect(session.hostedUrl).toContain(session.providerSessionId);
    expect(session.expiresAt).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it("parses a webhook into a normalised result", async () => {
    const result = await stub.parseWebhook(
      JSON.stringify({
        providerSessionId: "stub_user_42",
        outcome: "approved",
        achievedTier: "standard",
        reasonCodes: ["clear"],
      }),
      null,
    );
    expect(result.outcome).toBe("approved");
    expect(result.achievedTier).toBe("standard");
    expect(result.reasonCodes).toEqual(["clear"]);
  });

  it("throws on a malformed webhook body", async () => {
    await expect(stub.parseWebhook("not json", null)).rejects.toThrow(/kyc_stub_webhook_malformed/);
  });

  it("throws when required fields are missing", async () => {
    await expect(stub.parseWebhook(JSON.stringify({ providerSessionId: "x" }), null)).rejects.toThrow(
      /kyc_stub_webhook_missing/,
    );
  });
});

describe("OnfidoKycProvider", () => {
  const provider = new OnfidoKycProvider("token", "wh_secret", "eu");

  it("rejects a webhook with a missing signature", async () => {
    await expect(provider.parseWebhook("{}", null)).rejects.toThrow(/onfido_webhook_signature_missing/);
  });

  it("rejects a webhook with the wrong signature", async () => {
    await expect(provider.parseWebhook("{}", "sha256=00")).rejects.toThrow(/onfido_webhook_signature_invalid/);
  });

  it("accepts a webhook with the correct HMAC signature", async () => {
    const body = JSON.stringify({
      payload: { resource_type: "check", object: { id: "check_abc", status: "complete" } },
    });
    const sig = await OnfidoKycProvider.signForTest("wh_secret", body);
    const result = await provider.parseWebhook(body, `sha256=${sig}`);
    expect(result.outcome).toBe("approved");
    expect(result.providerSessionId).toBe("check_abc");
  });
});

describe("resolveKycProvider factory", () => {
  it("falls back to the stub when no API key is configured", () => {
    const p = resolveKycProvider("retail", "eu", {});
    expect(p.name).toBe("stub");
  });

  it("returns Onfido for individuals when both keys are present", () => {
    const p = resolveKycProvider("retail", "eu", {
      ONFIDO_API_TOKEN: "x",
      ONFIDO_WEBHOOK_SECRET: "y",
    });
    expect(p.name).toBe("onfido");
  });

  it("falls back to the stub for institutions until Sumsub/Middesk land", () => {
    const p = resolveKycProvider("institutional", "us", {
      ONFIDO_API_TOKEN: "x",
      ONFIDO_WEBHOOK_SECRET: "y",
    });
    expect(p.name).toBe("stub");
  });
});
