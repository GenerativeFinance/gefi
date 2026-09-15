import { describe, expect, it } from "vitest";
import { invokeTool } from "./index.js";

describe("ai tools", () => {
  it("create_model returns draft", () => {
    const r = invokeTool("create_model", {
      organizationId: "00000000-0000-4000-8000-000000000010",
      name: "Test",
    });
    expect(r.ok).toBe(true);
    expect((r.result as { status: string }).status).toBe("draft");
  });

  it("calculate_runway requires assumptions", () => {
    const r = invokeTool("calculate_runway", {
      modelId: "11111111-1111-1111-1111-111111111111",
      scenarioId: "22222222-2222-2222-2222-222222222222",
      assumptions: [],
    });
    expect(r.ok).toBe(false);
  });
});
