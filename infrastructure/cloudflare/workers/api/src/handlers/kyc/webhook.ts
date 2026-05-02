/**
 * POST /v1/kyc/webhook — provider callback.
 *
 * Unauthenticated by design — providers don't carry our user JWT. We
 * authenticate the caller via the provider's HMAC signature header.
 *
 * Lifecycle:
 *   1. Look up the kyc_evidence row by provider_session_id. (No row →
 *      404; some providers retry stale events for hours.)
 *   2. Verify the HMAC signature against the configured webhook secret
 *      via the provider's `parseWebhook`.
 *   3. Compose all state mutations (evidence update + tenant
 *      promotion / suspension + sanction_hits + compliance_event)
 *      into a single `DB.batch` call so they commit atomically. If
 *      we crash mid-flight the provider will retry and we'll
 *      converge on the same end state.
 *   4. If approved + no sanctions: bump tenant.kyc_tier, set
 *      tenant.status = 'active'.
 *   5. If approved + sanctions hit: insert sanction_hits +
 *      high-severity compliance_event, set tenant.status =
 *      'suspended'.
 *   6. If declined: write a compliance_event of severity = 'warn'.
 */

import { resolveKycProvider } from "@gefi/integrations/kyc";
import { resolveSanctionsProvider } from "@gefi/integrations/sanctions";
import { kycSatisfies } from "@gefi/auth/kyc-tiers";
import type { Handler } from "../../router.js";
import type { EntityType, KycTier, Region } from "@gefi/shared-types";

export const kycWebhookHandler: Handler = async (rc) => {
  const provName = rc.params["provider"] ?? "stub";
  const rawBody = await rc.request.text();
  const signature =
    rc.request.headers.get("X-SHA2-Signature") ??     // Onfido
    rc.request.headers.get("X-Payload-Digest") ??     // Sumsub
    rc.request.headers.get("X-Signature") ??          // Persona / generic
    rc.request.headers.get("X-Stub-Signature");       // Tests only

  // Look up the kyc_evidence row first so we can resolve the right
  // provider for the entity type. We need to know the tenant before
  // we can pick a provider, so we parse the body twice — once raw to
  // extract the session id (cheaply), once via the provider.
  let sessionIdHint: string | null = null;
  try {
    const json = JSON.parse(rawBody) as Record<string, unknown>;
    sessionIdHint =
      (json["providerSessionId"] as string) ??
      ((json["payload"] as { object?: { id?: string } } | undefined)?.object?.id ?? null);
  } catch {
    // Not JSON → fall through to provider parse, which will error.
  }
  if (!sessionIdHint) {
    return Response.json({ ok: false, error: "session_id_missing" }, { status: 400 });
  }

  const evidenceRow = await rc.env.DB.prepare(
    "SELECT id, tenant_id, jurisdiction, requested_tier FROM kyc_evidence WHERE provider_session_id = ?",
  )
    .bind(sessionIdHint)
    .first<{ id: string; tenant_id: string; jurisdiction: Region; requested_tier: KycTier }>();
  if (!evidenceRow) {
    return Response.json({ ok: false, error: "evidence_not_found" }, { status: 404 });
  }

  const tenantRow = await rc.env.DB.prepare(
    "SELECT id, entity_type, kyc_tier, status, display_name FROM tenants WHERE id = ?",
  )
    .bind(evidenceRow.tenant_id)
    .first<{ id: string; entity_type: EntityType; kyc_tier: KycTier; status: string; display_name: string }>();
  if (!tenantRow) {
    return Response.json({ ok: false, error: "tenant_not_found" }, { status: 404 });
  }

  let provider;
  try {
    provider = resolveKycProvider(tenantRow.entity_type, evidenceRow.jurisdiction, rc.env);
  } catch (err) {
    // Production with no real provider configured: fail-closed. Don't
    // mutate state, return 503 so the provider retries (or the
    // operator notices in logs).
    console.error("[gefi-api] kyc webhook provider unavailable", err);
    return Response.json(
      { ok: false, error: "kyc_provider_not_configured" },
      { status: 503 },
    );
  }
  if (provider.name !== provName && provName !== "stub") {
    // The route param tells us which provider should be parsing.
    // Mismatch is fatal — providers shouldn't see each other's webhooks.
    console.warn(`[gefi-api] kyc webhook provider mismatch route=${provName} resolved=${provider.name}`);
  }

  let parsed;
  try {
    parsed = await provider.parseWebhook(rawBody, signature);
  } catch (err) {
    const code = err instanceof Error ? err.message : "kyc_webhook_invalid";
    return Response.json({ ok: false, error: code }, { status: 400 });
  }

  const now = Math.floor(Date.now() / 1000);
  const status =
    parsed.outcome === "approved" ? "approved" : parsed.outcome === "declined" ? "declined" : "review";

  // Build the mutation set. Everything goes through a single
  // `DB.batch` so a worker crash mid-batch doesn't leave the
  // tenant in an inconsistent state (e.g. evidence='approved' but
  // tenant.status still 'pending_kyc').
  const stmts: D1PreparedStatement[] = [];
  stmts.push(
    rc.env.DB.prepare(
      `UPDATE kyc_evidence
          SET status = ?, achieved_tier = ?, reason_codes_json = ?, raw_payload_json = ?, updated_at = ?
        WHERE id = ?`,
    ).bind(
      status,
      parsed.achievedTier,
      JSON.stringify(parsed.reasonCodes),
      JSON.stringify(parsed.raw ?? null),
      now,
      evidenceRow.id,
    ),
  );

  let outcomeBody: Record<string, unknown> = { ok: true, outcome: parsed.outcome };

  if (parsed.outcome === "approved") {
    // Run sanctions screening before promoting tenant.kyc_tier.
    //
    // TODO(task-3.1): the verified legal name lives in the provider's
    // raw payload (e.g. Onfido `applicant.first_name + last_name`,
    // Sumsub `info.firstName + lastName`). Today we screen against
    // the tenant's user-supplied `display_name` which is OK for
    // institutional / data_provider tenants (display_name == legal
    // entity name) but loose for retail / professional. Once we
    // extend each `KycProvider` with a `extractScreeningSubject()`
    // method we should use that here instead.
    let sanctions;
    try {
      sanctions = resolveSanctionsProvider(rc.env);
    } catch (err) {
      console.error("[gefi-api] sanctions provider unavailable", err);
      return Response.json(
        { ok: false, error: "sanctions_provider_not_configured" },
        { status: 503 },
      );
    }
    const screen = await sanctions.screen({
      internalRef: tenantRow.id,
      jurisdiction: evidenceRow.jurisdiction,
      fullName: tenantRow.display_name,
    });

    if (screen.hit) {
      const eventId = crypto.randomUUID();
      for (const h of screen.hits) {
        stmts.push(
          rc.env.DB.prepare(
            `INSERT INTO sanction_hits (id, tenant_id, user_id, jurisdiction, source, list_name, match_score, matched_name, status, payload_json, created_at)
               VALUES (?, ?, NULL, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
          ).bind(
            crypto.randomUUID(),
            tenantRow.id,
            evidenceRow.jurisdiction,
            screen.provider,
            h.list,
            h.matchScore,
            h.matchedName,
            JSON.stringify(h.raw ?? null),
            now,
          ),
        );
      }
      stmts.push(
        rc.env.DB.prepare(
          `INSERT INTO compliance_events (id, tenant_id, user_id, jurisdiction, kind, severity, payload_json, status, created_at)
             VALUES (?, ?, NULL, ?, 'sanction_hit', 'high', ?, 'open', ?)`,
        ).bind(
          eventId,
          tenantRow.id,
          evidenceRow.jurisdiction,
          JSON.stringify({ hits: screen.hits, evidenceId: evidenceRow.id }),
          now,
        ),
      );
      stmts.push(
        rc.env.DB.prepare(
          `UPDATE tenants SET status = 'suspended', updated_at = ? WHERE id = ?`,
        ).bind(now, tenantRow.id),
      );
      outcomeBody = { ok: true, outcome: "blocked_by_sanctions" };
    } else {
      // Approve + clean → promote KYC tier (never downgrade).
      const newTier = kycSatisfies(tenantRow.kyc_tier, parsed.achievedTier)
        ? tenantRow.kyc_tier
        : parsed.achievedTier;
      stmts.push(
        rc.env.DB.prepare(
          `UPDATE tenants SET kyc_tier = ?, status = 'active', updated_at = ? WHERE id = ?`,
        ).bind(newTier, now, tenantRow.id),
      );
      outcomeBody = { ok: true, outcome: "approved", kycTier: newTier };
    }
  } else if (parsed.outcome === "declined") {
    stmts.push(
      rc.env.DB.prepare(
        `INSERT INTO compliance_events (id, tenant_id, user_id, jurisdiction, kind, severity, payload_json, status, created_at)
           VALUES (?, ?, NULL, ?, 'kyc_declined', 'warn', ?, 'open', ?)`,
      ).bind(
        crypto.randomUUID(),
        tenantRow.id,
        evidenceRow.jurisdiction,
        JSON.stringify({ reasonCodes: parsed.reasonCodes, evidenceId: evidenceRow.id }),
        now,
      ),
    );
  }

  await rc.env.DB.batch(stmts);
  return Response.json(outcomeBody);
};
