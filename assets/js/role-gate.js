/**
 * GeFi RoleGate — client-side RBAC primitive.
 *
 * Mirrors the server-side `canPerform` engine from
 * `infrastructure/cloudflare/packages/auth/src/rbac.ts`. The matrix
 * below MUST stay in sync with `PERSONA_PERMISSIONS` in that file —
 * a vitest assertion in
 * `infrastructure/cloudflare/packages/auth/src/role-gate-sync.test.ts`
 * fails the build if it drifts.
 *
 * Two surfaces:
 *
 *   1. ESM functions for any framework. Import from React (Task #7's
 *      dashboards) and pass the user's claims:
 *
 *        import { canPerform } from "/assets/js/role-gate.js";
 *        if (canPerform(claims, "publish", "model")) { ... }
 *
 *   2. A `<role-gate>` custom element for plain Jekyll pages:
 *
 *        <role-gate action="read" subject="audit_log">
 *          <a href="/audit/">Audit log</a>
 *        </role-gate>
 *
 *      The element looks up the current user's claims from
 *      `window.GEFI_CLAIMS` (set by the dashboard shell on load) and
 *      hides itself if the permission isn't granted. While claims are
 *      unset (e.g. anonymous visit), the element stays hidden — gates
 *      are *closed by default*.
 *
 * Server-side enforcement at the API still applies; this is purely a
 * UI affordance to avoid showing buttons users can't use.
 */

const ALL_RESOURCES = [
  "model",
  "subscription",
  "audit_log",
  "compliance_event",
  "tenant",
  "user",
  "api_key",
  "kyc_evidence",
  "research_note",
  "dataset",
];

function expand(actions, resources) {
  const out = [];
  for (const a of actions) for (const r of resources) out.push(`${a}:${r}`);
  return out;
}

export const PERSONA_PERMISSIONS = {
  admin: [
    ...expand(["create", "read", "update", "delete", "list"], ALL_RESOURCES),
    "publish:model",
    "publish:research_note",
  ],
  developer: [
    ...expand(
      ["create", "read", "update", "delete", "list"],
      ["model", "research_note", "dataset"],
    ),
    "publish:model",
    "publish:research_note",
    "create:api_key",
    "list:api_key",
    "read:api_key",
    "delete:api_key",
    "list:subscription",
    "read:subscription",
    "create:subscription",
    "update:subscription",
    "read:user",
    "update:user",
    "read:tenant",
    "list:model",
    "read:model",
  ],
  investor: [
    "list:model",
    "read:model",
    "list:research_note",
    "read:research_note",
    "list:dataset",
    "read:dataset",
    "create:subscription",
    "read:subscription",
    "update:subscription",
    "delete:subscription",
    "list:subscription",
    "create:api_key",
    "list:api_key",
    "read:api_key",
    "delete:api_key",
    "read:user",
    "update:user",
    "read:tenant",
  ],
  data_provider: [
    ...expand(["create", "read", "update", "delete", "list"], ["dataset"]),
    "list:model",
    "read:model",
    "create:api_key",
    "list:api_key",
    "read:api_key",
    "delete:api_key",
    "read:user",
    "update:user",
    "read:tenant",
  ],
  regulator: [
    "read:audit_log",
    "list:audit_log",
    "read:compliance_event",
    "list:compliance_event",
    "list:model",
    "read:model",
    "list:tenant",
    "read:tenant",
  ],
  auditor: [
    "read:audit_log",
    "list:audit_log",
    "read:compliance_event",
    "read:kyc_evidence",
  ],
  compliance_officer: [
    "read:audit_log",
    "list:audit_log",
    "read:compliance_event",
    "list:compliance_event",
    "update:compliance_event",
    "read:kyc_evidence",
    "list:kyc_evidence",
    "update:kyc_evidence",
    "read:user",
    "list:user",
    "read:tenant",
    "list:model",
    "read:model",
  ],
};

export function effectivePermissions(roles) {
  const out = new Set();
  if (!Array.isArray(roles)) return out;
  for (const r of roles) {
    const perms = PERSONA_PERMISSIONS[r];
    if (!perms) continue;
    for (const p of perms) out.add(p);
  }
  return out;
}

export function canPerform(claims, action, resource) {
  if (!claims || !claims.roles) return false;
  return effectivePermissions(claims.roles).has(`${action}:${resource}`);
}

export function getCurrentClaims() {
  if (typeof window === "undefined") return null;
  if (window.GEFI_CLAIMS && typeof window.GEFI_CLAIMS === "object") return window.GEFI_CLAIMS;
  try {
    const raw = sessionStorage.getItem("gefi:auth:claims");
    return raw ? JSON.parse(raw) : null;
  } catch (_e) {
    return null;
  }
}

if (typeof customElements !== "undefined" && typeof HTMLElement !== "undefined") {
  class RoleGate extends HTMLElement {
    static get observedAttributes() {
      return ["action", "subject"];
    }
    connectedCallback() {
      this._evaluate();
      window.addEventListener("gefi:claims-updated", this._evaluate.bind(this));
    }
    disconnectedCallback() {
      window.removeEventListener("gefi:claims-updated", this._evaluate.bind(this));
    }
    attributeChangedCallback() {
      this._evaluate();
    }
    _evaluate() {
      const action = this.getAttribute("action");
      const subject = this.getAttribute("subject");
      const claims = getCurrentClaims();
      const allowed = !!action && !!subject && canPerform(claims, action, subject);
      if (allowed) {
        this.removeAttribute("hidden");
        this.style.display = "";
      } else {
        this.setAttribute("hidden", "");
        this.style.display = "none";
      }
    }
  }
  if (!customElements.get("role-gate")) {
    customElements.define("role-gate", RoleGate);
  }
}
