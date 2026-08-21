/* Trust portal — live artifact-anchor ticker (Task 123).
 *
 * Reads the anchor feed endpoint declared on [data-anchor-feed]. When the
 * endpoint is unset (site.api.base_url is empty in this static build) or the
 * fetch fails, the feed degrades to the written fallback rather than showing
 * an empty table — the portal must never look broken because the API is not
 * deployed yet.
 */
(function (window, document) {
  "use strict";

  var feed = document.querySelector("[data-anchor-feed]");
  if (!feed) return;

  var statusEl = feed.querySelector("[data-anchor-status]");
  var table = feed.querySelector("[data-anchor-table]");
  var body = feed.querySelector("[data-anchor-body]");
  var fallback = feed.querySelector("[data-anchor-fallback]");

  function showFallback() {
    if (statusEl) statusEl.hidden = true;
    if (table) table.hidden = true;
    if (fallback) fallback.hidden = false;
  }

  var endpoint = (feed.getAttribute("data-anchor-endpoint") || "").trim();
  /* An endpoint of "/v1/trust/anchors" means base_url was empty — no API. */
  if (!endpoint || endpoint.charAt(0) === "/") {
    showFallback();
    return;
  }

  var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  var timer = window.setTimeout(function () {
    if (controller) controller.abort();
  }, 4000);

  fetch(endpoint, {
    headers: { Accept: "application/json" },
    signal: controller ? controller.signal : undefined
  })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (data) {
      window.clearTimeout(timer);
      var anchors = (data && data.anchors) || [];
      if (!anchors.length) {
        showFallback();
        return;
      }
      anchors.slice(0, 20).forEach(function (a) {
        var tr = document.createElement("tr");
        [a.model, a.version, a.hash, a.tx, a.anchored_at].forEach(function (v, i) {
          var td = document.createElement("td");
          if (i === 2 || i === 3) td.className = "is-mono";
          td.textContent = v == null ? "—" : String(v);
          tr.appendChild(td);
        });
        body.appendChild(tr);
      });
      if (statusEl) statusEl.hidden = true;
      table.hidden = false;
    })
    .catch(function () {
      window.clearTimeout(timer);
      showFallback();
    });
})(window, document);
