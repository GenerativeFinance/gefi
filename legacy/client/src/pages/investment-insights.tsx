import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  DollarSign, 
  Shield, 
  AlertTriangle,
  Target,
  Brain,
  Activity,
  Globe,
  Clock,
  Users,
  Award,
  Download,
  Eye,
  RefreshCw
} from "lucide-react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function InvestmentInsights() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M");
  const [selectedAssetClass, setSelectedAssetClass] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const { data: marketInsights } = useQuery({
    queryKey: ["/api/market-insights"],
  });

  const { data: aiModelPerformance } = useQuery({
    queryKey: ["/api/ai-model-performance"],
  });

  const { data: portfolioAnalysis } = useQuery({
    queryKey: ["/api/portfolio-analysis"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Market insights data
  const marketData = {
    totalMarketCap: 2847593000000,
    dailyVolume: 94385000000,
    marketSentiment: "Bullish",
    fearGreedIndex: 72,
    topPerformers: [
      { symbol: "NVDA", change: 8.7, sector: "Technology" },
      { symbol: "TSLA", change: 6.2, sector: "Automotive" },
      { symbol: "MSFT", change: 4.1, sector: "Technology" },
      { symbol: "GOOGL", change: 3.8, sector: "Technology" }
    ],
    aiModelRecommendations: [
      {
        modelName: "AI Risk Analyzer Pro",
        recommendation: "BUY",
        confidence: 87,
        targetPrice: 450,
        currentPrice: 425,
        analyst: "AI Alpha Models",
        reasoning: "Strong momentum indicators and positive sentiment analysis"
      },
      {
        modelName: "Portfolio Optimizer Elite",
        recommendation: "HOLD",
        confidence: 92,
        targetPrice: 280,
        currentPrice: 275,
        analyst: "FinTech Innovations",
        reasoning: "Optimal current allocation, await better entry points"
      },
      {
        modelName: "Momentum Predictor",
        recommendation: "BUY",
        confidence: 78,
        targetPrice: 185,
        currentPrice: 168,
        analyst: "Quantum Finance",
        reasoning: "Technical indicators suggest 10-15% upside potential"
      }
    ]
  };

  // Performance comparison data
  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'AI-Enhanced Portfolio',
        data: [100, 105.2, 109.8, 114.5, 119.2, 125.8, 132.4],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Traditional Portfolio',
        data: [100, 102.8, 105.6, 108.1, 110.9, 113.2, 116.8],
        borderColor: '#6b7280',
        backgroundColor: 'transparent',
        tension: 0.4
      },
      {
        label: 'S&P 500',
        data: [100, 103.1, 106.2, 109.3, 112.1, 115.0, 118.2],
        borderColor: '#3b82f6',
        backgroundColor: 'transparent',
        tension: 0.4
      }
    ]
  };

  // Sector allocation data
  const sectorData = {
    labels: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer', 'Industrial'],
    datasets: [{
      data: [35, 18, 15, 12, 12, 8],
      backgroundColor: [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'
      ],
      borderWidth: 2,
      borderColor: '#1f2937'
    }]
  };

  // Risk metrics data
  const riskMetrics = {
    portfolioRisk: 6.8,
    benchmarkRisk: 8.2,
    sharpeRatio: 1.42,
    maxDrawdown: -8.5,
    var95: -3.2,
    concentration: 67,
    diversificationScore: 85
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 5) return "text-green-600";
    if (risk <= 7) return "text-yellow-600";
    return "text-red-600";
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "BUY": return "text-green-600 bg-green-50";
      case "SELL": return "text-red-600 bg-red-50";
      case "HOLD": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">Investment Insights</h1>
            <p className="text-muted-foreground mt-2">
              AI-powered analysis and recommendations for your portfolio
            </p>
          </div>
          
          <div className="flex gap-3">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1D">1 Day</SelectItem>
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

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{formatCurrency(marketData.totalMarketCap / 1000000000000)}T</div>
                  <div className="text-sm text-muted-foreground">Total Market Cap</div>
                </div>
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{formatCurrency(marketData.dailyVolume / 1000000000)}B</div>
                  <div className="text-sm text-muted-foreground">Daily Volume</div>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{marketData.marketSentiment}</div>
                  <div className="text-sm text-muted-foreground">Market Sentiment</div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{marketData.fearGreedIndex}</div>
                  <div className="text-sm text-muted-foreground">Fear & Greed Index</div>
                </div>
                <Target className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
            <TabsTrigger value="market-trends">Market Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Portfolio Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Line 
                      data={performanceData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Sector Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Doughnut 
                      data={sectorData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'right' }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Market Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {marketData.topPerformers.map((stock, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-lg">{stock.symbol}</div>
                        <div className="text-green-600 font-semibold">
                          +{stock.change}%
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{stock.sector}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Return</span>
                      <span className="font-bold text-green-600">+32.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annualized Return</span>
                      <span className="font-bold">+18.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Volatility</span>
                      <span className="font-bold">14.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sharpe Ratio</span>
                      <span className="font-bold text-green-600">1.42</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Portfolio Risk</span>
                      <span className={`font-bold ${getRiskColor(riskMetrics.portfolioRisk)}`}>
                        {riskMetrics.portfolioRisk}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Drawdown</span>
                      <span className="font-bold text-red-600">{riskMetrics.maxDrawdown}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VaR (95%)</span>
                      <span className="font-bold text-red-600">{riskMetrics.var95}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diversification</span>
                      <span className="font-bold text-green-600">{riskMetrics.diversificationScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Enhancement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>AI Models Active</span>
                      <span className="font-bold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accuracy Rate</span>
                      <span className="font-bold text-green-600">87.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Outperformance</span>
                      <span className="font-bold text-green-600">+14.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Reduction</span>
                      <span className="font-bold text-green-600">-17.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Model Recommendations
                </CardTitle>
                <p className="text-muted-foreground">
                  Advanced AI analysis provides personalized investment recommendations
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData.aiModelRecommendations.map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-lg">{rec.modelName}</div>
                          <div className="text-sm text-muted-foreground">by {rec.analyst}</div>
                        </div>
                        <div className="text-right">
                          <Badge className={getRecommendationColor(rec.recommendation)}>
                            {rec.recommendation}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            {rec.confidence}% confidence
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Current Price</div>
                          <div className="font-semibold">{formatCurrency(rec.currentPrice)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Target Price</div>
                          <div className="font-semibold text-green-600">{formatCurrency(rec.targetPrice)}</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm">
                          Potential upside: <span className="font-semibold text-green-600">
                            {formatPercentage(((rec.targetPrice - rec.currentPrice) / rec.currentPrice) * 100)}
                          </span>
                        </div>
                        <Button size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk-analysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Risk Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Low Risk Assets</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Medium Risk Assets</span>
                        <span>35%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>High Risk Assets</span>
                        <span>20%</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Risk Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                      <div>
                        <div className="font-medium">Concentration Risk</div>
                        <div className="text-sm text-muted-foreground">
                          Tech sector allocation at 35% (recommended max: 30%)
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <Shield className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <div className="font-medium">Diversification Good</div>
                        <div className="text-sm text-muted-foreground">
                          Portfolio well diversified across 6 sectors
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="market-trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Trends & Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Bullish Indicators</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm">S&P 500 above 200-day MA</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm">VIX below 20 (low volatility)</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm">Strong earnings growth</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Risk Factors</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <TrendingDown className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-sm">Rising interest rates</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingDown className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-sm">Inflation concerns</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingDown className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-sm">Geopolitical tensions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}