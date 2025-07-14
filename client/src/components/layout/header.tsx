import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  Globe,
  Store,
  Activity,
  PieChart,
  TrendingDown,
  Grid,
  CreditCard,
  Building,
  Video,
  Database,
  Key,
  HardDrive,
  Flag
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme/theme-provider";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);


  // Check if we're on developer pages
  const isDeveloperPage = location.startsWith('/developer') || 
                         location.startsWith('/backtesting') || 
                         location.startsWith('/bounties') || 
                         location.startsWith('/model-funding') ||
                         location.startsWith('/bounty-funding') ||
                         location.startsWith('/bot-funding') ||
                         location.startsWith('/market-data') ||
                         location.startsWith('/learning');

  // Fetch notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  // Submenu items based on current location
  const getSubmenuItems = () => {
    if (location.startsWith('/market-insights') || location === '/market-sentiment') {
      return [
        { name: "Overview", href: "/investor-dashboard", icon: BarChart3 },
        { name: "Real-Time Data", href: "/live-trading", icon: TrendingUp },
        { name: "AI Insights", href: "/market-insights", icon: Brain },
        { name: "Market Sentiment", href: "/market-sentiment", icon: BarChart3 },
        { name: "AI Marketplace", href: "/marketplace", icon: Store },
        { name: "Alerts", href: "/alerts", icon: AlertTriangle }
      ];
    }
    
    if (location.startsWith('/portfolio') || location.startsWith('/rebalance-actions')) {
      return [
        { name: "Overview", href: "/investor-dashboard", icon: BarChart3 },
        { name: "Portfolio", href: "/portfolio", icon: Wallet },
        { name: "AI Models", href: "/portfolio/ai-models", icon: Bot },
        { name: "Rebalancing", href: "/rebalance-actions", icon: Target },
        { name: "Performance", href: "/portfolio-performance", icon: TrendingUp }
      ];
    }
    
    if (location.startsWith('/reports') || location.startsWith('/risk-reports') || location.startsWith('/compliance-reports') || location.startsWith('/custom-reports')) {
      return [
        { name: "Overview", href: "/investor-dashboard", icon: BarChart3 },
        { name: "Reports", href: "/reports", icon: FileText },
        { name: "Risk Analysis", href: "/risk-reports", icon: Shield },
        { name: "Compliance", href: "/compliance-reports", icon: Building },
        { name: "Custom Reports", href: "/custom-reports", icon: FileText }
      ];
    }
    
    if (location.startsWith('/risk')) {
      return [
        { name: "Overview", href: "/risk-dashboard", icon: Shield },
        { name: "Assessment", href: "/risk-assessment", icon: Target },
        { name: "AI Marketplace", href: "/marketplace", icon: Store },
        { name: "Alerts", href: "/risk-alerts", icon: Bell },
        { name: "Compliance", href: "/compliance", icon: Building }
      ];
    }
    
    if (location.startsWith('/trading') || location.startsWith('/live-trading') || location.startsWith('/orders') || location.startsWith('/strategies')) {
      return [
        { name: "Overview", href: "/investor-dashboard", icon: BarChart3 },
        { name: "Live Trading", href: "/live-trading", icon: TrendingUp },
        { name: "Trading Bots", href: "/trading-bots", icon: Bot },
        { name: "Order History", href: "/orders", icon: FileText },
        { name: "Strategies", href: "/strategies", icon: Target }
      ];
    }
    
    if (location.includes('funding')) {
      return [
        { name: "Overview", href: "/investor-dashboard", icon: BarChart3 },
        { name: "Funding Hub", href: "/funding", icon: Building },
        { name: "Bot Funding", href: "/bot-funding", icon: DollarSign },
        { name: "AI Model Funding", href: "/model-funding", icon: CircleDollarSign },
        { name: "Bounty Funding", href: "/bounty-funding", icon: Target }
      ];
    }
    
    if (location.startsWith('/learning') || location.startsWith('/tutorials') || location.startsWith('/webinars') || location.startsWith('/docs') || location.startsWith('/community')) {
      return [
        { name: "Overview", href: "/investor-dashboard", icon: BarChart3 },
        { name: "Learning", href: "/learning", icon: GraduationCap },
        { name: "Tutorials", href: "/tutorials", icon: BookOpen },
        { name: "Webinars", href: "/webinars", icon: Video },
        { name: "Documentation", href: "/docs", icon: FileText },
        { name: "Community", href: "/community", icon: Users }
      ];
    }
    
    if (location.startsWith('/marketplace') || location.startsWith('/my-subscriptions') || location.startsWith('/developers') || location.startsWith('/trading-bots') || location.startsWith('/categories')) {
      return [
        { name: "Overview", href: "/investor-dashboard", icon: BarChart3 },
        { name: "AI Marketplace", href: "/marketplace", icon: Store },
        { name: "Categories", href: "/categories", icon: Grid },
        { name: "My Subscriptions", href: "/my-subscriptions", icon: CreditCard },
        { name: "Developers", href: "/developers", icon: Users }
      ];
    }

    // Developer submenu
    if (isDeveloperPage) {
      return [
        { name: "Overview", href: "/developer", icon: BarChart3 },
        { name: "Backtesting", href: "/backtesting", icon: TrendingUp },
        { name: "AI Marketplace", href: "/marketplace", icon: Store },
        { name: "Market Data", href: "/market-data", icon: Database },
        { name: "Bounties", href: "/bounties", icon: Target },
        { name: "Learning", href: "/learning", icon: GraduationCap }
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

    // Data Provider Portfolio submenu - check more specific paths first
    if (location.startsWith('/data-provider/portfolio')) {
      return [
        { name: "Overview", href: "/data-provider", icon: BarChart3 },
        { name: "Portfolio", href: "/data-provider/portfolio", icon: Wallet },
        { name: "Datasets", href: "/data-provider/portfolio/datasets", icon: Database },
        { name: "Performance", href: "/data-provider/portfolio/performance", icon: TrendingUp }
      ];
    }

    // Data Provider Collaboration submenu - check more specific paths first
    if (location.startsWith('/data-provider/collaboration')) {
      return [
        { name: "Overview", href: "/data-provider", icon: BarChart3 },
        { name: "Collaboration", href: "/data-provider/collaboration", icon: Users },
        { name: "Compliance", href: "/data-provider/collaboration/compliance", icon: Shield },
        { name: "Audit", href: "/data-provider/collaboration/audit", icon: FileText }
      ];
    }

    // Data Provider submenu - main data provider dashboard
    if (location.startsWith('/data-provider')) {
      return [
        { name: "Overview", href: "/data-provider", icon: BarChart3 },
        { name: "Portfolio", href: "/data-provider/portfolio", icon: Wallet },
        { name: "AI Marketplace", href: "/marketplace", icon: Store },
        { name: "Collaboration", href: "/data-provider/collaboration", icon: Users }
      ];
    }

    // Default submenu - includes main navigation items
    return [
      { name: "Overview", href: "/investor-dashboard", icon: BarChart3 },
      { name: "Portfolio", href: "/portfolio", icon: Wallet },
      { name: "AI Marketplace", href: "/marketplace", icon: Store },
      { name: "Trading", href: "/live-trading", icon: TrendingUp },
      { name: "Reports", href: "/reports", icon: FileText },
      { name: "Funding", href: "/funding", icon: DollarSign },
      { name: "Learning", href: "/learning", icon: GraduationCap }
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
              {(user?.role === 'admin' || user?.role === 'moderator') && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-md text-foreground hover:bg-accent transition-colors">
                    {isDeveloperPage ? <Code className="h-4 w-4 md:h-5 md:w-5" /> : 
                     location.startsWith('/regulator') ? <Shield className="h-4 w-4 md:h-5 md:w-5" /> :
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
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Search */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="w-9 h-9 md:w-auto md:h-auto p-2 md:px-3 md:py-2 text-muted-foreground hover:text-foreground"
              >
                <Search className="h-4 w-4 md:h-5 md:w-5" />
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative w-9 h-9 md:w-auto md:h-auto p-2 md:px-3 md:py-2 text-muted-foreground hover:text-foreground">
                    <Bell className="h-4 w-4 md:h-5 md:w-5" />
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Notifications</h3>
                    {notifications.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No notifications</p>
                    ) : (
                      <div className="space-y-2">
                        {notifications.slice(0, 5).map((notification: any) => (
                          <div key={notification.id} className="p-2 rounded border">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

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
                        <AvatarImage src={user.profileImageUrl || ""} />
                        <AvatarFallback>
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email || 'No email provided'}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
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
                    <DropdownMenuSeparator />
                    {/* Dashboard Mode - Only for Admin and Moderator users */}
                    {(user?.role === 'admin' || user?.role === 'moderator') && (
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
                    <DropdownMenuItem asChild>
                      <a href="/api/logout" className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="default">
                  <a href="/api/login">Sign in</a>
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

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-2xl mx-auto mt-20 bg-background/95 backdrop-blur-md border border-border/50">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models, strategies, reports..."
                className="pl-10 bg-background/50 border-border/50 focus:bg-background focus:border-border"
                autoFocus
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Search across AI models, trading strategies, reports, and more...
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}