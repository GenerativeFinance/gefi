# Privacy accounting

Accountant version: `gefi-rdp-basic-v0`

## Composition (v0)

For the prototype we use **basic ε-addition** per round (conservative, not tight RDP):

```text
epsilonSpent ← epsilonSpent + epsilonPerRound
refuse if epsilonSpent + epsilonPerRound > epsilonTotal
```

Default demo budget: `ε_total = 4.0`, `δ = 1e-5`, `epsilonPerRound = 0.5`.

## Parameters exposed per round

- `clip_norm`
- `noise_multiplier`
- `sampling_rate`
- `round_number`
- `delta`
- `epsilon_spent`
- `epsilon_total`
- `accountant_version`

## Production path

Replace basic addition with a Rényi DP accountant (e.g. Opacus accountant / PRV accountant) and persist the full ledger in `privacy_budgets` + per-round snapshots. Never advertise privacy without naming `accountant_version` and the threat model document.
