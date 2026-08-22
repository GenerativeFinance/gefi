/* Portfolio tabs: Holdings / Transactions / Watchlist (task 204).
 * One script, three branches — only the containers present render. */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    /* ---------------- holdings ---------------- */
    var hl = document.querySelector("[data-pf-holdings]");
    if (hl) {
      D.holdings.forEach(function (h) {
        var li = document.createElement("li");
        li.className = "app-holding";
        var tick = document.createElement("span");
        tick.className = "app-holding__ticker mono";
        tick.textContent = h.ticker;
        var main = document.createElement("div");
        main.className = "app-holding__main";
        var name = document.createElement("p");
        name.className = "app-holding__name";
        name.textContent = h.name;
        var sub = document.createElement("p");
        sub.className = "app-holding__sub";
        sub.textContent = h.weight.toFixed(1) + "% of portfolio";
        main.appendChild(name);
        main.appendChild(sub);
        var right = document.createElement("div");
        right.className = "app-holding__right";
        var ret = document.createElement("span");
        ret.className = "mono app-holding__ret " + (h.ret >= 0 ? "is-up" : "is-down");
        ret.textContent = fmt.signedPct(h.ret);
        var day = document.createElement("span");
        day.className = "mono app-holding__day " + (h.dayPct >= 0 ? "is-up" : "is-down");
        var arrow = h.dayPct >= 0 ? "↑ " : "↓ ";
        day.textContent = arrow + fmt.signedPct(h.dayPct) + " today";
        right.appendChild(ret);
        right.appendChild(day);
        li.appendChild(tick);
        li.appendChild(main);
        li.appendChild(right);
        hl.appendChild(li);
      });
    }

    /* ---------------- transactions ---------------- */
    var txBody = document.querySelector("[data-pf-tx]");
    if (txBody) {
      var search = document.querySelector("[data-pf-tx-search]");
      var typeSel = document.querySelector("[data-pf-tx-type]");
      var emptyEl = document.querySelector("[data-pf-tx-empty]");

      function renderTx() {
        var q = (search.value || "").toLowerCase();
        var kind = typeSel.value;
        var rows = D.transactions.filter(function (t) {
          return (!kind || t.kind === kind) &&
            (!q || t.asset.toLowerCase().indexOf(q) !== -1 || t.kind.indexOf(q) !== -1);
        });
        txBody.innerHTML = "";
        emptyEl.innerHTML = "";
        emptyEl.hidden = rows.length > 0;
        if (!rows.length) {
          emptyEl.appendChild(app.empty({ head: "No transactions match", hint: "Loosen the search or type filter." }));
        }
        rows.forEach(function (t) {
          var tr = document.createElement("tr");
          function td(content, cls) {
            var el = document.createElement("td");
            if (cls) el.className = cls;
            if (content instanceof Node) {
              el.appendChild(content);
            } else {
              el.textContent = content;
            }
            tr.appendChild(el);
          }
          td(fmt.date(t.date), "is-mono");
          td(app.chip(t.kind === "buy" ? "buy" : t.kind === "sell" ? "sell" : "info", t.kind));
          td(t.asset, "is-mono");
          td(t.qty == null ? "—" : String(t.qty), "is-mono");
          td(t.price == null ? "—" : "$" + t.price.toFixed(2), "is-mono");
          td(fmt.moneyFull(t.value), "is-mono");
          td(app.chip(t.status === "settled" ? "ok" : "pending", t.status));
          txBody.appendChild(tr);
        });
      }

      search.addEventListener("input", renderTx);
      typeSel.addEventListener("change", renderTx);
      renderTx();
    }

    /* ---------------- watchlist ---------------- */
    var wl = document.querySelector("[data-pf-watchlist]");
    if (wl) {
      var KEY = "gefi-app-watchlist";
      function loadStars() {
        try {
          var raw = sessionStorage.getItem(KEY);
          if (raw) return JSON.parse(raw);
        } catch (e) {}
        return ["NVDA", "SPY"];
      }
      function saveStars(list) {
        try {
          sessionStorage.setItem(KEY, JSON.stringify(list));
        } catch (e) {}
      }
      var stars = loadStars();

      D.watchlist.forEach(function (w) {
        var li = document.createElement("li");
        li.className = "app-holding";
        var star = document.createElement("button");
        star.type = "button";
        star.className = "app-star";
        star.setAttribute("data-star", w.ticker);
        function paintStar() {
          var on = stars.indexOf(w.ticker) !== -1;
          star.setAttribute("aria-pressed", on ? "true" : "false");
          star.setAttribute("aria-label", (on ? "Unstar " : "Star ") + w.ticker);
          star.textContent = on ? "★" : "☆";
          star.classList.toggle("is-on", on);
        }
        paintStar();
        star.addEventListener("click", function () {
          var starring = stars.indexOf(w.ticker) === -1;
          if (starring) stars.push(w.ticker);
          else stars = stars.filter(function (s) { return s !== w.ticker; });
          saveStars(stars);
          paintStar();
          /* Round-trip through the contract: starring adds the symbol to
           * the watchlist, unstarring removes it. Offline the resolver
           * answers locally, so the star behaves identically either way. */
          var call = starring
            ? GeFi.api.post("/watchlist", { ticker: w.ticker, name: w.name })
            : GeFi.api.del("/watchlist/" + encodeURIComponent(w.ticker));
          call.then(function () {
            star.setAttribute("data-star-synced", starring ? "added" : "removed");
          }, function () {
            /* 409 "already there" / 404 "not there" are both fine — the
             * local pin state is what the star shows. */
            star.setAttribute("data-star-synced", "noop");
          });
        });

        var tick = document.createElement("span");
        tick.className = "app-holding__ticker mono";
        tick.textContent = w.ticker;
        var main = document.createElement("div");
        main.className = "app-holding__main";
        var name = document.createElement("p");
        name.className = "app-holding__name";
        name.textContent = w.name;
        var sub = document.createElement("p");
        sub.className = "app-holding__sub";
        sub.appendChild(GeFi.svg.sparkline(w.spark, { label: w.ticker + " 24-hour trend" }));
        main.appendChild(name);
        main.appendChild(sub);
        var right = document.createElement("div");
        right.className = "app-holding__right";
        var px = document.createElement("span");
        px.className = "mono app-holding__ret";
        px.textContent = "$" + w.price.toFixed(2);
        var day = document.createElement("span");
        day.className = "mono app-holding__day " + (w.dayPct >= 0 ? "is-up" : "is-down");
        day.textContent = (w.dayPct >= 0 ? "↑ " : "↓ ") + fmt.signedPct(w.dayPct) + " today";
        right.appendChild(px);
        right.appendChild(day);
        li.appendChild(star);
        li.appendChild(tick);
        li.appendChild(main);
        li.appendChild(right);
        wl.appendChild(li);
      });
    }
  });
})(window, document);
