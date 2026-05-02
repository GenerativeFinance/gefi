/*
 * Copyright 2026 GeFi Labs. Licensed under the Apache License, Version 2.0.
 * SPDX-License-Identifier: Apache-2.0
 *
 * Data-source adapters used by the customer-hosted node-agent.
 *
 * The agent runs INSIDE the customer's data plane (their VPC, on-prem K8s,
 * or air-gapped enclave) and reads training data via these adapters. It
 * NEVER ships raw rows out — only the trained model update + DP noise +
 * Bonawitz mask. This file ships the *interfaces* + reference stubs; real
 * customer-specific adapters subclass these.
 *
 * Three adapter shapes cover ~95 % of the connectors customers ask for:
 *
 *   - SqlAdapter:    Postgres / MySQL / Snowflake / Databricks SQL.
 *   - NoSqlAdapter:  Mongo / DynamoDB / per-document store.
 *   - KafkaAdapter:  Streaming reads from a partition + offset checkpoint.
 *
 * Customers building rare integrations (proprietary HFT FIX feeds, etc.)
 * implement these interfaces directly. The training loop is adapter-agnostic.
 */

export interface DataBatch {
  /**
   * One inner array per training example. Each row's ordering must match
   * the feature order declared in `FeatureSchema.features` so the trainer
   * can multiply through against `weights` without a dictionary lookup.
   */
  X: Float64Array[];
  /** Targets, one per example. */
  y: Float64Array;
  /** Opaque cursor — the adapter advances past this on the next `read`. */
  cursor: string | null;
}

export interface DataAdapter {
  /** Schema declared by the operator at agent-init time. */
  readonly schema: FeatureSchema;
  /**
   * Read up to `maxRows` examples. Returns an empty batch if the source
   * has no more data. Adapters MUST be deterministic given the same
   * `cursor` for replay during dispute resolution.
   */
  read(cursor: string | null, maxRows: number): Promise<DataBatch>;
  /** Total row count (best-effort) for sample-count reporting. */
  count(): Promise<number>;
}

export interface FeatureSchema {
  features: string[];
  target: string;
}

/**
 * Stub adapter — generates a synthetic linear-regression dataset. Used
 * by tests + the bundled integration test that lets new operators
 * verify the agent's plumbing without wiring up a real DB.
 */
export class StubSyntheticAdapter implements DataAdapter {
  public readonly schema: FeatureSchema;
  private readonly rows: number;
  private readonly seed: number;

  constructor(opts: { rows: number; features: string[]; seed?: number }) {
    this.rows = opts.rows;
    this.seed = opts.seed ?? 1;
    this.schema = { features: opts.features, target: "y" };
  }

  async read(cursor: string | null, maxRows: number): Promise<DataBatch> {
    const start = cursor ? parseInt(cursor, 10) : 0;
    const end = Math.min(start + maxRows, this.rows);
    const X: Float64Array[] = [];
    const y = new Float64Array(end - start);
    // Deterministic synthetic targets: y = Σ (i+1) * x_i + ε
    let s = (this.seed + start) >>> 0;
    const next = () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let r = s;
      r = Math.imul(r ^ (r >>> 15), r | 1);
      r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = start; i < end; i++) {
      const row = new Float64Array(this.schema.features.length);
      let target = 0;
      for (let j = 0; j < row.length; j++) {
        const x = next();
        row[j] = x;
        target += (j + 1) * x;
      }
      X.push(row);
      y[i - start] = target + (next() - 0.5) * 0.01; // tiny noise
    }
    return { X, y, cursor: end >= this.rows ? null : String(end) };
  }

  async count(): Promise<number> {
    return this.rows;
  }
}

/** Reference SQL adapter — operator subclasses to wire their DB. */
export abstract class SqlAdapter implements DataAdapter {
  abstract readonly schema: FeatureSchema;
  abstract read(cursor: string | null, maxRows: number): Promise<DataBatch>;
  abstract count(): Promise<number>;
}

/** Reference NoSQL adapter — same shape, document-cursor semantics. */
export abstract class NoSqlAdapter implements DataAdapter {
  abstract readonly schema: FeatureSchema;
  abstract read(cursor: string | null, maxRows: number): Promise<DataBatch>;
  abstract count(): Promise<number>;
}

/** Reference Kafka adapter — `cursor` is a "topic:partition:offset" triple. */
export abstract class KafkaAdapter implements DataAdapter {
  abstract readonly schema: FeatureSchema;
  abstract read(cursor: string | null, maxRows: number): Promise<DataBatch>;
  abstract count(): Promise<number>;
}
