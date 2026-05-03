/**
 * Dashboard smoke tests.
 *
 * Tests render each major page and verifies key elements are present.
 * Uses the stub API client (no network calls).
 */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.js";

vi.mock("@gefi/ui/tokens.css", () => ({}));
vi.mock("@gefi/ui/components.css", () => ({}));
vi.mock("./styles/app.css", () => ({}));

async function renderWithProviders(
  ui: React.ReactElement,
  initialEntries = ["/"],
): Promise<ReturnType<typeof render>> {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>,
  );
}

describe("InvestorDashboard", () => {
  it("renders page header with Investor label", async () => {
    const { default: InvestorDashboard } = await import("./pages/Investor/Dashboard.js");
    await renderWithProviders(<InvestorDashboard />);
    // The page starts in loading state (Spinner); wait for the API stub to resolve.
    await waitFor(() => expect(screen.queryByText("Investor")).toBeTruthy(), { timeout: 2000 });
    expect(screen.getByText("Portfolio Overview")).toBeTruthy();
  });

  it("shows model positions table after loading", async () => {
    const { default: InvestorDashboard } = await import("./pages/Investor/Dashboard.js");
    await renderWithProviders(<InvestorDashboard />);
    await waitFor(() => expect(screen.queryByText("AlphaQuant EU")).toBeTruthy(), { timeout: 2000 });
  });

  it("shows risk exposure heatmap section", async () => {
    const { default: InvestorDashboard } = await import("./pages/Investor/Dashboard.js");
    await renderWithProviders(<InvestorDashboard />);
    await waitFor(() => expect(screen.getByText("Risk Exposure Heatmap")).toBeTruthy(), { timeout: 2000 });
  });
});

describe("DeveloperPortal", () => {
  it("renders Developer portal header", async () => {
    const { default: DeveloperPortal } = await import("./pages/Developer/Portal.js");
    await renderWithProviders(<DeveloperPortal />);
    expect(screen.getByText("Developer Portal")).toBeTruthy();
  });

  it("shows quick action buttons", async () => {
    const { default: DeveloperPortal } = await import("./pages/Developer/Portal.js");
    await renderWithProviders(<DeveloperPortal />);
    expect(screen.getByText("+ New model")).toBeTruthy();
    expect(screen.getByText("Open Cloud IDE")).toBeTruthy();
  });

  it("shows earnings metrics", async () => {
    const { default: DeveloperPortal } = await import("./pages/Developer/Portal.js");
    await renderWithProviders(<DeveloperPortal />);
    // MetricCard renders the label in multiple DOM nodes (visible + aria).
    expect(screen.getAllByText("Revenue (30d)").length).toBeGreaterThan(0);
  });
});

describe("DeveloperIDE", () => {
  it("renders Cloud IDE stub with deferred notice", async () => {
    const { default: DeveloperIDE } = await import("./pages/Developer/IDE.js");
    await renderWithProviders(<DeveloperIDE />);
    expect(screen.getByText("Cloud IDE")).toBeTruthy();
    expect(screen.getByText("Coming post-launch")).toBeTruthy();
  });
});

describe("RegulatorConsole", () => {
  it("renders Regulator heading", async () => {
    const { default: RegulatorConsole } = await import("./pages/Regulator/Console.js");
    await renderWithProviders(<RegulatorConsole />);
    expect(screen.getByText("Regulatory Console")).toBeTruthy();
  });

  it("shows audit log section after loading", async () => {
    const { default: RegulatorConsole } = await import("./pages/Regulator/Console.js");
    await renderWithProviders(<RegulatorConsole />);
    await waitFor(() => expect(screen.getByText("Hash-Chained Audit Log")).toBeTruthy(), { timeout: 2000 });
  });

  it("renders quick action buttons", async () => {
    const { default: RegulatorConsole } = await import("./pages/Regulator/Console.js");
    await renderWithProviders(<RegulatorConsole />);
    expect(screen.getByText("Issue legal hold")).toBeTruthy();
  });
});

describe("ProofViewer", () => {
  it("renders cryptographic proof viewer", async () => {
    const { default: ProofViewer } = await import("./pages/Regulator/ProofViewer.js");
    await renderWithProviders(<ProofViewer />);
    expect(screen.getByText("Cryptographic Proof Viewer")).toBeTruthy();
  });

  it("shows entry lookup input", async () => {
    const { default: ProofViewer } = await import("./pages/Regulator/ProofViewer.js");
    await renderWithProviders(<ProofViewer />);
    expect(screen.getByLabelText("Audit entry ID")).toBeTruthy();
  });
});

describe("DataProviderPortal", () => {
  it("renders Data Provider portal", async () => {
    const { default: DataProviderPortal } = await import("./pages/DataProvider/Portal.js");
    await renderWithProviders(<DataProviderPortal />);
    expect(screen.getByText("Data Provider Portal")).toBeTruthy();
  });

  it("shows privacy budget gauge", async () => {
    const { default: DataProviderPortal } = await import("./pages/DataProvider/Portal.js");
    await renderWithProviders(<DataProviderPortal />);
    expect(screen.getByText("Privacy Budget")).toBeTruthy();
  });
});

describe("AdminConsole", () => {
  it("renders Admin console header", async () => {
    const { default: AdminConsole } = await import("./pages/Admin/Console.js");
    await renderWithProviders(<AdminConsole />);
    expect(screen.getByText("Admin Console")).toBeTruthy();
  });

  it("shows quick action links", async () => {
    const { default: AdminConsole } = await import("./pages/Admin/Console.js");
    await renderWithProviders(<AdminConsole />);
    expect(screen.getByText("Model approval queue")).toBeTruthy();
    expect(screen.getByText("User moderation")).toBeTruthy();
    expect(screen.getByText("Feature flags")).toBeTruthy();
  });
});

describe("AdminFeatureFlags", () => {
  it("renders feature flags page", async () => {
    const { default: AdminFeatureFlags } = await import("./pages/Admin/FeatureFlags.js");
    await renderWithProviders(<AdminFeatureFlags />);
    expect(screen.getByText("Feature Flags")).toBeTruthy();
  });

  it("shows toggles for flags", async () => {
    const { default: AdminFeatureFlags } = await import("./pages/Admin/FeatureFlags.js");
    await renderWithProviders(<AdminFeatureFlags />);
    const toggles = screen.getAllByRole("button", { name: /Enable|Disable/i });
    expect(toggles.length).toBeGreaterThan(3);
  });
});

describe("ComplianceCenter", () => {
  it("renders Compliance Status Center", async () => {
    const { default: ComplianceCenter } = await import("./pages/ComplianceCenter/index.js");
    await renderWithProviders(<ComplianceCenter />);
    expect(screen.getByText("Compliance Status Center")).toBeTruthy();
  });

  it("shows notify all button", async () => {
    const { default: ComplianceCenter } = await import("./pages/ComplianceCenter/index.js");
    await renderWithProviders(<ComplianceCenter />);
    expect(screen.getByText(/Notify all auditors/i)).toBeTruthy();
  });

  it("shows upcoming audit calendar", async () => {
    const { default: ComplianceCenter } = await import("./pages/ComplianceCenter/index.js");
    await renderWithProviders(<ComplianceCenter />);
    expect(screen.getByText("Upcoming Audit Calendar")).toBeTruthy();
  });
});

describe("FederationStatus", () => {
  it("renders Federation Status Dashboard", async () => {
    const { default: FederationStatus } = await import("./pages/FederationStatus/index.js");
    await renderWithProviders(<FederationStatus />);
    expect(screen.getByText("Federation Status Dashboard")).toBeTruthy();
  });

  it("shows network topology section", async () => {
    const { default: FederationStatus } = await import("./pages/FederationStatus/index.js");
    await renderWithProviders(<FederationStatus />);
    expect(screen.getByText("Network Topology")).toBeTruthy();
  });
});

describe("ComponentShowcase", () => {
  it("renders the component showcase page", async () => {
    const { default: ComponentShowcase } = await import("./pages/Components/index.js");
    await renderWithProviders(<ComponentShowcase />);
    expect(screen.getByText("Component Showcase")).toBeTruthy();
  });

  it("shows all component sections", async () => {
    const { default: ComponentShowcase } = await import("./pages/Components/index.js");
    await renderWithProviders(<ComponentShowcase />);
    expect(screen.getByText("Button")).toBeTruthy();
    expect(screen.getByText("MetricCard")).toBeTruthy();
    expect(screen.getByText("Gauge")).toBeTruthy();
    expect(screen.getByText("Design tokens")).toBeTruthy();
  });
});

describe("Onboarding", () => {
  it("renders step 1 jurisdiction picker", async () => {
    const { default: Onboarding } = await import("./pages/Onboarding/index.js");
    render(
      // Onboarding's inner <Routes> uses path="/" for step 1 — root path matches.
      <MemoryRouter initialEntries={["/"]}>
        <AuthProvider><Onboarding /></AuthProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText("Where are you based?")).toBeTruthy();
  });

  it("shows continue button disabled with no jurisdiction selected", async () => {
    const { default: Onboarding } = await import("./pages/Onboarding/index.js");
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AuthProvider><Onboarding /></AuthProvider>
      </MemoryRouter>,
    );
    const btn = screen.getByText("Continue →").closest("button");
    expect(btn).toBeDisabled();
  });
});

describe("RoleGate", () => {
  it("hides content for investor when action is publish:model", async () => {
    const { RoleGate } = await import("./auth/RoleGate.js");
    await renderWithProviders(
      <RoleGate action="publish" resource="model" fallback={<span>No access</span>}>
        <span>Publish button</span>
      </RoleGate>,
    );
    expect(screen.getByText("No access")).toBeTruthy();
    expect(screen.queryByText("Publish button")).toBeNull();
  });

  it("shows content for investor when action is read:model", async () => {
    const { RoleGate } = await import("./auth/RoleGate.js");
    await renderWithProviders(
      <RoleGate action="read" resource="model">
        <span>Model detail</span>
      </RoleGate>,
    );
    expect(screen.getByText("Model detail")).toBeTruthy();
  });
});

describe("canPerform (RoleGate)", () => {
  it("investor can read models", async () => {
    const { canPerform } = await import("./auth/RoleGate.js");
    expect(canPerform(["investor"], "read", "model")).toBe(true);
  });

  it("investor cannot publish models", async () => {
    const { canPerform } = await import("./auth/RoleGate.js");
    expect(canPerform(["investor"], "publish", "model")).toBe(false);
  });

  it("admin can do everything", async () => {
    const { canPerform } = await import("./auth/RoleGate.js");
    expect(canPerform(["admin"], "create", "model")).toBe(true);
    expect(canPerform(["admin"], "delete", "audit_log")).toBe(true);
    expect(canPerform(["admin"], "publish", "research_note")).toBe(true);
  });

  it("regulator can read audit log but not create subscriptions", async () => {
    const { canPerform } = await import("./auth/RoleGate.js");
    expect(canPerform(["regulator"], "read", "audit_log")).toBe(true);
    expect(canPerform(["regulator"], "create", "subscription")).toBe(false);
  });

  it("developer can publish model", async () => {
    const { canPerform } = await import("./auth/RoleGate.js");
    expect(canPerform(["developer"], "publish", "model")).toBe(true);
  });
});
