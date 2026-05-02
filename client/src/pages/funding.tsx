import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Link } from "wouter";
import { 
  TrendingUp, 
  DollarSign, 
  Target,
  BarChart3,
  Brain,
  CircleDollarSign,
  Trophy,
  Users,
  Calendar,
  Search,
  Filter,
  Plus
} from "lucide-react";

export default function Funding() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("trending");



  const { data: modelFundingRequests = [], isLoading: modelLoading } = useQuery({
    queryKey: ["/api/model-funding/requests"],
  });

  const { data: bountyFundingRequests = [], isLoading: bountyLoading } = useQuery({
    queryKey: ["/api/bounty-funding/requests"],
  });

  // Calculate totals for dashboard
  const totalModelFunding = Array.isArray(modelFundingRequests) 
    ? modelFundingRequests.reduce((sum: number, req: any) => sum + parseFloat(req.fundingRaised || 0), 0)
    : 0;

  const totalBountyFunding = Array.isArray(bountyFundingRequests) 
    ? bountyFundingRequests.reduce((sum: number, req: any) => sum + parseFloat(req.fundingRaised || 0), 0)
    : 0;

  const totalFunding = totalModelFunding + totalBountyFunding;

  const activeModels = Array.isArray(modelFundingRequests) 
    ? modelFundingRequests.filter((req: any) => req.status === "open").length : 0;
  const activeBounties = Array.isArray(bountyFundingRequests) 
    ? bountyFundingRequests.filter((req: any) => req.status === "open").length : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Funding Hub</h1>
            <p className="text-muted-foreground">Support and fund AI financial innovations</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="ai-model-funding">
              <Brain className="h-4 w-4 mr-2" />
              AI Model Funding
            </TabsTrigger>
            <TabsTrigger value="bounty-funding">
              <Target className="h-4 w-4 mr-2" />
              Bounty Funding
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalFunding)}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeModels + activeBounties}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeModels} models, {activeBounties} bounties
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">
                    Projects reaching funding goals
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contributors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">
                    Active funding participants
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Model Funding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Raised</span>
                      <span className="font-medium">{formatCurrency(totalModelFunding)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Models</span>
                      <span className="font-medium">{activeModels}</span>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/model-funding">View Model Funding</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Bounty Funding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Raised</span>
                      <span className="font-medium">{formatCurrency(totalBountyFunding)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Bounties</span>
                      <span className="font-medium">{activeBounties}</span>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/bounty-funding">View Bounty Funding</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>



          {/* AI Model Funding Tab */}
          <TabsContent value="ai-model-funding" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">AI Model Funding</h2>
              <Button asChild>
                <Link href="/model-funding">
                  <Plus className="h-4 w-4 mr-2" />
                  View Full Page
                </Link>
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Fund AI Models</h3>
                  <p className="text-muted-foreground mb-4">
                    Invest in cutting-edge AI financial models and share in their revenue potential.
                  </p>
                  <Button asChild>
                    <Link href="/model-funding">Explore Model Funding</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bounty Funding Tab */}
          <TabsContent value="bounty-funding" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Bounty Funding</h2>
              <Button asChild>
                <Link href="/bounty-funding">
                  <Plus className="h-4 w-4 mr-2" />
                  View Full Page
                </Link>
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Fund Bounties</h3>
                  <p className="text-muted-foreground mb-4">
                    Support specific development challenges and contribute to innovation rewards.
                  </p>
                  <Button asChild>
                    <Link href="/bounty-funding">Explore Bounty Funding</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}