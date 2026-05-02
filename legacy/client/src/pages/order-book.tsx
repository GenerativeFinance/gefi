import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/layout/Layout";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Volume2,
  Clock,
  RefreshCw,
  Play,
  Pause,
  Zap
} from "lucide-react";

interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

interface OrderBookData {
  symbol: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
  spreadPercent: number;
  lastPrice: number;
  lastUpdate: string;
}

export default function OrderBook() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [isRealTime, setIsRealTime] = useState(true);
  const [depth, setDepth] = useState(20);

  // Mock order book data - in real app this would come from WebSocket
  const [orderBookData, setOrderBookData] = useState<OrderBookData>({
    symbol: "AAPL",
    bids: [],
    asks: [],
    spread: 0,
    spreadPercent: 0,
    lastPrice: 180.50,
    lastUpdate: new Date().toLocaleTimeString()
  });

  const symbols = [
    { value: "AAPL", label: "Apple Inc. (AAPL)" },
    { value: "GOOGL", label: "Alphabet Inc. (GOOGL)" },
    { value: "MSFT", label: "Microsoft Corp. (MSFT)" },
    { value: "TSLA", label: "Tesla Inc. (TSLA)" },
    { value: "NVDA", label: "NVIDIA Corp. (NVDA)" },
    { value: "AMZN", label: "Amazon.com Inc. (AMZN)" },
    { value: "META", label: "Meta Platforms Inc. (META)" },
    { value: "BTCUSD", label: "Bitcoin (BTC/USD)" },
    { value: "ETHUSD", label: "Ethereum (ETH/USD)" },
    { value: "EURUSD", label: "EUR/USD" }
  ];

  // Generate mock order book data
  useEffect(() => {
    const generateOrderBook = () => {
      const basePrice = 180.50;
      const spread = 0.02;
      
      const bids: OrderBookLevel[] = [];
      const asks: OrderBookLevel[] = [];
      
      let totalBids = 0;
      let totalAsks = 0;
      
      // Generate bids (decreasing prices)
      for (let i = 0; i < depth; i++) {
        const price = basePrice - spread/2 - (i * 0.01);
        const size = Math.random() * 1000 + 100;
        totalBids += size;
        bids.push({
          price: parseFloat(price.toFixed(2)),
          size: parseInt(size.toString()),
          total: parseInt(totalBids.toString())
        });
      }
      
      // Generate asks (increasing prices)
      for (let i = 0; i < depth; i++) {
        const price = basePrice + spread/2 + (i * 0.01);
        const size = Math.random() * 1000 + 100;
        totalAsks += size;
        asks.push({
          price: parseFloat(price.toFixed(2)),
          size: parseInt(size.toString()),
          total: parseInt(totalAsks.toString())
        });
      }
      
      setOrderBookData({
        symbol: selectedSymbol,
        bids,
        asks,
        spread: parseFloat(spread.toFixed(2)),
        spreadPercent: parseFloat(((spread / basePrice) * 100).toFixed(4)),
        lastPrice: basePrice,
        lastUpdate: new Date().toLocaleTimeString()
      });
    };

    generateOrderBook();
    
    let interval: NodeJS.Timeout;
    if (isRealTime) {
      interval = setInterval(generateOrderBook, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedSymbol, isRealTime, depth]);

  const maxBidSize = Math.max(...orderBookData.bids.map(b => b.size));
  const maxAskSize = Math.max(...orderBookData.asks.map(a => a.size));
  const maxSize = Math.max(maxBidSize, maxAskSize);

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const formatSize = (size: number) => {
    if (size >= 1000000) {
      return (size / 1000000).toFixed(1) + 'M';
    } else if (size >= 1000) {
      return (size / 1000).toFixed(1) + 'K';
    }
    return size.toString();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                Order Book
              </h1>
              <p className="text-muted-foreground mt-2">
                Real-time market depth and liquidity analysis
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {symbols.map(symbol => (
                    <SelectItem key={symbol.value} value={symbol.value}>
                      {symbol.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={depth.toString()} onValueChange={(value) => setDepth(parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRealTime(!isRealTime)}
              >
                {isRealTime ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isRealTime ? "Pause" : "Resume"}
              </Button>
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Price</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${formatPrice(orderBookData.lastPrice)}</div>
                <p className="text-xs text-muted-foreground">
                  {orderBookData.symbol}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spread</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${orderBookData.spread}</div>
                <p className="text-xs text-muted-foreground">
                  {orderBookData.spreadPercent}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Bid</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${orderBookData.bids[0]?.price ? formatPrice(orderBookData.bids[0].price) : '--'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Size: {orderBookData.bids[0]?.size ? formatSize(orderBookData.bids[0].size) : '--'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Ask</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ${orderBookData.asks[0]?.price ? formatPrice(orderBookData.asks[0].price) : '--'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Size: {orderBookData.asks[0]?.size ? formatSize(orderBookData.asks[0].size) : '--'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Book Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Asks (Sell Orders) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <TrendingDown className="h-5 w-5" />
                  Asks (Sell Orders)
                </CardTitle>
                <CardDescription>
                  Orders to sell at or above the ask price
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
                    <span>Price</span>
                    <span>Size</span>
                    <span>Total</span>
                    <span>%</span>
                  </div>
                  
                  {orderBookData.asks.slice().reverse().map((ask, index) => (
                    <div key={index} className="relative group">
                      <div 
                        className="absolute inset-0 bg-red-500/10 rounded"
                        style={{ 
                          width: `${(ask.size / maxSize) * 100}%`,
                          right: 0 
                        }}
                      />
                      <div className="relative grid grid-cols-4 gap-2 text-sm py-1 px-2 hover:bg-muted/50 rounded">
                        <span className="font-mono text-red-600">{formatPrice(ask.price)}</span>
                        <span className="font-mono">{formatSize(ask.size)}</span>
                        <span className="font-mono text-muted-foreground">{formatSize(ask.total)}</span>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${(ask.size / maxSize) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bids (Buy Orders) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  Bids (Buy Orders)
                </CardTitle>
                <CardDescription>
                  Orders to buy at or below the bid price
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
                    <span>Price</span>
                    <span>Size</span>
                    <span>Total</span>
                    <span>%</span>
                  </div>
                  
                  {orderBookData.bids.map((bid, index) => (
                    <div key={index} className="relative group">
                      <div 
                        className="absolute inset-0 bg-green-500/10 rounded"
                        style={{ 
                          width: `${(bid.size / maxSize) * 100}%` 
                        }}
                      />
                      <div className="relative grid grid-cols-4 gap-2 text-sm py-1 px-2 hover:bg-muted/50 rounded">
                        <span className="font-mono text-green-600">{formatPrice(bid.price)}</span>
                        <span className="font-mono">{formatSize(bid.size)}</span>
                        <span className="font-mono text-muted-foreground">{formatSize(bid.total)}</span>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(bid.size / maxSize) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Depth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Market Depth Analysis
              </CardTitle>
              <CardDescription>
                Visual representation of market liquidity and order distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Bid Volume: {formatSize(orderBookData.bids.reduce((sum, bid) => sum + bid.size, 0))}</span>
                  <span>Total Ask Volume: {formatSize(orderBookData.asks.reduce((sum, ask) => sum + ask.size, 0))}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Bid Liquidity</div>
                    <Progress 
                      value={75} 
                      className="h-4"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Ask Liquidity</div>
                    <Progress 
                      value={65} 
                      className="h-4"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last Update: {orderBookData.lastUpdate}</span>
                  <span className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-500' : 'bg-red-500'}`} />
                    {isRealTime ? 'Live' : 'Paused'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}