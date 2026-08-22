/* Regulator sub-pages (task 230): model audits, dataset audits, issues,
 * communications, standards — the five tabs that used to 404. One
 * script; each page activates its own branch. Shares sessionStorage
 * "gefi-app-regulator" with the Overview so resolved issues move both. */
(function (window, document) {
  "use strict";

  var TODAY = "2026-08-22";
  function daysUntil(iso) {
    return Math.round((new Date(iso + "T00:00:00Z") - new Date(TODAY + "T00:00:00Z")) / 86400000);
  }

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO || !GeFi.DEMO.regulator) return;
    var R = GeFi.DEMO.regulator;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    var KEY = "gefi-app-regulator";
    function load() {
      try {
        var raw = sessionStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return {};
    }
    function save() {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(st));
      } catch (e) {}
    }
    var st = load();
    st.extraActivity = st.extraActivity || [];
    st.resolvedIssues = st.resolvedIssues || [];

    function stamp(kind, value) {
      var root = document.querySelector("[data-rg-root]");
      if (root) root.setAttribute("data-rg-" + kind, value);
    }
    st.threadExtra = st.threadExtra || {};
    st.readThreads = st.readThreads || [];

    var STATUS_VOCAB = { "Scheduled": "pending", "In Progress": "info", "Completed": "ok" };

    /* ============ Model / dataset audit tables ============ */
    var raRoot = document.querySelector("[data-ra-root]");
    if (raRoot) {
      var kind = raRoot.getAttribute("data-ra-kind");
      var rows = kind === "model" ? R.modelAudits : R.datasetAudits;
      var raState = { q: "", status: "", sev: "" };
      var raModal = raRoot.querySelector("[data-ra-modal]");

      var openAudit = function (a) {
        raModal.querySelector("[data-ra-modal-name]").textContent = "#" + a.id + " — " + (a.model || a.dataset);
        var body = raModal.querySelector("[data-ra-modal-body]");
        body.innerHTML = "";
        var kv = [
          ["Organization", a.org],
          [kind === "model" ? "Audit type" : "License", kind === "model" ? a.type : a.license],
          ["Severity", a.severity],
          ["Status", a.status],
          ["Due", fmt.date(a.due)]
        ];
        if (kind === "dataset") {
          kv.push(["Coverage", a.coverage + "%"], ["PII flags", String(a.pii)]);
        }
        kv.forEach(function (pair) {
          var dt = document.createElement("dt");
          dt.textContent = pair[0];
          var dd = document.createElement("dd");
          dd.textContent = pair[1];
          body.appendChild(dt);
          body.appendChild(dd);
        });
        var fEl = raModal.querySelector("[data-ra-modal-findings]");
        fEl.innerHTML = "";
        a.findings.forEach(function (f) {
          var row = document.createElement("div");
          row.className = "app-ra-finding";
          var when = document.createElement("span");
          when.className = "mono";
          when.textContent = fmt.date(f.when);
          var text = document.createElement("span");
          text.textContent = f.text;
          row.appendChild(when);
          row.appendChild(text);
          fEl.appendChild(row);
        });
        raModal.hidden = false;
        raModal.querySelector("[data-ra-modal-close]").focus();
      };

      var renderTable = function () {
        var body = raRoot.querySelector("[data-ra-rows]");
        var empty = raRoot.querySelector("[data-ra-empty]");
        body.innerHTML = "";
        empty.innerHTML = "";
        var q = raState.q.toLowerCase();
        var visible = rows.filter(function (a) {
          var hay = (a.id + " " + (a.model || a.dataset) + " " + a.org).toLowerCase();
          return (!q || hay.indexOf(q) !== -1) &&
            (!raState.status || a.status === raState.status) &&
            (!raState.sev || a.severity === raState.sev);
        });
        empty.hidden = visible.length > 0;
        if (!visible.length) {
          empty.appendChild(app.empty({ head: "No audits match", hint: "Loosen the filters or search differently." }));
        }
        visible.forEach(function (a) {
          var tr = document.createElement("tr");
          var cells = kind === "model"
            ? [["#" + a.id, "is-mono"], [a.model, ""], [a.org, ""], [a.type, ""]]
            : [["#" + a.id, "is-mono"], [a.dataset, ""], [a.org, ""], [a.coverage + "%", "is-mono"], [String(a.pii), "is-mono"], [a.license, ""]];
          cells.forEach(function (c) {
            var td = document.createElement("td");
            td.className = c[1];
            td.textContent = c[0];
            tr.appendChild(td);
          });
          var sevTd = document.createElement("td");
          sevTd.appendChild(app.chip("sev-" + a.severity, a.severity));
          tr.appendChild(sevTd);
          var stTd = document.createElement("td");
          stTd.appendChild(app.chip(STATUS_VOCAB[a.status] || "neutral", a.status));
          tr.appendChild(stTd);
          var dueTd = document.createElement("td");
          dueTd.className = "is-mono";
          dueTd.textContent = fmt.date(a.due);
          tr.appendChild(dueTd);
          var actTd = document.createElement("td");
          var view = document.createElement("button");
          view.type = "button";
          view.className = "app-btn app-btn--ghost";
          view.textContent = "View";
          view.addEventListener("click", function () { openAudit(a); });
          actTd.appendChild(view);
          tr.appendChild(actTd);
          body.appendChild(tr);
        });
      };

      raModal.addEventListener("click", function (e) {
        if (e.target === raModal || e.target.closest("[data-ra-modal-close]")) raModal.hidden = true;
      });
      raRoot.querySelector("[data-ra-search]").addEventListener("input", function (e) {
        raState.q = e.target.value;
        renderTable();
      });
      raRoot.querySelector("[data-ra-status]").addEventListener("change", function (e) {
        raState.status = e.target.value;
        renderTable();
      });
      raRoot.querySelector("[data-ra-severity]").addEventListener("change", function (e) {
        raState.sev = e.target.value;
        renderTable();
      });

      renderTable();

      /* Cross-link: /app/reg-model-audits/#ML-3456 opens that audit */
      function followAuditHash() {
        var id = (window.location.hash || "").replace("#", "");
        var hit = rows.filter(function (a) { return a.id === id; })[0];
        if (hit) openAudit(hit);
      }
      followAuditHash();
      window.addEventListener("hashchange", followAuditHash);
    }

    /* ============ Compliance issues ============ */
    var riRoot = document.querySelector("[data-ri-root]");
    if (riRoot) {
      var toast = riRoot.querySelector("[data-ri-toast]");

      var openIssues = function () {
        return R.issues.filter(function (i) { return st.resolvedIssues.indexOf(i.id) === -1; });
      };
      var resolvedIssues = function () {
        return R.issues.filter(function (i) { return st.resolvedIssues.indexOf(i.id) !== -1; });
      };

      var renderIssueKpis = function () {
        var el = riRoot.querySelector("[data-ri-kpis]");
        el.innerHTML = "";
        var open = openIssues();
        var critical = open.filter(function (i) { return i.severity === "critical"; }).length;
        [
          { label: "Open Issues", value: String(open.length), sub: "across models + datasets", tone: "" },
          { label: "Critical", value: String(critical), sub: "act now", tone: "is-down" },
          { label: "Avg Resolution", value: R.avgResolutionDays + " days", sub: "open → closed", tone: "" },
          { label: "Resolved (30d)", value: String(R.resolved30d + resolvedIssues().length), sub: resolvedIssues().length + " this session", tone: "is-up" }
        ].forEach(function (k) {
          var card = document.createElement("div");
          card.className = "app-kpi";
          var l = document.createElement("p");
          l.className = "app-kpi__label";
          l.textContent = k.label;
          var v = document.createElement("p");
          v.className = "app-kpi__value";
          v.textContent = k.value;
          var s = document.createElement("p");
          s.className = "app-kpi__sub " + k.tone;
          s.textContent = k.sub;
          card.appendChild(l);
          card.appendChild(v);
          card.appendChild(s);
          el.appendChild(card);
        });
      };

      var issueCard = function (i, resolved) {
        var card = document.createElement("div");
        card.className = "app-rowcard";
        var main = document.createElement("div");
        main.className = "app-rowcard__main";
        var head = document.createElement("div");
        head.className = "app-rowcard__head";
        var title = document.createElement("p");
        title.className = "app-rowcard__title";
        title.textContent = i.id + " · " + i.title;
        head.appendChild(title);
        head.appendChild(app.chip(resolved ? "ok" : i.severity === "critical" ? "sev-critical" : i.severity, resolved ? "Resolved" : i.severity));
        main.appendChild(head);
        var meta = document.createElement("p");
        meta.className = "app-rowcard__sub";
        meta.style.margin = "6px 0 0";
        var link = document.createElement("a");
        link.href = (i.entityKind === "model" ? "/app/reg-model-audits/" : "/app/reg-dataset-audits/") + "#" + i.entity;
        link.className = "mono";
        link.setAttribute("data-ri-entity", "");
        link.textContent = "#" + i.entity;
        meta.appendChild(link);
        meta.append(" · assignee " + i.assignee + " · opened " + fmt.date(i.opened));
        main.appendChild(meta);
        if (!resolved) {
          var d = daysUntil(i.slaDue);
          var sla = document.createElement("p");
          sla.className = "app-kpi__sub mono";
          sla.setAttribute("data-ri-sla", d < 0 ? "overdue" : d <= 3 ? "close" : "ok");
          sla.style.margin = "6px 0 0";
          if (d < 0) {
            sla.style.color = "var(--app-red)";
            sla.textContent = "SLA overdue by " + Math.abs(d) + " day" + (Math.abs(d) === 1 ? "" : "s") + " (was due " + fmt.date(i.slaDue) + ")";
          } else if (d <= 3) {
            sla.style.color = "var(--app-amber)";
            sla.textContent = "SLA: " + d + " day" + (d === 1 ? "" : "s") + " left · due " + fmt.date(i.slaDue);
          } else {
            sla.textContent = "SLA: due " + fmt.date(i.slaDue) + " (" + d + " days)";
          }
          main.appendChild(sla);
        }
        card.appendChild(main);
        if (!resolved) {
          var rail = document.createElement("div");
          rail.className = "app-rowcard__rail";
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "app-btn app-btn--primary";
          btn.textContent = "Resolve";
          btn.setAttribute("data-ri-resolve", i.id);
          btn.addEventListener("click", function () {
            st.resolvedIssues.push(i.id);
            save();
            renderIssues();
            toast.textContent = i.id + " resolved — the Overview's flagged and critical counts moved with it.";
            stamp("resolved", i.id);
            /* Close it on the service too, so the Overview reads the same
             * after a reload rather than only in this tab. */
            GeFi.api.post("/regulator/issues/" + encodeURIComponent(i.id) + "/resolve", {}).then(
              function () {}, function () {}
            );
          });
          rail.appendChild(btn);
          card.appendChild(rail);
        }
        return card;
      };

      var renderIssues = function () {
        renderIssueKpis();
        var openEl = riRoot.querySelector("[data-ri-open]");
        var openEmpty = riRoot.querySelector("[data-ri-open-empty]");
        var resEl = riRoot.querySelector("[data-ri-resolved]");
        openEl.innerHTML = "";
        openEmpty.innerHTML = "";
        resEl.innerHTML = "";
        var open = openIssues();
        openEmpty.hidden = open.length > 0;
        if (!open.length) {
          openEmpty.appendChild(app.empty({ head: "No open issues", hint: "Everything flagged has been resolved — nice." }));
        }
        open.forEach(function (i) { openEl.appendChild(issueCard(i, false)); });
        resolvedIssues().forEach(function (i) { resEl.appendChild(issueCard(i, true)); });
        riRoot.querySelector("[data-ri-resolved-note]").textContent = resolvedIssues().length
          ? ""
          : "Nothing resolved this session yet — resolving an issue moves it here and updates the Overview counts.";
      };

      renderIssues();
    }

    /* ============ Communications ============ */
    var rcRoot = document.querySelector("[data-rc-root]");
    if (rcRoot) {
      var current = null;
      var status = rcRoot.querySelector("[data-rc-status]");

      var messagesOf = function (t) {
        return t.messages.concat(st.threadExtra[t.id] || []);
      };
      var isUnread = function (t) {
        return t.unread && st.readThreads.indexOf(t.id) === -1;
      };

      var renderThreads = function () {
        var list = rcRoot.querySelector("[data-rc-threads]");
        list.innerHTML = "";
        R.threads.forEach(function (t) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "app-comm__item" + (current === t.id ? " app-comm__item--active" : "");
          var org = document.createElement("span");
          org.className = "app-comm__org";
          if (isUnread(t)) {
            var dot = document.createElement("span");
            dot.className = "app-comm__dot";
            dot.setAttribute("aria-label", "Unread");
            org.appendChild(dot);
          }
          org.append(t.org);
          var subject = document.createElement("p");
          subject.className = "app-comm__subject";
          subject.textContent = t.subject;
          b.appendChild(org);
          b.appendChild(subject);
          b.addEventListener("click", function () { openThread(t.id); });
          list.appendChild(b);
        });
      };

      var renderMessages = function (t) {
        var el = rcRoot.querySelector("[data-rc-messages]");
        el.innerHTML = "";
        messagesOf(t).forEach(function (m) {
          var bubble = document.createElement("div");
          bubble.className = "app-comm__bubble" + (m.from === "you" ? " app-comm__bubble--you" : "");
          bubble.textContent = m.text;
          var when = document.createElement("span");
          when.className = "app-comm__when";
          when.textContent = (m.from === "you" ? "You · " : t.org + " · ") + m.when;
          bubble.appendChild(when);
          el.appendChild(bubble);
        });
      };

      var openThread = function (id) {
        current = id;
        var t = R.threads.filter(function (x) { return x.id === id; })[0];
        if (!t) return;
        if (st.readThreads.indexOf(id) === -1) {
          st.readThreads.push(id);
          save();
        }
        rcRoot.querySelector("[data-rc-title]").textContent = t.org;
        rcRoot.querySelector("[data-rc-subtitle]").textContent = t.subject;
        renderMessages(t);
        renderThreads();
      };

      rcRoot.querySelector("[data-rc-composer]").addEventListener("submit", function (e) {
        e.preventDefault();
        var text = e.target.elements.message.value.trim();
        if (!current) {
          status.textContent = "Pick a thread first.";
          return;
        }
        var why = GeFi.regulator.validateMessage(text);
        if (why) {
          status.textContent = why;
          return;
        }
        var thread = current;
        st.threadExtra[thread] = st.threadExtra[thread] || [];
        st.threadExtra[thread].push({ from: "you", text: text, when: "just now" });
        save();
        e.target.reset();
        openThread(thread);
        status.textContent = "Sent — logged to the supervisory record.";
        stamp("posted", thread);
        /* Persist to the supervisory record so the message is still there
         * after a reload; offline the local copy is all there is. */
        GeFi.api.post("/regulator/threads/" + encodeURIComponent(thread) + "/messages", { text: text }).then(
          function () {}, function () {}
        );
      });

      renderThreads();
      openThread(R.threads[0].id);

      function focusComposer() {
        rcRoot.querySelector('.app-comm__composer input').focus();
      }
      var headLink = document.querySelector('.app-pagehead__actions a[href$="#compose"]');
      if (headLink) headLink.addEventListener("click", focusComposer);
      if (window.location.hash === "#compose") focusComposer();
    }

    /* ============ Standards ============ */
    var rsRoot = document.querySelector("[data-rs-root]");
    if (rsRoot) {
      rsRoot.querySelector("[data-rs-note]").textContent =
        "Showing the " + R.standardsList.length + " most-referenced of " + R.standards + " active standards.";
      var grid = rsRoot.querySelector("[data-rs-grid]");
      R.standardsList.forEach(function (s, idx) {
        var c = document.createElement("div");
        c.className = "app-gridcard";
        var chips = document.createElement("div");
        chips.className = "app-gridcard__chips";
        chips.appendChild(app.chip(s.status === "Adopted" ? "ok" : "draft", s.status));
        chips.appendChild(app.chip("outline", "v" + s.version));
        c.appendChild(chips);
        var title = document.createElement("p");
        title.className = "app-gridcard__title";
        title.textContent = s.name;
        c.appendChild(title);
        var meta = document.createElement("p");
        meta.className = "app-gridcard__desc";
        meta.textContent = "Effective " + fmt.date(s.effective) + " · " + s.linkedAudits + " linked audits";
        c.appendChild(meta);
        var reqId = "rs-reqs-" + idx;
        var toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "app-btn app-btn--ghost";
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-controls", reqId);
        toggle.textContent = "View requirements (" + s.requirements.length + ")";
        var list = document.createElement("ul");
        list.className = "app-rs-reqs";
        list.id = reqId;
        list.hidden = true;
        s.requirements.forEach(function (rq) {
          var li = document.createElement("li");
          li.textContent = rq;
          list.appendChild(li);
        });
        toggle.addEventListener("click", function () {
          var open = list.hidden;
          list.hidden = !open;
          toggle.setAttribute("aria-expanded", open ? "true" : "false");
          toggle.textContent = (open ? "Hide" : "View") + " requirements (" + s.requirements.length + ")";
        });
        var footer = document.createElement("div");
        footer.className = "app-gridcard__footer";
        footer.appendChild(toggle);
        c.appendChild(footer);
        c.appendChild(list);
        grid.appendChild(c);
      });
    }
  });
})(window, document);
