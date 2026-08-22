/* App component helpers (UI-FOLLOWUP task 202).
 *
 * GeFi.app.segments(container)  — accessible segment switching with hash sync.
 *   container: [data-app-segments]; each button [data-segment="key"] toggles
 *   the sibling panels [data-segment-panel="key"] within the same page.
 * GeFi.app.chip(vocabWord, label?) — chip element with the fixed vocabulary
 *   class and ALWAYS a text label (never color alone).
 * GeFi.app.empty(opts) / GeFi.app.error(opts) — designed states.
 */
(function (window, document) {
  "use strict";

  var GeFi = (window.GeFi = window.GeFi || {});
  var app = (GeFi.app = GeFi.app || {});

  app.segments = function (container) {
    if (!container) return;
    var buttons = container.querySelectorAll("[data-segment]");
    var scope = container.closest("[data-segment-scope]") || document;

    function activate(key, pushHash) {
      buttons.forEach(function (b) {
        var on = b.getAttribute("data-segment") === key;
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.setAttribute("tabindex", on ? "0" : "-1");
      });
      scope.querySelectorAll("[data-segment-panel]").forEach(function (p) {
        p.hidden = p.getAttribute("data-segment-panel") !== key;
      });
      if (pushHash) {
        try {
          history.replaceState(null, "", "#" + key);
        } catch (e) {}
      }
    }

    container.setAttribute("role", "tablist");
    buttons.forEach(function (b) {
      b.setAttribute("role", "tab");
      b.addEventListener("click", function () {
        activate(b.getAttribute("data-segment"), true);
      });
    });
    container.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var list = Array.prototype.slice.call(buttons);
      var idx = list.findIndex(function (b) { return b.getAttribute("aria-selected") === "true"; });
      var next = list[(idx + (e.key === "ArrowRight" ? 1 : list.length - 1)) % list.length];
      next.focus();
      activate(next.getAttribute("data-segment"), true);
      e.preventDefault();
    });

    var initial = (window.location.hash || "").replace("#", "");
    var valid = Array.prototype.some.call(buttons, function (b) {
      return b.getAttribute("data-segment") === initial;
    });
    activate(valid ? initial : buttons[0].getAttribute("data-segment"), false);
  };

  app.chip = function (vocab, label) {
    var span = document.createElement("span");
    span.className = "app-chip app-chip--" + String(vocab).toLowerCase().replace(/\s+/g, "-");
    span.textContent = label != null ? label : vocab;
    return span;
  };

  function stateEl(kind, opts) {
    var o = opts || {};
    var div = document.createElement("div");
    div.className = "app-" + kind;
    var icon = document.createElement("span");
    icon.className = "app-" + kind + "__icon app-empty__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML =
      kind === "error"
        ? '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.8L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>'
        : '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>';
    var head = document.createElement("p");
    head.className = "app-" + kind + "__head";
    head.textContent = o.head || (kind === "error" ? "Something went wrong" : "Nothing here yet");
    var hint = document.createElement("p");
    hint.className = "app-" + kind + "__hint";
    hint.textContent = o.hint || "";
    div.appendChild(icon);
    div.appendChild(head);
    if (o.hint) div.appendChild(hint);
    if (o.cta) {
      var a = document.createElement(o.cta.href ? "a" : "button");
      a.className = "app-btn app-btn--primary";
      if (o.cta.href) {
        a.href = o.cta.href;
      } else {
        a.type = "button";
      }
      a.textContent = o.cta.label;
      if (o.cta.onClick) a.addEventListener("click", o.cta.onClick);
      div.appendChild(a);
    }
    return div;
  }

  app.empty = function (opts) { return stateEl("empty", opts); };
  app.error = function (opts) { return stateEl("error", opts); };

  /* Auto-wire any segment bars present on the page. */
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-app-segments]").forEach(app.segments);
  });
})(window, document);
