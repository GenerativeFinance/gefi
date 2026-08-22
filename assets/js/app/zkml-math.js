/* zKML proof pipeline (task 319) — ONE implementation of the pipeline
 * plan, the proof hash and the event timeline, shared by the zKML page and
 * the mock server (loaded there through the same vm shim).
 *
 * The bug this fixes: the page and the mock each had their own plan()
 * seeded from the same key but DRAWING IN A DIFFERENT ORDER — the page
 * drew compile, create, then lanes; the mock drew lanes first — so the
 * "same" verification produced different shard timings on each side. One
 * function, one draw order, one answer.
 *
 * Pure: seeded per model + shard count, no DOM, no storage, no
 * Math.random. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  var STAGES = ["compile", "shard", "prove", "aggregate", "verify"];
  var SECS_PER_TICK = 15; /* one tick ≈ 15 "seconds" of prover time */
  var MIN_SHARDS = 1;
  var MAX_SHARDS = 16;

  /* FNV-1a, as the client has always computed it. The proof hash for a
   * (model, shards) pair is a pure function of those inputs, so the same
   * run always yields the same hash — that determinism IS the demo. */
  function fnv1a(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ("00000000" + h.toString(16)).slice(-8);
  }

  /* Returns null when a verification request is runnable, else why not. */
  function validate(spec, models) {
    var s = spec || {};
    if (!s.model) return "pick a model to verify";
    if (models && !models.some(function (m) { return m.slug === s.model; })) {
      return "unknown model: " + s.model;
    }
    var n = typeof s.shards === "number" ? s.shards : parseInt(s.shards, 10);
    if (!isFinite(n) || n < MIN_SHARDS || n > MAX_SHARDS) {
      return "shards must be between " + MIN_SHARDS + " and " + MAX_SHARDS;
    }
    return null;
  }

  /* The pipeline plan — the page's original draw order, verbatim:
   * compile, create, lanes, aggregate, verify. */
  function plan(modelSlug, shards) {
    var rand = GeFi.seed.rng(GeFi.seed.hash("zkml|" + modelSlug + "|" + shards));
    var p = {
      model: modelSlug,
      shards: shards,
      compile: 2 + Math.round(rand() * 2),
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
    p.wallSecs = (p.compile + p.create + maxLane + p.aggregate + p.verify) * SECS_PER_TICK;
    p.taskSecs = (p.compile + p.create + laneSum + p.aggregate + p.verify) * SECS_PER_TICK;
    return p;
  }

  /* The proof record a completed run produces. */
  function record(p) {
    return {
      model: p.model,
      shards: p.shards,
      hash: "0x" + p.hash,
      wall_secs: p.wallSecs,
      task_secs: p.taskSecs,
      lanes_secs: p.lanes.map(function (t) { return t * SECS_PER_TICK; }),
      verified: true
    };
  }

  /* The event timeline for a run, in tick order. Streamed live by the
   * server and replayed locally offline, so the stepper and the log panel
   * walk through the same sequence either way. Each event: { tick, event,
   * data }. */
  function timeline(p) {
    var out = [];
    var laneStart = p.compile + p.create;
    var maxLane = Math.max.apply(null, p.lanes);
    var aggStart = laneStart + maxLane;
    var total = aggStart + p.aggregate + p.verify;

    out.push({ tick: 0, event: "zkml.stage", data: { stage: "compile", state: "running" } });
    out.push({ tick: 0, event: "zkml.log", data: { line: "Compiling model to WASM…" } });
    out.push({ tick: p.compile, event: "zkml.stage", data: { stage: "compile", state: "done" } });
    out.push({ tick: p.compile, event: "zkml.log", data: { line: "Compiled in " + p.compile * SECS_PER_TICK + " secs" } });
    out.push({ tick: p.compile, event: "zkml.stage", data: { stage: "shard", state: "running" } });
    out.push({ tick: laneStart, event: "zkml.stage", data: { stage: "shard", state: "done" } });
    out.push({ tick: laneStart, event: "zkml.log", data: { line: "Created " + p.shards + " shards" } });
    out.push({ tick: laneStart, event: "zkml.stage", data: { stage: "prove", state: "running" } });
    p.lanes.forEach(function (dur, i) {
      out.push({
        tick: laneStart + dur,
        event: "zkml.shard_proved",
        data: { shard: i, task_secs: dur * SECS_PER_TICK }
      });
      out.push({
        tick: laneStart + dur,
        event: "zkml.log",
        data: { line: "Shard " + i + " verification succeeded (task time " + dur * SECS_PER_TICK + " secs)" }
      });
    });
    out.push({ tick: aggStart, event: "zkml.stage", data: { stage: "prove", state: "done" } });
    out.push({ tick: aggStart, event: "zkml.stage", data: { stage: "aggregate", state: "running" } });
    out.push({ tick: aggStart, event: "zkml.log", data: { line: "Aggregating " + p.shards + " proofs…" } });
    out.push({ tick: aggStart + p.aggregate, event: "zkml.stage", data: { stage: "aggregate", state: "done" } });
    out.push({ tick: aggStart + p.aggregate, event: "zkml.log", data: { line: "Aggregate proof verified ✓" } });
    out.push({ tick: aggStart + p.aggregate, event: "zkml.stage", data: { stage: "verify", state: "running" } });
    out.push({ tick: total, event: "zkml.stage", data: { stage: "verify", state: "done" } });
    out.push({
      tick: total,
      event: "zkml.log",
      data: { line: "Total wall clock time: " + p.wallSecs + " secs (task time " + p.taskSecs + " secs)" }
    });
    out.push({ tick: total, event: "zkml.log", data: { line: "Proof hash: 0x" + p.hash } });
    out.push({ tick: total, event: "zkml.verified", data: { verdict: "verified", record: record(p) } });
    return out;
  }

  GeFi.zkml = {
    STAGES: STAGES,
    SECS_PER_TICK: SECS_PER_TICK,
    MIN_SHARDS: MIN_SHARDS,
    MAX_SHARDS: MAX_SHARDS,
    fnv1a: fnv1a,
    validate: validate,
    plan: plan,
    record: record,
    timeline: timeline
  };
})(typeof window !== "undefined" ? window : globalThis);
