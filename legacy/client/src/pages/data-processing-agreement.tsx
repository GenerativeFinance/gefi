import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, Shield, Lock, FileText, Clock, CheckCircle, Download } from "lucide-react";

export default function DataProcessingAgreement() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <MobileNav />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Database className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">Data Processing Agreement</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive data processing agreement ensures GDPR compliance and protection of your financial data.
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <Badge variant="outline" className="text-sm">
                <Clock className="h-4 w-4 mr-2" />
                Last Updated: January 1, 2025
              </Badge>
              <Badge variant="outline" className="text-sm">
                <FileText className="h-4 w-4 mr-2" />
                Version 3.0
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* DPA Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>1. Introduction and Scope</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  This Data Processing Agreement ("DPA") forms part of the Terms of Service between you ("Data Controller") 
                  and GeFi Technologies, Inc. ("Data Processor") for the processing of Personal Data in accordance with 
                  applicable data protection laws, including the EU General Data Protection Regulation (GDPR).
                </p>
                <p>
                  This DPA applies to all Personal Data processed by GeFi on behalf of the Data Controller in connection 
                  with the AI financial platform services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span>2. Data Processing Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Subject Matter</h4>
                    <p className="text-sm">Processing of Personal Data necessary for providing AI financial analytics services.</p>
                  </div>
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Duration</h4>
                    <p className="text-sm">For the term of the service agreement and retention period as specified herein.</p>
                  </div>
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Nature and Purpose</h4>
                    <p className="text-sm">Portfolio analysis, risk assessment, compliance monitoring, and AI model execution.</p>
                  </div>
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Categories of Data Subjects</h4>
                    <p className="text-sm">Financial professionals, institutional investors, and platform users.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  <span>3. Security Measures</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>GeFi implements appropriate technical and organizational measures including:</p>
                <ul>
                  <li><strong>Encryption:</strong> 256-bit AES encryption for data at rest and TLS 1.3 for data in transit</li>
                  <li><strong>Access Controls:</strong> Role-based access controls with multi-factor authentication</li>
                  <li><strong>Network Security:</strong> Firewall protection, intrusion detection, and monitoring</li>
                  <li><strong>Data Segregation:</strong> Logical separation of customer data using secure enclaves</li>
                  <li><strong>Backup and Recovery:</strong> Encrypted backups with geographical distribution</li>
                  <li><strong>Incident Response:</strong> 24/7 security monitoring with immediate breach notification</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span>4. Data Subject Rights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>GeFi assists the Data Controller in fulfilling data subject rights including:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Right of Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Right to Rectification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Right to Erasure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Right to Restrict Processing</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Right to Data Portability</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Right to Object</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Rights Related to Automated Decision Making</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Right to Lodge a Complaint</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span>5. Data Transfers and Localization</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  Personal Data is processed within the European Economic Area (EEA) and other jurisdictions 
                  that provide adequate protection as determined by the European Commission.
                </p>
                <p>
                  For transfers to third countries, GeFi implements appropriate safeguards including:
                </p>
                <ul>
                  <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                  <li>Adequacy decisions where applicable</li>
                  <li>Binding Corporate Rules for intra-group transfers</li>
                  <li>Additional security measures including data localization where required</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>6. Incident Management and Breach Notification</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  GeFi maintains comprehensive incident response procedures and will:
                </p>
                <ul>
                  <li>Notify the Data Controller without undue delay upon becoming aware of a Personal Data breach</li>
                  <li>Provide all relevant information about the incident within 72 hours</li>
                  <li>Assist in the investigation and remediation of the breach</li>
                  <li>Implement measures to prevent future occurrences</li>
                  <li>Maintain detailed logs of all security incidents</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>7. Audits and Compliance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  GeFi undergoes regular third-party audits and maintains certifications including:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <Badge variant="outline" className="justify-center p-2">SOC 2 Type II</Badge>
                  <Badge variant="outline" className="justify-center p-2">ISO 27001</Badge>
                  <Badge variant="outline" className="justify-center p-2">PCI DSS</Badge>
                  <Badge variant="outline" className="justify-center p-2">GDPR Compliant</Badge>
                </div>
                <p className="mt-4">
                  Data Controllers may request compliance documentation and conduct audits upon reasonable notice.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span>8. Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>For data protection matters, please contact:</p>
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <p><strong>Data Protection Officer:</strong> dpo@gefi.ai</p>
                  <p><strong>Privacy Team:</strong> privacy@gefi.ai</p>
                  <p><strong>Security Team:</strong> security@gefi.ai</p>
                  <p><strong>Address:</strong> GeFi Technologies, Inc., Data Protection Office</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}