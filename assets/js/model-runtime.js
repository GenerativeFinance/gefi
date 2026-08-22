/* Model runtime (task 307) — the deterministic sample scorer, extracted
 * VERBATIM from assets/js/model-demo.js so the mock server can produce
 * byte-identical output for the same (slug, inputs) pair. The body below
 * is unchanged from the original `mock(data)`; the only edit is that the
 * demo config arrives as a parameter instead of a closure variable.
 *
 * Pure: seeded from slug + inputs, no DOM, no storage, no Math.random. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  function run(cfg, data) {

    var key = cfg.slug + "|" + JSON.stringify(data);
    var rand = GeFi.seed.rng(GeFi.seed.hash(key));
    var kind = cfg.output || "score";

    if (kind === "score") {
      var score = 0.18 + rand() * 0.74;
      return {
        sample: true,
        kind: "score",
        value: score,
        label: cfg.scoreLabel || "Score",
        drivers: (cfg.drivers || ["Leverage", "Coverage", "Sector", "Tenure"]).map(function (d) {
          return { name: d, weight: rand() * 2 - 1 };
        })
      };
    }

    if (kind === "curve") {
      var n = 12;
      var vals = [];
      var v = 0.4 + rand() * 0.4;
      for (var i = 0; i < n; i++) {
        v += (rand() - 0.48) * 0.06;
        vals.push(Math.max(0.02, v));
      }
      var series = [{ name: cfg.seriesLabel || "Projection", values: vals, kind: "area" }];
      /* Optional reference overlay ("last confirmed print" and the like):
       * a flat dashed line, gated on a form field when one is declared. */
      if (cfg.reference && cfg.reference.label) {
        var refOn = cfg.reference.field ? !!data[cfg.reference.field] : true;
        if (refOn) {
          var refVal = vals[0] * (0.92 + rand() * 0.16);
          series.push({
            name: cfg.reference.label,
            values: vals.map(function () { return refVal; }),
            kind: "dashed"
          });
        }
      }
      return { sample: true, kind: "curve", series: series, xLabels: cfg.xLabels || ["t0", "t+11"] };
    }

    if (kind === "bars") {
      /* Allocation-style output: weights over the configured labels,
       * normalised to 100%. Different inputs shift the split — the point is
       * that two constraint sets are visibly different allocations. */
      var labels = cfg.barLabels && cfg.barLabels.length ? cfg.barLabels : ["Sleeve 1", "Sleeve 2", "Sleeve 3"];
      var raw = labels.map(function () { return 0.08 + rand(); });
      var sum = raw.reduce(function (a, b) { return a + b; }, 0);
      return {
        sample: true,
        kind: "bars",
        bars: labels.map(function (l, i) {
          return { label: l, pct: (raw[i] / sum) * 100 };
        })
      };
    }

    if (kind === "table") {
      var cols = cfg.columns || ["Item", "Value", "Weight"];
      var rows = [];
      for (var r = 0; r < (cfg.rowCount || 5); r++) {
        rows.push(
          cols.map(function (c, ci) {
            if (ci === 0) return (cfg.rowLabels && cfg.rowLabels[r]) || "Row " + (r + 1);
            return GeFi.fmt.num(rand() * 100, 2);
          })
        );
      }
      return { sample: true, kind: "table", columns: cols, rows: rows };
    }

    if (kind === "waterfall") {
      /* Signed contributions from a base rate to a final score. */
      var base = GeFi.util.isNum && typeof cfg.base === "number" ? cfg.base : 0.05;
      var names = cfg.drivers && cfg.drivers.length ? cfg.drivers : ["Factor 1", "Factor 2", "Factor 3"];
      var contribs = names.map(function (d) {
        return { name: d, delta: (rand() - 0.45) * 0.12 };
      });
      var total = base;
      contribs.forEach(function (c) {
        total += c.delta;
      });
      total = Math.max(0.005, Math.min(0.95, total));
      return { sample: true, kind: "waterfall", base: base, contribs: contribs, value: total, label: cfg.scoreLabel || "Score" };
    }

    return {
      sample: true,
      kind: "text",
      text: cfg.sampleText || "Sample narrative output. Connect an API endpoint to return live model text for these inputs."
    };
  
  }

  GeFi.modelRuntime = { run: run };
})(typeof window !== "undefined" ? window : globalThis);
