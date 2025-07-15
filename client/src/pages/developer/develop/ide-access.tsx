import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Monitor, Server, Settings, Play, GitBranch, Terminal, Cloud } from "lucide-react";

export default function IDEAccess() {
  const environments = [
    {
      name: "Python Development",
      status: "active",
      type: "Jupyter Lab",
      specs: "4 vCPU, 16GB RAM",
      uptime: "2h 45m",
      url: "https://jupyter.gefi.dev/user/dev-123"
    },
    {
      name: "R Analytics",
      status: "active", 
      type: "RStudio Server",
      specs: "2 vCPU, 8GB RAM",
      uptime: "1h 22m",
      url: "https://rstudio.gefi.dev/user/dev-123"
    },
    {
      name: "Node.js API",
      status: "stopped",
      type: "VS Code Server",
      specs: "2 vCPU, 4GB RAM",
      uptime: "0m",
      url: "https://vscode.gefi.dev/user/dev-123"
    }
  ];

  const templates = [
    {
      name: "Financial ML Pipeline",
      description: "Complete machine learning pipeline for financial data analysis",
      language: "Python",
      libraries: ["pandas", "scikit-learn", "pytorch", "numpy"],
      difficulty: "Intermediate"
    },
    {
      name: "Risk Assessment Model",
      description: "Risk analysis and VaR calculation framework",
      language: "R",
      libraries: ["quantmod", "PerformanceAnalytics", "tidyverse"],
      difficulty: "Advanced"
    },
    {
      name: "Trading Algorithm",
      description: "Algorithmic trading system with backtesting capabilities",
      language: "Python",
      libraries: ["zipline", "backtrader", "ta-lib", "yfinance"],
      difficulty: "Expert"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">IDE Access</h1>
            <p className="text-muted-foreground mt-2">
              Access cloud-based development environments for AI model development
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Play className="h-4 w-4 mr-2" />
              Launch New Environment
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="environments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="environments">Active Environments</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="environments" className="space-y-6">
            <div className="grid gap-4">
              {environments.map((env, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{env.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{env.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={env.status === "active" ? "default" : "secondary"}>
                          {env.status}
                        </Badge>
                        {env.status === "active" && (
                          <Button size="sm">
                            <Monitor className="h-4 w-4 mr-2" />
                            Open IDE
                          </Button>
                        )}
                        {env.status === "stopped" && (
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Server className="h-4 w-4" />
                        <span>{env.specs}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Monitor className="h-4 w-4" />
                        <span>Uptime: {env.uptime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Cloud className="h-4 w-4" />
                        <span>Cloud Instance</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid gap-4">
              {templates.map((template, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{template.difficulty}</Badge>
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Launch
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Code className="h-4 w-4" />
                        <span>{template.language}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Libraries:</span>
                        <div className="flex gap-1">
                          {template.libraries.slice(0, 3).map((lib, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {lib}
                            </Badge>
                          ))}
                          {template.libraries.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.libraries.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Resource Usage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>65%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory</span>
                      <span>8.2GB / 16GB</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: "51%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage</span>
                      <span>45GB / 100GB</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: "45%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <GitBranch className="h-4 w-4 mr-2" />
                    Create New Branch
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Code className="h-4 w-4 mr-2" />
                    Open Terminal
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Run Tests
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Environment Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Environment Configuration</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure your development environment preferences
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Environment</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Jupyter Lab (Python)</option>
                    <option>RStudio Server (R)</option>
                    <option>VS Code Server (Node.js)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto-save Interval</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>30 seconds</option>
                    <option>1 minute</option>
                    <option>5 minutes</option>
                    <option>Disabled</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Dark</option>
                    <option>Light</option>
                    <option>Auto</option>
                  </select>
                </div>
                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}