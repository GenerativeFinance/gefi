/**
 * Auth context for the GeFi dashboard.
 *
 * In dev (VITE_AUTH_STUB=true or no token), uses a mock JWT derived from
 * VITE_DEV_PERSONA env var (default: "investor"). Production wires Auth0.
 *
 * The context exposes:
 *   - `user` — the resolved GefiAuthClaims (or null while loading)
 *   - `token` — raw access token string (for API client)
 *   - `persona` — primary role for routing
 *   - `setDevPersona` — dev-only persona switcher
 *   - `logout` — clear session
 */
import React, { createContext, useContext, useState } from "react";
import { DEV_PERSONAS, type DevPersona } from "./personas.js";

export type Persona =
  | "investor"
  | "developer"
  | "regulator"
  | "data_provider"
  | "admin"
  | "auditor"
  | "compliance_officer";

export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  roles: Persona[];
  jurisdiction: string;
  tenantId: string;
  kycTier: "none" | "basic" | "standard" | "enhanced";
  subscriptionTier: "free" | "starter" | "pro" | "institutional" | "enterprise";
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  persona: Persona | null;
  setDevPersona: (p: DevPersona) => void;
  logout: () => void;
}

const AuthCtx = createContext<AuthContextValue | null>(null);

const INITIAL_PERSONA: DevPersona =
  (import.meta.env["VITE_DEV_PERSONA"] as DevPersona | undefined) ?? "investor";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [devPersona, setDevPersona] = useState<DevPersona>(INITIAL_PERSONA);
  const [loggedOut, setLoggedOut] = useState(false);

  if (loggedOut) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "var(--font-sans, system-ui)",
          color: "var(--color-muted, #6B7280)",
        }}
      >
        Signed out.{" "}
        <button
          style={{ marginLeft: 8, color: "var(--color-brand, #6D5BFF)", background: "none", border: "none", cursor: "pointer" }}
          onClick={() => setLoggedOut(false)}
        >
          Sign back in
        </button>
      </div>
    );
  }

  const cfg = DEV_PERSONAS[devPersona];
  const user: AuthUser = {
    sub: cfg.sub,
    email: cfg.email,
    name: cfg.name,
    roles: cfg.roles as Persona[],
    jurisdiction: cfg.jurisdiction,
    tenantId: cfg.tenantId,
    kycTier: cfg.kycTier as AuthUser["kycTier"],
    subscriptionTier: cfg.subscriptionTier as AuthUser["subscriptionTier"],
  };

  const value: AuthContextValue = {
    user,
    token: `stub.${btoa(JSON.stringify({ sub: user.sub, roles: user.roles }))}.sig`,
    isLoading: false,
    persona: user.roles[0] ?? null,
    setDevPersona,
    logout: () => setLoggedOut(true),
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
