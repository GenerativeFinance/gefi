import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
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
import AuthFlow from "@/pages/AuthFlow";
import LoginFailed from "@/pages/login-failed";
import AccountPending from "@/pages/account-pending";
import Portfolio from "@/pages/portfolio";
import Reports from "@/pages/reports";
import ReportsAll from "@/pages/reports-all";
import AlertsAll from "@/pages/alerts-all";
import RiskManagement from "@/pages/risk-management";
import Marketplace from "@/pages/marketplace";
import Pricing from "@/pages/pricing";
import Checkout from "@/pages/checkout";
import PrivacyPolicy from "@/pages/privacy-policy";

import UserProfile from "@/pages/user-profile";
import Settings from "@/pages/settings";
import Wallet from "@/pages/wallet";
import DeveloperDashboard from "@/pages/developer-dashboard";
import DeveloperMarketplace from "@/pages/developer-marketplace";
const BacktestingEnvironment = lazy(() => import("./pages/BacktestingEnvironment"));
import LiveTradingPage from "@/pages/live-trading";
import Bounties from "@/pages/bounties";
import BountyLeaderboard from "@/pages/bounty-leaderboard";
import UserDetail from "@/pages/user-detail";
import RiskAssessmentModels from "@/pages/risk-assessment-models";
import DataProviderDashboard from "@/pages/data-provider-dashboard";
import DataProviderUsage from "@/pages/data-provider/usage";
import DataProviderQuality from "@/pages/data-provider/quality";
import DataProviderRevenue from "@/pages/data-provider/revenue";
import DataProviderReviews from "@/pages/data-provider/reviews";
import DataProviderScore from "@/pages/data-provider/score";
import DataProviderDataCatalogs from "@/pages/data-provider/data/catalogs";
import DataProviderDataMetadata from "@/pages/data-provider/data/metadata";
import DataProviderDataVersioning from "@/pages/data-provider/data/versioning";
import RegulatorDashboard from "@/pages/regulator-dashboard";
import RegulatorModelAudits from "@/pages/regulator/model-audits";
import RegulatorDatasetAudits from "@/pages/regulator/dataset-audits";
import RegulatorComplianceIssues from "@/pages/regulator/compliance-issues";
import RegulatorCommunications from "@/pages/regulator/communications";
import RegulatorStandards from "@/pages/regulator/standards";
import RegulatorExperienceEnhanced from "@/pages/regulator-experience-enhanced";
import Learning from "@/pages/learning";
import InvestorLearning from "@/pages/investor-learning";
import TermsOfService from "@/pages/terms-of-service";
import DataProcessingAgreement from "@/pages/data-processing-agreement";
import SecurityCompliance from "@/pages/security-compliance";
import BugBountyProgram from "@/pages/bug-bounty-program";
import EnterpriseSales from "@/pages/enterprise-sales";
import ModelFunding from "@/pages/model-funding";
import BountyFunding from "@/pages/bounty-funding";
import BotFunding from "@/pages/bot-funding";
import UserAccess from "@/pages/user-access";
import Billing from "@/pages/billing";
import Storage from "@/pages/storage";
import MobileDemo from "@/pages/mobile-demo";
import WalletManagement from "@/pages/wallet-management";
import ServerManagement from "@/pages/server-management";
import ApiAccess from "@/pages/api-access";


import ProfileSetup from "@/pages/profile-setup";
import ModelProfile from "@/pages/model-profile";
import TradingBots from "@/pages/trading-bots";
import Web3DeFi from "@/pages/web3-defi";
import BlockchainContracts from "@/pages/blockchain-contracts";
import MarketSentiment from "@/pages/market-sentiment";
import AIModels from "@/pages/ai-models";
import InvestorReports from "@/pages/investor/reports";
import CreateCustomReport from "@/pages/investor/create-custom-report";
import Community from "@/pages/community";
import Docs from "@/pages/docs";
import Webinars from "@/pages/webinars";
import PortfolioAI from "@/pages/portfolio-ai-models";
import Strategies from "@/pages/strategies";
import Orders from "@/pages/orders";
import AdminDashboard from "@/pages/admin-dashboard";
import ModeratorDashboard from "@/pages/moderator-dashboard";
import AdminUserManagement from "@/pages/admin-user-management";
import AdminContentModeration from "@/pages/admin-content-moderation";
import AdminSecurity from "@/pages/admin-security";
import AdminSupport from "@/pages/admin-support";
import AdminAnalytics from "@/pages/admin-analytics";
import ModeratorContentReview from "@/pages/moderator-content-review";
import ModeratorSupportTickets from "@/pages/moderator-support-tickets";
import ModeratorUserMonitoring from "@/pages/moderator-user-monitoring";
import ModeratorAnalytics from "@/pages/moderator-analytics";
import RiskDistribution from "@/pages/risk-distribution";
import Funding from "@/pages/funding";
import RebalanceActions from "@/pages/rebalance-actions";
import PortfolioPerformance from "@/pages/portfolio-performance";
import InvestorDashboard from "@/pages/investor-dashboard";
import RiskAssessment from "@/pages/risk-assessment";
import CurrentRiskAssessment from "@/pages/current-risk-assessment";
import OrderBook from "@/pages/order-book";
import MySubscriptions from "@/pages/my-subscriptions";
import Developers from "@/pages/developers";
import Categories from "@/pages/categories";
import Tutorials from "@/pages/tutorials";
import ComplianceReports from "@/pages/compliance-reports";
import RiskReports from "@/pages/risk-reports";
import MarketData from "@/pages/market-data";
import CustomReports from "@/pages/custom-reports";
import DeveloperProfile from "@/pages/developer-profile";
import DataProviderProfile from "@/pages/data-provider-profile";
import RegulatorProfile from "@/pages/regulator-profile";
import InvestmentInsights from "@/pages/investment-insights";
import DataProviderDatasets from "@/pages/data-provider/datasets";
import DataProviderMarketInsights from "@/pages/data-provider/market-insights";
import DataProviderPortfolio from "@/pages/data-provider/portfolio";
import DataProviderAIMarketplace from "@/pages/data-provider/ai-marketplace";
import DataProviderCollaboration from "@/pages/data-provider/collaboration";
import DataProviderLearning from "@/pages/data-provider-learning";
import DataProviderLearningPage from "@/pages/data-provider/learning";
import DeveloperLearningPage from "@/pages/developer/learning";
import DataProviderEnhanced from "@/pages/data-provider-enhanced";
import InvestorCollaboration from "@/pages/collaboration";
import CollaborationProjects from "@/pages/collaboration/projects";
import CollaborationTeams from "@/pages/collaboration/teams";
import CollaborationMessaging from "@/pages/collaboration/messaging";
import CollaborationResources from "@/pages/collaboration/resources";
import DeveloperCollaboration from "@/pages/developer/collaboration";
import DeveloperCollaborationProjects from "@/pages/developer/collaboration/projects";
import DeveloperCollaborationInvitations from "@/pages/developer/collaboration/invitations";
import DeveloperCollaborationResources from "@/pages/developer/collaboration/resources";
import DeveloperCollaborationMessaging from "@/pages/developer/collaboration/messaging";
import DeveloperCollaborationCompliance from "@/pages/developer/collaboration/compliance";
import DeveloperCollaborationNotifications from "@/pages/developer/collaboration/notifications";
import DataProviderDatasetOverview from "@/pages/data-provider/portfolio/dataset-overview";
import DataProviderUsageStatistics from "@/pages/data-provider/portfolio/usage-statistics";
import DataProviderQualityMetrics from "@/pages/data-provider/portfolio/quality-metrics";
import DataProviderRevenueTracking from "@/pages/data-provider/portfolio/revenue-tracking";
import DataProviderComplianceStatus from "@/pages/data-provider/portfolio/compliance-status";
import DataProviderReviewsFeedback from "@/pages/data-provider/portfolio/reviews-feedback";
import DataProviderCollaborationHistory from "@/pages/data-provider/portfolio/collaboration-history";
import DataProviderPortfolioScore from "@/pages/data-provider/portfolio/portfolio-score";
import DeveloperPortfolioAIModels from "@/pages/developer/portfolio/ai-models";
import DeveloperPortfolioPerformance from "@/pages/developer/portfolio/performance";
import DeveloperPortfolioActivity from "@/pages/developer/portfolio/activity";
import DeveloperPortfolioFunding from "@/pages/developer/portfolio/funding";
import DeveloperPortfolioFeedback from "@/pages/developer/portfolio/feedback";
import DeveloperPortfolioCompliance from "@/pages/developer/portfolio/compliance";
import DeveloperCollaborationDataUsage from "@/pages/developer/portfolio/collaboration/data-usage";
import DeveloperCollaborationInvestorInteractions from "@/pages/developer/portfolio/collaboration/investor-interactions";
import DeveloperCollaborationProjectInvolvement from "@/pages/developer/portfolio/collaboration/project-involvement";
import DeveloperPortfolioScoreOverall from "@/pages/developer/portfolio/score/overall";
import DeveloperPortfolioScoreMilestones from "@/pages/developer/portfolio/score/milestones";
import DeveloperPortfolioScore from "@/pages/developer/portfolio/score";
import DeveloperDevelopIDEAccess from "@/pages/developer/develop/ide-access";
import DeveloperDevelopVersionControl from "@/pages/developer/develop/version-control";
import DeveloperDevelopCodeReview from "@/pages/developer/develop/code-review";
import DeveloperPortfolioCollaborationHistory from "@/pages/developer/portfolio/collaboration-history";
import DataProviderMarketplace from "@/pages/data-provider-marketplace";
import DeveloperCollaborationMain from "@/pages/developer/collaboration";
import MyProfile from "@/pages/my-profile";
import ModelDetail from "@/pages/model-detail";
import CategoryPage from "@/pages/category/[categoryName]";
import DataProviders from "@/pages/data-providers";
import DeveloperPortfolioOverview from "@/pages/developer/portfolio-overview";
import DataProviderPortfolioOverview from "@/pages/data-provider/portfolio-overview";
import SupportDashboard from "@/pages/support-dashboard";




function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading only for initial auth check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes - always available */}
      <Route path="/login" component={AuthFlow} />
      <Route path="/login-failed" component={LoginFailed} />
      <Route path="/account-pending" component={AccountPending} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/data-processing-agreement" component={DataProcessingAgreement} />
      <Route path="/security-compliance" component={SecurityCompliance} />
      <Route path="/bug-bounty-program" component={BugBountyProgram} />
      <Route path="/enterprise-sales" component={EnterpriseSales} />
      <Route path="/profile-setup" component={ProfileSetup} />
      
      {/* Protected routes */}
      {isAuthenticated ? (
          <>
            <Route path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/analytics" component={AnalyticsDashboard} />
            <Route path="/portfolio" component={Portfolio} />
            <Route path="/portfolio/ai-models" component={PortfolioAI} />
            <Route path="/portfolio/risk-distribution" component={RiskDistribution} />
            <Route path="/portfolio/rebalance" component={RebalanceActions} />
            <Route path="/risk-management/assessment" component={RiskAssessment} />
            <Route path="/reports" component={Reports} />
            <Route path="/reports/all" component={ReportsAll} />
            <Route path="/alerts/all" component={AlertsAll} />
            <Route path="/risk-management" component={RiskManagement} />
            <Route path="/risk-dashboard" component={RiskManagement} />
            <Route path="/marketplace" component={Marketplace} />
            <Route path="/model/:id" component={ModelDetail} />
            <Route path="/risk-assessment-models" component={RiskAssessmentModels} />
            <Route path="/data-provider" component={DataProviderDashboard} />
            <Route path="/data-provider-marketplace" component={DataProviderMarketplace} />
            <Route path="/regulator" component={RegulatorDashboard} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/checkout" component={Checkout} />

            <Route path="/profile" component={MyProfile} />
            <Route path="/profile/:userType/:userId" component={UserProfile} />
            <Route path="/settings" component={Settings} />
            <Route path="/wallet" component={Wallet} />
            <Route path="/wallet-management" component={WalletManagement} />
            <Route path="/server-management" component={ServerManagement} />
            <Route path="/mobile-demo" component={MobileDemo} />
            <Route path="/profile-setup" component={ProfileSetup} />
            <Route path="/user-access" component={UserAccess} />
            <Route path="/billing" component={Billing} />
            <Route path="/storage" component={Storage} />
            <Route path="/api-access" component={ApiAccess} />
            <Route path="/developer" component={DeveloperDashboard} />
            <Route path="/developer-marketplace" component={DeveloperMarketplace} />
            <Route path="/developer/collaboration" component={DeveloperCollaborationMain} />
            <Route path="/backtesting" component={BacktestingEnvironment} />
            <Route path="/live-trading" component={LiveTradingPage} />
            <Route path="/model-funding" component={ModelFunding} />
            <Route path="/bounty-funding" component={BountyFunding} />
            <Route path="/bot-funding" component={BotFunding} />

            <Route path="/bounties" component={Bounties} />
            <Route path="/bounties/leaderboard" component={BountyLeaderboard} />
            <Route path="/user/:userId" component={UserProfile} />
            <Route path="/developer/:developerId" component={DeveloperProfile} />
            <Route path="/data-provider/:providerId" component={DataProviderProfile} />
            <Route path="/learning" component={Learning} />
            <Route path="/investor-learning" component={InvestorLearning} />
            <Route path="/model/:id" component={ModelProfile} />
            <Route path="/trading-bots" component={TradingBots} />
            <Route path="/web3-defi" component={Web3DeFi} />
            <Route path="/smart-contracts" component={BlockchainContracts} />
            <Route path="/market-sentiment" component={MarketSentiment} />
            <Route path="/ai-models" component={AIModels} />
            <Route path="/risk-distribution" component={RiskDistribution} />
            <Route path="/rebalance-actions" component={RebalanceActions} />
            <Route path="/current-risk-assessment" component={CurrentRiskAssessment} />
            <Route path="/order-book" component={OrderBook} />
            <Route path="/community" component={Community} />
            <Route path="/docs" component={Docs} />
            <Route path="/webinars" component={Webinars} />
            <Route path="/strategies" component={Strategies} />
            <Route path="/orders" component={Orders} />
            <Route path="/funding" component={Funding} />
            <Route path="/portfolio-performance" component={PortfolioPerformance} />
            <Route path="/investor-dashboard" component={InvestorDashboard} />
            <Route path="/my-subscriptions" component={MySubscriptions} />
            <Route path="/developers" component={Developers} />
            <Route path="/data-providers" component={DataProviders} />
            <Route path="/categories" component={Categories} />
            <Route path="/category/:categoryName" component={CategoryPage} />
            <Route path="/tutorials" component={Tutorials} />
            <Route path="/compliance-reports" component={ComplianceReports} />
            <Route path="/risk-reports" component={RiskReports} />
            <Route path="/custom-reports" component={CustomReports} />
            <Route path="/market-data" component={MarketData} />
            <Route path="/investment-insights" component={InvestmentInsights} />
            <Route path="/regulator" component={RegulatorDashboard} />
            <Route path="/regulator/model-audits" component={RegulatorModelAudits} />
            <Route path="/regulator/dataset-audits" component={RegulatorDatasetAudits} />
            <Route path="/regulator/compliance-issues" component={RegulatorComplianceIssues} />
            <Route path="/regulator/communications" component={RegulatorCommunications} />
            <Route path="/regulator/standards" component={RegulatorStandards} />
            <Route path="/regulator/experience-enhanced" component={RegulatorExperienceEnhanced} />
            <Route path="/regulator/:regulatorId" component={RegulatorProfile} />
            <Route path="/data-provider/datasets" component={DataProviderDatasets} />
            <Route path="/data-provider/market-insights" component={DataProviderMarketInsights} />
            <Route path="/data-provider/portfolio" component={DataProviderPortfolioOverview} />
            <Route path="/data-provider/ai-marketplace" component={DataProviderAIMarketplace} />
            <Route path="/data-provider/collaboration" component={DataProviderCollaboration} />
            <Route path="/data-provider/learning" component={DataProviderLearningPage} />
            <Route path="/data-provider/portfolio/usage" component={DataProviderUsageStatistics} />
            <Route path="/data-provider/portfolio/quality" component={DataProviderQualityMetrics} />
            <Route path="/data-provider/portfolio/revenue" component={DataProviderRevenueTracking} />
            <Route path="/data-provider/portfolio/compliance" component={DataProviderComplianceStatus} />
            <Route path="/data-provider/portfolio/feedback" component={DataProviderReviewsFeedback} />
            <Route path="/data-provider/portfolio/score" component={DataProviderPortfolioScore} />
            <Route path="/data-provider/data/catalogs" component={DataProviderDataCatalogs} />
            <Route path="/data-provider/data/metadata" component={DataProviderDataMetadata} />
            <Route path="/data-provider/data/versioning" component={DataProviderDataVersioning} />
            <Route path="/investor/reports" component={InvestorReports} />
            <Route path="/investor/create-custom-report" component={CreateCustomReport} />
            <Route path="/data-provider/enhanced" component={DataProviderEnhanced} />
            <Route path="/developer/learning" component={DeveloperLearningPage} />
            <Route path="/developer/portfolio" component={DeveloperPortfolioOverview} />
            <Route path="/developer/portfolio/ai-models" component={DeveloperPortfolioAIModels} />
            <Route path="/developer/portfolio/performance" component={DeveloperPortfolioPerformance} />
            <Route path="/developer/portfolio/activity" component={DeveloperPortfolioActivity} />
            <Route path="/developer/portfolio/funding" component={DeveloperPortfolioFunding} />
            <Route path="/developer/portfolio/feedback" component={DeveloperPortfolioFeedback} />
            <Route path="/developer/portfolio/compliance" component={DeveloperPortfolioCompliance} />
            <Route path="/developer/portfolio/collaboration/data-usage" component={DeveloperCollaborationDataUsage} />
            <Route path="/developer/portfolio/collaboration/investor-interactions" component={DeveloperCollaborationInvestorInteractions} />
            <Route path="/developer/portfolio/collaboration/project-involvement" component={DeveloperCollaborationProjectInvolvement} />
            <Route path="/developer/portfolio/score" component={DeveloperPortfolioScore} />
            <Route path="/developer/portfolio/score/overall" component={DeveloperPortfolioScoreOverall} />
            <Route path="/developer/portfolio/score/milestones" component={DeveloperPortfolioScoreMilestones} />
            <Route path="/developer/develop/ide-access" component={DeveloperDevelopIDEAccess} />
            <Route path="/developer/develop/version-control" component={DeveloperDevelopVersionControl} />
            <Route path="/developer/develop/code-review" component={DeveloperDevelopCodeReview} />
            <Route path="/developer/portfolio/collaboration-history" component={DeveloperPortfolioCollaborationHistory} />
            <Route path="/collaboration" component={InvestorCollaboration} />
            <Route path="/collaboration/projects" component={CollaborationProjects} />
            <Route path="/collaboration/teams" component={CollaborationTeams} />
            <Route path="/collaboration/messaging" component={CollaborationMessaging} />
            <Route path="/collaboration/resources" component={CollaborationResources} />
            <Route path="/developer/collaboration" component={DeveloperCollaboration} />
            <Route path="/developer/collaboration/projects" component={DeveloperCollaborationProjects} />
            <Route path="/developer/collaboration/invitations" component={DeveloperCollaborationInvitations} />
            <Route path="/developer/collaboration/resources" component={DeveloperCollaborationResources} />
            <Route path="/developer/collaboration/messaging" component={DeveloperCollaborationMessaging} />
            <Route path="/developer/collaboration/compliance" component={DeveloperCollaborationCompliance} />
            <Route path="/developer/collaboration/notifications" component={DeveloperCollaborationNotifications} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/users" component={AdminUserManagement} />
            <Route path="/admin/content" component={AdminContentModeration} />
            <Route path="/admin/security" component={AdminSecurity} />
            <Route path="/admin/support" component={AdminSupport} />
            <Route path="/admin/analytics" component={AdminAnalytics} />
            <Route path="/moderator" component={ModeratorDashboard} />
            <Route path="/moderator/content-review" component={ModeratorContentReview} />
            <Route path="/moderator/support-tickets" component={ModeratorSupportTickets} />
            <Route path="/moderator/user-monitoring" component={ModeratorUserMonitoring} />
            <Route path="/moderator/analytics" component={ModeratorAnalytics} />
            <Route path="/support" component={SupportDashboard} />
            <Route path="/profile" component={MyProfile} />
            <Route path="/profile/:userType/:userId" component={UserProfile} />
          </>
      ) : (
        <>
          <Route path="/" component={Landing} />
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
