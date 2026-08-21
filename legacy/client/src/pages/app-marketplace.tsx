import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter,
  Grid3x3,
  MessageCircle,
  Briefcase,
  Cloud,
  Bot,
  CheckCircle,
  Star,
  Download,
  Users,
  Zap,
  Shield,
  Database,
  TrendingUp,
  Activity
} from "lucide-react";

interface App {
  id: number;
  name: string;
  category: string;
  description: string;
  icon: string;
  rating: number;
  installs: string;
  price: string;
  developer: string;
  features: string[];
  isInstalled?: boolean;
}

const mockApps: App[] = [
  // Project Management
  {
    id: 1,
    name: "Trello",
    category: "Project Management",
    description: "Organize your projects with boards, lists, and cards for seamless AI model development workflow.",
    icon: "🏷️",
    rating: 4.8,
    installs: "50M+",
    price: "Free",
    developer: "Atlassian",
    features: ["Kanban boards", "Team collaboration", "Due dates", "Attachments"]
  },
  {
    id: 2,
    name: "Asana",
    category: "Project Management",
    description: "Powerful project management for AI teams. Track tasks, manage timelines, and collaborate effectively.",
    icon: "📋",
    rating: 4.6,
    installs: "100M+",
    price: "Free",
    developer: "Asana Inc.",
    features: ["Task management", "Timeline view", "Custom fields", "Reporting"]
  },
  {
    id: 3,
    name: "Jira",
    category: "Project Management",
    description: "Advanced project tracking and agile development tools for complex AI financial model projects.",
    icon: "🔧",
    rating: 4.4,
    installs: "25M+",
    price: "$7/month",
    developer: "Atlassian",
    features: ["Agile boards", "Issue tracking", "Advanced reporting", "Integrations"]
  },
  
  // Messaging
  {
    id: 4,
    name: "Slack",
    category: "Messaging",
    description: "Team communication platform with channels, direct messaging, and AI bot integrations.",
    icon: "💬",
    rating: 4.7,
    installs: "12M+",
    price: "Free",
    developer: "Slack Technologies",
    features: ["Channels", "Direct messaging", "File sharing", "App integrations"]
  },
  {
    id: 5,
    name: "Discord",
    category: "Messaging",
    description: "Voice, video, and text communication for development teams and AI model communities.",
    icon: "🎮",
    rating: 4.5,
    installs: "350M+",
    price: "Free",
    developer: "Discord Inc.",
    features: ["Voice channels", "Screen sharing", "Bots", "Community servers"]
  },
  {
    id: 6,
    name: "Microsoft Teams",
    category: "Messaging",
    description: "Enterprise communication and collaboration hub integrated with Office 365.",
    icon: "🏢",
    rating: 4.3,
    installs: "250M+",
    price: "$4/month",
    developer: "Microsoft",
    features: ["Video conferencing", "File collaboration", "App integration", "Enterprise security"]
  },

  // Cloud Services
  {
    id: 7,
    name: "AWS",
    category: "Cloud Services",
    description: "Amazon Web Services cloud computing platform with AI/ML services for financial modeling.",
    icon: "☁️",
    rating: 4.6,
    installs: "1M+",
    price: "Pay-as-you-go",
    developer: "Amazon",
    features: ["EC2 compute", "S3 storage", "SageMaker ML", "Lambda functions"]
  },
  {
    id: 8,
    name: "Google Cloud",
    category: "Cloud Services",
    description: "Google Cloud Platform with AutoML and AI services for financial data processing.",
    icon: "🌐",
    rating: 4.5,
    installs: "500K+",
    price: "Pay-as-you-go",
    developer: "Google",
    features: ["Compute Engine", "BigQuery", "AutoML", "AI Platform"]
  },
  {
    id: 9,
    name: "Microsoft Azure",
    category: "Cloud Services",
    description: "Enterprise cloud services with cognitive services and machine learning capabilities.",
    icon: "🔷",
    rating: 4.4,
    installs: "750K+",
    price: "Pay-as-you-go",
    developer: "Microsoft",
    features: ["Virtual machines", "Cognitive services", "Machine learning", "Data analytics"]
  },

  // AI/Finance Tools
  {
    id: 10,
    name: "TensorFlow",
    category: "AI Tools",
    description: "Open-source machine learning framework for building advanced financial prediction models.",
    icon: "🧠",
    rating: 4.8,
    installs: "180M+",
    price: "Free",
    developer: "Google",
    features: ["Neural networks", "Model training", "TensorBoard", "Production deployment"]
  },
  {
    id: 11,
    name: "Alpha Vantage API",
    category: "AI Tools",
    description: "Real-time and historical market data API for financial analysis and algorithmic trading.",
    icon: "📈",
    rating: 4.6,
    installs: "50K+",
    price: "$49.99/month",
    developer: "Alpha Vantage",
    features: ["Real-time data", "Historical data", "Technical indicators", "Forex data"]
  },
  {
    id: 12,
    name: "PyTorch",
    category: "AI Tools",
    description: "Dynamic neural network framework perfect for research and development of financial AI models.",
    icon: "🔥",
    rating: 4.7,
    installs: "45M+",
    price: "Free",
    developer: "Meta",
    features: ["Dynamic graphs", "Research-friendly", "Production ready", "Distributed training"]
  }
];

export default function AppMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [installedApps, setInstalledApps] = useState<number[]>([]);

  const categories = ["All", "Project Management", "Messaging", "Cloud Services", "AI Tools"];

  const filteredApps = mockApps.filter(app => {
    const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInstall = (appId: number) => {
    if (!installedApps.includes(appId)) {
      setInstalledApps([...installedApps, appId]);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Project Management": return <Briefcase className="h-4 w-4" />;
      case "Messaging": return <MessageCircle className="h-4 w-4" />;
      case "Cloud Services": return <Cloud className="h-4 w-4" />;
      case "AI Tools": return <Bot className="h-4 w-4" />;
      default: return <Grid3x3 className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Grid3x3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">App Marketplace</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover and integrate powerful external tools to enhance your AI financial modeling workflow. 
            Connect with project management, cloud services, messaging platforms, and specialized AI tools.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-auto">
            <TabsList className="grid grid-cols-5 lg:w-[600px]">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{mockApps.length}</div>
              <div className="text-sm text-muted-foreground">Total Apps</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{installedApps.length}</div>
              <div className="text-sm text-muted-foreground">Installed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">4</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">
                {mockApps.filter(app => app.price === "Free").length}
              </div>
              <div className="text-sm text-muted-foreground">Free Apps</div>
            </CardContent>
          </Card>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{app.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{app.developer}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getCategoryIcon(app.category)}
                    {app.category}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {app.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {app.installs}
                  </div>
                  <div className="font-medium text-foreground">{app.price}</div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {app.description}
                </p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Key Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {app.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleInstall(app.id)}
                  className="w-full"
                  variant={installedApps.includes(app.id) ? "outline" : "default"}
                  disabled={installedApps.includes(app.id)}
                >
                  {installedApps.includes(app.id) ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Installed
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Install
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <Grid3x3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No apps found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or category filter to find the apps you're looking for.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}