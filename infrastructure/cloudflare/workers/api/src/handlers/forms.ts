/**
 * Marketing-site form intake. Receives the same JSON payload that
 * `assets/js/forms.js` on the Jekyll site sends, and acknowledges the
 * submission.
 *
 * This is intentionally minimal for Task #2: every submission is appended
 * to a `submissions` D1 table and acknowledged. Email forwarding,
 * Slack notifications, Turnstile verification, and CRM sync are wired
 * in later tasks. The shape of the payload is locked here so the Jekyll
 * site can flip its `api.*_endpoint` values and start posting today.
 */

import type { Handler } from "../router.js";

const KNOWN_KINDS = new Set(["newsletter", "contact", "demo"]);

interface Submission {
  kind: string;
  payload: Record<string, unknown>;
  source: {
    country: string | null;
    region: string;
    userAgent: string | null;
    ip: string | null;
  };
  receivedAt: string;
}

function corsHeaders(origin: string | null, siteUrl: string): Record<string, string> {
  // Allow the marketing site (apex + www) and same-origin localhost during
  // dev. Any other origin is rejected with no Access-Control-* headers,
  // which the browser will surface as a CORS error.
  const allowed = new Set([siteUrl, "https://www.gefi.io", "http://localhost:5000"]);
  const allow = origin && allowed.has(origin) ? origin : "";
  return allow
    ? {
        "Access-Control-Allow-Origin": allow,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
      }
    : {};
}

export const formsPreflightHandler: Handler = async ({ request, env }) => {
  const origin = request.headers.get("Origin");
  return new Response(null, { status: 204, headers: corsHeaders(origin, env.SITE_PUBLIC_URL) });
};

export const formsSubmitHandler: Handler = async ({ request, env, params, region }) => {
  const kind = (params["kind"] ?? "").toLowerCase();
  if (!KNOWN_KINDS.has(kind)) {
    return Response.json({ ok: false, error: "unknown form kind" }, { status: 400 });
  }

  let payload: Record<string, unknown>;
  try {
    const json = await request.json();
    if (!json || typeof json !== "object") throw new Error("not an object");
    payload = json as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "invalid json body" }, { status: 400 });
  }

  // Minimal validation. Real schema validation lands in Task #4 alongside
  // the per-jurisdiction disclosure rules.
  const email = typeof payload["email"] === "string" ? (payload["email"] as string) : null;
  if (kind !== "demo" && kind !== "contact" && kind === "newsletter" && !email) {
    return Response.json({ ok: false, error: "email is required" }, { status: 400 });
  }

  const submission: Submission = {
    kind,
    payload,
    source: {
      country: (request.cf?.country as string | undefined) ?? null,
      region,
      userAgent: request.headers.get("User-Agent"),
      ip: request.headers.get("CF-Connecting-IP"),
    },
    receivedAt: new Date().toISOString(),
  };

  // Append to the `submissions` table. The schema is created idempotently
  // here so the very first deploy works without a separate migration step;
  // the structured migration system lands in Task #3.
  try {
    await env.DB.exec(
      "CREATE TABLE IF NOT EXISTS submissions (id TEXT PRIMARY KEY, kind TEXT NOT NULL, payload TEXT NOT NULL, source TEXT NOT NULL, received_at TEXT NOT NULL)",
    );
    await env.DB.prepare(
      "INSERT INTO submissions (id, kind, payload, source, received_at) VALUES (?, ?, ?, ?, ?)",
    )
      .bind(
        crypto.randomUUID(),
        submission.kind,
        JSON.stringify(submission.payload),
        JSON.stringify(submission.source),
        submission.receivedAt,
      )
      .run();
  } catch (err) {
    console.error("[gefi-api] submissions insert failed", err);
    return Response.json({ ok: false, error: "storage_failed" }, { status: 502 });
  }

  const origin = request.headers.get("Origin");
  return Response.json(
    { ok: true, kind, receivedAt: submission.receivedAt },
    { status: 202, headers: corsHeaders(origin, env.SITE_PUBLIC_URL) },
  );
};
