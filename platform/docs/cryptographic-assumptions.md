# Cryptographic assumptions

- Hash function: SHA-256 for commitments and domain separation labels (`gefi/v0/...`).
- Signatures: ed25519 in the Rust services (prototype keys must never be committed).
- SecAgg masks: derived via HKDF-SHA256 from pairwise seeds (prototype).
- ZK: EZKL/Halo2 for supported ONNX ops; soundness inherits from the proving system and circuit correctness.
- Workers are **not** a trusted proving environment.

Separate experimental cryptography (`circuits/`, research notebooks) from production paths (`services/secure-aggregation`, `services/zk-verifier`).
