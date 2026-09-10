const catalogue = [
  { slug: "runway-tracker", name: "Startup Runway Tracker", wing: "Venture" },
  { slug: "portfolio-optimiser", name: "Portfolio Optimiser", wing: "Investing" },
  { slug: "credit-oracle", name: "Credit Oracle", wing: "Credit & Risk", federated: true },
  { slug: "monte-carlo", name: "Monte Carlo Simulation", wing: "Simulation" },
];

export default function ModelsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Model catalogue</h1>
        <p className="mt-2 text-slate-400">
          Ported surface from the legacy Jekyll catalogue — content lives in the control plane
          going forward.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {catalogue.map((m) => (
          <article
            key={m.slug}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">{m.wing}</p>
            <h2 className="mt-1 text-lg text-white">{m.name}</h2>
            {m.federated && (
              <span className="mt-2 inline-block rounded border border-cyan-800 px-2 py-0.5 text-xs text-cyan-300">
                Federated
              </span>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
