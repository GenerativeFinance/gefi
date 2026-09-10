/**
 * Client for the Rust zk-verifier service.
 * Falls back to a deterministic stub verifier when ZK_VERIFIER_URL is unset
 * so the control plane works in local/dev without the Rust binary.
 */

export type VerifyResult = {
  verified: boolean;
  prover: "ezkl" | "deterministic_stub";
  proofUri: string;
  detail: string;
};

const VERIFIER_URL = process.env.ZK_VERIFIER_URL;

export async function verifyClientUpdateProof(input: {
  publicInputsHash: string;
  proofUri: string;
}): Promise<VerifyResult> {
  if (VERIFIER_URL) {
    const res = await fetch(`${VERIFIER_URL}/v1/verify/client-update`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      return {
        verified: false,
        prover: "ezkl",
        proofUri: input.proofUri,
        detail: `verifier_http_${res.status}`,
      };
    }
    return (await res.json()) as VerifyResult;
  }

  // Deterministic stub: accept proofs whose URI embeds the public input prefix.
  const ok = input.proofUri.includes(input.publicInputsHash.slice(0, 8));
  return {
    verified: ok,
    prover: "deterministic_stub",
    proofUri: input.proofUri,
    detail: ok ? "stub_match" : "stub_mismatch",
  };
}

export async function verifyAggregationProof(input: {
  roundId: string;
  aggregateCommitment: string;
  cohortSize: number;
  minCohortSize: number;
  modelVersionHash: string;
  proofUri?: string;
}): Promise<VerifyResult> {
  const proofUri =
    input.proofUri ??
    `r2://gefi-proofs/agg/${input.roundId}/${input.aggregateCommitment.slice(0, 16)}.proof`;

  if (VERIFIER_URL) {
    const res = await fetch(`${VERIFIER_URL}/v1/verify/aggregation`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...input, proofUri }),
    });
    if (!res.ok) {
      return { verified: false, prover: "ezkl", proofUri, detail: `verifier_http_${res.status}` };
    }
    return (await res.json()) as VerifyResult;
  }

  const cohortOk = input.cohortSize >= input.minCohortSize;
  return {
    verified: cohortOk && input.aggregateCommitment.length === 64,
    prover: "deterministic_stub",
    proofUri,
    detail: cohortOk ? "stub_aggregate_ok" : "stub_cohort_too_small",
  };
}
