import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Target,
  BarChart3,
  Activity,
  RefreshCw,
  Eye,
  Calendar,
  PieChart
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface RiskReport {
  id: number;
  title: string;
  type: "market" | "credit" | "operational" | "liquidity" | "concentration";
  severity: "low" | "medium" | "high" | "critical";
  lastGenerated: string;
  nextScheduled: string;
  description: string;
  metrics: {
    riskScore: number;
    confidence: number;
    exposure: number;
    var: number; // Value at Risk
  };
  trends: {
    direction: "up" | "down" | "stable";
    change: number;
  };
  downloadUrl?: string;
}

interface RiskStats {
  totalReports: number;
  criticalRisks: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  averageRiskScore: number;
  totalExposure: number;
  portfolioVaR: number;
}

export default function RiskReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [dateRange, setDateRange] = useState("last-30-days");

  // Fetch risk reports
  const { data: reports = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/risk/reports"],
  });

  // Sample risk reports data
  const riskReports: RiskReport[] = [
    {
      id: 1,
      title: "Market Risk Assessment - Equity Portfolio",
      type: "market",
      severity: "high",
      lastGenerated: "2024-07-02",
      nextScheduled: "2024-07-03",
      description: "Comprehensive market risk analysis for equity positions with focus on sector concentration and volatility exposure.",
      metrics: {
        riskScore: 78,
        confidence: 92,
        exposure: 15200000,
        var: 485000
      },
      trends: {
        direction: "up",
        change: 12.5
      },
      downloadUrl: "/api/reports/download/market-risk-1"
    },
    {
      id: 2,
      title: "Credit Risk Analysis - Corporate Bonds",
      type: "credit",
      severity: "medium",
      lastGenerated: "2024-07-01",
      nextScheduled: "2024-07-08",
      description: "Credit risk evaluation for corporate bond holdings including default probability and rating migration analysis.",
      metrics: {
        riskScore: 55,
        confidence: 88,
        exposure: 8500000,
        var: 127000
      },
      trends: {
        direction: "down",
        change: -3.2
      },
      downloadUrl: "/api/reports/download/credit-risk-1"
    },
    {
      id: 3,
      title: "Operational Risk Dashboard",
      type: "operational",
      severity: "low",
      lastGenerated: "2024-07-02",
      nextScheduled: "2024-07-09",
      description: "Assessment of operational risks including technology failures, process errors, and human factors.",
      metrics: {
        riskScore: 28,
        confidence: 85,
        exposure: 2100000,
        var: 65000
      },
      trends: {
        direction: "stable",
        change: 0.8
      },
      downloadUrl: "/api/reports/download/operational-risk-1"
    },
    {
      id: 4,
      title: "Liquidity Risk Stress Testing",
      type: "liquidity",
      severity: "critical",
      lastGenerated: "2024-07-02",
      nextScheduled: "2024-07-03",
      description: "Liquidity stress testing under adverse market conditions with funding gap analysis.",
      metrics: {
        riskScore: 89,
        confidence: 95,
        exposure: 25000000,
        var: 890000
      },
      trends: {
        direction: "up",
        change: 18.7
      },
      downloadUrl: "/api/reports/download/liquidity-risk-1"
    },
    {
      id: 5,
      title: "Concentration Risk Analysis",
      type: "concentration",
      severity: "medium",
      lastGenerated: "2024-06-30",
      nextScheduled: "2024-07-07",
      description: "Analysis of portfolio concentration risks across sectors, geographies, and asset classes.",
      metrics: {
        riskScore: 61,
        confidence: 90,
        exposure: 12800000,
        var: 285000
      },
      trends: {
        direction: "down",
        change: -5.1
      },
      downloadUrl: "/api/reports/download/concentration-risk-1"
    },
    {
      id: 6,
      title: "Integrated Risk Dashboard",
      type: "market",
      severity: "high",
      lastGenerated: "2024-07-02",
      nextScheduled: "2024-07-03",
      description: "Comprehensive risk assessment combining market, credit, and operational risk factors.",
      metrics: {
        riskScore: 72,
        confidence: 91,
        exposure: 45000000,
        var: 1200000
      },
      trends: {
        direction: "up",
        change: 8.3
      },
      downloadUrl: "/api/reports/download/integrated-risk-1"
    }
  ];

  const riskStats: RiskStats = {
    totalReports: riskReports.length,
    criticalRisks: riskReports.filter(r => r.severity === "critical").length,
    highRisks: riskReports.filter(r => r.severity === "high").length,
    mediumRisks: riskReports.filter(r => r.severity === "medium").length,
    lowRisks: riskReports.filter(r => r.severity === "low").length,
    averageRiskScore: Math.round(riskReports.reduce((sum, r) => sum + r.metrics.riskScore, 0) / riskReports.length),
    totalExposure: riskReports.reduce((sum, r) => sum + r.metrics.exposure, 0),
    portfolioVaR: riskReports.reduce((sum, r) => sum + r.metrics.var, 0)
  };

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    let filtered = riskReports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === "all" || report.type === selectedType;
      const matchesSeverity = selectedSeverity === "all" || report.severity === selectedSeverity;

      return matchesSearch && matchesType && matchesSeverity;
    });

    return filtered.sort((a, b) => {
      // Sort by severity first (critical > high > medium > low), then by risk score
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      
      return b.metrics.riskScore - a.metrics.riskScore;
    });
  }, [riskReports, searchTerm, selectedType, selectedSeverity]);

  function getSeverityColor(severity: string) {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }

  function getSeverityIcon(severity: string) {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      case "high":
        return <TrendingUp className="h-4 w-4" />;
      case "medium":
        return <Activity className="h-4 w-4" />;
      case "low":
        return <Shield className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  }

  function getTrendIcon(direction: string) {
    switch (direction) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case "stable":
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  }

  function getRiskScoreColor(score: number) {
    if (score >= 80) return "text-red-600";
    if (score >= 60) return "text-orange-600";
    if (score >= 40) return "text-yellow-600";
    return "text-green-600";
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const reportTypes = ["Market", "Credit", "Operational", "Liquidity", "Concentration"];

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Risk Reports</h1>
              <p className="text-muted-foreground">
                Comprehensive risk analysis and monitoring across all portfolio exposures
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => refetch()} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Export All
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6 mb-8">
          <Card className="xl:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">{riskStats.totalReports}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{riskStats.criticalRisks}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                  <p className="text-2xl font-bold text-orange-600">{riskStats.highRisks}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Medium Risk</p>
                  <p className="text-2xl font-bold text-yellow-600">{riskStats.mediumRisks}</p>
                </div>
                <Activity className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Risk</p>
                  <p className="text-2xl font-bold text-green-600">{riskStats.lowRisks}</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="xl:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Portfolio VaR</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(riskStats.portfolioVaR)}</p>
                </div>
                <PieChart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search risk reports, types, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Risk Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {reportTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type} Risk
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Last 7 days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 days</SelectItem>
                    <SelectItem value="last-90-days">Last 90 days</SelectItem>
                    <SelectItem value="last-year">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getSeverityColor(report.severity)} border`}>
                        {getSeverityIcon(report.severity)}
                        <span className="ml-1 capitalize">{report.severity}</span>
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {report.type} Risk
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(report.trends.direction)}
                        <span className={`text-sm font-medium ${
                          report.trends.direction === "up" ? "text-red-500" : 
                          report.trends.direction === "down" ? "text-green-500" : "text-blue-500"
                        }`}>
                          {report.trends.direction === "up" ? "+" : report.trends.direction === "down" ? "" : "±"}
                          {report.trends.change}%
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {report.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Risk Score */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Risk Score</span>
                    <span className={`text-lg font-bold ${getRiskScoreColor(report.metrics.riskScore)}`}>
                      {report.metrics.riskScore}/100
                    </span>
                  </div>
                  <Progress value={report.metrics.riskScore} className="h-2" />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold text-primary">{report.metrics.confidence}%</p>
                    <p className="text-muted-foreground">Confidence</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold">{formatCurrency(report.metrics.exposure)}</p>
                    <p className="text-muted-foreground text-xs">Exposure</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold">{formatCurrency(report.metrics.var)}</p>
                    <p className="text-muted-foreground">VaR</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Generated: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                  <span>Next: {new Date(report.nextScheduled).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No risk reports found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}