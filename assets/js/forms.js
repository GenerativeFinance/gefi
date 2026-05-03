/* GeFi marketing site — tiny vanilla JS layer.
 *
 *   1. Mobile nav toggle (the nav also works without JS — see CSS .no-js rules).
 *   2. Generic form submit handler that POSTs JSON to the endpoints declared in
 *      _config.yml. While those endpoints are empty strings, we surface a
 *      simulated "thanks" message and log the payload to the console — Task #2
 *      (Cloudflare backend) wires the real endpoints in.
 */
(function () {
  "use strict";

  /* --- Mobile nav toggle --- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("primary-nav");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close the menu when a nav link is activated, so the next page doesn't
    // load with the menu still flagged open in assistive tech.
    nav.addEventListener("click", function (ev) {
      var link = ev.target.closest("a");
      if (link) closeNav();
    });

    // Esc closes the menu.
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") closeNav();
    });
  }

  /* --- Generic form handler --- */
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
      // (When the API ships, set the URL in _config.yml and this branch goes away.)
      console.info("[gefi] " + kind + " submission (no API configured yet):", payload);
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

  /* --- Pre-select form fields from querystring (e.g. ?topic=partnerships) --- */
  try {
    var params = new URLSearchParams(window.location.search);
    var topic = params.get("topic");
    if (topic) {
      document.querySelectorAll("select[data-topic-select], select[name='topic']").forEach(function (sel) {
        var match = Array.prototype.find.call(sel.options, function (opt) {
          return opt.value === topic;
        });
        if (match) sel.value = topic;
      });
    }
  } catch (e) {
    /* URLSearchParams unavailable — skip silently. */
  }
})();
