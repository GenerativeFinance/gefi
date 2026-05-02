import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp,
  BarChart3,
  Bot,
  Shield,
  FileText,
  Settings,
  Network,
  Trophy,
  Activity,
  Database,
  Eye,
  GitBranch,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Code
} from "lucide-react";

// Define navigation patterns for different sections
const navigationPatterns = {
  // Portfolio Overview tabs
  portfolio: [
    { key: "overview", label: "Overview", icon: TrendingUp },
    { key: "returns", label: "Returns", icon: BarChart3 },
    { key: "allocation", label: "Allocation", icon: BarChart3 },
    { key: "risk-analysis", label: "Risk Analysis", icon: Shield }
  ],
  
  // AI Models/Marketplace tabs
  marketplace: [
    { key: "for-you", label: "For You", icon: Bot },
    { key: "trending", label: "Trending", icon: TrendingUp },
    { key: "browse-all", label: "Browse All", icon: Eye },
    { key: "categories", label: "Categories", icon: FileText }
  ],
  
  // AI Model Management tabs  
  models: [
    { key: "all", label: "All (4)", icon: Bot },
    { key: "active", label: "Active (2)", icon: CheckCircle },
    { key: "paused", label: "Paused (1)", icon: AlertTriangle },
    { key: "trial", label: "Trial (1)", icon: Clock }
  ],
  
  // Developer Dashboard tabs
  developer: [
    { key: "overview", label: "Overview", icon: TrendingUp },
    { key: "my-models", label: "My Models", icon: Bot },
    { key: "training", label: "Training", icon: Activity },
    { key: "deployment", label: "Deployment", icon: Network },
    { key: "collaboration", label: "Collaboration", icon: Users },
    { key: "monitoring", label: "Monitoring", icon: Eye }
  ],
  
  // Development/Analysis tabs
  develop: [
    { key: "configure", label: "Configure", icon: Settings },
    { key: "live-monitor", label: "Live Monitor", icon: Activity },
    { key: "optimizer", label: "Optimizer", icon: TrendingUp },
    { key: "results", label: "Results", icon: BarChart3 },
    { key: "analysis", label: "Analysis", icon: Eye },
    { key: "comparison", label: "Comparison", icon: GitBranch }
  ],
  
  // Environment/IDE tabs
  ide: [
    { key: "active-environments", label: "Active Environments", icon: Code },
    { key: "templates", label: "Templates", icon: FileText },
    { key: "resources", label: "Resources", icon: Database },
    { key: "settings", label: "Settings", icon: Settings }
  ],
  
  // Repository/Version Control tabs
  repository: [
    { key: "repositories", label: "Repositories", icon: Database },
    { key: "branches", label: "Branches", icon: GitBranch },
    { key: "pull-requests", label: "Pull Requests", icon: GitBranch },
    { key: "commits", label: "Commits", icon: FileText },
    { key: "settings", label: "Settings", icon: Settings }
  ],
  
  // Code Review tabs
  review: [
    { key: "pending-reviews", label: "Pending Reviews (3)", icon: Clock },
    { key: "completed", label: "Completed", icon: CheckCircle },
    { key: "my-reviews", label: "My Reviews", icon: Eye },
    { key: "settings", label: "Settings", icon: Settings }
  ],
  
  // Data Schema/Documentation tabs
  schema: [
    { key: "basic-info", label: "Basic Info", icon: FileText },
    { key: "schema", label: "Schema", icon: Database },
    { key: "quality-metrics", label: "Quality Metrics", icon: BarChart3 },
    { key: "compliance", label: "Compliance", icon: Shield },
    { key: "documentation", label: "Documentation", icon: FileText }
  ],
  
  // Federated Learning/Network tabs
  network: [
    { key: "fl-contracts", label: "FL Contracts", icon: FileText },
    { key: "transactions", label: "Transactions", icon: Activity },
    { key: "model-performance", label: "Model Performance", icon: BarChart3 },
    { key: "network", label: "Network", icon: Network },
    { key: "leaderboard", label: "Leaderboard", icon: Trophy },
    { key: "settings", label: "Settings", icon: Settings }
  ]
};

interface ContextualMobileNavProps {
  context?: keyof typeof navigationPatterns;
  activeTabs?: string[];
  onTabChange?: (tabKey: string) => void;
}

export default function ContextualMobileNav({ 
  context = "portfolio", 
  activeTabs = [],
  onTabChange 
}: ContextualMobileNavProps) {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState(activeTabs[0] || navigationPatterns[context]?.[0]?.key);
  
  const tabs = navigationPatterns[context] || [];
  
  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);
    onTabChange?.(tabKey);
  };
  
  if (tabs.length === 0) return null;
  
  return (
    <div className="md:hidden">
      {/* Horizontal scrollable tabs for mobile */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-16 z-40">
        <div className="flex overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max px-4 py-2 gap-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.key;
              
              return (
                <Button
                  key={tab.key}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTabClick(tab.key)}
                  className={`flex items-center gap-2 min-w-fit whitespace-nowrap ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Alternative: Dropdown selector for very many tabs */}
      {tabs.length > 6 && (
        <div className="px-4 py-2 bg-muted/30">
          <select
            value={activeTab}
            onChange={(e) => handleTabClick(e.target.value)}
            className="w-full p-2 rounded-md bg-background border border-border text-sm"
          >
            {tabs.map((tab) => (
              <option key={tab.key} value={tab.key}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

// Export navigation patterns for use in other components
export { navigationPatterns };