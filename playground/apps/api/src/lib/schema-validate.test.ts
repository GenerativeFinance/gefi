import { describe, expect, it } from "vitest";
import { validateAgainstSchema } from "./schema-validate.js";
import { PLAYGROUND_MOCKS } from "../data/playground-mocks.js";

describe("validateAgainstSchema", () => {
  it("accepts a valid object", () => {
    const r = validateAgainstSchema(
      { name: "GeFi", count: 4 },
      {
        type: "object",
        required: ["name"],
        properties: { name: { type: "string" }, count: { type: "integer", minimum: 0 } },
      },
    );
    expect(r.valid).toBe(true);
    expect(r.errors).toEqual([]);
  });

  it("flags missing required field", () => {
    const r = validateAgainstSchema(
      {},
      { type: "object", required: ["name"], properties: { name: { type: "string" } } },
    );
    expect(r.valid).toBe(false);
    expect(r.errors[0]?.path).toBe("name");
  });

  it("rejects extra properties when additionalProperties:false", () => {
    const r = validateAgainstSchema(
      { name: "x", evil: 1 },
      {
        type: "object",
        additionalProperties: false,
        properties: { name: { type: "string" } },
      },
    );
    expect(r.valid).toBe(false);
  });

  it("enforces numeric bounds + multipleOf", () => {
    const schema = { type: "number" as const, minimum: 0.1, maximum: 10, multipleOf: 0.1 };
    expect(validateAgainstSchema(0.05, schema).valid).toBe(false);
    expect(validateAgainstSchema(11, schema).valid).toBe(false);
    expect(validateAgainstSchema(0.15, schema).valid).toBe(false);
    expect(validateAgainstSchema(2.5, schema).valid).toBe(true);
  });

  it("validates enum + date format", () => {
    const r1 = validateAgainstSchema("xyz", { type: "string", enum: ["a", "b"] });
    expect(r1.valid).toBe(false);
    const r2 = validateAgainstSchema("2026-13-99", { type: "string", format: "date" });
    expect(r2.valid).toBe(false);
    const r3 = validateAgainstSchema("2026-04-15", { type: "string", format: "date" });
    expect(r3.valid).toBe(true);
  });

  it("walks array items + min/maxItems", () => {
    const schema = {
      type: "array" as const,
      minItems: 1,
      maxItems: 3,
      items: { type: "string" as const },
    };
    expect(validateAgainstSchema([], schema).valid).toBe(false);
    expect(validateAgainstSchema(["a", "b", "c", "d"], schema).valid).toBe(false);
    expect(validateAgainstSchema(["a", 1] as unknown[], schema).valid).toBe(false);
    expect(validateAgainstSchema(["a"], schema).valid).toBe(true);
  });

  it("validates each playground mock's defaultInput against its inputSchema", () => {
    for (const m of PLAYGROUND_MOCKS) {
      const r = validateAgainstSchema(m.defaultInput, m.inputSchema);
      expect(r.valid, `${m.slug}: ${JSON.stringify(r.errors)}`).toBe(true);
    }
  });
});
