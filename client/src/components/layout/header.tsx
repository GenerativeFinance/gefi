import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Bell, 
  Menu, 
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
  Video
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme/theme-provider";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if we're on developer pages
  const isDeveloperPage = location.startsWith('/developer') || 
                         location.startsWith('/backtesting') || 
                         location.startsWith('/bounties') || 
                         location.startsWith('/model-funding') ||
                         location.startsWith('/bounty-funding') ||
                         location.startsWith('/bot-funding');

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
        { name: "Dashboard", href: "/investor-dashboard", icon: BarChart3 },
        { name: "Real-Time Data", href: "/live-trading", icon: TrendingUp },
        { name: "AI Insights", href: "/market-insights", icon: Brain },
        { name: "Market Sentiment", href: "/market-sentiment", icon: BarChart3 },
        { name: "AI Marketplace", href: "/marketplace", icon: Store },
        { name: "Alerts", href: "/alerts", icon: AlertTriangle }
      ];
    }
    
    if (location.startsWith('/portfolio') || location.startsWith('/rebalance-actions')) {
      return [
        { name: "Dashboard", href: "/investor-dashboard", icon: BarChart3 },
        { name: "Portfolio", href: "/portfolio", icon: Wallet },
        { name: "AI Models", href: "/portfolio/ai-models", icon: Bot },
        { name: "Rebalancing", href: "/rebalance-actions", icon: Target },
        { name: "Performance", href: "/portfolio-performance", icon: TrendingUp }
      ];
    }
    
    if (location.startsWith('/reports')) {
      return [
        { name: "Dashboard", href: "/investor-dashboard", icon: BarChart3 },
        { name: "Performance", href: "/reports", icon: FileText },
        { name: "Risk Analysis", href: "/risk-reports", icon: Shield },
        { name: "AI Marketplace", href: "/marketplace", icon: Store },
        { name: "Compliance", href: "/compliance-reports", icon: Building },
        { name: "Custom Reports", href: "/custom-reports", icon: FileText }
      ];
    }
    
    if (location.startsWith('/risk')) {
      return [
        { name: "Dashboard", href: "/risk-dashboard", icon: Shield },
        { name: "Assessment", href: "/risk-assessment", icon: Target },
        { name: "AI Marketplace", href: "/marketplace", icon: Store },
        { name: "Alerts", href: "/risk-alerts", icon: Bell },
        { name: "Compliance", href: "/compliance", icon: Building }
      ];
    }
    
    if (location.startsWith('/trading') || location.startsWith('/live-trading')) {
      return [
        { name: "Dashboard", href: "/investor-dashboard", icon: BarChart3 },
        { name: "Live Trading", href: "/live-trading", icon: TrendingUp },
        { name: "Trading Bots", href: "/trading-bots", icon: Bot },
        { name: "Order History", href: "/orders", icon: FileText },
        { name: "Strategies", href: "/strategies", icon: Target }
      ];
    }
    
    if (location.includes('funding')) {
      return [
        { name: "Dashboard", href: "/investor-dashboard", icon: BarChart3 },
        { name: "Funding Hub", href: "/funding", icon: Building },
        { name: "Bot Funding", href: "/bot-funding", icon: DollarSign },
        { name: "AI Model Funding", href: "/model-funding", icon: CircleDollarSign },
        { name: "Bounty Funding", href: "/bounty-funding", icon: Target }
      ];
    }
    
    if (location.startsWith('/learning') || location.startsWith('/webinars') || location.startsWith('/docs') || location.startsWith('/community')) {
      return [
        { name: "Dashboard", href: "/investor-dashboard", icon: BarChart3 },
        { name: "Learning", href: "/learning", icon: GraduationCap },
        { name: "Tutorials", href: "/learning", icon: BookOpen },
        { name: "Webinars", href: "/webinars", icon: Video },
        { name: "Documentation", href: "/docs", icon: FileText },
        { name: "Community", href: "/community", icon: Users }
      ];
    }
    
    if (location.startsWith('/marketplace') || location.startsWith('/my-subscriptions') || location.startsWith('/developers') || location.startsWith('/trading-bots') || location.startsWith('/categories')) {
      return [
        { name: "Dashboard", href: "/investor-dashboard", icon: BarChart3 },
        { name: "AI Models", href: "/marketplace", icon: Store },
        { name: "Categories", href: "/categories", icon: Grid },
        { name: "My Subscriptions", href: "/my-subscriptions", icon: CreditCard },
        { name: "Trading Bots", href: "/trading-bots", icon: Bot },
        { name: "Developers", href: "/developers", icon: Users }
      ];
    }

    // Developer submenu
    if (isDeveloperPage) {
      return [
        { name: "Dashboard", href: "/developer", icon: BarChart3 },
        { name: "Backtesting", href: "/backtesting", icon: TrendingUp },
        { name: "AI Marketplace", href: "/marketplace", icon: Store },
        { name: "Bounties", href: "/bounties", icon: Target },
        { name: "Learning", href: "/learning", icon: GraduationCap }
      ];
    }

    // Default submenu - includes main navigation items
    return [
      { name: "Dashboard", href: "/investor-dashboard", icon: BarChart3 },
      { name: "Portfolio", href: "/portfolio", icon: Wallet },
      { name: "AI Marketplace", href: "/marketplace", icon: Store },
      { name: "Trading", href: "/live-trading", icon: TrendingUp },
      { name: "Reports", href: "/reports", icon: FileText },
      { name: "Funding", href: "/funding", icon: DollarSign },
      { name: "Learning", href: "/learning-center", icon: GraduationCap }
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

            {/* Mobile Logo */}
            <div className="md:hidden">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">GeFi</span>
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Dashboard Mode Toggle - moved to right */}
              <div className="hidden md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent transition-colors">
                    <Bot className="h-4 w-4" />
                    <span>{isDeveloperPage ? 'Developer' : 'Investor'}</span>
                    <ChevronDown className="h-3 w-3" />
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Search */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
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

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Globe className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Language</span>
                    <ChevronDown className="h-3 w-3 ml-1" />
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
                          {user.email}
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

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Link href="/" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent">
                          <Home className="h-4 w-4" />
                          <span>Home</span>
                        </Link>
                        <Link href="/portfolio" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent">
                          <Wallet className="h-4 w-4" />
                          <span>Portfolio</span>
                        </Link>
                        <Link href="/reports" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent">
                          <FileText className="h-4 w-4" />
                          <span>Reports</span>
                        </Link>
                        <Link href="/risk-dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent">
                          <Shield className="h-4 w-4" />
                          <span>Risk Management</span>
                        </Link>
                        <Link href="/marketplace" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent">
                          <Store className="h-4 w-4" />
                          <span>AI Marketplace</span>
                        </Link>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* Submenu */}
        {submenuItems.length > 0 && (
          <div className="border-t border-border bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="flex items-center space-x-1 py-2 overflow-x-auto">
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