import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import {
  Database,
  Upload,
  BarChart3,
  Users,
  DollarSign,
  Shield,
  Star,
  Download,
  Eye,
  Plus,
  Settings,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Handshake,
  MessageSquare,
  Key,
  Code,
  Target,
  Globe,
  PieChart,
  Lock,
  CreditCard,
  BookOpen,
  Zap,
  Building,
  AlertCircle,
  UserCheck,
  Search
} from "lucide-react";

interface DataProvider {
  id: number;
  userId: string;
  companyName?: string;
  description?: string;
  specialization: string;
  complianceCertifications: string[];
  dataQualityRating: string;
  totalRevenue: string;
  totalDatasets: number;
  activeSubscriptions: number;
  isVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Dataset {
  id: number;
  providerId: number;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  dataType: string;
  fileSize?: number;
  recordCount?: number;
  updateFrequency?: string;
  qualityScore: string;
  pricePerRecord?: string;
  monthlySubscriptionFee?: string;
  oneTimePurchasePrice?: string;
  licenseType: string;
  downloadCount: number;
  subscriptionCount: number;
  revenue: string;
  isActive: boolean;
  isPublic: boolean;
  complianceStatus: string;
  createdAt: string;
  updatedAt: string;
}

// Sample data to populate the dashboard
const sampleProvider: DataProvider = {
  id: 1,
  userId: "github_55703540",
  companyName: "Advanced Financial Data Solutions",
  description: "Leading provider of real-time market data and analytics",
  specialization: "Market Data, Risk Analytics, ESG Data",
  complianceCertifications: ["SOC 2", "ISO 27001", "GDPR"],
  dataQualityRating: "9.2",
  totalRevenue: "2847500.00",
  totalDatasets: 24,
  activeSubscriptions: 1847,
  isVerified: true,
  status: "active",
  createdAt: "2024-03-15T10:30:00Z",
  updatedAt: "2025-01-07T14:20:00Z"
};

const sampleDatasets: Dataset[] = [
  {
    id: 1,
    providerId: 1,
    name: "S&P 500 Real-time Market Data",
    description: "Real-time stock prices, volumes, and market depth data for all S&P 500 companies",
    category: "Market Data",
    subcategory: "Equity Data",
    dataType: "Real-time Stream",
    fileSize: 2621440, // 2.5 TB in KB
    recordCount: 15000000,
    updateFrequency: "Real-time",
    qualityScore: "9.8",
    pricePerRecord: "0.002",
    monthlySubscriptionFee: "2500.00",
    oneTimePurchasePrice: "50000.00",
    licenseType: "Commercial",
    downloadCount: 5670,
    subscriptionCount: 245,
    revenue: "612500.00",
    isActive: true,
    isPublic: true,
    complianceStatus: "compliant",
    createdAt: "2024-03-20T09:15:00Z",
    updatedAt: "2025-01-07T14:00:00Z"
  },
  {
    id: 2,
    providerId: 1,
    name: "Cryptocurrency Market Depth",
    description: "Order book data for top 100 cryptocurrencies across major exchanges",
    category: "Market Data",
    subcategory: "Crypto Data",
    dataType: "Real-time Stream",
    fileSize: 1835008, // 1.8 TB in KB
    recordCount: 8500000,
    updateFrequency: "Real-time",
    qualityScore: "9.5",
    pricePerRecord: "0.003",
    monthlySubscriptionFee: "1800.00",
    oneTimePurchasePrice: "35000.00",
    licenseType: "Commercial",
    downloadCount: 3420,
    subscriptionCount: 189,
    revenue: "340200.00",
    isActive: true,
    isPublic: true,
    complianceStatus: "compliant",
    createdAt: "2024-04-10T11:30:00Z",
    updatedAt: "2025-01-07T13:45:00Z"
  },
  {
    id: 3,
    providerId: 1,
    name: "Economic Indicators Dataset",
    description: "Global economic indicators including GDP, inflation, unemployment rates",
    category: "Economic Data",
    subcategory: "Macroeconomic",
    dataType: "Historical + Live",
    fileSize: 512000, // 500 GB in KB
    recordCount: 2500000,
    updateFrequency: "Daily",
    qualityScore: "9.3",
    pricePerRecord: "0.005",
    monthlySubscriptionFee: "950.00",
    oneTimePurchasePrice: "18000.00",
    licenseType: "Academic/Commercial",
    downloadCount: 2890,
    subscriptionCount: 156,
    revenue: "148200.00",
    isActive: true,
    isPublic: true,
    complianceStatus: "compliant",
    createdAt: "2024-05-05T14:20:00Z",
    updatedAt: "2025-01-07T12:30:00Z"
  },
  {
    id: 4,
    providerId: 1,
    name: "ESG Risk Scores",
    description: "Environmental, Social, and Governance risk scores for public companies",
    category: "Risk Data",
    subcategory: "ESG Analytics",
    dataType: "Processed Analytics",
    fileSize: 256000, // 250 GB in KB
    recordCount: 1200000,
    updateFrequency: "Weekly",
    qualityScore: "9.0",
    pricePerRecord: "0.008",
    monthlySubscriptionFee: "1200.00",
    oneTimePurchasePrice: "22000.00",
    licenseType: "Commercial",
    downloadCount: 1560,
    subscriptionCount: 134,
    revenue: "160800.00",
    isActive: true,
    isPublic: true,
    complianceStatus: "compliant",
    createdAt: "2024-06-12T16:45:00Z",
    updatedAt: "2025-01-07T11:15:00Z"
  }
];

const recentActivity = [
  {
    id: 1,
    type: "subscription",
    description: "New subscription to S&P 500 Real-time Market Data",
    user: "QuantTech Analytics",
    timestamp: "2 hours ago",
    icon: Users,
    revenue: 2500
  },
  {
    id: 2,
    type: "upload",
    description: "Updated Cryptocurrency Market Depth dataset",
    user: "System",
    timestamp: "4 hours ago",
    icon: Upload,
    revenue: 0
  },
  {
    id: 3,
    type: "compliance",
    description: "ESG Risk Scores passed compliance audit",
    user: "Compliance Team",
    timestamp: "1 day ago",
    icon: CheckCircle,
    revenue: 0
  },
  {
    id: 4,
    type: "collaboration",
    description: "New collaboration request from AI Research Lab",
    user: "AI Research Lab",
    timestamp: "2 days ago",
    icon: Handshake,
    revenue: 0
  }
];

const OverviewTab = ({ provider, datasets }: { provider: DataProvider | null, datasets: Dataset[] }) => {
  // Use sample data if provider data is not available
  const displayProvider = provider || sampleProvider;
  const displayDatasets = datasets.length > 0 ? datasets : sampleDatasets;
  
  const totalRevenue = parseFloat(displayProvider.totalRevenue);
  const averageQuality = displayDatasets.length > 0 
    ? displayDatasets.reduce((sum, d) => sum + parseFloat(d.qualityScore), 0) / displayDatasets.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Database className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{datasets.length}</p>
              <p className="text-sm text-muted-foreground">Total Datasets</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{provider?.activeSubscriptions || 0}</p>
              <p className="text-sm text-muted-foreground">Active Subscriptions</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Star className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{averageQuality.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Avg Quality Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Provider Status */}
      {provider && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Provider Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Verification Status:</span>
              <Badge variant={provider.isVerified ? "default" : "secondary"}>
                {provider.isVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Account Status:</span>
              <Badge variant={provider.status === "active" ? "default" : "destructive"}>
                {provider.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Data Quality Rating:</span>
              <div className="flex items-center gap-2">
                <Progress value={parseFloat(provider.dataQualityRating) * 20} className="w-20" />
                <span>{provider.dataQualityRating}/5.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {datasets.slice(0, 5).map((dataset) => (
              <div key={dataset.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{dataset.name}</p>
                  <p className="text-sm text-muted-foreground">{dataset.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{dataset.downloadCount} downloads</Badge>
                  <Badge variant={dataset.complianceStatus === "approved" ? "default" : "secondary"}>
                    {dataset.complianceStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DatasetManagementTab = ({ datasets, onDatasetCreated }: { datasets: Dataset[], onDatasetCreated: () => void }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDataset, setNewDataset] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    dataType: "csv",
    updateFrequency: "daily",
    licenseType: "commercial",
    monthlySubscriptionFee: "",
    oneTimePurchasePrice: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createDatasetMutation = useMutation({
    mutationFn: (dataset: any) => apiRequest("POST", "/api/datasets", dataset),
    onSuccess: () => {
      toast({ title: "Dataset created successfully!" });
      setIsCreateDialogOpen(false);
      setNewDataset({
        name: "",
        description: "",
        category: "",
        subcategory: "",
        dataType: "csv",
        updateFrequency: "daily",
        licenseType: "commercial",
        monthlySubscriptionFee: "",
        oneTimePurchasePrice: ""
      });
      onDatasetCreated();
      queryClient.invalidateQueries({ queryKey: ["/api/datasets"] });
    },
    onError: () => {
      toast({ title: "Failed to create dataset", variant: "destructive" });
    }
  });

  const handleCreateDataset = () => {
    createDatasetMutation.mutate(newDataset);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Dataset Management</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Upload Dataset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Dataset</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Dataset Name</Label>
                <Input
                  id="name"
                  value={newDataset.name}
                  onChange={(e) => setNewDataset(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Financial Market Data Q4 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newDataset.category} onValueChange={(value) => setNewDataset(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market_data">Market Data</SelectItem>
                    <SelectItem value="transaction_data">Transaction Data</SelectItem>
                    <SelectItem value="news_sentiment">News Sentiment</SelectItem>
                    <SelectItem value="alternative_data">Alternative Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataType">Data Type</Label>
                <Select value={newDataset.dataType} onValueChange={(value) => setNewDataset(prev => ({ ...prev, dataType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="parquet">Parquet</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="stream">Stream</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="updateFrequency">Update Frequency</Label>
                <Select value={newDataset.updateFrequency} onValueChange={(value) => setNewDataset(prev => ({ ...prev, updateFrequency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real_time">Real-time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newDataset.description}
                  onChange={(e) => setNewDataset(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of your dataset..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseType">License Type</Label>
                <Select value={newDataset.licenseType} onValueChange={(value) => setNewDataset(prev => ({ ...prev, licenseType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="research">Research Only</SelectItem>
                    <SelectItem value="exclusive">Exclusive</SelectItem>
                    <SelectItem value="non_exclusive">Non-exclusive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyFee">Monthly Subscription ($)</Label>
                <Input
                  id="monthlyFee"
                  type="number"
                  value={newDataset.monthlySubscriptionFee}
                  onChange={(e) => setNewDataset(prev => ({ ...prev, monthlySubscriptionFee: e.target.value }))}
                  placeholder="99.00"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateDataset} disabled={createDatasetMutation.isPending}>
                {createDatasetMutation.isPending ? "Creating..." : "Create Dataset"}
              </Button>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {datasets.map((dataset) => (
          <Card key={dataset.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{dataset.name}</h4>
                    <Badge variant={dataset.isActive ? "default" : "secondary"}>
                      {dataset.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant={dataset.complianceStatus === "approved" ? "default" : "secondary"}>
                      {dataset.complianceStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{dataset.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Category</p>
                      <p className="text-muted-foreground">{dataset.category}</p>
                    </div>
                    <div>
                      <p className="font-medium">Downloads</p>
                      <p className="text-muted-foreground">{dataset.downloadCount}</p>
                    </div>
                    <div>
                      <p className="font-medium">Revenue</p>
                      <p className="text-muted-foreground">${parseFloat(dataset.revenue).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Quality Score</p>
                      <div className="flex items-center gap-2">
                        <Progress value={parseFloat(dataset.qualityScore) * 20} className="w-16" />
                        <span>{dataset.qualityScore}/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const RevenueMonitoringTab = ({ datasets }: { datasets: Dataset[] }) => {
  const totalRevenue = datasets.reduce((sum, d) => sum + parseFloat(d.revenue), 0);
  const totalDownloads = datasets.reduce((sum, d) => sum + d.downloadCount, 0);
  const totalSubscriptions = datasets.reduce((sum, d) => sum + d.subscriptionCount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Download className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{totalDownloads.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Downloads</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{totalSubscriptions}</p>
              <p className="text-sm text-muted-foreground">Active Subscriptions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Dataset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {datasets
              .sort((a, b) => parseFloat(b.revenue) - parseFloat(a.revenue))
              .slice(0, 10)
              .map((dataset) => (
                <div key={dataset.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{dataset.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {dataset.downloadCount} downloads • {dataset.subscriptionCount} subscriptions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${parseFloat(dataset.revenue).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      ${dataset.monthlySubscriptionFee || dataset.oneTimePurchasePrice || "0"}/month
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const APIAccessTab = () => {
  const { data: apiKeys = [] } = useQuery({
    queryKey: ["/api/api-keys"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">API Access & Integration</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Generate API Key
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((key) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Production Key {key}</p>
                    <p className="text-sm text-muted-foreground">sk_prod_***************</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Active</Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              API Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Dataset Access API</h4>
                <p className="text-sm text-muted-foreground mb-2">RESTful API for dataset access</p>
                <Button variant="outline" size="sm">View Docs</Button>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Real-time Streaming</h4>
                <p className="text-sm text-muted-foreground mb-2">WebSocket API for live data</p>
                <Button variant="outline" size="sm">View Docs</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">12.5K</p>
              <p className="text-sm text-muted-foreground">API Calls Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">45</p>
              <p className="text-sm text-muted-foreground">Active Integrations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">8ms</p>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PerformanceTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Model Performance & Validation</h3>
        <Button className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Run Validation
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-green-600">94.2%</p>
                <p className="text-sm text-muted-foreground">Average Accuracy</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-blue-600">89.7%</p>
                <p className="text-sm text-muted-foreground">Precision</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-purple-600">91.3%</p>
                <p className="text-sm text-muted-foreground">Recall</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validation Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((report) => (
                <div key={report} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Validation Report #{report}</p>
                    <p className="text-sm text-muted-foreground">Generated 2 days ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Passed</Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MarketInsightsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Market Insights & Trends</h3>
        <Button className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Dataset Adoption Rate</span>
                  <span className="font-semibold">+15.3%</span>
                </div>
                <Progress value={73} className="w-full" />
                
                <div className="flex items-center justify-between">
                  <span>Market Impact Score</span>
                  <span className="font-semibold">8.7/10</span>
                </div>
                <Progress value={87} className="w-full" />
              </div>
              
              <div className="space-y-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-green-600">$2.3M</p>
                  <p className="text-sm text-muted-foreground">Market Impact Value</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">156</p>
                  <p className="text-sm text-muted-foreground">Models Using Data</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { trend: "Algorithmic Trading", impact: "High", growth: "+23%" },
                { trend: "Risk Assessment", impact: "Medium", growth: "+12%" },
                { trend: "Market Sentiment", impact: "High", growth: "+34%" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.trend}</p>
                    <Badge variant={item.impact === "High" ? "default" : "secondary"}>
                      {item.impact} Impact
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{item.growth}</p>
                    <p className="text-sm text-muted-foreground">Growth</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const PortfolioManagementTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Portfolio Management</h3>
        <Button className="flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          Optimize Portfolio
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dataset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: "Market Data", allocation: 45, value: "$450K" },
                { category: "Risk Data", allocation: 30, value: "$300K" },
                { category: "Alternative Data", allocation: 25, value: "$250K" }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-sm">{item.value} ({item.allocation}%)</span>
                  </div>
                  <Progress value={item.allocation} className="w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-lg font-bold text-green-600">Low</p>
                  <p className="text-sm text-muted-foreground">Portfolio Risk</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-lg font-bold text-blue-600">0.87</p>
                  <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Diversification Score</span>
                  <span className="font-semibold">8.2/10</span>
                </div>
                <Progress value={82} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ComplianceTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Data Compliance & Governance</h3>
        <Button className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Run Compliance Check
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold">GDPR</p>
                <Badge variant="default">Compliant</Badge>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold">SEC</p>
                <Badge variant="default">Compliant</Badge>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="font-semibold">MiFID II</p>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Governance Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { policy: "Data Retention Policy", status: "Active", updated: "2 days ago" },
                { policy: "Privacy Protection", status: "Active", updated: "1 week ago" },
                { policy: "Access Control", status: "Active", updated: "3 days ago" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.policy}</p>
                    <p className="text-sm text-muted-foreground">Updated {item.updated}</p>
                  </div>
                  <Badge variant="default">{item.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AuditTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Audit & Reporting</h3>
        <Button className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Generate Audit Report
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Dataset Access", user: "model_dev_123", time: "2 hours ago", status: "Success" },
                { action: "Data Export", user: "analyst_456", time: "4 hours ago", status: "Success" },
                { action: "API Access", user: "integration_789", time: "6 hours ago", status: "Failed" },
                { action: "Compliance Check", user: "system", time: "1 day ago", status: "Success" }
              ].map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <p className="text-sm text-muted-foreground">by {log.user} • {log.time}</p>
                  </div>
                  <Badge variant={log.status === "Success" ? "default" : "destructive"}>
                    {log.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Monthly Compliance Report", date: "Jan 2025", type: "Compliance" },
                { name: "Data Quality Assessment", date: "Dec 2024", type: "Quality" },
                { name: "Security Audit Report", date: "Dec 2024", type: "Security" }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">{report.date} • {report.type}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const UserAccessTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">User Access & Permissions</h3>
        <Button className="flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Control</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { role: "Admin", users: 2, permissions: ["Full Access", "User Management", "Billing"] },
                { role: "Data Scientist", users: 15, permissions: ["Dataset Access", "API Usage", "Reports"] },
                { role: "Viewer", users: 23, permissions: ["Read Only", "Basic Reports"] }
              ].map((role, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{role.role}</h4>
                    <Badge variant="outline">{role.users} users</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "alice@company.com", dataset: "Market Data Q1", time: "2 hours ago" },
                { user: "bob@hedge.fund", dataset: "Risk Metrics", time: "4 hours ago" },
                { user: "carol@fintech.co", dataset: "Alternative Data", time: "1 day ago" }
              ].map((access, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{access.user}</p>
                    <p className="text-sm text-muted-foreground">Accessed {access.dataset}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{access.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const BillingTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Billing & Cost Management</h3>
        <Button className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Manage Billing
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-green-600">$45,230</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-blue-600">$523,450</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-purple-600">234</p>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-orange-600">15.3%</p>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { plan: "Enterprise", customers: 12, revenue: "$18,000", growth: "+23%" },
                { plan: "Professional", customers: 45, revenue: "$22,500", growth: "+15%" },
                { plan: "Basic", customers: 177, revenue: "$4,730", growth: "+8%" }
              ].map((plan, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{plan.plan} Plan</p>
                    <p className="text-sm text-muted-foreground">{plan.customers} customers</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{plan.revenue}</p>
                    <p className="text-sm text-green-600">{plan.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "Jan 15, 2025", amount: "$45,230", status: "Received", method: "Bank Transfer" },
                { date: "Dec 15, 2024", amount: "$42,180", status: "Received", method: "Wire Transfer" },
                { date: "Nov 15, 2024", amount: "$38,950", status: "Received", method: "Bank Transfer" }
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{payment.amount}</p>
                    <p className="text-sm text-muted-foreground">{payment.date} • {payment.method}</p>
                  </div>
                  <Badge variant="default">{payment.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CollaborationTab = () => {
  const { data: collaborations = [] } = useQuery({
    queryKey: ["/api/data-collaborations"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Active Collaborations</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Collaboration
        </Button>
      </div>

      <div className="grid gap-4">
        {collaborations.map((collaboration: any) => (
          <Card key={collaboration.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">Model Development Partnership</h4>
                    <Badge variant={collaboration.status === "active" ? "default" : "secondary"}>
                      {collaboration.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Collaborative development using financial market data
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Type</p>
                      <p className="text-muted-foreground">{collaboration.collaborationType}</p>
                    </div>
                    <div>
                      <p className="font-medium">Access Level</p>
                      <p className="text-muted-foreground">{collaboration.accessLevel}</p>
                    </div>
                    <div>
                      <p className="font-medium">Revenue Share</p>
                      <p className="text-muted-foreground">{collaboration.revenueShare}%</p>
                    </div>
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-muted-foreground">6 months</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default function DataProviderDashboard() {
  const queryClient = useQueryClient();

  const { data: provider } = useQuery<DataProvider>({
    queryKey: ["/api/data-provider"],
  });

  const { data: datasets = [] } = useQuery<Dataset[]>({
    queryKey: ["/api/datasets"],
  });

  const handleDatasetCreated = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/datasets"] });
    queryClient.invalidateQueries({ queryKey: ["/api/data-provider"] });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Data Provider Overview</h1>
            <p className="text-muted-foreground">
              Manage your datasets, monitor revenue, and collaborate with developers
            </p>
          </div>
          {provider?.isVerified && (
            <Badge className="bg-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Verified Provider
            </Badge>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="w-full overflow-x-auto">
            <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 min-w-max">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="datasets">Datasets</TabsTrigger>
              <TabsTrigger value="api">API Access</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="insights">Market Insights</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
              <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
              <TabsTrigger value="access">User Access</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <OverviewTab provider={provider || null} datasets={datasets} />
          </TabsContent>

          <TabsContent value="datasets">
            <DatasetManagementTab datasets={datasets} onDatasetCreated={handleDatasetCreated} />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueMonitoringTab datasets={datasets} />
          </TabsContent>

          <TabsContent value="api">
            <APIAccessTab />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceTab />
          </TabsContent>

          <TabsContent value="insights">
            <MarketInsightsTab />
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioManagementTab />
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceTab />
          </TabsContent>

          <TabsContent value="audit">
            <AuditTab />
          </TabsContent>

          <TabsContent value="collaboration">
            <CollaborationTab />
          </TabsContent>

          <TabsContent value="access">
            <UserAccessTab />
          </TabsContent>

          <TabsContent value="billing">
            <BillingTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}