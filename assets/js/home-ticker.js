/* Homepage hero ticker (Task 99).
 *
 * Rotates seeded sample inference events built from the real model registry
 * (GeFi.MODELS from dashboard.js) — the fold shows motion, and every model
 * named is one that actually exists in the catalogue. When the audit-log API
 * is deployed, this feed swaps to real events; until then it is labelled
 * "sample feed". No-op on pages without [data-hero-ticker].
 */
(function (window, document) {
  "use strict";

  var el = document.querySelector("[data-hero-ticker]");
  var textEl = el && el.querySelector("[data-hero-ticker-text]");
  var GeFi = window.GeFi;
  if (!el || !textEl || !GeFi || !GeFi.MODELS || !GeFi.MODELS.length) return;

  var CITIES = ["Sofia", "London", "Dubai", "Frankfurt", "New York", "Singapore", "Zurich", "Dublin", "Madrid", "Toronto"];
  var VERBS = ["scored a request", "served an inference", "returned a solve", "ran a projection", "answered a call"];

  var rand = GeFi.seed.rng(GeFi.seed.hash("home|ticker"));
  var events = [];
  for (var i = 0; i < 14; i++) {
    var m = GeFi.MODELS[Math.floor(rand() * GeFi.MODELS.length)];
    var verb = VERBS[Math.floor(rand() * VERBS.length)];
    var city = CITIES[Math.floor(rand() * CITIES.length)];
    var ms = 28 + Math.floor(rand() * 60);
    events.push(m.name + " " + verb + " in " + city + " · " + ms + " ms");
  }

  var idx = 0;
  function show() {
    textEl.classList.remove("is-in");
    window.setTimeout(function () {
      textEl.textContent = events[idx % events.length];
      textEl.classList.add("is-in");
      idx += 1;
    }, 240);
  }

  textEl.classList.add("is-in");
  window.setInterval(show, 3200);
})(window, document);
