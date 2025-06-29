import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Brain, Search, Bell, Menu, User, Settings, LogOut, Code, TrendingUp, BarChart3, Briefcase, X, Target, BookOpen, Home, Activity, DollarSign, Bot, CircleDollarSign, Shield, FileText, AlertTriangle, BookOpenCheck, Zap, Eye, TrendingDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { AccessibilityToggle } from "@/components/ui/accessibility-toggle";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

type DashboardMode = 'investor' | 'developer';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>('investor');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Fetch AI models for search
  const { data: aiModels = [] } = useQuery({
    queryKey: ["/api/ai-models"],
    enabled: searchOpen,
  });

  const handleDashboardModeChange = (mode: DashboardMode) => {
    setDashboardMode(mode);
    localStorage.setItem('dashboardMode', mode);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('dashboardMode') as DashboardMode;
    if (savedMode) {
      setDashboardMode(savedMode);
    }
  }, []);

  const handleSearchSelect = (modelId: string) => {
    setSearchOpen(false);
    navigate(`/model/${modelId}`);
  };

  const filteredModels = searchQuery 
    ? (aiModels as any[]).filter((model: any) => 
        model.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Market Insights submenu items
  const marketInsightsNavItems = [
    { href: "/live-trading", label: "Real-Time Market Data", icon: Activity },
    { href: "/market-sentiment", label: "AI-Generated Insights", icon: Brain },
    { href: "/alerts/all", label: "Recent Alerts", icon: Bell },
  ];

  // Portfolio submenu items
  const portfolioNavItems = [
    { href: "/portfolio", label: "Overview", icon: BarChart3 },
    { href: "/portfolio/ai-models", label: "AI Models", icon: Brain },
    { href: "/portfolio/risk-distribution", label: "Risk Distribution", icon: Shield },
    { href: "/portfolio/rebalance", label: "Rebalance & Actions", icon: TrendingUp },
  ];

  // Reports submenu items
  const reportsNavItems = [
    { href: "/reports", label: "Investor Reports", icon: FileText },
    { href: "/reports/all", label: "Generate New Report", icon: BarChart3 },
  ];

  // Risk Management submenu items
  const riskManagementNavItems = [
    { href: "/risk-management", label: "AI Risk Monitoring", icon: AlertTriangle },
    { href: "/risk-management/assessment", label: "Current Risk Assessment", icon: Shield },
  ];

  // Trading submenu items
  const tradingNavItems = [
    { href: "/live-trading", label: "Live Market Data", icon: Activity },
    { href: "/live-trading?tab=orderbook", label: "Order Book", icon: BarChart3 },
  ];

  // Learning submenu items for investors
  const learningNavItems = [
    { href: "/learning?tab=tutorials&type=investor", label: "Tutorials", icon: BookOpen },
    { href: "/learning?tab=webinars&type=investor", label: "Webinars", icon: BookOpenCheck },
    { href: "/learning?tab=faq&type=investor", label: "FAQ", icon: BookOpen },
  ];

  const developerNavItems = [
    { href: "/developer", label: "Dashboard", icon: Code },
    { href: "/backtesting", label: "Backtesting", icon: BarChart3 },
    { href: "/marketplace", label: "Marketplace", icon: Briefcase },
  ];

  const currentNavItems = dashboardMode === 'developer' ? developerNavItems : [];

  return (
    <header className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Brain className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">GeFi</span>
              </div>
            </Link>

            {/* Desktop Navigation for authenticated users */}
            {isAuthenticated && (
              <>
                {/* Dashboard Mode Switcher */}
                <div className="hidden lg:flex items-center space-x-3">
                  <Select value={dashboardMode} onValueChange={handleDashboardModeChange}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue>
                        <div className="flex items-center space-x-2">
                          {dashboardMode === 'developer' ? (
                            <>
                              <Code className="h-4 w-4" />
                              <span>Developer</span>
                            </>
                          ) : (
                            <>
                              <TrendingUp className="h-4 w-4" />
                              <span>Investor</span>
                            </>
                          )}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investor">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>Investor Mode</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="developer">
                        <div className="flex items-center space-x-2">
                          <Code className="h-4 w-4" />
                          <span>Developer Mode</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Badge variant={dashboardMode === 'developer' ? 'default' : 'secondary'} className="text-xs">
                    {dashboardMode === 'developer' ? 'DEV' : 'INV'}
                  </Badge>
                </div>

                {/* Desktop Navigation Menu */}
                <nav className="hidden lg:flex space-x-1">
                  {dashboardMode === 'developer' ? (
                    <>
                      {/* Developer Navigation Items */}
                      <Link href="/developer">
                        <Button 
                          variant="ghost" 
                          className={`transition-colors ${
                            location === '/developer'
                              ? 'text-primary font-medium' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          Dashboard
                        </Button>
                      </Link>
                      
                      <Link href="/backtesting">
                        <Button 
                          variant="ghost" 
                          className={`transition-colors ${
                            location === '/backtesting'
                              ? 'text-primary font-medium' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          Backtesting
                        </Button>
                      </Link>

                      <Link href="/bounties">
                        <Button 
                          variant="ghost" 
                          className={`transition-colors ${
                            location === '/bounties'
                              ? 'text-primary font-medium' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          Bounties
                        </Button>
                      </Link>

                      {/* Learning Section for Developers */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className={`transition-colors ${
                              location === '/learning'
                                ? 'text-primary font-medium' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            Learning
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <Link href="/learning?tab=get-started&type=developer">
                              Get Started
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/learning?tab=tutorials&type=developer">
                              Tutorials
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/learning?tab=webinars&type=developer">
                              Webinars
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/learning?tab=blog&type=developer">
                              Blog
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/learning?tab=faq&type=developer">
                              FAQ
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  ) : (
                    /* Investor Navigation */
                    <>
                      {/* Home */}
                      <Link href="/">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className={`transition-colors ${
                            location === '/' 
                              ? 'text-primary font-medium' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          Home
                        </Button>
                      </Link>

                      {/* Market Insights Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={`transition-colors ${
                              marketInsightsNavItems.some(item => location === item.href)
                                ? 'text-primary font-medium' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Market Insights
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {marketInsightsNavItems.map((item) => (
                            <DropdownMenuItem key={item.href} asChild>
                              <Link href={item.href}>
                                <item.icon className="h-4 w-4 mr-2" />
                                {item.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Portfolio Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={`transition-colors ${
                              portfolioNavItems.some(item => location === item.href)
                                ? 'text-primary font-medium' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Portfolio
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {portfolioNavItems.map((item) => (
                            <DropdownMenuItem key={item.href} asChild>
                              <Link href={item.href}>
                                <item.icon className="h-4 w-4 mr-2" />
                                {item.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Reports Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={`transition-colors ${
                              reportsNavItems.some(item => location === item.href)
                                ? 'text-primary font-medium' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Reports
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {reportsNavItems.map((item) => (
                            <DropdownMenuItem key={item.href} asChild>
                              <Link href={item.href}>
                                <item.icon className="h-4 w-4 mr-2" />
                                {item.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Risk Management Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={`transition-colors ${
                              riskManagementNavItems.some(item => location === item.href)
                                ? 'text-primary font-medium' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Risk Management
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {riskManagementNavItems.map((item) => (
                            <DropdownMenuItem key={item.href} asChild>
                              <Link href={item.href}>
                                <item.icon className="h-4 w-4 mr-2" />
                                {item.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Trading Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={`transition-colors ${
                              tradingNavItems.some(item => location === item.href)
                                ? 'text-primary font-medium' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Activity className="h-4 w-4 mr-1" />
                            Trading
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {tradingNavItems.map((item) => (
                            <DropdownMenuItem key={item.href} asChild>
                              <Link href={item.href}>
                                <item.icon className="h-4 w-4 mr-2" />
                                {item.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Learning Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={`transition-colors ${
                              learningNavItems.some(item => location.includes('/learning'))
                                ? 'text-primary font-medium' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            Learning
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {learningNavItems.map((item) => (
                            <DropdownMenuItem key={item.href} asChild>
                              <Link href={item.href}>
                                <item.icon className="h-4 w-4 mr-2" />
                                {item.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </nav>
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Search Dialog - Authenticated users */}
                <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                      <Search className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl bg-background/95 backdrop-blur-sm border border-border/50 shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Search AI Financial Models</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Find the perfect AI model for your financial needs
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search models, descriptions, or tags..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                          autoFocus
                        />
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {searchQuery && filteredModels.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No models found matching "{searchQuery}"</p>
                            <p className="text-sm">Try different keywords or browse the marketplace</p>
                          </div>
                        )}
                        
                        {searchQuery && filteredModels.length > 0 && (
                          <div className="text-sm text-muted-foreground mb-2">
                            Found {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''}
                          </div>
                        )}
                        
                        {(searchQuery ? filteredModels : (aiModels as any[]).slice(0, 8)).map((model: any) => (
                          <div
                            key={model.id}
                            onClick={() => handleSearchSelect(model.id)}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                          >
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Brain className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{model.name}</h4>
                              <p className="text-xs text-muted-foreground truncate">
                                {model.description}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  ${model.price || 0}/mo
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {model.riskLevel || 'Medium'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {!searchQuery && (aiModels as any[]).length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Loading AI models...</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchOpen(false);
                            navigate('/marketplace');
                          }}
                        >
                          Browse All Models
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setSearchOpen(false)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hidden sm:flex relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold">Notifications</h3>
                      <p className="text-sm text-muted-foreground">Stay updated with your portfolio and models</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-4 border-b">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Portfolio Alert</p>
                            <p className="text-xs text-muted-foreground">Your portfolio value increased by 2.4% today</p>
                            <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <Button variant="outline" className="w-full text-sm">
                        View All Notifications
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <AccessibilityToggle />
                <LanguageSwitcher />
                
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={(user as any)?.profileImageUrl || undefined} alt={(user as any)?.firstName || "User"} />
                        <AvatarFallback>
                          {(user as any)?.firstName?.[0] || (user as any)?.email?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {(user as any)?.firstName && (
                          <p className="font-medium">
                            {(user as any)?.firstName} {(user as any)?.lastName || ''}
                          </p>
                        )}
                        {(user as any)?.email && (
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {(user as any)?.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              /* Sign In Button for unauthenticated users */
              <Button 
                onClick={() => window.location.href = '/login'}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border">
              {isAuthenticated ? (
                <>
                  {/* Mobile Dashboard Switcher for authenticated users */}
                  <div className="px-3 py-3 border-b border-border mb-3 bg-gradient-to-r from-background to-muted/20 rounded-lg mx-2">
                    <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Dashboard Mode</div>
                    
                    <div className="space-y-2">
                      <div className="bg-background border border-border rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${dashboardMode === 'developer' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'}`}>
                              {dashboardMode === 'developer' ? (
                                <Code className="h-4 w-4" />
                              ) : (
                                <TrendingUp className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                {dashboardMode === 'developer' ? 'Developer Dashboard' : 'Investor Dashboard'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {dashboardMode === 'developer' ? 'Build and deploy AI models' : 'Manage investments and trading'}
                              </div>
                            </div>
                          </div>
                          <Badge 
                            variant={dashboardMode === 'developer' ? 'default' : 'secondary'} 
                            className={`text-xs font-bold ${dashboardMode === 'developer' ? 'bg-purple-600' : 'bg-blue-600'} text-white`}
                          >
                            {dashboardMode === 'developer' ? 'DEV' : 'INV'}
                          </Badge>
                        </div>
                      </div>

                      {/* Switch Options */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleDashboardModeChange('investor')}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            dashboardMode === 'investor'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
                              : 'border-border hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`p-2 rounded-full ${dashboardMode === 'investor' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'}`}>
                              <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="text-xs font-medium">Investor</div>
                            {dashboardMode === 'investor' && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </button>

                        <button
                          onClick={() => handleDashboardModeChange('developer')}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            dashboardMode === 'developer'
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50'
                              : 'border-border hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-950/20'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`p-2 rounded-full ${dashboardMode === 'developer' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'}`}>
                              <Code className="h-4 w-4" />
                            </div>
                            <div className="text-xs font-medium">Developer</div>
                            {dashboardMode === 'developer' && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            )}
                          </div>
                        </button>
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="text-xs text-muted-foreground mb-2">Quick Actions</div>
                        <div className="flex gap-2">
                          {dashboardMode === 'developer' ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 h-8 text-xs"
                                onClick={() => {
                                  navigate('/developer');
                                  setMobileMenuOpen(false);
                                }}
                              >
                                <BarChart3 className="h-3 w-3 mr-1" />
                                Dashboard
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 h-8 text-xs"
                                onClick={() => {
                                  navigate('/backtesting');
                                  setMobileMenuOpen(false);
                                }}
                              >
                                <Activity className="h-3 w-3 mr-1" />
                                Backtest
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 h-8 text-xs"
                                onClick={() => {
                                  navigate('/portfolio');
                                  setMobileMenuOpen(false);
                                }}
                              >
                                <BarChart3 className="h-3 w-3 mr-1" />
                                Portfolio
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 h-8 text-xs"
                                onClick={() => {
                                  navigate('/trading-bots');
                                  setMobileMenuOpen(false);
                                }}
                              >
                                <Bot className="h-3 w-3 mr-1" />
                                Bots
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  {dashboardMode === 'developer' ? (
                    /* Developer Mobile Navigation */
                    <>
                      <div className="px-3 py-2">
                        <div className="flex items-center space-x-2 px-3 py-2 text-primary bg-primary/10 rounded-md">
                          <Code className="h-5 w-5" />
                          <span className="text-base font-medium">Developer</span>
                          <Badge variant="secondary" className="text-xs bg-purple-600 text-white">DEV</Badge>
                        </div>
                      </div>
                      
                      <div className="pl-6">
                        <Link href="/developer">
                          <a 
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                              location === '/developer' 
                                ? 'text-primary bg-primary/10' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <BarChart3 className="h-5 w-5" />
                            <span>Dashboard</span>
                          </a>
                        </Link>
                        
                        <Link href="/backtesting">
                          <a 
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                              location === '/backtesting' 
                                ? 'text-primary bg-primary/10' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <BarChart3 className="h-5 w-5" />
                            <span>Backtesting</span>
                          </a>
                        </Link>
                        
                        <Link href="/bounties">
                          <a 
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                              location === '/bounties' 
                                ? 'text-primary bg-primary/10' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Target className="h-5 w-5" />
                            <span>Bounties</span>
                          </a>
                        </Link>
                        
                        <Link href="/learning">
                          <a 
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                              location === '/learning' 
                                ? 'text-primary bg-primary/10' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <BookOpen className="h-5 w-5" />
                            <span>Learning</span>
                          </a>
                        </Link>
                      </div>
                      
                      {/* Marketplace Link */}
                      <Link href="/marketplace">
                        <a 
                          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                            location === '/marketplace' 
                              ? 'text-primary bg-primary/10' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Briefcase className="h-5 w-5" />
                          <span>Marketplace</span>
                        </a>
                      </Link>
                    </>
                  ) : (
                    /* Investor Mobile Navigation */
                    <>
                      {/* Home */}
                      <Link href="/">
                        <a 
                          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                            location === '/' 
                              ? 'text-primary bg-primary/10' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Home className="h-5 w-5" />
                          <span>Home</span>
                        </a>
                      </Link>

                      {/* Market Insights Links */}
                      <div className="mt-4 mb-2">
                        <h4 className="text-sm font-semibold text-muted-foreground px-3">Market Insights</h4>
                      </div>
                      {marketInsightsNavItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a 
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                              location === item.href 
                                ? 'text-primary bg-primary/10' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </a>
                        </Link>
                      ))}

                      {/* Portfolio Links */}
                      <div className="mt-4 mb-2">
                        <h4 className="text-sm font-semibold text-muted-foreground px-3">Portfolio</h4>
                      </div>
                      {portfolioNavItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a 
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                              location === item.href 
                                ? 'text-primary bg-primary/10' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </a>
                        </Link>
                      ))}

                      {/* Reports Links */}
                      <div className="mt-4 mb-2">
                        <h4 className="text-sm font-semibold text-muted-foreground px-3">Reports</h4>
                      </div>
                      {reportsNavItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a 
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                              location === item.href 
                                ? 'text-primary bg-primary/10' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </a>
                        </Link>
                      ))}

                      {/* Risk Management Links */}
                      <div className="mt-4 mb-2">
                        <h4 className="text-sm font-semibold text-muted-foreground px-3">Risk Management</h4>
                      </div>
                      {riskManagementNavItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a 
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                              location === item.href 
                                ? 'text-primary bg-primary/10' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </a>
                        </Link>
                      ))}

                      {/* Trading Links */}
                      <div className="mt-4 mb-2">
                        <h4 className="text-sm font-semibold text-muted-foreground px-3">Trading</h4>
                      </div>
                      {tradingNavItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a 
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                              location === item.href 
                                ? 'text-primary bg-primary/10' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </a>
                        </Link>
                      ))}

                      {/* Learning Links */}
                      <div className="mt-4 mb-2">
                        <h4 className="text-sm font-semibold text-muted-foreground px-3">Learning</h4>
                      </div>
                      {learningNavItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a 
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                              location === item.href 
                                ? 'text-primary bg-primary/10' 
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </a>
                        </Link>
                      ))}
                    </>
                  )}
                </>
              ) : (
                /* Mobile Sign In for unauthenticated users */
                <div className="px-3 py-4">
                  <Button 
                    onClick={() => {
                      window.location.href = '/login';
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}