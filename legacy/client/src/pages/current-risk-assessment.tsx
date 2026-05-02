import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Target,
  Activity,
  Eye,
  RefreshCw,
  Zap,
  Clock
} from "lucide-react";

export default function CurrentRiskAssessment() {
  const [timeframe, setTimeframe] = useState("1M");
  const [riskMetric, setRiskMetric] = useState("overall");

  const { data: portfolio } = useQuery({
    queryKey: ["/api/portfolio"]
  });

  const { data: riskAlerts = [] } = useQuery({
    queryKey: ["/api/risk-alerts"]
  });

  // Mock real-time risk data
  const currentRisk = {
    overallScore: 72,
    trend: "stable",
    lastUpdated: "2 minutes ago",
    confidence: 94
  };

  const riskMetrics = {
    volatility: { value: 12.3, status: "medium", change: +0.8 },
    var95: { value: 8.5, status: "low", change: -0.3 },
    sharpeRatio: { value: 1.42, status: "good", change: +0.05 },
    maxDrawdown: { value: 15.7, status: "medium", change: -2.1 },
    betaToMarket: { value: 0.89, status: "low", change: -0.02 },
    correlationRisk: { value: 0.65, status: "medium", change: +0.03 }
  };

  const riskFactors = [
    { name: "Market Risk", exposure: 85, impact: "High", trend: "increasing" },
    { name: "Credit Risk", exposure: 45, impact: "Medium", trend: "stable" },
    { name: "Liquidity Risk", exposure: 25, impact: "Low", trend: "decreasing" },
    { name: "Currency Risk", exposure: 35, impact: "Medium", trend: "stable" },
    { name: "Interest Rate Risk", exposure: 60, impact: "High", trend: "increasing" },
    { name: "Concentration Risk", exposure: 70, impact: "High", trend: "stable" }
  ];

  const scenarios = [
    { name: "Market Crash (-20%)", probability: 5, impact: -18.2, status: "critical" },
    { name: "Recession", probability: 15, impact: -12.5, status: "high" },
    { name: "Interest Rate Hike", probability: 35, impact: -6.8, status: "medium" },
    { name: "Sector Rotation", probability: 45, impact: -3.2, status: "low" },
    { name: "Inflation Spike", probability: 25, impact: -8.1, status: "medium" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low": case "good": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "high": case "critical": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing": return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "decreasing": return <TrendingDown className="h-4 w-4 text-green-500" />;
      case "stable": return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
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
                <Shield className="h-8 w-8 text-primary" />
                Current Risk Assessment
              </h1>
              <p className="text-muted-foreground mt-2">
                Real-time portfolio risk analysis and monitoring
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1D">1 Day</SelectItem>
                  <SelectItem value="1W">1 Week</SelectItem>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="3M">3 Months</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Risk Score Overview */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Overall Risk Score
              </CardTitle>
              <CardDescription>
                Real-time assessment of your portfolio's risk level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">{currentRisk.overallScore}</div>
                  <div className="text-sm text-muted-foreground">Risk Score (0-100)</div>
                  <Badge className="mt-2" variant={currentRisk.overallScore > 80 ? "destructive" : currentRisk.overallScore > 60 ? "default" : "secondary"}>
                    {currentRisk.overallScore > 80 ? "High Risk" : currentRisk.overallScore > 60 ? "Moderate Risk" : "Low Risk"}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Activity className={`h-8 w-8 ${currentRisk.trend === "stable" ? "text-blue-500" : currentRisk.trend === "increasing" ? "text-red-500" : "text-green-500"}`} />
                  </div>
                  <div className="text-lg font-semibold capitalize">{currentRisk.trend}</div>
                  <div className="text-sm text-muted-foreground">Risk Trend</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{currentRisk.confidence}%</div>
                  <div className="text-sm text-muted-foreground">Confidence Level</div>
                  <div className="text-xs text-muted-foreground mt-1">Updated {currentRisk.lastUpdated}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(riskMetrics).map(([key, metric]) => (
              <Card key={key}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {metric.change > 0 ? (
                      <TrendingUp className="h-3 w-3 text-red-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-green-500" />
                    )}
                    <span className={`text-xs ${metric.change > 0 ? "text-red-500" : "text-green-500"}`}>
                      {metric.change > 0 ? "+" : ""}{metric.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Risk Factor Analysis
                </CardTitle>
                <CardDescription>
                  Breakdown of individual risk exposures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskFactors.map((factor, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{factor.name}</span>
                          {getTrendIcon(factor.trend)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(factor.impact.toLowerCase())}>
                            {factor.impact}
                          </Badge>
                          <span className="text-sm font-semibold">{factor.exposure}%</span>
                        </div>
                      </div>
                      <Progress value={factor.exposure} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stress Test Scenarios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Stress Test Scenarios
                </CardTitle>
                <CardDescription>
                  Portfolio impact under adverse market conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scenarios.map((scenario, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{scenario.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {scenario.probability}% probability
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-red-600">
                          {scenario.impact}%
                        </div>
                        <Badge className={getStatusColor(scenario.status)} variant="secondary">
                          {scenario.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Risk Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Recent Risk Alerts
              </CardTitle>
              <CardDescription>
                Latest risk notifications and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {riskAlerts.length > 0 ? (
                <div className="space-y-4">
                  {riskAlerts.slice(0, 5).map((alert: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-1" />
                      <div className="flex-1">
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm text-muted-foreground">{alert.description}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{alert.severity}</Badge>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.timestamp}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Risk Alerts</h3>
                  <p className="text-muted-foreground">
                    Your portfolio is currently operating within acceptable risk parameters.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}