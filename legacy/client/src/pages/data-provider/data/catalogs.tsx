import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import {
  Database,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Users,
  FileText,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Star,
  Tag
} from "lucide-react";

export default function DataProviderDataCatalogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDatasetOpen, setIsAddDatasetOpen] = useState(false);
  const [newDataset, setNewDataset] = useState({
    name: "",
    description: "",
    category: "",
    dataFormat: "",
    updateFrequency: "",
    price: "",
    tags: ""
  });
  const { toast } = useToast();

  // Sample dataset catalog data
  const datasets = [
    {
      id: 1,
      name: "Global Stock Market Historical Data",
      description: "Complete historical stock data for 5000+ companies across major exchanges",
      category: "Market Data",
      size: "2.3 TB",
      records: "50M+",
      lastUpdated: "2024-07-15",
      status: "Active",
      downloads: 1250,
      rating: 4.8,
      price: "$299/month",
      subscribers: 45,
      tags: ["stocks", "historical", "global", "real-time"]
    },
    {
      id: 2,
      name: "Cryptocurrency Trading Signals",
      description: "Real-time crypto trading signals with sentiment analysis",
      category: "Crypto",
      size: "890 GB",
      records: "12M+",
      lastUpdated: "2024-07-15",
      status: "Active",
      downloads: 890,
      rating: 4.6,
      price: "$199/month",
      subscribers: 32,
      tags: ["crypto", "signals", "sentiment", "trading"]
    },
    {
      id: 3,
      name: "Economic Indicators Dataset",
      description: "Comprehensive economic indicators from 50+ countries",
      category: "Economics",
      size: "125 GB",
      records: "2M+",
      lastUpdated: "2024-07-10",
      status: "Maintenance",
      downloads: 567,
      rating: 4.9,
      price: "$149/month",
      subscribers: 28,
      tags: ["economics", "indicators", "global", "government"]
    },
    {
      id: 4,
      name: "Alternative Finance Data",
      description: "P2P lending, crowdfunding, and alternative investment data",
      category: "Alternative Finance",
      size: "456 GB",
      records: "8M+",
      lastUpdated: "2024-07-12",
      status: "Active",
      downloads: 345,
      rating: 4.7,
      price: "$179/month",
      subscribers: 19,
      tags: ["p2p", "crowdfunding", "alternative", "fintech"]
    }
  ];

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || dataset.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || dataset.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500";
      case "Maintenance": return "bg-yellow-500";
      case "Deprecated": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dataset Catalogs</h1>
            <p className="text-muted-foreground">Manage your dataset catalog and marketplace listings</p>
          </div>
          <Dialog open={isAddDatasetOpen} onOpenChange={setIsAddDatasetOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Dataset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Dataset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Dataset Name</Label>
                    <Input
                      id="name"
                      value={newDataset.name}
                      onChange={(e) => setNewDataset({...newDataset, name: e.target.value})}
                      placeholder="Enter dataset name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newDataset.category} onValueChange={(value) => setNewDataset({...newDataset, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Market Data">Market Data</SelectItem>
                        <SelectItem value="Crypto">Crypto</SelectItem>
                        <SelectItem value="Economics">Economics</SelectItem>
                        <SelectItem value="Alternative Finance">Alternative Finance</SelectItem>
                        <SelectItem value="ESG">ESG</SelectItem>
                        <SelectItem value="Risk Analytics">Risk Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDataset.description}
                    onChange={(e) => setNewDataset({...newDataset, description: e.target.value})}
                    placeholder="Describe your dataset"
                    className="min-h-20"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataFormat">Data Format</Label>
                    <Select value={newDataset.dataFormat} onValueChange={(value) => setNewDataset({...newDataset, dataFormat: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CSV">CSV</SelectItem>
                        <SelectItem value="JSON">JSON</SelectItem>
                        <SelectItem value="Parquet">Parquet</SelectItem>
                        <SelectItem value="API">REST API</SelectItem>
                        <SelectItem value="GraphQL">GraphQL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="updateFrequency">Update Frequency</Label>
                    <Select value={newDataset.updateFrequency} onValueChange={(value) => setNewDataset({...newDataset, updateFrequency: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Real-time">Real-time</SelectItem>
                        <SelectItem value="Hourly">Hourly</SelectItem>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={newDataset.price}
                      onChange={(e) => setNewDataset({...newDataset, price: e.target.value})}
                      placeholder="$99/month"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newDataset.tags}
                    onChange={(e) => setNewDataset({...newDataset, tags: e.target.value})}
                    placeholder="trading, stocks, real-time"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDatasetOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    toast({
                      title: "Dataset Created",
                      description: `${newDataset.name} has been successfully added to your catalog.`,
                    });
                    setIsAddDatasetOpen(false);
                    setNewDataset({
                      name: "",
                      description: "",
                      category: "",
                      dataFormat: "",
                      updateFrequency: "",
                      price: "",
                      tags: ""
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Dataset
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Datasets</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
                <Database className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Datasets</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                  <p className="text-2xl font-bold">3.1K</p>
                </div>
                <Download className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">4.7</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search datasets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Market Data">Market Data</SelectItem>
                  <SelectItem value="Crypto">Crypto</SelectItem>
                  <SelectItem value="Economics">Economics</SelectItem>
                  <SelectItem value="Alternative Finance">Alternative Finance</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Dataset Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDatasets.map((dataset) => (
            <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{dataset.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{dataset.description}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(dataset.status)}`} />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {dataset.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span>{dataset.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{dataset.records} records</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span>{dataset.downloads} downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{dataset.subscribers} subscribers</span>
                  </div>
                </div>

                {/* Rating and Price */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{dataset.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({Math.floor(dataset.downloads * 0.3)} reviews)
                    </span>
                  </div>
                  <div className="text-lg font-bold text-green-600">{dataset.price}</div>
                </div>

                {/* Last Updated */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {dataset.lastUpdated}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Upload className="h-6 w-6" />
                <span>Bulk Upload</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Download className="h-6 w-6" />
                <span>Export Catalog</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <BarChart3 className="h-6 w-6" />
                <span>Performance Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}