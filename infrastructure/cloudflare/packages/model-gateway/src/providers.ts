/**
 * Model gateway provider abstraction.
 *
 * All providers implement the same `InferenceProvider` shape so the run
 * service can fall through a chain (`workers_ai → openai → anthropic →
 * together`) without branching. Each provider knows its own jurisdiction
 * gate: a provider configured for `us` will refuse `eu` traffic and vice
 * versa, surfacing as `RegionRefused` so the chain can keep going.
 */

import type { AiProviderSecrets, Region } from "@gefi/shared-types";

export interface InferenceRequest {
  /** Provider-agnostic prompt — providers translate to their schema. */
  prompt: string;
  /** Optional system message. */
  system?: string;
  /** Maximum new tokens the provider should generate. */
  maxTokens?: number;
  /** Sampling temperature, 0..2. */
  temperature?: number;
  /** Region of the *caller*. Providers reject when their region is set and differs. */
  region: Region;
  /** Optional structured input that providers may choose to attach (e.g. RAG chunks). */
  context?: Array<{ id: string; text: string }>;
}

export interface InferenceResponse {
  text: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  provider: string;
  modelString: string;
}

export class RegionRefused extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegionRefused";
  }
}

export interface InferenceProvider {
  readonly id: "workers_ai" | "openai" | "anthropic" | "together" | "deterministic";
  readonly modelString: string;
  /** Region this provider is configured to serve. `null` = any. */
  readonly region: Region | null;
  generate(req: InferenceRequest): Promise<InferenceResponse>;
}

/**
 * Deterministic provider — used in tests and any environment that doesn't
 * have a real provider configured. The output is a stable function of the
 * input, so the replay endpoint always returns the same answer.
 */
export class DeterministicProvider implements InferenceProvider {
  readonly id = "deterministic" as const;
  readonly modelString = "deterministic-echo-v1";
  readonly region: Region | null = null;
  async generate(req: InferenceRequest): Promise<InferenceResponse> {
    const start = Date.now();
    const tokensIn = Math.ceil((req.prompt.length + (req.system?.length ?? 0)) / 4);
    const text = `[deterministic] ${req.prompt.slice(0, 240)}`;
    const tokensOut = Math.ceil(text.length / 4);
    return {
      text,
      tokensIn,
      tokensOut,
      latencyMs: Date.now() - start,
      provider: this.id,
      modelString: this.modelString,
    };
  }
}

export class WorkersAiProvider implements InferenceProvider {
  readonly id = "workers_ai" as const;
  readonly modelString: string;
  readonly region: Region | null = null;
  private readonly ai: { run: (m: string, input: unknown) => Promise<unknown> };

  constructor(ai: { run: (m: string, input: unknown) => Promise<unknown> }, modelString = "@cf/meta/llama-3.1-8b-instruct") {
    this.ai = ai;
    this.modelString = modelString;
  }

  async generate(req: InferenceRequest): Promise<InferenceResponse> {
    const start = Date.now();
    const messages: Array<{ role: string; content: string }> = [];
    if (req.system) messages.push({ role: "system", content: req.system });
    messages.push({ role: "user", content: req.prompt });
    const out = (await this.ai.run(this.modelString, {
      messages,
      max_tokens: req.maxTokens ?? 512,
      temperature: req.temperature ?? 0.7,
    })) as { response?: string; result?: { response?: string } };
    const text = out.response ?? out.result?.response ?? "";
    const tokensIn = Math.ceil((req.prompt.length + (req.system?.length ?? 0)) / 4);
    const tokensOut = Math.ceil(text.length / 4);
    return {
      text,
      tokensIn,
      tokensOut,
      latencyMs: Date.now() - start,
      provider: this.id,
      modelString: this.modelString,
    };
  }
}

abstract class HttpProvider implements InferenceProvider {
  abstract readonly id: InferenceProvider["id"];
  abstract readonly modelString: string;
  abstract readonly region: Region | null;
  protected enforceRegion(req: InferenceRequest): void {
    if (this.region && this.region !== req.region) {
      throw new RegionRefused(`provider_${this.id}_region_${this.region}_refuses_${req.region}`);
    }
  }
  abstract generate(req: InferenceRequest): Promise<InferenceResponse>;
}

export class OpenAiProvider extends HttpProvider {
  readonly id = "openai" as const;
  readonly modelString: string;
  readonly region: Region | null;
  private readonly apiKey: string;

  constructor(apiKey: string, region: Region | null, modelString = "gpt-4o-mini") {
    super();
    this.apiKey = apiKey;
    this.region = region;
    this.modelString = modelString;
  }

  async generate(req: InferenceRequest): Promise<InferenceResponse> {
    this.enforceRegion(req);
    const start = Date.now();
    const messages: Array<{ role: string; content: string }> = [];
    if (req.system) messages.push({ role: "system", content: req.system });
    messages.push({ role: "user", content: req.prompt });
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.modelString,
        messages,
        max_tokens: req.maxTokens ?? 512,
        temperature: req.temperature ?? 0.7,
      }),
    });
    if (!res.ok) throw new Error(`openai_error_${res.status}`);
    const out = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const text = out.choices?.[0]?.message?.content ?? "";
    return {
      text,
      tokensIn: out.usage?.prompt_tokens ?? Math.ceil(req.prompt.length / 4),
      tokensOut: out.usage?.completion_tokens ?? Math.ceil(text.length / 4),
      latencyMs: Date.now() - start,
      provider: this.id,
      modelString: this.modelString,
    };
  }
}

export class AnthropicProvider extends HttpProvider {
  readonly id = "anthropic" as const;
  readonly modelString: string;
  readonly region: Region | null;
  private readonly apiKey: string;

  constructor(apiKey: string, region: Region | null, modelString = "claude-3-5-sonnet-latest") {
    super();
    this.apiKey = apiKey;
    this.region = region;
    this.modelString = modelString;
  }

  async generate(req: InferenceRequest): Promise<InferenceResponse> {
    this.enforceRegion(req);
    const start = Date.now();
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.modelString,
        max_tokens: req.maxTokens ?? 512,
        temperature: req.temperature ?? 0.7,
        system: req.system,
        messages: [{ role: "user", content: req.prompt }],
      }),
    });
    if (!res.ok) throw new Error(`anthropic_error_${res.status}`);
    const out = (await res.json()) as {
      content?: Array<{ text?: string }>;
      usage?: { input_tokens?: number; output_tokens?: number };
    };
    const text = out.content?.[0]?.text ?? "";
    return {
      text,
      tokensIn: out.usage?.input_tokens ?? Math.ceil(req.prompt.length / 4),
      tokensOut: out.usage?.output_tokens ?? Math.ceil(text.length / 4),
      latencyMs: Date.now() - start,
      provider: this.id,
      modelString: this.modelString,
    };
  }
}

export class TogetherProvider extends HttpProvider {
  readonly id = "together" as const;
  readonly modelString: string;
  readonly region: Region | null = null; // Together has no per-region restriction
  private readonly apiKey: string;

  constructor(apiKey: string, modelString = "meta-llama/Llama-3.1-8B-Instruct-Turbo") {
    super();
    this.apiKey = apiKey;
    this.modelString = modelString;
  }

  async generate(req: InferenceRequest): Promise<InferenceResponse> {
    this.enforceRegion(req);
    const start = Date.now();
    const messages: Array<{ role: string; content: string }> = [];
    if (req.system) messages.push({ role: "system", content: req.system });
    messages.push({ role: "user", content: req.prompt });
    const res = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.modelString,
        messages,
        max_tokens: req.maxTokens ?? 512,
        temperature: req.temperature ?? 0.7,
      }),
    });
    if (!res.ok) throw new Error(`together_error_${res.status}`);
    const out = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const text = out.choices?.[0]?.message?.content ?? "";
    return {
      text,
      tokensIn: out.usage?.prompt_tokens ?? Math.ceil(req.prompt.length / 4),
      tokensOut: out.usage?.completion_tokens ?? Math.ceil(text.length / 4),
      latencyMs: Date.now() - start,
      provider: this.id,
      modelString: this.modelString,
    };
  }
}

/**
 * Build the per-call provider chain. Order matters: the gateway tries
 * each in turn until one succeeds. The deterministic provider is *always*
 * appended at the tail so any environment can run end-to-end.
 */
export function resolveProviderChain(args: {
  region: Region;
  ai?: { run: (m: string, input: unknown) => Promise<unknown> };
  secrets: AiProviderSecrets;
}): InferenceProvider[] {
  const chain: InferenceProvider[] = [];
  if (args.ai) chain.push(new WorkersAiProvider(args.ai));
  const openaiKey = args.region === "eu" ? args.secrets.OPENAI_API_KEY_EU : args.secrets.OPENAI_API_KEY_US;
  if (openaiKey) chain.push(new OpenAiProvider(openaiKey, args.region));
  const anthropicKey =
    args.region === "eu" ? args.secrets.ANTHROPIC_API_KEY_EU : args.secrets.ANTHROPIC_API_KEY_US;
  if (anthropicKey) chain.push(new AnthropicProvider(anthropicKey, args.region));
  // Together (api.together.xyz) has no documented EU-resident
  // endpoint and the provider's `region` is `null` — meaning
  // `enforceRegion` does NOT refuse EU traffic. Including it for EU
  // requests would silently route prompt + context through a non-EU
  // datacenter and violate residency. We therefore restrict Together
  // to US-region calls. If/when Together publishes an EU endpoint,
  // wire that in as a separate `TOGETHER_API_KEY_EU` secret + EU
  // base URL and gate by region the same way OpenAI/Anthropic are.
  if (args.region === "us" && args.secrets.TOGETHER_API_KEY) {
    chain.push(new TogetherProvider(args.secrets.TOGETHER_API_KEY));
  }
  chain.push(new DeterministicProvider());
  return chain;
}
