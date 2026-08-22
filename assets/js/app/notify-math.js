/* Notifications & alerts (task 317) — ONE implementation of the unread
 * count, the alert-rule rules and the shape a notification takes, shared by
 * the app shell and the mock server (loaded there through the same vm shim).
 *
 * Pure: no DOM, no storage, no Math.random. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  /* Where a notification can be delivered. Only `in_app` actually delivers:
   * the others are recorded preferences with no provider behind them, and
   * the contract says so. */
  var CHANNELS = ["in_app", "email", "push"];
  var DELIVERING = ["in_app"];

  /* What an alert rule can watch. A rule naming anything else would never
   * fire, so the service refuses it rather than accepting a rule that
   * silently does nothing. */
  var METRICS = ["price", "drawdown", "accuracy", "confidence", "error_rate", "funding_pct"];
  var COMPARATORS = ["above", "below"];

  var KINDS = ["order", "training", "compliance", "funding", "dataset", "alert", "system"];

  function unreadCount(notifications) {
    return (notifications || []).filter(function (n) { return n.unread; }).length;
  }

  /* Returns null when an alert rule is usable, else why not. */
  function validateRule(spec) {
    var s = spec || {};
    if (!s.entity || !String(s.entity).trim()) return "name what the rule watches";
    if (METRICS.indexOf(s.metric) === -1) {
      return "metric must be one of " + METRICS.join(", ");
    }
    if (COMPARATORS.indexOf(s.comparator) === -1) {
      return "comparator must be above or below";
    }
    var t = typeof s.threshold === "number" ? s.threshold : parseFloat(s.threshold);
    if (!isFinite(t)) return "threshold must be a number";
    var channel = s.channel || "in_app";
    if (CHANNELS.indexOf(channel) === -1) {
      return "channel must be one of " + CHANNELS.join(", ");
    }
    return null;
  }

  /* A rule's own description, written once so the list and the confirmation
   * cannot phrase the same rule differently. */
  function describeRule(rule) {
    return rule.entity + " " + rule.metric.replace(/_/g, " ") + " " +
      rule.comparator + " " + rule.threshold;
  }

  /* The notification a mutation produces. Both sides build it the same way,
   * so a notification raised by the service and one raised locally read
   * identically. */
  function fromEvent(kind, detail) {
    var d = detail || {};
    switch (kind) {
      case "order":
        return {
          kind: "order",
          title: "Order filled",
          detail: d.side + " " + d.qty + " " + d.symbol + " at $" + d.fill,
          unread: true
        };
      case "training":
        return {
          kind: "training",
          title: "Training complete",
          detail: d.name + " finished at " + d.accuracy + "% accuracy",
          unread: true
        };
      case "compliance":
        return {
          kind: "compliance",
          title: "Issue resolved",
          detail: d.id + " — " + d.title,
          unread: true
        };
      case "funding":
        return {
          kind: "funding",
          title: "Campaign funded",
          detail: d.name + " reached its goal",
          unread: true
        };
      case "dataset":
        return {
          kind: "dataset",
          title: "Dataset published",
          detail: d.name + " passed its quality audit",
          unread: true
        };
      default:
        return { kind: "system", title: d.title || "Update", detail: d.detail || "", unread: true };
    }
  }

  GeFi.notify = {
    CHANNELS: CHANNELS,
    DELIVERING: DELIVERING,
    METRICS: METRICS,
    COMPARATORS: COMPARATORS,
    KINDS: KINDS,
    unreadCount: unreadCount,
    validateRule: validateRule,
    describeRule: describeRule,
    fromEvent: fromEvent
  };
})(typeof window !== "undefined" ? window : globalThis);
