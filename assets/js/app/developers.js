/* Developers directory (task 215). */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var fmt = GeFi.fmt;
    var app = GeFi.app;

    /* map top-model names to real catalogue slugs where one exists */
    var SLUGS = {};
    (GeFi.MODELS || []).forEach(function (m) { SLUGS[m.name] = m.slug; });

    var state = { q: "", sort: "rating" };

    function initials(name) {
      return name.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
    }

    function renderKpis() {
      var el = document.querySelector("[data-dv-kpis]");
      el.innerHTML = "";
      var devs = D.developers;
      var verified = devs.filter(function (d) { return d.verified; }).length;
      var models = devs.reduce(function (n, d) { return n + d.models; }, 0);
      var revenue = devs.reduce(function (n, d) { return n + d.revenue; }, 0);
      [
        { label: "Total Developers", value: String(devs.length), sub: "on the marketplace", tone: "" },
        { label: "Verified Developers", value: String(verified), sub: devs.length - verified + " pending review", tone: "is-up" },
        { label: "AI Models Created", value: String(models), sub: "all developers", tone: "" },
        { label: "Revenue Generated", value: fmt.moneyFull(revenue), sub: "lifetime, sample", tone: "is-up" }
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

    var modal = document.querySelector("[data-dv-modal]");
    var lastFocus = null;

    function openProfile(d) {
      lastFocus = document.activeElement;
      document.querySelector("[data-dv-modal-name]").textContent = d.name + " " + (d.verified ? "· Verified" : "· Unverified");
      var body = document.querySelector("[data-dv-modal-body]");
      body.innerHTML = "";
      var dl = document.createElement("dl");
      dl.className = "app-kv";
      [
        ["Handle", d.handle],
        ["Location", d.location],
        ["Rating", "★ " + d.rating + " (" + d.reviews + " reviews)"],
        ["Models", String(d.models)],
        ["Subscribers", d.subscribers.toLocaleString("en-US")],
        ["Revenue", fmt.moneyFull(d.revenue)],
        ["Specialties", d.specialties.join(", ")],
        ["Joined", d.joined]
      ].forEach(function (row) {
        var div = document.createElement("div");
        var dt = document.createElement("dt");
        dt.textContent = row[0];
        var dd = document.createElement("dd");
        dd.className = "mono";
        dd.textContent = row[1];
        div.appendChild(dt);
        div.appendChild(dd);
        dl.appendChild(div);
      });
      body.appendChild(dl);
      modal.hidden = false;
      modal.querySelector("[data-dv-modal-close]").focus();
    }
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-dv-modal-close]")) {
        modal.hidden = true;
        if (lastFocus) lastFocus.focus();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) {
        modal.hidden = true;
        if (lastFocus) lastFocus.focus();
      }
      /* single-button dialog: keep Tab inside */
      if (e.key === "Tab" && !modal.hidden) {
        e.preventDefault();
        modal.querySelector("[data-dv-modal-close]").focus();
      }
    });

    function render() {
      var grid = document.querySelector("[data-dv-grid]");
      var empty = document.querySelector("[data-dv-empty]");
      grid.innerHTML = "";
      empty.innerHTML = "";
      var q = state.q.toLowerCase();
      var rows = D.developers.filter(function (d) {
        return !q || d.name.toLowerCase().indexOf(q) !== -1 ||
          d.handle.toLowerCase().indexOf(q) !== -1 ||
          d.specialties.join(" ").toLowerCase().indexOf(q) !== -1;
      }).sort(function (a, b) {
        if (state.sort === "models") return b.models - a.models;
        if (state.sort === "revenue") return b.revenue - a.revenue;
        return b.rating - a.rating;
      });
      empty.hidden = rows.length > 0;
      if (!rows.length) {
        empty.appendChild(app.empty({ head: "No developers match", hint: "Try a different name or specialty." }));
      }
      rows.forEach(function (d) {
        var c = document.createElement("div");
        c.className = "app-gridcard";
        var head = document.createElement("div");
        head.className = "app-dv-head";
        var av = document.createElement("span");
        av.className = "app-avatar";
        av.textContent = initials(d.name);
        var names = document.createElement("div");
        var nm = document.createElement("p");
        nm.className = "app-gridcard__title";
        nm.style.margin = "0";
        nm.textContent = d.name;
        var hd = document.createElement("p");
        hd.className = "app-kpi__sub mono";
        hd.style.margin = "0";
        hd.textContent = d.handle + " · " + d.location;
        names.appendChild(nm);
        names.appendChild(hd);
        head.appendChild(av);
        head.appendChild(names);
        if (d.verified) head.appendChild(app.chip("deployed", "Verified"));
        var rating = document.createElement("p");
        rating.className = "app-gridcard__desc";
        rating.innerHTML = "";
        rating.textContent = "★ " + d.rating + " (" + d.reviews + ") · joined " + d.joined;
        var stats = document.createElement("div");
        stats.className = "app-gridcard__stats";
        [["Models", String(d.models)], ["Subscribers", d.subscribers.toLocaleString("en-US")], ["Revenue", fmt.moneyFull(d.revenue)]].forEach(function (s) {
          var stEl = document.createElement("div");
          stEl.className = "app-gridcard__stat";
          var sl = document.createElement("span");
          sl.className = "app-gridcard__statlabel";
          sl.textContent = s[0];
          var sv = document.createElement("span");
          sv.className = "app-gridcard__statval";
          sv.textContent = s[1];
          stEl.appendChild(sl);
          stEl.appendChild(sv);
          stats.appendChild(stEl);
        });
        var tags = document.createElement("div");
        tags.className = "app-gridcard__tags";
        d.specialties.forEach(function (s) { tags.appendChild(app.chip("outline", s)); });
        var top = document.createElement("p");
        top.className = "app-gridcard__statlabel";
        top.style.margin = "4px 0 0";
        top.textContent = "Top models";
        var topList = document.createElement("div");
        topList.className = "app-gridcard__tags";
        d.top.forEach(function (name) {
          if (SLUGS[name]) {
            var a = document.createElement("a");
            a.className = "app-chip app-chip--outline";
            a.href = "/models/" + SLUGS[name] + "/";
            a.textContent = name;
            topList.appendChild(a);
          } else {
            topList.appendChild(app.chip("outline", name));
          }
        });
        var footer = document.createElement("div");
        footer.className = "app-gridcard__footer";
        var view = document.createElement("button");
        view.type = "button";
        view.className = "app-btn app-btn--ghost";
        view.textContent = "View Profile";
        view.addEventListener("click", function () { openProfile(d); });
        footer.appendChild(view);
        c.appendChild(head);
        c.appendChild(rating);
        c.appendChild(stats);
        c.appendChild(tags);
        c.appendChild(top);
        c.appendChild(topList);
        c.appendChild(footer);
        grid.appendChild(c);
      });
    }

    document.querySelector("[data-dv-search]").addEventListener("input", function (e) {
      state.q = e.target.value;
      render();
    });
    document.querySelector("[data-dv-sort]").addEventListener("change", function (e) {
      state.sort = e.target.value;
      render();
    });

    renderKpis();
    render();
  });
})(window, document);
