/**
 * <RoleGate> — client-side RBAC guard.
 *
 * Mirrors the server-side `canPerform` engine. Hides children when the
 * current user doesn't hold the required permission. Server enforcement
 * still applies — this is purely a UI convenience.
 *
 * Usage:
 *   <RoleGate action="publish" resource="model">
 *     <PublishButton />
 *   </RoleGate>
 *
 * Optional `fallback` renders when access is denied (default: null).
 */
import React from "react";
import { useAuth } from "./AuthContext.js";

type Action = "create" | "read" | "update" | "delete" | "list" | "publish";
type Resource =
  | "model"
  | "subscription"
  | "audit_log"
  | "compliance_event"
  | "tenant"
  | "user"
  | "api_key"
  | "kyc_evidence"
  | "research_note"
  | "dataset";

const ALL_RESOURCES: Resource[] = [
  "model","subscription","audit_log","compliance_event",
  "tenant","user","api_key","kyc_evidence","research_note","dataset",
];

function expand(actions: Action[], resources: Resource[]): string[] {
  return actions.flatMap((a) => resources.map((r) => `${a}:${r}`));
}

const PERSONA_PERMS: Record<string, string[]> = {
  admin: [
    ...expand(["create","read","update","delete","list"], ALL_RESOURCES),
    "publish:model","publish:research_note",
  ],
  developer: [
    ...expand(["create","read","update","delete","list"], ["model","research_note","dataset"]),
    "publish:model","publish:research_note",
    "create:api_key","list:api_key","read:api_key","delete:api_key",
    "list:subscription","read:subscription","create:subscription","update:subscription",
    "read:user","update:user","read:tenant","list:model","read:model",
  ],
  investor: [
    "list:model","read:model","list:research_note","read:research_note",
    "list:dataset","read:dataset",
    "create:subscription","read:subscription","update:subscription","delete:subscription","list:subscription",
    "create:api_key","list:api_key","read:api_key","delete:api_key",
    "read:user","update:user","read:tenant",
  ],
  data_provider: [
    ...expand(["create","read","update","delete","list"], ["dataset"]),
    "list:model","read:model","create:api_key","list:api_key","read:api_key","delete:api_key",
    "read:user","update:user","read:tenant",
  ],
  regulator: [
    "read:audit_log","list:audit_log","read:compliance_event","list:compliance_event",
    "list:model","read:model","list:tenant","read:tenant",
  ],
  auditor: ["read:audit_log","list:audit_log","read:compliance_event","read:kyc_evidence"],
  compliance_officer: [
    "read:audit_log","list:audit_log","read:compliance_event","list:compliance_event",
    "update:compliance_event","read:kyc_evidence","list:kyc_evidence","update:kyc_evidence",
    "read:user","list:user","read:tenant","list:model","read:model",
  ],
};

export function canPerform(roles: string[], action: Action, resource: Resource): boolean {
  const want = `${action}:${resource}`;
  return roles.some((role) => (PERSONA_PERMS[role] ?? []).includes(want));
}

interface RoleGateProps {
  action: Action;
  resource: Resource;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGate({
  action,
  resource,
  fallback = null,
  children,
}: RoleGateProps): React.ReactElement {
  const { user } = useAuth();
  if (!user) return <>{fallback}</>;
  const allowed = canPerform(user.roles, action, resource);
  return <>{allowed ? children : fallback}</>;
}
