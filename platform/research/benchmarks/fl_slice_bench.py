#!/usr/bin/env python3
"""Minimal FL slice benchmarks for the vertical prototype."""

from __future__ import annotations

import json
import time
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "services" / "fl-coordinator"))
from coordinator import run_round  # noqa: E402


def main() -> None:
    t0 = time.perf_counter()
    result = run_round(num_clients=3)
    elapsed = time.perf_counter() - t0
    bench = {
        "accuracy": result["accuracy"],
        "epsilon_spent": result["privacy"]["epsilon_spent"],
        "delta": result["privacy"]["delta"],
        "clients": result["num_clients"],
        "wall_seconds": round(elapsed, 4),
        "aggregate_commitment": result["aggregate_commitment"][:16] + "…",
    }
    print(json.dumps(bench, indent=2))


if __name__ == "__main__":
    main()
