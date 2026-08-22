/* Reports & Insights (task 226) — the two reference pages that both
 * claimed this tab, merged. Every date renders through GeFi.fmt.date
 * (the ONE format), and the Investor Reports card derives from the same
 * category rows the library shows. */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var catsEl = document.querySelector("[data-rp-cats]");
    if (!catsEl) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;
    var RP = GeFi.reports;

    var KEY = "gefi-app-reports";
    function load() {
      try {
        var raw = sessionStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return { extra: [] };
    }
    function save() {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(st));
      } catch (e) {}
    }
    var st = load();
    var status = document.querySelector("[data-rp-status]");

    function rowsFor(cat) {
      return cat.rows.concat(st.extra.filter(function (r) { return r.cat === cat.key; }));
    }

    /* ---- Market insights (left panel) ---- */
    var M = D.reports.market;
    document.querySelector("[data-rp-sentiment]").textContent = M.sentimentPct + "% " + M.sentimentLabel;
    document.querySelector("[data-rp-sentiment-fill]").style.width = M.sentimentPct + "%";
    var usd = document.querySelector("[data-rp-usd]");
    usd.append(String(M.usd.value) + " ");
    var usdDelta = document.createElement("span");
    usdDelta.className = "is-up mono";
    usdDelta.textContent = fmt.signedPct(M.usd.changePct);
    usd.appendChild(usdDelta);
    document.querySelector("[data-rp-gdp]").textContent = M.gdp.value + "% · " + M.gdp.label;
    var fed = document.querySelector("[data-rp-fed]");
    var fedP = document.createElement("p");
    var fedStrong = document.createElement("strong");
    fedStrong.textContent = "Fed Decision Impact. ";
    fedP.appendChild(fedStrong);
    fedP.append("AI predicts " + M.fed.prediction + " · probability: " + M.fed.probability + "%. Prediction, not advice — sample data.");
    fed.appendChild(fedP);

    /* ---- Clipboard + toast ---- */
    function copy(text, okMsg) {
      function done(ok) {
        status.textContent = ok ? okMsg : "Copy failed — clipboard unavailable.";
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    }
    function reportText(catName, r) {
      return [
        "# SAMPLE DATA — GeFi report: " + r.name,
        "Category: " + catName,
        "Status: " + r.status,
        "Date: " + fmt.date(r.date),
        "",
        r.desc + "."
      ].join("\n");
    }

    /* ---- View modal ---- */
    var viewModal = document.querySelector("[data-rp-view]");
    function openView(catName, r) {
      viewModal.querySelector("[data-rp-view-name]").textContent = r.name;
      viewModal.querySelector("[data-rp-view-body]").textContent = reportText(catName, r) +
        "\n\nSummary: portfolio $142,500, YTD +8.6%, Sharpe 1.34.\nFull export lands via the audit-logged pipeline.";
      viewModal.hidden = false;
      viewModal.querySelector("[data-rp-view-close]").focus();
    }
    viewModal.addEventListener("click", function (e) {
      if (e.target === viewModal || e.target.closest("[data-rp-view-close]")) viewModal.hidden = true;
    });

    var EYE = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
    var DOWN = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>';

    /* ---- Category panels ---- */
    function renderCats() {
      catsEl.innerHTML = "";
      D.reports.categories.forEach(function (cat) {
        var panel = document.createElement("section");
        panel.className = "app-panel app-rp-cat app-rp-cat--" + cat.accent;
        var h = document.createElement("h3");
        h.className = "app-panel__title";
        h.textContent = cat.name;
        panel.appendChild(h);
        rowsFor(cat).forEach(function (r) {
          var row = document.createElement("div");
          row.className = "app-rp-row";
          var main = document.createElement("div");
          main.className = "app-rp-row__main";
          var name = document.createElement("p");
          name.className = "app-rp-row__name";
          name.textContent = r.name;
          var desc = document.createElement("p");
          desc.className = "app-rp-row__desc";
          desc.textContent = r.desc;
          main.appendChild(name);
          main.appendChild(desc);
          row.appendChild(main);
          row.appendChild(app.chip(r.status === "generated" ? "ok" : "pending", r.status === "generated" ? "Generated" : "Pending"));
          var date = document.createElement("span");
          date.className = "app-rp-row__date mono";
          date.setAttribute("data-rp-date", "");
          date.textContent = fmt.date(r.date);
          row.appendChild(date);
          var eye = document.createElement("button");
          eye.type = "button";
          eye.className = "app-btn app-btn--ghost app-btn--icon";
          eye.setAttribute("aria-label", "View " + r.name);
          eye.innerHTML = EYE;
          eye.addEventListener("click", function () { openView(cat.name, r); });
          row.appendChild(eye);
          var dl = document.createElement("button");
          dl.type = "button";
          dl.className = "app-btn app-btn--ghost app-btn--icon";
          dl.setAttribute("aria-label", "Download " + r.name);
          dl.innerHTML = DOWN;
          dl.addEventListener("click", function () {
            copy(reportText(cat.name, r), "“" + r.name + "” copied — stamped SAMPLE in its header.");
          });
          row.appendChild(dl);
          panel.appendChild(row);
        });
        catsEl.appendChild(panel);
      });
    }

    /* ---- Investor reports (right panel) — generated performance +
     * client rows, same objects as the library ---- */
    function renderInvestor() {
      var el = document.querySelector("[data-rp-investor]");
      el.innerHTML = "";
      D.reports.categories.filter(function (c) { return c.key === "performance" || c.key === "client"; })
        .forEach(function (cat) {
          rowsFor(cat).filter(function (r) { return r.status === "generated"; }).forEach(function (r) {
            var row = document.createElement("div");
            row.className = "app-rp-row";
            var main = document.createElement("div");
            main.className = "app-rp-row__main";
            var name = document.createElement("p");
            name.className = "app-rp-row__name";
            name.textContent = r.name;
            var date = document.createElement("p");
            date.className = "app-rp-row__desc mono";
            date.setAttribute("data-rp-date", "");
            date.textContent = fmt.date(r.date);
            main.appendChild(name);
            main.appendChild(date);
            row.appendChild(main);
            row.appendChild(app.chip("ok", "Ready"));
            var dl = document.createElement("button");
            dl.type = "button";
            dl.className = "app-btn app-btn--ghost";
            dl.textContent = "Download";
            dl.addEventListener("click", function () {
              copy(reportText(cat.name, r), "“" + r.name + "” copied — stamped SAMPLE in its header.");
            });
            row.appendChild(dl);
            el.appendChild(row);
          });
        });
    }

    /* ---- Generate modal ---- */
    var modal = document.querySelector("[data-rp-modal]");
    var catSel = modal.querySelector("[data-rp-modal-cats]");
    D.reports.categories.forEach(function (cat) {
      var o = document.createElement("option");
      o.value = cat.key;
      o.textContent = cat.name;
      catSel.appendChild(o);
    });
    function openGenerate(catKey) {
      if (catKey) catSel.value = catKey;
      modal.hidden = false;
      catSel.focus();
    }
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-rp-modal-cancel]")) modal.hidden = true;
    });
    document.querySelector("[data-rp-generate]").addEventListener("click", function () { openGenerate(); });
    var headLink = document.querySelector('.app-pagehead__actions a[href$="#generate"]');
    if (headLink) headLink.addEventListener("click", function () { openGenerate(); });
    if (window.location.hash === "#generate") openGenerate();
    window.addEventListener("hashchange", function () {
      if (window.location.hash === "#generate") openGenerate();
    });
    document.querySelector("[data-rp-form]").addEventListener("submit", function (e) {
      e.preventDefault();
      var catKey = e.target.elements.category.value;
      var period = e.target.elements.period.value;
      var cat = D.reports.categories.filter(function (c) { return c.key === catKey; })[0];
      var r = {
        cat: catKey,
        name: period + " " + cat.name.replace(/ Reports?$/, "") + " Report (custom)",
        desc: "Queued from the report builder — " + period.toLowerCase() + " period",
        status: "pending",
        date: "2026-08-22"
      };
      /* The service decides when a report is ready; the page must not
       * declare it generated on a timer of its own. */
      var why = RP.validateGenerate({ category: catKey, period: period }, D.reports.categories);
      if (why) {
        status.textContent = why;
        return;
      }
      st.extra.push(r);
      save();
      modal.hidden = true;
      renderCats();
      renderInvestor();
      status.textContent = "\u201c" + r.name + "\u201d queued as Pending.";
      stamp("pending", r.name);

      GeFi.api.post("/reports/generate", { category: catKey, period: period }).then(
        function (resp) { follow(resp && resp.id ? resp.id : null); },
        function () { follow(null); }
      );

      function follow(id) {
        if (id) r.id = id;
        var done = false;
        function finish(row) {
          if (done) return;
          done = true;
          r.status = (row && row.status) || "generated";
          save();
          renderCats();
          renderInvestor();
          status.textContent = "\u201c" + r.name + "\u201d is generated and ready to download.";
          stamp("generated", r.name);
        }
        if (!id) {
          /* No service answering: the same wait, applied locally. */
          setTimeout(function () { finish(null); }, 1500);
          return;
        }
        var stream = GeFi.api.stream(
          "/reports/" + encodeURIComponent(id) + "/events",
          function (name, data) {
            if (name === "report.generated") {
              finish(data);
              if (stream && stream.close) stream.close();
            }
          },
          {
            events: ["report.generated"],
            simulate: function (emit) {
              var t = setTimeout(function () { emit("report.generated", null); }, 1500);
              return function () { clearTimeout(t); };
            }
          }
        );
        /* Belt and braces: if the stream never lands, poll once. */
        setTimeout(function () {
          if (done) return;
          GeFi.api.get("/reports/" + encodeURIComponent(id)).then(function (row) {
            if (row && row.status === "generated") finish(row);
          }, function () {});
        }, 4000);
      }
    });

    function stamp(kind, name) {
      var root = document.querySelector("[data-rp-root]");
      if (root) root.setAttribute("data-rp-" + kind, name);
    }

    /* ---- Quick actions ---- */
    var quick = document.querySelector("[data-rp-quick]");
    [
      { title: "Monthly Performance", desc: "Queue this month's performance pack", cat: "performance" },
      { title: "Risk Analysis", desc: "VaR, drawdown and stress summary", cat: "risk" },
      { title: "Client Summary", desc: "One-pager per mandate", cat: "client" }
    ].forEach(function (q) {
      var t = document.createElement("button");
      t.type = "button";
      t.className = "app-tile";
      var tt = document.createElement("span");
      tt.className = "app-tile__title";
      tt.textContent = q.title;
      var td = document.createElement("span");
      td.className = "app-tile__desc";
      td.textContent = q.desc;
      t.appendChild(tt);
      t.appendChild(td);
      t.addEventListener("click", function () { openGenerate(q.cat); });
      quick.appendChild(t);
    });

    renderCats();
    renderInvestor();
  });
})(window, document);
