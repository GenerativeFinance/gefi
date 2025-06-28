import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Brain, Search, Bell, Menu, User, Settings, LogOut, Code, TrendingUp, BarChart3, Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { AccessibilityToggle } from "@/components/ui/accessibility-toggle";
import { useState, useEffect } from "react";

type DashboardMode = 'investor' | 'developer';

export default function Header() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>('investor');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine dashboard mode based on current route
  useEffect(() => {
    if (location?.includes('/developer') || location?.includes('/backtesting')) {
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
                <span className="text-xl font-bold">GenoFi</span>
              </div>
            </Link>

            {/* Dashboard Mode Switcher */}
            <div className="hidden lg:flex items-center space-x-3">
              <Select value={dashboardMode} onValueChange={handleDashboardModeChange}>
                <SelectTrigger className="w-[160px] h-9">
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
              
              <Badge variant={dashboardMode === 'developer' ? 'default' : 'secondary'} className="text-xs">
                {dashboardMode === 'developer' ? 'DEV' : 'INV'}
              </Badge>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex space-x-6">
              {currentNavItems.map((item) => (
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
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Bell className="h-5 w-5" />
            </Button>
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
              {currentNavItems.map((item) => (
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
