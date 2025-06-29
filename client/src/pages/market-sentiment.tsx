import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/layout/Layout";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Eye,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react";

export default function MarketSentiment() {
  const [selectedAssetType, setSelectedAssetType] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  // Mock AI-generated insights data
  const marketInsights = [
    {
      id: 1,
      title: "Federal Reserve Policy Impact",
      sentiment: "bullish",
      confidence: 87,
      category: "macroeconomic",
      summary: "AI analysis suggests strong bullish sentiment following recent Fed statements indicating potential rate cuts in Q2.",
      impact: "High",
      timeframe: "Medium-term",
      affectedSectors: ["Technology", "Real Estate", "Consumer Discretionary"],
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      title: "Cryptocurrency Market Dynamics",
      sentiment: "bearish",
      confidence: 73,
      category: "crypto",
      summary: "Machine learning models detect bearish sentiment due to regulatory uncertainty and institutional outflows.",
      impact: "Medium",
      timeframe: "Short-term",
      affectedSectors: ["DeFi", "Layer 1 Protocols", "Stablecoins"],
      timestamp: "4 hours ago"
    },
    {
      id: 3,
      title: "AI Technology Sector Momentum",
      sentiment: "bullish",
      confidence: 91,
      category: "technology",
      summary: "Strong bullish sentiment driven by breakthrough AI announcements and increased enterprise adoption rates.",
      impact: "Very High",
      timeframe: "Long-term",
      affectedSectors: ["Software", "Semiconductors", "Cloud Infrastructure"],
      timestamp: "6 hours ago"
    },
    {
      id: 4,
      title: "Global Supply Chain Optimization",
      sentiment: "neutral",
      confidence: 65,
      category: "logistics",
      summary: "Mixed sentiment as AI-driven supply chain improvements offset geopolitical trade concerns.",
      impact: "Medium",
      timeframe: "Medium-term",
      affectedSectors: ["Manufacturing", "Transportation", "Retail"],
      timestamp: "8 hours ago"
    }
  ];

  const sentimentTrends = [
    { category: "Overall Market", sentiment: 72, change: +5, icon: TrendingUp },
    { category: "Technology", sentiment: 85, change: +8, icon: TrendingUp },
    { category: "Healthcare", sentiment: 68, change: -2, icon: TrendingDown },
    { category: "Energy", sentiment: 55, change: -7, icon: TrendingDown },
    { category: "Financial", sentiment: 78, change: +3, icon: TrendingUp },
    { category: "Consumer", sentiment: 62, change: +1, icon: TrendingUp }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish": return "text-green-600 bg-green-50 border-green-200";
      case "bearish": return "text-red-600 bg-red-50 border-red-200";
      case "neutral": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Very High": return "text-red-600 bg-red-100";
      case "High": return "text-orange-600 bg-orange-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const filteredInsights = selectedAssetType === "all" 
    ? marketInsights 
    : marketInsights.filter(insight => insight.category === selectedAssetType);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                AI-Generated Market Insights
              </h1>
              <p className="text-muted-foreground mt-2">
                Real-time sentiment analysis and macroeconomic trend predictions powered by AI
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="macroeconomic">Macroeconomic</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                size="sm"
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Sentiment Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {sentimentTrends.map((trend, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm text-muted-foreground">{trend.category}</h3>
                    <trend.icon className={`h-4 w-4 ${trend.change >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{trend.sentiment}%</span>
                    <Badge variant={trend.change >= 0 ? "default" : "destructive"} className="text-xs">
                      {trend.change >= 0 ? '+' : ''}{trend.change}%
                    </Badge>
                  </div>
                  <Progress value={trend.sentiment} className="mt-2 h-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Insights */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Eye className="h-6 w-6 text-primary" />
                Latest AI Market Analysis
              </h2>
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Live Analysis
              </Badge>
            </div>

            <div className="grid gap-6">
              {filteredInsights.map((insight) => (
                <Card key={insight.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{insight.title}</CardTitle>
                        <CardDescription className="text-base">
                          {insight.summary}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <Badge className={`${getSentimentColor(insight.sentiment)} border`}>
                          {insight.sentiment.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{insight.timestamp}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Confidence</label>
                        <div className="flex items-center gap-2">
                          <Progress value={insight.confidence} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{insight.confidence}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Impact Level</label>
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Timeframe</label>
                        <div className="flex items-center gap-1">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{insight.timeframe}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Category</label>
                        <Badge variant="outline">
                          {insight.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="text-sm font-medium text-muted-foreground">Affected Sectors</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {insight.affectedSectors.map((sector, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Market Prediction Summary */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                AI Market Prediction Summary
              </CardTitle>
              <CardDescription>
                Aggregated insights from multiple AI models analyzing market conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">Bullish</div>
                  <div className="text-sm text-muted-foreground">Short-term outlook</div>
                  <div className="text-xs text-muted-foreground mt-1">Based on 15 indicators</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">Stable</div>
                  <div className="text-sm text-muted-foreground">Medium-term outlook</div>
                  <div className="text-xs text-muted-foreground mt-1">Based on 22 indicators</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">Cautious</div>
                  <div className="text-sm text-muted-foreground">Long-term outlook</div>
                  <div className="text-xs text-muted-foreground mt-1">Based on 18 indicators</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}