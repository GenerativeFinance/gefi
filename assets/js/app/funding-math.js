/* Funding services (task 313) — ONE implementation of the contribution
 * rules and the hub's aggregates, shared by the funding pages and the mock
 * server (loaded there through the same vm shim).
 *
 * The rule this module exists to enforce: every hub figure is computed from
 * the SAME project and bounty rows the individual tabs render, so the hub
 * cannot report a total the tabs do not add up to.
 *
 * Pure: no DOM, no storage, no Math.random. */
(function (window) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});

  var KINDS = ["bot", "model", "bounty"];

  /* Campaign lifecycle. A campaign is `funded` the moment it reaches its
   * goal — that is a fact about the numbers, not a separate flag someone
   * has to remember to set. */
  function statusOf(p) {
    if (!p) return null;
    if (p.raised >= p.goal) return "funded";
    if (p.status === "submitted" || p.status === "SUBMITTED") return "submitted";
    if (p.daysLeft != null && p.daysLeft <= 0) return "closed";
    return "active";
  }

  function remaining(p) {
    return Math.max(0, p.goal - p.raised);
  }

  function progressPct(p) {
    return p.goal ? Math.min(100, Math.round((p.raised / p.goal) * 100)) : 0;
  }

  /* Returns null when a contribution is acceptable, else why not.
   *
   * Over-goal contributions are refused rather than quietly accepted: a
   * campaign that has raised more than it asked for is either a bug or a
   * different product (overfunding), and silently allowing it would make
   * "raised of goal" read past 100%. */
  function validateContribution(project, amount) {
    if (!project) return "no such campaign";
    var n = typeof amount === "number" ? amount : parseInt(amount, 10);
    if (!isFinite(n) || n <= 0) return "enter an amount to contribute";
    if (statusOf(project) === "funded") {
      return project.name + " has already reached its goal";
    }
    var min = project.min || 0;
    if (n < min) return "the minimum contribution to " + project.name + " is $" + min.toLocaleString("en-US");
    var left = remaining(project);
    if (n > left) {
      return "only $" + left.toLocaleString("en-US") + " is still needed to reach the goal — contribute that or less";
    }
    return null;
  }

  /* Apply a contribution to a project row, returning the updated row. The
   * status follows from the numbers rather than being set separately. */
  function applyContribution(project, amount) {
    var p = Object.assign({}, project);
    p.raised = p.raised + amount;
    p.backers = (p.backers || 0) + 1;
    p.status = statusOf(p);
    if (p.status === "funded") p.daysLeft = 0;
    return p;
  }

  /* Returns null when a funding request can be submitted, else why not. */
  function validateRequest(spec, existing) {
    var s = spec || {};
    var name = String(s.name || "").trim();
    if (!name) return "name is required";
    if (KINDS.indexOf(s.kind) === -1) return "kind must be one of " + KINDS.join(", ");
    var goal = typeof s.goal === "number" ? s.goal : parseInt(s.goal, 10);
    if (!isFinite(goal) || goal < 1000) return "the funding goal must be at least $1,000";
    if (goal > 5000000) return "the funding goal must be at most $5,000,000";
    var clash = (existing || []).some(function (p) {
      return String(p.name).toLowerCase() === name.toLowerCase();
    });
    if (clash) return "a campaign called " + name + " already exists";
    return null;
  }

  /* Hub aggregates. Computed from the SAME rows the tabs render — projects
   * plus the funding side of the bounty board — so the hub's headline is
   * the sum of what a reader can see on the other pages. */
  function hubTotals(projects, bounties) {
    var ps = projects || [];
    var bs = bounties || [];
    var bots = ps.filter(function (p) { return p.kind === "bot"; });
    var models = ps.filter(function (p) { return p.kind === "model"; });
    var bountyRaised = bs.reduce(function (n, b) { return n + ((b.funding && b.funding.raised) || 0); }, 0);
    var bountyBackers = bs.reduce(function (n, b) { return n + ((b.funding && b.funding.backers) || 0); }, 0);

    function sum(list) {
      return list.reduce(function (n, p) { return n + p.raised; }, 0);
    }
    function liveCount(list) {
      return list.filter(function (p) { return statusOf(p) === "active"; }).length;
    }

    return {
      total: sum(ps) + bountyRaised,
      projectsRaised: sum(ps),
      bountyRaised: bountyRaised,
      botRaised: sum(bots),
      modelRaised: sum(models),
      activeBots: liveCount(bots),
      activeModels: liveCount(models),
      activeProjects: liveCount(ps),
      activeBounties: bs.filter(function (b) {
        return b.funding && b.funding.status !== "COMPLETED";
      }).length,
      backers: ps.reduce(function (n, p) { return n + (p.backers || 0); }, 0) + bountyBackers,
      campaigns: ps.length,
      avgProgress: ps.length
        ? Math.round(ps.reduce(function (n, p) { return n + progressPct(p); }, 0) / ps.length)
        : 0,
      funded: ps.filter(function (p) { return statusOf(p) === "funded"; }).length
    };
  }

  GeFi.funding = {
    KINDS: KINDS,
    statusOf: statusOf,
    remaining: remaining,
    progressPct: progressPct,
    validateContribution: validateContribution,
    applyContribution: applyContribution,
    validateRequest: validateRequest,
    hubTotals: hubTotals
  };
})(typeof window !== "undefined" ? window : globalThis);
