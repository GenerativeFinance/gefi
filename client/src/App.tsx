import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Web3Provider } from "@/contexts/Web3Context";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import Login from "@/pages/login";
import LoginFailed from "@/pages/login-failed";
import Portfolio from "@/pages/portfolio";
import Reports from "@/pages/reports";
import ReportsAll from "@/pages/reports-all";
import AlertsAll from "@/pages/alerts-all";
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
import LiveTradingPage from "@/pages/live-trading";
import Bounties from "@/pages/bounties";
import BountyLeaderboard from "@/pages/bounty-leaderboard";
import UserDetail from "@/pages/user-detail";
import Learning from "@/pages/learning";
import TermsOfService from "@/pages/terms-of-service";
import DataProcessingAgreement from "@/pages/data-processing-agreement";
import SecurityCompliance from "@/pages/security-compliance";
import BugBountyProgram from "@/pages/bug-bounty-program";
import EnterpriseSales from "@/pages/enterprise-sales";
import ModelFunding from "@/pages/model-funding";
import BountyFunding from "@/pages/bounty-funding";
import ProfileSetup from "@/pages/profile-setup";
import ModelProfile from "@/pages/model-profile";
import TradingBots from "@/pages/trading-bots";
import Web3DeFi from "@/pages/web3-defi";

function Router() {
  const { isAuthenticated, isLoading, user, hasCompletedProfile } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      <Route path="/login-failed" component={LoginFailed} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/data-processing-agreement" component={DataProcessingAgreement} />
      <Route path="/security-compliance" component={SecurityCompliance} />
      <Route path="/bug-bounty-program" component={BugBountyProgram} />
      <Route path="/enterprise-sales" component={EnterpriseSales} />
      
      {/* Profile setup route */}
      <Route path="/profile-setup" component={ProfileSetup} />
      
      {/* Protected routes */}
      {isAuthenticated ? (
        hasCompletedProfile ? (
          <>
            <Route path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/analytics" component={AnalyticsDashboard} />
            <Route path="/portfolio" component={Portfolio} />
            <Route path="/reports" component={Reports} />
            <Route path="/reports/all" component={ReportsAll} />
            <Route path="/alerts/all" component={AlertsAll} />
            <Route path="/risk-management" component={RiskManagement} />
            <Route path="/marketplace" component={Marketplace} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/learning-center" component={LearningCenter} />
            <Route path="/profile" component={UserProfile} />
            <Route path="/settings" component={Settings} />
            <Route path="/profile-setup" component={ProfileSetup} />
            <Route path="/developer" component={DeveloperDashboard} />
            <Route path="/backtesting" component={BacktestingEnvironment} />
            <Route path="/live-trading" component={LiveTradingPage} />
            <Route path="/model-funding" component={ModelFunding} />
            <Route path="/bounty-funding" component={BountyFunding} />
            <Route path="/bot-funding" component={BotFunding} />
            <Route path="/bounties" component={Bounties} />
            <Route path="/bounties/leaderboard" component={BountyLeaderboard} />
            <Route path="/user/:userId" component={UserDetail} />
            <Route path="/learning" component={Learning} />
            <Route path="/model/:id" component={ModelProfile} />
            <Route path="/trading-bots" component={TradingBots} />
            <Route path="/web3-defi" component={Web3DeFi} />
          </>
        ) : (
          <>
            <Route path="/" component={ProfileSetup} />
            <Route path="*" component={ProfileSetup} />
          </>
        )
      ) : (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/login-failed" component={LoginFailed} />
          <Route path="*" component={Landing} />
        </>
      )}
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Web3Provider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </Web3Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
