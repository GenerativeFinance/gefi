/* Developer ops: training / deployment / monitoring (task 217, wired to the
 * service in task 310).
 *
 * The training progression, the hyperparameter bounds and the per-deployment
 * telemetry all come from GeFi.devOps, the same module the mock server runs,
 * so a job the server advanced and one advanced here report the same accuracy
 * and loss at the same step, and the meters read the same in both modes. */
(function (window, document) {
  "use strict";

  window.GeFi.api.page(function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.DEMO) return;
    var D = GeFi.DEMO;
    var app = GeFi.app;
    var OPS = GeFi.devOps;

    /* Jobs and deployments come from the service (hydrated live, seeded
     * offline). Accuracy, loss and telemetry are always derived, never
     * stored, so nothing can drift away from the bar being watched. */
    var jobs = (D.devConsole.jobs || []).map(function (j) {
      return { id: j.id || null, name: j.name, status: j.status, progress: j.progress };
    });
    var deploys = (D.devConsole.deployments || []).map(function (d) {
      return { id: d.id || null, name: d.name, env: d.env, status: d.status, last: d.last };
    });

    function jobView(j) {
      var m = OPS.jobMetrics(j.name, j.progress);
      return {
        accuracy: j.progress > 0 ? m.accuracy : 0,
        loss: j.progress > 0 ? m.loss : 0,
        duration: j.status === "completed" ? OPS.jobDuration(j.name) : j.progress > 0 ? "running" : "0m"
      };
    }

    function ghost(label) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "app-btn app-btn--ghost";
      b.textContent = label;
      return b;
    }

    /* ---------------- training ---------------- */
    var tjList = document.querySelector("[data-tj-list]");
    if (tjList) {
      function renderJobs() {
        tjList.innerHTML = "";
        jobs.forEach(function (j) {
          var view = jobView(j);
          var card = document.createElement("div");
          card.className = "app-rowcard";
          card.setAttribute("data-tj-card", j.name);
          var main = document.createElement("div");
          main.className = "app-rowcard__main";
          var head = document.createElement("div");
          head.className = "app-rowcard__head";
          var title = document.createElement("p");
          title.className = "app-rowcard__title";
          title.textContent = j.name;
          var dur = document.createElement("span");
          dur.className = "app-rowcard__sub";
          dur.textContent = "Duration: " + view.duration;
          head.appendChild(title);
          head.appendChild(dur);
          head.appendChild(app.chip(j.status === "completed" ? "ok" : j.status === "running" ? "deployed" : j.status === "paused" ? "paused" : "draft", j.status));
          main.appendChild(head);
          var cols = document.createElement("div");
          cols.className = "app-rowcard__cols";
          [["Accuracy", view.accuracy ? view.accuracy + "%" : "—"], ["Loss", view.loss ? String(view.loss) : "—"]].forEach(function (c) {
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
          val.setAttribute("data-tj-pct", "");
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
            pause.setAttribute("data-tj-pause", "");
            pause.addEventListener("click", function () {
              setJobState(j, "pause", "paused");
            });
            rail.appendChild(pause);
            rail.appendChild(ghost("View Logs"));
          } else if (j.status === "paused") {
            var resume = document.createElement("button");
            resume.type = "button";
            resume.className = "app-btn app-btn--primary";
            resume.setAttribute("data-tj-resume", "");
            resume.textContent = "Resume";
            resume.addEventListener("click", function () {
              setJobState(j, "resume", "running");
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

      /* Pause and resume are the server's decision when it is answering —
       * it is the one that knows whether the job is still running. Offline
       * the flip is local, and looks the same. */
      function setJobState(job, action, optimistic) {
        job.status = optimistic;
        renderJobs();
        if (!job.id) return;
        GeFi.api.post("/dev/training-jobs/" + encodeURIComponent(job.id) + "/" + action, {}).then(
          function (r) {
            if (r && r.status) job.status = r.status;
            renderJobs();
          },
          function () {}
        );
      }

      var modal = document.querySelector("[data-tj-modal]");
      var form = document.querySelector("[data-tj-form]");
      var err = document.querySelector("[data-tj-error]");
      var modelSel = document.querySelector("[data-tj-models]");
      var methodSel = document.querySelector("[data-tj-methods]");

      /* Render the form's options and input bounds from the engine, so the
       * dropdown cannot offer a method the server refuses and the inputs
       * cannot allow a value it rejects. Live, the same limits arrive from
       * /dev/hyperparameters and are asserted to agree. */
      function applyBounds(params, methods) {
        document.querySelectorAll("[data-tj-bound]").forEach(function (input) {
          var rule = params[input.getAttribute("data-tj-bound")];
          if (!rule) return;
          input.min = rule.min;
          input.max = rule.max;
        });
        methodSel.innerHTML = "";
        var blank = document.createElement("option");
        blank.value = "";
        blank.textContent = "Select method…";
        methodSel.appendChild(blank);
        methods.forEach(function (m) {
          var opt = document.createElement("option");
          opt.textContent = m;
          methodSel.appendChild(opt);
        });
      }
      applyBounds(OPS.HYPERPARAMS, OPS.METHODS);
      GeFi.api.get("/dev/hyperparameters").then(function (r) {
        if (r && r.params && r.methods) applyBounds(r.params, r.methods);
      }, function () {});

      (D.devConsole.models || []).forEach(function (m) {
        var opt = document.createElement("option");
        opt.textContent = m.name;
        modelSel.appendChild(opt);
      });

      document.querySelector("[data-tj-new]").addEventListener("click", function () {
        err.textContent = "";
        modal.hidden = false;
      });
      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target.closest("[data-tj-modal-cancel]")) modal.hidden = true;
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var f = e.target.elements;
        var spec = {
          model: f.model.value,
          lr: f.lr.value,
          batch: f.batch.value,
          epochs: f.epochs.value,
          method: f.method.value
        };
        /* Same rules the server applies, so an out-of-range value is refused
         * here in the same words rather than round-tripping to find out. */
        var why = OPS.validateJob(spec);
        if (why) {
          err.textContent = why;
          return;
        }
        err.textContent = "";
        GeFi.api.post("/dev/training-jobs", spec).then(
          function (r) { startJob(spec, r && r.id); },
          function (e2) {
            if (e2 && e2.httpStatus === 422 && e2.body && e2.body.message) {
              err.textContent = e2.body.message;
              modal.hidden = false;
              return;
            }
            startJob(spec, null);
          }
        );
      });

      function startJob(spec, serverId) {
        var job = { id: serverId || null, name: OPS.jobName(spec), status: "running", progress: 0 };
        jobs.unshift(job);
        modal.hidden = true;
        form.reset();
        applyBounds(OPS.HYPERPARAMS, OPS.METHODS);
        renderJobs();

        var steps = OPS.jobSteps(job.name);
        GeFi.api.stream(
          "/dev/training-jobs/" + encodeURIComponent(job.id || job.name) + "/events",
          function (name, data) {
            if (!data || typeof data.progress !== "number") return;
            if (job.status === "paused") return;
            job.progress = data.progress;
            if (data.progress >= 100) job.status = "completed";
            renderJobs();
            stamp(job);
          },
          {
            events: ["training.progress", "training.completed"],
            simulate: function (emit) {
              var i = 0;
              var timer = setInterval(function () {
                if (job.status === "paused") return;
                if (i >= steps.length) {
                  clearInterval(timer);
                  return;
                }
                var p = steps[i++];
                emit(p >= 100 ? "training.completed" : "training.progress", { id: job.name, progress: p });
                if (p >= 100) clearInterval(timer);
              }, 300);
              return function () { clearInterval(timer); };
            }
          }
        );
      }

      function stamp(job) {
        var root = document.querySelector("[data-tj-root]");
        if (root && job.status === "completed") root.setAttribute("data-tj-done", job.name);
      }

      renderJobs();
      GeFi.api.get("/dev/training-jobs?limit=50").then(function (r) {
        if (!r || !r.items || !r.items.length || r.sample) return;
        jobs = r.items.map(function (j) {
          return { id: j.id, name: j.name, status: j.status, progress: j.progress };
        });
        renderJobs();
      }, function () {});
    }

    /* ---------------- deployment ---------------- */
    var dpList = document.querySelector("[data-dp-list]");
    if (dpList) {
      function deployView(d) {
        /* A stopped deployment is serving nothing, so its live fields read
         * zero rather than the numbers it had when it was last up. */
        var t = OPS.telemetry(d.name, 0, d.status);
        return {
          uptime: t.serving ? t.uptime + "%" : "0%",
          requests: t.serving ? Math.round(t.requests / 1000) + "K" : "0",
          latency: t.serving ? t.response + "ms" : "0ms"
        };
      }

      function renderDeploys() {
        dpList.innerHTML = "";
        deploys.forEach(function (d) {
          var view = deployView(d);
          var card = document.createElement("div");
          card.className = "app-rowcard";
          card.setAttribute("data-dp-card", d.name);
          card.setAttribute("data-dp-status", d.status);
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
            ["Uptime", view.uptime, d.status === "active" ? "is-up" : ""],
            ["Requests", view.requests, ""],
            ["Latency", view.latency, ""],
            ["Last Deploy", GeFi.fmt.date(d.last), ""]
          ].forEach(function (c) {
            var col = document.createElement("div");
            col.className = "app-rowcard__col";
            var cl = document.createElement("span");
            cl.className = "app-rowcard__collabel";
            cl.textContent = c[0];
            var cv = document.createElement("span");
            cv.className = "app-rowcard__colval " + c[2];
            cv.setAttribute("data-dp-field", c[0].toLowerCase().replace(/\s+/g, "-"));
            cv.textContent = c[1];
            col.appendChild(cl);
            col.appendChild(cv);
            cols.appendChild(col);
          });
          main.appendChild(cols);

          var rail = document.createElement("div");
          rail.className = "app-rowcard__rail";
          var toggle = document.createElement("button");
          toggle.type = "button";
          toggle.className = "app-btn " + (d.status === "active" ? "app-btn--ghost" : "app-btn--primary");
          toggle.setAttribute("data-dp-toggle", d.name);
          toggle.textContent = d.status === "active" ? "Stop" : "Start";
          toggle.addEventListener("click", function () {
            d.status = d.status === "active" ? "inactive" : "active";
            renderDeploys();
            if (!d.id) return;
            GeFi.api.post("/dev/deployments/" + encodeURIComponent(d.id) + "/toggle", {}).then(
              function (r) {
                if (r && r.status) d.status = r.status;
                renderDeploys();
              },
              function () {}
            );
          });
          rail.appendChild(toggle);
          ["Configure", "Metrics", "Logs"].forEach(function (l) {
            rail.appendChild(ghost(l));
          });
          card.appendChild(main);
          card.appendChild(rail);
          dpList.appendChild(card);
        });
      }
      renderDeploys();
      GeFi.api.get("/dev/deployments?limit=50").then(function (r) {
        if (!r || !r.items || !r.items.length || r.sample) return;
        deploys = r.items.map(function (d) {
          return { id: d.id, name: d.name, env: d.env, status: d.status, last: d.last };
        });
        renderDeploys();
      }, function () {});
    }

    /* ---------------- monitoring ---------------- */
    var moBlocks = document.querySelector("[data-mo-blocks]");
    if (moBlocks) {
      var kpiEl = document.querySelector("[data-mo-kpis]");
      var refreshCount = 0;
      var telemetry = null; /* last server reading, when the API is answering */

      /* The fleet headline is MEASURED from the deployments that are
       * actually serving. Stating it as a constant, as this page used to,
       * lets the headline and the meters below it disagree. */
      function renderKpis() {
        var f = telemetry ? telemetry.fleet : OPS.fleet(deploys, refreshCount);
        kpiEl.innerHTML = "";
        [
          { label: "System Health", value: f.active ? f.health + "%" : "—", sub: f.active ? "across " + f.active + " serving pool" + (f.active === 1 ? "" : "s") : "nothing serving", tone: f.active ? "is-up" : "" },
          { label: "Active Models", value: f.active + "/" + f.total, sub: "deployed", tone: "" },
          { label: "Avg Response", value: f.active ? f.response + "ms" : "—", sub: f.active ? "mean across serving pools" : "nothing serving", tone: "" }
        ].forEach(function (k) {
          var card = document.createElement("div");
          card.className = "app-kpi";
          var l = document.createElement("p");
          l.className = "app-kpi__label";
          l.textContent = k.label;
          var v = document.createElement("p");
          v.className = "app-kpi__value";
          v.setAttribute("data-mo-kpi", k.label.toLowerCase().replace(/\s+/g, "-"));
          v.textContent = k.value;
          var s = document.createElement("p");
          s.className = "app-kpi__sub " + k.tone;
          s.textContent = k.sub;
          card.appendChild(l);
          card.appendChild(v);
          card.appendChild(s);
          kpiEl.appendChild(card);
        });
      }

      function metricsFor(d) {
        if (telemetry) {
          var hit = telemetry.items.filter(function (i) { return i.name === d.name; })[0];
          if (hit) return hit;
        }
        return OPS.telemetry(d.name, refreshCount, d.status);
      }

      var logsModal = document.querySelector("[data-mo-logs]");
      logsModal.addEventListener("click", function (e) {
        if (e.target === logsModal || e.target.closest("[data-mo-logs-close]")) logsModal.hidden = true;
      });

      function renderMonitoring() {
        renderKpis();
        moBlocks.innerHTML = "";
        deploys.filter(function (d) { return d.status === "active"; }).forEach(function (d) {
          var m = metricsFor(d);
          var block = document.createElement("div");
          block.className = "app-panel";
          block.style.marginBottom = "12px";
          block.setAttribute("data-mo-block", d.name);
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
          refresh.setAttribute("data-mo-refresh", "");
          refresh.textContent = "Refresh";
          refresh.addEventListener("click", function () {
            refreshCount += 1;
            pull();
          });
          var logs = document.createElement("button");
          logs.type = "button";
          logs.className = "app-btn app-btn--ghost";
          logs.textContent = "Logs";
          logs.addEventListener("click", function () {
            document.querySelector("[data-mo-logs-name]").textContent = d.name + " — recent log lines (sample)";
            var body = document.querySelector("[data-mo-logs-body]");
            body.textContent = OPS.logLines(d.name).join("\n");
            logsModal.hidden = false;
            if (!d.id) return;
            GeFi.api.get("/dev/deployments/" + encodeURIComponent(d.id) + "/logs").then(function (r) {
              if (r && r.lines) body.textContent = r.lines.join("\n");
            }, function () {});
          });
          head.appendChild(refresh);
          head.appendChild(logs);
          block.appendChild(head);

          [
            ["Prediction Accuracy", m.accuracy, m.accuracy + "% last 24h", "", "accuracy"],
            ["Response Time", (m.response / 80) * 100, m.response + "ms avg", "", "response"],
            ["Uptime", m.uptime, m.uptime + "%", "app-meter--good", "uptime"],
            ["Error Rate", m.errors * 100, m.errors + "% errors", "app-meter--bad", "errors"]
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
            val.setAttribute("data-mo-metric", row[4]);
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

      function pull() {
        GeFi.api.get("/dev/telemetry?refresh=" + refreshCount).then(
          function (r) {
            telemetry = r && r.items && !r.sample ? r : null;
            renderMonitoring();
          },
          function () {
            telemetry = null;
            renderMonitoring();
          }
        );
      }

      renderMonitoring();
      GeFi.api.get("/dev/deployments?limit=50").then(function (r) {
        if (r && r.items && r.items.length && !r.sample) {
          deploys = r.items.map(function (d) {
            return { id: d.id, name: d.name, env: d.env, status: d.status, last: d.last };
          });
        }
        pull();
      }, pull);
    }
  });
})(window, document);
