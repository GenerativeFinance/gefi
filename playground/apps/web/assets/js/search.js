/* Global header search — ARIA 1.2 combobox.
 * Debounced 200ms, keyboard navigable, falls back to GET /?q=… on JS-off. */
(function () {
  "use strict";
  var input = document.getElementById("global-search-input");
  if (!input) return;
  var combobox = input.closest('[role="combobox"]');
  var listbox = document.getElementById("search-listbox");
  if (!combobox || !listbox) return;

  var apiBase = window.GEFI_API_BASE || "";
  var DEBOUNCE_MS = 200;
  var MIN_CHARS = 2;
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
    setExpanded(false);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return "&#" + c.charCodeAt(0) + ";"; });
  }

  function render(items) {
    results = items;
    activeIndex = -1;
    if (items.length === 0) {
      listbox.innerHTML = '<li class="global-search__empty" role="presentation">No matches</li>';
      setExpanded(true);
      return;
    }
    var html = "";
    for (var i = 0; i < items.length; i++) {
      var m = items[i];
      html +=
        '<li role="option" id="search-opt-' + i + '" class="global-search__option" data-href="' +
        escapeHtml(m.href) + '">' +
        '<span class="global-search__option-name">' + escapeHtml(m.name) + "</span>" +
        '<span class="global-search__option-cat">' + escapeHtml(m.category) + "</span>" +
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
    input.setAttribute("aria-activedescendant", "search-opt-" + idx);
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
        render((data && data.items) || []);
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
    var li = e.target.closest('[role="option"]');
    if (li && li.dataset.href) window.location.href = li.dataset.href;
  });

  document.addEventListener("click", function (e) {
    if (!combobox.contains(e.target)) clearResults();
  });
})();
