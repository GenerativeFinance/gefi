/* Developer ops: training / deployment / monitoring (task 217). */
(function (window, document) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var app = GeFi.app;

    var KEY = "gefi-app-dev-ops";
    function load() {
      try {
        var raw = sessionStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return { jobs: D.devConsole.jobs.map(function (j) { return Object.assign({}, j); }),
               deploys: D.devConsole.deployments.map(function (d) { return Object.assign({}, d); }) };
    }
    function save() {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(st));
      } catch (e) {}
    }
    var st = load();

    /* ---------------- training ---------------- */
    var tjList = document.querySelector("[data-tj-list]");
    if (tjList) {
      function renderJobs() {
        tjList.innerHTML = "";
        st.jobs.forEach(function (j) {
          var card = document.createElement("div");
          card.className = "app-rowcard";
          var main = document.createElement("div");
          main.className = "app-rowcard__main";
          var head = document.createElement("div");
          head.className = "app-rowcard__head";
          var title = document.createElement("p");
          title.className = "app-rowcard__title";
          title.textContent = j.name;
          var dur = document.createElement("span");
          dur.className = "app-rowcard__sub";
          dur.textContent = "Duration: " + j.duration;
          head.appendChild(title);
          head.appendChild(dur);
          head.appendChild(app.chip(j.status === "completed" ? "ok" : j.status === "running" ? "deployed" : j.status === "paused" ? "paused" : "draft", j.status));
          main.appendChild(head);
          var cols = document.createElement("div");
          cols.className = "app-rowcard__cols";
          [["Accuracy", j.accuracy ? j.accuracy + "%" : "—"], ["Loss", j.loss ? String(j.loss) : "—"]].forEach(function (c) {
            var col = document.createElement("div");
            col.className = "app-rowcard__col";
            var cl = document.createElement("span");
            cl.className = "app-rowcard__collabel";
            cl.textContent = c[0];
            var cv = document.createElement("span");
            cv.className = "app-rowcard__colval";
            cv.textContent = c[1];
            col.appendChild(cl);
            col.appendChild(cv);
            cols.appendChild(col);
          });
          main.appendChild(cols);
          var meter = document.createElement("div");
          meter.className = "app-meterrow";
          var lab = document.createElement("span");
          lab.className = "app-rowcard__collabel";
          lab.style.minWidth = "70px";
          lab.textContent = "Progress";
          var track = document.createElement("div");
          track.className = "app-meter";
          var fill = document.createElement("div");
          fill.className = "app-meter__fill";
          fill.style.width = j.progress + "%";
          track.appendChild(fill);
          var val = document.createElement("span");
          val.className = "app-meterrow__val";
          val.textContent = j.progress + "%";
          meter.appendChild(lab);
          meter.appendChild(track);
          meter.appendChild(val);
          main.appendChild(meter);

          var rail = document.createElement("div");
          rail.className = "app-rowcard__rail";
          if (j.status === "completed") {
            ["Download", "View Logs"].forEach(function (l) { rail.appendChild(ghost(l)); });
          } else if (j.status === "running") {
            var pause = ghost("Pause");
            pause.addEventListener("click", function () {
              j.status = "paused";
              save();
              renderJobs();
            });
            rail.appendChild(pause);
            rail.appendChild(ghost("View Logs"));
          } else if (j.status === "paused") {
            var resume = document.createElement("button");
            resume.type = "button";
            resume.className = "app-btn app-btn--primary";
            resume.textContent = "Resume";
            resume.addEventListener("click", function () {
              j.status = "running";
              save();
              renderJobs();
            });
            rail.appendChild(resume);
          } else {
            rail.appendChild(ghost("View Logs"));
          }
          card.appendChild(main);
          card.appendChild(rail);
          tjList.appendChild(card);
        });
      }
      function ghost(label) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "app-btn app-btn--ghost";
        b.textContent = label;
        return b;
      }

      var modal = document.querySelector("[data-tj-modal]");
      document.querySelector("[data-tj-new]").addEventListener("click", function () {
        modal.hidden = false;
      });
      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target.closest("[data-tj-modal-cancel]")) modal.hidden = true;
      });
      document.querySelector("[data-tj-form]").addEventListener("submit", function (e) {
        e.preventDefault();
        var f = e.target.elements;
        var err = document.querySelector("[data-tj-error]");
        var lr = parseFloat(f.lr.value);
        var batch = parseInt(f.batch.value, 10);
        var epochs = parseInt(f.epochs.value, 10);
        if (!(lr > 0 && lr <= 1)) {
          err.textContent = "Learning rate must be between 0 and 1.";
          return;
        }
        if (!(batch >= 1 && batch <= 4096)) {
          err.textContent = "Batch size must be between 1 and 4096.";
          return;
        }
        if (!(epochs >= 1 && epochs <= 10000)) {
          err.textContent = "Epochs must be between 1 and 10000.";
          return;
        }
        if (!f.method.value) {
          err.textContent = "Pick an optimization method.";
          return;
        }
        err.textContent = "";
        var job = {
          name: f.model.value.toLowerCase().replace(/\s+/g, "-") + " " + f.method.value.split(" ")[0].toLowerCase() + " run",
          duration: "0m",
          status: "running",
          accuracy: 0,
          loss: 0,
          progress: 0
        };
        st.jobs.unshift(job);
        save();
        modal.hidden = true;
        renderJobs();
        var rand = GeFi.seed.rng(GeFi.seed.hash("job|" + job.name + "|" + st.jobs.length));
        var timer = setInterval(function () {
          if (job.status === "paused") return;
          job.progress = Math.min(100, job.progress + 15 + Math.round(rand() * 10));
          job.accuracy = +(80 + (job.progress / 100) * (10 + rand() * 6)).toFixed(1);
          job.loss = +(0.4 - (job.progress / 100) * 0.33).toFixed(3);
          if (job.progress >= 100) {
            clearInterval(timer);
            job.status = "completed";
            job.duration = "2m";
          }
          save();
          renderJobs();
        }, 500);
      });

      renderJobs();
    }

    /* ---------------- deployment ---------------- */
    var dpList = document.querySelector("[data-dp-list]");
    if (dpList) {
      function renderDeploys() {
        dpList.innerHTML = "";
        st.deploys.forEach(function (d) {
          var card = document.createElement("div");
          card.className = "app-rowcard";
          var main = document.createElement("div");
          main.className = "app-rowcard__main";
          var head = document.createElement("div");
          head.className = "app-rowcard__head";
          var title = document.createElement("p");
          title.className = "app-rowcard__title mono";
          title.textContent = d.name;
          var env = document.createElement("span");
          env.className = "app-rowcard__sub";
          env.textContent = d.env + " Environment";
          head.appendChild(title);
          head.appendChild(env);
          head.appendChild(app.chip(d.status === "active" ? "deployed" : "draft", d.status));
          main.appendChild(head);
          var cols = document.createElement("div");
          cols.className = "app-rowcard__cols";
          [
            ["Uptime", d.status === "active" ? d.uptime + "%" : "0%", d.status === "active" ? "is-up" : ""],
            ["Requests", d.status === "active" ? d.requests : "0", ""],
            ["Latency", d.status === "active" ? d.latency : "0ms", ""],
            ["Last Deploy", GeFi.fmt.date(d.last), ""]
          ].forEach(function (c) {
            var col = document.createElement("div");
            col.className = "app-rowcard__col";
            var cl = document.createElement("span");
            cl.className = "app-rowcard__collabel";
            cl.textContent = c[0];
            var cv = document.createElement("span");
            cv.className = "app-rowcard__colval " + c[2];
            cv.textContent = c[1];
            col.appendChild(cl);
            col.appendChild(cv);
            cols.appendChild(col);
          });
          main.appendChild(cols);

          var rail = document.createElement("div");
          rail.className = "app-rowcard__rail";
          if (d.status === "active") {
            var stop = document.createElement("button");
            stop.type = "button";
            stop.className = "app-btn app-btn--ghost";
            stop.textContent = "Stop";
            stop.addEventListener("click", function () {
              d.status = "inactive";
              save();
              renderDeploys();
            });
            rail.appendChild(stop);
          } else {
            var start = document.createElement("button");
            start.type = "button";
            start.className = "app-btn app-btn--primary";
            start.textContent = "Start";
            start.addEventListener("click", function () {
              d.status = "active";
              save();
              renderDeploys();
            });
            rail.appendChild(start);
          }
          ["Configure", "Metrics", "Logs"].forEach(function (l) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "app-btn app-btn--ghost";
            b.textContent = l;
            rail.appendChild(b);
          });
          card.appendChild(main);
          card.appendChild(rail);
          dpList.appendChild(card);
        });
      }
      renderDeploys();
    }

    /* ---------------- monitoring ---------------- */
    var moBlocks = document.querySelector("[data-mo-blocks]");
    if (moBlocks) {
      var kpiEl = document.querySelector("[data-mo-kpis]");
      kpiEl.innerHTML = "";
      [
        { label: "System Health", value: "98.5%", sub: "all serving pools", tone: "is-up" },
        { label: "Active Models", value: st.deploys.filter(function (d) { return d.status === "active"; }).length + "/" + st.deploys.length, sub: "deployed", tone: "" },
        { label: "Avg Response", value: "43ms", sub: "p50, trailing hour", tone: "" }
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
        kpiEl.appendChild(card);
      });

      var refreshCount = 0;
      function metricsFor(name) {
        /* distinct per model AND per refresh — never the copy-paste twins */
        var rand = GeFi.seed.rng(GeFi.seed.hash("mo|" + name + "|" + refreshCount));
        return {
          accuracy: +(90 + rand() * 8).toFixed(1),
          response: Math.round(30 + rand() * 40),
          uptime: +(99 + rand()).toFixed(1),
          errors: +(rand() * 0.9).toFixed(2)
        };
      }

      var logsModal = document.querySelector("[data-mo-logs]");
      logsModal.addEventListener("click", function (e) {
        if (e.target === logsModal || e.target.closest("[data-mo-logs-close]")) logsModal.hidden = true;
      });

      function renderMonitoring() {
        moBlocks.innerHTML = "";
        st.deploys.filter(function (d) { return d.status === "active"; }).forEach(function (d) {
          var m = metricsFor(d.name);
          var block = document.createElement("div");
          block.className = "app-panel";
          block.style.marginBottom = "12px";
          var head = document.createElement("div");
          head.className = "app-rowcard__head";
          var dot = document.createElement("span");
          dot.className = "fedp-live";
          dot.setAttribute("aria-hidden", "true");
          var title = document.createElement("p");
          title.className = "app-rowcard__title mono";
          title.style.margin = "0";
          title.textContent = d.name;
          head.appendChild(dot);
          head.appendChild(title);
          head.appendChild(app.chip("outline", d.env));
          var refresh = document.createElement("button");
          refresh.type = "button";
          refresh.className = "app-btn app-btn--ghost";
          refresh.style.marginLeft = "auto";
          refresh.textContent = "Refresh";
          refresh.addEventListener("click", function () {
            refreshCount += 1;
            renderMonitoring();
          });
          var logs = document.createElement("button");
          logs.type = "button";
          logs.className = "app-btn app-btn--ghost";
          logs.textContent = "Logs";
          logs.addEventListener("click", function () {
            document.querySelector("[data-mo-logs-name]").textContent = d.name + " — recent log lines (sample)";
            var rand = GeFi.seed.rng(GeFi.seed.hash("logs|" + d.name));
            var lines = [];
            for (var i = 0; i < 8; i++) {
              lines.push("t-" + (8 - i) + "m  " + (rand() > 0.85 ? "WARN" : "INFO") + "  inference ok  " + Math.round(30 + rand() * 60) + "ms  run_" + Math.floor(rand() * 1e6).toString(16));
            }
            document.querySelector("[data-mo-logs-body]").textContent = lines.join("\n");
            logsModal.hidden = false;
          });
          head.appendChild(refresh);
          head.appendChild(logs);
          block.appendChild(head);

          [
            ["Prediction Accuracy", m.accuracy, m.accuracy + "% last 24h", ""],
            ["Response Time", (m.response / 80) * 100, m.response + "ms avg", ""],
            ["Uptime", m.uptime, m.uptime + "%", "app-meter--good"],
            ["Error Rate", (m.errors / 1) * 100, m.errors + "% errors", "app-meter--bad"]
          ].forEach(function (row) {
            var mr = document.createElement("div");
            mr.className = "app-meterrow";
            mr.style.marginTop = "10px";
            var lab = document.createElement("span");
            lab.className = "app-rowcard__collabel";
            lab.style.minWidth = "140px";
            lab.textContent = row[0];
            var track = document.createElement("div");
            track.className = "app-meter " + row[3];
            var fill = document.createElement("div");
            fill.className = "app-meter__fill";
            fill.style.width = Math.min(100, row[1]) + "%";
            track.appendChild(fill);
            var val = document.createElement("span");
            val.className = "app-meterrow__val";
            val.style.minWidth = "90px";
            val.textContent = row[2];
            mr.appendChild(lab);
            mr.appendChild(track);
            mr.appendChild(val);
            block.appendChild(mr);
          });
          moBlocks.appendChild(block);
        });
        if (!moBlocks.childNodes.length) {
          moBlocks.appendChild(app.empty({ head: "Nothing deployed", hint: "Start a deployment to see live telemetry.", cta: { label: "Go to Deployment", href: "/app/dev-deploy/" } }));
        }
      }
      renderMonitoring();
    }
  });
})(window, document);
