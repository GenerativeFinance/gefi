/* Audit-log run_id verifier (Task 102).
 *
 * With site.api.verifier_endpoint configured, GETs `<endpoint>?run_id=…` and
 * renders the verifier's JSON verdict. Without one — the usual static-site
 * state — it produces a deterministic, clearly-labelled sample verification,
 * following the same local-fallback pattern as the model demo harness.
 */
(function () {
  "use strict";

  var form = document.querySelector("[data-verify-form]");
  var result = document.querySelector("[data-verify-result]");
  if (!form || !result) return;

  var endpoint = form.getAttribute("data-verifier-endpoint") || "";

  /* FNV-1a, for the deterministic sample proof. */
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return (h >>> 0).toString(16);
  }

  function render(rows, kind, note) {
    result.innerHTML = "";
    result.hidden = false;
    result.setAttribute("data-kind", kind);
    var dl = document.createElement("dl");
    dl.className = "verify-result__facts";
    rows.forEach(function (r) {
      var div = document.createElement("div");
      var dt = document.createElement("dt");
      dt.textContent = r[0];
      var dd = document.createElement("dd");
      dd.textContent = r[1];
      div.appendChild(dt);
      div.appendChild(dd);
      dl.appendChild(div);
    });
    result.appendChild(dl);
    if (note) {
      var p = document.createElement("p");
      p.className = "verify-result__note";
      p.textContent = note;
      result.appendChild(p);
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var runId = (form.elements.run_id.value || "").trim();
    if (!runId) {
      render([["Result", "Enter a run_id first"]], "error", "");
      return;
    }

    if (!endpoint) {
      var leaf = hash(runId);
      var root = hash("anchor|" + runId);
      render(
        [
          ["Result", "Inclusion proof valid"],
          ["Run id", runId],
          ["Leaf hash", leaf.slice(0, 8) + "…" + leaf.slice(-4)],
          ["Merkle root", root.slice(0, 8) + "…" + root.slice(-4)],
          ["Anchored", "in yesterday's daily anchor"]
        ],
        "ok",
        "Sample verification — offline demo output. No verifier endpoint is configured on this site; against the live verifier this checks a real inclusion proof."
      );
      return;
    }

    render([["Result", "Verifying…"]], "busy", "");
    window
      .fetch(endpoint + "?run_id=" + encodeURIComponent(runId), { headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error("Verifier returned " + r.status);
        return r.json();
      })
      .then(function (json) {
        var ok = !!(json && (json.verified || json.valid));
        render(
          [
            ["Result", ok ? "Inclusion proof valid" : "NOT verified"],
            ["Run id", runId],
            ["Merkle root", (json && json.root) || "—"]
          ],
          ok ? "ok" : "error",
          ""
        );
      })
      .catch(function (err) {
        render([["Result", "Verification failed"], ["Detail", err.message]], "error", "");
      });
  });
})();
