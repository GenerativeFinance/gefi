/* Regulator portal (task 316) — ONE implementation of the audit register,
 * the SLA clock and the overview aggregates, shared by the regulator pages
 * and the mock server (loaded there through the same vm shim).
 *
 * The problem this module exists to fix: the portal's headline figures were
 * STORED CONSTANTS (142 audits, 87.3% compliance, 15 standards) with no
 * relationship to the handful of rows the registers actually held, and the
 * audit-type breakdown was literally 41% / 29% / 19% of that made-up total.
 * Here the register genuinely holds its audits, and every figure is counted
 * from it — a reader who pages through can reconcile the headline.
 *
 * Pure: seeded, no DOM, no storage, no Math.random. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  /* The portal's clock. SLA state is computed against this rather than the
   * wall clock, so a screenshot taken today and one taken next month agree
   * about which issues are overdue. */
  var EPOCH = "2026-08-22";

  var AUDIT_TYPES = ["Model governance", "Dataset lineage", "Process control", "Security review"];
  var SEVERITIES = ["low", "medium", "high", "critical"];
  var STATUSES = ["Scheduled", "In Progress", "Completed", "Flagged"];
  var ORGS = [
    "Meridian Bank", "Atlas Lending", "Helios Capital", "Gulf Secure",
    "Nordwind AM", "Quantessence", "Cerulean Trust", "Vantage Mutual"
  ];

  /* How many audits the register holds. The listing pages through them; the
   * headline counts all of them. */
  var REGISTER_SIZE = 142;

  /* Entity id prefixes and the register each resolves to. Cross-links like
   * #MT-4521 are only meaningful if something can answer them. */
  var ENTITY_KINDS = {
    MT: "model_audit",
    DS: "dataset_audit",
    ML: "model",
    CS: "case"
  };

  function entityKind(id) {
    var m = String(id || "").toUpperCase().match(/^([A-Z]{2})-/);
    return m && ENTITY_KINDS[m[1]] ? ENTITY_KINDS[m[1]] : null;
  }

  function daysBetween(from, to) {
    var a = Date.parse(from);
    var b = Date.parse(to);
    if (!isFinite(a) || !isFinite(b)) return null;
    return Math.round((b - a) / 86400000);
  }

  /* How long an issue of each severity may stay open. This is the SLA
   * policy: an issue has no due date of its own, so the deadline follows
   * from when it was raised and how bad it is. Stated once, applied by both
   * the portal and the service. */
  var SLA_DAYS = { critical: 5, high: 10, medium: 20, low: 30 };

  function dueDate(issue) {
    if (issue.due) return issue.due;
    var days = SLA_DAYS[String(issue.severity || "").toLowerCase()];
    if (days == null || !issue.opened) return null;
    var t = Date.parse(issue.opened);
    if (!isFinite(t)) return null;
    return new Date(t + days * 86400000).toISOString().slice(0, 10);
  }

  /* SLA clock for an issue, measured from the fixed epoch. `state` is what
   * the badge shows; nothing else may decide it. */
  function slaState(issue, today) {
    var now = today || EPOCH;
    var opened = issue.opened;
    var due = dueDate(issue);
    var out = {
      due: due,
      daysOpen: opened ? daysBetween(opened, now) : null,
      dueInDays: due ? daysBetween(now, due) : null,
      state: "ok"
    };
    if (out.dueInDays == null) out.state = "no-sla";
    else if (out.dueInDays < 0) out.state = "overdue";
    else if (out.dueInDays <= 3) out.state = "due-soon";
    return out;
  }

  /* The full audit register. The hand-written rows lead; the rest are
   * generated deterministically so the register really holds what the
   * headline claims. */
  function register(modelAudits, datasetAudits) {
    var seeded = [];
    (modelAudits || []).forEach(function (a) {
      seeded.push({
        id: a.id,
        kind: "model",
        subject: a.model,
        org: a.org,
        type: a.type || "Model governance",
        severity: a.severity,
        status: a.status,
        due: a.due,
        findings: (a.findings || []).length
      });
    });
    (datasetAudits || []).forEach(function (a) {
      seeded.push({
        id: a.id,
        kind: "dataset",
        subject: a.dataset,
        org: a.org,
        type: "Dataset lineage",
        severity: a.severity,
        status: a.status,
        due: a.due,
        findings: a.pii || 0
      });
    });

    var rand = GeFi.seed.rng(GeFi.seed.hash("regreg|" + REGISTER_SIZE));
    var out = seeded.slice();
    for (var i = seeded.length; i < REGISTER_SIZE; i++) {
      var type = AUDIT_TYPES[Math.floor(rand() * AUDIT_TYPES.length)];
      var isDataset = type === "Dataset lineage";
      var day = 1 + Math.floor(rand() * 28);
      out.push({
        id: (isDataset ? "DS-" : "MT-") + (8000 + i * 7),
        kind: isDataset ? "dataset" : "model",
        subject: (isDataset ? "Dataset " : "Model ") + (i + 1),
        org: ORGS[Math.floor(rand() * ORGS.length)],
        type: type,
        severity: SEVERITIES[Math.floor(rand() * SEVERITIES.length)],
        status: STATUSES[Math.floor(rand() * STATUSES.length)],
        due: "2026-09-" + String(day).padStart(2, "0"),
        findings: Math.floor(rand() * 5)
      });
    }
    return out;
  }

  /* Every overview figure, counted from the register and the issue list.
   * `resolvedIds` are issues closed in this session. */
  function overview(auditRegister, issues, standards, resolvedIds, today) {
    var reg = auditRegister || [];
    var closed = resolvedIds || [];
    var open = (issues || []).filter(function (i) { return closed.indexOf(i.id) === -1; });
    var now = today || EPOCH;

    function byStatus(name) {
      return reg.filter(function (a) { return a.status === name; }).length;
    }
    var completed = byStatus("Completed");
    var pending = reg.filter(function (a) {
      return a.status === "Scheduled" || a.status === "In Progress";
    }).length;
    var dueThisWeek = reg.filter(function (a) {
      var d = daysBetween(now, a.due);
      return a.status !== "Completed" && d != null && d >= 0 && d <= 7;
    }).length;

    /* Severity breakdown of the OPEN issues — a real count each, not a
     * fixed share of the flagged total. */
    var bySeverity = {};
    SEVERITIES.forEach(function (sv) {
      bySeverity[sv] = open.filter(function (i) { return i.severity === sv; }).length;
    });

    /* Type breakdown: an actual count per type, over the types the register
     * really contains. Counting into a FIXED list of four silently dropped
     * the hand-written audits whose type sits outside it, so the breakdown
     * did not add up to the total. */
    var byType = {};
    reg.forEach(function (a) {
      var t = a.type || "Other";
      byType[t] = (byType[t] || 0) + 1;
    });

    /* Resolution time is measured across the issues that have closed. */
    var closedIssues = (issues || []).filter(function (i) { return closed.indexOf(i.id) > -1; });
    var resolutionDays = closedIssues.length
      ? closedIssues.reduce(function (n, i) { return n + (daysBetween(i.opened, now) || 0); }, 0) / closedIssues.length
      : null;

    return {
      total: reg.length,
      completed: completed,
      pending: pending,
      dueThisWeek: dueThisWeek,
      flagged: open.length,
      critical: open.filter(function (i) { return i.severity === "critical"; }).length,
      overdue: open.filter(function (i) { return slaState(i, now).state === "overdue"; }).length,
      resolved: closed.length,
      standards: (standards || []).length,
      /* Rate of completion across the register — stated as the fraction it
       * was taken over, so it cannot drift from the rows. */
      completionPct: reg.length ? +((completed / reg.length) * 100).toFixed(1) : 0,
      compliancePct: reg.length
        ? +(((reg.length - reg.filter(function (a) { return a.status === "Flagged"; }).length) / reg.length) * 100).toFixed(1)
        : 0,
      avgResolutionDays: resolutionDays == null ? null : +resolutionDays.toFixed(1),
      byType: byType,
      bySeverity: bySeverity
    };
  }

  /* Returns null when a message can be posted, else why not. */
  function validateMessage(text) {
    var t = String(text == null ? "" : text).trim();
    if (!t) return "write a message first";
    if (t.length > 4000) return "messages are limited to 4000 characters";
    return null;
  }

  GeFi.regulator = {
    EPOCH: EPOCH,
    AUDIT_TYPES: AUDIT_TYPES,
    SEVERITIES: SEVERITIES,
    STATUSES: STATUSES,
    ORGS: ORGS,
    REGISTER_SIZE: REGISTER_SIZE,
    ENTITY_KINDS: ENTITY_KINDS,
    SLA_DAYS: SLA_DAYS,
    dueDate: dueDate,
    entityKind: entityKind,
    daysBetween: daysBetween,
    slaState: slaState,
    register: register,
    overview: overview,
    validateMessage: validateMessage
  };
})(typeof window !== "undefined" ? window : globalThis);
