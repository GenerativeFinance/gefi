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
  MessageSquare
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

const OverviewTab = ({ provider, datasets }: { provider: DataProvider | null, datasets: Dataset[] }) => {
  const totalRevenue = provider ? parseFloat(provider.totalRevenue) : 0;
  const averageQuality = datasets.length > 0 
    ? datasets.reduce((sum, d) => sum + parseFloat(d.qualityScore), 0) / datasets.length 
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
            <h1 className="text-3xl font-bold">Data Provider Dashboard</h1>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="datasets">Dataset Management</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Monitoring</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab provider={provider || null} datasets={datasets} />
          </TabsContent>

          <TabsContent value="datasets">
            <DatasetManagementTab datasets={datasets} onDatasetCreated={handleDatasetCreated} />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueMonitoringTab datasets={datasets} />
          </TabsContent>

          <TabsContent value="collaboration">
            <CollaborationTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}