import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Server,
  Plus,
  Settings,
  Trash2,
  Activity,
  Cloud,
  Database,
  Cpu,
  HardDrive,
  Network,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Zap,
  Monitor,
  Play,
  Square,
  RotateCcw,
  Eye,
  ExternalLink,
  Upload,
  Download
} from "lucide-react";

interface ServerFormData {
  name: string;
  provider: string;
  region: string;
  instanceType: string;
  configuration: {
    cpu: number;
    memory: number;
    storage: number;
    networkSpeed: string;
    operatingSystem: string;
  };
}

export default function ServerManagement() {
  const { toast } = useToast();
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [isDeploymentOpen, setIsDeploymentOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("servers");
  const [serverForm, setServerForm] = useState<ServerFormData>({
    name: "",
    provider: "",
    region: "",
    instanceType: "",
    configuration: {
      cpu: 2,
      memory: 4,
      storage: 50,
      networkSpeed: "1 Gbps",
      operatingSystem: "Ubuntu 22.04"
    }
  });

  // Fetch servers
  const { data: servers = [], isLoading: serversLoading } = useQuery({
    queryKey: ["/api/servers"]
  });

  // Fetch deployments
  const { data: deployments = [], isLoading: deploymentsLoading } = useQuery({
    queryKey: ["/api/server-deployments"]
  });

  // Fetch FL nodes
  const { data: flNodes = [], isLoading: nodesLoading } = useQuery({
    queryKey: ["/api/federated-learning-nodes"]
  });

  // Fetch cloud providers
  const { data: cloudProviders = [], isLoading: providersLoading } = useQuery({
    queryKey: ["/api/cloud-providers"]
  });

  // Create server mutation
  const createServerMutation = useMutation({
    mutationFn: async (serverData: any) => {
      return apiRequest("POST", "/api/servers", serverData);
    },
    onSuccess: () => {
      toast({
        title: "Server Created",
        description: "Server infrastructure has been provisioned successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/servers"] });
      setIsCreateServerOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create server",
        variant: "destructive",
      });
    },
  });

  // Deploy FL node mutation
  const deployNodeMutation = useMutation({
    mutationFn: async (nodeData: any) => {
      return apiRequest("POST", "/api/federated-learning-nodes", nodeData);
    },
    onSuccess: () => {
      toast({
        title: "FL Node Deployed",
        description: "Federated learning node has been deployed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/federated-learning-nodes"] });
      setIsDeploymentOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to deploy FL node",
        variant: "destructive",
      });
    },
  });

  // Server action mutations
  const serverActionMutation = useMutation({
    mutationFn: async ({ serverId, action }: { serverId: string; action: string }) => {
      return apiRequest("POST", `/api/servers/${serverId}/actions`, { action });
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Server Action",
        description: `Server ${variables.action} completed successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/servers"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Server action failed",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setServerForm({
      name: "",
      provider: "",
      region: "",
      instanceType: "",
      configuration: {
        cpu: 2,
        memory: 4,
        storage: 50,
        networkSpeed: "1 Gbps",
        operatingSystem: "Ubuntu 22.04"
      }
    });
  };

  const handleCreateServer = () => {
    if (!serverForm.name || !serverForm.provider || !serverForm.region || !serverForm.instanceType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createServerMutation.mutate(serverForm);
  };

  const handleServerAction = (serverId: string, action: string) => {
    serverActionMutation.mutate({ serverId, action });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "stopped":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "provisioning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "aws":
        return "🟠"; // AWS orange
      case "azure":
        return "🔵"; // Azure blue
      case "gcp":
        return "🔴"; // GCP red
      case "local":
        return "🖥️"; // Local server
      default:
        return "☁️"; // Generic cloud
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (serversLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Server className="h-8 w-8 text-primary" />
              Server Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Deploy and manage cloud infrastructure for federated learning nodes
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreateServerOpen} onOpenChange={setIsCreateServerOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Server
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Deploy New Server</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="server-name">Server Name</Label>
                      <Input
                        id="server-name"
                        value={serverForm.name}
                        onChange={(e) => setServerForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., FL-Node-Production"
                      />
                    </div>
                    <div>
                      <Label htmlFor="provider">Cloud Provider</Label>
                      <Select value={serverForm.provider} onValueChange={(value) => 
                        setServerForm(prev => ({ ...prev, provider: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aws">🟠 Amazon Web Services</SelectItem>
                          <SelectItem value="azure">🔵 Microsoft Azure</SelectItem>
                          <SelectItem value="gcp">🔴 Google Cloud Platform</SelectItem>
                          <SelectItem value="local">🖥️ Local Infrastructure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="region">Region</Label>
                      <Select value={serverForm.region} onValueChange={(value) => 
                        setServerForm(prev => ({ ...prev, region: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                          <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                          <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                          <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="instance-type">Instance Type</Label>
                      <Select value={serverForm.instanceType} onValueChange={(value) => 
                        setServerForm(prev => ({ ...prev, instanceType: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select instance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="t3.medium">t3.medium (2 vCPU, 4 GB RAM)</SelectItem>
                          <SelectItem value="t3.large">t3.large (2 vCPU, 8 GB RAM)</SelectItem>
                          <SelectItem value="m5.large">m5.large (2 vCPU, 8 GB RAM)</SelectItem>
                          <SelectItem value="m5.xlarge">m5.xlarge (4 vCPU, 16 GB RAM)</SelectItem>
                          <SelectItem value="c5.xlarge">c5.xlarge (4 vCPU, 8 GB RAM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="cpu">CPU Cores</Label>
                      <Input
                        id="cpu"
                        type="number"
                        value={serverForm.configuration.cpu}
                        onChange={(e) => setServerForm(prev => ({
                          ...prev,
                          configuration: { ...prev.configuration, cpu: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="memory">Memory (GB)</Label>
                      <Input
                        id="memory"
                        type="number"
                        value={serverForm.configuration.memory}
                        onChange={(e) => setServerForm(prev => ({
                          ...prev,
                          configuration: { ...prev.configuration, memory: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="storage">Storage (GB)</Label>
                      <Input
                        id="storage"
                        type="number"
                        value={serverForm.configuration.storage}
                        onChange={(e) => setServerForm(prev => ({
                          ...prev,
                          configuration: { ...prev.configuration, storage: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreateServer} 
                    disabled={createServerMutation.isPending}
                    className="w-full"
                  >
                    {createServerMutation.isPending ? "Provisioning..." : "Deploy Server"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="servers">Servers</TabsTrigger>
            <TabsTrigger value="deployments">Deployments</TabsTrigger>
            <TabsTrigger value="nodes">FL Nodes</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          {/* Servers Tab */}
          <TabsContent value="servers" className="space-y-6">
            {servers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Server className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No servers deployed</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Deploy your first server to start running federated learning nodes
                  </p>
                  <Button onClick={() => setIsCreateServerOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Server
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {servers.map((server: any) => (
                  <Card key={server.id} className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getProviderIcon(server.provider)}</span>
                          <CardTitle className="text-lg">{server.name}</CardTitle>
                        </div>
                        <Badge className={getStatusColor(server.status)}>
                          {server.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Provider</Label>
                          <p className="text-sm text-muted-foreground">{server.provider.toUpperCase()}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Region</Label>
                          <p className="text-sm text-muted-foreground">{server.region}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Instance Type</Label>
                          <p className="text-sm text-muted-foreground">{server.instanceType}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Cost/Hour</Label>
                          <p className="text-sm text-green-600 font-medium">
                            {formatCurrency(server.costPerHour || 0)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <Cpu className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                          <p className="text-xs text-muted-foreground">CPU</p>
                          <p className="text-sm font-medium">{server.configuration?.cpu || 2}</p>
                        </div>
                        <div className="text-center">
                          <Database className="h-4 w-4 mx-auto mb-1 text-green-600" />
                          <p className="text-xs text-muted-foreground">Memory</p>
                          <p className="text-sm font-medium">{server.configuration?.memory || 4}GB</p>
                        </div>
                        <div className="text-center">
                          <HardDrive className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                          <p className="text-xs text-muted-foreground">Storage</p>
                          <p className="text-sm font-medium">{server.configuration?.storage || 50}GB</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t">
                        {server.status === "running" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleServerAction(server.id, "stop")}
                            disabled={serverActionMutation.isPending}
                          >
                            <Square className="h-4 w-4 mr-1" />
                            Stop
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleServerAction(server.id, "start")}
                            disabled={serverActionMutation.isPending}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleServerAction(server.id, "restart")}
                          disabled={serverActionMutation.isPending}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Restart
                        </Button>
                        <Button size="sm" variant="outline">
                          <Monitor className="h-4 w-4 mr-1" />
                          Monitor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Deployments Tab */}
          <TabsContent value="deployments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Server Deployments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Cloud className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Deployment management coming soon</h3>
                  <p className="text-muted-foreground">
                    Advanced deployment orchestration and container management
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FL Nodes Tab */}
          <TabsContent value="nodes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Federated Learning Nodes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">FL network management coming soon</h3>
                  <p className="text-muted-foreground">
                    Deploy and manage federated learning nodes across your infrastructure
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Monitoring dashboard coming soon</h3>
                  <p className="text-muted-foreground">
                    Real-time metrics, alerts, and performance monitoring
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}