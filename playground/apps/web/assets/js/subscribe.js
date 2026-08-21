/* Phase 0: progressive-enhancement subscribe handler.
 * No framework. Falls back to native form POST if JS is disabled. */
(function () {
  "use strict";
  var form = document.getElementById("subscribe-form");
  if (!form) return;
  var status = document.getElementById("subscribe-status");
  var emailInput = form.querySelector('input[name="email"]');

  function setStatus(state, text) {
    if (!status) return;
    status.setAttribute("data-state", state);
    status.textContent = text;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = (emailInput && emailInput.value || "").trim();
    if (!email || email.indexOf("@") < 1) {
      setStatus("err", "Please enter a valid email.");
      return;
    }
    setStatus("", "Subscribing\u2026");
    var btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email: email, source: "playground-home" }),
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (res.ok && res.body && res.body.ok !== false) {
          setStatus("ok", (res.body && res.body.message) || "Thanks \u2014 we'll be in touch.");
          form.reset();
        } else {
          setStatus("err", (res.body && res.body.message) || "Something went wrong.");
        }
      })
      .catch(function () { setStatus("err", "Network error \u2014 try again shortly."); })
      .finally(function () { if (btn) btn.disabled = false; });
  });
})();
