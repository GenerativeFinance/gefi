import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ContextualMobileNav from "@/components/layout/contextual-mobile-nav";
import DeveloperMobileNav from "@/components/layout/developer-mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
  Code, 
  Network, 
  Bot, 
  BarChart3,
  Users,
  Database,
  Settings,
  Wallet,
  PieChart,
  FileText
} from "lucide-react";

export default function MobileDemo() {
  const [selectedContext, setSelectedContext] = useState("portfolio");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAction, setSelectedAction] = useState("");

  const mobileContexts = [
    { key: "portfolio", label: "Portfolio", icon: PieChart, description: "Portfolio overview and performance tracking" },
    { key: "marketplace", label: "Marketplace", icon: Bot, description: "AI model discovery and browsing" },
    { key: "models", label: "AI Models", icon: Bot, description: "Model management and status" },
    { key: "developer", label: "Developer", icon: Code, description: "Development tools and collaboration" },
    { key: "backtesting", label: "Backtesting", icon: BarChart3, description: "Strategy testing and analysis" },
    { key: "network", label: "FL Network", icon: Network, description: "Federated learning network visualization" },
    { key: "schema", label: "Data Schema", icon: Database, description: "Data structure documentation" },
    { key: "repository", label: "Repository", icon: FileText, description: "Code repository management" },
    { key: "review", label: "Code Review", icon: Users, description: "Peer review and collaboration" }
  ];

  const demoData = {
    portfolio: {
      totalValue: "$2,450,380",
      dailyChange: "+2.3%",
      aiModels: 12,
      performance: "88.7%"
    },
    network: {
      participants: 47,
      activeModels: 8,
      totalRewards: "12,450 GeFi",
      myRank: "#23"
    },
    developer: {
      activeProjects: 5,
      openPRs: 3,
      codeReviews: 2,
      buildStatus: "Passing"
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Smartphone className="h-8 w-8 text-primary" />
              Mobile Navigation Demo
            </h1>
            <p className="text-muted-foreground mt-2">
              Explore responsive mobile navigation patterns for different sections
            </p>
          </div>
        </div>

        {/* Context Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Navigation Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {mobileContexts.map((context) => {
                const IconComponent = context.icon;
                const isSelected = selectedContext === context.key;
                
                return (
                  <Button
                    key={context.key}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setSelectedContext(context.key)}
                    className="flex flex-col items-center gap-2 h-auto p-4"
                  >
                    <IconComponent className="h-5 w-5" />
                    <div className="text-center">
                      <div className="font-medium">{context.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {context.description}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Active Navigation Demo */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Current Context: {mobileContexts.find(c => c.key === selectedContext)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Show appropriate mobile navigation based on context */}
              {selectedContext === "ide" || selectedContext === "repository" || selectedContext === "review" ? (
                <DeveloperMobileNav 
                  context={selectedContext as "ide" | "repository" | "review"}
                  onTabChange={(tab) => setActiveTab(tab)}
                  onAction={(action) => setSelectedAction(action)}
                />
              ) : (
                <ContextualMobileNav 
                  context={selectedContext as any}
                  onTabChange={(tab) => setActiveTab(tab)}
                />
              )}
              
              {/* Demo Content based on active tab */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Active Tab: {activeTab}</h3>
                  {selectedAction && (
                    <Badge className="bg-green-100 text-green-800">
                      Action: {selectedAction}
                    </Badge>
                  )}
                </div>
                
                {/* Context-specific demo data */}
                {selectedContext === "portfolio" && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{demoData.portfolio.totalValue}</div>
                      <div className="text-sm text-muted-foreground">Total Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{demoData.portfolio.dailyChange}</div>
                      <div className="text-sm text-muted-foreground">Daily Change</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{demoData.portfolio.aiModels}</div>
                      <div className="text-sm text-muted-foreground">AI Models</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{demoData.portfolio.performance}</div>
                      <div className="text-sm text-muted-foreground">Performance</div>
                    </div>
                  </div>
                )}

                {selectedContext === "network" && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{demoData.network.participants}</div>
                      <div className="text-sm text-muted-foreground">Participants</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{demoData.network.activeModels}</div>
                      <div className="text-sm text-muted-foreground">Active Models</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{demoData.network.totalRewards}</div>
                      <div className="text-sm text-muted-foreground">Total Rewards</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{demoData.network.myRank}</div>
                      <div className="text-sm text-muted-foreground">My Rank</div>
                    </div>
                  </div>
                )}

                {(selectedContext === "ide" || selectedContext === "repository" || selectedContext === "review") && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{demoData.developer.activeProjects}</div>
                      <div className="text-sm text-muted-foreground">Active Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{demoData.developer.openPRs}</div>
                      <div className="text-sm text-muted-foreground">Open PRs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{demoData.developer.codeReviews}</div>
                      <div className="text-sm text-muted-foreground">Code Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{demoData.developer.buildStatus}</div>
                      <div className="text-sm text-muted-foreground">Build Status</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Navigation Features */}
        <Card>
          <CardHeader>
            <CardTitle>Mobile Navigation Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">🎯 Contextual Tabs</h4>
                <p className="text-sm text-muted-foreground">
                  Navigation adapts to show relevant tabs for each section
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">📱 Touch-Friendly</h4>
                <p className="text-sm text-muted-foreground">
                  Optimized button sizes and spacing for mobile interaction
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">↔️ Horizontal Scroll</h4>
                <p className="text-sm text-muted-foreground">
                  Smooth horizontal scrolling for tab overflow
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">🔢 Smart Badges</h4>
                <p className="text-sm text-muted-foreground">
                  Notification badges show counts and status updates
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">⚡ Quick Actions</h4>
                <p className="text-sm text-muted-foreground">
                  Context-specific action buttons for common tasks
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">🎨 Visual Feedback</h4>
                <p className="text-sm text-muted-foreground">
                  Clear active states and smooth transitions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}