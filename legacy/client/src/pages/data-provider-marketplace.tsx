import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Database, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Star, 
  Search,
  Filter,
  Download,
  BarChart3,
  Globe,
  Eye,
  Heart,
  Zap,
  Shield,
  ArrowUpRight
} from "lucide-react";

export default function DataProviderMarketplace() {
  const partnerModels = [
    {
      id: 1,
      name: "Portfolio Risk Analyzer",
      developer: "QuantTech Solutions",
      category: "Risk Assessment",
      dataUsage: "S&P 500 Historical Data",
      revenue: "$12,450",
      subscribers: 234,
      accuracy: 94.2,
      status: "Active",
      description: "Advanced portfolio risk analysis using your market data",
      monthlyRevenue: 3200,
      growthRate: 15.2
    },
    {
      id: 2,
      name: "Sentiment Trading Bot",
      developer: "AI Capital",
      category: "Trading Strategy",
      dataUsage: "Market Sentiment Data",
      revenue: "$8,750",
      subscribers: 156,
      accuracy: 87.5,
      status: "Active",
      description: "Automated trading based on sentiment analysis data",
      monthlyRevenue: 2100,
      growthRate: 22.8
    },
    {
      id: 3,
      name: "Crypto Volatility Predictor",
      developer: "BlockChain Analytics",
      category: "Market Prediction",
      dataUsage: "Crypto Historical Data",
      revenue: "$15,680",
      subscribers: 312,
      accuracy: 91.8,
      status: "Active",
      description: "Predicts cryptocurrency volatility patterns",
      monthlyRevenue: 4200,
      growthRate: 18.5
    }
  ];

  const datasetOpportunities = [
    {
      id: 1,
      name: "Real-time Options Flow Data",
      demand: "High",
      potentialRevenue: "$25,000/month",
      interestedDevelopers: 45,
      category: "Derivatives",
      urgency: "Urgent",
      description: "Live options trading data for institutional strategies"
    },
    {
      id: 2,
      name: "ESG Scoring Dataset",
      demand: "Medium",
      potentialRevenue: "$18,000/month",
      interestedDevelopers: 28,
      category: "Sustainability",
      urgency: "Medium",
      description: "Environmental, Social, and Governance scoring data"
    },
    {
      id: 3,
      name: "Alternative Credit Data",
      demand: "High",
      potentialRevenue: "$32,000/month",
      interestedDevelopers: 67,
      category: "Credit Risk",
      urgency: "High",
      description: "Non-traditional credit assessment data sources"
    }
  ];

  const collaborationRequests = [
    {
      id: 1,
      developer: "Neural Finance",
      model: "Deep Learning Credit Scorer",
      dataNeeded: "Transaction History Data",
      proposedSplit: "70/30",
      status: "Pending",
      potentialRevenue: "$45,000",
      timeline: "3 months"
    },
    {
      id: 2,
      developer: "Quantum Trading",
      model: "Multi-Asset Momentum",
      dataNeeded: "Cross-Market Data",
      proposedSplit: "60/40",
      status: "In Review",
      potentialRevenue: "$28,000",
      timeline: "2 months"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Data Provider AI Marketplace
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Monetize your datasets through AI model partnerships and collaborations
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Shield className="w-4 h-4 mr-1" />
                  Verified Provider
                </Badge>
                <Button>
                  <Database className="w-4 h-4 mr-2" />
                  Add Dataset
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">$47,280</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">+18.2% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Models</p>
                    <p className="text-2xl font-bold text-blue-600">24</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Using your datasets</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Subscribers</p>
                    <p className="text-2xl font-bold text-purple-600">1,847</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">+12.5% this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Quality Score</p>
                    <p className="text-2xl font-bold text-yellow-600">96.8</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Industry leading</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="partnerships" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="partnerships">Model Partnerships</TabsTrigger>
              <TabsTrigger value="opportunities">Data Opportunities</TabsTrigger>
              <TabsTrigger value="collaborations">Collaboration Requests</TabsTrigger>
              <TabsTrigger value="analytics">Revenue Analytics</TabsTrigger>
            </TabsList>

            {/* Model Partnerships Tab */}
            <TabsContent value="partnerships" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">AI Models Using Your Data</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Search models..." className="pl-10 w-64" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="risk">Risk Assessment</SelectItem>
                      <SelectItem value="trading">Trading Strategy</SelectItem>
                      <SelectItem value="prediction">Market Prediction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {partnerModels.map((model) => (
                  <Card key={model.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <Badge variant={model.status === 'Active' ? 'default' : 'secondary'}>
                          {model.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        by {model.developer}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {model.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Usage</p>
                          <p className="text-sm font-semibold">{model.dataUsage}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                          <p className="text-sm font-semibold text-green-600">${model.monthlyRevenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Subscribers</p>
                          <p className="text-sm font-semibold">{model.subscribers}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Growth Rate</p>
                          <p className="text-sm font-semibold text-green-600">+{model.growthRate}%</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">{model.accuracy}% Accuracy</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            Optimize
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Data Opportunities Tab */}
            <TabsContent value="opportunities" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">High-Demand Data Opportunities</h2>
                <Button>
                  <Database className="w-4 h-4 mr-2" />
                  Submit Data Proposal
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {datasetOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{opportunity.name}</CardTitle>
                        <Badge variant={opportunity.urgency === 'Urgent' ? 'destructive' : 
                                       opportunity.urgency === 'High' ? 'default' : 'secondary'}>
                          {opportunity.urgency}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {opportunity.category}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {opportunity.description}
                      </p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Demand Level</span>
                          <Badge variant={opportunity.demand === 'High' ? 'default' : 'secondary'}>
                            {opportunity.demand}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Potential Revenue</span>
                          <span className="text-sm font-semibold text-green-600">{opportunity.potentialRevenue}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Interested Developers</span>
                          <span className="text-sm font-semibold">{opportunity.interestedDevelopers}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button className="flex-1">
                          <Heart className="w-4 h-4 mr-1" />
                          Express Interest
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Collaboration Requests Tab */}
            <TabsContent value="collaborations" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Partnership Requests</h2>
                <Badge variant="outline">{collaborationRequests.length} Active Requests</Badge>
              </div>

              <div className="space-y-4">
                {collaborationRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{request.model}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">by {request.developer}</p>
                        </div>
                        <Badge variant={request.status === 'Pending' ? 'default' : 'secondary'}>
                          {request.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Needed</p>
                          <p className="text-sm font-semibold">{request.dataNeeded}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue Split</p>
                          <p className="text-sm font-semibold">{request.proposedSplit}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Potential Revenue</p>
                          <p className="text-sm font-semibold text-green-600">{request.potentialRevenue}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Timeline</p>
                          <p className="text-sm font-semibold">{request.timeline}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Review Details
                        </Button>
                        <Button>
                          Accept Partnership
                        </Button>
                        <Button variant="ghost">
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Revenue Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Revenue Analytics & Insights</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export Report
                  </Button>
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Last 30 days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Dataset</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">S&P 500 Historical Data</span>
                        <span className="text-sm font-semibold text-green-600">$18,450</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Market Sentiment Data</span>
                        <span className="text-sm font-semibold text-green-600">$15,230</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '51%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Crypto Historical Data</span>
                        <span className="text-sm font-semibold text-green-600">$13,600</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '46%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Models</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {partnerModels.slice(0, 3).map((model, index) => (
                        <div key={model.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{model.name}</p>
                              <p className="text-xs text-gray-500">{model.developer}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-green-600">${model.monthlyRevenue.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">+{model.growthRate}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Best Performing</p>
                      <p className="text-lg font-bold text-green-600">Portfolio Risk Analyzer</p>
                      <p className="text-xs text-gray-500">94.2% accuracy, 234 subscribers</p>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fastest Growing</p>
                      <p className="text-lg font-bold text-blue-600">Sentiment Trading Bot</p>
                      <p className="text-xs text-gray-500">+22.8% growth this month</p>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Most Popular</p>
                      <p className="text-lg font-bold text-purple-600">Crypto Volatility Predictor</p>
                      <p className="text-xs text-gray-500">312 active subscribers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}