/* Catalogue math (task 306) — ONE implementation of pricing, filtering,
 * ranking and grouping, shared by the marketplace pages and the mock
 * server (loaded there through the same vm shim). Keeping it here is
 * what makes "the same filters return the same result set" true by
 * construction rather than by luck.
 *
 * Pure: no DOM, no storage, no Math.random. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  function models() {
    return GeFi.MODELS || [];
  }

  /* Monthly fee is derived from the model itself so every surface quotes
   * the same price: a risk-banded base plus a seeded spread. */
  function monthlyFee(m) {
    var base = m.risk === "low" ? 79 : m.risk === "medium" ? 129 : 199;
    var rand = GeFi.seed.rng(GeFi.seed.hash("fee|" + m.slug));
    return base + Math.round(rand() * 6) * 10;
  }

  function decorate(m) {
    return {
      slug: m.slug,
      name: m.name,
      wing: m.wing,
      risk: m.risk,
      federated: !!m.federated,
      unit: m.unit,
      monthly_fee: monthlyFee(m),
      series: m.series,
    };
  }

  function catalog() {
    return models().map(decorate);
  }

  var RISK_RANK = { low: 0, medium: 1, high: 2 };

  /* filters: { wing, risk, federated, q, max_price, sort } — all optional.
   * `federated` accepts a boolean or the strings "true"/"false". */
  function filter(rows, f) {
    f = f || {};
    var q = String(f.q || "").toLowerCase();
    var out = rows.filter(function (m) {
      if (f.wing && m.wing !== f.wing) return false;
      if (f.risk && m.risk !== f.risk) return false;
      if (f.federated !== undefined && f.federated !== null && f.federated !== "") {
        var want = f.federated === true || f.federated === "true";
        if (m.federated !== want) return false;
      }
      if (f.max_price != null && f.max_price !== "" && m.monthly_fee > Number(f.max_price)) return false;
      if (q) {
        var hay = (m.name + " " + m.slug + " " + m.wing).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
    var sort = f.sort || "name";
    out.sort(function (a, b) {
      if (sort === "price") return a.monthly_fee - b.monthly_fee || a.name.localeCompare(b.name);
      if (sort === "risk") return RISK_RANK[a.risk] - RISK_RANK[b.risk] || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
    return out;
  }

  /* Families with real counts — the sum over items is the whole catalogue. */
  function categories(rows) {
    var byWing = {};
    rows.forEach(function (m) {
      var g = byWing[m.wing] || (byWing[m.wing] = { name: m.wing, model_count: 0, entry_price: Infinity, federated_count: 0 });
      g.model_count += 1;
      g.entry_price = Math.min(g.entry_price, m.monthly_fee);
      if (m.federated) g.federated_count += 1;
    });
    return Object.keys(byWing).sort().map(function (k) {
      return byWing[k];
    });
  }

  /* Preference-driven recommendations: honour the wings the user picked
   * and their risk ceiling, best match first. Empty wings means "no
   * preference", which must not mean "no results". */
  function recommend(rows, prefs, limit) {
    prefs = prefs || {};
    var ceiling = RISK_RANK[prefs.risk] != null ? RISK_RANK[prefs.risk] : 2;
    var wings = prefs.wings || [];
    var pool = rows.filter(function (m) {
      return RISK_RANK[m.risk] <= ceiling && (!wings.length || wings.indexOf(m.wing) !== -1);
    });
    /* Stable ordering: preferred wings first, then seeded affinity. */
    return pool
      .slice()
      .sort(function (a, b) {
        var aw = wings.indexOf(a.wing) === -1 ? 1 : 0;
        var bw = wings.indexOf(b.wing) === -1 ? 1 : 0;
        if (aw !== bw) return aw - bw;
        return GeFi.seed.hash("rec|" + b.slug) - GeFi.seed.hash("rec|" + a.slug);
      })
      .slice(0, limit || 6);
  }

  /* Seeded trending ranking — stable for a given catalogue. */
  function trending(rows, limit) {
    return rows
      .slice()
      .sort(function (a, b) {
        return GeFi.seed.hash("trend|" + b.slug) - GeFi.seed.hash("trend|" + a.slug);
      })
      .slice(0, limit || 8);
  }

  /* Seeded ratings summary so every surface quotes one number per model. */
  function ratingsSummary(slug) {
    var rand = GeFi.seed.rng(GeFi.seed.hash("rating|" + slug));
    var count = 40 + Math.floor(rand() * 260);
    var average = +(3.9 + rand() * 1.05).toFixed(1);
    var histogram = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    var left = count;
    [5, 4, 3, 2].forEach(function (star, i) {
      var share = [0.62, 0.24, 0.09, 0.03][i];
      var n = Math.round(count * share);
      histogram[star] = Math.min(left, n);
      left -= histogram[star];
    });
    histogram[1] = Math.max(0, left);
    return { slug: slug, average: Math.min(5, average), count: count, histogram: histogram };
  }

  GeFi.catalog = {
    monthlyFee: monthlyFee,
    decorate: decorate,
    catalog: catalog,
    filter: filter,
    categories: categories,
    recommend: recommend,
    trending: trending,
    ratingsSummary: ratingsSummary,
  };
})(typeof window !== "undefined" ? window : globalThis);
