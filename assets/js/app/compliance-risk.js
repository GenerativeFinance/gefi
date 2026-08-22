/* Compliance Reports + Risk Analysis (task 227). One script, two pages.
 * KPI strips are computed from the same arrays the cards render, so the
 * counts are consistent by construction (the reference's "Overdue 6"
 * against 6 total reports was impossible; we show "Due This Week"
 * derived from real dates instead). */
(function (window, document) {
  "use strict";

  var TODAY = "2026-08-22";

  function daysUntil(iso) {
    var ms = new Date(iso + "T00:00:00Z") - new Date(TODAY + "T00:00:00Z");
    return Math.round(ms / 86400000);
  }

  function trapFocus(modalEl) {
    modalEl.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        modalEl.hidden = true;
        return;
      }
      if (e.key !== "Tab") return;
      var f = modalEl.querySelectorAll("button, [href], input, select, textarea");
      if (!f.length) return;
      var first = f[0];
      var last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    });
  }

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    function kpiCard(el, k) {
      var card = document.createElement("div");
      card.className = "app-kpi";
      var l = document.createElement("p");
      l.className = "app-kpi__label";
      l.textContent = k.label;
      var v = document.createElement("p");
      v.className = "app-kpi__value";
      if (k.color) v.style.color = k.color;
      v.textContent = k.value;
      var s = document.createElement("p");
      s.className = "app-kpi__sub";
      s.textContent = k.sub;
      card.appendChild(l);
      card.appendChild(v);
      card.appendChild(s);
      el.appendChild(card);
    }

    function stat(label, value, color) {
      var el = document.createElement("div");
      el.className = "app-gridcard__stat";
      var sl = document.createElement("span");
      sl.className = "app-gridcard__statlabel";
      sl.textContent = label;
      var sv = document.createElement("span");
      sv.className = "app-gridcard__statval";
      if (color) sv.style.color = color;
      sv.textContent = value;
      el.appendChild(sl);
      el.appendChild(sv);
      return el;
    }

    function copy(text, toastEl, okMsg) {
      function done(ok) {
        toastEl.textContent = ok ? okMsg : "Copy failed — clipboard unavailable.";
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    }

    /* ================= Compliance page ================= */
    var crGrid = document.querySelector("[data-cr-grid]");
    if (crGrid) {
      var crRows = D.complianceReports;
      var crState = { q: "", type: "", status: "", due: "" };
      var crToast = document.querySelector("[data-cr-toast]");
      var crModal = document.querySelector("[data-cr-modal]");
      trapFocus(crModal);

      var kpiEl = document.querySelector("[data-cr-kpis]");
      var compliant = crRows.filter(function (r) { return r.status === "Compliant"; }).length;
      var warnings = crRows.filter(function (r) { return r.status === "Warning"; }).length;
      var violations = crRows.filter(function (r) { return r.status === "Violation"; }).length;
      var dueSoon = crRows.filter(function (r) { return daysUntil(r.next) <= 7; }).length;
      [
        { label: "Total Reports", value: String(crRows.length), sub: "across regimes" },
        { label: "Compliant", value: String(compliant), sub: "no open findings blockers", color: "var(--app-green)" },
        { label: "Warnings", value: String(warnings), sub: "needs review", color: "var(--app-amber)" },
        { label: "Violations", value: String(violations), sub: "remediation running", color: "var(--app-red)" },
        { label: "Compliance Rate", value: Math.round((compliant / crRows.length) * 100) + "%", sub: compliant + " of " + crRows.length + " compliant", color: "var(--app-brand)" },
        { label: "Due This Week", value: String(dueSoon), sub: "reviews due ≤ 7 days", color: "var(--app-orange)" }
      ].forEach(function (k) { kpiCard(kpiEl, k); });

      var typeSel = document.querySelector("[data-cr-type]");
      crRows.map(function (r) { return r.category; }).filter(function (v, i, a) { return a.indexOf(v) === i; })
        .forEach(function (cat) {
          var o = document.createElement("option");
          o.value = cat;
          o.textContent = cat;
          typeSel.appendChild(o);
        });

      var crSummary = function (r) {
        return [
          "# SAMPLE DATA — GeFi compliance report " + r.id,
          r.title + " (" + r.category + ")",
          "Status: " + r.status + " · Risk: " + r.risk,
          "Regulations: " + r.regs.join(", "),
          "Coverage: " + r.coverage + "% · Findings: " + r.findings + " · Next review: " + fmt.date(r.next)
        ].join("\n");
      };

      var crVisible = function () {
        var q = crState.q.toLowerCase();
        return crRows.filter(function (r) {
          return (!q || r.title.toLowerCase().indexOf(q) !== -1 || r.regs.join(" ").toLowerCase().indexOf(q) !== -1) &&
            (!crState.type || r.category === crState.type) &&
            (!crState.status || r.status === crState.status) &&
            (!crState.due || daysUntil(r.next) <= parseInt(crState.due, 10));
        });
      };

      var renderCr = function () {
        var empty = document.querySelector("[data-cr-empty]");
        crGrid.innerHTML = "";
        empty.innerHTML = "";
        var rows = crVisible();
        empty.hidden = rows.length > 0;
        if (!rows.length) {
          empty.appendChild(app.empty({ head: "No reports match", hint: "Loosen the filters or search differently." }));
        }
        rows.forEach(function (r) {
          var c = document.createElement("div");
          c.className = "app-gridcard";
          var chips = document.createElement("div");
          chips.className = "app-gridcard__chips";
          chips.appendChild(app.chip(r.status.toLowerCase() === "compliant" ? "compliant" : r.status.toLowerCase() === "warning" ? "warning" : "overdue", r.status));
          chips.appendChild(app.chip("sev-" + r.risk.toLowerCase(), r.risk + " RISK"));
          c.appendChild(chips);
          var title = document.createElement("p");
          title.className = "app-gridcard__title";
          title.textContent = r.title;
          c.appendChild(title);
          var desc = document.createElement("p");
          desc.className = "app-gridcard__desc";
          desc.textContent = r.category + " · " + r.regs.length + " regulations in scope";
          c.appendChild(desc);
          var regsHead = document.createElement("p");
          regsHead.className = "app-gridcard__statlabel";
          regsHead.style.margin = "0";
          regsHead.textContent = "Regulations:";
          c.appendChild(regsHead);
          var tags = document.createElement("div");
          tags.className = "app-gridcard__tags";
          r.regs.forEach(function (reg) { tags.appendChild(app.chip("outline", reg)); });
          c.appendChild(tags);
          var stats = document.createElement("div");
          stats.className = "app-gridcard__stats";
          stats.style.gridTemplateColumns = "1fr 1fr 1fr";
          stats.appendChild(stat("Coverage", r.coverage + "%", "var(--app-brand)"));
          stats.appendChild(stat("Findings", String(r.findings), r.findings ? "var(--app-amber)" : ""));
          var nd = stat("Next Due", fmt.date(r.next), "");
          nd.querySelector(".app-gridcard__statval").setAttribute("data-cr-date", "");
          stats.appendChild(nd);
          c.appendChild(stats);
          var footer = document.createElement("div");
          footer.className = "app-gridcard__footer";
          footer.style.display = "flex";
          footer.style.gap = "8px";
          var view = document.createElement("button");
          view.type = "button";
          view.className = "app-btn app-btn--ghost";
          view.textContent = "View Details";
          view.addEventListener("click", function () {
            crModal.querySelector("[data-cr-modal-name]").textContent = r.id + " — " + r.title;
            var body = crModal.querySelector("[data-cr-modal-body]");
            body.innerHTML = "";
            [
              ["Category", r.category],
              ["Status", r.status + " · " + r.risk + " risk"],
              ["Regulations", r.regs.join(", ")],
              ["Coverage", r.coverage + "% of mapped controls"],
              ["Next review", fmt.date(r.next) + " (" + daysUntil(r.next) + " days)"]
            ].forEach(function (kv) {
              var dt = document.createElement("dt");
              dt.textContent = kv[0];
              var dd = document.createElement("dd");
              dd.textContent = kv[1];
              body.appendChild(dt);
              body.appendChild(dd);
            });
            var fEl = crModal.querySelector("[data-cr-modal-findings]");
            fEl.innerHTML = "";
            var fh = document.createElement("p");
            fh.className = "app-rowcard__collabel";
            fh.textContent = "Open findings (" + r.findings + ")";
            fEl.appendChild(fh);
            if (!r.findings) {
              var none = document.createElement("p");
              none.className = "app-kpi__sub";
              none.textContent = "None — last review closed clean.";
              fEl.appendChild(none);
            }
            for (var i = 1; i <= r.findings; i++) {
              var fp = document.createElement("p");
              fp.className = "app-kpi__sub";
              fp.textContent = r.id + "-F" + i + " · sample finding — evidence gap flagged by the " + r.regs[i % r.regs.length] + " control map.";
              fEl.appendChild(fp);
            }
            crModal.hidden = false;
            crModal.querySelector("[data-cr-modal-close]").focus();
          });
          var dl = document.createElement("button");
          dl.type = "button";
          dl.className = "app-btn app-btn--ghost";
          dl.textContent = "Download";
          dl.addEventListener("click", function () {
            copy(crSummary(r), crToast, "“" + r.title + "” copied — stamped SAMPLE in its header.");
          });
          footer.appendChild(view);
          footer.appendChild(dl);
          c.appendChild(footer);
          crGrid.appendChild(c);
        });
      };

      crModal.addEventListener("click", function (e) {
        if (e.target === crModal || e.target.closest("[data-cr-modal-close]")) crModal.hidden = true;
      });
      document.querySelector("[data-cr-search]").addEventListener("input", function (e) {
        crState.q = e.target.value;
        renderCr();
      });
      typeSel.addEventListener("change", function (e) { crState.type = e.target.value; renderCr(); });
      document.querySelector("[data-cr-status]").addEventListener("change", function (e) { crState.status = e.target.value; renderCr(); });
      document.querySelector("[data-cr-due]").addEventListener("change", function (e) { crState.due = e.target.value; renderCr(); });

      function crExportAll() {
        var rows = crVisible();
        copy(rows.map(crSummary).join("\n\n"), crToast, "Exported " + rows.length + " visible reports to the clipboard — stamped SAMPLE.");
      }
      var crHead = document.querySelector('.app-pagehead__actions a[href$="#export"]');
      if (crHead) crHead.addEventListener("click", crExportAll);
      if (window.location.hash === "#export") crExportAll();

      renderCr();
    }

    /* ================= Risk page ================= */
    var rrGrid = document.querySelector("[data-rr-grid]");
    if (rrGrid) {
      var rrRows = D.riskReports;
      var rrState = { q: "", type: "", sev: "" };
      var rrToast = document.querySelector("[data-rr-toast]");
      var rrModal = document.querySelector("[data-rr-modal]");
      trapFocus(rrModal);

      var SEV_COLOR = { Critical: "var(--app-red)", High: "var(--app-orange)", Medium: "var(--app-amber)", Low: "var(--app-green)" };
      var sevCount = function (s) {
        return rrRows.filter(function (r) { return r.severity === s; }).length;
      };
      var totalVar = rrRows.reduce(function (n, r) { return n + r.var95; }, 0);

      var rrKpis = document.querySelector("[data-rr-kpis]");
      [
        { label: "Total Reports", value: String(rrRows.length), sub: "risk dimensions covered" },
        { label: "Critical", value: String(sevCount("Critical")), sub: "act now", color: "var(--app-red)" },
        { label: "High", value: String(sevCount("High")), sub: "mitigation planned", color: "var(--app-orange)" },
        { label: "Medium", value: String(sevCount("Medium")), sub: "monitored", color: "var(--app-amber)" },
        { label: "Low", value: String(sevCount("Low")), sub: "within appetite", color: "var(--app-green)" },
        { label: "Total VaR (95%)", value: fmt.moneyFull(totalVar), sub: "sum across reports, 1-day", color: "var(--app-brand)" }
      ].forEach(function (k) { kpiCard(rrKpis, k); });

      var typeSel2 = document.querySelector("[data-rr-type]");
      rrRows.map(function (r) { return r.type; }).filter(function (v, i, a) { return a.indexOf(v) === i; })
        .forEach(function (t) {
          var o = document.createElement("option");
          o.value = t;
          o.textContent = t;
          typeSel2.appendChild(o);
        });

      var rrSummary = function (r) {
        return [
          "# SAMPLE DATA — GeFi risk report " + r.id,
          r.title + " (" + r.type + ")",
          "Severity: " + r.severity + " · Score: " + r.score + "/100 · Trend: " + fmt.signedPct(r.trendPct),
          "Confidence: " + r.confidence + "% · Exposure: " + fmt.moneyFull(r.exposure) + " · VaR(95): " + fmt.moneyFull(r.var95)
        ].join("\n");
      };

      var rrVisible = function () {
        var q = rrState.q.toLowerCase();
        return rrRows.filter(function (r) {
          return (!q || r.title.toLowerCase().indexOf(q) !== -1 || r.type.toLowerCase().indexOf(q) !== -1) &&
            (!rrState.type || r.type === rrState.type) &&
            (!rrState.sev || r.severity === rrState.sev);
        });
      };

      var renderRr = function () {
        var empty = document.querySelector("[data-rr-empty]");
        rrGrid.innerHTML = "";
        empty.innerHTML = "";
        var rows = rrVisible();
        empty.hidden = rows.length > 0;
        if (!rows.length) {
          empty.appendChild(app.empty({ head: "No reports match", hint: "Loosen the filters or search differently." }));
        }
        rows.forEach(function (r) {
          var c = document.createElement("div");
          c.className = "app-gridcard";
          var chips = document.createElement("div");
          chips.className = "app-gridcard__chips";
          chips.appendChild(app.chip("sev-" + r.severity.toLowerCase(), r.severity));
          chips.appendChild(app.chip("outline", r.type));
          var trend = document.createElement("span");
          trend.className = "mono " + (r.trendPct > 0 ? "is-down" : "is-up");
          trend.style.marginLeft = "auto";
          trend.style.fontSize = "12px";
          trend.textContent = fmt.signedPct(r.trendPct) + " vs last quarter";
          chips.appendChild(trend);
          c.appendChild(chips);
          var title = document.createElement("p");
          title.className = "app-gridcard__title";
          title.textContent = r.title;
          c.appendChild(title);
          var scoreLabel = document.createElement("p");
          scoreLabel.className = "app-gridcard__statlabel";
          scoreLabel.style.margin = "0";
          scoreLabel.textContent = "Risk Score " + r.score + "/100";
          c.appendChild(scoreLabel);
          var meter = document.createElement("div");
          meter.className = "app-meterrow";
          var track = document.createElement("div");
          track.className = "app-meter";
          var fill = document.createElement("div");
          fill.className = "app-meter__fill";
          fill.style.width = r.score + "%";
          fill.style.background = SEV_COLOR[r.severity];
          fill.setAttribute("data-rr-scorefill", "");
          track.appendChild(fill);
          var mval = document.createElement("span");
          mval.className = "app-meterrow__val mono";
          mval.textContent = r.score + "/100";
          meter.appendChild(track);
          meter.appendChild(mval);
          c.appendChild(meter);
          var stats = document.createElement("div");
          stats.className = "app-gridcard__stats";
          stats.style.gridTemplateColumns = "1fr 1fr 1fr";
          stats.appendChild(stat("Confidence", r.confidence + "%", ""));
          stats.appendChild(stat("Exposure", fmt.moneyFull(r.exposure), ""));
          stats.appendChild(stat("VaR (95%)", fmt.moneyFull(r.var95), "var(--app-brand)"));
          c.appendChild(stats);
          var footer = document.createElement("div");
          footer.className = "app-gridcard__footer";
          footer.style.display = "flex";
          footer.style.gap = "8px";
          var view = document.createElement("button");
          view.type = "button";
          view.className = "app-btn app-btn--ghost";
          view.textContent = "View Details";
          view.addEventListener("click", function () {
            rrModal.querySelector("[data-rr-modal-name]").textContent = r.id + " — " + r.title;
            var body = rrModal.querySelector("[data-rr-modal-body]");
            body.innerHTML = "";
            [
              ["Risk type", r.type],
              ["Severity", r.severity + " · score " + r.score + "/100"],
              ["Trend", fmt.signedPct(r.trendPct) + " vs last quarter (positive = risk rising)"],
              ["Model confidence", r.confidence + "%"],
              ["Exposure", fmt.moneyFull(r.exposure)],
              ["VaR (95%, 1-day)", fmt.moneyFull(r.var95)]
            ].forEach(function (kv) {
              var dt = document.createElement("dt");
              dt.textContent = kv[0];
              var dd = document.createElement("dd");
              dd.textContent = kv[1];
              body.appendChild(dt);
              body.appendChild(dd);
            });
            rrModal.hidden = false;
            rrModal.querySelector("[data-rr-modal-close]").focus();
          });
          var dl = document.createElement("button");
          dl.type = "button";
          dl.className = "app-btn app-btn--ghost";
          dl.textContent = "Download";
          dl.addEventListener("click", function () {
            copy(rrSummary(r), rrToast, "“" + r.title + "” copied — stamped SAMPLE in its header.");
          });
          footer.appendChild(view);
          footer.appendChild(dl);
          c.appendChild(footer);
          rrGrid.appendChild(c);
        });
      };

      rrModal.addEventListener("click", function (e) {
        if (e.target === rrModal || e.target.closest("[data-rr-modal-close]")) rrModal.hidden = true;
      });
      document.querySelector("[data-rr-search]").addEventListener("input", function (e) {
        rrState.q = e.target.value;
        renderRr();
      });
      typeSel2.addEventListener("change", function (e) { rrState.type = e.target.value; renderRr(); });
      document.querySelector("[data-rr-severity]").addEventListener("change", function (e) { rrState.sev = e.target.value; renderRr(); });

      function rrExportAll() {
        var rows = rrVisible();
        copy(rows.map(rrSummary).join("\n\n"), rrToast, "Exported " + rows.length + " visible reports to the clipboard — stamped SAMPLE.");
      }
      var rrHead = document.querySelector('.app-pagehead__actions a[href$="#export"]');
      if (rrHead) rrHead.addEventListener("click", rrExportAll);
      if (window.location.hash === "#export") rrExportAll();

      renderRr();
    }
  });
})(window, document);
