import { useState, useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SearchModal } from "@/components/search/SearchModal";
import { NotificationBell } from "@/components/NotificationBell";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Home, 
  TrendingUp, 
  FileText, 
  Shield, 
  Bot,
  BarChart3,
  Code,
  Target,
  GraduationCap,
  CircleDollarSign,
  DollarSign,
  BookOpen,
  Moon,
  Sun,
  ChevronDown,
  Wallet,
  Brain,
  AlertTriangle,
  Users,
  Zap,
  PlugZap,
  Globe,
  Store,
  Activity,
  PieChart,
  TrendingDown,
  Grid,
  Grid3x3,
  CreditCard,
  Building,
  Video,
  Database,
  Key,
  HardDrive,
  Flag,
  CheckCircle,
  Star,
  Award,
  MessageCircle,
  GitBranch,
  BookmarkCheck,
  Briefcase,
  UserPlus,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme/theme-provider";
import { useQuery } from "@tanstack/react-query";

// Helper function to map role to user type for display
const mapRoleToUserType = (role?: string): string => {
  if (!role) return 'User';
  
  const roleMap: Record<string, string> = {
    'admin': 'Admin',
    'moderator': 'Moderator', 
    'developer': 'Developer',
    'data_provider': 'Data Provider',
    'regulator': 'Regulator',
    'investor': 'Investor',
    'portfolio_manager': 'Portfolio Manager',
    'fund_manager': 'Fund Manager',
    'wealth_manager': 'Wealth Manager',
    'wealth_manager_financial_advisor': 'Wealth Manager / Financial Advisor',
    'trader': 'Trader',
    'analyst': 'Analyst',
    'analyst_equity_credit_quant': 'Analyst (Equity / Credit / Quant)',
    'risk_manager': 'Risk Manager',
    'treasury_manager': 'Treasury Manager',
    'institutional_allocator': 'Institutional Allocator',
    'venture_capitalist': 'Venture Capitalist',
    'private_equity_partner': 'Private Equity Partner',
    'angel_investor': 'Angel Investor',
    'family_office_representative': 'Family Office Representative',
    'corporate_finance_executive': 'Corporate Finance Executive'
  };
  
  return roleMap[role.toLowerCase()] || 'User';
};

export default function Header() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);


  // Check if we're on developer pages
  const isDeveloperPage = location.startsWith('/developer') || 
                         location.startsWith('/backtesting') || 
                         location.startsWith('/bounties') || 
                         location.startsWith('/model-funding') ||
                         location.startsWith('/bounty-funding') ||
                         location.startsWith('/bot-funding') ||
                         location.startsWith('/market-data') ||
                         location === '/learning';

  // Fetch notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });

  const notificationsArray = Array.isArray(notifications) ? notifications : [];
  const unreadCount = notificationsArray.filter((n: any) => !n.read).length;

  // Submenu items based on current location
  const getSubmenuItems = () => {
    if (location.startsWith('/market-insights') || location === '/market-sentiment') {
      return [
        { name: "Overview", href: "/", icon: BarChart3 },
        { name: "Real-Time Data", href: "/live-trading", icon: TrendingUp },
        { name: "AI Insights", href: "/market-insights", icon: Brain },
        { name: "Market Sentiment", href: "/market-sentiment", icon: BarChart3 },
        { name: "AI Marketplace", href: "/marketplace", icon: Store },
        { name: "Alerts", href: "/alerts", icon: AlertTriangle }
      ];
    }
    
    if (location.startsWith('/portfolio') || location.startsWith('/rebalance-actions')) {
      return [
        { name: "Overview", href: "/", icon: BarChart3 },
        { name: "Portfolio", href: "/portfolio", icon: Wallet },
        { name: "AI Models", href: "/portfolio/ai-models", icon: Bot },
        { name: "Rebalancing", href: "/rebalance-actions", icon: Target },
        { name: "Performance", href: "/portfolio-performance", icon: TrendingUp }
      ];
    }
    
    if (location.startsWith('/reports') || location.startsWith('/risk-reports') || location.startsWith('/compliance-reports') || location.startsWith('/custom-reports')) {
      return [
        { name: "Overview", href: "/", icon: BarChart3 },
        { name: "Reports", href: "/reports", icon: FileText },
        { name: "Risk Analysis", href: "/risk-reports", icon: Shield },
        { name: "Compliance", href: "/compliance-reports", icon: Building },
        { name: "Custom Reports", href: "/custom-reports", icon: FileText }
      ];
    }
    
    if (location.startsWith('/risk')) {
      return [
        { name: "Overview", href: "/", icon: Shield },
        { name: "Assessment", href: "/risk-assessment", icon: Target },
        { name: "AI Marketplace", href: "/marketplace", icon: Store },
        { name: "Alerts", href: "/risk-alerts", icon: Bell },
        { name: "Compliance", href: "/compliance", icon: Building }
      ];
    }
    
    if (location.startsWith('/trading') || location.startsWith('/live-trading') || location.startsWith('/orders') || location.startsWith('/strategies')) {
      return [
        { name: "Overview", href: "/", icon: BarChart3 },
        { name: "Live Trading", href: "/live-trading", icon: TrendingUp },
        { name: "Trading Bots", href: "/trading-bots", icon: Bot },
        { name: "Order History", href: "/orders", icon: FileText },
        { name: "Strategies", href: "/strategies", icon: Target }
      ];
    }
    
    if (location.includes('funding') || location.includes('my-subscriptions')) {
      return [
        { name: "Overview", href: "/", icon: BarChart3 },
        { name: "Model Subscriptions", href: "/my-subscriptions", icon: Bot },
        { name: "Fund Models", href: "/model-funding", icon: CircleDollarSign },
        { name: "Funding Hub", href: "/funding", icon: Building },
        { name: "Bot Funding", href: "/bot-funding", icon: DollarSign },
        { name: "Bounty Funding", href: "/bounty-funding", icon: Target }
      ];
    }
    
    if (location.startsWith('/investor-learning') || location.startsWith('/tutorials') || location.startsWith('/webinars') || location.startsWith('/docs') || location.startsWith('/community')) {
      return [
        { name: "Overview", href: "/", icon: BarChart3 },
        { name: "Learning", href: "/investor-learning", icon: GraduationCap },
        { name: "Tutorials", href: "/tutorials", icon: BookOpen },
        { name: "Webinars", href: "/webinars", icon: Video },
        { name: "Documentation", href: "/docs", icon: FileText },
        { name: "Community", href: "/community", icon: Users }
      ];
    }
    
    // Collaboration submenu
    if (location.startsWith('/collaboration')) {
      return [
        { name: "Overview", href: "/", icon: BarChart3 },
        { name: "Collaboration", href: "/collaboration", icon: Users },
        { name: "Projects", href: "/collaboration/projects", icon: Briefcase },
        { name: "Teams", href: "/collaboration/teams", icon: Users },
        { name: "Messaging", href: "/collaboration/messaging", icon: MessageCircle },
        { name: "Resources", href: "/collaboration/resources", icon: FileText }
      ];
    }
    
    if (location.startsWith('/marketplace') || location.startsWith('/my-subscriptions') || location.startsWith('/developers') || location.startsWith('/trading-bots') || location.startsWith('/categories')) {
      return [
        { name: "Overview", href: "/", icon: BarChart3 },
        { name: "AI Marketplace", href: "/marketplace", icon: Store },
        { name: "Categories", href: "/categories", icon: Grid },
        { name: "My Subscriptions", href: "/my-subscriptions", icon: CreditCard },
        { name: "Developers", href: "/developers", icon: Users }
      ];
    }

    // Developer Portfolio submenu
    if (location.startsWith('/developer/portfolio')) {
      // Collaboration History subsections
      if (location.includes('/developer/portfolio/collaboration/')) {
        return [
          { name: "Data Usage", href: "/developer/portfolio/collaboration/data-usage", icon: Database },
          { name: "Investor Interactions", href: "/developer/portfolio/collaboration/investor-interactions", icon: Users },
          { name: "Project Involvement", href: "/developer/portfolio/collaboration/project-involvement", icon: Target }
        ];
      }
      
      return [
        { name: "Overview", href: "/developer", icon: BarChart3 },
        { name: "Portfolio", href: "/developer/portfolio", icon: Wallet },
        { name: "AI Models", href: "/developer/portfolio/ai-models", icon: Brain },
        { name: "Performance", href: "/developer/portfolio/performance", icon: TrendingUp },
        { name: "Activity", href: "/developer/portfolio/activity", icon: Activity },
        { name: "Funding", href: "/developer/portfolio/funding", icon: DollarSign },
        { name: "Feedback", href: "/developer/portfolio/feedback", icon: MessageCircle },
        { name: "Compliance", href: "/developer/portfolio/compliance", icon: Shield },
        { name: "Score", href: "/developer/portfolio/score", icon: Award }
      ];
    }

    // Developer submenu
    if (isDeveloperPage) {
      // Collaboration subsections
      if (location.startsWith('/developer/collaboration')) {
        return [
          { name: "Overview", href: "/developer", icon: BarChart3 },
          { name: "Collaboration", href: "/developer/collaboration", icon: Users },
          { name: "Projects", href: "/developer/collaboration/projects", icon: Briefcase },
          { name: "Invitations", href: "/developer/collaboration/invitations", icon: UserPlus },
          { name: "Resources", href: "/developer/collaboration/resources", icon: FileText },
          { name: "Messaging", href: "/developer/collaboration/messaging", icon: MessageCircle },
          { name: "Compliance", href: "/developer/collaboration/compliance", icon: Shield },
          { name: "Notifications", href: "/developer/collaboration/notifications", icon: Bell }
        ];
      }
      
      // Develop subsections
      if (location.includes('/developer/develop/') || location === '/backtesting') {
        return [
          { name: "Overview", href: "/developer", icon: BarChart3 },
          { name: "Develop", href: "/backtesting", icon: Code },
          { name: "Backtesting", href: "/backtesting", icon: TrendingUp },
          { name: "IDE Access", href: "/developer/develop/ide-access", icon: Code },
          { name: "Version Control", href: "/developer/develop/version-control", icon: GitBranch },
          { name: "Code Review", href: "/developer/develop/code-review", icon: FileText }
        ];
      }
      
      return [
        { name: "Overview", href: "/developer", icon: BarChart3 },
        { name: "Portfolio", href: "/developer/portfolio", icon: Wallet },
        { name: "Develop", href: "/backtesting", icon: Code },
        { name: "AI Marketplace", href: "/developer-marketplace", icon: Store },
        { name: "Market Data", href: "/market-data", icon: Database },
        { name: "Bounties", href: "/bounties", icon: Target },
        { name: "Learning", href: "/learning", icon: GraduationCap },
        { name: "Collaboration", href: "/developer/collaboration", icon: Users }
      ];
    }

    // Admin submenu
    if (location.startsWith('/admin')) {
      return [
        { name: "Overview", href: "/admin", icon: BarChart3 },
        { name: "User Management", href: "/admin/users", icon: Users },
        { name: "Content Moderation", href: "/admin/content", icon: Shield },
        { name: "Security", href: "/admin/security", icon: AlertTriangle },
        { name: "Support", href: "/admin/support", icon: FileText },
        { name: "Analytics", href: "/admin/analytics", icon: Activity }
      ];
    }

    // Moderator submenu
    if (location.startsWith('/moderator')) {
      return [
        { name: "Overview", href: "/moderator", icon: BarChart3 },
        { name: "Content Review", href: "/moderator/content-review", icon: Shield },
        { name: "Support Tickets", href: "/moderator/support-tickets", icon: FileText },
        { name: "User Monitoring", href: "/moderator/user-monitoring", icon: Users },
        { name: "Analytics", href: "/moderator/analytics", icon: Activity }
      ];
    }

    // Regulator submenu
    if (location.startsWith('/regulator')) {
      return [
        { name: "Overview", href: "/regulator", icon: BarChart3 },
        { name: "Model Audits", href: "/regulator/model-audits", icon: Shield },
        { name: "Dataset Audits", href: "/regulator/dataset-audits", icon: Database },
        { name: "Compliance Issues", href: "/regulator/compliance-issues", icon: AlertTriangle },
        { name: "Communications", href: "/regulator/communications", icon: Globe },
        { name: "Standards", href: "/regulator/standards", icon: BookOpen }
      ];
    }

    // Support submenu
    if (location.startsWith('/support')) {
      return [
        { name: "Overview", href: "/support", icon: BarChart3 },
        { name: "Tickets", href: "/support", icon: MessageCircle },
        { name: "Knowledge Base", href: "/support", icon: BookOpen },
        { name: "Analytics", href: "/support", icon: Activity },
        { name: "Settings", href: "/support", icon: Settings }
      ];
    }

    // Data Provider submenu - hierarchical structure
    if (location.startsWith('/data-provider')) {
      // Portfolio subsections
      if (location.includes('/data-provider/portfolio/')) {
        return [
          { name: "Overview", href: "/data-provider", icon: BarChart3 },
          { name: "Portfolio", href: "/data-provider/portfolio", icon: Wallet },
          { name: "Usage", href: "/data-provider/portfolio/usage", icon: Activity },
          { name: "Quality", href: "/data-provider/portfolio/quality", icon: CheckCircle },
          { name: "Revenue", href: "/data-provider/portfolio/revenue", icon: DollarSign },
          { name: "Compliance", href: "/data-provider/portfolio/compliance", icon: Shield },
          { name: "Feedback", href: "/data-provider/portfolio/feedback", icon: Star },
          { name: "Score", href: "/data-provider/portfolio/score", icon: Award }
        ];
      }
      
      // Data subsections  
      if (location.includes('/data-provider/data/')) {
        return [
          { name: "Overview", href: "/data-provider", icon: BarChart3 },
          { name: "Dataset Catalogs", href: "/data-provider/data/catalogs", icon: Database },
          { name: "Metadata Management", href: "/data-provider/data/metadata", icon: FileText },
          { name: "Data Versioning", href: "/data-provider/data/versioning", icon: GitBranch }
        ];
      }
      
      // Main Data Provider menu
      return [
        { name: "Overview", href: "/data-provider", icon: BarChart3 },
        { name: "Portfolio", href: "/data-provider/portfolio", icon: Wallet },
        { name: "Data", href: "/data-provider/data/catalogs", icon: Database },
        { name: "AI Marketplace", href: "/data-provider-marketplace", icon: Store },
        { name: "Collaboration", href: "/data-provider/collaboration", icon: Users },
        { name: "Learning", href: "/learning", icon: GraduationCap }
      ];
    }

    // Default submenu - Investor main navigation
    return [
      { name: "Overview", href: "/", icon: BarChart3 },
      { name: "Portfolio", href: "/portfolio", icon: Wallet },
      { name: "AI Marketplace", href: "/marketplace", icon: Store },
      { name: "Trading", href: "/live-trading", icon: TrendingUp },
      { name: "Reports", href: "/reports", icon: FileText },
      { name: "Funding", href: "/funding", icon: DollarSign },
      { name: "Learning", href: "/investor-learning", icon: GraduationCap },
      { name: "Collaboration", href: "/collaboration", icon: Users }
    ];
  };

  const submenuItems = getSubmenuItems();

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-50">
        {/* Main Header */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - moved to left */}
            <div className="hidden md:flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">GeFi</span>
              </Link>
            </div>

            {/* Mobile Logo - Compact */}
            <div className="md:hidden">
              <Link href="/" className="flex items-center space-x-1.5">
                <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
                  <Brain className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">GeFi</span>
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Dashboard Mode Toggle - Icon Only - Only for Admin/Moderator */}
              {((user as any)?.role === 'admin' || (user as any)?.role === 'moderator') && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-md text-foreground hover:bg-accent transition-colors">
                    {isDeveloperPage ? <Code className="h-4 w-4 md:h-5 md:w-5" /> : 
                     location.startsWith('/regulator') ? <Shield className="h-4 w-4 md:h-5 md:w-5" /> :
                     location.startsWith('/data-provider') ? <Database className="h-4 w-4 md:h-5 md:w-5" /> :
                     location.startsWith('/admin') ? <Settings className="h-4 w-4 md:h-5 md:w-5" /> :
                     location.startsWith('/moderator') ? <Flag className="h-4 w-4 md:h-5 md:w-5" /> :
                     location.startsWith('/support') ? <HelpCircle className="h-4 w-4 md:h-5 md:w-5" /> :
                     <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/" className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>Investor</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/developer" className="flex items-center space-x-2">
                        <Code className="h-4 w-4" />
                        <span>Developer</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/data-provider" className="flex items-center space-x-2">
                        <Database className="h-4 w-4" />
                        <span>Data Provider</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/regulator" className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Regulator</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/moderator" className="flex items-center space-x-2">
                        <Flag className="h-4 w-4" />
                        <span>Moderator</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/support" className="flex items-center space-x-2">
                        <HelpCircle className="h-4 w-4" />
                        <span>Support</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Search */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="w-9 h-9 p-2 text-muted-foreground hover:text-foreground"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* AI Chatbot */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatbotOpen(true)}
                className="w-9 h-9 md:w-auto md:h-auto p-2 md:px-3 md:py-2 text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
              </Button>

              {/* Notifications */}
              <NotificationBell />

              {/* App Marketplace */}
              <Link href="/app-marketplace">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-9 h-9 md:w-auto md:h-auto p-2 md:px-3 md:py-2 text-muted-foreground hover:text-foreground"
                  title="App Marketplace"
                >
                  <Grid3x3 className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>

              {/* Theme Toggle - Hidden on mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="hidden md:flex text-muted-foreground hover:text-foreground"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 h-9 md:w-auto md:h-auto p-2 md:px-3 md:py-2 text-muted-foreground hover:text-foreground">
                    <Globe className="h-4 w-4 md:mr-1" />
                    <span className="hidden md:inline">Language</span>
                    <ChevronDown className="h-3 w-3 ml-1 hidden md:inline" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>🇺🇸 English</DropdownMenuItem>
                  <DropdownMenuItem>🇪🇸 Spanish</DropdownMenuItem>
                  <DropdownMenuItem>🇫🇷 French</DropdownMenuItem>
                  <DropdownMenuItem>🇩🇪 German</DropdownMenuItem>
                  <DropdownMenuItem>🇯🇵 Japanese</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={(user as any)?.profileImageUrl || ""} />
                        <AvatarFallback>
                          {(user as any)?.firstName?.[0]}{(user as any)?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{(user as any)?.firstName} {(user as any)?.lastName}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {(user as any)?.email || 'No email provided'}
                        </p>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 w-fit">
                          {mapRoleToUserType((user as any)?.role)}
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/profile/${(user as any)?.role || 'investor'}/${(user as any)?.id}`} className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wallet" className="flex items-center">
                        <Wallet className="mr-2 h-4 w-4" />
                        Wallet
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/integrations" className="flex items-center">
                        <PlugZap className="mr-2 h-4 w-4" />
                        Integrations
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {/* Dashboard Mode - Only for Admin and Moderator users */}
                    {((user as any)?.role === 'admin' || (user as any)?.role === 'moderator') && (
                      <>
                        <div className="px-2 py-1">
                          <p className="text-sm font-medium text-muted-foreground">Dashboard Mode</p>
                        </div>
                        <DropdownMenuItem asChild>
                          <Link href="/investor-dashboard" className="flex items-center">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Investor
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/developer" className="flex items-center">
                            <Code className="mr-2 h-4 w-4" />
                            Developer
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/data-provider" className="flex items-center">
                            <Database className="mr-2 h-4 w-4" />
                            Data Provider
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/regulator" className="flex items-center">
                            <Shield className="mr-2 h-4 w-4" />
                            Regulator
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            Admin
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/moderator" className="flex items-center">
                            <Flag className="mr-2 h-4 w-4" />
                            Moderator
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/user-access" className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        User Access
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/billing" className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Billing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/storage" className="flex items-center">
                        <HardDrive className="mr-2 h-4 w-4" />
                        Storage
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/api-access" className="flex items-center">
                        <Key className="mr-2 h-4 w-4" />
                        API Access
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/logout', {
                            method: 'GET',
                            credentials: 'include'
                          });
                          if (response.ok) {
                            window.location.href = '/login';
                          }
                        } catch (error) {
                          console.error('Logout error:', error);
                          window.location.href = '/login';
                        }
                      }}
                      className="flex items-center cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="default">
                  <Link href="/login">Sign in</Link>
                </Button>
              )}


            </div>
          </div>
        </div>

        {/* Submenu - Responsive */}
        {submenuItems.length > 0 && (
          <div className="border-t border-border bg-muted/30">
            <div className="container mx-auto px-4">
              {/* Desktop Submenu */}
              <div className="hidden md:flex items-center space-x-1 py-2 overflow-x-auto">
                {submenuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                      location === item.href
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Submenu - Horizontal scroll with icons */}
              <div className="md:hidden flex items-center space-x-2 py-2 overflow-x-auto scrollbar-hide">
                {submenuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex flex-col items-center justify-center min-w-[64px] p-2 rounded-md text-xs font-medium transition-colors ${
                      location === item.href
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mb-1" />
                    <span className="text-[10px] leading-tight text-center max-w-[48px] truncate">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Advanced Search Modal */}
      <SearchModal 
        open={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* AI Chatbot Dialog */}
      <AIFinancialChatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
        user={user}
      />
    </>
  );
}

// AI Financial Chatbot Component
function AIFinancialChatbot({ isOpen, onClose, user }: { isOpen: boolean; onClose: () => void; user: any }) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'profiling' | 'chat' | 'feedback'>('welcome');
  const [profileData, setProfileData] = useState({
    financialGoals: '',
    riskTolerance: '',
    experienceLevel: '',
    currentSituation: '',
    aiPreference: ''
  });
  const [feedbackStep, setFeedbackStep] = useState(0);
  const [feedbackData, setFeedbackData] = useState({
    suggestion: '',
    category: '',
    details: '',
    importance: '',
    problemSolved: '',
    additionalFeatures: ''
  });

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Hi! Welcome to GeFi AI Assistant! 🤖\n\nI'm here to help you with:\n• Personalized financial advice\n• GeFi platform features\n• AI model recommendations\n• Technology suggestions\n• Platform feedback and suggestions\n\n**💡 Want to suggest new features?** Type "/feedback" anytime!\n\nTo provide the best assistance, would you like me to learn about your financial goals first?`,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

  const profilingQuestions = [
    {
      key: 'financialGoals',
      question: "What are your primary financial goals? (e.g., saving, investing, debt management, retirement planning)",
      suggestions: ["Saving", "Investing", "Debt Management", "Retirement Planning", "Building Emergency Fund"]
    },
    {
      key: 'riskTolerance',
      question: "How comfortable are you with investment risks? Do you prefer safer options or higher-risk opportunities?",
      suggestions: ["Conservative (Low Risk)", "Moderate (Balanced)", "Aggressive (High Risk)", "Very Conservative", "Speculative"]
    },
    {
      key: 'experienceLevel',
      question: "What's your investment experience level?",
      suggestions: ["Beginner", "Intermediate", "Advanced", "Expert", "Professional"]
    },
    {
      key: 'currentSituation',
      question: "Can you share your current financial situation? (income range, existing investments, debt level)",
      suggestions: ["Just Starting Out", "Building Wealth", "Pre-Retirement", "High Net Worth", "Managing Debt"]
    },
    {
      key: 'aiPreference',
      question: "How do you feel about AI for financial advice? Do you prefer fully automated recommendations or with human oversight?",
      suggestions: ["Fully Automated", "AI + Human Review", "Minimal AI", "Prefer Human Advisors", "Mixed Approach"]
    }
  ];

  const feedbackQuestions = [
    {
      key: 'suggestion',
      question: "What new tools or features would you like to see on the GeFi platform?",
      placeholder: "Describe your feature idea...",
      suggestions: ["Budgeting Tool", "Portfolio Analytics", "Risk Assessment", "Trading Bots", "Mobile App", "AI Advisor", "Educational Content"]
    },
    {
      key: 'category',
      question: "Which category best describes your suggestion?",
      suggestions: ["User Interface", "Analytics & Reporting", "Trading Tools", "Risk Management", "Educational Resources", "Mobile Features", "AI & Automation", "Data Visualization"]
    },
    {
      key: 'details',
      question: "How do you envision this tool/feature working? Please provide more details.",
      placeholder: "Describe how it should work, what it should include...",
      suggestions: ["Step-by-step workflow", "Integration with existing features", "Real-time updates", "Customizable settings", "Mobile-friendly design"]
    },
    {
      key: 'problemSolved',
      question: "What specific problem would this tool solve for you?",
      placeholder: "Explain the challenge you're facing...",
      suggestions: ["Save time", "Reduce complexity", "Better insights", "Automated decisions", "Risk reduction", "Cost savings"]
    },
    {
      key: 'importance',
      question: "How important is this feature to you?",
      suggestions: ["Critical - Would significantly improve my experience", "High - Would be very useful", "Medium - Nice to have", "Low - Minor improvement"]
    },
    {
      key: 'additionalFeatures',
      question: "Are there any additional features or improvements you'd like to add?",
      placeholder: "Any other ideas, integrations, or enhancements...",
      suggestions: ["Progress tracking", "Notifications", "Charts & graphs", "Export functionality", "Collaboration features", "API access"]
    }
  ];

  const getCurrentQuestion = () => {
    const unansweredKeys = profilingQuestions.filter(q => !profileData[q.key as keyof typeof profileData]);
    return unansweredKeys[0];
  };

  const getCurrentFeedbackQuestion = () => {
    return feedbackQuestions[feedbackStep];
  };

  const handleFeedbackResponse = (response: string) => {
    const currentQuestion = getCurrentFeedbackQuestion();
    if (currentQuestion) {
      setFeedbackData(prev => ({
        ...prev,
        [currentQuestion.key]: response
      }));
      
      if (feedbackStep < feedbackQuestions.length - 1) {
        setFeedbackStep(prev => prev + 1);
      } else {
        // Submit feedback and complete flow
        submitFeedback();
      }
    }
  };

  const submitFeedback = async () => {
    setIsLoading(true);
    try {
      // Submit feedback to backend
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          timestamp: new Date().toISOString(),
          ...feedbackData
        })
      });

      // Show confirmation message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `🎉 Thank you for your valuable feedback!\n\nYour suggestion for "${feedbackData.suggestion}" has been submitted to our development team. We appreciate you taking the time to help improve the GeFi platform.\n\n📋 **Summary of your feedback:**\n• **Feature:** ${feedbackData.suggestion}\n• **Category:** ${feedbackData.category}\n• **Importance:** ${feedbackData.importance}\n\nOur team will review your suggestion and may reach out for additional details. You'll be notified when we implement features based on community feedback!\n\nIs there anything else I can help you with today?`,
        timestamp: new Date()
      }]);

      // Reset feedback flow
      setCurrentStep('chat');
      setFeedbackStep(0);
      setFeedbackData({
        suggestion: '',
        category: '',
        details: '',
        importance: '',
        problemSolved: '',
        additionalFeatures: ''
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error submitting your feedback. Please try again later.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Handle feedback commands
      if (inputMessage.toLowerCase().includes('/feedback') || inputMessage.toLowerCase().includes('provide feedback') || inputMessage.toLowerCase().includes('suggest feature')) {
        setCurrentStep('feedback');
        setFeedbackStep(0);
        const firstQuestion = feedbackQuestions[0];
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `🛠️ **Feature Feedback & Suggestions**\n\nGreat! I'd love to hear your ideas for improving the GeFi platform. Your feedback helps us build better tools for our community.\n\n${firstQuestion.question}`,
            timestamp: new Date()
          }]);
          setIsLoading(false);
        }, 1000);
        return;
      }

      // Handle feedback phase
      if (currentStep === 'feedback') {
        handleFeedbackResponse(inputMessage);
        const currentQuestion = getCurrentFeedbackQuestion();
        const nextStep = feedbackStep + 1;
        
        if (nextStep < feedbackQuestions.length) {
          const nextQuestion = feedbackQuestions[nextStep];
          setTimeout(() => {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `Thank you! ${nextQuestion.question}`,
              timestamp: new Date()
            }]);
            setIsLoading(false);
          }, 1000);
        } else {
          // Feedback will be submitted by handleFeedbackResponse
          setIsLoading(false);
        }
        return;
      }

      // Handle profiling phase
      if (currentStep === 'profiling') {
        const currentQ = getCurrentQuestion();
        if (currentQ) {
          setProfileData(prev => ({
            ...prev,
            [currentQ.key]: inputMessage
          }));

          const nextQuestion = profilingQuestions.find(q => 
            q.key !== currentQ.key && !profileData[q.key as keyof typeof profileData]
          );

          if (nextQuestion) {
            setTimeout(() => {
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Great! ${nextQuestion.question}`,
                timestamp: new Date()
              }]);
              setIsLoading(false);
            }, 1000);
          } else {
            // Profiling complete
            setCurrentStep('chat');
            setTimeout(() => {
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Perfect! I now have a good understanding of your financial profile:\n\n• Goals: ${profileData.financialGoals || inputMessage}\n• Risk Tolerance: ${profileData.riskTolerance}\n• Experience: ${profileData.experienceLevel}\n• Situation: ${profileData.currentSituation}\n• AI Preference: ${profileData.aiPreference || inputMessage}\n\nNow I can provide personalized recommendations! What would you like help with today?`,
                timestamp: new Date()
              }]);
              setIsLoading(false);
            }, 1500);
          }
          return;
        }
      }

      // Handle general chat
      const response = await generateAIResponse(inputMessage, profileData, user);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response,
          timestamp: new Date()
        }]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or contact support if the issue persists.",
        timestamp: new Date()
      }]);
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (message: string, profile: any, user: any): Promise<string> => {
    const lowerMessage = message.toLowerCase();

    // Feature explanations
    if (lowerMessage.includes('explain') || lowerMessage.includes('what is') || lowerMessage.includes('how does')) {
      if (lowerMessage.includes('backtesting')) {
        return "GeFi's Backtesting feature allows you to test your AI trading strategies against historical market data. You can:\n\n• Configure test parameters (timeframe, assets, initial capital)\n• Run simulations with real market data\n• Analyze performance metrics (Sharpe ratio, drawdown, win rate)\n• Compare multiple strategies\n• Export detailed reports\n\nWould you like me to show you how to set up your first backtest?";
      }
      if (lowerMessage.includes('risk assessment')) {
        return "Our Risk Assessment models help you understand and manage financial risks:\n\n• **Credit Risk**: Evaluate borrower default probability\n• **Market Risk**: Assess portfolio volatility and VaR\n• **Operational Risk**: Identify process and system risks\n• **Liquidity Risk**: Monitor asset convertibility\n\nBased on your profile, I'd recommend starting with Market Risk models for portfolio management. Want to explore specific risk models?";
      }
      if (lowerMessage.includes('ai models') || lowerMessage.includes('marketplace')) {
        return `GeFi's AI Marketplace offers over 150+ financial models:\n\n• **Trading Strategies**: Algorithmic and HFT models\n• **Risk Management**: Credit, market, and operational risk\n• **Portfolio Optimization**: Asset allocation and rebalancing\n• **Fraud Detection**: Transaction and identity monitoring\n\n${profile.experienceLevel === 'Beginner' ? 'For beginners, I recommend starting with Portfolio Optimization models.' : 'Based on your experience, you might be interested in advanced Trading Strategy models.'}\n\nShall I show you models matching your ${profile.financialGoals || 'goals'}?`;
      }
    }

    // Technology recommendations
    if (lowerMessage.includes('technology') || lowerMessage.includes('python') || lowerMessage.includes('recommend')) {
      if (lowerMessage.includes('predictive') || lowerMessage.includes('modeling')) {
        return "For predictive modeling in finance, I recommend:\n\n**Programming Languages:**\n• Python (pandas, scikit-learn, TensorFlow)\n• R (quantmod, PerformanceAnalytics)\n\n**AI/ML Frameworks:**\n• TensorFlow/Keras for deep learning\n• PyTorch for research-oriented models\n• XGBoost for gradient boosting\n\n**Data Sources:**\n• Alpha Vantage API for market data\n• Quandl for financial datasets\n• Yahoo Finance for historical data\n\nBased on your profile, would you like specific model recommendations for your use case?";
      }
      if (lowerMessage.includes('trading') || lowerMessage.includes('automated')) {
        return "For automated trading systems, consider:\n\n**Platforms:**\n• MetaTrader 4/5 with Expert Advisors\n• QuantConnect for algorithm development\n• Interactive Brokers API\n\n**Languages:**\n• Python with libraries: zipline, backtrader, ccxt\n• C++ for high-frequency trading\n• MQL4/5 for MetaTrader\n\n**Risk Management:**\n• Position sizing algorithms\n• Stop-loss and take-profit automation\n• Portfolio diversification rules\n\nWould you like help choosing the right platform for your trading strategy?";
      }
    }

    // Personalized recommendations based on profile
    if (profile.financialGoals) {
      if (profile.financialGoals.toLowerCase().includes('saving')) {
        return "Based on your savings goals, here are some relevant GeFi features:\n\n• **Savings Optimization Models**: AI algorithms to maximize savings rates\n• **Expense Analysis**: Track and categorize spending patterns\n• **Goal Planning**: Set and monitor savings milestones\n• **Risk-Adjusted Returns**: Low-risk investment options\n\nWould you like me to help you set up a savings strategy using our AI models?";
      }
      if (profile.financialGoals.toLowerCase().includes('investing')) {
        const riskLevel = profile.riskTolerance?.toLowerCase() || 'moderate';
        return `For your investment goals with ${riskLevel} risk tolerance, I suggest:\n\n• **Portfolio Optimization**: AI-driven asset allocation\n• **Market Sentiment Analysis**: Real-time market insights\n• **Robo-Advisor Models**: Automated investment management\n• **ESG Investing**: Sustainable investment options\n\n${riskLevel.includes('conservative') ? 'Given your conservative approach, focus on diversified ETF strategies.' : 'With your risk tolerance, consider growth-oriented AI models.'}\n\nShall I show you specific models for your investment style?`;
      }
    }

    // Help and feedback prompts
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return `I'm your GeFi AI Assistant! Here's how I can help:\n\n**🎯 Core Features:**\n• Feature explanations (backtesting, risk assessment, AI models)\n• Personalized recommendations based on your profile\n• Technology and programming guidance\n• Financial strategy planning\n\n**💡 Special Commands:**\n• Type "/feedback" to suggest new features\n• Ask "what is [feature]" for detailed explanations\n• Say "recommend" for personalized suggestions\n\n**🛠️ Want to Shape GeFi's Future?**\nType "/feedback" or "I have a suggestion" to share your ideas for new tools and features!\n\nWhat would you like to explore first?`;
    }

    if (lowerMessage.includes('suggestion') || lowerMessage.includes('idea') || lowerMessage.includes('feature request')) {
      return `💡 **Love Your Initiative!**\n\nI'd be happy to help you share suggestions for improving GeFi! Your ideas are valuable for our development team.\n\n**Quick Options:**\n• Type "/feedback" to start the structured feedback process\n• Tell me your idea directly and I'll help you elaborate\n• Ask about specific areas you'd like to see improved\n\nCommon suggestion areas include:\n• New analytical tools\n• Better user interface features\n• Mobile app enhancements\n• Trading automation improvements\n• Educational resources\n\nWhat's your idea? I'm listening! 👂`;
    }

    // Default helpful response
    return `I understand you're asking about "${message}". Here's how I can help:\n\n• **Feature Explanations**: Ask about any GeFi feature\n• **Model Recommendations**: Get AI models matching your needs\n• **Technology Advice**: Programming and platform suggestions\n• **Strategy Planning**: Personalized financial strategies\n• **Platform Feedback**: Type "/feedback" to suggest improvements\n\nBased on your profile (${profile.experienceLevel || 'your experience level'}), what specific area would you like to explore?`;
  };

  const startProfiling = () => {
    setCurrentStep('profiling');
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: profilingQuestions[0].question,
      timestamp: new Date()
    }]);
  };

  const skipProfiling = () => {
    setCurrentStep('chat');
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: "No problem! I'm here to help with any questions about GeFi's features, AI models, or financial technology. What would you like to know?",
      timestamp: new Date()
    }]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] flex flex-col bg-background/98 backdrop-blur-sm">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            GeFi AI Assistant
            <Badge variant="secondary" className="ml-2">Beta</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-muted'
                }`}>
                  <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="text-sm">AI Assistant is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions for Welcome/Profiling */}
          {currentStep === 'welcome' && (
            <div className="p-4 border-t bg-muted/50">
              <div className="flex gap-2 justify-center">
                <Button onClick={startProfiling} className="bg-blue-500 hover:bg-blue-600">
                  Create My Profile
                </Button>
                <Button variant="outline" onClick={skipProfiling}>
                  Skip & Chat Now
                </Button>
              </div>
            </div>
          )}

          {/* Suggestion Buttons for Profiling */}
          {currentStep === 'profiling' && getCurrentQuestion() && (
            <div className="p-4 border-t bg-muted/50">
              <div className="flex flex-wrap gap-2 justify-center">
                {getCurrentQuestion()?.suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInputMessage(suggestion);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestion Buttons for Feedback */}
          {currentStep === 'feedback' && getCurrentFeedbackQuestion() && (
            <div className="p-4 border-t bg-muted/50">
              <div className="flex flex-wrap gap-2 justify-center">
                {getCurrentFeedbackQuestion()?.suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInputMessage(suggestion);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Action Buttons for Chat */}
          {currentStep === 'chat' && (
            <div className="p-4 border-t bg-muted/50">
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputMessage('/feedback');
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="text-xs"
                >
                  💡 Suggest Feature
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputMessage('help');
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="text-xs"
                >
                  ❓ What can you do?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputMessage('recommend AI models');
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="text-xs"
                >
                  🎯 Get Recommendations
                </Button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}>
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about GeFi, AI models, or financial strategies..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Send
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}