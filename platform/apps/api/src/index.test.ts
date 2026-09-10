import { describe, expect, it } from "vitest";
import { createApp } from "./index.js";
import { createMemoryStore } from "@gefi/db";

describe("gefi-api", () => {
  it("health returns layered privacy claim", async () => {
    const app = createApp();
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.privacyClaim).toContain("secure aggregation");
    expect(body.privacyClaim).toContain("differential privacy");
  });

  it("runs a runway calculation", async () => {
    const store = createMemoryStore();
    const app = createApp(store);
    const orgRes = await app.request("/v1/organizations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Acme Capital", slug: "acme" }),
    });
    const org = await orgRes.json();
    const modelRes = await app.request("/v1/models", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ organizationId: org.id, name: "Runway Model" }),
    });
    const model = await modelRes.json();
    const scenarioRes = await app.request(`/v1/models/${model.id}/scenarios`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Base" }),
    });
    const scenario = await scenarioRes.json();
    const calcRes = await app.request(`/v1/models/${model.id}/calculations`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        scenarioId: scenario.id,
        assumptions: [
          { key: "cash_on_hand", value: 1_000_000, unit: "currency" },
          { key: "monthly_burn", value: 100_000, unit: "currency" },
          { key: "monthly_revenue", value: 50_000, unit: "currency" },
        ],
      }),
    });
    expect(calcRes.status).toBe(201);
    const calc = await calcRes.json();
    expect(calc.metrics.runway_months).toBe(20);
  });

  it("rejects aggregation below min cohort", async () => {
    const app = createApp();
    const orgRes = await app.request("/v1/organizations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Bank", slug: "bank" }),
    });
    const org = await orgRes.json();
    const modelRes = await app.request("/v1/models", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ organizationId: org.id, name: "Credit FL" }),
    });
    const model = await modelRes.json();
    const roundRes = await app.request("/v1/federation/rounds", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        modelId: model.id,
        modelVersionHash: "a".repeat(64),
        minCohortSize: 3,
      }),
    });
    const round = await roundRes.json();
    const agg = await app.request(`/v1/federation/rounds/${round.id}/aggregate`, {
      method: "POST",
    });
    expect(agg.status).toBe(409);
    const body = await agg.json();
    expect(body.error).toBe("cohort_too_small");
  });

  it("invokes calculate_runway AI tool", async () => {
    const app = createApp();
    const res = await app.request("/v1/ai/tools/calculate_runway", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        modelId: "11111111-1111-1111-1111-111111111111",
        scenarioId: "22222222-2222-2222-2222-222222222222",
        assumptions: [
          { key: "cash_on_hand", value: 500_000, unit: "currency" },
          { key: "monthly_burn", value: 50_000, unit: "currency" },
          { key: "monthly_revenue", value: 0, unit: "currency" },
        ],
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.result.metrics.runway_months).toBe(10);
  });
});
