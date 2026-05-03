/* Sticky right-rail actions: share, subscribe stub, watchlist heart.
 * - Share uses navigator.share when available, else copies the URL.
 * - Subscribe opens a <dialog> stub explaining Phase 5+ Stripe wiring.
 * - Watchlist toggle is OPTIMISTIC: we flip the heart state immediately
 *   and POST to /api/favorites/toggle in the background. On failure or
 *   non-2xx we revert and surface a status message in the rail. */
(function () {
  "use strict";
  var rail = document.querySelector("[data-rail]");
  if (!rail) return;
  var apiBase = window.GEFI_API_BASE || "";
  var data = (function () {
    var el = document.getElementById("model-data");
    try { return el ? JSON.parse(el.textContent || "null") : null; }
    catch { return null; }
  })();
  var slug = data && data.slug;
  if (!slug) return;

  // ── Share ───────────────────────────────────────────────────────────
  var shareBtn = rail.querySelector("[data-share-btn]");
  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      var url = location.href;
      var title = (data && data.name) || document.title;
      if (navigator.share) {
        navigator.share({ title: title, url: url }).catch(function () {});
        return;
      }
      var nav = navigator;
      var copy = nav.clipboard && nav.clipboard.writeText
        ? nav.clipboard.writeText(url)
        : Promise.reject(new Error("no clipboard"));
      copy.then(function () { flashShare("Link copied"); })
          .catch(function () { flashShare("Copy failed"); });
    });
  }
  function flashShare(msg) {
    var prev = shareBtn.textContent;
    shareBtn.textContent = msg;
    setTimeout(function () { shareBtn.innerHTML = '<span aria-hidden="true">↗</span> Share'; }, 1500);
    void prev;
  }

  // ── Subscribe stub ──────────────────────────────────────────────────
  var subBtn = rail.querySelector("[data-subscribe-btn]");
  var subModal = document.querySelector("[data-subscribe-modal]");
  if (subBtn && subModal) {
    subBtn.addEventListener("click", function () {
      if (typeof subModal.showModal === "function") subModal.showModal();
      else subModal.setAttribute("open", "");
    });
  }

  // ── Favorite (watchlist) — optimistic toggle ────────────────────────
  var favBtn = rail.querySelector("[data-fav-btn]");
  if (!favBtn) return;
  var favLabel = favBtn.querySelector("[data-fav-label]");
  var heart = favBtn.querySelector(".model-rail__heart");
  var current = !!(data && data.favoritedByMe);
  paintFav(current);

  function paintFav(on) {
    favBtn.setAttribute("aria-pressed", on ? "true" : "false");
    favBtn.classList.toggle("is-favorited", on);
    if (heart) heart.textContent = on ? "♥" : "♡";
    if (favLabel) favLabel.textContent = on ? "On watchlist" : "Watchlist";
  }

  favBtn.addEventListener("click", function () {
    if (favBtn.disabled) return;
    var prev = current;
    current = !prev;
    paintFav(current); // optimistic
    favBtn.disabled = true;

    fetch(apiBase + "/api/favorites/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ slug: slug }),
    })
      .then(function (r) {
        if (r.status === 401) {
          throw new Error("auth-required");
        }
        if (!r.ok) throw new Error("toggle-failed:" + r.status);
        return r.json();
      })
      .then(function (body) {
        // Trust the server's source of truth.
        current = !!body.favorited;
        paintFav(current);
      })
      .catch(function (err) {
        // Roll back the optimistic flip.
        current = prev;
        paintFav(current);
        if (err && err.message === "auth-required") {
          flashFav("Sign in to save");
        } else {
          flashFav("Couldn't save — try again");
        }
      })
      .then(function () { favBtn.disabled = false; });
  });

  function flashFav(msg) {
    var prev = favLabel ? favLabel.textContent : "";
    if (favLabel) favLabel.textContent = msg;
    setTimeout(function () { if (favLabel) favLabel.textContent = prev; }, 2000);
  }
})();
