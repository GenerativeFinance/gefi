import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code,
  GitBranch,
  Database,
  FileText,
  Settings,
  Eye,
  CheckCircle,
  Clock,
  Users,
  Terminal,
  Play,
  Save
} from "lucide-react";

// Developer-specific mobile navigation tabs
const developerTabs = [
  { key: "active-environments", label: "Active Environments", icon: Code, badge: "3" },
  { key: "templates", label: "Templates", icon: FileText },
  { key: "resources", label: "Resources", icon: Database },
  { key: "settings", label: "Settings", icon: Settings }
];

const repositoryTabs = [
  { key: "repositories", label: "Repositories", icon: Database, badge: "12" },
  { key: "branches", label: "Branches", icon: GitBranch },
  { key: "pull-requests", label: "Pull Requests", icon: GitBranch, badge: "4" },
  { key: "commits", label: "Commits", icon: FileText },
  { key: "settings", label: "Settings", icon: Settings }
];

const reviewTabs = [
  { key: "pending-reviews", label: "Pending Reviews", icon: Clock, badge: "3" },
  { key: "completed", label: "Completed", icon: CheckCircle },
  { key: "my-reviews", label: "My Reviews", icon: Eye },
  { key: "settings", label: "Settings", icon: Settings }
];

// IDE Action buttons for mobile
const ideActions = [
  { key: "run", label: "Run", icon: Play, color: "bg-green-600 hover:bg-green-700" },
  { key: "save", label: "Save", icon: Save, color: "bg-blue-600 hover:bg-blue-700" },
  { key: "terminal", label: "Terminal", icon: Terminal, color: "bg-gray-600 hover:bg-gray-700" },
  { key: "collaborate", label: "Collaborate", icon: Users, color: "bg-purple-600 hover:bg-purple-700" }
];

interface DeveloperMobileNavProps {
  context: "ide" | "repository" | "review";
  onTabChange?: (tabKey: string) => void;
  onAction?: (actionKey: string) => void;
}

export default function DeveloperMobileNav({ 
  context, 
  onTabChange,
  onAction 
}: DeveloperMobileNavProps) {
  const [activeTab, setActiveTab] = useState("active-environments");
  
  const getTabs = () => {
    switch (context) {
      case "repository": return repositoryTabs;
      case "review": return reviewTabs;
      default: return developerTabs;
    }
  };
  
  const tabs = getTabs();
  
  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);
    onTabChange?.(tabKey);
  };
  
  const handleActionClick = (actionKey: string) => {
    onAction?.(actionKey);
  };
  
  return (
    <div className="md:hidden">
      {/* Main Navigation Tabs */}
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
                  className={`flex items-center gap-2 min-w-fit whitespace-nowrap relative ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  {tab.badge && (
                    <Badge className="ml-1 scale-75 bg-red-500 text-white">
                      {tab.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* IDE-specific Action Bar (only for IDE context) */}
      {context === "ide" && (
        <div className="bg-muted/30 border-b border-border">
          <div className="flex justify-center py-2 px-4 gap-2">
            {ideActions.map((action) => {
              const IconComponent = action.icon;
              
              return (
                <Button
                  key={action.key}
                  size="sm"
                  onClick={() => handleActionClick(action.key)}
                  className={`flex items-center gap-1 text-white ${action.color}`}
                >
                  <IconComponent className="h-3 w-3" />
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}