/* Profile & security settings (task 303). */
(function (window, document) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.api || !GeFi.app) return;
    var app = GeFi.app;
    var form = document.querySelector("[data-set-profile-form]");
    if (!form) return;

    var status = document.querySelector("[data-set-status]");
    var avatarPreview = document.querySelector("[data-set-avatar-preview]");
    var profile = null;

    function initials(name) {
      var parts = String(name || "").trim().split(/\s+/).filter(Boolean);
      if (!parts.length) return "?";
      return (parts[0][0] + (parts[1] ? parts[1][0] : parts[0][1] || "")).toUpperCase();
    }
    function renderAvatar() {
      if (profile.avatar) {
        avatarPreview.innerHTML = "";
        var img = document.createElement("img");
        img.src = profile.avatar;
        img.alt = "";
        avatarPreview.appendChild(img);
      } else {
        avatarPreview.textContent = initials(profile.name);
      }
    }
    function fillForm() {
      form.elements.name.value = profile.name || "";
      form.elements.email.value = profile.email || "";
      form.elements.language.value = profile.language || "en";
      document.querySelectorAll("[data-theme-choice]").forEach(function (b) {
        b.classList.toggle("app-segment--active", b.getAttribute("data-theme-choice") === (profile.theme || "dark"));
      });
      renderAvatar();
    }

    GeFi.api.get("/me").then(
      function (r) {
        profile = r;
        fillForm();
      },
      function () {
        profile = app.currentUser() || { name: "Alex Deme", email: "investor@demo.gefi", language: "en", theme: "dark", avatar: null, persona: "investor" };
        fillForm();
      }
    );

    /* ---- theme toggle ---- */
    document.querySelectorAll("[data-theme-choice]").forEach(function (b) {
      b.addEventListener("click", function () {
        profile.theme = b.getAttribute("data-theme-choice");
        document.querySelectorAll("[data-theme-choice]").forEach(function (x) {
          x.classList.toggle("app-segment--active", x === b);
        });
      });
    });

    /* ---- avatar upload / remove ---- */
    document.querySelector("[data-set-avatar-input]").addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        profile.avatar = reader.result;
        renderAvatar();
        GeFi.api.patch("/me", { avatar: profile.avatar }).then(function () {
          app.setCurrentUser(profile);
          status.textContent = "Avatar updated.";
        });
      };
      reader.readAsDataURL(file);
    });
    document.querySelector("[data-set-avatar-clear]").addEventListener("click", function () {
      profile.avatar = null;
      renderAvatar();
      GeFi.api.patch("/me", { avatar: null }).then(function () {
        app.setCurrentUser(profile);
        status.textContent = "Avatar removed.";
      });
    });

    /* ---- save profile ---- */
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      profile.name = form.elements.name.value.trim();
      profile.language = form.elements.language.value;
      status.textContent = "Saving…";
      GeFi.api.patch("/me", { name: profile.name, language: profile.language, theme: profile.theme }).then(
        function () {
          app.setCurrentUser(profile);
          status.textContent = "Saved.";
        },
        function (err) {
          status.textContent = (err && err.body && err.body.message) || "Couldn't save — please try again.";
        }
      );
    });

    /* ---- active sessions ---- */
    function renderSessions() {
      var el = document.querySelector("[data-set-sessions]");
      var sStatus = document.querySelector("[data-set-sessions-status]");
      GeFi.api.get("/auth/sessions").then(function (r) {
        el.innerHTML = "";
        var items = r.items || [];
        if (!items.length) {
          el.appendChild(app.empty({ head: "No active sessions", hint: "Sign in again to start one." }));
          return;
        }
        items.forEach(function (s) {
          var row = document.createElement("div");
          row.className = "app-fh-row";
          var lab = document.createElement("span");
          var strong = document.createElement("strong");
          strong.style.color = "var(--app-text)";
          strong.textContent = s.device;
          lab.appendChild(strong);
          lab.append(" · " + s.ip + " · since " + GeFi.fmt.date(s.created));
          if (s.current) lab.appendChild(app.chip("ok", "This device"));
          row.appendChild(lab);
          if (!s.current) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "app-btn app-btn--ghost";
            btn.textContent = "Revoke";
            btn.addEventListener("click", function () {
              GeFi.api.del("/auth/sessions/" + encodeURIComponent(s.id)).then(function () {
                sStatus.textContent = s.device + " signed out.";
                renderSessions();
              });
            });
            row.appendChild(btn);
          }
          el.appendChild(row);
        });
      });
    }
    renderSessions();

    /* ---- danger zone ---- */
    document.querySelector("[data-set-signout]").addEventListener("click", function () {
      GeFi.api.del("/auth/session").then(finishSignOut, finishSignOut);
    });
    function finishSignOut() {
      try {
        sessionStorage.removeItem("gefi-app-token");
        sessionStorage.removeItem("gefi-app-refresh");
      } catch (e) {}
      app.setCurrentUser(null);
      window.location.href = "/app/signin/";
    }

    var delModal = document.querySelector("[data-set-delete-modal]");
    document.querySelector("[data-set-delete]").addEventListener("click", function () {
      delModal.querySelector("[data-set-delete-name]").textContent = profile.email;
      delModal.querySelector("[data-set-delete-err]").textContent = "";
      delModal.querySelector('input[name="confirm"]').value = "";
      delModal.hidden = false;
      delModal.querySelector('input[name="confirm"]').focus();
    });
    delModal.addEventListener("click", function (e) {
      if (e.target === delModal || e.target.closest("[data-set-delete-cancel]")) delModal.hidden = true;
    });
    document.querySelector("[data-set-delete-form]").addEventListener("submit", function (e) {
      e.preventDefault();
      var typed = e.target.elements.confirm.value.trim();
      if (typed.toLowerCase() !== profile.email.toLowerCase()) {
        delModal.querySelector("[data-set-delete-err]").textContent = "Email doesn't match — nothing deleted.";
        return;
      }
      delModal.hidden = true;
      status.textContent = "This is a sample environment — nothing was actually deleted. Signing you out.";
      setTimeout(finishSignOut, 1200);
    });
  });
})(window, document);
