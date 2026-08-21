import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  PlugZap,
  Settings,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  RefreshCw,
  Shield,
  Activity,
  Zap,
  Database,
  Cloud,
  MessageCircle,
  Briefcase,
  Bot
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Integration {
  id: number;
  name: string;
  category: string;
  status: "Connected" | "Error" | "Disabled" | "Connecting";
  description: string;
  icon: string;
  lastSync: string;
  settings: {
    apiKey?: string;
    webhook?: string;
    permissions?: string[];
  };
  usageStats: {
    requests: number;
    dataTransferred: string;
    uptime: string;
  };
}

const mockIntegrations: Integration[] = [
  {
    id: 1,
    name: "Slack",
    category: "Messaging",
    status: "Connected",
    description: "Team communication and notifications for portfolio updates and AI model alerts.",
    icon: "💬",
    lastSync: "2 minutes ago",
    settings: {
      webhook: "https://hooks.slack.com/services/...",
      permissions: ["Send messages", "Read channels", "Post notifications"]
    },
    usageStats: {
      requests: 1247,
      dataTransferred: "2.4 MB",
      uptime: "99.9%"
    }
  },
  {
    id: 2,
    name: "AWS",
    category: "Cloud Services", 
    status: "Error",
    description: "Cloud computing and machine learning services for AI model training and deployment.",
    icon: "☁️",
    lastSync: "1 hour ago",
    settings: {
      apiKey: "AKIA***************",
      permissions: ["S3 access", "SageMaker", "Lambda functions"]
    },
    usageStats: {
      requests: 892,
      dataTransferred: "15.7 GB",
      uptime: "98.2%"
    }
  },
  {
    id: 3,
    name: "Trello",
    category: "Project Management",
    status: "Connected",
    description: "Project management and task tracking for AI model development workflows.",
    icon: "🏷️",
    lastSync: "5 minutes ago",
    settings: {
      apiKey: "9a8b***************",
      permissions: ["Read boards", "Create cards", "Update lists"]
    },
    usageStats: {
      requests: 324,
      dataTransferred: "1.2 MB",
      uptime: "99.7%"
    }
  },
  {
    id: 4,
    name: "Alpha Vantage API",
    category: "AI Tools",
    status: "Disabled",
    description: "Real-time market data and financial indicators for AI model training.",
    icon: "📈",
    lastSync: "Yesterday",
    settings: {
      apiKey: "DEMO***************",
      permissions: ["Real-time quotes", "Historical data", "Technical indicators"]
    },
    usageStats: {
      requests: 15678,
      dataTransferred: "45.2 MB",
      uptime: "99.5%"
    }
  },
  {
    id: 5,
    name: "Google Cloud",
    category: "Cloud Services",
    status: "Connecting",
    description: "Machine learning and data analytics services for advanced financial modeling.",
    icon: "🌐",
    lastSync: "Connecting...",
    settings: {
      apiKey: "AIza***************",
      permissions: ["AutoML access", "BigQuery", "Compute Engine"]
    },
    usageStats: {
      requests: 0,
      dataTransferred: "0 MB",
      uptime: "N/A"
    }
  }
];

export default function Integrations() {
  const [integrations, setIntegrations] = useState(mockIntegrations);

  const handleToggle = (id: number) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            status: integration.status === "Connected" || integration.status === "Error" ? "Disabled" : "Connected"
          }
        : integration
    ));
  };

  const handleRefresh = (id: number) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            status: "Connecting",
            lastSync: "Refreshing..."
          }
        : integration
    ));

    // Simulate refresh completion
    setTimeout(() => {
      setIntegrations(prev => prev.map(integration => 
        integration.id === id 
          ? { 
              ...integration, 
              status: "Connected",
              lastSync: "Just now"
            }
          : integration
      ));
    }, 2000);
  };

  const handleUninstall = (id: number) => {
    setIntegrations(integrations.filter(integration => integration.id !== id));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "Disabled":
        return <Clock className="h-4 w-4 text-gray-500" />;
      case "Connecting":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Connected":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Error":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Disabled":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "Connecting":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Project Management": return <Briefcase className="h-4 w-4" />;
      case "Messaging": return <MessageCircle className="h-4 w-4" />;
      case "Cloud Services": return <Cloud className="h-4 w-4" />;
      case "AI Tools": return <Bot className="h-4 w-4" />;
      default: return <PlugZap className="h-4 w-4" />;
    }
  };

  const connectedCount = integrations.filter(i => i.status === "Connected").length;
  const errorCount = integrations.filter(i => i.status === "Error").length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <PlugZap className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Integrations</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your connected apps and services. Monitor status, configure settings, and control data flow.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{integrations.length}</div>
              <div className="text-sm text-muted-foreground">Total Integrations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{connectedCount}</div>
              <div className="text-sm text-muted-foreground">Connected</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{errorCount}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">
                {integrations.reduce((acc, i) => acc + i.usageStats.requests, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Requests</div>
            </CardContent>
          </Card>
        </div>

        {/* Integrations List */}
        <div className="space-y-4">
          {integrations.map((integration) => (
            <Card key={integration.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* App Icon & Basic Info */}
                    <div className="text-3xl">{integration.icon}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{integration.name}</h3>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getCategoryIcon(integration.category)}
                          {integration.category}
                        </Badge>
                        <Badge className={getStatusColor(integration.status)}>
                          {getStatusIcon(integration.status)}
                          {integration.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Last sync: {integration.lastSync}
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={integration.status === "Connected"}
                      onCheckedChange={() => handleToggle(integration.id)}
                      disabled={integration.status === "Connecting"}
                    />
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <span className="text-2xl">{integration.icon}</span>
                            {integration.name} Settings
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Connection Status */}
                          <div className="space-y-2">
                            <h4 className="font-medium">Connection Status</h4>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(integration.status)}
                              <span className="text-sm">{integration.status}</span>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleRefresh(integration.id)}
                                disabled={integration.status === "Connecting"}
                              >
                                <RefreshCw className={`h-4 w-4 ${integration.status === "Connecting" ? "animate-spin" : ""}`} />
                                Refresh
                              </Button>
                            </div>
                          </div>

                          <Separator />

                          {/* Usage Statistics */}
                          <div className="space-y-4">
                            <h4 className="font-medium">Usage Statistics</h4>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center space-y-1">
                                <div className="text-2xl font-bold text-primary">{integration.usageStats.requests.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">API Requests</div>
                              </div>
                              <div className="text-center space-y-1">
                                <div className="text-2xl font-bold text-blue-500">{integration.usageStats.dataTransferred}</div>
                                <div className="text-xs text-muted-foreground">Data Transferred</div>
                              </div>
                              <div className="text-center space-y-1">
                                <div className="text-2xl font-bold text-green-500">{integration.usageStats.uptime}</div>
                                <div className="text-xs text-muted-foreground">Uptime</div>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Settings */}
                          <div className="space-y-4">
                            <h4 className="font-medium">Configuration</h4>
                            {integration.settings.apiKey && (
                              <div className="space-y-1">
                                <label className="text-sm font-medium">API Key</label>
                                <div className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                                  {integration.settings.apiKey}
                                </div>
                              </div>
                            )}
                            {integration.settings.webhook && (
                              <div className="space-y-1">
                                <label className="text-sm font-medium">Webhook URL</label>
                                <div className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                                  {integration.settings.webhook}
                                </div>
                              </div>
                            )}
                            {integration.settings.permissions && (
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Permissions</label>
                                <div className="flex flex-wrap gap-1">
                                  {integration.settings.permissions.map((permission, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      <Shield className="h-3 w-3 mr-1" />
                                      {permission}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRefresh(integration.id)}
                      disabled={integration.status === "Connecting"}
                    >
                      <RefreshCw className={`h-4 w-4 ${integration.status === "Connecting" ? "animate-spin" : ""}`} />
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleUninstall(integration.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {integrations.length === 0 && (
          <div className="text-center py-12">
            <PlugZap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No integrations installed</h3>
            <p className="text-muted-foreground mb-4">
              Get started by installing apps from the marketplace to enhance your workflow.
            </p>
            <Button asChild>
              <a href="/app-marketplace">
                <ExternalLink className="mr-2 h-4 w-4" />
                Browse App Marketplace
              </a>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}