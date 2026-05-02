/**
 * Model gateway handlers.
 *
 *   POST /v1/models/:id/run            — invoke the current version, SSE stream
 *   POST /v1/runs/:runId/replay        — deterministic replay of a stored run
 *   POST /v1/models/:id/paper-trade    — record a paper trade tied to the latest run
 */

import { getMetadata, getModel, getVersion, resolveModelAnchor } from "@gefi/marketplace";
import { resolveProviderChain, runModel, replayRun, responseToSseStream, type InferenceRequest } from "@gefi/model-gateway";
import { consume } from "@gefi/billing";
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

  let body: RunBody;
  try {
    body = (await rc.request.json()) as RunBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  if (!body.prompt) return Response.json({ ok: false, error: "missing_prompt" }, { status: 400 });

  // Quota: charge one inference + one request.
  const quota = await consume(
    { db: rc.env.DB, kv: rc.env.CACHE },
    c.tenant_id,
    "requests_per_day",
    1,
  );
  if (!quota.allowed) {
    return Response.json(
      { ok: false, error: "quota_exceeded", reason: quota.reason, remaining: quota.remaining },
      { status: 429 },
    );
  }
  const inferenceQuota = await consume(
    { db: rc.env.DB, kv: rc.env.CACHE },
    c.tenant_id,
    "inferences_per_month",
    1,
  );
  if (!inferenceQuota.allowed) {
    return Response.json(
      {
        ok: false,
        error: "quota_exceeded",
        reason: inferenceQuota.reason,
        remaining: inferenceQuota.remaining,
      },
      { status: 429 },
    );
  }

  const chain = resolveProviderChain({
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

  // Charge tokens after the run (we don't know the token count up front).
  await consume({ db: rc.env.DB, kv: rc.env.CACHE }, c.tenant_id, "tokens_per_month", result.response.tokensIn + result.response.tokensOut);

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
