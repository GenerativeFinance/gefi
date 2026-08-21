/*
 * Copyright 2026 GeFi Labs. Licensed under the Apache License, Version 2.0.
 * SPDX-License-Identifier: Apache-2.0
 *
 * Local hash-chain audit log for the node-agent.
 *
 * Mirrors the compliance Worker's audit-vault pattern: every event is
 * canonicalised, hashed, and chained to the previous hash. The agent's
 * audit log lives entirely on the customer's side — it never leaves the
 * VPC. When an auditor visits the customer site they walk this chain
 * locally and cross-check selected event roots against the orchestrator's
 * Merkle commitment for the same round.
 *
 * Storage is intentionally pluggable (`AuditSink`) so the operator can
 * point it at an append-only file, an S3 bucket, or whatever their
 * compliance team prefers. The reference `InMemoryAuditSink` is for
 * tests + ephemeral pilots.
 */

const ZERO_HASH = "0".repeat(64);
const enc = new TextEncoder();

function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonicalJson).join(",") + "]";
  const keys = Object.keys(value as Record<string, unknown>).sort();
  const obj = value as Record<string, unknown>;
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonicalJson(obj[k])).join(",") + "}";
}

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(s));
  const b = new Uint8Array(buf);
  let h = "";
  for (let i = 0; i < b.length; i++) h += b[i]!.toString(16).padStart(2, "0");
  return h;
}

export interface AuditEvent {
  /** Stable id, monotonic per-agent. */
  id: number;
  /** Event family — `round_invited`, `update_submitted`, etc. */
  kind: string;
  /** Canonicalised payload. Don't include secrets here. */
  payload: Record<string, unknown>;
  /** sha256(prev_hash || canonicalJson(payload)). 64-hex. */
  eventHash: string;
  /** Hash of the previous event in the chain, or ZERO_HASH for the genesis. */
  prevHash: string;
  /** Unix seconds. */
  ts: number;
}

export interface AuditSink {
  append(event: AuditEvent): Promise<void>;
  list(): Promise<AuditEvent[]>;
}

export class InMemoryAuditSink implements AuditSink {
  private readonly rows: AuditEvent[] = [];
  async append(event: AuditEvent): Promise<void> {
    this.rows.push(event);
  }
  async list(): Promise<AuditEvent[]> {
    return this.rows.slice();
  }
}

/**
 * Hash-chain logger. One instance per agent process. Not thread-safe —
 * customers running multi-process agents must serialise writes via a
 * lockfile or a single-writer log shipper.
 */
export class AuditLogger {
  private prevHash = ZERO_HASH;
  private nextId = 1;

  constructor(private readonly sink: AuditSink) {}

  /** Reload chain state from `sink` so a restarted agent picks up where it left off. */
  async resume(): Promise<void> {
    const rows = await this.sink.list();
    if (rows.length === 0) return;
    const last = rows[rows.length - 1]!;
    this.prevHash = last.eventHash;
    this.nextId = last.id + 1;
  }

  async log(kind: string, payload: Record<string, unknown>, ts: number = Math.floor(Date.now() / 1000)): Promise<AuditEvent> {
    const body = canonicalJson(payload);
    const eventHash = await sha256Hex(this.prevHash + body);
    const event: AuditEvent = {
      id: this.nextId++,
      kind,
      payload,
      eventHash,
      prevHash: this.prevHash,
      ts,
    };
    await this.sink.append(event);
    this.prevHash = eventHash;
    return event;
  }
}

/**
 * Independently re-walk a chain end-to-end. Returns `{ ok: true }` if
 * every link verifies, otherwise the index of the first broken row.
 */
export async function verifyChain(events: AuditEvent[]): Promise<{ ok: true } | { ok: false; brokenAt: number }> {
  let prev = ZERO_HASH;
  for (let i = 0; i < events.length; i++) {
    const e = events[i]!;
    if (e.prevHash !== prev) return { ok: false, brokenAt: i };
    const expected = await sha256Hex(prev + canonicalJson(e.payload));
    if (e.eventHash !== expected) return { ok: false, brokenAt: i };
    prev = e.eventHash;
  }
  return { ok: true };
}
