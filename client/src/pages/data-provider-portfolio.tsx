import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Database, 
  TrendingUp, 
  DollarSign,
  Target,
  BarChart3,
  Shield,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export default function DataProviderPortfolio() {
  // Sample portfolio data
  const portfolioData = {
    totalValue: 1250000,
    monthlyGrowth: 8.5,
    riskScore: 7.2,
    diversificationScore: 8.9,
    allocation: [
      { name: "Market Data", value: 562500, percentage: 45, color: "bg-blue-500" },
      { name: "Risk Data", value: 375000, percentage: 30, color: "bg-purple-500" },
      { name: "Alternative Data", value: 312500, percentage: 25, color: "bg-green-500" }
    ],
    performance: {
      sharpeRatio: 0.87,
      maxDrawdown: -12.3,
      totalReturn: 24.7,
      volatility: 16.2
    },
    topDatasets: [
      { name: "S&P 500 Real-time", revenue: 85000, subscribers: 245, growth: 12.5 },
      { name: "Crypto Market Depth", revenue: 67500, subscribers: 189, growth: 8.3 },
      { name: "Economic Indicators", revenue: 45000, subscribers: 156, growth: 15.2 },
      { name: "ESG Risk Scores", revenue: 38500, subscribers: 134, growth: 6.7 }
    ]
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Portfolio Management</h1>
            <p className="text-muted-foreground">
              Manage your dataset allocation, risk assessment, and portfolio performance
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Target className="mr-2 h-4 w-4" />
            Optimize Portfolio
          </Button>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Portfolio Value</p>
                  <p className="text-2xl font-bold">${portfolioData.totalValue.toLocaleString()}</p>
                </div>
                <Wallet className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Growth</p>
                  <p className="text-2xl font-bold text-green-600">+{portfolioData.monthlyGrowth}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Portfolio Risk</p>
                  <p className="text-2xl font-bold">
                    <Badge variant="secondary">Low</Badge>
                  </p>
                </div>
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sharpe Ratio</p>
                  <p className="text-2xl font-bold">{portfolioData.performance.sharpeRatio}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dataset Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Dataset Allocation</CardTitle>
              <CardDescription>Distribution of your datasets by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {portfolioData.allocation.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ${item.value.toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Portfolio risk metrics and analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {portfolioData.riskScore}/10
                  </div>
                  <div className="text-sm text-muted-foreground">Portfolio Risk</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {portfolioData.diversificationScore}/10
                  </div>
                  <div className="text-sm text-muted-foreground">Diversification Score</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Max Drawdown:</span>
                  <span className="text-sm font-medium text-red-600">
                    {portfolioData.performance.maxDrawdown}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Return:</span>
                  <span className="text-sm font-medium text-green-600">
                    +{portfolioData.performance.totalReturn}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Volatility:</span>
                  <span className="text-sm font-medium">
                    {portfolioData.performance.volatility}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Datasets */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Top Performing Datasets</CardTitle>
            <CardDescription>Your highest revenue generating datasets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolioData.topDatasets.map((dataset, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{dataset.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {dataset.subscribers} subscribers
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${dataset.revenue.toLocaleString()}</div>
                    <div className="text-sm text-green-600">+{dataset.growth}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}