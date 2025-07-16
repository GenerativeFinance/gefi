import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Eye,
  Share,
  Star,
  Calendar,
  Users,
  Code,
  Database,
  BookOpen,
  Video,
  FileCode,
  Image,
  Archive,
  Link,
  Globe,
  GitBranch,
  Folder,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Play,
  Book,
  Monitor,
  Cpu,
  HardDrive,
  Cloud,
  Shield,
  Key,
  Settings,
  Activity
} from "lucide-react";

export default function DeveloperCollaborationResources() {
  const documentLibrary = [
    {
      id: 1,
      name: "AI Model Development Guidelines",
      type: "PDF",
      size: "2.4 MB",
      description: "Comprehensive guidelines for developing AI financial models",
      category: "Documentation",
      tags: ["AI", "Guidelines", "Best Practices"],
      uploadedBy: "Tech Lead",
      uploadedDate: "July 10, 2025",
      downloads: 234,
      rating: 4.8,
      isPublic: true,
      lastModified: "July 15, 2025"
    },
    {
      id: 2,
      name: "API Documentation v3.2",
      type: "HTML",
      size: "1.8 MB",
      description: "Complete API documentation for trading platform integration",
      category: "API Reference",
      tags: ["API", "Trading", "Integration"],
      uploadedBy: "API Team",
      uploadedDate: "July 8, 2025",
      downloads: 456,
      rating: 4.9,
      isPublic: true,
      lastModified: "July 14, 2025"
    },
    {
      id: 3,
      name: "Data Schema Specifications",
      type: "JSON",
      size: "512 KB",
      description: "Database schema and data structure specifications",
      category: "Data",
      tags: ["Database", "Schema", "Data Structure"],
      uploadedBy: "Data Team",
      uploadedDate: "July 5, 2025",
      downloads: 123,
      rating: 4.6,
      isPublic: false,
      lastModified: "July 12, 2025"
    }
  ];

  const codeRepositories = [
    {
      id: 1,
      name: "trading-bot-core",
      description: "Core trading algorithm implementation with real-time processing",
      language: "Python",
      stars: 147,
      forks: 23,
      contributors: 8,
      lastCommit: "2 hours ago",
      isPrivate: false,
      size: "45.2 MB",
      branches: 12,
      tags: ["Trading", "AI", "Real-time"],
      license: "MIT"
    },
    {
      id: 2,
      name: "risk-assessment-models",
      description: "Collection of risk assessment and portfolio optimization models",
      language: "R",
      stars: 89,
      forks: 15,
      contributors: 5,
      lastCommit: "6 hours ago",
      isPrivate: false,
      size: "23.8 MB",
      branches: 8,
      tags: ["Risk", "Portfolio", "Statistics"],
      license: "Apache 2.0"
    },
    {
      id: 3,
      name: "data-pipeline-infrastructure",
      description: "Scalable data pipeline for real-time market data processing",
      language: "TypeScript",
      stars: 203,
      forks: 41,
      contributors: 12,
      lastCommit: "1 day ago",
      isPrivate: true,
      size: "67.3 MB",
      branches: 15,
      tags: ["Data", "Pipeline", "Infrastructure"],
      license: "Proprietary"
    }
  ];

  const computeResources = [
    {
      id: 1,
      name: "GPU Cluster A",
      type: "NVIDIA A100",
      specs: "8x A100 GPUs, 320GB HBM2",
      status: "available",
      utilization: 25,
      reservedBy: null,
      hourlyRate: "$12.50",
      location: "US-East",
      performance: "312 TFLOPS",
      memory: "320GB HBM2"
    },
    {
      id: 2,
      name: "High-Memory Server",
      type: "CPU Optimized",
      specs: "64 Core, 512GB RAM",
      status: "in-use",
      utilization: 87,
      reservedBy: "Sarah Chen",
      hourlyRate: "$4.80",
      location: "EU-West",
      performance: "2.5 GHz Base",
      memory: "512GB DDR4"
    },
    {
      id: 3,
      name: "ML Training Cluster",
      type: "Multi-GPU",
      specs: "16x V100 GPUs, 512GB",
      status: "maintenance",
      utilization: 0,
      reservedBy: null,
      hourlyRate: "$18.20",
      location: "Asia-Pacific",
      performance: "500 TFLOPS",
      memory: "512GB HBM2"
    }
  ];

  const learningResources = [
    {
      id: 1,
      title: "Advanced Financial ML Techniques",
      type: "Video Course",
      duration: "12 hours",
      instructor: "Dr. Elena Rodriguez",
      rating: 4.9,
      students: 1247,
      level: "Advanced",
      topics: ["Machine Learning", "Financial Markets", "Risk Assessment"],
      thumbnail: "/api/placeholder/200/120"
    },
    {
      id: 2,
      title: "Real-time Data Processing with Apache Kafka",
      type: "Workshop",
      duration: "4 hours",
      instructor: "Mike Johnson",
      rating: 4.7,
      students: 856,
      level: "Intermediate",
      topics: ["Data Streaming", "Apache Kafka", "Real-time Processing"],
      thumbnail: "/api/placeholder/200/120"
    },
    {
      id: 3,
      title: "Building Scalable Trading Systems",
      type: "Documentation",
      duration: "2 hours read",
      instructor: "Platform Team",
      rating: 4.8,
      students: 2341,
      level: "Intermediate",
      topics: ["System Design", "Trading", "Scalability"],
      thumbnail: "/api/placeholder/200/120"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in-use': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'html': return <Globe className="h-4 w-4" />;
      case 'json': return <FileCode className="h-4 w-4" />;
      case 'video course': return <Video className="h-4 w-4" />;
      case 'workshop': return <Users className="h-4 w-4" />;
      case 'documentation': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Collaboration Resources</h1>
            <p className="text-muted-foreground">
              Access shared documents, code repositories, compute resources, and learning materials
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload New Resource</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Resource Name</label>
                      <Input placeholder="Enter resource name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="documentation">Documentation</SelectItem>
                          <SelectItem value="code">Code</SelectItem>
                          <SelectItem value="data">Data</SelectItem>
                          <SelectItem value="api">API Reference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Resource description" rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Tags</label>
                      <Input placeholder="Add tags (comma separated)" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="public" />
                      <label htmlFor="public" className="text-sm">Make publicly accessible</label>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop your file here
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Upload Resource</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Access
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Documents</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Repositories</p>
                  <p className="text-2xl font-bold">18</p>
                </div>
                <GitBranch className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compute Hours</p>
                  <p className="text-2xl font-bold">1,429</p>
                </div>
                <Cpu className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Learning Hours</p>
                  <p className="text-2xl font-bold">342</p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="code">Code Repos</TabsTrigger>
            <TabsTrigger value="compute">Compute</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search documents..." className="pl-10" />
                  </div>
                  <div className="flex gap-3">
                    <Select>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="documentation">Documentation</SelectItem>
                        <SelectItem value="api">API Reference</SelectItem>
                        <SelectItem value="data">Data</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {documentLibrary.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getTypeIcon(doc.type)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{doc.name}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{doc.type}</span>
                            <span>{doc.size}</span>
                            <Badge variant="outline">{doc.category}</Badge>
                            {doc.isPublic ? (
                              <Badge className="bg-green-100 text-green-800">Public</Badge>
                            ) : (
                              <Badge className="bg-orange-100 text-orange-800">Private</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{doc.rating}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{doc.description}</p>

                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>By {doc.uploadedBy}</span>
                          <span>{doc.uploadedDate}</span>
                        </div>
                        <span>{doc.downloads} downloads</span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            {/* Code Repositories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {codeRepositories.map((repo) => (
                <Card key={repo.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <GitBranch className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{repo.name}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{repo.language}</span>
                            <span>{repo.size}</span>
                            <Badge variant="outline">{repo.license}</Badge>
                            {repo.isPrivate ? (
                              <Badge className="bg-red-100 text-red-800">Private</Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800">Public</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        <span className="text-sm">{repo.stars}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{repo.description}</p>

                      <div className="flex flex-wrap gap-1">
                        {repo.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-2 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold">{repo.stars}</p>
                          <p className="text-xs text-muted-foreground">Stars</p>
                        </div>
                        <div className="p-2 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold">{repo.forks}</p>
                          <p className="text-xs text-muted-foreground">Forks</p>
                        </div>
                        <div className="p-2 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold">{repo.contributors}</p>
                          <p className="text-xs text-muted-foreground">Contributors</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{repo.branches} branches</span>
                        <span>Last commit: {repo.lastCommit}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View Code
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <GitBranch className="h-4 w-4 mr-2" />
                          Clone
                        </Button>
                        <Button className="flex-1">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Repo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compute" className="space-y-6">
            {/* Compute Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {computeResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Cpu className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{resource.name}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{resource.type}</span>
                            <span>{resource.location}</span>
                            <Badge className={getStatusColor(resource.status)}>
                              {resource.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{resource.hourlyRate}/hr</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{resource.specs}</p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium">Performance</p>
                          <p className="text-lg font-bold">{resource.performance}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium">Memory</p>
                          <p className="text-lg font-bold">{resource.memory}</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Utilization</span>
                          <span className="text-sm text-muted-foreground">{resource.utilization}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${resource.utilization}%` }}
                          ></div>
                        </div>
                      </div>

                      {resource.reservedBy && (
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800">
                            Reserved by {resource.reservedBy}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {resource.status === 'available' ? (
                          <Button className="flex-1">
                            <Play className="h-4 w-4 mr-2" />
                            Reserve Now
                          </Button>
                        ) : (
                          <Button variant="outline" className="flex-1" disabled>
                            <Clock className="h-4 w-4 mr-2" />
                            {resource.status === 'in-use' ? 'In Use' : 'Maintenance'}
                          </Button>
                        )}
                        <Button variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            {/* Learning Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {learningResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        {getTypeIcon(resource.type)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{resource.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{resource.type}</span>
                          <span>{resource.duration}</span>
                          <Badge variant="outline">{resource.level}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{resource.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({resource.students} students)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Instructor: {resource.instructor}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {resource.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Play className="h-4 w-4 mr-2" />
                          Start Learning
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}