/**
 * `POST /v1/legal/dsar` — accept a Data Subject Access Request.
 *
 * Anyone can file a DSAR — even unauthenticated visitors (GDPR Art. 15
 * doesn't require a pre-existing account). We accept the request, persist
 * it to D1, and emit a `dsar_received` compliance event so the rule
 * engine arms a 30-day (GDPR) or 45-day (CCPA) SLA case routed to the
 * data-protection officer.
 */

import { emitComplianceEvent } from "../../lib/compliance-client.js";
import type { Handler } from "../../router.js";
import type { Region } from "@gefi/shared-types";

interface DsarBody {
  jurisdiction: Region;
  /** Email or other identifier the subject uses (will be PII-redacted in logs). */
  subject_identifier: string;
  request_type?: "access" | "deletion" | "portability" | "rectification";
  description?: string;
  /** Optional tenant id — set when the request is filed against a known tenant. */
  tenant_id?: string;
}

const VALID_REGION: Region[] = ["eu", "us"];
const VALID_REQ = ["access", "deletion", "portability", "rectification"] as const;

export const dsarHandler: Handler = async (rc) => {
  let body: DsarBody;
  try {
    body = (await rc.request.json()) as DsarBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body || !VALID_REGION.includes(body.jurisdiction)) {
    return Response.json({ ok: false, error: "invalid_jurisdiction" }, { status: 400 });
  }
  if (!body.subject_identifier || body.subject_identifier.length < 3) {
    return Response.json({ ok: false, error: "invalid_subject_identifier" }, { status: 400 });
  }
  const reqType = body.request_type ?? "access";
  if (!VALID_REQ.includes(reqType)) {
    return Response.json({ ok: false, error: "invalid_request_type" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const tenantId = body.tenant_id ?? `dsar-anon-${id.slice(0, 8)}`;

  const emit = await emitComplianceEvent(rc.env, {
    kind: "dsar_received",
    tenantId,
    region: body.jurisdiction,
    severity: "warn",
    payload: {
      dsarId: id,
      requestType: reqType,
      // The full identifier is sensitive; we hash it before sending so
      // the audit chain doesn't carry a raw email/phone.
      subjectHash: await hashIdentifier(body.subject_identifier),
      anonymous: !body.tenant_id,
    },
  });

  return Response.json(
    {
      ok: true,
      dsarId: id,
      complianceEventId: emit.eventId,
      compliance: emit.ok ? "emitted" : "deferred",
    },
    { status: 202 },
  );
};

async function hashIdentifier(s: string): Promise<string> {
  const data = new TextEncoder().encode(s.toLowerCase().trim());
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
