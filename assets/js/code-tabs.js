/* Language-tab code blocks (Task 104). Generic: any [data-code-tabs] group.
 * No-JS fallback: all panels render stacked with their language label. */
(function () {
  "use strict";

  var groups = document.querySelectorAll("[data-code-tabs]");
  if (!groups.length) return;

  groups.forEach(function (group) {
    var tabs = group.querySelectorAll("[data-code-tab]");
    var panels = group.querySelectorAll("[data-code-panel]");

    group.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-code-tab]");
      if (!btn) return;
      var id = btn.getAttribute("data-code-tab");
      tabs.forEach(function (t) {
        var active = t === btn;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-code-panel") === id);
      });
    });
  });
})();
