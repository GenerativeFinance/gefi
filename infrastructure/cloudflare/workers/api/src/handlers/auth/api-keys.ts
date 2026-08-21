/**
 * Tenant API-key management.
 *
 *   POST   /v1/api-keys      → create. Body: { label, scopes? }. Returns the
 *                              full secret EXACTLY ONCE.
 *   GET    /v1/api-keys      → list (returns prefixes + labels, never the secret).
 *   DELETE /v1/api-keys/:id  → revoke (sets revoked_at).
 *
 * Secrets are 32 random bytes encoded as hex (`gk_` prefix); we store
 * SHA-256(secret) only. Listing is bounded by tenant_id + jurisdiction
 * to prevent any cross-tenant leak.
 */

import { requireAuth } from "../../middleware/auth.js";
import type { Handler } from "../../router.js";

const KEY_PREFIX = "gk_";

function hex(bytes: ArrayBuffer | Uint8Array): string {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let out = "";
  for (let i = 0; i < u8.byteLength; i++) {
    const b = u8[i] ?? 0;
    out += b.toString(16).padStart(2, "0");
  }
  return out;
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return hex(digest);
}

function generateSecret(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `${KEY_PREFIX}${hex(bytes)}`;
}

export const createApiKeyHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["create", "api_key"]);
  if (auth.response) return auth.response;
  const c = auth.claims;

  let body: { label?: string; scopes?: string[] };
  try {
    body = (await rc.request.json()) as { label?: string; scopes?: string[] };
  } catch {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  if (!body.label || body.label.trim().length < 1) {
    return Response.json({ ok: false, error: "invalid_label" }, { status: 400 });
  }
  const scopes = Array.isArray(body.scopes) ? body.scopes : [];
  const secret = generateSecret();
  const hashed = await sha256Hex(secret);
  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  try {
    await rc.env.DB.prepare(
      `INSERT INTO api_keys (id, tenant_id, jurisdiction, label, prefix, hashed_key, scopes_json, created_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?)`,
    )
      .bind(id, c.tenant_id, c.jurisdiction, body.label.trim(), secret.slice(0, 11), hashed, JSON.stringify(scopes), now)
      .run();
  } catch (err) {
    console.error("[gefi-api] api_key insert failed", err);
    return Response.json({ ok: false, error: "storage_failed" }, { status: 502 });
  }

  return Response.json(
    {
      ok: true,
      apiKey: {
        id,
        label: body.label.trim(),
        scopes,
        prefix: secret.slice(0, 11),
        // The full secret is shown ONCE. Never returned again.
        secret,
        created_at: now,
      },
    },
    { status: 201 },
  );
};

export const listApiKeysHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["list", "api_key"]);
  if (auth.response) return auth.response;
  const c = auth.claims;

  // `tenant_id` is the security-critical filter (api_keys.tenant_id is
  // the unique-per-tenant scope). The `jurisdiction` filter is
  // defence-in-depth — on a regional sibling we should never see rows
  // from the other region anyway because we wrote them in the
  // matching region's D1, but the explicit predicate makes the intent
  // visible and survives any future cross-region replication.
  const result = await rc.env.DB.prepare(
    `SELECT id, label, prefix, scopes_json, created_at, last_used_at, revoked_at
       FROM api_keys WHERE tenant_id = ? AND jurisdiction = ? ORDER BY created_at DESC`,
  )
    .bind(c.tenant_id, c.jurisdiction)
    .all<{
      id: string;
      label: string;
      prefix: string;
      scopes_json: string;
      created_at: number;
      last_used_at: number | null;
      revoked_at: number | null;
    }>();

  return Response.json({
    ok: true,
    apiKeys: (result.results ?? []).map((r) => ({
      id: r.id,
      label: r.label,
      prefix: r.prefix,
      scopes: JSON.parse(r.scopes_json) as string[],
      created_at: r.created_at,
      last_used_at: r.last_used_at,
      revoked_at: r.revoked_at,
    })),
  });
};

export const revokeApiKeyHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["delete", "api_key"]);
  if (auth.response) return auth.response;
  const c = auth.claims;
  const id = rc.params["id"];
  if (!id) return Response.json({ ok: false, error: "missing_id" }, { status: 400 });

  const now = Math.floor(Date.now() / 1000);
  const result = await rc.env.DB.prepare(
    `UPDATE api_keys SET revoked_at = ?
       WHERE id = ? AND tenant_id = ? AND jurisdiction = ? AND revoked_at IS NULL`,
  )
    .bind(now, id, c.tenant_id, c.jurisdiction)
    .run();
  // D1 returns `meta.changes` for affected-row count.
  const changes =
    (result as unknown as { meta?: { changes?: number } }).meta?.changes ?? 0;
  if (changes === 0) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return Response.json({ ok: true, revoked_at: now });
};
