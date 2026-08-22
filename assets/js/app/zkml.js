/* zKML verification surface (task 231). Deterministic mock pipeline:
 * same model + shard count always yields the same shard timings, log
 * and proof hash (FNV-1a) — a sample of what the prover pipeline in
 * the zKML deck does, clearly labelled as such. */
(function (window, document) {
  "use strict";

  function fnv1a(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ("00000000" + h.toString(16)).slice(-8);
  }

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO || !GeFi.MODELS) return;
    var form = document.querySelector("[data-zk-form]");
    if (!form) return;
    var app = GeFi.app;
    var Z = GeFi.DEMO.zkml;

    var KEY = "gefi-app-zkml";
    function load() {
      try {
        var raw = sessionStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return null;
    }
    function save(v) {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(v));
      } catch (e) {}
    }

    /* ---- form ---- */
    var modelSel = document.querySelector("[data-zk-models]");
    GeFi.MODELS.forEach(function (m) {
      var o = document.createElement("option");
      o.value = m.slug;
      o.textContent = m.name + (m.federated ? " (federated)" : "");
      modelSel.appendChild(o);
    });
    var shardsInput = form.elements.shards;
    var shardVal = document.querySelector("[data-zk-shardval]");
    shardsInput.value = Z.shardsDefault;
    shardVal.textContent = String(Z.shardsDefault);
    shardsInput.addEventListener("input", function () {
      shardVal.textContent = shardsInput.value;
    });

    /* ---- federated model links ---- */
    var fedEl = document.querySelector("[data-zk-federated]");
    GeFi.MODELS.filter(function (m) { return m.federated; }).forEach(function (m) {
      var a = document.createElement("a");
      a.className = "app-chip app-chip--outline";
      a.href = "/models/" + m.slug + "/";
      a.textContent = m.name;
      fedEl.appendChild(a);
    });

    /* ---- pipeline plan (seeded, deterministic) ---- */
    function plan(modelSlug, shards) {
      var rand = GeFi.seed.rng(GeFi.seed.hash("zkml|" + modelSlug + "|" + shards));
      var p = {
        model: modelSlug,
        shards: shards,
        compile: 2 + Math.round(rand() * 2),          /* ticks */
        create: 1 + Math.round(rand()),
        lanes: [],
        aggregate: 2 + Math.round(rand()),
        verify: 1 + Math.round(rand()),
        hash: fnv1a(modelSlug + "|" + shards)
      };
      for (var i = 0; i < shards; i++) {
        p.lanes.push(3 + Math.round(rand() * 4));
      }
      var maxLane = Math.max.apply(null, p.lanes);
      var laneSum = p.lanes.reduce(function (n, x) { return n + x; }, 0);
      /* one tick ≈ 15 "seconds" of prover time in the fiction */
      p.wallSecs = (p.compile + p.create + maxLane + p.aggregate + p.verify) * 15;
      p.taskSecs = (p.compile + p.create + laneSum + p.aggregate + p.verify) * 15;
      return p;
    }

    /* ---- rendering ---- */
    var stepsEl = document.querySelector("[data-zk-steps]");
    var lanesEl = document.querySelector("[data-zk-lanes]");
    var logEl = document.querySelector("[data-zk-log]");
    var summaryEl = document.querySelector("[data-zk-summary]");
    var summaryEmpty = document.querySelector("[data-zk-summary-empty]");
    var pipelineEmpty = document.querySelector("[data-zk-pipeline-empty]");
    var runBtn = document.querySelector("[data-zk-run]");

    function stageNames(shards) {
      return ["Compile WASM", "Create " + shards + " shards", "Prove shards", "Aggregate proofs", "Verify aggregate"];
    }

    function renderSteps(shards, states) {
      stepsEl.innerHTML = "";
      stageNames(shards).forEach(function (name, i) {
        if (i > 0) {
          var arrow = document.createElement("span");
          arrow.className = "app-zk-step__arrow";
          arrow.textContent = "→";
          arrow.setAttribute("aria-hidden", "true");
          stepsEl.appendChild(arrow);
        }
        var step = document.createElement("span");
        var state = states[i];
        step.className = "app-zk-step" + (state === "running" ? " app-zk-step--running" : state === "done" ? " app-zk-step--done" : "");
        step.setAttribute("data-zk-stage-state", state);
        step.textContent = (state === "done" ? "✓ " : "") + name;
        stepsEl.appendChild(step);
      });
    }

    function renderLanes(p, progress) {
      lanesEl.innerHTML = "";
      p.lanes.forEach(function (dur, i) {
        var lane = document.createElement("div");
        lane.className = "app-zk-lane";
        var name = document.createElement("span");
        name.className = "app-zk-lane__name mono";
        name.textContent = "shard " + i;
        var track = document.createElement("div");
        track.className = "app-meter" + (progress[i] >= 1 ? " app-meter--good" : "");
        track.style.flex = "1";
        var fill = document.createElement("div");
        fill.className = "app-meter__fill";
        fill.style.width = Math.round(Math.min(1, progress[i]) * 100) + "%";
        track.appendChild(fill);
        lane.appendChild(name);
        lane.appendChild(track);
        lane.appendChild(app.chip(progress[i] >= 1 ? "ok" : progress[i] > 0 ? "info" : "draft", progress[i] >= 1 ? "proved" : progress[i] > 0 ? "proving" : "queued"));
        lanesEl.appendChild(lane);
      });
    }

    function logLine(text) {
      logEl.textContent += (logEl.textContent ? "\n" : "") + text;
      logEl.scrollTop = logEl.scrollHeight;
    }

    function renderSummary(p) {
      summaryEl.innerHTML = "";
      summaryEmpty.innerHTML = "";
      var head = document.createElement("div");
      head.className = "app-rowcard__head";
      head.appendChild(app.chip("ok", "Verified"));
      var label = document.createElement("span");
      label.className = "app-kpi__sub";
      label.textContent = "sample verification — deterministic mock of the prover pipeline";
      head.appendChild(label);
      summaryEl.appendChild(head);
      var stats = document.createElement("div");
      stats.className = "app-gridcard__stats";
      stats.style.gridTemplateColumns = "repeat(auto-fit, minmax(160px, 1fr))";
      stats.style.marginTop = "12px";
      [
        ["Proof hash", "0x" + p.hash + "…", "mono"],
        ["Model", p.model, ""],
        ["Shards", String(p.shards), "mono"],
        ["Wall clock", p.wallSecs + " secs", "mono"],
        ["Task time", p.taskSecs + " secs", "mono"]
      ].forEach(function (row) {
        var el = document.createElement("div");
        el.className = "app-gridcard__stat";
        var sl = document.createElement("span");
        sl.className = "app-gridcard__statlabel";
        sl.textContent = row[0];
        var sv = document.createElement("span");
        sv.className = "app-gridcard__statval " + row[2];
        if (row[0] === "Proof hash") sv.setAttribute("data-zk-hash", "");
        sv.textContent = row[1];
        el.appendChild(sl);
        el.appendChild(sv);
        stats.appendChild(el);
      });
      summaryEl.appendChild(stats);
    }

    function fullLog(p) {
      var lines = ["$ gefi zkml verify --model " + p.model + " --shards " + p.shards + "   # sample run"];
      lines.push("Compiling model to WASM… done (" + p.compile * 15 + " secs)");
      lines.push("Created " + p.shards + " shards");
      p.lanes.forEach(function (dur, i) {
        lines.push("Shard " + i + " verification succeeded (task time " + dur * 15 + " secs)");
      });
      lines.push("Aggregating " + p.shards + " proofs… done");
      lines.push("Aggregate proof verified ✓");
      lines.push("Total wall clock time: " + p.wallSecs + " secs (task time " + p.taskSecs + " secs)");
      lines.push("Proof hash: 0x" + p.hash);
      return lines;
    }

    function renderComplete(p) {
      pipelineEmpty.innerHTML = "";
      renderSteps(p.shards, ["done", "done", "done", "done", "done"]);
      renderLanes(p, p.lanes.map(function () { return 1; }));
      logEl.textContent = "";
      fullLog(p).forEach(logLine);
      renderSummary(p);
    }

    function renderEmpty() {
      pipelineEmpty.appendChild(app.empty({ head: "No verification yet", hint: "Pick a model and shard count above, then run the pipeline." }));
      summaryEmpty.appendChild(app.empty({ head: "Nothing verified yet", hint: "The summary card appears after the first run." }));
      logEl.textContent = "— prover output streams here —";
    }

    /* ---- animated run ---- */
    var timer = null;
    function run(modelSlug, shards) {
      if (timer) clearInterval(timer);
      var p = plan(modelSlug, shards);
      var tick = 0;
      var laneStart = p.compile + p.create;
      var maxLane = Math.max.apply(null, p.lanes);
      var aggStart = laneStart + maxLane;
      var total = aggStart + p.aggregate + p.verify;
      var announcedShards = {};
      runBtn.disabled = true;
      runBtn.textContent = "Running…";
      pipelineEmpty.innerHTML = "";
      summaryEl.innerHTML = "";
      summaryEmpty.innerHTML = "";
      logEl.textContent = "";
      logLine("$ gefi zkml verify --model " + p.model + " --shards " + p.shards + "   # sample run");
      logLine("Compiling model to WASM…");

      timer = setInterval(function () {
        tick += 1;
        var states = [
          tick >= p.compile ? "done" : "running",
          tick >= laneStart ? "done" : tick >= p.compile ? "running" : "pending",
          tick >= aggStart ? "done" : tick >= laneStart ? "running" : "pending",
          tick >= aggStart + p.aggregate ? "done" : tick >= aggStart ? "running" : "pending",
          tick >= total ? "done" : tick >= aggStart + p.aggregate ? "running" : "pending"
        ];
        renderSteps(p.shards, states);
        renderLanes(p, p.lanes.map(function (dur) {
          return (tick - laneStart) / dur;
        }));
        if (tick === p.compile) logLine("Compiled in " + p.compile * 15 + " secs");
        if (tick === laneStart) logLine("Created " + p.shards + " shards");
        p.lanes.forEach(function (dur, i) {
          if (tick >= laneStart + dur && !announcedShards[i]) {
            announcedShards[i] = true;
            logLine("Shard " + i + " verification succeeded (task time " + dur * 15 + " secs)");
          }
        });
        if (tick === aggStart) logLine("Aggregating " + p.shards + " proofs…");
        if (tick === aggStart + p.aggregate) logLine("Aggregate proof verified ✓");
        if (tick >= total) {
          clearInterval(timer);
          timer = null;
          logLine("Total wall clock time: " + p.wallSecs + " secs (task time " + p.taskSecs + " secs)");
          logLine("Proof hash: 0x" + p.hash);
          renderSummary(p);
          save(p);
          runBtn.disabled = false;
          runBtn.textContent = "Run verification";
        }
      }, 220);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      run(modelSel.value, parseInt(shardsInput.value, 10));
    });

    /* ---- initial state ---- */
    var saved = load();
    if (saved && saved.hash) {
      modelSel.value = saved.model;
      shardsInput.value = saved.shards;
      shardVal.textContent = String(saved.shards);
      renderComplete(saved);
    } else {
      renderEmpty();
    }
  });
})(window, document);
