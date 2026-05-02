/**
 * Onboarding flow — jurisdiction → entity → identity → security.
 *
 * Implementation notes:
 *
 *   - The user's choices are kept in `sessionStorage` under
 *     `gefi:onboarding:state` so refreshing/back-button works without
 *     re-collecting data. Cleared at the end of the flow.
 *   - Backend calls go to `${site.app.signup_url}/api` (the regional
 *     api.gefi.io worker) with the Auth0 access token in the
 *     `Authorization` header. The token is read from
 *     `sessionStorage["gefi:auth:access_token"]`, which Auth0's hosted
 *     login redirect populates after sign-up. Until the dashboards
 *     ship that storage key, the page-rendered fallback in each step
 *     will surface a helpful error rather than crashing.
 *   - All POSTs include a `gefi-onboarding-flow` correlation header so
 *     the backend can audit-trail the multi-step flow.
 *
 * Each step has its own initialiser which is wired up at the bottom
 * based on which page was rendered.
 */
(function () {
  "use strict";

  var STATE_KEY = "gefi:onboarding:state";
  var TOKEN_KEY = "gefi:auth:access_token";
  var FLOW_HEADER = "X-Gefi-Onboarding-Flow";

  function readState() {
    try {
      return JSON.parse(sessionStorage.getItem(STATE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }
  function writeState(s) {
    sessionStorage.setItem(STATE_KEY, JSON.stringify(s));
  }
  function clearState() {
    sessionStorage.removeItem(STATE_KEY);
  }
  function token() {
    return sessionStorage.getItem(TOKEN_KEY);
  }
  function apiBase() {
    var meta = document.querySelector('meta[name="gefi-api-base"]');
    return (meta && meta.getAttribute("content")) || "https://api.gefi.io";
  }
  function showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
  }
  function hideError(el) {
    if (!el) return;
    el.hidden = true;
    el.textContent = "";
  }
  function flowId() {
    var s = readState();
    if (!s.flowId) {
      s.flowId = "fl_" + Math.random().toString(36).slice(2, 10) + "_" + Date.now().toString(36);
      writeState(s);
    }
    return s.flowId;
  }

  function initJurisdiction() {
    var form = document.getElementById("onboarding-jurisdiction");
    if (!form) return;
    var err = document.getElementById("onboarding-jurisdiction-error");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideError(err);
      var data = new FormData(form);
      var jurisdiction = data.get("jurisdiction");
      if (jurisdiction !== "eu" && jurisdiction !== "us") {
        showError(err, "Please choose a region.");
        return;
      }
      var s = readState();
      s.jurisdiction = jurisdiction;
      writeState(s);
      window.location.href = "/onboarding/entity/";
    });
  }

  function initEntity() {
    var form = document.getElementById("onboarding-entity");
    if (!form) return;
    var err = document.getElementById("onboarding-entity-error");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideError(err);
      var s = readState();
      if (!s.jurisdiction) {
        showError(err, "Pick a region first.");
        setTimeout(function () { window.location.href = "/onboarding/"; }, 800);
        return;
      }
      var data = new FormData(form);
      var body = {
        jurisdiction: s.jurisdiction,
        entity_type: String(data.get("entity_type") || ""),
        display_name: String(data.get("display_name") || "").trim(),
        subscription_tier: String(data.get("subscription_tier") || "free"),
      };
      if (!body.entity_type || !body.display_name || body.display_name.length < 2) {
        showError(err, "Please complete every field.");
        return;
      }
      var t = token();
      if (!t) {
        showError(err, "Your session expired. Please sign in again.");
        return;
      }
      fetch(apiBase() + "/v1/auth/onboard", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + t,
          "Content-Type": "application/json",
          "X-Gefi-Onboarding-Flow": flowId(),
        },
        body: JSON.stringify(body),
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, body: j }; }); })
        .then(function (res) {
          if (!res.ok) {
            showError(err, "We couldn't create your tenant: " + (res.body.error || res.status));
            return;
          }
          s.tenant = res.body.tenant;
          s.next = res.body.next || {};
          s.entity = body;
          writeState(s);
          if (s.next.kyc_required) {
            window.location.href = "/onboarding/identity/";
          } else if (s.next.mfa_required) {
            window.location.href = "/onboarding/security/";
          } else {
            clearState();
            window.location.href = "/";
          }
        })
        .catch(function () { showError(err, "Network error — please retry."); });
    });
  }

  function initIdentity() {
    var root = document.getElementById("onboarding-identity");
    if (!root) return;
    var status = document.getElementById("onboarding-identity-status");
    var go = document.getElementById("onboarding-identity-go");
    var err = document.getElementById("onboarding-identity-error");
    var s = readState();
    var t = token();
    if (!t || !s.tenant) {
      showError(err, "Onboarding state missing. Please start again.");
      return;
    }
    fetch(apiBase() + "/v1/kyc/start", {
      method: "POST",
      headers: { Authorization: "Bearer " + t, "Content-Type": "application/json", "X-Gefi-Onboarding-Flow": flowId() },
      body: "{}",
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, body: j }; }); })
      .then(function (res) {
        if (!res.ok) {
          showError(err, "Verification couldn't start: " + (res.body.error || res.status));
          status.textContent = "";
          return;
        }
        if (res.body.alreadySatisfied) {
          status.textContent = "Identity already verified.";
          go.textContent = "Continue";
          go.href = "/onboarding/security/";
          go.hidden = false;
          return;
        }
        status.textContent = "Click below to open the secure verification window.";
        go.href = res.body.session.hostedUrl;
        go.target = "_blank";
        go.hidden = false;
        // Once the user has the hosted URL they leave the marketing
        // site; the provider webhook updates state. Show a "Continue"
        // button for after they finish.
        setTimeout(function () {
          var continueBtn = document.createElement("a");
          continueBtn.className = "btn btn--ghost";
          continueBtn.href = "/onboarding/security/";
          continueBtn.textContent = "I've finished verification";
          go.parentNode.appendChild(continueBtn);
        }, 0);
      })
      .catch(function () { showError(err, "Network error — please retry."); });
  }

  function initSecurity() {
    var root = document.getElementById("onboarding-security");
    if (!root) return;
    var status = document.getElementById("onboarding-security-status");
    var finish = document.getElementById("onboarding-security-finish");
    var err = document.getElementById("onboarding-security-error");
    var s = readState();
    var subscription = s.entity && s.entity.subscription_tier;
    if (subscription !== "pro" && subscription !== "enterprise") {
      status.textContent = "Multi-factor enrolment isn't required on your tier — but you can add a passkey from your account settings any time.";
      finish.hidden = false;
      finish.textContent = "Go to dashboard";
    } else {
      status.textContent = "Use your authenticator app or hardware key. Auth0 will guide you through enrolment.";
      // The actual MFA enrolment is owned by Auth0's universal login;
      // we just bounce the user there with a return URL.
      finish.hidden = false;
      finish.addEventListener("click", function () {
        var returnTo = encodeURIComponent(window.location.origin + "/");
        window.location.href = (window.GEFI_AUTH0_MFA_URL || "/") + "?return_to=" + returnTo;
      });
    }
    if (err) hideError(err);
    finish.addEventListener("click", function () {
      // If the click handler above didn't redirect (not Pro/Ent), drop
      // the user at home and clear the flow.
      if (subscription !== "pro" && subscription !== "enterprise") {
        clearState();
        window.location.href = "/";
      }
    }, { once: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initJurisdiction();
    initEntity();
    initIdentity();
    initSecurity();
  });
})();
