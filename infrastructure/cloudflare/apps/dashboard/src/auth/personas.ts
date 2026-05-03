/**
 * Dev persona definitions for the stub auth context.
 *
 * Switch personas via the AppShell persona switcher (dev only).
 * Production uses real Auth0 JWT claims.
 */

export type DevPersona =
  | "investor"
  | "developer"
  | "regulator"
  | "data_provider"
  | "admin"
  | "auditor"
  | "compliance_officer";

export interface PersonaConfig {
  sub: string;
  email: string;
  name: string;
  roles: DevPersona[];
  jurisdiction: string;
  tenantId: string;
  kycTier: string;
  subscriptionTier: string;
  avatar?: string;
}

export const DEV_PERSONAS: Record<DevPersona, PersonaConfig> = {
  investor: {
    sub: "auth0|investor-001",
    email: "alex.chen@acmecapital.com",
    name: "Alex Chen",
    roles: ["investor"],
    jurisdiction: "eu",
    tenantId: "tenant-acme",
    kycTier: "enhanced",
    subscriptionTier: "institutional",
  },
  developer: {
    sub: "auth0|developer-001",
    email: "priya.nair@quant-labs.io",
    name: "Priya Nair",
    roles: ["developer"],
    jurisdiction: "us",
    tenantId: "tenant-quantlabs",
    kycTier: "standard",
    subscriptionTier: "pro",
  },
  regulator: {
    sub: "auth0|regulator-001",
    email: "marcus.bauer@bafin.de",
    name: "Marcus Bauer",
    roles: ["regulator"],
    jurisdiction: "eu",
    tenantId: "tenant-bafin",
    kycTier: "enhanced",
    subscriptionTier: "enterprise",
  },
  data_provider: {
    sub: "auth0|dataprovider-001",
    email: "sofia.reyes@databridge.io",
    name: "Sofia Reyes",
    roles: ["data_provider"],
    jurisdiction: "us",
    tenantId: "tenant-databridge",
    kycTier: "standard",
    subscriptionTier: "starter",
  },
  admin: {
    sub: "auth0|admin-001",
    email: "admin@gefi.io",
    name: "GeFi Admin",
    roles: ["admin"],
    jurisdiction: "eu",
    tenantId: "tenant-gefi",
    kycTier: "enhanced",
    subscriptionTier: "enterprise",
  },
  auditor: {
    sub: "auth0|auditor-001",
    email: "claire.dupont@audit-firm.fr",
    name: "Claire Dupont",
    roles: ["auditor"],
    jurisdiction: "eu",
    tenantId: "tenant-auditco",
    kycTier: "enhanced",
    subscriptionTier: "enterprise",
  },
  compliance_officer: {
    sub: "auth0|compliance-001",
    email: "james.okafor@acmecapital.com",
    name: "James Okafor",
    roles: ["compliance_officer"],
    jurisdiction: "uk",
    tenantId: "tenant-acme",
    kycTier: "enhanced",
    subscriptionTier: "institutional",
  },
};

export const PERSONA_LABELS: Record<DevPersona, string> = {
  investor: "Investor",
  developer: "Developer",
  regulator: "Regulator",
  data_provider: "Data Provider",
  admin: "Admin",
  auditor: "Auditor",
  compliance_officer: "Compliance Officer",
};

export const PERSONA_ICONS: Record<DevPersona, string> = {
  investor: "📈",
  developer: "⚡",
  regulator: "⚖️",
  data_provider: "🗄️",
  admin: "🛡️",
  auditor: "🔍",
  compliance_officer: "✅",
};
