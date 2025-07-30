import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Search,
  Menu,
  X,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Home,
  BarChart3,
  TrendingUp,
  Brain,
  Target,
  Store,
  AlertTriangle,
  Shield,
  Bell,
  BookOpen,
  Code,
  TestTube,
  Wallet,
  Bot,
  Zap,
  Globe,
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
  Flag,
  CheckCircle,
  Star,
  Award,
  MessageCircle,
  GitBranch,
  BookmarkCheck,
  Briefcase,
  UserPlus,
  HelpCircle,
  FileText
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme/theme-provider";
import { useQuery } from "@tanstack/react-query";

export default function Header() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        { name: "Risk Reports", href: "/risk-reports", icon: Shield },
        { name: "Compliance Reports", href: "/compliance-reports", icon: CheckCircle },
        { name: "Custom Reports", href: "/custom-reports", icon: FileText }
      ];
    }
    
    return [];
  };

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl hidden sm:inline-block">GeFi</span>
              </div>
            </Link>

            {/* Search and Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Search */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="w-9 h-9 md:w-auto md:h-auto p-2 md:px-3 md:py-2 text-muted-foreground hover:text-foreground"
              >
                <Search className="h-4 w-4 md:h-5 md:w-5" />
              </Button>

              {/* AI Chatbot Icon Only */}
              <Button
                variant="ghost"
                size="sm"
                className="w-9 h-9 md:w-auto md:h-auto p-2 md:px-3 md:py-2 text-muted-foreground hover:text-foreground"
                title="AI Assistant"
              >
                <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
              </Button>

              {/* Notifications */}
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-9 h-9 md:w-auto md:h-auto p-2 md:px-3 md:py-2 text-muted-foreground hover:text-foreground relative"
                >
                  <Bell className="h-4 w-4 md:h-5 md:w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              )}

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 md:w-auto md:h-auto p-2 md:px-3 md:py-2"
              >
                <Sun className="h-4 w-4 md:h-5 md:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 md:h-5 md:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.profileImageUrl} alt={user.firstName} />
                        <AvatarFallback>
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild>
                  <Link href="/api/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search AI Models</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
              setIsSearchOpen(false);
              setSearchQuery("");
            }
          }}>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for AI models, categories, or features..."
                  className="pl-10 bg-background/50 border-border/50 focus:bg-background focus:border-border"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      e.preventDefault();
                      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }
                  }}
                />
              </div>
              
              {/* Quick Search Suggestions */}
              {searchQuery.length === 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground mb-2">Popular searches:</div>
                  <div className="flex flex-wrap gap-2">
                    {["Risk Assessment", "Trading Bots", "Portfolio", "Sentiment Analysis", "Backtesting"].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setSearchQuery(suggestion);
                          navigate(`/marketplace?search=${encodeURIComponent(suggestion)}`);
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results Preview */}
              {searchQuery.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Press Enter to search for "{searchQuery}"</div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <Button
                      type="submit"
                      disabled={!searchQuery.trim()}
                      className="flex-1 mr-2"
                    >
                      Search Models
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}