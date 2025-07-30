import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Volume2
} from "lucide-react";

interface MarketDataPoint {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
  bid?: number;
  ask?: number;
  high24h?: number;
  low24h?: number;
  change24h?: number;
}

interface OrderBookLevel {
  price: number;
  size: number;
}

interface OrderBook {
  symbol: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  timestamp: number;
}

interface Trade {
  symbol: string;
  price: number;
  quantity: number;
  side: 'buy' | 'sell';
  timestamp: number;
  tradeId: string;
}

export default function MarketDataFeed() {
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [marketData, setMarketData] = useState<Map<string, MarketDataPoint>>(new Map());
  const [orderBooks, setOrderBooks] = useState<Map<string, OrderBook>>(new Map());
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const wsRef = useRef<WebSocket | null>(null);

  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'];

  useEffect(() => {
    // Only establish WebSocket connection when component is mounted and visible
    const timer = setTimeout(() => {
      connectWebSocket();
    }, 1000); // Delay to ensure server is ready
    
    return () => {
      clearTimeout(timer);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    // Prevent multiple connections
    if (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING) {
      return;
    }
    
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log('Attempting WebSocket connection to:', wsUrl);
    
    try {
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      wsRef.current = new WebSocket(wsUrl);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setIsConnected(false);
      return;
    }

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Subscribe to market data
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'subscribe',
          symbols: symbols
        }));
      }
    };

    wsRef.current.onmessage = (event) => {
      if (isPaused) return;
      
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'priceUpdate':
            handlePriceUpdate(message.data);
            break;
          case 'orderBookUpdate':
            handleOrderBookUpdate(message.data);
            break;
          case 'trade':
            handleTradeUpdate(message.data);
            break;
          case 'subscribed':
            console.log('Subscribed to symbols:', message.symbols);
            break;
          case 'error':
            console.error('WebSocket error:', message.message);
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (!isPaused && (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED)) {
          connectWebSocket();
        }
      }, 3000);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      // Try to reconnect after a delay on error
      setTimeout(() => {
        if (!isPaused && wsRef.current?.readyState !== WebSocket.CONNECTING) {
          console.log('Attempting to reconnect after error...');
          connectWebSocket();
        }
      }, 5000);
    };
  };

  const handlePriceUpdate = (data: MarketDataPoint) => {
    setMarketData(prev => {
      const newMap = new Map(prev);
      newMap.set(data.symbol, data);
      return newMap;
    });
  };

  const handleOrderBookUpdate = (data: OrderBook) => {
    setOrderBooks(prev => {
      const newMap = new Map(prev);
      newMap.set(data.symbol, data);
      return newMap;
    });
  };

  const handleTradeUpdate = (data: Trade) => {
    setRecentTrades(prev => {
      const newTrades = [data, ...prev.slice(0, 49)]; // Keep last 50 trades
      return newTrades;
    });
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused && !isConnected) {
      connectWebSocket();
    }
  };

  const formatPrice = (price: number) => {
    return price?.toFixed(2) || '0.00';
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume?.toString() || '0';
  };

  const formatChange = (change: number) => {
    const percentage = (change * 100).toFixed(2);
    return `${change >= 0 ? '+' : ''}${percentage}%`;
  };

  const selectedMarketData = marketData.get(selectedSymbol);
  const selectedOrderBook = orderBooks.get(selectedSymbol);

  return (
    <div className="space-y-6">
      {/* Connection Status and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle>Live Market Data</CardTitle>
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-600" />
                )}
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePause}
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </>
                )}
              </Button>
            </div>
          </div>
          <CardDescription>Real-time market data and order book updates</CardDescription>
        </CardHeader>
      </Card>

      {/* Market Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {symbols.map(symbol => {
          const data = marketData.get(symbol);
          return (
            <Card 
              key={symbol}
              className={`cursor-pointer transition-colors ${selectedSymbol === symbol ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
              onClick={() => setSelectedSymbol(symbol)}
            >
              <CardContent className="p-4">
                <div className="text-sm font-medium">{symbol}</div>
                <div className="text-lg font-bold">
                  ${formatPrice(data?.price || 0)}
                </div>
                <div className={`text-xs flex items-center ${data?.change24h && data.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data?.change24h && data.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {formatChange(data?.change24h || 0)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Details */}
        <Card>
          <CardHeader>
            <CardTitle>{selectedSymbol} - Price Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMarketData ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Last Price</div>
                    <div className="text-2xl font-bold">${formatPrice(selectedMarketData.price)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">24h Change</div>
                    <div className={`text-lg font-semibold ${selectedMarketData.change24h && selectedMarketData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatChange(selectedMarketData.change24h || 0)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Bid</div>
                    <div className="font-semibold">${formatPrice(selectedMarketData.bid || 0)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Ask</div>
                    <div className="font-semibold">${formatPrice(selectedMarketData.ask || 0)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">24h High</div>
                    <div className="font-semibold text-green-600">${formatPrice(selectedMarketData.high24h || 0)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">24h Low</div>
                    <div className="font-semibold text-red-600">${formatPrice(selectedMarketData.low24h || 0)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Volume</div>
                    <div className="font-semibold">{formatVolume(selectedMarketData.volume)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4" />
                <p>No price data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Book */}
        <Card>
          <CardHeader>
            <CardTitle>{selectedSymbol} - Order Book</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedOrderBook ? (
              <div className="space-y-4">
                {/* Asks */}
                <div>
                  <div className="text-sm font-medium text-red-600 mb-2">Asks (Sell Orders)</div>
                  <div className="space-y-1">
                    {selectedOrderBook.asks.slice(0, 5).map((level, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-red-600">${formatPrice(level.price)}</span>
                        <span className="text-muted-foreground">{formatVolume(level.size)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spread */}
                <div className="border-t border-b py-2">
                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">Spread: </span>
                    <span className="font-semibold">
                      ${formatPrice((selectedOrderBook.asks[0]?.price || 0) - (selectedOrderBook.bids[0]?.price || 0))}
                    </span>
                  </div>
                </div>

                {/* Bids */}
                <div>
                  <div className="text-sm font-medium text-green-600 mb-2">Bids (Buy Orders)</div>
                  <div className="space-y-1">
                    {selectedOrderBook.bids.slice(0, 5).map((level, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-green-600">${formatPrice(level.price)}</span>
                        <span className="text-muted-foreground">{formatVolume(level.size)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4" />
                <p>No order book data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>Live trade feed across all symbols</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {recentTrades.length > 0 ? (
              recentTrades.map(trade => (
                <div key={trade.tradeId} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant={trade.side === 'buy' ? 'default' : 'secondary'}>
                      {trade.symbol}
                    </Badge>
                    <div className={`font-semibold ${trade.side === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                      {trade.side.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold">${formatPrice(trade.price)}</div>
                      <div className="text-sm text-muted-foreground">{formatVolume(trade.quantity)} shares</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(trade.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Volume2 className="h-12 w-12 mx-auto mb-4" />
                <p>No recent trades</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}