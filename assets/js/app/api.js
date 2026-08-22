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
          res.json().catch(function () { return null; }).then(function (json) {
            if (!res.ok) {
              /* Reachable server, real answer: a 401/404/422/... is not
               * "the API is down" — tag it so callers see the actual
               * error instead of silently falling back to sample data
               * (a wrong password must never look like a success). */
              var e = new Error("http " + res.status);
              e.httpStatus = res.status;
              e.body = json;
              reject(e);
              return;
            }
            resolve(json);
          });
        },
        function (err) {
          clearTimeout(timer);
          reject(err);
        }
      );
    });
  }
  function request(method, path, body) {
    /* 2s budget, one retry — but never retry a real HTTP error (same
     * credentials would just fail the same way again). */
    return once(method, path, body).catch(function (err) {
      if (err && err.httpStatus) return Promise.reject(err);
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

  function withFallback(method, path, body) {
    return request(method, path, body).then(
      function (data) {
        return data;
      },
      function (err) {
        if (err && err.httpStatus) return Promise.reject(err);
        var r = fallbackFor(path);
        if (r === undefined) throw err;
        var out = Object.assign({}, typeof r === "object" ? r : { ok: true });
        out.sample = true;
        return out;
      }
    );
  }
  api.patch = function (path, body) {
    return withFallback("PATCH", path, body);
  };
  api.put = function (path, body) {
    return withFallback("PUT", path, body);
  };
  api.del = function (path) {
    return withFallback("DELETE", path);
  };

  api.get = function (path) {
    return request("GET", path).then(
      function (data) {
        return data;
      },
      function (err) {
        if (err && err.httpStatus) return Promise.reject(err);
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
        if (err && err.httpStatus) return Promise.reject(err);
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
      ["/portfolio/holdings?limit=100", function (r) {
        if (r.items && r.items.length) D.holdings = r.items;
      }],
      ["/portfolio/transactions?limit=100", function (r) {
        if (r.items && r.items.length) D.transactions = r.items;
      }],
      ["/portfolio/allocation", function (r) {
        if (r.items && r.items.length) D.allocation = r.items;
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
      ["/developers?limit=100", function (r) {
        if (r.items && r.items.length) D.developers = r.items;
      }],
      ["/backtests?limit=100", function (r) {
        if (r.items && r.items.length) D.backtests = r.items;
      }],
      ["/dev/models?limit=100", function (r) {
        if (r.items && r.items.length) D.devConsole.models = r.items;
      }],
      ["/dev/activity?limit=100", function (r) {
        if (r.items && r.items.length) D.devConsole.activityFeed = r.items;
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
    api.register("/portfolio/transactions", function () {
      return D.transactions;
    });
    api.register("/portfolio/performance", function () {
      var s = D.portfolio.valueSeries;
      var b = D.portfolio.benchSeries;
      var pct = function (arr) {
        return arr.length > 1 ? +(((arr[arr.length - 1] - arr[0]) / arr[0]) * 100).toFixed(2) : 0;
      };
      return { period: "1y", series: s, benchmark: b, returnPct: pct(s), benchReturnPct: pct(b) };
    });
    api.register("/orders", function () {
      return D.orders;
    });
    api.register("/watchlist", function () {
      return D.watchlist;
    });
    api.register("/watchlist/{symbol}", function () {
      return { ok: true };
    });
    /* Rebalance (task 305): offline the page has already applied the
     * change optimistically using the SAME shared math the server runs,
     * so the resolver just acknowledges. */
    api.register("/rebalance/executions", function () {
      return { id: "local", executed_at: "2026-08-22" };
    });
    api.register("/rebalance/proposals", function () {
      return { trades: [], trade_count: 0, total_value: 0 };
    });
    /* Marketplace (task 306): offline the page already applied the change
     * locally using the same shared catalogue module, so acknowledge. */
    api.register("/subscriptions", function () {
      return { id: "local", status: "active" };
    });
    api.register("/subscriptions/{id}", function () {
      return { ok: true };
    });
    api.register("/preferences", function () {
      return { wings: [], risk: "medium" };
    });
    api.register("/categories", function () {
      var C = GeFi.catalog;
      return C ? C.categories(C.catalog()) : [];
    });
    api.register("/developers", function () {
      return D.developers;
    });
    /* Trading (task 308): offline the page fills with the SAME shared
     * market module the server uses, so it just needs an acknowledgement
     * that carries no server-side fill. */
    api.register("/orders/{id}", function () {
      return { ok: true };
    });
    api.register("/positions", function () {
      return [];
    });
    api.register("/market-data/sources", function () {
      return D.marketData.sources;
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
    api.register("/backtests", function () {
      return D.backtests;
    });
    api.register("/dev/models", function () {
      return D.devConsole.models;
    });
    api.register("/dev/training-jobs", function () {
      return D.devConsole.jobs;
    });
    api.register("/dev/deployments", function () {
      return D.devConsole.deployments;
    });
    api.register("/dev/activity", function () {
      return D.devConsole.activityFeed;
    });
    /* Offline the page already holds these rules in the shared module, so
     * the resolver hands back the same object the endpoint would. */
    api.register("/dev/hyperparameters", function () {
      var ops = GeFi.devOps;
      return ops ? { params: ops.HYPERPARAMS, methods: ops.METHODS } : {};
    });
    /* Offline the page assigns the run its own id and replays the same
     * seeded step sequence; metrics are keyed on the model and window, not
     * on the id, so the finished run reports identical numbers either way. */
    api.register("/optimizer/runs", function () {
      return { status: "queued" };
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

    /* Auth (task 303) — offline sign-in/sign-up always succeeds as the
     * seeded sample investor, exactly as the code prompt specifies:
     * "fallback mode signs in as the seeded demo user". */
    var SAMPLE_USER = { id: "sample-investor", name: "Alex Deme", email: "investor@demo.gefi", persona: "investor", language: "en", theme: "dark", avatar: null };
    var authFallback = function () {
      return { token: "sample-token", refresh_token: "sample-refresh", user: Object.assign({}, SAMPLE_USER) };
    };
    api.register("/auth/session", authFallback);
    api.register("/auth/register", authFallback);
    api.register("/me", function () {
      return Object.assign({}, GeFi.app.currentUser() || SAMPLE_USER);
    });
    api.register("/auth/sessions", function () {
      return [{ id: "sample-sess-1", device: "This browser (sample)", ip: "—", created: "2026-08-22", current: true }];
    });
    api.register("/auth/sessions/{id}", function () {
      return { ok: true };
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
