# GeFi On-Chain Federation Contracts

Solidity contracts deployed on Base (L2) for the federated learning
infrastructure. Four contracts:

| Contract | Purpose |
|---|---|
| `ModelRegistry` | Records `(modelId, versionId, artifactSha256)` so any auditor can verify a Worker-served model matches the on-chain commitment. |
| `ContributionLedger` | One commit per closed federation round with `(aggregateSha256, contributionsRoot)`. The contributions root is a sha-256 over the canonical TMC-Shapley scores table. |
| `RewardDistributor` | Pays a recipient on behalf of the orchestrator. Reverts if the recipient is not allow-listed in `KYCRegistry`. |
| `KYCRegistry` | Allow-list of `address → expiresAt`. Mutated only by the multi-sig admin. |

All four contracts are admin-gated by the same multi-sig. The admin role
is set in the constructor and rotatable via `transferOwnership`. The
admin is intended to be a 2-of-3 Safe multi-sig owned by GeFi's
compliance + engineering + finance principals.

## Build / test

The sandbox cannot run Foundry (no static binary in NixOS, no internet
to fetch one). Build + test from a workstation or CI:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
forge build
forge test -vvv
```

Tests cover:

- Admin gating (non-admin calls revert).
- KYC allow-list lifecycle: add → isAllowed → remove → isAllowed = false.
- Reward distribution: revert if recipient not allow-listed.
- Reward distribution: revert if balance insufficient.
- ModelRegistry double-register reverts.
- ContributionLedger duplicate commit reverts.

## Deploy

```bash
forge script script/Deploy.s.sol \
  --rpc-url $BASE_RPC_URL \
  --private-key $DEPLOY_KEY \
  --broadcast --verify
```

Then set the resulting addresses in the `gefi-api` Worker secrets:

```bash
wrangler secret put BASE_FEDERATION_REGISTRY_ADDRESS
wrangler secret put BASE_FEDERATION_LEDGER_ADDRESS
wrangler secret put BASE_FEDERATION_REWARDS_ADDRESS
wrangler secret put BASE_FEDERATION_KYC_ADDRESS
```

The Worker auto-detects the secrets and switches from the deterministic
stubs to the real Base clients on the next deployment.

## Audit notes

- All `address` arguments are validated for non-zero where it matters.
- `RewardDistributor` is funded by direct ERC-20 transfers; it holds the
  reward token (USDC on Base in production) and pulls funds via
  `safeTransfer`. There is no permissionless deposit endpoint.
- The contracts deliberately do *not* implement on-chain federation
  logic (FedAvg / TMC-Shapley): all that runs in the orchestrator's
  data plane and only the COMMITMENT lands on chain. This keeps the
  on-chain footprint cheap and the off-chain code auditable.
