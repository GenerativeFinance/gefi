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

    function followHash() {
      var h = (window.location.hash || "").replace("#", "");
      var valid = Array.prototype.some.call(buttons, function (b) {
        return b.getAttribute("data-segment") === h;
      });
      activate(valid ? h : buttons[0].getAttribute("data-segment"), false);
    }
    window.addEventListener("hashchange", followHash);
    followHash();
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

  /* Donut chart from [{name, pct}] slices. Returns an SVG element. */
  app.donutColors = ["#6D5BFF", "#22C55E", "#F59E0B", "#F97316", "#22D3EE"];
  app.donut = function (slices, label) {
    var svg = GeFi.svg.el("svg", { viewBox: "0 0 120 120", width: "100%", role: "img", "aria-label": label || "Donut chart", class: "app-donut" });
    var cx = 60, cy = 60, r = 44, width = 18;
    var start = -Math.PI / 2;
    slices.forEach(function (a, i) {
      var frac = a.pct / 100;
      var end = start + frac * Math.PI * 2;
      var large = frac > 0.5 ? 1 : 0;
      var x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
      var x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
      svg.appendChild(GeFi.svg.el("path", {
        d: "M" + x1.toFixed(2) + " " + y1.toFixed(2) + " A" + r + " " + r + " 0 " + large + " 1 " + x2.toFixed(2) + " " + y2.toFixed(2),
        stroke: app.donutColors[i % app.donutColors.length],
        "stroke-width": width,
        fill: "none"
      }));
      start = end + 0.02;
    });
    return svg;
  };

  /* Dot-swatch legend list items for donut slices, into a UL. */
  app.donutLegend = function (ul, slices) {
    slices.forEach(function (a, i) {
      var li = document.createElement("li");
      var dot = document.createElement("span");
      dot.className = "app-ov-legend__dot";
      dot.style.background = app.donutColors[i % app.donutColors.length];
      dot.setAttribute("aria-hidden", "true");
      var name = document.createElement("span");
      name.textContent = a.name;
      var val = document.createElement("span");
      val.className = "mono app-ov-legend__val";
      val.textContent = a.pct + "%";
      li.appendChild(dot);
      li.appendChild(name);
      li.appendChild(val);
      ul.appendChild(li);
    });
  };

  /* Grouped bars (two series, e.g. portfolio vs benchmark) with negative
   * support — SVG built here so dashboard.js stays untouched. */
  app.groupedBars = function (labels, s1, s2, opts) {
    var o = opts || {};
    var w = 560, h = 220;
    var box = { x: 44, y: 14, w: w - 60, h: h - 52 };
    var svg = GeFi.svg.el("svg", { viewBox: "0 0 " + w + " " + h, width: "100%", role: "img", "aria-label": o.label || "Grouped bar chart", preserveAspectRatio: "xMidYMid meet", class: "gefi-chart" });
    var all = s1.concat(s2);
    var hi = Math.max.apply(null, all.map(function (v) { return Math.abs(v); }));
    var zero = box.y + box.h * (hi / (hi * 2));
    /* zero line + grid */
    [-1, 0, 1].forEach(function (g) {
      var gy = zero - g * (box.h / 2);
      svg.appendChild(GeFi.svg.el("line", { x1: box.x, y1: gy.toFixed(1), x2: box.x + box.w, y2: gy.toFixed(1), class: "gefi-chart__grid" }));
      var t = GeFi.svg.el("text", { x: box.x - 8, y: (gy + 4).toFixed(1), class: "gefi-chart__tick", "text-anchor": "end" });
      t.textContent = (g * hi).toFixed(0);
      svg.appendChild(t);
    });
    var slot = box.w / labels.length;
    labels.forEach(function (lab, i) {
      [s1[i], s2[i]].forEach(function (v, k) {
        var bh = (Math.abs(v) / hi) * (box.h / 2);
        svg.appendChild(GeFi.svg.el("rect", {
          x: (box.x + i * slot + slot * (k === 0 ? 0.16 : 0.54)).toFixed(1),
          y: (v >= 0 ? zero - bh : zero).toFixed(1),
          width: (slot * 0.3).toFixed(1),
          height: bh.toFixed(1),
          rx: 2,
          class: "app-gbar app-gbar--" + (k + 1)
        }));
      });
      var t = GeFi.svg.el("text", { x: (box.x + i * slot + slot / 2).toFixed(1), y: h - 14, class: "gefi-chart__tick", "text-anchor": "middle" });
      t.textContent = lab;
      svg.appendChild(t);
    });
    return svg;
  };

  /* Auto-wire any segment bars present on the page. */
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-app-segments]").forEach(app.segments);
  });
})(window, document);
