import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Database,
  Network,
  Key,
  Globe,
  Award,
  Download
} from "lucide-react";

export default function SecurityCompliance() {
  const securityCertifications = [
    {
      name: "SOC 2 Type II",
      description: "Independent audit of security controls and data protection measures",
      status: "Compliant",
      validUntil: "2025-12-31",
      auditFirm: "PwC",
      icon: Shield
    },
    {
      name: "ISO 27001",
      description: "International standard for information security management systems",
      status: "Certified",
      validUntil: "2025-08-15",
      auditFirm: "BSI Group",
      icon: Award
    },
    {
      name: "GDPR Compliant",
      description: "European Union data protection and privacy compliance",
      status: "Compliant",
      validUntil: "Ongoing",
      auditFirm: "Internal Assessment",
      icon: Globe
    },
    {
      name: "CCPA Compliant",
      description: "California Consumer Privacy Act compliance for US users",
      status: "Compliant",
      validUntil: "Ongoing",
      auditFirm: "Internal Assessment",
      icon: Eye
    }
  ];

  const securityFeatures = [
    {
      title: "256-bit SSL Encryption",
      description: "All data transmission protected with bank-grade encryption",
      icon: Lock,
      category: "Data Protection"
    },
    {
      title: "Multi-Factor Authentication",
      description: "Additional security layer for account access",
      icon: Key,
      category: "Access Control"
    },
    {
      title: "Zero Data Retention",
      description: "Personal data deleted after subscription ends",
      icon: Database,
      category: "Data Privacy"
    },
    {
      title: "AI Models Run Locally",
      description: "Your data never leaves our secure infrastructure",
      icon: Network,
      category: "Processing"
    },
    {
      title: "End-to-End Encryption",
      description: "Data encrypted from your device to our servers",
      icon: Shield,
      category: "Communication"
    },
    {
      title: "Regular Security Audits",
      description: "Quarterly penetration testing and vulnerability assessments",
      icon: FileText,
      category: "Monitoring"
    }
  ];

  const complianceFrameworks = [
    {
      framework: "Financial Services",
      standards: ["SEC Regulations", "FINRA Rules", "MiFID II", "Basel III"],
      description: "Compliance with global financial regulations and standards"
    },
    {
      framework: "Data Protection",
      standards: ["GDPR", "CCPA", "PIPEDA", "LGPD"],
      description: "International data privacy and protection compliance"
    },
    {
      framework: "Security Standards",
      standards: ["ISO 27001", "SOC 2", "NIST Framework", "PCI DSS"],
      description: "Industry-leading security management frameworks"
    },
    {
      framework: "AI Ethics",
      standards: ["EU AI Act", "IEEE Standards", "Partnership on AI", "Responsible AI"],
      description: "Ethical AI development and deployment practices"
    }
  ];

  const modelCompliance = [
    {
      modelName: "Risk Assessment Pro",
      developer: "AI Solutions Inc.",
      complianceStatus: "Fully Compliant",
      lastAudit: "2024-12-01",
      certifications: ["SOC 2", "GDPR", "SEC Compliant"],
      riskLevel: "Low"
    },
    {
      modelName: "Portfolio Optimizer",
      developer: "FinTech Innovations",
      complianceStatus: "Compliant",
      lastAudit: "2024-11-15",
      certifications: ["GDPR", "ISO 27001"],
      riskLevel: "Low"
    },
    {
      modelName: "Fraud Detection Engine",
      developer: "SecureInvest Tech",
      complianceStatus: "Under Review",
      lastAudit: "2024-10-20",
      certifications: ["SOC 2", "PCI DSS"],
      riskLevel: "Medium"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Compliant":
      case "Certified":
      case "Fully Compliant":
        return "text-green-600";
      case "Under Review":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Compliant":
      case "Certified":
      case "Fully Compliant":
        return CheckCircle;
      case "Under Review":
        return AlertTriangle;
      default:
        return Shield;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Shield className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold">Security & Compliance</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trust is our priority. We maintain the highest standards of security and compliance 
            to protect your data and investments.
          </p>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-blue-600">256-bit</div>
              <div className="text-sm text-muted-foreground">SSL Encryption</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-muted-foreground">GDPR Compliant</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-purple-600">10,000+</div>
              <div className="text-sm text-muted-foreground">Trusted Users</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Security Information */}
        <Tabs defaultValue="certifications" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="security-features">Security Features</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="model-compliance">Model Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="certifications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityCertifications.map((cert, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <cert.icon className="h-6 w-6 text-blue-600" />
                        <span>{cert.name}</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(cert.status)}>
                        {cert.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{cert.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Valid Until:</span>
                        <span className="font-medium">{cert.validUntil}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Audit Firm:</span>
                        <span className="font-medium">{cert.auditFirm}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security-features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <feature.icon className="h-8 w-8 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                        <Badge variant="secondary">{feature.category}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complianceFrameworks.map((framework, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{framework.framework}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{framework.description}</p>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Standards & Regulations:</div>
                      <div className="flex flex-wrap gap-2">
                        {framework.standards.map((standard, idx) => (
                          <Badge key={idx} variant="outline">{standard}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="model-compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Model Compliance Status</CardTitle>
                <p className="text-muted-foreground">
                  Each AI model undergoes rigorous compliance checks and audits
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modelCompliance.map((model, index) => {
                    const StatusIcon = getStatusIcon(model.complianceStatus);
                    return (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <StatusIcon className={`h-5 w-5 ${getStatusColor(model.complianceStatus)}`} />
                          <div>
                            <div className="font-semibold">{model.modelName}</div>
                            <div className="text-sm text-muted-foreground">by {model.developer}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${getStatusColor(model.complianceStatus)}`}>
                            {model.complianceStatus}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Last audit: {model.lastAudit}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {model.certifications.map((cert, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Trust Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Why Trust GeFi?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Database className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Data Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is encrypted and never shared with third parties
                </p>
              </div>
              <div className="text-center">
                <Network className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Local Processing</h3>
                <p className="text-sm text-muted-foreground">
                  AI models run locally to ensure data privacy
                </p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Enterprise Security</h3>
                <p className="text-sm text-muted-foreground">
                  Bank-grade security with continuous monitoring
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}