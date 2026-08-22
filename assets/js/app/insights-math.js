/* AI insights (task 318) — ONE implementation of the insight sets each
 * surface shows and the shape an insight takes, shared by the panels and
 * the mock server (loaded there through the same vm shim).
 *
 * Every surface's insights come from here in one canonical shape, so
 * /insights?surface=x and the panel rendering that surface read the same
 * rows. The seeded sets are the product; a live generator is an OPTIONAL
 * add-on behind an env var on the server, clearly labelled when active,
 * and its failures fall back to these.
 *
 * Pure: no DOM, no storage, no Math.random. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  var SURFACES = ["portfolio", "market", "regulator", "provider"];
  var SENTIMENTS = ["Bullish", "Neutral", "Bearish"];
  var IMPACTS = ["High", "Medium", "Low"];

  function slug(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  /* One insight in the canonical shape. Everything a panel renders is on
   * it; `generated` is false for the seeded set and true only when a live
   * generator produced it — the label a reader uses to tell them apart. */
  function shape(surface, raw) {
    return {
      id: "ins-" + surface + "-" + slug(raw.title),
      surface: surface,
      title: raw.title,
      body: raw.body,
      sentiment: raw.sentiment || "Neutral",
      confidence: raw.confidence != null ? raw.confidence : 50,
      impact: raw.impact || "Medium",
      generated: false
    };
  }

  /* The seeded insight sets, assembled from the canonical dataset. The
   * regulator and provider surfaces store their insights in their own
   * shapes; this is the one place that translates, so no panel and no
   * endpoint does its own version of it. */
  function surfaces(DEMO) {
    var D = DEMO || GeFi.DEMO || {};
    var out = {};

    out.portfolio = (D.insights || []).map(function (i) {
      return shape("portfolio", i);
    });

    var M = (D.reports && D.reports.market) || {};
    out.market = [
      shape("market", {
        title: "Market sentiment",
        body: (M.sentimentPct || 0) + "% " + (M.sentimentLabel || "Neutral") + " across tracked assets.",
        sentiment: M.sentimentLabel,
        confidence: M.sentimentPct,
        impact: "High"
      }),
      shape("market", {
        title: "Fed watch",
        body: (M.fed && M.fed.prediction || "No call") + " at " + (M.fed && M.fed.probability || 0) + "% probability.",
        sentiment: "Neutral",
        confidence: M.fed ? M.fed.probability : 50,
        impact: "High"
      }),
      shape("market", {
        title: "Dollar index",
        body: "USD at " + (M.usd && M.usd.value) + " (" + (M.usd && M.usd.changePct > 0 ? "+" : "") + (M.usd && M.usd.changePct) + "% on the day).",
        sentiment: M.usd && M.usd.changePct > 0 ? "Bullish" : "Bearish",
        confidence: 60,
        impact: "Medium"
      })
    ];

    out.regulator = ((D.regulator && D.regulator.insights) || []).map(function (i) {
      return shape("regulator", {
        title: i.title,
        body: i.body,
        sentiment: i.kind === "Improvement" ? "Bullish" : i.kind === "Risk" ? "Bearish" : "Neutral",
        confidence: 70,
        impact: i.kind === "Risk" ? "High" : "Medium"
      });
    });

    out.provider = ((D.provider && D.provider.trends) || []).map(function (t) {
      return shape("provider", {
        title: t.name + " demand",
        body: "Demand from marketplace models growing " + t.growthPct + "%.",
        sentiment: "Bullish",
        confidence: Math.min(95, 50 + t.growthPct),
        impact: t.impact
      });
    });

    return out;
  }

  function all(DEMO) {
    var by = surfaces(DEMO);
    return SURFACES.reduce(function (acc, s) {
      return acc.concat(by[s]);
    }, []);
  }

  /* Returns null when a generate request is runnable, else why not. */
  function validateGenerate(spec) {
    var s = spec || {};
    if (s.surface && SURFACES.indexOf(s.surface) === -1) {
      return "surface must be one of " + SURFACES.join(", ");
    }
    return null;
  }

  GeFi.insightsMath = {
    SURFACES: SURFACES,
    SENTIMENTS: SENTIMENTS,
    IMPACTS: IMPACTS,
    shape: shape,
    surfaces: surfaces,
    all: all,
    validateGenerate: validateGenerate
  };
})(typeof window !== "undefined" ? window : globalThis);
