"use client";

import { useState } from "react";
import { API_BASE } from "@/lib/utils";

type CalcResult = {
  calculationId: string;
  metrics: Record<string, number>;
  warnings: string[];
  engine: string;
};

export default function WorkspacePage() {
  const [cash, setCash] = useState(1_000_000);
  const [burn, setBurn] = useState(100_000);
  const [revenue, setRevenue] = useState(40_000);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runCalc() {
    setLoading(true);
    setError(null);
    try {
      const orgRes = await fetch(`${API_BASE}/v1/organizations`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Demo Org", slug: `demo-${Date.now()}` }),
      });
      const org = await orgRes.json();
      const modelRes = await fetch(`${API_BASE}/v1/models`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ organizationId: org.id, name: "Runway" }),
      });
      const model = await modelRes.json();
      const scenarioRes = await fetch(`${API_BASE}/v1/models/${model.id}/scenarios`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Base case" }),
      });
      const scenario = await scenarioRes.json();
      const calcRes = await fetch(`${API_BASE}/v1/models/${model.id}/calculations`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          assumptions: [
            { key: "cash_on_hand", value: cash, unit: "currency" },
            { key: "monthly_burn", value: burn, unit: "currency" },
            { key: "monthly_revenue", value: revenue, unit: "currency" },
          ],
        }),
      });
      if (!calcRes.ok) throw new Error(await calcRes.text());
      setResult(await calcRes.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Model workspace</h1>
        <p className="mt-2 text-slate-400">
          Phase 1 deterministic TypeScript engine. Complex quant moves to Python in Phase 2.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <form
          className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            void runCalc();
          }}
        >
          <label className="block text-sm">
            <span className="text-slate-300">Cash on hand</span>
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
              value={cash}
              onChange={(e) => setCash(Number(e.target.value))}
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-300">Monthly burn</span>
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
              value={burn}
              onChange={(e) => setBurn(Number(e.target.value))}
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-300">Monthly revenue</span>
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
              value={revenue}
              onChange={(e) => setRevenue(Number(e.target.value))}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 disabled:opacity-50"
          >
            {loading ? "Calculating…" : "Run scenario"}
          </button>
        </form>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-lg font-medium text-white">Result</h2>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          {!result && !error && (
            <p className="mt-3 text-sm text-slate-500">Run a scenario to see versioned metrics.</p>
          )}
          {result && (
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">Runway (months)</dt>
                <dd className="font-mono text-cyan-300">{result.metrics.runway_months}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Net monthly burn</dt>
                <dd className="font-mono">{result.metrics.net_monthly_burn}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Engine</dt>
                <dd className="font-mono">{result.engine}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Calculation ID</dt>
                <dd className="font-mono text-xs">{result.calculationId.slice(0, 8)}…</dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
