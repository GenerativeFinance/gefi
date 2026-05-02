import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Code, Bot, Settings, Database, Upload, Play, BookOpen, Users, GitBranch, FileText, Shield, TrendingUp, 
  Zap, Cloud, Lock, CheckCircle, ArrowRight, ExternalLink, Cpu, BarChart3
} from "lucide-react";
import { useState } from "react";

export default function DeveloperDevelop() {
  const [learningRate, setLearningRate] = useState("0.001");
  const [epochs, setEpochs] = useState("25");
  const [selectedModel, setSelectedModel] = useState("lstm");
  const [selectedObjective, setSelectedObjective] = useState("sharpe");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Development Environment</h1>
            <p className="text-muted-foreground mt-2">
              Build and iterate on AI financial models. Access integrated tools, templates, and collaborative features.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/developer/develop/ide-access">
                <Code className="h-4 w-4 mr-2" />
                Open IDE
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/developer-marketplace">
                <Bot className="h-4 w-4 mr-2" />
                Browse Templates
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" /> 
                Model Templates
              </CardTitle>
              <CardDescription>
                Pre-built PyTorch/TensorFlow templates optimized for financial forecasting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">LSTM</Badge>
                <Badge variant="secondary">Transformer</Badge>
                <Badge variant="secondary">XGBoost</Badge>
                <Badge variant="secondary">Autoencoder</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/developer-marketplace">
                  Explore Templates
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-green-600" /> 
                Integrated IDE
              </CardTitle>
              <CardDescription>
                Full-featured development environment with preloaded libraries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• pandas, numpy, scikit-learn</div>
                <div>• TensorFlow, PyTorch</div>
                <div>• TA-Lib, yfinance</div>
                <div>• GitHub Copilot integration</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/developer/develop/ide-access">
                  Launch IDE
                  <Code className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" /> 
                Testing & Validation
              </CardTitle>
              <CardDescription>
                Comprehensive backtesting with risk analysis and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Historical backtesting</div>
                <div>• Monte Carlo simulations</div>
                <div>• Risk parameter validation</div>
                <div>• Performance benchmarking</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/develop">
                  Start Testing
                  <TrendingUp className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="build" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="build">Model Builder</TabsTrigger>
            <TabsTrigger value="train">Training</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="collab">Collaboration</TabsTrigger>
          </TabsList>

          {/* Model Builder Tab */}
          <TabsContent value="build" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Model Configuration</CardTitle>
                  <CardDescription>
                    Set up your AI model with recommended parameters for financial forecasting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Model Type</label>
                      <select 
                        className="w-full p-2 border rounded-md mt-2"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                      >
                        <option value="lstm">LSTM Time Series</option>
                        <option value="transformer">Transformer Forecasting</option>
                        <option value="xgboost">Gradient Boosting (XGBoost)</option>
                        <option value="autoencoder">Anomaly Detection (Autoencoder)</option>
                        <option value="gan">GAN Synthetic Data</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Optimization Objective</label>
                      <select 
                        className="w-full p-2 border rounded-md mt-2"
                        value={selectedObjective}
                        onChange={(e) => setSelectedObjective(e.target.value)}
                      >
                        <option value="return">Maximize Return</option>
                        <option value="sharpe">Maximize Sharpe Ratio</option>
                        <option value="drawdown">Minimize Max Drawdown</option>
                        <option value="risk">Risk Forecasting</option>
                        <option value="volatility">Volatility Prediction</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Learning Rate</label>
                      <Input 
                        value={learningRate} 
                        onChange={(e) => setLearningRate(e.target.value)}
                        placeholder="0.001"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Training Epochs</label>
                      <Input 
                        value={epochs} 
                        onChange={(e) => setEpochs(e.target.value)}
                        placeholder="25"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/developer/develop/ide-access">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure in IDE
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" /> 
                    Data Sources & Integration
                  </CardTitle>
                  <CardDescription>
                    Connect to financial data providers or upload your own datasets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="justify-start" asChild>
                      <Link href="/market-data">
                        <Database className="h-4 w-4 mr-2" /> 
                        Yahoo Finance Integration
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" /> 
                      Alpha Vantage API
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Upload className="h-4 w-4 mr-2" /> 
                      Upload CSV/JSON Data
                    </Button>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Best Practice:</strong> Establish data cleaning pipelines early to handle gaps and biases common in financial data.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="train" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Training Configuration</CardTitle>
                  <CardDescription>
                    Configure training parameters and execution environment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Execution Environment</label>
                      <select className="w-full p-2 border rounded-md mt-2">
                        <option value="local">Local IDE (CPU)</option>
                        <option value="cloud-gpu">Cloud GPU Instance</option>
                        <option value="distributed">Distributed Training</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Batch Size</label>
                      <Input placeholder="64" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Validation Split</label>
                      <Input placeholder="0.2 (20%)" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Early Stopping Patience</label>
                      <Input placeholder="10" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Model Checkpoint Frequency</label>
                      <Input placeholder="Every 5 epochs" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button className="flex-1" asChild>
                    <Link href="/developer/develop/ide-access">
                      <Play className="h-4 w-4 mr-2" />
                      Start Training
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href="/develop">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Test Model
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    Resource Management
                  </CardTitle>
                  <CardDescription>
                    Monitor and optimize computational resources
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">CPU Usage</span>
                      </div>
                      <span className="text-sm text-green-600">45%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Memory</span>
                      </div>
                      <span className="text-sm text-blue-600">6.2GB / 16GB</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">GPU (Available)</span>
                      </div>
                      <span className="text-sm text-purple-600">Ready</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" /> 
                    Learning Resources
                  </CardTitle>
                  <CardDescription>
                    Tutorials and best practices for AI in finance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>• Time series forecasting with LSTM</div>
                    <div>• Risk assessment using neural networks</div>
                    <div>• Portfolio optimization techniques</div>
                    <div>• Handling financial data biases</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/learning">
                      Open Learning Hub
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" /> 
                    Compliance & Explainability
                  </CardTitle>
                  <CardDescription>
                    GDPR/CCPA compliance and model transparency tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>• SHAP explainability integration</div>
                    <div>• Model audit trail logging</div>
                    <div>• Regulatory reporting templates</div>
                    <div>• Bias detection and mitigation</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/docs">
                      Compliance Guide
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" /> 
                    Data Best Practices
                  </CardTitle>
                  <CardDescription>
                    Guidelines for secure and compliant data handling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>• SQLAlchemy for database integration</div>
                    <div>• AWS S3 for secure data storage</div>
                    <div>• Data versioning with DVC</div>
                    <div>• Zero-data-retention policies</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/docs">
                      Data Guidelines
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Collaboration Tab */}
          <TabsContent value="collab" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5" /> 
                    Version Control
                  </CardTitle>
                  <CardDescription>
                    Manage code versions and collaborate with team members
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <GitBranch className="h-4 w-4" />
                    <span className="text-sm">main branch (up to date)</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last commit: "Add LSTM model template" - 2 hours ago
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href="/developer/develop/version-control">
                      Manage Repos
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href="/developer/develop/code-review">
                      Code Review
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" /> 
                    Team Collaboration
                  </CardTitle>
                  <CardDescription>
                    Work together on model development and research
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Invite Team Members
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/developer/collaboration">
                        <FileText className="h-4 w-4 mr-2" />
                        Project Discussions
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/messaging">
                        <FileText className="h-4 w-4 mr-2" />
                        Team Messaging
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Security & Compliance Features</CardTitle>
                <CardDescription>
                  Built-in security measures for financial model development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span className="text-sm">256-bit SSL Encryption</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">GDPR Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Zero Data Retention</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}