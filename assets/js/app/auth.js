/* Sign in + sign up (task 303). Runs on plain DOMContentLoaded (not
 * GeFi.api.page) — a login form must respond the instant the page
 * paints, it shouldn't wait on the live/sample probe. */
(function (window, document) {
  "use strict";

  var HOME = {
    investor: "/app/",
    developer: "/app/dev/",
    "data-provider": "/app/data-provider/",
    regulator: "/app/regulator/",
    admin: "/app/dev/",
  };

  function strengthOf(pw) {
    var score = 0;
    if (pw.length >= 8) score += 30;
    if (pw.length >= 12) score += 15;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 20;
    if (/\d/.test(pw)) score += 15;
    if (/[^A-Za-z0-9]/.test(pw)) score += 20;
    return Math.min(100, score);
  }

  function errorMessage(err, fallback) {
    return (err && err.body && err.body.message) || fallback;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.api || !GeFi.app) return;

    /* ---- shared bits: password toggle, SSO decoys ---- */
    document.querySelectorAll("[data-auth-pwtoggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var input = btn.parentElement.querySelector("[data-auth-pw]");
        var showing = input.type === "text";
        input.type = showing ? "password" : "text";
        btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
      });
    });
    document.querySelectorAll("[data-auth-sso]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var err = document.querySelector("[data-auth-error]");
        if (err) err.textContent = "SSO sign-in isn't available in this preview — use email + password.";
      });
    });

    function completeLogin(result) {
      try {
        sessionStorage.setItem("gefi-app-token", result.token || "");
        sessionStorage.setItem("gefi-app-refresh", result.refresh_token || "");
      } catch (e) {}
      GeFi.app.setCurrentUser(result.user);
      window.location.href = HOME[result.user.persona] || "/app/";
    }

    /* ==================== Sign in ==================== */
    var signinForm = document.querySelector('[data-auth-form="password"]');
    if (signinForm) {
      var errEl = document.querySelector("[data-auth-error]");
      var submitBtn = document.querySelector("[data-auth-submit]");
      var mfaCard = document.querySelector("[data-auth-mfa]");
      var signinCard = document.querySelector('[data-auth-mode="signin"]');
      var mfaForm = document.querySelector("[data-auth-mfa-form]");
      var mfaErr = document.querySelector("[data-auth-mfa-error]");
      var pendingAuth = null;

      signinForm.addEventListener("submit", function (e) {
        e.preventDefault();
        errEl.textContent = "";
        var email = signinForm.elements.email.value.trim();
        var password = signinForm.elements.password.value;
        submitBtn.disabled = true;
        submitBtn.textContent = "Signing in…";
        GeFi.api.post("/auth/session", { email: email, password: password }).then(
          function (result) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Sign In";
            pendingAuth = result;
            signinCard.hidden = true;
            mfaCard.hidden = false;
            mfaCard.querySelector('input[name="code"]').focus();
          },
          function (err) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Sign In";
            errEl.textContent = errorMessage(err, "Sign-in failed — please try again.");
          }
        );
      });

      mfaForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var code = mfaForm.elements.code.value.trim();
        if (code !== "000000") {
          mfaErr.textContent = "Incorrect code — for this demo, use 000000.";
          return;
        }
        mfaErr.textContent = "";
        completeLogin(pendingAuth);
      });
    }

    /* ==================== Sign up ==================== */
    var registerForm = document.querySelector('[data-auth-form="register"]');
    if (registerForm) {
      var regErr = document.querySelector("[data-auth-error]");
      var regBtn = document.querySelector("[data-auth-submit]");
      var selectedPersona = "investor";
      document.querySelectorAll("[data-persona]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          document.querySelectorAll("[data-persona]").forEach(function (b) {
            b.setAttribute("aria-pressed", b === btn ? "true" : "false");
          });
          selectedPersona = btn.getAttribute("data-persona");
        });
      });

      var pwInput = registerForm.querySelector("[data-auth-pw]");
      var fill = document.querySelector("[data-auth-strength-fill]");
      var label = document.querySelector("[data-auth-strength-label]");
      if (pwInput && fill) {
        pwInput.addEventListener("input", function () {
          var pw = pwInput.value;
          var s = pw ? strengthOf(pw) : 0;
          fill.style.width = s + "%";
          fill.style.background = s < 40 ? "var(--app-red)" : s < 70 ? "var(--app-amber)" : "var(--app-green)";
          label.textContent = !pw ? "8+ characters" : s < 40 ? "Weak" : s < 70 ? "Fair" : "Strong";
        });
      }

      registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        regErr.textContent = "";
        var name = registerForm.elements.name.value.trim();
        var email = registerForm.elements.email.value.trim();
        var password = registerForm.elements.password.value;
        if (password.length < 8) {
          regErr.textContent = "Password must be at least 8 characters.";
          return;
        }
        regBtn.disabled = true;
        regBtn.textContent = "Creating account…";
        GeFi.api.post("/auth/register", { name: name, email: email, password: password, persona: selectedPersona }).then(
          function (result) {
            completeLogin(result);
          },
          function (err) {
            regBtn.disabled = false;
            regBtn.textContent = "Create Account";
            regErr.textContent = errorMessage(err, "Couldn't create the account — please try again.");
          }
        );
      });
    }
  });
})(window, document);
