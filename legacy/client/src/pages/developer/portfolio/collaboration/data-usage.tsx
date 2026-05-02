import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import {
  Database,
  Calendar,
  User,
  Building,
  TrendingUp,
  Download,
  Eye,
  BarChart3,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";

export default function DeveloperCollaborationDataUsage() {
  // Sample data usage tracking
  const dataUsageHistory = [
    {
      id: 1,
      datasetName: "Global Stock Market Historical Data",
      provider: "Data Provider Q",
      providerLogo: "DPQ",
      dateIntegrated: "June 15, 2025",
      modelName: "AI Trading Bot Alpha",
      usageType: "Primary Training Data",
      status: "Active",
      records: "2.5M",
      lastAccessed: "July 14, 2025",
      performance: "+18.5%",
      cost: "$299/month"
    },
    {
      id: 2,
      datasetName: "Cryptocurrency Trading Signals",
      provider: "CryptoData Solutions",
      providerLogo: "CDS",
      dateIntegrated: "July 2, 2025",
      modelName: "DeFi Prediction Model",
      usageType: "Real-time Feed",
      status: "Active",
      records: "850K",
      lastAccessed: "July 15, 2025",
      performance: "+22.3%",
      cost: "$199/month"
    },
    {
      id: 3,
      datasetName: "Economic Indicators Dataset",
      provider: "Global Economics Corp",
      providerLogo: "GEC",
      dateIntegrated: "May 20, 2025",
      modelName: "Macro Trading Strategy",
      usageType: "Feature Engineering",
      status: "Integrated",
      records: "125K",
      lastAccessed: "July 10, 2025",
      performance: "+12.7%",
      cost: "$149/month"
    },
    {
      id: 4,
      datasetName: "Alternative Finance Data",
      provider: "AltFin Analytics",
      providerLogo: "AFA",
      dateIntegrated: "April 8, 2025",
      modelName: "P2P Risk Assessment",
      usageType: "Validation Data",
      status: "Archived",
      records: "95K",
      lastAccessed: "June 30, 2025",
      performance: "+8.9%",
      cost: "$0/month"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500 text-white";
      case "Integrated": return "bg-blue-500 text-white";
      case "Archived": return "bg-gray-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getPerformanceColor = (performance: string) => {
    const value = parseFloat(performance.replace('%', ''));
    if (value > 15) return "text-green-600";
    if (value > 5) return "text-blue-600";
    return "text-yellow-600";
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Data Usage Tracking</h1>
          <p className="text-muted-foreground">Track datasets integrated into your AI models and their performance impact</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Datasets</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Database className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data Providers</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Building className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
                  <p className="text-2xl font-bold text-green-600">+16.2%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold">8.2M</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Usage History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Dataset Integration History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataUsageHistory.map((usage) => (
                <div key={usage.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {usage.providerLogo}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{usage.datasetName}</h3>
                        <p className="text-muted-foreground">from {usage.provider}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(usage.status)}>
                        {usage.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Integrated Into</p>
                      <p className="font-medium">{usage.modelName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Usage Type</p>
                      <p className="font-medium">{usage.usageType}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Records Used</p>
                      <p className="font-medium">{usage.records}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Monthly Cost</p>
                      <p className="font-medium">{usage.cost}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Integrated: {usage.dateIntegrated}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Last accessed: {usage.lastAccessed}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Performance Impact</p>
                        <p className={`text-lg font-bold ${getPerformanceColor(usage.performance)}`}>
                          {usage.performance}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Data Usage Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium">Successfully integrated Cryptocurrency Trading Signals</p>
                  <p className="text-sm text-muted-foreground">2 hours ago • CryptoData Solutions</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Download className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">Downloaded updated Economic Indicators Dataset</p>
                  <p className="text-sm text-muted-foreground">1 day ago • Global Economics Corp</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <div className="flex-1">
                  <p className="font-medium">Performance improvement detected in AI Trading Bot Alpha</p>
                  <p className="text-sm text-muted-foreground">3 days ago • +2.3% improvement after data update</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Database className="h-6 w-6" />
                <span>Browse Datasets</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Download className="h-6 w-6" />
                <span>Export Usage Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <BarChart3 className="h-6 w-6" />
                <span>Performance Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}