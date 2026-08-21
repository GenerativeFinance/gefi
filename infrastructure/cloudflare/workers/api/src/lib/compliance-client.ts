/**
 * Helper for calling the internal `gefi-compliance` Worker over its
 * Service binding. Centralised so every emitter goes through the same
 * internal-token auth + structured-logging path.
 *
 * Failures are non-fatal by design — compliance events are mirrored into
 * the audit vault eventually-consistent: a transient binding failure must
 * not block tenant onboarding, KYC webhook processing, or any other
 * primary user flow. The returned `EmitResult` lets callers surface a
 * non-fatal warning (e.g. via the response body) when the emit fails.
 */

import type { ApiEnv, ComplianceEventKind, ComplianceSeverity, Region } from "@gefi/shared-types";

export interface EmitInput {
  kind: ComplianceEventKind;
  tenantId: string;
  region: Region;
  userId?: string;
  severity?: ComplianceSeverity;
  payload?: Record<string, string | number | boolean>;
  /** Override `Date.now()` for deterministic tests. */
  ts?: number;
}

export interface EmitResult {
  ok: boolean;
  eventId: string | null;
  status: number;
  error: string | null;
}

const COMPLIANCE_HOST = "https://gefi-compliance.internal";

export async function emitComplianceEvent(env: ApiEnv, input: EmitInput): Promise<EmitResult> {
  if (!env.COMPLIANCE) {
    return { ok: false, eventId: null, status: 0, error: "compliance_binding_missing" };
  }
  const body = {
    id: crypto.randomUUID(),
    kind: input.kind,
    tenantId: input.tenantId,
    userId: input.userId,
    region: input.region,
    ts: input.ts ?? Math.floor(Date.now() / 1000),
    severity: input.severity ?? "info",
    payload: input.payload ?? {},
  };
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (env.COMPLIANCE_INTERNAL_TOKEN) {
    headers["X-Gefi-Internal-Token"] = env.COMPLIANCE_INTERNAL_TOKEN;
  }
  try {
    const res = await env.COMPLIANCE.fetch(`${COMPLIANCE_HOST}/events`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await safeText(res);
      console.warn(`[gefi-api] compliance emit ${input.kind} failed`, res.status, text.slice(0, 200));
      return { ok: false, eventId: body.id, status: res.status, error: text || `status_${res.status}` };
    }
    return { ok: true, eventId: body.id, status: res.status, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[gefi-api] compliance emit ${input.kind} threw`, msg);
    return { ok: false, eventId: body.id, status: 0, error: msg };
  }
}

/**
 * Forward a request to a compliance-Worker endpoint that takes no body
 * (e.g. /residency/:tenantId). Adds the internal token + parses JSON.
 */
export async function complianceGet<T>(env: ApiEnv, path: string): Promise<T | null> {
  if (!env.COMPLIANCE) return null;
  const headers: Record<string, string> = {};
  if (env.COMPLIANCE_INTERNAL_TOKEN) {
    headers["X-Gefi-Internal-Token"] = env.COMPLIANCE_INTERNAL_TOKEN;
  }
  try {
    const res = await env.COMPLIANCE.fetch(`${COMPLIANCE_HOST}${path}`, { headers });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.warn("[gefi-api] complianceGet failed", path, err);
    return null;
  }
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
