import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Download,
  Users,
  DollarSign,
  TrendingUp,
  Calendar
} from "lucide-react";

export default function DataProviderPortfolioDatasets() {
  // Sample datasets data
  const datasets = [
    {
      id: 1,
      name: "S&P 500 Real-time Market Data",
      category: "Market Data",
      status: "active",
      subscribers: 245,
      monthlyRevenue: 85000,
      growth: 12.5,
      lastUpdated: "2025-01-07",
      size: "2.5 TB",
      apiCalls: 1250000
    },
    {
      id: 2,
      name: "Cryptocurrency Market Depth",
      category: "Market Data", 
      status: "active",
      subscribers: 189,
      monthlyRevenue: 67500,
      growth: 8.3,
      lastUpdated: "2025-01-07",
      size: "1.8 TB",
      apiCalls: 890000
    },
    {
      id: 3,
      name: "Economic Indicators Dataset",
      category: "Alternative Data",
      status: "active",
      subscribers: 156,
      monthlyRevenue: 45000,
      growth: 15.2,
      lastUpdated: "2025-01-06",
      size: "450 GB",
      apiCalls: 650000
    },
    {
      id: 4,
      name: "ESG Risk Assessment Data",
      category: "Risk Data",
      status: "pending",
      subscribers: 134,
      monthlyRevenue: 38500,
      growth: 6.7,
      lastUpdated: "2025-01-05",
      size: "800 GB",
      apiCalls: 420000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "pending": return "secondary";
      case "inactive": return "destructive";
      default: return "outline";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Portfolio Datasets</h1>
            <p className="text-muted-foreground">
              Manage and monitor your dataset portfolio
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Dataset
          </Button>
        </div>

        {/* Dataset Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Datasets</p>
                  <p className="text-2xl font-bold">{datasets.length}</p>
                </div>
                <Database className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Subscribers</p>
                  <p className="text-2xl font-bold">
                    {datasets.reduce((sum, d) => sum + d.subscribers, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold">
                    ${datasets.reduce((sum, d) => sum + d.monthlyRevenue, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Growth</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{(datasets.reduce((sum, d) => sum + d.growth, 0) / datasets.length).toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Input
              placeholder="Search datasets..."
              className="w-64"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <Tabs defaultValue="all" className="w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Datasets List */}
        <div className="space-y-4">
          {datasets.map((dataset) => (
            <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{dataset.name}</h3>
                        <Badge variant={getStatusColor(dataset.status)}>
                          {dataset.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Category: {dataset.category} • Size: {dataset.size} • 
                        {dataset.apiCalls.toLocaleString()} API calls/month
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Subscribers:</span>
                          <div className="font-medium">{dataset.subscribers}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Revenue:</span>
                          <div className="font-medium">${dataset.monthlyRevenue.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Growth:</span>
                          <div className="font-medium text-green-600">+{dataset.growth}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Updated:</span>
                          <div className="font-medium">{dataset.lastUpdated}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}