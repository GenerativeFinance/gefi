/* Reports & compliance (task 315) — ONE implementation of report naming,
 * the generation lifecycle, custom-definition validation and the compliance
 * and risk roll-ups, shared by the report pages and the mock server (loaded
 * there through the same vm shim).
 *
 * The roll-ups matter most here: a compliance or risk headline is COUNTED
 * from the rows beneath it, so a reader can check any figure against the
 * table rather than taking it on trust.
 *
 * Pure: no DOM, no storage, no Math.random. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  var CATEGORIES = ["performance", "risk", "regulatory", "client"];
  var PERIODS = ["Daily", "Weekly", "Monthly", "Quarterly", "Annual"];
  var FORMATS = ["PDF", "CSV", "XLSX"];

  /* Generation lifecycle. A report is `pending` until the service says it
   * generated; nothing else may claim it is ready. */
  var STATUSES = ["pending", "generated", "failed"];

  /* The name a generated report gets. Derived on both sides from the same
   * inputs, so a report queued live and one queued offline are labelled
   * identically. */
  function reportName(categoryName, period) {
    return period + " " + String(categoryName).replace(/ Reports?$/, "") + " Report (custom)";
  }

  /* Returns null when a generate request is runnable, else why not. */
  function validateGenerate(spec, categories) {
    var s = spec || {};
    if (!s.category) return "pick a report category";
    var known = (categories || CATEGORIES).some(function (c) {
      return (c.key || c) === s.category;
    });
    if (!known) return "unknown report category: " + s.category;
    if (s.period && PERIODS.indexOf(s.period) === -1) {
      return "period must be one of " + PERIODS.join(", ");
    }
    if (s.format && FORMATS.indexOf(s.format) === -1) {
      return "format must be one of " + FORMATS.join(", ");
    }
    return null;
  }

  /* Returns null when a custom definition can be saved, else why not. */
  function validateDefinition(spec, existing) {
    var s = spec || {};
    var name = String(s.name || "").trim();
    if (!name) return "give the report a name";
    if (!s.fields || !s.fields.length) return "pick at least one field to include";
    var clash = (existing || []).some(function (d) {
      return String(d.name).toLowerCase() === name.toLowerCase();
    });
    if (clash) return "a report called " + name + " already exists";
    return null;
  }

  /* ----------------------------------------------------- compliance */

  /* Days between two ISO dates. Positive means `to` is in the future. */
  function daysBetween(from, to) {
    var a = Date.parse(from);
    var b = Date.parse(to);
    if (!isFinite(a) || !isFinite(b)) return null;
    return Math.round((b - a) / 86400000);
  }

  /* Compliance roll-up, counted from the rows. `rate` is stated as a
   * fraction of the rows it was taken over, so it cannot drift from them. */
  function complianceTotals(rows, today) {
    var list = rows || [];
    function count(status) {
      return list.filter(function (r) { return r.status === status; }).length;
    }
    var compliant = count("Compliant");
    var dueSoon = list.filter(function (r) {
      var d = daysBetween(today || "2026-08-22", r.next);
      return d != null && d >= 0 && d <= 7;
    }).length;
    return {
      total: list.length,
      compliant: compliant,
      warnings: count("Warning"),
      violations: count("Violation"),
      ratePct: list.length ? Math.round((compliant / list.length) * 100) : 0,
      dueSoon: dueSoon,
      findings: list.reduce(function (n, r) { return n + (r.findings || 0); }, 0)
    };
  }

  /* Risk roll-up, likewise counted. */
  function riskTotals(rows) {
    var list = rows || [];
    function sev(name) {
      return list.filter(function (r) { return r.severity === name; }).length;
    }
    return {
      total: list.length,
      critical: sev("Critical"),
      high: sev("High"),
      medium: sev("Medium"),
      low: sev("Low"),
      var95: list.reduce(function (n, r) { return n + (r.var95 || 0); }, 0),
      exposure: list.reduce(function (n, r) { return n + (r.exposure || 0); }, 0)
    };
  }

  /* A sample narrative for a generated report. Seeded on the report, so the
   * same report reads the same wherever it is opened. */
  function narrative(report) {
    var rand = GeFi.seed.rng(GeFi.seed.hash("rpt|" + (report.id || report.name)));
    var moves = ["widened", "narrowed", "held steady", "drifted"];
    return [
      "SAMPLE REPORT — generated from the GeFi demonstration dataset.",
      "",
      report.name,
      "Period: " + (report.period || "Monthly") + "   ·   Prepared: " + (report.date || "2026-08-22"),
      "",
      "Summary",
      "Coverage across the period was complete, with no gaps in the source",
      "feeds. Attribution " + moves[Math.floor(rand() * moves.length)] + " against the prior period, driven",
      "mainly by allocation rather than selection.",
      "",
      "This document contains no real client, position or transaction data,",
      "and is not suitable for regulatory filing or client distribution."
    ].join("\n");
  }

  GeFi.reports = {
    CATEGORIES: CATEGORIES,
    PERIODS: PERIODS,
    FORMATS: FORMATS,
    STATUSES: STATUSES,
    reportName: reportName,
    validateGenerate: validateGenerate,
    validateDefinition: validateDefinition,
    daysBetween: daysBetween,
    complianceTotals: complianceTotals,
    riskTotals: riskTotals,
    narrative: narrative
  };
})(typeof window !== "undefined" ? window : globalThis);
