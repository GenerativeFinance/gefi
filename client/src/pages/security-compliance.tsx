import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Database, Award, CheckCircle, FileText, Globe, Users, Monitor } from "lucide-react";

export default function SecurityCompliance() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <MobileNav />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Shield className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">Security & Compliance</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade security measures and compliance certifications protecting your financial data.
            </p>
            <div className="flex justify-center space-x-2 mt-6 flex-wrap gap-2">
              <Badge variant="default" className="text-sm">
                <Shield className="h-4 w-4 mr-2" />
                SOC 2 Type II
              </Badge>
              <Badge variant="default" className="text-sm">
                <Lock className="h-4 w-4 mr-2" />
                ISO 27001
              </Badge>
              <Badge variant="default" className="text-sm">
                <Database className="h-4 w-4 mr-2" />
                PCI DSS Level 1
              </Badge>
              <Badge variant="default" className="text-sm">
                <Award className="h-4 w-4 mr-2" />
                GDPR Compliant
              </Badge>
            </div>
          </div>

          {/* Security Framework Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Data Encryption</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">256-bit AES encryption at rest, TLS 1.3 in transit</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Access Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Multi-factor authentication, role-based permissions</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Monitor className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">24/7 Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Real-time threat detection and incident response</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Globe className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Global Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">GDPR, CCPA, PIPEDA, and regional requirements</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Compliance Information */}
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span>SOC 2 Type II Compliance</span>
                </CardTitle>
                <CardDescription>
                  Annual third-party audit ensuring the highest standards of security controls.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Security Principles:</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Security: Logical and physical access controls</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Availability: System performance monitoring</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Processing Integrity: Data accuracy assurance</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Confidentiality: Information protection</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Audit Coverage:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Infrastructure security controls</li>
                      <li>• Data center physical security</li>
                      <li>• Network security architecture</li>
                      <li>• Employee background checks</li>
                      <li>• Incident response procedures</li>
                      <li>• Change management processes</li>
                    </ul>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Request SOC 2 Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>ISO 27001 Certification</span>
                </CardTitle>
                <CardDescription>
                  International standard for information security management systems.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Our ISO 27001 certification demonstrates our commitment to implementing a comprehensive 
                  Information Security Management System (ISMS) that includes:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-secondary/20 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <h5 className="font-semibold text-sm">Risk Management</h5>
                    <p className="text-xs text-muted-foreground">Continuous risk assessment and mitigation</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/20 rounded-lg">
                    <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <h5 className="font-semibold text-sm">Staff Training</h5>
                    <p className="text-xs text-muted-foreground">Regular security awareness programs</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/20 rounded-lg">
                    <Monitor className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <h5 className="font-semibold text-sm">Continuous Monitoring</h5>
                    <p className="text-xs text-muted-foreground">24/7 security operations center</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span>Technical Security Measures</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Encryption & Data Protection</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-green-600" />
                        <span>AES-256 encryption for data at rest</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-green-600" />
                        <span>TLS 1.3 for data in transit</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-green-600" />
                        <span>End-to-end encryption for sensitive data</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-green-600" />
                        <span>Hardware Security Modules (HSMs)</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Infrastructure Security</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span>Multi-layer firewall protection</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span>Intrusion detection and prevention</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span>Distributed denial-of-service protection</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span>Secure cloud infrastructure (AWS/Azure)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span>Global Data Protection Compliance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-secondary/20 rounded-lg">
                    <Badge variant="outline" className="mb-2">GDPR</Badge>
                    <p className="text-xs">European Union General Data Protection Regulation</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/20 rounded-lg">
                    <Badge variant="outline" className="mb-2">CCPA</Badge>
                    <p className="text-xs">California Consumer Privacy Act</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/20 rounded-lg">
                    <Badge variant="outline" className="mb-2">PIPEDA</Badge>
                    <p className="text-xs">Personal Information Protection and Electronic Documents Act</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/20 rounded-lg">
                    <Badge variant="outline" className="mb-2">LGPD</Badge>
                    <p className="text-xs">Lei Geral de Proteção de Dados (Brazil)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5 text-blue-600" />
                  <span>Incident Response & Business Continuity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Incident Response</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• 24/7 Security Operations Center (SOC)</li>
                      <li>• Mean time to detection: &lt; 15 minutes</li>
                      <li>• Mean time to response: &lt; 1 hour</li>
                      <li>• Automated threat containment</li>
                      <li>• Forensic investigation capabilities</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Business Continuity</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• 99.9% uptime SLA guarantee</li>
                      <li>• Multi-region data redundancy</li>
                      <li>• Automated failover mechanisms</li>
                      <li>• Regular disaster recovery testing</li>
                      <li>• RTO: &lt; 4 hours, RPO: &lt; 1 hour</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Compliance Documentation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Access our comprehensive compliance documentation and audit reports.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Security Whitepaper
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Request Compliance Documentation
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    View Certification Summaries
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Penetration Test Results
                  </Button>
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