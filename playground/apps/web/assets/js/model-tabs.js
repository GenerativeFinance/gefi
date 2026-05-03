/* Model detail page — ARIA 1.2 tablist with URL-hash routing.
 * Tabs: overview, demo, performance, pricing, compliance, reviews.
 * - Click/Enter/Space activates a tab.
 * - ←/→ move focus between tabs (with wrap); Home/End jump to first/last.
 * - Activation patches location.hash so deep links survive reloads.
 * - On load we read the current hash and select the matching tab.
 * Other model-* scripts listen for "model:tab-shown" so they can lazy-init
 * (uPlot, reviews list) only when their panel is actually visible. */
(function () {
  "use strict";
  var nav = document.querySelector(".model-tabs");
  if (!nav) return;
  var tabs = Array.prototype.slice.call(nav.querySelectorAll('[role="tab"]'));
  var panels = tabs.map(function (t) {
    return document.getElementById(t.getAttribute("aria-controls"));
  });

  function activate(name, opts) {
    opts = opts || {};
    var idx = -1;
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].dataset.tab === name) { idx = i; break; }
    }
    if (idx === -1) idx = 0;
    tabs.forEach(function (t, i) {
      var on = i === idx;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      t.classList.toggle("is-active", on);
      var p = panels[i];
      if (p) p.hidden = !on;
    });
    if (opts.focus) tabs[idx].focus();
    if (opts.updateHash !== false) {
      var newHash = "#" + tabs[idx].dataset.tab;
      if (location.hash !== newHash) {
        history.replaceState(null, "", newHash);
      }
    }
    document.dispatchEvent(new CustomEvent("model:tab-shown", {
      detail: { tab: tabs[idx].dataset.tab },
    }));
  }

  function tabFromHash() {
    // Bare-fragment contract — `#performance`, `#compliance`, etc. so deep
    // links match the URL convention used everywhere else on the site.
    var raw = (location.hash || "").replace(/^#/, "").toLowerCase();
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].dataset.tab === raw) return raw;
    }
    return "overview";
  }

  nav.addEventListener("click", function (ev) {
    var t = ev.target.closest('[role="tab"]');
    if (!t) return;
    activate(t.dataset.tab, { focus: true });
  });

  nav.addEventListener("keydown", function (ev) {
    var idx = tabs.indexOf(document.activeElement);
    if (idx === -1) return;
    var next = idx;
    switch (ev.key) {
      case "ArrowRight": next = (idx + 1) % tabs.length; break;
      case "ArrowLeft":  next = (idx - 1 + tabs.length) % tabs.length; break;
      case "Home":       next = 0; break;
      case "End":        next = tabs.length - 1; break;
      default: return;
    }
    ev.preventDefault();
    activate(tabs[next].dataset.tab, { focus: true });
  });

  window.addEventListener("hashchange", function () {
    activate(tabFromHash(), { updateHash: false });
  });

  activate(tabFromHash(), { updateHash: false });
})();
