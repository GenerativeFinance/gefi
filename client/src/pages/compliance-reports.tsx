import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Download, 
  Calendar, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Clock,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Eye,
  Filter
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface ComplianceReport {
  id: number;
  title: string;
  type: string;
  status: "compliant" | "warning" | "violation";
  lastGenerated: string;
  nextDue: string;
  description: string;
  regulations: string[];
  coverage: number;
  findings: number;
  riskLevel: "low" | "medium" | "high";
  downloadUrl?: string;
}

interface ComplianceStats {
  totalReports: number;
  compliantReports: number;
  warningReports: number;
  violationReports: number;
  complianceRate: number;
  overdueReports: number;
}

export default function ComplianceReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState("last-30-days");

  // Fetch compliance reports
  const { data: reports = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/compliance/reports"],
  });

  // Sample compliance reports data
  const complianceReports: ComplianceReport[] = [
    {
      id: 1,
      title: "Basel III Capital Adequacy Report",
      type: "Banking Regulation",
      status: "compliant",
      lastGenerated: "2024-07-01",
      nextDue: "2024-07-31",
      description: "Comprehensive assessment of capital adequacy ratios and risk-weighted assets according to Basel III framework.",
      regulations: ["Basel III", "CRD V", "CRR"],
      coverage: 98,
      findings: 0,
      riskLevel: "low",
      downloadUrl: "/api/reports/download/basel-iii-1"
    },
    {
      id: 2,
      title: "MiFID II Transaction Reporting",
      type: "Securities Regulation",
      status: "compliant",
      lastGenerated: "2024-07-02",
      nextDue: "2024-07-03",
      description: "Daily transaction reporting compliance for MiFID II regulatory requirements.",
      regulations: ["MiFID II", "RTS 22", "RTS 23"],
      coverage: 100,
      findings: 0,
      riskLevel: "low",
      downloadUrl: "/api/reports/download/mifid-ii-1"
    },
    {
      id: 3,
      title: "GDPR Data Protection Assessment",
      type: "Data Privacy",
      status: "warning",
      lastGenerated: "2024-06-28",
      nextDue: "2024-07-15",
      description: "Quarterly assessment of data protection measures and privacy compliance.",
      regulations: ["GDPR", "Data Protection Act"],
      coverage: 85,
      findings: 3,
      riskLevel: "medium",
      downloadUrl: "/api/reports/download/gdpr-1"
    },
    {
      id: 4,
      title: "SOX Internal Controls Report",
      type: "Financial Reporting",
      status: "compliant",
      lastGenerated: "2024-06-30",
      nextDue: "2024-09-30",
      description: "Sarbanes-Oxley compliance assessment of internal financial controls and procedures.",
      regulations: ["SOX", "SEC Rules"],
      coverage: 95,
      findings: 1,
      riskLevel: "low",
      downloadUrl: "/api/reports/download/sox-1"
    },
    {
      id: 5,
      title: "AML/KYC Compliance Review",
      type: "Financial Crime",
      status: "violation",
      lastGenerated: "2024-07-01",
      nextDue: "2024-07-08",
      description: "Anti-Money Laundering and Know Your Customer compliance assessment with identified violations requiring immediate attention.",
      regulations: ["AML Directive", "KYC Requirements"],
      coverage: 75,
      findings: 8,
      riskLevel: "high",
      downloadUrl: "/api/reports/download/aml-1"
    },
    {
      id: 6,
      title: "IFRS Financial Reporting Standards",
      type: "Accounting Standards",
      status: "compliant",
      lastGenerated: "2024-06-29",
      nextDue: "2024-12-31",
      description: "International Financial Reporting Standards compliance for financial statements and disclosures.",
      regulations: ["IFRS 9", "IFRS 15", "IFRS 16"],
      coverage: 92,
      findings: 2,
      riskLevel: "low",
      downloadUrl: "/api/reports/download/ifrs-1"
    }
  ];

  const complianceStats: ComplianceStats = {
    totalReports: complianceReports.length,
    compliantReports: complianceReports.filter(r => r.status === "compliant").length,
    warningReports: complianceReports.filter(r => r.status === "warning").length,
    violationReports: complianceReports.filter(r => r.status === "violation").length,
    complianceRate: Math.round((complianceReports.filter(r => r.status === "compliant").length / complianceReports.length) * 100),
    overdueReports: complianceReports.filter(r => new Date(r.nextDue) < new Date()).length
  };

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    let filtered = complianceReports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.regulations.some(reg => reg.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === "all" || report.type === selectedType;
      const matchesStatus = selectedStatus === "all" || report.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });

    return filtered.sort((a, b) => new Date(b.lastGenerated).getTime() - new Date(a.lastGenerated).getTime());
  }, [complianceReports, searchTerm, selectedType, selectedStatus]);

  function getStatusColor(status: string) {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-700 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "violation":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "violation":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  }

  function getRiskLevelColor(riskLevel: string) {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "high":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  const reportTypes = Array.from(new Set(complianceReports.map(r => r.type)));

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
              <h1 className="text-3xl font-bold mb-2">Compliance Reports</h1>
              <p className="text-muted-foreground">
                Monitor regulatory compliance across all financial operations and requirements
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">{complianceStats.totalReports}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliant</p>
                  <p className="text-2xl font-bold text-green-600">{complianceStats.compliantReports}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-600">{complianceStats.warningReports}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Violations</p>
                  <p className="text-2xl font-bold text-red-600">{complianceStats.violationReports}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                  <p className="text-2xl font-bold text-primary">{complianceStats.complianceRate}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-orange-600">{complianceStats.overdueReports}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
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
                  placeholder="Search reports, regulations, or types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {reportTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="violation">Violation</SelectItem>
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
                      <Badge className={`${getStatusColor(report.status)} border`}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1 capitalize">{report.status}</span>
                      </Badge>
                      <Badge variant="outline" className={getRiskLevelColor(report.riskLevel)}>
                        {report.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {report.type} • {report.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Regulations */}
                <div>
                  <p className="text-sm font-medium mb-2">Regulations:</p>
                  <div className="flex flex-wrap gap-1">
                    {report.regulations.map((regulation) => (
                      <Badge key={regulation} variant="secondary" className="text-xs">
                        {regulation}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{report.coverage}%</p>
                    <p className="text-muted-foreground">Coverage</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{report.findings}</p>
                    <p className="text-muted-foreground">Findings</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-bold">{new Date(report.nextDue).toLocaleDateString()}</p>
                    <p className="text-muted-foreground">Next Due</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Last Generated: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                  <span>Next Due: {new Date(report.nextDue).toLocaleDateString()}</span>
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
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No compliance reports found</h3>
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