/**
 * Playground shell — orchestrates the four tabs, the SchemaForm on Try,
 * the Run button + status pill on the right rail, and the result panel.
 *
 * Hydrates from `/_data/models/<slug>.json` (already on disk via the
 * generate-data step). Calls `POST {API_BASE}/api/playground/<slug>/run`
 * on Run with the SchemaForm's current value.
 *
 * Pure vanilla JS — no bundler. Dependencies it expects on `window`:
 *   - GEFI_API_BASE (set in default.html)
 *   - GefiSchemaForm.create (assets/js/schema-form.js)
 */
(function () {
  "use strict";
  const root = document.querySelector("[data-slug].playground");
  if (!root) return;

  const slug = root.dataset.slug;
  const apiBase = (window.GEFI_API_BASE || "").replace(/\/+$/, "");
  if (!window.GefiSchemaForm || !window.GefiSchemaForm.create) {
    console.warn("[playground] schema-form.js not loaded — Try tab disabled");
    return;
  }

  const tabs = root.querySelectorAll("[data-pg-tabs] [role=tab]");
  const panels = root.querySelectorAll("[role=tabpanel]");
  const runBtn = root.querySelector("[data-pg-run]");
  const runLabel = root.querySelector("[data-pg-run-label]");
  const statusEl = root.querySelector("[data-pg-status]");
  const statusLabel = root.querySelector("[data-pg-status-label]");
  const formHost = root.querySelector("[data-pg-form-fields]");
  const trainHost = root.querySelector("[data-pg-train]");
  const resultHost = root.querySelector("[data-pg-result]");
  const resultMeta = root.querySelector("[data-pg-result-meta]");
  const resultBody = root.querySelector("[data-pg-result-body]");
  const errorEl = root.querySelector("[data-pg-error]");

  // ── Tab switching ──────────────────────────────────────────────────────
  function activate(tabName) {
    tabs.forEach((t) => {
      const active = t.dataset.tab === tabName;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
      t.tabIndex = active ? 0 : -1;
    });
    panels.forEach((p) => {
      const id = p.id || "";
      const active = id === "pgpanel-" + tabName;
      p.hidden = !active;
    });
  }
  tabs.forEach((t) => {
    t.addEventListener("click", () => {
      activate(t.dataset.tab);
      try { history.replaceState(null, "", "#" + t.dataset.tab); } catch (e) {}
    });
    t.addEventListener("keydown", (e) => {
      const list = Array.prototype.slice.call(tabs);
      const i = list.indexOf(t);
      if (e.key === "ArrowRight") { list[(i + 1) % list.length].focus(); list[(i + 1) % list.length].click(); }
      if (e.key === "ArrowLeft")  { list[(i - 1 + list.length) % list.length].focus(); list[(i - 1 + list.length) % list.length].click(); }
    });
  });
  const initialTab = (location.hash || "").replace("#", "");
  if (["try", "train", "simulate", "backtest"].indexOf(initialTab) !== -1) activate(initialTab);

  // ── Status pill ────────────────────────────────────────────────────────
  function setStatus(state, label) {
    statusEl.dataset.state = state;
    statusLabel.textContent = label;
  }

  // ── Hydrate model JSON (input/output schema + trainingEnabled) ─────────
  fetch("/_data/models/" + encodeURIComponent(slug) + ".json", { credentials: "omit" })
    .then((r) => (r.ok ? r.json() : null))
    .then((detail) => {
      if (!detail) {
        showError("Couldn't load this model's schema.");
        return;
      }
      bootForm(detail);
      bootTrain(detail);
    })
    .catch((e) => showError("Couldn't load this model's schema (" + e.message + ")."));

  let form = null;
  let outputSchema = null;
  let lastInput = null;

  function bootForm(detail) {
    if (!detail.inputSchema) {
      formHost.innerHTML = '<p class="playground-empty__hint">No input schema published for this model yet.</p>';
      return;
    }
    outputSchema = detail.outputSchema || null;
    form = window.GefiSchemaForm.create(detail.inputSchema, { initial: detail.defaultInput });
    formHost.appendChild(form.element);
    runBtn.disabled = !form.validate().valid;
    form.on("valid", (valid) => { runBtn.disabled = !valid; });
  }

  function bootTrain(detail) {
    if (detail.trainingEnabled) {
      trainHost.innerHTML =
        '<form class="playground-train" novalidate>' +
          '<label class="schema-field"><span class="schema-field__title">Epochs</span>' +
            '<input class="schema-field__input" type="number" min="1" max="200" value="5" name="epochs"></label>' +
          '<label class="schema-field"><span class="schema-field__title">Batch size</span>' +
            '<input class="schema-field__input" type="number" min="1" max="1024" value="64" name="batch_size"></label>' +
          '<label class="schema-field"><span class="schema-field__title">Learning rate</span>' +
            '<input class="schema-field__input" type="number" min="0.00001" max="1" step="0.0001" value="0.001" name="learning_rate"></label>' +
          '<label class="schema-field"><span class="schema-field__title">Dataset (optional)</span>' +
            '<input class="schema-field__input" type="text" placeholder="r2://datasets-licensed/my-set" name="dataset"></label>' +
          '<button class="btn btn--primary" type="submit">Queue training run</button>' +
          '<p class="playground-train__msg" data-train-msg hidden></p>' +
        "</form>";
      const f = trainHost.querySelector("form");
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        const msg = f.querySelector("[data-train-msg]");
        msg.textContent = "Training is enabled in Phase 7 — your job will be queued then.";
        msg.hidden = false;
      });
    } else {
      trainHost.innerHTML =
        '<div class="playground-empty">' +
          "<h3>Training not enabled</h3>" +
          "<p>The author of this model hasn't opened it for federated training yet. " +
          "When they do, you'll be able to queue a fine-tuning run from here.</p>" +
        "</div>";
    }
  }

  // ── Run flow ───────────────────────────────────────────────────────────
  runBtn.addEventListener("click", async () => {
    if (!form) return;
    const v = form.validate();
    if (!v.valid) { runBtn.disabled = true; return; }
    const body = form.getValues();
    lastInput = body;
    runBtn.disabled = true;
    runLabel.textContent = "Running…";
    setStatus("running", "Running");
    errorEl.hidden = true;
    resultHost.hidden = true;
    try {
      const url = (apiBase || "") + "/api/playground/" + encodeURIComponent(slug) + "/run";
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json && json.error === "rate_limited") {
          throw new Error("Rate limit hit. Try again in a few minutes (or sign in for 200/day).");
        }
        if (json && json.error === "invalid_input") {
          throw new Error("Server rejected the input: " + (json.details || []).map((d) => d.path + " " + d.message).join("; "));
        }
        throw new Error(json && json.error ? json.error : "request failed (" + res.status + ")");
      }
      renderResult(json);
      setStatus("done", "Done · " + json.latency_ms + "ms");
    } catch (err) {
      setStatus("error", "Error");
      showError(err.message || String(err));
    } finally {
      runLabel.textContent = "Run";
      runBtn.disabled = !form || !form.validate().valid;
    }
  });

  function showError(message) {
    errorEl.hidden = false;
    errorEl.textContent = message;
  }

  // ── Result panel ───────────────────────────────────────────────────────
  function renderResult(payload) {
    resultHost.hidden = false;
    resultMeta.textContent =
      "Latency " + payload.latency_ms + "ms · " +
      (payload.mock ? "Mock response (Phase 4)" : "Live") +
      (payload.version ? " · v" + payload.version : "");
    resultBody.innerHTML = "";
    const schema = payload.output_schema || outputSchema;
    // Per-model result widget wins; fall back to the generic key/value tree
    // so models without a tailored renderer (or unexpected output shapes)
    // still display something useful.
    const widget = window.PG_RESULT_WIDGETS && window.PG_RESULT_WIDGETS[slug];
    if (widget && payload.output && typeof payload.output === "object") {
      try { widget(resultBody, payload.output); }
      catch (err) { resultBody.appendChild(renderValue(payload.output, schema, "")); }
    } else {
      resultBody.appendChild(renderValue(payload.output, schema, ""));
    }

    // Wire the copy buttons each time so the fresh payload is captured.
    root.querySelectorAll("[data-pg-copy]").forEach((btn) => {
      btn.onclick = () => {
        const text = btn.dataset.pgCopy === "json"
          ? JSON.stringify(payload.output, null, 2)
          : buildCurl(slug, lastInput);
        navigator.clipboard
          .writeText(text)
          .then(() => { const orig = btn.textContent; btn.textContent = "Copied!"; setTimeout(() => btn.textContent = orig, 1200); })
          .catch(() => alert(text));
      };
    });
  }

  function renderValue(value, schema, label) {
    // Numeric arrays → tiny sparkline (uPlot if available, else SVG fallback).
    if (Array.isArray(value) && value.length && value.every((v) => typeof v === "number")) {
      return renderSparkline(label, value);
    }
    // Strings of any length → paragraph
    if (typeof value === "string") {
      return statRow(label, value);
    }
    if (typeof value === "number" || typeof value === "boolean" || value === null) {
      return statRow(label, formatScalar(value));
    }
    if (Array.isArray(value)) {
      const wrap = document.createElement("div");
      wrap.className = "playground-result__group";
      if (label) wrap.appendChild(headerEl(label));
      value.forEach((v, i) => wrap.appendChild(renderValue(v, schema && schema.items, "[" + i + "]")));
      return wrap;
    }
    if (value && typeof value === "object") {
      const wrap = document.createElement("div");
      wrap.className = "playground-result__group";
      if (label) wrap.appendChild(headerEl(label));
      const props = schema && schema.properties ? schema.properties : null;
      Object.keys(value).forEach((k) => {
        wrap.appendChild(renderValue(value[k], props && props[k], k));
      });
      return wrap;
    }
    return statRow(label, String(value));
  }

  function statRow(label, text) {
    const row = document.createElement("div");
    row.className = "playground-stat";
    if (label) {
      const lab = document.createElement("span");
      lab.className = "playground-stat__label";
      lab.textContent = label;
      row.appendChild(lab);
    }
    const val = document.createElement(text.length > 80 ? "p" : "strong");
    val.className = "playground-stat__value";
    val.textContent = text;
    row.appendChild(val);
    return row;
  }
  function headerEl(label) {
    const h = document.createElement("h4");
    h.className = "playground-stat__group-label";
    h.textContent = label;
    return h;
  }
  function formatScalar(v) {
    if (typeof v === "number") return Number.isInteger(v) ? String(v) : String(Math.round(v * 10000) / 10000);
    if (typeof v === "boolean") return v ? "true" : "false";
    if (v === null) return "—";
    return String(v);
  }
  function renderSparkline(label, series) {
    const wrap = document.createElement("div");
    wrap.className = "playground-spark";
    if (label) wrap.appendChild(headerEl(label));
    const w = 280, h = 60;
    const min = Math.min.apply(null, series);
    const max = Math.max.apply(null, series);
    const span = max - min || 1;
    const step = w / Math.max(1, series.length - 1);
    const pts = series.map((v, i) => i * step + "," + (h - ((v - min) / span) * h)).join(" ");
    // Escape the label before interpolating into the aria-label attribute —
    // schema-derived keys flow through here and the architect flagged the
    // raw injection as an XSS vector if a backend ever returns adversarial
    // property names.
    const safeLabel = String(label || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[c]);
    wrap.insertAdjacentHTML(
      "beforeend",
      '<svg class="playground-spark__svg" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' +
        safeLabel + '">' +
        '<polyline fill="none" stroke="currentColor" stroke-width="1.5" points="' + pts + '"/>' +
      "</svg>",
    );
    const cap = document.createElement("p");
    cap.className = "playground-spark__caption";
    cap.textContent = "min " + formatScalar(min) + " · max " + formatScalar(max) + " · n=" + series.length;
    wrap.appendChild(cap);
    return wrap;
  }
  function buildCurl(slug, body) {
    const lines = [
      "curl https://api.gefi.app/v1/models/" + slug + "/predict \\",
      "  -H 'Authorization: Bearer YOUR_KEY' \\",
      "  -H 'Content-Type: application/json' \\",
      "  -d '" + JSON.stringify(body || {}).replace(/'/g, "'\\''") + "'",
    ];
    return lines.join("\n");
  }
})();
