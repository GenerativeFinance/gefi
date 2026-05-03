/**
 * App — root router.
 *
 * Routes are persona-aware: the URL structure is flat (no /investor/* prefix)
 * because each user has a single primary persona and the shell nav adapts.
 * Cross-cutting pages (compliance, federation) are accessible to all personas.
 *
 * Onboarding lives at /onboarding/* and skips the AppShell.
 */
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./layout/AppShell.js";
import { useAuth } from "./auth/AuthContext.js";
import { stubClient } from "./api/stub-client.js";
import { useLiveTicker } from "./hooks/useLiveTicker.js";
import { Spinner } from "@gefi/ui/Spinner.js";

const InvestorDashboard    = lazy(() => import("./pages/Investor/Dashboard.js"));
const InvestorPortfolio    = lazy(() => import("./pages/Investor/Portfolio.js"));
const InvestorPerformance  = lazy(() => import("./pages/Investor/Performance.js"));
const DeveloperPortal      = lazy(() => import("./pages/Developer/Portal.js"));
const DeveloperModels      = lazy(() => import("./pages/Developer/Models.js"));
const DeveloperIDE         = lazy(() => import("./pages/Developer/IDE.js"));
const DeveloperBacktest    = lazy(() => import("./pages/Developer/Backtest.js"));
const DeveloperEarnings    = lazy(() => import("./pages/Developer/Earnings.js"));
const RegulatorConsole     = lazy(() => import("./pages/Regulator/Console.js"));
const RegulatorAudit       = lazy(() => import("./pages/Regulator/Audit.js"));
const RegulatorProof       = lazy(() => import("./pages/Regulator/ProofViewer.js"));
const RegulatorStandards   = lazy(() => import("./pages/Regulator/Standards.js"));
const DataProviderPortal   = lazy(() => import("./pages/DataProvider/Portal.js"));
const DataProviderDatasets = lazy(() => import("./pages/DataProvider/Datasets.js"));
const DataProviderRounds   = lazy(() => import("./pages/DataProvider/Rounds.js"));
const DataProviderBudget   = lazy(() => import("./pages/DataProvider/Budget.js"));
const AdminConsole         = lazy(() => import("./pages/Admin/Console.js"));
const AdminUsers           = lazy(() => import("./pages/Admin/Users.js"));
const AdminModels          = lazy(() => import("./pages/Admin/ModelQueue.js"));
const AdminAnalytics       = lazy(() => import("./pages/Admin/Analytics.js"));
const AdminFlags           = lazy(() => import("./pages/Admin/FeatureFlags.js"));
const ComplianceCenter     = lazy(() => import("./pages/ComplianceCenter/index.js"));
const FederationStatus     = lazy(() => import("./pages/FederationStatus/index.js"));
const ComponentShowcase    = lazy(() => import("./pages/Components/index.js"));
const Onboarding           = lazy(() => import("./pages/Onboarding/index.js"));

function Loading(): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
      }}
    >
      <Spinner size="lg" />
    </div>
  );
}

function DefaultIndex(): React.ReactElement {
  const { persona } = useAuth();
  if (persona === "developer") return <Navigate to="/" replace />;
  if (persona === "regulator") return <Navigate to="/" replace />;
  if (persona === "data_provider") return <Navigate to="/" replace />;
  if (persona === "admin") return <Navigate to="/" replace />;
  return <Navigate to="/" replace />;
}

function AppRoutes(): React.ReactElement {
  const { persona } = useAuth();
  const { quotes } = useLiveTicker(stubClient);

  const indexPage = (): React.ReactElement => {
    switch (persona) {
      case "developer": return <DeveloperPortal />;
      case "regulator": return <RegulatorConsole />;
      case "data_provider": return <DataProviderPortal />;
      case "admin": return <AdminConsole />;
      default: return <InvestorDashboard />;
    }
  };

  return (
    <AppShell ticker={quotes}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={indexPage()} />

          {/* Investor */}
          <Route path="/investor/portfolio"    element={<InvestorPortfolio />} />
          <Route path="/investor/performance"  element={<InvestorPerformance />} />

          {/* Developer */}
          <Route path="/developer/models"   element={<DeveloperModels />} />
          <Route path="/developer/ide"      element={<DeveloperIDE />} />
          <Route path="/developer/backtest" element={<DeveloperBacktest />} />
          <Route path="/developer/earnings" element={<DeveloperEarnings />} />

          {/* Regulator */}
          <Route path="/regulator/audit"     element={<RegulatorAudit />} />
          <Route path="/regulator/proof"     element={<RegulatorProof />} />
          <Route path="/regulator/standards" element={<RegulatorStandards />} />

          {/* Data Provider */}
          <Route path="/data-provider/datasets" element={<DataProviderDatasets />} />
          <Route path="/data-provider/rounds"   element={<DataProviderRounds />} />
          <Route path="/data-provider/budget"   element={<DataProviderBudget />} />

          {/* Admin */}
          <Route path="/admin/users"     element={<AdminUsers />} />
          <Route path="/admin/models"    element={<AdminModels />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/flags"     element={<AdminFlags />} />

          {/* Cross-cutting */}
          <Route path="/compliance" element={<ComplianceCenter />} />
          <Route path="/federation" element={<FederationStatus />} />

          {/* Component showcase (Storybook substitute) */}
          <Route path="/components" element={<ComponentShowcase />} />

          <Route path="*" element={<DefaultIndex />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}

export function App(): React.ReactElement {
  return (
    <Routes>
      {/* Onboarding bypasses AppShell */}
      <Route
        path="/onboarding/*"
        element={
          <Suspense fallback={<Loading />}>
            <Onboarding />
          </Suspense>
        }
      />
      <Route path="/*" element={<AppRoutes />} />
    </Routes>
  );
}
