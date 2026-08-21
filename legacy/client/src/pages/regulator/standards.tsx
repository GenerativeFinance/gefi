import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/layout/Layout";
import {
  Search,
  BookOpen,
  Shield,
  Globe,
  FileText,
  Plus,
  Eye,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  Scale,
  Users,
  Gavel
} from "lucide-react";

export default function Standards() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const standards = [
    {
      id: "STD-001",
      title: "AI Model Fairness and Bias Testing Requirements",
      description: "Comprehensive guidelines for testing and mitigating algorithmic bias in AI financial models, including protected class analysis and fairness metrics.",
      category: "Algorithmic Fairness",
      status: "active",
      version: "2.1",
      effectiveDate: "2024-01-15",
      lastUpdated: "2024-12-01",
      compliance: 94,
      adoptionRate: 87,
      jurisdiction: "Global",
      applicableTo: ["AI Model Developers", "Data Scientists"],
      requirements: [
        "Bias testing across protected demographics",
        "Fairness metric calculations (demographic parity, equalized odds)",
        "Documentation of mitigation strategies",
        "Regular re-validation protocols"
      ],
      relatedRegulations: ["EU AI Act", "FTC Algorithmic Accountability Act"]
    },
    {
      id: "STD-002",
      title: "GDPR Compliance for Financial Data Processing",
      description: "Detailed requirements for processing personal financial data in compliance with the General Data Protection Regulation.",
      category: "Data Privacy",
      status: "active",
      version: "3.0",
      effectiveDate: "2023-05-25",
      lastUpdated: "2024-11-15",
      compliance: 96,
      adoptionRate: 92,
      jurisdiction: "European Union",
      applicableTo: ["Data Providers", "AI Model Developers", "Platform Operators"],
      requirements: [
        "Explicit user consent for data processing",
        "Data minimization principles",
        "Right to erasure implementation",
        "Privacy by design architecture",
        "Data protection impact assessments"
      ],
      relatedRegulations: ["GDPR", "ePrivacy Directive"]
    },
    {
      id: "STD-003",
      title: "Model Explainability and Transparency Standards",
      description: "Requirements for AI model interpretability and explanation capabilities in financial decision-making systems.",
      category: "Model Transparency",
      status: "active",
      version: "1.5",
      effectiveDate: "2024-03-01",
      lastUpdated: "2024-10-20",
      compliance: 78,
      adoptionRate: 65,
      jurisdiction: "Global",
      applicableTo: ["AI Model Developers", "Financial Institutions"],
      requirements: [
        "Model decision explanations for individual cases",
        "Feature importance documentation",
        "Model architecture transparency",
        "Adversarial testing protocols"
      ],
      relatedRegulations: ["Basel III", "MiFID II"]
    },
    {
      id: "STD-004",
      title: "Cross-Border Data Transfer Protocols",
      description: "Standards for secure and compliant transfer of financial data across international jurisdictions.",
      category: "International Compliance",
      status: "draft",
      version: "1.0-draft",
      effectiveDate: "2025-03-01",
      lastUpdated: "2025-01-10",
      compliance: null,
      adoptionRate: null,
      jurisdiction: "International",
      applicableTo: ["Data Providers", "Platform Operators"],
      requirements: [
        "Adequacy decision verification",
        "Standard contractual clauses implementation",
        "Data localization requirements",
        "Transfer impact assessments"
      ],
      relatedRegulations: ["GDPR", "CCPA", "PIPEDA"]
    },
    {
      id: "STD-005",
      title: "Cybersecurity Requirements for AI Financial Systems",
      description: "Mandatory cybersecurity standards for AI-powered financial platforms and model deployment environments.",
      category: "Cybersecurity",
      status: "under-review",
      version: "2.0-beta",
      effectiveDate: "2025-06-01",
      lastUpdated: "2024-12-20",
      compliance: null,
      adoptionRate: null,
      jurisdiction: "Global",
      applicableTo: ["Platform Operators", "AI Model Developers", "Data Providers"],
      requirements: [
        "Multi-factor authentication implementation",
        "End-to-end encryption for data in transit",
        "Regular security audits and penetration testing",
        "Incident response procedures"
      ],
      relatedRegulations: ["SOX", "PCI DSS", "ISO 27001"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "draft":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "under-review":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "deprecated":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "draft":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "under-review":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case "deprecated":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredStandards = standards.filter(standard => {
    const matchesSearch = standard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         standard.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         standard.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || standard.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || standard.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(standards.map(s => s.category))];

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Regulatory Standards</h1>
          <p className="text-muted-foreground">
            Manage and maintain regulatory standards, compliance requirements, and industry guidelines
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Standards</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+3 this quarter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Standards</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">39</div>
              <p className="text-xs text-muted-foreground">Currently enforced</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Compliance</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91.2%</div>
              <p className="text-xs text-muted-foreground">Across all standards</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Pending approval</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="standards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="standards">Standards</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Tracking</TabsTrigger>
            <TabsTrigger value="updates">Recent Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="standards" className="space-y-6">
            {/* Filters and Actions */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search standards by title, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Standard
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Regulatory Standard</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="data-privacy">Data Privacy</SelectItem>
                            <SelectItem value="algorithmic-fairness">Algorithmic Fairness</SelectItem>
                            <SelectItem value="model-transparency">Model Transparency</SelectItem>
                            <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                            <SelectItem value="international-compliance">International Compliance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jurisdiction">Jurisdiction</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select jurisdiction" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="global">Global</SelectItem>
                            <SelectItem value="eu">European Union</SelectItem>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="international">International</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Standard Title</Label>
                      <Input id="title" placeholder="Enter standard title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Detailed description of the standard..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requirements">Key Requirements</Label>
                      <Textarea id="requirements" placeholder="List the main requirements (one per line)" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => setIsCreateDialogOpen(false)}>
                      Create Standard
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Standards List */}
            <div className="space-y-4">
              {filteredStandards.map((standard) => (
                <Card key={standard.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{standard.title}</h3>
                          <Badge className={getStatusColor(standard.status)}>
                            {getStatusIcon(standard.status)}
                            <span className="ml-1 capitalize">{standard.status.replace('-', ' ')}</span>
                          </Badge>
                          <Badge variant="outline">
                            v{standard.version}
                          </Badge>
                          <Badge variant="secondary">
                            <Globe className="h-3 w-3 mr-1" />
                            {standard.jurisdiction}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {standard.description}
                        </p>
                        <div className="text-sm text-muted-foreground space-y-1 mb-3">
                          <p><strong>Standard ID:</strong> {standard.id}</p>
                          <p><strong>Category:</strong> {standard.category}</p>
                          <p><strong>Effective Date:</strong> {standard.effectiveDate}</p>
                          <p><strong>Last Updated:</strong> {standard.lastUpdated}</p>
                          <p><strong>Applicable To:</strong> {standard.applicableTo.join(", ")}</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-2">Key Requirements:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {standard.requirements.slice(0, 3).map((req, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                            {standard.requirements.length > 3 && (
                              <li className="text-xs text-muted-foreground ml-5">
                                +{standard.requirements.length - 3} more requirements
                              </li>
                            )}
                          </ul>
                        </div>
                        {standard.relatedRegulations.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium">Related Regulations:</span>
                            {standard.relatedRegulations.map((reg, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Scale className="h-3 w-3 mr-1" />
                                {reg}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3 items-end">
                        {standard.compliance !== null && (
                          <div className="text-right">
                            <div className="text-2xl font-bold">{standard.compliance}%</div>
                            <div className="text-xs text-muted-foreground">Compliance Rate</div>
                            <Progress value={standard.compliance} className="w-20 h-2 mt-1" />
                          </div>
                        )}
                        {standard.adoptionRate !== null && (
                          <div className="text-right">
                            <div className="text-lg font-medium">{standard.adoptionRate}%</div>
                            <div className="text-xs text-muted-foreground">Adoption Rate</div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Compliance Tracking Dashboard</h3>
              <p className="text-muted-foreground mb-4">
                Detailed compliance metrics and tracking analytics will be displayed here
              </p>
              <Button variant="outline">
                View Compliance Reports
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="updates" className="space-y-6">
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Recent Standards Updates</h3>
              <p className="text-muted-foreground mb-4">
                Timeline of recent changes and updates to regulatory standards
              </p>
              <Button variant="outline">
                View Update History
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {filteredStandards.length === 0 && (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No standards found</h3>
            <p className="text-muted-foreground mb-4">
              No regulatory standards match your current search criteria
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
              setStatusFilter("all");
            }}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
}