/*
 * Copyright 2026 GeFi Labs. Licensed under the Apache License, Version 2.0.
 * SPDX-License-Identifier: Apache-2.0
 *
 * In-process feature server.
 *
 * The federated feature store works like this:
 *
 *   1. The data-provider operator declares a `FeatureDefinition` in the
 *      orchestrator's catalogue (`POST /v1/features/definitions`).
 *   2. The agent on the data provider's side runs a small HTTP server
 *      that responds to `POST /lookup` with the feature value for a
 *      caller-supplied key.
 *   3. The orchestrator's `@gefi/feature-store` client calls that
 *      endpoint via a server-binding or signed HTTPS hop and caches
 *      the result regionally.
 *
 * This file implements the server-side handler — agnostic of HTTP
 * framework so the operator can plug it into whatever they already
 * run (Express, Fastify, raw Node http, Cloudflare Worker, etc.). Just
 * import `FeatureServer` and pass requests through `handle({ feature, key })`.
 */

import type { FeatureSchema } from "./adapters.js";

export interface FeatureLookupRequest {
  feature: string;
  key: string;
}

export interface FeatureLookupResponse {
  ok: true;
  feature: string;
  key: string;
  value: unknown;
  /** Schema version for the feature when computed. */
  schemaVersion: string;
}

export interface FeatureLookupError {
  ok: false;
  error: string;
}

export interface FeatureProvider {
  /** Schema version surfaced in the response. */
  schemaVersion: string;
  /** Validate that the named feature is one this agent is willing to serve. */
  schema: FeatureSchema;
  /** Look up `key` and return the canonical value, or null if missing. */
  resolve(feature: string, key: string): Promise<unknown | null>;
}

export class FeatureServer {
  constructor(private readonly provider: FeatureProvider) {}

  async handle(req: FeatureLookupRequest): Promise<FeatureLookupResponse | FeatureLookupError> {
    if (typeof req.feature !== "string" || req.feature.length === 0) {
      return { ok: false, error: "missing_feature" };
    }
    if (typeof req.key !== "string" || req.key.length === 0) {
      return { ok: false, error: "missing_key" };
    }
    if (!this.provider.schema.features.includes(req.feature)) {
      return { ok: false, error: "unknown_feature" };
    }
    let value: unknown;
    try {
      value = await this.provider.resolve(req.feature, req.key);
    } catch (err) {
      return { ok: false, error: `resolve_failed: ${err instanceof Error ? err.message : "unknown"}` };
    }
    if (value === null || value === undefined) {
      return { ok: false, error: "key_not_found" };
    }
    return {
      ok: true,
      feature: req.feature,
      key: req.key,
      value,
      schemaVersion: this.provider.schemaVersion,
    };
  }
}

/**
 * Reference in-memory provider — backs tests + the built-in demo. Real
 * customer providers wrap a SQL/RPC call here.
 */
export class InMemoryFeatureProvider implements FeatureProvider {
  public readonly schemaVersion: string;
  public readonly schema: FeatureSchema;
  private readonly store = new Map<string, unknown>();

  constructor(opts: { schemaVersion: string; schema: FeatureSchema }) {
    this.schemaVersion = opts.schemaVersion;
    this.schema = opts.schema;
  }
  put(feature: string, key: string, value: unknown): void {
    this.store.set(`${feature}:${key}`, value);
  }
  async resolve(feature: string, key: string): Promise<unknown | null> {
    const v = this.store.get(`${feature}:${key}`);
    return v === undefined ? null : v;
  }
}
