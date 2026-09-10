import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 p-10">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400/80">GeFi Platform</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
          AI financial models — federated, audited, accountable.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          TypeScript control plane. Python for quantitative intelligence. Rust for the
          cryptographic boundary. Layered privacy: data locality, secure aggregation,
          differential privacy, and zero-knowledge protocol proofs.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/workspace"
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400"
          >
            Open workspace
          </Link>
          <Link
            href="/federation"
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-100 hover:border-slate-400"
          >
            Federation console
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Calculation graph",
            body: "Assumptions, scenarios, and deterministic engines — not LLM-written spreadsheets.",
          },
          {
            title: "Layered privacy",
            body: "FL keeps data local. SecAgg hides updates. DP tracks ε,δ. ZK verifies protocol compliance.",
          },
          {
            title: "Typed AI tools",
            body: "Agents call create_model, run_scenario, validate_model — never raw database writes.",
          },
        ].map((card) => (
          <div key={card.title} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h2 className="text-lg font-medium text-white">{card.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{card.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
