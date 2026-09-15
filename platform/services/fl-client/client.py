#!/usr/bin/env python3
"""Institution FL client — local train with clip+DP, emit commitments only."""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

import numpy as np

# Allow running without installing the coordinator package
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "fl-coordinator"))
from coordinator import PrivacyParams, domain_hash, synthetic_financial_risk, train_logreg_step  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--participant-id", required=True)
    parser.add_argument("--seed", type=int, default=0)
    parser.add_argument("--model-version-hash", default="0" * 64)
    args = parser.parse_args()

    rng = np.random.default_rng(args.seed)
    privacy = PrivacyParams()
    x, y = synthetic_financial_risk(n=160, seed=args.seed)
    w = np.zeros(4)
    b = 0.0
    w, b = train_logreg_step(
        x, y, w, b, lr=0.2, clip_norm=privacy.clip_norm, noise_multiplier=privacy.noise_multiplier, rng=rng
    )
    delta = np.concatenate([w, np.array([b])])
    # Client emits commitment + would send masked bytes to SecAgg service
    update_commitment = domain_hash("update", delta.tobytes() + args.participant_id.encode())
    dataset_commitment = domain_hash("dataset", x.tobytes() + y.tobytes())

    out = {
        "participant_id": args.participant_id,
        "model_version_hash": args.model_version_hash,
        "update_commitment": update_commitment,
        "dataset_snapshot_commitment": dataset_commitment,
        "clipped": True,
        "dp_applied": True,
        "masked_update_b64_len": int(delta.size * 8),  # size metadata only
    }
    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()
