/* Collaboration & bounty rules (task 311) — ONE implementation of who may
 * claim what, what a submission needs, and how the board's headline numbers
 * are counted, shared by the collaboration pages and the mock server (loaded
 * there through the same vm shim).
 *
 * The board's rules are the interesting part: a claim is refused for the
 * same reason, in the same words, whether the page or the server decides.
 *
 * Pure: no DOM, no storage, no Math.random. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  /* Bounty lifecycle. A bounty is claimable only at OPEN. */
  var OPEN = "OPEN";
  var CLAIMED = "CLAIMED";
  var IN_PROGRESS = "IN PROGRESS";
  var COMPLETED = "COMPLETED";
  var STATUSES = [OPEN, CLAIMED, IN_PROGRESS, COMPLETED];

  var DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

  /* One person can hold one active claim. Finished work does not count
   * against that, or a developer could only ever complete one bounty. */
  var ACTIVE = [CLAIMED, IN_PROGRESS];

  function isActive(status) {
    return ACTIVE.indexOf(status) > -1;
  }

  /* The bounty a user currently holds, or null. */
  function activeClaim(bounties, user) {
    var hit = (bounties || []).filter(function (b) {
      return b.claimedBy === user && isActive(b.status);
    });
    return hit.length ? hit[0] : null;
  }

  /* Returns null when `user` may claim `bounty`, else why not. */
  function canClaim(bounty, bounties, user) {
    if (!bounty) return "no such bounty";
    if (!user) return "sign in to claim a bounty";
    if (bounty.status !== OPEN) {
      return bounty.title + " is already " + bounty.status.toLowerCase();
    }
    var held = activeClaim(bounties, user);
    if (held) {
      return "you already have an active claim on " + held.title + " — finish or release it first";
    }
    return null;
  }

  /* Returns null when `user` may submit to `bounty`, else why not. */
  function canSubmit(bounty, user) {
    if (!bounty) return "no such bounty";
    if (!user) return "sign in to submit work";
    if (bounty.status === COMPLETED) return bounty.title + " is already completed";
    if (bounty.claimedBy !== user) return "claim " + bounty.title + " before submitting work";
    return null;
  }

  /* Board headline figures, COUNTED from the board rather than stated.
   * `developers` is the number of distinct people with work in flight or
   * already delivered — a number a reader can check against the rows. */
  function boardStats(bounties) {
    var rows = bounties || [];
    var open = rows.filter(function (b) { return b.status === OPEN; });
    var live = rows.filter(function (b) { return b.status !== COMPLETED; });
    var done = rows.filter(function (b) { return b.status === COMPLETED; });
    var people = {};
    rows.forEach(function (b) {
      if (b.claimedBy) people[b.claimedBy] = true;
    });
    return {
      active: live.length,
      open: open.length,
      rewards: live.reduce(function (n, b) { return n + b.reward; }, 0),
      paidOut: done.reduce(function (n, b) { return n + b.reward; }, 0),
      developers: Object.keys(people).length,
      completed: done.length
    };
  }

  /* Board filtering — the same predicate on both sides, so a search that
   * returns four rows on the page returns four rows from the endpoint. */
  function filter(bounties, state) {
    var s = state || {};
    var q = String(s.q || "").toLowerCase();
    return (bounties || []).filter(function (b) {
      if (s.status && b.status !== s.status) return false;
      if (s.difficulty && b.difficulty !== s.difficulty) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().indexOf(q) !== -1 ||
        b.category.toLowerCase().indexOf(q) !== -1 ||
        (b.skills || []).some(function (k) { return k.toLowerCase().indexOf(q) !== -1; })
      );
    });
  }

  /* "1 submission" / "2 submissions" — written once so the two frames that
   * render bounty cards cannot disagree about the plural. */
  function plural(n, one, many) {
    return n + " " + (n === 1 ? one : many || one + "s");
  }

  function initials(name) {
    return String(name)
      .split(/\s+/)
      .slice(0, 2)
      .map(function (w) { return w[0] || ""; })
      .join("")
      .toUpperCase();
  }

  /* --------------------------------------------------------- teams */

  /* Returns null when an invite is sendable, else why not. */
  function validateInvite(spec, members) {
    var s = spec || {};
    var name = String(s.name || "").trim();
    if (!name) return "name is required";
    if (s.email !== undefined && s.email !== "" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.email)) {
      return "that does not look like an email address";
    }
    var clash = (members || []).some(function (m) {
      return String(m.name).toLowerCase() === name.toLowerCase();
    });
    if (clash) return name + " is already on the team";
    return null;
  }

  function validateMessage(text) {
    var t = String(text == null ? "" : text).trim();
    if (!t) return "write something first";
    if (t.length > 2000) return "messages are limited to 2000 characters";
    return null;
  }

  GeFi.collab = {
    OPEN: OPEN,
    CLAIMED: CLAIMED,
    IN_PROGRESS: IN_PROGRESS,
    COMPLETED: COMPLETED,
    STATUSES: STATUSES,
    DIFFICULTIES: DIFFICULTIES,
    isActive: isActive,
    activeClaim: activeClaim,
    canClaim: canClaim,
    canSubmit: canSubmit,
    boardStats: boardStats,
    filter: filter,
    plural: plural,
    initials: initials,
    validateInvite: validateInvite,
    validateMessage: validateMessage
  };
})(typeof window !== "undefined" ? window : globalThis);
