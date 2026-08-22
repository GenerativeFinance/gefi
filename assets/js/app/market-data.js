/* Market data catalog + preview stream (task 220). */
(function (window, document) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var app = GeFi.app;

    var selected = "us-stocks";
    var streaming = false;
    var streamTimer = null;
    var streamTick = 0;

    function renderKpis() {
      var el = document.querySelector("[data-md-kpis]");
      el.innerHTML = "";
      var s = D.marketData.sources;
      var active = s.filter(function (x) { return x.status === "Active"; }).length;
      var covered = s.filter(function (x) { return x.coverage > 0; });
      var avg = covered.reduce(function (n, x) { return n + x.coverage; }, 0) / covered.length;
      [
        { label: "Data Sources", value: String(s.length), sub: active + " real-time capable", tone: "" },
        { label: "Total Data Points", value: "10.9M", sub: "across sources", tone: "" },
        { label: "Real-time Sources", value: String(active + 1), sub: "streaming or near-live", tone: "is-up" },
        { label: "Avg Coverage", value: Math.round(avg) + "%", sub: "of listed universes", tone: "" }
      ].forEach(function (k) {
        var card = document.createElement("div");
        card.className = "app-kpi";
        var l = document.createElement("p");
        l.className = "app-kpi__label";
        l.textContent = k.label;
        var v = document.createElement("p");
        v.className = "app-kpi__value";
        v.textContent = k.value;
        var sb = document.createElement("p");
        sb.className = "app-kpi__sub " + k.tone;
        sb.textContent = k.sub;
        card.appendChild(l);
        card.appendChild(v);
        card.appendChild(sb);
        el.appendChild(card);
      });
    }

    function renderSources() {
      var grid = document.querySelector("[data-md-sources]");
      grid.innerHTML = "";
      D.marketData.sources.forEach(function (s) {
        var comingSoon = s.status === "Coming Soon";
        var c = document.createElement("div");
        c.className = "app-gridcard";
        c.style.cursor = comingSoon ? "not-allowed" : "pointer";
        if (s.key === selected) c.style.borderColor = "var(--app-brand)";
        if (comingSoon) c.title = "Not available yet — the pipeline is being built.";
        var chips = document.createElement("div");
        chips.className = "app-gridcard__chips";
        var title = document.createElement("p");
        title.className = "app-gridcard__title";
        title.style.margin = "0";
        title.textContent = s.name;
        chips.appendChild(title);
        chips.appendChild(app.chip(s.status === "Active" ? "active" : s.status === "Limited" ? "medium" : "coming-soon", s.status + (s.status === "Limited" ? " ⓘ" : "")));
        var stats = document.createElement("div");
        stats.className = "app-gridcard__stats";
        stats.style.gridTemplateColumns = "1fr 1fr";
        [["Coverage", s.coverage ? s.coverage + "%" : "—"], ["Data points", s.points], ["Range", s.range], ["Frequency", s.freq]].forEach(function (row) {
          var stEl = document.createElement("div");
          stEl.className = "app-gridcard__stat";
          var sl = document.createElement("span");
          sl.className = "app-gridcard__statlabel";
          sl.textContent = row[0];
          var sv = document.createElement("span");
          sv.className = "app-gridcard__statval";
          sv.textContent = row[1];
          stEl.appendChild(sl);
          stEl.appendChild(sv);
          stats.appendChild(stEl);
        });
        var tagsHead = document.createElement("p");
        tagsHead.className = "app-gridcard__statlabel";
        tagsHead.style.margin = "0";
        tagsHead.textContent = "Sample symbols";
        var tags = document.createElement("div");
        tags.className = "app-gridcard__tags";
        s.symbols.forEach(function (sym) { tags.appendChild(app.chip("outline", sym)); });
        c.appendChild(chips);
        c.appendChild(stats);
        c.appendChild(tagsHead);
        c.appendChild(tags);
        if (!comingSoon) {
          c.addEventListener("click", function () {
            selected = s.key;
            stopStream();
            renderSources();
            renderPreview(true);
            window.location.hash = "preview";
          });
        }
        grid.appendChild(c);
      });
    }

    function sampleRows(key, extra) {
      var src = D.marketData.sources.filter(function (s) { return s.key === key; })[0];
      var rand = GeFi.seed.rng(GeFi.seed.hash("mdrows|" + key + "|" + extra));
      var rows = [];
      for (var i = 0; i < 8; i++) {
        var sym = src.symbols[Math.floor(rand() * src.symbols.length)];
        rows.push({
          t: "t-" + (extra > 0 ? "live" : (8 - i) + "m"),
          sym: sym,
          px: (40 + rand() * 460).toFixed(2),
          vol: Math.round(1000 + rand() * 90000).toLocaleString("en-US")
        });
      }
      return rows;
    }

    function renderPreview(reset) {
      var src = D.marketData.sources.filter(function (s) { return s.key === selected; })[0];
      document.querySelector("[data-md-preview-title]").textContent = src.name + " — sample rows";
      var body = document.querySelector("[data-md-rows]");
      if (reset) body.innerHTML = "";
      if (!body.childNodes.length) {
        sampleRows(selected, 0).forEach(function (r) { body.appendChild(rowEl(r)); });
      }
    }

    function rowEl(r) {
      var tr = document.createElement("tr");
      [r.t, r.sym, "$" + r.px, r.vol].forEach(function (c) {
        var td = document.createElement("td");
        td.className = "is-mono";
        td.textContent = c;
        tr.appendChild(td);
      });
      return tr;
    }

    var streamBtn = document.querySelector("[data-md-stream]");
    var streamChip = document.querySelector("[data-md-streaming]");
    var status = document.querySelector("[data-md-status]");

    function stopStream() {
      streaming = false;
      if (streamTimer) clearInterval(streamTimer);
      streamChip.hidden = true;
      streamBtn.textContent = "Start Stream";
      streamBtn.className = "app-btn app-btn--primary";
    }

    streamBtn.addEventListener("click", function () {
      if (streaming) {
        stopStream();
        status.textContent = "Stream stopped.";
        return;
      }
      streaming = true;
      streamChip.hidden = false;
      streamBtn.textContent = "Stop Stream";
      streamBtn.className = "app-btn app-btn--ghost";
      status.textContent = "Streaming seeded sample ticks for " + selected + " — one row per second.";
      streamTimer = setInterval(function () {
        if (document.hidden) return;
        streamTick += 1;
        var body = document.querySelector("[data-md-rows]");
        var r = sampleRows(selected, streamTick)[0];
        body.insertBefore(rowEl(r), body.firstChild);
        while (body.childNodes.length > 20) body.removeChild(body.lastChild);
      }, 1000);
    });

    document.querySelector("[data-md-export]").addEventListener("click", function () {
      var rows = Array.prototype.map.call(document.querySelectorAll("[data-md-rows] tr"), function (tr) {
        return Array.prototype.map.call(tr.children, function (td) { return td.textContent; }).join(",");
      });
      var text = ["# SAMPLE DATA — GeFi market data export (" + selected + ")", "time,symbol,price,volume"].concat(rows).join("\n");
      function done(ok) {
        status.textContent = ok ? "CSV copied — stamped SAMPLE in its header." : "Copy failed — clipboard unavailable.";
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });

    renderKpis();
    renderSources();
    renderPreview(false);
  });
})(window, document);
