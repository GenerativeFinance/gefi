/* Rebalancing math (task 305) — ONE implementation, used by both the
 * client page and the mock server (loaded there through the same vm
 * shim that loads the dataset). If these two ever disagreed, live and
 * sample modes would propose different trades for the same sliders;
 * sharing the pure functions makes that impossible by construction.
 *
 * Everything here is pure: no DOM, no storage, no randomness. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  /* A trade is proposed when a sleeve is at least MIN_DRIFT_PCT away
   * from its target; sizes round to the nearest ROUND_TO dollars so the
   * proposal reads like something a desk would actually send. */
  var MIN_DRIFT_PCT = 1;
  var ROUND_TO = 500;

  function driftRows(targets, current) {
    return Object.keys(targets).map(function (name) {
      var target = targets[name];
      var cur = current[name] != null ? current[name] : 0;
      return { name: name, target_pct: target, current_pct: cur, drift_pct: target - cur };
    });
  }

  function maxDrift(targets, current) {
    var rows = driftRows(targets, current);
    if (!rows.length) return 0;
    return Math.max.apply(null, rows.map(function (r) { return Math.abs(r.drift_pct); }));
  }

  function totalTarget(targets) {
    return Object.keys(targets).reduce(function (n, k) { return n + targets[k]; }, 0);
  }

  function trades(targets, current, portfolioValue) {
    var out = [];
    driftRows(targets, current).forEach(function (r) {
      if (Math.abs(r.drift_pct) < MIN_DRIFT_PCT) return;
      var value = Math.round((Math.abs(r.drift_pct) / 100) * portfolioValue / ROUND_TO) * ROUND_TO;
      if (value > 0) out.push({ side: r.drift_pct > 0 ? "Buy" : "Sell", asset: r.name, value: value });
    });
    return out;
  }

  function proposal(targets, current, portfolioValue) {
    var list = trades(targets, current, portfolioValue);
    return {
      trades: list,
      trade_count: list.length,
      total_value: list.reduce(function (n, t) { return n + t.value; }, 0),
      max_drift_pct: +maxDrift(targets, current).toFixed(1),
    };
  }

  /* Executing a proposal moves current weights onto the targets. */
  function applied(targets) {
    var next = {};
    Object.keys(targets).forEach(function (k) { next[k] = targets[k]; });
    return next;
  }

  GeFi.rebalanceMath = {
    MIN_DRIFT_PCT: MIN_DRIFT_PCT,
    ROUND_TO: ROUND_TO,
    driftRows: driftRows,
    maxDrift: maxDrift,
    totalTarget: totalTarget,
    trades: trades,
    proposal: proposal,
    applied: applied,
  };
})(typeof window !== "undefined" ? window : globalThis);
