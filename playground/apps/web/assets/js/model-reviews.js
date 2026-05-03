/* Reviews tab.
 * - Star input (1..5) implemented as roving-radio buttons (ARIA radiogroup).
 * - Comment textarea limited to 200 chars with a live counter.
 * - On submit POST /api/models/:slug/reviews; on success we patch the rail
 *   rating + count and prepend the new/updated review at the top of the list.
 * - GET /api/models/:slug/reviews?cursor=… powers the initial fetch and the
 *   "Load more" pager (cursor returned by the server is opaque). */
(function () {
  "use strict";
  var data = (function () {
    var el = document.getElementById("model-data");
    try { return el ? JSON.parse(el.textContent || "null") : null; }
    catch { return null; }
  })();
  if (!data) return;
  var slug = data.slug;
  var apiBase = window.GEFI_API_BASE || "";

  // Lazy fetch on first reveal of the reviews tab.
  var fetched = false;
  document.addEventListener("model:tab-shown", function (ev) {
    if (ev.detail && ev.detail.tab === "reviews" && !fetched) {
      fetched = true;
      loadFirstPage();
    }
  });

  var listRoot = document.querySelector("[data-reviews-root]");
  var moreBtn = document.querySelector("[data-reviews-more]");
  var nextCursor = null;

  function reviewHtml(r) {
    var stars = "★★★★★".slice(0, r.stars) + "☆☆☆☆☆".slice(0, 5 - r.stars);
    // API returns the timestamp as `createdAt` (seconds) and the obfuscated
    // author handle as `reviewer` — match the ReviewDTO contract exactly.
    var when = new Date((r.createdAt || 0) * 1000).toISOString().slice(0, 10);
    return '<li class="review-item" data-review-id="' + esc(r.id) + '">' +
      '<p class="review-item__head"><strong>' + esc(r.reviewer) + '</strong>' +
      ' <span class="review-item__stars" aria-label="' + r.stars + ' out of 5">' + stars + '</span>' +
      ' <time>' + when + '</time></p>' +
      (r.comment ? '<p class="review-item__body">' + esc(r.comment) + '</p>' : '') +
    '</li>';
  }

  function loadFirstPage() {
    fetch(apiBase + "/api/models/" + encodeURIComponent(slug) + "/reviews")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (body) {
        if (!body) return;
        if (listRoot) listRoot.innerHTML = (body.items || []).map(reviewHtml).join("");
        if (listRoot && (!body.items || body.items.length === 0)) {
          listRoot.innerHTML = '<li class="reviews-empty">No reviews yet — be the first.</li>';
        }
        nextCursor = body.next_cursor || null;
        if (moreBtn) moreBtn.hidden = !nextCursor;
      });
  }

  if (moreBtn) {
    moreBtn.addEventListener("click", function () {
      if (!nextCursor) return;
      moreBtn.disabled = true;
      fetch(apiBase + "/api/models/" + encodeURIComponent(slug) +
            "/reviews?cursor=" + encodeURIComponent(nextCursor))
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (body) {
          if (body && listRoot) {
            listRoot.insertAdjacentHTML("beforeend", (body.items || []).map(reviewHtml).join(""));
            nextCursor = body.next_cursor || null;
            moreBtn.hidden = !nextCursor;
          }
        })
        .then(function () { moreBtn.disabled = false; });
    });
  }

  // ── Form (stars + comment + submit) ─────────────────────────────────
  var form = document.querySelector("[data-review-form]");
  if (!form) return;
  var starsRoot = form.querySelector("[data-stars]");
  var commentEl = form.querySelector("[data-review-comment]");
  var counter   = form.querySelector("[data-review-counter]");
  var submit    = form.querySelector("[data-review-submit]");
  var status    = form.querySelector("[data-review-status]");
  var stars = 0;

  function paintStars() {
    var btns = starsRoot.querySelectorAll(".review-stars__btn");
    btns.forEach(function (b) {
      var n = Number(b.dataset.star);
      var on = n <= stars;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-checked", n === stars ? "true" : "false");
      b.tabIndex = n === (stars || 1) ? 0 : -1;
    });
    submit.disabled = !(stars >= 1 && stars <= 5);
  }
  paintStars();

  starsRoot.addEventListener("click", function (ev) {
    var b = ev.target.closest(".review-stars__btn");
    if (!b) return;
    stars = Number(b.dataset.star) || 0;
    paintStars();
  });
  starsRoot.addEventListener("keydown", function (ev) {
    if (ev.key === "ArrowRight" || ev.key === "ArrowUp") {
      stars = Math.min(5, (stars || 0) + 1); paintStars(); ev.preventDefault();
    } else if (ev.key === "ArrowLeft" || ev.key === "ArrowDown") {
      stars = Math.max(1, (stars || 1) - 1); paintStars(); ev.preventDefault();
    }
  });

  if (commentEl && counter) {
    var update = function () {
      var n = (commentEl.value || "").length;
      counter.textContent = n + " / 200";
    };
    commentEl.addEventListener("input", update);
    update();
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (submit.disabled) return;
    submit.disabled = true;
    status.textContent = "Posting…";
    status.dataset.state = "pending";

    fetch(apiBase + "/api/models/" + encodeURIComponent(slug) + "/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ stars: stars, comment: (commentEl && commentEl.value) || "" }),
    })
      .then(function (r) {
        if (r.status === 401) throw new Error("auth-required");
        if (!r.ok) throw new Error("post-failed:" + r.status);
        return r.json();
      })
      .then(function (body) {
        status.textContent = "Thanks! Your review is live.";
        status.dataset.state = "ok";
        // Patch rail rating.
        var rv = document.querySelector("[data-rail-rating]");
        var rc = document.querySelector("[data-rail-count]");
        if (rv && body.rating_avg != null) rv.textContent = (Math.round(body.rating_avg * 10) / 10).toFixed(1);
        if (rc && body.rating_count != null) rc.textContent = "(" + body.rating_count + ")";
        // Replace own row if present, else prepend.
        if (listRoot && body.review) {
          var existing = listRoot.querySelector('[data-review-id="' + body.review.id + '"]');
          var html = reviewHtml(body.review);
          if (existing) existing.outerHTML = html;
          else listRoot.insertAdjacentHTML("afterbegin", html);
        }
      })
      .catch(function (err) {
        status.dataset.state = "fail";
        status.textContent = err && err.message === "auth-required"
          ? "Sign in to post a review."
          : "Couldn't post — try again.";
      })
      .then(function () { submit.disabled = false; });
  });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }
})();
