/* Custom Report Builder (task 228). Builder → My Reports → Templates.
 * Validation is inline per field; nothing lands in the list until the
 * form is actually valid. */
(function (window, document) {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var GeFi = window.GeFi;
    if (!GeFi || !GeFi.app) return;
    var app = GeFi.app;
    var form = document.querySelector("[data-crb-form]");
    if (!form) return;

    var KEY = "gefi-app-custom-reports";
    function load() {
      try {
        var raw = sessionStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return { reports: [] };
    }
    function save() {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(st));
      } catch (e) {}
    }
    var st = load();
    var editingId = null;
    var resetArmed = false;
    var status = document.querySelector("[data-crb-status]");
    var listStatus = document.querySelector("[data-crb-list-status]");

    var VIZ = ["Line Chart", "Bar Chart", "Pie Chart", "Data Table", "Heat Map", "Scatter Plot"];
    var vizEl = document.querySelector("[data-crb-viz]");
    VIZ.forEach(function (v) {
      var label = document.createElement("label");
      label.className = "app-mk-prefcat";
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.name = "viz";
      cb.value = v;
      label.appendChild(cb);
      label.append(" " + v);
      vizEl.appendChild(label);
    });

    function goSegment(key) {
      var btn = document.querySelector('[data-segment="' + key + '"]');
      if (btn) btn.click();
    }

    function checkedViz() {
      return Array.prototype.slice.call(form.querySelectorAll('input[name="viz"]:checked')).map(function (c) { return c.value; });
    }
    function setErr(field, msg) {
      document.querySelector('[data-crb-err="' + field + '"]').textContent = msg || "";
    }
    function clearErrs() {
      ["name", "type", "range", "viz"].forEach(function (f) { setErr(f, ""); });
    }
    function isDirty() {
      return !!(form.elements.name.value.trim() || form.elements.type.value || form.elements.desc.value.trim() ||
        form.elements.range.value || form.elements.schedule.value || checkedViz().length || form.elements.public.checked);
    }
    function clearForm() {
      form.reset();
      clearErrs();
      editingId = null;
      document.querySelector("[data-crb-submit]").textContent = "Create Report";
      resetArmed = false;
      document.querySelector("[data-crb-reset]").textContent = "Reset";
    }

    function fillForm(r) {
      form.elements.name.value = r.name;
      form.elements.type.value = r.type;
      form.elements.desc.value = r.desc || "";
      form.elements.range.value = r.range;
      form.elements.schedule.value = r.schedule || "";
      form.querySelectorAll('input[name="viz"]').forEach(function (cb) {
        cb.checked = r.viz.indexOf(cb.value) !== -1;
      });
      form.elements.public.checked = !!r.public;
      clearErrs();
    }

    /* ---- validation + create/save ---- */
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrs();
      var name = form.elements.name.value.trim();
      var type = form.elements.type.value;
      var range = form.elements.range.value;
      var viz = checkedViz();
      var firstBad = null;
      if (!name) {
        setErr("name", "Report name is required.");
        firstBad = firstBad || form.elements.name;
      }
      if (!type) {
        setErr("type", "Pick a report type.");
        firstBad = firstBad || form.elements.type;
      }
      if (!range) {
        setErr("range", "Pick a date range.");
        firstBad = firstBad || form.elements.range;
      }
      if (!viz.length) {
        setErr("viz", "Pick at least one visualization.");
        firstBad = firstBad || form.querySelector('input[name="viz"]');
      }
      if (firstBad) {
        status.textContent = "Fix the highlighted fields — nothing was created.";
        firstBad.focus();
        return;
      }
      var r = {
        id: editingId || "CR-U" + (st.reports.length + 1) + "-" + name.length,
        name: name,
        type: type,
        desc: form.elements.desc.value.trim(),
        range: range,
        schedule: form.elements.schedule.value,
        viz: viz,
        public: form.elements.public.checked,
        created: "2026-08-22",
        lastRun: null
      };
      if (editingId) {
        st.reports = st.reports.map(function (x) { return x.id === editingId ? r : x; });
      } else {
        st.reports.push(r);
      }
      save();
      var verb = editingId ? "saved" : "created";
      clearForm();
      renderList();
      goSegment("my");
      listStatus.textContent = "“" + r.name + "” " + verb + ".";
    });

    /* ---- reset with confirm-if-dirty ---- */
    document.querySelector("[data-crb-reset]").addEventListener("click", function (e) {
      if (isDirty() && !resetArmed) {
        resetArmed = true;
        e.target.textContent = "Confirm Reset";
        status.textContent = "The form has unsaved input — press “Confirm Reset” to clear it.";
        return;
      }
      clearForm();
      status.textContent = "Form cleared.";
    });
    form.addEventListener("input", function () {
      if (resetArmed) {
        resetArmed = false;
        document.querySelector("[data-crb-reset]").textContent = "Reset";
      }
    });

    /* ---- My Reports ---- */
    var delModal = document.querySelector("[data-crb-delete]");
    var delTarget = null;

    function renderList() {
      var el = document.querySelector("[data-crb-list]");
      var empty = document.querySelector("[data-crb-list-empty]");
      el.innerHTML = "";
      empty.innerHTML = "";
      empty.hidden = st.reports.length > 0;
      if (!st.reports.length) {
        empty.appendChild(app.empty({ head: "No custom reports yet", hint: "Build one in the Report Builder or start from a template." }));
        return;
      }
      st.reports.forEach(function (r) {
        var card = document.createElement("div");
        card.className = "app-rowcard";
        var main = document.createElement("div");
        main.className = "app-rowcard__main";
        var head = document.createElement("div");
        head.className = "app-rowcard__head";
        var title = document.createElement("p");
        title.className = "app-rowcard__title";
        title.textContent = r.name;
        var sub = document.createElement("span");
        sub.className = "app-rowcard__sub";
        sub.textContent = r.type + " · " + r.range + " · " + r.viz.length + " visualizations";
        head.appendChild(title);
        head.appendChild(sub);
        head.appendChild(app.chip("ok", r.lastRun ? "Ready · last run " + r.lastRun : "Ready"));
        if (r.schedule) head.appendChild(app.chip("info", r.schedule));
        if (r.public) head.appendChild(app.chip("outline", "Public"));
        main.appendChild(head);
        if (r.desc) {
          var desc = document.createElement("p");
          desc.className = "app-rowcard__sub";
          desc.style.margin = "6px 0 0";
          desc.textContent = r.desc;
          main.appendChild(desc);
        }
        var rail = document.createElement("div");
        rail.className = "app-rowcard__rail";
        var run = document.createElement("button");
        run.type = "button";
        run.className = "app-btn app-btn--primary";
        run.textContent = "Run";
        run.addEventListener("click", function () {
          r.lastRun = "just now";
          save();
          renderList();
          listStatus.textContent = "“" + r.name + "” ran against sample data — output lands in Reports.";
        });
        var edit = document.createElement("button");
        edit.type = "button";
        edit.className = "app-btn app-btn--ghost";
        edit.textContent = "Edit";
        edit.addEventListener("click", function () {
          editingId = r.id;
          fillForm(r);
          document.querySelector("[data-crb-submit]").textContent = "Save Changes";
          goSegment("builder");
          status.textContent = "Editing “" + r.name + "” — Save Changes updates the existing report.";
        });
        var del = document.createElement("button");
        del.type = "button";
        del.className = "app-btn app-btn--ghost";
        del.textContent = "Delete";
        del.addEventListener("click", function () {
          delTarget = r;
          delModal.querySelector("[data-crb-delete-name]").textContent = r.name;
          delModal.querySelector("[data-crb-delete-err]").textContent = "";
          delModal.querySelector('input[name="confirm"]').value = "";
          delModal.hidden = false;
          delModal.querySelector('input[name="confirm"]').focus();
        });
        rail.appendChild(run);
        rail.appendChild(edit);
        rail.appendChild(del);
        card.appendChild(main);
        card.appendChild(rail);
        el.appendChild(card);
      });
    }

    delModal.addEventListener("click", function (e) {
      if (e.target === delModal || e.target.closest("[data-crb-delete-cancel]")) delModal.hidden = true;
    });
    document.querySelector("[data-crb-delete-form]").addEventListener("submit", function (e) {
      e.preventDefault();
      if (!delTarget) return;
      var typed = e.target.elements.confirm.value.trim();
      if (typed !== delTarget.name) {
        delModal.querySelector("[data-crb-delete-err]").textContent = "Name doesn't match — nothing deleted.";
        return;
      }
      st.reports = st.reports.filter(function (x) { return x.id !== delTarget.id; });
      save();
      delModal.hidden = true;
      renderList();
      listStatus.textContent = "“" + delTarget.name + "” deleted.";
      delTarget = null;
    });

    /* ---- Templates ---- */
    var TEMPLATES = [
      { name: "Monthly Portfolio Review", type: "Performance", desc: "Returns, allocation drift and fees for the month.", range: "Last 30 days", schedule: "Monthly", viz: ["Line Chart", "Pie Chart", "Data Table"] },
      { name: "Risk Dashboard Pack", type: "Risk", desc: "VaR, drawdown, concentration and stress scenarios.", range: "Last quarter", schedule: "Weekly", viz: ["Heat Map", "Bar Chart", "Data Table"] },
      { name: "Client Quarterly Letter", type: "Client", desc: "Narrative summary with performance tables, LP-ready.", range: "Last quarter", schedule: "", viz: ["Line Chart", "Data Table"] }
    ];
    var tplEl = document.querySelector("[data-crb-templates]");
    TEMPLATES.forEach(function (t) {
      var c = document.createElement("div");
      c.className = "app-gridcard";
      var title = document.createElement("p");
      title.className = "app-gridcard__title";
      title.textContent = t.name;
      var desc = document.createElement("p");
      desc.className = "app-gridcard__desc";
      desc.textContent = t.desc;
      var meta = document.createElement("div");
      meta.className = "app-gridcard__tags";
      meta.appendChild(app.chip("outline", t.type));
      meta.appendChild(app.chip("outline", t.range));
      t.viz.forEach(function (v) { meta.appendChild(app.chip("outline", v)); });
      var footer = document.createElement("div");
      footer.className = "app-gridcard__footer";
      var use = document.createElement("button");
      use.type = "button";
      use.className = "app-btn app-btn--primary";
      use.textContent = "Use Template";
      use.addEventListener("click", function () {
        editingId = null;
        fillForm({ name: t.name, type: t.type, desc: t.desc, range: t.range, schedule: t.schedule, viz: t.viz, public: false });
        document.querySelector("[data-crb-submit]").textContent = "Create Report";
        goSegment("builder");
        status.textContent = "Template “" + t.name + "” loaded — adjust and create.";
      });
      footer.appendChild(use);
      c.appendChild(title);
      c.appendChild(desc);
      c.appendChild(meta);
      c.appendChild(footer);
      tplEl.appendChild(c);
    });

    /* ---- Export All ---- */
    function exportAll() {
      var text = ["# SAMPLE DATA — GeFi custom reports export"].concat(st.reports.map(function (r) {
        return r.name + " · " + r.type + " · " + r.range + (r.schedule ? " · " + r.schedule : "") + " · viz: " + r.viz.join(", ");
      })).join("\n");
      function done(ok) {
        listStatus.textContent = ok
          ? "Exported " + st.reports.length + " reports to the clipboard — stamped SAMPLE."
          : "Copy failed — clipboard unavailable.";
      }
      if (!st.reports.length) {
        listStatus.textContent = "Nothing to export yet — create a report first.";
        goSegment("my");
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
      goSegment("my");
    }
    var headLink = document.querySelector('.app-pagehead__actions a[href$="#export"]');
    if (headLink) headLink.addEventListener("click", exportAll);
    if (window.location.hash === "#export") exportAll();

    renderList();
  });
})(window, document);
