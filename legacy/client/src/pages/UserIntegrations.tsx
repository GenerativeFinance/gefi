import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GitHubConnect from "@/components/integrations/GitHubConnect";
import { 
  Github, 
  MessageSquare, 
  Cloud, 
  Calendar,
  BarChart3,
  Shield,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Zap,
  Database,
  Mail
} from "lucide-react";

interface UserIntegration {
  id: string;
  name: string;
  description: string;
  icon: typeof Github;
  category: string;
  status: "connected" | "disconnected" | "error" | "pending";
  connectedAt?: string;
  lastSync?: string;
  permissions: string[];
  settings?: {
    autoSync?: boolean;
    notifications?: boolean;
  };
}

const userIntegrations: UserIntegration[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Version control and code collaboration platform",
    icon: Github,
    category: "Version Control",
    status: "disconnected",
    permissions: ["Repository access", "Branch management", "Pull request creation"],
    settings: {
      autoSync: true,
      notifications: true
    }
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team communication platform",
    icon: MessageSquare,
    category: "Communication",
    status: "connected",
    connectedAt: "2024-01-15",
    lastSync: "2024-01-20",
    permissions: ["Send messages", "Read channels", "File uploads"],
    settings: {
      autoSync: true,
      notifications: false
    }
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Cloud storage and document sharing",
    icon: Cloud,
    category: "Storage",
    status: "error",
    connectedAt: "2024-01-10",
    permissions: ["File access", "Folder creation", "Sharing permissions"],
    settings: {
      autoSync: false,
      notifications: true
    }
  },
  {
    id: "calendly",
    name: "Calendly",
    description: "Meeting scheduling platform",
    icon: Calendar,
    category: "Productivity",
    status: "pending",
    permissions: ["Calendar access", "Event creation", "Booking management"]
  }
];

export default function UserIntegrationsPage() {
  const [integrations, setIntegrations] = useState(userIntegrations);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleGitHubConnection = (connected: boolean) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === "github" 
        ? { 
            ...integration, 
            status: connected ? "connected" : "disconnected",
            connectedAt: connected ? new Date().toISOString().split('T')[0] : undefined,
            lastSync: connected ? new Date().toISOString().split('T')[0] : undefined
          }
        : integration
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-600 hover:bg-green-700 text-white">Connected</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Disconnected</Badge>;
    }
  };

  const categories = ["All", "Version Control", "Communication", "Storage", "Productivity"];
  
  const filteredIntegrations = integrations.filter(integration => 
    selectedCategory === "All" || integration.category === selectedCategory
  );

  const connectedCount = integrations.filter(i => i.status === "connected").length;
  const errorCount = integrations.filter(i => i.status === "error").length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Integrations</h1>
          <p className="text-muted-foreground">
            Manage your connected apps and services
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{connectedCount}</p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{integrations.length}</p>
                  <p className="text-sm text-muted-foreground">Total Integrations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{errorCount}</p>
                  <p className="text-sm text-muted-foreground">Need Attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory}>
            <div className="grid gap-6">
              {filteredIntegrations.map((integration) => {
                const Icon = integration.icon;
                
                return (
                  <Card key={integration.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(integration.status)}
                          {getStatusBadge(integration.status)}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        {/* Connection Info */}
                        {integration.connectedAt && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Connected:</span>
                            <span>{new Date(integration.connectedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {integration.lastSync && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Last sync:</span>
                            <span>{new Date(integration.lastSync).toLocaleDateString()}</span>
                          </div>
                        )}

                        <Separator />

                        {/* Permissions */}
                        <div>
                          <h4 className="font-medium text-sm mb-2">Permissions:</h4>
                          <div className="flex flex-wrap gap-2">
                            {integration.permissions.map((permission, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {integration.id === "github" ? (
                              <GitHubConnect 
                                variant="compact"
                                onConnectedChange={handleGitHubConnection}
                              />
                            ) : (
                              <Button 
                                variant={integration.status === "connected" ? "outline" : "default"}
                                size="sm"
                              >
                                {integration.status === "connected" ? "Reconnect" : "Connect"}
                              </Button>
                            )}
                            
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-1" />
                              Settings
                            </Button>
                          </div>

                          {integration.status === "error" && (
                            <Button variant="destructive" size="sm">
                              Fix Issue
                            </Button>
                          )}
                        </div>

                        {/* Settings Preview */}
                        {integration.settings && integration.status === "connected" && (
                          <>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              {integration.settings.autoSync !== undefined && (
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Auto Sync:</span>
                                  <Badge variant={integration.settings.autoSync ? "default" : "secondary"} 
                                    className={integration.settings.autoSync ? "bg-green-600 hover:bg-green-700 text-white" : ""}>
                                    {integration.settings.autoSync ? "On" : "Off"}
                                  </Badge>
                                </div>
                              )}
                              {integration.settings.notifications !== undefined && (
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Notifications:</span>
                                  <Badge variant={integration.settings.notifications ? "default" : "secondary"}
                                    className={integration.settings.notifications ? "bg-green-600 hover:bg-green-700 text-white" : ""}>
                                    {integration.settings.notifications ? "On" : "Off"}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No integrations in this category</h3>
            <p className="text-muted-foreground mb-4">
              Browse other categories or visit the marketplace to add new integrations
            </p>
            <Button>
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Marketplace
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}