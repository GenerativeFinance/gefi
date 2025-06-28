import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { ThemeProvider } from "@/components/theme/theme-provider";
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
import Settings from "@/pages/settings";
import DeveloperDashboard from "@/pages/developer-dashboard";
import BacktestingEnvironment from "@/pages/backtesting";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/login-failed" component={LoginFailed} />
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Login} />
      ) : (
        <>
          <Route path="/" component={AnalyticsDashboard} />
          <Route path="/home" component={Home} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/reports" component={Reports} />
          <Route path="/risk-management" component={RiskManagement} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/learning-center" component={LearningCenter} />
          <Route path="/profile" component={UserProfile} />
          <Route path="/settings" component={Settings} />
          <Route path="/developer" component={DeveloperDashboard} />
          <Route path="/backtesting" component={BacktestingEnvironment} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
