/* Learning service (task 314) — ONE implementation of enrolment progress,
 * certificate issuance and the learning KPIs, shared by the learning page
 * and the mock server (loaded there through the same vm shim).
 *
 * The rule: a certificate is a RECORD issued when an item reaches 100%, and
 * the certificate count is the number of those records. Hours learned are
 * summed from the durations of what was actually completed. Neither is a
 * figure someone typed in.
 *
 * Pure: no DOM, no storage, no Math.random. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  var TYPES = ["GET-STARTED", "TUTORIAL", "WEBINAR", "BLOG", "FAQ"];
  var LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

  /* How far one "Continue" click moves an item. Stated once so the page and
   * the server step by the same amount. */
  function nextProgress(current) {
    var p = current || 0;
    return p === 0 ? 20 : Math.min(100, p + 40);
  }

  /* "25 min" / "1.5 hours" / "2h 15m" → minutes. Returns 0 when a duration
   * cannot be read, rather than guessing, so an unreadable duration lowers
   * the hours total instead of inventing one. */
  function durationMinutes(text) {
    var s = String(text || "").toLowerCase();
    var total = 0;
    var matched = false;
    var h = s.match(/([\d.]+)\s*(h|hr|hrs|hour|hours)/);
    if (h) {
      total += parseFloat(h[1]) * 60;
      matched = true;
    }
    var m = s.match(/([\d.]+)\s*(m|min|mins|minute|minutes)\b/);
    if (m) {
      total += parseFloat(m[1]);
      matched = true;
    }
    return matched ? Math.round(total) : 0;
  }

  /* Progress for an item: what the enrolment records, else the item's own
   * seeded starting point. */
  function progressOf(item, enrollments) {
    var e = (enrollments || {})[item.title];
    return e != null ? e : item.progress || 0;
  }

  /* Returns null when a progress value is acceptable, else why not. */
  function validateProgress(pct) {
    var n = typeof pct === "number" ? pct : parseInt(pct, 10);
    if (!isFinite(n)) return "progress must be a number";
    if (n < 0 || n > 100) return "progress must be between 0 and 100";
    return null;
  }

  /* The certificate an item earns at 100%. Deterministic id, so the same
   * completion produces the same certificate on both sides. */
  function certificateFor(item, issued) {
    var slug = String(item.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return {
      id: "cert-" + slug,
      item: item.title,
      level: item.level,
      minutes: durationMinutes(item.duration),
      issued: issued || "2026-08-22"
    };
  }

  /* Learning KPIs, all counted from the records.
   *
   * `certificates` is the number of issued certificate RECORDS — the page
   * used to show completed + 1 for an "onboarding" certificate that no
   * record backed. `hours` is summed from the durations of completed items,
   * not a constant. */
  function stats(items, enrollments, certificates) {
    var rows = items || [];
    var done = rows.filter(function (i) { return progressOf(i, enrollments) >= 100; });
    var going = rows.filter(function (i) {
      var p = progressOf(i, enrollments);
      return p > 0 && p < 100;
    });
    var minutes = done.reduce(function (n, i) { return n + durationMinutes(i.duration); }, 0);
    return {
      completed: done.length,
      inProgress: going.length,
      certificates: (certificates || []).length,
      minutes: minutes,
      hours: +(minutes / 60).toFixed(1)
    };
  }

  /* Catalog filtering — the same predicate on both sides. */
  function filter(items, state, enrollments) {
    var s = state || {};
    var q = String(s.q || "").toLowerCase();
    return (items || []).filter(function (it) {
      var p = progressOf(it, enrollments);
      if (s.seg === "progress" && !(p > 0 && p < 100)) return false;
      if (s.seg === "completed" && p < 100) return false;
      if (s.seg === "recommended" && !(p === 0 && it.rating >= 4.5)) return false;
      if (s.type && it.type !== s.type) return false;
      if (s.level && it.level !== s.level) return false;
      if (!q) return true;
      return (
        it.title.toLowerCase().indexOf(q) !== -1 ||
        String(it.author).toLowerCase().indexOf(q) !== -1
      );
    });
  }

  GeFi.learning = {
    TYPES: TYPES,
    LEVELS: LEVELS,
    nextProgress: nextProgress,
    durationMinutes: durationMinutes,
    progressOf: progressOf,
    validateProgress: validateProgress,
    certificateFor: certificateFor,
    stats: stats,
    filter: filter
  };
})(typeof window !== "undefined" ? window : globalThis);
