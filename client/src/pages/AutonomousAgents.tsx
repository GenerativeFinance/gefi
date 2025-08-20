import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import AgentControlPanel from "@/components/agents/AgentControlPanel";
import AgentDashboard from "@/components/agents/AgentDashboard";
import {
  Bot,
  Plus,
  Upload,
  Download,
  Users,
  Trophy,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Activity,
  Settings
} from "lucide-react";

interface AgentMarketplaceItem {
  id: string;
  name: string;
  creator: string;
  rating: number;
  performance: number;
  subscribers: number;
  price: number;
  description: string;
  type: "yield_farming" | "arbitrage" | "governance" | "liquidity_provision" | "security";
}

const mockMarketplaceAgents: AgentMarketplaceItem[] = [
  {
    id: "1",
    name: "Conservative Yield Farmer",
    creator: "DefiAI Protocol",
    rating: 4.6,
    performance: 8.5,
    subscribers: 780,
    price: 149.99,
    description: "Autonomous DeFi agent that optimizes stablecoin yields across Aave, Compound, and Curve.",
    type: "yield_farming"
  },
  {
    id: "2",
    name: "Aggressive Arbitrageur Bot",
    creator: "MEV Labs",
    rating: 4.4,
    performance: 45.8,
    subscribers: 340,
    price: 499.99,
    description: "High-frequency MEV arbitrage agent that exploits price differences across DEXs.",
    type: "arbitrage"
  },
  {
    id: "3",
    name: "DAO Governance Voting Agent",
    creator: "GovernanceAI DAO",
    rating: 4.7,
    performance: 12.3,
    subscribers: 620,
    price: 199.99,
    description: "AI-powered governance agent that analyzes DAO proposals and votes strategically.",
    type: "governance"
  }
];

const topPerformers = [
  { name: "DeFi Master", performance: "+127.5%", creator: "QuantAI Labs" },
  { name: "Yield Hunter Pro", performance: "+89.2%", creator: "ProtocolX" },
  { name: "MEV Ninja", performance: "+156.8%", creator: "ArbitrageDAO" }
];

export default function AutonomousAgents() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const { toast } = useToast();

  const handleCreateAgent = (type: string) => {
    setShowCreateAgent(false);
    toast({
      title: "Agent Created",
      description: `Your ${type.replace('_', ' ')} agent has been deployed and is now active.`,
    });
  };

  const handleImportAgent = () => {
    toast({
      title: "Import Agent",
      description: "Agent configuration imported successfully from wallet backup.",
    });
  };

  const handleCloneAgent = (agentId: string) => {
    toast({
      title: "Agent Cloned",
      description: "Agent strategy copied to your portfolio. You can now customize the settings.",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "yield_farming": return <TrendingUp className="h-4 w-4" />;
      case "arbitrage": return <Zap className="h-4 w-4" />;
      case "governance": return <Target className="h-4 w-4" />;
      case "liquidity_provision": return <Activity className="h-4 w-4" />;
      case "security": return <Shield className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Autonomous Economic Agents</h1>
                <p className="text-muted-foreground">AI-powered DeFi agents for automated trading, yield farming, and governance</p>
              </div>
              
              <Dialog open={showCreateAgent} onOpenChange={setShowCreateAgent}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Deploy New Agent
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Deploy New AI Agent</DialogTitle>
                    <DialogDescription>
                      Choose a strategy template and customize your autonomous agent
                    </DialogDescription>
                  </DialogHeader>
                  <AgentControlPanel 
                    onCreateAgent={handleCreateAgent}
                    onImportAgent={handleImportAgent}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="control" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Control Panel
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Agent Marketplace
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <AgentDashboard />
            </TabsContent>

            <TabsContent value="control" className="space-y-6">
              <AgentControlPanel 
                onCreateAgent={handleCreateAgent}
                onImportAgent={handleImportAgent}
              />
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Agent Marketplace */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        Strategy Marketplace
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockMarketplaceAgents.map((agent) => (
                          <Card key={agent.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(agent.type)}
                                  <div>
                                    <h4 className="font-medium">{agent.name}</h4>
                                    <p className="text-sm text-muted-foreground">by {agent.creator}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold">${agent.price}</p>
                                  <div className="flex items-center gap-1 text-sm">
                                    <span>⭐ {agent.rating}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>
                              
                              <div className="flex items-center justify-between text-sm mb-3">
                                <span className="text-green-600 font-medium">+{agent.performance}% APY</span>
                                <span className="text-muted-foreground">{agent.subscribers} subscribers</span>
                              </div>
                              
                              <Button 
                                onClick={() => handleCloneAgent(agent.id)}
                                className="w-full"
                                size="sm"
                              >
                                Clone Agent
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Top Performers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {topPerformers.map((performer, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{performer.name}</p>
                              <p className="text-xs text-muted-foreground">{performer.creator}</p>
                            </div>
                            <span className="text-green-600 font-medium text-sm">
                              {performer.performance}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Agent Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...mockMarketplaceAgents]
                      .sort((a, b) => b.performance - a.performance)
                      .map((agent, index) => (
                        <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full font-medium">
                              #{index + 1}
                            </div>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(agent.type)}
                              <div>
                                <h4 className="font-medium">{agent.name}</h4>
                                <p className="text-sm text-muted-foreground">by {agent.creator}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium text-green-600">+{agent.performance}%</p>
                            <p className="text-sm text-muted-foreground">⭐ {agent.rating} ({agent.subscribers})</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Agent Reports & Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Download className="h-5 w-5" />
                      <span>Export Transaction Logs</span>
                      <span className="text-xs text-muted-foreground">CSV/JSON Format</span>
                    </Button>
                    
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Download className="h-5 w-5" />
                      <span>Strategy Performance Report</span>
                      <span className="text-xs text-muted-foreground">Detailed PDF Analysis</span>
                    </Button>
                    
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Settings className="h-5 w-5" />
                      <span>Setup Alerts</span>
                      <span className="text-xs text-muted-foreground">Telegram/Discord/Slack</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}