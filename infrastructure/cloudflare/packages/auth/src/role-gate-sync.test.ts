/**
 * Sync test — the client-side RBAC mirror in
 * `assets/js/role-gate.js` MUST match the server-side
 * `PERSONA_PERMISSIONS` matrix in `rbac.ts`. If anyone edits one
 * without the other this test fails the build.
 */

import { describe, expect, it } from "vitest";
import { PERSONA_PERMISSIONS } from "./rbac.js";
// The role-gate file is plain ESM JS at the project root.
// @ts-expect-error — JS module without .d.ts; we only assert shape.
import { PERSONA_PERMISSIONS as CLIENT_PERMS } from "../../../../../assets/js/role-gate.js";

describe("client-side RoleGate matrix (assets/js/role-gate.js)", () => {
  it("exposes the same persona keys as the server-side matrix", () => {
    const serverKeys = Object.keys(PERSONA_PERMISSIONS).sort();
    const clientKeys = Object.keys(CLIENT_PERMS as Record<string, unknown>).sort();
    expect(clientKeys).toEqual(serverKeys);
  });

  it("grants the same permissions per persona on both sides", () => {
    for (const persona of Object.keys(PERSONA_PERMISSIONS) as Array<keyof typeof PERSONA_PERMISSIONS>) {
      const serverPerms = PERSONA_PERMISSIONS[persona] as readonly string[];
      const serverSet = new Set<string>(serverPerms);
      const clientPerms = (CLIENT_PERMS as Record<string, string[]>)[persona] ?? [];
      const clientSet = new Set<string>(clientPerms);
      const onlyServer = [...serverSet].filter((p) => !clientSet.has(p));
      const onlyClient = [...clientSet].filter((p) => !serverSet.has(p));
      expect({ persona, onlyServer, onlyClient }).toEqual({ persona, onlyServer: [], onlyClient: [] });
    }
  });
});
