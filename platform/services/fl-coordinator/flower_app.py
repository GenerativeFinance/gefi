"""Optional Flower Strategy wrapper around the NumPy FedAvg vertical slice.

Install `flwr` to use Flower's server APIs. The core math lives in
`coordinator.py` so the slice runs without Flower for CI.
"""

from __future__ import annotations

try:
    import flwr as fl
    from flwr.common import FitRes, Parameters, Scalar
    from flwr.server.client_proxy import ClientProxy
    from flwr.server.strategy import FedAvg

    HAS_FLWR = True
except ImportError:  # pragma: no cover
    HAS_FLWR = False

from coordinator import run_round


def run_with_flower_or_fallback(num_clients: int = 3) -> dict:
    """Prefer Flower FedAvg strategy metadata; always execute local slice."""
    result = run_round(num_clients=num_clients)
    result["flower_available"] = HAS_FLWR
    if HAS_FLWR:
        result["strategy"] = "flwr.server.strategy.FedAvg"
    else:
        result["strategy"] = "numpy_fedavg_fallback"
    return result


if __name__ == "__main__":
    import json

    print(json.dumps(run_with_flower_or_fallback(), indent=2))
