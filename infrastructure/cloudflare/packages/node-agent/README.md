# @gefi/node-agent

**License: Apache-2.0** — open-source contract enforced by `LICENSE` and the SPDX header on every source file.

Customer-hosted reference agent that participates in GeFi federated-learning
rounds without ever sending raw data to GeFi. The agent:

1. Pulls round metadata from the orchestrator.
2. Runs a local trainer over a customer-supplied data adapter
   (`SqlAdapter`, `NoSqlAdapter`, `KafkaAdapter`).
3. Applies DP-SGD (clip + Gaussian noise) to the resulting gradient.
4. Applies Bonawitz pairwise masks against the cohort.
5. Captures a TEE attestation quote (SGX, AWS Nitro, or stub for dev).
6. Writes a Merkle-chained local audit log of every round step.
7. Submits the masked update + attestation back to the orchestrator.
8. Optionally runs a feature server on the same host so the marketplace
   model gateway can pull federated features at inference time.

This package is the *reference* TypeScript implementation. The real
production agent ships as a Helm chart (`gefi/node-agent`) and a Docker
image (`ghcr.io/gefi-io/node-agent`); this TS implementation is the
spec the chart conforms to and is what the integration test in
`infrastructure/cloudflare/tests/federation-consortium.test.ts` exercises.
