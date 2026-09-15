import { PUBLIC_PRIVACY_CLAIM } from "@gefi/schemas";

export default function PrivacyPage() {
  return (
    <div className="prose prose-invert max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold text-white">Privacy architecture</h1>
      <p className="text-slate-300">{PUBLIC_PRIVACY_CLAIM}</p>
      <h2 className="text-xl text-white">Layers</h2>
      <ul className="list-disc space-y-2 pl-5 text-slate-300">
        <li>
          <strong>Data locality</strong> — raw financial data never leaves the participant
          environment.
        </li>
        <li>
          <strong>Secure aggregation</strong> — coordinator sees only the aggregate of masked
          updates.
        </li>
        <li>
          <strong>Differential privacy</strong> — clip, noise, and tracked (ε,δ) budgets.
        </li>
        <li>
          <strong>Zero-knowledge proofs</strong> — verify protocol compliance, not secrecy of
          data.
        </li>
      </ul>
      <p className="text-sm text-slate-500">
        See <code>platform/docs/threat-model.md</code> and <code>platform/docs/protocol.md</code>{" "}
        for formal assumptions.
      </p>
    </div>
  );
}
