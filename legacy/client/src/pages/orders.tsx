import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Calendar,
  BarChart3
} from "lucide-react";

export default function Orders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["/api/trading/orders"],
    enabled: true
  });

  const orderHistory = [
    {
      id: "ORD-2024-001",
      symbol: "AAPL",
      side: "buy",
      type: "market",
      quantity: 100,
      price: 195.50,
      fillPrice: 195.52,
      status: "filled",
      timestamp: "2024-07-01T10:30:00Z",
      strategy: "Momentum Breakout",
      commission: 1.00,
      pnl: 45.50
    },
    {
      id: "ORD-2024-002",
      symbol: "MSFT",
      side: "sell",
      type: "limit",
      quantity: 50,
      price: 420.00,
      fillPrice: 419.95,
      status: "filled",
      timestamp: "2024-07-01T09:15:00Z",
      strategy: "Mean Reversion Pro",
      commission: 0.50,
      pnl: -12.25
    },
    {
      id: "ORD-2024-003",
      symbol: "GOOGL",
      side: "buy",
      type: "stop",
      quantity: 25,
      price: 2750.00,
      fillPrice: null,
      status: "pending",
      timestamp: "2024-07-01T08:45:00Z",
      strategy: "Volatility Harvester",
      commission: 0,
      pnl: 0
    },
    {
      id: "ORD-2024-004",
      symbol: "TSLA",
      side: "sell",
      type: "market",
      quantity: 30,
      price: 265.80,
      fillPrice: 265.75,
      status: "filled",
      timestamp: "2024-06-30T16:20:00Z",
      strategy: "Momentum Breakout",
      commission: 0.75,
      pnl: 89.25
    },
    {
      id: "ORD-2024-005",
      symbol: "NVDA",
      side: "buy",
      type: "limit",
      quantity: 15,
      price: 128.50,
      fillPrice: null,
      status: "cancelled",
      timestamp: "2024-06-30T14:10:00Z",
      strategy: "AI Trend Follower",
      commission: 0,
      pnl: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'filled':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'filled':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getSideColor = (side: string) => {
    return side === 'buy' ? 'text-green-600' : 'text-red-600';
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalOrders = orderHistory.length;
  const filledOrders = orderHistory.filter(order => order.status === 'filled').length;
  const pendingOrders = orderHistory.filter(order => order.status === 'pending').length;
  const totalPnL = orderHistory.reduce((sum, order) => sum + order.pnl, 0);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Order History
                </h1>
                <p className="text-muted-foreground">
                  Track and analyze your trading orders and executions
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                  </div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Filled Orders</p>
                    <p className="text-2xl font-bold">{filledOrders}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                    <p className="text-2xl font-bold">{pendingOrders}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total P&L</p>
                    <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${totalPnL.toFixed(2)}
                    </p>
                  </div>
                  {totalPnL >= 0 ? (
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-red-600" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search by symbol, order ID, or strategy..." className="pl-10" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Status
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Date Range
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Type
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="filled">Filled</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Order ID</th>
                          <th className="text-left py-3 px-4 font-medium">Symbol</th>
                          <th className="text-left py-3 px-4 font-medium">Side</th>
                          <th className="text-left py-3 px-4 font-medium">Type</th>
                          <th className="text-left py-3 px-4 font-medium">Quantity</th>
                          <th className="text-left py-3 px-4 font-medium">Price</th>
                          <th className="text-left py-3 px-4 font-medium">Fill Price</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-left py-3 px-4 font-medium">P&L</th>
                          <th className="text-left py-3 px-4 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderHistory.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-accent/50">
                            <td className="py-3 px-4">
                              <div className="font-medium text-sm">{order.id}</div>
                              <div className="text-xs text-muted-foreground">{order.strategy}</div>
                            </td>
                            <td className="py-3 px-4 font-semibold">{order.symbol}</td>
                            <td className="py-3 px-4">
                              <span className={`font-medium uppercase text-sm ${getSideColor(order.side)}`}>
                                {order.side}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="text-xs">
                                {order.type}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">{order.quantity}</td>
                            <td className="py-3 px-4">${order.price.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              {order.fillPrice ? `$${order.fillPrice.toFixed(2)}` : '-'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(order.status)}
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`font-medium ${order.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {order.pnl >= 0 ? '+' : ''}${order.pnl.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {formatDate(order.timestamp)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="filled">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Filled Orders</h3>
                    <p className="text-muted-foreground">
                      {filledOrders} orders have been successfully executed
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>
                    <p className="text-muted-foreground">
                      {pendingOrders} orders are waiting to be executed
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cancelled">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Cancelled Orders</h3>
                    <p className="text-muted-foreground">
                      View orders that were cancelled before execution
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}