/* Onboarding & KYC wizard preview (Task 115).
 *
 * Same sessionStorage gate pattern as /dashboard/ (shared key, so entering
 * one preview admits both). Step state is resumable via sessionStorage.
 * Status polling targets /v1/kyc/status when api.base_url is configured and
 * falls back to a staged local mock otherwise.
 */
(function (window, document) {
  "use strict";

  var root = document.querySelector("[data-onb-root]");
  var gate = document.querySelector("[data-onb-gate]");
  if (!root || !gate) return;

  var GATE_KEY = "gefi-dash-preview";
  var STATE_KEY = "gefi-onboarding-state";

  function store(obj) {
    try {
      sessionStorage.setItem(STATE_KEY, JSON.stringify(obj));
    } catch (e) {}
  }
  function load() {
    try {
      return JSON.parse(sessionStorage.getItem(STATE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  var state = load();
  state.step = state.step || 1;

  /* ------------------------------------------------------------- gate */

  function gated() {
    try {
      return sessionStorage.getItem(GATE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  gate.addEventListener("click", function (e) {
    if (!e.target.closest("[data-onb-enter]")) return;
    try {
      sessionStorage.setItem(GATE_KEY, "1");
    } catch (err) {}
    gate.hidden = true;
    root.hidden = false;
    render();
  });

  /* ------------------------------------------------------------ steps */

  function canContinue() {
    if (state.step === 1) return !!state.accountType;
    if (state.step === 2) return !!state.jurisdiction;
    if (state.step === 3) return !!state.docsDone;
    return false;
  }

  function render() {
    root.querySelectorAll("[data-onb-step]").forEach(function (s) {
      s.hidden = parseInt(s.getAttribute("data-onb-step"), 10) !== state.step;
    });
    root.querySelectorAll("[data-onb-rail-step]").forEach(function (li) {
      var n = parseInt(li.getAttribute("data-onb-rail-step"), 10);
      li.classList.toggle("is-current", n === state.step);
      li.classList.toggle("is-done", n < state.step);
    });

    var back = root.querySelector("[data-onb-back]");
    var next = root.querySelector("[data-onb-next]");
    back.hidden = state.step === 1;
    next.hidden = state.step === 4;
    next.disabled = !canContinue();

    /* step-specific hydration */
    if (state.step === 1) {
      root.querySelectorAll("[data-onb-choice]").forEach(function (b) {
        b.classList.toggle("is-selected", b.getAttribute("data-onb-choice") === state.accountType);
      });
    }
    if (state.step === 2) {
      var sel = root.querySelector("[data-onb-jurisdiction]");
      if (sel && state.jurisdiction) sel.value = state.jurisdiction;
    }
    if (state.step === 3) {
      var done = root.querySelector("[data-onb-capture-done]");
      if (done) done.hidden = !state.docsDone;
    }
    if (state.step === 4) {
      var dl = root.querySelector("[data-onb-review]");
      dl.innerHTML = "";
      [
        ["Account type", state.accountType || "—"],
        ["Jurisdiction", state.jurisdiction || "—"],
        ["Documents", state.docsDone ? "Captured (simulated)" : "—"],
        ["KYC tier requested", state.accountType === "institutional" ? "2" : "1"]
      ].forEach(function (r) {
        var div = document.createElement("div");
        var dt = document.createElement("dt");
        dt.textContent = r[0];
        var dd = document.createElement("dd");
        dd.textContent = r[1];
        div.appendChild(dt);
        div.appendChild(dd);
        dl.appendChild(div);
      });
    }
    store(state);
  }

  root.addEventListener("click", function (e) {
    var choice = e.target.closest("[data-onb-choice]");
    if (choice) {
      state.accountType = choice.getAttribute("data-onb-choice");
      render();
      return;
    }
    if (e.target.closest("[data-onb-capture]")) {
      state.docsDone = true;
      render();
      return;
    }
    if (e.target.closest("[data-onb-back]")) {
      state.step = Math.max(1, state.step - 1);
      render();
      return;
    }
    if (e.target.closest("[data-onb-next]")) {
      if (canContinue()) {
        state.step = Math.min(4, state.step + 1);
        render();
      }
      return;
    }
    if (e.target.closest("[data-onb-submit]")) {
      submit();
    }
  });

  root.addEventListener("change", function (e) {
    if (e.target.matches("[data-onb-jurisdiction]")) {
      state.jurisdiction = e.target.value;
      render();
    }
  });

  /* ------------------------------------------------- status polling */

  var API_BASE = (document.body.getAttribute("data-api-base") || "").trim();

  function showStatus(headline, detail) {
    var box = root.querySelector("[data-onb-status]");
    box.hidden = false;
    root.querySelector("[data-onb-status-headline]").textContent = headline;
    root.querySelector("[data-onb-status-detail]").textContent = detail;
  }

  function submit() {
    var btn = root.querySelector("[data-onb-submit]");
    btn.disabled = true;
    btn.textContent = "Submitted";

    if (!API_BASE) {
      /* Staged local mock: pending -> in_review, honestly labelled. */
      showStatus("Status: pending", "Sample status — no API configured. Your submission enters the review queue.");
      window.setTimeout(function () {
        showStatus(
          "Status: in review",
          "Sample status — in production this polls /v1/kyc/status until the Sumsub webhook lands a decision."
        );
      }, 1800);
      return;
    }

    function poll() {
      window
        .fetch(API_BASE + "/v1/kyc/status", { headers: { Accept: "application/json" } })
        .then(function (r) {
          return r.json();
        })
        .then(function (json) {
          showStatus("Status: " + (json.status || "pending"), json.detail || "");
          if (json.status !== "approved" && json.status !== "rejected") {
            window.setTimeout(poll, 5000);
          }
        })
        .catch(function () {
          showStatus("Status: unavailable", "Could not reach the KYC service — will retry.");
          window.setTimeout(poll, 8000);
        });
    }
    poll();
  }

  /* --------------------------------------------------------------- boot */

  if (gated()) {
    gate.hidden = true;
    root.hidden = false;
    render();
  } else {
    gate.hidden = false;
    root.hidden = true;
  }
})(window, document);
