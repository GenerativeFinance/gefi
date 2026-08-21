# Federated Learning — Operator Runbook

This document covers operating GeFi.io's federated-learning stack: orchestrator
Worker (`gefi-api`), node-agent (`@gefi/node-agent`), feature store
(`@gefi/feature-store`), Base L2 contracts (`infrastructure/contracts/`), and
the on-chain client glue (`@gefi/onchain-federation`).

The sandbox cannot reach Base, run Foundry, or stand up SGX/Nitro nodes — every
piece below is **production-shaped** with a deterministic stub fallback so the
test suite runs locally.

---

## 1. Architecture

```
participant nodes (customer VPC)            orchestrator (Cloudflare)
─────────────────────────────────            ──────────────────────────
@gefi/node-agent                             @gefi/worker-api
 ├─ adapters: SQL/NoSQL/Kafka  ──────►        /v1/federation/rounds
 ├─ trainer: linear DP-SGD     ──────►        /v1/federation/rounds/:id/updates
 ├─ attestation: SGX|Nitro|stub                 (D1 + R2: encrypted vector)
 ├─ audit: Merkle hash chain                  /v1/federation/rounds/:id/aggregate
 └─ feature server                              FedAvg → ContributionLedger
                                              /v1/federation/rewards/distribute
                                                computeRewards → RewardDistributor
```

All round metadata lives in D1; vectors are uploaded to R2 under
`federation/rounds/<id>/updates/<participant>.f64`. The aggregate is committed
on-chain via `ContributionLedger.sol` with sha-256 of the canonical Float64
buffer as the anchor.

## 2. Required environment

`infrastructure/cloudflare/packages/shared-types/src/env.ts` declares every
binding. The federation-specific knobs:

| Variable | Required? | Purpose |
| --- | --- | --- |
| `BASE_RPC_URL` | prod | Base L2 RPC endpoint. |
| `BASE_CHAIN_ID` | prod | `8453` mainnet, `84532` sepolia. |
| `BASE_FEDERATION_REGISTRY_ADDRESS` | prod | `ModelRegistry.sol`. |
| `BASE_FEDERATION_LEDGER_ADDRESS` | prod | `ContributionLedger.sol`. |
| `BASE_FEDERATION_REWARDS_ADDRESS` | prod | `RewardDistributor.sol`. |
| `BASE_FEDERATION_KYC_ADDRESS` | prod | `KYCRegistry.sol`. |
| `BASE_REWARD_PRIVATE_KEY` | prod | Operator key signing payouts. |
| `FEDERATION_INTERNAL_TOKEN` | always | Bearer the node-agent presents on `submit-update`. |
| `FEATURE_STORE_REGION_PREFIX` | optional | KV cache prefix; defaults to `feat:${WORKER_REGION}:`. |

When any of the `BASE_*` vars is unset, the on-chain clients fall back to the
deterministic Stub variants — the round still completes, the chain tx hash is
synthetic, and contributions are recorded in D1 only.

## 3. Apply the migration

```
wrangler d1 migrations apply gefi-api-prod   --remote
wrangler d1 migrations apply gefi-api-eu     --remote
wrangler d1 migrations apply gefi-api-us     --remote
```

`0003_init_federation.sql` is idempotent — it ships
`federation_rounds`, `federation_participants`, `federation_updates`,
`contribution_scores`, `feature_definitions`, `feature_lookups`,
`reward_distributions`, and `kyc_whitelist`.

## 4. Deploy the contracts

The contracts live in `infrastructure/contracts/`. They're vanilla Solidity
0.8.24 with no external dependencies.

```
cd infrastructure/contracts
forge build
forge test -vvv
forge create src/ModelRegistry.sol:ModelRegistry      --rpc-url $BASE_RPC_URL --private-key $DEPLOYER_KEY
forge create src/ContributionLedger.sol:ContributionLedger ...
forge create src/RewardDistributor.sol:RewardDistributor ... --constructor-args $KYC_ADDR
forge create src/KYCRegistry.sol:KYCRegistry          ...
```

Update the four `BASE_FEDERATION_*_ADDRESS` secrets after each deployment.

`script/Deploy.s.sol` wires the four contracts together in one `forge script`
invocation; preferred for production.

## 5. Round lifecycle

| Step | Caller | Endpoint | Notes |
| --- | --- | --- | --- |
| Create round | admin | `POST /v1/federation/rounds` | jurisdiction must equal `WORKER_REGION`. |
| Invite participant | admin | `POST /v1/federation/rounds/:id/invite` | promotes round → `invite`. |
| Submit update | node-agent | `POST /v1/federation/rounds/:id/updates` | `Authorization: Bearer $FEDERATION_INTERNAL_TOKEN`. |
| Aggregate | admin | `POST /v1/federation/rounds/:id/aggregate` | FedAvg, fingerprint, on-chain commit. |
| Distribute rewards | admin | `POST /v1/federation/rewards/distribute` | KYC-gated payouts. |
| Read | any auth | `GET /v1/federation/rounds/:id` | tenant must be in the round's jurisdiction. |

Round state machine: `init → invite → collect → aggregate → distribute → closed`.
The orchestrator advances states implicitly — clients never need to flip them.

## 6. Node-agent operation

Each consortium member runs `@gefi/node-agent` inside their VPC. The agent:

1. Registers to a round via the orchestrator (out-of-band).
2. Pulls training data through the configured `SqlAdapter`/`NoSqlAdapter`/`KafkaAdapter`.
3. Runs the local DP-SGD trainer (`@gefi/federation` `dp.ts`).
4. Applies Bonawitz pairwise masks (`secure-agg.ts`) so the orchestrator
   only ever sees masked vectors.
5. Generates an attestation quote (`stub` for dev, `sgx`/`nitro` for prod).
6. POSTs to `/v1/federation/rounds/:id/updates` with the masked vector,
   sample count, and attestation evidence.
7. Appends every event to the local Merkle hash-chain audit log so an
   on-site auditor can re-verify the chain end-to-end.

## 7. Feature store

`POST /v1/features/definitions` (admin) registers a feature schema. The
definition pins:
- `slug` — globally unique.
- `jurisdiction` — must equal `WORKER_REGION`.
- `default_ttl_seconds` — KV-cache TTL.
- `source_endpoint` — `stub://...` for tests, `https://...` for HTTP nodes.

`POST /v1/features/lookup` resolves a `(feature, key)` for the caller's
tenant. The path enforces:
- the caller's `jurisdiction` matches the definition's,
- a per-region KV cache (`FEATURE_STORE_REGION_PREFIX`),
- a `feature_lookups` row written every call (lineage).

## 8. KYC whitelist

`POST /v1/federation/kyc-whitelist` (admin) adds an EVM address to the
allow-list. The handler:
- writes a row in D1 `kyc_whitelist` (hot-path mirror), and
- calls `KYCRegistry.add(address, expiresAt)` on Base when the chain
  client is configured.

`distribute` re-checks both layers (defence in depth).

## 9. Test surface

| Suite | Where | Command |
| --- | --- | --- |
| Unit (federation, feature-store, node-agent, onchain-federation) | per-package | `pnpm test` (root) |
| 3-node integration | `packages/federation/src/integration.test.ts` | `pnpm test` |
| Worker handler integration | `workers/api/src/integration.test.ts` | `pnpm test` |
| Solidity | `infrastructure/contracts/test/*.t.sol` | `forge test` (CI only) |
| Wrangler dry-run | `workers/api` | `pnpm --filter @gefi/worker-api run build` |

## 10. Failure modes

- **Insufficient participants** at aggregate-time → `409 insufficient_participants`.
- **Dimension mismatch** across vectors → `500 dim_mismatch`. Orchestrator must
  re-run the round with the correct baseline pinned.
- **On-chain commit failure** → aggregate is still persisted with `chain_tx_hash = null`;
  operator retries the chain commit out of band.
- **KYC miss at distribute** → the per-recipient line records `skipped: kyc_not_whitelisted`
  and the wei stays in the contract; no on-chain transfer fires.

## 11. Sandbox limitations

- No Base testnet access, no Foundry binary, no SGX/Nitro hardware.
- `chain_tx_hash` for stub paths starts with `0xstub…` so an operator scanning
  D1 can immediately see which rows came from a non-prod path.
- The integration test exercises the full round flow against the stubs — once
  contracts are deployed in CI/prod, the same flow runs end-to-end on real Base.
