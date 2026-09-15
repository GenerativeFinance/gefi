"""GeFi quantitative calculation service (Phase 2).

FastAPI + NumPy (Polars/DuckDB optional). Called by the Workers control plane
for forecasting / Monte Carlo — not for FL crypto.
"""

from __future__ import annotations

import math
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Literal, Optional

import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="gefi-quant-engine", version="0.1.0")


class Assumption(BaseModel):
    key: str
    value: float | str | bool
    unit: Literal["currency", "percentage", "months", "count", "ratio"]


class CalculationRequest(BaseModel):
    modelId: str
    scenarioId: str
    assumptions: List[Assumption]


def _num(assumptions: List[Assumption], key: str, default: float) -> float:
    for a in assumptions:
        if a.key == key and isinstance(a.value, (int, float)):
            return float(a.value)
    return default


@app.get("/health")
def health() -> Dict[str, str]:
    return {"ok": "true", "service": "gefi-quant-engine"}


@app.post("/v1/models/{model_id}/calculations")
def calculate(model_id: str, req: CalculationRequest) -> Dict[str, Any]:
    cash = _num(req.assumptions, "cash_on_hand", 1_000_000)
    burn = _num(req.assumptions, "monthly_burn", 80_000)
    revenue = _num(req.assumptions, "monthly_revenue", 20_000)
    growth = _num(req.assumptions, "revenue_growth_mom", 0.03)
    vol = _num(req.assumptions, "revenue_vol", 0.05)

    # Monte Carlo revenue paths (simple GBM-style noise on growth)
    rng = np.random.default_rng(42)
    paths = 256
    months = 24
    terminal = np.zeros(paths)
    for p in range(paths):
        bal = cash
        rev = revenue
        for _ in range(months):
            shock = 1.0 + growth + float(rng.normal(0, vol))
            rev = max(0.0, rev * shock)
            bal = bal - burn + rev
        terminal[p] = bal

    net = burn - revenue
    runway = cash / net if net > 0 else math.inf
    return {
        "calculationId": str(uuid.uuid4()),
        "modelId": model_id,
        "scenarioId": req.scenarioId,
        "version": 1,
        "engine": "python",
        "metrics": {
            "runway_months": None if math.isinf(runway) else round(runway, 1),
            "mc_p05_cash": float(np.percentile(terminal, 5)),
            "mc_p50_cash": float(np.percentile(terminal, 50)),
            "mc_p95_cash": float(np.percentile(terminal, 95)),
        },
        "warnings": [],
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/v1/models/{model_id}/validations")
def validate(model_id: str, req: CalculationRequest) -> Dict[str, Any]:
    keys = {a.key for a in req.assumptions}
    warnings = []
    for required in ("cash_on_hand", "monthly_burn"):
        if required not in keys:
            warnings.append(f"missing required assumption: {required}")
    return {"modelId": model_id, "warnings": warnings}
