# Limitations (v0)

- Secure aggregation in the Rust service is a **protocol-faithful prototype** (domain-separated commitments + mask XOR demo), not a production Bonawitz deployment with peer discovery and full dropout recovery across WANs.
- ZK verification defaults to a **deterministic stub** unless `ZK_VERIFIER_URL` points at the Rust verifier; EZKL circuits are scaffolding for small claims only.
- Privacy accountant is basic ε-addition, not a full RDP/PRV accountant.
- Control plane uses an in-memory store when `DATABASE_URL` is unset.
- Auth is a Bearer demo stub pending the dedicated `gefi-auth` Worker.
- Homomorphic encryption and TEEs are documented as future complements, not enabled by default.
- Do not use this prototype to process real customer financial microdata without a security review.
