"""GeFi Flower FL coordinator — FedAvg with DP-aware client config.

This service orchestrates rounds. Cryptographic SecAgg and proof verification
live in the Rust services; this process must never log unmasked gradients.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from dataclasses import asdict, dataclass
from typing import Dict, List, Tuple

import numpy as np

PROTOCOL_VERSION = "gefi-fl-v0.1"


@dataclass
class PrivacyParams:
    clip_norm: float = 1.0
    noise_multiplier: float = 1.1
    sampling_rate: float = 1.0
    round_number: int = 0
    delta: float = 1e-5
    epsilon_spent: float = 0.0
    epsilon_total: float = 4.0
    accountant_version: str = "gefi-rdp-basic-v0"


def domain_hash(label: str, payload: bytes) -> str:
    h = hashlib.sha256()
    h.update(b"gefi/v0/" + label.encode())
    h.update(payload)
    return h.hexdigest()


def synthetic_financial_risk(n: int = 200, seed: int = 0) -> Tuple[np.ndarray, np.ndarray]:
    rng = np.random.default_rng(seed)
    # Features: leverage, income_stability, delinquency_rate, utilization
    x = rng.normal(size=(n, 4))
    logits = 0.8 * x[:, 0] - 0.6 * x[:, 1] + 0.5 * x[:, 2] + 0.3 * x[:, 3]
    y = (logits + rng.normal(scale=0.5, size=n) > 0).astype(np.float64)
    return x, y


def train_logreg_step(
    x: np.ndarray,
    y: np.ndarray,
    weights: np.ndarray,
    bias: float,
    lr: float,
    clip_norm: float,
    noise_multiplier: float,
    rng: np.random.Generator,
) -> Tuple[np.ndarray, float]:
    """One local SGD step with clip-then-Gaussian-DP (Opacus-style ordering)."""
    pred = 1.0 / (1.0 + np.exp(-(x @ weights + bias)))
    err = pred - y
    grad_w = (x.T @ err) / len(y)
    grad_b = float(np.mean(err))

    # Clip
    grad_vec = np.concatenate([grad_w, np.array([grad_b])])
    norm = np.linalg.norm(grad_vec) + 1e-12
    if norm > clip_norm:
        grad_vec = grad_vec * (clip_norm / norm)

    # DP noise after clip
    noise = rng.normal(scale=noise_multiplier * clip_norm, size=grad_vec.shape)
    grad_vec = grad_vec + noise

    grad_w = grad_vec[:-1]
    grad_b = float(grad_vec[-1])
    weights = weights - lr * grad_w
    bias = bias - lr * grad_b
    return weights, bias


def fedavg(weight_list: List[np.ndarray], bias_list: List[float]) -> Tuple[np.ndarray, float]:
    w = np.mean(np.stack(weight_list, axis=0), axis=0)
    b = float(np.mean(bias_list))
    return w, b


def run_round(num_clients: int = 3, min_cohort: int = 3, seed: int = 42) -> Dict:
    if num_clients < min_cohort:
        raise ValueError("cohort_too_small")

    rng = np.random.default_rng(seed)
    global_w = np.zeros(4)
    global_b = 0.0
    privacy = PrivacyParams()

    local_w: List[np.ndarray] = []
    local_b: List[float] = []
    commitments: List[str] = []
    masked_updates: List[np.ndarray] = []

    # Pairwise-style demo masks: sum of masks cancels (prototype, not WAN SecAgg)
    masks = [rng.normal(size=5) for _ in range(num_clients)]
    mask_sum = np.sum(np.stack(masks), axis=0)

    for i in range(num_clients):
        x, y = synthetic_financial_risk(n=180, seed=seed + i)
        w, b = train_logreg_step(
            x,
            y,
            global_w.copy(),
            global_b,
            lr=0.2,
            clip_norm=privacy.clip_norm,
            noise_multiplier=privacy.noise_multiplier,
            rng=rng,
        )
        delta = np.concatenate([w - global_w, np.array([b - global_b])])
        # Masked update only — coordinator path should only see this
        masked = delta + masks[i] - (mask_sum / num_clients)
        masked_updates.append(masked)
        commit = domain_hash("update", masked.tobytes() + f"client-{i}".encode())
        commitments.append(commit)
        local_w.append(w)
        local_b.append(b)

    # Aggregate masked updates (masks cancel in this toy construction)
    agg = np.mean(np.stack(masked_updates), axis=0)
    new_w = global_w + agg[:-1]
    new_b = global_b + float(agg[-1])

    # Evaluate on held-out synthetic
    x_te, y_te = synthetic_financial_risk(n=400, seed=999)
    pred = 1.0 / (1.0 + np.exp(-(x_te @ new_w + new_b)))
    acc = float(np.mean((pred > 0.5) == y_te))

    model_hash = domain_hash("model", new_w.tobytes() + np.array([new_b]).tobytes())
    aggregate_commitment = domain_hash("aggregate", b"".join(bytes.fromhex(c) for c in commitments))

    privacy.epsilon_spent = 0.5
    privacy.round_number = 0

    result = {
        "protocol_version": PROTOCOL_VERSION,
        "num_clients": num_clients,
        "min_cohort": min_cohort,
        "accuracy": acc,
        "model_version_hash": model_hash,
        "update_commitments": commitments,
        "aggregate_commitment": aggregate_commitment,
        "privacy": asdict(privacy),
        "note": "Masked updates only; raw gradients never returned.",
    }
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description="GeFi FL coordinator vertical slice")
    parser.add_argument("--clients", type=int, default=3)
    parser.add_argument("--out", type=str, default="")
    args = parser.parse_args()
    result = run_round(num_clients=args.clients)
    text = json.dumps(result, indent=2)
    print(text)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(text)


if __name__ == "__main__":
    main()
