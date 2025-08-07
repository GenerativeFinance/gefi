import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  TrendingUp, 
  PieChart, 
  FileText, 
  Shield, 
  Store, 
  DollarSign,
  LogOut,
  User,
  Bot,
  Activity,
  BarChart3,
  Network,
  Code,
  Database,
  Users,
  Settings as SettingsIcon,
  Wallet,
  HelpCircle,
  Server
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navigationItems = [
  { path: "/", label: "Dashboard", icon: TrendingUp },
  { path: "/portfolio", label: "Portfolio", icon: PieChart },
  { path: "/ai-models", label: "AI Models", icon: Bot, badge: "New" },
  { path: "/marketplace", label: "Marketplace", icon: Store },
  { path: "/wallet", label: "Wallet", icon: Wallet },
];

const moreNavigationItems = [
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/risk-management", label: "Risk", icon: Shield },
  { path: "/backtesting", label: "Backtesting", icon: BarChart3 },
  { path: "/federated-learning", label: "FL Network", icon: Network },
  { path: "/trading-bots", label: "Trading Bots", icon: Activity },
  { path: "/wallet-management", label: "Wallet Management", icon: Wallet },
  { path: "/server-management", label: "Server Management", icon: Server },
  { path: "/developer", label: "Developer", icon: Code },
  { path: "/data-provider", label: "Data Provider", icon: Database },
  { path: "/collaboration", label: "Collaboration", icon: Users },
  { path: "/settings", label: "Settings", icon: SettingsIcon },
  { path: "/pricing", label: "Pricing", icon: DollarSign },
  { path: "/help", label: "Help & Support", icon: HelpCircle },
];

export default function MobileNav() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        {navigationItems.slice(0, 4).map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 p-2 h-auto ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div className="relative">
                  <IconComponent className="h-5 w-5" />
                  {item.badge && (
                    <Badge className="absolute -top-2 -right-2 scale-75 bg-primary text-primary-foreground">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            </Link>
          );
        })}

        {/* More Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 p-2 h-auto text-muted-foreground"
            >
              <Menu className="h-5 w-5" />
              <span className="text-xs font-medium">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[80vh]">
            <div className="py-4">
              <div className="flex items-center gap-3 mb-6 p-4 bg-secondary/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">
                    {(user as any)?.firstName} {(user as any)?.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {(user as any)?.email}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {/* Primary Navigation Items */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Main</h3>
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = location === item.path;
                    
                    return (
                      <Link key={item.path} href={item.path}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className="w-full justify-start gap-3"
                          onClick={() => setIsOpen(false)}
                        >
                          <IconComponent className="h-5 w-5" />
                          <span>{item.label}</span>
                          {item.badge && (
                            <Badge className="ml-auto bg-primary text-primary-foreground">
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      </Link>
                    );
                  })}
                </div>

                {/* More Navigation Items */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">More Features</h3>
                  {moreNavigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = location === item.path;
                    
                    return (
                      <Link key={item.path} href={item.path}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className="w-full justify-start gap-3"
                          onClick={() => setIsOpen(false)}
                        >
                          <IconComponent className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Button>
                      </Link>
                    );
                  })}
                </div>

                <div className="my-4 border-t border-border" />

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}