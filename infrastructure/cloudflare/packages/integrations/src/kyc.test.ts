import { describe, expect, it } from "vitest";
import {
  KycProviderNotConfiguredError,
  OnfidoKycProvider,
  StubKycProvider,
  SumsubKycProvider,
  resolveKycProvider,
} from "./kyc/index.js";

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

describe("SumsubKycProvider (KYB)", () => {
  const provider = new SumsubKycProvider("app-token", "secret-key", "eu");

  it("starts a hosted KYB session for an institution", async () => {
    const session = await provider.startSession(
      { internalRef: "tenant_inst_1", entity: "institutional", jurisdiction: "eu", details: {} },
      "enhanced",
    );
    expect(session.provider).toBe("sumsub");
    expect(session.providerSessionId).toContain("sumsub_tenant_inst_1_enhanced-kyb-level");
    expect(session.hostedUrl).toContain("sumsub.com");
  });

  it("rejects a webhook with no signature", async () => {
    await expect(provider.parseWebhook("{}", null)).rejects.toThrow(/sumsub_webhook_signature_missing/);
  });

  it("rejects a webhook with the wrong signature", async () => {
    await expect(provider.parseWebhook("{}", "00")).rejects.toThrow(/sumsub_webhook_signature_invalid/);
  });

  it("approves on reviewAnswer=GREEN with a valid HMAC", async () => {
    const body = JSON.stringify({
      applicantId: "abc123",
      type: "applicantReviewed",
      levelName: "enhanced-kyb-level",
      reviewResult: { reviewAnswer: "GREEN", rejectLabels: [] },
    });
    const sig = await SumsubKycProvider.signForTest("secret-key", body);
    const r = await provider.parseWebhook(body, sig);
    expect(r.outcome).toBe("approved");
    expect(r.achievedTier).toBe("enhanced");
    expect(r.providerSessionId).toBe("abc123");
  });

  it("declines on reviewAnswer=RED", async () => {
    const body = JSON.stringify({
      applicantId: "xyz",
      reviewResult: { reviewAnswer: "RED", rejectLabels: ["FORGED_DOCUMENT"] },
    });
    const sig = await SumsubKycProvider.signForTest("secret-key", body);
    const r = await provider.parseWebhook(body, sig);
    expect(r.outcome).toBe("declined");
    expect(r.reasonCodes).toEqual(["FORGED_DOCUMENT"]);
  });
});

describe("resolveKycProvider factory", () => {
  it("falls back to the stub in dev when no API keys are configured", () => {
    const p = resolveKycProvider("retail", "eu", { ENVIRONMENT: "dev" });
    expect(p.name).toBe("stub");
  });

  it("returns Onfido for individuals when both Onfido keys are present", () => {
    const p = resolveKycProvider("retail", "eu", {
      ONFIDO_API_TOKEN: "x",
      ONFIDO_WEBHOOK_SECRET: "y",
    });
    expect(p.name).toBe("onfido");
  });

  it("returns Sumsub for individuals when only Sumsub keys are configured", () => {
    const p = resolveKycProvider("professional", "us", {
      SUMSUB_APP_TOKEN: "a",
      SUMSUB_SECRET_KEY: "b",
    });
    expect(p.name).toBe("sumsub");
  });

  it("returns Sumsub for institutions when Sumsub is configured", () => {
    const p = resolveKycProvider("institutional", "us", {
      SUMSUB_APP_TOKEN: "a",
      SUMSUB_SECRET_KEY: "b",
    });
    expect(p.name).toBe("sumsub");
  });

  it("returns Sumsub for data providers when Sumsub is configured", () => {
    const p = resolveKycProvider("data_provider", "eu", {
      SUMSUB_APP_TOKEN: "a",
      SUMSUB_SECRET_KEY: "b",
    });
    expect(p.name).toBe("sumsub");
  });

  it("does NOT route businesses to Onfido even when only Onfido is configured", () => {
    // Onfido is individual-only; for businesses the factory must look
    // for a KYB provider (Sumsub) and refuse to fall back to Onfido.
    const p = resolveKycProvider("institutional", "eu", {
      ONFIDO_API_TOKEN: "x",
      ONFIDO_WEBHOOK_SECRET: "y",
      ENVIRONMENT: "dev",
    });
    expect(p.name).toBe("stub");
  });

  it("THROWS in prod when no provider is configured for individuals (fail-closed)", () => {
    expect(() => resolveKycProvider("retail", "eu", { ENVIRONMENT: "prod" })).toThrow(
      KycProviderNotConfiguredError,
    );
  });

  it("THROWS in prod when no KYB provider is configured for businesses (fail-closed)", () => {
    expect(() =>
      resolveKycProvider("institutional", "us", {
        ONFIDO_API_TOKEN: "x",
        ONFIDO_WEBHOOK_SECRET: "y",
        ENVIRONMENT: "prod",
      }),
    ).toThrow(KycProviderNotConfiguredError);
  });
});
