# GeFi private federated learning protocol (v0.1)

## Goal

Run FedAvg-style rounds where:

1. Raw financial data never leaves each institution.
2. Individual updates are hidden via Bonawitz-style secure aggregation.
3. DP-SGD (clip + Gaussian noise) is applied and accounted.
4. Compact ZK (or deterministic stub in dev) artifacts attest to small, high-value claims.

Protocol version string: `gefi-fl-v0.1`

## Roles

- **Participant / client:** local train → clip → noise → mask → commit → prove (optional) → submit.
- **Coordinator:** enroll cohort → collect masked updates → SecAgg unmask aggregate → update global model → prove aggregation → publish.
- **Control plane (Workers):** persists metadata, budgets, audit; never sees unmasked updates.
- **Verifier (Rust):** checks proofs / commitments.

## Round lifecycle

```text
pending → enrolling → training → aggregating → proving → completed
                                              ↘ aborted
```

### Messages (logical)

1. `RoundAnnounce{ roundId, modelVersionHash, protocolVersion, privacyParams, minCohortSize }`
2. `ClientUpdate{ participantId, updateCommitment, datasetSnapshotCommitment, maskedUpdate, signature, dpApplied=true, clipped=true }`
3. `AggregatePublish{ aggregateCommitment, participantSetHash, cohortSize, proofRef }`
4. `RoundReceipt` — signed by participant acknowledging the round transcript

## What is proven (v0 claims)

### Client update validity

Public statement (simplified):

- Used committed `modelVersionHash`
- Used committed dataset snapshot (commitment only)
- Applied required clip norm
- Applied declared DP mechanism parameters
- Produced `updateCommitment` matching the masked payload binding

### Aggregation correctness

- Aggregate equals the sum of accepted masked updates under the SecAgg transcript
- Participant threshold / dropout rules respected
- Published global model equals prior weights + aggregate update (binding via hash)

### Evaluation integrity (optional later)

- Declared metric computed on committed model; eval data remains private

**Non-goal:** proving an entire large NN training run end-to-end in v0.

## Privacy parameters (wire format)

```json
{
  "clipNorm": 1.0,
  "noiseMultiplier": 1.1,
  "samplingRate": 1.0,
  "roundNumber": 0,
  "delta": 1e-5,
  "epsilonSpent": 0.5,
  "epsilonTotal": 4.0,
  "accountantVersion": "gefi-rdp-basic-v0"
}
```

## Secure aggregation sketch

Bonawitz-style pairwise masks with threshold recovery:

- Authenticated participant set for the round
- Pairwise seeds → additive masks
- Dropout: reconstruct masks for dropped clients if remaining ≥ threshold
- Abort if cohort &lt; `minCohortSize`
- Replay protection via `(roundId, modelVersionHash, participantId)` binding

Production crypto lives in `services/secure-aggregation` (Rust). Python/Flower orchestrates; it does not implement the trusted primitives.

## Differential privacy

Order of operations on each client:

1. Compute local update
2. Clip to `clipNorm`
3. Add Gaussian noise scaled by `noiseMultiplier`
4. Mask for SecAgg

Control plane refuses new rounds when `epsilonSpent + epsilonPerRound > epsilonTotal`.

## ZK tooling

| Claim | First implementation |
|-------|----------------------|
| Private inference / tiny circuits | ONNX + EZKL (Halo2) |
| Aggregation / protocol glue | Deterministic stub → custom Halo2 / zkVM later |
| Browser verify | WASM verifier |
| On-chain | Succinct proof only if product requires |

Proof generation runs **outside** Cloudflare Workers.

## Control-plane API (excerpt)

```text
POST /v1/federation/rounds
POST /v1/federation/rounds/{id}/updates
POST /v1/federation/rounds/{id}/aggregate
GET  /v1/federation/rounds/{id}
GET  /v1/models/{id}/privacy-budget
POST /v1/federation/rounds/{id}/proofs/verify
```

## Sequence (happy path)

```text
Client_i                      Coordinator                 Control plane           Verifier
   |-- enroll / announce ------>|                            |                      |
   |<-- modelVersionHash -------|                            |                      |
   |  local train+DP+mask       |                            |                      |
   |-- ClientUpdate (masked) -->|-- persist metadata ------->|                      |
   |                            |-- SecAgg aggregate         |                      |
   |                            |-- aggregation proof ------>|--------------------->|
   |                            |<------------- verified ----|<---------------------|
   |                            |-- complete round --------->|                      |
```

## Limitations

See `limitations.md`. This is a research-grade vertical slice, not a certified cryptographic product.
