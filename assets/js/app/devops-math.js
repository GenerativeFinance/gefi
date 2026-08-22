/* Developer console ops (task 310) — ONE implementation of the training
 * progression, the per-deployment telemetry and the log lines, shared by
 * the console pages and the mock server (loaded there through the same vm
 * shim). A training job the server advanced and the same job advanced in
 * the browser report the same accuracy and loss at the same step, and the
 * monitoring meters read the same in both modes.
 *
 * Pure: seeded per job or deployment, no DOM, no storage, no Math.random. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  /* Model lifecycle. Order matters: promote() walks forward along it and a
   * model cannot skip a stage. */
  var LIFECYCLE = ["Draft", "Testing", "Approved", "Deployed"];

  var ENVIRONMENTS = ["Development", "Staging", "Production"];

  /* Hyperparameter bounds. The page validates against these before posting
   * and the server validates against them on arrival — one set of rules, so
   * the two cannot disagree about what is acceptable. */
  var HYPERPARAMS = {
    lr: { label: "Learning rate", min: 0.000001, max: 1, kind: "float" },
    batch: { label: "Batch size", min: 1, max: 4096, kind: "int" },
    epochs: { label: "Epochs", min: 1, max: 10000, kind: "int" }
  };

  /* The optimizers the training form offers. The form renders its options
   * from this list and the server validates against it, so a method the
   * dropdown shows is always one the server will accept. */
  var METHODS = ["AdamW", "SGD + momentum", "LAMB"];

  /* Returns null when the hyperparameters are runnable, else why not. */
  function validateJob(spec) {
    var s = spec || {};
    if (!s.model) return "pick a model to train";
    var keys = Object.keys(HYPERPARAMS);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var rule = HYPERPARAMS[k];
      var raw = s[k];
      var v = rule.kind === "int" ? parseInt(raw, 10) : parseFloat(raw);
      if (!isFinite(v)) return rule.label + " is required";
      if (rule.kind === "int" && String(raw).indexOf(".") > -1) return rule.label + " must be a whole number";
      if (v < rule.min || v > rule.max) {
        return rule.label + " must be between " + rule.min + " and " + rule.max;
      }
    }
    if (!s.method) return "pick an optimization method";
    if (METHODS.indexOf(s.method) === -1) return "unknown optimization method: " + s.method;
    return null;
  }

  /* Returns null when a model can be registered, else why not. Lives here
   * rather than being restated on each side, so the page and the registry
   * refuse the same names in the same words. */
  function validateModel(spec, existing) {
    var name = ((spec && spec.name) || "").trim();
    if (!name) return "name is required";
    var clash = (existing || []).some(function (m) {
      return String(m.name).toLowerCase() === name.toLowerCase();
    });
    if (clash) return "a model called " + name + " already exists";
    return null;
  }

  /* The next stage a model may move to, or null at the end of the line. */
  function nextStage(status) {
    var i = LIFECYCLE.indexOf(status);
    return i === -1 || i === LIFECYCLE.length - 1 ? null : LIFECYCLE[i + 1];
  }

  /* Returns null when a stage change is legal, else why not. */
  function validateStage(from, to) {
    if (LIFECYCLE.indexOf(to) === -1) return "unknown stage: " + to;
    var next = nextStage(from);
    if (to !== next) {
      return "a model moves one stage at a time — " + from + " goes to " + (next || "nowhere further");
    }
    return null;
  }

  /* The name a job gets from what it was asked to do. Both sides derive it
   * the same way, so a job created live and one created offline are labelled
   * identically. */
  function jobName(spec) {
    return String(spec.model || "model").toLowerCase().replace(/\s+/g, "-") +
      " " + String(spec.method || "run").split(" ")[0].toLowerCase() + " run";
  }

  /* The percentages a job steps through, seeded on its name. A client that
   * loses the progress stream and finishes locally walks the same sequence. */
  function jobSteps(name) {
    var rand = GeFi.seed.rng(GeFi.seed.hash("tjstep|" + name));
    var out = [];
    var p = 0;
    while (p < 100) {
      p = Math.min(100, p + 15 + Math.round(rand() * 10));
      out.push(p);
    }
    return out;
  }

  /* Accuracy and loss at a given percentage. Derived from the progress, so
   * a job at 60% reports the same numbers wherever it is being watched. */
  function jobMetrics(name, progress) {
    var rand = GeFi.seed.rng(GeFi.seed.hash("tjm|" + name));
    var ceiling = 10 + rand() * 6;
    var floor = 0.07 * rand();
    return {
      accuracy: +(80 + (progress / 100) * ceiling).toFixed(1),
      loss: +(0.4 - (progress / 100) * (0.4 - floor)).toFixed(3)
    };
  }

  /* Wall-clock a job reports once it is done — a label, not a measurement. */
  function jobDuration(name) {
    var rand = GeFi.seed.rng(GeFi.seed.hash("tjd|" + name));
    var mins = 2 + Math.round(rand() * 40);
    return mins < 60 ? mins + "m" : Math.floor(mins / 60) + "h " + (mins % 60) + "m";
  }

  /* --------------------------------------------------------- telemetry */

  /* Per-deployment telemetry. Seeded on the deployment AND the refresh
   * count, so two deployments never show the same numbers and a refresh
   * moves them — the copy-paste-twins problem this page used to have.
   *
   * A stopped deployment serves nothing, so it reports nothing: zeroes, not
   * the numbers it happened to have when it was last up. */
  function telemetry(name, refresh, status) {
    if (status && status !== "active") {
      return { accuracy: 0, response: 0, uptime: 0, errors: 0, requests: 0, serving: false };
    }
    /* Each field gets its own stream. Drawing them in sequence from one
     * stream makes every metric collide whenever two names happen to hash
     * into a similar first draw, which is how two different deployments
     * ended up showing the same headline accuracy. */
    function draw(field) {
      return GeFi.seed.rng(GeFi.seed.hash("mo|" + field + "|" + name + "|" + (refresh || 0)))();
    }
    return {
      accuracy: +(90 + draw("accuracy") * 8).toFixed(1),
      response: Math.round(30 + draw("response") * 40),
      uptime: +(99 + draw("uptime")).toFixed(1),
      errors: +(draw("errors") * 0.9).toFixed(2),
      requests: Math.round(20000 + draw("requests") * 400000),
      serving: true
    };
  }

  /* Fleet health measured from the deployments that are actually serving,
   * rather than stated as a constant that no deployment has to agree with. */
  function fleet(deployments, refresh) {
    var live = (deployments || []).filter(function (d) {
      return d.status === "active";
    });
    if (!live.length) {
      return { health: 0, response: 0, active: 0, total: (deployments || []).length };
    }
    var stats = live.map(function (d) {
      return telemetry(d.name, refresh, d.status);
    });
    var health = stats.reduce(function (a, s) { return a + s.uptime; }, 0) / stats.length;
    var response = stats.reduce(function (a, s) { return a + s.response; }, 0) / stats.length;
    return {
      health: +health.toFixed(1),
      response: Math.round(response),
      active: live.length,
      total: (deployments || []).length
    };
  }

  /* Recent log lines for a deployment. Seeded, so the modal shows the same
   * lines the server would return. */
  function logLines(name, count) {
    var n = count || 8;
    var rand = GeFi.seed.rng(GeFi.seed.hash("logs|" + name));
    var out = [];
    for (var i = 0; i < n; i++) {
      out.push(
        "t-" + (n - i) + "m  " + (rand() > 0.85 ? "WARN" : "INFO") +
        "  inference ok  " + Math.round(30 + rand() * 60) + "ms  run_" +
        Math.floor(rand() * 1e6).toString(16)
      );
    }
    return out;
  }

  /* A series for the ops charts, ending at the current telemetry value. */
  function seriesFor(name, key, points) {
    var n = points || 24;
    var rand = GeFi.seed.rng(GeFi.seed.hash("tel|" + name + "|" + key));
    var base = key === "latency" ? 45 : key === "errors" ? 0.4 : 99.5;
    var swing = key === "latency" ? 12 : key === "errors" ? 0.3 : 0.4;
    var out = [];
    for (var i = 0; i < n; i++) {
      out.push(+(base + (rand() - 0.5) * swing * 2).toFixed(key === "errors" ? 2 : 1));
    }
    return out;
  }

  GeFi.devOps = {
    LIFECYCLE: LIFECYCLE,
    ENVIRONMENTS: ENVIRONMENTS,
    HYPERPARAMS: HYPERPARAMS,
    METHODS: METHODS,
    validateModel: validateModel,
    nextStage: nextStage,
    validateStage: validateStage,
    validateJob: validateJob,
    jobName: jobName,
    jobSteps: jobSteps,
    jobMetrics: jobMetrics,
    jobDuration: jobDuration,
    telemetry: telemetry,
    fleet: fleet,
    logLines: logLines,
    seriesFor: seriesFor
  };
})(typeof window !== "undefined" ? window : globalThis);
