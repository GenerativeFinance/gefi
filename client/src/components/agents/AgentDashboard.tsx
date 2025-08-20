import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  Target,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye
} from "lucide-react";

interface AgentActivity {
  id: string;
  type: "trade" | "yield" | "stake" | "vote" | "analysis";
  description: string;
  amount?: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  txHash?: string;
}

interface AgentPerformance {
  date: string;
  portfolio: number;
  profit: number;
  trades: number;
}

const mockActivities: AgentActivity[] = [
  {
    id: "1",
    type: "trade",
    description: "Executed arbitrage: UNI/USDC → USDC profit +$247",
    amount: 247,
    timestamp: "2 minutes ago",
    status: "completed",
    txHash: "0x1a2b3c..."
  },
  {
    id: "2",
    type: "yield",
    description: "Rebalanced liquidity: Moved $5k from Aave to Curve (APY: 4.2% → 6.8%)",
    amount: 5000,
    timestamp: "15 minutes ago", 
    status: "completed",
    txHash: "0x2b3c4d..."
  },
  {
    id: "3",
    type: "vote",
    description: "Voted on Compound Proposal #127: Increase USDC Collateral Factor",
    timestamp: "1 hour ago",
    status: "completed",
    txHash: "0x3c4d5e..."
  },
  {
    id: "4",
    type: "analysis",
    description: "Risk assessment completed: Portfolio VaR updated (-2.1%)",
    timestamp: "2 hours ago",
    status: "completed"
  },
  {
    id: "5",
    type: "stake",
    description: "Auto-compound: Claimed $89 rewards and restaked in ETH2",
    amount: 89,
    timestamp: "3 hours ago",
    status: "pending"
  }
];

const mockPerformanceData: AgentPerformance[] = [
  { date: "Mon", portfolio: 100000, profit: 0, trades: 0 },
  { date: "Tue", portfolio: 101200, profit: 1200, trades: 8 },
  { date: "Wed", portfolio: 102800, profit: 2800, trades: 12 },
  { date: "Thu", portfolio: 101900, profit: 1900, trades: 6 },
  { date: "Fri", portfolio: 103500, profit: 3500, trades: 15 },
  { date: "Sat", portfolio: 105200, profit: 5200, trades: 18 },
  { date: "Sun", portfolio: 106800, profit: 6800, trades: 22 }
];

const portfolioAllocation = [
  { name: "Stablecoins", value: 45, color: "#10B981" },
  { name: "ETH/BTC", value: 30, color: "#3B82F6" },
  { name: "DeFi Tokens", value: 15, color: "#8B5CF6" },
  { name: "LP Tokens", value: 10, color: "#F59E0B" }
];

const yieldSources = [
  { name: "Curve LP", value: 40, color: "#EF4444" },
  { name: "Aave Lending", value: 25, color: "#10B981" },
  { name: "Uniswap V3", value: 20, color: "#8B5CF6" },
  { name: "Compound", value: 15, color: "#F59E0B" }
];

export default function AgentDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "trade": return <Zap className="h-4 w-4 text-blue-600" />;
      case "yield": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "stake": return <Target className="h-4 w-4 text-purple-600" />;
      case "vote": return <CheckCircle className="h-4 w-4 text-orange-600" />;
      case "analysis": return <Brain className="h-4 w-4 text-gray-600" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Value</p>
                <p className="text-2xl font-bold">$106,800</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +6.8% (7d)
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Profit</p>
                <p className="text-2xl font-bold">$6,800</p>
                <p className="text-xs text-green-600">+$1,250 (24h)</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">2 running, 1 paused</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-xs text-green-600">↑ 2% vs last week</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Portfolio Performance</CardTitle>
              <div className="flex gap-2">
                {["1d", "7d", "30d", "90d"].map((period) => (
                  <Button
                    key={period}
                    variant={selectedTimeframe === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeframe(period)}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockPerformanceData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'portfolio' ? `$${value?.toLocaleString()}` : value,
                    name === 'portfolio' ? 'Portfolio Value' : 'Daily Profit'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="portfolio" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Portfolio Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Current asset distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={portfolioAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {portfolioAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2">
                {portfolioAllocation.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Activity & Decision Justification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Agent Activity Feed
            </CardTitle>
            <CardDescription>Real-time agent actions and decisions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(activity.status)} variant="outline">
                        {activity.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                      {activity.txHash && (
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Decision Justification
            </CardTitle>
            <CardDescription>Why your agents made these choices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Yield Optimization Strategy</h4>
                <p className="text-sm text-muted-foreground">
                  Agent allocated 40% to Curve pools due to rising APY (+2.4%) and increased stablecoin inflows. 
                  Risk assessment shows minimal impermanent loss exposure.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Arbitrage Opportunity</h4>
                <p className="text-sm text-muted-foreground">
                  Detected 0.8% price difference between Uniswap and Sushiswap for UNI token. 
                  Gas costs optimized using flashloan to maximize profit margin.
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Risk Management Action</h4>
                <p className="text-sm text-muted-foreground">
                  Reduced exposure to high-beta DeFi tokens by 15% based on correlation analysis 
                  and market volatility indicators exceeding threshold.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}