import { Home, BarChart3, Brain, Bell, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/portfolio", icon: BarChart3, label: "Portfolio" },
    { href: "/marketplace", icon: Brain, label: "AI Models" },
    { href: "/risk-management", icon: Bell, label: "Alerts" },
    { href: "/pricing", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-border px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
