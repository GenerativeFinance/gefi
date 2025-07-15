import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import {
  GitBranch,
  Calendar,
  Download,
  Upload,
  Eye,
  Tag,
  Clock,
  User,
  FileText,
  Plus,
  ArrowRight,
  GitCommit,
  GitMerge,
  History,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2
} from "lucide-react";

export default function DataProviderDataVersioning() {
  const [selectedDataset, setSelectedDataset] = useState("dataset-1");
  const [isCreateVersionOpen, setIsCreateVersionOpen] = useState(false);

  // Sample version history data
  const versionHistory = [
    {
      version: "v2.1.0",
      type: "major",
      date: "2024-07-15",
      author: "John Doe",
      status: "active",
      description: "Added cryptocurrency data from 5 new exchanges, enhanced data quality checks",
      changes: [
        "Added Binance, Coinbase Pro, Kraken, Bitfinex, and Huobi data",
        "Implemented real-time validation pipeline",
        "Fixed missing volume data for 127 symbols",
        "Updated schema to include market maker data"
      ],
      size: "2.3 TB",
      records: "50M+",
      downloads: 1250,
      subscribers: 45
    },
    {
      version: "v2.0.1",
      type: "patch",
      date: "2024-07-10",
      author: "Sarah Smith",
      status: "deprecated",
      description: "Hotfix for data formatting issues in European markets",
      changes: [
        "Fixed timestamp formatting for LSE data",
        "Corrected currency conversion rates",
        "Updated API response structure"
      ],
      size: "2.1 TB",
      records: "48M+",
      downloads: 890,
      subscribers: 42
    },
    {
      version: "v2.0.0",
      type: "major",
      date: "2024-07-01",
      author: "Mike Johnson",
      status: "archived",
      description: "Major restructuring with new data sources and improved accuracy",
      changes: [
        "Complete schema redesign",
        "Added 2000+ new stocks from emerging markets",
        "Implemented machine learning data validation",
        "New REST API with GraphQL support"
      ],
      size: "1.9 TB",
      records: "45M+",
      downloads: 2100,
      subscribers: 38
    },
    {
      version: "v1.5.2",
      type: "minor",
      date: "2024-06-15",
      author: "Emily Chen",
      status: "archived",
      description: "Performance improvements and bug fixes",
      changes: [
        "Optimized query performance by 40%",
        "Fixed data gaps in Asian markets",
        "Added batch download functionality"
      ],
      size: "1.7 TB",
      records: "42M+",
      downloads: 1650,
      subscribers: 35
    }
  ];

  const getVersionTypeColor = (type: string) => {
    switch (type) {
      case "major": return "bg-red-500";
      case "minor": return "bg-yellow-500";
      case "patch": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-50 border-green-200";
      case "deprecated": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "archived": return "text-gray-600 bg-gray-50 border-gray-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "deprecated": return <AlertTriangle className="h-4 w-4" />;
      case "archived": return <Info className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Data Versioning</h1>
            <p className="text-muted-foreground">Manage dataset versions, track changes, and maintain version history</p>
          </div>
          <Dialog open={isCreateVersionOpen} onOpenChange={setIsCreateVersionOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Version
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Version</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Version Number</Label>
                    <Input placeholder="v2.2.0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Version Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="major">Major Release</SelectItem>
                        <SelectItem value="minor">Minor Release</SelectItem>
                        <SelectItem value="patch">Patch/Hotfix</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Release Description</Label>
                  <Textarea 
                    placeholder="Brief description of changes in this version..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Changelog</Label>
                  <Textarea 
                    placeholder="• Added new feature X&#10;• Fixed bug Y&#10;• Improved performance Z"
                    rows={5}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateVersionOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateVersionOpen(false)}>
                    Create Version
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dataset Selection and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Label htmlFor="dataset-select" className="text-sm font-medium">Dataset:</Label>
                <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                  <SelectTrigger className="w-96">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dataset-1">Global Stock Market Historical Data</SelectItem>
                    <SelectItem value="dataset-2">Cryptocurrency Trading Signals</SelectItem>
                    <SelectItem value="dataset-3">Economic Indicators Dataset</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Versions</p>
                  <p className="text-2xl font-bold">{versionHistory.length}</p>
                </div>
                <GitBranch className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Version Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitMerge className="h-5 w-5" />
              Quick Version Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>From Version</Label>
                <Select defaultValue="v2.0.0">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {versionHistory.map((version) => (
                      <SelectItem key={version.version} value={version.version}>
                        {version.version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>To Version</Label>
                <Select defaultValue="v2.1.0">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {versionHistory.map((version) => (
                      <SelectItem key={version.version} value={version.version}>
                        {version.version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Compare
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Version History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {versionHistory.map((version, index) => (
                <div key={version.version} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getVersionTypeColor(version.type)}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{version.version}</h3>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(version.status)} border`}
                          >
                            {getStatusIcon(version.status)}
                            <span className="ml-1 capitalize">{version.status}</span>
                          </Badge>
                          <Badge variant="secondary" className="capitalize">
                            {version.type}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">{version.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {version.status !== "active" && (
                        <Button variant="outline" size="sm">
                          <GitCommit className="h-4 w-4 mr-2" />
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{version.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{version.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{version.size}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span>{version.downloads} downloads</span>
                    </div>
                  </div>

                  {/* Changes List */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <GitCommit className="h-4 w-4" />
                      Changes in this version:
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {version.changes.map((change, changeIndex) => (
                        <li key={changeIndex} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Version Metrics */}
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{version.records}</div>
                      <div className="text-sm text-muted-foreground">Records</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{version.downloads}</div>
                      <div className="text-sm text-muted-foreground">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{version.subscribers}</div>
                      <div className="text-sm text-muted-foreground">Subscribers</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Branching Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Branching Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GitBranch className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Major Releases</h3>
                <p className="text-sm text-muted-foreground">
                  Breaking changes, new features, significant schema updates
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GitCommit className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold mb-2">Minor Releases</h3>
                <p className="text-sm text-muted-foreground">
                  New data sources, performance improvements, backward compatible
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Tag className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Patches</h3>
                <p className="text-sm text-muted-foreground">
                  Bug fixes, data corrections, security updates
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}