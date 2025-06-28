import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import Login from "@/pages/login";
import LoginFailed from "@/pages/login-failed";
import Portfolio from "@/pages/portfolio";
import Reports from "@/pages/reports";
import RiskManagement from "@/pages/risk-management";
import Marketplace from "@/pages/marketplace";
import Pricing from "@/pages/pricing";
import Checkout from "@/pages/checkout";
import PrivacyPolicy from "@/pages/privacy-policy";
import LearningCenter from "@/pages/learning-center";
import UserProfile from "@/pages/user-profile";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Always available routes */}
      <Route path="/login" component={Login} />
      <Route path="/login-failed" component={LoginFailed} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/learning-center" component={LearningCenter} />
      
      {/* Dashboard and analytics - always accessible for testing */}
      <Route path="/dashboard" component={AnalyticsDashboard} />
      <Route path="/analytics" component={AnalyticsDashboard} />
      
      {/* Other app routes */}
      <Route path="/home" component={Home} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/reports" component={Reports} />
      <Route path="/risk-management" component={RiskManagement} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/profile" component={UserProfile} />
      
      {/* Default route */}
      <Route path="/" component={isLoading ? () => <div>Loading...</div> : isAuthenticated ? AnalyticsDashboard : Landing} />
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />

        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
