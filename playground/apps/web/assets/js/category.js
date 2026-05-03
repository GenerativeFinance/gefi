/* Category landing page — chip + filter + sort + cursor pagination against
 * GET /api/models. Lives in the page itself; one instance per /categories/X/. */
(function () {
  "use strict";
  var page = document.querySelector(".category-page");
  if (!page) return;
  var category = page.dataset.category;
  var grid = document.getElementById("category-results");
  var emptyEl = document.getElementById("category-empty");
  var loadMore = document.getElementById("category-load-more");
  if (!grid) return;

  var apiBase = window.GEFI_API_BASE || "";
  var subcategory = "";
  var filters = { risk: "", maturity: "", sort: "trending" };
  var cursor = null;

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }
  function priceLabel(cents) {
    if (!cents) return "Free";
    var d = cents / 100;
    return d >= 1000 ? "$" + Math.round(d).toLocaleString("en-US")
                     : "$" + (d % 1 === 0 ? d.toFixed(0) : d.toFixed(2));
  }
  function riskLabel(r) {
    return r === "low" ? "Low risk" : r === "high" ? "High risk" : "Medium risk";
  }
  function cardHtml(m) {
    var thumb = m.thumbnailUrl
      ? '<img class="model-card__thumb" src="' + escapeHtml(m.thumbnailUrl) + '" alt="" loading="lazy" width="320" height="160" />'
      : '<div class="model-card__thumb model-card__thumb--placeholder" aria-hidden="true"></div>';
    var fed = m.federated
      ? '<span class="model-card__badge model-card__badge--federated" title="Federated training">Federated</span>'
      : "";
    var rating = (Math.round(m.rating * 10) / 10).toFixed(1);
    return (
      '<a class="model-card" href="' + escapeHtml(m.href) + '" data-slug="' + escapeHtml(m.slug) + '">' +
      thumb +
      '<div class="model-card__body">' +
        '<div class="model-card__meta">' +
          '<span class="model-card__category">' + escapeHtml(m.category) + "</span>" +
          '<span class="model-card__badge model-card__badge--risk-' + escapeHtml(m.riskLevel) + '">' +
          escapeHtml(riskLabel(m.riskLevel)) + "</span>" +
          fed +
        "</div>" +
        '<h3 class="model-card__name">' + escapeHtml(m.name) + "</h3>" +
        '<p class="model-card__description">' + escapeHtml(m.summary || m.description || "") + "</p>" +
        '<div class="model-card__footer">' +
          '<span class="model-card__price">' + escapeHtml(priceLabel(m.price)) + "</span>" +
          '<span class="model-card__rating" aria-label="Rating ' + rating + ' out of 5 from ' + m.ratingCount + ' reviews">' +
            '<span aria-hidden="true">★</span> ' +
            '<span class="model-card__rating-value" data-rating>' + rating + "</span> " +
            '<span class="model-card__rating-count" data-rating-count>(' + m.ratingCount + ")</span>" +
          "</span>" +
        "</div>" +
      "</div></a>"
    );
  }

  function buildUrl() {
    var qs = ["category=" + encodeURIComponent(category)];
    if (subcategory) qs.push("subcategory=" + encodeURIComponent(subcategory));
    if (filters.risk) qs.push("risk=" + filters.risk);
    if (filters.maturity) qs.push("maturity=" + filters.maturity);
    if (filters.sort) qs.push("sort=" + filters.sort);
    if (cursor) qs.push("cursor=" + encodeURIComponent(cursor));
    return apiBase + "/api/models?" + qs.join("&");
  }

  function reset() { cursor = null; grid.innerHTML = ""; }

  function load(append) {
    grid.setAttribute("aria-busy", "true");
    fetch(buildUrl())
      .then(function (r) { return r.ok ? r.json() : { items: [], next_cursor: null }; })
      .then(function (data) {
        if (!append) grid.innerHTML = "";
        var items = (data && data.items) || [];
        items.forEach(function (m) { grid.insertAdjacentHTML("beforeend", cardHtml(m)); });
        cursor = data && data.next_cursor;
        loadMore.hidden = !cursor;
        var anyResults = grid.querySelector(".model-card") !== null;
        if (emptyEl) emptyEl.hidden = anyResults;
        grid.setAttribute("aria-busy", "false");
      });
  }

  page.querySelectorAll(".chip").forEach(function (btn) {
    btn.addEventListener("click", function () {
      page.querySelectorAll(".chip").forEach(function (b) { b.classList.remove("chip--active"); });
      btn.classList.add("chip--active");
      subcategory = btn.dataset.subcategory || "";
      reset(); load(false);
    });
  });

  page.querySelectorAll("[data-filter]").forEach(function (sel) {
    sel.addEventListener("change", function () {
      filters[sel.dataset.filter] = sel.value;
      reset(); load(false);
    });
  });

  loadMore.addEventListener("click", function () { load(true); });

  load(false);
})();
