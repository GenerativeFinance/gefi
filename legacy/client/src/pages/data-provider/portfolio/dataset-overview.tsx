import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Database, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Archive, 
  Eye, 
  Download,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Upload
} from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function DatasetOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Sample dataset data
  const datasets = [
    {
      id: 1,
      name: "S&P 500 Historical Data",
      description: "Complete historical price and volume data for S&P 500 companies from 2000-2025",
      category: "Equities",
      status: "Active",
      createdDate: "2024-01-15",
      lastUpdated: "2025-07-15",
      size: "2.4 GB",
      records: "12.5M",
      downloads: 1247,
      rating: 4.8
    },
    {
      id: 2,
      name: "Federal Reserve Economic Data",
      description: "Key economic indicators including interest rates, inflation, and employment data",
      category: "Economic Indicators",
      status: "Active",
      createdDate: "2024-03-20",
      lastUpdated: "2025-07-14",
      size: "856 MB",
      records: "3.2M",
      downloads: 892,
      rating: 4.6
    },
    {
      id: 3,
      name: "Cryptocurrency Trading Pairs",
      description: "Real-time and historical data for major cryptocurrency trading pairs",
      category: "Crypto",
      status: "Active",
      createdDate: "2024-05-10",
      lastUpdated: "2025-07-15",
      size: "1.8 GB",
      records: "8.7M",
      downloads: 2156,
      rating: 4.9
    },
    {
      id: 4,
      name: "Corporate Bond Yields",
      description: "Historical corporate bond yield data across different credit ratings",
      category: "Bonds",
      status: "Pending Review",
      createdDate: "2025-07-01",
      lastUpdated: "2025-07-10",
      size: "645 MB",
      records: "1.9M",
      downloads: 34,
      rating: 4.3
    },
    {
      id: 5,
      name: "Legacy Market Data 2010-2015",
      description: "Archived market data from the 2010-2015 period for historical analysis",
      category: "Equities",
      status: "Archived",
      createdDate: "2023-12-05",
      lastUpdated: "2024-01-15",
      size: "3.1 GB",
      records: "15.2M",
      downloads: 456,
      rating: 4.2
    }
  ];

  const categories = ["All", "Equities", "Bonds", "Crypto", "Economic Indicators", "Real-time Market Data"];
  const statuses = ["All", "Active", "Pending Review", "Archived"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Pending Review": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <CheckCircle className="h-4 w-4" />;
      case "Pending Review": return <Clock className="h-4 w-4" />;
      case "Archived": return <Archive className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || dataset.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || dataset.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dataset Overview</h1>
            <p className="text-muted-foreground">Manage your dataset catalog with detailed information about uploads, categories, and status.</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Upload Dataset
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload New Dataset</DialogTitle>
                  <DialogDescription>
                    Add a new dataset to your portfolio for developers to access.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dataset-name">Dataset Name</Label>
                    <Input id="dataset-name" placeholder="Enter dataset name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dataset-description">Description</Label>
                    <Input id="dataset-description" placeholder="Describe your dataset" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equities">Equities</SelectItem>
                          <SelectItem value="bonds">Bonds</SelectItem>
                          <SelectItem value="crypto">Crypto</SelectItem>
                          <SelectItem value="economic">Economic Indicators</SelectItem>
                          <SelectItem value="realtime">Real-time Market Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="pricing">Pricing Model</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pricing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="subscription">Subscription</SelectItem>
                          <SelectItem value="pay-per-use">Pay Per Use</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="file-upload">Dataset File</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">CSV, JSON, Parquet files up to 5GB</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button>Upload Dataset</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{datasets.length}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Datasets</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{datasets.filter(d => d.status === "Active").length}</div>
              <p className="text-xs text-muted-foreground">80% of total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{datasets.reduce((sum, d) => sum + d.downloads, 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(datasets.reduce((sum, d) => sum + d.rating, 0) / datasets.length).toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Across all datasets</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Datasets</CardTitle>
            <CardDescription>Find specific datasets using search and filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search datasets by name or description..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.slice(1).map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Datasets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Dataset Catalog</CardTitle>
            <CardDescription>Complete list of your datasets with details and status information</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dataset Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDatasets.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{dataset.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {dataset.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{dataset.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(dataset.status)}>
                        {getStatusIcon(dataset.status)}
                        <span className="ml-1">{dataset.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(dataset.createdDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {new Date(dataset.lastUpdated).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{dataset.size}</div>
                        <div className="text-sm text-muted-foreground">{dataset.records} records</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        {dataset.downloads.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{dataset.rating}</span>
                        <span className="text-muted-foreground">/5</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}