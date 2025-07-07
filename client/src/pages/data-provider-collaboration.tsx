import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  MessageSquare,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Shield,
  FileText,
  Eye
} from "lucide-react";

export default function DataProviderCollaboration() {
  // Sample collaboration data
  const collaborations = [
    {
      id: 1,
      partnerName: "FinTech Analytics Corp",
      type: "Data Integration",
      status: "active",
      startDate: "2024-03-15",
      datasets: ["Market Data APIs", "Risk Indicators"],
      collaborators: 8,
      lastActivity: "2 hours ago",
      complianceStatus: "compliant",
      revenue: 125000
    },
    {
      id: 2,
      partnerName: "AI Trading Solutions",
      type: "Model Development",
      status: "pending",
      startDate: "2024-12-01",
      datasets: ["Historical Price Data", "Volume Analysis"],
      collaborators: 5,
      lastActivity: "1 day ago",
      complianceStatus: "under_review",
      revenue: 85000
    },
    {
      id: 3,
      partnerName: "RegTech Compliance Ltd",
      type: "Compliance Partnership",
      status: "active",
      startDate: "2024-06-10",
      datasets: ["Regulatory Data", "Audit Trails"],
      collaborators: 12,
      lastActivity: "30 minutes ago",
      complianceStatus: "compliant",
      revenue: 95000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "pending": return "secondary";
      case "completed": return "outline";
      default: return "destructive";
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "compliant": return "default";
      case "under_review": return "secondary";
      case "non_compliant": return "destructive";
      default: return "outline";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Collaboration Management</h1>
            <p className="text-muted-foreground">
              Manage partnerships, collaborations, and data sharing agreements
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Collaboration
          </Button>
        </div>

        {/* Collaboration Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Partnerships</p>
                  <p className="text-2xl font-bold">
                    {collaborations.filter(c => c.status === "active").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Collaborators</p>
                  <p className="text-2xl font-bold">
                    {collaborations.reduce((sum, c) => sum + c.collaborators, 0)}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((collaborations.filter(c => c.complianceStatus === "compliant").length / collaborations.length) * 100)}%
                  </p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ${collaborations.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Input
              placeholder="Search collaborations..."
              className="w-64"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Collaborations List */}
        <div className="space-y-6">
          {collaborations.map((collaboration) => (
            <Card key={collaboration.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/api/placeholder/48/48`} />
                      <AvatarFallback>
                        {collaboration.partnerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{collaboration.partnerName}</CardTitle>
                      <CardDescription>{collaboration.type}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(collaboration.status)}>
                      {collaboration.status}
                    </Badge>
                    <Badge variant={getComplianceColor(collaboration.complianceStatus)}>
                      {collaboration.complianceStatus === "compliant" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : collaboration.complianceStatus === "under_review" ? (
                        <Clock className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {collaboration.complianceStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{new Date(collaboration.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Collaborators</p>
                    <p className="font-medium">{collaboration.collaborators} users</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="font-medium">${collaboration.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Activity</p>
                    <p className="font-medium">{collaboration.lastActivity}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Shared Datasets</p>
                  <div className="flex flex-wrap gap-2">
                    {collaboration.datasets.map((dataset, index) => (
                      <Badge key={index} variant="outline">
                        {dataset}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule Meeting
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Shield className="h-4 w-4 mr-1" />
                      Compliance
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Audit Trail
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common collaboration management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-16 flex-col space-y-2">
                <Plus className="h-5 w-5" />
                <span>Start New Partnership</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col space-y-2">
                <Shield className="h-5 w-5" />
                <span>Review Compliance</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col space-y-2">
                <FileText className="h-5 w-5" />
                <span>Generate Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}