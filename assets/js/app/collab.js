/* Collaboration + bounty board (task 218, wired to the service in task 311).
 *
 * The claim rules and the board's headline figures come from GeFi.collab,
 * the same module the mock server runs, so a claim the page refuses and one
 * the server refuses fail for the same reason in the same words. */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;
    var CO = GeFi.collab;

    /* Who this browser is on the board. The server keeps its own idea of
     * the caller; both use the same label so a claim made here is the claim
     * the server records. */
    var ME = "you";

    /* Surface an envelope error the way the API phrased it. Inventing our
     * own wording would mean the page and the server disagree about why
     * something was refused. */
    function reportError(err, fallbackText) {
      var msg = (err && err.body && err.body.message) || fallbackText;
      if (msg) app.toast(msg, { kind: "error" });
      return msg;
    }

    /* ---------------- collaboration ---------------- */
    var teamEl = document.querySelector("[data-cl-team]");
    if (teamEl) {
      var team = (D.devConsole.team || []).map(function (m, i) {
        return { id: m.id || "mem-" + (i + 1), name: m.name, role: m.role, kind: m.kind };
      });
      var messages = (D.devConsole.messages || []).map(function (m, i) {
        return { id: m.id || "msg-" + (i + 1), who: m.who, when: m.when, text: m.text };
      });
      var threadId = null;

      function renderTeam() {
        teamEl.innerHTML = "";
        team.forEach(function (m) {
          var li = document.createElement("li");
          li.className = "app-holding";
          li.setAttribute("data-cl-member", m.name);
          var av = document.createElement("span");
          av.className = "app-avatar";
          av.textContent = CO.initials(m.name);
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
          li.appendChild(app.chip(m.kind === "Owner" ? "deployed" : m.kind === "Invited" ? "pending" : "outline", m.kind));
          teamEl.appendChild(li);
        });
      }

      function renderMessages() {
        var el = document.querySelector("[data-cl-messages]");
        el.innerHTML = "";
        messages.forEach(function (m) {
          var li = document.createElement("li");
          li.className = "app-activity__row";
          li.setAttribute("data-cl-message", m.id);
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
      var inviteError = document.querySelector("[data-cl-invite-error]");
      document.querySelector("[data-cl-invite]").addEventListener("click", function () {
        inviteError.textContent = "";
        modal.hidden = false;
        modal.querySelector('input[name="name"]').focus();
      });
      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target.closest("[data-cl-modal-cancel]")) modal.hidden = true;
      });

      document.querySelector("[data-cl-invite-form]").addEventListener("submit", function (e) {
        e.preventDefault();
        var form = e.target;
        var spec = {
          name: form.elements.name.value.trim(),
          role: form.elements.role.value,
          email: form.elements.email.value.trim()
        };
        var why = CO.validateInvite(spec, team);
        if (why) {
          inviteError.textContent = why;
          return;
        }
        inviteError.textContent = "";
        GeFi.api.post("/teams/" + (teamIdOr("team-1")) + "/invites", spec).then(
          function (r) { addMember(r && r.id ? r : spec); },
          function (err) {
            var msg = err && err.body && err.body.message;
            if (msg) {
              inviteError.textContent = msg;
              return;
            }
            addMember(spec);
          }
        );

        function addMember(r) {
          team.push({ id: r.id || null, name: r.name || spec.name, role: r.role || spec.role, kind: r.kind || "Invited" });
          modal.hidden = true;
          form.reset();
          renderTeam();
          app.toast(spec.name + " was invited — nothing was emailed, this is a sample workspace.");
          var root = document.querySelector("[data-cl-root]");
          if (root) root.setAttribute("data-cl-invited", spec.name);
        }
      });

      function teamIdOr(fallback) {
        return window.__gefiTeamId || fallback;
      }

      document.querySelector("[data-cl-compose]").addEventListener("submit", function (e) {
        e.preventDefault();
        var form = e.target;
        var text = form.elements.text.value.trim();
        var why = CO.validateMessage(text);
        if (why) {
          app.toast(why, { kind: "error" });
          return;
        }
        var path = threadId ? "/threads/" + encodeURIComponent(threadId) + "/messages" : null;
        if (!path) {
          post({ id: null, who: "You", when: "just now", text: text });
          return;
        }
        GeFi.api.post(path, { text: text }).then(
          function (r) { post(r && r.id ? r : { who: "You", when: "just now", text: text }); },
          function (err) {
            reportError(err, null);
            post({ id: null, who: "You", when: "just now", text: text });
          }
        );

        function post(m) {
          messages.unshift({ id: m.id || "local-" + messages.length, who: m.who || "You", when: m.when || "just now", text: m.text || text });
          form.reset();
          renderMessages();
        }
      });

      renderTeam();
      renderMessages();

      /* Live, the team and the thread come from the service. The first
       * thread is the one the composer posts into, so a message written
       * here lands somewhere that survives a reload. */
      GeFi.api.get("/teams?limit=10").then(function (r) {
        if (!r || !r.items || !r.items.length || r.sample) return;
        window.__gefiTeamId = r.items[0].id;
        return GeFi.api.get("/teams/" + encodeURIComponent(r.items[0].id) + "/members?limit=50").then(function (m) {
          if (!m || !m.items || !m.items.length || m.sample) return;
          team = m.items.map(function (x) {
            return { id: x.id, name: x.name, role: x.role, kind: x.kind };
          });
          renderTeam();
        });
      }, function () {});

      GeFi.api.get("/threads?limit=10").then(function (r) {
        if (!r || !r.items || !r.items.length || r.sample) return;
        threadId = r.items[0].id;
        return GeFi.api.get("/threads/" + encodeURIComponent(threadId) + "/messages?limit=50").then(function (m) {
          if (!m || !m.items || !m.items.length || m.sample) return;
          messages = m.items.map(function (x) {
            return { id: x.id, who: x.who, when: x.when, text: x.text };
          });
          renderMessages();
        });
      }, function () {});
    }

    /* ---------------- bounty board ---------------- */
    var grid = document.querySelector("[data-bn-grid]");
    if (grid) {
      var bounties = (D.bounties || []).map(function (b) {
        return Object.assign({}, b, { claimedBy: b.claimedBy || null });
      });
      var state = { q: "", status: "", difficulty: "" };

      function renderKpis() {
        var el = document.querySelector("[data-bn-kpis]");
        /* Every figure is COUNTED from the board. The old page stated
         * "47 active developers" and "156 completed" as constants that no
         * row had to agree with. */
        var s = CO.boardStats(bounties);
        el.innerHTML = "";
        [
          { key: "active", label: "Active Bounties", value: String(s.active), sub: s.open + " open to claim", tone: "" },
          { key: "rewards", label: "Total Rewards", value: fmt.moneyFull(s.rewards), sub: "on bounties still in flight", tone: "is-up" },
          { key: "developers", label: "Active Developers", value: String(s.developers), sub: "with work claimed or delivered", tone: "" },
          { key: "completed", label: "Completed", value: String(s.completed), sub: fmt.moneyFull(s.paidOut) + " in rewards recorded", tone: "is-up" }
        ].forEach(function (k) {
          var card = document.createElement("div");
          card.className = "app-kpi";
          var l = document.createElement("p");
          l.className = "app-kpi__label";
          l.textContent = k.label;
          var v = document.createElement("p");
          v.className = "app-kpi__value";
          v.setAttribute("data-bn-kpi", k.key);
          v.textContent = k.value;
          var sub = document.createElement("p");
          sub.className = "app-kpi__sub " + k.tone;
          sub.textContent = k.sub;
          card.appendChild(l);
          card.appendChild(v);
          card.appendChild(sub);
          el.appendChild(card);
        });
      }

      function chipFor(status) {
        if (status === CO.OPEN) return "open";
        if (status === CO.CLAIMED) return "claimed";
        if (status === CO.COMPLETED) return "completed";
        return "pending";
      }

      function renderGrid() {
        grid.innerHTML = "";
        var empty = document.querySelector("[data-bn-empty]");
        empty.innerHTML = "";
        var rows = CO.filter(bounties, state);
        empty.hidden = rows.length > 0;
        if (!rows.length) {
          empty.appendChild(app.empty({ head: "No bounties match", hint: "Try adjusting your search filters" }));
        }
        rows.forEach(function (b) {
          var c = document.createElement("div");
          c.className = "app-gridcard";
          c.setAttribute("data-bn-card", b.id);
          c.setAttribute("data-bn-status", b.status);
          var chips = document.createElement("div");
          chips.className = "app-gridcard__chips";
          chips.appendChild(app.chip(chipFor(b.status), b.status));
          chips.appendChild(app.chip(b.difficulty));
          var title = document.createElement("p");
          title.className = "app-gridcard__title";
          title.textContent = b.title;
          var desc = document.createElement("p");
          desc.className = "app-gridcard__desc";
          desc.textContent = b.category + " · " + CO.plural(b.submissions, "submission") + " · due " + fmt.date(b.deadline);
          var reward = document.createElement("p");
          reward.className = "app-gridcard__statval";
          reward.style.color = "var(--app-green)";
          reward.style.fontSize = "18px";
          reward.textContent = fmt.moneyFull(b.reward);
          var tags = document.createElement("div");
          tags.className = "app-gridcard__tags";
          (b.skills || []).forEach(function (sk) { tags.appendChild(app.chip("outline", sk)); });
          var footer = document.createElement("div");
          footer.className = "app-gridcard__footer";
          var view = document.createElement("button");
          view.type = "button";
          view.className = "app-btn app-btn--ghost";
          view.textContent = "View Details";
          footer.appendChild(view);

          if (b.status === CO.OPEN) {
            var claim = document.createElement("button");
            claim.type = "button";
            claim.className = "app-btn app-btn--primary";
            claim.setAttribute("data-bn-claim", b.id);
            claim.textContent = "Claim";
            claim.addEventListener("click", function () { doClaim(b); });
            footer.appendChild(claim);
          } else if (b.claimedBy === ME && b.status !== CO.COMPLETED) {
            /* Someone who claimed the wrong bounty needs a way back, or
             * their single active claim is stuck forever. */
            var release = document.createElement("button");
            release.type = "button";
            release.className = "app-btn app-btn--ghost";
            release.setAttribute("data-bn-release", b.id);
            release.textContent = "Release claim";
            release.addEventListener("click", function () { doRelease(b); });
            footer.appendChild(release);
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

      function stamp(kind, value) {
        var root = document.querySelector("[data-bn-root]");
        if (root) root.setAttribute("data-bn-" + kind, value);
      }

      function doClaim(b) {
        /* Check the rule before asking, so a refusal reads the same whether
         * or not the API is reachable. */
        var why = CO.canClaim(b, bounties, ME);
        if (why) {
          app.toast(why, { kind: "error" });
          stamp("refused", why);
          return;
        }
        GeFi.api.post("/bounties/" + encodeURIComponent(b.id) + "/claim", {}).then(
          function (r) {
            b.status = (r && r.status) || CO.CLAIMED;
            b.claimedBy = (r && r.claimedBy) || ME;
            renderGrid();
            renderKpis();
            stamp("claimed", b.id);
            app.toast("You claimed " + b.title + ".");
          },
          function (err) {
            var msg = reportError(err, "could not claim " + b.title);
            stamp("refused", msg);
            refresh();
          }
        );
      }

      function doRelease(b) {
        GeFi.api.post("/bounties/" + encodeURIComponent(b.id) + "/release", {}).then(
          function (r) {
            b.status = (r && r.status) || CO.OPEN;
            b.claimedBy = null;
            renderGrid();
            renderKpis();
            stamp("released", b.id);
            app.toast("You released " + b.title + ".");
          },
          function (err) {
            reportError(err, "could not release " + b.title);
            refresh();
          }
        );
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
        state.difficulty = e.target.value;
        renderGrid();
      });

      function refresh() {
        return GeFi.api.get("/bounties?limit=100").then(function (r) {
          if (!r || !r.items || !r.items.length || r.sample) return;
          bounties = r.items;
          renderGrid();
          renderKpis();
        }, function () {});
      }

      renderKpis();
      renderGrid();
      refresh();
    }
  });
})(window, document);
