/* Data platform (task 312) — ONE implementation of dataset pricing, quality
 * scoring and revenue accounting, shared by the provider pages and the mock
 * server (loaded there through the same vm shim).
 *
 * The accounting rule this module exists to enforce: a dataset's revenue is
 * DERIVED from its line items — downloads at its download price, plus
 * subscriptions at its monthly rate — and every aggregate is the sum of
 * those. Nothing stores a revenue figure independently of the activity that
 * produced it, so the Overview KPI, the Revenue tab and the per-dataset
 * bars are the same dollars counted the same way.
 *
 * Pure: seeded per dataset, no DOM, no storage, no Math.random. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  /* Upload lifecycle. A dataset is not earning until it is published. */
  var LIFECYCLE = ["processing", "published", "archived"];

  var CATEGORIES = ["Market Data", "Alternative", "Credit", "ESG", "Macro", "On-Chain"];

  /* How long the "lifetime" revenue window is. Stated once so the monthly
   * figures on the Revenue tab and the lifetime totals agree. */
  var MONTHS = 12;

  /* Per-dataset commercial terms, seeded from its id. Two datasets do not
   * share a price by accident, and the same dataset always prices the same. */
  function terms(id) {
    var rand = GeFi.seed.rng(GeFi.seed.hash("dsprice|" + id));
    return {
      downloadPrice: Math.round(40 + rand() * 60),
      monthlyRate: Math.round(300 + rand() * 500)
    };
  }

  /* Quality score, seeded per dataset. A dataset still processing has not
   * been audited, so it has no score rather than a flattering default. */
  function quality(id, status) {
    if (status && status !== "published") return 0;
    var rand = GeFi.seed.rng(GeFi.seed.hash("dsq|" + id));
    return +(8 + rand() * 1.9).toFixed(1);
  }

  /* The line items that make up a dataset's revenue. The sum of `amount`
   * across these IS the dataset's revenue — that is the whole point. */
  function lineItems(d) {
    if (!d || d.status !== "published") return [];
    var t = terms(d.id);
    var out = [];
    if (d.downloads) {
      out.push({
        kind: "downloads",
        label: d.downloads + " downloads at $" + t.downloadPrice,
        units: d.downloads,
        unitPrice: t.downloadPrice,
        amount: d.downloads * t.downloadPrice
      });
    }
    if (d.subscribers) {
      out.push({
        kind: "subscriptions",
        label: d.subscribers + " subscriptions at $" + t.monthlyRate + "/month for " + MONTHS + " months",
        units: d.subscribers * MONTHS,
        unitPrice: t.monthlyRate,
        amount: d.subscribers * t.monthlyRate * MONTHS
      });
    }
    return out;
  }

  function revenue(d) {
    return lineItems(d).reduce(function (n, li) { return n + li.amount; }, 0);
  }

  /* A dataset with everything derived filled in. Callers render this rather
   * than the stored row, so no surface can show a stale figure. */
  function view(d) {
    return {
      id: d.id,
      name: d.name,
      category: d.category,
      status: d.status,
      rows: d.rows,
      downloads: d.downloads || 0,
      subscribers: d.subscribers || 0,
      quality: quality(d.id, d.status),
      revenue: revenue(d),
      terms: terms(d.id)
    };
  }

  /* Registry aggregates. Every figure is a sum over the rows, so a reader
   * can add up the list and land on the headline. */
  function totals(datasets) {
    var rows = (datasets || []).map(view);
    var t = { datasets: rows.length, revenue: 0, downloads: 0, subscribers: 0, quality: 0, published: 0 };
    rows.forEach(function (d) {
      t.revenue += d.revenue;
      t.downloads += d.downloads;
      t.subscribers += d.subscribers;
      if (d.status === "published") {
        t.published += 1;
        t.quality += d.quality;
      }
    });
    t.avgQuality = t.published ? +(t.quality / t.published).toFixed(1) : 0;
    t.monthly = Math.round(t.revenue / MONTHS);
    return t;
  }

  /* Monthly revenue series that sums EXACTLY to the total, so the chart and
   * the KPI above it describe the same dollars. The last month absorbs the
   * rounding rather than the total being quietly wrong. */
  function monthlySeries(total, n) {
    var months = n || MONTHS;
    var rand = GeFi.seed.rng(GeFi.seed.hash("dsmonthly|" + total + "|" + months));
    var weights = [];
    var wsum = 0;
    for (var i = 0; i < months; i++) {
      var w = 0.6 + (i / Math.max(1, months - 1)) * 0.8 + rand() * 0.3;
      weights.push(w);
      wsum += w;
    }
    var out = [];
    var used = 0;
    weights.forEach(function (w, idx) {
      var v = idx === months - 1 ? total - used : Math.round((w / wsum) * total);
      used += v;
      out.push(v);
    });
    return out;
  }

  /* Returns null when a dataset can be uploaded, else why not. */
  function validateUpload(spec, existing) {
    var s = spec || {};
    var name = String(s.name || "").trim();
    if (!name) return "name is required";
    if (s.category && CATEGORIES.indexOf(s.category) === -1) {
      return "category must be one of " + CATEGORIES.join(", ");
    }
    var clash = (existing || []).some(function (d) {
      return String(d.name).toLowerCase() === name.toLowerCase();
    });
    if (clash) return "a dataset called " + name + " already exists";
    return null;
  }

  /* Archiving is destructive to the listing, so it is typed-confirmed. The
   * rule lives here so the page and the server demand the same thing. */
  function validateArchive(dataset, typed) {
    if (!dataset) return "no such dataset";
    if (String(typed || "").trim() !== dataset.name) {
      return "type the dataset's name exactly to confirm — nothing was archived";
    }
    return null;
  }

  GeFi.dataPlatform = {
    LIFECYCLE: LIFECYCLE,
    CATEGORIES: CATEGORIES,
    MONTHS: MONTHS,
    terms: terms,
    quality: quality,
    lineItems: lineItems,
    revenue: revenue,
    view: view,
    totals: totals,
    monthlySeries: monthlySeries,
    validateUpload: validateUpload,
    validateArchive: validateArchive
  };
})(typeof window !== "undefined" ? window : globalThis);
