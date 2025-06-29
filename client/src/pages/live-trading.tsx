import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MarketDataFeed from "@/components/trading/market-data-feed";
import TradingInterface from "@/components/trading/trading-interface";
import SentimentVisualizer from "@/components/trading/sentiment-visualizer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, Zap, Shield, Brain } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function LiveTradingPage() {
  const [selectedTab, setSelectedTab] = useState("trading");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  // Fetch real-time market data with sentiment
  const { data: marketData, isLoading: isMarketDataLoading } = useQuery({
    queryKey: ["/api/market-data/live"],
    refetchInterval: 1000, // Refresh every second for real-time data
  });

  const handleAssetSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setSelectedTab("trading"); // Switch to trading tab when asset is selected
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Live Trading</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Real-time market data and advanced trading capabilities
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-600">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
              <Badge variant="outline">
                <Shield className="h-3 w-3 mr-1" />
                Secure
              </Badge>
            </div>
          </div>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Real-Time Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Live market prices, order books, and trade feeds with WebSocket connectivity for instant updates.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Zap className="h-5 w-5 mr-2 text-green-600" />
                Fast Execution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Lightning-fast order execution with multiple order types: market, limit, stop, and stop-limit orders.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Shield className="h-5 w-5 mr-2 text-purple-600" />
                Risk Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built-in risk controls, position monitoring, and real-time P&L tracking to protect your investments.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Trading Interface */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trading" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Trading Interface</span>
            </TabsTrigger>
            <TabsTrigger value="market-data" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Market Data Feed</span>
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Sentiment Analysis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Live Trading Platform</span>
                </CardTitle>
                <CardDescription>
                  Execute trades with real-time market data integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TradingInterface />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market-data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Real-Time Market Data</span>
                </CardTitle>
                <CardDescription>
                  Live price feeds, order books, and trading activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarketDataFeed />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Sentiment Analysis</span>
                </CardTitle>
                <CardDescription>
                  Real-time sentiment analysis across stocks, crypto, forex, commodities, and indices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isMarketDataLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <SentimentVisualizer 
                    marketData={marketData || []} 
                    onAssetSelect={handleAssetSelect}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Trading Features */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Trading Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Order Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• Market Orders</li>
                  <li>• Limit Orders</li>
                  <li>• Stop Orders</li>
                  <li>• Stop-Limit Orders</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Time in Force</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• Good Till Cancelled (GTC)</li>
                  <li>• Immediate or Cancel (IOC)</li>
                  <li>• Fill or Kill (FOK)</li>
                  <li>• Day Orders</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Real-Time Data</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• Live Price Quotes</li>
                  <li>• Level 2 Order Book</li>
                  <li>• Trade History</li>
                  <li>• Market Statistics</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Portfolio Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>• Position Tracking</li>
                  <li>• Real-time P&L</li>
                  <li>• Risk Monitoring</li>
                  <li>• Performance Analytics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="mt-12">
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-200">
                <Shield className="h-5 w-5 mr-2" />
                Trading Safety Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
                <p>
                  <strong>Risk Warning:</strong> Trading involves substantial risk and may not be suitable for all investors. 
                  Past performance does not guarantee future results.
                </p>
                <p>
                  <strong>Demo Environment:</strong> This is currently a demo trading environment with simulated market data. 
                  Real money is not at risk in this demonstration.
                </p>
                <p>
                  <strong>Educational Purpose:</strong> This platform is designed for educational and demonstration purposes. 
                  Always consult with financial advisors before making investment decisions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}