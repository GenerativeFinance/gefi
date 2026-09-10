"use client";

import { useState } from "react";
import { API_BASE } from "@/lib/utils";

type RoundView = {
  round: {
    id: string;
    status: string;
    minCohortSize: number;
    privacy: { epsilonSpent: number; epsilonTotal: number; delta: number };
  };
  updates?: unknown[];
  proofs?: Array<{ verified: boolean; kind: string; prover: string }>;
  privacyClaim?: string;
};

export default function FederationPage() {
  const [log, setLog] = useState<string[]>([]);
  const [roundId, setRoundId] = useState<string | null>(null);
  const [claim, setClaim] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function push(msg: string) {
    setLog((prev) => [...prev, msg]);
  }

  async function runSlice() {
    setBusy(true);
    setLog([]);
    try {
      const org = await (
        await fetch(`${API_BASE}/v1/organizations`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name: "Consortium", slug: `consort-${Date.now()}` }),
        })
      ).json();
      push(`Organization ${org.slug}`);

      const model = await (
        await fetch(`${API_BASE}/v1/models`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ organizationId: org.id, name: "Credit Risk FL" }),
        })
      ).json();
      push(`Model ${model.id.slice(0, 8)}…`);

      const roundRes = await fetch(`${API_BASE}/v1/federation/rounds`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          modelId: model.id,
          modelVersionHash: "b".repeat(64),
          minCohortSize: 3,
        }),
      });
      const round = await roundRes.json();
      if (!roundRes.ok) throw new Error(JSON.stringify(round));
      setRoundId(round.id);
      push(`Round enrolled (min cohort ${round.minCohortSize ?? 3})`);

      for (let i = 0; i < 3; i++) {
        const updRes = await fetch(`${API_BASE}/v1/federation/rounds/${round.id}/updates`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            participantId: crypto.randomUUID(),
            updateCommitment: `commit-${i}-${"c".repeat(24)}`,
            datasetSnapshotCommitment: `data-${i}-${"d".repeat(24)}`,
            maskedUpdateUri: `r2://gefi-masked/round/${round.id}/p${i}.bin`,
            signature: `sig-${"e".repeat(32)}`,
            dpApplied: true,
          }),
        });
        if (!updRes.ok) throw new Error(await updRes.text());
        push(`Masked update from participant ${i + 1}`);
      }

      const aggRes = await fetch(`${API_BASE}/v1/federation/rounds/${round.id}/aggregate`, {
        method: "POST",
      });
      const agg = await aggRes.json();
      if (!aggRes.ok) throw new Error(JSON.stringify(agg));
      setClaim(agg.privacyClaim ?? agg.privacy_claim ?? null);
      push(
        `Aggregated — proof verified=${String(agg.proof?.verified)} prover=${String(agg.proof?.prover)}`,
      );
      push(
        `ε spent=${agg.round?.privacy?.epsilonSpent} / ${agg.round?.privacy?.epsilonTotal}`,
      );
    } catch (e) {
      push(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(false);
    }
  }

  async function refresh() {
    if (!roundId) return;
    const res = await fetch(`${API_BASE}/v1/federation/rounds/${roundId}`);
    const body = (await res.json()) as RoundView;
    setClaim(body.privacyClaim ?? null);
    push(`Status=${body.round.status} proofs=${body.proofs?.length ?? 0}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Federation console</h1>
        <p className="mt-2 max-w-3xl text-slate-400">
          Vertical slice: 3 simulated institutions, FedAvg-ready round lifecycle, DP budget
          accounting, masked updates only, aggregation proof verification.
        </p>
      </div>

      <form
        className="flex gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void runSlice();
        }}
      >
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 disabled:opacity-50"
        >
          {busy ? "Running…" : "Run 3-party slice"}
        </button>
        <button
          type="button"
          disabled={!roundId}
          onClick={() => void refresh()}
          className="rounded-lg border border-slate-600 px-4 py-2 text-sm disabled:opacity-40"
        >
          Refresh round
        </button>
      </form>

      {claim && (
        <blockquote className="rounded-xl border border-cyan-900/50 bg-cyan-950/20 p-4 text-sm text-cyan-100/90">
          {claim}
        </blockquote>
      )}

      <ol className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-5 font-mono text-xs text-slate-300">
        {log.length === 0 && <li className="text-slate-500">No activity yet.</li>}
        {log.map((line, i) => (
          <li key={`${i}-${line}`}>{line}</li>
        ))}
      </ol>
    </div>
  );
}
