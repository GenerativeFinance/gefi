import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GitHubConnect from "@/components/integrations/GitHubConnect";
import { 
  Github, 
  Search, 
  Database, 
  Cloud, 
  MessageSquare, 
  Calendar,
  BarChart3,
  Shield,
  CreditCard,
  Mail,
  Zap,
  Star,
  Users,
  Code,
  GitBranch
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: typeof Github;
  category: string;
  price: "Free" | "Premium" | "Enterprise";
  rating: number;
  installs: string;
  features: string[];
  connected?: boolean;
}

const integrations: Integration[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Connect your GitHub repositories for version control, code collaboration, and automated workflows",
    icon: Github,
    category: "Version Control",
    price: "Free",
    rating: 4.9,
    installs: "10M+",
    features: [
      "Repository management",
      "Branch and pull request tracking", 
      "Code collaboration",
      "Automated workflows",
      "Issue tracking"
    ],
    connected: false
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team communication and collaboration platform integration",
    icon: MessageSquare,
    category: "Communication",
    price: "Free",
    rating: 4.7,
    installs: "5M+",
    features: [
      "Team messaging",
      "Channel notifications",
      "File sharing",
      "Workflow automation"
    ]
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Cloud storage and document collaboration",
    icon: Cloud,
    category: "Storage",
    price: "Free",
    rating: 4.6,
    installs: "8M+",
    features: [
      "File storage",
      "Document sharing",
      "Real-time collaboration",
      "Version history"
    ]
  },
  {
    id: "calendly",
    name: "Calendly",
    description: "Schedule meetings and appointments seamlessly",
    icon: Calendar,
    category: "Productivity",
    price: "Premium",
    rating: 4.8,
    installs: "2M+",
    features: [
      "Meeting scheduling",
      "Calendar integration",
      "Automated reminders",
      "Booking pages"
    ]
  },
  {
    id: "datadog",
    name: "Datadog",
    description: "Monitoring and analytics platform for applications and infrastructure",
    icon: BarChart3,
    category: "Analytics",
    price: "Enterprise",
    rating: 4.5,
    installs: "500K+",
    features: [
      "Application monitoring",
      "Infrastructure metrics",
      "Log management",
      "Alert management"
    ]
  },
  {
    id: "okta",
    name: "Okta",
    description: "Identity and access management platform",
    icon: Shield,
    category: "Security",
    price: "Enterprise",
    rating: 4.4,
    installs: "300K+",
    features: [
      "Single sign-on",
      "Multi-factor authentication",
      "User management",
      "API access management"
    ]
  }
];

const categories = [
  "All",
  "Version Control", 
  "Communication",
  "Storage",
  "Productivity",
  "Analytics",
  "Security"
];

export default function IntegrationsMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [connectedIntegrations, setConnectedIntegrations] = useState<Record<string, boolean>>({});

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGitHubConnection = (connected: boolean) => {
    setConnectedIntegrations(prev => ({ ...prev, github: connected }));
  };

  const renderIntegrationCard = (integration: Integration) => {
    const Icon = integration.icon;
    const isConnected = connectedIntegrations[integration.id] || integration.connected;

    return (
      <Card key={integration.id} className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{integration.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={
                    integration.price === "Free" ? "secondary" :
                    integration.price === "Premium" ? "default" : "destructive"
                  }>
                    {integration.price}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">{integration.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{integration.installs}</span>
                  </div>
                </div>
              </div>
            </div>
            {isConnected && (
              <Badge className="bg-green-600 hover:bg-green-700 text-white">Connected</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {integration.description}
          </p>
          
          <div className="space-y-3 mb-4">
            <h4 className="font-medium text-sm">Key Features:</h4>
            <ul className="space-y-1">
              {integration.features.map((feature, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {integration.id === "github" ? (
            <GitHubConnect 
              variant="compact" 
              onConnectedChange={handleGitHubConnection}
            />
          ) : (
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                variant={isConnected ? "outline" : "default"}
                disabled={isConnected}
              >
                {isConnected ? "Connected" : "Install"}
              </Button>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">App Marketplace</h1>
        <p className="text-muted-foreground">
          Discover and install integrations to enhance your GeFi experience
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map(renderIntegrationCard)}
          </div>
          
          {filteredIntegrations.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or browse different categories
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}