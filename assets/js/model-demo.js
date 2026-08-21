/* GeFi model demo harness.
 *
 * Drives the "Try it" and "Live analytics" sections on every model page.
 * Everything is read from front-matter, serialised into the page by
 * _layouts/model.html as a JSON config block — this file is generic and is
 * never edited by an individual model build task.
 *
 * Run path:
 *   config.endpoint set  ->  POST {api}/v1/models/{slug}/run
 *   otherwise            ->  seeded local mock (deterministic per input)
 *
 * Requires assets/js/dashboard.js (GeFi.svg / GeFi.fmt / GeFi.seed).
 */
(function (window, document) {
  "use strict";

  var GeFi = window.GeFi;
  if (!GeFi || !GeFi.svg) return;

  /* ---------------------------------------------- live metrics (Task 94) */

  /* A metric declared with `live:` in front-matter renders as a
   * session-measured readout with a sparkline. The walk is seeded, so it is
   * sample data — but it moves, which is the point: a latency claim reads as
   * measured only when the number is visibly being measured. */
  (function initLiveMetrics() {
    var els = document.querySelectorAll("[data-live-metric]");
    if (!els.length) return;
    Array.prototype.forEach.call(els, function (el) {
      var base = parseFloat(el.getAttribute("data-live-base"));
      if (!isFinite(base)) return;
      var jitter = parseFloat(el.getAttribute("data-live-jitter")) || base * 0.08;
      var floor = parseFloat(el.getAttribute("data-live-floor")) || 0;
      var unit = el.getAttribute("data-live-unit") || "";
      var decimals = parseInt(el.getAttribute("data-live-decimals"), 10) || 0;
      var seedKey = (el.getAttribute("data-live-slug") || "") + "|live|" + unit;
      var rand = GeFi.seed.rng(GeFi.seed.hash(seedKey));

      var valueEl = el.querySelector("[data-live-value]");
      var sparkEl = el.querySelector("[data-live-spark]");
      var samples = [];
      var v = base;
      for (var i = 0; i < 18; i++) {
        v = Math.max(floor, v + (rand() - 0.5) * jitter);
        samples.push(v);
      }

      function paint() {
        var latest = samples[samples.length - 1];
        if (valueEl) valueEl.textContent = GeFi.fmt.num(latest, decimals) + unit;
        if (sparkEl) {
          sparkEl.innerHTML = "";
          sparkEl.appendChild(GeFi.svg.sparkline(samples.slice(), { label: "measured this session" }));
        }
      }

      paint();
      window.setInterval(function () {
        var next = Math.max(floor, samples[samples.length - 1] + (rand() - 0.5) * jitter);
        samples.push(next);
        if (samples.length > 18) samples.shift();
        paint();
      }, 2000);
    });
  })();

  var root = document.querySelector("[data-model-demo]");
  if (!root) return;

  var cfgEl = root.querySelector("[data-demo-config]");
  if (!cfgEl) return;

  var cfg;
  try {
    cfg = JSON.parse(cfgEl.textContent);
  } catch (e) {
    return;
  }

  var form = root.querySelector("[data-demo-form]");
  var out = root.querySelector("[data-demo-output]");
  var statusEl = root.querySelector("[data-demo-status]");
  if (!form || !out) return;

  var busy = false;

  /* ------------------------------------------------------------- state UI */

  function setStatus(msg, kind) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    if (kind) {
      statusEl.setAttribute("data-state", kind);
    } else {
      statusEl.removeAttribute("data-state");
    }
  }

  function setBusy(on) {
    busy = on;
    root.classList.toggle("is-busy", on);
    var btn = form.querySelector("[data-demo-run]");
    if (btn) {
      btn.disabled = on;
      btn.setAttribute("aria-busy", on ? "true" : "false");
    }
  }

  function render(node) {
    out.innerHTML = "";
    out.appendChild(node);
    out.hidden = false;
  }

  function renderError(msg) {
    var box = document.createElement("div");
    box.className = "demo-error";
    box.setAttribute("role", "alert");
    var h = document.createElement("p");
    h.className = "demo-error__title";
    h.textContent = "Could not complete the run";
    var p = document.createElement("p");
    p.className = "demo-error__detail";
    p.textContent = msg;
    box.appendChild(h);
    box.appendChild(p);
    render(box);
  }

  /* ------------------------------------------------------------ collect */

  function readForm() {
    var data = {};
    (cfg.fields || []).forEach(function (f) {
      var el = form.elements[f.name];
      if (!el) return;
      if (f.type === "checkbox") {
        data[f.name] = !!el.checked;
      } else if (f.type === "number" || f.type === "range") {
        var n = parseFloat(el.value);
        data[f.name] = isFinite(n) ? n : null;
      } else {
        data[f.name] = el.value;
      }
    });
    return data;
  }

  /* --------------------------------------------------------------- mock */

  /* Deterministic sample output. Seeded from slug + inputs so the same
   * application always scores the same — a reshuffling demo reads as broken. */
  function mock(data) {
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

  /* ------------------------------------------------------------- render */

  function sampleTag() {
    var tag = document.createElement("p");
    tag.className = "demo-sample-note";
    tag.textContent = "Sample output — illustrative only, not a live model run.";
    return tag;
  }

  function renderResult(res) {
    var wrap = document.createElement("div");
    wrap.className = "demo-result";

    if (res.kind === "score") {
      var g = GeFi.svg.gauge(res.value, {
        label: res.label,
        format: function (v) {
          return GeFi.fmt.num(v, 2);
        }
      });
      var head = document.createElement("div");
      head.className = "demo-result__gauge";
      head.appendChild(g);
      wrap.appendChild(head);

      if (res.drivers && res.drivers.length) {
        var dl = document.createElement("ul");
        dl.className = "demo-drivers";
        res.drivers.forEach(function (d) {
          var li = document.createElement("li");
          var name = document.createElement("span");
          name.className = "demo-drivers__name";
          name.textContent = d.name;
          var bar = document.createElement("span");
          bar.className = "demo-drivers__bar" + (d.weight < 0 ? " is-neg" : "");
          bar.style.setProperty("--w", Math.min(100, Math.abs(d.weight) * 100).toFixed(0) + "%");
          var val = document.createElement("span");
          val.className = "demo-drivers__val";
          val.textContent = GeFi.fmt.delta(d.weight, 2);
          li.appendChild(name);
          li.appendChild(bar);
          li.appendChild(val);
          dl.appendChild(li);
        });
        wrap.appendChild(dl);
      }
    } else if (res.kind === "curve") {
      wrap.appendChild(GeFi.svg.line(res.series, { label: cfg.chartLabel || "Projection", xLabels: res.xLabels }));
      if (res.series.length > 1) {
        var legend = document.createElement("ul");
        legend.className = "demo-legend";
        res.series.forEach(function (s, i) {
          var li = document.createElement("li");
          var swatch = document.createElement("span");
          swatch.className = "demo-legend__swatch demo-legend__swatch--" + (i + 1) + (s.kind === "dashed" ? " is-dashed" : "");
          li.appendChild(swatch);
          li.appendChild(document.createTextNode(s.name));
          legend.appendChild(li);
        });
        wrap.appendChild(legend);
      }
    } else if (res.kind === "bars") {
      var bl = document.createElement("ul");
      bl.className = "demo-bars";
      res.bars.forEach(function (b) {
        var li = document.createElement("li");
        var name = document.createElement("span");
        name.className = "demo-bars__name";
        name.textContent = b.label;
        var track = document.createElement("span");
        track.className = "demo-bars__track";
        var fill = document.createElement("span");
        fill.className = "demo-bars__fill";
        fill.style.width = Math.max(1, b.pct).toFixed(1) + "%";
        track.appendChild(fill);
        var val = document.createElement("span");
        val.className = "demo-bars__val";
        val.textContent = GeFi.fmt.num(b.pct, 1) + "%";
        li.appendChild(name);
        li.appendChild(track);
        li.appendChild(val);
        bl.appendChild(li);
      });
      wrap.appendChild(bl);
    } else if (res.kind === "waterfall") {
      var wg = GeFi.svg.gauge(res.value, {
        label: res.label,
        format: function (v) {
          return GeFi.fmt.num(v, 2);
        }
      });
      var whead = document.createElement("div");
      whead.className = "demo-result__gauge";
      whead.appendChild(wg);
      wrap.appendChild(whead);

      var wl = document.createElement("ul");
      wl.className = "demo-waterfall";
      var running = res.base;
      function wrow(name, delta, total, cls) {
        var li = document.createElement("li");
        if (cls) li.className = cls;
        var n = document.createElement("span");
        n.className = "demo-waterfall__name";
        n.textContent = name;
        var d = document.createElement("span");
        d.className = "demo-waterfall__delta" + (delta != null && delta < 0 ? " is-neg" : "");
        d.textContent = delta == null ? "" : GeFi.fmt.delta(delta, 3);
        var t = document.createElement("span");
        t.className = "demo-waterfall__total";
        t.textContent = GeFi.fmt.num(total, 3);
        li.appendChild(n);
        li.appendChild(d);
        li.appendChild(t);
        wl.appendChild(li);
      }
      wrow("Base rate", null, res.base, "is-base");
      res.contribs.forEach(function (c) {
        running += c.delta;
        wrow(c.name, c.delta, running);
      });
      wrow("Final " + (res.label || "score"), null, res.value, "is-final");
      wrap.appendChild(wl);

      if (cfg.noticeFormat) {
        var adverse = res.contribs
          .filter(function (c) {
            return c.delta > 0;
          })
          .sort(function (a, b) {
            return b.delta - a.delta;
          });
        var notice = document.createElement("div");
        notice.className = "demo-notice";
        var nh = document.createElement("p");
        nh.className = "demo-notice__title";
        nh.textContent = cfg.noticeFormat + " — principal reasons affecting this result";
        notice.appendChild(nh);
        var ol = document.createElement("ol");
        adverse.slice(0, 4).forEach(function (c) {
          var oli = document.createElement("li");
          oli.textContent = c.name;
          ol.appendChild(oli);
        });
        notice.appendChild(ol);
        wrap.appendChild(notice);
      }
    } else if (res.kind === "table") {
      var t = document.createElement("table");
      t.className = "demo-table";
      var thead = document.createElement("thead");
      var htr = document.createElement("tr");
      res.columns.forEach(function (c) {
        var th = document.createElement("th");
        th.scope = "col";
        th.textContent = c;
        htr.appendChild(th);
      });
      thead.appendChild(htr);
      t.appendChild(thead);
      var tb = document.createElement("tbody");
      res.rows.forEach(function (row) {
        var tr = document.createElement("tr");
        row.forEach(function (cell, i) {
          var td = document.createElement("td");
          if (i > 0) td.className = "is-num";
          td.textContent = cell;
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      });
      t.appendChild(tb);
      var scroll = document.createElement("div");
      scroll.className = "demo-table-scroll";
      scroll.appendChild(t);
      wrap.appendChild(scroll);
    } else {
      var p = document.createElement("p");
      p.className = "demo-text";
      p.textContent = res.text;
      wrap.appendChild(p);
    }

    if (res.sample) wrap.appendChild(sampleTag());
    render(wrap);
  }

  /* ------------------------------------------ graph preview (Task 94) */

  /* A `demo.graph` front-matter block renders a small entity-graph preview:
   * a deterministic force layout (seeded ring start + a few relaxation
   * passes), animated outward from the centre node when a run starts so the
   * score visibly "resolves" from the subgraph. */
  var graphCanvas = root.querySelector("[data-demo-graph-canvas]");

  function layoutGraph(g) {
    var nodes = [g.center].concat(g.nodes || []);
    var index = {};
    nodes.forEach(function (n, i) { index[n.id] = i; });
    var edges = (g.edges || []).map(function (e) {
      return [index[e[0]], index[e[1]]];
    }).filter(function (e) { return e[0] != null && e[1] != null; });

    /* BFS depth from the centre — drives both the ring start and the
     * resolve animation order. */
    var depth = nodes.map(function () { return -1; });
    depth[0] = 0;
    var queue = [0];
    while (queue.length) {
      var cur = queue.shift();
      edges.forEach(function (e) {
        var other = e[0] === cur ? e[1] : e[1] === cur ? e[0] : -1;
        if (other !== -1 && depth[other] === -1) {
          depth[other] = depth[cur] + 1;
          queue.push(other);
        }
      });
    }

    var W = 560, H = 330, cx = W / 2, cy = H / 2;
    var rand = GeFi.seed.rng(GeFi.seed.hash(cfg.slug + "|graph"));
    var byDepth = {};
    nodes.forEach(function (n, i) {
      if (depth[i] < 0) depth[i] = 2;
      (byDepth[depth[i]] = byDepth[depth[i]] || []).push(i);
    });
    var pos = nodes.map(function () { return [cx, cy]; });
    Object.keys(byDepth).forEach(function (d) {
      var ring = byDepth[d];
      var r = 52 * d + (d > 0 ? 14 : 0);
      ring.forEach(function (i, k) {
        if (d === "0") return;
        var a = (k / ring.length) * Math.PI * 2 + rand() * 0.7;
        pos[i] = [cx + Math.cos(a) * (r + rand() * 16), cy + Math.sin(a) * (r * 0.72 + rand() * 12)];
      });
    });

    /* A few relaxation passes: node repulsion + edge springs. */
    for (var it = 0; it < 30; it++) {
      for (var a = 1; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var dx = pos[b][0] - pos[a][0], dy = pos[b][1] - pos[a][1];
          var dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          if (dist < 42) {
            var push = (42 - dist) / dist * 0.5;
            pos[a][0] -= dx * push; pos[a][1] -= dy * push;
            pos[b][0] += dx * push; pos[b][1] += dy * push;
          }
        }
      }
      edges.forEach(function (e) {
        var i0 = e[0], i1 = e[1];
        var dx = pos[i1][0] - pos[i0][0], dy = pos[i1][1] - pos[i0][1];
        var dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        var pull = (dist - 64) / dist * 0.08;
        if (i0 !== 0) { pos[i0][0] += dx * pull; pos[i0][1] += dy * pull; }
        if (i1 !== 0) { pos[i1][0] -= dx * pull; pos[i1][1] -= dy * pull; }
      });
    }
    nodes.forEach(function (n, i) {
      pos[i][0] = Math.min(W - 28, Math.max(28, pos[i][0]));
      pos[i][1] = Math.min(H - 24, Math.max(24, pos[i][1]));
    });

    return { nodes: nodes, edges: edges, pos: pos, depth: depth, W: W, H: H };
  }

  function renderGraph() {
    if (!graphCanvas || !cfg.graph || !cfg.graph.center) return;
    var g = layoutGraph(cfg.graph);
    var svg = GeFi.svg.el("svg", {
      viewBox: "0 0 " + g.W + " " + g.H,
      class: "demo-graph__svg",
      role: "img",
      "aria-label": "Entity graph preview — synthetic sample"
    });
    g.edges.forEach(function (e) {
      svg.appendChild(GeFi.svg.el("line", {
        x1: g.pos[e[0]][0].toFixed(1), y1: g.pos[e[0]][1].toFixed(1),
        x2: g.pos[e[1]][0].toFixed(1), y2: g.pos[e[1]][1].toFixed(1),
        class: "demo-graph__edge"
      }));
    });
    g.nodes.forEach(function (n, i) {
      var group = GeFi.svg.el("g", {
        class: "demo-graph__node demo-graph__node--" + (n.kind || "entity"),
        style: "--resolve-delay: " + (g.depth[i] * 220) + "ms"
      });
      group.appendChild(GeFi.svg.el("circle", {
        cx: g.pos[i][0].toFixed(1), cy: g.pos[i][1].toFixed(1),
        r: i === 0 ? 13 : 8
      }));
      if (n.label) {
        var t = GeFi.svg.el("text", {
          x: g.pos[i][0].toFixed(1),
          y: (g.pos[i][1] - (i === 0 ? 18 : 12)).toFixed(1),
          "text-anchor": "middle"
        });
        t.textContent = n.label;
        group.appendChild(t);
      }
      svg.appendChild(group);
    });
    graphCanvas.innerHTML = "";
    graphCanvas.appendChild(svg);

    if (cfg.graph.kinds && cfg.graph.kinds.length) {
      var legend = document.createElement("ul");
      legend.className = "demo-graph__legend";
      [{ kind: cfg.graph.center.kind || "center", label: cfg.graph.center.label || "Centre" }]
        .concat(cfg.graph.kinds)
        .forEach(function (k) {
          var li = document.createElement("li");
          var dot = document.createElement("span");
          dot.className = "demo-graph__dot demo-graph__dot--" + k.kind;
          li.appendChild(dot);
          li.appendChild(document.createTextNode(k.label));
          legend.appendChild(li);
        });
      graphCanvas.appendChild(legend);
    }
  }

  function resolveGraph() {
    var fig = root.querySelector("[data-demo-graph]");
    if (!fig) return;
    fig.classList.remove("is-resolving");
    void fig.offsetWidth;
    fig.classList.add("is-resolving");
  }

  renderGraph();

  /* ------------------------------------------ refreshed chip (Task 95) */

  var refreshedEl = root.querySelector("[data-demo-refreshed]");
  var refreshedMins = null;

  function paintRefreshed() {
    if (!refreshedEl || refreshedMins == null) return;
    refreshedEl.hidden = false;
    refreshedEl.textContent = refreshedMins === 0
      ? "Data refreshed just now — sample cadence"
      : "Data refreshed " + refreshedMins + "m ago — sample cadence";
  }

  if (cfg.refreshed && refreshedEl) {
    refreshedMins = 1 + (GeFi.seed.hash(cfg.slug + "|refreshed") % 9);
    paintRefreshed();
    window.setInterval(function () {
      refreshedMins += 1;
      paintRefreshed();
    }, 60000);
  }

  /* -------------------------------------------- tabs field (Task 96) */

  form.addEventListener("change", function (e) {
    var input = e.target;
    if (!input || input.type !== "radio") return;
    var fieldset = input.closest(".demo-field--tabs");
    if (!fieldset) return;
    fieldset.querySelectorAll(".demo-tab").forEach(function (tab) {
      var radio = tab.querySelector("input[type=radio]");
      tab.classList.toggle("is-active", !!(radio && radio.checked));
    });
  });

  /* ---------------------------------------------------------------- run */

  function run() {
    if (busy) return;
    var data = readForm();
    setBusy(true);
    setStatus("Running…", "busy");
    out.setAttribute("aria-busy", "true");
    resolveGraph();

    if (!cfg.endpoint) {
      /* Local seeded mock. Small delay so the loading state is perceivable
       * (skipped in live mode, where latency would fight the sliders). */
      window.setTimeout(function () {
        try {
          renderResult(mock(data));
          setStatus("Sample run complete.", "ok");
          if (cfg.refreshed) {
            refreshedMins = 0;
            paintRefreshed();
          }
        } catch (e) {
          renderError("Sample generation failed.");
          setStatus("Run failed.", "error");
        }
        out.setAttribute("aria-busy", "false");
        setBusy(false);
      }, cfg.live ? 40 : 320);
      return;
    }

    window
      .fetch(cfg.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ inputs: data })
      })
      .then(function (r) {
        if (!r.ok) throw new Error("Request failed (" + r.status + ")");
        return r.json();
      })
      .then(function (json) {
        var res = json && json.result ? json.result : json;
        if (!res || !res.kind) res = { kind: cfg.output || "text", text: JSON.stringify(json) };
        renderResult(res);
        setStatus("Run complete.", "ok");
        if (cfg.refreshed) {
          refreshedMins = 0;
          paintRefreshed();
        }
      })
      .catch(function (err) {
        renderError(err && err.message ? err.message : "Network error.");
        setStatus("Run failed.", "error");
      })
      .then(function () {
        out.setAttribute("aria-busy", "false");
        setBusy(false);
      });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    run();
  });

  /* Range readouts track their slider. */
  form.addEventListener("input", function (e) {
    var el = e.target;
    if (el && el.type === "range") {
      var label = el.closest(".demo-field--range");
      var out = label && label.querySelector("[data-range-readout]");
      if (out) out.textContent = el.value;
    }
  });

  /* Live mode: re-run on every input, debounced, and once on load. */
  if (cfg.live) {
    var liveTimer = null;
    form.addEventListener("input", function () {
      window.clearTimeout(liveTimer);
      liveTimer = window.setTimeout(run, 180);
    });
    form.addEventListener("change", function () {
      window.clearTimeout(liveTimer);
      liveTimer = window.setTimeout(run, 60);
    });
    run();
  }

  form.addEventListener("reset", function () {
    window.setTimeout(function () {
      out.hidden = true;
      out.innerHTML = "";
      setStatus("");
    }, 0);
  });

  /* --------------------------------------------------------- analytics */

  var netTarget = document.querySelector("[data-network-diagram]");
  if (netTarget) {
    var netCount = parseInt(netTarget.getAttribute("data-network-count"), 10) || 0;
    if (netCount > 0) {
      netTarget.appendChild(GeFi.svg.network(netCount, { label: netTarget.getAttribute("data-network-label") || "participants" }));
    }
  }

  var analytics = document.querySelector("[data-model-analytics]");
  if (analytics) {
    var row = GeFi.model(cfg.slug);
    var target = analytics.querySelector("[data-analytics-chart]");
    if (row && row.series && target) {
      target.appendChild(
        GeFi.svg.line([{ name: row.unit, values: row.series, kind: "area" }], {
          label: row.unit + " over the last 12 runs",
          xLabels: ["12 runs ago", "latest"]
        })
      );
      var cur = analytics.querySelector("[data-analytics-current]");
      if (cur) cur.textContent = GeFi.fmt.num(row.series[row.series.length - 1], 2);
      var delta = analytics.querySelector("[data-analytics-delta]");
      if (delta) {
        var d = row.series[row.series.length - 1] - row.series[0];
        delta.textContent = GeFi.fmt.delta(d, 2);
        delta.setAttribute("data-dir", d >= 0 ? "up" : "down");
      }
    } else if (target) {
      var none = document.createElement("p");
      none.className = "muted small";
      none.textContent = "No analytics series registered for this model yet.";
      target.appendChild(none);
    }
  }
})(window, document);
