/* Client data layer (task 302) — the ONE boundary between app pages and
 * data. Every page boots through GeFi.api.page(fn): when an API base is
 * configured and answers within budget, GeFi.DEMO is hydrated from the
 * live endpoints and pages render server state; otherwise pages render
 * the deterministic sample dataset exactly as before. The active mode is
 * always visible (badge + data-gefi-mode attribute) — sample data is
 * never silently presented as live.
 *
 * Base URL resolution: sessionStorage "gefi-api-base" (tests/dev
 * override) → <meta name="gefi-api-base"> (site.api.base_url; dev builds
 * default it to the task-301 mock on :8788) → none (sample mode, no
 * network attempted). */
(function (window, document) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});
  var api = (GeFi.api = {});

  function baseUrl() {
    try {
      var o = sessionStorage.getItem("gefi-api-base");
      if (o !== null) return o;
    } catch (e) {}
    var meta = document.querySelector('meta[name="gefi-api-base"]');
    return meta ? meta.getAttribute("content") || "" : "";
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var r = GeFi.seed ? GeFi.seed.rng(Date.now() >>> 0) : Math.random;
    return "idem-" + Math.floor(r() * 1e9) + "-" + Math.floor(r() * 1e9);
  }

  /* ------------------------------------------------------------- mode */
  var MODE = null; /* "live" | "sample" */
  var modeCbs = [];
  api.mode = function () {
    return MODE;
  };
  api.onMode = function (cb) {
    if (MODE) cb(MODE);
    else modeCbs.push(cb);
  };
  function setMode(m) {
    MODE = m;
    document.documentElement.setAttribute("data-gefi-mode", m);
    onDom(function () {
      var b = document.createElement("div");
      b.className = "gefi-mode-badge gefi-mode-badge--" + m;
      b.setAttribute("role", "status");
      b.textContent = m === "live" ? "LIVE · mock API" : "SAMPLE DATA";
      b.title = m === "live"
        ? "Reading from the API at " + baseUrl() + " (X-GeFi-Sample responses)."
        : "No API responding — rendering the deterministic sample dataset.";
      document.body.appendChild(b);
    });
    modeCbs.splice(0).forEach(function (cb) {
      cb(m);
    });
  }

  /* ------------------------------------------------------- transport */
  function once(method, path, body) {
    var base = baseUrl();
    if (!base) return Promise.reject(new Error("no api base configured"));
    return new Promise(function (resolve, reject) {
      var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
      var timer = setTimeout(function () {
        if (ctrl) ctrl.abort();
        reject(new Error("timeout"));
      }, 2000);
      var opts = { method: method, headers: {} };
      if (ctrl) opts.signal = ctrl.signal;
      if (body !== undefined) {
        opts.headers["Content-Type"] = "application/json";
        opts.body = JSON.stringify(body);
      }
      if (method === "POST") opts.headers["Idempotency-Key"] = uuid();
      fetch(base + "/v1" + path, opts).then(
        function (res) {
          clearTimeout(timer);
          if (!res.ok) {
            reject(new Error("http " + res.status));
            return;
          }
          res.json().then(resolve, reject);
        },
        function (err) {
          clearTimeout(timer);
          reject(err);
        }
      );
    });
  }
  function request(method, path, body) {
    /* 2s budget, one retry */
    return once(method, path, body).catch(function () {
      return once(method, path, body);
    });
  }

  /* ------------------------------------------- sample-side resolvers */
  var RESOLVERS = [];
  api.register = function (template, fn) {
    RESOLVERS.push({ template: template, fn: fn });
  };
  function fallbackFor(path) {
    var clean = path.split("?")[0];
    for (var i = 0; i < RESOLVERS.length; i++) {
      var t = RESOLVERS[i].template.split("/");
      var a = clean.split("/");
      if (t.length !== a.length) continue;
      var params = {};
      var ok = true;
      for (var j = 0; j < t.length; j++) {
        var m = t[j].match(/^\{(.+)\}$/);
        if (m) params[m[1]] = decodeURIComponent(a[j]);
        else if (t[j] !== a[j]) {
          ok = false;
          break;
        }
      }
      if (ok) return RESOLVERS[i].fn(params);
    }
    return undefined;
  }

  api.get = function (path) {
    return request("GET", path).then(
      function (data) {
        return data;
      },
      function (err) {
        var r = fallbackFor(path);
        if (r === undefined) throw err;
        var out = Array.isArray(r) ? { items: r, next_cursor: null } : Object.assign({}, r);
        out.sample = true;
        return out;
      }
    );
  };
  api.post = function (path, body) {
    return request("POST", path, body).then(
      function (data) {
        return data;
      },
      function (err) {
        var r = fallbackFor(path);
        if (r === undefined) throw err;
        var out = Object.assign({}, typeof r === "object" ? r : { ok: true });
        out.sample = true;
        return out;
      }
    );
  };

  /* ------------------------------------------------------------- SSE */
  api.stream = function (path, onEvent, opts) {
    var base = baseUrl();
    var events = (opts && opts.events) || ["message"];
    if (MODE === "live" && base && typeof EventSource !== "undefined") {
      var es = new EventSource(base + "/v1" + path);
      events.forEach(function (name) {
        es.addEventListener(name, function (ev) {
          var data;
          try {
            data = JSON.parse(ev.data);
          } catch (e) {
            data = ev.data;
          }
          onEvent(name, data, { live: true });
        });
      });
      if (opts && opts.onError) es.onerror = opts.onError;
      return {
        live: true,
        close: function () {
          es.close();
        },
      };
    }
    /* seeded local simulation fallback — caller supplies the generator */
    var stop = opts && opts.simulate ? opts.simulate(function (name, data) {
      onEvent(name, data, { live: false });
    }) : function () {};
    return { live: false, close: stop };
  };

  /* ----------------------------------- live hydration into GeFi.DEMO */
  function hydrate() {
    var D = GeFi.DEMO;
    if (!D) return Promise.resolve();
    var jobs = [
      ["/portfolio", function (r) {
        Object.assign(D.portfolio, r);
      }],
      ["/portfolio/risk", function (r) {
        Object.assign(D.risk, r);
      }],
      ["/orders?limit=100", function (r) {
        D.orders = r.items;
      }],
      ["/watchlist?limit=100", function (r) {
        D.watchlist = r.items;
      }],
      ["/datasets?limit=100", function (r) {
        D.datasets = r.items.filter(function (d) {
          return d.status !== "archived";
        });
      }],
      ["/funding/projects?limit=100", function (r) {
        D.fundingProjects = r.items;
      }],
      ["/bounties?limit=100", function (r) {
        D.bounties = r.items;
      }],
      ["/insights?limit=100", function (r) {
        D.insights = r.items;
      }],
    ];
    return Promise.all(
      jobs.map(function (job) {
        return request("GET", job[0]).then(job[1], function () {
          /* one collection failing must not sink the page */
        });
      })
    );
  }

  /* ---------------------------------------------------- page booting */
  var domReady = document.readyState !== "loading";
  var probed = false;
  var queue = [];
  function onDom(fn) {
    if (domReady) fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  document.addEventListener("DOMContentLoaded", function () {
    domReady = true;
    drain();
  });
  function drain() {
    if (!domReady || !probed) return;
    queue.splice(0).forEach(function (fn) {
      fn();
    });
  }
  api.page = function (fn) {
    queue.push(fn);
    drain();
  };

  /* ------------------------- core sample resolvers (GeFi.DEMO-backed) */
  (function registerCore() {
    var D = GeFi.DEMO;
    if (!D) return;
    api.register("/portfolio", function () {
      return D.portfolio;
    });
    api.register("/portfolio/risk", function () {
      return D.risk;
    });
    api.register("/portfolio/holdings", function () {
      return D.holdings;
    });
    api.register("/portfolio/allocation", function () {
      return D.allocation;
    });
    api.register("/orders", function () {
      return D.orders;
    });
    api.register("/watchlist", function () {
      return D.watchlist;
    });
    api.register("/datasets", function () {
      return D.datasets;
    });
    api.register("/funding/projects", function () {
      return D.fundingProjects;
    });
    api.register("/bounties", function () {
      return D.bounties;
    });
    api.register("/insights", function () {
      return D.insights;
    });
    api.register("/sentiment", function () {
      return D.reports.market;
    });
    api.register("/learning/catalog", function () {
      return D.learning.items;
    });
    api.register("/models", function () {
      return (GeFi.MODELS || []).map(function (m) {
        return { slug: m.slug, name: m.name, wing: m.wing, risk: m.risk, federated: m.federated, unit: m.unit };
      });
    });
    api.register("/models/{slug}/metrics", function (p) {
      var m = (GeFi.MODELS || []).filter(function (x) {
        return x.slug === p.slug;
      })[0];
      return m ? { slug: m.slug, unit: m.unit, series: m.series } : undefined;
    });
    api.register("/regulator/issues", function () {
      return D.regulator.issues;
    });
    api.register("/regulator/standards", function () {
      return D.regulator.standardsList;
    });
    api.register("/compliance/evaluations", function () {
      return D.complianceReports;
    });
  })();

  /* probe: no base → sample immediately (zero network in production) */
  (function probe() {
    if (!baseUrl()) {
      setMode("sample");
      probed = true;
      drain();
      return;
    }
    request("GET", "/portfolio").then(
      function () {
        return hydrate().then(function () {
          setMode("live");
        });
      },
      function () {
        setMode("sample");
      }
    ).then(
      function () {
        probed = true;
        drain();
      },
      function () {
        setMode("sample");
        probed = true;
        drain();
      }
    );
  })();
})(window, document);
