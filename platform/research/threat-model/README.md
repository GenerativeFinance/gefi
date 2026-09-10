# GeFi threat model

**Status:** research-grade prototype (v0)  
**Claim policy:** GeFi does **not** claim absolute or total privacy.

## Distinctions (must not be conflated)

| Mechanism | What it provides | What it does **not** provide |
|-----------|------------------|------------------------------|
| Federated learning (data locality) | Raw training data stays at the institution | Privacy of gradients/updates; integrity of aggregation |
| Secure aggregation | Coordinator learns only the cohort aggregate | Protection against inference from the released aggregate |
| Differential privacy | Tracked (ε,δ) bound on influence of one record (under stated assumptions) | Protocol integrity; protection if accountant is wrong |
| Zero-knowledge proofs | Verifiable protocol compliance (clipping, aggregation math, commitments) | Secrecy of underlying data |
| Authentication / authorization | Who may join rounds and read results | Cryptographic privacy of updates |
| Auditability | Reconstructible history of rounds, commitments, budgets, proofs | Prevention of offline attacks on local data |

## Adversaries considered

1. **Honest-but-curious coordinator** — follows protocol but inspects all messages it receives.
2. **Malicious coordinator** — may drop updates, mis-aggregate, or publish a false global model.
3. **Malicious client** — may submit poisoned or replayed updates; may skip clipping/DP.
4. **Client dropout** — network failure mid-round (must not halt aggregation if threshold met).
5. **Replay** — reuse of prior-round updates or stale model versions.
6. **Model-update poisoning** — targeted corruption of the global model.
7. **Gradient inversion / membership inference** — against released aggregates or models.
8. **Coordinator ↔ subset collusion** — unmasking updates when SecAgg threshold assumptions fail.
9. **Metadata leakage** — timing, cohort membership, sizes.
10. **Compromised proof-generation worker** — forged proofs if verification keys or circuits are wrong.

## Trust boundaries

- **Participant enclave:** local data, local training, DP clipping/noise, masking, client proofs.
- **Rust crypto services:** SecAgg masks, commitments, signature checks, proof verification.
- **Python FL coordinator (Flower):** round orchestration — not the trusted crypto implementation.
- **Cloudflare Workers control plane:** tenancy, round metadata, privacy budgets, audit events — **no raw gradients**, no heavy proving.
- **PostgreSQL:** governance SoR for orgs, rounds, commitments, proofs metadata, budgets.

## Invariants

- Never store raw client datasets or unmasked gradients in the coordinator database or logs.
- Reject replayed or stale `modelVersionHash` values.
- Require `cohortSize >= minCohortSize` before releasing an aggregate.
- Enforce clipping **before** DP noise.
- Track ε and δ every round; refuse rounds when budget exhausted.
- Bind proofs to model hash, round ID, protocol version, participant set, and public parameters.
- Use domain-separated hashes; keep experimental cryptography out of production paths.

## Out of scope (v0)

- Formal verification of the Rust crypto crate.
- Proving full large neural-network training runs in ZK.
- Post-quantum secure aggregation.
- Absolute anonymity of participants (membership may be visible to the coordinator).

## Public claim language

> Raw training data remains within each participant's environment. Individual updates are protected through secure aggregation. The released model is subject to an explicitly tracked (ε,δ)-differential privacy guarantee under the documented threat model. Zero-knowledge proofs attest to protocol compliance; they do not by themselves make underlying data private.

## References (foundational)

- McMahan et al., FedAvg  
- Bonawitz et al., Practical Secure Aggregation  
- Abadi et al., Deep Learning with Differential Privacy  
- Dwork & Roth, Algorithmic Foundations of Differential Privacy  
- Kairouz et al., Advances and Open Problems in Federated Learning  
- Surveys on ZK-based verifiable ML / ZK-FL  
