import { describe, expect, it } from "vitest";
import type { GefiAuthClaims } from "./types.js";
import {
  PERSONA_PERMISSIONS,
  PermissionDeniedError,
  assertCan,
  canPerform,
  effectivePermissions,
} from "./rbac.js";

function claims(roles: GefiAuthClaims["roles"]): Pick<GefiAuthClaims, "roles"> {
  return { roles };
}

describe("RBAC matrix — Task #3 verifications", () => {
  it("regulator can read the audit log but cannot subscribe", () => {
    const c = claims(["regulator"]);
    expect(canPerform(c, "read", "audit_log")).toBe(true);
    expect(canPerform(c, "list", "audit_log")).toBe(true);
    expect(canPerform(c, "create", "subscription")).toBe(false);
    expect(canPerform(c, "update", "subscription")).toBe(false);
  });

  it("investor cannot publish models", () => {
    const c = claims(["investor"]);
    expect(canPerform(c, "publish", "model")).toBe(false);
    expect(canPerform(c, "create", "model")).toBe(false);
    expect(canPerform(c, "read", "model")).toBe(true);
    expect(canPerform(c, "create", "subscription")).toBe(true);
  });

  it("developer can publish models", () => {
    const c = claims(["developer"]);
    expect(canPerform(c, "publish", "model")).toBe(true);
    expect(canPerform(c, "create", "model")).toBe(true);
  });

  it("admin can do everything within the matrix vocabulary", () => {
    const c = claims(["admin"]);
    expect(canPerform(c, "publish", "model")).toBe(true);
    expect(canPerform(c, "delete", "audit_log")).toBe(true);
    expect(canPerform(c, "update", "compliance_event")).toBe(true);
  });

  it("compliance_officer can update KYC evidence and compliance events", () => {
    const c = claims(["compliance_officer"]);
    expect(canPerform(c, "read", "kyc_evidence")).toBe(true);
    expect(canPerform(c, "update", "kyc_evidence")).toBe(true);
    expect(canPerform(c, "update", "compliance_event")).toBe(true);
    expect(canPerform(c, "publish", "model")).toBe(false);
    expect(canPerform(c, "create", "subscription")).toBe(false);
  });

  it("auditor is read-only and tightly scoped", () => {
    const c = claims(["auditor"]);
    expect(canPerform(c, "read", "audit_log")).toBe(true);
    expect(canPerform(c, "read", "compliance_event")).toBe(true);
    expect(canPerform(c, "read", "kyc_evidence")).toBe(true);
    expect(canPerform(c, "list", "tenant")).toBe(false);
    expect(canPerform(c, "create", "model")).toBe(false);
  });

  it("data_provider can publish datasets but not models", () => {
    const c = claims(["data_provider"]);
    expect(canPerform(c, "create", "dataset")).toBe(true);
    expect(canPerform(c, "update", "dataset")).toBe(true);
    expect(canPerform(c, "publish", "model")).toBe(false);
    expect(canPerform(c, "create", "model")).toBe(false);
  });

  it("union of multiple roles is permissive", () => {
    const c = claims(["investor", "developer"]);
    expect(canPerform(c, "publish", "model")).toBe(true); // from developer
    expect(canPerform(c, "create", "subscription")).toBe(true); // from both
  });

  it("empty role list grants no permissions", () => {
    const c = claims([]);
    expect(canPerform(c, "read", "audit_log")).toBe(false);
    expect(effectivePermissions([]).size).toBe(0);
  });

  it("assertCan throws PermissionDeniedError on denial", () => {
    expect(() => assertCan(claims(["investor"]), "publish", "model")).toThrow(PermissionDeniedError);
    expect(() => assertCan(claims(["admin"]), "publish", "model")).not.toThrow();
  });

  it("PERSONA_PERMISSIONS has an entry for every declared persona", () => {
    const personas: Array<keyof typeof PERSONA_PERMISSIONS> = [
      "admin",
      "developer",
      "investor",
      "data_provider",
      "regulator",
      "auditor",
      "compliance_officer",
    ];
    for (const p of personas) {
      expect(PERSONA_PERMISSIONS[p].length).toBeGreaterThan(0);
    }
  });
});
