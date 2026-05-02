/**
 * `POST /v1/legal/subpoena` — log a subpoena / law-enforcement request.
 *
 * Limited to the `compliance_officer` and `admin` roles. An arbitrary
 * user (or even an `auditor` whose access is read-only) MUST NOT be
 * able to insert a critical-severity event into the audit chain on
 * someone else's behalf. Emits a `subpoena_received` event with
 * `severity: critical` so the rule engine arms a 24-hour AUSTRAC /
 * FINRA legal-hold case.
 */

import { requireAuth } from "../../middleware/auth.js";
import { emitComplianceEvent } from "../../lib/compliance-client.js";
import type { Handler } from "../../router.js";
import type { Region } from "@gefi/shared-types";

interface SubpoenaBody {
  jurisdiction: Region;
  issuing_authority: string;
  case_reference: string;
  /** Optional — the targeted tenant if known. */
  tenant_id?: string;
  description?: string;
}

const VALID_REGION: Region[] = ["eu", "us"];

export const subpoenaHandler: Handler = async (rc) => {
  const auth = requireAuth(rc);
  if (auth.response) return auth.response;
  const principal = auth.claims;
  // Subpoena filing is restricted to compliance_officer + admin: an
  // arbitrary user must NOT be able to insert a critical-severity event
  // into the audit chain on someone else's behalf.
  const roles = principal.roles ?? [];
  const allowed = roles.includes("compliance_officer") || roles.includes("admin");
  if (!allowed) {
    return Response.json(
      { ok: false, error: "permission_denied", required: ["compliance_officer", "admin"] },
      { status: 403 },
    );
  }

  let body: SubpoenaBody;
  try {
    body = (await rc.request.json()) as SubpoenaBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body || !VALID_REGION.includes(body.jurisdiction)) {
    return Response.json({ ok: false, error: "invalid_jurisdiction" }, { status: 400 });
  }
  if (!body.issuing_authority || !body.case_reference) {
    return Response.json({ ok: false, error: "missing_required_fields" }, { status: 400 });
  }

  const subpoenaId = crypto.randomUUID();
  const tenantId = body.tenant_id ?? principal.tenant_id;

  const emit = await emitComplianceEvent(rc.env, {
    kind: "subpoena_received",
    tenantId,
    region: body.jurisdiction,
    userId: principal.sub,
    severity: "critical",
    payload: {
      subpoenaId,
      issuingAuthority: body.issuing_authority,
      caseReference: body.case_reference,
      filedBy: principal.sub,
    },
  });

  return Response.json(
    {
      ok: true,
      subpoenaId,
      complianceEventId: emit.eventId,
      compliance: emit.ok ? "emitted" : "deferred",
    },
    { status: 202 },
  );
};
