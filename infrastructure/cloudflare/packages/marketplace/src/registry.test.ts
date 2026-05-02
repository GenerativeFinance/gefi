import { describe, expect, it } from "vitest";
import {
  approveVersion,
  createModel,
  getMetadata,
  getModel,
  listModels,
  listVersions,
  modelToCard,
  publishVersion,
  setModelStatus,
  sha256Hex,
  upsertMetadata,
} from "./registry.js";
import { StubModelAnchor, resolveModelAnchor } from "./anchor.js";

interface Row {
  [k: string]: unknown;
}

/**
 * In-memory D1 stub. Implements only what the registry uses: prepare()
 * with bind(), first(), all(), run(); plus tracking inserted rows by table.
 * Why custom: registry uses parameterised queries with positional binds
 * we'd otherwise have to re-implement against a real sqlite. This is
 * smaller and lets us assert on the exact SQL sent.
 */
function memDb() {
  const tables = new Map<string, Row[]>();
  tables.set("models", []);
  tables.set("model_versions", []);
  tables.set("model_metadata", []);

  function prepare(sql: string) {
    let bindings: unknown[] = [];
    return {
      bind(...args: unknown[]) {
        bindings = args;
        return this;
      },
      async first<T>(): Promise<T | null> {
        if (/FROM models WHERE id = \? OR slug = \?/.test(sql)) {
          const id = bindings[0] as string;
          const slug = bindings[1] as string;
          return ((tables.get("models") ?? []).find((r) => r.id === id || r.slug === slug) ?? null) as T | null;
        }
        if (/FROM models WHERE id = \?/.test(sql)) {
          return ((tables.get("models") ?? []).find((r) => r.id === bindings[0]) ?? null) as T | null;
        }
        if (/FROM model_versions WHERE id = \?/.test(sql)) {
          return ((tables.get("model_versions") ?? []).find((r) => r.id === bindings[0]) ?? null) as T | null;
        }
        if (/FROM model_metadata WHERE model_id = \?/.test(sql)) {
          return ((tables.get("model_metadata") ?? []).find((r) => r.model_id === bindings[0]) ?? null) as T | null;
        }
        return null;
      },
      async all<T>() {
        let rows: Row[] = [];
        if (/FROM models/.test(sql)) {
          rows = [...(tables.get("models") ?? [])];
          if (/jurisdiction = \?/.test(sql)) {
            const idx = sql.split("?").length;
            void idx;
          }
        } else if (/FROM model_versions WHERE model_id = \?/.test(sql)) {
          rows = (tables.get("model_versions") ?? []).filter((r) => r.model_id === bindings[0]);
        } else if (/FROM model_metadata WHERE model_id IN/.test(sql)) {
          rows = (tables.get("model_metadata") ?? []).filter((r) => bindings.includes(r.model_id));
        }
        return { results: rows as T[], success: true } as never;
      },
      async run() {
        if (/^INSERT INTO models /.test(sql)) {
          tables.get("models")!.push({
            id: bindings[0],
            slug: bindings[1],
            developer_tenant_id: bindings[2],
            jurisdiction: bindings[3],
            name: bindings[4],
            summary: bindings[5],
            category: bindings[6],
            risk_class: bindings[7],
            status: "draft",
            visibility: bindings[8],
            current_version_id: null,
            monthly_price_cents: bindings[9],
            developer_share_bps: 7000,
            federation_enabled: bindings[10],
            created_at: bindings[11],
            updated_at: bindings[12],
          });
        } else if (/^INSERT INTO model_versions /.test(sql)) {
          tables.get("model_versions")!.push({
            id: bindings[0],
            model_id: bindings[1],
            version: bindings[2],
            artifact_r2_key: bindings[3],
            artifact_sha256: bindings[4],
            artifact_size: bindings[5],
            manifest_json: bindings[6],
            chain_tx_hash: bindings[7],
            approved_at: null,
            created_at: bindings[8],
          });
        } else if (/^INSERT INTO model_metadata /.test(sql)) {
          const tbl = tables.get("model_metadata")!;
          const existing = tbl.findIndex((r) => r.model_id === bindings[0]);
          const row: Row = {
            model_id: bindings[0],
            long_description: bindings[1],
            inputs_json: bindings[2],
            outputs_json: bindings[3],
            metrics_json: bindings[4],
            risk_json: bindings[5],
            jurisdictions_supported_json: bindings[6],
            updated_at: bindings[7],
          };
          if (existing >= 0) tbl[existing] = row;
          else tbl.push(row);
        } else if (/^UPDATE models SET status = \?, updated_at/.test(sql)) {
          const m = tables.get("models")!.find((r) => r.id === bindings[2]);
          if (m) {
            m.status = bindings[0];
            m.updated_at = bindings[1];
          }
        } else if (/^UPDATE model_versions SET approved_at/.test(sql)) {
          const v = tables.get("model_versions")!.find((r) => r.id === bindings[1]);
          if (v) v.approved_at = bindings[0];
        } else if (/^UPDATE models SET current_version_id/.test(sql)) {
          const m = tables.get("models")!.find((r) => r.id === bindings[2]);
          if (m) {
            m.current_version_id = bindings[0];
            m.status = "approved";
            m.updated_at = bindings[1];
          }
        }
        return { meta: { changes: 1 }, success: true } as never;
      },
    };
  }
  return { prepare, batch: async () => [], exec: async () => ({ count: 0, duration: 0 }), tables } as unknown as D1Database & { tables: Map<string, Row[]> };
}

function memR2(): R2Bucket {
  const store = new Map<string, Uint8Array>();
  return {
    put: async (key: string, body: ArrayBuffer | Uint8Array) => {
      const u8 = body instanceof Uint8Array ? body : new Uint8Array(body);
      store.set(key, u8);
      return { key } as never;
    },
    get: async (key: string) =>
      store.has(key)
        ? ({ arrayBuffer: async () => store.get(key)!.buffer } as unknown as R2ObjectBody)
        : null,
    head: async () => null,
    delete: async () => undefined,
    list: async () => ({ objects: [] }) as never,
  } as unknown as R2Bucket;
}

describe("@gefi/marketplace registry", () => {
  it("creates a model + metadata + lists it", async () => {
    const db = memDb();
    const deps = { db, artifacts: memR2(), anchor: new StubModelAnchor() };
    const m = await createModel(deps, {
      developerTenantId: "tenant-dev-1",
      jurisdiction: "us",
      slug: "alpha-edge",
      name: "Alpha Edge",
      summary: "Quant alpha",
      category: "forecasting",
      riskClass: "medium",
      monthlyPriceCents: 19900,
      federationEnabled: false,
      metadata: { jurisdictionsSupported: ["us", "eu"], longDescription: "Long" },
    });
    expect(m.slug).toBe("alpha-edge");
    expect(m.status).toBe("draft");
    const fetched = await getModel(deps, m.id);
    expect(fetched?.id).toBe(m.id);
    const metadata = await getMetadata(deps, m.id);
    expect(metadata?.jurisdictionsSupported).toEqual(["us", "eu"]);
    const list = await listModels(deps, { developerTenantId: "tenant-dev-1" });
    expect(list).toHaveLength(1);
  });

  it("publishes a version, anchors it, and approves it", async () => {
    const db = memDb();
    const deps = { db, artifacts: memR2(), anchor: new StubModelAnchor() };
    const m = await createModel(deps, {
      developerTenantId: "tenant-dev-1",
      jurisdiction: "us",
      slug: "x",
      name: "x",
      summary: "",
      category: "risk",
      riskClass: "low",
      monthlyPriceCents: 0,
      federationEnabled: false,
    });
    const bytes = new TextEncoder().encode("hello-model-bytes");
    const v = await publishVersion(deps, { modelId: m.id, version: "0.1.0", artifact: bytes });
    expect(v.artifactSha256).toMatch(/^[0-9a-f]{64}$/);
    expect(v.chainTxHash).toMatch(/^0xstub/);
    expect(v.artifactSize).toBe(bytes.byteLength);
    const versions = await listVersions(deps, m.id);
    expect(versions).toHaveLength(1);
    await setModelStatus(deps, m.id, "pending_compliance");
    await approveVersion(deps, m.id, v.id);
    const after = await getModel(deps, m.id);
    expect(after?.status).toBe("approved");
    expect(after?.currentVersionId).toBe(v.id);
  });

  it("upserts metadata idempotently", async () => {
    const db = memDb();
    const deps = { db, artifacts: memR2(), anchor: new StubModelAnchor() };
    const m = await createModel(deps, {
      developerTenantId: "t",
      jurisdiction: "us",
      slug: "x2",
      name: "x2",
      summary: "",
      category: "rag",
      riskClass: "low",
      monthlyPriceCents: 0,
      federationEnabled: false,
    });
    await upsertMetadata(db, m.id, { metrics: { sharpe: 1.5 } }, 1);
    await upsertMetadata(db, m.id, { metrics: { sharpe: 1.7, total_return: 0.18 } }, 2);
    const meta = await getMetadata(deps, m.id);
    expect(meta?.metrics.sharpe).toBe(1.7);
    expect(meta?.metrics.total_return).toBe(0.18);
  });

  it("modelToCard serialises metrics + jurisdictions", async () => {
    const db = memDb();
    const deps = { db, artifacts: memR2(), anchor: new StubModelAnchor() };
    const m = await createModel(deps, {
      developerTenantId: "t",
      jurisdiction: "eu",
      slug: "y",
      name: "Y",
      summary: "Y",
      category: "sentiment",
      riskClass: "high",
      monthlyPriceCents: 9900,
      federationEnabled: true,
      metadata: { metrics: { sharpe: 2.1 }, jurisdictionsSupported: ["eu"] },
    });
    const card = await modelToCard(deps, m);
    expect(card.federationEnabled).toBe(true);
    expect(card.metrics.sharpe).toBe(2.1);
    expect(card.jurisdictionsSupported).toEqual(["eu"]);
  });

  it("sha256Hex matches a known value", async () => {
    const sha = await sha256Hex(new TextEncoder().encode(""));
    expect(sha).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  });

  it("resolveModelAnchor falls back to stub without polygon secrets", () => {
    const a = resolveModelAnchor({});
    expect(a).toBeInstanceOf(StubModelAnchor);
  });
});
