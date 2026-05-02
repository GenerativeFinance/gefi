import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Clock, 
  FileText, 
  Eye,
  Search,
  Filter,
  GitBranch,
  Zap,
  Target,
  Building,
  ExternalLink,
  Download,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function CollaborationHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [timeRange, setTimeRange] = useState("90d");

  // Sample collaboration data
  const collaborationOverview = {
    totalProjects: 27,
    activeProjects: 12,
    totalCommunications: 156,
    uniqueContacts: 43,
    avgResponseTime: "3.2 hours",
    collaborationScore: 4.7
  };

  const projectsInvolved = [
    {
      id: 1,
      name: "High-Frequency Trading Algorithm",
      developer: "Alex Chen",
      company: "QuantTech Solutions",
      dataset: "Cryptocurrency Trading Pairs",
      status: "Active",
      launchDate: "2025-06-15",
      contribution: "Real-time price data",
      revenue: 3200,
      lastInteraction: "2025-07-14",
      performance: "Excellent"
    },
    {
      id: 2,
      name: "ESG Risk Assessment Model",
      developer: "Sarah Johnson",
      company: "SustainableAI Corp",
      dataset: "Federal Reserve Economic Data",
      status: "Completed",
      launchDate: "2025-05-20",
      contribution: "Economic indicators",
      revenue: 1850,
      lastInteraction: "2025-07-12",
      performance: "Good"
    },
    {
      id: 3,
      name: "Credit Scoring Enhancement",
      developer: "Mike Rodriguez",
      company: "FinScore Analytics",
      dataset: "S&P 500 Historical Data",
      status: "Active",
      launchDate: "2025-07-01",
      contribution: "Historical market data",
      revenue: 2400,
      lastInteraction: "2025-07-13",
      performance: "Excellent"
    },
    {
      id: 4,
      name: "Bond Yield Predictor",
      developer: "Emma Watson",
      company: "Fixed Income AI",
      dataset: "Corporate Bond Yields",
      status: "Development",
      launchDate: "2025-08-15",
      contribution: "Bond market data",
      revenue: 450,
      lastInteraction: "2025-07-10",
      performance: "Fair"
    },
    {
      id: 5,
      name: "Portfolio Optimization Tool",
      developer: "David Kim",
      company: "InvestSmart Technologies",
      dataset: "S&P 500 Historical Data",
      status: "Active",
      launchDate: "2025-04-30",
      contribution: "Historical performance data",
      revenue: 4200,
      lastInteraction: "2025-07-15",
      performance: "Excellent"
    }
  ];

  const communicationLogs = [
    {
      id: 1,
      date: "2025-07-15",
      time: "14:30",
      contact: "David Kim",
      contactType: "Developer",
      company: "InvestSmart Technologies",
      project: "Portfolio Optimization Tool",
      dataset: "S&P 500 Historical Data",
      type: "Technical Discussion",
      subject: "Data quality enhancement request",
      summary: "Discussed improving dividend adjustment accuracy for better backtesting results. Agreed on implementing enhanced data validation pipeline.",
      status: "Resolved",
      followUp: false
    },
    {
      id: 2,
      date: "2025-07-14",
      time: "09:45",
      contact: "Alex Chen",
      contactType: "Developer",
      company: "QuantTech Solutions",
      project: "High-Frequency Trading Algorithm",
      dataset: "Cryptocurrency Trading Pairs",
      type: "Performance Review",
      subject: "Real-time data latency optimization",
      summary: "Reviewed current latency metrics (avg 12ms). Discussed upgrading to premium WebSocket feeds for sub-5ms latency.",
      status: "Action Required",
      followUp: true
    },
    {
      id: 3,
      date: "2025-07-13",
      time: "16:20",
      contact: "Mike Rodriguez",
      contactType: "Developer",
      company: "FinScore Analytics",
      project: "Credit Scoring Enhancement",
      dataset: "S&P 500 Historical Data",
      type: "Data Request",
      subject: "Additional historical coverage needed",
      summary: "Requested extension of historical data coverage back to 1990. Explained data availability constraints and alternative solutions.",
      status: "In Progress",
      followUp: true
    },
    {
      id: 4,
      date: "2025-07-12",
      time: "11:15",
      contact: "Sarah Johnson",
      contactType: "Developer",
      company: "SustainableAI Corp",
      project: "ESG Risk Assessment Model",
      dataset: "Federal Reserve Economic Data",
      type: "Project Completion",
      subject: "Final model validation and data certification",
      summary: "Completed final validation of ESG risk model. Provided data certification and compliance documentation for production deployment.",
      status: "Completed",
      followUp: false
    },
    {
      id: 5,
      date: "2025-07-10",
      time: "13:45",
      contact: "FCA Compliance Team",
      contactType: "Regulator",
      company: "Financial Conduct Authority",
      project: "Regulatory Review",
      dataset: "Corporate Bond Yields",
      type: "Compliance Audit",
      subject: "MiFID II compliance verification",
      summary: "Responded to FCA inquiry about data sourcing and validation procedures for bond yield data. Provided comprehensive documentation.",
      status: "Under Review",
      followUp: true
    },
    {
      id: 6,
      date: "2025-07-09",
      time: "10:30",
      contact: "Emma Watson",
      contactType: "Developer",
      company: "Fixed Income AI",
      project: "Bond Yield Predictor",
      dataset: "Corporate Bond Yields",
      type: "Data Quality Issue",
      subject: "Inconsistent credit rating classifications",
      summary: "Addressed concerns about credit rating inconsistencies. Implemented standardized rating mapping and provided updated documentation.",
      status: "Resolved",
      followUp: false
    }
  ];

  const recentActivities = [
    {
      type: "Project Launch",
      description: "Credit Scoring Enhancement went live",
      developer: "Mike Rodriguez",
      date: "2025-07-01",
      impact: "High"
    },
    {
      type: "Data Integration",
      description: "New WebSocket feed integrated for crypto data",
      developer: "Alex Chen",
      date: "2025-06-28",
      impact: "Medium"
    },
    {
      type: "Compliance Review",
      description: "Passed FCA audit for MiFID II compliance",
      developer: "Regulatory Team",
      date: "2025-06-25",
      impact: "High"
    },
    {
      type: "Performance Upgrade",
      description: "Latency reduced by 40% for real-time feeds",
      developer: "System Team",
      date: "2025-06-20",
      impact: "High"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Development": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Resolved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Action Required": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "In Progress": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Under Review": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "Excellent": return "text-green-600";
      case "Good": return "text-blue-600";
      case "Fair": return "text-yellow-600";
      case "Poor": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case "Developer": return <GitBranch className="h-4 w-4" />;
      case "Regulator": return <Building className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const filteredLogs = communicationLogs.filter(log => {
    const matchesSearch = log.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || log.contactType.toLowerCase() === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Collaboration History</h1>
            <p className="text-muted-foreground">Track projects using your datasets and communication logs with developers and regulators.</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="180d">Last 6 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Collaboration Overview */}
        <div className="grid gap-6 md:grid-cols-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collaborationOverview.totalProjects}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{collaborationOverview.activeProjects}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Communications</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collaborationOverview.totalCommunications}</div>
              <p className="text-xs text-muted-foreground">Total interactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collaborationOverview.uniqueContacts}</div>
              <p className="text-xs text-muted-foreground">Network size</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collaborationOverview.avgResponseTime}</div>
              <p className="text-xs text-muted-foreground">Average</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collaboration Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{collaborationOverview.collaborationScore}</div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Involved */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>AI Models & Projects</CardTitle>
            <CardDescription>Projects utilizing your datasets with launch dates and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Developer</TableHead>
                  <TableHead>Dataset Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Launch Date</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Last Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectsInvolved.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">{project.contribution}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{project.developer}</div>
                        <div className="text-sm text-muted-foreground">{project.company}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.dataset}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(project.launchDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${project.revenue.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getPerformanceColor(project.performance)}`}>
                        {project.performance}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {new Date(project.lastInteraction).toLocaleDateString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Communication Logs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Communication Logs</CardTitle>
            <CardDescription>Summary of interactions with developers and regulators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search communications by contact, subject, or summary..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Contact type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contacts</SelectItem>
                  <SelectItem value="developer">Developers</SelectItem>
                  <SelectItem value="regulator">Regulators</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {log.contact.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{log.contact}</h4>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getContactTypeIcon(log.contactType)}
                            {log.contactType}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {log.company} • {log.project} • {log.dataset}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(log.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {log.time}
                          </div>
                          <Badge variant="secondary">{log.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                      {log.followUp && (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h3 className="font-medium mb-1">{log.subject}</h3>
                    <p className="text-sm text-muted-foreground">{log.summary}</p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Full
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open Project
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Collaboration Activities</CardTitle>
            <CardDescription>Latest developments and milestones in your collaborations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{activity.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {activity.developer} • {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge className={getImpactColor(activity.impact)}>
                    {activity.impact} Impact
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline">View All Activities</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}