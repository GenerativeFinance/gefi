import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Settings,
  Download,
  Eye,
  Plus,
  Star,
  Users,
  DollarSign,
  Shield,
  Lock,
  Unlock,
  FileText,
  Calendar,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy
} from "lucide-react";

export default function DataProviderDatasets() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAccess, setSelectedAccess] = useState("all");
  const { toast } = useToast();

  // Sample datasets data
  const datasets = [
    {
      id: 1,
      name: "S&P 500 Historical Prices",
      description: "Complete historical pricing data for all S&P 500 companies from 2010-2024 with adjusted close prices, volume, and market cap data.",
      category: "Market Data",
      subcategory: "Equity Prices",
      dataType: "Time Series",
      format: "CSV",
      size: "2.3 GB",
      lastUpdated: "2024-01-15",
      accessLevel: "Premium",
      subscriptions: 145,
      revenue: "$23,450",
      qualityScore: 98,
      downloads: 1250,
      isActive: true,
      compliance: "SOC 2, GDPR",
      frequency: "Daily",
      tags: ["stocks", "equity", "sp500", "historical"]
    },
    {
      id: 2,
      name: "Cryptocurrency Order Book Data",
      description: "Real-time order book snapshots from major crypto exchanges including Binance, Coinbase, and Kraken for top 100 cryptocurrencies.",
      category: "Cryptocurrency",
      subcategory: "Order Book",
      dataType: "Real-time",
      format: "JSON",
      size: "15.7 GB",
      lastUpdated: "2024-01-16",
      accessLevel: "Enterprise",
      subscriptions: 67,
      revenue: "$45,890",
      qualityScore: 95,
      downloads: 890,
      isActive: true,
      compliance: "ISO 27001, PCI DSS",
      frequency: "Real-time",
      tags: ["crypto", "orderbook", "realtime", "exchanges"]
    },
    {
      id: 3,
      name: "Global Economic Indicators",
      description: "Comprehensive economic indicators dataset covering GDP, inflation, unemployment, interest rates for 50+ countries with 20+ years of history.",
      category: "Economic Data",
      subcategory: "Macroeconomic",
      dataType: "Statistical",
      format: "Excel",
      size: "458 MB",
      lastUpdated: "2024-01-10",
      accessLevel: "Standard",
      subscriptions: 234,
      revenue: "$18,670",
      qualityScore: 92,
      downloads: 2100,
      isActive: true,
      compliance: "GDPR",
      frequency: "Monthly",
      tags: ["economics", "gdp", "inflation", "global"]
    },
    {
      id: 4,
      name: "Corporate ESG Ratings",
      description: "Environmental, Social, and Governance ratings for 3000+ public companies with detailed scoring methodology and historical trends.",
      category: "ESG Data",
      subcategory: "Corporate Ratings",
      dataType: "Structured",
      format: "JSON",
      size: "785 MB",
      lastUpdated: "2024-01-12",
      accessLevel: "Premium",
      subscriptions: 89,
      revenue: "$32,100",
      qualityScore: 89,
      downloads: 445,
      isActive: false,
      compliance: "GDPR, CCPA",
      frequency: "Quarterly",
      tags: ["esg", "sustainability", "corporate", "governance"]
    }
  ];

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || dataset.category === selectedCategory;
    const matchesAccess = selectedAccess === "all" || dataset.accessLevel.toLowerCase() === selectedAccess;
    
    return matchesSearch && matchesCategory && matchesAccess;
  });

  const getAccessBadgeColor = (accessLevel: string) => {
    switch (accessLevel.toLowerCase()) {
      case "enterprise": return "bg-purple-500 text-white";
      case "premium": return "bg-blue-500 text-white";
      case "standard": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 90) return "text-blue-600";
    if (score >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dataset Upload & Management Tools</h1>
          <p className="text-muted-foreground">
            Robust tools to upload, organize, clean, and manage datasets with data versioning, tagging, and access control
          </p>
        </div>

        {/* Management Tools Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Dataset Versions</p>
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-xs text-green-600">Auto-versioning enabled</p>
                </div>
                <Database className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Data Quality Score</p>
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-xs text-blue-600">Auto-cleaning tools</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Access Controls</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-purple-600">Security layers active</p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tagged Datasets</p>
                  <p className="text-2xl font-bold">535</p>
                  <p className="text-xs text-green-600">Smart tagging system</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Management Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload & Organization Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Bulk Upload</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Auto-Classification</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Folder Organization</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <Button size="sm" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Configure Tools
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Data Cleaning & Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Missing Value Detection</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Outlier Analysis</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Data Validation</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <Button size="sm" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Run Quality Check
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Version Control & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Git-like Versioning</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Role-based Access</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Audit Trails</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <Button size="sm" className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                Manage Access
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search datasets, tags, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Market Data">Market Data</SelectItem>
              <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
              <SelectItem value="Economic Data">Economic Data</SelectItem>
              <SelectItem value="ESG Data">ESG Data</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedAccess} onValueChange={setSelectedAccess}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Access Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Access</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
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
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataset-name">Dataset Name</Label>
                    <Input id="dataset-name" placeholder="Enter dataset name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market-data">Market Data</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        <SelectItem value="economic">Economic Data</SelectItem>
                        <SelectItem value="esg">ESG Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your dataset..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="access-level">Access Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricing">Pricing (per month)</Label>
                    <Input id="pricing" placeholder="$0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Dataset File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">Supports CSV, JSON, Excel files up to 10GB</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsUploadDialogOpen(false)}>
                  Upload Dataset
                </Button>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Datasets Grid */}
        <div className="grid gap-6">
          {filteredDatasets.map((dataset) => (
            <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{dataset.name}</h3>
                      <Badge className={getAccessBadgeColor(dataset.accessLevel)}>
                        {dataset.accessLevel}
                      </Badge>
                      {dataset.isActive ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{dataset.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {dataset.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Subscriptions</p>
                    <p className="text-lg font-semibold">{dataset.subscriptions}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-lg font-semibold text-green-600">{dataset.revenue}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Quality Score</p>
                    <p className={`text-lg font-semibold ${getQualityColor(dataset.qualityScore)}`}>
                      {dataset.qualityScore}%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Downloads</p>
                    <p className="text-lg font-semibold">{dataset.downloads}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <span>Category: {dataset.category}</span>
                    <span>Size: {dataset.size}</span>
                    <span>Format: {dataset.format}</span>
                  </div>
                  <span>Updated: {dataset.lastUpdated}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      Compliance: {dataset.compliance}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDatasets.length === 0 && (
          <Card className="p-12 text-center">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No datasets found</h3>
            <p className="text-muted-foreground mb-4">
              No datasets match your current search criteria
            </p>
            <Button onClick={() => setSearchQuery("")}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
}