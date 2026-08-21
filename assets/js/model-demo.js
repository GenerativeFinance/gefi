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
      return { sample: true, kind: "curve", series: [{ name: cfg.seriesLabel || "Projection", values: vals, kind: "area" }], xLabels: cfg.xLabels || ["t0", "t+11"] };
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

  /* ---------------------------------------------------------------- run */

  function run() {
    if (busy) return;
    var data = readForm();
    setBusy(true);
    setStatus("Running…", "busy");
    out.setAttribute("aria-busy", "true");

    if (!cfg.endpoint) {
      /* Local seeded mock. Small delay so the loading state is perceivable
       * (skipped in live mode, where latency would fight the sliders). */
      window.setTimeout(function () {
        try {
          renderResult(mock(data));
          setStatus("Sample run complete.", "ok");
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
