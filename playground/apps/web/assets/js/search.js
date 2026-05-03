/* Global search — ARIA 1.2 combobox.
 * The same include is rendered twice (header + hero) on the home page; this
 * script binds independently to every `.global-search__input` it finds, so
 * each instance has its own state, listbox, and aria-activedescendant.
 *
 * Debounced 200ms, keyboard navigable (↑ ↓ Enter Esc), falls back to a real
 * GET /?q=… form submit when JS is disabled. */
(function () {
  "use strict";
  var apiBase = window.GEFI_API_BASE || "";
  var DEBOUNCE_MS = 200;
  var MIN_CHARS = 2;

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }
  function priceLabel(cents) {
    if (cents == null || cents <= 0) return "Free";
    var d = cents / 100;
    return d >= 1000
      ? "$" + Math.round(d).toLocaleString("en-US")
      : "$" + (d % 1 === 0 ? d.toFixed(0) : d.toFixed(2));
  }

  function attach(input) {
    var combobox = input.closest('[role="combobox"]');
    if (!combobox) return;
    var listboxId = input.getAttribute("aria-controls");
    var listbox = listboxId ? document.getElementById(listboxId) : null;
    if (!listbox) return;

    var optIdPrefix = listboxId + "-opt-";
    var timer = null;
    var lastQuery = "";
    var activeIndex = -1;
    var results = [];

    function setExpanded(expanded) {
      combobox.setAttribute("aria-expanded", expanded ? "true" : "false");
      listbox.hidden = !expanded;
    }
    function clearResults() {
      listbox.innerHTML = "";
      results = [];
      activeIndex = -1;
      input.removeAttribute("aria-activedescendant");
      setExpanded(false);
    }
    function clearAndReset() {
      input.value = "";
      lastQuery = "";
      clearResults();
      input.focus();
    }

    function render(items, q) {
      results = items;
      activeIndex = -1;
      if (items.length === 0) {
        listbox.innerHTML =
          '<li class="global-search__miss" role="presentation">' +
          '<span class="global-search__miss-text">No models match' +
          (q ? ' &ldquo;' + escapeHtml(q) + '&rdquo;' : '') +
          ' &mdash; try clearing filters.</span>' +
          '<button type="button" class="global-search__miss-action" data-action="clear">Clear search</button>' +
          '</li>';
        setExpanded(true);
        return;
      }
      var html = "";
      for (var i = 0; i < items.length; i++) {
        var m = items[i];
        html +=
          '<li role="option" id="' + optIdPrefix + i + '" class="global-search__option" data-href="' +
          escapeHtml(m.href) + '">' +
          '<span class="global-search__option-name">' + escapeHtml(m.name) + "</span>" +
          '<span class="global-search__option-cat">' + escapeHtml(m.category) + "</span>" +
          '<span class="global-search__option-price">' + escapeHtml(priceLabel(m.price)) + "</span>" +
          "</li>";
      }
      listbox.innerHTML = html;
      setExpanded(true);
    }

    function setActive(idx) {
      var options = listbox.querySelectorAll('[role="option"]');
      if (options.length === 0) return;
      if (idx < 0) idx = options.length - 1;
      if (idx >= options.length) idx = 0;
      options.forEach(function (el, i) {
        el.classList.toggle("is-active", i === idx);
        el.setAttribute("aria-selected", i === idx ? "true" : "false");
      });
      activeIndex = idx;
      input.setAttribute("aria-activedescendant", optIdPrefix + idx);
      options[idx].scrollIntoView({ block: "nearest" });
    }

    function fetchResults(q) {
      if (q === lastQuery) return;
      lastQuery = q;
      if (q.length < MIN_CHARS) { clearResults(); return; }
      fetch(apiBase + "/api/models?q=" + encodeURIComponent(q) + "&limit=8")
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (input.value.trim() !== q) return; // race-guard
          render((data && data.items) || [], q);
        })
        .catch(function () { /* silent */ });
    }

    input.addEventListener("input", function () {
      if (timer) clearTimeout(timer);
      var q = input.value.trim();
      timer = setTimeout(function () { fetchResults(q); }, DEBOUNCE_MS);
    });
    input.addEventListener("keydown", function (e) {
      if (listbox.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(activeIndex + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(activeIndex - 1); }
      else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        var pick = results[activeIndex];
        if (pick && pick.href) window.location.href = pick.href;
      } else if (e.key === "Escape") { clearResults(); }
    });
    listbox.addEventListener("click", function (e) {
      var clearBtn = e.target.closest('[data-action="clear"]');
      if (clearBtn) { e.preventDefault(); clearAndReset(); return; }
      var li = e.target.closest('[role="option"]');
      if (li && li.dataset.href) window.location.href = li.dataset.href;
    });
    document.addEventListener("click", function (e) {
      if (!combobox.contains(e.target)) clearResults();
    });
  }

  document.querySelectorAll(".global-search__input").forEach(attach);
})();
