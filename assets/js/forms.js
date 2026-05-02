/* Tiny vanilla JS: nav toggle + form submission to placeholder API endpoints. */
(function () {
  "use strict";

  // --- Mobile nav toggle ---
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // --- Generic form handler ---
  // Forms with `data-form="newsletter|contact|demo"` POST JSON to the matching
  // endpoint configured in `_config.yml` and surface a status message.
  var endpoints = (window.GEFI_CONFIG && window.GEFI_CONFIG.endpoints) || {};

  function getStatus(form) {
    return form.querySelector("[data-status]");
  }

  function setStatus(form, message, state) {
    var el = getStatus(form);
    if (!el) return;
    el.textContent = message;
    if (state) {
      el.setAttribute("data-state", state);
    } else {
      el.removeAttribute("data-state");
    }
  }

  function serialize(form) {
    var data = {};
    var fd = new FormData(form);
    fd.forEach(function (value, key) { data[key] = value; });
    return data;
  }

  function submit(form, ev) {
    ev.preventDefault();
    var kind = form.getAttribute("data-form");
    var endpoint = endpoints[kind];
    var payload = serialize(form);

    if (!endpoint) {
      // No backend yet — log and acknowledge for the visitor.
      console.info("[gefi] " + kind + " submission (no API configured):", payload);
      setStatus(form, "Thanks! We'll be in touch shortly.", "ok");
      form.reset();
      return;
    }

    setStatus(form, "Sending…", null);

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (res.ok) {
          setStatus(form, "Thanks! We'll be in touch shortly.", "ok");
          form.reset();
        } else {
          setStatus(form, "Sorry, something went wrong (" + res.status + "). Please try again.", "error");
        }
      })
      .catch(function () {
        setStatus(form, "Network error. Please try again.", "error");
      });
  }

  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (ev) { submit(form, ev); });
  });
})();
