/**
 * Schema-driven form generator for the Phase-4 Playground.
 *
 * `createSchemaForm(schema, { initial }) → { element, getValues, validate, on }`
 *
 * Vanilla JS — Jekyll site has no bundler, so the SchemaForm is a tiny
 * factory that returns a DOM fragment plus a small handle for getting +
 * validating the current values. The validator mirrors
 * `apps/api/src/lib/schema-validate.ts` exactly so client-side blur
 * checks match the server's response.
 *
 * Supported widgets (driven by JSON Schema type/format):
 *   number/integer (minimum/maximum/multipleOf) → <input type="number">
 *   string (no enum)                            → <input type="text">
 *   string + enum                                → <select>
 *   string + format=date                         → <input type="date">
 *   boolean                                      → toggle (<input type="checkbox">)
 *   array of primitives                          → tag-style multi-input
 *   array of objects                             → repeater (add/remove rows)
 *   object                                       → <fieldset>
 *
 * `on('change', cb)` fires after every edit (with the latest snapshot of
 * values). `on('valid', cb)` fires whenever the overall valid state flips
 * — used by the right rail to enable/disable the Run button.
 */
(function (global) {
  "use strict";

  const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
  function isValidIsoDate(s) {
    if (typeof s !== "string" || !ISO_DATE.test(s)) return false;
    const parts = s.split("-").map(Number);
    const y = parts[0], m = parts[1], d = parts[2];
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
  }

  function createSchemaForm(schema, opts) {
    opts = opts || {};
    const root = document.createElement("div");
    root.className = "schema-form";

    const listeners = { change: [], valid: [] };
    let lastValid = null;
    const state = { value: deepClone(opts.initial != null ? opts.initial : defaultsFor(schema)) };

    renderInto(root, schema, state.value, "", (path, value) => {
      setAtPath(state.value, path, value);
      emit("change", deepClone(state.value));
      const v = validate();
      if (v.valid !== lastValid) {
        lastValid = v.valid;
        emit("valid", v.valid);
      }
    });

    function getValues() {
      return deepClone(state.value);
    }
    function validate() {
      const errors = [];
      walk(state.value, schema, "", errors);
      // Decorate fields with .has-error for server-style blur feedback.
      root.querySelectorAll("[data-path]").forEach((el) => {
        const errs = errors.filter((e) => e.path === el.dataset.path);
        const wrap = el.closest(".schema-field") || el;
        wrap.classList.toggle("has-error", errs.length > 0);
        const msgEl = wrap.querySelector(".schema-field__error");
        if (msgEl) msgEl.textContent = errs[0] ? errs[0].message : "";
      });
      return { valid: errors.length === 0, errors: errors };
    }
    function on(event, cb) {
      if (listeners[event]) listeners[event].push(cb);
    }
    function emit(event, payload) {
      (listeners[event] || []).forEach((cb) => {
        try { cb(payload); } catch (e) { /* ignore listener failure */ }
      });
    }

    // Initial validation pass (decorates & seeds lastValid).
    lastValid = validate().valid;

    return { element: root, getValues, validate, on };
  }

  // ── Renderers ────────────────────────────────────────────────────────────
  function renderInto(parent, schema, value, path, onChange) {
    const t = schema.type;
    if (t === "object") return renderObject(parent, schema, value || {}, path, onChange);
    if (t === "array") return renderArray(parent, schema, Array.isArray(value) ? value : [], path, onChange);
    return renderScalar(parent, schema, value, path, onChange);
  }

  function renderObject(parent, schema, value, path, onChange) {
    const fs = path === "" ? parent : (function () {
      const f = document.createElement("fieldset");
      f.className = "schema-field schema-field--object";
      const lg = document.createElement("legend");
      lg.textContent = schema.title || lastSegment(path);
      f.appendChild(lg);
      parent.appendChild(f);
      return f;
    })();
    const props = schema.properties || {};
    for (const k of Object.keys(props)) {
      const sub = props[k];
      const p = path ? path + "." + k : k;
      renderInto(fs, sub, value[k], p, onChange);
    }
  }

  function renderScalar(parent, schema, value, path, onChange) {
    const wrap = document.createElement("label");
    wrap.className = "schema-field schema-field--" + (schema.type || "string");
    const titleText = schema.title || lastSegment(path) || "";
    if (titleText) {
      const title = document.createElement("span");
      title.className = "schema-field__title";
      title.textContent = titleText;
      wrap.appendChild(title);
    }
    let input;
    if (schema.type === "boolean") {
      input = document.createElement("input");
      input.type = "checkbox";
      input.checked = value === true;
      input.addEventListener("change", () => onChange(path, input.checked));
    } else if (schema.enum) {
      input = document.createElement("select");
      schema.enum.forEach((opt) => {
        const o = document.createElement("option");
        o.value = String(opt);
        o.textContent = String(opt);
        if (value === opt) o.selected = true;
        input.appendChild(o);
      });
      input.addEventListener("change", () => onChange(path, coerce(schema, input.value)));
    } else if (schema.type === "string" && schema.format === "date") {
      input = document.createElement("input");
      input.type = "date";
      input.value = value != null ? String(value) : "";
      input.addEventListener("input", () => onChange(path, input.value));
      input.addEventListener("blur", () => onChange(path, input.value));
    } else if (schema.type === "number" || schema.type === "integer") {
      input = document.createElement("input");
      input.type = "number";
      if (schema.minimum != null) input.min = String(schema.minimum);
      if (schema.maximum != null) input.max = String(schema.maximum);
      if (schema.multipleOf != null) input.step = String(schema.multipleOf);
      else if (schema.type === "integer") input.step = "1";
      input.value = value != null ? String(value) : "";
      input.addEventListener("input", () => onChange(path, input.value === "" ? undefined : Number(input.value)));
    } else {
      // string fallback
      input = document.createElement("input");
      input.type = "text";
      input.value = value != null ? String(value) : "";
      if (schema.maxLength != null) input.maxLength = schema.maxLength;
      input.addEventListener("input", () => onChange(path, input.value));
    }
    input.dataset.path = path;
    input.className = "schema-field__input";
    wrap.appendChild(input);

    const err = document.createElement("span");
    err.className = "schema-field__error";
    wrap.appendChild(err);
    parent.appendChild(wrap);
  }

  function renderArray(parent, schema, value, path, onChange) {
    const items = schema.items || { type: "string" };
    const wrap = document.createElement("fieldset");
    wrap.className = "schema-field schema-field--array";
    const lg = document.createElement("legend");
    lg.textContent = schema.title || lastSegment(path) || "Items";
    wrap.appendChild(lg);

    const list = document.createElement("div");
    list.className = "schema-array";
    wrap.appendChild(list);
    list.dataset.path = path;

    function rerender() {
      list.innerHTML = "";
      value.forEach((item, i) => {
        const row = document.createElement("div");
        row.className = "schema-array__row";
        const slot = document.createElement("div");
        slot.className = "schema-array__slot";
        renderInto(slot, items, item, path + "[" + i + "]", (childPath, childValue) => {
          // Only the deepest leaf paths reach here; for objects we get e.g. "x[0].name".
          // Translate to the correct array index update.
          setAtPath(value, childPath.slice(path.length), childValue);
          onChange(path, value.slice());
        });
        row.appendChild(slot);
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "btn btn--ghost schema-array__remove";
        remove.setAttribute("aria-label", "Remove item " + (i + 1));
        remove.textContent = "Remove";
        remove.addEventListener("click", () => {
          value.splice(i, 1);
          onChange(path, value.slice());
          rerender();
        });
        row.appendChild(remove);
        list.appendChild(row);
      });
    }
    rerender();

    const add = document.createElement("button");
    add.type = "button";
    add.className = "btn btn--ghost schema-array__add";
    add.textContent = "Add";
    add.addEventListener("click", () => {
      value.push(defaultsFor(items));
      onChange(path, value.slice());
      rerender();
    });
    wrap.appendChild(add);

    const err = document.createElement("span");
    err.className = "schema-field__error";
    wrap.appendChild(err);
    parent.appendChild(wrap);
  }

  // ── Validator (mirror of server-side schema-validate.ts) ─────────────────
  function walk(value, schema, path, errors) {
    if (schema.type) {
      if (!matchesType(value, schema.type)) {
        errors.push({ path, message: "expected " + schema.type });
        return;
      }
    }
    if (schema.enum && schema.enum.indexOf(value) === -1) {
      errors.push({ path, message: "must be one of " + schema.enum.join(", ") });
      return;
    }
    if (schema.type === "string") {
      if (schema.minLength != null && value.length < schema.minLength)
        errors.push({ path, message: "must be ≥ " + schema.minLength + " chars" });
      if (schema.maxLength != null && value.length > schema.maxLength)
        errors.push({ path, message: "must be ≤ " + schema.maxLength + " chars" });
      if (schema.format === "date" && !isValidIsoDate(value))
        errors.push({ path, message: "must be YYYY-MM-DD" });
    }
    if (schema.type === "number" || schema.type === "integer") {
      if (schema.minimum != null && value < schema.minimum)
        errors.push({ path, message: "must be ≥ " + schema.minimum });
      if (schema.maximum != null && value > schema.maximum)
        errors.push({ path, message: "must be ≤ " + schema.maximum });
      if (schema.multipleOf != null) {
        const k = Math.round(value / schema.multipleOf);
        if (Math.abs(k * schema.multipleOf - value) > 1e-9)
          errors.push({ path, message: "must be a multiple of " + schema.multipleOf });
      }
    }
    if (schema.type === "array" && Array.isArray(value)) {
      if (schema.minItems != null && value.length < schema.minItems)
        errors.push({ path, message: "must have ≥ " + schema.minItems + " items" });
      if (schema.maxItems != null && value.length > schema.maxItems)
        errors.push({ path, message: "must have ≤ " + schema.maxItems + " items" });
      if (schema.items) value.forEach((it, i) => walk(it, schema.items, path + "[" + i + "]", errors));
    }
    if (schema.type === "object" && value && typeof value === "object" && !Array.isArray(value)) {
      (schema.required || []).forEach((k) => {
        if (!(k in value)) errors.push({ path: childPath(path, k), message: "is required" });
      });
      if (schema.properties) {
        for (const k in schema.properties) {
          if (k in value) walk(value[k], schema.properties[k], childPath(path, k), errors);
        }
        if (schema.additionalProperties === false) {
          for (const k in value) {
            if (!(k in schema.properties))
              errors.push({ path: childPath(path, k), message: "is not allowed" });
          }
        }
      }
    }
  }
  function matchesType(v, t) {
    if (t === "string") return typeof v === "string";
    if (t === "boolean") return typeof v === "boolean";
    if (t === "number") return typeof v === "number" && isFinite(v);
    if (t === "integer") return typeof v === "number" && Number.isInteger(v);
    if (t === "array") return Array.isArray(v);
    if (t === "object") return v && typeof v === "object" && !Array.isArray(v);
    return true;
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  function deepClone(v) { return v === undefined ? undefined : JSON.parse(JSON.stringify(v)); }
  function lastSegment(p) {
    if (!p) return "";
    const m = p.match(/[^.\[\]]+$/);
    return m ? m[0] : p;
  }
  function childPath(parent, key) { return parent ? parent + "." + key : key; }
  function coerce(schema, raw) {
    if (schema.type === "number" || schema.type === "integer") return Number(raw);
    if (schema.type === "boolean") return raw === "true";
    return raw;
  }
  function defaultsFor(schema) {
    if (schema == null) return undefined;
    if ("default" in schema) return deepClone(schema.default);
    if (schema.type === "object") {
      const out = {};
      const props = schema.properties || {};
      for (const k of Object.keys(props)) {
        const v = defaultsFor(props[k]);
        if (v !== undefined) out[k] = v;
      }
      return out;
    }
    if (schema.type === "array") return [];
    if (schema.type === "boolean") return false;
    if (schema.type === "number" || schema.type === "integer") return 0;
    return "";
  }
  function setAtPath(root, path, value) {
    if (!path) return;
    const tokens = tokenize(path);
    let cur = root;
    for (let i = 0; i < tokens.length - 1; i++) {
      const k = tokens[i];
      if (cur[k] == null) cur[k] = typeof tokens[i + 1] === "number" ? [] : {};
      cur = cur[k];
    }
    cur[tokens[tokens.length - 1]] = value;
  }
  function tokenize(path) {
    const out = [];
    const re = /([^.\[\]]+)|\[(\d+)\]/g;
    let m;
    while ((m = re.exec(path)) !== null) {
      if (m[2] !== undefined) out.push(Number(m[2]));
      else out.push(m[1]);
    }
    return out;
  }

  global.GefiSchemaForm = { create: createSchemaForm };
})(typeof window !== "undefined" ? window : globalThis);
