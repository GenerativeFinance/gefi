/**
 * GeFi RBAC engine.
 *
 * Permissions are expressed as `${action}:${resource}` strings. Personas
 * map onto a set of permissions via `PERSONA_PERMISSIONS`. A user's
 * effective permission set is the union of every role they hold.
 *
 * Server-side middleware (`requireAuth`) and the client-side `<RoleGate>`
 * component (Task #7) both call `canPerform(claims, action, resource)`.
 *
 * The verifications mandated by Task #3's "Done looks like":
 *   - regulator can `read:audit_log` but not `create:subscription`.
 *   - investor cannot `publish:model`.
 *   - admin is omnipotent within its tenant.
 */

import type { Persona } from "@gefi/shared-types";
import type { Action, GefiAuthClaims, Permission, Resource } from "./types.js";

const ALL_RESOURCES: Resource[] = [
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

function expand(actions: Action[], resources: Resource[]): Permission[] {
  return actions.flatMap((a) => resources.map((r) => `${a}:${r}` as Permission));
}

/**
 * The persona → permission matrix. Permissions are deliberately listed
 * explicitly per persona (no inheritance) so it's easy to audit by reading
 * one row.
 */
export const PERSONA_PERMISSIONS: Record<Persona, readonly Permission[]> = {
  // Tenant administrator. Full CRUD on the tenant's own resources. Cannot
  // (by design) read another tenant's audit log — tenancy isolation is
  // enforced by row-level checks in the API, not by RBAC.
  admin: [
    ...expand(["create", "read", "update", "delete", "list"], ALL_RESOURCES),
    "publish:model",
    "publish:research_note",
  ],

  // Builds and ships models / research / datasets. Manages their own
  // subscriptions + API keys.
  developer: [
    ...expand(["create", "read", "update", "delete", "list"], [
      "model",
      "research_note",
      "dataset",
    ]),
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

  // Buys models/data, runs them, manages subscriptions. Cannot publish.
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

  // Contributes data to the federation. Manages datasets + their
  // participation in federated training rounds (deeper details in Task #6).
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

  // External regulator. Can READ the audit log + compliance events for
  // tenants in their jurisdiction; cannot subscribe, cannot create models.
  regulator: [
    "read:audit_log",
    "list:audit_log" as Permission,
    "read:compliance_event",
    "list:compliance_event" as Permission,
    "list:model",
    "read:model",
    "list:tenant",
    "read:tenant",
  ],

  // Internal/external auditor. Same read scope as regulator but without
  // model + tenant listing — they're operating on a specific scoped
  // engagement.
  auditor: [
    "read:audit_log",
    "list:audit_log" as Permission,
    "read:compliance_event",
    "read:kyc_evidence",
  ],

  // Compliance officer at a tenant. Reviews KYC + compliance events,
  // updates their status. Cannot publish models / change subscriptions.
  compliance_officer: [
    "read:audit_log",
    "list:audit_log" as Permission,
    "read:compliance_event",
    "list:compliance_event" as Permission,
    "update:compliance_event",
    "read:kyc_evidence",
    "list:kyc_evidence" as Permission,
    "update:kyc_evidence",
    "read:user",
    "list:user",
    "read:tenant",
    "list:model",
    "read:model",
  ],
};

/** Build a flat `Set<Permission>` from a list of personas (the user's roles). */
export function effectivePermissions(roles: readonly Persona[]): Set<Permission> {
  const out = new Set<Permission>();
  for (const role of roles) {
    const perms = PERSONA_PERMISSIONS[role];
    if (!perms) continue;
    for (const p of perms) out.add(p);
  }
  return out;
}

/**
 * Authoritative permission check.
 *
 * Returns true if any of the user's roles confers the requested
 * `action:resource`. Tenancy + jurisdiction are enforced separately
 * (the API layer additionally checks `claims.tenant_id` and
 * `claims.jurisdiction` against the resource being touched).
 */
export function canPerform(
  claims: Pick<GefiAuthClaims, "roles">,
  action: Action,
  resource: Resource,
): boolean {
  const want = `${action}:${resource}` as Permission;
  return effectivePermissions(claims.roles).has(want);
}

/** Throw if the user can't perform `action:resource`. */
export class PermissionDeniedError extends Error {
  constructor(public readonly action: Action, public readonly resource: Resource) {
    super(`permission_denied: ${action}:${resource}`);
    this.name = "PermissionDeniedError";
  }
}

export function assertCan(
  claims: Pick<GefiAuthClaims, "roles">,
  action: Action,
  resource: Resource,
): void {
  if (!canPerform(claims, action, resource)) {
    throw new PermissionDeniedError(action, resource);
  }
}
