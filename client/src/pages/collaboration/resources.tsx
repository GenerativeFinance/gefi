import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText,
  Download,
  Eye,
  Share2,
  Lock,
  Globe,
  Calendar,
  User,
  Plus,
  Search,
  Filter,
  Database,
  Brain,
  TrendingUp
} from "lucide-react";

export default function CollaborationResources() {
  const documents = [
    {
      id: 1,
      name: "AI Trading Strategy Q2 2025",
      type: "PDF",
      size: "2.4 MB",
      lastModified: "2025-07-10",
      author: "Sarah Chen",
      permissions: "Team Access",
      downloads: 45,
      category: "Strategy"
    },
    {
      id: 2,
      name: "Risk Assessment Framework",
      type: "XLSX",
      size: "1.8 MB",
      lastModified: "2025-07-08",
      author: "Elena Rodriguez",
      permissions: "Private",
      downloads: 23,
      category: "Risk Management"
    },
    {
      id: 3,
      name: "Market Analysis Report",
      type: "PDF",
      size: "3.2 MB",
      lastModified: "2025-07-05",
      author: "Mike Johnson",
      permissions: "Public",
      downloads: 67,
      category: "Research"
    }
  ];

  const datasets = [
    {
      id: 1,
      name: "S&P 500 Historical Data",
      description: "20 years of daily trading data",
      size: "156 MB",
      records: "2.3M",
      lastUpdated: "2025-07-15",
      provider: "Financial Data Corp",
      usage: 89,
      category: "Market Data"
    },
    {
      id: 2,
      name: "ESG Scores Database",
      description: "Comprehensive ESG ratings for 5000+ companies",
      size: "45 MB",
      records: "850K",
      lastUpdated: "2025-07-12",
      provider: "ESG Analytics",
      usage: 67,
      category: "ESG Data"
    }
  ];

  const models = [
    {
      id: 1,
      name: "Deep Learning Price Predictor",
      description: "LSTM-based model for stock price prediction",
      accuracy: "92.3%",
      lastTrained: "2025-07-14",
      creator: "AI Research Team",
      usage: 156,
      status: "Active"
    },
    {
      id: 2,
      name: "Risk Scoring Algorithm",
      description: "Multi-factor risk assessment for portfolio management",
      accuracy: "88.7%",
      lastTrained: "2025-07-10",
      creator: "Quant Team",
      usage: 89,
      status: "Testing"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Shared Resources</h1>
            <p className="text-muted-foreground">
              Access documents, datasets, and AI models shared by your team
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload Resource
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Documents</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Datasets</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Database className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AI Models</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                  <p className="text-2xl font-bold">2.4K</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
            <TabsTrigger value="models">AI Models</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{doc.name}</h3>
                        <Badge variant="outline">{doc.type}</Badge>
                        <Badge className={
                          doc.permissions === "Private" ? "bg-red-100 text-red-800" :
                          doc.permissions === "Team Access" ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }>
                          {doc.permissions === "Private" ? <Lock className="h-3 w-3 mr-1" /> : 
                           doc.permissions === "Public" ? <Globe className="h-3 w-3 mr-1" /> : 
                           <User className="h-3 w-3 mr-1" />}
                          {doc.permissions}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>Size: {doc.size}</div>
                        <div>Downloads: {doc.downloads}</div>
                        <div>Author: {doc.author}</div>
                        <div>Modified: {doc.lastModified}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="datasets" className="space-y-4">
            {datasets.map((dataset) => (
              <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{dataset.name}</h3>
                      <p className="text-muted-foreground mb-4">{dataset.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                        <div>Size: {dataset.size}</div>
                        <div>Records: {dataset.records}</div>
                        <div>Provider: {dataset.provider}</div>
                        <div>Updated: {dataset.lastUpdated}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Usage</span>
                          <span className="text-sm text-muted-foreground">{dataset.usage}%</span>
                        </div>
                        <Progress value={dataset.usage} className="h-2" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Access Dataset</Button>
                      <Button size="sm">Download</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            {models.map((model) => (
              <Card key={model.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{model.name}</h3>
                        <Badge className={
                          model.status === "Active" ? "bg-green-100 text-green-800" :
                          model.status === "Testing" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }>
                          {model.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{model.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>Accuracy: {model.accuracy}</div>
                        <div>Usage: {model.usage} times</div>
                        <div>Creator: {model.creator}</div>
                        <div>Last Trained: {model.lastTrained}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button size="sm">Use Model</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}