"""EZKL / Halo2 prover scaffolding for small ZKML claims.

Generates proof *artifacts* (metadata + public input bindings). Full EZKL
circuit compilation is optional when the `ezkl` package and ONNX model are
available; otherwise emits a deterministic stub artifact suitable for the
control-plane vertical slice.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_CLIENT_OUT = ROOT / "circuits" / "client-update" / "artifacts"
DEFAULT_AGG_OUT = ROOT / "circuits" / "aggregate" / "artifacts"


def domain_hash(label: str, *parts: bytes) -> str:
    h = hashlib.sha256()
    h.update(b"gefi/v0/")
    h.update(label.encode())
    for p in parts:
        h.update(p)
    return h.hexdigest()


def prove_client_update(
    model_version_hash: str,
    update_commitment: str,
    clip_norm: float,
    out_dir: Path,
) -> dict:
    public = domain_hash(
        "client-public",
        model_version_hash.encode(),
        update_commitment.encode(),
        f"{clip_norm:.6f}".encode(),
    )
    out_dir.mkdir(parents=True, exist_ok=True)
    proof_path = out_dir / f"client-{public[:16]}.proof.json"
    artifact = {
        "prover": "ezkl_stub",
        "kind": "client_update",
        "public_inputs_hash": public,
        "model_version_hash": model_version_hash,
        "update_commitment": update_commitment,
        "clip_norm": clip_norm,
        "note": "Replace with EZKL prove() when ONNX circuit is compiled.",
    }
    proof_path.write_text(json.dumps(artifact, indent=2), encoding="utf-8")
    return {
        "proof_uri": f"r2://gefi-proofs/client/{public[:8]}/{proof_path.name}",
        "public_inputs_hash": public,
        "local_path": str(proof_path),
        "prover": "ezkl_stub",
    }


def prove_aggregation(
    round_id: str,
    aggregate_commitment: str,
    cohort_size: int,
    out_dir: Path,
) -> dict:
    public = domain_hash(
        "agg-public",
        round_id.encode(),
        aggregate_commitment.encode(),
        str(cohort_size).encode(),
    )
    out_dir.mkdir(parents=True, exist_ok=True)
    proof_path = out_dir / f"agg-{public[:16]}.proof.json"
    artifact = {
        "prover": "ezkl_stub",
        "kind": "aggregation",
        "public_inputs_hash": public,
        "round_id": round_id,
        "aggregate_commitment": aggregate_commitment,
        "cohort_size": cohort_size,
    }
    proof_path.write_text(json.dumps(artifact, indent=2), encoding="utf-8")
    return {
        "proof_uri": f"r2://gefi-proofs/agg/{public[:8]}/{proof_path.name}",
        "public_inputs_hash": public,
        "local_path": str(proof_path),
        "prover": "ezkl_stub",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="GeFi ZK prover scaffolding")
    sub = parser.add_subparsers(dest="cmd", required=True)

    c = sub.add_parser("client-update")
    c.add_argument("--model-hash", required=True)
    c.add_argument("--update-commitment", required=True)
    c.add_argument("--clip-norm", type=float, default=1.0)
    c.add_argument("--out", type=Path, default=DEFAULT_CLIENT_OUT)

    a = sub.add_parser("aggregate")
    a.add_argument("--round-id", required=True)
    a.add_argument("--aggregate-commitment", required=True)
    a.add_argument("--cohort-size", type=int, required=True)
    a.add_argument("--out", type=Path, default=DEFAULT_AGG_OUT)

    args = parser.parse_args()
    if args.cmd == "client-update":
        result = prove_client_update(args.model_hash, args.update_commitment, args.clip_norm, Path(args.out))
    else:
        result = prove_aggregation(args.round_id, args.aggregate_commitment, args.cohort_size, Path(args.out))
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
