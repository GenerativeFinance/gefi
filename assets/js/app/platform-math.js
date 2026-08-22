/* Platform cross-cutting (task 320) — ONE implementation of grouped
 * search, API-key rules, the audit hash-chain and the i18n bundles, shared
 * by the app shell and the mock server (loaded there through the same vm
 * shim).
 *
 * Pure: no DOM, no storage, no Math.random. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  /* ------------------------------------------------------------ search */

  var SEARCH_GROUPS = ["models", "datasets", "docs", "orders"];

  /* Static doc pages the search can land on. A search group is only
   * honest if choosing a hit goes somewhere. */
  var DOCS = [
    { ref: "/app/learning/", name: "Learning center" },
    { ref: "/app/reports/", name: "Reports" },
    { ref: "/app/compliance-reports/", name: "Compliance reports" },
    { ref: "/app/settings/", name: "Settings" },
    { ref: "/trust/", name: "Trust center" },
    { ref: "/app/marketplace/", name: "Model marketplace" }
  ];

  /* Grouped search over the canonical dataset. The same function answers
   * the endpoint and the offline shell, so the two cannot rank or group
   * differently. Groups are always present, empty or not, so the panel's
   * shape is stable. */
  function search(q, ctx) {
    var needle = String(q || "").trim().toLowerCase();
    var out = { q: needle, groups: { models: [], datasets: [], docs: [], orders: [] } };
    if (!needle) return out;
    var models = (ctx && ctx.models) || GeFi.MODELS || [];
    var datasets = (ctx && ctx.datasets) || (GeFi.DEMO && GeFi.DEMO.datasets) || [];
    var orders = (ctx && ctx.orders) || (GeFi.DEMO && GeFi.DEMO.orders) || [];

    models.forEach(function (m) {
      if (m.name.toLowerCase().indexOf(needle) !== -1) {
        out.groups.models.push({ kind: "model", ref: "/models/" + m.slug + "/", name: m.name, meta: m.wing || "" });
      }
    });
    datasets.forEach(function (d) {
      if (d.name.toLowerCase().indexOf(needle) !== -1) {
        out.groups.datasets.push({ kind: "dataset", ref: "/app/datasets/", name: d.name, meta: d.category || "" });
      }
    });
    DOCS.forEach(function (d) {
      if (d.name.toLowerCase().indexOf(needle) !== -1) {
        out.groups.docs.push({ kind: "doc", ref: d.ref, name: d.name, meta: "page" });
      }
    });
    orders.forEach(function (o) {
      var id = String(o.id || "");
      var sym = String(o.symbol || "");
      if (id.toLowerCase().indexOf(needle) !== -1 || sym.toLowerCase().indexOf(needle) !== -1) {
        out.groups.orders.push({
          kind: "order",
          ref: "/app/order-history/",
          name: id + " · " + o.side + " " + o.qty + " " + sym,
          meta: o.status || ""
        });
      }
    });
    SEARCH_GROUPS.forEach(function (g) {
      out.groups[g] = out.groups[g].slice(0, 5);
    });
    out.total = SEARCH_GROUPS.reduce(function (n, g) { return n + out.groups[g].length; }, 0);
    return out;
  }

  /* ---------------------------------------------------------- API keys */

  /* A key is shown ONCE, at creation. Afterwards only the prefix
   * identifies it — the secret is not retrievable, which is the property
   * that makes it a secret. */
  function maskKey(key) {
    return { id: key.id, label: key.label, prefix: key.prefix, created: key.created };
  }

  /* Revoking is destructive, so it is typed-confirmed: the caller types
   * the key's label. The same rule on both sides, in the same words. */
  function validateRevoke(key, typed) {
    if (!key) return "no such key";
    if (String(typed || "").trim() !== key.label) {
      return "type the key's label exactly to confirm — nothing was revoked";
    }
    return null;
  }

  function validateKeyLabel(label, existing) {
    var name = String(label || "").trim();
    if (!name) return "give the key a label";
    if (name.length > 60) return "labels are limited to 60 characters";
    var clash = (existing || []).some(function (k) {
      return k.label.toLowerCase() === name.toLowerCase();
    });
    if (clash) return "a key labelled " + name + " already exists";
    return null;
  }

  /* -------------------------------------------------------- audit chain */

  function fnv1a(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ("00000000" + h.toString(16)).slice(-8);
  }

  /* The hash chain for a run. Each link commits to its predecessor; the
   * root is the last hash. Deterministic per run_id, so the verifier and
   * the endpoint agree without storing anything. FNV-1a labels, not
   * cryptography — the trust page says as much. */
  function chain(runId, links) {
    var n = links || 4;
    var rand = GeFi.seed.rng(GeFi.seed.hash("chain|" + runId));
    var prev = fnv1a("genesis|" + runId);
    var out = [];
    for (var i = 0; i < n; i++) {
      var h = fnv1a(prev + "|" + i + "|" + Math.floor(rand() * 1e6));
      out.push({ index: i, prev: prev, hash: h });
      prev = h;
    }
    return out;
  }

  function runRecord(runId) {
    var c = chain(runId);
    return {
      run_id: runId,
      chain: c,
      root: c[c.length - 1].hash,
      links: c.length,
      verified: true,
      note: "Deterministic sample chain — FNV-1a labels, not a cryptographic commitment."
    };
  }

  /* -------------------------------------------------------------- i18n */

  /* en is the product's language; the second locale is a STUB proving the
   * pipe works — a handful of strings, everything else falling back. */
  var I18N = {
    en: {
      "app.title": "GeFi",
      "app.sample": "Sample data",
      "app.search": "Search",
      "app.notifications": "Notifications",
      "nav.portfolio": "Portfolio",
      "nav.settings": "Settings"
    },
    es: {
      "app.title": "GeFi",
      "app.sample": "Datos de muestra",
      "app.search": "Buscar",
      "app.notifications": "Notificaciones"
    }
  };

  function bundle(locale) {
    var strings = I18N[locale];
    if (!strings) return null;
    return {
      locale: locale,
      complete: locale === "en",
      fallback: locale === "en" ? null : "en",
      strings: strings
    };
  }

  GeFi.platform = {
    SEARCH_GROUPS: SEARCH_GROUPS,
    DOCS: DOCS,
    search: search,
    maskKey: maskKey,
    validateRevoke: validateRevoke,
    validateKeyLabel: validateKeyLabel,
    fnv1a: fnv1a,
    chain: chain,
    runRecord: runRecord,
    I18N: I18N,
    bundle: bundle
  };
})(typeof window !== "undefined" ? window : globalThis);
