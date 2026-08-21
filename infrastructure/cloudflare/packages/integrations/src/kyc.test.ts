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

  it("startSession does the documented two-step Onfido flow and returns the SDK URL", async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const fakeFetch = async (url: string, init?: RequestInit) => {
      calls.push({ url, init });
      if (url.endsWith("/applicants")) {
        return new Response(JSON.stringify({ id: "applicant_xyz" }), {
          status: 201,
          headers: { "content-type": "application/json" },
        });
      }
      if (url.endsWith("/sdk_token")) {
        return new Response(JSON.stringify({ token: "sdktok123" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }
      return new Response("not found", { status: 404 });
    };
    const live = new OnfidoKycProvider("token-x", "wh", "eu", fakeFetch as unknown as typeof fetch);
    const session = await live.startSession(
      { internalRef: "tenant_abc", entity: "retail", jurisdiction: "eu", details: { firstName: "Ada", lastName: "Lovelace", email: "ada@example.com" } },
      "standard",
    );
    expect(calls).toHaveLength(2);
    expect(calls[0]?.url).toContain("https://api.eu.onfido.com/v3.6/applicants");
    expect(calls[1]?.url).toContain("https://api.eu.onfido.com/v3.6/sdk_token");
    expect(session.providerSessionId).toBe("applicant_xyz");
    expect(session.hostedUrl).toContain("token=sdktok123");
    expect(session.expiresAt).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it("startSession surfaces a non-2xx applicant create as a thrown error", async () => {
    const fakeFetch = async () => new Response("nope", { status: 401 });
    const live = new OnfidoKycProvider("bad", "wh", "us", fakeFetch as unknown as typeof fetch);
    await expect(
      live.startSession({ internalRef: "t", entity: "retail", jurisdiction: "us", details: {} }, "basic"),
    ).rejects.toThrow(/onfido_applicant_create_failed/);
  });
});

describe("SumsubKycProvider (KYB)", () => {
  const provider = new SumsubKycProvider("app-token", "secret-key", "eu");

  it("starts a hosted KYB session for an institution by calling the live applicant + websdkLink endpoints", async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const fakeFetch = async (url: string, init?: RequestInit) => {
      calls.push({ url, init });
      if (url.includes("/resources/applicants")) {
        // X-App-Token header should be present on every call.
        const headers = init?.headers as Record<string, string> | undefined;
        expect(headers?.["X-App-Token"]).toBe("app-token");
        expect(headers?.["X-App-Access-Sig"]).toMatch(/^[0-9a-f]+$/);
        return new Response(JSON.stringify({ id: "applicant_inst_1" }), { status: 201 });
      }
      if (url.includes("/websdkLink")) {
        return new Response(JSON.stringify({ url: "https://api.sumsub.com/idensic/l/eu/abc?ttl=86400" }), { status: 200 });
      }
      return new Response("not found", { status: 404 });
    };
    const live = new SumsubKycProvider("app-token", "secret-key", "eu", fakeFetch as unknown as typeof fetch);
    const session = await live.startSession(
      { internalRef: "tenant_inst_1", entity: "institutional", jurisdiction: "eu", details: {} },
      "enhanced",
    );
    expect(calls).toHaveLength(2);
    expect(calls[0]?.url).toContain("levelName=enhanced-kyb-level");
    expect(calls[1]?.url).toContain("/resources/sdkIntegrations/levels/enhanced-kyb-level/websdkLink");
    expect(session.providerSessionId).toBe("applicant_inst_1");
    expect(session.hostedUrl).toBe("https://api.sumsub.com/idensic/l/eu/abc?ttl=86400");
  });

  it("startSession throws if the applicant create call fails", async () => {
    const fakeFetch = async () => new Response("err", { status: 500 });
    const live = new SumsubKycProvider("a", "b", "us", fakeFetch as unknown as typeof fetch);
    await expect(
      live.startSession({ internalRef: "x", entity: "data_provider", jurisdiction: "us", details: {} }, "enhanced"),
    ).rejects.toThrow(/sumsub_applicant_create_failed/);
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
