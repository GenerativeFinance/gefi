/* Hydrate the build-time featured carousel with live ratings.
 * Build emits cards with frozen rating numbers; on load we ask the API for
 * the latest /api/models?featured=1 and patch the [data-rating] /
 * [data-rating-count] spans in place — no card replacement. */
(function () {
  "use strict";
  var rail = document.getElementById("featured-rail");
  if (!rail) return;
  var apiBase = window.GEFI_API_BASE || "";
  fetch(apiBase + "/api/models?featured=1&limit=24")
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data || !Array.isArray(data.items)) return;
      data.items.forEach(function (m) {
        var card = rail.querySelector('.model-card[data-slug="' + m.slug + '"]');
        if (!card) return;
        var rv = card.querySelector("[data-rating]");
        var rc = card.querySelector("[data-rating-count]");
        if (rv) rv.textContent = (Math.round(m.rating * 10) / 10).toFixed(1);
        if (rc) rc.textContent = "(" + m.ratingCount + ")";
      });
    })
    .catch(function () { /* keep build-time numbers on failure */ });
})();
