#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# GeFi Playground — Cloudflare resource provisioning script (Phase 1).
#
# Run this script ONCE per environment from a workstation that's logged in to
# Cloudflare via `wrangler login`. It creates every resource the Worker needs
# and prints the IDs you must paste into apps/api/wrangler.toml (and the
# secrets you must set with `wrangler secret put`).
#
# Usage:
#   ./scripts/provision.sh staging
#   ./scripts/provision.sh production
#
# This script is intentionally idempotent-friendly: re-running a step that
# already created its resource will print Wrangler's "already exists" error
# and continue. Capture stdout into a file so you don't lose any IDs.
# ─────────────────────────────────────────────────────────────────────────────
set -u

ENV="${1:-}"
if [[ "$ENV" != "staging" && "$ENV" != "production" ]]; then
  echo "Usage: $0 <staging|production>" >&2
  exit 2
fi

if [[ "$ENV" == "staging" ]]; then SUFFIX="-staging"; else SUFFIX=""; fi

WRANGLER="${WRANGLER:-pnpm exec wrangler}"

step() { echo; echo "── $* ──"; }

step "1/9 D1 database: gefi"
$WRANGLER d1 create "gefi" || true

step "2/9 R2 buckets (5)"
for b in gefi-models gefi-datasets-public gefi-datasets-licensed gefi-fed-updates gefi-audit; do
  $WRANGLER r2 bucket create "${b}${SUFFIX}" || true
done

step "3/9 KV namespaces (2)"
$WRANGLER kv namespace create "SESSIONS"     --env "$ENV" || true
$WRANGLER kv namespace create "RATE_LIMITS"  --env "$ENV" || true

step "4/9 Vectorize index (gefi-search, 768 dims, cosine)"
$WRANGLER vectorize create "gefi-search${SUFFIX}" --dimensions=768 --metric=cosine || true

step "5/9 Queue + DLQ (gefi-jobs, gefi-jobs-dlq)"
$WRANGLER queues create "gefi-jobs${SUFFIX}"     || true
$WRANGLER queues create "gefi-jobs-dlq${SUFFIX}" || true

step "6/9 Analytics Engine dataset (gefi_events)"
echo "Analytics Engine datasets are created on first writeDataPoint() call;"
echo "no provisioning command needed. Binding name in wrangler.toml: EVENTS."

step "7/9 Durable Object class (Round)"
echo "DO classes are deployed with the Worker; no provisioning command needed."
echo "wrangler.toml already declares migration tag v1 with new_classes=[\"Round\"]."

step "8/9 Workers AI"
echo "Workers AI is enabled per-account; no per-resource creation. Binding: AI."

step "9/9 Generate Ed25519 JWT keypair (do this once, paste secrets via wrangler secret put)"
echo "  pnpm --filter @gefi-playground/api run keygen"
echo
echo "Then set the four required secrets:"
for s in JWT_SK JWT_PK STRIPE_SK RESEND_API_KEY; do
  echo "  $WRANGLER secret put $s --env $ENV"
done

echo
echo "── DONE ──"
echo "Now: copy the printed IDs (D1 database_id, KV namespace ids) into the"
echo "matching REPLACE_WITH_${ENV^^}_* placeholders in apps/api/wrangler.toml."
