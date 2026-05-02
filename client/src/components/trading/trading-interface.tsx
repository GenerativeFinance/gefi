import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'partially_filled' | 'filled' | 'cancelled' | 'rejected';
  filledQuantity: number;
  averagePrice: number;
  timestamp: number;
  updatedAt: number;
  timeInForce?: 'GTC' | 'IOC' | 'FOK' | 'DAY';
}

interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  marketValue: number;
  unrealizedPnL: number;
  realizedPnL: number;
  lastUpdated: number;
}

interface Portfolio {
  totalValue: number;
  cashBalance: number;
  positions: Position[];
  dayPnL: number;
  totalPnL: number;
  buyingPower: number;
  marginUsed: number;
  lastUpdated: number;
}

export default function TradingInterface() {
  const [orderForm, setOrderForm] = useState({
    symbol: 'AAPL',
    side: 'buy' as 'buy' | 'sell',
    type: 'market' as 'market' | 'limit' | 'stop' | 'stop_limit',
    quantity: '',
    price: '',
    stopPrice: '',
    timeInForce: 'GTC' as 'GTC' | 'IOC' | 'FOK' | 'DAY'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch live market data for selected symbol
  const { data: marketData } = useQuery({
    queryKey: ['/api/market-data/live', orderForm.symbol],
    refetchInterval: 1000, // Update every second
  });

  // Fetch trading portfolio
  const { data: portfolio } = useQuery<Portfolio>({
    queryKey: ['/api/trading/portfolio'],
    refetchInterval: 2000, // Update every 2 seconds
  });

  // Fetch active orders
  const { data: orders } = useQuery<Order[]>({
    queryKey: ['/api/trading/orders'],
    refetchInterval: 1000,
  });

  // Fetch positions
  const { data: positions } = useQuery<Position[]>({
    queryKey: ['/api/trading/positions'],
    refetchInterval: 2000,
  });

  // Submit order mutation
  const submitOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest('POST', '/api/trading/orders', orderData);
    },
    onSuccess: (order) => {
      toast({
        title: "Order Submitted",
        description: `${orderForm.side.toUpperCase()} order for ${orderForm.quantity} ${orderForm.symbol} submitted successfully.`,
      });
      
      // Reset form
      setOrderForm(prev => ({
        ...prev,
        quantity: '',
        price: '',
        stopPrice: ''
      }));
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/trading/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/trading/portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['/api/trading/positions'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return await apiRequest('DELETE', `/api/trading/orders/${orderId}`);
    },
    onSuccess: () => {
      toast({
        title: "Order Cancelled",
        description: "Order cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/trading/orders'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Cancel Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmitOrder = () => {
    // Validate form
    if (!orderForm.quantity || isNaN(Number(orderForm.quantity))) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity.",
        variant: "destructive",
      });
      return;
    }

    if ((orderForm.type === 'limit' || orderForm.type === 'stop_limit') && (!orderForm.price || isNaN(Number(orderForm.price)))) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid limit price.",
        variant: "destructive",
      });
      return;
    }

    if ((orderForm.type === 'stop' || orderForm.type === 'stop_limit') && (!orderForm.stopPrice || isNaN(Number(orderForm.stopPrice)))) {
      toast({
        title: "Invalid Stop Price",
        description: "Please enter a valid stop price.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      symbol: orderForm.symbol,
      side: orderForm.side,
      type: orderForm.type,
      quantity: Number(orderForm.quantity),
      price: orderForm.price ? Number(orderForm.price) : undefined,
      stopPrice: orderForm.stopPrice ? Number(orderForm.stopPrice) : undefined,
      timeInForce: orderForm.timeInForce,
    };

    submitOrderMutation.mutate(orderData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'filled':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'partially_filled':
        return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'];

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(portfolio?.totalValue || 0)}
            </div>
            <div className={`text-sm flex items-center ${portfolio?.dayPnL && portfolio.dayPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolio?.dayPnL && portfolio.dayPnL >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {formatCurrency(portfolio?.dayPnL || 0)} today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(portfolio?.cashBalance || 0)}
            </div>
            <div className="text-sm text-muted-foreground">Available cash</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Buying Power</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(portfolio?.buyingPower || 0)}
            </div>
            <div className="text-sm text-muted-foreground">Available to trade</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${portfolio?.totalPnL && portfolio.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(portfolio?.totalPnL || 0)}
            </div>
            <div className="text-sm text-muted-foreground">Unrealized + Realized</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trade" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trade">Trade</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Trading Tab */}
        <TabsContent value="trade" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Form */}
            <Card>
              <CardHeader>
                <CardTitle>Place Order</CardTitle>
                <CardDescription>Submit buy/sell orders for stocks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="symbol">Symbol</Label>
                    <Select
                      value={orderForm.symbol}
                      onValueChange={(value) => setOrderForm(prev => ({ ...prev, symbol: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {symbols.map(symbol => (
                          <SelectItem key={symbol} value={symbol}>
                            {symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="side">Side</Label>
                    <Select
                      value={orderForm.side}
                      onValueChange={(value: 'buy' | 'sell') => setOrderForm(prev => ({ ...prev, side: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Order Type</Label>
                    <Select
                      value={orderForm.type}
                      onValueChange={(value: 'market' | 'limit' | 'stop' | 'stop_limit') => 
                        setOrderForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="limit">Limit</SelectItem>
                        <SelectItem value="stop">Stop</SelectItem>
                        <SelectItem value="stop_limit">Stop Limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="100"
                      value={orderForm.quantity}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, quantity: e.target.value }))}
                    />
                  </div>
                </div>

                {(orderForm.type === 'limit' || orderForm.type === 'stop_limit') && (
                  <div>
                    <Label htmlFor="price">Limit Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="185.50"
                      value={orderForm.price}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                )}

                {(orderForm.type === 'stop' || orderForm.type === 'stop_limit') && (
                  <div>
                    <Label htmlFor="stopPrice">Stop Price</Label>
                    <Input
                      id="stopPrice"
                      type="number"
                      step="0.01"
                      placeholder="180.00"
                      value={orderForm.stopPrice}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, stopPrice: e.target.value }))}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="timeInForce">Time in Force</Label>
                  <Select
                    value={orderForm.timeInForce}
                    onValueChange={(value: 'GTC' | 'IOC' | 'FOK' | 'DAY') => 
                      setOrderForm(prev => ({ ...prev, timeInForce: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GTC">Good Till Cancelled</SelectItem>
                      <SelectItem value="IOC">Immediate or Cancel</SelectItem>
                      <SelectItem value="FOK">Fill or Kill</SelectItem>
                      <SelectItem value="DAY">Day Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSubmitOrder}
                  disabled={submitOrderMutation.isPending}
                >
                  {submitOrderMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      {orderForm.side === 'buy' ? 'Buy' : 'Sell'} {orderForm.symbol}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Current Price */}
            <Card>
              <CardHeader>
                <CardTitle>{orderForm.symbol} - Current Price</CardTitle>
                <CardDescription>Real-time market data</CardDescription>
              </CardHeader>
              <CardContent>
                {marketData ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        ${marketData.price?.toFixed(2) || '0.00'}
                      </div>
                      <div className={`text-lg ${marketData.change24h && marketData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {marketData.change24h && marketData.change24h >= 0 ? '+' : ''}
                        {((marketData.change24h || 0) * 100).toFixed(2)}%
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Bid</div>
                        <div className="font-semibold text-green-600">
                          ${marketData.bid?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Ask</div>
                        <div className="font-semibold text-red-600">
                          ${marketData.ask?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">24h High</div>
                        <div className="font-semibold">
                          ${marketData.high24h?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">24h Low</div>
                        <div className="font-semibold">
                          ${marketData.low24h?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4" />
                    <p>Loading price data...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
              <CardDescription>Your current open orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders && orders.length > 0 ? (
                  orders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getOrderStatusIcon(order.status)}
                        <div>
                          <div className="font-semibold">
                            {order.side.toUpperCase()} {order.quantity} {order.symbol}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.type.toUpperCase()} 
                            {order.price && ` @ $${order.price.toFixed(2)}`}
                          </div>
                        </div>
                        <Badge variant={order.status === 'filled' ? 'default' : 'secondary'}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-sm">
                            {order.filledQuantity}/{order.quantity} filled
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(order.timestamp).toLocaleString()}
                          </div>
                        </div>
                        {(order.status === 'pending' || order.status === 'partially_filled') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelOrderMutation.mutate(order.id)}
                            disabled={cancelOrderMutation.isPending}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4" />
                    <p>No active orders</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Positions Tab */}
        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
              <CardDescription>Your current stock holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {positions && positions.length > 0 ? (
                  positions.map(position => (
                    <div key={position.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-semibold">{position.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {position.quantity} shares @ ${position.averagePrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(position.marketValue)}
                        </div>
                        <div className={`text-sm ${position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(position.unrealizedPnL)} P&L
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4" />
                    <p>No open positions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
              <CardDescription>Your completed trades and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4" />
                <p>Trade history coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}