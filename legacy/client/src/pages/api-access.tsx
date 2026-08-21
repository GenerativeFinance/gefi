import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Trash2, 
  Plus, 
  Activity,
  BarChart3,
  Clock,
  Shield,
  Globe,
  Code,
  Book,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";

export default function ApiAccess() {
  const [showApiKey, setShowApiKey] = useState(false);
  
  const apiKeys = [
    {
      id: 1,
      name: "Production API Key",
      key: "gf_prod_sk_1234567890abcdef",
      created: "2024-11-15",
      lastUsed: "2 hours ago",
      usage: 45670,
      limit: 100000,
      status: "Active",
      permissions: ["read", "write", "admin"]
    },
    {
      id: 2,
      name: "Development API Key", 
      key: "gf_dev_sk_abcdef1234567890",
      created: "2024-12-01",
      lastUsed: "1 day ago",
      usage: 1250,
      limit: 10000,
      status: "Active",
      permissions: ["read", "write"]
    },
    {
      id: 3,
      name: "Testing API Key",
      key: "gf_test_sk_9876543210fedcba",
      created: "2024-11-20",
      lastUsed: "1 week ago",
      usage: 890,
      limit: 5000,
      status: "Limited",
      permissions: ["read"]
    }
  ];

  const apiUsage = {
    totalRequests: 47810,
    successRate: 99.7,
    avgResponseTime: 245, // ms
    errorRate: 0.3
  };

  const recentApiCalls = [
    {
      endpoint: "/api/models/predict",
      method: "POST",
      status: 200,
      responseTime: "234ms",
      timestamp: "2 min ago"
    },
    {
      endpoint: "/api/portfolio/optimize",
      method: "POST", 
      status: 200,
      responseTime: "456ms",
      timestamp: "5 min ago"
    },
    {
      endpoint: "/api/market/sentiment",
      method: "GET",
      status: 200,
      responseTime: "123ms",
      timestamp: "8 min ago"
    },
    {
      endpoint: "/api/risk/assessment",
      method: "POST",
      status: 429,
      responseTime: "12ms",
      timestamp: "12 min ago"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">API Access Management</h1>
            <p className="text-muted-foreground">
              Manage your API keys, monitor usage, and access documentation
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create API Key
          </Button>
        </div>

        <Tabs defaultValue="keys" className="space-y-6">
          <TabsList>
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="usage">Usage & Analytics</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="keys">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* API Keys List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage your API authentication keys</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {apiKeys.map((key) => (
                        <div key={key.id} className="p-4 border rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{key.name}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <code className="text-sm bg-muted px-2 py-1 rounded">
                                  {showApiKey ? key.key : key.key.replace(/./g, '•').slice(0, 20) + '...'}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setShowApiKey(!showApiKey)}
                                >
                                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(key.key)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={key.status === "Active" ? "default" : "secondary"}>
                                {key.status}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Created:</span> {key.created}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Last used:</span> {key.lastUsed}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Usage:</span> {key.usage.toLocaleString()} / {key.limit.toLocaleString()}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Permissions:</span> {key.permissions.join(", ")}
                            </div>
                          </div>
                          
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${(key.usage / key.limit) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>API Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Requests</span>
                        <span className="font-semibold">{apiUsage.totalRequests.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Success Rate</span>
                        <span className="font-semibold text-green-600">{apiUsage.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Response Time</span>
                        <span className="font-semibold">{apiUsage.avgResponseTime}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Error Rate</span>
                        <span className="font-semibold text-red-600">{apiUsage.errorRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Rate Limits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Requests per minute</span>
                        <span className="font-semibold">1,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Requests per hour</span>
                        <span className="font-semibold">10,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Monthly limit</span>
                        <span className="font-semibold">1,000,000</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Shield className="h-4 w-4 mr-1" />
                        Upgrade Limits
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">IP Whitelist</span>
                        <Badge variant="secondary">Disabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">HTTPS Only</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Key Rotation</span>
                        <span className="text-sm text-muted-foreground">Manual</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Shield className="h-4 w-4 mr-1" />
                        Security Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usage">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Usage Charts */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>API Usage Analytics</CardTitle>
                    <CardDescription>Monitor your API consumption and performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{apiUsage.totalRequests.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total Requests</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{apiUsage.successRate}%</div>
                        <div className="text-sm text-muted-foreground">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{apiUsage.avgResponseTime}ms</div>
                        <div className="text-sm text-muted-foreground">Avg Response</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{apiUsage.errorRate}%</div>
                        <div className="text-sm text-muted-foreground">Error Rate</div>
                      </div>
                    </div>

                    <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Usage chart would be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent API Calls */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Recent API Calls</CardTitle>
                    <CardDescription>Latest API requests and responses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentApiCalls.map((call, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Badge variant={call.method === "GET" ? "default" : "secondary"}>
                              {call.method}
                            </Badge>
                            <code className="text-sm">{call.endpoint}</code>
                          </div>
                          <div className="flex items-center space-x-3 text-sm">
                            <Badge variant={call.status === 200 ? "default" : "destructive"}>
                              {call.status}
                            </Badge>
                            <span className="text-muted-foreground">{call.responseTime}</span>
                            <span className="text-muted-foreground">{call.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Endpoint Stats */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Top Endpoints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { endpoint: "/api/models/predict", requests: 15420, percentage: 32 },
                        { endpoint: "/api/portfolio/optimize", requests: 8930, percentage: 19 },
                        { endpoint: "/api/market/sentiment", requests: 7650, percentage: 16 },
                        { endpoint: "/api/risk/assessment", requests: 6780, percentage: 14 },
                        { endpoint: "/api/user/profile", requests: 4320, percentage: 9 }
                      ].map((endpoint, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <code className="text-xs">{endpoint.endpoint}</code>
                            <span>{endpoint.requests.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${endpoint.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Status Codes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { code: "200", description: "Success", count: 47650, color: "bg-green-500" },
                        { code: "400", description: "Bad Request", count: 89, color: "bg-yellow-500" },
                        { code: "429", description: "Rate Limited", count: 45, color: "bg-orange-500" },
                        { code: "500", description: "Server Error", count: 26, color: "bg-red-500" }
                      ].map((status, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                            <span className="text-sm font-mono">{status.code}</span>
                            <span className="text-sm text-muted-foreground">{status.description}</span>
                          </div>
                          <span className="text-sm font-semibold">{status.count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documentation">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>API Documentation</CardTitle>
                    <CardDescription>Complete reference for GeFi API endpoints</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        {
                          title: "Authentication",
                          description: "Learn how to authenticate your API requests",
                          endpoints: ["POST /auth/login", "POST /auth/refresh"],
                          icon: Shield
                        },
                        {
                          title: "AI Models",
                          description: "Access and manage AI financial models",
                          endpoints: ["GET /api/models", "POST /api/models/predict", "GET /api/models/{id}"],
                          icon: Code
                        },
                        {
                          title: "Portfolio Management",
                          description: "Portfolio optimization and analysis endpoints",
                          endpoints: ["GET /api/portfolio", "POST /api/portfolio/optimize", "PUT /api/portfolio/{id}"],
                          icon: BarChart3
                        },
                        {
                          title: "Market Data",
                          description: "Real-time market data and sentiment analysis",
                          endpoints: ["GET /api/market/sentiment", "GET /api/market/data", "GET /api/market/trends"],
                          icon: Activity
                        }
                      ].map((section, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-start space-x-3">
                            <section.icon className="h-6 w-6 text-primary mt-1" />
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{section.title}</h3>
                              <p className="text-sm text-muted-foreground mb-3">{section.description}</p>
                              <div className="space-y-1">
                                {section.endpoints.map((endpoint, idx) => (
                                  <code key={idx} className="block text-xs bg-muted px-2 py-1 rounded">
                                    {endpoint}
                                  </code>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Book className="mr-2 h-4 w-4" />
                        Full Documentation
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Code className="mr-2 h-4 w-4" />
                        Code Examples
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Globe className="mr-2 h-4 w-4" />
                        API Explorer
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Activity className="mr-2 h-4 w-4" />
                        Status Page
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>SDK Downloads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Code className="mr-2 h-4 w-4" />
                        Python SDK
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Code className="mr-2 h-4 w-4" />
                        JavaScript SDK
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Code className="mr-2 h-4 w-4" />
                        Java SDK
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Code className="mr-2 h-4 w-4" />
                        C# SDK
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">API Status</span>
                        <Badge variant="default">Operational</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Response Time</span>
                        <span className="text-sm text-muted-foreground">245ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Uptime</span>
                        <span className="text-sm text-green-600">99.9%</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        Contact Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>API Configuration</CardTitle>
                  <CardDescription>Configure global API settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Base URL</label>
                      <Input value="https://api.gefi.com/v1" readOnly className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Default Rate Limit</label>
                      <Select defaultValue="1000">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">100 requests/min</SelectItem>
                          <SelectItem value="500">500 requests/min</SelectItem>
                          <SelectItem value="1000">1,000 requests/min</SelectItem>
                          <SelectItem value="5000">5,000 requests/min</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Timeout</label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">60 seconds</SelectItem>
                          <SelectItem value="120">120 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">Save Configuration</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Webhooks</CardTitle>
                  <CardDescription>Configure webhook endpoints for events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Model Predictions</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <code className="text-xs text-muted-foreground">
                        https://your-app.com/webhooks/predictions
                      </code>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Portfolio Updates</span>
                        <Badge variant="secondary">Inactive</Badge>
                      </div>
                      <code className="text-xs text-muted-foreground">
                        https://your-app.com/webhooks/portfolio
                      </code>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Webhook
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}