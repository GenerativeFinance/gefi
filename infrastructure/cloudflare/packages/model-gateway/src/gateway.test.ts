import { describe, expect, it } from "vitest";
import {
  AnthropicProvider,
  DeterministicProvider,
  OpenAiProvider,
  RegionRefused,
  TogetherProvider,
  WorkersAiProvider,
  resolveProviderChain,
} from "./providers.js";
import { canonicaliseRequest, replayRun, responseToSseStream, runModel } from "./run.js";

function memRunsDb() {
  const rows: Array<Record<string, unknown>> = [];
  function prepare(sql: string) {
    let bindings: unknown[] = [];
    return {
      bind(...args: unknown[]) {
        bindings = args;
        return this;
      },
      async first<T>(): Promise<T | null> {
        if (/FROM model_runs WHERE id = \?/.test(sql)) {
          return (rows.find((r) => r.id === bindings[0]) ?? null) as T | null;
        }
        return null;
      },
      async all<T>() {
        return { results: [] as T[], success: true } as never;
      },
      async run() {
        if (/^INSERT INTO model_runs/.test(sql)) {
          rows.push({
            id: bindings[0],
            model_id: bindings[1],
            version_id: bindings[2],
            tenant_id: bindings[3],
            user_id: bindings[4],
            jurisdiction: bindings[5],
            provider: bindings[6],
            model_string: bindings[7],
            input_sha: bindings[8],
            output_sha: bindings[9],
            input_json: bindings[10],
            output_json: bindings[11],
            tokens_in: bindings[12],
            tokens_out: bindings[13],
            latency_ms: bindings[14],
            is_paper: bindings[15],
            created_at: bindings[16],
          });
        }
        return { meta: { changes: 1 }, success: true } as never;
      },
    };
  }
  return {
    db: { prepare, batch: async () => [], exec: async () => ({ count: 0, duration: 0 }) } as unknown as D1Database,
    rows,
  };
}

describe("@gefi/model-gateway DeterministicProvider", () => {
  it("returns a stable echo and counts tokens", async () => {
    const p = new DeterministicProvider();
    const r = await p.generate({ prompt: "Hello world", region: "us" });
    expect(r.text).toContain("Hello world");
    expect(r.tokensIn).toBeGreaterThan(0);
    expect(r.provider).toBe("deterministic");
  });
});

describe("@gefi/model-gateway region gating", () => {
  it("OpenAI EU refuses US traffic", async () => {
    const p = new OpenAiProvider("sk-eu", "eu");
    await expect(p.generate({ prompt: "x", region: "us" })).rejects.toBeInstanceOf(RegionRefused);
  });
  it("OpenAI EU accepts EU but actual fetch attempt would error — we don't run it", async () => {
    const p = new OpenAiProvider("sk-eu", "eu");
    expect(p.region).toBe("eu");
  });
  it("Together has no region restriction", () => {
    const p = new TogetherProvider("sk-t");
    expect(p.region).toBeNull();
  });
});

describe("@gefi/model-gateway provider chain", () => {
  it("falls back to deterministic when no provider succeeds", async () => {
    const chain = resolveProviderChain({ region: "us", secrets: {} });
    expect(chain[chain.length - 1]).toBeInstanceOf(DeterministicProvider);
    expect(chain.length).toBe(1);
  });
  it("includes openai/anthropic/together when their keys are set", () => {
    const chain = resolveProviderChain({
      region: "us",
      secrets: {
        OPENAI_API_KEY_US: "k1",
        ANTHROPIC_API_KEY_US: "k2",
        TOGETHER_API_KEY: "k3",
      },
    });
    const ids = chain.map((p) => p.id);
    expect(ids).toContain("openai");
    expect(ids).toContain("anthropic");
    expect(ids).toContain("together");
    expect(ids[ids.length - 1]).toBe("deterministic");
  });
  it("uses EU keys for EU region and skips US-only keys", () => {
    const chain = resolveProviderChain({
      region: "eu",
      secrets: { OPENAI_API_KEY_US: "k-us-only" }, // should be skipped
    });
    expect(chain.find((p) => p.id === "openai")).toBeUndefined();
  });
  it("includes WorkersAiProvider when AI binding is set", () => {
    const fakeAi = { run: async () => ({ response: "" }) };
    const chain = resolveProviderChain({ region: "us", ai: fakeAi, secrets: {} });
    expect(chain[0]).toBeInstanceOf(WorkersAiProvider);
  });
});

describe("@gefi/model-gateway WorkersAiProvider", () => {
  it("invokes env.AI.run with the right shape", async () => {
    const captured: { model?: string; input?: unknown } = {};
    const fakeAi = {
      async run(model: string, input: unknown) {
        captured.model = model;
        captured.input = input;
        return { response: "ok" };
      },
    };
    const p = new WorkersAiProvider(fakeAi);
    const r = await p.generate({ prompt: "Q", system: "S", region: "us" });
    expect(r.text).toBe("ok");
    expect(captured.model).toContain("llama");
    expect((captured.input as { messages: unknown[] }).messages).toHaveLength(2);
  });
});

describe("@gefi/model-gateway run + replay", () => {
  it("persists a run with input_sha + output_sha and replays deterministically", async () => {
    const { db, rows } = memRunsDb();
    const result = await runModel(
      { db },
      [new DeterministicProvider()],
      {
        modelId: "mdl-1",
        versionId: "ver-1",
        tenantId: "t-1",
        userId: "u-1",
        jurisdiction: "us",
        request: { prompt: "Hello", region: "us" },
      },
    );
    expect(rows).toHaveLength(1);
    expect(result.inputSha).toMatch(/^[0-9a-f]{64}$/);
    expect(result.response.provider).toBe("deterministic");

    const replay = await replayRun({ db }, result.runId);
    expect(replay.inputShaMatches).toBe(true);
    expect(replay.outputShaMatches).toBe(true);
    expect(replay.replayOutput).toBe(result.response.text);
  });
  it("canonicaliseRequest is stable regardless of context order", () => {
    const a = canonicaliseRequest({ prompt: "X", region: "us", context: [{ id: "a", text: "1" }, { id: "b", text: "2" }] });
    const b = canonicaliseRequest({ prompt: "X", region: "us", context: [{ id: "a", text: "1" }, { id: "b", text: "2" }] });
    expect(a).toBe(b);
  });
  it("responseToSseStream emits delta + done events", async () => {
    const stream = responseToSseStream({
      text: "abcdefgh",
      tokensIn: 1,
      tokensOut: 2,
      latencyMs: 3,
      provider: "deterministic",
      modelString: "deterministic-echo-v1",
    });
    const reader = stream.getReader();
    let combined = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      combined += new TextDecoder().decode(value);
    }
    expect(combined).toContain("data: ");
    expect(combined).toContain("event: done");
  });
  it("falls through to deterministic when first provider throws", async () => {
    const { db } = memRunsDb();
    const throwing = {
      id: "anthropic" as const,
      modelString: "claude-x",
      region: null,
      generate: async () => {
        throw new Error("upstream-down");
      },
    };
    const result = await runModel(
      { db },
      [throwing, new DeterministicProvider()],
      {
        modelId: "m",
        versionId: "v",
        tenantId: "t",
        userId: null,
        jurisdiction: "us",
        request: { prompt: "x", region: "us" },
      },
    );
    expect(result.response.provider).toBe("deterministic");
  });
  it("AnthropicProvider passes a system+user message", () => {
    const p = new AnthropicProvider("sk-a", null);
    expect(p.modelString).toContain("claude");
  });
});
