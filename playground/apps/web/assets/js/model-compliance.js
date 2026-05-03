/* Compliance tab — audits list + Verify-ZKP stub.
 * - Renders the audits the build embedded into #model-data.
 * - "Verify ZKP" POSTs to /api/models/:slug/verify; with the Tampered
 *   checkbox set, we send `?tampered=1` so the server returns
 *   {verified:false} and the UI can demo the failure path. */
(function () {
  "use strict";
  var data = (function () {
    var el = document.getElementById("model-data");
    try { return el ? JSON.parse(el.textContent || "null") : null; }
    catch { return null; }
  })();
  if (!data) return;
  var slug = data.slug;
  var apiBase = window.GEFI_API_BASE || "";

  var listRoot = document.querySelector("[data-audits-root]");
  if (listRoot) {
    var audits = data.audits || [];
    if (audits.length === 0) {
      listRoot.innerHTML = '<li class="audits-empty">No audits filed yet.</li>';
    } else {
      listRoot.innerHTML = audits.map(function (a) {
        var when = new Date((a.auditedAt || 0) * 1000).toISOString().slice(0, 10);
        var pass = a.passed ? "passed" : "failed";
        var badge = a.passed
          ? '<span class="audit-badge audit-badge--ok">Passed</span>'
          : '<span class="audit-badge audit-badge--fail">Failed</span>';
        return '<li class="audit-item">' +
          badge +
          '<div class="audit-item__body">' +
            '<p class="audit-item__top"><strong>' + esc(a.auditor) + '</strong> · ' + esc(a.standard) + '</p>' +
            '<p class="audit-item__meta">Audited ' + when + ' — ' + pass + '</p>' +
            '<code class="audit-item__hash" title="SHA-256 of audit report">' + esc((a.hash || "").slice(0, 16)) + '…</code>' +
          '</div>' +
        '</li>';
      }).join("");
    }
  }

  var btn = document.querySelector("[data-verify-btn]");
  var status = document.querySelector("[data-verify-status]");
  var tamper = document.querySelector("[data-verify-tamper]");
  if (!btn || !status) return;

  btn.addEventListener("click", function () {
    btn.disabled = true;
    status.textContent = "Verifying…";
    status.dataset.state = "pending";
    var url = apiBase + "/api/models/" + encodeURIComponent(slug) + "/verify" +
              (tamper && tamper.checked ? "?tampered=1" : "");
    fetch(url, { method: "POST", credentials: "include" })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error(String(r.status))); })
      .then(function (body) {
        if (body.verified) {
          status.textContent = "✓ Verified (" + body.method + ")";
          status.dataset.state = "ok";
        } else {
          status.textContent = "✗ Verification failed" + (body.reason ? " — " + body.reason : "");
          status.dataset.state = "fail";
        }
      })
      .catch(function () {
        status.textContent = "Verification request failed.";
        status.dataset.state = "fail";
      })
      .then(function () { btn.disabled = false; });
  });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }
})();
