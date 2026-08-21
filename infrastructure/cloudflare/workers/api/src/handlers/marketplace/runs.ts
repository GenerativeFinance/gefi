/**
 * Model gateway handlers.
 *
 *   POST /v1/models/:id/run            — invoke the current version, SSE stream
 *   POST /v1/runs/:runId/replay        — deterministic replay of a stored run
 *   POST /v1/models/:id/paper-trade    — record a paper trade tied to the latest run
 */

import { getMetadata, getModel, getVersion, resolveModelAnchor } from "@gefi/marketplace";
import {
  resolveProviderChain,
  runModel,
  replayRun,
  responseToSseStream,
  type InferenceProvider,
  type InferenceRequest,
} from "@gefi/model-gateway";
import { consume, consumeApiKey } from "@gefi/billing";
import { executeReferenceModel, isReferenceSlug } from "@gefi/reference-models";
import { requireAuth } from "../../middleware/auth.js";
import type { Handler } from "../../router.js";

function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

function deps(env: {
  DB: D1Database;
  ARTIFACTS: R2Bucket;
  POLYGON_RPC_URL?: string;
  POLYGON_ANCHOR_ADDRESS?: string;
  POLYGON_ANCHOR_PRIVATE_KEY?: string;
}) {
  return {
    db: env.DB,
    artifacts: env.ARTIFACTS,
    anchor: resolveModelAnchor({
      POLYGON_RPC_URL: env.POLYGON_RPC_URL,
      POLYGON_ANCHOR_ADDRESS: env.POLYGON_ANCHOR_ADDRESS,
      POLYGON_ANCHOR_PRIVATE_KEY: env.POLYGON_ANCHOR_PRIVATE_KEY,
    }),
  };
}

interface RunBody {
  prompt?: string;
  system?: string;
  max_tokens?: number;
  temperature?: number;
  context?: Array<{ id: string; text: string }>;
  is_paper?: boolean;
  /** When true, the response is application/json (otherwise SSE). */
  no_stream?: boolean;
}

export const runModelHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["read", "model"]);
  if (auth.response) return auth.response;
  const c = auth.claims;

  const id = rc.params["id"];
  if (!id) return Response.json({ ok: false, error: "id_required" }, { status: 400 });
  const d = deps(rc.env);
  const model = await getModel(d, id);
  if (!model) return Response.json({ ok: false, error: "model_not_found" }, { status: 404 });
  if (!model.currentVersionId) {
    return Response.json({ ok: false, error: "no_approved_version" }, { status: 409 });
  }
  // Cross-tenant gating: the model must either be visible publicly OR
  // belong to this tenant. Approval is implied by `currentVersionId`.
  const isOwner = model.developerTenantId === c.tenant_id;
  if (!isOwner && (model.visibility !== "public" || model.status !== "approved")) {
    return Response.json({ ok: false, error: "model_not_runnable" }, { status: 403 });
  }
  // Jurisdiction policy enforcement: a model's metadata can declare
  // `jurisdictionsSupported` (e.g. ["us"]) — direct /:id/run access
  // must respect that even when ownership / visibility would otherwise
  // permit the call. Owners are exempt so a developer can sandbox-run
  // their own EU-only model from a US tenant during dev. An empty list
  // means "all jurisdictions allowed".
  if (!isOwner) {
    const meta = await getMetadata(d, model.id);
    const allowed = meta?.jurisdictionsSupported ?? [];
    if (allowed.length > 0 && !allowed.includes(c.jurisdiction)) {
      return Response.json(
        { ok: false, error: "model_not_available_in_jurisdiction", jurisdiction: c.jurisdiction },
        { status: 403 },
      );
    }
  }
  const version = await getVersion(d, model.currentVersionId);
  if (!version) return Response.json({ ok: false, error: "version_missing" }, { status: 404 });

  // Per-model subscription gate. Quotas alone (requests/tokens/
  // inferences) are tenant-wide and DO NOT prove the caller has paid
  // for THIS model — without this check, any tenant on any tier could
  // run any paid public model just by passing the generic quota
  // checks below. Owners are exempt (they don't pay themselves) and
  // free models (monthlyPriceCents == 0) are exempt by definition.
  // Everyone else must hold an `active` or `trialing` subscription
  // row of `kind='model'` for this model.
  if (!isOwner && (model.monthlyPriceCents ?? 0) > 0) {
    const sub = await rc.env.DB.prepare(
      `SELECT id FROM subscriptions
       WHERE tenant_id = ? AND model_id = ? AND kind = 'model'
         AND status IN ('active','trialing')
       LIMIT 1`,
    )
      .bind(c.tenant_id, model.id)
      .first<{ id: string }>();
    if (!sub) {
      return Response.json(
        {
          ok: false,
          error: "model_subscription_required",
          model_id: model.id,
          monthly_price_cents: model.monthlyPriceCents,
        },
        { status: 402 },
      );
    }
  }

  let body: RunBody;
  try {
    body = (await rc.request.json()) as RunBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  if (!body.prompt) return Response.json({ ok: false, error: "missing_prompt" }, { status: 400 });
  // Reject non-finite or non-positive max_tokens up front. Without this
  // the preflight math (Math.max(1, Number(...))) would silently coerce
  // garbage payloads (NaN, "abc", -1, Infinity) into the default budget,
  // which would then be charged against the tenant cap.
  if (body.max_tokens !== undefined) {
    const mt = Number(body.max_tokens);
    if (!Number.isFinite(mt) || mt <= 0 || !Number.isInteger(mt)) {
      return Response.json({ ok: false, error: "invalid_max_tokens" }, { status: 400 });
    }
  }

  // ---- Quota enforcement order (each is a hard 429 if denied) -----------
  //   1. tenant requests_per_day      — broad throttle
  //   2. per-API-key requests_per_day — fine-grained per-credential cap
  //      (no row = inherits tenant cap, never blocks)
  //   3. tenant tokens_per_month      — pre-flight at the caller's
  //      requested max_tokens budget so we *never* run inference for a
  //      tenant who's already over the token cap.
  //   4. tenant inferences_per_month  — billing-tier cap, charged LAST
  //      so a token-preflight denial doesn't leak an inference charge
  //      against a tenant whose run never executed.
  // After inference we reconcile the token charge to actual usage with
  // a refund/topup so a caller asking for 2k but only using 100 isn't
  // billed for 1.9k phantom tokens.
  // ------------------------------------------------------------------------
  const billingDeps = { db: rc.env.DB, kv: rc.env.CACHE };
  const tenantReq = await consume(billingDeps, c.tenant_id, "requests_per_day", 1);
  if (!tenantReq.allowed) {
    return Response.json(
      { ok: false, error: "quota_exceeded", scope: "tenant", reason: tenantReq.reason, remaining: tenantReq.remaining },
      { status: 429 },
    );
  }
  const keyReq = await consumeApiKey(billingDeps, c.sub, "requests_per_day", 1);
  if (!keyReq.allowed) {
    return Response.json(
      { ok: false, error: "quota_exceeded", scope: "api_key", reason: keyReq.reason, remaining: keyReq.remaining },
      { status: 429 },
    );
  }
  // Pre-flight tokens BEFORE inferences_per_month — charging the
  // inference counter only after we know we'll actually run the model
  // keeps the two counters consistent: an over-cap tenant never gets
  // an inference charge for a request that never executed.
  const PRE_TOKEN_BUDGET_DEFAULT = 1024;
  const preTokens = Math.max(1, Number(body.max_tokens ?? PRE_TOKEN_BUDGET_DEFAULT));
  const tokenPreflight = await consume(billingDeps, c.tenant_id, "tokens_per_month", preTokens);
  if (!tokenPreflight.allowed) {
    return Response.json(
      { ok: false, error: "quota_exceeded", scope: "tenant", reason: tokenPreflight.reason, remaining: tokenPreflight.remaining, feature: "tokens_per_month" },
      { status: 429 },
    );
  }
  const inferenceQuota = await consume(billingDeps, c.tenant_id, "inferences_per_month", 1);
  if (!inferenceQuota.allowed) {
    // Refund the token preflight — a token preflight that succeeds
    // shouldn't burn budget for a run that never happened. We can't
    // simply skip the inference quota here because the tier guarantee
    // is "≤ inferencesPerMonth model runs/month" and that ceiling has
    // to hold even if the operator changes pricing.
    await rc.env.DB.prepare(
      `UPDATE entitlements SET used_value = MAX(0, used_value - ?), updated_at = ?
       WHERE tenant_id = ? AND feature = 'tokens_per_month'`,
    )
      .bind(preTokens, Math.floor(Date.now() / 1000), c.tenant_id)
      .run();
    if (rc.env.CACHE) await rc.env.CACHE.delete(`entitlement:${c.tenant_id}:tokens_per_month`);
    return Response.json(
      { ok: false, error: "quota_exceeded", scope: "tenant", reason: inferenceQuota.reason, remaining: inferenceQuota.remaining, feature: "inferences_per_month" },
      { status: 429 },
    );
  }

  // Reference-model dispatch. When the model's slug matches one of
  // the registered reference slugs (`sentiment-from-filings` /
  // `portfolio-optimiser`), we bypass the LLM provider chain and
  // execute the package's deterministic logic directly. The result
  // still flows through `runModel` so the same persistence path
  // (model_runs row, input_sha/output_sha, quota reconciliation)
  // applies — only the chain is swapped. Without this dispatch, the
  // reference models would either hit the deterministic-echo provider
  // (returning the prompt back as text) or 4xx because no provider
  // succeeded for a structured optimiser payload.
  const chain: InferenceProvider[] = isReferenceSlug(model.slug)
    ? [
        {
          id: "deterministic",
          modelString: `reference:${model.slug}`,
          region: null,
          generate: async (req) => {
            const out = await executeReferenceModel(model.slug, {
              prompt: req.prompt,
              system: req.system,
              context: req.context,
              maxTokens: req.maxTokens,
              temperature: req.temperature,
            });
            return {
              text: out.text,
              tokensIn: out.tokensIn,
              tokensOut: out.tokensOut,
              latencyMs: out.latencyMs,
              provider: out.provider,
              modelString: out.modelString,
            };
          },
        },
      ]
    : resolveProviderChain({
        region: c.jurisdiction,
        ai: rc.env.AI,
        secrets: rc.env,
      });
  const inference: InferenceRequest = {
    prompt: body.prompt,
    system: body.system,
    maxTokens: body.max_tokens,
    temperature: body.temperature,
    region: c.jurisdiction,
    context: body.context,
  };
  const result = await runModel(
    { db: rc.env.DB },
    chain,
    {
      modelId: model.id,
      versionId: version.id,
      tenantId: c.tenant_id,
      userId: c.sub,
      jurisdiction: c.jurisdiction,
      request: inference,
      isPaper: body.is_paper === true,
    },
  );

  // Reconcile tokens: settle the difference between the pre-charge and
  // actual usage.
  //
  //   actual > preTokens  → top-up. If the top-up is denied (i.e. the
  //                         tenant blew past tokens_per_month), we
  //                         **fail closed**: do NOT return the model
  //                         output. Returning success with just an
  //                         X-Token-Overage header would let callers
  //                         bypass the cap by setting a tiny
  //                         max_tokens and relying on provider
  //                         non-conformance — that contradicts the
  //                         "tokens_per_month is enforced" guarantee.
  //                         The audit row in `model_runs` is retained
  //                         so the operator can reconcile (refund the
  //                         inference charge, surface the overage in
  //                         the dashboard, etc.). Callers who hit
  //                         this should upgrade their tier and replay
  //                         the run via /v1/runs/:runId/replay.
  //   actual < preTokens  → direct UPDATE refund (consume() can't go
  //                         negative).
  const actualTokens = result.response.tokensIn + result.response.tokensOut;
  if (actualTokens > preTokens) {
    const top = await consume(billingDeps, c.tenant_id, "tokens_per_month", actualTokens - preTokens);
    if (!top.allowed) {
      return Response.json(
        {
          ok: false,
          error: "quota_exceeded",
          scope: "tenant",
          feature: "tokens_per_month",
          reason: top.reason,
          remaining: top.remaining,
          // Surface the audit run id so the caller (and the operator)
          // can replay or refund deterministically.
          runId: result.runId,
          actualTokens,
          preTokens,
          message:
            "Token cap exceeded by actual usage; run was recorded for audit but the response is withheld.",
        },
        { status: 429 },
      );
    }
  } else if (actualTokens < preTokens) {
    const refund = preTokens - actualTokens;
    await rc.env.DB.prepare(
      `UPDATE entitlements SET used_value = MAX(0, used_value - ?), updated_at = ?
       WHERE tenant_id = ? AND feature = 'tokens_per_month'`,
    )
      .bind(refund, Math.floor(Date.now() / 1000), c.tenant_id)
      .run();
    if (rc.env.CACHE) {
      await rc.env.CACHE.delete(`entitlement:${c.tenant_id}:tokens_per_month`);
    }
  }

  if (body.no_stream) {
    return Response.json({
      ok: true,
      runId: result.runId,
      inputSha: result.inputSha,
      outputSha: result.outputSha,
      response: result.response,
    });
  }

  const stream = responseToSseStream(result.response);
  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store, no-transform",
      "X-Run-Id": result.runId,
      "X-Input-Sha": result.inputSha,
      "X-Output-Sha": result.outputSha,
    },
  });
};

export const replayRunHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["read", "model"]);
  if (auth.response) return auth.response;
  const c = auth.claims;
  const runId = rc.params["runId"];
  if (!runId) return Response.json({ ok: false, error: "runId_required" }, { status: 400 });
  // Tenant ownership guard via D1 read.
  const row = await rc.env.DB.prepare("SELECT tenant_id FROM model_runs WHERE id = ?")
    .bind(runId)
    .first<{ tenant_id: string }>();
  if (!row) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  if (row.tenant_id !== c.tenant_id && !c.roles.includes("admin")) {
    return Response.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  const result = await replayRun({ db: rc.env.DB }, runId);
  return Response.json({ ok: true, ...result });
};

interface PaperTradeBody {
  symbol?: string;
  side?: "long" | "short";
  qty?: number;
  entry_price?: number;
  exit_price?: number;
  run_id?: string;
}

export const paperTradeHandler: Handler = async (rc) => {
  const auth = requireAuth(rc, ["create", "subscription"]);
  if (auth.response) return auth.response;
  const c = auth.claims;
  const id = rc.params["id"];
  if (!id) return Response.json({ ok: false, error: "id_required" }, { status: 400 });

  let body: PaperTradeBody;
  try {
    body = (await rc.request.json()) as PaperTradeBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  if (!body.symbol || !body.side || body.qty === undefined || body.entry_price === undefined) {
    return Response.json({ ok: false, error: "missing_required" }, { status: 400 });
  }

  const tradeId = newId("ppt");
  const now = Math.floor(Date.now() / 1000);
  const pnl =
    body.exit_price !== undefined
      ? Math.round(
          (body.side === "long"
            ? (body.exit_price - body.entry_price)
            : (body.entry_price - body.exit_price)) *
            body.qty *
            100,
        )
      : null;
  await rc.env.DB.prepare(
    `INSERT INTO paper_trades (id, tenant_id, model_id, run_id, symbol, side, qty,
     entry_price, exit_price, pnl_cents, opened_at, closed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      tradeId,
      c.tenant_id,
      id,
      body.run_id ?? null,
      body.symbol,
      body.side,
      body.qty,
      body.entry_price,
      body.exit_price ?? null,
      pnl,
      now,
      body.exit_price !== undefined ? now : null,
    )
    .run();
  return Response.json({ ok: true, tradeId, pnlCents: pnl }, { status: 201 });
};
