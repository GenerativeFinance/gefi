import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Shield,
  Target,
  RefreshCw,
  Eye,
  Settings
} from "lucide-react";

export default function RiskDistribution() {
  const [timeframe, setTimeframe] = useState("1M");
  const [riskView, setRiskView] = useState("sector");

  const { data: portfolio } = useQuery({
    queryKey: ["/api/portfolio"]
  });

  const { data: assets = [] } = useQuery({
    queryKey: ["/api/portfolio/assets"]
  });

  // Mock risk distribution data
  const riskDistribution = {
    byAssetClass: [
      { name: "Stocks", value: 65, risk: "Medium", color: "bg-blue-500" },
      { name: "Bonds", value: 20, risk: "Low", color: "bg-green-500" },
      { name: "Crypto", value: 10, risk: "High", color: "bg-red-500" },
      { name: "Commodities", value: 5, risk: "Medium", color: "bg-yellow-500" }
    ],
    bySector: [
      { name: "Technology", value: 30, risk: "High", color: "bg-purple-500" },
      { name: "Healthcare", value: 20, risk: "Medium", color: "bg-blue-500" },
      { name: "Finance", value: 15, risk: "Medium", color: "bg-green-500" },
      { name: "Energy", value: 12, risk: "High", color: "bg-red-500" },
      { name: "Consumer", value: 13, risk: "Low", color: "bg-yellow-500" },
      { name: "Real Estate", value: 10, risk: "Medium", color: "bg-orange-500" }
    ],
    byRiskLevel: [
      { name: "Low Risk", value: 35, assets: 12, color: "bg-green-500" },
      { name: "Medium Risk", value: 45, assets: 18, color: "bg-yellow-500" },
      { name: "High Risk", value: 20, assets: 8, color: "bg-red-500" }
    ],
    byGeography: [
      { name: "North America", value: 45, risk: "Medium", color: "bg-blue-500" },
      { name: "Europe", value: 25, risk: "Low", color: "bg-green-500" },
      { name: "Asia", value: 20, risk: "High", color: "bg-red-500" },
      { name: "Emerging Markets", value: 10, risk: "High", color: "bg-orange-500" }
    ]
  };

  const riskMetrics = {
    portfolioVaR: 8.5,
    sharpeRatio: 1.42,
    volatility: 12.3,
    maxDrawdown: 15.7,
    riskScore: 72,
    diversificationScore: 85
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-600 bg-green-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "High": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getCurrentDistribution = () => {
    switch (riskView) {
      case "sector": return riskDistribution.bySector;
      case "asset": return riskDistribution.byAssetClass;
      case "risk": return riskDistribution.byRiskLevel;
      case "geography": return riskDistribution.byGeography;
      default: return riskDistribution.bySector;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <PieChart className="h-8 w-8 text-primary" />
                Risk Distribution Analysis
              </h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive view of portfolio risk allocation and exposure
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1W">1 Week</SelectItem>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="3M">3 Months</SelectItem>
                  <SelectItem value="1Y">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Risk Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio VaR</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{riskMetrics.portfolioVaR}%</div>
                <p className="text-xs text-muted-foreground">95% confidence</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{riskMetrics.sharpeRatio}</div>
                <p className="text-xs text-green-600">Excellent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Volatility</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{riskMetrics.volatility}%</div>
                <p className="text-xs text-muted-foreground">Annualized</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{riskMetrics.maxDrawdown}%</div>
                <p className="text-xs text-muted-foreground">Historical</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{riskMetrics.riskScore}/100</div>
                <p className="text-xs text-yellow-600">Moderate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Diversification</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{riskMetrics.diversificationScore}%</div>
                <p className="text-xs text-green-600">Well diversified</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Risk Distribution Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Risk Distribution
                  </CardTitle>
                  <Select value={riskView} onValueChange={setRiskView}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sector">By Sector</SelectItem>
                      <SelectItem value="asset">By Asset Class</SelectItem>
                      <SelectItem value="risk">By Risk Level</SelectItem>
                      <SelectItem value="geography">By Geography</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CardDescription>
                  Portfolio exposure across different {riskView} categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getCurrentDistribution().map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="font-medium">{item.name}</span>
                          {item.risk && (
                            <Badge className={getRiskColor(item.risk)} variant="secondary">
                              {item.risk}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{item.value}%</span>
                          {item.assets && (
                            <div className="text-xs text-muted-foreground">{item.assets} assets</div>
                          )}
                        </div>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Concentration Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Concentration
                </CardTitle>
                <CardDescription>
                  Identify potential concentration risks in your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Single Asset Concentration</span>
                      <Badge className="text-green-600 bg-green-100">Good</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Largest position: AAPL (8.2%) - Within acceptable limits
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Sector Concentration</span>
                      <Badge className="text-yellow-600 bg-yellow-100">Moderate</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Technology sector: 30% - Consider reducing exposure
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Geographic Concentration</span>
                      <Badge className="text-green-600 bg-green-100">Good</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Well diversified across regions
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Currency Exposure</span>
                      <Badge className="text-yellow-600 bg-yellow-100">Moderate</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      USD exposure: 65% - Consider hedging
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Risk Alerts & Recommendations
              </CardTitle>
              <CardDescription>
                AI-powered insights and recommendations for risk management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-orange-600">Immediate Actions</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-1" />
                      <div className="text-sm">
                        <div className="font-medium">High Tech Concentration</div>
                        <div className="text-muted-foreground">Consider reducing technology sector exposure from 30% to 25%</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <Eye className="h-4 w-4 text-yellow-500 mt-1" />
                      <div className="text-sm">
                        <div className="font-medium">Monitor Crypto Volatility</div>
                        <div className="text-muted-foreground">Crypto positions showing increased volatility this week</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-600">Optimization Opportunities</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-1" />
                      <div className="text-sm">
                        <div className="font-medium">Improve Diversification</div>
                        <div className="text-muted-foreground">Add more emerging market exposure to improve risk-adjusted returns</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <Settings className="h-4 w-4 text-green-500 mt-1" />
                      <div className="text-sm">
                        <div className="font-medium">Rebalancing Suggested</div>
                        <div className="text-muted-foreground">Portfolio drift detected - rebalancing can improve risk profile</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}