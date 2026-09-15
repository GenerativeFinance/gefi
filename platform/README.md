# GeFi Platform (Next.js + Workers API + Python + Rust)

Canonical implementation of the **TypeScript control plane + Python intelligence + Rust crypto** architecture with **layered privacy** (FL locality + SecAgg + DP + ZK protocol proofs).

> The legacy Jekyll site at the repo root is **deprecated** for new product work. See [JEKYLL_DEPRECATED.md](./JEKYLL_DEPRECATED.md).

## Layout

```text
platform/
├── apps/web                 # Next.js + Tailwind
├── apps/api                 # Hono control-plane API
├── packages/{schemas,db,calc,ai-tools}
├── services/
│   ├── fl-coordinator       # FedAvg vertical slice (NumPy; Flower-ready)
│   ├── fl-client
│   ├── quant-engine         # FastAPI + NumPy Monte Carlo
│   ├── secure-aggregation   # Rust SecAgg service
│   ├── zk-prover            # EZKL stub prover
│   └── zk-verifier          # Rust verification service
├── circuits/                # EZKL/Halo2 placeholders
└── docs/                    # threat-model, protocol, privacy-accounting
```

## Quick start

```bash
cd platform
pnpm install
pnpm --filter @gefi/api test
pnpm --filter @gefi/calc test

# API + web (two terminals)
pnpm --filter @gefi/api dev
pnpm --filter @gefi/web dev
```

Open http://localhost:3000 — workspace + federation console talk to http://localhost:8787.

### Federated learning slice (Python)

```bash
python3 services/fl-coordinator/coordinator.py --clients 3
python3 services/fl-client/client.py --participant-id bank-a --seed 1
```

### Quant engine

```bash
pip install -r services/quant-engine/requirements.txt
uvicorn services.quant-engine.main:app --app-dir services/quant-engine --port 8090
```

### Rust crypto services

```bash
cargo test --manifest-path services/secure-aggregation/Cargo.toml
cargo run --manifest-path services/secure-aggregation/Cargo.toml
cargo run --manifest-path services/zk-verifier/Cargo.toml
```

### ZK prover stub

```bash
python3 services/zk-prover/prove.py client-update \
  --model-hash "$(printf 'a%.0s' {1..64})" \
  --update-commitment deadbeef
```

## Privacy claim

See `docs/threat-model.md`. Short form: data stays local; SecAgg hides individual updates; DP tracks (ε,δ); ZK verifies protocol compliance — **not** absolute privacy.

## Environment

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres (optional; API uses memory store if unset) |
| `PORT` | API port (default 8787) |
| `NEXT_PUBLIC_API_BASE` | Web → API base URL |
| `ZK_VERIFIER_URL` | e.g. `http://localhost:8092` |
| `SECAGG_BIND` / `ZK_VERIFIER_BIND` | Rust service binds |
