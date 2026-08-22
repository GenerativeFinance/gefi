#!/usr/bin/env bash
# Task 301 smoke: one endpoint per service, JSON-shape checked.
# Starts its own server on a scratch port, kills it on exit.
set -u
PORT="${SMOKE_PORT:-8791}"
BASE="http://localhost:$PORT/v1"
DIR="$(cd "$(dirname "$0")" && pwd)"

PORT=$PORT node "$DIR/server.js" >/tmp/gefi-mock-smoke.log 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null' EXIT
for i in $(seq 1 40); do
  curl -sf "$BASE/portfolio" -o /dev/null 2>/dev/null && break
  sleep 0.25
done

PASS=0; FAIL=0
check () { # name method path jq-ish-node-check [data]
  local name="$1" method="$2" path="$3" expr="$4" data="${5:-}"
  [ -z "$data" ] && data='{}'
  local args=(-s -X "$method" "$BASE$path" -H "Authorization: Bearer sample")
  if [ "$method" = "POST" ]; then
    args+=(-H "Idempotency-Key: $(cat /proc/sys/kernel/random/uuid)" -H "Content-Type: application/json" -d "$data")
  fi
  local body sample
  body=$(curl "${args[@]}" -D /tmp/gefi-smoke-headers.txt)
  sample=$(grep -ci '^x-gefi-sample: true' /tmp/gefi-smoke-headers.txt)
  if [ "$sample" != "1" ]; then
    echo "FAIL $name — missing X-GeFi-Sample header"; FAIL=$((FAIL+1)); return
  fi
  if node -e "const d=JSON.parse(process.argv[1]); if(!($expr)) process.exit(1);" "$body" 2>/dev/null; then
    echo "ok   $name"; PASS=$((PASS+1))
  else
    echo "FAIL $name — shape check '$expr' on: $(echo "$body" | head -c 120)"; FAIL=$((FAIL+1))
  fi
}

check auth            POST /auth/session          "typeof d.token==='string' && d.user.persona"        '{"email":"a@b.c"}'
check portfolio       GET  /portfolio             "typeof d.value==='number' || typeof d.total==='number' || Object.keys(d).length>0"
check rebalance       GET  /rebalance/drift       "Array.isArray(d.items) && d.items[0].target_pct!==undefined"
check marketplace     GET  "/models?limit=5"      "Array.isArray(d.items) && d.items.length===5 && d.next_cursor"
check models-runtime  POST /models/accretion-dilution/run "d.sample===true && typeof d.kind==='string' && (d.series||d.value!==undefined||d.rows||d.bars||d.text)" '{"inputs":{"revenue":100}}'
check trading         POST /orders                "d.status==='filled' && d.id"                        '{"symbol":"NVDA","side":"buy","qty":2}'
check backtesting     GET  /backtests/BT-118/results "Array.isArray(d.equity) && d.equity[0]===100 && typeof d.stats.sharpe==='number' && typeof d.stats.drawdownPct==='number' && Array.isArray(d.tradeRows) && d.tradeRows[0].result"
check devconsole      GET  /dev/models            "Array.isArray(d.items) && d.items[0].id"
check collab          GET  /bounties              "Array.isArray(d.items) && d.items[0].reward"
check data-platform   GET  /revenue/summary       "typeof d.total_revenue==='number' && d.datasets===12"
check funding         GET  "/funding/projects?kind=bot" "Array.isArray(d.items) && d.items.every(function(x){return x.kind==='bot'})"
check learning        GET  /learning/catalog      "Array.isArray(d.items) && d.items[0].title"
check reports         POST /reports/generate      "d.status==='pending' && d.id"                       '{"category":"risk"}'
check regulator       GET  "/regulator/entities/MT-4521" "d.kind==='model_audit' && d.record.org==='Meridian Bank'"
check notifications   GET  /notifications         "Array.isArray(d.items) && d.items[0].unread!==undefined"
check insights        GET  /sentiment             "d.sentimentPct===75"
check zkml            POST /zkml/verifications    "d.verdict==='verified' && /^0x[0-9a-f]{8}\$/.test(d.record.hash) && d.record.wall_secs>0 && d.record.lanes_secs.length===4" '{"model":"accretion-dilution","shards":4}'
check platform        GET  /audit-chain/run-42    "Array.isArray(d.chain) && d.chain.length===4 && d.chain[1].prev===d.chain[0].hash"

# envelope behaviors
check error-envelope  GET  /models/does-not-exist "d.code==='not_found' && d.request_id"
BODYNOKEY=$(curl -s -X POST "$BASE/orders" -H "Content-Type: application/json" -d '{}')
if node -e "const d=JSON.parse(process.argv[1]); process.exit(d.code==='validation_failed'?0:1)" "$BODYNOKEY"; then
  echo "ok   idempotency-required"; PASS=$((PASS+1))
else
  echo "FAIL idempotency-required: $BODYNOKEY"; FAIL=$((FAIL+1))
fi
SSE=$(curl -s -N --max-time 3 "$BASE/market-data/stream" | head -6)
if echo "$SSE" | grep -q "event: quote.tick" && echo "$SSE" | grep -q '^data: {'; then
  echo "ok   sse-stream"; PASS=$((PASS+1))
else
  echo "FAIL sse-stream: $SSE"; FAIL=$((FAIL+1))
fi

echo "smoke: $PASS passed, $FAIL failed"
[ "$FAIL" = 0 ]
