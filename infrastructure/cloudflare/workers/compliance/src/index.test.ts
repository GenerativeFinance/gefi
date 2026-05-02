/**
 * End-to-end tests for the `gefi-compliance` Worker.
 *
 * Strategy: build a tiny in-memory shim of every binding the Worker needs
 * (D1, R2, KV, DurableObject namespace) and drive `worker.fetch()`
 * directly. The shim implements just enough of the D1 SQL surface to
 * cover the queries the Worker actually issues — see `runQuery()` for
 * the dispatch table.
 */

import { describe, expect, it, beforeEach } from "vitest";
import worker from "./index.js";
import type { ComplianceEnv, Region } from "@gefi/shared-types";

const ctx = {
  waitUntil: () => undefined,
  passThroughOnException: () => undefined,
  props: {},
} as unknown as ExecutionContext;

interface AuditRow {
  id: string;
  tenant_id: string | null;
  user_id: string | null;
  region: Region;
  kind: string;
  severity: string;
  payload_json: string;
  prev_hash: string;
  event_hash: string;
  chain_index: number;
  created_at: number;
}

interface CaseRow {
  id: string;
  tenant_id: string;
  region: Region;
  jurisdiction: string;
  rule_id: string;
  event_id: string;
  reviewer_role: string;
  reviewer_id: string | null;
  status: string;
  sla_deadline: number;
  signed_envelope_id: string | null;
  created_at: number;
  acknowledged_at: number | null;
  signed_at: number | null;
  closed_at: number | null;
}

interface CaseActionRow {
  id: string;
  case_id: string;
  kind: string;
  status: string;
  payload_json: string;
  result_json: string | null;
  created_at: number;
  completed_at: number | null;
}

interface AnchorRow {
  id: string;
  region: Region;
  first_event_id: string;
  last_event_id: string;
  event_count: number;
  merkle_root: string;
  polygon_tx_hash: string | null;
  polygon_block: number | null;
  status: string;
  created_at: number;
  anchored_at: number | null;
}

interface LawyerRow {
  id: string;
  jurisdiction: string;
  region: Region;
  role: string;
  display_name: string;
  firm: string;
  email: string;
  pgp_fingerprint: string | null;
  sla_ack_hours: number;
  active: number;
  created_at: number;
}

interface AssignmentRow {
  tenant_id: string;
  jurisdiction: string;
  role: string;
  lawyer_id: string;
}

interface ResidencyRow {
  tenant_id: string;
  region: Region;
  d1_database: string;
  r2_bucket: string;
  kv_namespace: string;
  regulators_json: string;
  last_verified_at: number;
  attestation_hash: string;
}

class FakeDb {
  audit: AuditRow[] = [];
  cases: CaseRow[] = [];
  caseActions: CaseActionRow[] = [];
  anchors: AnchorRow[] = [];
  lawyers: LawyerRow[] = [];
  assignments: AssignmentRow[] = [];
  residency: ResidencyRow[] = [];
}

function makePrepared(db: FakeDb, sql: string) {
  const trimmed = sql.replace(/\s+/g, " ").trim();
  return {
    bind(...args: unknown[]) {
      return {
        async first<T = unknown>(): Promise<T | null> {
          return runQueryFirst(db, trimmed, args) as T | null;
        },
        async run() {
          const result = runQueryRun(db, trimmed, args);
          return { meta: result };
        },
        async all<T = unknown>() {
          return { results: runQueryAll(db, trimmed, args) as T[] };
        },
      };
    },
    async first<T = unknown>(): Promise<T | null> {
      return runQueryFirst(db, trimmed, []) as T | null;
    },
    async run() {
      const result = runQueryRun(db, trimmed, []);
      return { meta: result };
    },
    async all<T = unknown>() {
      return { results: runQueryAll(db, trimmed, []) as T[] };
    },
  };
}

function makeFakeD1(db: FakeDb): D1Database {
  return {
    prepare: (sql: string) => makePrepared(db, sql),
    async batch(stmts: { run(): Promise<unknown> }[]) {
      const out: unknown[] = [];
      for (const s of stmts) out.push(await s.run());
      return out;
    },
    exec: async () => ({ count: 0, duration: 0 }),
    dump: async () => new ArrayBuffer(0),
  } as unknown as D1Database;
}

/** Pattern-match the SQL string and dispatch to the right in-memory op. */
function runQueryFirst(db: FakeDb, sql: string, args: unknown[]): unknown {
  // SELECT prev chain state
  if (sql.startsWith("SELECT event_hash AS eventHash, chain_index AS chainIndex FROM audit_events")) {
    const region = args[0] as Region;
    const filtered = db.audit.filter((r) => r.region === region).sort((a, b) => b.chain_index - a.chain_index);
    const r = filtered[0];
    return r ? { eventHash: r.event_hash, chainIndex: r.chain_index } : null;
  }
  // SELECT audit row by id
  if (sql.startsWith("SELECT id, region, event_hash AS eventHash, chain_index AS chainIndex FROM audit_events WHERE id =")) {
    const id = args[0] as string;
    const r = db.audit.find((x) => x.id === id);
    return r ? { id: r.id, region: r.region, eventHash: r.event_hash, chainIndex: r.chain_index } : null;
  }
  // SELECT health probe
  if (sql === "SELECT 1") {
    return { 1: 1 };
  }
  // SELECT existing anchor
  if (sql.startsWith("SELECT id, polygon_tx_hash AS polygonTxHash, status FROM audit_anchors")) {
    const region = args[0] as Region;
    const root = args[1] as string;
    const r = db.anchors.find((a) => a.region === region && a.merkle_root === root);
    return r ? { id: r.id, polygonTxHash: r.polygon_tx_hash, status: r.status } : null;
  }
  // SELECT anchor for proof endpoint
  if (sql.startsWith("SELECT id, region, polygon_tx_hash AS polygonTxHash, polygon_block AS polygonBlock,")) {
    const region = args[0] as Region;
    const root = args[1] as string;
    const r = db.anchors.find((a) => a.region === region && a.merkle_root === root);
    return r
      ? {
          id: r.id,
          region: r.region,
          polygonTxHash: r.polygon_tx_hash,
          polygonBlock: r.polygon_block,
          status: r.status,
          anchoredAt: r.anchored_at,
          firstEventId: r.first_event_id,
          lastEventId: r.last_event_id,
        }
      : null;
  }
  // SELECT case by id (cases handler)
  if (sql.startsWith("SELECT id, tenant_id AS tenantId, region, jurisdiction, rule_id AS ruleId, event_id AS eventId, reviewer_role AS reviewerRole, reviewer_id AS reviewerId, status, sla_deadline AS slaDeadline, signed_envelope_id")) {
    const id = args[0] as string;
    const c = db.cases.find((x) => x.id === id);
    if (!c) return null;
    return {
      id: c.id,
      tenantId: c.tenant_id,
      region: c.region,
      jurisdiction: c.jurisdiction,
      ruleId: c.rule_id,
      eventId: c.event_id,
      reviewerRole: c.reviewer_role,
      reviewerId: c.reviewer_id,
      status: c.status,
      slaDeadline: c.sla_deadline,
      signedEnvelopeId: c.signed_envelope_id,
      createdAt: c.created_at,
      acknowledgedAt: c.acknowledged_at,
      signedAt: c.signed_at,
      closedAt: c.closed_at,
    };
  }
  // SELECT residency
  if (sql.startsWith("SELECT tenant_id AS tenantId, region, d1_database AS d1Database")) {
    const id = args[0] as string;
    const r = db.residency.find((x) => x.tenant_id === id);
    if (!r) return null;
    return {
      tenantId: r.tenant_id,
      region: r.region,
      d1Database: r.d1_database,
      r2Bucket: r.r2_bucket,
      kvNamespace: r.kv_namespace,
      regulatorsJson: r.regulators_json,
      lastVerifiedAt: r.last_verified_at,
      attestationHash: r.attestation_hash,
    };
  }
  // SELECT region from compliance_cases (residency fallback lookup)
  if (sql.startsWith("SELECT region FROM compliance_cases")) {
    const id = args[0] as string;
    const c = db.cases.filter((x) => x.tenant_id === id).sort((a, b) => b.created_at - a.created_at)[0];
    return c ? { region: c.region } : null;
  }
  // SELECT lawyer assignment
  if (sql.includes("FROM tenant_assignments t INNER JOIN lawyer_directory l")) {
    const tenantId = args[0] as string;
    const juris = args[1] as string;
    const role = args[2] as string;
    const a = db.assignments.find((x) => x.tenant_id === tenantId && x.jurisdiction === juris && x.role === role);
    if (!a) return null;
    const l = db.lawyers.find((x) => x.id === a.lawyer_id);
    if (!l) return null;
    return {
      id: l.id,
      jurisdiction: l.jurisdiction,
      region: l.region,
      role: l.role,
      displayName: l.display_name,
      firm: l.firm,
      email: l.email,
      pgpFingerprint: l.pgp_fingerprint,
      slaAckHours: l.sla_ack_hours,
    };
  }
  return null;
}

function runQueryAll(db: FakeDb, sql: string, args: unknown[]): unknown[] {
  // List audit events for a region
  if (sql.startsWith("SELECT id, event_hash AS eventHash, prev_hash AS prevHash, chain_index AS chainIndex, region, created_at AS createdAt FROM audit_events")) {
    const region = args[0] as Region;
    return db.audit
      .filter((r) => r.region === region)
      .sort((a, b) => a.chain_index - b.chain_index)
      .map((r) => ({
        id: r.id,
        eventHash: r.event_hash,
        prevHash: r.prev_hash,
        chainIndex: r.chain_index,
        region: r.region,
        createdAt: r.created_at,
      }));
  }
  // List cases
  if (sql.startsWith("SELECT id, tenant_id AS tenantId, region, jurisdiction, rule_id AS ruleId, event_id AS eventId, reviewer_role AS reviewerRole, reviewer_id AS reviewerId, status, sla_deadline AS slaDeadline, created_at")) {
    let filtered = db.cases.slice();
    let argIdx = 0;
    if (sql.includes("tenant_id = ?")) {
      const t = args[argIdx++] as string;
      filtered = filtered.filter((c) => c.tenant_id === t);
    }
    if (sql.includes("status = ?")) {
      const s = args[argIdx++] as string;
      filtered = filtered.filter((c) => c.status === s);
    }
    return filtered.sort((a, b) => b.created_at - a.created_at);
  }
  // List case actions
  if (sql.startsWith("SELECT id, kind, status, payload_json AS payloadJson")) {
    const caseId = args[0] as string;
    return db.caseActions
      .filter((a) => a.case_id === caseId)
      .sort((a, b) => a.created_at - b.created_at)
      .map((a) => ({
        id: a.id,
        kind: a.kind,
        status: a.status,
        payloadJson: a.payload_json,
        resultJson: a.result_json,
        createdAt: a.created_at,
        completedAt: a.completed_at,
      }));
  }
  return [];
}

function runQueryRun(db: FakeDb, sql: string, args: unknown[]): { changes: number } {
  // INSERT audit_events
  if (sql.startsWith("INSERT INTO audit_events")) {
    const [id, tenant_id, user_id, region, kind, severity, payload_json, prev_hash, event_hash, chain_index, created_at] = args as [
      string, string | null, string | null, Region, string, string, string, string, string, number, number,
    ];
    if (db.audit.some((r) => r.event_hash === event_hash)) {
      throw new Error("UNIQUE constraint failed: audit_events.event_hash");
    }
    db.audit.push({ id, tenant_id, user_id, region, kind, severity, payload_json, prev_hash, event_hash, chain_index, created_at });
    return { changes: 1 };
  }
  // INSERT compliance_cases
  if (sql.startsWith("INSERT INTO compliance_cases")) {
    const [id, tenant_id, region, jurisdiction, rule_id, event_id, reviewer_role, reviewer_id, sla_deadline, created_at] = args as [
      string, string, Region, string, string, string, string, string | null, number, number,
    ];
    db.cases.push({
      id, tenant_id, region, jurisdiction, rule_id, event_id, reviewer_role, reviewer_id,
      status: "open", sla_deadline, signed_envelope_id: null, created_at,
      acknowledged_at: null, signed_at: null, closed_at: null,
    });
    return { changes: 1 };
  }
  // INSERT case_actions
  if (sql.startsWith("INSERT INTO case_actions")) {
    const [id, case_id, kind, status, payload_json, result_json, created_at, completed_at] = args as [
      string, string, string, string, string, string | null, number, number | null,
    ];
    db.caseActions.push({ id, case_id, kind, status, payload_json, result_json, created_at, completed_at });
    return { changes: 1 };
  }
  // INSERT audit_anchors
  if (sql.startsWith("INSERT INTO audit_anchors")) {
    const [id, region, first_event_id, last_event_id, event_count, merkle_root, polygon_tx_hash, polygon_block, status, created_at, anchored_at] =
      args as [string, Region, string, string, number, string, string | null, number | null, string, number, number | null];
    db.anchors.push({ id, region, first_event_id, last_event_id, event_count, merkle_root, polygon_tx_hash, polygon_block, status, created_at, anchored_at });
    return { changes: 1 };
  }
  // INSERT OR IGNORE lawyer_directory
  if (sql.startsWith("INSERT OR IGNORE INTO lawyer_directory")) {
    const [id, jurisdiction, region, role, display_name, firm, email, pgp_fingerprint, sla_ack_hours, , created_at] = args as [
      string, string, Region, string, string, string, string, string | null, number, number, number,
    ];
    if (db.lawyers.some((l) => l.id === id)) return { changes: 0 };
    db.lawyers.push({ id, jurisdiction, region, role, display_name, firm, email, pgp_fingerprint, sla_ack_hours, active: 1, created_at });
    return { changes: 1 };
  }
  // UPDATE compliance_cases (DO mirror)
  if (sql.startsWith("UPDATE compliance_cases")) {
    const [status, ackAt, signedAt, closedAt, envId, id] = args as [
      string, number | null, number | null, number | null, string | null, string,
    ];
    const c = db.cases.find((x) => x.id === id);
    if (c) {
      c.status = status;
      c.acknowledged_at = ackAt;
      c.signed_at = signedAt;
      c.closed_at = closedAt;
      c.signed_envelope_id = envId;
      return { changes: 1 };
    }
    return { changes: 0 };
  }
  return { changes: 0 };
}

class FakeDoStorage {
  data = new Map<string, unknown>();
  alarmAt: number | null = null;
  async get<T>(key: string): Promise<T | undefined> {
    return this.data.get(key) as T | undefined;
  }
  async put(key: string, value: unknown): Promise<void> {
    this.data.set(key, value);
  }
  async setAlarm(when: number): Promise<void> { this.alarmAt = when; }
  async deleteAlarm(): Promise<void> { this.alarmAt = null; }
}

class FakeDoStub {
  storage = new FakeDoStorage();
  state = { acknowledged: false };
  async fetch(input: Request | string, _init?: RequestInit): Promise<Response> {
    const url = typeof input === "string" ? input : input.url;
    const path = new URL(url).pathname;
    if (path === "/init") {
      this.state.acknowledged = true;
      return Response.json({ ok: true });
    }
    return Response.json({ ok: false, error: "stub" }, { status: 404 });
  }
}

function makeFakeDoNamespace(): { ns: DurableObjectNamespace; stubs: FakeDoStub[] } {
  const stubs: FakeDoStub[] = [];
  const ns = {
    idFromName: (_name: string) => ({ toString: () => "stub-id" } as unknown as DurableObjectId),
    idFromString: (_s: string) => ({ toString: () => _s } as unknown as DurableObjectId),
    newUniqueId: () => ({ toString: () => crypto.randomUUID() } as unknown as DurableObjectId),
    get: (_id: DurableObjectId) => {
      const stub = new FakeDoStub();
      stubs.push(stub);
      return stub as unknown as DurableObjectStub;
    },
    jurisdiction: undefined,
  } as unknown as DurableObjectNamespace;
  return { ns, stubs };
}

function makeEnv(db: FakeDb): { env: ComplianceEnv; doStubs: FakeDoStub[] } {
  const { ns, stubs } = makeFakeDoNamespace();
  const env: ComplianceEnv = {
    ENVIRONMENT: "dev",
    WORKER_REGION: "us",
    API_PUBLIC_URL: "http://localhost:8787",
    SITE_PUBLIC_URL: "http://localhost:8788",
    INTERNAL_SIGNING_KEY: "test-signing-key-32-chars-minimum-please-12345",
    DB: makeFakeD1(db),
    EVIDENCE: { head: async () => null } as unknown as R2Bucket,
    CACHE: { list: async () => ({ keys: [], list_complete: true }) } as unknown as KVNamespace,
    CASE_DO: ns,
  };
  return { env, doStubs: stubs };
}

describe("gefi-compliance worker", () => {
  let db: FakeDb;
  let env: ComplianceEnv;

  beforeEach(() => {
    db = new FakeDb();
    ({ env } = makeEnv(db));
  });

  it("returns 200 on /health without internal token", async () => {
    const res = await worker.fetch(new Request("https://compliance/health"), env, ctx);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; worker: string };
    expect(body.ok).toBe(true);
    expect(body.worker).toBe("gefi-compliance");
  });

  it("processes /events end-to-end (no rules triggered)", async () => {
    const req = new Request("https://compliance/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind: "subscription_created",
        tenantId: "t-1",
        region: "us",
        ts: 1_700_000_000,
        severity: "info",
      }),
    });
    const res = await worker.fetch(req, env, ctx);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; eventHash: string; chainIndex: number; cases: string[] };
    expect(body.ok).toBe(true);
    expect(body.eventHash).toMatch(/^[a-f0-9]{64}$/);
    expect(body.chainIndex).toBe(0);
    expect(db.audit).toHaveLength(1);
  });

  it("hash-chains successive events with monotonic chain_index", async () => {
    for (let i = 0; i < 3; i++) {
      const res = await worker.fetch(
        new Request("https://compliance/events", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind: "subscription_created",
            tenantId: "t-1",
            region: "us",
            ts: 1_700_000_000 + i,
          }),
        }),
        env,
        ctx,
      );
      expect(res.status).toBe(200);
    }
    expect(db.audit.map((r) => r.chain_index)).toEqual([0, 1, 2]);
    expect(db.audit[1]!.prev_hash).toBe(db.audit[0]!.event_hash);
    expect(db.audit[2]!.prev_hash).toBe(db.audit[1]!.event_hash);
  });

  it("returns a Merkle proof from /audit/proof/:event_id", async () => {
    // Write three events first.
    const ids: string[] = [];
    for (let i = 0; i < 3; i++) {
      const id = `evt-${i}`;
      const res = await worker.fetch(
        new Request("https://compliance/events", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            id,
            kind: "subscription_created",
            tenantId: "t-1",
            region: "us",
            ts: 1_700_000_000 + i,
          }),
        }),
        env,
        ctx,
      );
      expect(res.status).toBe(200);
      ids.push(id);
    }
    const proofRes = await worker.fetch(
      new Request(`https://compliance/audit/proof/${ids[1]}`),
      env,
      ctx,
    );
    expect(proofRes.status).toBe(200);
    const proof = (await proofRes.json()) as {
      ok: boolean; eventId: string; leaf: string; root: string; path: { sibling: string; position: "left" | "right" }[];
    };
    expect(proof.ok).toBe(true);
    expect(proof.eventId).toBe(ids[1]);
    expect(proof.path.length).toBeGreaterThan(0);
  });

  it("appends a Merkle anchor row from /admin/anchor", async () => {
    // One event then anchor.
    await worker.fetch(
      new Request("https://compliance/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "subscription_created", tenantId: "t-1", region: "us", ts: 1_700_000_000 }),
      }),
      env,
      ctx,
    );
    const res = await worker.fetch(
      new Request("https://compliance/admin/anchor", {
        method: "POST",
        headers: { "content-type": "application/json", "content-length": "16" },
        body: JSON.stringify({ region: "us" }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; merkleRoot: string; eventCount: number };
    expect(body.ok).toBe(true);
    expect(body.merkleRoot).toMatch(/^[a-f0-9]{64}$/);
    expect(body.eventCount).toBe(1);
    expect(db.anchors).toHaveLength(1);
    expect(db.anchors[0]!.merkle_root).toBe(body.merkleRoot);
  });

  it("/admin/anchor is idempotent on the same root", async () => {
    await worker.fetch(
      new Request("https://compliance/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "subscription_created", tenantId: "t-1", region: "us", ts: 1_700_000_000 }),
      }),
      env,
      ctx,
    );
    const first = await worker.fetch(
      new Request("https://compliance/admin/anchor", { method: "POST", headers: { "content-length": "0" } }),
      env,
      ctx,
    );
    const firstBody = (await first.json()) as { merkleRoot: string };
    const second = await worker.fetch(
      new Request("https://compliance/admin/anchor", { method: "POST", headers: { "content-length": "0" } }),
      env,
      ctx,
    );
    const secondBody = (await second.json()) as { merkleRoot: string; reason?: string };
    expect(secondBody.merkleRoot).toBe(firstBody.merkleRoot);
    expect(secondBody.reason).toBe("duplicate_root");
    expect(db.anchors).toHaveLength(1);
  });

  it("rejects unauthenticated calls when COMPLIANCE_INTERNAL_TOKEN is set", async () => {
    env.COMPLIANCE_INTERNAL_TOKEN = "secret-token";
    const res = await worker.fetch(
      new Request("https://compliance/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("internal_token_required");
  });

  it("accepts a request with the matching internal token", async () => {
    env.COMPLIANCE_INTERNAL_TOKEN = "secret-token";
    const res = await worker.fetch(
      new Request("https://compliance/events", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-Gefi-Internal-Token": "secret-token",
        },
        body: JSON.stringify({ kind: "subscription_created", tenantId: "t-1", region: "us", ts: 1 }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
  });

  it("triggers a SEC review case for model_listed in us jurisdiction", async () => {
    const res = await worker.fetch(
      new Request("https://compliance/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "model_listed",
          tenantId: "t-1",
          region: "us",
          ts: 1_700_000_000,
          severity: "info",
          payload: { jurisdiction: "sec" },
        }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { triggered: { ruleId: string; jurisdiction: string }[]; cases: string[] };
    expect(body.triggered.length).toBeGreaterThan(0);
    expect(body.cases.length).toBe(body.triggered.length);
    expect(db.cases.length).toBe(body.triggered.length);
  });

  it("returns synthetic residency for unknown tenants", async () => {
    const res = await worker.fetch(
      new Request("https://compliance/residency/unknown-tenant"),
      env,
      ctx,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean; attestation: { region: string; regulators: string[] }; source: string };
    expect(body.ok).toBe(true);
    expect(body.source).toBe("synthetic");
    expect(body.attestation.region).toBe("us");
    expect(body.attestation.regulators).toContain("sec");
  });

  it("seeds the lawyer directory idempotently", async () => {
    const first = await worker.fetch(
      new Request("https://compliance/admin/seed-directory", { method: "POST" }),
      env,
      ctx,
    );
    expect(first.status).toBe(200);
    const firstBody = (await first.json()) as { inserted: number; skipped: number };
    expect(firstBody.inserted).toBeGreaterThan(0);
    const second = await worker.fetch(
      new Request("https://compliance/admin/seed-directory", { method: "POST" }),
      env,
      ctx,
    );
    const secondBody = (await second.json()) as { inserted: number; skipped: number };
    expect(secondBody.inserted).toBe(0);
    expect(secondBody.skipped).toBe(firstBody.inserted);
  });
});
