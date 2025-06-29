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
import { Brain, Search, Bell, Menu, User, Settings, LogOut, Code, TrendingUp, BarChart3, Briefcase, X, Target, BookOpen, Home, Activity } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { AccessibilityToggle } from "@/components/ui/accessibility-toggle";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

type DashboardMode = 'investor' | 'developer';

export default function Header() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>('investor');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch AI models for search
  const { data: aiModels = [] } = useQuery({
    queryKey: ["/api/ai-models"],
    enabled: searchOpen,
  });

  // Filter models based on search query
  const filteredModels = Array.isArray(aiModels) ? aiModels.filter((model: any) =>
    model.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  const handleSearchSelect = (modelId: number) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(`/marketplace?model=${modelId}`);
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine dashboard mode based on current route
  useEffect(() => {
    if (location?.includes('/developer') || location?.includes('/backtesting') || location?.includes('/bounties') || location?.includes('/learning')) {
      setDashboardMode('developer');
    } else {
      setDashboardMode('investor');
    }
  }, [location]);

  const handleDashboardModeChange = (mode: DashboardMode) => {
    setDashboardMode(mode);
    if (mode === 'developer') {
      navigate('/developer');
    } else {
      navigate('/portfolio');
    }
  };

  const investorNavItems = [
    { href: "/", label: "Home", icon: TrendingUp },
    { href: "/portfolio", label: "Portfolio", icon: BarChart3 },
    { href: "/live-trading", label: "Trading", icon: Activity },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/risk-management", label: "Risk", icon: BarChart3 },
    { href: "/marketplace", label: "Marketplace", icon: Briefcase },
  ];

  const developerNavItems = [
    { href: "/developer", label: "Dashboard", icon: Code },
    { href: "/backtesting", label: "Backtesting", icon: BarChart3 },
    { href: "/marketplace", label: "Marketplace", icon: Briefcase },
  ];

  const currentNavItems = dashboardMode === 'developer' ? developerNavItems : investorNavItems;

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

            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-6">
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
                      <BarChart3 className="h-4 w-4 mr-1" />
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
                      <BarChart3 className="h-4 w-4 mr-1" />
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
                      <Target className="h-4 w-4 mr-1" />
                      Bounties
                    </Button>
                  </Link>

                  <Link href="/learning">
                    <Button 
                      variant="ghost" 
                      className={`transition-colors ${
                        location === '/learning'
                          ? 'text-primary font-medium' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      Learning
                    </Button>
                  </Link>
                </>
              ) : (
                /* Investor Navigation */
                <>
                  {investorNavItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <a className={`flex items-center space-x-1 transition-colors ${
                        location === item.href 
                          ? 'text-primary font-medium' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </a>
                    </Link>
                  ))}
                </>
              )}
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
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
                    
                    {(searchQuery ? filteredModels : aiModels.slice(0, 8)).map((model: any) => (
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
                    
                    {!searchQuery && aiModels.length === 0 && (
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
                  <div className="p-4 border-b">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Model Performance</p>
                        <p className="text-xs text-muted-foreground">Quantum Risk Predictor achieved 94% accuracy</p>
                        <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Risk Alert</p>
                        <p className="text-xs text-muted-foreground">High volatility detected in tech sector positions</p>
                        <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New Model Available</p>
                        <p className="text-xs text-muted-foreground">Advanced Sentiment Analyzer v2.0 is now live</p>
                        <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
                    <AvatarFallback>
                      {user?.firstName?.[0] || user?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.firstName && (
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                    )}
                    {user?.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
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

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="h-4 w-4 mr-2" />
                      Search AI Models
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl bg-background/95 backdrop-blur-sm border border-border/50 shadow-2xl">
                    <DialogHeader>
                      <DialogTitle>Search AI Financial Models</DialogTitle>
                      <DialogDescription>
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
                        
                        {(searchQuery ? filteredModels : aiModels.slice(0, 8)).map((model: any) => (
                          <div
                            key={model.id}
                            onClick={() => {
                              handleSearchSelect(model.id);
                              setMobileMenuOpen(false);
                            }}
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
                        
                        {!searchQuery && aiModels.length === 0 && (
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
                            setMobileMenuOpen(false);
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
              </div>
              
              {/* Mobile Dashboard Switcher */}
              <div className="px-3 py-2">
                <Select value={dashboardMode} onValueChange={handleDashboardModeChange}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        {dashboardMode === 'developer' ? (
                          <>
                            <Code className="h-4 w-4" />
                            <span>Developer Dashboard</span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="h-4 w-4" />
                            <span>Investor Dashboard</span>
                          </>
                        )}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investor">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>Investor Dashboard</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="developer">
                      <div className="flex items-center space-x-2">
                        <Code className="h-4 w-4" />
                        <span>Developer Dashboard</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Navigation */}
              {dashboardMode === 'developer' ? (
                <>
                  {/* Developer Section with Badge */}
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-2 px-3 py-2 text-primary bg-primary/10 rounded-md">
                      <Code className="h-5 w-5" />
                      <span className="text-base font-medium">Developer</span>
                      <Badge variant="secondary" className="text-xs bg-purple-600 text-white">DEV</Badge>
                    </div>
                  </div>
                  
                  {/* Developer Sub-items */}
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
                  {investorNavItems.map((item) => (
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
