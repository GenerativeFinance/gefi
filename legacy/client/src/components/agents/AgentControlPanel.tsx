import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Bot,
  Wallet,
  Settings,
  Play,
  Pause,
  Square,
  Activity,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Coins,
  Users,
  Vote,
  AlertTriangle
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  type: "yield_farming" | "arbitrage" | "governance" | "liquidity_provision" | "security";
  status: "active" | "paused" | "stopped";
  balance: number;
  performance: {
    dailyReturn: number;
    totalReturn: number;
    sharpeRatio: number;
  };
  riskLevel: "low" | "medium" | "high";
  automationLevel: "manual" | "semi" | "full";
}

interface AgentControlPanelProps {
  onCreateAgent: (type: string) => void;
  onImportAgent: () => void;
}

const agentTemplates = [
  {
    type: "yield_farming",
    name: "Conservative Yield Farmer",
    description: "Low-risk stablecoin yield optimization",
    icon: <TrendingUp className="h-5 w-5" />,
    riskLevel: "low"
  },
  {
    type: "arbitrage", 
    name: "Aggressive Arbitrageur",
    description: "High-frequency MEV arbitrage trading",
    icon: <Zap className="h-5 w-5" />,
    riskLevel: "high"
  },
  {
    type: "governance",
    name: "DAO Governance Voter",
    description: "Automated governance participation",
    icon: <Vote className="h-5 w-5" />,
    riskLevel: "medium"
  },
  {
    type: "liquidity_provision",
    name: "Liquidity Provider Bot",
    description: "Multi-chain LP optimization",
    icon: <Coins className="h-5 w-5" />,
    riskLevel: "medium"
  },
  {
    type: "security",
    name: "Security Analyzer Agent",
    description: "Smart contract risk assessment",
    icon: <Shield className="h-5 w-5" />,
    riskLevel: "low"
  }
];

const mockAgents: Agent[] = [
  {
    id: "agent_1",
    name: "Yield Optimizer Alpha",
    type: "yield_farming",
    status: "active",
    balance: 12450.30,
    performance: {
      dailyReturn: 0.12,
      totalReturn: 8.5,
      sharpeRatio: 2.1
    },
    riskLevel: "low",
    automationLevel: "full"
  },
  {
    id: "agent_2", 
    name: "MEV Hunter Beta",
    type: "arbitrage",
    status: "paused",
    balance: 8920.15,
    performance: {
      dailyReturn: 2.45,
      totalReturn: 45.8,
      sharpeRatio: 3.2
    },
    riskLevel: "high",
    automationLevel: "semi"
  }
];

export default function AgentControlPanel({ onCreateAgent, onImportAgent }: AgentControlPanelProps) {
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [riskTolerance, setRiskTolerance] = useState([50]);
  const [automationMode, setAutomationMode] = useState("semi");
  const [agents, setAgents] = useState<Agent[]>(mockAgents);

  const handleAgentAction = (agentId: string, action: "start" | "pause" | "stop") => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: action === "start" ? "active" : action as any }
        : agent
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "stopped": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Agent Management
          </CardTitle>
          <CardDescription>Create, deploy, and monitor your AI agents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {agentTemplates.map((template) => (
              <Card key={template.type} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onCreateAgent(template.type)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {template.icon}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                  <Badge className={getRiskColor(template.riskLevel)} variant="outline">
                    {template.riskLevel} risk
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Separator />
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onImportAgent} className="flex-1">
              Import Agent
            </Button>
            <Button variant="outline" className="flex-1">
              Export Agent
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Chain</Label>
              <Select value={selectedChain} onValueChange={setSelectedChain}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                  <SelectItem value="optimism">Optimism</SelectItem>
                  <SelectItem value="bsc">BSC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Wallet Status</Label>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                Connected (MetaMask)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            AI Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Risk Tolerance</Label>
            <Slider
              value={riskTolerance}
              onValueChange={setRiskTolerance}
              max={100}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Automation Mode</Label>
            <Select value={automationMode} onValueChange={setAutomationMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual Confirmation</SelectItem>
                <SelectItem value="semi">Semi-Autonomous</SelectItem>
                <SelectItem value="full">Fully Autonomous</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Active Agents */}
      <Card>
        <CardHeader>
          <CardTitle>Active Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4" />
                  <div>
                    <h4 className="font-medium">{agent.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge className={getStatusColor(agent.status)} variant="outline">
                        {agent.status}
                      </Badge>
                      <Badge className={getRiskColor(agent.riskLevel)} variant="outline">
                        {agent.riskLevel}
                      </Badge>
                      <span>${agent.balance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant={agent.status === "active" ? "outline" : "default"}
                    onClick={() => handleAgentAction(agent.id, agent.status === "active" ? "pause" : "start")}
                  >
                    {agent.status === "active" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAgentAction(agent.id, "stop")}
                  >
                    <Square className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}