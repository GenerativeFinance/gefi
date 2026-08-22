/* Collaboration + bounty board (task 218). */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    /* ---------------- collaboration ---------------- */
    var teamEl = document.querySelector("[data-cl-team]");
    if (teamEl) {
      var CKEY = "gefi-app-collab";
      function loadC() {
        try {
          var raw = sessionStorage.getItem(CKEY);
          if (raw) return JSON.parse(raw);
        } catch (e) {}
        return { team: D.devConsole.team.slice(), messages: D.devConsole.messages.slice() };
      }
      function saveC() {
        try {
          sessionStorage.setItem(CKEY, JSON.stringify(cst));
        } catch (e) {}
      }
      var cst = loadC();

      function initials(name) {
        return name.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
      }

      function renderTeam() {
        teamEl.innerHTML = "";
        cst.team.forEach(function (m) {
          var li = document.createElement("li");
          li.className = "app-holding";
          var av = document.createElement("span");
          av.className = "app-avatar";
          av.textContent = initials(m.name);
          var main = document.createElement("div");
          main.className = "app-holding__main";
          var nm = document.createElement("p");
          nm.className = "app-holding__name";
          nm.textContent = m.name;
          var role = document.createElement("p");
          role.className = "app-holding__sub";
          role.textContent = m.role;
          main.appendChild(nm);
          main.appendChild(role);
          li.appendChild(av);
          li.appendChild(main);
          li.appendChild(app.chip(m.kind === "Owner" ? "deployed" : "outline", m.kind));
          teamEl.appendChild(li);
        });
      }

      function renderMessages() {
        var el = document.querySelector("[data-cl-messages]");
        el.innerHTML = "";
        cst.messages.forEach(function (m) {
          var li = document.createElement("li");
          li.className = "app-activity__row";
          var main = document.createElement("div");
          main.className = "app-activity__main";
          var head = document.createElement("p");
          head.className = "app-activity__title";
          head.textContent = m.who + " · " + m.when;
          var text = document.createElement("p");
          text.className = "app-activity__detail";
          text.textContent = m.text;
          main.appendChild(head);
          main.appendChild(text);
          li.appendChild(main);
          el.appendChild(li);
        });
      }

      var modal = document.querySelector("[data-cl-modal]");
      document.querySelector("[data-cl-invite]").addEventListener("click", function () {
        modal.hidden = false;
        modal.querySelector('input[name="name"]').focus();
      });
      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target.closest("[data-cl-modal-cancel]")) modal.hidden = true;
      });
      document.querySelector("[data-cl-invite-form]").addEventListener("submit", function (e) {
        e.preventDefault();
        var name = e.target.elements.name.value.trim();
        if (!name) return;
        cst.team.push({ name: name, role: e.target.elements.role.value, kind: "Invited" });
        saveC();
        modal.hidden = true;
        e.target.reset();
        renderTeam();
      });
      document.querySelector("[data-cl-compose]").addEventListener("submit", function (e) {
        e.preventDefault();
        var text = e.target.elements.text.value.trim();
        if (!text) return;
        cst.messages.unshift({ who: "You", when: "just now", text: text });
        saveC();
        e.target.reset();
        renderMessages();
      });

      renderTeam();
      renderMessages();
    }

    /* ---------------- bounty board ---------------- */
    var grid = document.querySelector("[data-bn-grid]");
    if (grid) {
      var BKEY = "gefi-app-bounties";
      function loadB() {
        try {
          var raw = sessionStorage.getItem(BKEY);
          if (raw) return JSON.parse(raw);
        } catch (e) {}
        return {};
      }
      function saveB() {
        try {
          sessionStorage.setItem(BKEY, JSON.stringify(claims));
        } catch (e) {}
      }
      var claims = loadB();
      var state = { q: "", status: "", level: "" };

      function statusOf(b) {
        return claims[b.id] ? "CLAIMED" : b.status;
      }

      function renderKpis() {
        var el = document.querySelector("[data-bn-kpis]");
        el.innerHTML = "";
        var rows = D.bounties;
        var open = rows.filter(function (b) { return statusOf(b) === "OPEN"; }).length;
        var rewards = rows.reduce(function (n, b) { return n + b.reward; }, 0);
        [
          { label: "Active Bounties", value: String(rows.length), sub: open + " open to claim", tone: "" },
          { label: "Total Rewards", value: fmt.moneyFull(rewards), sub: "on the board", tone: "is-up" },
          { label: "Active Developers", value: "47", sub: "building right now", tone: "" },
          { label: "Completed", value: "156", sub: "bounties paid out", tone: "is-up" }
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
      }

      function renderGrid() {
        grid.innerHTML = "";
        var empty = document.querySelector("[data-bn-empty]");
        empty.innerHTML = "";
        var q = state.q.toLowerCase();
        var rows = D.bounties.filter(function (b) {
          var s = statusOf(b);
          return (!state.status || s === state.status) &&
            (!state.level || b.difficulty === state.level) &&
            (!q || b.title.toLowerCase().indexOf(q) !== -1 || b.category.toLowerCase().indexOf(q) !== -1);
        });
        empty.hidden = rows.length > 0;
        if (!rows.length) {
          empty.appendChild(app.empty({ head: "No bounties match", hint: "Try adjusting your search filters" }));
        }
        rows.forEach(function (b) {
          var s = statusOf(b);
          var c = document.createElement("div");
          c.className = "app-gridcard";
          var chips = document.createElement("div");
          chips.className = "app-gridcard__chips";
          chips.appendChild(app.chip(s === "OPEN" ? "open" : s === "CLAIMED" ? "claimed" : "pending", s));
          chips.appendChild(app.chip(b.difficulty));
          var title = document.createElement("p");
          title.className = "app-gridcard__title";
          title.textContent = b.title;
          var desc = document.createElement("p");
          desc.className = "app-gridcard__desc";
          desc.textContent = b.category + " · " + b.submissions + (b.submissions === 1 ? " submission" : " submissions") + " · due " + fmt.date(b.deadline);
          var reward = document.createElement("p");
          reward.className = "app-gridcard__statval";
          reward.style.color = "var(--app-green)";
          reward.style.fontSize = "18px";
          reward.textContent = fmt.moneyFull(b.reward);
          var tags = document.createElement("div");
          tags.className = "app-gridcard__tags";
          b.skills.forEach(function (sk) { tags.appendChild(app.chip("outline", sk)); });
          var footer = document.createElement("div");
          footer.className = "app-gridcard__footer";
          var view = document.createElement("button");
          view.type = "button";
          view.className = "app-btn app-btn--ghost";
          view.textContent = "View Details";
          footer.appendChild(view);
          if (s === "OPEN") {
            var claim = document.createElement("button");
            claim.type = "button";
            claim.className = "app-btn app-btn--primary";
            claim.textContent = "Claim";
            claim.addEventListener("click", function () {
              claims[b.id] = true;
              saveB();
              renderGrid();
              renderKpis();
            });
            footer.appendChild(claim);
          }
          c.appendChild(chips);
          c.appendChild(title);
          c.appendChild(desc);
          c.appendChild(reward);
          c.appendChild(tags);
          c.appendChild(footer);
          grid.appendChild(c);
        });
      }

      document.querySelector("[data-bn-search]").addEventListener("input", function (e) {
        state.q = e.target.value;
        renderGrid();
      });
      document.querySelector("[data-bn-status]").addEventListener("change", function (e) {
        state.status = e.target.value;
        renderGrid();
      });
      document.querySelector("[data-bn-level]").addEventListener("change", function (e) {
        state.level = e.target.value;
        renderGrid();
      });

      renderKpis();
      renderGrid();
    }
  });
})(window, document);
